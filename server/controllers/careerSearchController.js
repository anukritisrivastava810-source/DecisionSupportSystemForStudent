/**
 * careerSearchController.js
 * Handles logic for dynamic career data retrieval and generation.
 */

// Simple predefined map for common careers
const CAREER_DEFINITIONS = {
  "web development": {
    domain: "Information Technology",
    overview: "Web development is the process of building and maintaining websites. It ranges from creating simple plain-text pages to complex web-based applications and social network services.",
    skills: {
      technical: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL/NoSQL"],
      soft: ["Problem Solving", "Collaboration", "Attention to Detail", "Communication"]
    },
    path: [
      { step: "Frontend Mastery", desc: "Learn HTML, CSS, and modern JS frameworks like React or Vue." },
      { step: "Backend Core", desc: "Understand server-side logic, APIs, and databases using Node.js or Python." },
      { step: "Full Stack Integration", desc: "Connect frontend and backend to build complete, functional web applications." }
    ],
    scope: { demand: "Very High", growth: "23% projected growth by 2031", compensation: "Highly competitive" }
  },
  "data science": {
    domain: "Data & AI",
    overview: "Data science combines math and statistics, specialized programming, advanced analytics, and machine learning to uncover actionable insights hidden in an organization's data.",
    skills: {
      technical: ["Python/R", "SQL", "Statistics", "Machine Learning", "Data Visualization"],
      soft: ["Critical Thinking", "Business Acumen", "Interpersonal Skills", "Curiosity"]
    },
    path: [
      { step: "Math Foundations", desc: "Master linear algebra, calculus, and probability." },
      { step: "Programming for Data", desc: "Become proficient in Python and data libraries like Pandas and Scikit-Learn." },
      { step: "Model Building", desc: "Learn to design, train, and evaluate machine learning models." }
    ],
    scope: { demand: "High", growth: "36% projected growth by 2031", compensation: "Top-tier" }
  }
};

/**
 * GET /api/career-search/:query
 */
exports.getCareerSearchData = async (req, res) => {
  try {
    const query = req.params.query.toLowerCase().trim();
    
    // 1. Check if we have a direct match
    if (CAREER_DEFINITIONS[query]) {
      return res.json({
        success: true,
        title: req.params.query,
        ...CAREER_DEFINITIONS[query]
      });
    }

    // 2. Logic for generic fallback
    const capitalizedTitle = query.charAt(0).toUpperCase() + query.slice(1);
    
    const genericResponse = {
      success: true,
      title: capitalizedTitle,
      domain: "Professional Development",
      overview: `A career as a ${capitalizedTitle} involves specializing in specific industry techniques and methodologies to deliver high-value outcomes. This role requires a balance of technical expertise and strategic thinking.`,
      skills: {
        technical: ["Core Industry Concepts", "Software Proficiency", "Workflow Management", "Quality Assurance"],
        soft: ["Teamwork", "Problem Solving", "Continuous Learning", "Time Management"]
      },
      path: [
        { step: "Primary Training", desc: "Gain initial certifications and foundational knowledge in this specific field." },
        { step: "Practical Application", desc: "Apply your skills through internships or entry-level roles to build a robust portfolio." },
        { step: "Specialization", desc: "Choose a niche area within this career path to deepen your expertise and increase your market value." }
      ],
      scope: {
        demand: "Growing",
        growth: "Steady increase in demand across global markets.",
        compensation: "Competitive and based on experience level."
      }
    };

    res.json(genericResponse);

  } catch (error) {
    console.error("[CareerSearchController] Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching career data."
    });
  }
};
