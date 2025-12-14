const Order = require('./order.model');

class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async findById(id) {
    return await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug price images');
  }

  async findByOrderNumber(orderNumber) {
    return await Order.findOne({ orderNumber })
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug price images');
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const query = Order.find(filters);

    const [data, total] = await Promise.all([
      query
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('user', 'name email phone')
        .populate('items.product', 'name slug price images'),
      Order.countDocuments(filters),
    ]);

    return { data, total, page, limit };
  }

  async updateById(id, updateData) {
    return await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug price images');
  }

  async deleteById(id) {
    return await Order.findByIdAndDelete(id);
  }
}

module.exports = new OrderRepository();

