const dotenv = require('dotenv');
dotenv.config(); // Must come before any other config

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL client

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080', // EXACT frontend URL
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Create a PostgreSQL connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,      // e.g., devhub-postgres.cjgm8c8gyefy.us-east-2.rds.amazonaws.com
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,      // e.g., postgres
  password: process.env.DB_PASSWORD, // your chosen password
  database: process.env.DB_NAME,  // e.g., devhub
});

// Test the PostgreSQL connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('PostgreSQL connected, server time:', result.rows[0].now);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
