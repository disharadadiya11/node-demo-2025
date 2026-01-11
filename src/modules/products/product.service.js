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
    // Verify category exists
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

    return buildSuccess(StatusCodes.OK, successMessages.PRODUCT_CREATED, {
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

    /* ---------- db ---------- */
    const [products, total] = await Promise.all([
      Product.find(filters)
        .populate("category", "_id name")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Product.countDocuments(filters),
    ]);

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.PRODUCTS_RETRIEVED,
      data: {
        products,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /* ==================== UPDATE ==================== */

  async updateProduct(id, updateData) {
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return {
          statusCode: StatusCodes.NOT_FOUND,
          success: false,
          message: errorMessages.CATEGORY_NOT_FOUND,
        };
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.PRODUCT_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.PRODUCT_UPDATED,
      data: { product },
    };
  }

  /* ==================== DELETE ==================== */

  async deleteProduct(id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.PRODUCT_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.PRODUCT_DELETED,
    };
  }

  /* ==================== STOCK ==================== */

  async checkStock(productId, quantity) {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.PRODUCT_NOT_FOUND,
      };
    }

    if (product.stock < quantity) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: errorMessages.INSUFFICIENT_STOCK,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.STOCK_AVAILABLE,
      data: { product },
    };
  }

  async updateStock(productId, quantity) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.PRODUCT_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.STOCK_UPDATED,
      data: { product },
    };
  }
}

module.exports = new ProductService();
