/**
 * Basic usage examples for web3-error-helper
 */

import { translateError, TranslatableError, SupportedChain } from 'web3-error-helper';

// Example 1: Basic error translation
// Use case: Simple error handling when you just need human-readable messages
// Perfect for: Logging, basic user notifications, debugging
function handleContractError(error: TranslatableError) {
  const result = translateError(error);
  
  if (result.translated) {
    console.log('Translated error:', result.message);
  } else {
    console.log('Fallback message:', result.message);
  }
}

// Example 2: With custom options
// Use case: Multi-chain DApps that need chain-specific error handling
// Perfect for: DApps supporting multiple networks, debugging with original errors
function handleErrorWithOptions(error: TranslatableError) {
  const result = translateError(error, {
    chain: SupportedChain.POLYGON,
    fallbackMessage: 'Something went wrong with your transaction',
    includeOriginalError: true
  });
  
  console.log('Error message:', result.message);
  console.log('Was translated:', result.translated);
  console.log('Chain used:', result.chain);
  
  if (result.originalError) {
    console.log('Original error:', result.originalError);
  }
}

// Example 3: With custom mappings
// Use case: Custom smart contracts with specific error messages
// Perfect for: DeFi protocols, NFT marketplaces, custom contract interactions
function handleErrorWithCustomMappings(error: TranslatableError) {
  const result = translateError(error, {
    customMappings: {
      'execution reverted: custom error': 'This is a custom error message for your specific contract',
      'insufficient funds': 'You need more ETH to complete this transaction'
    }
  });
  
  console.log('Custom error message:', result.message);
}

// Example 4: In a try-catch block
// Use case: Real-world contract interactions with user-friendly error handling
// Perfect for: Frontend applications, user-facing DApps, production error handling
interface ERC20Contract {
  transfer(to: string, amount: string): Promise<any>;
}

async function transferTokens(contract: ERC20Contract, to: string, amount: string) {
  try {
    await contract.transfer(to, amount);
    console.log('Transfer successful!');
  } catch (error) {
    const result = translateError(error as TranslatableError, {
      chain: SupportedChain.ETHEREUM,
      fallbackMessage: 'Token transfer failed. Please try again.'
    });
    
    // Show user-friendly error message
    alert(result.message);
    
    // Log original error for debugging
    console.error('Original error:', error);
  }
}

// Example 5: Batch error handling
// Use case: Processing multiple transactions or batch operations
// Perfect for: Batch transactions, error logging systems, bulk operations
function handleMultipleErrors(errors: TranslatableError[]) {
  const results = errors.map(error => translateError(error));
  
  results.forEach((result, index) => {
    console.log(`Error ${index + 1}:`, result.message);
  });
}

export {
  handleContractError,
  handleErrorWithOptions,
  handleErrorWithCustomMappings,
  transferTokens,
  handleMultipleErrors
};
