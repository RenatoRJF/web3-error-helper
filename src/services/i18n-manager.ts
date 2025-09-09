/**
 * Core internationalization (i18n) manager
 *
 * This module contains the main i18n management logic that handles translation
 * loading, fallback logic, partial overrides, and language switching. It follows
 * the same patterns and standards as other service modules in the codebase.
 */

// Global type declarations for console
declare const console: Console;

import {
  LanguageCode,
  PartialTranslationOverride,
  I18nManager as I18nManagerInterface,
  createLanguageCode,
  LanguageInfo,
  TranslationObject,
  TranslationParams,
} from '../types/i18n';
import { getLanguageInfo } from '../config/default-languages';

/**
 * Default fallback messages (English)
 */
const DEFAULT_FALLBACK_MESSAGES = {
  network:
    'Network error occurred. Please check your connection and try again.',
  wallet:
    'Wallet error occurred. Please check your wallet connection and try again.',
  insufficient_funds: 'Insufficient balance for transaction',
  transaction_failed: 'Transaction failed. Please try again.',
  unknown_error: 'An unknown error occurred',
} as const;

/**
 * Core i18n manager implementation
 */
class I18nManager implements I18nManagerInterface {
  private englishTranslations: TranslationObject;
  private developerLocales: Map<LanguageCode, TranslationObject> = new Map();
  private globalOverrides: Map<LanguageCode, PartialTranslationOverride> =
    new Map();
  private supportedLanguages: Set<LanguageCode> = new Set([
    createLanguageCode('en'),
  ]);
  private currentLanguage: LanguageCode = createLanguageCode('en');

  constructor() {
    this.englishTranslations = this.loadEnglishTranslations();
  }

  /**
   * Load English translations from the translations file
   */
  private loadEnglishTranslations(): TranslationObject {
    try {
      // Load English translations directly from the JSON file
      // eslint-disable-next-line no-undef
      const enTranslations = require('../translations/en.json');
      return enTranslations;
    } catch (error) {
      console.warn(
        'Failed to load English translations, using fallbacks:',
        error
      );
      return {
        errors: DEFAULT_FALLBACK_MESSAGES,
      };
    }
  }

  /**
   * Register developer-provided locale with partial override support
   */
  registerLocale(
    language: string,
    translations: TranslationObject,
    overrides?: PartialTranslationOverride
  ): void {
    const langCode = createLanguageCode(language);
    this.developerLocales.set(langCode, translations);
    this.supportedLanguages.add(langCode);

    if (overrides) {
      this.globalOverrides.set(langCode, overrides);
    }
  }

  /**
   * Register multiple locales at once with partial overrides
   */
  registerLocales(
    locales: Record<
      string,
      {
        translations: TranslationObject;
        overrides?: PartialTranslationOverride;
      }
    >
  ): void {
    Object.entries(locales).forEach(([lang, config]) => {
      this.registerLocale(lang, config.translations, config.overrides);
    });
  }

  /**
   * Add partial overrides for a specific language
   */
  addOverrides(language: string, overrides: PartialTranslationOverride): void {
    const langCode = createLanguageCode(language);
    const existingOverrides = this.globalOverrides.get(langCode) || {};
    this.globalOverrides.set(langCode, { ...existingOverrides, ...overrides });
  }

  /**
   * Remove specific overrides for a language
   */
  removeOverrides(language: string, keys: string[]): void {
    const langCode = createLanguageCode(language);
    const existingOverrides = this.globalOverrides.get(langCode) || {};
    keys.forEach(key => delete existingOverrides[key]);
    this.globalOverrides.set(langCode, existingOverrides);
  }

  /**
   * Get all overrides for a language
   */
  getOverrides(language: string): PartialTranslationOverride {
    const langCode = createLanguageCode(language);
    return this.globalOverrides.get(langCode) || {};
  }

  /**
   * Set the current language (what the user sees)
   */
  setCurrentLanguage(language: string): void {
    const langCode = createLanguageCode(language);
    if (this.supportedLanguages.has(langCode)) {
      this.currentLanguage = langCode;
    } else {
      console.warn(
        `Language '${language}' is not supported. Available: ${Array.from(this.supportedLanguages).join(', ')}`
      );
    }
  }

