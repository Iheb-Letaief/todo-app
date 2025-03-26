'use client';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { getSession, signIn } from "next-auth/react";
import '../i18n';

export default function Login() {
    const { t } = useTranslation();
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

    const onSubmit = async (data: { email: string; password: string; }) => {
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
                router.replace(session?.user?.role === 'admin' ? "/admin" : "/dashboard");
            }
        } catch (error) {
            setErrorMessage(t('auth.login.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-tight">
                    <div className="row pt-32 align-items-center justify-content-center">
                        <div className="card card-md">
                            <div className="card-body">
                                <h2 className="h2 text-center mb-4">{t('auth.login.title')}</h2>

                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label className="form-label">{t('auth.login.email')}</label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            className="form-control"
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback d-block">{errors.email.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">{t('auth.login.password')}</label>
                                        <input
                                            {...register("password")}
                                            type="password"
                                            className="form-control"
                                            placeholder={t('auth.register.passwordPlaceholder')}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback d-block">{errors.password.message}</div>
                                        )}
                                    </div>

                                    <div className="form-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={loading}
                                        >
                                            {loading ? t('auth.login.loading') : t('auth.login.submit')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                    <div className="text-center text-muted mt-3">
                        {t('auth.login.noAccount')}{' '}
                        <Link href="/register" className="text-primary">
                            {t('auth.login.signUp')}
                        </Link>
                    </div>

                    <div className="text-center mt-2">
                        <Link href="/login/forgot-password" className="text-primary">
                            {t('auth.login.forgotPassword')}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}