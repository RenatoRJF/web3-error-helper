/**
 * Chain management facade
 *
 * Provides a unified interface for managing blockchain networks.
 * This module acts as a facade that delegates to specialized modules
 * for built-in chains, custom chains, validation, and statistics.
 */

import {
  getBuiltInChains,
  getBuiltInChainInfo,
} from './built-in-chain-manager';
import { getAllCustomChains, getCustomChain } from './chain-registry';
import { ChainType } from './types';

// Re-export only what's needed from built-in-chain-manager
export { getBuiltInChains, isBuiltInChain } from './built-in-chain-manager';

export type { ChainMetadata } from './data/chain-registry';

// Re-export only what's needed from chain-registry
export {
  getCustomChain,
  getAllCustomChains,
  hasCustomChain,
} from './chain-registry';

// Re-export only what's needed from chain-validator
export { isValidChain, isValidChainFormat } from './chain-validator';

// Re-export only what's needed from chain-stats
export { getChainStats } from './chain-stats';

/**
 * Get all available blockchain networks
 *
 * Returns a list of all supported blockchain networks that have error mappings available.
 * This includes both EVM-compatible chains and other supported networks.
 *
 * @returns Array of supported chain identifiers
 *
 * @example
 * ```typescript
 * const chains = getAvailableChains();
 * console.log(chains); // ['ethereum', 'polygon', 'arbitrum', 'optimism', ...]
 *
 * // Use in a dropdown or selection UI
 * chains.forEach(chain => {
 *   console.log(`Supported chain: ${chain}`);
 * });
 * ```
 */
export function getAvailableChains(): string[] {
  const builtInChains = getBuiltInChains();
  const customChains = getAllCustomChains().map(config => config.chainId);
  return [...customChains, ...builtInChains];
}

/**
 * Get unified chain information
 *
 * @param chain - The chain identifier
 * @returns Chain information object or null if not found
 *
 * @example
 * ```typescript
 * const info = getChainInfo('ethereum');
 * console.log(info); // { type: 'built-in', name: 'Ethereum' }
 *
 * const customInfo = getChainInfo('my-custom-chain');
 * console.log(customInfo); // { type: 'custom', name: 'My Custom Chain' }
 * ```
 */
export function getChainInfo(
  chain: string
): { type: ChainType; name?: string } | null {
  // Try built-in first
  const builtInInfo = getBuiltInChainInfo(chain);
  if (builtInInfo) {
    return builtInInfo;
  }

  // Try custom chains
  const customChain = getCustomChain(chain);
  if (customChain) {
    return {
      type: 'custom',
      name: customChain.name,
    };
  }

  return null;
}
