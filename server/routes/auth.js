const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { signup, login, googleAuth } = require('../controllers/authController');

// Rate limiter: max 10 auth attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signup);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);

module.exports = router;
