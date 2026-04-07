const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware — verifies JWT from Authorization header.
 * Attaches req.user on success.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fallback: custom userid header (legacy — kept for backward compat)
    if (!token && req.headers['userid']) {
      const legacyId = req.headers['userid'];
      req.user = await User.findById(legacyId).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found for legacy session.' });
      }
      return next();
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorised, no token.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    next();
  } catch (err) {
    console.error('[Auth Middleware] Token error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorised, invalid token.' });
  }
};

/**
 * Admin-only guard — must be used AFTER protect middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admins only.' });
};

/**
 * Generate signed JWT for a user.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = { protect, adminOnly, generateToken };
