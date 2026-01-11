const Category = require("./category.model");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");

class CategoryService {
  async createCategory(categoryData, userId) {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      throw new Error(errorMessages.CATEGORY_ALREADY_EXISTS);
    }

    const category = await Category.create({
      ...categoryData,
      slug,
      createdBy: userId,
    });

    return {
      category,
      message: successMessages.CATEGORY_CREATED,
    };
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);

    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  async getAllCategories(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = {
      ...filters,
      deletedAt: null,
    };

    const [categories, total] = await Promise.all([
      Category.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Category.countDocuments(query),
    ]);

    return {
      data: categories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateCategory(id, updateData) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    return {
      category,
      message: successMessages.CATEGORY_UPDATED,
    };
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    return {
      message: successMessages.CATEGORY_DELETED,
    };
  }
}

module.exports = new CategoryService();
