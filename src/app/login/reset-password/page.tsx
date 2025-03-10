"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Get the token from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, newPassword: password }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Password reset successfully! Redirecting...");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setMessage(`❌ ${data.message || "Something went wrong."}`);
            }
        } catch (error) {
            setMessage("❌ An error occurred. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Reset Password
                </h2>

                {message && (
                    <p className="text-center text-sm text-gray-700">{message}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password Input */}
                    <div>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md border text-gray-950 placeholder-gray-400 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-md border text-gray-950 placeholder-gray-400 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md cursor-pointer bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
