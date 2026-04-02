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
      console.log(`[Auth] ⚠️ Signup reject: Missing required fields (email=${email})`);
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`[Auth] ⚠️ Signup reject: Duplicate email (${email})`);
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Assign Role: Default user, but for specific admin email we promote them automatically
    const role = (email.toLowerCase() === 'anukritisrivastava810@gmail.com') ? 'admin' : 'user';

    const user = await User.create({
      name, 
      email, 
      password,
      role,
      phone: phone || '',
      primaryDomain: primaryDomain || '',
      skillLevel: skillLevel || 'Beginner',
      careerAspiration: careerAspiration || '',
      careerGoal: careerGoal || '',
      learningHoursPerWeek: learningHoursPerWeek || 5,
      educationLevel: educationLevel || '',
      skills: skills || [],
    });

    // Create records
    await History.create({ userId: user._id });
    await ActivityLog.create({
      userId: user._id,
      action: 'Signed Up',
      page: 'SignUp',
      details: `Account created for ${name} (${role})`,
    });

    console.log(`[Auth] ✅ User created successfully: ${email} (uid: ${user._id})`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Auth] ❌ Signup Exception:', err.message);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log(`[Auth] ⚠️ Login reject: Missing credentials`);
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Case-insensitive login
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`[Auth] ⚠️ Auth Fail: User not found for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Password verification
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`[Auth] ⚠️ Auth Fail: Incorrect password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Role check - specific email override (safety safeguard)
    if (user.email.toLowerCase() === 'anukritisrivastava810@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    // Log login activity
    await ActivityLog.create({
      userId: user._id,
      action: 'Logged In',
      page: 'Login',
      details: `User ${user.name} authenticated.`,
    });

    console.log(`[Auth] ✅ Login success: ${email} (Role: ${user.role})`);

    res.json({
      success: true,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Auth] ❌ Login Exception:', err.message);
    res.status(500).json({ success: false, message: 'Authentication server error.' });
  }
};


module.exports = { signup, login };
