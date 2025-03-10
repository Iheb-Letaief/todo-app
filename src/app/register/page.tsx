"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const onSubmit = async (data: any) => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            const responseData = await response.json();
            if (response.ok) {
                setMessage("✅ Account created successfully! Redirecting...");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setMessage(`❌ ${responseData.message || "Signup failed."}`);
            }
        } catch (error) {
            setMessage("❌ An error occurred. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
                <p className="text-center text-sm text-gray-600">
                    Create an account to manage your tasks.
                </p>

                {message && <p className="text-center text-sm text-gray-700">{message}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <input
                            {...register("name")}
                            placeholder="Full Name"
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.name?.message}</p>
                    </div>

                    {/* Email Input */}
                    <div>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Email"
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.email?.message}</p>
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Password"
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.password?.message}</p>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
                    </div>

                    {/* Submit Button */}
                    <button type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                    >

                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {/* Links */}
                <div className="text-center">
                    <a href="/login" className="text-sm text-blue-500 transition hover:text-blue-700">
                        Already have an account? Login
                    </a>
                </div>
            </div>
        </div>
    );
}
