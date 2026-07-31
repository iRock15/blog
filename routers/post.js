const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getUserPosts,
} = require("../controllers/post");
const {
  postSchema,
  updatePostSchema,
} = require("../utils/validate-schema/post");
const validate = require("../middleware/joi-validate");
const auth = require("../middleware/auth");
const { uploadOnMomory } = require("../middleware/upload-image");
const uplaodImageKit = require("../middleware/image-kit");

const router = express.Router();

// GET all allowed posts (Global + User's Groups)
router.get("/posts", auth, getAllPosts);

// GET a specific user's posts
router.get("/posts/user/:userId", auth, getUserPosts);

// CREATE a post (with multiple images support)
router.post(
  "/posts",
  auth,
  uploadOnMomory.array("images", 5), // 'images' is the field name, max 5 files
  uplaodImageKit(true, "blog-posts"), // true for multiple files, custom folder name
  validate(postSchema),
  createPost,
);

// UPDATE a post (with optional image updates)
router.put(
  "/posts/:id",
  auth,
  uploadOnMomory.array("images", 5),
  uplaodImageKit(true, "blog-posts"),
  validate(updatePostSchema),
  updatePost,
);

// DELETE a post
router.delete("/posts/:id", auth, deletePost);

module.exports = router;
