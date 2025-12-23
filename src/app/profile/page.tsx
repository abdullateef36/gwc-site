"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { auth } from "@/lib/firebase";
import { updateProfile, signOut as firebaseSignOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { uploadImage } from "@/lib/cloudinary";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setName(user.displayName || "");
      setPhotoUrl(user.photoURL || null);
    }
  }, [user, loading, router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please choose an image first.");
    try {
      console.log("handleUpload clicked", selectedFile);
      setUploading(true);
      const uploadedUrl = await uploadImage(selectedFile);
      setPhotoUrl(uploadedUrl);
      // keep a cached preview showing the uploaded image
      setPreviewUrl(uploadedUrl);

      // Persist to Firebase profile so other clients (and auth user) see it
      try {
        if (auth && auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: uploadedUrl });
        }
      } catch (err) {
        console.warn("Failed to update Firebase profile photoURL:", err);
      }

      // Update cached localStorage userData used elsewhere (navbar fallback)
      try {
        const existing = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
        const parsed = existing ? JSON.parse(existing) : {};
        const newData = {
          ...(parsed || {}),
          photoURL: uploadedUrl,
          displayName: parsed?.displayName || name || (auth?.currentUser?.displayName || ""),
          email: parsed?.email || auth?.currentUser?.email || "",
        };
        localStorage.setItem("userData", JSON.stringify(newData));
      } catch {}

      alert("Image uploaded successfully.");
    } catch (err) {
      console.error("Upload error:", err);
      const message = err instanceof Error ? err.message : String(err);
      alert(`Failed to upload image: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth || !auth.currentUser) return alert("No authenticated user.");

    const confirmed = confirm("Delete your account? This is irreversible.");
    if (!confirmed) return;

    try {
      // If user signed in with password, prompt to re-enter password for recent auth
      const providers = auth.currentUser.providerData || [];
      const hasPasswordProvider = providers.some((p) => p?.providerId === "password");

      if (hasPasswordProvider) {
        const email = auth.currentUser.email || "";
        const pw = prompt("Please enter your password to confirm account deletion:");
        if (!pw) return alert("Password required to delete account.");
        const credential = EmailAuthProvider.credential(email, pw);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      await deleteUser(auth.currentUser);
      localStorage.removeItem("authUser");
      localStorage.removeItem("userData");
      localStorage.removeItem("displayName");
      alert("Account deleted.");
      router.push("/");
    } catch (err: unknown) {
      console.error("Delete account error:", err);
      // handle Firebase error codes if present
      const code = (err && typeof err === "object" && "code" in err) ? (err as { code?: string }).code : undefined;
      if (code === "auth/requires-recent-login") {
        alert("You must sign in again before deleting your account. Please sign out and sign in, then try again.");
      } else {
        const m = err instanceof Error ? err.message : String(err);
        alert(`Failed to delete account: ${m}`);
      }
    }
  };

  const handleSave = async () => {
    if (!auth || !auth.currentUser) return alert("No authenticated user.");
    try {
      setSaving(true);
      await updateProfile(auth.currentUser, {
        displayName: name || undefined,
        photoURL: photoUrl || null,
      });

      // Update localStorage values used elsewhere in the app for instant UI
      try {
        localStorage.setItem("displayName", name || "");
        const userData = {
          displayName: name || "",
          email: auth.currentUser.email || "",
          photoURL: photoUrl || null,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
      } catch {
        // ignore localStorage errors
      }

      alert("Profile updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!auth || !auth.currentUser) return alert("No authenticated user.");
    if (!currentPassword || !newPassword) return alert("Please enter your current and new password.");
    if (newPassword !== confirmPassword) return alert("New password and confirmation do not match.");
    if (newPassword.length < 6) return alert("New password must be at least 6 characters.");

    try {
      setChangingPassword(true);
      const email = auth.currentUser.email || "";
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      alert("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Change password error:", err);
      const code = (err && typeof err === "object" && "code" in err) ? (err as { code?: string }).code : undefined;
      if (code === "auth/wrong-password") {
        alert("Current password is incorrect.");
      } else if (code === "auth/requires-recent-login") {
        alert("Please sign out and sign in again to change your password.");
      } else {
        const m = err instanceof Error ? err.message : String(err);
        alert(`Failed to change password: ${m}`);
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (!auth) return;
      await firebaseSignOut(auth);
      localStorage.removeItem("authUser");
      localStorage.removeItem("userData");
      localStorage.removeItem("displayName");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to sign out.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="flex items-center gap-6 mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Change profile image"
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-gwc-red flex items-center justify-center bg-gray-800 cursor-pointer"
          >
            {previewUrl ? (
              // previewUrl might be an object URL (blob:) or an uploaded remote URL
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="avatar" className="object-cover w-full h-full" />
            ) : photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="avatar" className="object-cover w-full h-full" />
            ) : user?.displayName ? (
              <span className="text-white font-bold">
                {user.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </span>
            ) : (
              <span className="text-white font-bold">GWC</span>
            )}
          </div>

        <div>
          <p className="font-semibold">{user?.email}</p>
          <p className="text-sm text-gray-400">Change your profile image and display name here.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border border-gray-800 py-2 px-3 rounded"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Image</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-4 rounded border border-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer"
            >
              Choose Image
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="bg-gwc-red py-2 px-4 rounded text-white disabled:opacity-50 hover:bg-[#c10500] active:scale-95 transition-transform cursor-pointer"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            {/* Remove Photo button intentionally removed per request */}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving} className="bg-gwc-red py-2 px-4 rounded text-white disabled:opacity-50 hover:opacity-90 cursor-pointer">
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button type="button" onClick={handleSignOut} className="py-2 px-4 rounded border border-gray-800 text-gray-200 hover:opacity-90 cursor-pointer">
            Sign Out
          </button>
          <button type="button" onClick={handleDeleteAccount} className="ml-2 py-2 px-4 rounded border border-red-600 text-red-600 hover:bg-red-50 cursor-pointer">
            Delete Account
          </button>
        </div>
      </div>
        
        <div className="mt-6 border-t border-gray-800 pt-4">
          <h2 className="font-semibold mb-2">Change Password</h2>
          <p className="text-sm text-gray-400 mb-3">Use this to change your password (email/password accounts only).</p>
          <div className="space-y-2 max-w-sm">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-800 py-2 px-3 rounded"
            />
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-800 py-2 px-3 rounded"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-800 py-2 px-3 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="bg-gwc-red py-2 px-4 rounded text-white disabled:opacity-50 hover:opacity-90 cursor-pointer"
                type="button"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
