const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this file exists

// Create a post (already exists)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            userId: req.userId,  // Set in authMiddleware after token verification
            title: req.body.title,
            content: req.body.content
        });
        await newPost.save();
        res.status(201).json({ message: "Post created successfully!" });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all posts (already exists)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// **NEW: Get a specific post by its ID**
router.get('/:id', async (req, res) => {
    console.log("Request URL: ", req.originalUrl);  // Debugging
    try {
        const post = await Post.findById(req.params.id); // Find the post by its ID
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post); // Return the post data if found
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// **NEW: Create a comment for a post**
router.post('/comment', authMiddleware, async (req, res) => {
    try {
        const newComment = new Comment({
            postId: req.body.postId,  // ID of the post to comment on
            userId: req.userId,         // Comes from authMiddleware after verifying token
            content: req.body.content   // The comment content
        });
        await newComment.save();
        res.status(201).json({ message: "Comment created successfully!" });
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// **NEW: Get comments for a specific post**
router.get('/:postId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

