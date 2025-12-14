const {
  verifyWebhookSignature,
} = require("../../integrations/razorpay/razorpay.utils");
const Payment = require("../../modules/payments/payment.model");
const Order = require("../../modules/orders/order.model");

const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookBody = req.body;

    // Verify webhook signature
    const isValid = verifyWebhookSignature(webhookBody, signature);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = webhookBody.event;
    const payload = webhookBody.payload;

    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(payload);
        break;
      case "payment.failed":
        await handlePaymentFailed(payload);
        break;
      case "order.paid":
        await handleOrderPaid(payload);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.log("Razorpay webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

const handlePaymentCaptured = async (payload) => {
  const paymentEntity = payload.payment.entity;
  const payment = await Payment.findOne({
    razorpayPaymentId: paymentEntity.id,
  });

  if (payment && payment.status === "pending") {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "completed",
      razorpayPaymentId: paymentEntity.id,
      transactionId: paymentEntity.id,
    });

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "completed",
      status: "confirmed",
    });

    console.log(`Payment captured: ${paymentEntity.id}`);
  }
};

const handlePaymentFailed = async (payload) => {
  const paymentEntity = payload.payment.entity;
  const payment = await Payment.findOne({
    razorpayPaymentId: paymentEntity.id,
  });

  if (payment) {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "failed",
    });

    console.log(`Payment failed: ${paymentEntity.id}`);
  }
};

const handleOrderPaid = async (payload) => {
  const orderEntity = payload.order.entity;
  console.log(`Order paid: ${orderEntity.id}`);
};

module.exports = {
  handleRazorpayWebhook,
};