  /**
   * Get the current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): string[] {
    return Array.from(this.supportedLanguages);
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: string): boolean {
    const langCode = createLanguageCode(language);
    return this.supportedLanguages.has(langCode);
  }

  /**
   * Translate using current language with fallback to English
   */
  translate(
    key: string,
    language?: string,
    params?: TranslationParams
  ): string {
    const targetLanguage = language
      ? createLanguageCode(language)
      : this.currentLanguage;

    // Check for partial overrides first
    const overrides = this.globalOverrides.get(targetLanguage);
    if (overrides && overrides[key]) {
      return this.interpolate(overrides[key], params);
    }

    // Try developer-provided translation
    const developerTranslation = this.getDeveloperTranslation(
      key,
      targetLanguage
    );
    if (developerTranslation && developerTranslation.trim() !== '') {
      return this.interpolate(developerTranslation, params);
    }

    // Fallback to English
    const englishTranslation = this.getNestedValue(
      this.englishTranslations,
      key
    );
    if (englishTranslation && englishTranslation.trim() !== '') {
      return this.interpolate(englishTranslation, params);
    }

    // Final fallback - return the key itself
    return key;
  }

  /**
   * Get translation for a specific language (useful for language switching)
   */
  translateForLanguage(
    key: string,
    language: string,
    params?: TranslationParams
  ): string {
    return this.translate(key, language, params);
  }

  /**
   * Get developer-provided translation for a specific language
   */
  private getDeveloperTranslation(
    key: string,
    language: LanguageCode
  ): string | null {
    const locale = this.developerLocales.get(language);
    if (!locale) return null;

    return this.getNestedValue(locale, key);
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(
    obj: Record<string, unknown>,
    path: string
  ): string | null {
    const result = path.split('.').reduce((current: unknown, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj as unknown);

    return typeof result === 'string' ? result : null;
  }

  /**
   * Interpolate parameters into translation template
   */
  private interpolate(template: string, params?: TranslationParams): string {
    if (!params) return template;

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(params[key] || match);
    });
  }

  /**
   * Get language metadata
   */
  getLanguageInfo(language: string) {
    return getLanguageInfo(language);
  }

  /**
   * Get all registered locales with metadata
   */
  getAllLocales(): Array<{
    language: string;
    info: LanguageInfo;
    hasOverrides: boolean;
  }> {
    return Array.from(this.supportedLanguages).map(langCode => {
      const language = langCode.toString();
      const info = getLanguageInfo(language);
      const hasOverrides = this.globalOverrides.has(langCode);

      return {
        language,
        info: info || {
          name: language,
          nativeName: language,
          region: 'Unknown',
          priority: 0,
          blockchainMarket: 'Unknown',
        },
        hasOverrides,
      };
    });
  }

  /**
   * Clear all developer locales and overrides
   */
  clear(): void {
    this.developerLocales.clear();
    this.globalOverrides.clear();
    this.supportedLanguages.clear();
    this.supportedLanguages.add(createLanguageCode('en'));
    this.currentLanguage = createLanguageCode('en');
  }
}

/**
 * Singleton instance of the i18n manager
 */
export const i18nManager = new I18nManager();

// Export individual functions for convenience
export const registerLocale = (
  language: string,
  translations: TranslationObject,
  overrides?: PartialTranslationOverride
) => i18nManager.registerLocale(language, translations, overrides);

export const registerLocales = (
  locales: Record<
    string,
    {
      translations: TranslationObject;
      overrides?: PartialTranslationOverride;
    }
  >
) => i18nManager.registerLocales(locales);

export const addOverrides = (
  language: string,
  overrides: PartialTranslationOverride
) => i18nManager.addOverrides(language, overrides);

export const removeOverrides = (language: string, keys: string[]) =>
  i18nManager.removeOverrides(language, keys);

export const getOverrides = (language: string) =>
  i18nManager.getOverrides(language);

export const setCurrentLanguage = (language: string) =>
  i18nManager.setCurrentLanguage(language);

export const getCurrentLanguage = () => i18nManager.getCurrentLanguage();

export const getSupportedLanguages = () => i18nManager.getSupportedLanguages();

export const isLanguageSupported = (language: string) =>
  i18nManager.isLanguageSupported(language);

export const translateForLanguage = (
  key: string,
  language: string,
  params?: TranslationParams
) => i18nManager.translateForLanguage(key, language, params);
