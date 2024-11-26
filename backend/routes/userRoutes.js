const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const db = require('../config/db');

// Route to get user profile (Protected)
router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user?.id;  // Optional chaining to ensure user exists
  if (!userId) {
    return res.status(400).json({ message: 'Invalid user data' });
  }
  const query = 'SELECT id, name, email FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: results[0] });
  });
});

// Route to update user profile (Protected)
router.put('/profile', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: 'Invalid user data' });
  }

  const { name, email } = req.body;

  // Simple validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User profile updated successfully' });
  });
});

module.exports = router;
