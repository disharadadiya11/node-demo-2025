const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required().min(6).max(50),
  phone: Joi.string().optional().trim(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional().trim().min(2).max(50),
  phone: Joi.string().optional().trim(),
  avatar: Joi.string().optional().uri(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6).max(50),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional().trim().min(2).max(50),
  email: Joi.string().email().optional().lowercase().trim(),
  phone: Joi.string().optional().trim(),
  role: Joi.string().valid('admin', 'user', 'seller').optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
};

