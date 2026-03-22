const User = require('../models/User');
const SkillProgress = require('../models/SkillProgress');
const Opportunity = require('../models/Opportunity');
const History = require('../models/History');

// @desc  Get dashboard analytics
// @route GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const [user, skills, opportunities, history] = await Promise.all([
      User.findById(userId).select('-password'),
      SkillProgress.find({ userId }),
      Opportunity.find({ userId }),
      History.findOne({ userId }),
    ]);

    const completedSkills = skills.filter(s => s.progress === 100).length;
    const inProgressSkills = skills.filter(s => s.progress > 0 && s.progress < 100).length;
    const totalOpportunities = opportunities.length;
    const completedOpportunities = opportunities.filter(o => o.status === 'Completed' || o.status === 'Won').length;
    const avgProgress = skills.length
      ? Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length)
      : 0;

    res.json({
      success: true,
      dashboard: {
        user,
        stats: {
          totalSkills: skills.length,
          completedSkills,
          inProgressSkills,
          avgProgress,
          totalOpportunities,
          completedOpportunities,
          searchCount: history?.searchHistory?.length || 0,
        },
        skills,
        opportunities,
        recentActivity: (history?.activityLogs || []).slice(-10).reverse(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboard };
