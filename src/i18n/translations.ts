import { es } from './es';
import { en } from './en';
import { zh } from './zh';
import { ru } from './ru';
import { pt } from './pt';

/**
 * SasoriLabs Global Translation System - "Presidential Level"
 * Modular Infrastructure for high scalability and reliability.
 */
export const translations = {
  es,
  en,
  zh,
  ru,
  pt
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.es;
