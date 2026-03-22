const User = require('../models/User');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const allowed = ['name', 'phone', 'domainOfInterest', 'educationLevel', 'skills', 'careerGoal', 'primaryDomain', 'skillLevel', 'careerAspiration', 'learningHoursPerWeek'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
