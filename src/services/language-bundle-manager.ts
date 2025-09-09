/**
 * Language bundle manager with optimization
 *
 * This module provides intelligent language loading, bundle optimization,
 * and language suggestion features. It follows the same patterns and
 * standards as other service modules in the codebase.
 */

// Global type declarations for console
declare const console: Console;

import {
  LanguageCode,
  LanguageInfo,
  LanguageSelection,
  LanguageSuggestion,
  TranslationLoadResult,
  LanguageBundleManager as LanguageBundleManagerInterface,
  createLanguageCode,
  TranslationObject,
} from '../types/i18n';
import {
  DEFAULT_LANGUAGES,
  getAvailableLanguageCodes,
  getLanguageInfo,
} from '../config/default-languages';
import { i18nManager } from './i18n-manager';

/**
 * Language bundle manager implementation
 */
class LanguageBundleManager implements LanguageBundleManagerInterface {
  private availableLanguages: Set<LanguageCode>;
  private loadedLanguages: Set<LanguageCode> = new Set([
    createLanguageCode('en'),
  ]); // English always loaded
  private languageMetadata: Map<LanguageCode, LanguageInfo> = new Map();
  private translationCache: Map<LanguageCode, TranslationObject> = new Map();

  constructor() {
    this.availableLanguages = new Set(getAvailableLanguageCodes());
    this.initializeLanguageMetadata();
  }

  /**
   * Initialize language metadata from configuration
   */
  private initializeLanguageMetadata(): void {
    for (const [code, info] of Object.entries(DEFAULT_LANGUAGES)) {
      const langCode = createLanguageCode(code);
      this.languageMetadata.set(langCode, info);
    }
  }

  /**
   * Configure language selection and load only target languages
   */
  configureLanguageSelection(
    selection: LanguageSelection
  ): TranslationLoadResult {
    const {
      targetLanguages,
      includeEnglishFallback = true,
      autoSuggest = true,
    } = selection;

    const result: TranslationLoadResult = {
      loaded: [],
      missing: [],
      suggestions: [],
      fallbacks: {},
    };

    // Process each target language
    for (const requested of targetLanguages) {
      const suggestion = this.suggestLanguage(requested, autoSuggest);
      result.suggestions.push(suggestion);

      if (suggestion.available) {
        // Load the language if not already loaded
        if (
          !this.loadedLanguages.has(createLanguageCode(suggestion.available))
        ) {
          this.loadLanguage(suggestion.available);
          result.loaded.push(suggestion.available);
        }

        // Set up fallback mapping
        if (suggestion.available !== requested) {
          result.fallbacks[requested] = suggestion.available;
        }
      } else {
        result.missing.push(requested);
      }
    }

    // Ensure English is loaded as fallback if requested
    if (
      includeEnglishFallback &&
      !this.loadedLanguages.has(createLanguageCode('en'))
    ) {
      this.loadLanguage('en');
      result.loaded.push('en');
    }

    return result;
  }

  /**
   * Suggest the best available language for a requested language
   */
  private suggestLanguage(
    requested: string,
    autoSuggest: boolean
  ): LanguageSuggestion {
    // Exact match
    if (this.availableLanguages.has(createLanguageCode(requested))) {
      return {
        requested,
        available: requested,
        suggestions: [],
        reason: 'exact_match',
      };
    }

    // Similar match (e.g., 'en-US' -> 'en')
    const baseLanguage = requested.split('-')[0] || requested;
    if (this.availableLanguages.has(createLanguageCode(baseLanguage))) {
      return {
        requested,
        available: baseLanguage,
        suggestions: [baseLanguage],
        reason: 'similar_match',
      };
    }

    // Auto-suggest similar languages
    if (autoSuggest) {
      const suggestions = this.findSimilarLanguages(requested);
      if (suggestions.length > 0) {
        return {
          requested,
          available: suggestions[0] || null,
          suggestions,
          reason: 'similar_match',
        };
      }
    }

    // No match found
    return {
      requested,
      available: null,
      suggestions: this.getTopLanguages(),
      reason: 'not_found',
    };
  }

