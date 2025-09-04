/**
 * Error mapping loader
 * 
 * This module handles loading and managing error mappings from JSON files
 * and custom chain configurations. It provides functions to load mappings
 * for specific chains, categories, and handles the priority-based sorting
 * of error patterns for optimal matching performance.
 */

import { ErrorMapping, ChainErrorMappings, SupportedChain, EVMErrorType } from './types';
import { customChainRegistry } from './chain-registry';
import { getEnabledErrorCategories } from './data/chain-registry';

// Import error mappings
import * as evmMappings from './errors/evm.json';
import * as gasMappings from './errors/gas.json';
import * as erc20Mappings from './errors/erc20.json';
import * as walletMappings from './errors/wallet.json';
import * as networkMappings from './errors/network.json';
import * as contractMappings from './errors/contract.json';
import * as transactionMappings from './errors/transaction.json';

/**
 * Error category mappings
 */
const ERROR_CATEGORY_MAPPINGS: Record<string, ChainErrorMappings> = {
  erc20: erc20Mappings as ChainErrorMappings,
  gas: gasMappings as ChainErrorMappings,
  wallet: walletMappings as ChainErrorMappings,
  network: networkMappings as ChainErrorMappings,
  transaction: transactionMappings as ChainErrorMappings,
  evm: evmMappings as ChainErrorMappings,
  contract: contractMappings as ChainErrorMappings,
};

/**
 * Load error mappings for a specific blockchain network
 * 
 * This function loads all error mappings for the specified chain, including ERC20, gas,
 * wallet, network, transaction, EVM, and contract errors. Mappings are sorted by priority
 * (higher priority first) to ensure the most specific matches are found first.
 * 
 * @param chain - The blockchain network to load mappings for. Defaults to Ethereum.
 * @returns Array of error mappings sorted by priority (highest first)
 * 
 * @example
 * ```typescript
 * // Load Ethereum error mappings
 * const ethereumMappings = loadErrorMappings(SupportedChain.ETHEREUM);
 * 
 * // Load Polygon error mappings
 * const polygonMappings = loadErrorMappings(SupportedChain.POLYGON);
 * 
 * // Load custom chain mappings (falls back to Ethereum mappings)
 * const customMappings = loadErrorMappings('custom-chain');
 * ```
 */
export function loadErrorMappings(chain: SupportedChain | string = SupportedChain.ETHEREUM): ErrorMapping[] {
  const allMappings: ErrorMapping[] = [];
  
  // Check for custom chain first
  if (customChainRegistry.has(chain)) {
    const customMappings = customChainRegistry.getErrorMappings(chain);
    allMappings.push(...customMappings);
  }
  
  // Load built-in categories based on chain configuration
  if (typeof chain === 'string' && Object.values(SupportedChain).includes(chain as SupportedChain)) {
    const enabledCategories = getEnabledErrorCategories(chain as SupportedChain);
    
    enabledCategories.forEach(categoryConfig => {
      const categoryMappings = ERROR_CATEGORY_MAPPINGS[categoryConfig.category];
      if (categoryMappings) {
        allMappings.push(...categoryMappings.mappings);
      }
    });
  } else {
    // Fallback to all categories for unsupported chains
    Object.values(ERROR_CATEGORY_MAPPINGS).forEach(category => {
      if (category) {
        allMappings.push(...category.mappings);
      }
    });
  }
  
  // Sort by priority using nullish coalescing
  return allMappings.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

/**
 * Load error mappings for a specific category
 * 
 * @param category - The error category to load
 * @param chain - The blockchain network. Defaults to Ethereum.
 * @returns Array of error mappings for the specified category
 */
export function loadCategoryMappings(category: EVMErrorType, chain: SupportedChain | string = SupportedChain.ETHEREUM): ErrorMapping[] {
  // Check for custom chain first
  if (customChainRegistry.has(chain)) {
    // For custom chains, we can't filter by category since ErrorMapping doesn't have category
    // Return all custom mappings for now
    return customChainRegistry.getErrorMappings(chain);
  }
  
  // Load from built-in categories
  const categoryMappings = ERROR_CATEGORY_MAPPINGS[category];
  if (categoryMappings) {
    return categoryMappings.mappings;
  }
  
  return [];
}

/**
 * Get all available error categories
 * 
 * @returns Array of available error category names
 */
export function getAvailableCategories(): EVMErrorType[] {
  return Object.keys(ERROR_CATEGORY_MAPPINGS) as EVMErrorType[];
}

/**
 * Check if a category exists for a specific chain
 * 
 * @param category - The error category to check
 * @param chain - The blockchain network. Defaults to Ethereum.
 * @returns true if the category exists for the chain
 */
export function hasCategoryForChain(category: EVMErrorType, chain: SupportedChain | string = SupportedChain.ETHEREUM): boolean {
  const availableCategories = getAvailableCategories();
  return availableCategories.includes(category);
}

/**
 * Load error categories with their mappings
 * 
 * @returns Array of error categories with mappings
 */
export function loadErrorCategories(): Array<{ type: EVMErrorType; mappings: any[] }> {
  return [
    { type: 'erc20' as const, mappings: erc20Mappings.mappings },
    { type: 'gas' as const, mappings: gasMappings.mappings },
    { type: 'wallet' as const, mappings: walletMappings.mappings },
    { type: 'network' as const, mappings: networkMappings.mappings },
    { type: 'transaction' as const, mappings: transactionMappings.mappings },
    { type: 'contract' as const, mappings: contractMappings.mappings },
    { type: 'evm' as const, mappings: evmMappings.mappings },
  ];
}
