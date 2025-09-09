/**
 * Tests for chain adapters
 */

import {
  EVMAdapter,
  SolanaAdapter,
  CosmosAdapter,
  NearAdapter,
  StellarAdapter,
  RippleAdapter,
  adapterRegistry,
} from '../adapters';
import { BlockchainEcosystem } from '../types';
import { setTimestampForTesting, resetTimestampForTesting } from '../index';

describe('Chain Adapters', () => {
  beforeEach(() => {
    // Set a fixed timestamp for consistent tests
    setTimestampForTesting(1234567890000);
  });

  afterEach(() => {
    // Reset to real time after each test
    resetTimestampForTesting();
  });

  describe('EVMAdapter', () => {
    let adapter: EVMAdapter;

    beforeEach(() => {
      adapter = new EVMAdapter();
    });

    it('should extract error message from string', () => {
      const error = 'execution reverted: insufficient funds';
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe(error);
    });

    it('should extract error message from error object', () => {
      const error = { message: 'execution reverted: insufficient funds' };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('execution reverted: insufficient funds');
    });

    it('should match EVM error format', () => {
      const evmError = 'execution reverted: insufficient funds';
      const nonEvmError = 'program error: 6000';

      expect(adapter.matchesErrorFormat(evmError)).toBe(true);
      expect(adapter.matchesErrorFormat(nonEvmError)).toBe(false);
    });

    it('should return EVM error patterns', () => {
      const patterns = adapter.getErrorPatterns();
      expect(patterns).toHaveProperty('execution reverted');
      expect(patterns).toHaveProperty('insufficient funds');
      expect(patterns).toHaveProperty('gas required exceeds allowance');
    });

    it('should return EVM fallback messages', () => {
      const fallbacks = adapter.getFallbackMessages();
      expect(fallbacks).toHaveProperty('network');
      expect(fallbacks).toHaveProperty('gas');
      expect(fallbacks).toHaveProperty('wallet');
    });
  });

  describe('SolanaAdapter', () => {
    let adapter: SolanaAdapter;

    beforeEach(() => {
      adapter = new SolanaAdapter();
    });

    it('should extract error message from Solana instruction error', () => {
      const error = {
        InstructionError: [0, { Custom: 6000 }],
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('Program error: 6000');
    });

    it('should extract error message from Solana RPC error', () => {
      const error = {
        data: {
          err: {
            message: 'insufficient funds',
          },
        },
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('insufficient funds');
    });

    it('should match Solana error format', () => {
      const solanaError = 'insufficient funds';
      const evmError = 'execution reverted';

      expect(adapter.matchesErrorFormat(solanaError)).toBe(true);
      expect(adapter.matchesErrorFormat(evmError)).toBe(false);
    });

    it('should return Solana error patterns', () => {
      const patterns = adapter.getErrorPatterns();
      expect(patterns).toHaveProperty('insufficient funds');
      expect(patterns).toHaveProperty('account not found');
      expect(patterns).toHaveProperty('program error');
    });
  });

  describe('CosmosAdapter', () => {
    let adapter: CosmosAdapter;

    beforeEach(() => {
      adapter = new CosmosAdapter();
    });

    it('should extract error message from Cosmos ABCI error', () => {
      const error = {
        code: 5,
        message: 'insufficient funds',
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('insufficient funds');
    });

    it('should extract error message from Cosmos transaction response', () => {
      const error = {
        tx_response: {
          raw_log: 'insufficient funds: insufficient account funds',
        },
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('insufficient funds: insufficient account funds');
    });

    it('should match Cosmos error format', () => {
      const cosmosError = 'insufficient funds';
      const evmError = 'execution reverted';

      expect(adapter.matchesErrorFormat(cosmosError)).toBe(true);
      expect(adapter.matchesErrorFormat(evmError)).toBe(false);
    });

    it('should return Cosmos error patterns', () => {
      const patterns = adapter.getErrorPatterns();
      expect(patterns).toHaveProperty('insufficient funds');
      expect(patterns).toHaveProperty('account sequence mismatch');
      expect(patterns).toHaveProperty('signature verification failed');
    });
  });

  describe('NearAdapter', () => {
    let adapter: NearAdapter;

    beforeEach(() => {
      adapter = new NearAdapter();
    });

    it('should extract error message from Near execution error', () => {
      const error = {
        Failure: {
          ActionError: {
            kind: {
              FunctionCallError: {
                ExecutionError: 'Smart contract execution failed',
              },
            },
          },
        },
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('Smart contract execution failed');
    });

    it('should extract error message from Near account error', () => {
      const error = {
        AccountDoesNotExist: true,
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('Account does not exist on Near Protocol');
    });

    it('should match Near error format', () => {
      const nearError = 'insufficient balance';
      const evmError = 'execution reverted';

      expect(adapter.matchesErrorFormat(nearError)).toBe(true);
      expect(adapter.matchesErrorFormat(evmError)).toBe(false);
    });

    it('should return Near error patterns', () => {
      const patterns = adapter.getErrorPatterns();
      expect(patterns).toHaveProperty('insufficient balance');
      expect(patterns).toHaveProperty('account does not exist');
      expect(patterns).toHaveProperty('function call');
    });
  });

  describe('StellarAdapter', () => {
    let adapter: StellarAdapter;

    beforeEach(() => {
      adapter = new StellarAdapter();
    });

    it('should extract error message from Stellar operation error', () => {
      const error = {
        operation_error: {
          code: 'INSUFFICIENT_BALANCE',
        },
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('Operation error: INSUFFICIENT_BALANCE');
    });

    it('should extract error message from Stellar horizon error', () => {
      const error = {
        horizon_error: 'insufficient balance',
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('insufficient balance');
    });

    it('should match Stellar error format', () => {
      const stellarError = 'insufficient balance';
      const evmError = 'execution reverted';

      expect(adapter.matchesErrorFormat(stellarError)).toBe(true);
      expect(adapter.matchesErrorFormat(evmError)).toBe(false);
    });

    it('should return Stellar error patterns', () => {
      const patterns = adapter.getErrorPatterns();
      expect(patterns).toHaveProperty('insufficient balance');
      expect(patterns).toHaveProperty('operation failed');
      expect(patterns).toHaveProperty('stellar');
    });
  });

  describe('RippleAdapter', () => {
    let adapter: RippleAdapter;

    beforeEach(() => {
      adapter = new RippleAdapter();
    });

    it('should extract error message from Ripple transaction result', () => {
      const error = {
        transaction_result: {
          result: 'INSUFFICIENT_FUNDS',
        },
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('Transaction result: INSUFFICIENT_FUNDS');
    });

    it('should extract error message from Ripple ledger error', () => {
      const error = {
        ledger_error: 'insufficient funds',
      };
      const result = adapter.extractErrorMessage(error);
      expect(result).toBe('insufficient funds');
    });

    it('should match Ripple error format', () => {
      const rippleError = 'insufficient funds';
      const evmError = 'execution reverted';

      expect(adapter.matchesErrorFormat(rippleError)).toBe(true);
      expect(adapter.matchesErrorFormat(evmError)).toBe(false);
    });

    it('should return Ripple error patterns', () => {
      const patterns = adapter.getErrorPatterns();
      expect(patterns).toHaveProperty('insufficient funds');
      expect(patterns).toHaveProperty('ripple');
      expect(patterns).toHaveProperty('xrp');
    });
  });

  describe('AdapterRegistry', () => {
    it('should get adapter for supported ecosystem', () => {
      const solanaAdapter = adapterRegistry.getAdapter('solana');
      expect(solanaAdapter).toBeInstanceOf(SolanaAdapter);
    });

    it('should return undefined for unsupported ecosystem', () => {
      const unsupportedAdapter = adapterRegistry.getAdapter(
        'unsupported' as BlockchainEcosystem
      );
      expect(unsupportedAdapter).toBeUndefined();
    });

    it('should get EVM adapter', () => {
      const evmAdapter = adapterRegistry.getEVMAdapter();
      expect(evmAdapter).toBeInstanceOf(EVMAdapter);
    });

    it('should get EVM adapter with chain ID', () => {
      const evmAdapter = adapterRegistry.getEVMAdapter(1);
      expect(evmAdapter).toBeInstanceOf(EVMAdapter);
      expect(evmAdapter.chainId).toBe(1);
    });

    it('should detect appropriate adapter', () => {
      const evmError = 'execution reverted: gas required exceeds allowance';
      const solanaError = 'program error: 6000';

      const evmAdapter = adapterRegistry.detectAdapter(evmError);
      const solanaAdapter = adapterRegistry.detectAdapter(solanaError);

      expect(evmAdapter).toBeInstanceOf(EVMAdapter);
      expect(solanaAdapter).toBeInstanceOf(SolanaAdapter);
    });

    it('should return supported ecosystems', () => {
      const ecosystems = adapterRegistry.getSupportedEcosystems();
      expect(ecosystems).toContain('evm');
      expect(ecosystems).toContain('solana');
      expect(ecosystems).toContain('cosmos');
      expect(ecosystems).toContain('near');
      expect(ecosystems).toContain('cardano');
      expect(ecosystems).toContain('polkadot');
      expect(ecosystems).toContain('algorand');
      expect(ecosystems).toContain('tezos');
      expect(ecosystems).toContain('stellar');
      expect(ecosystems).toContain('ripple');
    });

    it('should check if ecosystem is supported', () => {
      expect(adapterRegistry.isEcosystemSupported('evm')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('solana')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('cosmos')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('near')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('cardano')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('polkadot')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('algorand')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('tezos')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('stellar')).toBe(true);
      expect(adapterRegistry.isEcosystemSupported('ripple')).toBe(true);
      expect(
        adapterRegistry.isEcosystemSupported(
          'unsupported' as BlockchainEcosystem
        )
      ).toBe(false);
    });

    it('should register and unregister custom adapter', () => {
      const customAdapter = new EVMAdapter(9999);

      adapterRegistry.registerAdapter('evm', customAdapter);
      expect(adapterRegistry.getAdapter('evm')).toBe(customAdapter);

      const unregistered = adapterRegistry.unregisterAdapter('evm');
      expect(unregistered).toBe(true);
    });
  });
});
