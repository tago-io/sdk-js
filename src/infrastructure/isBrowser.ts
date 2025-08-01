/**
 * Checks if the current runtime environment is a browser
 * Detects Node.js, Deno, and other non-browser environments
 * @returns True if running in a browser environment, false otherwise
 */
function checkIfItBrowser(): boolean {
  let isBrowser = true;

  if (typeof process === "object") {
    if (typeof process.versions === "object") {
      if (typeof process.versions.node !== "undefined") {
        isBrowser = false;
      }
    }
  }

  if (typeof window === "object") {
    // @ts-ignore
    if (typeof window.Deno === "object" && typeof window.document === "undefined") {
      isBrowser = false;
    }
  }

  return isBrowser;
}

export default checkIfItBrowser;
