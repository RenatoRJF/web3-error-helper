/**
 * Tests for internationalization (i18n) functionality
 */

import {
  i18nManager,
  registerLocale,
  setCurrentLanguage,
  getCurrentLanguage,
  translateError,
  setTimestampForTesting,
  resetTimestampForTesting,
  languageBundleManager,
  configureLanguageSelection,
  languageDetectionService,
  detectFromError,
} from '../index';
import { loadAllTranslations } from '../services/translation-loader';

describe('i18n functionality', () => {
  beforeEach(() => {
    // Set a fixed timestamp for consistent tests
    setTimestampForTesting(1234567890000);
    // Reset i18n manager state
    i18nManager.clear();
    // Reload all translations after clearing
    loadAllTranslations();
  });

  afterEach(() => {
    // Reset to real time after each test
    resetTimestampForTesting();
  });

  describe('i18nManager', () => {
    test('should register and translate locales', () => {
      // Register Spanish translations
      registerLocale('es', {
        errors: {
          network: 'Error de red',
          wallet: 'Error de billetera',
        },
      });

      // Set current language
      setCurrentLanguage('es');

      // Test translation
      const result = i18nManager.translate('errors.network', 'es');
      expect(result).toBe('Error de red');
    });

    test('should fallback to English when translation not found', () => {
      // Register Spanish translations without 'wallet' key
      registerLocale('es', {
        errors: {
          network: 'Error de red',
          // Note: 'wallet' key is missing, so it should fallback to English
        },
      });

      // Test fallback to English for a key that doesn't exist in Spanish
      const result = i18nManager.translate('errors.wallet', 'es');
      expect(result).toBe(
        'Wallet error occurred. Please check your wallet connection.'
      );
    });

    test('should support partial overrides', () => {
      // Register base translations
      registerLocale('es', {
        errors: {
          network: 'Error de red',
          wallet: 'Error de billetera',
        },
      });

      // Add partial override
      i18nManager.addOverrides('es', {
        'errors.network': 'Error de red personalizado',
      });

      const result = i18nManager.translate('errors.network', 'es');
      expect(result).toBe('Error de red personalizado');
    });

    test('should manage current language', () => {
      expect(getCurrentLanguage()).toBe('en');

      setCurrentLanguage('es');
      expect(getCurrentLanguage()).toBe('es');
    });
  });

  describe('translateError with i18n', () => {
    test('should translate errors with language option', () => {
      // Register Spanish translations
      registerLocale('es', {
        errors: {
          network: 'Error de red',
          wallet: 'Error de billetera',
        },
      });

      const error = { message: 'Network error occurred' };
      const result = translateError(error, { language: 'es' });

      expect(result.message).toBe('Error de red');
      expect(result.translated).toBe(true);
    });

    test('should auto-detect language from error message', () => {
      // Register Spanish translations
      registerLocale('es', {
        errors: {
          network: 'Error de red',
          wallet: 'Error de billetera',
        },
      });

      const error = { message: 'Error de red ocurrido' };
      const result = translateError(error, { autoDetectLanguage: true });

      expect(result.message).toBe('Error de red');
      expect(result.translated).toBe(true);
    });
  });

  describe('languageBundleManager', () => {
    test('should configure language selection', () => {
      const result = configureLanguageSelection({
        targetLanguages: ['es', 'pt'],
        includeEnglishFallback: true,
        autoSuggest: true,
      });

      // English should be available (already loaded by loadAllTranslations)
      expect(languageBundleManager.isLanguageLoaded('en')).toBe(true);
      expect(result.suggestions).toBeDefined();
    });

    test('should get available languages', () => {
      const available = languageBundleManager.getAvailableLanguages();
      expect(available.length).toBeGreaterThan(0);
      expect(available[0]).toHaveProperty('code');
      expect(available[0]).toHaveProperty('info');
    });
  });

  describe('languageDetectionService', () => {
    test('should detect language from error message', () => {
      const error1 = { message: 'Error de red ocurrido' };
      const detected1 = detectFromError(error1);
      expect(detected1).toBe('es');

      const error2 = { message: 'Erro de rede ocorrido' };
      const detected2 = detectFromError(error2);
      expect(detected2).toBe('pt');

      const error3 = { message: 'Network error occurred' };
      const detected3 = detectFromError(error3);
      expect(detected3).toBe('en');
    });

    test('should detect region', () => {
      const region = languageDetectionService.detectRegion();
      expect(typeof region).toBe('string');
    });

    test('should get regional fallback', () => {
      const fallback = languageDetectionService.getRegionalFallback('americas');
      expect(fallback).toBe('es');
    });
  });

  describe('integration tests', () => {
    test('should work with multiple languages', () => {
      // Register multiple languages
      registerLocale('es', {
        errors: {
          network: 'Error de red',
          wallet: 'Error de billetera',
        },
      });

      registerLocale('pt', {
        errors: {
          network: 'Erro de rede',
          wallet: 'Erro de carteira',
        },
      });

      const error = { message: 'Network error occurred' };

      // Test Spanish
      const resultEs = translateError(error, { language: 'es' });
      expect(resultEs.message).toBe('Error de red');

      // Test Portuguese
      const resultPt = translateError(error, { language: 'pt' });
      expect(resultPt.message).toBe('Erro de rede');

      // Test English (fallback)
      const resultEn = translateError(error, { language: 'en' });
      expect(resultEn.message).toBe(
        'Network error occurred. Please check your connection.'
      );
    });

    test('should handle missing translations gracefully', () => {
      const error = { message: 'Some unknown error' };
      const result = translateError(error, { language: 'es' });

      expect(result.message).toBeDefined();
      expect(result.translated).toBe(false);
    });
  });
});
