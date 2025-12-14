const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/apiResponse');
const { getPaginationParams, getPaginationMeta } = require('../../utils/pagination');
const orderService = require('./order.service');

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const result = await orderService.createOrder(req.body, req.user._id);
    successResponse(res, 201, result.message, result);
  });

  getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
    successResponse(res, 200, 'Order retrieved successfully', { order });
  });

  getAllOrders = asyncHandler(async (req, res) => {
    const pagination = getPaginationParams(req);
    const filters = {};
    
    if (req.query.status) filters.status = req.query.status;
    if (req.query.paymentStatus) filters.paymentStatus = req.query.paymentStatus;

    const { data, total } = await orderService.getAllOrders(
      filters,
      pagination,
      req.user._id,
      req.user.role
    );
    const meta = getPaginationMeta(pagination.page, pagination.limit, total);

    successResponse(res, 200, 'Orders retrieved successfully', {
      orders: data,
      meta,
    });
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const result = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    successResponse(res, 200, result.message, result);
  });

  cancelOrder = asyncHandler(async (req, res) => {
    const result = await orderService.cancelOrder(req.params.id, req.user._id);
    successResponse(res, 200, result.message, result);
  });
}

module.exports = new OrderController();

