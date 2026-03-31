const mongoose = require('mongoose');

const domainInfoSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  skills: [{ name: String, level: String }],
  applications: [{ title: String, description: String, icon: String }],
}, { timestamps: true });

module.exports = mongoose.model('DomainInfo', domainInfoSchema);
