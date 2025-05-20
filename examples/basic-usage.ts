import isPasswordSecure from "../src";

// Basic usage example
async function basicExample() {
  try {
    console.log("Checking password security...");

    const result = await isPasswordSecure("MySecretP@ssw0rd", {
      model: "llama3.2",
      timeout: 15000,
    });

    console.log("\nSecurity analysis results:");
    console.log("------------------------------");
    console.log(`Score: ${result.score}/100`);
    console.log(`Security level: ${result.rating}`);
    console.log(`Password is secure: ${result.isSecure ? "Yes" : "No"}`);
    console.log(`Suggestions: ${result.feedback}`);
  } catch (error) {
    console.error(
      "An error occurred:",
      error instanceof Error ? error.message : String(error),
    );
    console.log("\nMake sure that:");
    console.log("1. Ollama is installed and running");
    console.log("2. Ollama API is available at http://localhost:11434");
    console.log("3. The LLM model is downloaded (e.g., llama2)");
  }
}

// Run the example
basicExample();
