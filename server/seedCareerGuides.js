/**
 * Seed script — populates CareerGuide collection in MongoDB.
 * Run once: node seedCareerGuides.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const CareerGuide = require('./models/CareerGuide');
const connectDB = require('./config/db');

const CAREER_GUIDES = [
  {
    goalKeyword: 'Full Stack Developer',
    overview: 'A Full Stack Developer builds both the frontend (what users see) and the backend (servers, databases, APIs). This role is highly versatile and in demand across startups and enterprises. Mastery requires proficiency in at least one frontend framework, a backend runtime, and a database — along with deployment and version control skills.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'TypeScript'],
    requiredHoursPerWeek: 25,
    steps: [
      { stepNumber: 1, title: 'Master HTML, CSS & JavaScript', description: 'Build a solid foundation with semantic HTML, responsive CSS, and ES6+ JavaScript. Complete at least 3 full projects.' },
      { stepNumber: 2, title: 'Learn a Frontend Framework', description: 'Choose React.js or Vue.js and build dynamic, component-based user interfaces. Understand state management (Redux or Context API).' },
      { stepNumber: 3, title: 'Learn Backend Development', description: 'Study Node.js and Express.js to build RESTful APIs. Understand routing, middleware, authentication (JWT), and error handling.' },
      { stepNumber: 4, title: 'Master Databases', description: 'Learn MongoDB for NoSQL and PostgreSQL/MySQL for relational data. Understand schemas, queries, indexing, and ORMs like Mongoose or Sequelize.' },
      { stepNumber: 5, title: 'Build Full-Stack Projects', description: 'Create 2–3 complete applications with frontend + backend + database integration. Deploy them on platforms like Vercel, Railway, or AWS.' },
      { stepNumber: 6, title: 'Learn DevOps Basics & System Design', description: 'Understand Docker, CI/CD pipelines, environment configuration, and basic cloud deployment. Study system design concepts for scalability.' },
      { stepNumber: 7, title: 'Build Your Portfolio & Apply', description: 'Create a professional portfolio, contribute to open source, and target full-stack roles at companies.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'HTML / CSS / JS', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'React / Vue Frontend', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'Node.js + Express API', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'Database (MongoDB / SQL)', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Build Full-Stack Projects?', type: 'decision', nextIds: ['s5', 'redo'] },
      { id: 'redo', label: 'Revisit Weak Areas', type: 'step', nextIds: ['d1'] },
      { id: 's5', label: 'DevOps / Deployment', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Full Stack Developer', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'AI/ML Engineer',
    overview: 'A Machine Learning / AI Engineer designs and trains intelligent systems that learn from data to make predictions, decisions, or generate content. The role demands strong mathematical foundations, programming expertise, and the ability to deploy models at scale. It is one of the fastest-growing and highest-paying fields in technology.',
    requiredSkills: ['Python', 'Linear Algebra', 'Statistics', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Preprocessing', 'Feature Engineering', 'SQL', 'MLOps', 'Docker', 'FastAPI'],
    requiredHoursPerWeek: 30,
    steps: [
      { stepNumber: 1, title: 'Python & Mathematics', description: 'Strengthen Python programming and study Linear Algebra, Calculus, Probability, and Statistics — these are the backbone of all ML algorithms.' },
      { stepNumber: 2, title: 'Core Machine Learning', description: 'Study supervised, unsupervised, and reinforcement learning algorithms using Scikit-learn. Work on real datasets from Kaggle.' },
      { stepNumber: 3, title: 'Deep Learning', description: 'Learn neural networks, CNNs, RNNs, and Transformers using TensorFlow or PyTorch. Build image classifiers, NLP models, and LLM fine-tuning projects.' },
      { stepNumber: 4, title: 'Specialization', description: 'Choose a domain: Computer Vision, NLP, Reinforcement Learning, or Generative AI. Build 2–3 deep domain projects.' },
      { stepNumber: 5, title: 'MLOps & Deployment', description: 'Learn to deploy models using FastAPI, Docker, and cloud platforms (AWS SageMaker / GCP Vertex AI). Set up monitoring and retraining pipelines.' },
      { stepNumber: 6, title: 'Research & Contributions', description: 'Read papers on arxiv, reproduce SOTA results, contribute to open source ML libraries, and publish your findings.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Python + Math Foundations', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Core ML Algorithms', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'Deep Learning (CNN/RNN/Transformers)', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Choose Specialization', type: 'decision', nextIds: ['s4a', 's4b'] },
      { id: 's4a', label: 'NLP / GenAI Track', type: 'step', nextIds: ['s5'] },
      { id: 's4b', label: 'Computer Vision Track', type: 'step', nextIds: ['s5'] },
      { id: 's5', label: 'MLOps & Deployment', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'AI/ML Engineer', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'Data Scientist',
    overview: 'A Data Scientist turns raw data into business insights using statistics, machine learning, and data visualization. They collaborate with stakeholders to frame analytical questions, design experiments, build models, and communicate results. The role sits at the intersection of analytics, engineering, and storytelling.',
    requiredSkills: ['Python', 'R', 'Statistics', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Tableau', 'Machine Learning', 'A/B Testing', 'Feature Engineering', 'Spark'],
    requiredHoursPerWeek: 22,
    steps: [
      { stepNumber: 1, title: 'Python & Statistical Foundations', description: 'Learn Python with Pandas and NumPy for data manipulation. Study descriptive statistics, probability distributions, and hypothesis testing.' },
      { stepNumber: 2, title: 'Data Wrangling & SQL', description: 'Master the art of cleaning, joining, and transforming messy real-world data using SQL and Pandas. Practice with public datasets.' },
      { stepNumber: 3, title: 'Exploratory Data Analysis & Visualization', description: 'Use Matplotlib, Seaborn, and Plotly to find patterns. Learn Tableau or Power BI for business dashboards.' },
      { stepNumber: 4, title: 'Machine Learning for Data Science', description: 'Apply regression, classification, clustering, and time-series models to business problems. Focus on interpretability and feature engineering.' },
      { stepNumber: 5, title: 'A/B Testing & Experimentation', description: 'Design and analyse controlled experiments. Understand statistical significance, p-values, and effect sizes.' },
      { stepNumber: 6, title: 'Communication & Business Storytelling', description: 'Present findings to non-technical stakeholders with narratives, visualisations, and clear recommendations.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Python + Statistics', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'SQL & Data Wrangling', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'EDA & Visualisation', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'ML for Business Problems', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Insight actionable?', type: 'decision', nextIds: ['s5', 'redo'] },
      { id: 'redo', label: 'Refine Analysis', type: 'step', nextIds: ['d1'] },
      { id: 's5', label: 'Present & Communicate', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Data Scientist', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'Cybersecurity Analyst',
    overview: 'A Cybersecurity Analyst protects organisations from digital threats by monitoring systems, investigating incidents, and implementing security controls. The field spans offensive security (ethical hacking) and defensive security (SOC analysis, incident response). With cyber threats surging globally, demand for skilled analysts far outpaces supply.',
    requiredSkills: ['Networking', 'Linux', 'Python', 'Ethical Hacking', 'Cryptography', 'SIEM', 'Wireshark', 'Metasploit', 'Incident Response', 'Cloud Security', 'OWASP', 'Risk Management'],
    requiredHoursPerWeek: 20,
    steps: [
      { stepNumber: 1, title: 'Networking & OS Fundamentals', description: 'Understand TCP/IP, DNS, HTTP/S, firewalls, and VPNs. Get comfortable with Linux command line and Windows Server administration.' },
      { stepNumber: 2, title: 'Security Fundamentals', description: 'Study cryptography (symmetric, asymmetric, PKI), authentication mechanisms, and access control models. Get a CompTIA Security+ or CEH foundation.' },
      { stepNumber: 3, title: 'Ethical Hacking & Penetration Testing', description: 'Practice on TryHackMe and HackTheBox. Learn Metasploit, Nmap, Burp Suite, and web app attack vectors (OWASP Top 10).' },
      { stepNumber: 4, title: 'Defensive Security & SOC Operations', description: 'Set up SIEM tools (Splunk, ELK Stack), analyse logs, write detection rules, and simulate incident response workflows.' },
      { stepNumber: 5, title: 'Cloud & DevSecOps Security', description: 'Learn to secure AWS/Azure environments, audit IAM policies, and integrate security into CI/CD pipelines.' },
      { stepNumber: 6, title: 'Certifications & Specialisation', description: 'Target CEH, OSCP, or CISSP certifications. Specialise in Red Team, Blue Team, Cloud Security, or GRC.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Networking + Linux Fundamentals', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Security Concepts + Cryptography', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Offensive or Defensive?', type: 'decision', nextIds: ['s3a', 's3b'] },
      { id: 's3a', label: 'Penetration Testing (Red Team)', type: 'step', nextIds: ['s4'] },
      { id: 's3b', label: 'SOC / Blue Team', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'Cloud Security + Certifications', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Cybersecurity Analyst', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'Cloud Architect',
    overview: 'A Cloud Architect designs scalable, reliable, and cost-efficient cloud infrastructure on platforms like AWS, Azure, or GCP. They translate business requirements into technical blueprints, define security boundaries, and oversee the migration of on-premises systems to the cloud. This is a senior, high-impact role typically reached after 3–5 years in cloud engineering.',
    requiredSkills: ['Linux', 'Networking', 'AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud Security', 'Serverless', 'Cost Optimisation', 'System Design'],
    requiredHoursPerWeek: 25,
    steps: [
      { stepNumber: 1, title: 'Linux, Networking & Scripting', description: 'Master Linux administration, TCP/IP networking, and scripting with Bash and Python — the foundation of every cloud role.' },
      { stepNumber: 2, title: 'Core Cloud Services (AWS/Azure/GCP)', description: 'Earn an Associate-level cloud certification (AWS SAA, AZ-900). Understand compute (EC2/VMs), storage (S3/Blobs), databases (RDS), and networking (VPC).' },
      { stepNumber: 3, title: 'Infrastructure as Code', description: 'Learn Terraform and AWS CloudFormation to define and version infrastructure declaratively. Automate environment provisioning.' },
      { stepNumber: 4, title: 'Containers & Orchestration', description: 'Master Docker containerisation and Kubernetes orchestration. Understand Helm charts, service meshes, and stateful workloads.' },
      { stepNumber: 5, title: 'DevOps & CI/CD', description: 'Build pipelines with GitHub Actions or Jenkins. Implement blue-green deployments, canary releases, and automated testing.' },
      { stepNumber: 6, title: 'Architecture & Cost Optimisation', description: 'Study the Well-Architected Framework. Design multi-region, highly available systems. Analyse and reduce cloud spending with FinOps practices.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Linux + Networking + Scripting', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Cloud Core Services (Certification)', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'Terraform / IaC', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'Docker + Kubernetes', type: 'step', nextIds: ['s5'] },
      { id: 's5', label: 'CI/CD Pipelines', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Architect-level Design Ready?', type: 'decision', nextIds: ['s6', 'redo'] },
      { id: 'redo', label: 'Deepen Platform Knowledge', type: 'step', nextIds: ['d1'] },
      { id: 's6', label: 'Cost Optimisation & Architecture', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Cloud Architect', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'Mobile App Developer',
    overview: 'A Mobile App Developer creates applications for smartphones and tablets, targeting iOS, Android, or both via cross-platform frameworks. With over 6 billion mobile users globally, this field offers enormous commercial opportunity — from consumer apps to enterprise mobility solutions.',
    requiredSkills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Dart', 'REST APIs', 'Firebase', 'SQLite', 'Git', 'App Store / Play Store'],
    requiredHoursPerWeek: 22,
    steps: [
      { stepNumber: 1, title: 'Choose Your Platform Path', description: 'Decide: Native (Swift for iOS, Kotlin for Android) for maximum performance, or Cross-Platform (React Native or Flutter) for code sharing.' },
      { stepNumber: 2, title: 'Learn the Core Language & SDK', description: 'Study Swift/Kotlin deeply — or Dart for Flutter. Understand views, navigation, data binding, and lifecycle events.' },
      { stepNumber: 3, title: 'UI/UX for Mobile', description: 'Learn mobile design principles: touch targets, gestures, platform conventions (Material Design / HIG), and responsive layouts.' },
      { stepNumber: 4, title: 'Backend Integration', description: 'Connect apps to REST APIs, implement authentication (OAuth/JWT), and use Firebase for push notifications and real-time data.' },
      { stepNumber: 5, title: 'Local Storage & State Management', description: 'Use SQLite, SharedPreferences, or Riverpod/Redux for local data. Implement offline-first patterns.' },
      { stepNumber: 6, title: 'Publish & Optimise', description: 'Deploy to App Store and Play Store. Profile and optimise app performance, battery usage, and network efficiency.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['d1'] },
      { id: 'd1', label: 'Native or Cross-Platform?', type: 'decision', nextIds: ['s1a', 's1b'] },
      { id: 's1a', label: 'Swift (iOS) / Kotlin (Android)', type: 'step', nextIds: ['s2'] },
      { id: 's1b', label: 'Flutter / React Native', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Mobile UI/UX Principles', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'API Integration + Firebase', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'State Management + Local Storage', type: 'step', nextIds: ['s5'] },
      { id: 's5', label: 'Publish to App Store / Play Store', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Mobile App Developer', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'Game Developer',
    overview: 'A Game Developer creates interactive digital games spanning mobile, PC, console, and VR/AR. The role blends programming, mathematics, art pipeline integration, and creative design thinking. Game engines like Unity (C#) and Unreal (C++) make the field accessible to individuals, while studios employ hundreds of specialists per title.',
    requiredSkills: ['Unity', 'C#', 'Unreal Engine', 'C++', 'Linear Algebra', 'Physics Simulation', 'Game AI', 'Shaders', 'Multiplayer Networking', 'Optimisation'],
    requiredHoursPerWeek: 28,
    steps: [
      { stepNumber: 1, title: 'Choose an Engine & Language', description: 'Start with Unity + C# (most beginner-friendly) or Unreal + C++/Blueprints (AAA quality). Follow official tutorials to build your first game.' },
      { stepNumber: 2, title: 'Mathematics for Games', description: 'Study vectors, matrices, trigonometry, and quaternions — used daily for movement, rotation, camera control, and physics.' },
      { stepNumber: 3, title: 'Game Mechanics & Core Systems', description: 'Implement player controllers, inventory systems, combat systems, and UI. Study design patterns like State Machines and Observer.' },
      { stepNumber: 4, title: 'Graphics & Visual Polish', description: 'Understand the rendering pipeline, lighting models, shader programming (GLSL/HLSL), and post-processing effects.' },
      { stepNumber: 5, title: 'Game AI & Multiplayer', description: 'Implement pathfinding (A*), behaviour trees for NPCs, and networked multiplayer using Photon or Unity Netcode.' },
      { stepNumber: 6, title: 'Publish & Iterate', description: 'Ship a complete game on itch.io or Steam. Gather player feedback, optimise performance, and iterate — this is the most important step.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Choose Engine (Unity / Unreal)', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Game Maths (Vectors / Physics)', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'Core Game Systems', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'Graphics + Shaders', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Single or Multiplayer?', type: 'decision', nextIds: ['s5a', 's5b'] },
      { id: 's5a', label: 'AI & Single-Player Systems', type: 'step', nextIds: ['s6'] },
      { id: 's5b', label: 'Multiplayer Networking', type: 'step', nextIds: ['s6'] },
      { id: 's6', label: 'Publish & Gather Feedback', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Game Developer', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'UI/UX Designer',
    overview: 'A UI/UX Designer crafts intuitive, visually compelling digital product experiences by understanding user psychology, conducting research, creating wireframes and prototypes, and iterating based on feedback. Great designers balance aesthetics with usability and advocacy for user needs within product teams.',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems', 'Typography', 'Colour Theory', 'Accessibility', 'HTML/CSS Basics'],
    requiredHoursPerWeek: 18,
    steps: [
      { stepNumber: 1, title: 'Design Fundamentals', description: 'Study typography, colour theory, layout grids, visual hierarchy, and Gestalt principles. Analyse great designs daily.' },
      { stepNumber: 2, title: 'Learn Figma', description: 'Master Figma for wireframing, component-based design, auto-layout, and interactive prototyping. Complete the official Figma courses.' },
      { stepNumber: 3, title: 'User Research & UX Process', description: 'Conduct user interviews, surveys, and usability tests. Use affinity mapping and journey maps to synthesise insights.' },
      { stepNumber: 4, title: 'Design Systems', description: 'Build reusable component libraries with consistent tokens (colour, spacing, typography). Study Material Design and Apple HIG.' },
      { stepNumber: 5, title: 'Frontend Basics for Designers', description: 'Learn enough HTML and CSS to communicate effectively with developers and understand technical constraints.' },
      { stepNumber: 6, title: 'Build a Portfolio & Get Feedback', description: 'Create 3–5 detailed case studies showing your design process (not just final screens). Share on Behance, Dribbble, and LinkedIn.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Design Fundamentals', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Figma Mastery', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'User Research + UX Process', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'Design Systems', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Portfolio Ready?', type: 'decision', nextIds: ['s5', 'redo'] },
      { id: 'redo', label: 'Redesign Case Studies', type: 'step', nextIds: ['d1'] },
      { id: 's5', label: 'Ship & Iterate with Real Users', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'UI/UX Designer', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'DevOps Engineer',
    overview: 'A DevOps Engineer bridges the gap between software development and IT operations, enabling faster, more reliable software delivery through automation, collaboration, and continuous improvement. The role owns CI/CD pipelines, infrastructure, monitoring, and on-call reliability — and is central to modern engineering teams.',
    requiredSkills: ['Linux', 'Bash', 'Python', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Jenkins', 'AWS', 'Prometheus', 'Grafana', 'ELK Stack', 'Site Reliability'],
    requiredHoursPerWeek: 25,
    steps: [
      { stepNumber: 1, title: 'Linux & Shell Scripting', description: 'Become fluent in Linux administration, file systems, process management, networking, and Bash scripting.' },
      { stepNumber: 2, title: 'Version Control & Collaboration', description: 'Master Git, branching strategies (GitFlow, trunk-based), and code review workflows on GitHub/GitLab.' },
      { stepNumber: 3, title: 'CI/CD Pipelines', description: 'Build automated build-test-deploy pipelines using GitHub Actions, Jenkins, or GitLab CI. Implement quality gates and rollback mechanisms.' },
      { stepNumber: 4, title: 'Containerisation & Orchestration', description: 'Package applications with Docker. Deploy and manage workloads on Kubernetes clusters. Study Helm, namespaces, and resource quotas.' },
      { stepNumber: 5, title: 'Infrastructure as Code', description: 'Provision cloud infrastructure with Terraform and manage configuration with Ansible. Practice idempotent, reproducible environments.' },
      { stepNumber: 6, title: 'Monitoring, Alerting & SRE', description: 'Set up observability with Prometheus, Grafana, and the ELK Stack. Define SLOs/SLAs, build alerting rules, and run incident postmortems.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Linux + Shell Scripting', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Git + CI/CD Pipelines', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'Docker + Kubernetes', type: 'step', nextIds: ['s4'] },
      { id: 's4', label: 'Terraform + IaC', type: 'step', nextIds: ['s5'] },
      { id: 's5', label: 'Monitoring + Observability', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'DevOps Engineer', type: 'end', nextIds: [] },
    ],
  },
  {
    goalKeyword: 'Product Manager',
    overview: 'A Product Manager (PM) defines the vision, strategy, and roadmap of a product — aligning engineering, design, business, and customer needs. PMs do not write code but must deeply understand technology, data, user psychology, and business economics. The role is highly strategic and demands exceptional communication, prioritisation, and analytical skills.',
    requiredSkills: ['Product Strategy', 'User Research', 'Data Analytics', 'SQL', 'A/B Testing', 'Roadmapping', 'Agile / Scrum', 'Stakeholder Management', 'Figma Basics', 'Jira / Linear', 'OKRs'],
    requiredHoursPerWeek: 18,
    steps: [
      { stepNumber: 1, title: 'Understand the PM Role', description: 'Study what PMs do: discover problems, define solutions, prioritise features, and measure outcomes. Read "Inspired" by Marty Cagan and PM blogs.' },
      { stepNumber: 2, title: 'Master Product Discovery', description: 'Conduct user interviews, competitive analyses, and opportunity assessments. Frame problems using jobs-to-be-done and pain/gain mapping.' },
      { stepNumber: 3, title: 'Data & Analytics Fluency', description: 'Learn SQL for product analytics. Understand metrics (DAU, retention, conversion), funnels, and cohort analyses.' },
      { stepNumber: 4, title: 'Agile & Execution', description: 'Work with Scrum/Kanban frameworks. Write crisp PRDs, user stories, and acceptance criteria. Collaborate in sprint ceremonies.' },
      { stepNumber: 5, title: 'Technical Knowledge', description: 'Understand APIs, databases, frontend/backend trade-offs, and system scalability at a conceptual level to communicate credibly with engineers.' },
      { stepNumber: 6, title: 'Build & Ship a Product', description: 'Ideate, spec, and ship something — a side project, hackathon entry, or contribution to an existing product. Build a portfolio of case studies.' },
    ],
    flowchart: [
      { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
      { id: 's1', label: 'Product Thinking & Discovery', type: 'step', nextIds: ['s2'] },
      { id: 's2', label: 'Data Analytics + SQL', type: 'step', nextIds: ['s3'] },
      { id: 's3', label: 'Agile + PRDs + User Stories', type: 'step', nextIds: ['d1'] },
      { id: 'd1', label: 'Technical Depth Needed?', type: 'decision', nextIds: ['s4a', 's4b'] },
      { id: 's4a', label: 'Learn API & System Basics', type: 'step', nextIds: ['s5'] },
      { id: 's4b', label: 'Focus on GTM & Strategy', type: 'step', nextIds: ['s5'] },
      { id: 's5', label: 'Ship a Product & Build Portfolio', type: 'step', nextIds: ['end'] },
      { id: 'end', label: 'Product Manager', type: 'end', nextIds: [] },
    ],
  },
];

async function seed() {
  await connectDB();
  console.log('🌱 Seeding CareerGuide collection...');
  for (const item of CAREER_GUIDES) {
    await CareerGuide.findOneAndUpdate(
      { goalKeyword: item.goalKeyword },
      item,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('  ✅', item.goalKeyword);
  }
  console.log('🎉 Career guide seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
