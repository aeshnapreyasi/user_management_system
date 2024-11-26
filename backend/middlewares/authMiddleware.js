const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Use optional chaining here
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log(user);
    // Using optional chaining to safely assign user to req.user
    req.user = user ?? null;

    // Continue to the next middleware or route handler
    next();
  });
};

module.exports = authenticateToken;
