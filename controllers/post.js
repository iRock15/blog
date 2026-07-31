const AppError = require("../utils/AppError");
const Post = require("../model/post");
const Group = require("../model/group");

const createPost = async (req, res, next) => {
  const { title, content, group } = req.body;
  const user = req.user;

  const images = req.images || [];

  if (group) {
    const targetGroup = await Group.findById(group);
    if (!targetGroup) throw new AppError("Group not found", 404);

    const isMember = targetGroup.members.includes(user._id);
    const isAdmin = targetGroup.admins.includes(user._id);

    if (!isMember && !isAdmin && user.role !== "superAdmin") {
      throw new AppError("You are not allowed to post in this group!", 403);
    }
  }

  const post = await Post.create({
    title,
    content,
    images,
    group: group || null,
    author: user._id,
  });

  res.status(201).json({ message: "Post created successfully", post });
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) throw new AppError("Post not found", 404);

  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "superAdmin"
  ) {
    throw new AppError("You can only edit your own posts", 403);
  }

  const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
  res
    .status(200)
    .json({ message: "Post updated successfully", post: updatedPost });
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) throw new AppError("Post not found", 404);

  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "superAdmin"
  ) {
    throw new AppError("You can only delete your own posts", 403);
  }

  await Post.findByIdAndDelete(id);
  res.status(200).json({ message: "Post deleted successfully" });
};

const getAllPosts = async (req, res, next) => {
  const user = req.user;

  const userGroups = await Group.find({
    $or: [{ members: user._id }, { admins: user._id }],
  }).select("_id");

  const groupIds = userGroups.map((g) => g._id);

  const posts = await Post.find({
    $or: [{ group: null }, { group: { $in: groupIds } }],
  })
    .sort({ createdAt: -1 })
    .populate("author", "name email image");

  res.status(200).json({
    message: "Posts retrieved successfully",
    results: posts.length,
    posts,
  });
};

const getUserPosts = async (req, res, next) => {
  const { userId } = req.params;

  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "name email image");

  res
    .status(200)
    .json({ message: "User posts retrieved", results: posts.length, posts });
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getUserPosts,
};
