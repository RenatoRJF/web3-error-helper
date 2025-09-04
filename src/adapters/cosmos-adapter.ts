/**
 * Cosmos chain adapter
 *
 * This module provides error translation capabilities for Cosmos SDK-based
 * blockchain networks. It handles Cosmos-specific error formats, ABCI errors,
 * and transaction failures commonly encountered when interacting with
 * Cosmos chains like Cosmos Hub, Osmosis, and others.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * Cosmos chain adapter for Cosmos SDK-based blockchains
 */
export class CosmosAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'cosmos';
  readonly name = 'Cosmos';
  readonly chainId?: string | number;

  constructor(chainId?: string | number) {
    super();
    this.chainId = chainId;
  }

  /**
   * Extract error message from Cosmos error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Cosmos ABCI error format
      if (errorObj.code && typeof errorObj.message === 'string') {
        return errorObj.message;
      }
      
      // Cosmos transaction error format
      if (errorObj.tx_response && typeof errorObj.tx_response === 'object') {
        const txResponse = errorObj.tx_response as Record<string, unknown>;
        if (typeof txResponse.raw_log === 'string') {
          return txResponse.raw_log;
        }
      }
      
      // Cosmos RPC error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }
      
      // Cosmos module error format
      if (errorObj.type && typeof errorObj.message === 'string') {
        return errorObj.message;
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches Cosmos ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for common Cosmos error patterns
      return (
        error.includes('insufficient funds') ||
        error.includes('account sequence mismatch') ||
        error.includes('signature verification failed') ||
        error.includes('invalid sequence') ||
        error.includes('out of gas') ||
        error.includes('ABCI') ||
        error.includes('cosmos')
      );
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      
      // Check for Cosmos-specific properties
      return (
        this.hasErrorProperty(error, 'code') ||
        this.hasErrorProperty(error, 'tx_response') ||
        this.hasErrorProperty(error, 'raw_log') ||
        this.hasErrorProperty(error, 'type') ||
        this.hasErrorProperty(error, 'module')
      );
    }

    return false;
  }

  /**
   * Get Cosmos-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'insufficient funds': 'Insufficient balance for transaction',
      'account sequence mismatch': 'Account sequence number mismatch',
      'signature verification failed': 'Transaction signature verification failed',
      'invalid sequence': 'Invalid account sequence number',
      'out of gas': 'Transaction ran out of gas',
      'ABCI': 'ABCI application error occurred',
      'cosmos': 'Cosmos blockchain error occurred',
      'invalid account': 'Account address is invalid',
      'insufficient fee': 'Transaction fee is too low',
      'memo too large': 'Transaction memo exceeds maximum size'
    };
  }

  /**
   * Get Cosmos-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Cosmos network error occurred. Please check your connection.',
      gas: 'Gas estimation failed. Please try again or increase gas limit.',
      wallet: 'Cosmos wallet error occurred. Please check your wallet connection.',
      contract: 'Cosmos module execution failed.',
      transaction: 'Cosmos transaction failed. Please try again.',
      evm: 'Cosmos blockchain error occurred.'
    };
  }
}
