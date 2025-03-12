"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import {useTranslation} from "react-i18next";

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
    const { t }= useTranslation();
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
                setMessage(t('auth.register.successMessage'));
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setMessage(`❌ ${responseData.message || t('auth.register.errorMessage')}`);
            }
        } catch (error) {
            setMessage(t('auth.register.errorMessage'));
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
                <p className="text-center text-sm text-gray-600">{t('auth.register.subtitle')}</p>


                {message && <p className="text-center text-sm text-gray-700">{message}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <input
                            {...register("name")}
                            placeholder={t('auth.register.namePlaceholder')}
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.name?.message}</p>
                    </div>

                    {/* Email Input */}
                    <div>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder={t('auth.register.emailPlaceholder')}
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.email?.message}</p>
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder={t('auth.register.passwordPlaceholder')}
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.password?.message}</p>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder={t('auth.register.confirmPasswordPlaceholder')}
                            className="w-full placeholder-gray-400 text-gray-950 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
                    </div>

                    {/* Submit Button */}
                    <button type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                    >

                        {loading ? t('auth.register.loading') : t('auth.register.submitButton')}
                    </button>
                </form>

                {/* Links */}
                <div className="text-center">
                    <a href="/login" className="text-sm text-blue-500 transition hover:text-blue-700">
                        {t('auth.register.loginLink')}
                    </a>
                </div>
            </div>
        </div>
    );
}
