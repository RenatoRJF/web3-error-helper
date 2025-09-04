/**
 * Non-EVM Chain Examples
 * 
 * This example demonstrates how to use web3-error-helper with non-EVM
 * blockchain networks like Solana, Cosmos, and Near Protocol.
 * 
 * Use Cases:
 * - Multi-chain dApp development
 * - Cross-chain error handling
 * - Blockchain-agnostic error translation
 * - DeFi applications supporting multiple ecosystems
 */

import { 
  translateError, 
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
  adapterRegistry 
} from '../src';

// Example 1: Solana Error Translation
// Use Case: Building a Solana dApp with comprehensive error handling
console.log('=== Solana Error Translation ===');

const solanaError = {
  InstructionError: [0, { Custom: 6000 }],
  message: 'Program error: 6000'
};

const solanaResult = translateError(solanaError, {
  ecosystem: 'solana',
  includeOriginalError: true
});

console.log('Solana Error Result:', solanaResult);
// Expected: "Program error: 6000" or "Solana program execution failed"

// Example 2: Cosmos Error Translation
// Use Case: Building a Cosmos SDK-based application
console.log('\n=== Cosmos Error Translation ===');

const cosmosError = {
  code: 5,
  message: 'insufficient funds',
  tx_response: {
    raw_log: 'insufficient funds: insufficient account funds'
  }
};

const cosmosResult = translateError(cosmosError, {
  ecosystem: 'cosmos',
  chain: 'cosmos-hub'
});

console.log('Cosmos Error Result:', cosmosResult);
// Expected: "Insufficient balance for transaction"

// Example 3: Near Protocol Error Translation
// Use Case: Building a Near Protocol dApp
console.log('\n=== Near Protocol Error Translation ===');

const nearError = {
  Failure: {
    ActionError: {
      kind: {
        FunctionCallError: {
          ExecutionError: 'Smart contract execution failed'
        }
      }
    }
  }
};

const nearResult = translateError(nearError, {
  ecosystem: 'near',
  includeOriginalError: true
});

console.log('Near Error Result:', nearResult);
// Expected: "Smart contract execution failed"

// Example 4: Additional Blockchain Ecosystems
// Use Case: Building applications that support multiple blockchain ecosystems
console.log('\n=== Additional Blockchain Ecosystems ===');

// Cardano Error Translation
const cardanoError = {
  ScriptFailure: {
    PlutusFailure: {
      EvaluationError: 'insufficient ada'
    }
  }
};

const cardanoResult = translateError(cardanoError, {
  ecosystem: 'cardano'
});

console.log('Cardano Error Result:', cardanoResult);

// Polkadot Error Translation
const polkadotError = {
  ExtrinsicFailed: {
    DispatchError: {
      BalanceTooLow: true
    }
  }
};

const polkadotResult = translateError(polkadotError, {
  ecosystem: 'polkadot'
});

console.log('Polkadot Error Result:', polkadotResult);

// Algorand Error Translation
const algorandError = {
  logic_error: {
    message: 'insufficient balance'
  }
};

const algorandResult = translateError(algorandError, {
  ecosystem: 'algorand'
});

console.log('Algorand Error Result:', algorandResult);

// Tezos Error Translation
const tezosError = {
  michelson_error: {
    message: 'script failed'
  }
};

const tezosResult = translateError(tezosError, {
  ecosystem: 'tezos'
});

console.log('Tezos Error Result:', tezosResult);

// Stellar Error Translation
const stellarError = {
  operation_error: {
    code: 'INSUFFICIENT_BALANCE'
  }
};

const stellarResult = translateError(stellarError, {
  ecosystem: 'stellar'
});

console.log('Stellar Error Result:', stellarResult);

// Ripple Error Translation
const rippleError = {
  transaction_result: {
    result: 'INSUFFICIENT_FUNDS'
  }
};

const rippleResult = translateError(rippleError, {
  ecosystem: 'ripple'
});

console.log('Ripple Error Result:', rippleResult);

// Example 5: Automatic Ecosystem Detection
// Use Case: Generic error handling that works across all blockchains
console.log('\n=== Automatic Ecosystem Detection ===');

const evmError = 'execution reverted: gas required exceeds allowance';
const autoDetectedEVM = translateError(evmError);
console.log('Auto-detected EVM Error:', autoDetectedEVM);

const solanaErrorString = 'program error: 6000';
const autoDetectedSolana = translateError(solanaErrorString);
console.log('Auto-detected Solana Error:', autoDetectedSolana);

// Example 6: Using Adapters Directly
// Use Case: Advanced error handling with direct adapter access
console.log('\n=== Direct Adapter Usage ===');

