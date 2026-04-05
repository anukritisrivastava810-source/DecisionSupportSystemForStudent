const User = require('../models/User');
const History = require('../models/History');
const ActivityLog = require('../models/ActivityLog');
const { generateToken } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  authProvider: user.authProvider || 'local',
  profileCompleted: user.profileCompleted || false,
  branch: user.branch || '',
  yearOfStudy: user.yearOfStudy || '',
  academicInterests: user.academicInterests || [],
  careerInterests: user.careerInterests || [],
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

    // Password is only required for local registration
    if (!name || !email || (!password && req.body.authProvider !== 'google')) {
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
      authProvider: req.body.authProvider || 'local',
      phone: phone || '',
      primaryDomain: primaryDomain || '',
      domainOfInterest: req.body.domainOfInterest || '',
      skillLevel: skillLevel || 'Beginner',
      careerAspiration: careerAspiration || '',
      careerGoal: careerGoal || '',
      learningHoursPerWeek: learningHoursPerWeek || 5,
      educationLevel: educationLevel || '',
      skills: skills || [],
      branch: req.body.branch || '',
      yearOfStudy: req.body.yearOfStudy || '',
      academicInterests: req.body.academicInterests || [],
      careerInterests: req.body.careerInterests || [],
      // Manual/Complete signup implies profileCompleted: true
      profileCompleted: req.body.profileCompleted !== undefined ? req.body.profileCompleted : true,
    });

    // Create records
    await History.create({ userId: user._id });
    await ActivityLog.create({
      userId: user._id,
      action: 'Signed Up',
      page: 'SignUp',
      details: `Account created for ${name} (${role})`,
    });

    const token = generateToken(user._id);
    console.log(`[Auth] ✅ User created successfully: ${email} (uid: ${user._id})`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
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

    // Reject Google-only users trying to login with password
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({ success: false, message: 'This account uses Google Sign-In. Please use Google login.' });
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

    const token = generateToken(user._id);
    console.log(`[Auth] ✅ Login success: ${email} (Role: ${user.role})`);

    res.json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Auth] ❌ Login Exception:', err.message);
    res.status(500).json({ success: false, message: 'Authentication server error.' });
  }
};

// @desc  Google OAuth login/signup
// @route POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is required.' });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not retrieve email from Google.' });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Existing user — update authProvider if needed
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        await user.save();
      }
      console.log(`[Auth] ✅ Google Login: existing user ${email}`);

      await ActivityLog.create({
        userId: user._id,
        action: 'Google Login',
        page: 'Login',
        details: `User ${user.name} authenticated via Google.`,
      });
    } else {
      // New user via Google — we don't create the account here anymore!
      // We instruct the frontend to go to the Signup flow, providing the prefill data.
      return res.status(200).json({
        success: false,
        needsSignup: true,
        prefillData: {
          name,
          email,
          picture: payload.picture || '',
          authProvider: 'google'
        }
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Auth] ❌ Google Auth Exception:', err.message);
    res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
};


module.exports = { signup, login, googleAuth };
