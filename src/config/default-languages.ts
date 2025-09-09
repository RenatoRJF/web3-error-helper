/**
 * Default language configuration for web3-error-helper
 *
 * This module defines the blockchain-focused language metadata and priorities
 * based on actual blockchain market adoption and user base. Follows the same
 * patterns and standards as other configuration modules.
 */

import { LanguageInfo, LanguageCode, createLanguageCode } from '../types/i18n';

// ============================================================================
// Language Metadata Configuration
// ============================================================================

export const DEFAULT_LANGUAGES = {
  // Tier 1: Essential (Strong Blockchain Markets)
  en: {
    name: 'English',
    nativeName: 'English',
    region: 'Global',
    priority: 1,
    blockchainMarket: 'Global standard, all major protocols',
  },
  zh: {
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    region: 'China, Singapore',
    priority: 1,
    blockchainMarket: 'Huge crypto market despite restrictions',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Latin America, Spain, US',
    priority: 1,
    blockchainMarket: 'Growing Latin American DeFi adoption',
  },

  // Tier 2: High Priority (Strong Blockchain Markets)
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil, Portugal, Africa',
    priority: 2,
    blockchainMarket: 'Brazil major crypto market',
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    priority: 2,
    blockchainMarket: 'Major crypto trading hub',
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    region: 'South Korea',
    priority: 2,
    blockchainMarket: 'Very high crypto adoption',
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany, Austria, Switzerland',
    priority: 2,
    blockchainMarket: 'Strong European crypto market',
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Russia, Eastern Europe',
    priority: 2,
    blockchainMarket: 'High crypto adoption',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'India',
    priority: 2,
    blockchainMarket: 'India massive crypto market',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East, North Africa',
    priority: 2,
    blockchainMarket: 'Growing Middle Eastern markets',
  },

  // Tier 3: Growing Markets (Moderate Blockchain Relevance)
  tr: {
    name: 'Turkish',
    nativeName: 'Türkçe',
    region: 'Turkey',
    priority: 3,
    blockchainMarket: 'High crypto adoption',
  },
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    region: 'Vietnam',
    priority: 3,
    blockchainMarket: 'Growing crypto adoption',
  },
  th: {
    name: 'Thai',
    nativeName: 'ไทย',
    region: 'Thailand',
    priority: 3,
    blockchainMarket: 'Growing crypto market',
  },
  id: {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    region: 'Indonesia, Malaysia',
    priority: 3,
    blockchainMarket: 'Large population, growing adoption',
  },
  pl: {
    name: 'Polish',
    nativeName: 'Polski',
    region: 'Poland',
    priority: 3,
    blockchainMarket: 'Growing European market',
  },
  uk: {
    name: 'Ukrainian',
    nativeName: 'Українська',
    region: 'Ukraine',
    priority: 3,
    blockchainMarket: 'Crypto adoption due to conflict',
  },
  he: {
    name: 'Hebrew',
    nativeName: 'עברית',
    region: 'Israel',
    priority: 3,
    blockchainMarket: 'Israel tech/crypto scene',
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    region: 'France, Canada, Africa',
    priority: 3,
    blockchainMarket: 'European market',
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'Italy, Switzerland',
    priority: 3,
    blockchainMarket: 'European market',
  },
  nl: {
    name: 'Dutch',
    nativeName: 'Nederlands',
    region: 'Netherlands, Belgium',
    priority: 3,
    blockchainMarket: 'European market',
  },
} as const;

export type DefaultLanguageCode = keyof typeof DEFAULT_LANGUAGES;

// ============================================================================
// Language Priority Groups
// ============================================================================

export const LANGUAGE_PRIORITY_GROUPS = {
  TIER_1: ['en', 'zh', 'es'] as const,
  TIER_2: ['pt', 'ja', 'ko', 'de', 'ru', 'hi', 'ar'] as const,
  TIER_3: ['tr', 'vi', 'th', 'id', 'pl', 'uk', 'he', 'fr', 'it', 'nl'] as const,
} as const;

// ============================================================================
// Language Utilities
// ============================================================================

/**
 * Get all available language codes
 */
export function getAvailableLanguageCodes(): LanguageCode[] {
  return Object.keys(DEFAULT_LANGUAGES).map(createLanguageCode);
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: string): LanguageInfo | null {
  return DEFAULT_LANGUAGES[code as DefaultLanguageCode] || null;
}

/**
 * Get languages by priority tier
 */
export function getLanguagesByTier(tier: 1 | 2 | 3): string[] {
  switch (tier) {
    case 1:
      return [...LANGUAGE_PRIORITY_GROUPS.TIER_1];
    case 2:
      return [...LANGUAGE_PRIORITY_GROUPS.TIER_2];
    case 3:
      return [...LANGUAGE_PRIORITY_GROUPS.TIER_3];
    default:
      return [];
  }
}

/**
 * Get all languages sorted by priority
 */
export function getLanguagesByPriority(): string[] {
  return [
    ...LANGUAGE_PRIORITY_GROUPS.TIER_1,
    ...LANGUAGE_PRIORITY_GROUPS.TIER_2,
    ...LANGUAGE_PRIORITY_GROUPS.TIER_3,
  ];
}

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(code: string): boolean {
  return code in DEFAULT_LANGUAGES;
}

/**
 * Get similar language codes (e.g., 'en-US' -> 'en')
 */
export function getBaseLanguageCode(code: string): string {
  return code.split('-')[0] || code;
}

/**
 * Find similar languages based on base code
 */
export function findSimilarLanguages(code: string): string[] {
  const baseCode = getBaseLanguageCode(code);
  const similar: string[] = [];

  for (const availableCode of getAvailableLanguageCodes()) {
    if (
      availableCode === baseCode ||
      availableCode.startsWith(`${baseCode}-`)
    ) {
      similar.push(availableCode);
    }
  }

  return similar;
}

/**
 * Get regional language suggestions
 */
export function getRegionalLanguageSuggestions(region: string): string[] {
  const regionalMap: Record<string, string[]> = {
    americas: ['en', 'es', 'pt'],
    europe: ['en', 'de', 'fr', 'it', 'nl', 'pl', 'ru', 'uk'],
    asia: ['en', 'zh', 'ja', 'ko', 'hi', 'th', 'vi', 'id'],
    'middle-east': ['en', 'ar', 'he'],
    africa: ['en', 'fr', 'ar', 'pt'],
    oceania: ['en'],
  };

  return regionalMap[region.toLowerCase()] || ['en'];
}

/**
 * Get blockchain market size estimate
 */
export function getBlockchainMarketSize(
  code: string
): 'large' | 'medium' | 'small' {
  const info = getLanguageInfo(code);
  if (!info) return 'small';

  switch (info.priority) {
    case 1:
      return 'large';
    case 2:
      return 'medium';
    case 3:
      return 'small';
    default:
      return 'small';
  }
}

/**
 * Get language statistics
 */
export function getLanguageStatistics() {
  const total = getAvailableLanguageCodes().length;
  const tier1 = LANGUAGE_PRIORITY_GROUPS.TIER_1.length;
  const tier2 = LANGUAGE_PRIORITY_GROUPS.TIER_2.length;
  const tier3 = LANGUAGE_PRIORITY_GROUPS.TIER_3.length;

  return {
    total,
    tier1,
    tier2,
    tier3,
    coverage: {
      large: tier1,
      medium: tier2,
      small: tier3,
    },
  };
}
