const User = require('../models/User');
const History = require('../models/History');
const ActivityLog = require('../models/ActivityLog');

// Helper to build safe public user object (all fields frontend needs)
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  primaryDomain: user.primaryDomain || '',
  domainOfInterest: user.domainOfInterest || '',
  skillLevel: user.skillLevel || 'Beginner',
  careerAspiration: user.careerAspiration || '',
  careerGoal: user.careerGoal || '',
  learningHoursPerWeek: user.learningHoursPerWeek || 5,
  educationLevel: user.educationLevel || '',
  skills: user.skills || [],
  role: user.role,
});

// @desc  Register a new user
// @route POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const {
      name, email, password, phone,
      primaryDomain, skillLevel, careerAspiration, careerGoal,
      learningHoursPerWeek, educationLevel, skills
    } = req.body;

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
      careerGoal: careerGoal || '',
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

    console.log(`[Auth] ✅ New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Auth] ❌ Signup Error:', err.message);
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
      console.log(`[Auth] Login failed — no user found for: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`[Auth] Login failed — wrong password for: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Log Activity
    await ActivityLog.create({
      userId: user._id,
      action: 'Logged In',
      page: 'Login',
      details: `User ${user.name} logged in.`,
    });

    console.log(`[Auth] ✅ Login success: ${email}, role=${user.role}`);

    res.json({
      success: true,
      message: 'Login successful!',
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Auth] ❌ Login Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

module.exports = { signup, login };
