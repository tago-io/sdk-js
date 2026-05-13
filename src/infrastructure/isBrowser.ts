/**
 * Checks if the current runtime environment is a browser or browser-like environment.
 * Detects Node.js, Deno, and other non-browser environments.
 * React Native/Expo is treated as a browser-like environment.
 * @returns True if running in a browser or browser-like environment (including React Native/Expo), false otherwise
 */
function checkIfItBrowser(): boolean {
  // Check for React Native/Expo first - treat as browser-like environment
  if (typeof navigator !== "undefined" && (navigator as { product?: string }).product === "ReactNative") {
    return true;
  }

  // Check for Node.js
  if (typeof process === "object" && process !== null) {
    if (typeof process.versions === "object" && process.versions !== null) {
      if (typeof process.versions.node !== "undefined") {
        return false;
      }
    }
  }

  // Check for Deno
  if (typeof window === "object" && window !== null) {
    // @ts-expect-error - Deno is not in standard TypeScript definitions
    if (typeof window.Deno === "object" && typeof window.document === "undefined") {
      return false;
    }
  }

  // Check for Bun
  // @ts-expect-error - Bun is not in standard TypeScript definitions
  if (typeof Bun !== "undefined") {
    return false;
  }

  return true;
}

export default checkIfItBrowser;
