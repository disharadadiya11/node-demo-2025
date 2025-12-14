const express = require("express");
const router = express.Router();

// Health check
const healthRoutes = require("./health.routes");
router.use("/", healthRoutes);

// Module routes
const userRoutes = require("../modules/users/user.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const productRoutes = require("../modules/products/product.routes");
const orderRoutes = require("../modules/orders/order.routes");
const paymentRoutes = require("../modules/payments/payment.routes");

// Webhook routes
const webhookRoutes = require("../webhooks/razorpay/razorpay.routes");

router.use("/api/users", userRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/products", productRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/payments", paymentRoutes);
router.use("/webhooks", webhookRoutes);

module.exports = router;
