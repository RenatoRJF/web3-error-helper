/**
 * Built-in chain management
 * 
 * This module provides comprehensive management for all built-in blockchain networks
 * supported by the library. It handles chain validation, metadata retrieval, discovery
 * operations, and statistics. Acts as the primary interface for interacting with
 * predefined blockchain configurations and their associated error mappings.
 */

import { SupportedChain } from './types';
import { 
  ChainMetadata, 
  getSupportedChainIds, 
  getChainConfig 
} from './data/chain-registry';

/**
 * Fast chain lookup using Set
 */
const BUILT_IN_CHAIN_SET = new Set(Object.values(SupportedChain));

/**
 * Get all built-in supported chains
 * 
 * @returns Array of built-in chain identifiers
 * 
 * @example
 * ```typescript
 * const builtInChains = getBuiltInChains();
 * console.log(builtInChains); // ['ethereum', 'polygon', 'arbitrum', ...]
 * ```
 */
export function getBuiltInChains(): SupportedChain[] {
  return getSupportedChainIds();
}

/**
 * Check if a chain is built-in
 * 
 * @param chain - The chain identifier to check
 * @returns true if the chain is a built-in supported chain
 * 
 * @example
 * ```typescript
 * if (isBuiltInChain('ethereum')) {
 *   console.log('Ethereum is a built-in chain');
 * }
 * ```
 */
export function isBuiltInChain(chain: string): boolean {
  return BUILT_IN_CHAIN_SET.has(chain as SupportedChain);
}

/**
 * Get built-in chain information
 * 
 * @param chain - The chain identifier
 * @returns Chain information object or null if not a built-in chain
 * 
 * @example
 * ```typescript
 * const info = getBuiltInChainInfo('ethereum');
 * console.log(info); // { type: 'built-in', name: 'Ethereum' }
 * ```
 */
export function getBuiltInChainInfo(chain: string): { type: 'built-in'; name: string } | null {
  if (!isBuiltInChain(chain)) {
    return null;
  }
  
  const config = getChainConfig(chain as SupportedChain);
  return {
    type: 'built-in',
    name: config?.metadata.name || chain
  };
}

/**
 * Get enhanced chain metadata
 * 
 * @param chain - The chain identifier
 * @returns Full chain metadata or null if not a built-in chain
 * 
 * @example
 * ```typescript
 * const metadata = getChainMetadata('ethereum');
 * console.log(metadata?.chainId); // 1
 * console.log(metadata?.symbol); // 'ETH'
 * ```
 */
export function getChainMetadata(chain: string): ChainMetadata | null {
  if (!isBuiltInChain(chain)) {
    return null;
  }
  
  return getChainConfig(chain as SupportedChain)?.metadata || null;
}

/**
 * Get built-in chain statistics
 * 
 * @returns Object with built-in chain statistics
 * 
 * @example
 * ```typescript
 * const stats = getBuiltInChainStats();
 * console.log(stats); // { count: 8, chains: ['ethereum', 'polygon', ...] }
 * ```
 */
export function getBuiltInChainStats(): {
  count: number;
  chains: SupportedChain[];
} {
  const chains = getBuiltInChains();
  return {
    count: chains.length,
    chains
  };
}

export {
  findChainByChainId,
  findChainsBySymbol,
  findChainsByProperty,
  searchChainsByName
} from './services/chain-discovery';

export { getAllChainConfigs } from './data/chain-registry';

export { validateBuiltInChain as validateChain } from './services/chain-validation';
