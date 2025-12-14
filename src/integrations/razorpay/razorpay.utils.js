const crypto = require('crypto');
const { RAZORPAY_WEBHOOK_SECRET } = require('../../config/env');

const verifyWebhookSignature = (webhookBody, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(webhookBody))
    .digest('hex');

  return expectedSignature === signature;
};

const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const text = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(text)
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

module.exports = {
  verifyWebhookSignature,
  verifyPaymentSignature,
};

