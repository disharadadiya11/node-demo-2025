// ==================== SUCCESS MESSAGES ====================
const successMessages = {
  // Auth
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "Registration successful",
  PASSWORD_RESET_SENT: "Password reset email sent",
  PASSWORD_RESET_SUCCESS: "Password reset successful",

  // User
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PROFILE_RETRIEVED: "Profile retrieved successfully",

  // Category
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  CATEGORY_RETRIEVED: "Category retrieved successfully",

  // Product
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  PRODUCT_RETRIEVED: "Product retrieved successfully",

  // Payment
  PAYMENT_CREATED: "Payment created successfully",
  PAYMENT_VERIFIED: "Payment verified successfully",
};

// ==================== ERROR MESSAGES ====================
const errorMessages = {
  // Auth
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  TOKEN_EXPIRED: "Token expired",
  TOKEN_INVALID: "Invalid token",

  // User
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  PASSWORD_MISMATCH: "Password mismatch",

  // Category
  CATEGORY_ALREADY_EXISTS: "Category already exists",
  CATEGORY_NOT_FOUND: "Category not found",

  // Product
  PRODUCT_NOT_FOUND: "Product not found",
  INSUFFICIENT_STOCK: "Insufficient stock",

  // Generic
  VALIDATION_ERROR: "Validation error",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

module.exports = {
  successMessages,
  errorMessages,
};
