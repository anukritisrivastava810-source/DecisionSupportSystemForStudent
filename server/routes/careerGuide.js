const express = require('express');
const router = express.Router();
const { getByGoal, getAll } = require('../controllers/careerGuideController');

router.get('/', getByGoal);
router.get('/all', getAll);

module.exports = router;
