const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header is present
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database based on token data
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to next middleware
      return next();
    } catch (error) {
      console.error('Not authorized, token failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is provided
  console.error('Not authorized, no token');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };