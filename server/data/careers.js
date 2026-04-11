const careers = {
  "software engineer": {
    domain: "Information Technology",
    title: "Software Engineer",
    overview: "A Software Engineer applies engineering principles to software development, designing, coding, testing, and maintaining software applications to solve real-world problems.",
    skills: ["Data Structures & Algorithms", "System Design", "Agile Methodologies", "Debugging & Testing", "Version Control", "Problem Solving", "Team Collaboration"],
    tools: ["Git & GitHub", "Docker", "VS Code / IntelliJ", "Jira", "CI/CD Pipelines"],
    opportunities: [
      "High demand across tech, finance, and healthcare.",
      "Expected 22% industry growth over the next decade.",
      "Average compensation is highly competitive globally."
    ],
    roadmap: [
      { step: "Foundations", desc: "Master basic programming, data structures, and algorithms." },
      { step: "Project Building", desc: "Create personal projects and learn version control using Git." },
      { step: "Advanced Concepts", desc: "Understand system design, databases, and software architecture." },
      { step: "Professional Experience", desc: "Gain experience through internships, open source, or entry-level roles." }
    ]
  },
  "data scientist": {
    domain: "Data & AI",
    title: "Data Scientist",
    overview: "Data Scientists gather, analyze, and interpret large volumes of data using statistical techniques and machine learning to help organizations make informed decisions.",
    skills: ["Statistical Modeling", "Machine Learning", "Data Mining", "Data Visualization", "Critical Thinking", "Communication"],
    tools: ["Python / R", "SQL", "Pandas & Scikit-Learn", "Tableau / PowerBI", "Jupyter Notebooks"],
    opportunities: [
      "Extremely high demand in business intelligence and AI sectors.",
      "Projected 36% growth in data science roles.",
      "Lucrative compensation for senior analysts and ML engineers."
    ],
    roadmap: [
      { step: "Mathematics & Stats", desc: "Build a strong foundation in probability, statistics, and linear algebra." },
      { step: "Data Manipulation", desc: "Learn to query databases using SQL and manipulate data with Python/Pandas." },
      { step: "Machine Learning", desc: "Study predictive algorithms, classification, and regression." },
      { step: "Real-world Analysis", desc: "Build a portfolio analyzing public datasets and sharing insights." }
    ]
  },
  "doctor": {
    domain: "Healthcare",
    title: "Medical Doctor",
    overview: "A Medical Doctor diagnoses illnesses, prescribes medications, and treats patients. They focus on maintaining health and curing diseases through scientific knowledge and clinical practice.",
    skills: ["Clinical Diagnosis", "Patient Care", "Anatomy & Physiology", "Pharmacology", "Empathy", "Decision Making Under Pressure"],
    tools: ["Electronic Health Records (EHR)", "Stethoscope & Medical Instruments", "Diagnostic Imaging Software", "Medical Reference Databases"],
    opportunities: [
      "Constant global demand and severe shortages in rural areas.",
      "Diverse specializations (Surgery, Pediatrics, Neurology).",
      "Stable, high-tier compensation and immense social impact."
    ],
    roadmap: [
      { step: "Pre-Medical Education", desc: "Complete an undergraduate degree focusing on biology, chemistry, and physics." },
      { step: "Medical School", desc: "Pass entrance exams (like MCAT) and complete 4 years of intense medical education." },
      { step: "Residency", desc: "Spend 3 to 7 years training in a specific medical specialty at a teaching hospital." },
      { step: "Licensing", desc: "Pass board exams and obtain a state medical license to practice independently." }
    ]
  },
  "lawyer": {
    domain: "Legal Services",
    title: "Lawyer",
    overview: "Lawyers provide legal advice and representation to individuals, businesses, and government agencies. They draft legal documents, interpret laws, and represent clients in court.",
    skills: ["Legal Research", "Contract Drafting", "Litigation", "Negotiation", "Persuasion", "Analytical Thinking"],
    tools: ["LexisNexis / Westlaw", "Case Management Software", "Legal Drafting Templates", "E-Discovery Tools"],
    opportunities: [
      "Consistent demand across corporate, criminal, and family law.",
      "10% projected growth rate over the decade.",
      "High earning potential, especially for corporate attorneys."
    ],
    roadmap: [
      { step: "Undergraduate Degree", desc: "Earn a bachelor's degree in any major, focusing on high academic performance." },
      { step: "Law School Admittance", desc: "Take the LSAT and attend an accredited 3-year law program (Juris Doctor)." },
      { step: "Internships/Clerkships", desc: "Gain practical experience working at a firm or alongside a judge." },
      { step: "The Bar Exam", desc: "Pass the demanding bar exam to become licensed in a specific jurisdiction." }
    ]
  },
  "ui/ux designer": {
    domain: "Design",
    title: "UI/UX Designer",
    overview: "UI/UX Designers focus on the user experience and visual interface of digital products. They ensure software is intuitive, accessible, and visually appealing.",
    skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Visual Aesthetics", "Empathy", "Communication"],
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Miro"],
    opportunities: [
      "High demand as companies prioritize user retention.",
      "Great opportunities for remote work and freelancing.",
      "Strong growth trajectory in mobile and web applications."
    ],
    roadmap: [
      { step: "Design Fundamentals", desc: "Learn color theory, typography, and layout principles." },
      { step: "UX Research", desc: "Study how to conduct user interviews, create personas, and map user journeys." },
      { step: "Tool Mastery", desc: "Become highly proficient in industry-standard tools like Figma." },
      { step: "Portfolio Development", desc: "Create comprehensive case studies showcasing your design process from problem to solution." }
    ]
  }
};

module.exports = careers;
