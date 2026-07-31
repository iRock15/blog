const Joi = require("joi");

const groupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

const manageMemberSchema = Joi.object({
  groupId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
});

module.exports = { groupSchema, manageMemberSchema };
