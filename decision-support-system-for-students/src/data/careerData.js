/**
 * careerData.js
 * Extracted mock data for use across the application.
 */

export const MOCK_SKILLS = {
  // ---------- Programming Languages ----------
  "JavaScript": ["Variables & Data Types", "Functions & Closures", "DOM Manipulation", "ES6+ Concepts", "Async/Await & Promises", "REST APIs & Fetch", "Error Handling", "Modules & Bundling"],
  "Python": ["Syntax & Basics", "Data Structures", "File Handling", "OOP Concepts", "Libraries (NumPy, Pandas)", "Web Scraping", "Virtual Environments", "Decorators & Generators"],
  "Java": ["OOP Principles", "Collections Framework", "Multithreading", "Exception Handling", "Java 8 Streams", "JDBC", "Spring Basics", "Maven & Gradle"],
  "C++": ["Pointers & Memory", "STL (Vectors, Maps)", "OOP in C++", "Templates", "File I/O", "Competitive Programming Tricks", "Dynamic Programming"],
  "C": ["Pointers & Arrays", "Memory Management (malloc/free)", "Structs & Unions", "File Operations", "Linked Lists in C", "Recursion"],
  "TypeScript": ["Types & Interfaces", "Generics", "Enums & Tuples", "Type Guards", "Decorators", "TypeScript with React", "tsconfig Setup"],
  "Go (Golang)": ["Syntax & Types", "Goroutines & Channels", "Interfaces", "Error Handling", "HTTP Servers", "Go Modules", "Testing in Go"],
  "Rust": ["Ownership & Borrowing", "Lifetimes", "Structs & Enums", "Traits", "Concurrency", "Cargo & Crates", "Error Handling with Result"],
  "Ruby": ["Syntax & Basics", "Blocks & Procs", "OOP in Ruby", "Gems & Bundler", "Ruby on Rails Intro", "ERB Templates", "Active Record"],
  "PHP": ["Syntax & Variables", "Functions & Arrays", "OOP in PHP", "PDO & MySQL", "Laravel Basics", "Sessions & Cookies", "REST APIs in PHP"],
  "Kotlin": ["Syntax & Null Safety", "Data Classes", "Coroutines", "Sealed Classes", "Android with Kotlin", "Kotlin Extensions", "Jetpack Compose Basics"],
  "Swift": ["Optionals & Safety", "Structs vs Classes", "Protocols", "Error Handling", "UIKit Basics", "SwiftUI Introduction", "Core Data"],
  "Dart": ["Syntax & Types", "OOP in Dart", "Async & Futures", "Streams", "Flutter with Dart", "Null Safety", "Packages & pub.dev"],
  "Scala": ["Functional Programming", "Case Classes", "Pattern Matching", "Traits & Mixins", "Akka Actors", "Spark with Scala", "SBT Build Tool"],
  // ---------- Web Development ----------
  "Web Development": ["HTML5 Semantics", "CSS3 & Flexbox/Grid", "JavaScript Basics", "Responsive Design", "Version Control (Git)", "REST APIs", "Browser DevTools", "Accessibility (a11y)"],
  "React": ["JSX Basics", "Components & Props", "State & Hooks", "React Router", "Context API", "Redux Toolkit", "Performance Optimization", "Testing with Jest"],
  "Vue.js": ["Vue Instance & Directives", "Components & Props", "Vue Router", "Vuex State Management", "Composition API", "Pinia", "Unit Testing"],
  "Angular": ["Components & Modules", "Directives & Pipes", "Services & DI", "RxJS Observables", "Angular Router", "Forms (Template & Reactive)", "NgRx"],
  "Next.js": ["File-Based Routing", "Server-Side Rendering", "Static Generation", "API Routes", "Image Optimization", "Middleware", "Deployment on Vercel"],
  "Node.js": ["Event Loop", "Modules (CommonJS/ESM)", "Express.js", "File System & Streams", "REST API Building", "Authentication (JWT)", "NPM Ecosystem"],
  "HTML & CSS": ["HTML5 Elements", "Semantic HTML", "CSS Selectors", "Box Model", "Flexbox", "CSS Grid", "Animations & Transitions", "CSS Variables"],
  // ---------- Data & AI ----------
  "Machine Learning": ["Math Foundations (Linear Algebra, Calculus)", "Supervised Learning", "Unsupervised Learning", "Model Evaluation & Metrics", "Feature Engineering", "Neural Networks", "Ensemble Methods", "MLflow & Experiment Tracking"],
  "Deep Learning": ["Neural Network Basics", "CNNs", "RNNs & LSTMs", "Transformers", "Transfer Learning", "GANs", "Keras & TensorFlow", "PyTorch Fundamentals"],
  "Data Science": ["Python for Data", "Pandas & NumPy", "Data Visualization (Matplotlib, Seaborn)", "Inferential Statistics", "SQL for Data", "Machine Learning Intro", "Storytelling with Data"],
  "NLP (Natural Language Processing)": ["Text Preprocessing", "Tokenization & Embeddings", "Sentiment Analysis", "Named Entity Recognition", "Transformers & BERT", "Language Model Fine-Tuning", "Chatbot Development"],
  "Computer Vision": ["Image Preprocessing", "Edge Detection", "Object Detection (YOLO)", "Image Classification", "Semantic Segmentation", "OpenCV Basics", "GANs for Images"],
  "AI": ["Intro to AI", "Search Algorithms (BFS, DFS, A*)", "Knowledge Representation", "Planning & Reasoning", "Reinforcement Learning", "AI Ethics", "Generative AI"],
  "Data Analysis": ["Excel & Google Sheets", "Python (Pandas)", "SQL Queries", "Power BI / Tableau", "Statistical Analysis", "A/B Testing", "Data Cleaning & Wrangling"],
  "Data Structures & Algorithms": ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & Graphs", "Hashing", "Dynamic Programming", "Greedy Algorithms", "Sorting & Searching"],
  // ---------- Cloud & DevOps ----------
  "AWS (Amazon Web Services)": ["IAM & Security", "EC2 & VPC", "S3 & CloudFront", "Lambda & Serverless", "RDS & DynamoDB", "CloudFormation", "AWS CLI", "Cost Optimization"],
  "Azure": ["Azure Fundamentals", "Virtual Machines", "Azure Functions", "Blob Storage", "Azure DevOps", "Cosmos DB", "Active Directory", "AKS (Kubernetes)"],
  "Google Cloud Platform": ["GCP Core Services", "Compute Engine", "Cloud Run", "BigQuery", "Firebase", "GKE", "IAM Roles", "Pub/Sub Messaging"],
  "Docker": ["Container Basics", "Dockerfile", "Docker Compose", "Volumes & Networks", "Container Registries", "Multi-Stage Builds", "Docker Swarm"],
  "Kubernetes": ["Pods & Deployments", "Services & Ingress", "ConfigMaps & Secrets", "StatefulSets", "Helm Charts", "Autoscaling", "Monitoring with Prometheus"],
  "DevOps": ["Version Control (Git)", "CI/CD Pipelines", "Docker & Containers", "Infrastructure as Code", "Monitoring & Logging", "Agile & Scrum", "Jenkins / GitHub Actions"],
  "Linux": ["Shell Commands", "File System Navigation", "User & Permission Management", "Shell Scripting (Bash)", "Process Management", "Networking (SSH, curl)", "Cron Jobs"],
  "CI/CD": ["Git Fundamentals", "GitHub Actions", "Jenkins Pipelines", "GitLab CI", "Automated Testing in CI", "Deployment Strategies", "Rollback & Monitoring"],
  // ---------- Databases ----------
  "SQL": ["SELECT Statements", "Joins (INNER, LEFT, RIGHT)", "Aggregations (GROUP BY)", "Subqueries & CTEs", "Indexes & Query Optimization", "Stored Procedures", "Transactions & ACID"],
  "MongoDB": ["Documents & Collections", "CRUD Operations", "Aggregation Pipeline", "Indexes", "Schema Design", "Mongoose ORM", "Atlas & Cloud Hosting"],
  "PostgreSQL": ["Advanced SQL", "JSON Support", "Full-Text Search", "Window Functions", "pg_admin", "Transactions", "Replication"],
  "Firebase": ["Firestore CRUD", "Realtime Database", "Authentication", "Cloud Functions", "Hosting", "Security Rules", "Firebase Analytics"],
  "Redis": ["Key-Value Store", "Data Types (Lists, Sets, Hashes)", "Pub/Sub", "Caching Strategies", "TTL & Expiry", "Redis Cluster", "Lua Scripting"],
  // ---------- Mobile ----------
  "Android Development": ["Android Studio Setup", "Activities & Intents", "Layouts & Views", "RecyclerView", "Navigation Component", "Retrofit & APIs", "Room Database", "Push Notifications"],
  "iOS Development": ["Xcode & Swift Basics", "UIKit Views", "Auto Layout", "Navigation Controllers", "URLSession", "Core Data", "SwiftUI Introduction", "App Store Submission"],
  "Flutter": ["Dart Basics", "Widgets (Stateless & Stateful)", "Navigation & Routing", "State Management (Provider, Riverpod)", "REST API Integration", "Local Storage", "Publishing to Stores"],
  "React Native": ["JSX in RN", "Core Components (View, Text, FlatList)", "Navigation (React Navigation)", "State with Redux/Context", "Native Modules", "Expo framework", "Animations"],
  // ---------- Cybersecurity ----------
  "Cybersecurity": ["Networking Fundamentals", "CIA Triad", "OWASP Top 10", "Cryptography Basics", "Penetration Testing Intro", "Firewalls & IDS", "Incident Response"],
  "Ethical Hacking": ["Reconnaissance", "Scanning & Enumeration", "Exploitation (Metasploit)", "Web App Testing (Burp Suite)", "Privilege Escalation", "Post Exploitation", "Report Writing"],
  "Network Security": ["OSI Model", "TCP/IP Stack", "Wireshark Analysis", "VPNs & Firewalls", "IDS/IPS Systems", "SSL/TLS", "Zero Trust Architecture"],
  // ---------- Other ----------
  "Git & Version Control": ["Git Basics (init, add, commit)", "Branching & Merging", "Remote Repositories", "Pull Requests & Code Review", "Git Rebase & Cherry Pick", "Git Hooks", "GitFlow Workflow"],
  "UI/UX Design": ["Design Thinking", "Wireframing", "Prototyping (Figma)", "User Research", "Usability Testing", "Design Systems", "Accessibility Principles"],
  "Blockchain": ["Blockchain Fundamentals", "Cryptography in Blockchain", "Smart Contracts (Solidity)", "Ethereum & EVM", "DeFi Concepts", "NFTs", "Web3.js / Ethers.js"],
  "System Design": ["Scalability Concepts", "Load Balancing", "Caching Strategies", "Database Sharding", "Microservices Architecture", "Message Queues", "CAP Theorem"],
  "Competitive Programming": ["Time & Space Complexity", "Sorting Algorithms", "Graph Algorithms", "Dynamic Programming", "Greedy Techniques", "Segment Trees & BITs", "Contest Strategy"],
  "Cloud Computing": ["IaaS / PaaS / SaaS", "Virtualisation", "Containers & Serverless", "Cloud Security", "Multi-Cloud Strategy", "Cost Management", "SLA & Availability"],
};

