/**
 * Default configuration for SDK
 * @internal
 */
const config = {
  requestAttempts: (Number(process.env.TAGOIO_REQUEST_ATTEMPTS) || 5) as number,
  requestTimeout: 60000,
  socketOpts: {
    reconnectionDelay: 10000,
    reconnection: true,
    transports: ["websocket"] as const,
  },
};

/**
 * Base URL for TagoIO public snippets repository
 */
export const SNIPPETS_BASE_URL: string = "https://snippets.tago.io";

export default config;
