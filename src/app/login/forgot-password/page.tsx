"use client";

import React, { useState } from "react";
import {useTranslation} from "react-i18next";
import Link from "next/link";

const ForgotPassword = () => {
    const { t } = useTranslation();
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
                setMessage(t('auth.forgotPassword.successMessage'));
            } else {
                setMessage(`${data.message || t('auth.forgotPassword.errorMessage')}`);
            }
        } catch (error) {
            setMessage(t('auth.forgotPassword.errorMessage'));
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
                                <h2 className="h2 text-center mb-4">{t('auth.forgotPassword.title')}</h2>

                                <p className="text-muted text-center mb-4">{t('auth.forgotPassword.subtitle')}</p>

                                {message && (
                                    <div className="alert alert-info" role="alert">
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder={t('auth.forgotPassword.emailPlaceholder')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={loading}
                                        >
                                            {loading ? t('auth.forgotPassword.loading') : t('auth.forgotPassword.submitButton')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="text-center text-muted mt-3">
                            <Link href="/login" className="text-primary">
                                {t('auth.forgotPassword.loginLink')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
