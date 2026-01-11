const Category = require("./category.model");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");
const { StatusCodes } = require("http-status-codes");

class CategoryService {
  /* ==================== CREATE ==================== */
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
      statusCode: StatusCodes.CREATED,
      success: true,
      message: successMessages.CATEGORY_CREATED,
      data: { category },
    };
  }

  /* ==================== GET BY ID ==================== */
  async getCategoryById(id) {
    const category = await Category.findById(id);

    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.CATEGORY_RETRIEVED,
      data: { category },
    };
  }

  /* ==================== GET ALL ==================== */
  async getAllCategories(query = {}) {
    const { page = 1, limit = 10, isActive } = query;

    const skip = (page - 1) * limit;

    const filters = {
      deletedAt: null,
    };

    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }

    const [categories, total] = await Promise.all([
      Category.find(filters)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),

      Category.countDocuments(filters),
    ]);

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.CATEGORIES_RETRIEVED,
      data: {
        categories,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /* ==================== UPDATE ==================== */
  async updateCategory(id, updateData) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.CATEGORY_UPDATED,
      data: { category },
    };
  }

  /* ==================== DELETE ==================== */
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
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.CATEGORY_DELETED,
    };
  }
}

module.exports = new CategoryService();
