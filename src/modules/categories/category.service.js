const Category = require("./category.model");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");
const { StatusCodes } = require("http-status-codes");
const {
  buildSuccess,
  buildError,
} = require("../../shared/response/apiResponse");

class CategoryService {
  /* ==================== CREATE ==================== */
  async createCategory(categoryData, userId) {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return buildError(
        StatusCodes.BAD_REQUEST,
        errorMessages.CATEGORY_ALREADY_EXISTS
      );
    }

    const category = await Category.create({
      ...categoryData,
      slug,
      createdBy: userId,
    });

    return buildSuccess(StatusCodes.CREATED, successMessages.CATEGORY_CREATED, {
      category,
    });
  }

  /* ==================== GET BY ID ==================== */
  async getCategoryById(id) {
    const category = await Category.findById(id);

    if (!category) {
      return buildError(
        StatusCodes.NOT_FOUND,
        errorMessages.CATEGORY_NOT_FOUND
      );
    }

    return buildSuccess(StatusCodes.OK, successMessages.CATEGORY_RETRIEVED, {
      category,
    });
  }

  /* ==================== GET ALL ==================== */
  async getAllCategories(query = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = { deletedAt: null };

    if (query.isActive !== undefined) {
      filters.isActive = query.isActive === "true";
    }

    const [categories, total] = await Promise.all([
      Category.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),

      Category.countDocuments(filters),
    ]);

    return buildSuccess(StatusCodes.OK, successMessages.CATEGORIES_RETRIEVED, {
      categories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  /* ==================== UPDATE ==================== */
  async updateCategory(id, updateData) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      return buildError(
        StatusCodes.NOT_FOUND,
        errorMessages.CATEGORY_NOT_FOUND
      );
    }

    return buildSuccess(StatusCodes.OK, successMessages.CATEGORY_UPDATED, {
      category,
    });
  }

  /* ==================== DELETE ==================== */
  async deleteCategory(id) {
    const category = await Category.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!category) {
      return buildError(
        StatusCodes.NOT_FOUND,
        errorMessages.CATEGORY_NOT_FOUND
      );
    }

    return buildSuccess(StatusCodes.OK, successMessages.CATEGORY_DELETED);
  }
}

module.exports = new CategoryService();
