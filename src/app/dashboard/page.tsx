'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
    IconPlus,
    IconTrash,
    IconClipboardList,
    IconPencil,
    IconLoader,
    IconClipboardX,
    IconMoon,
    IconSun,
} from '@tabler/icons-react';
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

type Task = {
    title: string;
    completed: boolean;
    _id: string;
};

type SharedWith = {
    userId: string;
    canEdit: boolean;
    _id: string;
};

type TodoList = {
    _id: string;
    title: string;
    userId: string;
    tasks: Task[];
    sharedWith: SharedWith[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export default function DashboardPage() {
    const { t } = useTranslation();
    const [todoLists, setTodoLists] = useState<TodoList[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [sharedTodoLists, setSharedTodoLists] = useState<TodoList[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            // The user is not authenticated, push them to the login page
            router.push('/login');
        }
    });

    // const token = session?.token;

    useEffect(() => {
        const fetchTodos = async () => {
            if (status !== 'authenticated' || !session?.token) {
                return;
            }

            try {
                const [todosRes, userRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
                        headers: {
                            Authorization: `Bearer ${session.token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
                        headers: {
                            Authorization: `Bearer ${session.token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);

                setTodoLists(todosRes.data.owned || []);
                setSharedTodoLists(todosRes.data.shared || []);
                setUser(userRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchTodos();
    }, [status, session]);

    const handleCreate = async () => {
        if (!newTitle.trim() || !session?.token) return;
        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/todos`,
                { title: newTitle },
                {
                    headers: {
                        Authorization: `Bearer ${session.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setTodoLists((prev) => [...prev, res.data]);
            setNewTitle('');
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!session?.token) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.token}`,
                },
            });

            setTodoLists((prev) => prev.filter((todo) => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const getCompletion = (todo: TodoList) => {
        if (!todo.tasks.length) return '0%';
        const completedTasks = todo.tasks.filter((task) => task.completed).length;
        const percentage = (completedTasks / todo.tasks.length) * 100;
        return `${Math.round(percentage)}%`;
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-xl">
                    <div className="row mb-4">
                        <div className="col">
                            <h1 className="h1 m-0">{t('dashboard.title')}</h1>
                        </div>
                        {user &&
                            <div className="col">
                                <span className="text-secondary">{t('dashboard.welcome')}, {user.name}</span>
                            </div>
                        }
                    </div>

                    {/* Create New Todo */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3 className="card-title">{t('dashboard.create.title')}</h3>
                        </div>
                        <div className="card-body">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder={t('dashboard.create.placeholder')}
                                    className="form-control"
                                />
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="btn btn-primary"
                                >
                                    {loading ? <IconLoader className="icon icon-tabler-loader animate-spin" /> : <IconPlus className="icon" />}
                                    {t('dashboard.create.add')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Todo Lists */}
                    <div className="row">
                        {initialLoading ? (
                            // Skeleton Loading
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="col-md-6 mb-4">
                                    <div className="card placeholder-glow">
                                        <div className="card-body">
                                            <div className="placeholder col-8 mb-3"></div>
                                            <div className="placeholder col-4"></div>
                                            <div className="d-flex justify-content-end gap-2 mt-4">
                                                <div className="placeholder col-2"></div>
                                                <div className="placeholder col-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : todoLists.length > 0 ? (
                            todoLists.map((todo) => (
                                <div key={todo._id} className="col-md-6 mb-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h3 className="card-title mb-0">
                                                    <IconClipboardList className="icon me-2" />
                                                    {todo.title}
                                                </h3>
                                                <span className="text-muted small">
                                                    {getCompletion(todo)} {t('dashboard.stats.completion')}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/todos/${todo._id}`)}
                                                    className="btn btn-link"
                                                >
                                                    <IconPencil className="icon" /> {t('dashboard.actions.viewEdit')}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(todo._id)}
                                                    className="btn btn-link text-danger"
                                                >
                                                    <IconTrash className="icon" /> {t('dashboard.actions.delete')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center mt-4">
                                <IconClipboardX size={48} className="text-muted mb-2" />
                                <p className="text-muted">{t('dashboard.lists.empty')}</p>
                            </div>
                        )}
                    </div>

                    {/* Shared Todo Lists */}
                    <div className="mt-5">
                        <h2 className="h2 mb-4">{t('dashboard.lists.shared.title')}</h2>
                        <div className="row">
                            {sharedTodoLists.length > 0 ? (
                                sharedTodoLists.map((todo) => (
                                    <div key={todo._id} className="col-md-6 mb-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="card-title mb-0">
                                                        <IconClipboardList className="icon me-2" />
                                                        {todo.title}
                                                    </h3>
                                                    <span className="text-muted small">
                                                        {getCompletion(todo)} {t('dashboard.stats.completion')}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        onClick={() => router.push(`/dashboard/todos/${todo._id}`)}
                                                        className="btn btn-link"
                                                    >
                                                        <IconPencil className="icon" /> {t('dashboard.actions.viewEdit')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center mt-4">
                                    <IconClipboardX size={48} className="text-muted mb-2" />
                                    <p className="text-muted">{t('dashboard.lists.shared.empty')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
