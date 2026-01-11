const express = require("express");
const router = express.Router();
const apiRoutes = require("./api.routes");
const healthRoutes = require("./health.routes");

/**
 * Health check
 * Example: GET /health
 */
router.use("/", healthRoutes);

/**
 * Application APIs
 * Example: /api/users, /api/products, etc.
 */
router.use("/api", apiRoutes);

module.exports = router;
