const Product = require('./product.model');

class ProductRepository {
  async create(productData) {
    return await Product.create(productData);
  }

  async findById(id) {
    return await Product.findById(id)
      .populate('category', 'name slug')
      .populate('createdBy', 'name email');
  }

  async findBySlug(slug) {
    return await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .populate('createdBy', 'name email');
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const query = Product.find(filters);

    const [data, total] = await Promise.all([
      query
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('category', 'name slug')
        .populate('createdBy', 'name email'),
      Product.countDocuments(filters),
    ]);

    return { data, total, page, limit };
  }

  async updateById(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug')
      .populate('createdBy', 'name email');
  }

  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  }

  async updateStock(id, quantity) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }
}

module.exports = new ProductRepository();

