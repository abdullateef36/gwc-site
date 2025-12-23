"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import Image from "next/image";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // If there's an oobCode, verify it to get the email (and ensure code is valid)
    if (!oobCode) return;

    let mounted = true;
    (async () => {
      try {
        if (!auth) throw new Error("Authentication unavailable");
        const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
        if (mounted) setEmail(emailFromCode || null);
      } catch (err: unknown) {
        if (err instanceof Error) setError("Invalid or expired password reset link.");
        else setError("Invalid reset link.");
      }
    })();

    return () => { mounted = false; };
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!oobCode) {
      setError("No reset code found. Please request a new password reset.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (!auth) throw new Error("Authentication unavailable");
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password has been reset. You can now sign in.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("weak-password")) setError("Password is too weak.");
        else if (err.message.includes("expired-action-code") || err.message.includes("invalid-action-code")) setError("Reset link expired or invalid.");
        else setError("Failed to reset password. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gwc-black">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gwc-gray rounded-2xl mb-4 border border-gwc-light-gray">
              <div className="relative w-16 h-16 mx-auto">
                <Image src="/gwc_icon.png" alt="GWC" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
            <p className="text-gray-400">{email ? `Resetting password for ${email}` : "Follow the instructions to set a new password."}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gwc-gray p-8 rounded-2xl border border-gwc-light-gray space-y-6">
            {error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
            {message && <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg">{message}</div>}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gwc-red text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#c10500] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "SETTING..." : "SET NEW PASSWORD"}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gwc-light-gray">
              <p className="text-gray-400">
                Remembered your password? <a onClick={() => router.push('/login')} className="text-gwc-red font-bold hover:text-[#c10500] cursor-pointer">Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
