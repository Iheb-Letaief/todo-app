'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear any authentication tokens or user data
        sessionStorage.removeItem('token');
        // Redirect to the login page
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="fixed bottom-4 right-4 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
            Logout
        </button>
    );
}