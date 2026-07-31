const AppError = require("../utils/AppError");

const valudate = (schema) => {
  return (req, res, next) => {
    const body = req.body;
    const { error } = schema.validate(body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
    next();
  };
};

module.exports = valudate;
