/**
 * Internationalization (i18n) type definitions for web3-error-helper
 *
 * This module defines all types related to internationalization support,
 * including translation keys, language configuration, and override systems.
 * Follows the same patterns and standards as the main types module.
 */

/**
 * Modern utility types for better type safety
 */
export type SupportedLanguage = string & { readonly __brand: unique symbol };
export type LanguageCode = string & { readonly __brand: unique symbol };
export type TranslationKey = string & { readonly __brand: unique symbol };

/**
 * Branded type constructors
 */
export const createLanguageCode = (code: string): LanguageCode =>
  code as LanguageCode;
export const createTranslationKey = (key: string): TranslationKey =>
  key as TranslationKey;

export interface LanguageInfo {
  name: string;
  nativeName: string;
  region: string;
  priority: number;
  blockchainMarket: string;
}

// ============================================================================
// Translation Key Types
// ============================================================================

/**
 * Base translation value type - can be a string or nested object
 */
export type TranslationValue = string | { [key: string]: TranslationValue };

/**
 * Translation object type - maps keys to translation values
 */
export type TranslationObject = Record<string, TranslationValue>;

/**
 * Translation parameters type - for interpolation
 */
export type TranslationParams = Record<string, string | number>;

// Base translation keys that all adapters support
export type BaseTranslationKeys = {
  network: string;
  wallet: string;
  insufficient_funds: string;
  transaction_failed: string;
  unknown_error: string;
};

// EVM-specific translation keys
export type EVMTranslationKeys = BaseTranslationKeys & {
  execution_reverted: string;
  gas_required_exceeds: string;
  nonce_too_low: string;
  nonce_too_high: string;
  gas_limit_exceeded: string;
  contract_call_failed: string;
  invalid_opcode: string;
  out_of_gas: string;
  revert: string;
  require_failed: string;
  invalid_signature: string;
  invalid_nonce: string;
  insufficient_gas: string;
  transaction_underpriced: string;
  replacement_transaction_underpriced: string;
  gas_price_too_low: string;
  gas_limit_too_high: string;
  invalid_transaction: string;
  transaction_already_known: string;
};

// Solana-specific translation keys
export type SolanaTranslationKeys = BaseTranslationKeys & {
  program_error: string;
  instruction_error: string;
  account_not_found: string;
  insufficient_lamports: string;
  account_rent_exempt: string;
  invalid_account_data: string;
  max_seed_length_exceeded: string;
  invalid_seeds: string;
  borsh_io_error: string;
  account_owned_by_wrong_program: string;
  invalid_program_id: string;
  invalid_account_owner: string;
  account_data_too_small: string;
  account_data_too_large: string;
  invalid_account_info: string;
  invalid_instruction_data: string;
  invalid_instruction_program_id: string;
  invalid_instruction_accounts: string;
  invalid_instruction_data_size: string;
  invalid_instruction_accounts_size: string;
};

// Cosmos-specific translation keys
export type CosmosTranslationKeys = BaseTranslationKeys & {
  abci_error: string;
  sequence_mismatch: string;
  insufficient_fee: string;
  invalid_sequence: string;
  unauthorized: string;
  insufficient_funds_cosmos: string;
  invalid_coins: string;
  invalid_gas_wanted: string;
  invalid_gas_used: string;
  out_of_gas_cosmos: string;
  invalid_memo: string;
  invalid_timeout_height: string;
  invalid_chain_id: string;
  invalid_signer: string;
  invalid_pubkey: string;
  invalid_signature_cosmos: string;
  invalid_tx: string;
  invalid_tx_size: string;
  invalid_tx_format: string;
  invalid_tx_signature: string;
};

// Near-specific translation keys
export type NearTranslationKeys = BaseTranslationKeys & {
  function_call_error: string;
  execution_error: string;
  invalid_account_id: string;
  account_not_found_near: string;
  insufficient_balance_near: string;
  invalid_public_key: string;
  access_key_not_found: string;
  method_not_found: string;
  account_already_exists: string;
  invalid_chain_id_near: string;
  invalid_action: string;
  invalid_action_hash: string;
  invalid_action_receipt: string;
  invalid_action_receipt_proof: string;
  invalid_block: string;
  invalid_block_hash: string;
  invalid_block_header: string;
  invalid_chunk: string;
  invalid_chunk_hash: string;
  invalid_chunk_header: string;
};

