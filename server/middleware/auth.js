const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify admin token
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authorized - admin not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized - invalid token' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized - no token provided' 
    });
  }
};

module.exports = { protect };