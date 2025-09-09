/**
 * Polkadot chain adapter
 *
 * This module provides error translation capabilities for Polkadot and Substrate-based
 * blockchain networks. It handles Substrate runtime errors, parachain errors, and
 * transaction failures commonly encountered when interacting with Polkadot ecosystem.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Polkadot chain adapter for Polkadot and Substrate-based blockchains
 */
export class PolkadotAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'polkadot';
  readonly name = 'Polkadot';
  readonly chainId = 'polkadot';

  /**
   * Extract error message from Polkadot error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      // Polkadot API error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      // Substrate runtime error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }

      // Extrinsic error format
      if (
        errorObj.ExtrinsicFailed &&
        typeof errorObj.ExtrinsicFailed === 'object'
      ) {
        const extrinsicFailed = errorObj.ExtrinsicFailed as Record<
          string,
          unknown
        >;
        if (
          typeof extrinsicFailed.DispatchError === 'object' &&
          extrinsicFailed.DispatchError !== null
        ) {
          const dispatchError = extrinsicFailed.DispatchError as Record<
            string,
            unknown
          >;
          if (typeof dispatchError.BadOrigin === 'string') {
            return `Bad origin: ${dispatchError.BadOrigin}`;
          }
          if (
            typeof dispatchError.Module === 'object' &&
            dispatchError.Module !== null
          ) {
            const module = dispatchError.Module as Record<string, unknown>;
            if (typeof module.error === 'string') {
              return `Module error: ${module.error}`;
            }
          }
        }
      }

      // Balance error format
      if (errorObj.BalanceTooLow) {
        return 'Insufficient balance for transaction';
      }

      if (errorObj.ExistenceRequired) {
        return 'Account existence required';
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Polkadot ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Polkadot error patterns
      return (
        error.includes('insufficient balance') ||
        error.includes('extrinsic failed') ||
        error.includes('bad origin') ||
        error.includes('substrate') ||
        error.includes('polkadot') ||
        error.includes('parachain')
      );
    }

    if (error && typeof error === 'object') {
      // Check for Polkadot-specific properties
      return (
        this.hasErrorProperty(error, 'ExtrinsicFailed') ||
        this.hasErrorProperty(error, 'DispatchError') ||
        this.hasErrorProperty(error, 'BalanceTooLow') ||
        this.hasErrorProperty(error, 'ExistenceRequired') ||
        this.hasErrorProperty(error, 'Module')
      );
    }

    return false;
  }

  /**
   * Get Polkadot-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient balance': 'Insufficient balance for transaction',
      'extrinsic failed': 'Transaction extrinsic failed',
      'bad origin': 'Invalid transaction origin',
      substrate: 'Substrate runtime error occurred',
      polkadot: 'Polkadot blockchain error occurred',
      parachain: 'Parachain error occurred',
      'module error': 'Substrate module execution failed',
      'existence required': 'Account existence required',
      'balance too low': 'Insufficient balance for operation',
    };
  }

  /**
   * Get Polkadot-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Polkadot network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet:
        'Polkadot wallet error occurred. Please check your wallet connection.',
      contract: 'Polkadot runtime execution failed.',
      transaction: 'Polkadot transaction failed. Please try again.',
      evm: 'Polkadot blockchain error occurred.',
    };
  }
}
