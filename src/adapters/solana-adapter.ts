/**
 * Solana chain adapter
 *
 * This module provides error translation capabilities for the Solana blockchain.
 * It handles Solana-specific error formats, RPC errors, and transaction failures
 * commonly encountered when interacting with Solana programs and accounts.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Solana chain adapter for Solana blockchain
 */
export class SolanaAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'solana';
  readonly name = 'Solana';
  readonly chainId = 'mainnet-beta';

  /**
   * Extract error message from Solana error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      // Solana RPC error format
      if (errorObj.data && typeof errorObj.data === 'object') {
        const data = errorObj.data as Record<string, unknown>;
        if (typeof data.err === 'object' && data.err !== null) {
          const err = data.err as Record<string, unknown>;
          if (typeof err.message === 'string') {
            return err.message;
          }
        }
      }

      // Solana program error format
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      // Solana transaction error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }

      // Solana instruction error format
      if (
        errorObj.InstructionError &&
        Array.isArray(errorObj.InstructionError)
      ) {
        const [, instructionError] = errorObj.InstructionError;
        if (typeof instructionError === 'object' && instructionError !== null) {
          const err = instructionError as Record<string, unknown>;
          if (typeof err.Custom === 'number') {
            return `Program error: ${err.Custom}`;
          }
        }
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Solana ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Solana error patterns
      return (
        error.includes('insufficient funds') ||
        error.includes('account not found') ||
        error.includes('program error') ||
        error.includes('instruction error') ||
        error.includes('blockhash not found') ||
        error.includes('signature verification failed')
      );
    }

    if (error && typeof error === 'object') {
      // Check for Solana-specific properties
      return (
        this.hasErrorProperty(error, 'InstructionError') ||
        this.hasErrorProperty(error, 'ProgramError') ||
        this.hasErrorProperty(error, 'slot') ||
        this.hasErrorProperty(error, 'blockhash') ||
        this.hasErrorProperty(error, 'signature')
      );
    }

    return false;
  }

  /**
   * Get Solana-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient funds': 'Insufficient SOL balance for transaction',
      'account not found': 'Account does not exist on Solana',
      'program error': 'Solana program execution failed',
      'instruction error': 'Instruction execution failed',
      'blockhash not found': 'Blockhash expired or not found',
      'signature verification failed': 'Transaction signature is invalid',
      'duplicate signature': 'Transaction signature already exists',
      'invalid account owner': 'Account owner is invalid',
      'account already in use': 'Account is already in use',
      'invalid account data': 'Account data is invalid',
    };
  }

  /**
   * Get Solana-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Solana network error occurred. Please check your connection.',
      gas: 'Transaction fee estimation failed. Please try again.',
      wallet:
        'Solana wallet error occurred. Please check your wallet connection.',
      contract: 'Solana program execution failed.',
      transaction: 'Solana transaction failed. Please try again.',
      evm: 'Solana blockchain error occurred.',
    };
  }
}
