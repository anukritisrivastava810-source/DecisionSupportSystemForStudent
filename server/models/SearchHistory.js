const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  query: { type: String, required: true },
  searchType: { 
    type: String, 
    enum: ['skill', 'internship', 'competition', 'domain-focus'], 
    default: 'skill' 
  },
}, { timestamps: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
