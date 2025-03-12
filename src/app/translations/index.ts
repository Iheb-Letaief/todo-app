import { en } from './en';
import { fr } from './fr';

export const resources = {
    en: { translation: en },
    fr: { translation: fr }
} as const;

// Type-safe translation keys
export type TranslationKeys = keyof typeof en;