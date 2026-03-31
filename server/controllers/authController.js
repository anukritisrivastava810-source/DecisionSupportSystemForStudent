const User = require('../models/User');
const History = require('../models/History');
const ActivityLog = require('../models/ActivityLog');

// @desc  Register a new user
// @route POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, primaryDomain, skillLevel, careerAspiration, learningHoursPerWeek, educationLevel, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name, email, password,
      phone: phone || '',
      primaryDomain: primaryDomain || '',
      skillLevel: skillLevel || 'Beginner',
      careerAspiration: careerAspiration || '',
      learningHoursPerWeek: learningHoursPerWeek || 5,
      educationLevel: educationLevel || '',
      skills: skills || [],
    });

    // Create empty history record
    await History.create({ userId: user._id });

    // Log Activity
    await ActivityLog.create({
      userId: user._id,
      action: 'Signed Up',
      page: 'SignUp',
      details: `User ${name} registered.`,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        primaryDomain: user.primaryDomain,
        skillLevel: user.skillLevel,
        careerAspiration: user.careerAspiration,
        learningHoursPerWeek: user.learningHoursPerWeek,
        educationLevel: user.educationLevel,
        skills: user.skills,
      },
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Log Activity
    await ActivityLog.create({
      userId: user._id,
      action: 'Logged In',
      page: 'Login',
      details: `User ${user.name} logged in.`,
    });

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        primaryDomain: user.primaryDomain,
        skillLevel: user.skillLevel,
        careerAspiration: user.careerAspiration,
        learningHoursPerWeek: user.learningHoursPerWeek,
        educationLevel: user.educationLevel,
        skills: user.skills,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

module.exports = { signup, login };
