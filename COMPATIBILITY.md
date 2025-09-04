# Node.js Compatibility Guide

## Supported Node.js Versions

This package supports **Node.js 18.0.0 and above**.

### Why Node.js 18+?

Our codebase uses modern JavaScript/TypeScript features that require Node.js 18+:

- **ES2022 Target**: Full support for modern JavaScript features
- **Nullish Coalescing (`??`)**: Available since Node.js 14, but we use ES2022 features
- **Optional Chaining (`?.`)**: Available since Node.js 14, but we use ES2022 features
- **ES Modules**: Full support with modern module resolution
- **Modern TypeScript**: Latest TypeScript features and strict mode

## Version Support Matrix

| Node.js Version | Status | Support Level | Notes |
|----------------|--------|---------------|-------|
| **Node.js 16** | ❌ EOL | Not Supported | Reached EOL September 2023 |
| **Node.js 18** | ⚠️ EOL Soon | Supported | EOL April 2025 |
| **Node.js 20** | ✅ LTS | Fully Supported | Recommended for production |
| **Node.js 22** | ✅ LTS | Fully Supported | Latest LTS, recommended |

## Modern Features Used

### JavaScript Features
- **Nullish Coalescing (`??`)**: `value ?? defaultValue`
- **Optional Chaining (`?.`)**: `obj?.property?.method()`
- **Spread Operator**: `[...array1, ...array2]`
- **ES Modules**: `import/export` syntax
- **Const Assertions**: `as const` for immutable objects

### TypeScript Features
- **ES2022 Target**: Latest JavaScript features
- **Strict Mode**: Enhanced type checking
- **Modern Type Guards**: Improved runtime type checking
- **Utility Types**: `Partial`, `Pick`, `Record`
- **Branded Types**: Enhanced type safety

## Migration Guide

### From Node.js 16 or earlier

If you're using Node.js 16 or earlier, you'll need to upgrade:

1. **Update Node.js**:
   ```bash
   # Using nvm
   nvm install 20
   nvm use 20
   
   # Or download from nodejs.org
   ```

2. **Update package.json**:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **Test your application**:
   ```bash
   npm test
   ```

## Browser Compatibility

This package is designed for **Node.js environments**. For browser usage:

- Use a bundler like **Webpack**, **Vite**, or **Rollup**
- The bundler will transpile the code for browser compatibility
- Modern browsers support all the JavaScript features we use

## Docker Support

For Docker deployments, use Node.js 18+:

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "start"]
```

## CI/CD Compatibility

Most CI/CD platforms support Node.js 18+:

- **GitHub Actions**: ✅ Supported
- **GitLab CI**: ✅ Supported  
- **CircleCI**: ✅ Supported
- **Travis CI**: ✅ Supported
- **Azure DevOps**: ✅ Supported

## Performance Benefits

Using Node.js 18+ provides:

- **Better Performance**: V8 engine improvements
- **Memory Efficiency**: Reduced memory usage
- **Security**: Latest security patches
- **Modern APIs**: Access to latest Node.js APIs
- **ES2022 Features**: Native support for modern JavaScript

## Support Policy

- **Node.js 18**: Supported until April 2025
- **Node.js 20**: LTS until April 2026
- **Node.js 22**: LTS until April 2027

We recommend using **Node.js 20** or **Node.js 22** for production applications.
