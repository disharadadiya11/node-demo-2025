const authenticate = require("../middlewares/auth/auth.middleware");
const authorize = require("../middlewares/auth/role.middleware");
const { USER_ROLES } = require("../shared/constants/app.constants");

/**
 * CENTRAL ROUTE PROTECTION CONFIG
 * Edit ONLY this file to change protection
 */
const ROUTE_PROTECTION = {
  PUBLIC: {
    auth: false,
  },

  USER_AUTH: {
    auth: true,
  },

  ADMIN: {
    auth: true,
    roles: [USER_ROLES.ADMIN],
  },

  PRODUCT_WRITE: {
    auth: true,
    roles: [USER_ROLES.ADMIN, USER_ROLES.SELLER],
  },
};

/**
 * Middleware generator
 */
const protect = (key = "PUBLIC") => {
  const config = ROUTE_PROTECTION[key];

  if (!config || !config.auth) return [];

  const middlewares = [authenticate];

  if (config.roles?.length) {
    middlewares.push(authorize(...config.roles));
  }

  return middlewares;
};

module.exports = {
  protect,
  ROUTE_PROTECTION,
};
