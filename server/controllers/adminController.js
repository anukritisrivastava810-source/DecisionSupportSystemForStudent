const User = require('../models/User');
const SkillProgress = require('../models/SkillProgress');
const Opportunity = require('../models/Opportunity');
const SearchHistory = require('../models/SearchHistory');
const ActivityLog = require('../models/ActivityLog');
const TrafficLog = require('../models/TrafficLog');

// @desc  Get overview statistics
// @route GET /api/admin/overview
const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSkills = await SkillProgress.countDocuments();
    const completedSkills = await SkillProgress.countDocuments({ progress: 100 });
    const totalInternships = await Opportunity.countDocuments({ type: 'internship' });
    const totalCompetitions = await Opportunity.countDocuments({ type: 'competition' });
    const totalSearches = await SearchHistory.countDocuments();
    const totalVisits = await TrafficLog.countDocuments();
    const totalLogins = await ActivityLog.countDocuments({ action: 'Logged In' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSkills,
        completedSkills,
        totalInternships,
        totalCompetitions,
        totalSearches,
        totalVisits,
        totalLogins
      }
    });
  } catch (err) {
    console.error('Admin Overview Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching overview.' });
  }
};

// @desc  Get all user records
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error('Admin Users Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching users.' });
  }
};

// @desc  Get search analytics
// @route GET /api/admin/searches
const getSearches = async (req, res) => {
  try {
    const searches = await SearchHistory.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, searches });
  } catch (err) {
    console.error('Admin Searches Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching searches.' });
  }
};

// @desc  Get activity logs
// @route GET /api/admin/activity
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    console.error('Admin Activity Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching activity.' });
  }
};

// @desc  Get traffic data
// @route GET /api/admin/traffic
const getTraffic = async (req, res) => {
  try {
    const traffic = await TrafficLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, traffic });
  } catch (err) {
    console.error('Admin Traffic Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching traffic.' });
  }
};

module.exports = {
  getOverview,
  getAllUsers,
  getSearches,
  getActivityLogs,
  getTraffic
};
