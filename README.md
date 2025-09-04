# web3-error-helper

> 🛠️ Turn confusing Web3 errors into clear, human-friendly messages for developers and users alike.

[![npm version](https://img.shields.io/npm/v/web3-error-helper.svg)](https://www.npmjs.com/package/web3-error-helper)
[![License](https://img.shields.io/github/license/YOUR_GITHUB_USERNAME/web3-error-helper)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/YOUR_GITHUB_USERNAME/web3-error-helper/ci.yml)](https://github.com/YOUR_GITHUB_USERNAME/web3-error-helper/actions)

---

## ⚡ Quick Start

Get started in seconds:

```ts
import { translateError, addErrorMap } from "web3-error-helper";

// Optional: add custom error mapping for a specific chain
addErrorMap("polygon", {
  "execution reverted: custom error": "Polygon-specific failure."
});

try {
  await contract.transfer(to, amount);
} catch (err) {
  console.error(translateError(err, { chain: "polygon" }));
  // -> "Polygon-specific failure." or a human-readable default
}
```

No setup required—just wrap your calls, and your errors are instantly readable.

---

## ✨ Features

- **Human-readable errors** – Translate confusing EVM and wallet errors into clear messages.  
- **Plug & Play** – Wrap `try/catch` blocks or RPC calls without extra setup.  
- **Extensible** – Add your own custom error mappings per project.  
- **Multi-chain support** – Works across EVM-compatible chains (Ethereum, Polygon, Arbitrum, Optimism, etc.).  
- **TypeScript-first** – Fully typed for safety and autocomplete.

---

## 🚀 Installation

```bash
npm install web3-error-helper
# or
yarn add web3-error-helper
```

---

## 🔮 Roadmap

### Expand error dictionary
- [ ] ERC20 token errors  
- [ ] ERC721 token errors  
- [ ] Gas estimation & nonce errors  
- [ ] Wallet connection & transaction errors  

### Multi-chain support

**EVM chains (existing, partially supported)**
- [ ] Polygon  
- [ ] Arbitrum  
- [ ] Optimism  

**Non-EVM chains (planned)**
- [ ] Solana adapter  
- [ ] Cosmos adapter  

### Framework components
- [ ] React `<ErrorMessage />`  
- [ ] Vue `<ErrorMessage />`  
- [ ] Svelte `<ErrorMessage />`  
- [ ] Angular `<ErrorMessage />`  
- [ ] Web Component `<web3-error-message>`  

### Other features
- [ ] i18n (multi-language support)
- [ ] Error analytics (optional logging/monitoring)  

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

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/web3-error-helper.git
cd web3-error-helper
pnpm install
git checkout -b feature/my-feature
```

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

- Add mappings inside `src/errors/` directory (to be created).  
- Keep messages **clear, concise, and user-friendly**.  
- Follow the existing file structure (`evm.ts`, `polygon.ts`, etc.).

### Testing

```bash
pnpm run test
```

Ensure all tests pass before committing.

### Code Style

- ESLint + Prettier are enforced.  
- Run the linter: `pnpm run lint`

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
