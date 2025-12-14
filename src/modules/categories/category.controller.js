const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/apiResponse");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../../utils/pagination");
const categoryService = require("./category.service");

class CategoryController {
  createCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.createCategory(req.body, req.user._id);
    successResponse(res, 201, result.message, result);
  });

  getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    successResponse(res, 200, "Category retrieved successfully", { category });
  });

  getAllCategories = asyncHandler(async (req, res) => {
    const pagination = getPaginationParams(req);
    const filters = {};

    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === "true";
    }

    const { data, total } = await categoryService.getAllCategories(
      filters,
      pagination
    );
    const meta = getPaginationMeta(pagination.page, pagination.limit, total);

    successResponse(res, 200, "Categories retrieved successfully", {
      categories: data,
      meta,
    });
  });

  updateCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    successResponse(res, 200, result.message, result);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    successResponse(res, 200, result.message);
  });
}

module.exports = new CategoryController();
