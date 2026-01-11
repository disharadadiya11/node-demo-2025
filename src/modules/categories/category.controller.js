const asyncHandler = require("../../shared/helpers/asyncHandler");
const categoryService = require("./category.service");

class CategoryController {
  createCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.createCategory(req.body, req.user._id);
    return res.status(result.statusCode).json(result);
  });

  getCategoryById = asyncHandler(async (req, res) => {
    const result = await categoryService.getCategoryById(req.params.id);
    return res.status(result.statusCode).json(result);
  });

  getAllCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getAllCategories(req.query);
    return res.status(result.statusCode).json(result);
  });

  updateCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    return res.status(result.statusCode).json(result);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    return res.status(result.statusCode).json(result);
  });
}

module.exports = new CategoryController();
