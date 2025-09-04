/**
 * Chain discovery and search functionality
 * 
 * This module provides intelligent search and discovery capabilities for blockchain
 * networks. It enables finding chains by various criteria such as chain ID, symbol,
 * or custom properties. Supports flexible search patterns and provides efficient
 * lookup mechanisms for chain identification and validation workflows.
 */

import { SupportedChain } from '../types';
import { ChainMetadata, getAllChainConfigs } from '../data/chain-registry';

/**
 * Find chain by chain ID
 * 
 * @param chainId - The chain ID to search for
 * @returns Chain identifier or null if not found
 * 
 * @example
 * ```typescript
 * const chain = findChainByChainId(1);
 * console.log(chain); // 'ethereum'
 * ```
 */
export function findChainByChainId(chainId: number): SupportedChain | null {
  const configs = getAllChainConfigs();
  for (const [chain, config] of Object.entries(configs)) {
    if (config.metadata.chainId === chainId) {
      return chain as SupportedChain;
    }
  }
  return null;
}

/**
 * Find chains by symbol
 * 
 * @param symbol - The symbol to search for (e.g., 'ETH', 'MATIC')
 * @returns Array of chain identifiers that use this symbol
 * 
 * @example
 * ```typescript
 * const ethChains = findChainsBySymbol('ETH');
 * console.log(ethChains); // ['ethereum', 'arbitrum', 'optimism', 'base']
 * ```
 */
export function findChainsBySymbol(symbol: string): SupportedChain[] {
  const chains: SupportedChain[] = [];
  const configs = getAllChainConfigs();
  for (const [chain, config] of Object.entries(configs)) {
    if (config.metadata.symbol?.toUpperCase() === symbol.toUpperCase()) {
      chains.push(chain as SupportedChain);
    }
  }
  return chains;
}

/**
 * Find chains by property
 * 
 * @param property - The property to search by
 * @param value - The value to match
 * @returns Array of chain identifiers that match the criteria
 * 
 * @example
 * ```typescript
 * const testnetChains = findChainsByProperty('isTestnet', true);
 * const ethChains = findChainsByProperty('symbol', 'ETH');
 * ```
 */
export function findChainsByProperty<K extends keyof ChainMetadata>(
  property: K,
  value: ChainMetadata[K]
): SupportedChain[] {
  const chains: SupportedChain[] = [];
  const configs = getAllChainConfigs();
  for (const [chain, config] of Object.entries(configs)) {
    if (config.metadata[property] === value) {
      chains.push(chain as SupportedChain);
    }
  }
  return chains;
}

/**
 * Search chains by name (case-insensitive partial match)
 * 
 * @param name - The name to search for
 * @returns Array of chain identifiers that match the name
 * 
 * @example
 * ```typescript
 * const ethChains = searchChainsByName('ethereum');
 * const polygonChains = searchChainsByName('polygon');
 * ```
 */
export function searchChainsByName(name: string): SupportedChain[] {
  const chains: SupportedChain[] = [];
  const searchTerm = name.toLowerCase();
  const configs = getAllChainConfigs();
  
  for (const [chain, config] of Object.entries(configs)) {
    if (config.metadata.name.toLowerCase().includes(searchTerm)) {
      chains.push(chain as SupportedChain);
    }
  }
  return chains;
}

