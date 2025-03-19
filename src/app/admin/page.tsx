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
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl text-gray-950 font-bold mb-6 flex items-center gap-2">
                <IconUserShield size={28} /> {t('auth.admin.dashboard')}
            </h1>
            <LogoutButton />

            {loading ? (
                <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                    <IconLoader className="animate-spin" size={20} />
                    {t('auth.admin.loading')}
                </div>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600">{t('auth.admin.noUsers')}</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-3">{t('auth.admin.email')}</th>
                            <th className="px-4 py-3">{t('auth.admin.role')}</th>
                            <th className="px-4 py-3 text-right">{t('auth.admin.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t border-gray-200">
                                <td className="px-4 py-3 text-gray-900">{user.email}</td>
                                <td className="px-4 py-3 text-gray-900 capitalize">{user.role}</td>
                                <td className="px-4 py-3 text-right">
                                    {user.role !== 'admin' ? (
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={deletingUserId === user._id}
                                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                                        >
                                            <IconTrash size={16} />
                                            {deletingUserId === user._id ? t('auth.admin.deleting') : t('auth.admin.delete')}
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm">{t('auth.admin.cannotDeleteAdmin')}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}