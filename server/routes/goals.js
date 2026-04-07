const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getGoals, addGoal, updateGoal } = require('../controllers/goalController');

router.get('/', protect, getGoals);
router.post('/', protect, addGoal);
router.put('/:id', protect, updateGoal);

module.exports = router;
