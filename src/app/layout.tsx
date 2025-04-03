'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {I18nextProvider} from "react-i18next";
import i18n from "i18next";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@tabler/core/dist/css/tabler.min.css';
import '@tabler/core/dist/css/tabler-flags.min.css';
import {Providers} from "@/app/providers";
import DarkModeToggle from "@/components/DarkModeToggle";
import TranslationToggle from "@/components/ToggleTranslationButton";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Todo App",
  description: "Generated by create next app",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        return isDark;
      }
    }
    return false;
  });

  useEffect(() => {
      require('@tabler/core/dist/js/tabler.min.js');
      require('@tabler/core/dist/css/tabler-flags.min.css');
  }, []);

  return (
      <html lang="en" data-bs-theme={darkMode ? 'dark' : 'light'}>

      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.1.1/dist/css/tabler-flags.min.css" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="absolute top-4 right-4 z-50">
        <div className="space-x-3">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <TranslationToggle/>
        </div>
      </div>
      <Providers>
        {children}
      </Providers>
      </body>
      </html>
  );
}