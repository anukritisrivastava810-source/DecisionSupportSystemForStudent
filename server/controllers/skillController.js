const SkillProgress = require('../models/SkillProgress');
const History = require('../models/History');
const ActivityLog = require('../models/ActivityLog');

// Helper to recalculate progress
const calcProgress = (topics) => {
  if (!topics.length) return 0;
  return Math.round((topics.filter(t => t.completed).length / topics.length) * 100);
};

// @desc  Get all skills for a user
// @route GET /api/skills
const getSkills = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });
    const skills = await SkillProgress.find({ userId });
    res.json({ success: true, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add a new skill
// @route POST /api/skills
const addSkill = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const { skillName, topics } = req.body;
    if (!skillName) return res.status(400).json({ success: false, message: 'Skill name is required.' });

    const existing = await SkillProgress.findOne({ userId, skillName });
    if (existing) return res.status(400).json({ success: false, message: 'Skill already added.' });

    const topicsList = (topics || []).map(t => ({ name: t, completed: false }));
    const skill = await SkillProgress.create({
      userId,
      skillName,
      topics: topicsList,
      progress: 0,
    });

    // Log Activity
    await ActivityLog.create({
      userId,
      action: 'Added Skill',
      page: 'Decision',
      details: `Started learning ${skillName}`,
    });

    res.status(201).json({ success: true, skill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update topic completion / skill progress
// @route PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const skill = await SkillProgress.findOne({ _id: req.params.id, userId });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });

    const { topics } = req.body;
    if (topics) {
      skill.topics = topics;
      skill.progress = calcProgress(topics);
    }

    await skill.save();

    // If skill is 100% complete, log it in history
    if (skill.progress === 100) {
      await History.findOneAndUpdate(
        { userId },
        { $addToSet: { completedSkills: skill.skillName } },
        { upsert: true }
      );
      // Log Activity
      await ActivityLog.create({
        userId,
        action: 'Completed Skill',
        page: 'Decision',
        details: `Mastered ${skill.skillName}`,
      });
    }

    // Regular progress update log
    await ActivityLog.create({
      userId,
      action: 'Updated Progress',
      page: 'Decision',
      details: `${skill.skillName} progress: ${skill.progress}%`,
    });

    res.json({ success: true, skill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete a skill
// @route DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {
    const userId = req.headers['userid'];
    await SkillProgress.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSkills, addSkill, updateSkill, deleteSkill };
