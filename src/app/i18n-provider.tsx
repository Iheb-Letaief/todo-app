"use client";

import React, { useEffect } from "react";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        i18n.init().then(r => console.log(r));
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
