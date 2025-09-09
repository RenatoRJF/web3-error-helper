/**
 * Translation loader service for automatically loading all translation files
 */

import { registerLocale } from './i18n-manager';
import { TranslationObject } from '../types/i18n';

// Import all translation files
import * as enTranslations from '../translations/en.json';
import * as esTranslations from '../translations/es.json';
import * as ptTranslations from '../translations/pt.json';
import * as zhTranslations from '../translations/zh.json';
import * as jaTranslations from '../translations/ja.json';
import * as koTranslations from '../translations/ko.json';
import * as deTranslations from '../translations/de.json';
import * as ruTranslations from '../translations/ru.json';
import * as hiTranslations from '../translations/hi.json';
import * as arTranslations from '../translations/ar.json';
import * as trTranslations from '../translations/tr.json';
import * as viTranslations from '../translations/vi.json';
import * as thTranslations from '../translations/th.json';
import * as idTranslations from '../translations/id.json';
import * as plTranslations from '../translations/pl.json';
import * as ukTranslations from '../translations/uk.json';
import * as heTranslations from '../translations/he.json';
import * as frTranslations from '../translations/fr.json';
import * as itTranslations from '../translations/it.json';
import * as nlTranslations from '../translations/nl.json';

/**
 * Translation registry mapping language codes to their translation objects
 */
const TRANSLATION_REGISTRY: Record<string, TranslationObject> = {
  en: enTranslations,
  es: esTranslations,
  pt: ptTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  de: deTranslations,
  ru: ruTranslations,
  hi: hiTranslations,
  ar: arTranslations,
  tr: trTranslations,
  vi: viTranslations,
  th: thTranslations,
  id: idTranslations,
  pl: plTranslations,
  uk: ukTranslations,
  he: heTranslations,
  fr: frTranslations,
  it: itTranslations,
  nl: nlTranslations,
};

/**
 * Load all available translations into the i18n system
 */
export function loadAllTranslations(): void {
  Object.entries(TRANSLATION_REGISTRY).forEach(([language, translations]) => {
    registerLocale(language, translations);
  });
}

/**
 * Load specific translations by language codes
 */
export function loadTranslations(languages: string[]): void {
  languages.forEach(language => {
    const translations = TRANSLATION_REGISTRY[language];
    if (translations) {
      registerLocale(language, translations);
    }
  });
}

/**
 * Get list of available translation languages
 */
export function getAvailableTranslationLanguages(): string[] {
  return Object.keys(TRANSLATION_REGISTRY);
}

/**
 * Check if a language has translations available
 */
export function hasTranslations(language: string): boolean {
  return language in TRANSLATION_REGISTRY;
}
