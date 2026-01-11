const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { authLimiter } = require("../../middlewares/rateLimiter.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
} = require("./user.validation");
const { USER_ROLES } = require("../../shared/constants/app.constants");

// Public routes
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  userController.register
);
router.post("/login", authLimiter, validate(loginSchema), userController.login);

// Protected routes
router.get("/profile", authenticate, userController.getProfile);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile
);
router.put(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  userController.changePassword
);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.getAllUsers
);
router.get(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.getUserById
);
router.put(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(updateUserSchema),
  userController.updateUser
);
router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.deleteUser
);

module.exports = router;
