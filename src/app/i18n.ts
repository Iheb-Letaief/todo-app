import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        supportedLngs: ["en", "fr"],
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        ns: ["common"],
        defaultNS: "common",
        detection: {
            order: ["cookie", "navigator", "htmlTag"],
            caches: ["cookie"],
        },
        interpolation: {
            escapeValue: false,
        },
    }).then(r => console.log(r));

export default i18n;
