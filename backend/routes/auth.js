/***************************************************************
 * FULL authRoutes.js using PostgreSQL (no Mongoose)
 ***************************************************************/
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // Shared PostgreSQL pool

const router = express.Router();

// Helper function to generate tokens
function generateTokens(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10m" });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { token, refreshToken };
}

/**
 * POST /api/auth/register
 * Registers a new user.
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    console.log("[REGISTER] Received data:", { email, username });

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email, password, and username are required" });
    }

    // Check if email or username already exists
    const checkQuery = `SELECT id FROM users WHERE email = $1 OR username = $2`;
    const checkResult = await pool.query(checkQuery, [email, username]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Email or username already taken" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the users table
    const insertQuery = `
      INSERT INTO users (email, password, username, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING id, email, username, role, created_at
    `;
    const { rows } = await pool.query(insertQuery, [email, hashedPassword, username]);
    const newUser = rows[0];

    console.log("[REGISTER] User created:", newUser.id);
    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("[REGISTER] Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * Logs in an existing user and returns JWT tokens.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[LOGIN] Attempting login for:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Retrieve the user from the database
    const selectQuery = `
      SELECT id, email, password, role, refreshToken
      FROM users
      WHERE email = $1
    `;
    const { rows } = await pool.query(selectQuery, [email]);
    if (rows.length === 0) {
      console.log("[LOGIN] User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }
    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[LOGIN] Invalid credentials for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user.id);

    // Update user's refreshToken in the database
    const updateQuery = `UPDATE users SET refreshToken = $1 WHERE id = $2`;
    await pool.query(updateQuery, [refreshToken, user.id]);

    console.log("[LOGIN] User logged in:", user.id);
    return res.status(200).json({ token, refreshToken, message: "Login successful" });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/refresh
 * Refreshes an expired JWT token.
 */
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const selectQuery = `SELECT id, refreshToken FROM users WHERE id = $1`;
    const { rows } = await pool.query(selectQuery, [decoded.userId]);
    if (rows.length === 0 || rows[0].refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "10m" });
    console.log("[REFRESH] New token for user:", decoded.userId);
    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("[REFRESH] Error:", error);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

/**
 * POST /api/auth/logout
 * Logs out a user by clearing the refresh token.
 */
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const updateQuery = `UPDATE users SET refreshToken = NULL WHERE id = $1`;
    await pool.query(updateQuery, [decoded.userId]);
    console.log("[LOGOUT] User logged out:", decoded.userId);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("[LOGOUT] Error:", error);
    return res.status(400).json({ message: "Invalid token" });
  }
});

/**
 * GET /api/auth/test
 * A simple test route to confirm auth routes are working.
 */
router.get("/test", (req, res) => {
  console.log("[TEST] Auth route is working!");
  return res.json({ message: "✅ Auth route is working!" });
});

module.exports = router;
