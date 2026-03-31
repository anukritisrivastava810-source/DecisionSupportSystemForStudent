const express = require('express');
const router = express.Router();
const {
  getOverview,
  getAllUsers,
  getSearches,
  getActivityLogs,
  getTraffic
} = require('../controllers/adminController');

// Middleware to check if user is admin
// Since we don't have JWT yet, we'll check for a custom header or just rely on the frontend for now
// But a proper implementation would use an 'admin' route check.
// For now, let's just make it available.

router.get('/overview', getOverview);
router.get('/users', getAllUsers);
router.get('/searches', getSearches);
router.get('/activity', getActivityLogs);
router.get('/traffic', getTraffic);

// Tracking endpoints (accessible to users to log their data)
router.post('/searches', async (req, res) => {
  try {
    const { userId, query, searchType } = req.body;
    const SearchHistory = require('../models/SearchHistory');
    await SearchHistory.create({ userId, query, searchType });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.post('/traffic', async (req, res) => {
  try {
    const { userId, pageVisited, route } = req.body;
    const TrafficLog = require('../models/TrafficLog');
    await TrafficLog.create({ userId, pageVisited, route });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

module.exports = router;
