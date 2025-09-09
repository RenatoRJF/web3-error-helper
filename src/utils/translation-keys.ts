/**
 * Type-safe translation key utilities and helpers
 *
 * This module provides utilities for creating and managing translation keys
 * with full type safety. It follows the same patterns and standards as
 * other utility modules in the codebase.
 */

import {
  TranslationKeys,
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
  TranslationKeyBuilder,
  CustomTranslationKeys,
} from '../types/i18n';

/**
 * Type-safe translation key builder implementation
 */
class TranslationKeyBuilderImpl<T extends TranslationKeys = TranslationKeys>
  implements TranslationKeyBuilder<T>
{
  private keys: Partial<T> = {};

  /**
   * Add adapter-specific keys with type safety
   */
  addAdapterKeys<K extends keyof T>(keys: Pick<T, K>): this {
    Object.assign(this.keys, keys);
    return this;
  }

  /**
   * Add custom keys for missing errors
   */
  addCustomKeys(keys: CustomTranslationKeys): this {
    Object.assign(this.keys, keys);
    return this;
  }

  /**
   * Build the final translation keys object
   */
  build(): T {
    return this.keys as T;
  }
}

/**
 * Helper to create type-safe translation keys for specific adapters
 */
export const createTranslationKeys = {
  /**
   * Create EVM-specific translation keys
   */
  evm: (): EVMTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    execution_reverted: 'Transaction execution failed',
    gas_required_exceeds: 'Gas limit too low',
    nonce_too_low: 'Transaction nonce is too low',
    nonce_too_high: 'Transaction nonce is too high',
    gas_limit_exceeded: 'Gas limit exceeded',
    contract_call_failed: 'Smart contract call failed',
    invalid_opcode: 'Invalid opcode executed',
    out_of_gas: 'Transaction ran out of gas',
    revert: 'Transaction was reverted',
    require_failed: 'Require condition failed',
    invalid_signature: 'Invalid transaction signature',
    invalid_nonce: 'Invalid transaction nonce',
    insufficient_gas: 'Insufficient gas for transaction',
    transaction_underpriced: 'Transaction fee too low',
    replacement_transaction_underpriced: 'Replacement transaction fee too low',
    gas_price_too_low: 'Gas price too low',
    gas_limit_too_high: 'Gas limit too high',
    invalid_transaction: 'Invalid transaction format',
    transaction_already_known: 'Transaction already known',
  }),

  /**
   * Create Solana-specific translation keys
   */
  solana: (): SolanaTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    program_error: 'Solana program execution failed',
    instruction_error: 'Instruction execution failed',
    account_not_found: 'Account does not exist on Solana',
    insufficient_lamports: 'Insufficient lamports for transaction',
    account_rent_exempt: 'Account is not rent exempt',
    invalid_account_data: 'Invalid account data',
    max_seed_length_exceeded: 'Maximum seed length exceeded',
    invalid_seeds: 'Invalid seeds provided',
    borsh_io_error: 'Borsh serialization/deserialization error',
    account_owned_by_wrong_program: 'Account is owned by wrong program',
    invalid_program_id: 'Invalid program ID',
    invalid_account_owner: 'Invalid account owner',
    account_data_too_small: 'Account data too small',
    account_data_too_large: 'Account data too large',
    invalid_account_info: 'Invalid account info',
    invalid_instruction_data: 'Invalid instruction data',
    invalid_instruction_program_id: 'Invalid instruction program ID',
    invalid_instruction_accounts: 'Invalid instruction accounts',
    invalid_instruction_data_size: 'Invalid instruction data size',
    invalid_instruction_accounts_size: 'Invalid instruction accounts size',
  }),

  /**
   * Create Cosmos-specific translation keys
   */
  cosmos: (): CosmosTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    abci_error: 'ABCI application error occurred',
    sequence_mismatch: 'Account sequence number mismatch',
    insufficient_fee: 'Insufficient fee for transaction',
    invalid_sequence: 'Invalid sequence number',
    unauthorized: 'Unauthorized transaction',
    insufficient_funds_cosmos: 'Insufficient funds for transaction',
    invalid_coins: 'Invalid coin denomination',
    invalid_gas_wanted: 'Invalid gas wanted',
    invalid_gas_used: 'Invalid gas used',
    out_of_gas_cosmos: 'Transaction ran out of gas',
    invalid_memo: 'Invalid transaction memo',
    invalid_timeout_height: 'Invalid timeout height',
    invalid_chain_id: 'Invalid chain ID',
    invalid_signer: 'Invalid transaction signer',
    invalid_pubkey: 'Invalid public key',
    invalid_signature_cosmos: 'Invalid transaction signature',
    invalid_tx: 'Invalid transaction',
    invalid_tx_size: 'Invalid transaction size',
    invalid_tx_format: 'Invalid transaction format',
    invalid_tx_signature: 'Invalid transaction signature',
  }),

  /**
   * Create Near-specific translation keys
   */
  near: (): NearTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    function_call_error: 'Near function call failed',
    execution_error: 'Near execution error occurred',
    invalid_account_id: 'Invalid Near account ID',
    account_not_found_near: 'Account does not exist on Near',
    insufficient_balance_near: 'Insufficient balance for transaction',
    invalid_public_key: 'Invalid Near public key',
    access_key_not_found: 'Access key not found',
    method_not_found: 'Method not found',
    account_already_exists: 'Account already exists',
    invalid_chain_id_near: 'Invalid Near chain ID',
    invalid_action: 'Invalid Near action',
    invalid_action_hash: 'Invalid action hash',
    invalid_action_receipt: 'Invalid action receipt',
    invalid_action_receipt_proof: 'Invalid action receipt proof',
    invalid_block: 'Invalid Near block',
    invalid_block_hash: 'Invalid block hash',
    invalid_block_header: 'Invalid block header',
    invalid_chunk: 'Invalid Near chunk',
    invalid_chunk_hash: 'Invalid chunk hash',
    invalid_chunk_header: 'Invalid chunk header',
  }),

  /**
   * Create Cardano-specific translation keys
   */
  cardano: (): CardanoTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    plutus_script_error: 'Cardano Plutus script error',
    insufficient_ada: 'Insufficient ADA for transaction',
    invalid_utxo: 'Invalid UTXO',
    script_execution_failed: 'Cardano script execution failed',
    invalid_datum: 'Invalid datum',
    invalid_redeemer: 'Invalid redeemer',
    script_hash_mismatch: 'Script hash mismatch',
    invalid_script: 'Invalid Cardano script',
    execution_budget_exceeded: 'Execution budget exceeded',
    invalid_certificate: 'Invalid certificate',
    invalid_metadata: 'Invalid metadata',
    invalid_native_script: 'Invalid native script',
    invalid_plutus_script: 'Invalid Plutus script',
    invalid_script_purpose: 'Invalid script purpose',
    invalid_script_data: 'Invalid script data',
    invalid_script_hash: 'Invalid script hash',
    invalid_script_inline_datum: 'Invalid script inline datum',
    invalid_script_reference: 'Invalid script reference',
    invalid_script_witness: 'Invalid script witness',
    invalid_script_validator: 'Invalid script validator',
  }),

  /**
   * Create Polkadot-specific translation keys
   */
  polkadot: (): PolkadotTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    extrinsic_failed: 'Polkadot extrinsic failed',
    dispatch_error: 'Polkadot dispatch error',
    bad_origin: 'Bad origin',
    cannot_lookup: 'Cannot lookup',
    bad_signature: 'Bad signature',
    stale: 'Stale',
    future: 'Future',
    would_corrupt: 'Would corrupt',
    bad_state: 'Bad state',
    module_error: 'Module error',
    consumer_remaining: 'Consumer remaining',
    no_providers: 'No providers',
    too_many_consumers: 'Too many consumers',
    token: 'Token error',
    arithmetic: 'Arithmetic error',
    transactional: 'Transactional error',
    exhausted: 'Exhausted',
    corrupted: 'Corrupted',
    unavailable: 'Unavailable',
    root_not_allowed: 'Root not allowed',
  }),

  /**
   * Create Algorand-specific translation keys
   */
  algorand: (): AlgorandTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    logic_error: 'Algorand logic error',
    insufficient_balance_algorand: 'Insufficient balance for transaction',
    invalid_account_algorand: 'Invalid Algorand account',
    invalid_application: 'Invalid Algorand application',
    invalid_asset: 'Invalid Algorand asset',
    invalid_asset_holding: 'Invalid asset holding',
    invalid_asset_params: 'Invalid asset parameters',
    invalid_asset_total: 'Invalid asset total',
    invalid_asset_unit: 'Invalid asset unit',
    invalid_asset_url: 'Invalid asset URL',
    invalid_asset_metadata_hash: 'Invalid asset metadata hash',
    invalid_asset_manager: 'Invalid asset manager',
    invalid_asset_reserve: 'Invalid asset reserve',
    invalid_asset_freeze: 'Invalid asset freeze',
    invalid_asset_clawback: 'Invalid asset clawback',
    invalid_asset_creator: 'Invalid asset creator',
    invalid_asset_decimals: 'Invalid asset decimals',
    invalid_asset_default_frozen: 'Invalid asset default frozen',
    invalid_asset_name: 'Invalid asset name',
    invalid_asset_name_b64: 'Invalid asset name base64',
  }),

  /**
   * Create Tezos-specific translation keys
   */
  tezos: (): TezosTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    michelson_error: 'Tezos Michelson error',
    script_rejected: 'Tezos script rejected',
    invalid_contract: 'Invalid Tezos contract',
    insufficient_balance_tezos: 'Insufficient balance for transaction',
    invalid_operation: 'Invalid Tezos operation',
    invalid_signature: 'Invalid Tezos signature',
    invalid_public_key: 'Invalid Tezos public key',
    invalid_address: 'Invalid Tezos address',
    invalid_amount: 'Invalid Tezos amount',
    invalid_fee: 'Invalid Tezos fee',
    invalid_counter: 'Invalid Tezos counter',
    invalid_gas_limit: 'Invalid Tezos gas limit',
    invalid_storage_limit: 'Invalid Tezos storage limit',
    invalid_parameters: 'Invalid Tezos parameters',
    invalid_entrypoint: 'Invalid Tezos entrypoint',
    invalid_contract_handle: 'Invalid contract handle',
    invalid_contract_storage: 'Invalid contract storage',
    invalid_contract_code: 'Invalid contract code',
    invalid_contract_balance: 'Invalid contract balance',
    invalid_contract_manager: 'Invalid contract manager',
  }),

  /**
   * Create Stellar-specific translation keys
   */
  stellar: (): StellarTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    operation_error: 'Stellar operation error',
    horizon_error: 'Stellar Horizon error',
    insufficient_balance_stellar: 'Insufficient balance for transaction',
    invalid_account_stellar: 'Invalid Stellar account',
    invalid_asset_stellar: 'Invalid Stellar asset',
    invalid_operation_stellar: 'Invalid Stellar operation',
    invalid_signature_stellar: 'Invalid Stellar signature',
    invalid_sequence_stellar: 'Invalid Stellar sequence',
    invalid_time_bounds: 'Invalid time bounds',
    invalid_threshold: 'Invalid threshold',
    invalid_trustline: 'Invalid trustline',
    invalid_offer: 'Invalid offer',
    invalid_payment: 'Invalid payment',
    invalid_path_payment: 'Invalid path payment',
    invalid_manage_offer: 'Invalid manage offer',
    invalid_create_passive_offer: 'Invalid create passive offer',
    invalid_set_options: 'Invalid set options',
    invalid_change_trust: 'Invalid change trust',
    invalid_allow_trust: 'Invalid allow trust',
    invalid_account_merge: 'Invalid account merge',
  }),

  /**
   * Create Ripple-specific translation keys
   */
  ripple: (): RippleTranslationKeys => ({
    network: 'Network error occurred. Please check your connection.',
    wallet: 'Wallet error occurred. Please check your wallet connection.',
    insufficient_funds: 'Insufficient balance for transaction',
    transaction_failed: 'Transaction failed. Please try again.',
    unknown_error: 'An unknown error occurred',
    transaction_result: 'Ripple transaction result error',
    ledger_error: 'Ripple ledger error',
    insufficient_balance_ripple: 'Insufficient balance for transaction',
    invalid_account_ripple: 'Invalid Ripple account',
    invalid_currency: 'Invalid Ripple currency',
    invalid_issuer: 'Invalid Ripple issuer',
    invalid_amount_ripple: 'Invalid Ripple amount',
    invalid_fee_ripple: 'Invalid Ripple fee',
    invalid_sequence_ripple: 'Invalid Ripple sequence',
    invalid_signature_ripple: 'Invalid Ripple signature',
    invalid_transaction_type: 'Invalid transaction type',
    invalid_transaction_format: 'Invalid transaction format',
    invalid_transaction_data: 'Invalid transaction data',
    invalid_transaction_hash: 'Invalid transaction hash',
    invalid_transaction_sequence: 'Invalid transaction sequence',
    invalid_transaction_fee: 'Invalid transaction fee',
    invalid_transaction_flags: 'Invalid transaction flags',
    invalid_transaction_last_ledger_sequence: 'Invalid last ledger sequence',
    invalid_transaction_account_txn_id: 'Invalid account transaction ID',
    invalid_transaction_source_tag: 'Invalid source tag',
  }),
};

