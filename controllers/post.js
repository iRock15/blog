const AppError = require("../utils/AppError");
const Post = require("../model/post");
const Group = require("../model/group");

// CREATE POST
const createPost = async (req, res, next) => {
  const { title, content, group } = req.body;
  const user = req.user;

  // Grabbing image URLs processed by your ImageKit middleware
  const images = req.images || [];

  // Business Logic: Only allowed users post in groups
  if (group) {
    const targetGroup = await Group.findById(group);
    if (!targetGroup) throw new AppError("Group not found", 404);

    const isMember = targetGroup.members.includes(user._id);
    const isAdmin = targetGroup.admins.includes(user._id);

    if (!isMember && !isAdmin && user.role !== "superAdmin") {
      throw new AppError("You are not allowed to post in this group", 403);
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

// UPDATE POST
const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) throw new AppError("Post not found", 404);

  // Business Logic: Only owner edits, Super Admin overrides
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

// DELETE POST
const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) throw new AppError("Post not found", 404);

  // Business Logic: Only owner deletes, Super Admin overrides
  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "superAdmin"
  ) {
    throw new AppError("You can only delete your own posts", 403);
  }

  await Post.findByIdAndDelete(id);
  res.status(200).json({ message: "Post deleted successfully" });
};

// GET ALL POSTS (Global + Allowed Group Posts)
const getAllPosts = async (req, res, next) => {
  const user = req.user;

  // Find groups where the user is a member or admin
  const userGroups = await Group.find({
    $or: [{ members: user._id }, { admins: user._id }],
  }).select("_id");

  const groupIds = userGroups.map((g) => g._id);

  // Fetch posts that are either global (group: null) OR belong to allowed groups
  // Sort by newest first (createdAt: -1)
  const posts = await Post.find({
    $or: [{ group: null }, { group: { $in: groupIds } }],
  })
    .sort({ createdAt: -1 })
    .populate("author", "name email image"); // Populating user data as requested in your original comments

  res
    .status(200)
    .json({
      message: "Posts retrieved successfully",
      results: posts.length,
      posts,
    });
};

// GET USER POSTS
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
