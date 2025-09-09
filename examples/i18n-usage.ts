/**
 * Internationalization (i18n) usage examples
 * 
 * This example demonstrates how to use the i18n features of web3-error-helper
 * including language detection, translation, and smart language management.
 */

import { 
  translateError,
  registerLocale,
  setCurrentLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  configureLanguageSelection,
  getAvailableLanguages,
  detectFromBrowser,
  detectFromError,
  createTranslationKeys
} from '../src/index';

// Example 1: Basic i18n usage with error translation
console.log('=== Example 1: Basic i18n usage ===');

// Register Spanish translations
registerLocale('es', {
  errors: {
    network: 'Error de red ocurrido. Por favor verifica tu conexión.',
    wallet: 'Error de billetera ocurrido. Por favor verifica tu conexión.',
    insufficient_funds: 'Saldo insuficiente para la transacción',
    transaction_failed: 'Transacción falló. Por favor intenta de nuevo.',
    unknown_error: 'Ocurrió un error desconocido'
  }
});

// Set current language to Spanish
setCurrentLanguage('es');

// Translate an error in Spanish
const error1 = { message: 'Network error occurred' };
const result1 = translateError(error1, { language: 'es' });
console.log('Spanish translation:', result1.message);

// Example 2: Auto-detect language from error
console.log('\n=== Example 2: Auto-detect language from error ===');

// Register Portuguese translations
registerLocale('pt', {
  errors: {
    network: 'Erro de rede ocorrido. Por favor verifique sua conexão.',
    wallet: 'Erro de carteira ocorrido. Por favor verifique sua conexão.',
    insufficient_funds: 'Saldo insuficiente para a transação',
    transaction_failed: 'Transação falhou. Por favor tente novamente.',
    unknown_error: 'Ocorreu um erro desconhecido'
  }
});

// Create an error with Portuguese text
const error2 = { message: 'Erro de rede ocorrido' };
const result2 = translateError(error2, { autoDetectLanguage: true });
console.log('Auto-detected language result:', result2.message);

// Example 3: Smart language management
console.log('\n=== Example 3: Smart language management ===');

// Configure language selection
const selectionResult = configureLanguageSelection({
  targetLanguages: ['es', 'pt', 'fr'],
  includeEnglishFallback: true,
  autoSuggest: true,
  loadOnlyTarget: true
});

console.log('Language selection result:', {
  loaded: selectionResult.loaded,
  missing: selectionResult.missing,
  suggestions: selectionResult.suggestions
});

// Example 4: Browser language detection
console.log('\n=== Example 4: Browser language detection ===');

try {
  const browserLanguage = detectFromBrowser();
  console.log('Detected browser language:', browserLanguage);
} catch (error) {
  console.log('Browser language detection not available (Node.js environment)');
}

// Example 5: Available languages
console.log('\n=== Example 5: Available languages ===');

const availableLanguages = getAvailableLanguages();
console.log('Available languages:', availableLanguages.slice(0, 5)); // Show first 5

// Example 6: Type-safe translation keys
console.log('\n=== Example 6: Type-safe translation keys ===');

const evmKeys = createTranslationKeys.evm();
console.log('EVM translation keys sample:', {
  network: evmKeys.network,
  wallet: evmKeys.wallet,
  insufficient_funds: evmKeys.insufficient_funds
});

// Example 7: Multi-language error translation
console.log('\n=== Example 7: Multi-language error translation ===');

const error3 = { message: 'Insufficient balance for transaction' };

// Translate to different languages
const languages = ['en', 'es', 'pt'];
languages.forEach(lang => {
  const result = translateError(error3, { language: lang });
  console.log(`${lang.toUpperCase()}: ${result.message}`);
});

// Example 8: Current language management
console.log('\n=== Example 8: Current language management ===');

console.log('Current language:', getCurrentLanguage());
console.log('Supported languages:', getSupportedLanguages());

// Example 9: Error detection from different sources
console.log('\n=== Example 9: Error detection from different sources ===');

const errors = [
  { message: 'Error de red ocurrido' },
  { message: 'Erro de rede ocorrido' },
  { message: 'Network error occurred' },
  { message: 'Rede Fehler aufgetreten' }
];

errors.forEach((error, index) => {
  const detectedLang = detectFromError(error);
  console.log(`Error ${index + 1} detected language: ${detectedLang}`);
});

console.log('\n=== i18n Examples Complete ===');
