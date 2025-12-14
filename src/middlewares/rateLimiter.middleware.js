const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Auth rate limiter (stricter)
const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// Strict rate limiter for sensitive operations
const strictLimiter = createRateLimiter(60 * 60 * 1000, 10); // 10 requests per hour

module.exports = {
  apiLimiter,
  authLimiter,
  strictLimiter,
};

