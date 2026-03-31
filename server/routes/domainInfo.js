const express = require('express');
const router = express.Router();
const { getAll, getByDomain } = require('../controllers/domainInfoController');

router.get('/', getAll);
router.get('/:domain', getByDomain);

module.exports = router;