const solanaAdapter = new SolanaAdapter();
const cosmosAdapter = new CosmosAdapter();
const nearAdapter = new NearAdapter();
const cardanoAdapter = new CardanoAdapter();
const polkadotAdapter = new PolkadotAdapter();
const algorandAdapter = new AlgorandAdapter();
const tezosAdapter = new TezosAdapter();
const stellarAdapter = new StellarAdapter();
const rippleAdapter = new RippleAdapter();

// Check if error matches specific ecosystem
const testError = { message: 'insufficient funds' };

console.log('Solana matches:', solanaAdapter.matchesErrorFormat(testError));
console.log('Cosmos matches:', cosmosAdapter.matchesErrorFormat(testError));
console.log('Near matches:', nearAdapter.matchesErrorFormat(testError));
console.log('Cardano matches:', cardanoAdapter.matchesErrorFormat(testError));
console.log('Polkadot matches:', polkadotAdapter.matchesErrorFormat(testError));
console.log('Algorand matches:', algorandAdapter.matchesErrorFormat(testError));
console.log('Tezos matches:', tezosAdapter.matchesErrorFormat(testError));
console.log('Stellar matches:', stellarAdapter.matchesErrorFormat(testError));
console.log('Ripple matches:', rippleAdapter.matchesErrorFormat(testError));

// Get ecosystem-specific error patterns
console.log('Solana patterns:', solanaAdapter.getErrorPatterns());
console.log('Cosmos patterns:', cosmosAdapter.getErrorPatterns());
console.log('Near patterns:', nearAdapter.getErrorPatterns());
console.log('Cardano patterns:', cardanoAdapter.getErrorPatterns());
console.log('Polkadot patterns:', polkadotAdapter.getErrorPatterns());
console.log('Algorand patterns:', algorandAdapter.getErrorPatterns());
console.log('Tezos patterns:', tezosAdapter.getErrorPatterns());
console.log('Stellar patterns:', stellarAdapter.getErrorPatterns());
console.log('Ripple patterns:', rippleAdapter.getErrorPatterns());

// Example 7: Custom Ecosystem Registration
// Use Case: Adding support for new blockchain ecosystems
console.log('\n=== Custom Ecosystem Registration ===');

// Register a custom adapter for a new ecosystem
class CustomBlockchainAdapter extends EVMAdapter {
  readonly ecosystem = 'evm' as const;
  readonly chainId = 9999;

  constructor() {
    super(9999);
  }

  extractErrorMessage(error: unknown): string {
    // Custom error extraction logic
    return super.extractErrorMessage(error);
  }

  matchesErrorFormat(error: unknown): boolean {
    // Custom format detection logic
    return super.matchesErrorFormat(error);
  }

  getErrorPatterns(): Record<string, string> {
    return {
      ...super.getErrorPatterns(),
      'custom error': 'Custom blockchain specific error'
    };
  }
}

const customAdapter = new CustomBlockchainAdapter();
adapterRegistry.registerAdapter('evm', customAdapter);

console.log('Custom adapter registered:', adapterRegistry.isEcosystemSupported('evm'));

// Example 8: Multi-Chain Error Handling
// Use Case: Building a cross-chain application
console.log('\n=== Multi-Chain Error Handling ===');

const errors = [
  { error: evmError, ecosystem: 'evm' as const },
  { error: solanaError, ecosystem: 'solana' as const },
  { error: cosmosError, ecosystem: 'cosmos' as const },
  { error: nearError, ecosystem: 'near' as const },
  { error: cardanoError, ecosystem: 'cardano' as const },
  { error: polkadotError, ecosystem: 'polkadot' as const },
  { error: algorandError, ecosystem: 'algorand' as const },
  { error: tezosError, ecosystem: 'tezos' as const },
  { error: stellarError, ecosystem: 'stellar' as const },
  { error: rippleError, ecosystem: 'ripple' as const }
];

errors.forEach(({ error, ecosystem }) => {
  const result = translateError(error, { ecosystem });
  console.log(`${ecosystem.toUpperCase()} Error:`, result.message);
});

// Example 9: Error Type Detection Across Ecosystems
// Use Case: Categorizing errors by type regardless of blockchain
console.log('\n=== Cross-Ecosystem Error Type Detection ===');

const crossChainErrors = [
  'insufficient funds', // Common across all chains
  'network timeout',    // Network issue
  'user rejected',      // Wallet issue
  'contract failed'     // Contract issue
];

crossChainErrors.forEach(errorMsg => {
  const evmResult = translateError(errorMsg, { ecosystem: 'evm' });
  const solanaResult = translateError(errorMsg, { ecosystem: 'solana' });
  
  console.log(`Error: "${errorMsg}"`);
  console.log(`  EVM: ${evmResult.message}`);
  console.log(`  Solana: ${solanaResult.message}`);
});

console.log('\n=== Non-EVM Chain Examples Complete ===');
