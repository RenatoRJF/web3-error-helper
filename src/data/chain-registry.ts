/**
 * Chain registry - single source of truth for blockchain data
 * 
 * This module serves as the centralized data store for all built-in blockchain
 * network configurations. It contains comprehensive metadata, error category
 * configurations, and chain-specific settings. Provides the foundation for
 * chain validation, discovery, and error mapping across the entire library.
 */

import { SupportedChain } from '../types';

/**
 * Chain metadata interface
 */
export interface ChainMetadata {
  /** Human-readable name of the chain */
  name: string;
  /** Chain symbol (e.g., ETH, MATIC) */
  symbol?: string;
  /** Chain ID number */
  chainId?: number;
  /** RPC endpoint URLs */
  rpcUrls?: string[];
  /** Block explorer URLs */
  blockExplorerUrls?: string[];
  /** Native currency information */
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  /** Whether this is a testnet */
  isTestnet?: boolean;
}

/**
 * Error category configuration
 */
export interface ChainErrorConfig {
  /** Category name */
  category: string;
  /** Priority for this category (higher = more important) */
  priority: number;
  /** Whether this category is enabled for this chain */
  enabled: boolean;
}

/**
 * Chain configuration
 */
export interface ChainConfig {
  /** Chain identifier */
  id: SupportedChain;
  /** Chain metadata */
  metadata: ChainMetadata;
  /** Error category configuration */
  errorCategories: ChainErrorConfig[];
}

/**
 * Chain registry data
 */
export const CHAIN_REGISTRY: Record<SupportedChain, ChainConfig> = {
  [SupportedChain.ETHEREUM]: {
    id: SupportedChain.ETHEREUM,
    metadata: {
      name: 'Ethereum',
      symbol: 'ETH',
      chainId: 1,
      rpcUrls: ['https://mainnet.infura.io/v3/', 'https://eth-mainnet.alchemyapi.io/v2/'],
      blockExplorerUrls: ['https://etherscan.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.POLYGON]: {
    id: SupportedChain.POLYGON,
    metadata: {
      name: 'Polygon',
      symbol: 'MATIC',
      chainId: 137,
      rpcUrls: ['https://polygon-rpc.com', 'https://rpc-mainnet.maticvigil.com'],
      blockExplorerUrls: ['https://polygonscan.com'],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.ARBITRUM]: {
    id: SupportedChain.ARBITRUM,
    metadata: {
      name: 'Arbitrum One',
      symbol: 'ETH',
      chainId: 42161,
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://arbiscan.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.OPTIMISM]: {
    id: SupportedChain.OPTIMISM,
    metadata: {
      name: 'Optimism',
      symbol: 'ETH',
      chainId: 10,
      rpcUrls: ['https://mainnet.optimism.io'],
      blockExplorerUrls: ['https://optimistic.etherscan.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.BSC]: {
    id: SupportedChain.BSC,
    metadata: {
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      chainId: 56,
      rpcUrls: ['https://bsc-dataseed.binance.org'],
      blockExplorerUrls: ['https://bscscan.com'],
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.AVALANCHE]: {
    id: SupportedChain.AVALANCHE,
    metadata: {
      name: 'Avalanche C-Chain',
      symbol: 'AVAX',
      chainId: 43114,
      rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
      blockExplorerUrls: ['https://snowtrace.io'],
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.FANTOM]: {
    id: SupportedChain.FANTOM,
    metadata: {
      name: 'Fantom Opera',
      symbol: 'FTM',
      chainId: 250,
      rpcUrls: ['https://rpc.ftm.tools'],
      blockExplorerUrls: ['https://ftmscan.com'],
      nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  },
  [SupportedChain.BASE]: {
    id: SupportedChain.BASE,
    metadata: {
      name: 'Base',
      symbol: 'ETH',
      chainId: 8453,
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: ['https://basescan.org'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      isTestnet: false
    },
    errorCategories: [
      { category: 'erc20', priority: 10, enabled: true },
      { category: 'gas', priority: 9, enabled: true },
      { category: 'wallet', priority: 8, enabled: true },
      { category: 'network', priority: 7, enabled: true },
      { category: 'transaction', priority: 6, enabled: true },
      { category: 'evm', priority: 5, enabled: true },
      { category: 'contract', priority: 4, enabled: true }
    ]
  }
};

/**
 * Get all supported chain identifiers
 */
export function getSupportedChainIds(): SupportedChain[] {
  return Object.values(SupportedChain);
}

/**
 * Get chain configuration by ID
 */
export function getChainConfig(chainId: SupportedChain): ChainConfig | undefined {
  return CHAIN_REGISTRY[chainId];
}

/**
 * Get chain metadata by ID
 */
export function getChainMetadata(chainId: SupportedChain): ChainMetadata | undefined {
  return CHAIN_REGISTRY[chainId]?.metadata;
}

/**
 * Get error categories for a chain
 */
export function getChainErrorCategories(chainId: SupportedChain): ChainErrorConfig[] {
  return CHAIN_REGISTRY[chainId]?.errorCategories || [];
}

/**
 * Get enabled error categories for a chain (sorted by priority)
 */
export function getEnabledErrorCategories(chainId: SupportedChain): ChainErrorConfig[] {
  const categories = getChainErrorCategories(chainId);
  return categories
    .filter(cat => cat.enabled)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Get all chain configurations
 */
export function getAllChainConfigs(): Record<SupportedChain, ChainConfig> {
  return { ...CHAIN_REGISTRY };
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chainId: string): chainId is SupportedChain {
  return Object.values(SupportedChain).includes(chainId as SupportedChain);
}
