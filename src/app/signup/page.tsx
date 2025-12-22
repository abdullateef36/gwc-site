"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
  const router = useRouter();

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

    try {
      if (!auth || !db) {
        setError("Service unavailable. Please try again.");
        setLoading(false);
        return;
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Store user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: name,
        role: "user", // Default role
        createdAt: new Date().toISOString(),
        photoURL: null, // Profile photo can be added later
      });

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("email-already-in-use")) {
          setError("Email already in use");
        } else if (err.message.includes("weak-password")) {
          setError("Password is too weak");
        } else if (err.message.includes("invalid-email")) {
          setError("Invalid email address");
        } else {
          setError(err.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    setLoading(false);
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
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500"
                  required
                />
              </div>
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
                  className="w-full pl-12 pr-4 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500"
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
                  className="w-full pl-12 pr-12 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
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
                  className="w-full pl-12 pr-12 py-3.5 bg-gwc-black border-2 border-gwc-light-gray rounded-lg focus:border-gwc-red focus:outline-none transition-colors text-white placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
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
                "JOIN GWC"
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