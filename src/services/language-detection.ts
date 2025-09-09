/**
 * Language detection utilities
 *
 * This module provides intelligent language detection from browser settings,
 * error messages, and regional context. It follows the same patterns and
 * standards as other service modules in the codebase.
 */

import { LanguageDetectionService as LanguageDetectionServiceInterface } from '../types/i18n';
import { TranslatableError } from '../types';

// Global type declarations for browser environment
declare const window: Window & typeof globalThis;
declare const console: Console;

/**
 * Language detection service implementation
 */
class LanguageDetectionService implements LanguageDetectionServiceInterface {
  private supportedLanguages: string[];

  constructor(supportedLanguages: string[] = []) {
    this.supportedLanguages = supportedLanguages;
  }

  /**
   * Detect language from browser with smart fallback
   */
  detectFromBrowser(): string {
    // Check if we're in a browser environment
    if (
      typeof window === 'undefined' ||
      typeof window.navigator === 'undefined'
    ) {
      return 'en'; // Server-side fallback
    }

    const browserLanguages = window.navigator.languages || [
      window.navigator.language,
    ];

    // Try to find the first supported language
    for (const browserLang of browserLanguages) {
      const langCode = browserLang.split('-')[0] || browserLang; // 'en-US' -> 'en'

      if (this.supportedLanguages.includes(langCode)) {
        return langCode;
      }
    }

    // Smart fallback based on region
    const region = this.detectRegion();
    const regionalFallback = this.getRegionalFallback(region);

    if (this.supportedLanguages.includes(regionalFallback)) {
      return regionalFallback;
    }

    // Final fallback to English
    return 'en';
  }

  /**
   * Detect language from error message content
   */
  detectFromError(error: unknown): string {
    const message = this.extractMessage(error);

    // Try to detect language from error message content
    for (const lang of this.supportedLanguages) {
      if (this.containsLanguageKeywords(message, lang)) {
        return lang;
      }
    }

    return 'en'; // Default fallback
  }

  /**
   * Detect region from timezone
   */
  detectRegion(): string {
    try {
      // Check if we're in a browser environment
      if (typeof Intl === 'undefined') {
        return 'global';
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (
        timezone.includes('Asia/Shanghai') ||
        timezone.includes('Asia/Beijing')
      ) {
        return 'china';
      } else if (timezone.includes('America/')) {
        return 'americas';
      } else if (timezone.includes('Europe/')) {
        return 'europe';
      } else if (timezone.includes('Africa/')) {
        return 'africa';
      } else if (timezone.includes('Asia/')) {
        return 'asia';
      } else if (
        timezone.includes('Pacific/') ||
        timezone.includes('Australia/')
      ) {
        return 'oceania';
      }

      return 'global';
    } catch (error) {
      console.warn('Failed to detect region from timezone:', error);
      return 'global';
    }
  }

  /**
   * Get regional fallback language
   */
  getRegionalFallback(region: string): string {
    const regionalFallbacks: Record<string, string> = {
      china: 'zh',
      americas: 'es', // Spanish for Latin America
      europe: 'fr', // French for Europe
      africa: 'fr', // French for Africa
      asia: 'ja', // Japanese for Asia
      oceania: 'en', // English for Oceania
      global: 'en',
    };

    return regionalFallbacks[region] || 'en';
  }

  /**
   * Extract message from error object
   */
  private extractMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object' && error !== null) {
      // Try common error message properties
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }

      if (
        'error' in error &&
        typeof error.error === 'object' &&
        error.error !== null
      ) {
        if (
          'message' in error.error &&
          typeof error.error.message === 'string'
        ) {
          return error.error.message;
        }
      }

      if ('reason' in error && typeof error.reason === 'string') {
        return error.reason;
      }

