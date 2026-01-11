const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const { protect } = require("../../routes/route.protection");
const validate = require("../../middlewares/validation/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("./category.validation");

// ==================== PUBLIC ROUTES ====================

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// ==================== ADMIN ROUTES ====================

router.post(
  "/",
  ...protect("ADMIN"),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  "/:id",
  ...protect("ADMIN"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete("/:id", ...protect("ADMIN"), categoryController.deleteCategory);

module.exports = router;
