// const express = require('express');
// const router = express.Router();
// const paymentService = require('./payment.service');
// const authenticate = require('../../middlewares/auth.middleware');
// const asyncHandler = require('../../utils/asyncHandler');
// const { successResponse } = require('../../utils/apiResponse');

// // Create payment
// router.post(
//   '/create',
//   authenticate,
//   asyncHandler(async (req, res) => {
//     const { orderId, paymentMethod } = req.body;
//     const result = await paymentService.createPayment(
//       orderId,
//       req.user._id,
//       paymentMethod
//     );
//     successResponse(res, 201, result.message, result);
//   })
// );

// // Verify payment
// router.post(
//   '/verify',
//   authenticate,
//   asyncHandler(async (req, res) => {
//     const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
//     const result = await paymentService.verifyPayment(
//       paymentId,
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature
//     );
//     successResponse(res, 200, result.message, result);
//   })
// );

// // Get payment by ID
// router.get(
//   '/:id',
//   authenticate,
//   asyncHandler(async (req, res) => {
//     const payment = await paymentService.getPaymentById(req.params.id);
//     successResponse(res, 200, 'Payment retrieved successfully', { payment });
//   })
// );

// module.exports = router;
