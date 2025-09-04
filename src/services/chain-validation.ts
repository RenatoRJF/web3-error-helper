/**
 * Chain validation functionality
 * 
 * This module provides comprehensive validation capabilities for blockchain network
 * identifiers and configurations. It validates chain formats, metadata completeness,
 * and configuration integrity. Ensures data quality and provides detailed error
 * reporting for debugging and troubleshooting chain-related issues.
 */

import { SupportedChain } from '../types';
import { ChainMetadata, getChainConfig } from '../data/chain-registry';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: ChainMetadata;
}

/**
 * Validate chain identifier format
 * 
 * @param chain - The chain identifier to validate
 * @returns Validation result
 */
export function validateChainFormat(chain: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!chain) {
    errors.push('Chain identifier is required');
    return { isValid: false, errors, warnings };
  }
  
  if (typeof chain !== 'string') {
    errors.push('Chain identifier must be a string');
    return { isValid: false, errors, warnings };
  }
  
  if (chain.trim().length === 0) {
    errors.push('Chain identifier cannot be empty');
    return { isValid: false, errors, warnings };
  }
  
  // Check for valid characters (alphanumeric, hyphens, underscores, dots)
  if (!/^[a-zA-Z0-9._-]+$/.test(chain)) {
    errors.push('Chain identifier contains invalid characters. Use only alphanumeric characters, hyphens, underscores, and dots');
  }
  
  // Check for reasonable length
  if (chain.length > 50) {
    warnings.push('Chain identifier is unusually long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate built-in chain
 * 
 * @param chain - The chain identifier to validate
 * @returns Validation result with metadata
 */
export function validateBuiltInChain(chain: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // First validate format
  const formatValidation = validateChainFormat(chain);
  if (!formatValidation.isValid) {
    return formatValidation;
  }
  
  // Check if it's a supported chain
  const supportedChains = Object.values(SupportedChain);
  if (!supportedChains.includes(chain as SupportedChain)) {
    errors.push(`Chain '${chain}' is not a built-in supported chain`);
    return { isValid: false, errors, warnings };
  }
  
  // Get metadata
  const config = getChainConfig(chain as SupportedChain);
  if (!config) {
    errors.push(`No configuration found for chain '${chain}'`);
    return { isValid: false, errors, warnings };
  }
  
  const metadata = config.metadata;
  
  // Validate metadata completeness
  if (!metadata.name) {
    errors.push(`Chain '${chain}' is missing name`);
  }
  
  if (!metadata.chainId) {
    errors.push(`Chain '${chain}' is missing chainId`);
  } else if (metadata.chainId <= 0) {
    errors.push(`Chain '${chain}' has invalid chainId: ${metadata.chainId}`);
  }
  
  if (!metadata.symbol) {
    errors.push(`Chain '${chain}' is missing symbol`);
  } else if (metadata.symbol.length > 10) {
    warnings.push(`Chain '${chain}' has unusually long symbol: ${metadata.symbol}`);
  }
  
  if (!metadata.nativeCurrency) {
    errors.push(`Chain '${chain}' is missing native currency information`);
  } else {
    const currency = metadata.nativeCurrency;
    if (!currency.name) {
      errors.push(`Chain '${chain}' native currency is missing name`);
    }
    if (!currency.symbol) {
      errors.push(`Chain '${chain}' native currency is missing symbol`);
    }
    if (currency.decimals === undefined || currency.decimals < 0 || currency.decimals > 18) {
      errors.push(`Chain '${chain}' native currency has invalid decimals: ${currency.decimals}`);
    }
  }
  
  if (!metadata.rpcUrls || metadata.rpcUrls.length === 0) {
    warnings.push(`Chain '${chain}' has no RPC URLs configured`);
  } else {
    // Validate RPC URLs
    for (const url of metadata.rpcUrls) {
      if (!isValidUrl(url)) {
        errors.push(`Chain '${chain}' has invalid RPC URL: ${url}`);
      }
    }
  }
  
  if (!metadata.blockExplorerUrls || metadata.blockExplorerUrls.length === 0) {
    warnings.push(`Chain '${chain}' has no block explorer URLs configured`);
  } else {
    // Validate block explorer URLs
    for (const url of metadata.blockExplorerUrls) {
      if (!isValidUrl(url)) {
        errors.push(`Chain '${chain}' has invalid block explorer URL: ${url}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metadata
  };
}


/**
 * Simple URL validation helper
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
