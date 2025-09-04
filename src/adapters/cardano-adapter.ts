/**
 * Cardano chain adapter
 *
 * This module provides error translation capabilities for the Cardano blockchain.
 * It handles Cardano-specific error formats, Plutus script errors, and transaction
 * failures commonly encountered when interacting with Cardano smart contracts
 * and transactions.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Cardano chain adapter for Cardano blockchain
 */
export class CardanoAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'cardano';
  readonly name = 'Cardano';
  readonly chainId = 'mainnet';

  /**
   * Extract error message from Cardano error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Cardano API error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }
      
      // Cardano transaction error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }
      
      // Plutus script error format
      if (errorObj.ScriptFailure && typeof errorObj.ScriptFailure === 'object') {
        const scriptFailure = errorObj.ScriptFailure as Record<string, unknown>;
        if (typeof scriptFailure.PlutusFailure === 'object' && scriptFailure.PlutusFailure !== null) {
          const plutusFailure = scriptFailure.PlutusFailure as Record<string, unknown>;
          if (typeof plutusFailure.EvaluationError === 'string') {
            return plutusFailure.EvaluationError;
          }
        }
      }
      
      // Cardano validation error format
      if (errorObj.ValidationError && typeof errorObj.ValidationError === 'string') {
        return errorObj.ValidationError;
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Cardano ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Cardano error patterns
      return (
        error.includes('insufficient ada') ||
        error.includes('script execution failed') ||
        error.includes('datum hash mismatch') ||
        error.includes('plutus') ||
        error.includes('cardano') ||
        error.includes('utxo')
      );
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Check for Cardano-specific properties
      return (
        this.hasErrorProperty(error, 'ScriptFailure') ||
        this.hasErrorProperty(error, 'ValidationError') ||
        this.hasErrorProperty(error, 'PlutusFailure') ||
        this.hasErrorProperty(error, 'EvaluationError') ||
        this.hasErrorProperty(error, 'utxo')
      );
    }

    return false;
  }

  /**
   * Get Cardano-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient ada': 'Insufficient ADA balance for transaction',
      'script execution failed': 'Plutus script execution failed',
      'datum hash mismatch': 'Datum hash does not match expected value',
      'plutus': 'Plutus smart contract error occurred',
      'cardano': 'Cardano blockchain error occurred',
      'utxo': 'UTXO validation error occurred',
      'invalid signature': 'Transaction signature is invalid',
      'expired transaction': 'Transaction has expired',
      'fee too small': 'Transaction fee is too small'
    };
  }

  /**
   * Get Cardano-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Cardano network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet: 'Cardano wallet error occurred. Please check your wallet connection.',
      contract: 'Cardano smart contract execution failed.',
      transaction: 'Cardano transaction failed. Please try again.',
      evm: 'Cardano blockchain error occurred.'
    };
  }
}
