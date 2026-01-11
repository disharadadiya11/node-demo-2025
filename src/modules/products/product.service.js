const Product = require("./product.model");
const Category = require("../categories/category.model");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");

class ProductService {
  async createProduct(productData, userId) {
    // Verify category exists
    const category = await Category.findById(productData.category);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    const product = await Product.create({
      ...productData,
      createdBy: userId,
    });

    return {
      product,
      message: successMessages.PRODUCT_CREATED,
    };
  }

  async getProductById(id) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async getAllProducts(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = {
      ...filters,
      deletedAt: null,
    };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "_id name")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Product.countDocuments(query),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProduct(id, updateData) {
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        throw new Error(errorMessages.CATEGORY_NOT_FOUND);
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }

    return {
      product,
      message: successMessages.PRODUCT_UPDATED,
    };
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }

    return {
      message: successMessages.PRODUCT_DELETED,
    };
  }

  async checkStock(productId, quantity) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }

    if (product.stock < quantity) {
      throw new Error(errorMessages.INSUFFICIENT_STOCK);
    }

    return product;
  }

  async updateStock(productId, quantity) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}

module.exports = new ProductService();
