const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  // password is optional for Google-auth users
  password: { type: String, default: '' },
  domainOfInterest: { type: String, default: '' },
  educationLevel: { type: String, default: '' },
  skills: [{ type: String }],
  careerGoal: { type: String, default: '' },
  primaryDomain: { type: String, default: '' },
  skillLevel: { type: String, default: 'Beginner' },
  careerAspiration: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  learningHoursPerWeek: { type: Number, default: 5 },
  // Tracks how the account was created
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  // Onboarding fields
  profileCompleted: { type: Boolean, default: false },
  branch: { type: String, default: '' },
  yearOfStudy: { type: String, default: '' },
  academicInterests: [{ type: String }],
  careerInterests: [{ type: String }],
}, { timestamps: true });

// Hash password before saving — only when using local auth and password changed
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for local login
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users have no password
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
