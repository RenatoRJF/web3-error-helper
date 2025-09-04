/**
 * Chain statistics and aggregation
 * 
 * This module provides comprehensive statistical analysis and reporting capabilities
 * for blockchain networks. It aggregates data from both built-in and custom chains,
 * generates usage summaries, and provides insights into chain distribution and
 * configuration patterns. Focuses on data aggregation and reporting without side effects.
 */

import { getBuiltInChainStats } from './built-in-chain-manager';
import { customChainRegistry } from './chain-registry';

/**
 * Get comprehensive chain statistics
 * 
 * @returns Object with detailed chain statistics
 * 
 * @example
 * ```typescript
 * const stats = getChainStats();
 * console.log(stats);
 * // {
 * //   total: 10,
 * //   builtIn: 8,
 * //   custom: 2,
 * //   chains: ['ethereum', 'polygon', 'my-custom-chain', ...]
 * // }
 * ```
 */
export function getChainStats(): {
  total: number;
  builtIn: number;
  custom: number;
  chains: string[];
} {
  const builtInStats = getBuiltInChainStats();
  const customChains = customChainRegistry.getAll().map(config => config.chainId);
  const allChains = [...customChains, ...builtInStats.chains];
  
  return {
    total: allChains.length,
    builtIn: builtInStats.count,
    custom: customChains.length,
    chains: allChains
  };
}

/**
 * Get chain distribution statistics
 * 
 * @returns Object with chain type distribution
 * 
 * @example
 * ```typescript
 * const distribution = getChainDistribution();
 * console.log(distribution);
 * // {
 * //   builtInPercentage: 80,
 * //   customPercentage: 20,
 * //   ratio: '4:1'
 * // }
 * ```
 */
export function getChainDistribution(): {
  builtInPercentage: number;
  customPercentage: number;
  ratio: string;
} {
  const stats = getChainStats();
  
  if (stats.total === 0) {
    return {
      builtInPercentage: 0,
      customPercentage: 0,
      ratio: '0:0'
    };
  }
  
  const builtInPercentage = Math.round((stats.builtIn / stats.total) * 100);
  const customPercentage = Math.round((stats.custom / stats.total) * 100);
  
  // Calculate ratio
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(stats.builtIn, stats.custom);
  const ratio = `${stats.builtIn / divisor}:${stats.custom / divisor}`;
  
  return {
    builtInPercentage,
    customPercentage,
    ratio
  };
}

/**
 * Get chain usage summary
 * 
 * @returns Object with chain usage information
 * 
 * @example
 * ```typescript
 * const summary = getChainUsageSummary();
 * console.log(summary);
 * // {
 * //   mostUsed: 'ethereum',
 * //   leastUsed: 'fantom',
 * //   averageUsage: 12.5
 * // }
 * ```
 */
export function getChainUsageSummary(): {
  mostUsed: string;
  leastUsed: string;
  averageUsage: number;
} {
  const stats = getChainStats();
  
  if (stats.chains.length === 0) {
    return {
      mostUsed: '',
      leastUsed: '',
      averageUsage: 0
    };
  }
  
  // For now, we'll use a simple heuristic based on chain order
  // In a real implementation, this might track actual usage metrics
  const builtInChains = stats.chains.filter(chain => 
    ['ethereum', 'polygon', 'arbitrum', 'optimism', 'bsc', 'avalanche', 'fantom', 'base'].includes(chain)
  );
  
  return {
    mostUsed: builtInChains[0] || stats.chains[0] || '',
    leastUsed: builtInChains[builtInChains.length - 1] || stats.chains[stats.chains.length - 1] || '',
    averageUsage: stats.total / 2 // Placeholder calculation
  };
}