export const SKILL_ALIASES = {
  "js": ["JavaScript", "Node.js", "Next.js", "React", "Vue.js", "Angular"],
  "ts": ["TypeScript"],
  "py": ["Python"],
  "ml": ["Machine Learning", "Deep Learning", "NLP (Natural Language Processing)", "Computer Vision", "AI"],
  "ai": ["AI", "Machine Learning", "Deep Learning", "NLP (Natural Language Processing)", "Computer Vision"],
  "dl": ["Deep Learning"],
  "nlp": ["NLP (Natural Language Processing)"],
  "cv": ["Computer Vision"],
  "ds": ["Data Science", "Data Analysis", "Data Structures & Algorithms"],
  "dsa": ["Data Structures & Algorithms"],
  "css": ["HTML & CSS", "Web Development"],
  "html": ["HTML & CSS", "Web Development"],
  "node": ["Node.js"],
  "next": ["Next.js"],
  "vue": ["Vue.js"],
  "ng": ["Angular"],
  "rn": ["React Native"],
  "gcp": ["Google Cloud Platform"],
  "k8s": ["Kubernetes"],
  "devops": ["DevOps", "CI/CD", "Docker", "Kubernetes", "Linux"],
  "security": ["Cybersecurity", "Ethical Hacking", "Network Security"],
  "hack": ["Ethical Hacking", "Cybersecurity"],
  "android": ["Android Development", "Kotlin", "Flutter", "React Native"],
  "ios": ["iOS Development", "Swift", "Flutter"],
  "mobile": ["Android Development", "iOS Development", "Flutter", "React Native"],
  "database": ["SQL", "MongoDB", "PostgreSQL", "Firebase", "Redis"],
  "db": ["SQL", "MongoDB", "PostgreSQL", "Firebase", "Redis"],
  "cloud": ["AWS (Amazon Web Services)", "Azure", "Google Cloud Platform", "Cloud Computing", "Docker", "Kubernetes"],
  "aws": ["AWS (Amazon Web Services)"],
  "blockchain": ["Blockchain"],
  "web3": ["Blockchain"],
  "design": ["UI/UX Design"],
  "ux": ["UI/UX Design"],
  "backend": ["Node.js", "Python", "Java", "Go (Golang)", "SQL", "MongoDB", "PostgreSQL", "Docker", "Redis"],
  "frontend": ["React", "Vue.js", "Angular", "Next.js", "HTML & CSS", "JavaScript", "TypeScript"],
  "fullstack": ["React", "Node.js", "Next.js", "MongoDB", "SQL", "Web Development", "Docker"],
  "competitive": ["Competitive Programming", "Data Structures & Algorithms", "C++"],
  "system": ["System Design", "DevOps", "Cloud Computing", "Linux"],
  "git": ["Git & Version Control", "DevOps"],
};

