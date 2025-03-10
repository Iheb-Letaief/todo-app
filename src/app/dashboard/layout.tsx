'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = () => {
        // Clear any authentication tokens or user data
        sessionStorage.removeItem('token');
        // Redirect to the login page
        router.push('/login');
    };


    return (
        <div className="relative min-h-screen flex flex-col">
            <main className="flex-grow mb-16">{children}</main>
            <button
                onClick={handleLogout}
                className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
                Logout
            </button>
        </div>
    );
}