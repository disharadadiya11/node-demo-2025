const stripeClient = require("./stripe.client");

class StripeService {
  /**
   * Create a payment intent
   * @param {Object} paymentData - Payment data
   * @param {Number} paymentData.amount - Amount in smallest currency unit (e.g., cents for USD, paise for INR)
   * @param {String} paymentData.currency - Currency code (e.g., 'usd', 'inr')
   * @param {String} paymentData.paymentMethodId - Stripe payment method ID
   * @param {String} paymentData.customerId - Stripe customer ID (optional)
   * @param {Object} paymentData.metadata - Additional metadata (optional)
   * @returns {Promise<Object>} Stripe PaymentIntent object
   */
  async createPaymentIntent(paymentData) {
    try {
      const { amount, currency, paymentMethodId, customerId, metadata } =
        paymentData;

      const paymentIntentData = {
        amount,
        currency: currency || "usd",
        payment_method: paymentMethodId,
        confirm: false,
        ...(customerId && { customer: customerId }),
        ...(metadata && { metadata }),
      };

      const paymentIntent = await stripeClient.paymentIntents.create(
        paymentIntentData
      );

      return paymentIntent;
    } catch (error) {
      console.log("Stripe payment intent creation failed:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  /**
   * Confirm a payment intent
   * @param {String} paymentIntentId - Stripe payment intent ID
   * @param {String} paymentMethodId - Stripe payment method ID (optional)
   * @returns {Promise<Object>} Confirmed PaymentIntent object
   */
  async confirmPayment(paymentIntentId, paymentMethodId = null) {
    try {
      const confirmData = paymentMethodId
        ? { payment_method: paymentMethodId }
        : {};

      const paymentIntent = await stripeClient.paymentIntents.confirm(
        paymentIntentId,
        confirmData
      );

      return paymentIntent;
    } catch (error) {
      console.log("Stripe payment confirmation failed:", error);
      throw new Error("Failed to confirm payment");
    }
  }

  /**
   * Retrieve a payment intent
   * @param {String} paymentIntentId - Stripe payment intent ID
   * @returns {Promise<Object>} PaymentIntent object
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripeClient.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error) {
      console.log("Stripe payment intent retrieval failed:", error);
      throw new Error("Failed to retrieve payment intent");
    }
  }

  /**
   * Handle webhook event
   * @param {String} payload - Raw webhook payload
   * @param {String} signature - Stripe webhook signature
   * @param {String} webhookSecret - Webhook secret for verification
   * @returns {Promise<Object>} Parsed webhook event
   */
  async handleWebhookEvent(payload, signature, webhookSecret) {
    try {
      const event = stripeClient.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      return event;
    } catch (error) {
      console.log("Stripe webhook verification failed:", error);
      throw new Error("Invalid webhook signature");
    }
  }

  /**
   * Create a refund
   * @param {String} paymentIntentId - Stripe payment intent ID
   * @param {Number} amount - Refund amount in smallest currency unit (optional, full refund if not provided)
   * @returns {Promise<Object>} Refund object
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        ...(amount && { amount }),
      };

      const refund = await stripeClient.refunds.create(refundData);
      return refund;
    } catch (error) {
      console.log("Stripe refund creation failed:", error);
      throw new Error("Failed to create refund");
    }
  }
}

module.exports = new StripeService();


