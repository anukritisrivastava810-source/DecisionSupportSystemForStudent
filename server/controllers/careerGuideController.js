const CareerGuide = require('../models/CareerGuide');

/**
 * GET /api/career-guide?goal=<text>
 * Fuzzy-matches the goal text against stored goalKeywords and returns the best guide.
 */
exports.getByGoal = async (req, res) => {
  try {
    const goal = (req.query.goal || '').trim();
    if (!goal) return res.status(400).json({ success: false, message: 'goal query param required' });

    // Try exact match first (case-insensitive)
    let guide = await CareerGuide.findOne({ goalKeyword: { $regex: new RegExp(goal, 'i') } });

    // Keyword-based fallback — split goal into words and check each
    if (!guide) {
      const words = goal.toLowerCase().split(/\s+/);
      const all = await CareerGuide.find({});
      guide = all.find(g =>
        words.some(w => g.goalKeyword.toLowerCase().includes(w))
      ) || null;
    }

    // Ultimate fallback — return first guide
    if (!guide) {
      guide = await CareerGuide.findOne({});
    }

    if (!guide) return res.status(404).json({ success: false, message: 'No career guide found' });
    res.json({ success: true, data: guide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const guides = await CareerGuide.find({}, 'goalKeyword overview requiredHoursPerWeek');
    res.json({ success: true, data: guides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
