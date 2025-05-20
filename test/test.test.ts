import isPasswordSecure from "../src";

// Test function
async function runTests() {
  console.log("🔒 Testing is-password-secure package 🔒\n");

  // Array of passwords to test
  const passwords = [
    "cat123",
    "password",
    "Admin123",
    "Super$ecretP@ssw0rd",
    "1q2w3e4r5t",
    "yH7!2kLpQ@9zX",
  ];

  // Run test for each password
  for (const password of passwords) {
    try {
      console.log(
        `Testing password: ${password.substring(0, 3)}${"*".repeat(password.length - 3)}`,
      );

      console.time("Evaluation time");
      const result = await isPasswordSecure(password, {
        timeout: 20000, // Increased timeout for tests
      });
      console.timeEnd("Evaluation time");

      console.log(`- Score: ${result.score}/100`);
      console.log(`- Verbal rating: ${result.rating}`);
      console.log(`- Secure: ${result.isSecure ? "YES ✅" : "NO ❌"}`);
      console.log(`- Feedback: ${result.feedback}`);
      console.log("----------------------------\n");
    } catch (error) {
      console.error(
        `Error for password ${password}:`,
        error instanceof Error ? error.message : String(error),
      );
      console.log("----------------------------\n");
    }
  }

  // Test with custom options
  try {
    console.log("Testing with custom options:");
    const result = await isPasswordSecure("TestPassword!123", {
      ollamaUrl: "http://localhost:11434",
      model: "llama2",
      timeout: 15000,
    });

    console.log(`- Score: ${result.score}/100`);
    console.log(`- Secure: ${result.isSecure ? "YES ✅" : "NO ❌"}`);
  } catch (error) {
    console.error(
      "Error while testing custom options:",
      error instanceof Error ? error.message : String(error),
    );
  }

  // Test error handling
  try {
    console.log("\nTesting error handling:");
    await isPasswordSecure("", { timeout: 5000 });
  } catch (error) {
    console.log(
      "✅ Correctly detected error for empty password:",
      error instanceof Error ? error.message : String(error),
    );
  }

  try {
    console.log("Testing unavailable URL:");
    await isPasswordSecure("test123", {
      ollamaUrl: "http://invalid-url:11434",
      timeout: 5000,
    });
  } catch (_error) {
    console.log("✅ Correctly detected unavailable URL error");
  }

  // Test with different models (if available)
  try {
    console.log("\nTesting with different model (if available):");
    console.log("Using mistral model...");
    const result = await isPasswordSecure("ComplexP@ssword123!", {
      model: "mistral",
      timeout: 20000,
    });

    console.log(`- Score: ${result.score}/100`);
    console.log(`- Rating: ${result.rating}`);
    console.log(`- Secure: ${result.isSecure ? "YES ✅" : "NO ❌"}`);
  } catch (_error) {
    console.log(
      "❌ Error with mistral model. Model might not be available in your Ollama installation.",
    );
  }
}

// Run tests
console.log("Starting tests... Make sure the Ollama server is running!");
runTests()
  .then(() => console.log("Tests completed!"))
  .catch((error) =>
    console.error(
      "Error running tests:",
      error instanceof Error ? error.message : String(error),
    ),
  );
