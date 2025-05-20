# is-password-secure

## Project Structure

```
is-password-secure/
├── src/
│   └── index.ts       # Main TypeScript source code
├── dist/              # Compiled JavaScript code (generated)
├── examples/
│   ├── basic-usage.ts
│   └── advanced-usage.ts
├── test/
│   └── test.ts
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
└── .gitignore
```

## Development Guide

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/skorotkiewicz/is-password-secure.git
   cd is-password-secure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the package:
   ```bash
   npm run build
   ```

### Running Tests

Make sure you have Ollama installed and running with at least the `llama2` model:

```bash
npm test
```

### Running Examples

Basic example:
```bash
npm run example:basic
```

Advanced interactive example:
```bash
npm run example:advanced
```

### Building for Production

```bash
npm run build
```

This will compile TypeScript code to JavaScript in the `dist` directory.

### Publishing to NPM

1. Update version in `package.json`
2. Build the package
3. Publish:
   ```bash
   npm publish
   ```

## Models

The package works with any model available in your Ollama installation. The default is `llama2`, but you can specify any model when calling the function:

```typescript
const result = await isPasswordSecure('password', { model: 'mistral' });
```

## Type Definitions

The package provides TypeScript type definitions for both the function parameters and return values:

- `PasswordSecurityOptions` - Configuration options
- `PasswordSecurityResult` - The security assessment results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
