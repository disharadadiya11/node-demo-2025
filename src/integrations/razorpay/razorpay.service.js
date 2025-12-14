const razorpayClient = require("./razorpay.client");
const { verifyPaymentSignature } = require("./razorpay.utils");

class RazorpayService {
  async createOrder(orderData) {
    try {
      const order = await razorpayClient.orders.create(orderData);
      return order;
    } catch (error) {
      console.log("Razorpay order creation failed:", error);
      throw new Error("Failed to create Razorpay order");
    }
  }

  async getOrder(orderId) {
    try {
      const order = await razorpayClient.orders.fetch(orderId);
      return order;
    } catch (error) {
      console.log("Razorpay order fetch failed:", error);
      throw new Error("Failed to fetch Razorpay order");
    }
  }

  async getPayment(paymentId) {
    try {
      const payment = await razorpayClient.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.log("Razorpay payment fetch failed:", error);
      throw new Error("Failed to fetch Razorpay payment");
    }
  }

  async verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature) {
    try {
      const isValid = verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
      return isValid;
    } catch (error) {
      console.log("Razorpay payment verification failed:", error);
      return false;
    }
  }

  async refund(paymentId, amount) {
    try {
      const refund = await razorpayClient.payments.refund(paymentId, {
        amount: amount * 100, // Convert to paise
      });
      return refund;
    } catch (error) {
      console.log("Razorpay refund failed:", error);
      throw new Error("Failed to process refund");
    }
  }
}

module.exports = new RazorpayService();
