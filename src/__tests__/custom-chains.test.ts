/**
 * Tests for custom chain functionality
 */

import { 
  translateError, 
  registerCustomChain, 
  unregisterCustomChain,
  getCustomChain,
  getAllCustomChains,
  hasCustomChain,
  clearCustomChains,
  getAvailableChains,
  CustomChainConfig 
} from '../index';

describe('Custom Chain Support', () => {
  beforeEach(() => {
    // Clear all custom chains before each test
    clearCustomChains();
  });

  afterEach(() => {
    // Clean up after each test
    clearCustomChains();
  });

  describe('Chain Registration', () => {
    it('should register a custom chain successfully', () => {
      const config: CustomChainConfig = {
        chainId: 'test-chain',
        name: 'Test Chain',
        isEVMCompatible: true,
        errorMappings: [
          {
            pattern: 'test error',
            message: 'This is a test error message',
            priority: 15
          }
        ]
      };

      expect(() => registerCustomChain(config)).not.toThrow();
      expect(hasCustomChain('test-chain')).toBe(true);
    });

    it('should throw error when registering duplicate chain', () => {
      const config: CustomChainConfig = {
        chainId: 'duplicate-chain',
        name: 'Duplicate Chain',
        errorMappings: []
      };

      registerCustomChain(config);
      
      expect(() => registerCustomChain(config)).toThrow('Chain \'duplicate-chain\' is already registered');
    });

    it('should validate chain configuration', () => {
      const invalidConfigs = [
        { chainId: '', name: 'Test', errorMappings: [] },
        { chainId: 'test', name: '', errorMappings: [] },
        { chainId: 'test', name: 'Test', errorMappings: 'invalid' as any },
        { 
          chainId: 'test', 
          name: 'Test', 
          errorMappings: [{ pattern: '', message: 'test' }] 
        },
        { 
          chainId: 'test', 
          name: 'Test', 
          errorMappings: [{ pattern: 'test', message: '' }] 
        }
      ];

      invalidConfigs.forEach(config => {
        expect(() => registerCustomChain(config as CustomChainConfig)).toThrow();
      });
    });
  });

  describe('Chain Management', () => {
    it('should unregister a custom chain', () => {
      const config: CustomChainConfig = {
        chainId: 'unregister-test',
        name: 'Unregister Test',
        errorMappings: []
      };

      registerCustomChain(config);
      expect(hasCustomChain('unregister-test')).toBe(true);

      const removed = unregisterCustomChain('unregister-test');
      expect(removed).toBe(true);
      expect(hasCustomChain('unregister-test')).toBe(false);
    });

    it('should return false when unregistering non-existent chain', () => {
      const removed = unregisterCustomChain('non-existent');
      expect(removed).toBe(false);
    });

    it('should get custom chain configuration', () => {
      const config: CustomChainConfig = {
        chainId: 'get-test',
        name: 'Get Test',
        isEVMCompatible: true,
        errorMappings: [
          { pattern: 'test', message: 'test message' }
        ],
        customFallbacks: {
          generic: 'Custom generic fallback'
        }
      };

      registerCustomChain(config);
      const retrieved = getCustomChain('get-test');

      expect(retrieved).toEqual(config);
    });

    it('should return undefined for non-existent chain', () => {
      const retrieved = getCustomChain('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('should get all custom chains', () => {
      const configs: CustomChainConfig[] = [
        {
          chainId: 'chain-1',
          name: 'Chain 1',
          errorMappings: []
        },
        {
          chainId: 'chain-2',
          name: 'Chain 2',
          errorMappings: []
        }
      ];

      configs.forEach(config => registerCustomChain(config));
      const allChains = getAllCustomChains();

      expect(allChains).toHaveLength(2);
      expect(allChains.map(c => c.chainId)).toContain('chain-1');
      expect(allChains.map(c => c.chainId)).toContain('chain-2');
    });

    it('should clear all custom chains', () => {
      const configs: CustomChainConfig[] = [
        { chainId: 'chain-1', name: 'Chain 1', errorMappings: [] },
        { chainId: 'chain-2', name: 'Chain 2', errorMappings: [] }
      ];

      configs.forEach(config => registerCustomChain(config));
      expect(getAllCustomChains()).toHaveLength(2);

      clearCustomChains();
      expect(getAllCustomChains()).toHaveLength(0);
    });
  });

  describe('Error Translation with Custom Chains', () => {
    it('should translate errors using custom chain mappings', () => {
      const config: CustomChainConfig = {
        chainId: 'translation-test',
        name: 'Translation Test',
        errorMappings: [
          {
            pattern: 'custom error',
            message: 'This is a custom error message',
            priority: 15
          }
        ]
      };

      registerCustomChain(config);

      const error = new Error('custom error');
      const result = translateError(error, { chain: 'translation-test' });

      expect(result.translated).toBe(true);
      expect(result.message).toBe('This is a custom error message');
      expect(result.chain).toBe('translation-test');
    });

    it('should use custom chain fallbacks', () => {
      const config: CustomChainConfig = {
        chainId: 'fallback-test',
        name: 'Fallback Test',
        errorMappings: [],
        customFallbacks: {
          generic: 'Custom generic fallback message',
          network: 'Custom network fallback message',
          wallet: 'Custom wallet fallback message',
          contract: 'Custom contract fallback message'
        }
      };

      registerCustomChain(config);

      // Test generic fallback
      const genericError = new Error('unknown error');
      const genericResult = translateError(genericError, { chain: 'fallback-test' });
      expect(genericResult.message).toBe('Custom generic fallback message');

      // Test network fallback
      const networkError = new Error('network timeout');
      const networkResult = translateError(networkError, { chain: 'fallback-test' });
      expect(networkResult.message).toBe('Custom network fallback message');

      // Test wallet fallback
      const walletError = new Error('wallet disconnected');
      const walletResult = translateError(walletError, { chain: 'fallback-test' });
      expect(walletResult.message).toBe('Custom wallet fallback message');

      // Test contract fallback
      const contractError = new Error('contract execution failed');
      const contractResult = translateError(contractError, { chain: 'fallback-test' });
      expect(contractResult.message).toBe('Custom contract fallback message');
    });

    it('should prioritize custom chain mappings over built-in mappings', () => {
      const config: CustomChainConfig = {
        chainId: 'priority-test',
        name: 'Priority Test',
        errorMappings: [
          {
            pattern: 'ERC20: transfer amount exceeds balance',
            message: 'Custom ERC20 error message',
            priority: 20 // Higher priority than built-in (10)
          }
        ]
      };

      registerCustomChain(config);

      const error = new Error('ERC20: transfer amount exceeds balance');
      const result = translateError(error, { chain: 'priority-test' });

      expect(result.translated).toBe(true);
      expect(result.message).toBe('Custom ERC20 error message');
    });

    it('should fall back to built-in mappings for custom chains', () => {
      const config: CustomChainConfig = {
        chainId: 'fallback-builtin-test',
        name: 'Fallback Builtin Test',
        errorMappings: [] // No custom mappings
      };

      registerCustomChain(config);

      const error = new Error('ERC20: transfer amount exceeds balance');
      const result = translateError(error, { chain: 'fallback-builtin-test' });

      expect(result.translated).toBe(true);
      expect(result.message).toBe('Insufficient token balance. You don\'t have enough tokens to complete this transfer.');
    });
  });

  describe('Available Chains', () => {
    it('should include custom chains in available chains', () => {
      const config: CustomChainConfig = {
        chainId: 'available-test',
        name: 'Available Test',
        errorMappings: []
      };

      registerCustomChain(config);
      const availableChains = getAvailableChains();

      expect(availableChains).toContain('available-test');
      expect(availableChains).toContain('ethereum'); // Built-in chain
    });

    it('should not include unregistered custom chains', () => {
      const availableChains = getAvailableChains();
      expect(availableChains).not.toContain('unregistered-chain');
    });
  });

  describe('Complex Custom Chain Scenarios', () => {
    it('should handle multiple custom chains with different configurations', () => {
      const configs: CustomChainConfig[] = [
        {
          chainId: 'testnet',
          name: 'Testnet',
          isEVMCompatible: true,
          errorMappings: [
            { pattern: 'testnet error', message: 'Testnet error message', priority: 15 }
          ],
          customFallbacks: {
            generic: 'Testnet fallback'
          }
        },
        {
          chainId: 'mainnet',
          name: 'Mainnet',
          isEVMCompatible: true,
          errorMappings: [
            { pattern: 'mainnet error', message: 'Mainnet error message', priority: 15 }
          ],
          customFallbacks: {
            generic: 'Mainnet fallback'
          }
        },
        {
          chainId: 'non-evm',
          name: 'Non-EVM Chain',
          isEVMCompatible: false,
          errorMappings: [
            { pattern: 'non-evm error', message: 'Non-EVM error message', priority: 15 }
          ]
        }
      ];

      configs.forEach(config => registerCustomChain(config));

      // Test each chain
      const testnetError = new Error('testnet error');
      const testnetResult = translateError(testnetError, { chain: 'testnet' });
      expect(testnetResult.message).toBe('Testnet error message');

      const mainnetError = new Error('mainnet error');
      const mainnetResult = translateError(mainnetError, { chain: 'mainnet' });
      expect(mainnetResult.message).toBe('Mainnet error message');

      const nonEvmError = new Error('non-evm error');
      const nonEvmResult = translateError(nonEvmError, { chain: 'non-evm' });
      expect(nonEvmResult.message).toBe('Non-EVM error message');

      // Test fallbacks
      const unknownTestnetError = new Error('unknown error');
      const unknownTestnetResult = translateError(unknownTestnetError, { chain: 'testnet' });
      expect(unknownTestnetResult.message).toBe('Testnet fallback');

      const unknownMainnetError = new Error('unknown error');
      const unknownMainnetResult = translateError(unknownMainnetError, { chain: 'mainnet' });
      expect(unknownMainnetResult.message).toBe('Mainnet fallback');
    });

    it('should handle chain registration and unregistration in sequence', () => {
      const config: CustomChainConfig = {
        chainId: 'sequence-test',
        name: 'Sequence Test',
        errorMappings: [
          { pattern: 'sequence error', message: 'Sequence error message', priority: 15 }
        ]
      };

      // Register
      registerCustomChain(config);
      expect(hasCustomChain('sequence-test')).toBe(true);

      // Test translation
      const error = new Error('sequence error');
      const result = translateError(error, { chain: 'sequence-test' });
      expect(result.message).toBe('Sequence error message');

      // Unregister
      unregisterCustomChain('sequence-test');
      expect(hasCustomChain('sequence-test')).toBe(false);

      // Test that it falls back to built-in mappings
      const fallbackResult = translateError(error, { chain: 'sequence-test' });
      expect(fallbackResult.translated).toBe(false); // No custom mapping, falls back to generic
    });
  });
});
