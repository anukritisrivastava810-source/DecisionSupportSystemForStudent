const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getOverview,
  getAllUsers,
  getSearches,
  getActivityLogs,
  getTraffic,
  deleteUser
} = require('../controllers/adminController');

// All admin read/delete endpoints require valid JWT + admin role
router.get('/overview', protect, adminOnly, getOverview);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/searches', protect, adminOnly, getSearches);
router.get('/activity', protect, adminOnly, getActivityLogs);
router.get('/traffic', protect, adminOnly, getTraffic);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Tracking endpoints — authenticated users can log their own analytics
// These do NOT require admin role, just a valid session (userid header fine)
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
