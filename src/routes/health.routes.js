const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/database");
const { getRedisClient } = require("../config/redis");
const { successResponse } = require("../shared/response/apiResponse");

router.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: "unknown",
      redis: "unknown",
    },
  };

  try {
    // Check database
    await connectDB();
    health.services.database = "connected";
  } catch (error) {
    health.services.database = "disconnected";
    health.status = "degraded";
  }

  try {
    // Check redis
    const redisClient = getRedisClient();
    if (redisClient) {
      await redisClient.ping();
      health.services.redis = "connected";
    } else {
      health.services.redis = "not configured";
    }
  } catch (error) {
    health.services.redis = "disconnected";
    health.status = "degraded";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  successResponse(res, statusCode, "Health check completed", health);
});

module.exports = router;
