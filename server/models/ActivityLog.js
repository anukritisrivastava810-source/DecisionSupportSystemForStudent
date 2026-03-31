const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  page: { type: String, default: '' },
  details: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
