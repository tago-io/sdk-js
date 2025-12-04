/**
 * Default configuration for SDK
 * @internal
 */
const config = {
  requestAttempts: (Number(process.env.TAGOIO_REQUEST_ATTEMPTS) || 5) as number,
  requestTimeout: 60000,
  requestRetryDelays: [2000, 5000, 7000, 15000, 30000] as number[],
  socketOpts: {
    reconnectionDelay: 10000,
    reconnection: true,
    transports: ["websocket"] as const,
  },
};

export default config;
