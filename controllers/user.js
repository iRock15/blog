const AppError = require("../utils/AppError");
const User = require("../model/user");
const Post = require("../model/post");

const createAdmin = async (req, res, next) => {
  const body = req.body;
  // const imagePath = req.file?.path || null;
  const imagePath = req?.images?.[0] || null;
  const user = await User.create({
    ...body,
    image: imagePath,
    role: "admin",
  });
  res.status(201).json({ message: "User created successfully", user });
};

const getAllUsers = async (req, res, next) => {
  console.log(req.user);
  const users = await User.find({});
  res.status(200).json({ message: "Users retrieved successfully", users });
};
const getOneUser = async (req, res) => {
  const userId = req.params.id;
  // const user = await User.findById(userId, { password: 0 });
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json({ message: "User retrieved successfully", user });
};

const updateUserPutMethod = async (req, res) => {
  const userId = req.params.id;
  const userBody = req.body;
  if (!userBody || !userBody.name || !userBody.email || !userBody.password) {
    throw new AppError("Please provide (name, email, password)", 400);
  }
  const user = await User.findOneAndUpdate({ _id: userId }, userBody, {
    new: true,
  });
  // const user = await User.findOneAndUpdate({ _id: userId }, user);
  // const user = await User.updateOne({ _id: userId }, user);
  // const user = await User.updateMany({ _id: userId }, user);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ message: "User updated successfully", user });
};
const upadateUserPatchMethod = async (req, res) => {
  console.log("hamada");
  const userId = req.params.id;
  const body = req.body;

  const user = await User.findByIdAndUpdate(userId, body, { new: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ message: "User updated successfully", user });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  // const user = await User.findOneAndDelete({ _id: userId });
  // const user = await User.deleteOne({ _id: userId });
  // const user = await User.deleteMany({ _id: userId });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  await Post.deleteMany({ author: userId });

  res.status(200).json({ message: "User deleted successfully", user });
};

module.exports = {
  createAdmin,
  getAllUsers,
  getOneUser,
  updateUserPutMethod,
  upadateUserPatchMethod,
  deleteUser,
};
