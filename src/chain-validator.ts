/**
 * Chain validation utilities
 * 
 * This module provides comprehensive validation functions for chain identifiers
 * and configurations across both built-in and custom chains. It focuses solely
 * on validation logic without side effects, ensuring data integrity and
 * providing detailed validation results for debugging and error handling.
 */

import { isBuiltInChain } from './built-in-chain-manager';
import { customChainRegistry } from './chain-registry';

/**
 * Validate if a chain identifier is valid
 * 
 * @param chain - The chain identifier to validate
 * @returns true if the chain is valid (built-in or custom)
 * 
 * @example
 * ```typescript
 * if (isValidChain('ethereum')) {
 *   console.log('Valid chain');
 * }
 * 
 * if (isValidChain('invalid-chain')) {
 *   console.log('This will not execute');
 * }
 * ```
 */
export function isValidChain(chain: string): boolean {
  if (!chain || typeof chain !== 'string') {
    return false;
  }
  
  return isBuiltInChain(chain) || customChainRegistry.has(chain);
}

/**
 * Validate chain identifier format
 * 
 * @param chain - The chain identifier to validate
 * @returns true if the format is valid
 * 
 * @example
 * ```typescript
 * isValidChainFormat('ethereum'); // true
 * isValidChainFormat('my-chain'); // true
 * isValidChainFormat(''); // false
 * isValidChainFormat('chain with spaces'); // false
 * ```
 */
export function isValidChainFormat(chain: string): boolean {
  if (!chain || typeof chain !== 'string') {
    return false;
  }
  
  // Allow alphanumeric characters, hyphens, underscores, and dots
  const validFormat = /^[a-zA-Z0-9._-]+$/.test(chain);
  const notEmpty = chain.trim().length > 0;
  
  return validFormat && notEmpty;
}

/**
 * Get validation errors for a chain identifier
 * 
 * @param chain - The chain identifier to validate
 * @returns Array of validation error messages, empty if valid
 * 
 * @example
 * ```typescript
 * const errors = getChainValidationErrors('invalid chain');
 * if (errors.length > 0) {
 *   console.log('Validation errors:', errors);
 * }
 * ```
 */
export function getChainValidationErrors(chain: string): string[] {
  const errors: string[] = [];
  
  if (!chain) {
    errors.push('Chain identifier is required');
    return errors;
  }
  
  if (typeof chain !== 'string') {
    errors.push('Chain identifier must be a string');
    return errors;
  }
  
  if (!isValidChainFormat(chain)) {
    errors.push('Chain identifier contains invalid characters. Use only alphanumeric characters, hyphens, underscores, and dots');
  }
  
  if (chain.trim().length === 0) {
    errors.push('Chain identifier cannot be empty');
  }
  
  return errors;
}
