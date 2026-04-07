const User = require('../models/User');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.warn(`[Profile GET] User not found for ID: ${userId}`);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    console.log(`[Profile GET] OK: userId=${userId} name=${user.name}`);
    res.json({ success: true, user });
  } catch (err) {
    console.error('[Profile GET] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.headers['userid'];
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[Profile PUT] FAILED - User not found for ID: ${userId}`);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found after update.' });
    }

    console.log(`[Profile PUT] OK: Updated ${updatedUser.name} successfully`);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('[Profile PUT] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
