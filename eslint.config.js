// @ts-check

const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");

module.exports = [
  // Ignore directories
  {
    ignores: ["examples/**", "lib/**", "docs/**", "node_modules/**"],
  },

  // For TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettier,
    },
    rules: {
      // Disable unused variables check for test files and certain patterns
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Make 'any' type a warning instead of error, since it's commonly used in SDKs
      "@typescript-eslint/no-explicit-any": "warn",
      "prettier/prettier": "error",
    },
  },

  // More lenient rules for test files
  {
    files: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.local.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // For JavaScript files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: {
      prettier: prettier,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "prettier/prettier": "error",
    },
  },
];
