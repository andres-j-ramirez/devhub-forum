process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// db.js
const { Pool } = require('pg');

// Build a connection string that forces SSL
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

const pool = new Pool({
  connectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

module.exports = pool;
