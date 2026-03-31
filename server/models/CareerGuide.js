const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  stepNumber: Number,
  title: String,
  description: String,
}, { _id: false });

const flowNodeSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: { type: String, enum: ['start', 'step', 'decision', 'end'], default: 'step' },
  nextIds: [String],
}, { _id: false });

const careerGuideSchema = new mongoose.Schema({
  goalKeyword: { type: String, required: true, unique: true, trim: true },
  overview: { type: String, required: true },
  requiredSkills: [String],
  requiredHoursPerWeek: { type: Number, default: 20 },
  steps: [stepSchema],
  flowchart: [flowNodeSchema],
}, { timestamps: true });

module.exports = mongoose.model('CareerGuide', careerGuideSchema);
