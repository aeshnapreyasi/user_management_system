const db = require('../config/db');
const bcrypt = require('bcrypt');

// Find user by ID
const findById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        // Reject with an Error object
        return reject(new Error(`Error fetching user by ID: ${err.message}`));
      }
      resolve(results[0]);
    });
  });
};

// Create a new user (used for registration)
const create = (username, email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        // Reject with an Error object
        return reject(new Error(`Error hashing password: ${err.message}`));
      }
      
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
          // Reject with an Error object
          return reject(new Error(`Error creating user: ${err.message}`));
        }
        resolve(results);
      });
    });
  });
};

// Update user profile (username, email)
const update = (userId, user) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    db.query(query, [user.username, user.email, userId], (err, results) => {
      if (err) {
        // Reject with an Error object
        return reject(new Error(`Error updating user profile: ${err.message}`));
      }
      resolve(results);
    });
  });
};

// Update user password
const updatePassword = (userId, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, userId], (err, results) => {
      if (err) {
        // Reject with an Error object
        return reject(new Error(`Error updating user password: ${err.message}`));
      }
      resolve(results);
    });
  });
};

// Delete user account
const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        // Reject with an Error object
        return reject(new Error(`Error deleting user: ${err.message}`));
      }
      resolve(results);
    });
  });
};

module.exports = {
  findById,
  create,
  update,
  updatePassword,
  delete: deleteUser,
};
