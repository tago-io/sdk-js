/**
 * Default configuration for SDK
 * @internal
 */
const config = {
  requestAttempts: Number(process.env.TAGOIO_REQUEST_ATTEMPTS) || 5,
  requestTimeout: 60000,
  socketOpts: {
    reconnectionDelay: 10000,
    reconnection: true,
    transports: ["websocket"],
  },
};

export default config;
