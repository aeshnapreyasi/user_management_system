const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Max simultaneous connections
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check and create database if not exists
const setupDatabase = () => {
  const tempConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  tempConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.message);
      process.exit(1);
    }

    // Create database if it doesn't exist
    tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
      if (err) {
        console.error('Error creating database:', err.message);
        process.exit(1);
      }
      console.log(`Database '${process.env.DB_NAME}' is ready`);

      // Ensure required tables exist
      ensureTables();
    });

    tempConnection.end();
  });
};

// Ensure required tables exist
const ensureTables = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      mobile VARCHAR(10) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`;

  const createNotesTable = `
    CREATE TABLE IF NOT EXISTS notes (
      notes_id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255),
      note TEXT NOT NULL,
      FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
    )`;

  pool.query(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
      process.exit(1);
    }
    console.log('Users table is ready');
  });

  pool.query(createNotesTable, (err) => {
    if (err) {
      console.error('Error creating notes table:', err.message);
      process.exit(1);
    }
    console.log('Notes table is ready');
  });
};

// Initialize setup
setupDatabase();

// Export the connection pool for application usage
module.exports = pool;
