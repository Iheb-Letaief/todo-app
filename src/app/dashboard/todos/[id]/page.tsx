'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
    IconChevronLeft,
    IconPlus,
    IconTrash,
    IconCheck,
    IconX,
    IconEdit,
} from '@tabler/icons-react';
import {useSession} from "next-auth/react";

type Task = {
    _id: string;
    title: string;
    completed: boolean;
};

type SharedUser = {
    _id: string;
    userId: string;
    email?: string;
    canEdit: boolean;
};

export default function TodoDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const [shareEmail, setShareEmail] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [canUserEdit, setCanUserEdit] = useState(false);
    const [sharedUsers, setSharedUsers] = useState<{ email: string; canEdit: boolean }[]>([]);

    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login');
        }
    });
    const token = session?.token;

    useEffect(() => {
        const fetchTodo = async () => {
            if (status === 'loading' || !session.token) {
                return;
            }

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    router.push('/dashboard');
                    return;
                }

                const data = await res.json();
                setTitle(data.title);
                setTasks(data.tasks || []);

                if (data.userId.toString() === userId) {
                    setCanUserEdit(true);
                } else {
                    setCanUserEdit(data.sharedWith.some((user: any) => user.userId === userId && user.canEdit));
                }
            } catch (err) {
                console.error('Failed to fetch todo list:', err);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            fetchTodo();
        }
    }, [id, session, status, userId, router]);

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/tasks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTaskTitle }),
            });

            const data = await res.json();
            if (res.ok) {
                const newTask = data.tasks[data.tasks.length - 1];
                setTasks((prev) => [...prev, newTask]);
                setNewTaskTitle('');
            } else {
                console.error('Failed to add task:', data);
            }
        } catch (err) {
            console.error('Error adding task:', err);
        }
    };

    const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !currentStatus }),
        });

        setTasks((prev) =>
            prev.map((task) =>
                task._id === taskId ? { ...task, completed: !currentStatus } : task
            )
        );
    };

    const handleDeleteTask = async (taskId: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        setTasks((prev) => prev.filter((task) => task._id !== taskId));
    };

    const incompleteTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    useEffect(() => {
        const fetchSharedUsers = async () => {
            try {

                if(status === 'loading' || !session.token) {
                    return;
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.sharedWith.map((u: any) => ({
                        email: u.email,
                        canEdit: u.canEdit,
                    }));
                    setSharedUsers(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch shared users:', err);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            fetchSharedUsers();
        }
    }, [id, session, status]);

    const handleShare = async () => {
        if (!shareEmail.trim()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/share`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: shareEmail, canEdit }),
            });

            const data = await res.json();
            if (res.ok) {
                setSharedUsers((prev) => [...prev, { email: shareEmail, canEdit }]);
                setShareEmail('');
                setCanEdit(false);
            } else {
                console.error('Failed to share:', data.error);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleTogglePermission = async (email: string, newPermission: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/share`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, canEdit: newPermission }),
            });

            if (res.ok) {
                setSharedUsers((prev) =>
                    prev.map((user) =>
                        user.email === email ? { ...user, canEdit: newPermission } : user
                    )
                );
            }
        } catch (err) {
            console.error('Failed to update permission:', err);
        }
    };

    const handleUnshare = async (email: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/unshare`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSharedUsers((prev) => prev.filter((user) => user.email !== email));
            }
        } catch (err) {
            console.error('Failed to unshare:', err);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-xl">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="btn btn-link text-muted p-0"
                        >
                            <IconChevronLeft className="icon" /> {t('todoDetail.back')}
                        </button>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h2 className="card-title d-flex align-items-center gap-2 m-0">
                                <IconEdit className="icon" />
                                {title}
                                {!canUserEdit && (
                                    <span className="text-muted ms-2 small">{t('todoDetail.viewOnly')}</span>
                                )}
                            </h2>
                        </div>
                        <div className="card-body">
                            {/* Add New Task */}
                            <div className="input-group mb-4">
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder={t('todoDetail.addTaskPlaceholder')}
                                    className="form-control"
                                />
                                <button
                                    onClick={handleAddTask}
                                    disabled={!canUserEdit}
                                    className="btn btn-primary"
                                >
                                    <IconPlus className="icon" /> {t('todoDetail.addTaskButton')}
                                </button>
                            </div>

                            {/* Tasks */}
                            {loading ? (
                                <div className="placeholder-glow">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="placeholder col-12 mb-3 rounded"></div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {incompleteTasks.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="card-subtitle mb-3">{t('todoDetail.tasks')}</h3>
                                            <div className="list-group">
                                                {incompleteTasks.map((task, index) => (
                                                    <div
                                                        key={task._id || `incomplete-${index}`}
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                    >
                                                        <span>{task.title}</span>
                                                        <div className="btn-list">
                                                            <button
                                                                onClick={() => handleToggleComplete(task._id, task.completed)}
                                                                disabled={!canUserEdit}
                                                                className="btn btn-icon btn-success"
                                                                title={t('todoDetail.markComplete')}
                                                            >
                                                                <IconCheck className="icon" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                disabled={!canUserEdit}
                                                                className="btn btn-icon btn-danger"
                                                                title={t('todoDetail.deleteTask')}
                                                            >
                                                                <IconTrash className="icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {completedTasks.length > 0 && (
                                        <div>
                                            <h3 className="card-subtitle mb-3">{t('todoDetail.completedTasks')}</h3>
                                            <div className="list-group">
                                                {completedTasks.map((task, index) => (
                                                    <div
                                                        key={task._id || `completed-${index}`}
                                                        className="list-group-item d-flex justify-content-between align-items-center text-muted text-decoration-line-through"
                                                    >
                                                        <span>{task.title}</span>
                                                        <div className="btn-list">
                                                            <button
                                                                onClick={() => handleToggleComplete(task._id, task.completed)}
                                                                className="btn btn-icon btn-warning"
                                                                title={t('todoDetail.markIncomplete')}
                                                            >
                                                                <IconX className="icon" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                disabled={!canUserEdit}
                                                                className="btn btn-icon btn-danger"
                                                                title={t('todoDetail.deleteTask')}
                                                            >
                                                                <IconTrash className="icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {tasks.length === 0 && (
                                        <div className="empty">
                                            <p className="empty-title">{t('todoDetail.noTasks')}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Share Section */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">{t('todoDetail.share.title')}</h3>
                        </div>
                        <div className="card-body">
                            {/* Share form */}
                            <div className="input-group space-x-3 mb-4">
                                <input
                                    type="email"
                                    placeholder={t('todoDetail.share.emailPlaceholder')}
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    className="form-control"
                                />
                                <select
                                    value={canEdit ? 'edit' : 'view'}
                                    onChange={(e) => setCanEdit(e.target.value === 'edit')}
                                    disabled={!canUserEdit}
                                    className="form-select"
                                >
                                    <option value="view">{t('todoDetail.share.permission.view')}</option>
                                    <option value="edit">{t('todoDetail.share.permission.edit')}</option>
                                </select>
                                <button
                                    onClick={handleShare}
                                    disabled={!canUserEdit}
                                    className="btn btn-success"
                                >
                                    {t('todoDetail.share.shareButton')}
                                </button>
                            </div>

                            {/* Shared Users List */}
                            {loading ? (
                                <div className="placeholder-glow">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="placeholder col-12 mb-3 rounded"></div>
                                    ))}
                                </div>
                            ) : (
                                sharedUsers.length > 0 ? (
                                    <div className="list-group">
                                        {sharedUsers.map((user, index) => (
                                            <div
                                                key={user.email || `shared-${index}`}
                                                className="list-group-item"
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div>{user.email}</div>
                                                        <div className="text-muted small">
                                                            {t('todoDetail.share.access')}: {user.canEdit ?
                                                            t('todoDetail.share.permission.edit') :
                                                            t('todoDetail.share.permission.view')}
                                                        </div>
                                                    </div>
                                                    <div className="btn-list">
                                                        <button
                                                            onClick={() => handleTogglePermission(user.email, !user.canEdit)}
                                                            disabled={!canUserEdit}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            {t('todoDetail.share.togglePermission')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleUnshare(user.email)}
                                                            disabled={!canUserEdit}
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            {t('todoDetail.share.unshare')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty">
                                        <p className="empty-title">{t('todoDetail.share.notShared')}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}