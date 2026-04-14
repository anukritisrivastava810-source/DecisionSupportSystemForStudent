// ============================================================
// careerGoalMatcher.js
// Maps a free-text career search query to an existing app route.
// Route values correspond to page-state strings used in App.jsx.
// ============================================================

/**
 * @typedef {{ title: string, route: string, aliases: string[] }} CareerGoalEntry
 */

/** @type {CareerGoalEntry[]} */
export const CAREER_GOAL_MAP = [
  // ── Career Aspirations ──────────────────────────────────────
  // These all resolve to "career-guide" which fetches a roadmap
  // for the user's aspiration.
  {
    title: "Software Engineer",
    route: "career-guide",
    aliases: [
      "swe", "software engineering", "software developer",
      "software dev", "programmer", "coder", "developer"
    ]
  },
  {
    title: "Full Stack Developer",
    route: "career-guide",
    aliases: [
      "fullstack", "full stack", "full-stack", "mern", "mean",
      "mern stack", "mean stack", "full stack developer"
    ]
  },
  {
    title: "Frontend Developer",
    route: "career-guide",
    aliases: [
      "frontend", "front end", "front-end", "ui developer",
      "react developer", "vue developer", "angular developer",
      "web ui", "ui engineer"
    ]
  },
  {
    title: "Backend Developer",
    route: "career-guide",
    aliases: [
      "backend", "back end", "back-end", "server side",
      "server-side", "api developer", "node developer",
      "django developer", "spring developer"
    ]
  },
  {
    title: "Web Developer",
    route: "career-guide",
    aliases: [
      "web dev", "web development", "web engineer",
      "web programming", "website developer"
    ]
  },
  {
    title: "App Developer",
    route: "career-guide",
    aliases: [
      "app dev", "application developer", "mobile app",
      "app development", "app engineer"
    ]
  },
  {
    title: "AI Engineer",
    route: "career-guide",
    aliases: [
      "ai", "artificial intelligence", "ai developer",
      "ai engineer", "genai", "generative ai", "llm developer",
      "prompt engineer"
    ]
  },
  {
    title: "Machine Learning Engineer",
    route: "career-guide",
    aliases: [
      "ml", "ml engineer", "machine learning", "machine learning engineer",
      "deep learning engineer", "dl engineer", "neural networks"
    ]
  },
  {
    title: "Data Scientist",
    route: "career-guide",
    aliases: [
      "data science", "data scientist", "data analysis",
      "data engineer", "analytics engineer", "bi developer"
    ]
  },
  {
    title: "Data Analyst",
    route: "career-guide",
    aliases: [
      "data analyst", "analyst", "business analyst",
      "power bi", "tableau developer", "excel analyst"
    ]
  },
  {
    title: "Cybersecurity Analyst",
    route: "career-guide",
    aliases: [
      "cybersecurity", "cyber security", "security engineer",
      "security analyst", "ethical hacker", "penetration tester",
      "pentest", "infosec", "network security"
    ]
  },
  {
    title: "Cloud Engineer",
    route: "career-guide",
    aliases: [
      "cloud", "cloud computing", "cloud dev", "aws engineer",
      "azure engineer", "gcp engineer", "devops", "devsecops",
      "infrastructure engineer", "sre", "site reliability"
    ]
  },
  {
    title: "DevOps Engineer",
    route: "career-guide",
    aliases: [
      "devops engineer", "devops dev", "ci cd",
      "docker kubernetes", "k8s engineer", "platform engineer"
    ]
  },
  {
    title: "UI/UX Designer",
    route: "career-guide",
    aliases: [
      "ux", "ux designer", "ui designer", "ui ux",
      "product designer", "figma designer", "interaction designer",
      "design", "visual designer", "graphic designer"
    ]
  },
  {
    title: "Product Manager",
    route: "career-guide",
    aliases: [
      "pm", "product management", "product manager",
      "product owner", "po", "program manager"
    ]
  },
  {
    title: "Researcher",
    route: "career-guide",
    aliases: [
      "research", "research engineer", "research scientist",
      "phd", "academic researcher", "r&d"
    ]
  },
  {
    title: "Entrepreneur",
    route: "career-guide",
    aliases: [
      "startup", "founder", "co-founder", "entrepreneur",
      "business owner", "startup founder"
    ]
  },
  {
    title: "Blockchain Developer",
    route: "career-guide",
    aliases: [
      "blockchain", "web3", "smart contracts", "solidity",
      "dapp developer", "crypto developer", "nft developer"
    ]
  },
  {
    title: "Game Developer",
    route: "career-guide",
    aliases: [
      "game dev", "game developer", "game design",
      "unity developer", "unreal developer", "game programming"
    ]
  },

  // ── Career Goals → existing feature pages ───────────────────
  {
    title: "Get internship",
    route: "opportunities",
    aliases: [
      "internship", "find internship", "apply internship",
      "intern", "intern search", "internship search",
      "find job", "apply job", "placement"
    ]
  },
  {
    title: "Win hackathon / competition",
    route: "opportunities",
    aliases: [
      "hackathon", "competition", "contest",
      "coding contest", "hack", "compete",
      "win competition", "register hackathon"
    ]
  },
  {
    title: "Learn web development",
    route: "decision",
    aliases: [
      "learn web", "start web", "web skills",
      "html css javascript", "html css js", "react basics"
    ]
  },
  {
    title: "Improve coding skills",
    route: "decision",
    aliases: [
      "coding skills", "programming skills", "learn dsa",
      "algorithms", "leetcode", "competitive programming",
      "problem solving", "data structures"
    ]
  },
  {
    title: "Build strong project portfolio",
    route: "decision",
    aliases: [
      "portfolio", "build projects", "project ideas",
      "side projects", "github portfolio", "projects"
    ]
  },
  {
    title: "Learn data science",
    route: "decision",
    aliases: [
      "learn data science", "data science basics",
      "pandas numpy", "python for data", "data science course"
    ]
  },
  {
    title: "Explore AI / ML field",
    route: "decision",
    aliases: [
      "explore ai", "learn ai", "learn ml",
      "intro to ai", "machine learning basics", "ai basics"
    ]
  },
  {
    title: "Learn app development",
    route: "decision",
    aliases: [
      "learn mobile", "android development", "ios development",
      "flutter", "react native", "mobile dev"
    ]
  },
  {
    title: "Strengthen problem solving",
    route: "decision",
    aliases: [
      "problem solving", "logical thinking",
      "reasoning", "math for coding"
    ]
  },
  {
    title: "Build resume",
    route: "history",
    aliases: [
      "resume", "cv", "curriculum vitae",
      "resume building", "build cv", "resume tips"
    ]
  },
];

