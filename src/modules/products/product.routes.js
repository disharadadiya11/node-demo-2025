const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("./product.validation");
const { USER_ROLES } = require("../../shared/constants/app.constants");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes (Admin/Seller only)
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  validate(createProductSchema),
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  productController.deleteProduct
);

module.exports = router;
