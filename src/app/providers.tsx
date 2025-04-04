'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('i18nextLng');
            if (storedLang) {
                i18n.changeLanguage(storedLang);
            }
        }
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <I18nextProvider i18n={i18n}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </I18nextProvider>
    );
}