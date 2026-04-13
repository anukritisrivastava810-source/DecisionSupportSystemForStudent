const express = require('express');
const router = express.Router();
const { getCatalog, refreshCatalog } = require('../controllers/catalogController');
const { protect } = require('../middleware/auth');

// Public — frontend can load catalog without login
router.get('/', getCatalog);

// Protected — only logged-in users (admin) can trigger a refresh
router.post('/refresh', protect, refreshCatalog);

module.exports = router;
