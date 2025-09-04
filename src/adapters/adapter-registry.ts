/**
 * Chain adapter registry
 *
 * This module manages all blockchain ecosystem adapters and provides
 * a unified interface for error translation across different blockchain
 * networks. It automatically detects the appropriate adapter based on
 * error format and provides fallback mechanisms.
 */

import { ChainAdapter, BlockchainEcosystem } from '../types';
import { EVMAdapter } from './evm-adapter';
import { SolanaAdapter } from './solana-adapter';
import { CosmosAdapter } from './cosmos-adapter';
import { NearAdapter } from './near-adapter';
import { CardanoAdapter } from './cardano-adapter';
import { PolkadotAdapter } from './polkadot-adapter';
import { AlgorandAdapter } from './algorand-adapter';
import { TezosAdapter } from './tezos-adapter';
import { StellarAdapter } from './stellar-adapter';
import { RippleAdapter } from './ripple-adapter';

/**
 * Registry for managing blockchain ecosystem adapters
 */
export class AdapterRegistry {
  private adapters: Map<BlockchainEcosystem, ChainAdapter> = new Map();
  private evmAdapters: Map<string | number, EVMAdapter> = new Map();

  constructor() {
    this.initializeDefaultAdapters();
  }

  /**
   * Initialize default adapters for all supported ecosystems
   */
  private initializeDefaultAdapters(): void {
    // Register non-EVM adapters
    this.adapters.set('solana', new SolanaAdapter());
    this.adapters.set('cosmos', new CosmosAdapter());
    this.adapters.set('near', new NearAdapter());
    this.adapters.set('cardano', new CardanoAdapter());
    this.adapters.set('polkadot', new PolkadotAdapter());
    this.adapters.set('algorand', new AlgorandAdapter());
    this.adapters.set('tezos', new TezosAdapter());
    this.adapters.set('stellar', new StellarAdapter());
    this.adapters.set('ripple', new RippleAdapter());
  }

  /**
   * Get adapter for specific ecosystem
   */
  getAdapter(ecosystem: BlockchainEcosystem): ChainAdapter | undefined {
    return this.adapters.get(ecosystem);
  }

  /**
   * Get EVM adapter for specific chain ID
   */
  getEVMAdapter(chainId?: string | number): EVMAdapter {
    if (!chainId) {
      // Return default EVM adapter
      return new EVMAdapter();
    }

    if (!this.evmAdapters.has(chainId)) {
      this.evmAdapters.set(chainId, new EVMAdapter(chainId));
    }

    return this.evmAdapters.get(chainId)!;
  }

  /**
   * Detect the appropriate adapter based on error format
   */
  detectAdapter(error: unknown): ChainAdapter | null {
    // Try each adapter to see which one matches the error format
    for (const adapter of this.adapters.values()) {
      if (adapter.matchesErrorFormat(error)) {
        return adapter;
      }
    }

    // If no specific adapter matches, try EVM adapter
    const evmAdapter = new EVMAdapter();
    if (evmAdapter.matchesErrorFormat(error)) {
      return evmAdapter;
    }

    return null;
  }

  /**
   * Get all registered ecosystems
   */
  getSupportedEcosystems(): BlockchainEcosystem[] {
    return Array.from(this.adapters.keys()).concat(['evm']);
  }

  /**
   * Check if ecosystem is supported
   */
  isEcosystemSupported(ecosystem: BlockchainEcosystem): boolean {
    return ecosystem === 'evm' || this.adapters.has(ecosystem);
  }

  /**
   * Register a custom adapter
   */
  registerAdapter(ecosystem: BlockchainEcosystem, adapter: ChainAdapter): void {
    this.adapters.set(ecosystem, adapter);
  }

  /**
   * Unregister an adapter
   */
  unregisterAdapter(ecosystem: BlockchainEcosystem): boolean {
    return this.adapters.delete(ecosystem);
  }
}

/**
 * Global adapter registry instance
 */
export const adapterRegistry = new AdapterRegistry();
