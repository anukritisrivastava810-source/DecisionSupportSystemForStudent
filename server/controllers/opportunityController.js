const Opportunity = require('../models/Opportunity');
const History = require('../models/History');

// @desc  Get all opportunities for a user
// @route GET /api/opportunities
const getOpportunities = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const opportunities = await Opportunity.find({ userId });
    res.json({ success: true, opportunities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Save an opportunity
// @route POST /api/opportunities
const saveOpportunity = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const { type, title, domain, status } = req.body;
    if (!type || !title) return res.status(400).json({ success: false, message: 'Type and title are required.' });

    const opp = await Opportunity.create({ userId, type, title, domain: domain || '', status: status || 'Interested' });
    res.status(201).json({ success: true, opportunity: opp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update opportunity status
// @route PUT /api/opportunities/:id
const updateOpportunity = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const opp = await Opportunity.findOne({ _id: req.params.id, userId });
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

    const { status } = req.body;
    if (status) opp.status = status;
    await opp.save();

    // Track completed/won in history
    if (status === 'Completed' || status === 'Won') {
      const field = opp.type === 'competition' ? 'competitions' : 'internships';
      await History.findOneAndUpdate(
        { userId },
        { $addToSet: { [field]: opp.title } },
        { upsert: true }
      );
    }

    res.json({ success: true, opportunity: opp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete an opportunity
// @route DELETE /api/opportunities/:id
const deleteOpportunity = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    await Opportunity.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ success: true, message: 'Opportunity removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getOpportunities, saveOpportunity, updateOpportunity, deleteOpportunity };
