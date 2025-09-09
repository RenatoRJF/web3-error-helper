/**
 * EVM chain adapter
 *
 * This module provides error translation capabilities for EVM-compatible
 * blockchain networks. It handles common EVM error formats and patterns
 * used across Ethereum, Polygon, Arbitrum, and other EVM chains.
 */

import { BaseChainAdapter } from './base-adapter';
import { BlockchainEcosystem } from '../types';

/**
 * EVM chain adapter for Ethereum-compatible networks
 */
export class EVMAdapter extends BaseChainAdapter {
  readonly ecosystem: BlockchainEcosystem = 'evm';
  readonly name = 'EVM';
  readonly chainId?: string | number;

  constructor(chainId?: string | number) {
    super();
    this.chainId = chainId;
  }

  /**
   * Extract error message from EVM error format
   */
  extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      // EVM-specific error message extraction
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      if (typeof errorObj.reason === 'string') {
        return errorObj.reason;
      }

      if (typeof errorObj.data === 'string') {
        return errorObj.data;
      }

      // Handle ethers.js error format
      if (errorObj.code && typeof errorObj.message === 'string') {
        return errorObj.message;
      }

      // Handle web3.js error format
      if (errorObj.error && typeof errorObj.error === 'object') {
        const innerError = errorObj.error as Record<string, unknown>;
        if (typeof innerError.message === 'string') {
          return innerError.message;
        }
      }
    }

    return this.extractMessageFromError(error);
  }

  /**
   * Check if error format matches EVM ecosystem
   */
  matchesErrorFormat(error: unknown): boolean {
    if (typeof error === 'string') {
      // Check for EVM-specific error patterns (more specific)
      return (
        error.includes('execution reverted') ||
        error.includes('gas required exceeds allowance') ||
        error.includes('nonce too low') ||
        error.includes('revert') ||
        error.includes('out of gas') ||
        error.includes('gas limit')
      );
    }

    if (error && typeof error === 'object') {
      // Check for EVM-specific properties
      return (
        this.hasErrorProperty(error, 'code') ||
        this.hasErrorProperty(error, 'data') ||
        this.hasErrorProperty(error, 'transaction') ||
        this.hasErrorProperty(error, 'receipt')
      );
    }

    return false;
  }

  /**
   * Get EVM-specific error patterns
   */
  getErrorPatterns(): Record<string, string> {
    return {
      'execution reverted': 'Transaction execution failed',
      'insufficient funds': 'Insufficient balance for transaction',
      'gas required exceeds allowance': 'Gas limit too low',
      'nonce too low': 'Transaction nonce is too low',
      revert: 'Transaction was reverted',
      'user rejected': 'Transaction was rejected by user',
      'network error': 'Network connection failed',
      timeout: 'Transaction timeout occurred',
    };
  }

  /**
   * Get EVM-specific fallback messages
   */
  getFallbackMessages(): Record<string, string> {
    return {
      network: 'Network error occurred. Please check your connection.',
      gas: 'Gas estimation failed. Please try again or increase gas limit.',
      wallet: 'Wallet error occurred. Please check your wallet connection.',
      contract: 'Smart contract execution failed.',
      transaction: 'Transaction failed. Please try again.',
      evm: 'EVM execution error occurred.',
    };
  }
}
