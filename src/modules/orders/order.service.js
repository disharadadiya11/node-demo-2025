const orderRepository = require('./order.repository');
const productService = require('../products/product.service');
const { ORDER_STATUS } = require('./order.constants');
const { canCancel, canRefund } = require('./order.tracking');
const { errorMessages, successMessages } = require('../../messages');

class OrderService {
  async createOrder(orderData, userId) {
    // Validate products and stock
    const items = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const product = await productService.checkStock(item.product, item.quantity);
      items.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
      subtotal += product.price * item.quantity;
    }

    const tax = subtotal * 0.18; // 18% GST
    const shipping = orderData.shipping || 0;
    const total = subtotal + tax + shipping;

    // Create order
    const order = await orderRepository.create({
      user: userId,
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
    });

    // Update stock
    for (const item of items) {
      await productService.updateStock(item.product, item.quantity);
    }

    return {
      order,
      message: successMessages.ORDER_CREATED,
    };
  }

  async getOrderById(id, userId, userRole) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error(errorMessages.ORDER_NOT_FOUND);
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== userId.toString() && userRole !== 'admin') {
      throw new Error(errorMessages.UNAUTHORIZED);
    }

    return order;
  }

  async getAllOrders(filters, pagination, userId, userRole) {
    if (userRole !== 'admin') {
      filters.user = userId;
    }
    return await orderRepository.findAll(filters, pagination);
  }

  async updateOrderStatus(id, status) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error(errorMessages.ORDER_NOT_FOUND);
    }

    if (status === ORDER_STATUS.CANCELLED && !canCancel(order.status)) {
      throw new Error(errorMessages.ORDER_CANNOT_BE_CANCELLED);
    }

    const updatedOrder = await orderRepository.updateById(id, { status });
    return {
      order: updatedOrder,
      message: successMessages.ORDER_UPDATED,
    };
  }

  async cancelOrder(id, userId) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error(errorMessages.ORDER_NOT_FOUND);
    }

    if (order.user._id.toString() !== userId.toString()) {
      throw new Error(errorMessages.UNAUTHORIZED);
    }

    if (!canCancel(order.status)) {
      throw new Error(errorMessages.ORDER_CANNOT_BE_CANCELLED);
    }

    const updatedOrder = await orderRepository.updateById(id, {
      status: ORDER_STATUS.CANCELLED,
    });

    return {
      order: updatedOrder,
      message: successMessages.ORDER_CANCELLED,
    };
  }
}

module.exports = new OrderService();

