const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Helper to generate data using Gemini if configured
 */
async function generateAIPatway(query) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as a career counselor and academic expert.
      Generate a detailed career pathway for the profession: "${query}".
      
      Return the response in STRICT JSON format exactly matching this schema:
      {
        "domain": "Broad industry category",
        "overview": "Professional 2-3 sentence description of the role.",
        "skills": {
          "technical": ["Specific Technical Skill 1", "Specific Technical Skill 2", "Specific Technical Skill 3", "Specific Technical Skill 4", "Specific Technical Skill 5"],
          "soft": ["Soft Skill 1", "Soft Skill 2", "Soft Skill 3", "Soft Skill 4", "Soft Skill 5"]
        },
        "path": [
          { "step": "Phase Title 1", "desc": "Detailed explanation of what to do in this phase" },
          { "step": "Phase Title 2", "desc": "Detailed explanation of what to do in this phase" },
          { "step": "Phase Title 3", "desc": "Detailed explanation of what to do in this phase" }
        ],
        "scope": {
          "demand": "One word demand level (e.g. High)",
          "growth": "Short growth outlook description",
          "compensation": "General salary range description"
        }
      }

      Do NOT return markdown blocks, only the pure JSON string. Make the output extremely specific to ${query}. Provide no generic or placeholder text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown code blocks from response
    const jsonString = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("[CareerSearchAI] Failed to generate content:", err.message);
    throw new Error("GENERATION_FAILED");
  }
}

/**
 * GET /api/career-search/:query
 */
exports.getCareerSearchData = async (req, res) => {
  try {
    const query = req.params.query.toLowerCase().trim();
    
    console.log(`[CareerSearch] Initiating dynamic generation for: "${query}"`);
    
    // 1. Force AI Generation for ALL queries
    const aiData = await generateAIPatway(query);
    
    return res.json({
      success: true,
      title: query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      ...aiData
    });

  } catch (error) {
    console.error("[CareerSearchController] Error:", error.message);
    
    if (error.message === "API_KEY_MISSING") {
      return res.status(503).json({
        success: false,
        message: "Dynamic career generation requires the GEMINI_API_KEY environment variable. Please configure it to explore this profession."
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while generating data for this career. Please try again."
    });
  }
};
