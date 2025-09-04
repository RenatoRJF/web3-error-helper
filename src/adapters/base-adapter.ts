/**
 * Base chain adapter implementation
 *
 * This module provides the foundation for all blockchain ecosystem adapters.
 * It defines the common interface and shared functionality for translating
 * errors across different blockchain networks (EVM, Solana, Cosmos, Near).
 */

import { ChainAdapter, BlockchainEcosystem } from '../types';

/**
 * Abstract base class for all chain adapters
 */
export abstract class BaseChainAdapter implements ChainAdapter {
  abstract readonly ecosystem: BlockchainEcosystem;
  abstract readonly name: string;
  abstract readonly chainId?: string | number;

  /**
   * Extract error message from blockchain-specific error format
   */
  abstract extractErrorMessage(error: unknown): string;

  /**
   * Check if error format matches this ecosystem
   */
  abstract matchesErrorFormat(error: unknown): boolean;

  /**
   * Get ecosystem-specific error patterns
   */
  abstract getErrorPatterns(): Record<string, string>;

  /**
   * Get ecosystem-specific fallback messages
   */
  abstract getFallbackMessages(): Record<string, string>;

  /**
   * Common error message extraction logic
   */
  protected extractMessageFromError(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      // Try common error message properties
      const errorObj = error as Record<string, unknown>;
      
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }
      
      if (typeof errorObj.error === 'string') {
        return errorObj.error;
      }
      
      if (typeof errorObj.reason === 'string') {
        return errorObj.reason;
      }
      
      if (typeof errorObj.details === 'string') {
        return errorObj.details;
      }
    }

    return 'Unknown error occurred';
  }

  /**
   * Check if error has specific properties that indicate ecosystem type
   */
  protected hasErrorProperty(error: unknown, property: string): boolean {
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      return property in errorObj;
    }
    return false;
  }
}
