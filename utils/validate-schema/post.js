const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
  group: Joi.string().hex().length(24).optional(), // Validates the MongoDB ObjectId format
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10),
  group: Joi.string().hex().length(24),
}).min(1); // Ensures at least one field is provided during an update

module.exports = { postSchema, updatePostSchema };
