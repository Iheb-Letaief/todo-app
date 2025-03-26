'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconTrash, IconUserShield, IconLoader } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import LogoutButton from "@/components/LogoutButton";
import {useSession} from "next-auth/react";

type User = {
    _id: string;
    email: string;
    role: 'admin' | 'user';
};

export default function AdminDashboard() {
    const { t } = useTranslation();
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    const { data: session } = useSession();
    const token = session?.token;

    useEffect(() => {

        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    setError(t('admin.fetchError'));
                    return;
                }

                const data = await res.json();
                setUsers(data.users || []);
            } catch (err) {
                setError(t('admin.fetchError'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (window !== undefined) {
            fetchUsers();
        }

    }, [token]);

    const handleDeleteUser = async (userId: string) => {
        const confirmDelete = confirm(t('admin.deleteConfirm'));
        if (!confirmDelete) return;

        setDeletingUserId(userId);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                alert(t('admin.deleteError'));
                return;
            }

            setUsers((prev) => prev.filter((user) => user._id !== userId));
        } catch (err) {
            alert(t('admin.deleteError'));
            console.error(err);
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title d-flex align-items-center gap-2">
                                <IconUserShield className="icon" /> {t('auth.admin.dashboard')}
                            </h1>
                            <div className="card-actions">
                                <LogoutButton />
                            </div>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <IconLoader className="icon animate-spin" />
                                    {t('auth.admin.loading')}
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            ) : users.length === 0 ? (
                                <div className="empty">
                                    <p className="empty-title">{t('auth.admin.noUsers')}</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-vcenter">
                                        <thead>
                                        <tr>
                                            <th>{t('auth.admin.email')}</th>
                                            <th>{t('auth.admin.role')}</th>
                                            <th className="text-end">{t('auth.admin.actions')}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user.email}</td>
                                                <td className="text-capitalize">{user.role}</td>
                                                <td className="text-end">
                                                    {user.role !== 'admin' ? (
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            disabled={deletingUserId === user._id}
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            <IconTrash className="icon" />
                                                            {deletingUserId === user._id ?
                                                                t('auth.admin.deleting') :
                                                                t('auth.admin.delete')}
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted">
                                                                {t('auth.admin.cannotDeleteAdmin')}
                                                            </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}