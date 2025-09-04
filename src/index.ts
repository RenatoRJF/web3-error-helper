/**
 * Main entry point for web3-error-helper
 * 
 * This module serves as the public API facade for the web3-error-helper library.
 * It provides a clean, unified interface by re-exporting core functionality
 * from specialized modules while maintaining backward compatibility and
 * offering a simple import path for library consumers.
 */

export { translateError } from './services/error-translation';
export { getAvailableChains } from './chain-manager';
export {
  registerCustomChain,
  unregisterCustomChain,
  getCustomChain,
  getAllCustomChains,
  hasCustomChain,
  clearCustomChains,
} from './chain-registry';


export type {
  TranslateErrorOptions,
  ErrorTranslationResult,
  ErrorMapping,
  TranslatableError,
  SupportedChain,
  Web3Error,
  EthersError,
  ChainErrorMappings,
  CustomChainConfig,
  EVMErrorType,
  ErrorCategory,
  ChainType,
  ErrorType,
} from './types';

export type {
  ChainMetadata as RegistryChainMetadata,
  ChainConfig as RegistryChainConfig,
  ChainErrorConfig as RegistryChainErrorConfig,
} from './data/chain-registry';
