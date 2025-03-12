'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function TranslationToggle() {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={toggleLanguage}
            className="cursor-pointer px-3 py-1 rounded bg-gray-400 hover:bg-gray-600 text-white transition"
        >
            {i18n.language === 'en' ? 'FR' : 'EN'}
        </button>
    );
}