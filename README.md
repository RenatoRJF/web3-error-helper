# web3-error-helper

> 🛠️ Turn confusing Web3 errors into clear, human-friendly messages for developers and users alike.

[![npm version](https://img.shields.io/npm/v/web3-error-helper.svg)](https://www.npmjs.com/package/web3-error-helper)
[![License](https://img.shields.io/github/license/RenatoRJF/web3-error-helper)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/RenatoRJF/web3-error-helper/ci.yml)](https://github.com/RenatoRJF/web3-error-helper/actions)

---

## ⚡ Quick Start

Get started in seconds:

```ts
import { translateError } from 'web3-error-helper';

try {
  await contract.transfer(to, amount);
} catch (err) {
  const result = translateError(err, {
    chain: 'polygon',
    customMappings: {
      'execution reverted: custom error': 'Polygon-specific failure.',
    },
  });
  console.error(result.message);
  // -> "Polygon-specific failure." or a human-readable default
}
```

No setup required—just wrap your calls, and your errors are instantly readable.

### 🌍 Multi-Language Support

Translate errors into 20+ languages with built-in translations:

```ts
import {
  translateError,
  registerLocale,
  setCurrentLanguage,
} from 'web3-error-helper';

// Register Spanish translations
registerLocale('es', {
  errors: {
    network: 'Error de red ocurrido. Por favor verifica tu conexión.',
    wallet: 'Error de billetera ocurrido. Por favor verifica tu conexión.',
    insufficient_funds: 'Saldo insuficiente para la transacción',
  },
});

// Set language and translate
setCurrentLanguage('es');
const result = translateError(error, { language: 'es' });
console.log(result.message); // -> "Error de red ocurrido..."
```

## 🎯 Advanced Usage

### Custom Chain Support

Register your own blockchain networks with custom error mappings:

```ts
import { registerCustomChain, translateError } from 'web3-error-helper';

// Register a custom chain
registerCustomChain({
  chainId: 'my-custom-chain',
  name: 'My Custom Chain',
  isEVMCompatible: true,
  errorMappings: [
    {
      pattern: 'custom error pattern',
      message: 'Custom error message for your chain',
      priority: 15,
    },
  ],
  customFallbacks: {
    generic: 'Custom chain error occurred',
    network: 'Custom chain network issue',
    wallet: 'Custom chain wallet error',
  },
});

// Use with custom chain
const result = translateError(error, { chain: 'my-custom-chain' });
```

### Error Categories & Advanced Options

```ts
import { translateError, SupportedChain } from 'web3-error-helper';

const result = translateError(error, {
  chain: SupportedChain.POLYGON,
  fallbackMessage: 'Custom fallback message',
  includeOriginalError: true,
  customMappings: {
    'specific error': 'Custom translation',
  },
});

console.log(result.message); // Human-readable message
console.log(result.translated); // Whether it was translated
console.log(result.chain); // Chain used
console.log(result.originalError); // Original error (if requested)
```

### Smart Language Management

```ts
import {
  configureLanguageSelection,
  detectFromBrowser,
  getAvailableLanguages,
} from 'web3-error-helper';

// Configure language selection with optimization
const result = configureLanguageSelection({
  targetLanguages: ['es', 'pt', 'fr'],
  includeEnglishFallback: true,
  autoSuggest: true,
  loadOnlyTarget: true,
});

// Auto-detect browser language
const browserLang = detectFromBrowser(); // 'en-US' -> 'en'

// Get available languages with metadata
const languages = getAvailableLanguages();
console.log(languages); // [{ code: 'en', info: {...} }, ...]
```

**Supported Languages (20):**
English (en), Spanish (es), Portuguese (pt), Chinese (zh), Japanese (ja), Korean (ko), German (de), Russian (ru), Hindi (hi), Arabic (ar), Turkish (tr), Vietnamese (vi), Thai (th), Indonesian (id), Polish (pl), Ukrainian (uk), Hebrew (he), French (fr), Italian (it), Dutch (nl)

> 📚 **Complete Examples:** Check out the [`examples/`](./examples/) directory for comprehensive usage examples including custom chains, advanced error handling, i18n usage, and real-world scenarios.

---

## ✨ Features

- **Human-readable errors** – Translate confusing EVM and wallet errors into clear messages.
- **Plug & Play** – Wrap `try/catch` blocks or RPC calls without extra setup.
- **Extensible** – Add your own custom error mappings per project.
- **Multi-chain support** – Works across EVM-compatible chains (Ethereum, Polygon, Arbitrum, Optimism, etc.).
- **Custom chain support** – Register and manage custom blockchain networks with their own error mappings.
- **🌍 Internationalization (i18n)** – Multi-language support with smart language detection and bundle optimization.
- **Smart language management** – Auto-detect browser language, suggest alternatives, and optimize bundle size.
- **TypeScript-first** – Fully typed for safety and autocomplete with modern ES2022 features.
- **Modern JavaScript** – Built with latest JS/TS features: nullish coalescing, optional chaining, and strict type checking.

---

## 🚀 Installation

**Requirements:** Node.js 18.0.0 or higher

```bash
npm install web3-error-helper
# or
yarn add web3-error-helper
# or
pnpm add web3-error-helper
```

> 📋 **Compatibility:** See [COMPATIBILITY.md](./COMPATIBILITY.md) for detailed Node.js version support and migration guide.

---

## 🔮 Roadmap

### ✅ Completed Features

**Core Error Translation**

- [x] **Error translation system** – Core functionality for translating EVM errors
- [x] **Multi-chain support** – Built-in support for Ethereum, Polygon, Arbitrum, Optimism, BSC, Avalanche, Fantom, Base
- [x] **Custom chain support** – Register and manage custom blockchain networks with full error mapping support
- [x] **Error categories** – Organized error mappings (ERC20, gas, wallet, network, transaction, contract, EVM)
- [x] **Regex pattern matching** – Advanced error pattern recognition with priority-based matching
- [x] **Configurable fallbacks** – Chain-specific fallback messages with intelligent error type detection
- [x] **Chain management** – Comprehensive chain discovery, validation, and statistics
- [x] **Error type detection** – Automatic categorization of errors (network, wallet, contract, gas, transaction)

**Type Safety & Code Quality**

- [x] **TypeScript support** – Full type safety and modern ES2024 features
- [x] **Type safety improvements** – Eliminated all `any` types with proper TypeScript types
- [x] **Enhanced type definitions** – Comprehensive i18n type system with adapter-specific types
- [x] **Non-null assertion fixes** – Replaced with proper fallback handling
- [x] **Type guards** – Improved nested value access with safer object access

**Internationalization (i18n)**

- [x] **🌍 Multi-language support** – 20 blockchain-focused languages (English, Spanish, Portuguese, Chinese, Japanese, Korean, German, Russian, Hindi, Arabic, Turkish, Vietnamese, Thai, Indonesian, Polish, Ukrainian, Hebrew, French, Italian, Dutch)
- [x] **Smart language management** – Bundle optimization with up to 70% size reduction
- [x] **Language detection** – Auto-detect browser language and suggest alternatives
- [x] **Translation key system** – Type-safe translation keys for different blockchain ecosystems
- [x] **Partial override system** – Granular control with developer-provided locales
- [x] **Automatic fallback system** – Developer translation → English fallback → Key itself
- [x] **Language bundle optimization** – Smart loading with lazy loading system

**Architecture & Infrastructure**

- [x] **Modern architecture** – Clean separation of concerns with modular design
- [x] **Adapter system** – Comprehensive blockchain ecosystem adapters (EVM, Solana, Cosmos, Near, Cardano, Polkadot, Algorand, Tezos, Stellar, Ripple)
- [x] **Test infrastructure** – 157/157 tests passing with 73 stable snapshots
- [x] **Timestamp mocking** – Consistent test results with mockable timestamp system
- [x] **ESLint configuration** – Clean codebase with 0 linting errors
- [x] **Production-ready quality** – Comprehensive testing and documentation

### 📋 Planned Features

**Framework Components**

- [ ] React `<ErrorMessage />` component
- [ ] Vue `<ErrorMessage />` component
- [ ] Svelte `<ErrorMessage />` component
- [ ] Angular `<ErrorMessage />` component
- [ ] Web Component `<web3-error-message>`

**Enhanced Error Coverage**

- [ ] **Expanded error dictionary** – More comprehensive error mappings for edge cases
- [ ] **Chain-specific error patterns** – Deeper integration with individual blockchain error formats
- [ ] **Error severity classification** – Automatic severity detection (low, medium, high, critical)

**Performance & Analytics**

- [ ] **Advanced caching** – Intelligent caching strategies for better performance
- [ ] **Error analytics** – Optional logging and monitoring capabilities
- [ ] **Performance metrics** – Translation speed and accuracy tracking

**Developer Experience**

- [ ] **Custom error formatting** – Flexible error message formatting options
- [ ] **Error debugging tools** – Enhanced debugging and development utilities
- [ ] **CLI tools** – Command-line utilities for error analysis and translation

**Advanced Features**

- [ ] **Error prediction** – Proactive error detection and prevention
- [ ] **Context-aware translations** – Smart translations based on user context
- [ ] **A/B testing support** – Error message optimization through testing

---

### 🤝 Contributor Guidelines

We love contributions! 🎉 To keep the library high-quality and consistent, please follow these simple rules:

- **Code style:** Follow existing conventions (ESLint + Prettier). No style-only changes.
- **Error messages:** Keep messages **clear, concise, and user-friendly**.
- **Issue submissions:** Only create issues for **actual bugs or missing core functionality**. Minor suggestions or new error mappings are better suited for PRs.
- **Adding chains or frameworks:** Stick to the roadmap. If you want to propose a new chain or component, open a discussion first.
- **Tests required:** Always include unit tests when adding or updating error mappings.
- **Documentation:** Update README/examples if you add new features.

Here's how to get started:

### Setup

**Requirements:** Node.js 18.0.0 or higher

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/web3-error-helper.git
cd web3-error-helper
pnpm install
git checkout -b feature/my-feature
```

> 💡 **Node.js Version:** Use `nvm use` to automatically switch to the correct Node.js version (specified in `.nvmrc`).

### Branch Naming Rules

We enforce consistent branch naming to maintain project organization. All branches must follow this pattern:

**Format:** `^(feature|fix|hotfix|release)\/[a-z0-9._-]+$`

**Valid examples:**

- `feature/user-authentication`
- `fix/login-bug`
- `hotfix/security-patch`
- `release/v1.2.0`

**Rules:**

- Must start with: `feature/`, `fix/`, `hotfix/`, or `release/`
- Use lowercase letters, numbers, dots, underscores, or hyphens only
- No spaces or uppercase letters allowed

The project includes automatic validation:

- **Local validation:** Pre-push hook prevents invalid branch names
- **Remote validation:** GitHub Actions validates PR branch names
- **Manual check:** Run `npm run validate:branch` anytime

### Development

```bash
# Build the project
pnpm run build

# Watch for changes during development
pnpm run build:watch

# Clean build output
pnpm run clean
```

### Adding or Updating Errors

- Add mappings inside `src/errors/` directory (JSON files for each category).
- Keep messages **clear, concise, and user-friendly**.
- Follow the existing file structure (`erc20.json`, `gas.json`, `wallet.json`, etc.).
- Use the `addCustomMappings` function for runtime custom mappings.

### Testing

```bash
pnpm run test
```

Ensure all tests pass before committing.

### Code Style

- ESLint + Prettier are enforced.
- Run the linter: `pnpm run lint`
- Modern JavaScript/TypeScript features are used throughout the codebase
- Follow ES2022 standards and TypeScript strict mode

### Commit Messages & Versioning

We use **Conventional Commits** for automatic versioning. Follow these patterns:

#### **Major Version Bump (Breaking Changes)**

```bash
git commit -m "feat!: redesign error translation API"
git commit -m "fix: resolve critical bug

BREAKING CHANGE: API interface has changed"
```

#### **Minor Version Bump (New Features)**

```bash
git commit -m "feat: add Polygon chain support"
git commit -m "feat: implement custom error mappings"
```

#### **Patch Version Bump (Bug Fixes & Maintenance)**

```bash
git commit -m "fix: resolve gas estimation error"
git commit -m "docs: update README examples"
git commit -m "chore: update dependencies"
git commit -m "test: add unit tests for error mapping"
```

### Pull Requests

- Use conventional commit messages (see above)
- Open a PR with a description of your changes
- The workflow will automatically create version tags based on your commit messages
- Feedback may be requested before merging

### Version Management

The project uses automated versioning via GitHub Actions:

- **Major bump**: `BREAKING CHANGE:` or `!:` in commit messages
- **Minor bump**: `feat:` commits
- **Patch bump**: `fix:`, `docs:`, `chore:`, `test:`, etc.

---

## 📜 License

MIT © [Renato Ferreira](https://github.com/RenatoRJF)
