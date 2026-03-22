const Goal = require('../models/Goal');

// GET /api/goals
const getGoals = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const goals = await Goal.find({ userId });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/goals
const addGoal = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const { skillName } = req.body;
    const goal = await Goal.create({ userId, skillName });
    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isCompleted: req.body.isCompleted },
      { new: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });
    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getGoals, addGoal, updateGoal };
