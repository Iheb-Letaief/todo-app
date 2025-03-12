"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
    requiredRole,
}: {
    children: React.ReactNode;
    requiredRole?: string;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
        } else if (requiredRole && session.user.role !== requiredRole) {
            // Redirect if specific role is required but user doesn't have it
            router.push("/dashboard");
        }
    }, [session, status, router, requiredRole]);

    if (status === "loading") {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    if (requiredRole && session.user.role !== requiredRole) {
        return null;
    }

    return <>{children}</>;
}