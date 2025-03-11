'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    IconChevronLeft,
    IconPlus,
    IconTrash,
    IconCheck,
    IconX,
    IconEdit,
} from '@tabler/icons-react';

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

    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const [shareEmail, setShareEmail] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [canUserEdit, setCanUserEdit] = useState(false);
    const [sharedUsers, setSharedUsers] = useState<{ email: string; canEdit: boolean }[]>([]);

    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;

    useEffect(() => {
        const fetchTodo = async () => {
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

                console.log(data.userId.toString());
                console.log(userId);
                if(data.userId.toString() === userId) {
                    setCanUserEdit(true);
                } else {
                    setCanUserEdit(data.sharedWith.some((user: any) => user.userId === userId && user.canEdit));
                }
                console.log(data);
                console.log(data.sharedWith.some((user: any) => user.userId === userId && user.canEdit));
                console.log(canUserEdit);

            } catch (err) {
                console.error('Failed to fetch todo list:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [id, token]);

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

        fetchSharedUsers();
    }, [id, token]);

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
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6 flex items-center gap-2">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="cursor-pointer text-sm text-gray-600 hover:underline flex items-center"
                >
                    <IconChevronLeft size={16} /> Back to Dashboard
                </button>
            </div>

            <h1 className="text-2xl text-gray-950 font-bold mb-4 flex items-center gap-2">
                <IconEdit size={24} />
                {title}
                {!canUserEdit && (
                    <span className="text-sm text-gray-500 ml-2">(You can only view this list)</span>
                )}
            </h1>

            {/* Add New Task */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New task title"
                    className="border text-gray-950 placeholder-gray-400 border-gray-300 px-4 py-2 rounded-md w-full"
                />
                <button
                    onClick={handleAddTask}
                    disabled={!canUserEdit}
                    className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                >
                    <IconPlus size={18} /> Add
                </button>
            </div>

            {/* Tasks */}
            {loading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ) : (
                <>
                    {incompleteTasks.length > 0 && (
                        <div className="mb-6">
                            <h2 className="font-semibold mb-2 text-gray-700">Tasks</h2>
                            <ul className="space-y-2">
                                {incompleteTasks.map((task, index) => (
                                    <li
                                        key={task._id || `incomplete-${index}`}
                                        className="flex justify-between items-center border border-gray-200 rounded-md p-3 shadow-sm"
                                    >
                                        <span className="text-gray-950">{task.title}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleComplete(task._id, task.completed)}
                                                className={`cursor-pointer text-green-600 hover:text-green-800 ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!canUserEdit}
                                                title="Mark as completed"
                                            >
                                                <IconCheck size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                className={`cursor-pointer text-red-600 hover:text-red-800 ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!canUserEdit}
                                                title="Delete task"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {completedTasks.length > 0 && (
                        <div>
                            <h2 className="font-semibold mb-2 text-gray-700">Completed Tasks</h2>
                            <ul className="space-y-2">
                                {completedTasks.map((task, index) => (
                                    <li
                                        key={task._id || `completed-${index}`}
                                        className="flex justify-between items-center border border-gray-200 rounded-md p-3 bg-gray-100 text-gray-500 line-through"
                                    >
                                        <span>{task.title}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleComplete(task._id, task.completed)}
                                                className="cursor-pointer text-yellow-600 hover:text-yellow-800"
                                                title="Mark as incomplete"
                                            >
                                                <IconX size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                className={`cursor-pointer text-red-600 hover:text-red-800 ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!canUserEdit}
                                                title="Delete task"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {tasks.length === 0 && <p className="text-gray-600">No tasks added yet.</p>}
                </>
            )}

            {/* Share Section */}
            <div className="mt-10">
                <h2 className="font-semibold mb-2 text-gray-700">Share This Todo List</h2>

                {/* Share form */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="email"
                        placeholder="User's email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        className="border text-gray-950 placeholder-gray-400 border-gray-300 px-4 py-2 rounded-md w-full"
                    />
                    <select
                        value={canEdit ? 'edit' : 'view'}
                        onChange={(e) => setCanEdit(e.target.value === 'edit')}
                        disabled={!canUserEdit}

                        className={`border border-gray-300 rounded-md px-3 py-2 text-gray-700 ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                    >
                        <option value="view">Can View</option>
                        <option value="edit">Can Edit</option>
                    </select>
                    <button
                        onClick={handleShare}
                        disabled={!canUserEdit}
                        className={`cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                    >
                        Share
                    </button>
                </div>

                {/* Shared Users List */}
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : (
                    sharedUsers.length > 0 ? (
                        <ul className="space-y-2">
                            {sharedUsers.map((user, index) => (
                                <li
                                    key={user.email || `shared-${index}`}
                                    className="flex justify-between items-center border border-gray-200 p-3 rounded-md shadow-sm"
                                >
                                    <div>
                                        <p className="text-gray-900">{user.email}</p>
                                        <p className="cursor-pointer text-sm text-gray-500">
                                            Access: {user.canEdit ? 'Can Edit' : 'Can View'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTogglePermission(user.email, !user.canEdit)}
                                            disabled={!canUserEdit}
                                            className={`cursor-pointer text-blue-600 hover:text-blue-800 text-sm ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                                        >
                                            Toggle Permission
                                        </button>
                                        <button
                                            onClick={() => handleUnshare(user.email)}
                                            disabled={!canUserEdit}
                                            className={`cursor-pointer text-red-600 hover:text-red-800 text-sm ${!canUserEdit && 'opacity-50 cursor-not-allowed'}`}
                                        >
                                            Unshare
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">Not shared with anyone yet.</p>
                    )
                )}
            </div>
        </div>
    );
}

