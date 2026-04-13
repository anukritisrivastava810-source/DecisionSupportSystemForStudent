const mongoose = require('mongoose');

/**
 * OpportunityCatalog — global catalog of competitions & internships.
 * Separate from the per-user Opportunity model (which tracks status).
 * Compound unique index on (title + type) prevents duplicates on re-seed.
 */
const opportunityCatalogSchema = new mongoose.Schema({
  type:        { type: String, enum: ['competition', 'internship'], required: true },
  title:       { type: String, required: true },
  org:         { type: String, default: '' },
  domain:      { type: String, default: '' },
  description: { type: String, default: '' },
  url:         { type: String, default: '' },
  category:    { type: String, default: '' },   // e.g. hackathon, coding, olympiad
  tags:        { type: [String], default: [] },
  status:      { type: String, default: 'Live' }, // Live / Closed / Recent / Expired
  eventType:   { type: String, default: '' },     // Online / Offline / Hybrid
  payment:     { type: String, default: '' },
  teamSize:    { type: String, default: '' },
  location:    { type: String, default: '' },
  workType:    { type: String, default: '' },
  duration:    { type: String, default: '' },
  stipend:     { type: String, default: '' },
  role:        { type: String, default: '' },
  source:      { type: String, default: 'curated' },
  datePosted:  { type: String, default: '' },
}, { timestamps: true });

// Prevent duplicate entries: same title + type combination
opportunityCatalogSchema.index({ title: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('OpportunityCatalog', opportunityCatalogSchema);