// Cardano-specific translation keys
export type CardanoTranslationKeys = BaseTranslationKeys & {
  plutus_script_error: string;
  insufficient_ada: string;
  invalid_utxo: string;
  script_execution_failed: string;
  invalid_datum: string;
  invalid_redeemer: string;
  script_hash_mismatch: string;
  invalid_script: string;
  execution_budget_exceeded: string;
  invalid_certificate: string;
  invalid_metadata: string;
  invalid_native_script: string;
  invalid_plutus_script: string;
  invalid_script_purpose: string;
  invalid_script_data: string;
  invalid_script_hash: string;
  invalid_script_inline_datum: string;
  invalid_script_reference: string;
  invalid_script_witness: string;
  invalid_script_validator: string;
};

// Polkadot-specific translation keys
export type PolkadotTranslationKeys = BaseTranslationKeys & {
  extrinsic_failed: string;
  dispatch_error: string;
  bad_origin: string;
  cannot_lookup: string;
  bad_signature: string;
  stale: string;
  future: string;
  would_corrupt: string;
  bad_state: string;
  module_error: string;
  consumer_remaining: string;
  no_providers: string;
  too_many_consumers: string;
  token: string;
  arithmetic: string;
  transactional: string;
  exhausted: string;
  corrupted: string;
  unavailable: string;
  root_not_allowed: string;
};

// Algorand-specific translation keys
export type AlgorandTranslationKeys = BaseTranslationKeys & {
  logic_error: string;
  insufficient_balance_algorand: string;
  invalid_account_algorand: string;
  invalid_application: string;
  invalid_asset: string;
  invalid_asset_holding: string;
  invalid_asset_params: string;
  invalid_asset_total: string;
  invalid_asset_unit: string;
  invalid_asset_url: string;
  invalid_asset_metadata_hash: string;
  invalid_asset_manager: string;
  invalid_asset_reserve: string;
  invalid_asset_freeze: string;
  invalid_asset_clawback: string;
  invalid_asset_creator: string;
  invalid_asset_decimals: string;
  invalid_asset_default_frozen: string;
  invalid_asset_name: string;
  invalid_asset_name_b64: string;
};

// Tezos-specific translation keys
export type TezosTranslationKeys = BaseTranslationKeys & {
  michelson_error: string;
  script_rejected: string;
  invalid_contract: string;
  insufficient_balance_tezos: string;
  invalid_operation: string;
  invalid_signature: string;
  invalid_public_key: string;
  invalid_address: string;
  invalid_amount: string;
  invalid_fee: string;
  invalid_counter: string;
  invalid_gas_limit: string;
  invalid_storage_limit: string;
  invalid_parameters: string;
  invalid_entrypoint: string;
  invalid_contract_handle: string;
  invalid_contract_storage: string;
  invalid_contract_code: string;
  invalid_contract_balance: string;
  invalid_contract_manager: string;
};

// Stellar-specific translation keys
export type StellarTranslationKeys = BaseTranslationKeys & {
  operation_error: string;
  horizon_error: string;
  insufficient_balance_stellar: string;
  invalid_account_stellar: string;
  invalid_asset_stellar: string;
  invalid_operation_stellar: string;
  invalid_signature_stellar: string;
  invalid_sequence_stellar: string;
  invalid_time_bounds: string;
  invalid_threshold: string;
  invalid_trustline: string;
  invalid_offer: string;
  invalid_payment: string;
  invalid_path_payment: string;
  invalid_manage_offer: string;
  invalid_create_passive_offer: string;
  invalid_set_options: string;
  invalid_change_trust: string;
  invalid_allow_trust: string;
  invalid_account_merge: string;
};

// Ripple-specific translation keys
export type RippleTranslationKeys = BaseTranslationKeys & {
  transaction_result: string;
  ledger_error: string;
  insufficient_balance_ripple: string;
  invalid_account_ripple: string;
  invalid_currency: string;
  invalid_issuer: string;
  invalid_amount_ripple: string;
  invalid_fee_ripple: string;
  invalid_sequence_ripple: string;
  invalid_signature_ripple: string;
  invalid_transaction_type: string;
  invalid_transaction_format: string;
  invalid_transaction_data: string;
  invalid_transaction_hash: string;
  invalid_transaction_sequence: string;
  invalid_transaction_fee: string;
  invalid_transaction_flags: string;
  invalid_transaction_last_ledger_sequence: string;
  invalid_transaction_account_txn_id: string;
  invalid_transaction_source_tag: string;
};