/**
 * Get type-safe translation keys for a specific adapter
 */
export function getAdapterTranslationKeys<
  T extends keyof typeof createTranslationKeys,
>(adapter: T): Record<string, string> {
  return createTranslationKeys[adapter]();
}

/**
 * Create a new translation key builder
 */
export function createTranslationKeyBuilder<
  T extends TranslationKeys = TranslationKeys,
>(): TranslationKeyBuilder<T> {
  return new TranslationKeyBuilderImpl<T>();
}

/**
 * Validate translation key format
 */
export function validateTranslationKey(key: string): boolean {
  // Translation keys should follow the pattern: errors.category or errors.ecosystem.specific
  const keyPattern = /^errors\.([a-z_]+)(\.[a-z_]+)*$/;
  return keyPattern.test(key);
}

/**
 * Get all available translation keys for an adapter
 */
export function getAvailableTranslationKeys(
  adapter: keyof typeof createTranslationKeys
): string[] {
  const keys = createTranslationKeys[adapter]();
  return Object.keys(keys);
}

/**
 * Check if a translation key exists for an adapter
 */
export function hasTranslationKey(
  adapter: keyof typeof createTranslationKeys,
  key: string
): boolean {
  const keys = createTranslationKeys[adapter]();
  return key in keys;
}

