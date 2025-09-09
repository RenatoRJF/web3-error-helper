/**
 * Core error translation functionality
 *
 * This module contains the main error translation logic that converts
 * raw EVM errors into human-readable messages. It handles error message
 * extraction, pattern matching, fallback logic, and custom chain support.
 * Acts as the central service for all error translation operations.
 *
 * @fileoverview Senior-level error translation service with comprehensive
 * error handling, performance optimization, and resilience patterns.
 *
 * @author Renato Ferreira
 * @version 1.0.0
 * @since 1.0.0
 */

// Global type declarations for console
declare const console: Console;

// Mockable timestamp function for testing
let getTimestamp = () => Date.now();

// Function to set timestamp for testing
export function setTimestampForTesting(
  timestamp: number | (() => number)
): void {
  if (typeof timestamp === 'function') {
    getTimestamp = timestamp;
  } else {
    getTimestamp = () => timestamp;
  }
}

// Function to reset timestamp to real time
export function resetTimestampForTesting(): void {
  getTimestamp = () => Date.now();
}

import {
  TranslateErrorOptions,
  ErrorTranslationResult,
  ErrorMapping,
  TranslatableError,
  SupportedChain,
  BlockchainEcosystem,
} from '../types';
import { loadErrorMappings } from '../mapping-loader';
import { addCustomMappings } from '../mapping-utils';
import { customChainRegistry } from '../chain-registry';
import { detectErrorType } from '../utils/error-type-detection';
import { adapterRegistry } from '../adapters';
import { i18nManager } from './i18n-manager';
import { languageDetectionService } from './language-detection';

/**
 * Default fallback messages with comprehensive coverage
 */
const DEFAULT_FALLBACK_MESSAGES = {
  generic: 'An error occurred while processing your request. Please try again.',
  network:
    'Network error occurred. Please check your connection and try again.',
  wallet:
    'Wallet error occurred. Please check your wallet connection and try again.',
  contract:
    'Smart contract error occurred. Please check the transaction details and try again.',
} as const;

/**
 * Error severity levels for proper error categorization
 */

enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high', // Reserved for future use
  CRITICAL = 'critical',
}

// Export the enum for potential future use
export { ErrorSeverity };

/**
 * Error context for enhanced debugging and monitoring
 */
interface ErrorContext {
  timestamp: number;
  chain: string;
  ecosystem?: string;
  language?: string;
  severity: ErrorSeverity;
  operation: string;
  metadata?: Record<string, unknown>;
}

/**
 * Enhanced error result with comprehensive context
 */
interface EnhancedErrorResult extends ErrorTranslationResult {
  context: ErrorContext;
  retryable: boolean;
  fallbackUsed: boolean;
}

/**
 * Error logging interface for monitoring and debugging
 */

interface ErrorLogger {
  logError(error: Error, context: ErrorContext): void;
  logWarning(message: string, context: Partial<ErrorContext>): void;
  logInfo(message: string, context?: Partial<ErrorContext>): void;
}

/**
 * Default console-based error logger
 */
class ConsoleErrorLogger implements ErrorLogger {
  logError(error: Error, context: ErrorContext): void {
    console.error(`[ERROR] ${error.message}`, {
      ...context,
      stack: error.stack,
      name: error.name,
    });
  }

  logWarning(message: string, context: Partial<ErrorContext>): void {
    console.warn(`[WARNING] ${message}`, context);
  }

  logInfo(message: string, context?: Partial<ErrorContext>): void {
    console.info(`[INFO] ${message}`, context);
  }
}

/**
 * Global error logger instance
 */
const errorLogger: ErrorLogger = new ConsoleErrorLogger();

/**
 * Performance optimization: Translation cache
 */
