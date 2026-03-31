const mongoose = require('mongoose');

const trafficLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  pageVisited: { type: String, required: true },
  route: { type: String, required: true },
  duration: { type: Number, default: 0 }, // in seconds
}, { timestamps: true });

module.exports = mongoose.model('TrafficLog', trafficLogSchema);
