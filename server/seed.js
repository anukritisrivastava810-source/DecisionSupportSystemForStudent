const mongoose = require('mongoose');
const DomainInfo = require('./models/DomainInfo');
const CareerGuide = require('./models/CareerGuide');

const MONGO_URI = process.env.MONGO_URI;

const domains = [
  {
    domain: "Web Development",
    description: "Building websites and web applications for the modern internet. Covers frontend, backend, and full-stack development.",
    skills: [{name:"HTML/CSS", level:"Basic"}, {name:"React/Next.js", level:"Core"}, {name:"Node.js", level:"Core"}, {name:"TypeScript", level:"Advanced"}],
    applications: [{title:"E-commerce", description:"Scalable online stores.", icon:"ShoppingCart"}, {title:"Social Media", description:"Community platforms.", icon:"Globe"}, {title:"SaaS", description:"Software as a Service.", icon:"Cloud"}]
  },
  {
    domain: "Artificial Intelligence",
    description: "Developing systems that simulate human intelligence, including learning, reasoning, and problem-solving.",
    skills: [{name:"Python", level:"Core"}, {name:"Mathematics", level:"Foundation"}, {name:"Machine Learning", level:"Core"}, {name:"PyTorch/TF", level:"Advanced"}],
    applications: [{title:"Healthcare AI", description:"Diagnostic assistance.", icon:"Stethoscope"}, {title:"Automation", description:"Robotic process automation.", icon:"Cpu"}, {title:"NLP", description:"Conversational agents.", icon:"MessageSquare"}]
  },
  {
    domain: "Data Science",
    description: "Extracting insights and knowledge from large datasets using statistical and computational techniques.",
    skills: [{name:"Statistics", level:"Core"}, {name:"SQL", level:"Core"}, {name:"Data Viz", level:"Intermediate"}, {name:"Predictive Modeling", level:"Advanced"}],
    applications: [{title:"FinTech", description:"Fraud detection systems.", icon:"CreditCard"}, {title:"Marketing", description:"Customer segmentation.", icon:"Target"}, {title:"Business Insights", description:"Strategic analytics.", icon:"BarChart"}]
  },
  {
    domain: "Cybersecurity",
    description: "Protecting systems, networks, and programs from digital attacks and unauthorized access.",
    skills: [{name:"Network Security", level:"Core"}, {name:"Cryptography", level:"Core"}, {name:"Ethical Hacking", level:"Advanced"}, {name:"Compliance", level:"Core"}],
    applications: [{title:"Infrastructure", description:"Securing power grids.", icon:"Shield"}, {title:"Privacy", description:"Identity protection.", icon:"Lock"}, {title:"Audit", description:"Security assessments.", icon:"FileText"}]
  },
  {
    domain: "Cloud Computing",
    description: "Delivering computing services over the internet to offer faster innovation and flexible resources.",
    skills: [{name:"AWS/Azure", level:"Core"}, {name:"Linux Admin", level:"Core"}, {name:"Serverless", level:"Advanced"}, {name:"Containers", level:"Core"}],
    applications: [{title:"Cloud Migration", description:"Moving apps to cloud.", icon:"HardDrive"}, {title:"Global Infra", description:"Scaling worldwide.", icon:"Globe"}, {title:"Auto-scaling", description:"Handling traffic spikes.", icon:"TrendingUp"}]
  },
  {
    domain: "Mobile App Development",
    description: "Creating software applications that run on mobile devices such as smartphones and tablets.",
    skills: [{name:"Swift/Kotlin", level:"Core"}, {name:"React Native", level:"Core"}, {name:"Mobile UX", level:"Core"}, {name:"App Store Optimization", level:"Intermediate"}],
    applications: [{title:"Delivery Apps", description:"Real-time tracking services.", icon:"Smartphone"}, {title:"Social Apps", description:"Connecting people on go.", icon:"Users"}, {title:"Productivity", description:"Mobile task managers.", icon:"CheckCircle"}]
  },
  {
    domain: "Blockchain",
    description: "Developing decentralized and distributed ledger systems for secure transparency.",
    skills: [{name:"Solidity", level:"Core"}, {name:"Cryptography", level:"Advanced"}, {name:"Smart Contracts", level:"Core"}, {name:"DApp Dev", level:"Advanced"}],
    applications: [{title:"Crypto Assets", description:"Wallets and exchanges.", icon:"CreditCard"}, {title:"Supply Chain", description:"Transparent tracking.", icon:"Layers"}, {title:"Voting Systems", description:"Tamper-proof voting.", icon:"Users"}]
  },
  {
    domain: "Game Development",
    description: "Designing and building interactive digital experiences and virtual environments.",
    skills: [{name:"C++/C#", level:"Core"}, {name:"Unity/Unreal", level:"Core"}, {name:"Graphics Math", level:"Advanced"}, {name:"Level Design", level:"Intermediate"}],
    applications: [{title:"AR/VR", description:"Immersive simulations.", icon:"Gamepad2"}, {title:"E-Sports", description:"Competitive platforms.", icon:"Trophy"}, {title:"Serious Games", description:"Educational training.", icon:"BookOpen"}]
  },
  {
    domain: "UI/UX Design",
    description: "Designing the look, feel, and usability of digital products and user interfaces.",
    skills: [{name:"Figma/Adobe XD", level:"Core"}, {name:"User Research", level:"Core"}, {name:"Prototyping", level:"Core"}, {name:"Design Systems", level:"Advanced"}],
    applications: [{title:"Visual Identity", description:"Brand-consistent UI.", icon:"PenTool"}, {title:"Accessibility", description:"Inclusive design.", icon:"Eye"}, {title:"UX Audit", description:"User flow optimization.", icon:"Activity"}]
  },
  {
    domain: "DevOps & Infrastructure",
    description: "Combining software development and IT operations to shorten systems development life cycle.",
    skills: [{name:"CI/CD", level:"Core"}, {name:"Terraform", level:"Core"}, {name:"Kubernetes", level:"Advanced"}, {name:"Monitoring", level:"Core"}],
    applications: [{title:"Platform Eng", description:"Self-service infrastructure.", icon:"Layers"}, {title:"Reliability", description:"Site reliability eng.", icon:"Shield"}, {title:"Automation Pipelines", description:"Streamlining release.", icon:"Zap"}]
  }
];

