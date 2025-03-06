const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post"); // Import our Post model

const router = express.Router();

/**
 * Middleware: authenticate
 * This checks for a valid JWT token in the "Authorization" header.
 * If valid, it attaches the decoded user data to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save user data from token in req.user
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

/**
 * POST /api/posts
 * Create a new post.
 * Protected route.
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Create a new post using the userId from the token as the author
    const newPost = new Post({
      title,
      content,
      author: req.user.userId,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/posts
 * Retrieve all posts.
 * Public route.
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "email");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/posts/:id
 * Retrieve a single post by its ID.
 * Public route.
 */
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/posts/:id
 * Update a post.
 * Protected route.
 */
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Only allow update if the logged-in user is the post's author
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own posts" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();
    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post.
 * Protected route.
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Allow deletion if the user is the author or has an admin role
    if (post.author.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: You cannot delete this post" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

