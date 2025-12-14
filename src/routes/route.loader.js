/**
 * Route Loader
 * Dynamically applies middlewares and registers routes based on route definitions
 */

const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  apiLimiter,
  authLimiter,
  strictLimiter,
} = require("../middlewares/rateLimiter.middleware");

const rateLimiters = {
  apiLimiter,
  authLimiter,
  strictLimiter,
};

/**
 * Loads routes from route definitions and applies middlewares
 * @param {Express.Router} router - Express router instance
 * @param {Array} routeDefinitions - Array of route definition objects
 * @param {String} basePath - Base path prefix for all routes
 */
const loadRoutes = (router, routeDefinitions = [], basePath = "") => {
  routeDefinitions.forEach((route) => {
    const { method, path, handler, auth, roles, rateLimit, validation } = route;

    if (!method || !path || !handler) {
      console.warn(
        `Invalid route definition: missing method, path, or handler`,
        route
      );
      return;
    }

    const fullPath = basePath ? `${basePath}${path}` : path;
    const middlewares = [];

    // Apply rate limiting if specified
    if (rateLimit && rateLimiters[rateLimit]) {
      middlewares.push(rateLimiters[rateLimit]);
    }

    // Apply validation if specified
    if (validation) {
      middlewares.push(validate(validation));
    }

    // Apply authentication if required
    if (auth) {
      middlewares.push(authenticate);

      // Apply role-based authorization if roles are specified
      if (roles && Array.isArray(roles) && roles.length > 0) {
        middlewares.push(authorize(...roles));
      }
    }

    // Add the handler as the final middleware
    middlewares.push(handler);

    // Register the route with all middlewares
    router[method.toLowerCase()](fullPath, ...middlewares);
  });
};

/**
 * Creates a router and loads routes into it
 * @param {Array} routeDefinitions - Array of route definition objects
 * @param {String} basePath - Base path prefix for all routes
 * @returns {Express.Router} Configured Express router
 */
const createRouter = (routeDefinitions = [], basePath = "") => {
  const router = express.Router();
  loadRoutes(router, routeDefinitions, basePath);
  return router;
};

module.exports = {
  loadRoutes,
  createRouter,
};

