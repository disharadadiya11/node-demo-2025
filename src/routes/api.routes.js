const express = require("express");
const router = express.Router();

// Mount module routes
router.use("/users", require("../modules/users/user.routes"));
router.use("/products", require("../modules/products/product.routes"));
// router.use("/payments", require("../modules/payments/payment.routes"));
router.use("/categories", require("../modules/categories/category.routes"));

module.exports = router;