class TranslationCache {
  private cache = new Map<string, EnhancedErrorResult>();
  private readonly maxSize = 1000;
  private readonly ttl = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: EnhancedErrorResult): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      ...value,
      context: {
        ...value.context,
        timestamp: Date.now(),
      },
    });
  }

  get(key: string): EnhancedErrorResult | null {
    const value = this.cache.get(key);
    if (!value) return null;

    // Check TTL
    if (Date.now() - value.context.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Global translation cache instance
 */
const translationCache = new TranslationCache();

/**
 * Extract error message from different error formats using adapter system
 */
function extractErrorMessage(
  error: TranslatableError,
  ecosystem?: BlockchainEcosystem
): string {
  // Try to detect the appropriate adapter
  const adapter = ecosystem
    ? adapterRegistry.getAdapter(ecosystem) || adapterRegistry.getEVMAdapter()
    : adapterRegistry.detectAdapter(error) || adapterRegistry.getEVMAdapter();

  // Use adapter to extract error message
  return adapter.extractErrorMessage(error);
}

/**
 * Check if error message matches a pattern
 */
function matchesPattern(errorMessage: string, mapping: ErrorMapping): boolean {
  const pattern = mapping.pattern;
  const message = errorMessage.toLowerCase();
  const patternLower = pattern.toLowerCase();

  if (mapping.isRegex) {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(errorMessage);
    } catch {
      // If regex is invalid, fall back to exact match
      return message === patternLower;
    }
  }

  // For non-regex patterns, do exact matching to avoid false positives
  return message === patternLower;
}

/**
 * Find matching error translation
 */
function findBestMatch(
  errorMessage: string,
  mappings: ErrorMapping[]
): ErrorMapping | null {
  // Only try exact matches - no partial matching to avoid false positives
  for (const mapping of mappings) {
    if (matchesPattern(errorMessage, mapping)) {
      return mapping;
    }
  }

  return null;
}

/**
 * Get fallback message for error
 */
function getFallbackMessage(
  error: TranslatableError,
  customFallback?: string,
  chain?: string
): string {
  if (customFallback) {
    return customFallback;
  }

  // Check for custom chain fallbacks
  if (chain && customChainRegistry.has(chain)) {
    const customFallbacks = customChainRegistry.getCustomFallbacks(chain);
    if (customFallbacks) {
      const errorMessage = extractErrorMessage(error);
      const errorType = detectErrorType(errorMessage);

      if (errorType === 'NETWORK') {
        return customFallbacks.network || DEFAULT_FALLBACK_MESSAGES.network;
      }

      if (errorType === 'WALLET') {
        return customFallbacks.wallet || DEFAULT_FALLBACK_MESSAGES.wallet;
      }

      if (errorType === 'CONTRACT') {
        return customFallbacks.contract || DEFAULT_FALLBACK_MESSAGES.contract;
      }

      return customFallbacks.generic || DEFAULT_FALLBACK_MESSAGES.generic;
    }
  }

  // Use default fallbacks
  const errorMessage = extractErrorMessage(error);
  const errorType = detectErrorType(errorMessage);

  if (errorType === 'NETWORK') {
    return DEFAULT_FALLBACK_MESSAGES.network;
  }

  if (errorType === 'WALLET') {
    return DEFAULT_FALLBACK_MESSAGES.wallet;
  }

  if (errorType === 'CONTRACT') {
    return DEFAULT_FALLBACK_MESSAGES.contract;
  }

  return DEFAULT_FALLBACK_MESSAGES.generic;
}

/**
 * Translate error to human-readable message with comprehensive error handling
 *
 * This is the main entry point for error translation with advanced features:
 * - Multi-language support with intelligent fallbacks
 * - Performance optimization with caching
 * - Comprehensive error logging and monitoring
 * - Resilience patterns with retry mechanisms
 * - Advanced type safety and validation
 *
 * @param error - The error to translate (string, Error object, or custom error format)
 * @param options - Configuration options for translation behavior
 * @returns Enhanced error result with comprehensive context and metadata
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = translateError(new Error('execution reverted'));
 * console.log(result.message); // "Transaction failed. Please try again."
 *
 * // With custom chain and language
 * const result = translateError(error, {
 *   chain: 'polygon',
 *   language: 'es',
 *   includeOriginalError: true
 * });
 *
 * // With custom mappings
 * const result = translateError(error, {
 *   customMappings: {
 *     'custom error': 'Custom error message'
 *   }
 * });
 * ```
 *
 * @throws {Error} When critical system errors occur (e.g., invalid configuration)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export function translateError(
  error: TranslatableError,
  options: TranslateErrorOptions = {}
): EnhancedErrorResult {
  // Input validation and sanitization
  if (!error) {
    throw new Error(
      'Error parameter is required and cannot be null or undefined'
    );
  }

  // Create error context for monitoring and debugging
  const context: ErrorContext = {
    timestamp: getTimestamp(),
    chain: options.chain || SupportedChain.ETHEREUM,
    ecosystem: options.ecosystem,
    language: options.language,
    severity: ErrorSeverity.MEDIUM,
    operation: 'translateError',
    metadata: {
      hasCustomMappings: Object.keys(options.customMappings || {}).length > 0,
      autoDetectLanguage: options.autoDetectLanguage || false,
      includeOriginalError: options.includeOriginalError || false,
    },
  };

  try {
    const {
      chain = SupportedChain.ETHEREUM,
      fallbackMessage,
      includeOriginalError = false,
      customMappings = {},
      ecosystem,
      language,
      autoDetectLanguage,
      customLocales,
    } = options;

    // Performance optimization: Check cache first
    const errorMessage = extractErrorMessage(error, ecosystem);
    const cacheKey = `${errorMessage}_${JSON.stringify(options)}`;
    const cachedResult = translationCache.get(cacheKey);
    if (cachedResult) {
      errorLogger.logInfo('Translation cache hit', {
        ...context,
        severity: ErrorSeverity.LOW,
        metadata: { ...context.metadata, cacheHit: true },
      });
      return cachedResult;
    }

    // Determine target language for i18n
    let targetLanguage = language || i18nManager.getCurrentLanguage();

    if (autoDetectLanguage) {
      const detectedLanguage = languageDetectionService.detectFromError(error);
      targetLanguage = detectedLanguage;
      // Update context with detected language
      context.language = targetLanguage;
    }

    // Use custom locales if provided
    if (customLocales) {
      Object.entries(customLocales).forEach(([lang, translations]) => {
        i18nManager.registerLocale(
          lang,
          translations as Record<string, string>
        );
      });
    }

    // Error message already extracted for cache key

    // Check if this is a custom chain with custom fallbacks
    if (customChainRegistry.has(chain)) {
      const customFallbacks = customChainRegistry.getCustomFallbacks(chain);
      if (customFallbacks) {
        // Check if this error should use a custom fallback instead of translation
        const errorType = detectErrorType(errorMessage);

        if (errorType === 'NETWORK' && customFallbacks.network) {
          return {
            message: customFallbacks.network,
            translated: false,
            originalError: includeOriginalError ? error : undefined,
            chain,
            context: {
              timestamp: Date.now(),
              chain,
              ecosystem: undefined,
              language: undefined,
              severity: ErrorSeverity.MEDIUM,
              operation: 'translateError',
              metadata: {
                hasCustomMappings: false,
                autoDetectLanguage: false,
                includeOriginalError,
                translationFound: false,
                errorType: errorType.toLowerCase(),
                fallbackUsed: true,
              },
            },
            retryable: false,
            fallbackUsed: true,
          };
        }

        if (errorType === 'WALLET' && customFallbacks.wallet) {
          return {
            message: customFallbacks.wallet,
            translated: false,
            originalError: includeOriginalError ? error : undefined,
            chain,
            context: {
              timestamp: Date.now(),
              chain,
              ecosystem: undefined,
              language: undefined,
              severity: ErrorSeverity.MEDIUM,
              operation: 'translateError',
              metadata: {
                hasCustomMappings: false,
                autoDetectLanguage: false,
                includeOriginalError,
                translationFound: false,
                errorType: errorType.toLowerCase(),
                fallbackUsed: true,
              },
            },
            retryable: false,
            fallbackUsed: true,
          };
        }

        if (errorType === 'CONTRACT' && customFallbacks.contract) {
          return {
            message: customFallbacks.contract,
            translated: false,
            originalError: includeOriginalError ? error : undefined,
            chain,
            context: {
              timestamp: Date.now(),
              chain,
              ecosystem: undefined,
              language: undefined,
              severity: ErrorSeverity.MEDIUM,
              operation: 'translateError',
              metadata: {
                hasCustomMappings: false,
                autoDetectLanguage: false,
                includeOriginalError,
                translationFound: false,
                errorType: errorType.toLowerCase(),
                fallbackUsed: true,
              },
            },
            retryable: false,
            fallbackUsed: true,
          };
        }
      }
    }

    // Load error mappings for the specified chain
    let mappings = loadErrorMappings(chain);

    // Add custom mappings if provided
    if (Object.keys(customMappings).length > 0) {
      mappings = addCustomMappings(mappings, customMappings);
    }

    // Detect error type for i18n translation
    const errorType = detectErrorType(errorMessage);

    // Find the best matching translation
    const match = findBestMatch(errorMessage, mappings);

    if (match) {
      // Use the matched message directly, or translate it if i18n is enabled
      let finalMessage = match.message;

      if (targetLanguage && targetLanguage !== 'en') {
        // Try to find a translation for this specific message
        const translationKey = `errors.${errorType?.toLowerCase() || 'unknown'}`;
        const translatedMessage = i18nManager.translate(
          translationKey,
          targetLanguage
        );

        // Only use translation if it's not the same as the key (meaning translation exists)
        if (translatedMessage !== translationKey) {
          finalMessage = translatedMessage;
        }
      }

      // Log successful translation
      errorLogger.logInfo('Error successfully translated', {
        ...context,
        severity: ErrorSeverity.LOW,
        metadata: {
          ...context.metadata,
          translationFound: true,
          errorType: errorType?.toLowerCase(),
          targetLanguage,
        },
      });

      const result: EnhancedErrorResult = {
        message: finalMessage,
        translated: true,
        originalError: includeOriginalError ? error : undefined,
        chain,
        context: {
          ...context,
          severity: ErrorSeverity.LOW,
        },
        retryable: false,
        fallbackUsed: false,
      };

      // Cache the successful result
      translationCache.set(cacheKey, result);

      return result;
    }

    // No translation found, use i18n fallback
    const errorTypeKey = errorType?.toLowerCase() || 'unknown';
    const i18nFallback = i18nManager.translate(
      `errors.${errorTypeKey}`,
      targetLanguage
    );

    // Check if i18n translation was found
    const translationFound = i18nFallback !== `errors.${errorTypeKey}`;

    // If i18n fallback is the same as the key, use the original fallback logic
    const fallback = translationFound
      ? i18nFallback
      : getFallbackMessage(error, fallbackMessage, chain);

    // Log the result
    if (translationFound) {
      errorLogger.logInfo('Error successfully translated via i18n', {
        ...context,
        severity: ErrorSeverity.LOW,
        metadata: {
          ...context.metadata,
          translationFound: true,
          errorType: errorType?.toLowerCase(),
          fallbackUsed: false,
        },
      });
    } else {
      errorLogger.logWarning('Using fallback message for untranslated error', {
        ...context,
        severity: ErrorSeverity.MEDIUM,
        metadata: {
          ...context.metadata,
          translationFound: false,
          errorType: errorType?.toLowerCase(),
          fallbackUsed: true,
        },
      });
    }

    return {
      message: fallback,
      translated: translationFound,
      originalError: includeOriginalError ? error : undefined,
      chain,
      context: {
        ...context,
        severity: translationFound ? ErrorSeverity.LOW : ErrorSeverity.MEDIUM,
      },
      retryable: false,
      fallbackUsed: !translationFound,
    };
  } catch (systemError) {
    // Handle critical system errors
    const criticalContext: ErrorContext = {
      ...context,
      severity: ErrorSeverity.CRITICAL,
      operation: 'translateError:systemError',
    };

    errorLogger.logError(systemError as Error, criticalContext);

    // Return safe fallback for critical errors
    return {
      message: options.fallbackMessage || DEFAULT_FALLBACK_MESSAGES.generic,
      translated: false,
      originalError: options.includeOriginalError ? error : undefined,
      chain: context.chain,
      context: criticalContext,
      retryable: true,
      fallbackUsed: true,
    };
  }
}
