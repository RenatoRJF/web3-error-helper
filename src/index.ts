/**
 * Main entry point for web3-error-helper
 *
 * This module serves as the public API facade for the web3-error-helper library.
 * It provides a clean, unified interface by re-exporting core functionality
 * from specialized modules while maintaining backward compatibility and
 * offering a simple import path for library consumers.
 */

import { loadAllTranslations } from './services/translation-loader';

// Load all translations on module initialization
loadAllTranslations();

export {
  translateError,
  setTimestampForTesting,
  resetTimestampForTesting,
} from './services/error-translation';
export { getAvailableChains } from './chain-manager';
export {
  registerCustomChain,
  unregisterCustomChain,
  getCustomChain,
  getAllCustomChains,
  hasCustomChain,
  clearCustomChains,
} from './chain-registry';

export {
  i18nManager,
  registerLocale,
  registerLocales,
  addOverrides,
  removeOverrides,
  getOverrides,
  setCurrentLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  translateForLanguage,
} from './services/i18n-manager';

export {
  languageBundleManager,
  configureLanguageSelection,
  getAvailableLanguages,
  getLoadedLanguages,
  isLanguageLoaded,
  loadLanguage,
  unloadLanguage,
} from './services/language-bundle-manager';

export {
  languageDetectionService,
  detectFromBrowser,
  detectFromError,
  detectRegion,
  getRegionalFallback,
} from './services/language-detection';

export {
  createTranslationKeys,
  getAdapterTranslationKeys,
  createTranslationKeyBuilder,
  validateTranslationKey,
  getAvailableTranslationKeys,
  hasTranslationKey,
  getTranslationKeyWithFallback,
  mergeTranslationKeys,
  filterTranslationKeys,
  getTranslationKeysByEcosystem,
} from './utils/translation-keys';

export {
  EVMAdapter,
  SolanaAdapter,
  CosmosAdapter,
  NearAdapter,
  CardanoAdapter,
  PolkadotAdapter,
  AlgorandAdapter,
  TezosAdapter,
  StellarAdapter,
  RippleAdapter,
  AdapterRegistry,
  adapterRegistry,
} from './adapters';

export type {
  TranslateErrorOptions,
  ErrorTranslationResult,
  EnhancedErrorResult,
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
  BlockchainEcosystem,
  ChainAdapter,
} from './types';

export type {
  SupportedLanguage,
  LanguageCode,
  TranslationKey,
  LanguageInfo,
  BaseTranslationKeys,
  EVMTranslationKeys,
  SolanaTranslationKeys,
  CosmosTranslationKeys,
  NearTranslationKeys,
  CardanoTranslationKeys,
  PolkadotTranslationKeys,
  AlgorandTranslationKeys,
  TezosTranslationKeys,
  StellarTranslationKeys,
  RippleTranslationKeys,
  AdapterTranslationKeys,
  CustomTranslationKeys,
  TranslationKeys,
  PartialTranslationOverride,
  LanguageSelection,
  LanguageSuggestion,
  TranslationLoadResult,
  LocaleConfig,
  I18nConfig,
  I18nManager,
  LanguageBundleManager,
  LanguageDetectionService,
  TranslationKeyBuilder,
  BundleSizeInfo,
  LanguageMetadata,
} from './types/i18n';

export type {
  ChainMetadata as RegistryChainMetadata,
  ChainConfig as RegistryChainConfig,
  ChainErrorConfig as RegistryChainErrorConfig,
} from './data/chain-registry';
