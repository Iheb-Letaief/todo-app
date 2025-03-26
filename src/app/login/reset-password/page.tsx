"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {useTranslation} from "react-i18next";
import Link from "next/link";

const ResetPassword = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
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
                setMessage(t('auth.resetPassword.successMessage'));
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setMessage(`${data.message || t('auth.resetPassword.errorMessage')}`);
            }
        } catch (error) {
            setMessage(t('auth.resetPassword.errorMessage'));
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
                                <h2 className="h2 text-center mb-4">
                                    {t('auth.resetPassword.title')}
                                </h2>

                                {message && (
                                    <div className="alert alert-info" role="alert">
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={loading}
                                        >
                                            {loading ? t('auth.resetPassword.loading') : t('auth.resetPassword.submitButton')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="text-center text-muted mt-3">
                            <Link href="/login" className="text-primary">
                                {t('auth.resetPassword.loginLink')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
