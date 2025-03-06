const dotenv = require('dotenv');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");       // Import your auth routes (auth.js)
const postRoutes = require("./routes/postRoutes");   // Import the post routes

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // To parse JSON requests
app.use(cors());       // To handle CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Use the routes
app.use("/api/auth", authRoutes);   // Mount the auth routes at /api/auth
app.use("/api/posts", postRoutes);  // Mount the post routes at /api/posts

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

