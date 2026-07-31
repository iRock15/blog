const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),

  age: Joi.number(),
  image: Joi.string(),
});
const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(12).required(),
  age: Joi.number(),
  image: Joi.string(),
});
module.exports = { updateUserSchema, createUserSchema };
