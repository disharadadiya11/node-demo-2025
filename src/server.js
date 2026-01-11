const app = require("./app");
const { env, connectDB, connectRedis } = require("./config");
const { startAllJobs } = require("./jobs");

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Connect to Redis (optional, continues if fails in development)
    // try {
    //   await connectRedis();
    // } catch (error) {
    //   if (env.NODE_ENV === "production") {
    //     throw error;
    //   }
    //   console.log("Redis connection failed, continuing without Redis");
    // }

    // Start background jobs
    startAllJobs();

    // Start server
    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      server.close(async () => {
        console.log("HTTP server closed");
        try {
          await require("./config").disconnectDB();
          await require("./config").disconnectRedis();
          process.exit(0);
        } catch (error) {
          console.log("Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
