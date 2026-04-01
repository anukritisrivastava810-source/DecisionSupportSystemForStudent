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
    
    // Search Breakdowns
    const totalSearches = await SearchHistory.countDocuments();
    const skillSearches = await SearchHistory.countDocuments({ searchType: 'Skill' });
    const competitionSearches = await SearchHistory.countDocuments({ searchType: 'Competition' });
    const internshipSearches = await SearchHistory.countDocuments({ searchType: 'Internship' });

    // Domain Distribution for Pie Chart
    const domainDistribution = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: { $ifNull: ["$primaryDomain", "Others"] }, count: { $sum: 1 } } }
    ]);

    const totalInternships = await Opportunity.countDocuments({ type: 'internship' });
    const totalCompetitions = await Opportunity.countDocuments({ type: 'competition' });
    const totalLogins = await ActivityLog.countDocuments({ action: 'Logged In' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSkills,
        totalSearches,
        searchBreakdown: {
          skill: skillSearches,
          competition: competitionSearches,
          internship: internshipSearches
        },
        domainDistribution,
        totalInternships,
        totalCompetitions,
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
    // Filter out traffic from admin users
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map(u => u._id);

    const traffic = await TrafficLog.find({ userId: { $nin: adminIds } })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    // Group for chart: Date vs Time spent (mocking time as count of logs per day for now)
    const trafficStats = await TrafficLog.aggregate([
      { $match: { userId: { $nin: adminIds } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" }
      } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ success: true, traffic, trafficStats });
  } catch (err) {
    console.error('Admin Traffic Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching traffic.' });
  }
};

// @desc  Delete a user
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    // Prevent deleting other admins (optional safeguard)
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Admin Delete User Error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting user.' });
  }
};

module.exports = {
  getOverview,
  getAllUsers,
  getSearches,
  getActivityLogs,
  getTraffic,
  deleteUser
};
