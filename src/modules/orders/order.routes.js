const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const { USER_ROLES } = require('../../utils/constants');

// Protected routes
router.post('/', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

// Admin routes
router.put(
  '/:id/status',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  orderController.updateOrderStatus
);

module.exports = router;

