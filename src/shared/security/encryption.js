const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE } = require("../../config/env");

const SALT_ROUNDS = 10;

/**
 * Password hashing (bcrypt)
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * JWT helpers
 */
const generateToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE || "7d",
    ...options,
  });
};

const verifyJwt = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyJwt,
};
