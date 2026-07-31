const util = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const AppError = require("../utils/AppError");
const jwtVerifyPromise = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new AppError("Please login to access this route", 401);
  }
  const payload = await jwtVerifyPromise(token, process.env.TOKEN_SECRET_KEY);
  const user = await User.findById(payload._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  req.user = user;
  next();
};

module.exports = auth;
