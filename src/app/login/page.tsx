"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

// Validation Schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data: any) => {
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, data);
            const { token } = response.data;
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('userId', response.data.user.id.toString());
            console.log(response.data.user.role);
            if(response.data.user.role === 'admin') {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            setErrorMessage("Invalid email or password");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>

                {errorMessage && (
                    <p className="text-center text-red-500">{errorMessage}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-md border text-gray-950 placeholder-gray-400 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-md border text-gray-950 placeholder-gray-400 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password?.message}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-md bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Links */}
                <div className="text-center">
                    <p className="text-sm text-gray-500">Don't have an account?
                        <Link
                            href="/register"
                            className="ml-1 text-sm text-blue-500 transition hover:text-blue-700"
                        >
                            Sign up
                        </Link>
                    </p>

                    <br />
                    <Link
                        href="/login/forgot-password"
                        className="text-sm text-blue-500 transition hover:text-blue-700"
                    >
                        Forgot password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
