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

router.get("/posts", auth, getAllPosts);

router.get("/posts/user/:userId", auth, getUserPosts);

router.post(
  "/posts",
  auth,
  uploadOnMomory.array("images", 5),
  uplaodImageKit(true, "blog-posts"),
  validate(postSchema),
  createPost,
);

router.put(
  "/posts/:id",
  auth,
  uploadOnMomory.array("images", 5),
  uplaodImageKit(true, "blog-posts"),
  validate(updatePostSchema),
  updatePost,
);

router.delete("/posts/:id", auth, deletePost);

module.exports = router;
