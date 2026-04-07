const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOpportunities, saveOpportunity, updateOpportunity, deleteOpportunity } = require('../controllers/opportunityController');

router.get('/', protect, getOpportunities);
router.post('/', protect, saveOpportunity);
router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);

module.exports = router;
