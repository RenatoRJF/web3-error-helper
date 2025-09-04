/**
 * Ripple (XRP) chain adapter
 *
 * This module provides error translation capabilities for the Ripple (XRP) blockchain.
 * It handles Ripple-specific error formats, transaction failures, and payment
 * errors commonly encountered when interacting with Ripple network operations
 * and XRP Ledger transactions.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Ripple (XRP) chain adapter for Ripple blockchain
 */
export class RippleAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'ripple';
  readonly name = 'Ripple (XRP)';
  readonly chainId = 'mainnet';

  /**
   * Extract error message from Ripple error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Ripple API error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }
      
      // Ripple transaction error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }
      
      // Ripple result error format
      if (errorObj.result && typeof errorObj.result === 'object') {
        const result = errorObj.result as Record<string, unknown>;
        if (typeof result.error === 'string') {
          return result.error;
        }
        if (typeof result.error_message === 'string') {
          return result.error_message;
        }
      }
      
      // Ripple transaction result error format
      if (errorObj.transaction_result && typeof errorObj.transaction_result === 'object') {
        const txResult = errorObj.transaction_result as Record<string, unknown>;
        if (typeof txResult.result === 'string') {
          return `Transaction result: ${txResult.result}`;
        }
      }
      
      // Ripple ledger error format
      if (errorObj.ledger_error && typeof errorObj.ledger_error === 'string') {
        return errorObj.ledger_error;
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Ripple ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Ripple error patterns
      return (
        error.includes('insufficient funds') ||
        error.includes('ripple') ||
        error.includes('xrp') ||
        error.includes('ledger') ||
        error.includes('payment') ||
        error.includes('trustline')
      );
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Check for Ripple-specific properties
      return (
        this.hasErrorProperty(error, 'transaction_result') ||
        this.hasErrorProperty(error, 'ledger_error') ||
        this.hasErrorProperty(error, 'ripple') ||
        this.hasErrorProperty(error, 'xrp') ||
        this.hasErrorProperty(error, 'payment')
      );
    }

    return false;
  }

  /**
   * Get Ripple-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient funds': 'Insufficient XRP balance for transaction',
      'ripple': 'Ripple blockchain error occurred',
      'xrp': 'XRP Ledger error occurred',
      'ledger': 'XRP Ledger error occurred',
      'payment': 'Ripple payment failed',
      'trustline': 'Trustline operation failed',
      'account not found': 'Account does not exist on XRP Ledger',
      'invalid signature': 'Transaction signature is invalid',
      'sequence number': 'Invalid sequence number',
      'fee too small': 'Transaction fee is too small'
    };
  }

  /**
   * Get Ripple-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Ripple network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet: 'Ripple wallet error occurred. Please check your wallet connection.',
      contract: 'Ripple smart contract execution failed.',
      transaction: 'Ripple transaction failed. Please try again.',
      evm: 'Ripple blockchain error occurred.'
    };
  }
}
