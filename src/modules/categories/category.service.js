const categoryRepository = require("./category.repository");
const { errorMessages, successMessages } = require("../../shared/constants");

class CategoryService {
  async createCategory(categoryData, userId) {
    const existingCategory = await categoryRepository.findBySlug(
      categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );

    if (existingCategory) {
      throw new Error(errorMessages.CATEGORY_ALREADY_EXISTS);
    }

    const category = await categoryRepository.create({
      ...categoryData,
      createdBy: userId,
    });

    return {
      category,
      message: successMessages.CATEGORY_CREATED,
    };
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async getAllCategories(filters, pagination) {
    return await categoryRepository.findAll(filters, pagination);
  }

  async updateCategory(id, updateData) {
    const category = await categoryRepository.updateById(id, updateData);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }
    return {
      category,
      message: successMessages.CATEGORY_UPDATED,
    };
  }

  async deleteCategory(id) {
    const category = await categoryRepository.deleteById(id);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }
    return { message: successMessages.CATEGORY_DELETED };
  }
}

module.exports = new CategoryService();
