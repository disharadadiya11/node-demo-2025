const Category = require('./category.model');

class CategoryRepository {
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  async findById(id) {
    return await Category.findById(id).populate('createdBy', 'name email');
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug, isActive: true });
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const query = Category.find(filters);

    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }).populate('createdBy', 'name email'),
      Category.countDocuments(filters),
    ]);

    return { data, total, page, limit };
  }

  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryRepository();

