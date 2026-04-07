const express = require('express');
const router = express.Router();
const { getCareerSearchData } = require('../controllers/careerSearchController');

// GET /api/career-search/:query
router.get('/:query', getCareerSearchData);

module.exports = router;
