const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Database connection
require('dotenv').config();

const router = express.Router();

// Helper function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User Registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if (!firstName || !lastName || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await db.promise().query(
      'INSERT INTO users (first_name, last_name, email, mobile, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, mobile, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Fetch the user by email
    const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate a token and send it in the response
    const token = generateToken(user[0].id);
    
    // Save token to localStorage (or cookie in frontend)
    localStorage.setItem('token', token);  // Store the token
    res.status(200).json({ message: 'Login successful', token });

  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err.message);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
