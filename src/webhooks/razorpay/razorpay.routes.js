const express = require("express");
const router = express.Router();
const { handleRazorpayWebhook } = require("./razorpay.webhook");
const webhookMiddleware = require("../webhook.middleware");

// Razorpay webhook endpoint (no authentication, uses signature verification)
router.post("/razorpay", webhookMiddleware, handleRazorpayWebhook);

module.exports = router;
