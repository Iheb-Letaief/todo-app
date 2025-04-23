'use client';

import { useTranslation } from 'react-i18next';
import {useEffect, useRef, useState} from 'react';
import {IconLanguage} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from 'next-auth/react';

export default function TranslationToggle() {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    useEffect(() => {
        setMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeLanguage = async (lang: string) => {
        try {
            // Update local i18n
            await i18n.changeLanguage(lang);
            setIsOpen(false);

            // Update backend if authenticated
            if (session?.token) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/language`,
                    { language: lang },
                    {
                        headers: {
                            Authorization: `Bearer ${session.token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
        } catch (error) {
            console.error("Error updating language:", error);
        }
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn dropdown-toggle d-flex align-items-center py-3"
                type="button"
            >
                <IconLanguage size={18} className="me-1" />
                <span className="me-1">{i18n.language.toUpperCase()}</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu dropdown-menu-end show end-2">
                    <a
                        href="#"
                        className={`dropdown-item ${i18n.language === 'fr' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            changeLanguage('fr');
                        }}
                    >
                        <span className="flag flag-xs flag-country-fr"></span>
                        Français
                    </a>
                    <a
                        href="#"
                        className={`dropdown-item ${i18n.language === 'en' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            changeLanguage('en');
                        }}
                    >
                        <span className="flag flag-xs flag-country-us"></span>
                        English
                    </a>
                </div>
            )}
        </div>
    );
}