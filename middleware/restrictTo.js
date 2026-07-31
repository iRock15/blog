const AppError = require("../utils/AppError");

const restrictTo = (...roles) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      throw new AppError("You are not authorized", 403);
    }
    next();
  };
};

module.exports = restrictTo;
