const express = require("express");
const router = express.Router();
const { routeDefinitions } = require("./route.registry");
const { loadRoutes } = require("./route.loader");

// Health check (kept as separate route file for backward compatibility)
const healthRoutes = require("./health.routes");
router.use("/", healthRoutes);

// Webhook routes (kept as separate route files - webhooks have special handling)
const webhookRoutes = require("../webhooks/razorpay/razorpay.routes");
const { handleStripeWebhook } = require("../webhooks/stripe.webhook");

// Stripe webhook (raw body is parsed in app.js middleware)
router.post("/webhooks/stripe", handleStripeWebhook);

// Razorpay webhook routes
router.use("/webhooks", webhookRoutes);

// Load all routes from registry (centralized route system)
// All module routes (users, categories, products, orders, payments) are defined in route.registry.js
loadRoutes(router, routeDefinitions);

module.exports = router;
