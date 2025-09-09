/**
 * Stellar chain adapter
 *
 * This module provides error translation capabilities for the Stellar blockchain.
 * It handles Stellar-specific error formats, transaction failures, and operation
 * errors commonly encountered when interacting with Stellar network operations
 * and smart contracts.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Stellar chain adapter for Stellar blockchain
 */
export class StellarAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'stellar';
  readonly name = 'Stellar';
  readonly chainId = 'mainnet';

  /**
   * Extract error message from Stellar error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      // Stellar API error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      // Stellar transaction error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }

      // Stellar operation error format
      if (
        errorObj.operation_error &&
        typeof errorObj.operation_error === 'object'
      ) {
        const opError = errorObj.operation_error as Record<string, unknown>;
        if (typeof opError.code === 'string') {
          return `Operation error: ${opError.code}`;
        }
      }

      // Stellar result error format
      if (errorObj.result && typeof errorObj.result === 'object') {
        const result = errorObj.result as Record<string, unknown>;
        if (typeof result.result === 'string') {
          return result.result;
        }
      }

      // Stellar horizon error format
      if (
        errorObj.horizon_error &&
        typeof errorObj.horizon_error === 'string'
      ) {
        return errorObj.horizon_error;
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Stellar ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Stellar error patterns
      return (
        error.includes('insufficient balance') ||
        error.includes('operation failed') ||
        error.includes('stellar') ||
        error.includes('horizon') ||
        error.includes('xlm') ||
        error.includes('trustline')
      );
    }

    if (error && typeof error === 'object') {
      // Check for Stellar-specific properties
      return (
        this.hasErrorProperty(error, 'operation_error') ||
        this.hasErrorProperty(error, 'horizon_error') ||
        this.hasErrorProperty(error, 'stellar') ||
        this.hasErrorProperty(error, 'xlm') ||
        this.hasErrorProperty(error, 'trustline')
      );
    }

    return false;
  }

  /**
   * Get Stellar-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient balance': 'Insufficient XLM balance for transaction',
      'operation failed': 'Stellar operation failed',
      stellar: 'Stellar blockchain error occurred',
      horizon: 'Stellar Horizon API error occurred',
      xlm: 'Stellar Lumens (XLM) error occurred',
      trustline: 'Trustline operation failed',
      'account not found': 'Account does not exist on Stellar',
      'invalid signature': 'Transaction signature is invalid',
      'sequence number': 'Invalid sequence number',
      'fee too small': 'Transaction fee is too small',
    };
  }

  /**
   * Get Stellar-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Stellar network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet:
        'Stellar wallet error occurred. Please check your wallet connection.',
      contract: 'Stellar smart contract execution failed.',
      transaction: 'Stellar transaction failed. Please try again.',
      evm: 'Stellar blockchain error occurred.',
    };
  }
}
