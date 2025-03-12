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
import {useSession} from "next-auth/react";

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

    // const {data: session} = useSession();

    useEffect(() => {
        const fetchTodos = async () => {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const [todosRes, userRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);

                if (todosRes.status === 401 || userRes.status === 401) {
                    router.push('/login');
                    return;
                }

                const todosData = await todosRes.json();
                const userData = await userRes.json();

                setTodoLists(todosData.owned || []);
                setSharedTodoLists(todosData.shared || []);
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const handleCreate = async () => {
        if (!newTitle.trim()) return;
        setLoading(true);

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle }),
            });

            const data = await res.json();

            if (res.ok) {
                setTodoLists((prev) => [...prev, data]);
                setNewTitle('');
            } else if (res.status === 401) {
                router.push('/login');
            } else {
                console.error('Failed to add todo:', data);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log('API response:', data); // Add this line to log the response

            if (res.ok) {
                setTodoLists((prev) => prev.filter((todo) => todo._id !== id));
            } else {
                console.error('Failed to delete todo:', data);
            }
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
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl text-gray-950 font-bold text-center">{t('dashboard.title')}</h1>
                {user && <span className="text-xl text-gray-700">{t('dashboard.welcome')}, {user.name}</span>}

                {/*<button*/}
                {/*    onClick={() => setDarkMode(!darkMode)}*/}
                {/*    className="bg-gray-200 p-2 rounded-full"*/}
                {/*>*/}
                {/*    {darkMode ? <IconSun size={24} /> : <IconMoon size={24} />}*/}
                {/*</button>*/}
            </div>

            {/* Create New Todo */}
            <div className="bg-white  border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder={t('dashboard.create.placeholder')}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full bg-white  text-gray-900"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1"
                    >
                        {loading ? <IconLoader className="animate-spin" size={18} /> : <IconPlus size={18} />}
                        {t('dashboard.create.add')}
                    </button>
                </div>
            </div>

            {/* Todo List Display */}
            <div className="grid md:grid-cols-2 gap-6">
                {initialLoading ? (
                    // Skeleton Loading
                    Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="border rounded-md p-4 shadow-sm animate-pulse space-y-3"
                        >
                            <div className="h-5 bg-gray-300 w-3/4 rounded"></div>
                            <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                            <div className="flex justify-end gap-3 mt-4">
                                <div className="h-4 bg-gray-30 w-16 rounded"></div>
                                <div className="h-4 bg-gray-300 w-16 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : todoLists.length > 0 ? (
                    todoLists.map((todo) => (
                        <div
                            key={todo._id}
                            className="border rounded-md p-4 shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg text-gray-700 font-semibold flex items-center gap-1">
                                    <IconClipboardList size={20} />
                                    {todo.title}
                                </h2>
                                <span className="text-sm text-gray-500 ">
                                    {getCompletion(todo)} {t('dashboard.stats.completion')}
                                </span>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => router.push(`/dashboard/todos/${todo._id}`)}
                                    className="cursor-pointer flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                    <IconPencil size={16} /> {t('dashboard.actions.viewEdit')}
                                </button>
                                <button
                                    onClick={() => handleDelete(todo._id)}
                                    className="cursor-pointer flex items-center gap-1 text-red-600 hover:underline"
                                >
                                    <IconTrash size={16} /> {t('dashboard.actions.delete')}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center text-gray-500 mt-8">
                        <IconClipboardX size={48} />
                        <p className="mt-2 text-center">{t('dashboard.lists.empty')}</p>
                    </div>
                )}
            </div>

            {/* Shared Todo Lists */}
            <div className="mt-10">
                <h2 className="text-2xl text-gray-950 font-bold mb-4">{t('dashboard.lists.shared.title')}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {sharedTodoLists.length > 0 ? (
                        sharedTodoLists.map((todo) => (
                            <div
                                key={todo._id}
                                className="border rounded-md p-4 shadow-sm bg-white"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg text-gray-700 font-semibold flex items-center gap-1">
                                        <IconClipboardList size={20} />
                                        {todo.title}
                                    </h2>
                                    <span className="text-sm text-gray-500 ">
                            {getCompletion(todo)} {t('dashboard.stats.completion')}
                        </span>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => router.push(`/dashboard/todos/${todo._id}`)}
                                        className="cursor-pointer flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                        <IconPencil size={16} /> {t('dashboard.actions.viewEdit')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center text-gray-500 mt-8">
                            <IconClipboardX size={48} />
                            <p className="mt-2 text-center">{t('dashboard.lists.shared.empty')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
