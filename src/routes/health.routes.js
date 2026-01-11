const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/database");
const { getRedisClient } = require("../config/redis");

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
    await connectDB();
    health.services.database = "up";
  } catch {
    health.services.database = "down";
  }

  // try {
  //   const redis = getRedisClient();
  //   await redis.ping();
  //   health.services.redis = "up";
  // } catch {
  //   health.services.redis = "down";
  // }

  res.status(200).json(health);
});

module.exports = router;
