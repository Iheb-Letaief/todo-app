'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import {SessionProvider} from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <I18nextProvider i18n={i18n}>
            <SessionProvider session={null}>
                {children}
            </SessionProvider>
        </I18nextProvider>

    );
}