/**
 * Custom chain registry for managing blockchain network configurations
 * 
 * This module provides a registry system for managing custom blockchain networks
 * and their associated error mappings. It allows runtime registration of chains
 * with their specific error patterns and fallback messages.
 */

import { CustomChainConfig, ChainRegistry, ErrorMapping } from './types';

/**
 * In-memory registry for custom chain configurations
 */
class CustomChainRegistry implements ChainRegistry {
  private chains = new Map<string, CustomChainConfig>();

  /**
   * Register a custom chain configuration
   * 
   * @param config - The chain configuration to register
   * @throws Error if chainId is already registered
   * 
   * @example
   * ```typescript
   * const customChain: CustomChainConfig = {
   *   chainId: 'my-custom-chain',
   *   name: 'My Custom Chain',
   *   errorMappings: [
   *     { pattern: 'custom error', message: 'Custom error message' }
   *   ],
   *   customFallbacks: {
   *     generic: 'Custom chain error occurred'
   *   }
   * };
   * 
   * registry.register(customChain);
   * ```
   */
  register(config: CustomChainConfig): void {
    if (this.chains.has(config.chainId)) {
      throw new Error(`Chain '${config.chainId}' is already registered`);
    }
    
    this.validateConfig(config);
    this.chains.set(config.chainId, { ...config });
  }

  /**
   * Unregister a custom chain
   * 
   * @param chainId - The chain identifier to unregister
   * @returns true if the chain was removed, false if it wasn't found
   * 
   * @example
   * ```typescript
   * const removed = registry.unregister('my-custom-chain');
   * console.log(removed); // true if removed, false if not found
   * ```
   */
  unregister(chainId: string): boolean {
    return this.chains.delete(chainId);
  }

  /**
   * Get a custom chain configuration
   * 
   * @param chainId - The chain identifier to retrieve
   * @returns The chain configuration or undefined if not found
   * 
   * @example
   * ```typescript
   * const config = registry.get('my-custom-chain');
   * if (config) {
   *   console.log(`Found chain: ${config.name}`);
   * }
   * ```
   */
  get(chainId: string): CustomChainConfig | undefined {
    return this.chains.get(chainId);
  }

  /**
   * Get all registered custom chains
   * 
   * @returns Array of all registered chain configurations
   * 
   * @example
   * ```typescript
   * const allChains = registry.getAll();
   * console.log(`Registered ${allChains.length} custom chains`);
   * ```
   */
  getAll(): CustomChainConfig[] {
    return Array.from(this.chains.values());
  }

  /**
   * Check if a chain is registered
   * 
   * @param chainId - The chain identifier to check
   * @returns true if the chain is registered, false otherwise
   * 
   * @example
   * ```typescript
   * if (registry.has('my-custom-chain')) {
   *   console.log('Chain is registered');
   * }
   * ```
   */
  has(chainId: string): boolean {
    return this.chains.has(chainId);
  }

  /**
   * Clear all registered custom chains
   * 
   * @example
   * ```typescript
   * registry.clear();
   * console.log('All custom chains cleared');
   * ```
   */
  clear(): void {
    this.chains.clear();
  }

  /**
   * Get error mappings for a specific chain
   * 
   * @param chainId - The chain identifier
   * @returns Array of error mappings for the chain
   */
  getErrorMappings(chainId: string): ErrorMapping[] {
    const config = this.get(chainId);
    return config?.errorMappings || [];
  }

  /**
   * Get custom fallback messages for a specific chain
   * 
   * @param chainId - The chain identifier
   * @returns Custom fallback messages or undefined
   */
  getCustomFallbacks(chainId: string): CustomChainConfig['customFallbacks'] {
    const config = this.get(chainId);
    return config?.customFallbacks;
  }

  /**
   * Validate a chain configuration
   * 
   * @param config - The configuration to validate
   * @throws Error if the configuration is invalid
   */
  private validateConfig(config: CustomChainConfig): void {
    if (!config.chainId || typeof config.chainId !== 'string') {
      throw new Error('chainId must be a non-empty string');
    }
    
    if (!config.name || typeof config.name !== 'string') {
      throw new Error('name must be a non-empty string');
    }
    
    if (!Array.isArray(config.errorMappings)) {
      throw new Error('errorMappings must be an array');
    }
    
    // Validate error mappings
    config.errorMappings.forEach((mapping, index) => {
      if (!mapping.pattern || typeof mapping.pattern !== 'string') {
        throw new Error(`errorMappings[${index}].pattern must be a non-empty string`);
      }
      
      if (!mapping.message || typeof mapping.message !== 'string') {
        throw new Error(`errorMappings[${index}].message must be a non-empty string`);
      }
    });
  }
}

// Global registry instance
export const customChainRegistry = new CustomChainRegistry();

/**
 * Register a custom chain configuration
 * 
 * @param config - The chain configuration to register
 * 
 * @example
 * ```typescript
 * import { registerCustomChain } from './chain-registry';
 * 
 * registerCustomChain({
 *   chainId: 'my-custom-chain',
 *   name: 'My Custom Chain',
 *   errorMappings: [
 *     { pattern: 'custom error', message: 'Custom error message' }
 *   ]
 * });
 * ```
 */
export function registerCustomChain(config: CustomChainConfig): void {
  customChainRegistry.register(config);
}

/**
 * Unregister a custom chain
 * 
 * @param chainId - The chain identifier to unregister
 * @returns true if the chain was removed, false if it wasn't found
 */
export function unregisterCustomChain(chainId: string): boolean {
  return customChainRegistry.unregister(chainId);
}

/**
 * Get a custom chain configuration
 * 
 * @param chainId - The chain identifier to retrieve
 * @returns The chain configuration or undefined if not found
 */
export function getCustomChain(chainId: string): CustomChainConfig | undefined {
  return customChainRegistry.get(chainId);
}

/**
 * Get all registered custom chains
 * 
 * @returns Array of all registered chain configurations
 */
export function getAllCustomChains(): CustomChainConfig[] {
  return customChainRegistry.getAll();
}

/**
 * Check if a custom chain is registered
 * 
 * @param chainId - The chain identifier to check
 * @returns true if the chain is registered, false otherwise
 */
export function hasCustomChain(chainId: string): boolean {
  return customChainRegistry.has(chainId);
}

/**
 * Clear all registered custom chains
 */
export function clearCustomChains(): void {
  customChainRegistry.clear();
}

/**
 * Get custom chain identifiers only
 * 
 * @returns Array of custom chain identifiers
 */
export function getCustomChains(): string[] {
  return customChainRegistry.getAll().map(config => config.chainId);
}

/**
 * Check if a chain is custom
 * 
 * @param chainId - The chain identifier to check
 * @returns true if the chain is a custom registered chain
 */
export function isCustomChain(chainId: string): boolean {
  return customChainRegistry.has(chainId);
}
