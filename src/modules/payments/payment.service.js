const Payment = require('./payment.model');
const Order = require('../orders/order.model');
const razorpayService = require('../../integrations/razorpay/razorpay.service');
const { errorMessages, successMessages } = require('../../messages');

class PaymentService {
  async createPayment(orderId, userId, paymentMethod) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(errorMessages.ORDER_NOT_FOUND);
    }

    if (order.user.toString() !== userId.toString()) {
      throw new Error(errorMessages.UNAUTHORIZED);
    }

    let razorpayOrder = null;
    if (paymentMethod === 'razorpay') {
      razorpayOrder = await razorpayService.createOrder({
        amount: order.total * 100, // Convert to paise
        currency: 'INR',
        receipt: order.orderNumber,
      });
    }

    const payment = await Payment.create({
      order: orderId,
      user: userId,
      amount: order.total,
      paymentMethod,
      razorpayOrderId: razorpayOrder?.id || null,
      status: paymentMethod === 'cod' ? 'completed' : 'pending',
    });

    if (paymentMethod === 'razorpay') {
      await Order.findByIdAndUpdate(orderId, {
        paymentId: payment._id,
      });
    }

    return {
      payment,
      razorpayOrder,
      message: successMessages.PAYMENT_INITIATED,
    };
  }

  async verifyPayment(paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error(errorMessages.PAYMENT_NOT_FOUND);
    }

    if (payment.status !== 'pending') {
      throw new Error(errorMessages.PAYMENT_ALREADY_PROCESSED);
    }

    const isValid = await razorpayService.verifyPayment(
      razorpayPaymentId,
      razorpayOrderId || payment.razorpayOrderId,
      razorpaySignature
    );

    if (!isValid) {
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'failed',
      });
      throw new Error(errorMessages.PAYMENT_FAILED);
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'completed',
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true }
    );

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: 'completed',
      status: 'confirmed',
    });

    return {
      payment: updatedPayment,
      message: successMessages.PAYMENT_SUCCESS,
    };
  }

  async getPaymentById(id) {
    const payment = await Payment.findById(id)
      .populate('order')
      .populate('user', 'name email');
    if (!payment) {
      throw new Error(errorMessages.PAYMENT_NOT_FOUND);
    }
    return payment;
  }
}

module.exports = new PaymentService();