export const MOCK_COMPETITIONS = [
  // ---- Hackathons ----
  { id: 1, title: "Smart India Hackathon (SIH)", category: "hackathon", org: "Ministry of Education", domain: "All Domains", desc: "India's largest national-level hackathon. Teams solve government problem statements across 36 hours.", tags: ["hack", "sih", "government", "national"], status: "Live", eventType: "Offline", payment: "Free", teamSize: "2+" },
  { id: 2, title: "HackFest 2026", category: "hackathon", org: "HackFest", domain: "Web Development", desc: "48-hour hackathon focused on building social impact solutions using modern web stack.", tags: ["hack", "web", "social"], status: "Live", eventType: "Online", payment: "Free", teamSize: "2+" },
  { id: 3, title: "HackCBS", category: "hackathon", org: "Shaheed Sukhdev College", domain: "Open Innovation", desc: "Delhi's biggest student-run hackathon with 36 hours of hacking.", tags: ["hack", "delhi", "student"], status: "Closed", eventType: "Offline", payment: "Paid", teamSize: "2+" },
  { id: 4, title: "MLH Global Hack Week", category: "hackathon", org: "Major League Hacking", domain: "Open Source & Tech", desc: "Week-long themed hacking events run by MLH covering diverse tech topics.", tags: ["hack", "mlh", "open source"], status: "Recent", eventType: "Online", payment: "Free", teamSize: "1" },
  { id: 5, title: "AngelHack Global Hackathon", category: "hackathon", org: "AngelHack", domain: "FinTech & Startup", desc: "Global series with prizes for the most innovative startup ideas and prototypes.", tags: ["hack", "startup", "fintech", "global"], status: "Live", eventType: "Online", payment: "Free", teamSize: "2" },
  { id: 6, title: "StackHack", category: "hackathon", org: "HackerEarth", domain: "Full Stack Development", desc: "Online hackathon for full-stack engineers with real-world problem statements.", tags: ["hack", "fullstack", "hackerearth"], status: "Expired", eventType: "Online", payment: "Free", teamSize: "1" },
  { id: 7, title: "Google Solution Challenge", category: "hackathon", org: "Google", domain: "Social Impact + AI", desc: "Build solutions for UN Sustainable Development Goals using Google technology.", tags: ["hack", "google", "sdg", "ai"], status: "Live", eventType: "Online", payment: "Free", teamSize: "2+" },
  { id: 8, title: "Microsoft Imagine Cup", category: "hackathon", org: "Microsoft", domain: "Innovation", desc: "Global student technology competition. Build innovative tech projects across AI, gaming, mixed reality.", tags: ["hack", "microsoft", "global", "student"], status: "Live", eventType: "Offline", payment: "Free", teamSize: "2+" },
  { id: 9, title: "ETHIndia", category: "hackathon", org: "ETHIndia", domain: "Blockchain / Web3", desc: "India's largest Ethereum hackathon for building decentralised applications.", tags: ["hack", "blockchain", "web3", "ethereum"], status: "Closed", eventType: "Offline", payment: "Paid", teamSize: "2+" },
  { id: 10, title: "Devfolio Hackathons", category: "hackathon", org: "Devfolio", domain: "Open Innovation", desc: "Hundreds of college and online hackathons hosted on India's largest hackathon platform.", tags: ["hack", "devfolio", "india", "college"], status: "Live", eventType: "Online", payment: "Free", teamSize: "2+" },
  { id: 11, title: "NASA Space Apps Challenge", category: "hackathon", org: "NASA", domain: "Space & Science", desc: "Global hackathon where participants solve space-related challenges using NASA open data.", tags: ["hack", "nasa", "space", "science", "global"], status: "Recent", eventType: "Hybrid", payment: "Free", teamSize: "2+" },
  { id: 12, title: "HackaHealth", category: "hackathon", org: "HackaHealth", domain: "HealthTech", desc: "Healthcare-focused hackathon focused on using technology to solve health challenges.", tags: ["hack", "health", "healthcare"], status: "Live", eventType: "Offline", payment: "Free", teamSize: "2+" },
  { id: 13, title: "Fintech Hackathon by RBI", category: "hackathon", org: "Reserve Bank of India", domain: "FinTech", desc: "Regulator-run hackathon focused on next-gen financial technology solutions for India.", tags: ["hack", "fintech", "rbi", "finance"], status: "Live", eventType: "Offline", payment: "Free", teamSize: "2+" },
  { id: 14, title: "HackThis Fall", category: "hackathon", org: "HackThis Fall", domain: "Open Source", desc: "Inclusivity-first 36-hour online hackathon open to students from all backgrounds.", tags: ["hack", "open source", "online", "beginner"], status: "Recent", eventType: "Online", payment: "Free", teamSize: "1" },
];

