"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [nameChecking, setNameChecking] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const dbRef = db;
    if (!dbRef) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setNameAvailable(null);
      setNameChecking(false);
      return;
    }

    let cancelled = false;
    setNameChecking(true);

    const timeout = setTimeout(async () => {
      try {
        const nameLower = trimmed.toLowerCase();
        const ref = doc(dbRef, "usernames", nameLower);
        const snap = await getDoc(ref);

        if (!cancelled) {
          setNameAvailable(!snap.exists());
        }
      } catch (err) {
        console.error("Error checking name:", err);
        if (!cancelled) setNameAvailable(null);
      } finally {
        if (!cancelled) setNameChecking(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [name]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    // Check gamer name availability
    if (nameAvailable === false) {
      setError("This gamer name is already taken. Please choose another.");
      setLoading(false);
      return;
    }

    if (nameAvailable === null && name.trim()) {
      setError("Still checking name availability... Please wait a moment.");
      setLoading(false);
      return;
    }

    try {
      if (!auth) {
        throw new Error("Authentication service not available. Please try again later.");
      }

      if (!db) {
        throw new Error("Database service not available. Please try again later.");
      }

      console.log("Creating user...");
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      console.log("User created:", userCredential.user.uid);

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });
      
      console.log("Profile updated");

      // Store user data in Firestore (NO displayNameLower)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email.toLowerCase().trim(),
        displayName: name.trim(),
        role: "user",
        createdAt: new Date().toISOString(),
        photoURL: null,
        isAdmin: false,
      });
      
      console.log("Firestore document created");

      setEmail("");
      setName("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/");
      }, 100);

    } catch (err: unknown) {
      console.error("Signup error:", err);
      
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        if (errorMessage.includes("email-already-in-use")) {
          setError("This email is already registered. Please use a different email or sign in.");
        } else if (errorMessage.includes("weak-password")) {
          setError("Password is too weak. Please use a stronger password.");
        } else if (errorMessage.includes("invalid-email")) {
          setError("Invalid email address. Please enter a valid email.");
        } else if (errorMessage.includes("network-request-failed")) {
          setError("Network error. Please check your internet connection.");
        } else if (errorMessage.includes("auth/internal-error")) {
          setError("Server error. Please try again later.");
        } else if (errorMessage.includes("auth/too-many-requests")) {
          setError("Too many attempts. Please try again later.");
        } else {
          setError(`Signup failed: ${errorMessage}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gwc-black">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gwc-gray rounded-2xl mb-4 border border-gwc-light-gray">
              <div className="relative w-16 h-16 mx-auto">
                <Image
                  src="/gwc_icon.png"
                  alt="GWC"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">JOIN GWC</h1>
            <p className="text-gray-400">Create your account</p>
          </div>

          {/* Signup Form */}
          <form
            onSubmit={handleSignup}
            className="bg-gwc-gray p-8 rounded-2xl border border-gwc-light-gray space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fadeIn">
                <p className="font-medium">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Gamers Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your unique gamers name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              {/* Name availability feedback */}
              {nameChecking && (
                <p className="text-sm text-gray-400">Checking availability...</p>
              )}
              {nameAvailable === true && !nameChecking && name.trim() && (
                <p className="text-sm text-green-400">✓ This gamer name is available!</p>
              )}
              {nameAvailable === false && !nameChecking && (
                <p className="text-sm text-red-400">✗ This gamer name is already taken.</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gwc-red text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#c10500] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  CREATING ACCOUNT...
                </span>
              ) : (
                "Join The Collective"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gwc-light-gray">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gwc-red font-bold hover:text-[#c10500] transition-colors"
                >
                  SIGN IN
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}