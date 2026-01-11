const { FRONTEND_URL, NODE_ENV } = require("./env");

/**
 * Allowed frontend origins
 * Add more here or via env when needed
 */
const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean); // removes undefined/null

const corsOptions = {
  /**
   * Origin validation
   */
  origin(origin, callback) {
    // Allow requests with no origin
    // (mobile apps, server-to-server, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Allow known frontends
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Block everything else (silent fail – browser friendly)
    return callback(null, false);
  },

  /**
   * Cookies / Authorization headers
   */
  credentials: true,

  /**
   * Allowed HTTP methods
   */
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  /**
   * Allowed request headers
   */
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

  /**
   * Success status for legacy browsers
   */
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
