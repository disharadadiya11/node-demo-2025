module.exports = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/jpg", "image/webp"],

  // Cache TTL (in seconds)
  CACHE_TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
  },

  USER_ROLES: {
    ADMIN: "admin",
    USER: "user",
    SELLER: "seller",
  },
};
