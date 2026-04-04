const User = require('../models/User');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    console.log(`[Profile GET] userId=${userId} name=${user.name}`);
    res.json({ success: true, user });
  } catch (err) {
    console.error('[Profile GET] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const allowed = [
      'name', 'phone', 'domainOfInterest', 'educationLevel', 'skills',
      'careerGoal', 'primaryDomain', 'skillLevel', 'careerAspiration', 
      'learningHoursPerWeek', 'branch', 'yearOfStudy', 'academicInterests', 
      'careerInterests', 'profileCompleted'
    ];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    console.log(`[Profile PUT] userId=${userId} updating fields:`, Object.keys(updates));

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    console.log(`[Profile PUT] Updated ${user.name} successfully`);
    res.json({ success: true, user });
  } catch (err) {
    console.error('[Profile PUT] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
