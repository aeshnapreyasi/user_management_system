const User = require('../models/User'); // Import the User model

// Get user profile (authenticated user)
const getUserProfile = async (req, res) => {
  const userId = req.user.userId; // Get the userId from the JWT token

  try {
    // Fetch the user profile from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send user profile details
    res.status(200).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update user profile (authenticated user)
const updateUserProfile = async (req, res) => {
  const userId = req.user.userId; // Get the userId from the JWT token
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    // Update the user profile in the database
    const updatedUser = {
      username,
      email,
    };

    const result = await User.update(userId, updatedUser);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Change user password
const changePassword = async (req, res) => {
  const userId = req.user.userId; // Get the userId from the JWT token
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required' });
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the old password using bcrypt
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const result = await User.updatePassword(userId, hashedPassword);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  const userId = req.user.userId; // Get the userId from the JWT token

  try {
    // Delete the user from the database
    const result = await User.delete(userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error('Error deleting user account:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
};
