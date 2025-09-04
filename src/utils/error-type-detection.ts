/**
 * Error type detection utilities
 * 
 * This module provides intelligent error type classification based on
 * error message content. It uses keyword matching to automatically
 * categorize errors into specific types (wallet, network, contract, etc.)
 * for better fallback message selection and error handling.
 */

import { ERROR_TYPE_KEYWORDS, ErrorType } from '../types';

/**
 * Detect error type based on error message keywords
 */
export function detectErrorType(errorMessage: string): ErrorType | null {
  const message = errorMessage.toLowerCase();
  
  for (const [errorType, keywords] of Object.entries(ERROR_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return errorType as ErrorType;
    }
  }
  
  return null;
}

/**
 * Check if error message contains specific error type keywords
 */
export function isErrorType(errorMessage: string, errorType: ErrorType): boolean {
  const message = errorMessage.toLowerCase();
  const keywords = ERROR_TYPE_KEYWORDS[errorType];
  return keywords.some(keyword => message.includes(keyword));
}

/**
 * Get all error types that match the error message
 */
export function getMatchingErrorTypes(errorMessage: string): ErrorType[] {
  const message = errorMessage.toLowerCase();
  const matchingTypes: ErrorType[] = [];
  
  for (const [errorType, keywords] of Object.entries(ERROR_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      matchingTypes.push(errorType as ErrorType);
    }
  }
  
  return matchingTypes;
}
