import axios, { type AxiosResponse } from "axios";

/**
 * Security assessment result interface
 */
export interface PasswordSecurityResult {
  /** Score from 0 to 100 */
  score: number;
  /** Verbal rating (very weak, weak, moderate, strong, very strong) */
  rating: string;
  /** Specific suggestions for improving password security */
  feedback: string;
  /** Boolean indicating if the password is considered secure (score > 60) */
  isSecure: boolean;
}

/**
 * Configuration options for password security check
 */
export interface PasswordSecurityOptions {
  /** URL to the Ollama API (default: http://localhost:11434) */
  ollamaUrl?: string;
  /** Ollama model to use (default: llama2) */
  model?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
}

/**
 * Default options for password security check
 */
const DEFAULT_OPTIONS: Required<PasswordSecurityOptions> = {
  ollamaUrl: "http://localhost:11434",
  model: "llama2",
  timeout: 10000,
};

/**
 * Response structure from Ollama API
 */
interface OllamaResponse {
  response: string;
  [key: string]: any;
}

/**
 * Checks if a user password is secure using Ollama AI model
 * @param password - Password to check
 * @param options - Configuration options
 * @returns Promise with security assessment results
 */
export async function isPasswordSecure(
  password: string,
  options: PasswordSecurityOptions = {},
): Promise<PasswordSecurityResult> {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  const config: Required<PasswordSecurityOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // System prompt informing the model that it acts as a user security manager
  const systemPrompt = `You are an advanced user security manager specializing in password security assessment. 
Your task is to evaluate the strength of the provided password.
Assess the password against the following criteria:
1. Length (minimum 8 characters)
2. Complexity (character diversity: lowercase and uppercase letters, numbers, special characters)
3. Avoidance of common patterns (like "123456", "password", "qwerty")
4. Uniqueness (whether it's a commonly used password)

Use these criteria to rate the password on a scale from 0 to 100, where:
- 0-20: Very weak (easy to crack within seconds)
- 21-40: Weak (easy to crack within minutes)
- 41-60: Moderate (requires more time to crack)
- 61-80: Strong (difficult to crack)
- 81-100: Very strong (extremely difficult to crack)

The output should be in JSON format with the following fields:
- score: number from 0 to 100
- rating: verbal description (very weak, weak, moderate, strong, very strong)
- feedback: specific suggestions for improving password security
- isSecure: boolean indicating whether the password is considered secure (score > 60)`;

  // Prompt with user's password
  const userPrompt = `Evaluate the following password for security: "${password}"`;

  try {
    const response: AxiosResponse<OllamaResponse> = await axios.post(
      `${config.ollamaUrl}/api/generate`,
      {
        model: config.model,
        prompt: userPrompt,
        system: systemPrompt,
        format: "json",
        stream: false,
        options: {
          temperature: 0.1, // Low temperature for more deterministic results
        },
      },
      {
        timeout: config.timeout,
      },
    );

    // Processing the response as JSON
    const result = response.data.response;
    try {
      // Try to parse the response as JSON
      const jsonResult = JSON.parse(result) as PasswordSecurityResult;
      return jsonResult;
    } catch (_e) {
      // If parsing as JSON failed, try to extract JSON from the text
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as PasswordSecurityResult;
      }

      // If JSON extraction still failed, return a basic object
      console.warn(
        "Failed to get response in JSON format, returning approximate results",
      );
      return {
        score: estimateScore(result),
        rating: estimateRating(result),
        feedback:
          "Couldn't get precise results. Consider using a password with at least 12 characters, containing a mix of lowercase and uppercase letters, numbers, and special characters.",
        isSecure: result.toLowerCase().includes("strong"),
      };
    }
  } catch (error) {
    console.error(
      "Error using Ollama API:",
      error instanceof Error ? error.message : String(error),
    );
    throw new Error(
      `Failed to check password: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Tries to estimate security score based on text
 * @param text - Text response
 * @returns Estimated score (0-100)
 */
function estimateScore(text: string): number {
  const text_lower = text.toLowerCase();
  if (text_lower.includes("very strong")) return 85;
  if (text_lower.includes("strong")) return 70;
  if (text_lower.includes("moderate")) return 50;
  if (text_lower.includes("weak")) return 30;
  if (text_lower.includes("very weak")) return 15;
  return 40; // Default value
}

/**
 * Tries to estimate verbal rating based on text
 * @param text - Text response
 * @returns Verbal rating
 */
function estimateRating(text: string): string {
  const text_lower = text.toLowerCase();
  if (text_lower.includes("very strong")) return "very strong";
  if (text_lower.includes("strong")) return "strong";
  if (text_lower.includes("moderate")) return "moderate";
  if (text_lower.includes("weak")) return "weak";
  if (text_lower.includes("very weak")) return "very weak";
  return "moderate"; // Default value
}

export default isPasswordSecure;
