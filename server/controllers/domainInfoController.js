const DomainInfo = require('../models/DomainInfo');

// GET /api/domain-info  — all domains
exports.getAll = async (req, res) => {
  try {
    const domains = await DomainInfo.find({});
    res.json({ success: true, data: domains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/domain-info/:domain  — single domain (case-insensitive)
exports.getByDomain = async (req, res) => {
  try {
    const domainName = decodeURIComponent(req.params.domain);
    const doc = await DomainInfo.findOne({
      domain: { $regex: new RegExp(`^${domainName}$`, 'i') }
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
