const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Using User model for database interaction

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    // Save the user to the database
    const result = await User.create(newUser);
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with the token
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
  const email = req.user.email;

  try {
    // Get user data from the database
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile information
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