export const MOCK_INTERNSHIPS = [
  // ---- Big Tech ----
  { id: 101, org: "Google", title: "Google Summer of Code (GSoC)", domain: "Open Source", desc: "3-month paid programme to work on open source projects mentored by Google engineers.", duration: "3 months", stipend: "₹60,000+/mo", tags: ["google", "open source", "coding", "paid", "summer"], location: "Remote", workType: "Work from Home", role: "Open Source", datePosted: "2024-03-20" },
  { id: 102, org: "Google", title: "Google STEP Internship", domain: "Software Engineering", desc: "Student Training in Engineering Program for 1st and 2nd year CS students at Google.", duration: "3 months", stipend: "Paid (competitive)", tags: ["google", "engineering", "student", "first year"], location: "Bangalore", workType: "In Office", role: "SDE", datePosted: "2024-03-18" },
  { id: 103, org: "Google", title: "Google Research Internship", domain: "AI / Research", desc: "Research internships across Google Brain, DeepMind and Google Research labs.", duration: "3–6 months", stipend: "Paid", tags: ["google", "research", "ai", "deepmind", "ml"], location: "Hyderabad", workType: "Hybrid", role: "AI Research", datePosted: "2024-03-15" },
  { id: 104, org: "Microsoft", title: "Microsoft Explore Internship", domain: "Software Engineering", desc: "Internship for freshmen/sophomore students exploring PM, design, and engineering.", duration: "12 weeks", stipend: "Paid (competitive)", tags: ["microsoft", "engineering", "explore", "pm", "student"], location: "Hyderabad", workType: "In Office", role: "Product Management", datePosted: "2024-03-12" },
  { id: 105, org: "Microsoft", title: "Microsoft Azure Cloud Internship", domain: "Cloud Computing", desc: "Work on Azure services, cloud infrastructure and enterprise software at Microsoft.", duration: "3 months", stipend: "Paid", tags: ["microsoft", "azure", "cloud", "infra"], location: "Bangalore", workType: "Hybrid", role: "Cloud Engineering", datePosted: "2024-03-10" },
  { id: 106, org: "Microsoft", title: "Microsoft Research Asia Internship", domain: "AI / Research", desc: "Research internship at MSRA on topics including NLP, CV, Distributed Systems, and Security.", duration: "3–6 months", stipend: "Paid", tags: ["microsoft", "research", "ai", "nlp", "asia"], location: "Remote", workType: "Work from Home", role: "Applied AI", datePosted: "2024-03-08" },
  { id: 107, org: "Amazon", title: "Amazon SDE Internship", domain: "Software Development", desc: "Build real features at Amazon with a team. Work on AWS, Alexa, or Amazon retail.", duration: "3 months", stipend: "Paid (competitive)", tags: ["amazon", "sde", "aws", "software", "engineering"], location: "Pune", workType: "In Office", role: "SDE", datePosted: "2024-03-05" },
  { id: 108, org: "Amazon", title: "AWS Solutions Architect Intern", domain: "Cloud Computing", desc: "Design and implement cloud solutions for AWS customers as a Solutions Architect intern.", duration: "3 months", stipend: "Paid", tags: ["amazon", "aws", "cloud", "architect", "solutions"], location: "Mumbai", workType: "Hybrid", role: "Cloud Solutions", datePosted: "2024-03-02" },
  { id: 109, org: "Meta", title: "Meta Software Engineer Internship", domain: "Software Engineering", desc: "Work on Facebook, Instagram, WhatsApp or Oculus products as a software engineering intern.", duration: "12 weeks", stipend: "Paid (competitive)", tags: ["meta", "facebook", "instagram", "engineering", "software"], location: "Remote", workType: "Work from Home", role: "SDE", datePosted: "2024-03-01" },
  { id: 110, org: "Apple", title: "Apple iOS Engineering Internship", domain: "iOS Development", desc: "Contribute to iOS, macOS, watchOS platforms and first-party apps at Apple.", duration: "3 months", stipend: "Paid", tags: ["apple", "ios", "swift", "engineering", "mac"], location: "Hyderabad", workType: "In Office", role: "iOS Development", datePosted: "2024-02-28" },
  { id: 111, org: "Netflix", title: "Netflix Engineering Internship", domain: "Software Engineering", desc: "Work on streaming infrastructure, recommendation systems or UX at Netflix.", duration: "3 months", stipend: "Paid (top tier)", tags: ["netflix", "streaming", "engineering", "recommendation", "ml"], location: "Mumbai", workType: "Hybrid", role: "Backend Engineering", datePosted: "2024-02-25" },
  { id: 112, org: "Adobe", title: "Adobe Research Internship", domain: "AI / Creative Tech", desc: "Work on AI, computer vision and creative technology research at Adobe Research.", duration: "3 months", stipend: "Paid", tags: ["adobe", "research", "ai", "creative", "cv", "design"], location: "Noida", workType: "In Office", role: "Computer Vision", datePosted: "2024-02-22" },
  { id: 113, org: "Salesforce", title: "Salesforce Intern", domain: "Cloud CRM", desc: "Build and test features for Salesforce CRM platform and ecosystem.", duration: "3 months", stipend: "Paid", tags: ["salesforce", "crm", "cloud", "enterprise", "business"], location: "Hyderabad", workType: "Hybrid", role: "Cloud CRM", datePosted: "2024-02-20" },
  { id: 114, org: "LinkedIn", title: "LinkedIn Engineering Internship", domain: "Software Engineering", desc: "Work on LinkedIn's professional network platform, search, feed or data infra.", duration: "3 months", stipend: "Paid", tags: ["linkedin", "engineering", "data", "networking", "software"], location: "Bangalore", workType: "In Office", role: "SDE", datePosted: "2024-02-18" },
];

