/**
 * TypeScript types for the web3-error-helper package
 * 
 * This module contains all the core type definitions, enums, and constants
 * used throughout the library. It serves as the central type registry that
 * ensures type safety and consistency across all modules. Uses modern
 * TypeScript features and utility types for enhanced developer experience.
 */

/**
 * Modern utility types for better type safety
 */
export type NonEmptyString = string & { readonly __brand: unique symbol };
export type ChainId = string & { readonly __brand: unique symbol };
export type ErrorPattern = string & { readonly __brand: unique symbol };

/**
 * Branded types for better type safety
 */
export const createChainId = (id: string): ChainId => id as ChainId;
export const createErrorPattern = (pattern: string): ErrorPattern => pattern as ErrorPattern;

/**
 * Supported blockchain networks
 */
export enum SupportedChain {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  BSC = 'bsc',
  AVALANCHE = 'avalanche',
  FANTOM = 'fantom',
  BASE = 'base',
}

/**
 * Chain type classification
 */
export type ChainType = 'built-in' | 'custom';

/**
 * Blockchain ecosystem types
 */
export type BlockchainEcosystem = 
  | 'evm'           // Ethereum, Polygon, Arbitrum, Optimism, BSC, Avalanche, Fantom, Base
  | 'solana'        // Solana blockchain
  | 'cosmos'        // Cosmos SDK chains (Cosmos Hub, Osmosis, etc.)
  | 'near'          // Near Protocol
  | 'cardano'       // Cardano blockchain
  | 'polkadot'      // Polkadot and Substrate-based chains
  | 'algorand'      // Algorand blockchain
  | 'tezos'         // Tezos blockchain
  | 'stellar'       // Stellar blockchain
  | 'ripple';       // Ripple (XRP) blockchain

/**
 * Chain adapter interface for different blockchain ecosystems
 */
export interface ChainAdapter {
  readonly ecosystem: BlockchainEcosystem;
  readonly name: string;
  readonly chainId?: string | number;
  
  /**
   * Extract error message from blockchain-specific error format
   */
  extractErrorMessage(error: unknown): string;
  
  /**
   * Check if error format matches this ecosystem
   */
  matchesErrorFormat(error: unknown): boolean;
  
  /**
   * Get ecosystem-specific error patterns
   */
  getErrorPatterns(): Record<string, string>;
  
  /**
   * Get ecosystem-specific fallback messages
   */
  getFallbackMessages(): Record<string, string>;
}

/**
 * Error type detection keywords (ordered by specificity)
 */
export const ERROR_TYPE_KEYWORDS = {
  WALLET: ['wallet', 'user rejected', 'user denied', 'wallet connection'],
  CONTRACT: ['contract', 'execution reverted', 'revert'],
  GAS: ['gas', 'insufficient gas', 'out of gas'],
  TRANSACTION: ['transaction', 'tx', 'nonce'],
  NETWORK: ['network', 'timeout', 'connection'],
} as const;

/**
 * Error type classification
 */
export type ErrorType = keyof typeof ERROR_TYPE_KEYWORDS;

/**
 * Common error object structures that can be passed to translateError
 */
export interface Web3Error {
  message: string;
  code?: number;
  data?: any;
  reason?: string;
  error?: {
    message: string;
    code?: number;
    data?: any;
  };
}

export interface EthersError extends Error {
  code?: string | number;
  reason?: string;
  data?: any;
  transaction?: any;
  transactionHash?: string;
  receipt?: any;
}

export interface Web3ProviderError {
  code: number;
  message: string;
  data?: any;
}

export interface RPCError {
  code: number;
  message: string;
  data?: any;
}

/**
 * Union type for all possible error types that can be translated
 */
export type TranslatableError = 
  | string
  | Error
  | Web3Error
  | EthersError
  | Web3ProviderError
  | RPCError
  | { message: string; [key: string]: any }
  | { error: { message: string; [key: string]: any } }
  | { reason: string; [key: string]: any }
  | { data: { message: string; [key: string]: any } }
  | { [key: string]: any }; // Allow any object structure for blockchain-specific errors

export interface TranslateErrorOptions {
  /** The blockchain network/chain */
  chain?: SupportedChain | string;
  /** The blockchain ecosystem (evm, solana, cosmos, near) */
  ecosystem?: BlockchainEcosystem;
  /** Custom fallback message when no translation is found */
  fallbackMessage?: string;
  /** Whether to include original error details in the output */
  includeOriginalError?: boolean;
  /** Custom error mappings to override default ones */
  customMappings?: Record<string, string>;
}

export interface ErrorMapping {
  /** The error pattern to match (can be regex or exact string) */
  pattern: string;
  /** The human-readable message to return */
  message: string;
  /** Whether the pattern should be treated as a regex */
  isRegex?: boolean;
  /** Priority for matching (higher numbers take precedence) */
  priority?: number;
}

/**
 * Utility type for creating error mappings with modern TypeScript features
 */
export type CreateErrorMapping = {
  pattern: string;
  message: string;
  isRegex?: boolean;
  priority?: number;
};

export interface ChainErrorMappings {
  /** Chain identifier */
  chain: string;
  /** Error mappings for this chain */
  mappings: ErrorMapping[];
}

export interface ErrorTranslationResult {
  /** The translated error message */
  message: string;
  /** Whether a translation was found */
  translated: boolean;
  /** The original error that was translated */
  originalError?: TranslatableError;
  /** The chain that was used for translation */
  chain?: string;
}

/**
 * Common EVM error types
 */
export type EVMErrorType = 
  | 'erc20'
  | 'gas'
  | 'wallet'
  | 'network'
  | 'contract'
  | 'transaction'
  | 'evm'
  | 'unknown';

/**
 * Standard error categories for better organization
 */
export interface ErrorCategory {
  type: EVMErrorType;
  mappings: ErrorMapping[];
}

/**
 * Configuration for a custom blockchain network
 */
export interface CustomChainConfig {
  /** Unique identifier for the chain */
  chainId: string;
  /** Human-readable name of the chain */
  name: string;
  /** Error mappings specific to this chain */
  errorMappings: ErrorMapping[];
  /** Custom fallback messages for this chain */
  customFallbacks?: {
    generic?: string;
    network?: string;
    wallet?: string;
    contract?: string;
  };
  /** Whether this chain is EVM-compatible */
  isEVMCompatible?: boolean;
  /** Chain-specific metadata */
  metadata?: Record<string, any>;
}

/**
 * Registry for managing custom chain configurations
 */
export interface ChainRegistry {
  /** Register a custom chain configuration */
  register(config: CustomChainConfig): void;
  /** Unregister a custom chain */
  unregister(chainId: string): void;
  /** Get a custom chain configuration */
  get(chainId: string): CustomChainConfig | undefined;
  /** Get all registered custom chains */
  getAll(): CustomChainConfig[];
  /** Check if a chain is registered */
  has(chainId: string): boolean;
  /** Clear all custom chains */
  clear(): void;
}
