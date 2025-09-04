/**
 * Custom chain support examples for web3-error-helper
 * 
 * This file demonstrates how to register and use custom blockchain networks
 * with their own error mappings and fallback messages.
 */

import { 
  translateError, 
  TranslatableError, 
  registerCustomChain, 
  unregisterCustomChain,
  getCustomChain,
  getAllCustomChains,
  hasCustomChain,
  clearCustomChains,
  CustomChainConfig 
} from 'web3-error-helper';

// Example 1: Register a custom testnet
// Use case: Development and testing environments with specific error handling
// Perfect for: Development teams, testing frameworks, staging environments
function registerCustomTestnet() {
  const testnetConfig: CustomChainConfig = {
    chainId: 'my-testnet',
    name: 'My Custom Testnet',
    isEVMCompatible: true,
    errorMappings: [
      {
        pattern: 'testnet specific error',
        message: 'This is a testnet-specific error message',
        priority: 15
      },
      {
        pattern: 'insufficient testnet funds',
        message: 'You need more testnet tokens to complete this transaction',
        priority: 15
      },
      {
        pattern: 'testnet maintenance',
        message: 'The testnet is currently under maintenance. Please try again later.',
        priority: 20
      }
    ],
    customFallbacks: {
      generic: 'A testnet error occurred. Please try again.',
      network: 'Testnet network connection issue. Please check your connection.',
      wallet: 'Testnet wallet error. Please check your testnet wallet connection.',
      contract: 'Testnet smart contract error. Please check the transaction details.'
    },
    metadata: {
      rpcUrl: 'https://testnet.example.com',
      blockExplorer: 'https://explorer.testnet.example.com',
      chainId: 12345
    }
  };

  try {
    registerCustomChain(testnetConfig);
    console.log('✅ Custom testnet registered successfully');
  } catch (error) {
    console.error('❌ Failed to register custom testnet:', error);
  }
}

// Example 2: Register a custom L2 solution
// Use case: Layer 2 scaling solutions with specific error patterns
// Perfect for: L2 DApps, scaling solutions, rollup implementations
function registerCustomL2() {
  const l2Config: CustomChainConfig = {
    chainId: 'my-l2',
    name: 'My Custom L2',
    isEVMCompatible: true,
    errorMappings: [
      {
        pattern: 'L2 sequencer error',
        message: 'The L2 sequencer is temporarily unavailable. Please try again.',
        priority: 15
      },
      {
        pattern: 'L2 batch processing error',
        message: 'L2 batch processing failed. Your transaction will be retried.',
        priority: 15
      },
      {
        pattern: 'L2 withdrawal pending',
        message: 'Your withdrawal is being processed. This may take several minutes.',
        priority: 10
      }
    ],
    customFallbacks: {
      generic: 'L2 network error occurred. Please try again.',
      network: 'L2 network connection issue. Please check your connection.',
      wallet: 'L2 wallet error. Please check your L2 wallet connection.',
      contract: 'L2 smart contract error. Please check the transaction details.'
    }
  };

  registerCustomChain(l2Config);
  console.log('✅ Custom L2 registered successfully');
}

// Example 3: Register a non-EVM chain
// Use case: Non-Ethereum compatible blockchains with custom error handling
// Perfect for: Cosmos, Solana, Polkadot integrations, multi-chain DApps
function registerNonEVMChain() {
  const nonEVMConfig: CustomChainConfig = {
    chainId: 'my-non-evm',
    name: 'My Non-EVM Chain',
    isEVMCompatible: false,
    errorMappings: [
      {
        pattern: 'non-evm specific error',
        message: 'This is a non-EVM chain specific error message',
        priority: 15
      },
      {
        pattern: 'validator error',
        message: 'Validator error occurred. Please try again.',
        priority: 15
      }
    ],
    customFallbacks: {
      generic: 'Non-EVM chain error occurred. Please try again.',
      network: 'Non-EVM network connection issue.',
      wallet: 'Non-EVM wallet connection error.',
      contract: 'Non-EVM smart contract error.'
    },
    metadata: {
      consensus: 'Proof of Stake',
      blockTime: '2 seconds',
      nativeCurrency: 'MYTOKEN'
    }
  };

  registerCustomChain(nonEVMConfig);
  console.log('✅ Non-EVM chain registered successfully');
}

// Example 4: Using custom chains with error translation
// Use case: Testing custom chain error handling and fallback behavior
// Perfect for: Custom chain integration testing, error handling validation
function demonstrateCustomChainUsage() {
  console.log('\n=== Custom Chain Error Translation ===');

  // Register a custom chain
  registerCustomTestnet();

  // Test error translation with custom chain
  const testnetError = new Error('testnet specific error');
  const result = translateError(testnetError, { chain: 'my-testnet' });
  
  console.log('Original error:', testnetError.message);
  console.log('Translated message:', result.message);
  console.log('Was translated:', result.translated);
  console.log('Chain used:', result.chain);

  // Test fallback with custom chain
  const unknownError = new Error('unknown testnet error');
  const fallbackResult = translateError(unknownError, { chain: 'my-testnet' });
  
  console.log('\nFallback test:');
  console.log('Original error:', unknownError.message);
  console.log('Fallback message:', fallbackResult.message);
  console.log('Chain used:', fallbackResult.chain);
}