/**
 * Get translation key with fallback
 */
export function getTranslationKeyWithFallback(
  adapter: keyof typeof createTranslationKeys,
  key: string,
  fallback: string = key
): string {
  const keys = createTranslationKeys[adapter]();
  return (keys as Record<string, string>)[key] || fallback;
}

/**
 * Merge multiple translation key sets
 */
export function mergeTranslationKeys<T extends TranslationKeys>(
  ...keySets: Partial<T>[]
): T {
  return Object.assign({}, ...keySets) as T;
}

/**
 * Filter translation keys by pattern
 */
export function filterTranslationKeys(
  keys: Record<string, string>,
  pattern: RegExp
): Record<string, string> {
  const filtered: Record<string, string> = {};

  for (const [key, value] of Object.entries(keys)) {
    if (pattern.test(key)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Get translation keys by ecosystem
 */
export function getTranslationKeysByEcosystem(
  ecosystem: string
): Record<string, string> {
  const ecosystemMap: Record<string, keyof typeof createTranslationKeys> = {
    evm: 'evm',
    solana: 'solana',
    cosmos: 'cosmos',
    near: 'near',
    cardano: 'cardano',
    polkadot: 'polkadot',
    algorand: 'algorand',
    tezos: 'tezos',
    stellar: 'stellar',
    ripple: 'ripple',
  };

  const adapter = ecosystemMap[ecosystem];
  if (!adapter) {
    return {};
  }

  return createTranslationKeys[adapter]();
}
