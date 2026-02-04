/**
 * Safely get environment variable value
 * @internal
 */
function getEnvVar(name: string): string | undefined {
  try {
    if (typeof process !== "undefined" && typeof process.env !== "undefined") {
      return process.env[name];
    }
  } catch {
    // Ignore errors in environments where process.env access fails
  }
  return undefined;
}

/**
 * Default configuration for SDK
 * @internal
 */
const config = {
  requestAttempts: (Number(getEnvVar("TAGOIO_REQUEST_ATTEMPTS")) || 5) as number,
  requestTimeout: 60000,
  socketOpts: {
    reconnectionDelay: 10000,
    reconnection: true,
    transports: ["websocket"] as const,
  },
};

export default config;
