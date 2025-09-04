/**
 * Error category management
 * 
 * This module provides comprehensive management of error categories and their
 * associated mappings. It handles category discovery, statistics, filtering,
 * and search operations. Enables organized access to error mappings by category
 * type and provides utilities for analyzing error pattern distributions.
 */

import { ErrorCategory, SupportedChain, EVMErrorType } from './types';
import { loadErrorCategories } from './mapping-loader';

/**
 * Get error categories from the mapping loader
 */
function getErrorCategoriesData(): ErrorCategory[] {
  return loadErrorCategories();
}

/**
 * Get error categories organized by type for a specific chain
 * 
 * This function returns error mappings organized by category (ERC20, gas, wallet, etc.)
 * rather than as a flat list. This is useful for debugging, analysis, or when you need
 * to work with specific types of errors.
 * 
 * @param chain - The blockchain network to get categories for. Defaults to Ethereum.
 * @returns Array of error categories with their respective mappings
 * 
 * @example
 * ```typescript
 * const categories = getErrorCategories(SupportedChain.ETHEREUM);
 * 
 * // Find all ERC20 errors
 * const erc20Category = categories.find(cat => cat.type === 'erc20');
 * console.log(`Found ${erc20Category?.mappings.length} ERC20 error mappings`);
 * 
 * // Get all gas-related errors
 * const gasCategory = categories.find(cat => cat.type === 'gas');
 * gasCategory?.mappings.forEach(mapping => {
 *   console.log(`${mapping.pattern} -> ${mapping.message}`);
 * });
 * ```
 */
export function getErrorCategories(chain: SupportedChain | string = SupportedChain.ETHEREUM): ErrorCategory[] {
  return getErrorCategoriesData();
}

/**
 * Get a specific error category
 * 
 * @param type - The error category type
 * @param chain - The blockchain network. Defaults to Ethereum.
 * @returns The error category or undefined if not found
 * 
 * @example
 * ```typescript
 * const erc20Category = getErrorCategory('erc20');
 * console.log(`ERC20 mappings: ${erc20Category?.mappings.length}`);
 * ```
 */
export function getErrorCategory(type: EVMErrorType, chain: SupportedChain | string = SupportedChain.ETHEREUM): ErrorCategory | undefined {
  return getErrorCategoriesData().find(category => category.type === type);
}

/**
 * Get all available error category types
 * 
 * @returns Array of available error category types
 * 
 * @example
 * ```typescript
 * const types = getAvailableCategoryTypes();
 * console.log(types); // ['erc20', 'gas', 'wallet', 'network', 'transaction', 'contract', 'evm']
 * ```
 */
export function getAvailableCategoryTypes(): EVMErrorType[] {
  return getErrorCategoriesData().map(category => category.type);
}

/**
 * Get error category statistics
 * 
 * @param chain - The blockchain network. Defaults to Ethereum.
 * @returns Object with category statistics
 * 
 * @example
 * ```typescript
 * const stats = getCategoryStats();
 * console.log(`Total categories: ${stats.total}`);
 * console.log(`Total mappings: ${stats.totalMappings}`);
 * ```
 */
export function getCategoryStats(chain: SupportedChain | string = SupportedChain.ETHEREUM): {
  total: number;
  totalMappings: number;
  categories: Array<{ type: EVMErrorType; count: number }>;
} {
  const categories = getErrorCategories(chain);
  const totalMappings = categories.reduce((sum, category) => sum + category.mappings.length, 0);
  
  return {
    total: categories.length,
    totalMappings,
    categories: categories.map(category => ({
      type: category.type,
      count: category.mappings.length
    }))
  };
}

/**
 * Check if an error category exists
 * 
 * @param type - The error category type to check
 * @returns true if the category exists
 */
export function hasErrorCategory(type: EVMErrorType): boolean {
  return getErrorCategoriesData().some(category => category.type === type);
}

/**
 * Get error mappings for a specific category
 * 
 * @param type - The error category type
 * @param chain - The blockchain network. Defaults to Ethereum.
 * @returns Array of error mappings for the category
 * 
 * @example
 * ```typescript
 * const erc20Mappings = getCategoryMappings('erc20');
 * console.log(`Found ${erc20Mappings.length} ERC20 error mappings`);
 * ```
 */
export function getCategoryMappings(type: EVMErrorType, chain: SupportedChain | string = SupportedChain.ETHEREUM) {
  const category = getErrorCategory(type, chain);
  return category?.mappings || [];
}

/**
 * Search error mappings across all categories
 * 
 * @param searchTerm - The term to search for in patterns or messages
 * @param chain - The blockchain network. Defaults to Ethereum.
 * @returns Array of matching error mappings
 * 
 * @example
 * ```typescript
 * const gasErrors = searchMappings('gas');
 * console.log(`Found ${gasErrors.length} gas-related errors`);
 * ```
 */
export function searchMappings(searchTerm: string, chain: SupportedChain | string = SupportedChain.ETHEREUM) {
  const categories = getErrorCategories(chain);
  const results: Array<{ category: EVMErrorType; mapping: any }> = [];
  
  categories.forEach(category => {
    category.mappings.forEach(mapping => {
      if (
        mapping.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.message.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        results.push({ category: category.type, mapping });
      }
    });
  });
  
  return results;
}
