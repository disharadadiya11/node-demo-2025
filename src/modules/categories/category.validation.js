const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  description: Joi.string().optional().trim().max(500),
  image: Joi.string().optional().uri(),
  isActive: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional().trim().min(2).max(50),
  description: Joi.string().optional().trim().max(500),
  image: Joi.string().optional().uri(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};

