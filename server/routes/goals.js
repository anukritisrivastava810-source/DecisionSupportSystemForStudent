const express = require('express');
const router = express.Router();
const { getGoals, addGoal, updateGoal } = require('../controllers/goalController');

router.get('/', getGoals);
router.post('/', addGoal);
router.put('/:id', updateGoal);

module.exports = router;
