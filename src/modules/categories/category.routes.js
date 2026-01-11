const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("./category.validation");
const { USER_ROLES } = require("../../shared/constants/app.constants");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected routes (Admin only)
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.put(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  categoryController.deleteCategory
);

module.exports = router;
