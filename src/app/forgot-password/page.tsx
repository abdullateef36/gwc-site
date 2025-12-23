"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");

		try {
			if (!auth) throw new Error("Authentication service unavailable");

			// Send the password reset link back to our app's /reset-password route
			const actionCodeSettings = {
				url: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : "/reset-password",
				handleCodeInApp: true,
			};

			await sendPasswordResetEmail(auth, email, actionCodeSettings);
			setMessage("Password reset email sent. Check your inbox or spam.");
		} catch (err: unknown) {
			if (err instanceof Error) {
				if (err.message.includes("user-not-found")) {
					setError("No user found with that email address.");
				} else if (err.message.includes("invalid-email")) {
					setError("Please enter a valid email address.");
				} else {
					setError("Failed to send reset email. Please try again later.");
				}
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
						<h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
						<p className="text-gray-400">Enter your email to receive reset instructions</p>
					</div>

					<form onSubmit={handleSubmit} className="bg-gwc-gray p-8 rounded-2xl border border-gwc-light-gray space-y-6">
						{error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
						{message && <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg">{message}</div>}

						<div className="space-y-2">
							<label className="text-sm font-semibold text-gray-300 block">Email Address</label>
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

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-gwc-red text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#c10500] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{loading ? "SENDING..." : "SEND RESET EMAIL"}
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
