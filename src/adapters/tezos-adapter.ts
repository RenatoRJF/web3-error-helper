/**
 * Tezos chain adapter
 *
 * This module provides error translation capabilities for the Tezos blockchain.
 * It handles Tezos-specific error formats, Michelson execution errors, and transaction
 * failures commonly encountered when interacting with Tezos smart contracts
 * and operations.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Tezos chain adapter for Tezos blockchain
 */
export class TezosAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'tezos';
  readonly name = 'Tezos';
  readonly chainId = 'mainnet';

  /**
   * Extract error message from Tezos error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      // Tezos API error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      // Tezos operation error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }

      // Michelson execution error format
      if (
        errorObj.michelson_error &&
        typeof errorObj.michelson_error === 'object'
      ) {
        const michelsonError = errorObj.michelson_error as Record<
          string,
          unknown
        >;
        if (typeof michelsonError.message === 'string') {
          return michelsonError.message;
        }
      }

      // Tezos validation error format
      if (
        errorObj.validation_error &&
        typeof errorObj.validation_error === 'string'
      ) {
        return errorObj.validation_error;
      }

      // Tezos network error format
      if (
        errorObj.network_error &&
        typeof errorObj.network_error === 'string'
      ) {
        return errorObj.network_error;
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Tezos ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Tezos error patterns
      return (
        error.includes('insufficient balance') ||
        error.includes('script failed') ||
        error.includes('invalid operation') ||
        error.includes('tezos') ||
        error.includes('michelson') ||
        error.includes('xtz')
      );
    }

    if (error && typeof error === 'object') {
      // Check for Tezos-specific properties
      return (
        this.hasErrorProperty(error, 'michelson_error') ||
        this.hasErrorProperty(error, 'validation_error') ||
        this.hasErrorProperty(error, 'network_error') ||
        this.hasErrorProperty(error, 'operation') ||
        this.hasErrorProperty(error, 'xtz')
      );
    }

    return false;
  }

  /**
   * Get Tezos-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient balance': 'Insufficient XTZ balance for transaction',
      'script failed': 'Michelson smart contract execution failed',
      'invalid operation': 'Invalid Tezos operation',
      tezos: 'Tezos blockchain error occurred',
      michelson: 'Michelson execution error occurred',
      xtz: 'Tezos token error occurred',
      'account not found': 'Account does not exist on Tezos',
      'contract not found': 'Smart contract not found',
      'fee too small': 'Operation fee is too small',
    };
  }

  /**
   * Get Tezos-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Tezos network error occurred. Please check your connection.',
      gas: 'Operation fee estimation failed. Please try again.',
      wallet:
        'Tezos wallet error occurred. Please check your wallet connection.',
      contract: 'Tezos smart contract execution failed.',
      transaction: 'Tezos operation failed. Please try again.',
      evm: 'Tezos blockchain error occurred.',
    };
  }
}
