const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(200),
  description: Joi.string().required().trim(),
  price: Joi.number().required().min(0),
  compareAtPrice: Joi.number().optional().min(0),
  sku: Joi.string().optional().trim().uppercase(),
  stock: Joi.number().required().min(0),
  images: Joi.array().items(Joi.string().uri()).optional(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional().trim().min(2).max(200),
  description: Joi.string().optional().trim(),
  price: Joi.number().optional().min(0),
  compareAtPrice: Joi.number().optional().min(0),
  sku: Joi.string().optional().trim().uppercase(),
  stock: Joi.number().optional().min(0),
  images: Joi.array().items(Joi.string().uri()).optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};

