const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getHistory, updateHistory } = require('../controllers/historyController');

router.get('/', protect, getHistory);
router.post('/', protect, updateHistory);

module.exports = router;
