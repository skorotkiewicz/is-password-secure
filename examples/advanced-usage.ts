import isPasswordSecure, { type PasswordSecurityOptions } from "../src";
import readline from "node:readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Advanced example with configuration and interactive input
async function advancedExample() {
  console.log("🔒 Advanced example of is-password-secure usage 🔒\n");

  // Configuration options
  const config: PasswordSecurityOptions = {
    ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama2",
    timeout: 15000,
  };

  console.log("Configuration:");
  console.log(`- Ollama API URL: ${config.ollamaUrl}`);
  console.log(`- Model: ${config.model}`);
  console.log(`- Timeout: ${config.timeout}ms\n`);

  // Function to check password security
  async function checkPasswordSecurity(password: string) {
    try {
      console.log("\nAnalyzing password...");
      const result = await isPasswordSecure(password, config);

      // Display result as a chart
      const barLength = 30;
      const filledLength = Math.round((result.score / 100) * barLength);
      const bar =
        "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

      console.log("\n📊 Security analysis result:");
      console.log(`\nPassword strength: [${bar}] ${result.score}/100`);
      console.log(`Security level: ${result.rating.toUpperCase()}`);
      console.log(`Secure: ${result.isSecure ? "✅ YES" : "❌ NO"}`);
      console.log(`\nSuggestions: ${result.feedback}`);

      // Display detailed interpretation
      console.log("\n📋 Interpretation:");
      if (result.score < 20) {
        console.log("This password could be cracked within seconds.");
      } else if (result.score < 40) {
        console.log("This password could be cracked within minutes or hours.");
      } else if (result.score < 60) {
        console.log(
          "This password takes more time to crack but is still not secure enough.",
        );
      } else if (result.score < 80) {
        console.log(
          "This password is difficult to crack but can still be improved.",
        );
      } else {
        console.log(
          "This password is very difficult to crack and provides a high level of security.",
        );
      }
    } catch (error) {
      console.error(
        `\n❌ Error during password analysis: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Ask if the user wants to check another password
    rl.question(
      "\nDo you want to check another password? (yes/no): ",
      (answer) => {
        if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
          promptForPassword();
        } else {
          console.log("\nThank you for using our tool!");
          rl.close();
        }
      },
    );
  }

  // Function to get password from user
  function promptForPassword() {
    rl.question("\nEnter password to check: ", (password) => {
      // Check if password is not empty
      if (!password.trim()) {
        console.log("\n⚠️ Password cannot be empty. Please try again.");
        promptForPassword();
        return;
      }

      checkPasswordSecurity(password);
    });
  }

  // Start the process
  console.log(
    "This example allows interactive checking of password security.\n",
  );

  // Ask user to select a model
  console.log("Available models (depending on your Ollama installation):");
  console.log("1. llama2 (default)");
  console.log("2. mistral");
  console.log("3. llama3.2");
  console.log("4. phi");
  console.log("5. codellama");
  console.log("6. other (specify)");

  rl.question(
    "\nSelect model number or press Enter for default: ",
    (modelChoice) => {
      switch (modelChoice.trim()) {
        case "1":
          config.model = "llama2";
          break;
        case "2":
          config.model = "mistral";
          break;
        case "3":
          config.model = "llama3.2";
          break;
        case "4":
          config.model = "phi";
          break;
        case "5":
          config.model = "codellama";
          break;
        case "6":
          rl.question("Enter model name: ", (customModel) => {
            config.model = customModel.trim() || "llama2";
            console.log(`\nUsing model: ${config.model}`);
            promptForPassword();
          });
          return;
        default:
          config.model = "llama2";
      }

      console.log(`\nUsing model: ${config.model}`);
      promptForPassword();
    },
  );
}

// Run the advanced example
advancedExample();
