import type { Language, Translations } from '@/types';

import en from '@/locales/en.json';
import mk from '@/locales/mk.json';
import sq from '@/locales/sq.json';
import tr from '@/locales/tr.json';
import sr from '@/locales/sr.json';

const translations: Record<Language, Translations> = {
  en: en as Translations,
  mk: mk as Translations,
  sq: sq as Translations,
  tr: tr as Translations,
  sr: sr as Translations,
};

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'mk', name: 'Македонски', flag: 'MK' },
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'sq', name: 'Shqip', flag: 'SQ' },
  { code: 'tr', name: 'Türkçe', flag: 'TR' },
  { code: 'sr', name: 'Српски', flag: 'SR' },
];

export function getTranslations(lang: Language = 'mk'): Translations {
  return translations[lang] || translations.mk;
}

export function t(lang: Language, key: string): string {
  const trans = getTranslations(lang);
  const keys = key.split('.');
  let result: unknown = trans;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}

export const DEFAULT_LANGUAGE: Language = 'mk';

export function isValidLanguage(lang: string): lang is Language {
  return ['en', 'mk', 'sq', 'tr', 'sr'].includes(lang);
}

export function getLanguageFromStorage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem('vozenpark_language');
  if (stored && isValidLanguage(stored)) return stored;
  return DEFAULT_LANGUAGE;
}

export function setLanguageToStorage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vozenpark_language', lang);
}
