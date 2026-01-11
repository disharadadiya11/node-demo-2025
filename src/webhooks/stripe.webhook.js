const stripeService = require("../integrations/stripe/stripe.service");
const { STRIPE_WEBHOOK_SECRET } = require("../config/env");
const Payment = require("../modules/payments/payment.model");
const Order = require("../modules/orders/order.model");

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event;

  try {
    // Verify webhook signature
    event = await stripeService.handleWebhookEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Stripe webhook verification error:", error);
    return res.status(400).json({ error: "Webhook verification failed" });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled Stripe webhook event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.log("Stripe webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

/**
 * Handle successful payment intent
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (payment && payment.status === "pending") {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "completed",
      stripePaymentIntentId: paymentIntent.id,
      transactionId: paymentIntent.id,
    });

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "completed",
      status: "confirmed",
    });

    console.log(`Payment succeeded: ${paymentIntent.id}`);
  }
};

/**
 * Handle failed payment intent
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (payment) {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "failed",
    });

    console.log(`Payment failed: ${paymentIntent.id}`);
  }
};

/**
 * Handle canceled payment intent
 */
const handlePaymentIntentCanceled = async (paymentIntent) => {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (payment) {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "failed",
    });

    console.log(`Payment canceled: ${paymentIntent.id}`);
  }
};

/**
 * Handle refunded charge
 */
const handleChargeRefunded = async (charge) => {
  const payment = await Payment.findOne({
    transactionId: charge.payment_intent,
  });

  if (payment) {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "refunded",
    });

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "refunded",
      status: "refunded",
    });

    console.log(`Payment refunded: ${charge.payment_intent}`);
  }
};

module.exports = {
  handleStripeWebhook,
};


