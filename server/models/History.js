const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  completedSkills: [{ type: String }],
  competitions: [{ type: String }],
  internships: [{ type: String }],
  searchHistory: [{ type: String }],
  activityLogs: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
