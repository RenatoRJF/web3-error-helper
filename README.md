# web3-error-helper

> 🛠️ Turn confusing Web3 errors into clear, human-friendly messages for developers and users alike.

[![npm version](https://img.shields.io/npm/v/web3-error-helper.svg)](https://www.npmjs.com/package/web3-error-helper)
[![License](https://img.shields.io/github/license/YOUR_GITHUB_USERNAME/web3-error-helper)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/YOUR_GITHUB_USERNAME/web3-error-helper/ci.yml)](https://github.com/YOUR_GITHUB_USERNAME/web3-error-helper/actions)

---

## ⚡ Quick Start

Get started in seconds:

```ts
import { translateError } from "web3-error-helper";

try {
  await contract.transfer(to, amount);
} catch (err) {
  const result = translateError(err, { 
    chain: "polygon",
    customMappings: {
      "execution reverted: custom error": "Polygon-specific failure."
    }
  });
  console.error(result.message);
  // -> "Polygon-specific failure." or a human-readable default
}
```

No setup required—just wrap your calls, and your errors are instantly readable.

## 🎯 Advanced Usage

### Custom Chain Support
Register your own blockchain networks with custom error mappings:

```ts
import { registerCustomChain, translateError } from "web3-error-helper";

// Register a custom chain
registerCustomChain({
  chainId: 'my-custom-chain',
  name: 'My Custom Chain',
  isEVMCompatible: true,
  errorMappings: [
    {
      pattern: 'custom error pattern',
      message: 'Custom error message for your chain',
      priority: 15
    }
  ],
  customFallbacks: {
    generic: 'Custom chain error occurred',
    network: 'Custom chain network issue',
    wallet: 'Custom chain wallet error'
  }
});

// Use with custom chain
const result = translateError(error, { chain: 'my-custom-chain' });
```

### Error Categories & Advanced Options
```ts
import { translateError, SupportedChain } from "web3-error-helper";

const result = translateError(error, {
  chain: SupportedChain.POLYGON,
  fallbackMessage: 'Custom fallback message',
  includeOriginalError: true,
  customMappings: {
    'specific error': 'Custom translation'
  }
});

console.log(result.message);        // Human-readable message
console.log(result.translated);     // Whether it was translated
console.log(result.chain);          // Chain used
console.log(result.originalError);  // Original error (if requested)
```

> 📚 **Complete Examples:** Check out the [`examples/`](./examples/) directory for comprehensive usage examples including custom chains, advanced error handling, and real-world scenarios.

---

## ✨ Features

- **Human-readable errors** – Translate confusing EVM and wallet errors into clear messages.  
- **Plug & Play** – Wrap `try/catch` blocks or RPC calls without extra setup.  
- **Extensible** – Add your own custom error mappings per project.  
- **Multi-chain support** – Works across EVM-compatible chains (Ethereum, Polygon, Arbitrum, Optimism, etc.).  
- **Custom chain support** – Register and manage custom blockchain networks with their own error mappings.
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
- [x] **Error translation system** – Core functionality for translating EVM errors
- [x] **Multi-chain support** – Built-in support for Ethereum, Polygon, Arbitrum, Optimism, BSC, Avalanche, Fantom, Base
- [x] **Custom chain support** – Register and manage custom blockchain networks with full error mapping support
- [x] **Error categories** – Organized error mappings (ERC20, gas, wallet, network, transaction, contract, EVM)
- [x] **TypeScript support** – Full type safety and modern ES2024 features
- [x] **Regex pattern matching** – Advanced error pattern recognition with priority-based matching
- [x] **Configurable fallbacks** – Chain-specific fallback messages with intelligent error type detection
- [x] **Chain management** – Comprehensive chain discovery, validation, and statistics
- [x] **Error type detection** – Automatic categorization of errors (network, wallet, contract, gas, transaction)
- [x] **Modern architecture** – Clean separation of concerns with modular design

### 📋 Planned Features

**Core improvements**
- [ ] **Enhanced error dictionary** – More comprehensive error mappings
- [ ] **Performance optimizations** – Caching and faster pattern matching

**Framework components**
- [ ] React `<ErrorMessage />`  
- [ ] Vue `<ErrorMessage />`  
- [ ] Svelte `<ErrorMessage />`  
- [ ] Angular `<ErrorMessage />`  
- [ ] Web Component `<web3-error-message>`  

**Non-EVM chains**
- [ ] Solana adapter  
- [ ] Cosmos adapter  

**Other features**
- [ ] i18n (multi-language support)
- [ ] Error analytics (optional logging/monitoring)
- [ ] Error severity levels
- [ ] Custom error formatting  

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