  /**
   * Find similar languages based on various criteria
   */
  private findSimilarLanguages(requested: string): string[] {
    const suggestions: string[] = [];
    const requestedLower = requested.toLowerCase();

    // Check for similar language codes
    for (const available of this.availableLanguages) {
      const availableStr = available.toString();
      if (
        availableStr.toLowerCase().includes(requestedLower) ||
        requestedLower.includes(availableStr.toLowerCase())
      ) {
        suggestions.push(availableStr);
      }
    }

    // Check for similar language names
    for (const [code, info] of this.languageMetadata) {
      if (
        info.name.toLowerCase().includes(requestedLower) ||
        info.nativeName.toLowerCase().includes(requestedLower)
      ) {
        suggestions.push(code.toString());
      }
    }

    // Check for regional similarities
    const requestedInfo = this.languageMetadata.get(
      createLanguageCode(requested)
    );
    if (requestedInfo) {
      for (const [code, info] of this.languageMetadata) {
        if (
          info.region === requestedInfo.region &&
          code.toString() !== requested
        ) {
          suggestions.push(code.toString());
        }
      }
    }

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }

  /**
   * Get top languages by priority
   */
  private getTopLanguages(): string[] {
    return Array.from(this.availableLanguages)
      .sort((a, b) => {
        const aInfo = this.languageMetadata.get(a);
        const bInfo = this.languageMetadata.get(b);
        const aPriority = aInfo?.priority || 3;
        const bPriority = bInfo?.priority || 3;
        return aPriority - bPriority;
      })
      .map(code => code.toString())
      .slice(0, 10); // Top 10 languages
  }

  /**
   * Load a specific language (lazy loading)
   */
  loadLanguage(language: string): void {
    const langCode = createLanguageCode(language);
    if (this.loadedLanguages.has(langCode)) {
      return; // Already loaded
    }

    // Load translation data
    const translations = this.loadTranslationData(language);
    this.translationCache.set(langCode, translations);
    this.loadedLanguages.add(langCode);

    // Register with i18n manager
    i18nManager.registerLocale(language, translations);
  }

  /**
   * Unload a specific language to save memory
   */
  unloadLanguage(language: string): void {
    const langCode = createLanguageCode(language);
    if (langCode.toString() === 'en') {
      console.warn(
        'Cannot unload English language as it is required for fallbacks'
      );
      return;
    }

    this.loadedLanguages.delete(langCode);
    this.translationCache.delete(langCode);
  }

  /**
   * Load translation data for a language
   */
  private loadTranslationData(language: string): TranslationObject {
    const info = getLanguageInfo(language);
    if (!info) {
      console.warn(`Language '${language}' not found in configuration`);
      return { errors: {} };
    }

    // Load from the translation files via the translation loader
    // The actual translation data is loaded by the translation-loader service
    return {
      errors: {},
    };
  }

  /**
   * Get available languages with metadata
   */
  getAvailableLanguages(): Array<{ code: string; info: LanguageInfo }> {
    return Array.from(this.availableLanguages).map(code => {
      const info = this.languageMetadata.get(code);
      if (!info) {
        throw new Error(`Language metadata not found for: ${code}`);
      }
      return {
        code: code.toString(),
        info,
      };
    });
  }

  /**
   * Get loaded languages
   */
  getLoadedLanguages(): string[] {
    return Array.from(this.loadedLanguages).map(code => code.toString());
  }

  /**
   * Check if a language is loaded
   */
  isLanguageLoaded(language: string): boolean {
    return this.loadedLanguages.has(createLanguageCode(language));
  }

  /**
   * Clear all loaded languages except English
   */
  clear(): void {
    const englishCode = createLanguageCode('en');
    this.loadedLanguages.clear();
    this.loadedLanguages.add(englishCode);
    this.translationCache.clear();
  }
}

/**
 * Singleton instance of the language bundle manager
 */
export const languageBundleManager = new LanguageBundleManager();

// Export individual functions for convenience
export const configureLanguageSelection = (selection: LanguageSelection) =>
  languageBundleManager.configureLanguageSelection(selection);

export const getAvailableLanguages = () =>
  languageBundleManager.getAvailableLanguages();

export const getLoadedLanguages = () =>
  languageBundleManager.getLoadedLanguages();

export const isLanguageLoaded = (language: string) =>
  languageBundleManager.isLanguageLoaded(language);

export const loadLanguage = (language: string) =>
  languageBundleManager.loadLanguage(language);

export const unloadLanguage = (language: string) =>
  languageBundleManager.unloadLanguage(language);
