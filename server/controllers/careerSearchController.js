const careersData = require('../data/careers');

/**
 * GET /api/career-search/:query
 */
exports.getCareerSearchData = async (req, res) => {
  try {
    const query = req.params.query.toLowerCase().trim();
    
    // Normalize query matching (exact match or partial matching like "software")
    const matchedKey = Object.keys(careersData).find(
      key => key === query || key.includes(query) || query.includes(key)
    );

    if (matchedKey) {
      console.log(`[CareerSearch - Static] Match found for: "${query}" -> ${matchedKey}`);
      return res.json({
        success: true,
        title: careersData[matchedKey].title,
        ...careersData[matchedKey]
      });
    }

    console.log(`[CareerSearch - Static] No match found for: "${query}". Returning fallback.`);
    
    // Fallback exactly mapping to the expected fields with a helpful message
    return res.json({
      success: true,
      title: query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      domain: "General Career Domain",
      overview: "We don't have a detailed profile for this specific role yet. A career in this space typically involves specialized training and dedication. Explore our listed domains like Web Development, Data Science, or UI/UX Design to find structured pathways.",
      skills: ["Problem Solving", "Adaptability", "Communication", "Continuous Learning"],
      tools: ["Industry Standard Software", "Communication Tools"],
      opportunities: [
        "Opportunities widely vary based on location and specific industry focus.",
        "Consider reviewing roles in our predefined 'Explore Domains' directory."
      ],
      roadmap: [
        { step: "Discovery", desc: "Identify key professionals in this space and research their entry paths." },
        { step: "Education", desc: "Seek formal education or specialized certifications." },
        { step: "Networking", desc: "Join industry groups and find mentors to guide your entry." }
      ]
    });

  } catch (error) {
    console.error("[CareerSearchController] Error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching career data."
    });
  }
};
