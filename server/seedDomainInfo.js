/**
 * Seed script — populates DomainInfo collection in MongoDB.
 * Run once: node seedDomainInfo.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DomainInfo = require('./models/DomainInfo');

const connectDB = require('./config/db');

const DOMAIN_DATA = [
  {
    domain: 'Web Development',
    description:
      'Web Development is the process of building and maintaining websites and web applications that run in a browser. It covers everything from simple static pages to complex, full-stack applications powering millions of users. Web developers work on the frontend (what users see), backend (server logic & databases), or both — often called "full-stack development". The field is one of the most in-demand technical disciplines globally, with a vibrant open-source ecosystem and rapid evolution driven by frameworks like React, Next.js, and Node.js.',
    skills: [
      { name: 'HTML & CSS', level: 'Foundation' },
      { name: 'JavaScript (ES6+)', level: 'Core' },
      { name: 'React.js / Vue.js / Angular', level: 'Advanced' },
      { name: 'Node.js & Express', level: 'Backend Core' },
      { name: 'REST APIs & GraphQL', level: 'Intermediate' },
      { name: 'MongoDB / PostgreSQL / MySQL', level: 'Databases' },
      { name: 'Git & GitHub', level: 'Essential' },
      { name: 'Responsive Design & Accessibility', level: 'Best Practices' },
      { name: 'Docker & CI/CD Basics', level: 'DevOps Basics' },
      { name: 'TypeScript', level: 'Advanced' },
    ],
    applications: [
      { title: 'E-Commerce Platforms', description: 'Building scalable online stores like Amazon, Flipkart, and Shopify with seamless checkout and inventory systems.', icon: '🛒' },
      { title: 'SaaS Products', description: 'Powering subscription-based software products used by businesses worldwide — from CRMs to analytics dashboards.', icon: '☁️' },
      { title: 'Social Media & Communities', description: 'Developing platforms like Instagram, Reddit, and LinkedIn where millions connect, share, and collaborate.', icon: '🌐' },
      { title: 'EdTech Systems', description: 'Creating learning management systems (LMS) and online course platforms like Coursera and Udemy.', icon: '📚' },
      { title: 'FinTech Applications', description: 'Building secure banking portals, payment gateways, and financial dashboards for institutions like Paytm and Razorpay.', icon: '💳' },
      { title: 'Healthcare Portals', description: 'Developing patient record systems, telemedicine platforms, and appointment booking websites.', icon: '🏥' },
    ],
  },
  {
    domain: 'Artificial Intelligence',
    description:
      'Artificial Intelligence (AI) is the simulation of human intelligence in machines — enabling them to reason, learn, problem-solve, and perceive the world. Modern AI encompasses machine learning (ML), deep learning, natural language processing (NLP), computer vision, and reinforcement learning. AI is transforming every industry, from healthcare diagnostics to autonomous vehicles, and is considered the defining technology of the 21st century. A career in AI offers extraordinary research depth and highly lucrative industry opportunities.',
    skills: [
      { name: 'Python Programming', level: 'Foundation' },
      { name: 'Linear Algebra & Statistics', level: 'Mathematical Core' },
      { name: 'Machine Learning (Scikit-learn)', level: 'Core' },
      { name: 'Deep Learning (TensorFlow / PyTorch)', level: 'Advanced' },
      { name: 'Natural Language Processing (NLP)', level: 'Specialization' },
      { name: 'Computer Vision (OpenCV, YOLO)', level: 'Specialization' },
      { name: 'Data Preprocessing & Feature Engineering', level: 'Essential' },
      { name: 'Model Deployment (Flask, FastAPI)', level: 'Intermediate' },
      { name: 'MLOps & Monitoring', level: 'Advanced' },
      { name: 'Prompt Engineering & LLMs', level: 'Emerging' },
    ],
    applications: [
      { title: 'Healthcare Diagnostics', description: 'AI models diagnose diseases from medical scans (MRI, X-ray) with accuracy matching human radiologists.', icon: '🩺' },
      { title: 'Autonomous Vehicles', description: 'Self-driving cars by Tesla and Waymo rely on AI perception, planning, and control systems.', icon: '🚗' },
      { title: 'Conversational AI', description: 'Chatbots and virtual assistants (ChatGPT, Alexa, Siri) that understand and respond in natural language.', icon: '🤖' },
      { title: 'Fraud Detection', description: 'Banks and payment companies use AI to detect anomalous transactions in real time.', icon: '🔒' },
      { title: 'Recommendation Systems', description: 'Netflix, Spotify, and Amazon personalize content using collaborative filtering and deep learning.', icon: '🎯' },
      { title: 'Generative AI & Content Creation', description: 'Image generation (DALL·E, Midjourney), code generation (Copilot), and video synthesis are reshaping creative industries.', icon: '🎨' },
    ],
  },
  {
    domain: 'Data Science',
    description:
      'Data Science is the interdisciplinary field that uses mathematics, statistics, programming, and domain knowledge to extract meaningful insights from large datasets. Data scientists design experiments, clean and transform raw data, build predictive models, and communicate findings to stakeholders through visualizations and reports. With the explosion of big data, data science has become a critical function in virtually every industry, driving decisions from marketing strategy to supply-chain optimization.',
    skills: [
      { name: 'Python & R Programming', level: 'Foundation' },
      { name: 'Statistics & Probability', level: 'Core' },
      { name: 'Pandas & NumPy', level: 'Essential' },
      { name: 'Data Visualization (Matplotlib, Seaborn, Tableau)', level: 'Communication' },
      { name: 'SQL & NoSQL Databases', level: 'Data Engineering' },
      { name: 'Machine Learning (Scikit-learn)', level: 'Modeling' },
      { name: 'Big Data (Spark, Hadoop)', level: 'Advanced' },
      { name: 'A/B Testing & Experimentation', level: 'Analytical' },
      { name: 'Feature Engineering', level: 'Performance' },
      { name: 'Business Intelligence & Dashboarding', level: 'Applied' },
    ],
    applications: [
      { title: 'Business Analytics & BI', description: 'Companies use data science to monitor KPIs, forecast revenue, and guide strategic decisions via dashboards.', icon: '📊' },
      { title: 'Healthcare & Genomics', description: 'Analysing patient data and genomic sequences to discover disease patterns and personalise treatments.', icon: '🧬' },
      { title: 'Sports Analytics', description: 'Teams like the IPL franchises and NBA clubs use player performance data to optimise fitness, selection, and game strategy.', icon: '🏏' },
      { title: 'Climate & Environmental Research', description: 'Data scientists analyse satellite imagery and sensor data to model climate change and predict natural disasters.', icon: '🌍' },
      { title: 'Marketing & Customer Insights', description: 'Segmenting customers, predicting churn, and measuring campaign ROI using behavioural and transactional data.', icon: '📣' },
      { title: 'Supply Chain Optimisation', description: 'Predicting demand, reducing waste, and improving logistics with time-series forecasting and optimisation algorithms.', icon: '🏭' },
    ],
  },
  {
    domain: 'Cybersecurity',
    description:
      'Cybersecurity is the practice of protecting systems, networks, data, and programs from digital attacks, unauthorised access, and damage. As the world becomes increasingly digital, the attack surface grows exponentially — making cybersecurity professionals among the most sought-after in the tech industry. The field spans offensive security (ethical hacking, penetration testing) and defensive security (incident response, security engineering, compliance), offering diverse career paths and critical societal importance.',
    skills: [
      { name: 'Networking Fundamentals (TCP/IP, DNS, HTTP)', level: 'Foundation' },
      { name: 'Linux & Bash Scripting', level: 'Essential' },
      { name: 'Ethical Hacking & Penetration Testing', level: 'Offensive' },
      { name: 'Cryptography & PKI', level: 'Core' },
      { name: 'Web Application Security (OWASP Top 10)', level: 'Applied' },
      { name: 'SIEM & Log Analysis', level: 'Defensive' },
      { name: 'Incident Response & Forensics', level: 'Advanced' },
      { name: 'Cloud Security (AWS, Azure)', level: 'Specialization' },
      { name: 'Python / Go for Security Tools', level: 'Automation' },
      { name: 'Compliance & Risk Management (ISO 27001, GDPR)', level: 'Governance' },
    ],
    applications: [
      { title: 'Penetration Testing', description: 'Ethical hackers simulate real-world attacks to find and fix vulnerabilities before malicious actors exploit them.', icon: '🔓' },
      { title: 'Banking & Financial Security', description: 'Protecting core banking systems, preventing fraud, and securing digital payment infrastructure.', icon: '🏦' },
      { title: 'National Defence & Intelligence', description: 'Governments invest heavily in cyber warfare capabilities and protecting critical national infrastructure (power grids, water systems).', icon: '🛡️' },
      { title: 'Cloud & DevSecOps', description: 'Embedding security into CI/CD pipelines and cloud configurations to prevent misconfigurations and data breaches.', icon: '☁️' },
      { title: 'Threat Intelligence', description: 'Monitoring the dark web and threat feeds to proactively detect and neutralise emerging threats.', icon: '🕵️' },
      { title: 'IoT & Embedded Security', description: 'Securing connected devices (smart home, medical devices, industrial control systems) against remote exploitation.', icon: '📡' },
    ],
  },
  {
    domain: 'Cloud Computing',
    description:
      'Cloud Computing is the delivery of computing services — including servers, storage, databases, networking, software, analytics, and AI — over the internet ("the cloud"). It enables businesses and individuals to access powerful infrastructure on-demand without owning physical hardware, drastically reducing costs and enabling global scalability. The three leading providers — AWS, Microsoft Azure, and Google Cloud — collectively generate hundreds of billions in revenue, and cloud skills are now foundational for modern software engineering.',
    skills: [
      { name: 'Linux & Networking', level: 'Foundation' },
      { name: 'AWS / Azure / GCP Core Services', level: 'Platform Knowledge' },
      { name: 'Infrastructure as Code (Terraform, CloudFormation)', level: 'Automation' },
      { name: 'Docker & Kubernetes', level: 'Containerization' },
      { name: 'CI/CD Pipelines (GitHub Actions, Jenkins)', level: 'DevOps' },
      { name: 'Cloud Security & IAM', level: 'Security' },
      { name: 'Serverless Architecture (Lambda, Azure Functions)', level: 'Advanced' },
      { name: 'Monitoring & Observability (CloudWatch, Prometheus)', level: 'Operations' },
      { name: 'Cost Optimisation & FinOps', level: 'Management' },
      { name: 'Cloud Architect Certifications (AWS SAA, CKA)', level: 'Certification' },
    ],
    applications: [
      { title: 'Scalable Web Hosting', description: 'Companies host websites and APIs on cloud platforms that auto-scale to handle traffic spikes without downtime.', icon: '🌐' },
      { title: 'Big Data & Analytics Pipelines', description: 'Processing petabytes of data using managed services like AWS Redshift, Google BigQuery, and Azure Synapse.', icon: '📊' },
      { title: 'Disaster Recovery & Backup', description: 'Using cloud replication and geo-redundancy to ensure business continuity against hardware failure or natural disasters.', icon: '🔄' },
      { title: 'AI/ML Model Training', description: 'Renting GPU clusters on AWS, Azure, or GCP to train large language models and computer vision systems cost-effectively.', icon: '🤖' },
      { title: 'Enterprise SaaS', description: 'Products like Office 365, Salesforce, and Slack are built entirely on cloud infrastructure and serve millions concurrently.', icon: '🏢' },
      { title: 'Edge Computing & IoT', description: 'Pushing computation closer to devices (factories, hospitals, vehicles) using AWS Outposts and Azure Arc for low-latency processing.', icon: '⚡' },
    ],
  },
  {
    domain: 'Mobile Development',
    description:
      'Mobile Development is the creation of software applications that run on mobile devices such as smartphones and tablets. With over 6 billion smartphone users globally, mobile apps have become the primary interface between businesses and their customers. Developers can choose native development (Swift for iOS, Kotlin for Android) for maximum performance, or cross-platform frameworks (React Native, Flutter) to share code across platforms. Mobile development blends UI/UX design, backend integration, performance optimisation, and platform-specific APIs.',
    skills: [
      { name: 'Swift (iOS) / Kotlin (Android)', level: 'Native Core' },
      { name: 'React Native or Flutter', level: 'Cross-Platform' },
      { name: 'Mobile UI/UX Design Principles', level: 'Design' },
      { name: 'REST API Integration', level: 'Networking' },
      { name: 'State Management (Redux, Riverpod)', level: 'Architecture' },
      { name: 'SQLite / Realm / Firebase', level: 'Local Storage' },
      { name: 'Push Notifications & Background Tasks', level: 'Platform APIs' },
      { name: 'App Store / Play Store Deployment', level: 'Publishing' },
      { name: 'Performance Profiling & Optimisation', level: 'Advanced' },
      { name: 'Device Sensors & Hardware APIs', level: 'Specialization' },
    ],
    applications: [
      { title: 'Consumer Apps (Social, Entertainment)', description: 'Apps like Instagram, YouTube, and TikTok reach billions of users on mobile-first experiences.', icon: '📱' },
      { title: 'FinTech & Payments', description: 'Mobile banking apps (PhonePe, GPay, Paytm) handle trillions in digital payments and financial services.', icon: '💰' },
      { title: 'HealthTech & Fitness', description: 'Apps like MyFitnessPal, HealthifyMe, and hospital patient portals bring healthcare to users\' pockets.', icon: '\u{1f3c3}' },
      { title: 'On-Demand Services', description: 'Uber, Swiggy, Zomato, and Urban Company connect service providers with customers using real-time GPS and matching.', icon: '🛵' },
      { title: 'EdTech & E-Learning', description: 'BYJU\'S, Duolingo, and Unacademy deliver interactive learning experiences optimised for touch-based mobile interfaces.', icon: '📖' },
      { title: 'AR & Location-Based Apps', description: 'Augmented reality apps (Snapchat filters, Google Maps AR navigation) and geo-fencing apps for retail and logistics.', icon: '📍' },
    ],
  },
  {
    domain: 'Game Development',
    description:
      'Game Development is the art and science of creating interactive entertainment experiences — from mobile casual games to AAA console blockbusters and immersive VR worlds. It combines programming, mathematics, art, sound design, and narrative storytelling. Game engines like Unity and Unreal Engine have democratised development, enabling indie developers to produce world-class games. The global gaming market exceeds $200 billion annually, and game development skills increasingly overlap with simulation, training, and metaverse applications.',
    skills: [
      { name: 'Unity (C#) or Unreal Engine (C++/Blueprints)', level: 'Engine Core' },
      { name: 'Mathematics (Linear Algebra, Trigonometry)', level: 'Foundation' },
      { name: 'Physics Simulation & Collision Detection', level: 'Game Physics' },
      { name: '2D / 3D Art & Animation Pipelines', level: 'Art Integration' },
      { name: 'Shader Programming (GLSL/HLSL)', level: 'Graphics' },
      { name: 'Multiplayer Networking (Photon, Mirror)', level: 'Multiplayer' },
      { name: 'Game AI (Pathfinding, Behaviour Trees)', level: 'AI Systems' },
      { name: 'Audio Integration (FMOD, Unity Audio)', level: 'Sound Design' },
      { name: 'Optimisation & Memory Management', level: 'Performance' },
      { name: 'Game Design Principles & Level Design', level: 'Design Thinking' },
    ],
    applications: [
      { title: 'Console & PC Gaming', description: 'AAA studios like EA, Rockstar, and CD Projekt Red ship billions in revenue with titles like FIFA, GTA, and Cyberpunk 2077.', icon: '🎮' },
      { title: 'Mobile Gaming', description: 'Casual and hyper-casual games (PUBG Mobile, Among Us, Clash of Clans) dominate app store charts and revenue globally.', icon: '📱' },
      { title: 'VR & AR Experiences', description: 'Immersive training simulations for surgery, military, and industrial tasks, as well as entertainment via Oculus and PlayStation VR.', icon: '🥽' },
      { title: 'Gamification in EdTech', description: 'Platforms like Duolingo, Khan Academy, and corporate LMS tools use game mechanics to improve engagement and retention.', icon: '🏆' },
      { title: 'Serious Games & Simulation', description: 'Defence organisations, hospitals, and airlines use game engines to train personnel in realistic, low-risk virtual environments.', icon: '✈️' },
      { title: 'Metaverse & Virtual Worlds', description: 'Platforms like Roblox, Decentraland, and Meta Horizons are building persistent virtual economies and social spaces.', icon: '🌐' },
    ],
  },
  {
    domain: 'Other',
    description:
      'Exploring a unique or interdisciplinary domain puts you at the cutting edge of innovation, where the most creative and impactful breakthroughs often happen. Whether you are combining biology with computing, art with technology, or forging a niche specialisation, the ability to bridge multiple domains is an increasingly rare and valuable skill. Students in "other" domains often become pioneers in emerging fields that have not yet been formally defined.',
    skills: [
      { name: 'Critical Thinking & Problem Solving', level: 'Foundation' },
      { name: 'Research Methodology', level: 'Core' },
      { name: 'Interdisciplinary Communication', level: 'Soft Skill' },
      { name: 'Data Literacy & Basic Analytics', level: 'Essential' },
      { name: 'Domain-Specific Programming (Python/R/MATLAB)', level: 'Applied' },
      { name: 'Project Management & Agile', level: 'Process' },
      { name: 'Technical Writing & Documentation', level: 'Communication' },
      { name: 'Entrepreneurship & Innovation', level: 'Advanced' },
    ],
    applications: [
      { title: 'Interdisciplinary Research', description: 'Combining expertise from two or more fields to tackle complex problems no single discipline can solve alone.', icon: '🔬' },
      { title: 'Social Entrepreneurship', description: 'Using technology and domain expertise to build solutions that address education, healthcare, and sustainability challenges.', icon: '🌱' },
      { title: 'Creative Technology', description: 'Digital art, generative media, interactive installations, and music technology that push the boundaries of human expression.', icon: '🎨' },
      { title: 'Policy & Governance', description: 'Informing technology regulation, data privacy laws, and digital infrastructure policy at government and institutional levels.', icon: '🏛️' },
    ],
  },
];

async function seed() {
  await connectDB();
  console.log('🌱 Seeding DomainInfo collection...');
  for (const item of DOMAIN_DATA) {
    await DomainInfo.findOneAndUpdate(
      { domain: item.domain },
      item,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✅ ${item.domain}`);
  }
  console.log('🎉 Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
