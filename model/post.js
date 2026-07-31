const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }], // Changed from a single string to an array for multiple images
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null, // Null means it's a global post
    },
  },
  { timestamps: true }, // Added timestamps for the createdAt sorting requirement
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
