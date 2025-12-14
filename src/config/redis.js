const redis = require("redis");
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, NODE_ENV } = require("./env");

let client = null;

const createRedisClient = () => {
  const config = {
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    ...(REDIS_PASSWORD && { password: REDIS_PASSWORD }),
  };

  return redis.createClient(config);
};

const connectRedis = async () => {
  try {
    if (client) {
      return client;
    }

    client = createRedisClient();

    client.on("connect", () => {
      console.log("Redis client connected");
    });

    client.on("error", (err) => {
      console.log(`Redis client error: ${err.message}`);
    });

    client.on("end", () => {
      console.log("Redis client connection ended");
    });

    await client.connect();

    return client;
  } catch (error) {
    console.log(`Redis connection failed: ${error.message}`);
    if (NODE_ENV === "development") {
      console.log("Continuing without Redis in development mode");
      return null;
    }
    throw error;
  }
};

const getRedisClient = () => {
  if (!client) {
    if (NODE_ENV === "development") {
      console.log("Redis client not initialized, returning null");
      return null;
    }
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }
  return client;
};

const disconnectRedis = async () => {
  try {
    if (client) {
      await client.quit();
      client = null;
      console.log("Redis disconnected");
    }
  } catch (error) {
    console.log(`Error disconnecting Redis: ${error.message}`);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis,
};
