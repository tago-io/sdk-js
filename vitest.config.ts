import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)", "**/__tests__/**/*.[jt]s?(x)"],
    exclude: [
      "**/node_modules/**",
      "**/.{git,cache,output,temp}/**",
      "**/{vite,vitest,eslint,prettier}.config.*",
      "**/__mocks__/**/*",
    ],
  },
});
