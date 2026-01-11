const {
  getPaginationParams,
  getPaginationMeta,
} = require("../../shared/helpers/pagination");
const productService = require("./product.service");
const asyncHandler = require("../../shared/helpers/asyncHandler");
const { successResponse } = require("../../shared/response/apiResponse");

class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    const result = await productService.createProduct(req.body, req.user._id);
    successResponse(res, 201, result.message, result);
  });

  getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    successResponse(res, 200, "Product retrieved successfully", { product });
  });

  getAllProducts = asyncHandler(async (req, res) => {
    const pagination = getPaginationParams(req);
    const filters = {};

    if (req.query.category) filters.category = req.query.category;
    if (req.query.isActive !== undefined)
      filters.isActive = req.query.isActive === "true";
    if (req.query.isFeatured !== undefined)
      filters.isFeatured = req.query.isFeatured === "true";
    if (req.query.minPrice)
      filters.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) {
      filters.price = filters.price || {};
      filters.price.$lte = parseFloat(req.query.maxPrice);
    }

    const { data, total } = await productService.getAllProducts(
      filters,
      pagination
    );
    const meta = getPaginationMeta(pagination.page, pagination.limit, total);

    successResponse(res, 200, "Products retrieved successfully", {
      products: data,
      meta,
    });
  });

  updateProduct = asyncHandler(async (req, res) => {
    const result = await productService.updateProduct(req.params.id, req.body);
    successResponse(res, 200, result.message, result);
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    successResponse(res, 200, result.message);
  });
}

module.exports = new ProductController();
