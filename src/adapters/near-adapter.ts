/**
 * Near chain adapter
 *
 * This module provides error translation capabilities for the Near Protocol
 * blockchain. It handles Near-specific error formats, RPC errors, and transaction
 * failures commonly encountered when interacting with Near smart contracts
 * and accounts.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Near chain adapter for Near Protocol blockchain
 */
export class NearAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'near';
  readonly name = 'Near Protocol';
  readonly chainId = 'mainnet';

  /**
   * Extract error message from Near error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      // Near RPC error format
      if (errorObj.message && typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      // Near transaction error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }

      // Near execution error format
      if (errorObj.Failure && typeof errorObj.Failure === 'object') {
        const failure = errorObj.Failure as Record<string, unknown>;
        if (
          typeof failure.ActionError === 'object' &&
          failure.ActionError !== null
        ) {
          const actionError = failure.ActionError as Record<string, unknown>;
          if (
            typeof actionError.kind === 'object' &&
            actionError.kind !== null
          ) {
            const kind = actionError.kind as Record<string, unknown>;
            if (
              typeof kind.FunctionCallError === 'object' &&
              kind.FunctionCallError !== null
            ) {
              const funcError = kind.FunctionCallError as Record<
                string,
                unknown
              >;
              if (typeof funcError.ExecutionError === 'string') {
                return funcError.ExecutionError;
              }
            }
          }
        }
      }

      // Near account error format
      if (errorObj.AccountDoesNotExist) {
        return 'Account does not exist on Near Protocol';
      }

      if (errorObj.AccessKeyDoesNotExist) {
        return 'Access key does not exist for this account';
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Near ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Near error patterns
      return (
        error.includes('insufficient balance') ||
        error.includes('account does not exist') ||
        error.includes('access key') ||
        error.includes('function call') ||
        error.includes('execution error') ||
        error.includes('near') ||
        error.includes('NEAR')
      );
    }

    if (error && typeof error === 'object') {
      // Check for Near-specific properties
      return (
        this.hasErrorProperty(error, 'Failure') ||
        this.hasErrorProperty(error, 'AccountDoesNotExist') ||
        this.hasErrorProperty(error, 'AccessKeyDoesNotExist') ||
        this.hasErrorProperty(error, 'FunctionCallError') ||
        this.hasErrorProperty(error, 'ExecutionError')
      );
    }

    return false;
  }

  /**
   * Get Near-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient balance': 'Insufficient NEAR balance for transaction',
      'account does not exist': 'Account does not exist on Near Protocol',
      'access key': 'Access key error occurred',
      'function call': 'Smart contract function call failed',
      'execution error': 'Contract execution error occurred',
      near: 'Near Protocol blockchain error occurred',
      NEAR: 'Near Protocol blockchain error occurred',
      'invalid account': 'Account address is invalid',
      'insufficient allowance': 'Insufficient token allowance',
      'contract not found': 'Smart contract not found',
    };
  }

  /**
   * Get Near-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network:
        'Near Protocol network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet:
        'Near wallet error occurred. Please check your wallet connection.',
      contract: 'Near smart contract execution failed.',
      transaction: 'Near transaction failed. Please try again.',
      evm: 'Near Protocol blockchain error occurred.',
    };
  }
}