export const COMP_STATUSES = ["Interested", "Registered", "Ongoing", "Completed", "Won", "Not Selected"];
export const INTERN_STATUSES = ["Interested", "Applied", "Ongoing", "Completed", "Not Selected"];

export const COMP_ALIASES = {
  "hack": "hackathon", "hackathon": "hackathon", "hacks": "hackathon", "hackfest": "hackathon",
  "olympiad": "olympiad", "olympiads": "olympiad", "imo": "olympiad", "ioi": "olympiad",
  "maths": "olympiad", "math": "olympiad", "mathematics": "olympiad",
  "code": "coding", "coding": "coding", "competitive": "coding", "algorithm": "coding",
  "codeforces": "coding", "leetcode": "coding", "codechef": "coding",
  "data": "data", "kaggle": "data", "datathon": "data", "ml competition": "data",
  "ai competition": "ai", "design challenge": "design", "design": "design",
  "business": "business", "finance competition": "business",
};

export const MOCK_ACTIVITY = [
  { text: "Added Python as learning goal", time: "2 days ago" },
  { text: "Completed 'Variables & Data Types' in JavaScript", time: "3 days ago" },
  { text: "Applied for Google Summer of Code", time: "5 days ago" },
  { text: "Won HackFest 2025", time: "1 week ago" },
  { text: "Started learning React", time: "2 weeks ago" },
];
