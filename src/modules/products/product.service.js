const Product = require("./product.model");
const Category = require("../categories/category.model");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");
const { StatusCodes } = require("http-status-codes");
const {
  buildSuccess,
  buildError,
} = require("../../shared/response/apiResponse");

class ProductService {
  /* ==================== CREATE ==================== */

  async createProduct(productData, userId) {
    const category = await Category.findById(productData.category);
    if (!category) {
      return buildError(
        StatusCodes.NOT_FOUND,
        errorMessages.CATEGORY_NOT_FOUND
      );
    }

    const product = await Product.create({
      ...productData,
      createdBy: userId,
    });

    return buildSuccess(StatusCodes.CREATED, successMessages.PRODUCT_CREATED, {
      product,
    });
  }

  /* ==================== READ ==================== */

  async getProductById(id) {
    const product = await Product.findById(id).populate("category", "_id name");

    if (!product) {
      return buildError(StatusCodes.NOT_FOUND, errorMessages.PRODUCT_NOT_FOUND);
    }

    return buildSuccess(StatusCodes.OK, successMessages.PRODUCT_RETRIEVED, {
      product,
    });
  }

  async getAllProducts(query = {}) {
    /* ---------- filters ---------- */
    const filters = { deletedAt: null };

    if (query.category) filters.category = query.category;
    if (query.isActive !== undefined)
      filters.isActive = query.isActive === "true";
    if (query.isFeatured !== undefined)
      filters.isFeatured = query.isFeatured === "true";

    if (query.minPrice || query.maxPrice) {
      filters.price = {};
      if (query.minPrice) filters.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
    }

    /* ---------- pagination ---------- */
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filters)
        .populate("category", "_id name")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Product.countDocuments(filters),
    ]);

    return buildSuccess(StatusCodes.OK, successMessages.PRODUCTS_RETRIEVED, {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  /* ==================== UPDATE ==================== */

  async updateProduct(id, updateData) {
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return buildError(
          StatusCodes.NOT_FOUND,
          errorMessages.CATEGORY_NOT_FOUND
        );
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return buildError(StatusCodes.NOT_FOUND, errorMessages.PRODUCT_NOT_FOUND);
    }

    return buildSuccess(StatusCodes.OK, successMessages.PRODUCT_UPDATED, {
      product,
    });
  }

  /* ==================== DELETE ==================== */

  async deleteProduct(id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return buildError(StatusCodes.NOT_FOUND, errorMessages.PRODUCT_NOT_FOUND);
    }

    return buildSuccess(StatusCodes.OK, successMessages.PRODUCT_DELETED);
  }

  /* ==================== STOCK ==================== */

  async checkStock(productId, quantity) {
    const product = await Product.findById(productId);

    if (!product) {
      return buildError(StatusCodes.NOT_FOUND, errorMessages.PRODUCT_NOT_FOUND);
    }

    if (product.stock < quantity) {
      return buildError(
        StatusCodes.BAD_REQUEST,
        errorMessages.INSUFFICIENT_STOCK
      );
    }

    return buildSuccess(StatusCodes.OK, successMessages.STOCK_AVAILABLE, {
      product,
    });
  }

  async updateStock(productId, quantity) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      return buildError(StatusCodes.NOT_FOUND, errorMessages.PRODUCT_NOT_FOUND);
    }

    return buildSuccess(StatusCodes.OK, successMessages.STOCK_UPDATED, {
      product,
    });
  }
}

module.exports = new ProductService();
