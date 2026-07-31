const AppError = require("../utils/AppError");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");
const jwtSignPromise = util.promisify(jwt.sign);

const signup = async (req, res) => {
  const body = req.body;
  const user = await User.create(body);
  //   const { password, ...userData } = user.toObject();
  const userObject = user.toObject();
  delete userObject.password;
  res.status(201).json({ message: "User created successfully", userObject });
};

const login = async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email }, null, {
    includePassword: true,
  });
  if (!user) {
    throw new AppError("email or password is incorrect", 401);
  }
  const isPasseowrdCorrect = await bcrypt.compare(body.password, user.password);
  if (!isPasseowrdCorrect) {
    throw new AppError("email or password is incorrect", 401);
  }

  // token logic
  const token = await jwtSignPromise(
    { _id: user._id },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: process.env.TOKEN_EXPIRES_IN },
  );

  res.status(200).json({ message: "User logged in successfully", user, token });
};

module.exports = { signup, login };
