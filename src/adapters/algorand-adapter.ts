/**
 * Algorand chain adapter
 *
 * This module provides error translation capabilities for the Algorand blockchain.
 * It handles Algorand-specific error formats, TEAL execution errors, and transaction
 * failures commonly encountered when interacting with Algorand smart contracts
 * and transactions.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Algorand chain adapter for Algorand blockchain
 */
export class AlgorandAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'algorand';
  readonly name = 'Algorand';
  readonly chainId = 'mainnet';

  /**
   * Extract error message from Algorand error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Algorand API error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }
      
      // Algorand transaction error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }
      
      // TEAL execution error format
      if (errorObj.logic_error && typeof errorObj.logic_error === 'object') {
        const logicError = errorObj.logic_error as Record<string, unknown>;
        if (typeof logicError.message === 'string') {
          return logicError.message;
        }
      }
      
      // Algorand validation error format
      if (errorObj.validation_error && typeof errorObj.validation_error === 'string') {
        return errorObj.validation_error;
      }
      
      // Algorand network error format
      if (errorObj.network_error && typeof errorObj.network_error === 'string') {
        return errorObj.network_error;
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Algorand ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Algorand error patterns
      return (
        error.includes('insufficient balance') ||
        error.includes('logic error') ||
        error.includes('invalid signature') ||
        error.includes('algorand') ||
        error.includes('teal') ||
        error.includes('asa')
      );
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Check for Algorand-specific properties
      return (
        this.hasErrorProperty(error, 'logic_error') ||
        this.hasErrorProperty(error, 'validation_error') ||
        this.hasErrorProperty(error, 'network_error') ||
        this.hasErrorProperty(error, 'asa') ||
        this.hasErrorProperty(error, 'teal')
      );
    }

    return false;
  }

  /**
   * Get Algorand-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient balance': 'Insufficient ALGO balance for transaction',
      'logic error': 'TEAL smart contract logic error occurred',
      'invalid signature': 'Transaction signature is invalid',
      'algorand': 'Algorand blockchain error occurred',
      'teal': 'TEAL execution error occurred',
      'asa': 'Algorand Standard Asset error occurred',
      'account not found': 'Account does not exist on Algorand',
      'asset not found': 'Asset does not exist',
      'fee too small': 'Transaction fee is too small'
    };
  }

  /**
   * Get Algorand-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Algorand network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet: 'Algorand wallet error occurred. Please check your wallet connection.',
      contract: 'Algorand smart contract execution failed.',
      transaction: 'Algorand transaction failed. Please try again.',
      evm: 'Algorand blockchain error occurred.'
    };
  }
}