/** @type {CareerGoalEntry[]} */
export const DOMAIN_EXPLORATION_MAP = [
  {
    title: "Web Development",
    route: "domain-detail",
    aliases: ["web dev", "frontend", "backend", "fullstack", "react", "node"]
  },
  {
    title: "App Development",
    route: "domain-detail",
    aliases: ["mobile dev", "android", "ios", "flutter", "react native"]
  },
  {
    title: "Data Science",
    route: "domain-detail",
    aliases: ["data analytics", "python for data", "pandas", "data scientist"]
  },
  {
    title: "AI / ML",
    route: "domain-detail",
    aliases: ["machine learning", "artificial intelligence", "deep learning", "neural networks"]
  },
  {
    title: "Cybersecurity",
    route: "domain-detail",
    aliases: ["ethical hacking", "network security", "infosec", "pentesting"]
  },
  {
    title: "UI/UX Design",
    route: "domain-detail",
    aliases: ["product design", "figma", "user experience", "user interface"]
  },
  {
    title: "Cloud Computing",
    route: "domain-detail",
    aliases: ["aws", "azure", "gcp", "cloud engineer", "infrastructure"]
  },
  {
    title: "DevOps",
    route: "domain-detail",
    aliases: ["ci/cd", "docker", "kubernetes", "platform engineering", "sre"]
  },
  {
    title: "Product Management",
    route: "domain-detail",
    aliases: ["pm", "product owner", "agile", "scrum"]
  },
  {
    title: "Research",
    route: "domain-detail",
    aliases: ["academic research", "r&d", "phd", "scientific research"]
  },
  {
    title: "Entrepreneurship",
    route: "domain-detail",
    aliases: ["startup", "founder", "business", "innovation"]
  },
  {
    title: "Game Development",
    route: "domain-detail",
    aliases: ["game dev", "gaming", "unity", "unreal engine", "game design"]
  },
  {
    title: "Other",
    route: "domain-detail",
    aliases: ["custom", "miscellaneous", "specialized"]
  },
];

/**
 * Find the best matching career goal entry for a given query.
 *
 * Matching priority:
 *   1. Exact title match (case-insensitive)
 *   2. Exact alias match (case-insensitive)
 *   3. Query fully contained in an alias or vice-versa (substring)
 *
 * @param {string} query - Raw user search input
 * @returns {CareerGoalEntry | null}
 */
export function findCareerMatch(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const ALL_MAPS = [...CAREER_GOAL_MAP, ...DOMAIN_EXPLORATION_MAP];

  // Pass 1 — exact title match
  const exactTitle = ALL_MAPS.find(
    item => item.title.toLowerCase() === q
  );
  if (exactTitle) return exactTitle;

  // Pass 2 — exact alias match
  const exactAlias = ALL_MAPS.find(
    item => item.aliases.some(a => a.toLowerCase() === q)
  );
  if (exactAlias) return exactAlias;

  // Pass 3 — substring: query contains alias OR alias contains query
  const substring = ALL_MAPS.find(item =>
    item.aliases.some(a => {
      const al = a.toLowerCase();
      return q.includes(al) || al.includes(q);
    })
  );
  if (substring) return substring;

  return null;
}
