const express = require("express");
const router = express.Router();

const controller = require("./product.controller");
const validate = require("../../middlewares/validation/validate.middleware");
const { protect } = require("../../routes/route.protection");

const {
  createProductSchema,
  updateProductSchema,
} = require("./product.validation");

// Public
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);

// Protected
router.post(
  "/",
  ...protect("PRODUCT_WRITE"),
  validate(createProductSchema),
  controller.createProduct
);

router.put(
  "/:id",
  ...protect("PRODUCT_WRITE"),
  validate(updateProductSchema),
  controller.updateProduct
);

router.delete("/:id", ...protect("ADMIN"), controller.deleteProduct);

module.exports = router;
