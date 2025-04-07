'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconTrash, IconUserShield, IconLoader } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import LogoutButton from "@/components/LogoutButton";
import {useSession} from "next-auth/react";
import axios from "axios";

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const { data: session } = useSession();
    const token = session?.token;

    useEffect(() => {

        if (session === undefined) {
            return; // Wait for session to resolve
        }

        if(!token){
            router.push('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(res.data.users || []);
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
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers((prev) => prev.filter((user) => user._id !== userId));
        } catch (err) {
            alert(t('admin.deleteError'));
            console.error(err);
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            setDeletingUserId(userToDelete._id);
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userToDelete._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setUsers((prev) => prev.filter((user) => user._id !== userToDelete._id));
        } catch (err) {
            alert(t('admin.deleteError'));
            console.error(err);
        } finally {
            setDeletingUserId(null);
            setShowDeleteModal(false);
            setUserToDelete(null);
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
                                                <td>
                                                    <span className={`text-white badge ${user.role === 'admin' ? 'bg-yellow' : 'bg-blue'}`}>
                                                        {user.role}
                                                    </span>

                                                </td>
                                                <td className="text-end">
                                                    {user.role !== 'admin' ? (
                                                        <button
                                                            onClick={() => handleDeleteClick(user)}
                                                            disabled={deletingUserId === user._id}
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            <IconTrash className="icon" />
                                                            {deletingUserId === user._id
                                                                ? t('auth.admin.deleting')
                                                                : t('auth.admin.delete')}
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
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowDeleteModal(false)}
                            ></button>
                            <div className="modal-status bg-danger"></div>
                            <div className="modal-body text-center py-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon mb-2 text-danger icon-lg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 9v2m0 4v.01" />
                                    <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                                </svg>
                                <h3>{t('auth.admin.deleteConfirm')}</h3>

                            </div>
                            <div className="modal-footer">
                                <div className="w-100">
                                    <div className="row">
                                        <div className="col">
                                            <button
                                                className="btn w-100"
                                                onClick={() => setShowDeleteModal(false)}
                                            >
                                                {t('auth.admin.cancel')}
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-danger w-100"
                                                onClick={handleConfirmDelete}
                                                disabled={!!deletingUserId}
                                            >
                                                {deletingUserId ? (
                                                    <IconLoader className="animate-spin" />
                                                ) : (
                                                    t('auth.admin.delete')
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}