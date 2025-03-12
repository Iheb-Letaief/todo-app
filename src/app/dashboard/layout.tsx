'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogoutButton from "@/components/LogoutButton";

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
            <LogoutButton />
        </div>
    );
}