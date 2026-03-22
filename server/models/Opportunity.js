const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['internship', 'competition'], required: true },
  title: { type: String, required: true },
  domain: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Interested', 'Applied', 'Registered', 'Ongoing', 'Completed', 'Won', 'Not Selected'],
    default: 'Interested',
  },
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
