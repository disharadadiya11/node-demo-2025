const productRepository = require('./product.repository');
const Category = require('../categories/category.model');
const { errorMessages, successMessages } = require('../../messages');

class ProductService {
  async createProduct(productData, userId) {
    // Verify category exists
    const category = await Category.findById(productData.category);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    const product = await productRepository.create({
      ...productData,
      createdBy: userId,
    });

    return {
      product,
      message: successMessages.PRODUCT_CREATED,
    };
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async getAllProducts(filters, pagination) {
    return await productRepository.findAll(filters, pagination);
  }

  async updateProduct(id, updateData) {
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        throw new Error(errorMessages.CATEGORY_NOT_FOUND);
      }
    }

    const product = await productRepository.updateById(id, updateData);
    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }
    return {
      product,
      message: successMessages.PRODUCT_UPDATED,
    };
  }

  async deleteProduct(id) {
    const product = await productRepository.deleteById(id);
    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }
    return { message: successMessages.PRODUCT_DELETED };
  }

  async checkStock(productId, quantity) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error(errorMessages.PRODUCT_NOT_FOUND);
    }
    if (product.stock < quantity) {
      throw new Error(errorMessages.INSUFFICIENT_STOCK);
    }
    return product;
  }

  async updateStock(productId, quantity) {
    return await productRepository.updateStock(productId, quantity);
  }
}

module.exports = new ProductService();

