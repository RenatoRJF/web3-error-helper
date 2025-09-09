/**
 * Chain adapters module
 *
 * This module exports all blockchain ecosystem adapters and the registry
 * for managing them. It provides a unified interface for error translation
 * across different blockchain networks.
 */

export { BaseChainAdapter } from './base-adapter';
export { EVMAdapter } from './evm-adapter';
export { SolanaAdapter } from './solana-adapter';
export { CosmosAdapter } from './cosmos-adapter';
export { NearAdapter } from './near-adapter';
export { CardanoAdapter } from './cardano-adapter';
export { PolkadotAdapter } from './polkadot-adapter';
export { AlgorandAdapter } from './algorand-adapter';
export { TezosAdapter } from './tezos-adapter';
export { StellarAdapter } from './stellar-adapter';
export { RippleAdapter } from './ripple-adapter';
export { AdapterRegistry, adapterRegistry } from './adapter-registry';

export type { ChainAdapter, BlockchainEcosystem } from '../types';
