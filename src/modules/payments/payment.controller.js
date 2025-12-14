const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/apiResponse");
const paymentService = require("./payment.service");

class PaymentController {
  createPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentMethod } = req.body;
    const result = await paymentService.createPayment(
      orderId,
      req.user._id,
      paymentMethod
    );
    successResponse(res, 201, result.message, result);
  });

  verifyPayment = asyncHandler(async (req, res) => {
    const {
      paymentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;
    const result = await paymentService.verifyPayment(
      paymentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    );
    successResponse(res, 200, result.message, result);
  });

  getPaymentById = asyncHandler(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id);
    successResponse(res, 200, "Payment retrieved successfully", { payment });
  });
}

module.exports = new PaymentController();

