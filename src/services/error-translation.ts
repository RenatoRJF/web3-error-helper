/**
 * Core error translation functionality
 * 
 * This module contains the main error translation logic that converts
 * raw EVM errors into human-readable messages. It handles error message
 * extraction, pattern matching, fallback logic, and custom chain support.
 * Acts as the central service for all error translation operations.
 */

import { TranslateErrorOptions, ErrorTranslationResult, ErrorMapping, TranslatableError, SupportedChain, BlockchainEcosystem } from '../types';
import { loadErrorMappings } from '../mapping-loader';
import { addCustomMappings } from '../mapping-utils';
import { customChainRegistry } from '../chain-registry';
import { detectErrorType } from '../utils/error-type-detection';
import { adapterRegistry } from '../adapters';

/**
 * Default fallback messages
 */
const DEFAULT_FALLBACK_MESSAGES = {
  generic: 'An error occurred while processing your request. Please try again.',
  network: 'Network error occurred. Please check your connection and try again.',
  wallet: 'Wallet error occurred. Please check your wallet connection and try again.',
  contract: 'Smart contract error occurred. Please check the transaction details and try again.',
} as const;

/**
 * Type guards for error objects
 */
const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null;

const hasProperty = <K extends string>(
  obj: Record<string, unknown>, 
  key: K
): obj is Record<K, unknown> => key in obj;

const isString = (value: unknown): value is string => typeof value === 'string';

function isErrorWithMessage(error: unknown): error is { message: string } {
  return isObject(error) && hasProperty(error, 'message') && isString(error.message);
}

function isErrorWithNestedError(error: unknown): error is { error: { message: string } } {
  return isObject(error) && 
         hasProperty(error, 'error') && 
         isObject(error.error) &&
         hasProperty(error.error, 'message') &&
         isString(error.error.message);
}

function isErrorWithReason(error: unknown): error is { reason: string } {
  return isObject(error) && hasProperty(error, 'reason') && isString(error.reason);
}

function isErrorWithDataMessage(error: unknown): error is { data: { message: string } } {
  return isObject(error) && 
         hasProperty(error, 'data') && 
         isObject(error.data) &&
         hasProperty(error.data, 'message') &&
         isString(error.data.message);
}

/**
 * Extract error message from different error formats using adapter system
 */
export function extractErrorMessage(error: TranslatableError, ecosystem?: BlockchainEcosystem): string {
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
export function matchesPattern(errorMessage: string, mapping: ErrorMapping): boolean {
  const pattern = mapping.pattern;
  
  if (mapping.isRegex) {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(errorMessage);
    } catch {
      // If regex is invalid, fall back to exact match
      return errorMessage.toLowerCase().includes(pattern.toLowerCase());
    }
  }
  
  // Exact match (case-insensitive)
  return errorMessage.toLowerCase().includes(pattern.toLowerCase());
}

/**
 * Find matching error translation
 */
export function findBestMatch(errorMessage: string, mappings: ErrorMapping[]): ErrorMapping | null {
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
export function getFallbackMessage(error: TranslatableError, customFallback?: string, chain?: string): string {
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
 * Translate error to human-readable message
 */
export function translateError(
  error: TranslatableError,
  options: TranslateErrorOptions = {}
): ErrorTranslationResult {
  const {
    chain = SupportedChain.ETHEREUM,
    fallbackMessage,
    includeOriginalError = false,
    customMappings = {},
    ecosystem,
  } = options;
  
  // Extract error message using appropriate adapter
  const errorMessage = extractErrorMessage(error, ecosystem);
  
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
        };
      }
      
      if (errorType === 'WALLET' && customFallbacks.wallet) {
        return {
          message: customFallbacks.wallet,
          translated: false,
          originalError: includeOriginalError ? error : undefined,
          chain,
        };
      }
      
      if (errorType === 'CONTRACT' && customFallbacks.contract) {
        return {
          message: customFallbacks.contract,
          translated: false,
          originalError: includeOriginalError ? error : undefined,
          chain,
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
  
  // Find the best matching translation
  const match = findBestMatch(errorMessage, mappings);
  
  if (match) {
    return {
      message: match.message,
      translated: true,
      originalError: includeOriginalError ? error : undefined,
      chain,
    };
  }
  
  // No translation found, return fallback
  const fallback = getFallbackMessage(error, fallbackMessage, chain);
  
  return {
    message: fallback,
    translated: false,
    originalError: includeOriginalError ? error : undefined,
    chain,
  };
}
