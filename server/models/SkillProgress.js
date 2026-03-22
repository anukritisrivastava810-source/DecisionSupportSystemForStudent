const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const skillProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  topics: [topicSchema],
  progress: { type: Number, default: 0 }, // percentage
}, { timestamps: true });

module.exports = mongoose.model('SkillProgress', skillProgressSchema);
