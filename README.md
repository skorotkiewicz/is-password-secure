# is-password-secure

A simple NPM package for verifying password security using the Ollama API. This package uses artificial intelligence models to analyze passwords and assess their security.

## Installation

```bash
npm install is-password-secure
```

## Requirements

- Node.js (>= 14.0.0)
- Working local or remote Ollama API server

## Usage

Basic usage:

```typescript
import isPasswordSecure from 'is-password-secure';

async function checkPassword() {
  try {
    const result = await isPasswordSecure('YourPassword123!');
    console.log(result);
    
    if (result.isSecure) {
      console.log('Your password is secure!');
    } else {
      console.log('Your password is not secure. Suggestion: ' + result.feedback);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

checkPassword();
```

## Configuration

You can customize the function's behavior by passing an options object:

```typescript
const result = await isPasswordSecure('YourPassword123!', {
  ollamaUrl: 'http://localhost:11434', // Default URL to the Ollama API
  model: 'llama2',                     // Ollama model to use
  timeout: 10000                       // Request timeout in ms
});
```

### Available Models

You can use any model available in your Ollama installation. Some common examples:

- `llama2` (default)
- `mistral`
- `llama3.2`
- `gemma`
- `codellama`
- `phi`

Check your Ollama installation for available models.

## Results Format

The function returns an object with the following properties:

```typescript
{
  score: 75,             // Score from 0 to 100
  rating: 'strong',      // Verbal description: very weak, weak, moderate, strong, very strong
  feedback: 'Your password is good, but you might consider adding more special characters.',
  isSecure: true         // Boolean indicating if the password is considered secure (score > 60)
}
```

## How It Works

The package connects to the Ollama API and sends the provided password for evaluation by an artificial intelligence model. The model acts as a security manager, analyzing the password for:

1. Length
2. Complexity (character diversity)
3. Avoidance of common patterns
4. Uniqueness

## TypeScript Support

This package is written in TypeScript and provides full type definitions:

```typescript
import isPasswordSecure, { PasswordSecurityResult, PasswordSecurityOptions } from 'is-password-secure';

const options: PasswordSecurityOptions = {
  model: 'llama3',
  timeout: 15000
};

const result: PasswordSecurityResult = await isPasswordSecure('password123', options);
```

## Note

This package is more fun than a serious cybersecurity tool. Although it works correctly, for real production applications, I recommend using proven security libraries and best practices.

## License

MIT
