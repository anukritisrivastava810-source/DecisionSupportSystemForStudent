const express = require('express');
const router = express.Router();
const {
  getOverview,
  getAllUsers,
  getSearches,
  getActivityLogs,
  getTraffic,
  deleteUser
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
router.delete('/users/:id', deleteUser);

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
    const { userId, pageVisited, route, duration = 0 } = req.body;
    const TrafficLog = require('../models/TrafficLog');
    const log = await TrafficLog.create({ userId, pageVisited, route, duration });
    res.json({ success: true, logId: log._id });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.post('/traffic/heartbeat', async (req, res) => {
  try {
    const { logId, increment = 30 } = req.body;
    if (!logId) return res.status(400).json({ success: false });
    const TrafficLog = require('../models/TrafficLog');
    await TrafficLog.findByIdAndUpdate(logId, { $inc: { duration: increment } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

module.exports = router;