      if (
        'data' in error &&
        typeof error.data === 'object' &&
        error.data !== null
      ) {
        if ('message' in error.data && typeof error.data.message === 'string') {
          return error.data.message;
        }
      }
    }

    return '';
  }

  /**
   * Check if message contains language-specific keywords
   */
  private containsLanguageKeywords(message: string, language: string): boolean {
    const keywords = this.getLanguageKeywords(language);
    const messageLower = message.toLowerCase();

    return keywords.some(keyword => messageLower.includes(keyword));
  }

  /**
   * Get language-specific keywords for detection
   */
  private getLanguageKeywords(language: string): string[] {
    const keywordMap: Record<string, string[]> = {
      es: [
        'falló',
        'ocurrió',
        'ocurrido',
        'por favor',
        'verifica',
        'conexión',
        'billetera',
        'error de red',
      ],
      fr: [
        'erreur',
        'échec',
        'survenue',
        'veuillez',
        'vérifier',
        'connexion',
        'portefeuille',
      ],
      de: [
        'fehler',
        'aufgetreten',
        'bitte',
        'überprüfen',
        'verbindung',
        'brieftasche',
      ],
      zh: ['错误', '失败', '发生', '请', '检查', '连接', '钱包'],
      ja: ['エラー', '失敗', '発生', 'ください', '確認', '接続', 'ウォレット'],
      ko: ['오류', '실패', '발생', '해주세요', '확인', '연결', '지갑'],
      pt: [
        'falhou',
        'ocorreu',
        'ocorrido',
        'por favor',
        'verificar',
        'conexão',
        'carteira',
        'erro de rede',
      ],
      ru: [
        'ошибка',
        'неудача',
        'произошла',
        'пожалуйста',
        'проверить',
        'соединение',
        'кошелек',
      ],
      ar: ['خطأ', 'فشل', 'حدث', 'يرجى', 'تحقق', 'اتصال', 'محفظة'],
      hi: ['त्रुटि', 'असफल', 'हुई', 'कृपया', 'जांचें', 'कनेक्शन', 'वॉलेट'],
      tr: [
        'hata',
        'başarısız',
        'oluştu',
        'lütfen',
        'kontrol',
        'bağlantı',
        'cüzdan',
      ],
      vi: [
        'lỗi',
        'thất bại',
        'xảy ra',
        'vui lòng',
        'kiểm tra',
        'kết nối',
        'ví',
      ],
      th: [
        'ข้อผิดพลาด',
        'ล้มเหลว',
        'เกิดขึ้น',
        'กรุณา',
        'ตรวจสอบ',
        'การเชื่อมต่อ',
        'กระเป๋าเงิน',
      ],
      id: [
        'kesalahan',
        'gagal',
        'terjadi',
        'silakan',
        'periksa',
        'koneksi',
        'dompet',
      ],
      pl: [
        'błąd',
        'niepowodzenie',
        'wystąpił',
        'proszę',
        'sprawdź',
        'połączenie',
        'portfel',
      ],
      uk: [
        'помилка',
        'невдача',
        'сталася',
        'будь ласка',
        'перевірте',
        "з'єднання",
        'гаманець',
      ],
      he: ['שגיאה', 'כישלון', 'אירעה', 'אנא', 'בדוק', 'חיבור', 'ארנק'],
      it: [
        'errore',
        'fallito',
        'si è verificato',
        'per favore',
        'controlla',
        'connessione',
        'portafoglio',
      ],
      nl: [
        'fout',
        'mislukt',
        'opgetreden',
        'alstublieft',
        'controleren',
        'verbinding',
        'portemonnee',
      ],
    };

    return keywordMap[language] || [];
  }

  /**
   * Detect language from multiple sources with priority
   */
  detectFromMultipleSources(sources: {
    browser?: boolean;
    error?: TranslatableError;
    region?: boolean;
    userPreference?: string;
  }): string {
    // Priority order: user preference > error message > browser > region

    if (
      sources.userPreference &&
      this.supportedLanguages.includes(sources.userPreference)
    ) {
      return sources.userPreference;
    }

    if (sources.error) {
      const detectedFromError = this.detectFromError(sources.error);
      if (detectedFromError !== 'en') {
        return detectedFromError;
      }
    }

    if (sources.browser) {
      const detectedFromBrowser = this.detectFromBrowser();
      if (detectedFromBrowser !== 'en') {
        return detectedFromBrowser;
      }
    }

    if (sources.region) {
      const region = this.detectRegion();
      const regionalFallback = this.getRegionalFallback(region);
      if (this.supportedLanguages.includes(regionalFallback)) {
        return regionalFallback;
      }
    }

    return 'en'; // Final fallback
  }

  /**
   * Get language confidence score (0-1)
   */
  getLanguageConfidence(message: string, language: string): number {
    const keywords = this.getLanguageKeywords(language);
    const messageLower = message.toLowerCase();

    let matches = 0;
    for (const keyword of keywords) {
      if (messageLower.includes(keyword)) {
        matches++;
      }
    }

    return Math.min(matches / keywords.length, 1);
  }

  /**
   * Get all possible languages for a message with confidence scores
   */
  getAllPossibleLanguages(
    message: string
  ): Array<{ language: string; confidence: number }> {
    const results: Array<{ language: string; confidence: number }> = [];

    for (const language of this.supportedLanguages) {
      const confidence = this.getLanguageConfidence(message, language);
      if (confidence > 0) {
        results.push({ language, confidence });
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Update supported languages list
   */
  updateSupportedLanguages(languages: string[]): void {
    this.supportedLanguages = languages;
  }

  /**
   * Get current supported languages
   */
  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }
}

/**
 * Singleton instance of the language detection service
 */
export const languageDetectionService = new LanguageDetectionService([
  'en',
  'es',
  'pt',
  'fr',
  'de',
  'zh',
  'ja',
  'ko',
  'ru',
  'ar',
  'hi',
  'tr',
  'vi',
  'th',
  'id',
  'pl',
  'uk',
  'he',
  'it',
  'nl',
]);

// Export individual functions for convenience
export const detectFromBrowser = () =>
  languageDetectionService.detectFromBrowser();

export const detectFromError = (error: unknown) =>
  languageDetectionService.detectFromError(error);

export const detectRegion = () => languageDetectionService.detectRegion();

export const getRegionalFallback = (region: string) =>
  languageDetectionService.getRegionalFallback(region);
