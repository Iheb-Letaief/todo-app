"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import {getSession, signIn } from "next-auth/react";
import '../i18n';

export default function Login() {
    const { t, i18n } = useTranslation();

    const schema = yup.object().shape({
        email: yup
            .string()
            .email(t('validation.email.invalid'))
            .required(t('validation.email.required')),
        password: yup
            .string()
            .min(6, t('validation.password.min'))
            .required(t('validation.password.required')),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data: {
        email: string;
        password: string;
    }) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });


            if (result?.error) {
                setErrorMessage(t('auth.login.error'));
            } else {
                const session = await getSession();
                if (session?.user?.id) {
                    sessionStorage.setItem('userId', session.user.id);
                }

                if (session?.user?.role === 'admin') {
                    router.replace("/admin");
                } else {
                    router.replace("/dashboard");
                }

            }
        } catch (error) {
            setErrorMessage(t('auth.login.error'));
        } finally {
            setLoading(false);
        }
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <button
                    onClick={toggleLanguage}
                    className="absolute top-4 right-4 px-3 py-1 rounded bg-gray-400 hover:bg-gray-600"
                >
                    {i18n.language === 'en' ? 'FR' : 'EN'}
                </button>

                <h1 className="text-2xl font-bold text-center text-gray-900">
                    {t('auth.login.title')}
                </h1>

                {errorMessage && (
                    <p className="text-center text-red-500">{errorMessage}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder={t('auth.login.email')}
                            className="w-full rounded-md border text-gray-950 placeholder-gray-400 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
                    </div>

                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder={t('auth.login.password')}
                            className="w-full rounded-md border text-gray-950 placeholder-gray-400 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password?.message}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-md bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? t('auth.login.loading') : t('auth.login.submit')}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        {t('auth.login.noAccount')}
                        <Link
                            href="/register"
                            className="ml-1 text-sm text-blue-500 transition hover:text-blue-700"
                        >
                            {t('auth.login.signUp')}
                        </Link>
                    </p>

                    <br />
                    <Link
                        href="/login/forgot-password"
                        className="text-sm text-blue-500 transition hover:text-blue-700"
                    >
                        {t('auth.login.forgotPassword')}
                    </Link>
                </div>
            </div>
        </div>
    );
}