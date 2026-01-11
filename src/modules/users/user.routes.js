const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const { protect } = require("../../routes/route.protection");
const validate = require("../../middlewares/validation/validate.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
} = require("./user.validation");

// Public
router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

// Authenticated user
router.get("/profile", ...protect("USER"), controller.getProfile);

router.put(
  "/profile",
  ...protect("USER"),
  validate(updateProfileSchema),
  controller.updateProfile
);

router.put(
  "/change-password",
  ...protect("USER"),
  validate(changePasswordSchema),
  controller.changePassword
);

// Admin
router.get("/", ...protect("ADMIN"), controller.getAllUsers);

router.get("/:id", ...protect("ADMIN"), controller.getUserById);

router.put(
  "/:id",
  ...protect("ADMIN"),
  validate(updateUserSchema),
  controller.updateUser
);

router.delete("/:id", ...protect("ADMIN"), controller.deleteUser);

module.exports = router;
