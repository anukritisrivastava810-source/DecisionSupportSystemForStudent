const CareerGuide = require('../models/CareerGuide');

/**
 * GET /api/career-guide?goal=<text>
 * Fuzzy-matches the goal text against stored goalKeywords and returns the best guide.
 */
exports.getByGoal = async (req, res) => {
  try {
    // 1. Extract potential parameters with priority
    let queryText = (
      req.query.goal || 
      req.query.domain || 
      req.query.careerGoal || 
      req.query.role || 
      ''
    ).trim();

    if (!queryText) {
      return res.status(400).json({ success: false, message: 'goal or domain query param required' });
    }

    // 2. Domain-to-Role Synonyms (mapping common domain names to seeded goalKeywords)
    const synonyms = {
      'artificial intelligence': ['ai engineer', 'machine learning engineer'],
      'web development': ['web developer', 'full stack developer', 'frontend developer', 'backend developer'],
      'ui/ux design': ['ui/ux designer'],
      'cybersecurity': ['cybersecurity analyst'],
      'data science': ['data scientist', 'data analyst'],
      'cloud computing': ['cloud engineer'],
      'mobile development': ['app developer'],
      'game development': ['game developer'],
      'blockchain': ['blockchain developer'],
      'devops': ['devops engineer']
    };

    const normalizedQuery = queryText.toLowerCase();
    let searchTerms = [normalizedQuery];

    // Add synonyms if it matches a domain
    if (synonyms[normalizedQuery]) {
      searchTerms = [...searchTerms, ...synonyms[normalizedQuery]];
    }

    // 3. Try exact or regex match against any of the terms
    let guide = await CareerGuide.findOne({
      goalKeyword: { $in: searchTerms.map(t => new RegExp(`^${t}$`, 'i')) }
    });

    // 4. Case-insensitive fuzzy keyword lookup (Robust Fallback)
    if (!guide) {
      const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
      const allGuides = await CareerGuide.find({});

      let bestScore = 0;
      let finalChoice = null;

      allGuides.forEach(g => {
        const kw = g.goalKeyword.toLowerCase();
        let score = 0;
        
        // Exact substring match gives high score
        if (kw.includes(normalizedQuery)) score += 10;
        
        // Individual word overlap
        words.forEach(w => {
          if (kw.includes(w)) score += 2;
        });

        // Inverse check (is the keyword in the user's longer query?)
        if (normalizedQuery.includes(kw)) score += 5;

        if (score > bestScore) {
          bestScore = score;
          finalChoice = g;
        }
      });

      guide = finalChoice;
    }

    if (!guide) {
      console.warn(`[CareerGuide] No match found for: "${queryText}"`);
      return res.status(404).json({ success: false, message: 'No career guide found. Try a broader term like "Software Engineer".' });
    }

    console.log(`[CareerGuide] Successfully matched "${queryText}" -> "${guide.goalKeyword}"`);
    res.json({ success: true, data: guide });
  } catch (err) {
    console.error('[CareerGuide] Search error:', err.message);
    res.status(500).json({ success: false, message: 'Server error searching roadmap.' });
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
