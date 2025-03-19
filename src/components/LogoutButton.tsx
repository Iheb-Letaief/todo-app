'use client';

import {signOut} from 'next-auth/react';

export default function LogoutButton() {

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: '/login' });
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