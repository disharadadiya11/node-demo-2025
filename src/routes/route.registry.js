/**
 * Central Route Registry
 * Declarative API route definitions
 * 
 * Each route definition includes:
 * - method: HTTP method (get, post, put, delete, etc.)
 * - path: Route path (relative to base path)
 * - handler: Controller handler function
 * - auth: Boolean - require authentication
 * - roles: Array of allowed roles (optional, only used if auth=true)
 * - rateLimit: String - rate limiter key ('apiLimiter', 'authLimiter', 'strictLimiter')
 * - validation: Joi schema for request validation (optional)
 */

const userController = require("../modules/users/user.controller");
const categoryController = require("../modules/categories/category.controller");
const productController = require("../modules/products/product.controller");
const orderController = require("../modules/orders/order.controller");
const paymentController = require("../modules/payments/payment.controller");

const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
} = require("../modules/users/user.validation");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../modules/categories/category.validation");
const {
  createProductSchema,
  updateProductSchema,
} = require("../modules/products/product.validation");

const { USER_ROLES } = require("../utils/constants");

const routeDefinitions = [
  // ==================== USER ROUTES ====================
  {
    method: "post",
    path: "/api/users/register",
    handler: userController.register,
    auth: false,
    rateLimit: "authLimiter",
    validation: registerSchema,
  },
  {
    method: "post",
    path: "/api/users/login",
    handler: userController.login,
    auth: false,
    rateLimit: "authLimiter",
    validation: loginSchema,
  },
  {
    method: "get",
    path: "/api/users/profile",
    handler: userController.getProfile,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "put",
    path: "/api/users/profile",
    handler: userController.updateProfile,
    auth: true,
    rateLimit: "apiLimiter",
    validation: updateProfileSchema,
  },
  {
    method: "put",
    path: "/api/users/change-password",
    handler: userController.changePassword,
    auth: true,
    rateLimit: "apiLimiter",
    validation: changePasswordSchema,
  },
  {
    method: "get",
    path: "/api/users",
    handler: userController.getAllUsers,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
  },
  {
    method: "get",
    path: "/api/users/:id",
    handler: userController.getUserById,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
  },
  {
    method: "put",
    path: "/api/users/:id",
    handler: userController.updateUser,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
    validation: updateUserSchema,
  },
  {
    method: "delete",
    path: "/api/users/:id",
    handler: userController.deleteUser,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
  },

  // ==================== CATEGORY ROUTES ====================
  {
    method: "get",
    path: "/api/categories",
    handler: categoryController.getAllCategories,
    auth: false,
    rateLimit: "apiLimiter",
  },
  {
    method: "get",
    path: "/api/categories/:id",
    handler: categoryController.getCategoryById,
    auth: false,
    rateLimit: "apiLimiter",
  },
  {
    method: "post",
    path: "/api/categories",
    handler: categoryController.createCategory,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
    validation: createCategorySchema,
  },
  {
    method: "put",
    path: "/api/categories/:id",
    handler: categoryController.updateCategory,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
    validation: updateCategorySchema,
  },
  {
    method: "delete",
    path: "/api/categories/:id",
    handler: categoryController.deleteCategory,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
  },

  // ==================== PRODUCT ROUTES ====================
  {
    method: "get",
    path: "/api/products",
    handler: productController.getAllProducts,
    auth: false,
    rateLimit: "apiLimiter",
  },
  {
    method: "get",
    path: "/api/products/:id",
    handler: productController.getProductById,
    auth: false,
    rateLimit: "apiLimiter",
  },
  {
    method: "post",
    path: "/api/products",
    handler: productController.createProduct,
    auth: true,
    roles: [USER_ROLES.ADMIN, USER_ROLES.SELLER],
    rateLimit: "apiLimiter",
    validation: createProductSchema,
  },
  {
    method: "put",
    path: "/api/products/:id",
    handler: productController.updateProduct,
    auth: true,
    roles: [USER_ROLES.ADMIN, USER_ROLES.SELLER],
    rateLimit: "apiLimiter",
    validation: updateProductSchema,
  },
  {
    method: "delete",
    path: "/api/products/:id",
    handler: productController.deleteProduct,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
  },

  // ==================== ORDER ROUTES ====================
  {
    method: "post",
    path: "/api/orders",
    handler: orderController.createOrder,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "get",
    path: "/api/orders",
    handler: orderController.getAllOrders,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "get",
    path: "/api/orders/:id",
    handler: orderController.getOrderById,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "put",
    path: "/api/orders/:id/cancel",
    handler: orderController.cancelOrder,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "put",
    path: "/api/orders/:id/status",
    handler: orderController.updateOrderStatus,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    rateLimit: "apiLimiter",
  },

  // ==================== PAYMENT ROUTES ====================
  {
    method: "post",
    path: "/api/payments/create",
    handler: paymentController.createPayment,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "post",
    path: "/api/payments/verify",
    handler: paymentController.verifyPayment,
    auth: true,
    rateLimit: "apiLimiter",
  },
  {
    method: "get",
    path: "/api/payments/:id",
    handler: paymentController.getPaymentById,
    auth: true,
    rateLimit: "apiLimiter",
  },
];

module.exports = {
  routeDefinitions,
};
