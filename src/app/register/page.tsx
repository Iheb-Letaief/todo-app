"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import {useTranslation} from "react-i18next";
import Link from "next/link";
import axios from "axios";

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
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
                {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            setMessage(t('auth.register.successMessage'));
            setTimeout(() => router.push("/login"), 3000);


        } catch (error) {
            setMessage(t('auth.register.errorMessage'));
        }

        setLoading(false);
    };

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-tight">
                    <div className="row pt-32 align-items-center justify-content-center">
                        <div className="card card-md">
                            <div className="card-body">
                                <h2 className="h2 text-center mb-4">{t('auth.register.title')}</h2>
                                <p className="text-center text-muted mb-4">{t('auth.register.subtitle')}</p>

                                {message && (
                                    <div className="alert alert-info" role="alert">
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label className="form-label">{t('auth.register.namePlaceholder')}</label>
                                        <input
                                            {...register("name")}
                                            className="form-control"
                                            placeholder={t('auth.register.namePlaceholder')}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">
                                                {errors.name.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">{t('auth.register.emailPlaceholder')}</label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            className="form-control"
                                            placeholder={t('auth.register.emailPlaceholder')}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback d-block">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">{t('auth.register.passwordPlaceholder')}</label>
                                        <input
                                            {...register("password")}
                                            type="password"
                                            className="form-control"
                                            placeholder={t('auth.register.passwordPlaceholder')}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback d-block">
                                                {errors.password.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">{t('auth.register.confirmPasswordPlaceholder')}</label>
                                        <input
                                            {...register("confirmPassword")}
                                            type="password"
                                            className="form-control"
                                            placeholder={t('auth.register.confirmPasswordPlaceholder')}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback d-block">
                                                {errors.confirmPassword.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={loading}
                                        >
                                            {loading ? t('auth.register.loading') : t('auth.register.submitButton')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="text-center text-muted mt-3">
                            <Link href="/login" className="text-primary">
                                {t('auth.register.loginLink')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