// Example 5: Chain management functions
// Use case: Dynamic chain registration and management in applications
// Perfect for: Multi-chain DApps, chain switching, dynamic chain support
function demonstrateChainManagement() {
  console.log('\n=== Chain Management ===');

  // Register multiple chains
  registerCustomTestnet();
  registerCustomL2();
  registerNonEVMChain();

  // List all custom chains
  const allChains = getAllCustomChains();
  console.log(`Registered ${allChains.length} custom chains:`);
  allChains.forEach(chain => {
    console.log(`- ${chain.chainId}: ${chain.name} (EVM: ${chain.isEVMCompatible})`);
  });

  // Check if a chain exists
  console.log('\nChain existence checks:');
  console.log('my-testnet exists:', hasCustomChain('my-testnet'));
  console.log('nonexistent-chain exists:', hasCustomChain('nonexistent-chain'));

  // Get specific chain configuration
  const testnetConfig = getCustomChain('my-testnet');
  if (testnetConfig) {
    console.log('\nTestnet configuration:');
    console.log('- Name:', testnetConfig.name);
    console.log('- Error mappings:', testnetConfig.errorMappings.length);
    console.log('- Custom fallbacks:', Object.keys(testnetConfig.customFallbacks || {}).length);
  }

  // Unregister a chain
  const removed = unregisterCustomChain('my-l2');
  console.log('\nRemoved my-l2:', removed);
  console.log('my-l2 still exists:', hasCustomChain('my-l2'));

  // Clear all custom chains
  clearCustomChains();
  console.log('All custom chains cleared');
  console.log('Remaining chains:', getAllCustomChains().length);
}

// Example 6: Real-world DApp integration
// Use case: Production DApp with custom chain support and error handling
// Perfect for: Complete DApp implementations, production systems, enterprise applications
class CustomChainErrorHandler {
  private registeredChains = new Set<string>();

  /**
   * Register chains for a DApp
   */
  setupChains() {
    // Register testnet for development
    registerCustomChain({
      chainId: 'dapp-testnet',
      name: 'DApp Testnet',
      isEVMCompatible: true,
      errorMappings: [
        {
          pattern: 'dapp testnet error',
          message: 'DApp testnet is experiencing issues. Please try again.',
          priority: 15
        }
      ],
      customFallbacks: {
        generic: 'DApp testnet error occurred.',
        network: 'DApp testnet connection issue.'
      }
    });

    // Register mainnet for production
    registerCustomChain({
      chainId: 'dapp-mainnet',
      name: 'DApp Mainnet',
      isEVMCompatible: true,
      errorMappings: [
        {
          pattern: 'dapp mainnet error',
          message: 'DApp mainnet is experiencing issues. Please try again.',
          priority: 15
        }
      ],
      customFallbacks: {
        generic: 'DApp mainnet error occurred.',
        network: 'DApp mainnet connection issue.'
      }
    });

    this.registeredChains.add('dapp-testnet');
    this.registeredChains.add('dapp-mainnet');
  }

  /**
   * Handle errors with appropriate chain context
   */
  handleError(error: TranslatableError, chainId: string) {
    const result = translateError(error, { chain: chainId });
    
    // Log for debugging
    console.error(`[${chainId}] Error:`, result.message);
    
    // Show user-friendly message
    this.showUserMessage(result.message, chainId);
    
    return result;
  }

  /**
   * Show user message based on chain
   */
  private showUserMessage(message: string, chainId: string) {
    const chainName = getCustomChain(chainId)?.name || chainId;
    console.log(`[${chainName}] ${message}`);
  }

  /**
   * Cleanup registered chains
   */
  cleanup() {
    this.registeredChains.forEach(chainId => {
      unregisterCustomChain(chainId);
    });
    this.registeredChains.clear();
  }
}

// Example 7: Batch chain registration
// Use case: Bulk chain setup for multi-chain applications
// Perfect for: Multi-chain DApps, chain management systems, deployment scripts
function registerMultipleChains() {
  const chains: CustomChainConfig[] = [
    {
      chainId: 'chain-1',
      name: 'Chain 1',
      isEVMCompatible: true,
      errorMappings: [
        { pattern: 'chain 1 error', message: 'Chain 1 specific error', priority: 15 }
      ]
    },
    {
      chainId: 'chain-2',
      name: 'Chain 2',
      isEVMCompatible: true,
      errorMappings: [
        { pattern: 'chain 2 error', message: 'Chain 2 specific error', priority: 15 }
      ]
    },
    {
      chainId: 'chain-3',
      name: 'Chain 3',
      isEVMCompatible: false,
      errorMappings: [
        { pattern: 'chain 3 error', message: 'Chain 3 specific error', priority: 15 }
      ]
    }
  ];

  chains.forEach(chain => {
    try {
      registerCustomChain(chain);
      console.log(`✅ Registered ${chain.name}`);
    } catch (error) {
      console.error(`❌ Failed to register ${chain.name}:`, error);
    }
  });

  console.log(`\nTotal registered chains: ${getAllCustomChains().length}`);
}

// Run all examples
function runAllExamples() {
  console.log('🚀 Custom Chain Support Examples\n');
  
  demonstrateCustomChainUsage();
  demonstrateChainManagement();
  
  console.log('\n=== DApp Integration Example ===');
  const errorHandler = new CustomChainErrorHandler();
  errorHandler.setupChains();
  
  // Simulate an error
  const error = new Error('dapp testnet error');
  errorHandler.handleError(error, 'dapp-testnet');
  
  errorHandler.cleanup();
  
  console.log('\n=== Batch Registration Example ===');
  registerMultipleChains();
  
  // Cleanup
  clearCustomChains();
  console.log('\n✅ All examples completed and cleaned up');
}

export {
  registerCustomTestnet,
  registerCustomL2,
  registerNonEVMChain,
  demonstrateCustomChainUsage,
  demonstrateChainManagement,
  CustomChainErrorHandler,
  registerMultipleChains,
  runAllExamples
};
