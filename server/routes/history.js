const express = require('express');
const router = express.Router();
const { getHistory, updateHistory } = require('../controllers/historyController');

router.get('/', getHistory);
router.post('/', updateHistory);

module.exports = router;
