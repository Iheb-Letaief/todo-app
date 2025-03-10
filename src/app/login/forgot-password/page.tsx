"use client";

import React, { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Password reset email sent! Check your inbox.");
            } else {
                setMessage(`❌ ${data.message || "Failed to send email."}`);
            }
        } catch (error) {
            setMessage("❌ An error occurred. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-2xl  font-bold text-center text-gray-950">
                    Forgot Password
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Enter your email to receive a password reset link.
                </p>

                {message && <p className="text-center text-sm text-gray-700">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-md bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="text-center">
                    <a
                        href="/login"
                        className="text-sm text-blue-500 transition hover:text-blue-700"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
