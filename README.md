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

Here’s how to get started:

### Setup

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/web3-error-helper.git
cd web3-error-helper
npm install
git checkout -b feature/my-feature
```

### Adding or Updating Errors

- Add mappings inside `src/errors/`.  
- Keep messages **clear, concise, and user-friendly**.  
- Follow the existing file structure (`evm.ts`, `polygon.ts`, etc.).

### Testing

```bash
npm run test
```

Ensure all tests pass before committing.

### Code Style

- ESLint + Prettier are enforced.  
- Run the linter: `npm run lint`

### Pull Requests

- Use clear commit messages:  
  - `feat: add Polygon custom error mapping`  
  - `fix: correct ERC20 insufficient balance message`  
- Open a PR with a description of your changes.  
- Feedback may be requested before merging.

---

## 📜 License

MIT © [Renato Ferreira](https://github.com/RenatoRJF)
