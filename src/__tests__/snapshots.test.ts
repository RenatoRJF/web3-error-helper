/**
 * Snapshot tests to prevent regressions in error translations
 */

import { translateError } from '../index';

describe('Error Translation Snapshots', () => {
  const testErrors = [
    // ERC20 errors
    'ERC20: transfer amount exceeds balance',
    'ERC20: transfer amount exceeds allowance',
    'ERC20: insufficient allowance',
    'ERC20: transfer to the zero address',
    'ERC20: transfer from the zero address',
    
    // Gas errors
    'gas required exceeds allowance',
    'out of gas',
    'gas price too low',
    'gas limit too low',
    'insufficient funds for gas',
    'insufficient funds',
    'max fee per gas too low',
    'intrinsic gas too low',
    
    // Transaction errors
    'nonce too low',
    'nonce too high',
    'replacement transaction underpriced',
    'invalid address',
    'invalid data',
    'execution reverted',
    'contract not found',
    'event not found',
    'unsupported operation',
    
    // EVM errors
    'invalid opcode',
    'revert',
    'stack overflow',
    'stack underflow',
    'invalid jump',
    'memory out of bounds',
    '0x01',
    '0x11',
    '0x12',
    '0x21',
    '0x22',
    '0x31',
    '0x41',
    '0x51',
    
    // Contract errors
    'Ownable: caller is not the owner',
    'Pausable: paused',
    'Token: already minted',
    'Token: nonexistent token',
    'SafeMath: addition overflow',
    'SafeMath: subtraction overflow',
    'SafeMath: multiplication overflow',
    'SafeMath: division by zero',
    'ReentrancyGuard: reentrant call',
    'AccessControl: account is missing role',
    
    // Wallet errors
    'user rejected the request',
    'user denied transaction',
    'wallet not connected',
    'wallet disconnected',
    'wallet locked',
    'wrong network',
    'unsupported network',
    
    // Network errors
    'network error',
    'timeout',
    'connection refused',
    'rate limit exceeded',
    'service unavailable',
    'rpc error',
  ];

  testErrors.forEach(errorMessage => {
    it(`should translate "${errorMessage}" consistently`, () => {
      const result = translateError(new Error(errorMessage));
      
      expect(result).toMatchSnapshot({
        message: expect.any(String),
        translated: expect.any(Boolean),
        chain: expect.any(String),
      });
    });
  });

  it('should handle unknown errors consistently', () => {
    const unknownErrors = [
      'completely unknown error',
      'random error message',
      'undefined error',
      'null error',
    ];

    unknownErrors.forEach(errorMessage => {
      const result = translateError(new Error(errorMessage));
      
      expect(result).toMatchSnapshot({
        message: expect.any(String),
        translated: expect.any(Boolean),
        chain: expect.any(String),
      });
    });
  });

  it('should handle different error types consistently', () => {
    const errorTypes = [
      new Error('ERC20: transfer amount exceeds balance'),
      'ERC20: transfer amount exceeds balance',
      { message: 'ERC20: transfer amount exceeds balance' },
      { error: { message: 'ERC20: transfer amount exceeds balance' } },
      { reason: 'ERC20: transfer amount exceeds balance' },
    ];

    errorTypes.forEach(error => {
      const result = translateError(error);
      
      expect(result).toMatchSnapshot({
        message: expect.any(String),
        translated: expect.any(Boolean),
        chain: expect.any(String),
      });
    });
  });

  it('should handle options consistently', () => {
    const error = new Error('ERC20: transfer amount exceeds balance');
    
    const options = [
      {},
      { chain: 'polygon' },
      { fallbackMessage: 'Custom fallback' },
      { includeOriginalError: true },
      { customMappings: { 'custom pattern': 'custom message' } },
    ];

    options.forEach(option => {
      const result = translateError(error, option);
      
      expect(result).toMatchSnapshot({
        message: expect.any(String),
        translated: expect.any(Boolean),
        chain: expect.any(String),
        originalError: option.includeOriginalError ? expect.any(Object) : undefined,
      });
    });
  });
});
