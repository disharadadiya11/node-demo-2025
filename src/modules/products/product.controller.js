const productService = require("./product.service");
const asyncHandler = require("../../shared/helpers/asyncHandler");

class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    const result = await productService.createProduct(req.body, req.user._id);
    return res.status(result.statusCode).json(result);
  });

  getProductById = asyncHandler(async (req, res) => {
    const result = await productService.getProductById(req.params.id);
    return res.status(result.statusCode).json(result);
  });

  getAllProducts = asyncHandler(async (req, res) => {
    // pass query only — service builds filters + pagination
    const result = await productService.getAllProducts(req.query);
    return res.status(result.statusCode).json(result);
  });

  updateProduct = asyncHandler(async (req, res) => {
    const result = await productService.updateProduct(req.params.id, req.body);
    return res.status(result.statusCode).json(result);
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    return res.status(result.statusCode).json(result);
  });
}

module.exports = new ProductController();
