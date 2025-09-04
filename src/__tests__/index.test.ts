import { translateError, getAvailableChains } from '../index';
import { TranslateErrorOptions, TranslatableError } from '../types';

describe('translateError', () => {
  describe('ERC20 errors', () => {
    it('should translate ERC20 transfer amount exceeds balance', () => {
      const error = new Error('ERC20: transfer amount exceeds balance');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Insufficient token balance. You don\'t have enough tokens to complete this transfer.');
      expect(result.chain).toBe('ethereum');
    });

    it('should translate ERC20 transfer amount exceeds allowance', () => {
      const error = new Error('ERC20: transfer amount exceeds allowance');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transfer amount exceeds your approved allowance. Please increase your token allowance first.');
    });

    it('should translate ERC20 insufficient allowance', () => {
      const error = new Error('ERC20: insufficient allowance');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Insufficient token allowance. Please approve more tokens before attempting this transaction.');
    });
  });

  describe('Gas errors', () => {
    it('should translate gas required exceeds allowance', () => {
      const error = new Error('gas required exceeds allowance');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transaction requires more gas than you\'ve allocated. Please increase your gas limit.');
    });

    it('should translate out of gas error', () => {
      const error = new Error('out of gas');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transaction ran out of gas. Please increase your gas limit and try again.');
    });

    it('should translate nonce too low error', () => {
      const error = new Error('nonce too low');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transaction nonce is too low. Please wait for previous transactions to be processed or reset your nonce.');
    });
  });

  describe('Wallet errors', () => {
    it('should translate user rejected request', () => {
      const error = new Error('user rejected the request');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transaction was rejected by the user. Please try again and confirm the transaction in your wallet.');
    });

    it('should translate wallet not connected', () => {
      const error = new Error('wallet not connected');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Wallet is not connected. Please connect your wallet and try again.');
    });

    it('should translate wrong network error', () => {
      const error = new Error('wrong network');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('You\'re connected to the wrong network. Please switch to the correct network in your wallet.');
    });
  });

  describe('Network errors', () => {
    it('should translate network error', () => {
      const error = new Error('network error');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Network connection error. Please check your internet connection and try again.');
    });

    it('should translate timeout error', () => {
      const error = new Error('timeout');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Request timed out. The network may be congested. Please try again in a few moments.');
    });
  });

  describe('Error extraction', () => {
    it('should extract message from Error object', () => {
      const error = new Error('test error message');
      const result = translateError(error);
      
      expect(result.originalError).toBeUndefined();
    });

    it('should extract message from string', () => {
      const result = translateError('ERC20: transfer amount exceeds balance');
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Insufficient token balance. You don\'t have enough tokens to complete this transfer.');
    });

    it('should extract message from nested error object', () => {
      const error = {
        error: {
          message: 'ERC20: transfer amount exceeds balance'
        }
      };
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Insufficient token balance. You don\'t have enough tokens to complete this transfer.');
    });
  });

  describe('Options', () => {
    it('should use custom fallback message', () => {
      const error = new Error('unknown error');
      const options: TranslateErrorOptions = {
        fallbackMessage: 'Custom fallback message'
      };
      const result = translateError(error, options);
      
      expect(result.translated).toBe(false);
      expect(result.message).toBe('Custom fallback message');
    });

    it('should include original error when requested', () => {
      const error = new Error('test error');
      const options: TranslateErrorOptions = {
        includeOriginalError: true
      };
      const result = translateError(error, options);
      
      expect(result.originalError).toBe(error);
    });

    it('should use custom mappings', () => {
      const error = new Error('custom error pattern');
      const options: TranslateErrorOptions = {
        customMappings: {
          'custom error pattern': 'This is a custom error message'
        }
      };
      const result = translateError(error, options);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('This is a custom error message');
    });

    it('should specify chain in result', () => {
      const error = new Error('ERC20: transfer amount exceeds balance');
      const options: TranslateErrorOptions = {
        chain: 'polygon'
      };
      const result = translateError(error, options);
      
      expect(result.chain).toBe('polygon');
    });
  });

  describe('Transaction errors', () => {
    it('should translate nonce too low error', () => {
      const error = new Error('nonce too low');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transaction nonce is too low. Please wait for previous transactions to be processed or reset your nonce.');
    });

    it('should translate invalid address error', () => {
      const error = new Error('invalid address');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Provided Ethereum address is invalid. Please check the address format and try again.');
    });

    it('should translate execution reverted error', () => {
      const error = new Error('execution reverted');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Transaction execution was reverted. Please check the transaction details and try again.');
    });
  });

  describe('EVM errors', () => {
    it('should translate invalid opcode error', () => {
      const error = new Error('invalid opcode');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('An invalid operation was executed. This may indicate a contract bug or compatibility issue.');
    });

    it('should translate stack overflow error', () => {
      const error = new Error('stack overflow');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Too many items on the EVM stack. This may indicate a contract execution issue.');
    });

    it('should translate panic code 0x01', () => {
      const error = new Error('0x01');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Assertion failed. A condition that should never be false was violated.');
    });

    it('should translate panic code 0x11', () => {
      const error = new Error('0x11');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Arithmetic overflow or underflow occurred. Please check the calculation values.');
    });
  });

  describe('Contract errors', () => {
    it('should translate Ownable error', () => {
      const error = new Error('Ownable: caller is not the owner');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Function can only be called by the contract owner. Please contact the contract owner to perform this action.');
    });

    it('should translate Pausable error', () => {
      const error = new Error('Pausable: paused');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Contract is paused. This action cannot be executed at this time. Please try again later.');
    });

    it('should translate SafeMath overflow error', () => {
      const error = new Error('SafeMath: addition overflow');
      const result = translateError(error);
      
      expect(result.translated).toBe(true);
      expect(result.message).toBe('Arithmetic addition overflow. The result is too large to be stored.');
    });
  });

  describe('Fallback behavior', () => {
    it('should return generic fallback for unknown errors', () => {
      const error = new Error('completely unknown error');
      const result = translateError(error);
      
      expect(result.translated).toBe(false);
      expect(result.message).toBe('An error occurred while processing your request. Please try again.');
    });

    it('should return network fallback for network-related errors', () => {
      const error = new Error('network connection failed');
      const result = translateError(error);
      
      expect(result.translated).toBe(false);
      expect(result.message).toBe('Network error occurred. Please check your connection and try again.');
    });

    it('should return wallet fallback for wallet-related errors', () => {
      const error = new Error('wallet connection issue');
      const result = translateError(error);
      
      expect(result.translated).toBe(false);
      expect(result.message).toBe('Wallet error occurred. Please check your wallet connection and try again.');
    });
  });
});

describe('getAvailableChains', () => {
  it('should return list of available chains', () => {
    const chains = getAvailableChains();
    
    expect(chains).toContain('ethereum');
    expect(chains).toContain('polygon');
    expect(chains).toContain('arbitrum');
    expect(chains).toContain('optimism');
  });
});