const goals = [
  "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "Web Developer", "App Developer", 
  "AI Engineer", "Machine Learning Engineer", "Data Scientist", "Cybersecurity Analyst", "Cloud Engineer", "UI/UX Designer", 
  "Product Manager", "Business Analyst", "Researcher", "Entrepreneur", "DevOps Engineer", "Blockchain Developer", "Game Developer", "Data Analyst"
];

const guides = goals.map(role => ({
  goalKeyword: role,
  overview: `Master the complete lifecycle of ${role} as a strategic career path. From foundational principles to advanced industry applications.`,
  requiredSkills: ["Technical Problem Solving", "Project Management", "Continuous Learning"],
  requiredHoursPerWeek: 25,
  steps: [
    { stepNumber: 1, title: "Foundation Mastery", description: `Learn the core principles and tools essential for ${role}.` },
    { stepNumber: 2, title: "Professional Projects", description: "Build 3-4 industrial-grade portfolio pieces." },
    { stepNumber: 3, title: "Industry Certifications", description: "Acquire relevant certifications to validate your skills." },
    { stepNumber: 4, title: "Career Placement", description: "Optimize your presence and land high-impact roles." }
  ],
  flowchart: [
    { id: "1", label: `Start: ${role} Path`, type: "start", nextIds: ["2"] },
    { id: "2", label: "Core Skills Phase", type: "step", nextIds: ["3"] },
    { id: "3", label: "Specialization Track", type: "step", nextIds: ["4"] },
    { id: "4", label: "Portfolio Milestone", type: "step", nextIds: ["5"] },
    { id: "5", label: "Interview Preparation", type: "step", nextIds: ["6"] },
    { id: "6", label: "Career Success", type: "end", nextIds: [] }
  ]
}));

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await DomainInfo.deleteMany({});
    await DomainInfo.insertMany(domains);
    console.log(`Seeded ${domains.length} domains`);

    await CareerGuide.deleteMany({});
    await CareerGuide.insertMany(guides);
    console.log(`Seeded ${guides.length} career guides`);

    mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seed();
