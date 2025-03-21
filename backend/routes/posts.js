
const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,      // e.g. devhub-postgres.cjgm8c8gyefy.us-east-2.rds.amazonaws.com
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,      // e.g. postgres
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // e.g. devhub
});


const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // e.g. { userId: '...', role: '...' }
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

/***************************************************************
 * 3) POST /api/posts
 *    Create a new post (Protected Route)
 ***************************************************************/
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Insert into "posts" table, storing req.user.userId as "author"
    const insertQuery = `
      INSERT INTO posts (title, content, author)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, author, created_at
    `;
    const values = [title, content, req.user.userId];

    const { rows } = await pool.query(insertQuery, values);
    const newPost = rows[0];

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/***************************************************************
 * 4) GET /api/posts
 *    Retrieve all posts (Public Route)
 ***************************************************************/
router.get("/", async (req, res) => {
  try {
    const selectQuery = `
      SELECT id, title, content, author, created_at
      FROM posts
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(selectQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/***************************************************************
 * 5) GET /api/posts/:id
 *    Retrieve a single post by its ID (Public Route)
 ***************************************************************/
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const selectQuery = `
      SELECT id, title, content, author, created_at
      FROM posts
      WHERE id = $1
    `;
    const { rows } = await pool.query(selectQuery, [postId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/***************************************************************
 * 6) PUT /api/posts/:id
 *    Update a post (Protected Route)
 *    - Only the author can update their own post
 ***************************************************************/
router.put("/:id", authenticate, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // 1) Fetch the existing post
    const fetchQuery = `
      SELECT id, title, content, author, created_at
      FROM posts
      WHERE id = $1
    `;
    const { rows: postRows } = await pool.query(fetchQuery, [postId]);

    if (postRows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingPost = postRows[0];

    // 2) Check if the logged-in user is the author
    if (existingPost.author !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own posts" });
    }

    // 3) Update the post
    const updatedTitle = title || existingPost.title;
    const updatedContent = content || existingPost.content;

    const updateQuery = `
      UPDATE posts
      SET title = $1, content = $2
      WHERE id = $3
      RETURNING id, title, content, author, created_at
    `;
    const { rows: updatedRows } = await pool.query(updateQuery, [updatedTitle, updatedContent, postId]);
    const updatedPost = updatedRows[0];

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/***************************************************************
 * 7) DELETE /api/posts/:id
 *    Delete a post (Protected Route)
 *    - Author or an "admin" can delete
 ***************************************************************/
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const postId = req.params.id;

    // 1) Fetch the existing post
    const fetchQuery = `
      SELECT id, author
      FROM posts
      WHERE id = $1
    `;
    const { rows: postRows } = await pool.query(fetchQuery, [postId]);

    if (postRows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingPost = postRows[0];

    // 2) Check if user is the author or has an admin role
    if (existingPost.author !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: You cannot delete this post" });
    }

    // 3) Delete the post
    const deleteQuery = `
      DELETE FROM posts
      WHERE id = $1
    `;
    await pool.query(deleteQuery, [postId]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