// Union type for all adapter-specific keys
export type AdapterTranslationKeys =
  | EVMTranslationKeys
  | SolanaTranslationKeys
  | CosmosTranslationKeys
  | NearTranslationKeys
  | CardanoTranslationKeys
  | PolkadotTranslationKeys
  | AlgorandTranslationKeys
  | TezosTranslationKeys
  | StellarTranslationKeys
  | RippleTranslationKeys;

// Allow custom keys for missing errors
export type CustomTranslationKeys = Record<string, string>;

// Combined type for complete translation support
export type TranslationKeys = AdapterTranslationKeys & CustomTranslationKeys;

// Partial translation override - only specify keys you want to override
export type PartialTranslationOverride = Partial<TranslationKeys>;

// ============================================================================
// Language Selection Types
// ============================================================================

export interface LanguageSelection {
  // Languages the developer wants to support in their application
  targetLanguages: string[];
  // Whether to include English as fallback (default: true)
  includeEnglishFallback?: boolean;
  // Whether to auto-detect and suggest similar languages
  autoSuggest?: boolean;
}

export interface LanguageSuggestion {
  requested: string;
  available: string | null;
  suggestions: string[];
  reason: 'exact_match' | 'similar_match' | 'not_found' | 'fallback_available';
}

export interface TranslationLoadResult {
  loaded: string[];
  missing: string[];
  suggestions: LanguageSuggestion[];
  fallbacks: Record<string, string>;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface LocaleConfig<T extends TranslationKeys = TranslationKeys> {
  language: string;
  resources: {
    errors: T;
  };
  // Support for partial overrides
  overrides?: PartialTranslationOverride;
}

export interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  supportedLanguages: string[];
  currentLanguage: string;
  autoDetect: boolean;
  developerLocales?: Record<string, LocaleConfig>;
  // Global partial overrides
  globalOverrides?: Record<string, PartialTranslationOverride>;
  // Language selection configuration
  languageSelection?: LanguageSelection;
}

// ============================================================================
// Service Types
// ============================================================================

export interface I18nManager {
  registerLocale(
    _language: string,
    _translations: Record<string, string>,
    _overrides?: PartialTranslationOverride
  ): void;
  registerLocales(
    _locales: Record<
      string,
      {
        translations: Record<string, string>;
        overrides?: PartialTranslationOverride;
      }
    >
  ): void;
  addOverrides(_language: string, _overrides: PartialTranslationOverride): void;
  removeOverrides(_language: string, _keys: string[]): void;
  getOverrides(_language: string): PartialTranslationOverride;
  translate(
    _key: string,
    _language?: string,
    _params?: Record<string, string>
  ): string;
  setCurrentLanguage(_language: string): void;
  getCurrentLanguage(): string;
  getSupportedLanguages(): string[];
  isLanguageSupported(_language: string): boolean;
}

export interface LanguageBundleManager {
  configureLanguageSelection(
    _selection: LanguageSelection
  ): TranslationLoadResult;
  getAvailableLanguages(): Array<{ code: string; info: LanguageInfo }>;
  getLoadedLanguages(): string[];
  isLanguageLoaded(_language: string): boolean;
  loadLanguage(_language: string): void;
  unloadLanguage(_language: string): void;
}

export interface LanguageDetectionService {
  detectFromBrowser(): string;
  detectFromError(_error: unknown): string;
  detectRegion(): string;
  getRegionalFallback(_region: string): string;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface TranslationKeyBuilder<
  T extends TranslationKeys = TranslationKeys,
> {
  addAdapterKeys<K extends keyof T>(_keys: Pick<T, K>): this;
  addCustomKeys(_keys: CustomTranslationKeys): this;
  build(): T;
}

export interface BundleSizeInfo {
  loaded: number;
  total: number;
  savings: string;
  estimatedSize: string;
}

export interface LanguageMetadata {
  code: string;
  info: LanguageInfo;
  isLoaded: boolean;
  hasOverrides: boolean;
  overrideCount: number;
}
