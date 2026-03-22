const express = require('express');
const router = express.Router();
const { getOpportunities, saveOpportunity, updateOpportunity, deleteOpportunity } = require('../controllers/opportunityController');

router.get('/', getOpportunities);
router.post('/', saveOpportunity);
router.put('/:id', updateOpportunity);
router.delete('/:id', deleteOpportunity);

module.exports = router;
