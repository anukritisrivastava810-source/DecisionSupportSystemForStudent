const History = require('../models/History');

// @desc  Get user history
// @route GET /api/history
const getHistory = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    let history = await History.findOne({ userId });
    if (!history) {
      history = await History.create({ userId });
    }
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add a search query or activity log to history
// @route POST /api/history
const updateHistory = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const { searchQuery, activityLog } = req.body;
    const updateFields = {};

    if (searchQuery) updateFields.searchHistory = searchQuery;
    if (activityLog) updateFields.activityLogs = activityLog;

    const update = {};
    if (searchQuery) update.$addToSet = { searchHistory: searchQuery };
    if (activityLog) {
      update.$push = { activityLogs: { $each: [activityLog], $slice: -50 } };
    }

    const history = await History.findOneAndUpdate(
      { userId },
      update,
      { new: true, upsert: true }
    );
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getHistory, updateHistory };
