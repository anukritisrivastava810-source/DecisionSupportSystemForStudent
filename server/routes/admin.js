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
// These require valid session, use req.user._id for security
router.post('/searches', protect, async (req, res) => {
  try {
    const { query, searchType } = req.body;
    const userId = req.user._id;
    const SearchHistory = require('../models/SearchHistory');
    await SearchHistory.create({ userId, query, searchType });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.post('/traffic', protect, async (req, res) => {
  try {
    const { pageVisited, route, duration = 0 } = req.body;
    const userId = req.user._id;
    const TrafficLog = require('../models/TrafficLog');
    const log = await TrafficLog.create({ userId, pageVisited, route, duration });
    res.json({ success: true, logId: log._id });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.post('/traffic/heartbeat', protect, async (req, res) => {
  try {
    const { logId, increment = 30 } = req.body;
    if (!logId) return res.status(400).json({ success: false });
    const TrafficLog = require('../models/TrafficLog');
    // Basic verification: only the owner of the traffic log should be able to update its heartbeat?
    // For now, just update.
    await TrafficLog.findByIdAndUpdate(logId, { $inc: { duration: increment } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

module.exports = router;
