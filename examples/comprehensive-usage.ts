/**
 * Comprehensive usage examples for web3-error-helper
 * Demonstrates all error categories and features
 */

import { translateError, TranslatableError } from 'web3-error-helper';

// Example 1: ERC20 Token Errors
// Use case: Token transfer operations, DeFi protocols, NFT marketplaces
// Perfect for: DEX interactions, token swaps, staking contracts, yield farming
function handleERC20Errors() {
  const erc20Errors = [
    'ERC20: transfer amount exceeds balance',
    'ERC20: transfer amount exceeds allowance',
    'ERC20: insufficient allowance',
    'ERC20: transfer to the zero address',
  ];

  console.log('=== ERC20 Errors ===');

  erc20Errors.forEach(error => {
    const result = translateError(new Error(error));
    console.log(`Original: ${error}`);
    console.log(`Translated: ${result.message}`);
    console.log('---');
  });
}

// Example 2: Gas and Transaction Errors
// Use case: Transaction fee management, gas optimization, transaction monitoring
// Perfect for: Wallet applications, transaction builders, gas estimation tools
function handleGasAndTransactionErrors() {
  const gasErrors = [
    'out of gas',
    'gas required exceeds allowance',
    'insufficient funds for gas',
    'nonce too low',
    'nonce too high',
    'replacement transaction underpriced',
  ];

  console.log('=== Gas & Transaction Errors ===');

  gasErrors.forEach(error => {
    const result = translateError(new Error(error));
    console.log(`Original: ${error}`);
    console.log(`Translated: ${result.message}`);
    console.log('---');
  });
}

// Example 3: EVM and Panic Code Errors
// Use case: Smart contract debugging, low-level error analysis, contract development
// Perfect for: Contract developers, debugging tools, error analysis systems
function handleEVMPanicErrors() {
  const evmErrors = [
    'invalid opcode',
    'stack overflow',
    'stack underflow',
    '0x01', // Assertion failed
    '0x11', // Arithmetic overflow
    '0x12', // Division by zero
    '0x21', // Invalid enum
  ];

  console.log('=== EVM & Panic Code Errors ===');

  evmErrors.forEach(error => {
    const result = translateError(new Error(error));
    console.log(`Original: ${error}`);
    console.log(`Translated: ${result.message}`);
    console.log('---');
  });
}

// Example 4: Contract-Specific Errors
// Use case: Access control, contract state management, security features
// Perfect for: Admin panels, contract management tools, security monitoring
function handleContractErrors() {
  const contractErrors = [
    'Ownable: caller is not the owner',
    'Pausable: paused',
    'SafeMath: addition overflow',
    'SafeMath: subtraction overflow',
    'ReentrancyGuard: reentrant call',
    'AccessControl: account is missing role',
  ];

  console.log('=== Contract Errors ===');

  contractErrors.forEach(error => {
    const result = translateError(new Error(error));
    console.log(`Original: ${error}`);
    console.log(`Translated: ${result.message}`);
    console.log('---');
  });
}

// Example 5: Wallet and Network Errors
// Use case: User interaction handling, network connectivity, wallet management
// Perfect for: Frontend applications, wallet connectors, network status monitoring
function handleWalletNetworkErrors() {
  const walletNetworkErrors = [
    'user rejected the request',
    'wallet not connected',
    'wrong network',
    'network error',
    'timeout',
    'connection refused',
  ];

  console.log('=== Wallet & Network Errors ===');

  walletNetworkErrors.forEach(error => {
    const result = translateError(new Error(error));
    console.log(`Original: ${error}`);
    console.log(`Translated: ${result.message}`);
    console.log('---');
  });
}

// Example 6: Advanced Usage with Options
// Use case: Custom error handling, multi-chain applications, debugging systems
// Perfect for: Production DApps, error logging systems, multi-network support
function handleAdvancedUsage() {
  console.log('=== Advanced Usage Examples ===');

  // Custom fallback message
  const result1 = translateError(new Error('unknown error'), {
    fallbackMessage: 'This is a custom fallback message for unknown errors'
  });

  console.log('Custom fallback:', result1.message);

  // Include original error
  const result2 = translateError(new Error('ERC20: transfer amount exceeds balance'), {
    includeOriginalError: true
  });

  console.log('With original error:', result2.originalError);

  // Custom mappings
  const result3 = translateError(new Error('custom contract error'), {
    customMappings: {
      'custom contract error': 'This is a custom error message for your specific contract'
    }
  });

  console.log('Custom mapping:', result3.message);

  // Different chain
  const result4 = translateError(new Error('ERC20: transfer amount exceeds balance'), {
    chain: 'polygon'
  });

  console.log('Polygon chain:', result4.chain);
}

// Example 7: Real-world Usage in a DApp
// Use case: Production-ready error handling with user experience focus
// Perfect for: Complete DApp implementations, user-facing applications, production systems
class Web3ErrorHandler {
  async handleContractCall(contractMethod: () => Promise<any>, userMessage?: string) {
    try {
      return await contractMethod();
    } catch (error) {
      const result = translateError(error, {
        fallbackMessage: userMessage || 'Transaction failed. Please try again.',
        includeOriginalError: true
      });

      // Show user-friendly message
      this.showUserMessage(result.message);

      // Log original error for debugging
      console.error('Contract call failed:', result.originalError);

      throw new Error(result.message);
    }
  }

  private showUserMessage(message: string) {
    // In a real app, this would show a toast, modal, or notification
    console.log('User message:', message);
  }
}

// Example 8: Batch Error Processing
// Use case: Bulk operations, error analytics, batch transaction processing
// Perfect for: Batch transaction systems, error reporting tools, analytics dashboards
function processBatchErrors(errors: TranslatableError[]) {
  console.log('=== Batch Error Processing ===');
  
  const results = errors.map((error, index) => {
    const result = translateError(error);
    return {
      index,
      original: error.message || error,
      translated: result.message,
      wasTranslated: result.translated
    };
  });

  results.forEach(result => {
    console.log(`Error ${result.index + 1}:`);
    console.log(`  Original: ${result.original}`);
    console.log(`  Translated: ${result.translated}`);
    console.log(`  Was translated: ${result.wasTranslated}`);
    console.log('---');
  });

  return results;
}

// Run all examples
function runAllExamples() {
  handleERC20Errors();
  handleGasAndTransactionErrors();
  handleEVMPanicErrors();
  handleContractErrors();
  handleWalletNetworkErrors();
  handleAdvancedUsage();
  
  // Batch processing example
  const sampleErrors = [
    new Error('ERC20: transfer amount exceeds balance'),
    new Error('out of gas'),
    new Error('user rejected the request'),
    new Error('unknown error'),
  ];
  
  processBatchErrors(sampleErrors);
}

export {
  handleERC20Errors,
  handleGasAndTransactionErrors,
  handleEVMPanicErrors,
  handleContractErrors,
  handleWalletNetworkErrors,
  handleAdvancedUsage,
  Web3ErrorHandler,
  processBatchErrors,
  runAllExamples
};
