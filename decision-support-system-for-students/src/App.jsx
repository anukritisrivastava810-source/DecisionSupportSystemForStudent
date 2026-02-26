import { useState, useCallback } from "react";

// ==================== STYLES ====================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #2563EB;
    --primary-light: #3B82F6;
    --primary-dark: #1D4ED8;
    --accent: #F59E0B;
    --accent-light: #FCD34D;
    --success: #10B981;
    --error: #EF4444;
    --warning: #F59E0B;
    --bg: #F8FAFC;
    --bg-card: #FFFFFF;
    --bg-section: #F1F5F9;
    --text: #0F172A;
    --text-muted: #64748B;
    --text-light: #94A3B8;
    --border: #E2E8F0;
    --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.06);
    --radius: 14px;
    --radius-sm: 8px;
    --navbar-h: 64px;
    --font: 'DM Sans', sans-serif;
    --font-display: 'Playfair Display', serif;
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.6; }

  /* ---- NAVBAR ---- */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; height: var(--navbar-h);
    background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; z-index: 1000;
    box-shadow: 0 1px 12px rgba(0,0,0,0.05);
  }
  .navbar-logo {
    font-family: var(--font-display); font-size: 1.35rem; font-weight: 800;
    color: var(--primary); cursor: pointer; user-select: none;
    display: flex; align-items: center; gap: 8px;
  }
  .navbar-logo span { color: var(--accent); }
  .navbar-links { display: flex; align-items: center; gap: 4px; }
  .nav-link {
    padding: 8px 16px; border-radius: var(--radius-sm); font-size: 0.9rem;
    font-weight: 500; color: var(--text-muted); cursor: pointer;
    transition: all 0.2s; border: none; background: none;
  }
  .nav-link:hover { background: var(--bg-section); color: var(--text); }
  .nav-link.active { background: var(--primary); color: white; }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
  .hamburger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }

  /* ---- PAGE WRAPPER ---- */
  .page { padding-top: var(--navbar-h); min-height: 100vh; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .section { padding: 48px 0; }

  /* ---- CARDS ---- */
  .card {
    background: var(--bg-card); border-radius: var(--radius);
    box-shadow: var(--shadow); border: 1px solid var(--border); overflow: hidden;
  }
  .card-body { padding: 24px; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }

  /* ---- STAT CARDS ---- */
  .stat-card {
    background: var(--bg-card); border-radius: var(--radius); padding: 24px;
    border: 1px solid var(--border); box-shadow: var(--shadow);
    display: flex; flex-direction: column; gap: 8px;
  }
  .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 4px; }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--text); line-height: 1; }
  .stat-label { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }

  /* ---- BUTTONS ---- */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 20px; border-radius: var(--radius-sm); font-size: 0.9rem;
    font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
    font-family: var(--font);
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
  .btn-outline { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); }
  .btn-outline:hover { background: var(--primary); color: white; }
  .btn-success { background: var(--success); color: white; }
  .btn-danger { background: var(--error); color: white; }
  .btn-sm { padding: 6px 14px; font-size: 0.8rem; }
  .btn-lg { padding: 14px 28px; font-size: 1rem; }
  .btn-full { width: 100%; }

  /* ---- INPUTS ---- */
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 0.85rem; font-weight: 600; color: var(--text); }
  .form-input {
    padding: 11px 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--border);
    font-size: 0.9rem; font-family: var(--font); color: var(--text); background: white;
    transition: all 0.2s; outline: none;
  }
  .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .form-input::placeholder { color: var(--text-light); }
  select.form-input { cursor: pointer; }
  textarea.form-input { resize: vertical; min-height: 80px; }

  /* ---- SECTION HEADER ---- */
  .section-header { margin-bottom: 28px; }
  .section-title { font-size: 1.35rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .section-sub { font-size: 0.9rem; color: var(--text-muted); }

  /* ---- PROGRESS ---- */
  .progress-bar-wrap { background: var(--bg-section); border-radius: 99px; height: 8px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--primary), var(--primary-light)); transition: width 0.5s ease; }

  /* ---- BADGES ---- */
  .badge {
    display: inline-flex; align-items: center; padding: 3px 10px;
    border-radius: 99px; font-size: 0.75rem; font-weight: 600;
  }
  .badge-blue { background: #EFF6FF; color: var(--primary); }
  .badge-green { background: #F0FDF4; color: var(--success); }
  .badge-yellow { background: #FFFBEB; color: #D97706; }
  .badge-red { background: #FEF2F2; color: var(--error); }
  .badge-gray { background: var(--bg-section); color: var(--text-muted); }

  /* ---- MODAL ---- */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: white; border-radius: var(--radius); padding: 36px; max-width: 420px; width: 100%;
    box-shadow: var(--shadow-lg); animation: slideUp 0.25s ease;
  }
  .modal-icon { font-size: 3rem; text-align: center; margin-bottom: 16px; }
  .modal-title { font-size: 1.3rem; font-weight: 700; text-align: center; margin-bottom: 8px; }
  .modal-msg { font-size: 0.9rem; color: var(--text-muted); text-align: center; margin-bottom: 24px; }
  .modal-actions { display: flex; gap: 12px; justify-content: center; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ---- FOOTER ---- */
  footer {
    background: #0F172A; color: #CBD5E1; padding: 40px 0 24px;
    margin-top: auto;
  }
  .footer-inner { display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .footer-brand h3 { font-family: var(--font-display); color: white; font-size: 1.2rem; margin-bottom: 8px; }
  .footer-brand p { font-size: 0.85rem; max-width: 260px; color: #94A3B8; }
  .footer-links h4 { color: white; font-size: 0.9rem; font-weight: 600; margin-bottom: 14px; }
  .footer-contact { display: flex; flex-direction: column; gap: 8px; }
  .footer-contact a { color: #94A3B8; text-decoration: none; font-size: 0.85rem; transition: color 0.2s; display: flex; align-items: center; gap: 8px; }
  .footer-contact a:hover { color: white; }
  .footer-bottom { border-top: 1px solid #1E293B; padding-top: 20px; text-align: center; font-size: 0.8rem; color: #64748B; }

  /* ---- WELCOME PAGE ---- */
  .welcome-wrap { display: flex; min-height: 100vh; }
  .welcome-left {
    width: 42%; background: white; display: flex; flex-direction: column;
    justify-content: center; padding: 48px 48px; position: relative;
  }
  .welcome-right {
    width: 58%; background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 40%, #7C3AED 100%);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 48px; position: relative; overflow: hidden;
  }
  .welcome-right::before {
    content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(255,255,255,0.04); top: -100px; right: -100px;
  }
  .welcome-right::after {
    content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: rgba(255,255,255,0.06); bottom: -60px; left: -60px;
  }
  .welcome-geo {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.05); animation: float 4s ease-in-out infinite;
  }
  .welcome-brand { margin-bottom: 40px; }
  .welcome-brand h1 { font-family: var(--font-display); font-size: 1.8rem; color: var(--primary); margin-bottom: 6px; }
  .welcome-brand p { color: var(--text-muted); font-size: 0.9rem; }
  .welcome-tabs { display: flex; gap: 4px; background: var(--bg-section); padding: 4px; border-radius: 10px; margin-bottom: 28px; }
  .welcome-tab {
    flex: 1; text-align: center; padding: 9px; border-radius: 8px; cursor: pointer;
    font-size: 0.88rem; font-weight: 600; color: var(--text-muted); transition: all 0.2s; border: none; background: none;
  }
  .welcome-tab.active { background: white; color: var(--primary); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .welcome-right-content { position: relative; z-index: 1; text-align: center; color: white; max-width: 440px; }
  .welcome-right-content h2 { font-family: var(--font-display); font-size: 2.4rem; line-height: 1.2; margin-bottom: 20px; }
  .welcome-right-content p { font-size: 0.95rem; opacity: 0.85; line-height: 1.7; margin-bottom: 32px; }
  .feature-list { display: flex; flex-direction: column; gap: 14px; text-align: left; }
  .feature-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); padding: 14px 18px; border-radius: 12px; }
  .feature-icon { font-size: 1.3rem; }
  .feature-item span { font-size: 0.9rem; opacity: 0.95; }

  /* ---- HOME PAGE HERO ---- */
  .hero {
    background: linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%);
    padding: 72px 0 56px; text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(37,99,235,0.06) 0%, transparent 60%),
                radial-gradient(circle at 70% 50%, rgba(124,58,237,0.06) 0%, transparent 60%);
  }
  .hero-content { position: relative; z-index: 1; }
  .hero h1 { font-family: var(--font-display); font-size: 3rem; color: var(--text); margin-bottom: 16px; line-height: 1.15; }
  .hero h1 em { font-style: italic; color: var(--primary); }
  .hero p { font-size: 1.1rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 32px; }
  .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .about-card { background: white; border-radius: var(--radius); padding: 36px; border: 1px solid var(--border); box-shadow: var(--shadow); }

  /* ---- DASHBOARD ---- */
  .welcome-banner {
    background: linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%);
    border-radius: var(--radius); padding: 28px 32px; color: white; margin-bottom: 28px;
  }
  .welcome-banner h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
  .welcome-banner p { opacity: 0.85; font-size: 0.9rem; }

  /* ---- SKILL CARD ---- */
  .skill-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; box-shadow: var(--shadow); }
  .skill-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .skill-name { font-weight: 700; font-size: 1rem; color: var(--text); }
  .subtopic-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .subtopic-item:last-child { border-bottom: none; }
  .subtopic-item input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }
  .subtopic-label { font-size: 0.88rem; color: var(--text); }
  .subtopic-label.done { text-decoration: line-through; color: var(--text-muted); }

  /* ---- SEARCH ---- */
  .search-bar { display: flex; gap: 10px; }
  .search-bar .form-input { flex: 1; }
  .search-results { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 10px; }
  .result-chip {
    padding: 8px 16px; background: var(--bg-section); border-radius: 99px; cursor: pointer;
    font-size: 0.85rem; font-weight: 500; border: 1.5px solid var(--border); transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .result-chip:hover { border-color: var(--primary); color: var(--primary); background: #EFF6FF; }
  .result-chip.added { background: var(--primary); color: white; border-color: var(--primary); }

  /* ---- OPPORTUNITIES ---- */
  .opp-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; box-shadow: var(--shadow); }
  .opp-card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .opp-title { font-weight: 700; font-size: 0.98rem; margin-bottom: 4px; }
  .opp-desc { font-size: 0.83rem; color: var(--text-muted); margin-bottom: 14px; }

  /* ---- HISTORY ---- */
  .timeline { display: flex; flex-direction: column; gap: 0; }
  .timeline-item { display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .timeline-item:last-child { border-bottom: none; }
  .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); margin-top: 6px; flex-shrink: 0; }
  .timeline-content { flex: 1; }
  .timeline-title { font-size: 0.88rem; font-weight: 600; color: var(--text); }
  .timeline-time { font-size: 0.78rem; color: var(--text-light); margin-top: 2px; }

  /* ---- PROFILE ---- */
  .profile-info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
  .profile-info-row:last-child { border-bottom: none; }
  .profile-info-key { color: var(--text-muted); font-weight: 500; }
  .profile-info-val { color: var(--text); font-weight: 600; text-align: right; max-width: 55%; }

  /* ---- TYPE TOGGLE ---- */
  .type-toggle { display: flex; gap: 0; border-radius: var(--radius-sm); overflow: hidden; border: 1.5px solid var(--border); }
  .type-btn {
    flex: 1; padding: 10px 20px; border: none; background: white; cursor: pointer;
    font-size: 0.88rem; font-weight: 600; color: var(--text-muted); transition: all 0.2s;
    font-family: var(--font);
  }
  .type-btn.active { background: var(--primary); color: white; }

  /* ---- RESPONSIVE ---- */
  @media (max-width: 768px) {
    .welcome-wrap { flex-direction: column; }
    .welcome-left, .welcome-right { width: 100%; }
    .welcome-right { min-height: 300px; }
    .navbar-links { display: none; }
    .navbar-links.open {
      display: flex; flex-direction: column; position: fixed; top: var(--navbar-h);
      left: 0; right: 0; background: white; padding: 16px; box-shadow: var(--shadow);
      gap: 4px; border-top: 1px solid var(--border);
    }
    .hamburger { display: flex; }
    .hero h1 { font-size: 2rem; }
    .welcome-left { padding: 32px 24px; }
    .card-grid { grid-template-columns: 1fr; }
  }
  
  .divider { height: 1px; background: var(--border); margin: 24px 0; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .flex-gap { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .mt-4 { margin-top: 16px; } .mt-6 { margin-top: 24px; } .mt-8 { margin-top: 32px; }
  .mb-4 { margin-bottom: 16px; } .mb-6 { margin-bottom: 24px; }
  .text-center { text-align: center; }
  .text-sm { font-size: 0.85rem; }
  .text-muted { color: var(--text-muted); }
  .font-bold { font-weight: 700; }
  .gap-3 { gap: 12px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
`;

// ==================== MOCK DATA ====================
const MOCK_SKILLS = {
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

// Skill aliases for smart search
const SKILL_ALIASES = {
  "js": ["JavaScript", "Node.js", "Next.js", "React", "Vue.js", "Angular"],
  "ts": ["TypeScript"],
  "py": ["Python"],
  "ml": ["Machine Learning", "Deep Learning", "NLP (Natural Language Processing)", "Computer Vision", "AI"],
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

const MOCK_COMPETITIONS = [
  // ---- Hackathons ----
  { id: 1, title: "Smart India Hackathon (SIH)", category: "hackathon", org: "Ministry of Education", domain: "All Domains", desc: "India's largest national-level hackathon. Teams solve government problem statements across 36 hours.", tags: ["hack", "sih", "government", "national"] },
  { id: 2, title: "HackFest 2026", category: "hackathon", org: "HackFest", domain: "Web Development", desc: "48-hour hackathon focused on building social impact solutions using modern web stack.", tags: ["hack", "web", "social"] },
  { id: 3, title: "HackCBS", category: "hackathon", org: "Shaheed Sukhdev College", domain: "Open Innovation", desc: "Delhi's biggest student-run hackathon with 36 hours of hacking.", tags: ["hack", "delhi", "student"] },
  { id: 4, title: "MLH Global Hack Week", category: "hackathon", org: "Major League Hacking", domain: "Open Source & Tech", desc: "Week-long themed hacking events run by MLH covering diverse tech topics.", tags: ["hack", "mlh", "open source"] },
  { id: 5, title: "AngelHack Global Hackathon", category: "hackathon", org: "AngelHack", domain: "FinTech & Startup", desc: "Global series with prizes for the most innovative startup ideas and prototypes.", tags: ["hack", "startup", "fintech", "global"] },
  { id: 6, title: "StackHack", category: "hackathon", org: "HackerEarth", domain: "Full Stack Development", desc: "Online hackathon for full-stack engineers with real-world problem statements.", tags: ["hack", "fullstack", "hackerearth"] },
  { id: 7, title: "Google Solution Challenge", category: "hackathon", org: "Google", domain: "Social Impact + AI", desc: "Build solutions for UN Sustainable Development Goals using Google technology.", tags: ["hack", "google", "sdg", "ai"] },
  { id: 8, title: "Microsoft Imagine Cup", category: "hackathon", org: "Microsoft", domain: "Innovation", desc: "Global student technology competition. Build innovative tech projects across AI, gaming, mixed reality.", tags: ["hack", "microsoft", "global", "student"] },
  { id: 9, title: "ETHIndia", category: "hackathon", org: "ETHIndia", domain: "Blockchain / Web3", desc: "India's largest Ethereum hackathon for building decentralised applications.", tags: ["hack", "blockchain", "web3", "ethereum"] },
  { id: 10, title: "Devfolio Hackathons", category: "hackathon", org: "Devfolio", domain: "Open Innovation", desc: "Hundreds of college and online hackathons hosted on India's largest hackathon platform.", tags: ["hack", "devfolio", "india", "college"] },
  { id: 11, title: "NASA Space Apps Challenge", category: "hackathon", org: "NASA", domain: "Space & Science", desc: "Global hackathon where participants solve space-related challenges using NASA open data.", tags: ["hack", "nasa", "space", "science", "global"] },
  { id: 12, title: "HackaHealth", category: "hackathon", org: "HackaHealth", domain: "HealthTech", desc: "Healthcare-focused hackathon focused on using technology to solve health challenges.", tags: ["hack", "health", "healthcare"] },
  { id: 13, title: "Fintech Hackathon by RBI", category: "hackathon", org: "Reserve Bank of India", domain: "FinTech", desc: "Regulator-run hackathon focused on next-gen financial technology solutions for India.", tags: ["hack", "fintech", "rbi", "finance"] },
  { id: 14, title: "HackThis Fall", category: "hackathon", org: "HackThis Fall", domain: "Open Source", desc: "Inclusivity-first 36-hour online hackathon open to students from all backgrounds.", tags: ["hack", "open source", "online", "beginner"] },
  // ---- Coding Contests ----
  { id: 15, title: "Google Kick Start", category: "coding", org: "Google", domain: "Competitive Programming", desc: "Online algorithmic competition in multiple rounds; gateway to Google hiring.", tags: ["code", "coding", "google", "competitive", "algorithm"] },
  { id: 16, title: "Google Code Jam", category: "coding", org: "Google", domain: "Competitive Programming", desc: "Google's flagship coding competition testing algorithms, mathematics and problem solving.", tags: ["code", "coding", "google", "competitive"] },
  { id: 17, title: "ACM ICPC (International Collegiate Programming Contest)", category: "coding", org: "ACM/ICPC Foundation", domain: "Competitive Programming", desc: "World's most prestigious team programming contest for university students.", tags: ["code", "coding", "icpc", "acm", "competitive", "university"] },
  { id: 18, title: "Codeforces Rounds", category: "coding", org: "Codeforces", domain: "Competitive Programming", desc: "Regular rated competitive programming rounds with Div 1, 2, 3 and 4 categories.", tags: ["code", "coding", "codeforces", "competitive", "algorithm"] },
  { id: 19, title: "LeetCode Weekly Contest", category: "coding", org: "LeetCode", domain: "Problem Solving", desc: "Weekly algorithmic problem-solving contests with global leaderboard rankings.", tags: ["code", "coding", "leetcode", "algorithm", "interview"] },
  { id: 20, title: "CodeChef Starters & Long Challenge", category: "coding", org: "CodeChef", domain: "Competitive Programming", desc: "Monthly and weekly competitive programming contests on CodeChef platform.", tags: ["code", "coding", "codechef", "competitive"] },
  { id: 21, title: "AtCoder Grand/Regular Contests", category: "coding", org: "AtCoder", domain: "Competitive Programming", desc: "High-quality algorithmic contests popular among competitive programmers globally.", tags: ["code", "coding", "atcoder", "competitive", "algorithm"] },
  { id: 22, title: "Facebook Hacker Cup", category: "coding", org: "Meta", domain: "Competitive Programming", desc: "Meta's annual open programming competition testing complex algorithmic problem solving.", tags: ["code", "coding", "meta", "facebook", "competitive"] },
  { id: 23, title: "HackerEarth Circuits", category: "coding", org: "HackerEarth", domain: "Competitive Programming", desc: "Monthly competitive programming contest with full solutions and editorials.", tags: ["code", "coding", "hackerearth", "competitive"] },
  // ---- Olympiads ----
  { id: 24, title: "Indian Informatics Olympiad (INOI)", category: "olympiad", org: "IARCS", domain: "Informatics / CS", desc: "National informatics olympiad pathways to represent India at IOI. Key stages: ZCO, ZRCO, INOI.", tags: ["olympiad", "informatics", "iarcs", "national", "cs"] },
  { id: 25, title: "International Olympiad in Informatics (IOI)", category: "olympiad", org: "IOI", domain: "Informatics / CS", desc: "Most prestigious international olympiad for secondary school students in computer science & algorithms.", tags: ["olympiad", "informatics", "ioi", "international", "cs"] },
  { id: 26, title: "International Mathematical Olympiad (IMO)", category: "olympiad", org: "IMO", domain: "Mathematics", desc: "World's oldest and most prestigious maths olympiad for pre-university students.", tags: ["olympiad", "maths", "mathematics", "imo", "international"] },
  { id: 27, title: "Indian National Mathematical Olympiad (INMO)", category: "olympiad", org: "HBCSE", domain: "Mathematics", desc: "Stage 3 of the Indian Olympiad pathway leading to IMO selection for Indian students.", tags: ["olympiad", "maths", "mathematics", "inmo", "national"] },
  { id: 28, title: "Regional Mathematical Olympiad (RMO)", category: "olympiad", org: "HBCSE", domain: "Mathematics", desc: "State-level maths olympiad. Top scorers advance to INMO.", tags: ["olympiad", "maths", "mathematics", "rmo", "regional"] },
  { id: 29, title: "International Physics Olympiad (IPhO)", category: "olympiad", org: "IPhO", domain: "Physics", desc: "International competition for secondary school students in physics.", tags: ["olympiad", "physics", "ipho", "international", "science"] },
  { id: 30, title: "National Standard Examination (NSE)", category: "olympiad", org: "IAPT / HBCSE", domain: "Physics / Chemistry / Bio", desc: "Entry level Indian olympiad exams (NSEP, NSEC, NSEB, NSEA) pathways to international olympiads.", tags: ["olympiad", "nse", "nsep", "nsec", "nseb", "science", "national"] },
  { id: 31, title: "International Olympiad on Astronomy & Astrophysics (IOAA)", category: "olympiad", org: "IOAA", domain: "Astronomy", desc: "International olympiad for high school students in astronomy and astrophysics.", tags: ["olympiad", "astronomy", "ioaa", "international", "science"] },
  { id: 32, title: "International AI Olympiad (IOAI)", category: "olympiad", org: "IOAI", domain: "Artificial Intelligence", desc: "Emerging international olympiad testing knowledge of AI, ML and data science concepts.", tags: ["olympiad", "ai", "artificial intelligence", "ioai", "international", "ml"] },
  // ---- Data Science / ML ----
  { id: 33, title: "Kaggle Featured Competitions", category: "data", org: "Kaggle", domain: "Data Science / ML", desc: "Ongoing machine learning competitions on Kaggle with prizes up to $100,000.", tags: ["kaggle", "data", "ml", "machine learning", "ai"] },
  { id: 34, title: "Analytics Vidhya Datathon", category: "data", org: "Analytics Vidhya", domain: "Data Science", desc: "Indian data science competitions across beginner to expert levels with leaderboards.", tags: ["data", "analytics", "datathon", "india", "ml"] },
  { id: 35, title: "Zindi Africa ML Challenge", category: "data", org: "Zindi", domain: "Machine Learning", desc: "Data science competitions focused on African societal problems with real datasets.", tags: ["data", "ml", "machine learning", "zindi", "africa"] },
  { id: 36, title: "DrivenData ML for Good", category: "data", org: "DrivenData", domain: "Social Impact + ML", desc: "Machine learning competitions targeting social good, humanitarian and environmental problems.", tags: ["data", "ml", "social", "drivendata", "good"] },
  { id: 37, title: "NeurIPS ML4Science Challenge", category: "data", org: "NeurIPS", domain: "AI Research", desc: "Machine learning for science challenges associated with the NeurIPS conference.", tags: ["data", "ml", "ai", "neurips", "research", "science"] },
  // ---- AI / Design / Business ----
  { id: 38, title: "Adobe Design Challenge", category: "design", org: "Adobe", domain: "UI/UX Design", desc: "Global design competition where students create innovative solutions using Adobe creative tools.", tags: ["design", "adobe", "uiux", "creative", "global"] },
  { id: 39, title: "Figma Config Design Challenge", category: "design", org: "Figma", domain: "Product Design", desc: "Annual design challenge by Figma celebrating innovative interface and product design.", tags: ["design", "figma", "ux", "product"] },
  { id: 40, title: "Microsoft AI Skills Challenge", category: "ai", org: "Microsoft", domain: "Artificial Intelligence", desc: "Learn AI and get certified; earn rewards by completing Microsoft learning paths.", tags: ["ai", "microsoft", "azure", "certification", "ml"] },
  { id: 41, title: "IEEE Xtreme Programming Competition", category: "coding", org: "IEEE", domain: "Competitive Programming", desc: "24-hour online programming competition open to IEEE student members worldwide.", tags: ["code", "coding", "ieee", "competitive", "24 hour"] },
  { id: 42, title: "Goldman Sachs Global Investment Research Challenge", category: "business", org: "Goldman Sachs", domain: "Finance & Strategy", desc: "Teams build investment cases and present to GS professionals. Great for finance aspirants.", tags: ["business", "finance", "goldman", "sachs", "investment"] },
  { id: 43, title: "CFA Institute Research Challenge", category: "business", org: "CFA Institute", domain: "Finance / Investment", desc: "Global equity research competition providing students with hands-on mentoring by CFA charterholders.", tags: ["business", "finance", "cfa", "investment", "research"] },
  { id: 44, title: "Topcoder Open", category: "coding", org: "Topcoder", domain: "Competitive Programming", desc: "Annual open competition covering algorithm, development and design tracks.", tags: ["code", "coding", "topcoder", "competitive", "algorithm"] },
  { id: 45, title: "Open Data Science Competition (ODSC)", category: "data", org: "ODSC", domain: "Data Science", desc: "Competitions tied to ODSC conferences across data science, ML and AI domains.", tags: ["data", "odsc", "ml", "ai", "conference"] },
];

const MOCK_INTERNSHIPS = [
  // ---- Big Tech ----
  { id: 101, org: "Google", title: "Google Summer of Code (GSoC)", domain: "Open Source", desc: "3-month paid programme to work on open source projects mentored by Google engineers.", duration: "3 months", stipend: "₹60,000+/mo", tags: ["google", "open source", "coding", "paid", "summer"] },
  { id: 102, org: "Google", title: "Google STEP Internship", domain: "Software Engineering", desc: "Student Training in Engineering Program for 1st and 2nd year CS students at Google.", duration: "3 months", stipend: "Paid (competitive)", tags: ["google", "engineering", "student", "first year"] },
  { id: 103, org: "Google", title: "Google Research Internship", domain: "AI / Research", desc: "Research internships across Google Brain, DeepMind and Google Research labs.", duration: "3–6 months", stipend: "Paid", tags: ["google", "research", "ai", "deepmind", "ml"] },
  { id: 104, org: "Microsoft", title: "Microsoft Explore Internship", domain: "Software Engineering", desc: "Internship for freshmen/sophomore students exploring PM, design, and engineering.", duration: "12 weeks", stipend: "Paid (competitive)", tags: ["microsoft", "engineering", "explore", "pm", "student"] },
  { id: 105, org: "Microsoft", title: "Microsoft Azure Cloud Internship", domain: "Cloud Computing", desc: "Work on Azure services, cloud infrastructure and enterprise software at Microsoft.", duration: "3 months", stipend: "Paid", tags: ["microsoft", "azure", "cloud", "infra"] },
  { id: 106, org: "Microsoft", title: "Microsoft Research Asia Internship", domain: "AI / Research", desc: "Research internship at MSRA on topics including NLP, CV, Distributed Systems, and Security.", duration: "3–6 months", stipend: "Paid", tags: ["microsoft", "research", "ai", "nlp", "asia"] },
  { id: 107, org: "Amazon", title: "Amazon SDE Internship", domain: "Software Development", desc: "Build real features at Amazon with a team. Work on AWS, Alexa, or Amazon retail.", duration: "3 months", stipend: "Paid (competitive)", tags: ["amazon", "sde", "aws", "software", "engineering"] },
  { id: 108, org: "Amazon", title: "AWS Solutions Architect Intern", domain: "Cloud Computing", desc: "Design and implement cloud solutions for AWS customers as a Solutions Architect intern.", duration: "3 months", stipend: "Paid", tags: ["amazon", "aws", "cloud", "architect", "solutions"] },
  { id: 109, org: "Meta", title: "Meta Software Engineer Internship", domain: "Software Engineering", desc: "Work on Facebook, Instagram, WhatsApp or Oculus products as a software engineering intern.", duration: "12 weeks", stipend: "Paid (competitive)", tags: ["meta", "facebook", "instagram", "engineering", "software"] },
  { id: 110, org: "Apple", title: "Apple iOS Engineering Internship", domain: "iOS Development", desc: "Contribute to iOS, macOS, watchOS platforms and first-party apps at Apple.", duration: "3 months", stipend: "Paid", tags: ["apple", "ios", "swift", "engineering", "mac"] },
  { id: 111, org: "Netflix", title: "Netflix Engineering Internship", domain: "Software Engineering", desc: "Work on streaming infrastructure, recommendation systems or UX at Netflix.", duration: "3 months", stipend: "Paid (top tier)", tags: ["netflix", "streaming", "engineering", "recommendation", "ml"] },
  { id: 112, org: "Adobe", title: "Adobe Research Internship", domain: "AI / Creative Tech", desc: "Work on AI, computer vision and creative technology research at Adobe Research.", duration: "3 months", stipend: "Paid", tags: ["adobe", "research", "ai", "creative", "cv", "design"] },
  { id: 113, org: "Salesforce", title: "Salesforce Intern", domain: "Cloud CRM", desc: "Build and test features for Salesforce CRM platform and ecosystem.", duration: "3 months", stipend: "Paid", tags: ["salesforce", "crm", "cloud", "enterprise", "business"] },
  { id: 114, org: "LinkedIn", title: "LinkedIn Engineering Internship", domain: "Software Engineering", desc: "Work on LinkedIn's professional network platform, search, feed or data infra.", duration: "3 months", stipend: "Paid", tags: ["linkedin", "engineering", "data", "networking", "software"] },
  // ---- Indian IT Giants ----
  { id: 115, org: "TCS", title: "TCS Digital Internship", domain: "IT Services", desc: "Internship in TCS's digital transformation projects covering cloud, AI and automation.", duration: "2–3 months", stipend: "₹10,000–15,000/mo", tags: ["tcs", "india", "it", "digital", "cloud", "automation"] },
  { id: 116, org: "TCS", title: "TCS Research & Innovation Internship", domain: "Research", desc: "Work with TCS Research on emerging tech like quantum computing, AI and materials science.", duration: "2–3 months", stipend: "₹15,000/mo", tags: ["tcs", "research", "ai", "quantum", "innovation", "india"] },
  { id: 117, org: "Infosys", title: "Infosys Springboard Internship", domain: "Software Development", desc: "Hands-on internship programme developing enterprise software solutions for Infosys clients.", duration: "2 months", stipend: "₹10,000/mo", tags: ["infosys", "india", "software", "enterprise", "springboard"] },
  { id: 118, org: "Wipro", title: "Wipro Turbo Internship", domain: "IT Services", desc: "Turbo track internship at Wipro covering full-stack development and agile methodologies.", duration: "2 months", stipend: "₹10,000/mo", tags: ["wipro", "india", "fullstack", "agile", "it"] },
  { id: 119, org: "HCL", title: "HCL TechBee Internship", domain: "IT Services", desc: "Industry-integrated programme with Wipro offering early career tech exposure.", duration: "3 months", stipend: "Stipend provided", tags: ["hcl", "india", "tech", "engineering", "it"] },
  { id: 120, org: "Cognizant", title: "Cognizant Skills Accelerator", domain: "IT & Consulting", desc: "Programme combining skilling, SAP and cloud consulting work for IT services delivery.", duration: "2 months", stipend: "₹8,000–12,000/mo", tags: ["cognizant", "india", "consulting", "sap", "cloud", "it"] },
  { id: 121, org: "Tech Mahindra", title: "Tech Mahindra SMART Internship", domain: "Digital / IT", desc: "5G, AI, and digital transformation internship at Tech Mahindra's innovation labs.", duration: "2 months", stipend: "₹10,000/mo", tags: ["tech mahindra", "india", "5g", "ai", "digital", "telecom"] },
  { id: 122, org: "Capgemini", title: "Capgemini Invent Internship", domain: "Consulting / Tech", desc: "Work on digital transformation, strategy and data analytics projects for global clients.", duration: "2 months", stipend: "₹12,000/mo", tags: ["capgemini", "consulting", "digital", "strategy", "india"] },
  // ---- Indian Startups & Unicorns ----
  { id: 123, org: "Razorpay", title: "Razorpay Engineering Intern", domain: "FinTech", desc: "Work on India's leading payment gateway infrastructure processing billions of transactions.", duration: "3 months", stipend: "₹30,000–50,000/mo", tags: ["razorpay", "fintech", "payments", "engineering", "india", "startup"] },
  { id: 124, org: "Zerodha", title: "Zerodha Technology Internship", domain: "FinTech", desc: "Build trading platform features and infra for India's largest stock broker.", duration: "3 months", stipend: "₹25,000–40,000/mo", tags: ["zerodha", "fintech", "trading", "engineering", "india"] },
  { id: 125, org: "CRED", title: "CRED Product / Engineering Intern", domain: "FinTech / Product", desc: "Work on CRED's financial reward platform used by India's premium credit card holders.", duration: "3 months", stipend: "₹30,000–50,000/mo", tags: ["cred", "fintech", "product", "engineering", "india", "startup"] },
  { id: 126, org: "Meesho", title: "Meesho SDE Internship", domain: "E-Commerce", desc: "Build e-commerce features at Meesho serving tier 2 and 3 Indian cities.", duration: "3 months", stipend: "₹30,000+/mo", tags: ["meesho", "ecommerce", "engineering", "india", "startup"] },
  { id: 127, org: "Swiggy", title: "Swiggy Engineering Internship", domain: "Food Tech", desc: "Work on order management, logistics, and restaurant tech at Swiggy's engineering team.", duration: "3 months", stipend: "₹30,000–45,000/mo", tags: ["swiggy", "foodtech", "engineering", "logistics", "india"] },
  { id: 128, org: "Zomato", title: "Zomato SDE / Data Internship", domain: "Food Tech / Data", desc: "Build consumer-facing features or work on data science at Zomato's engineering division.", duration: "3 months", stipend: "₹25,000–40,000/mo", tags: ["zomato", "foodtech", "data", "engineering", "india", "startup"] },
  { id: 129, org: "PhonePe", title: "PhonePe Engineering Intern", domain: "FinTech", desc: "Work on UPI payments, financial services infra and merchant solutions at PhonePe.", duration: "3 months", stipend: "₹30,000–50,000/mo", tags: ["phonepe", "fintech", "upi", "payments", "engineering", "india"] },
  { id: 130, org: "Paytm", title: "Paytm Technology Internship", domain: "FinTech", desc: "Join Paytm's tech team working on digital payments, insurance, and lending platforms.", duration: "2–3 months", stipend: "₹20,000–30,000/mo", tags: ["paytm", "fintech", "payments", "technology", "india"] },
  { id: 131, org: "Ola", title: "Ola Engineering Internship", domain: "Mobility Tech", desc: "Work on ride-hailing, EV, or maps technology at Ola's engineering team.", duration: "3 months", stipend: "₹25,000–40,000/mo", tags: ["ola", "mobility", "ev", "engineering", "maps", "india"] },
  { id: 132, org: "Flipkart", title: "Flipkart Engineering Intern", domain: "E-Commerce", desc: "Join Flipkart engineering working on search, recommendations, supply chain or payments.", duration: "3 months", stipend: "₹30,000–50,000/mo", tags: ["flipkart", "ecommerce", "engineering", "india", "recommendations", "walmart"] },
  { id: 133, org: "Byju's", title: "Byju's Product Engineering Intern", domain: "EdTech", desc: "Work on learning platforms, content delivery, and student analytics at Byju's.", duration: "2 months", stipend: "₹15,000–25,000/mo", tags: ["byjus", "edtech", "engineering", "education", "india"] },
  { id: 134, org: "Dunzo", title: "Dunzo Backend Engineering Intern", domain: "Quick Commerce", desc: "Build logistics and hyperlocal delivery systems at Dunzo's quick-commerce platform.", duration: "3 months", stipend: "₹20,000–35,000/mo", tags: ["dunzo", "logistics", "quickcommerce", "backend", "india"] },
  // ---- Research & Government ----
  { id: 135, org: "ISRO", title: "ISRO Student Internship Programme", domain: "Space & Engineering", desc: "Internship at ISRO centres working on satellite, launch vehicle, and space applications.", duration: "2–6 months", stipend: "₹5,000–10,000/mo", tags: ["isro", "space", "research", "government", "engineering", "india"] },
  { id: 136, org: "DRDO", title: "DRDO Research Internship", domain: "Defence Technology", desc: "Work with DRDO laboratories on defence electronics, AI and embedded systems.", duration: "2 months", stipend: "₹5,000–8,000/mo", tags: ["drdo", "defence", "research", "government", "engineering", "india"] },
  { id: 137, org: "IIT Research", title: "IIT Research Internship (SURGE/SRIP)", domain: "Research", desc: "Summer research programmes (SURGE at IIT Kanpur, SRIP at IIT Bombay) for undergrads.", duration: "2 months", stipend: "₹5,000–15,000/mo", tags: ["iit", "research", "surge", "srip", "india", "academic"] },
  { id: 138, org: "CSIR", title: "CSIR Research Internship", domain: "Science & Tech Research", desc: "Research opportunities across CSIR labs in chemistry, physics, biology and engineering.", duration: "2–3 months", stipend: "₹5,000–8,000/mo", tags: ["csir", "research", "science", "lab", "government", "india"] },
  { id: 139, org: "NASSCOM", title: "NASSCOM Future Skills Internship", domain: "IT Industry", desc: "Industry-integrated learning programme under NASSCOM with leading IT partner companies.", duration: "3 months", stipend: "Stipend varies", tags: ["nasscom", "it", "india", "skills", "industry", "future"] },
  // ---- Finance & Consulting ----
  { id: 140, org: "Goldman Sachs", title: "Goldman Sachs Engineering Internship", domain: "FinTech / Finance", desc: "Work on trading systems, risk platforms and software at Goldman Sachs' tech division.", duration: "10 weeks", stipend: "Paid (top tier)", tags: ["goldman", "sachs", "finance", "fintech", "engineering", "investment"] },
  { id: 141, org: "Morgan Stanley", title: "Morgan Stanley Technology Internship", domain: "Finance / Tech", desc: "Technology internship at Morgan Stanley working on financial systems and platforms.", duration: "10 weeks", stipend: "Paid", tags: ["morgan", "stanley", "finance", "technology", "investment"] },
  { id: 142, org: "JP Morgan", title: "JP Morgan Code For Good Hackathon + Internship", domain: "Finance / Software", desc: "24-hour hackathon with top performers receiving internship offers at JP Morgan.", duration: "10 weeks", stipend: "Paid", tags: ["jpmorgan", "jp morgan", "finance", "software", "hackathon", "investment"] },
  { id: 143, org: "Deutsche Bank", title: "Deutsche Bank Technology Internship", domain: "Finance / Tech", desc: "Tech internship at Deutsche Bank focusing on banking systems, data and APIs.", duration: "10 weeks", stipend: "Paid", tags: ["deutsche", "bank", "finance", "technology", "banking"] },
  { id: 144, org: "Deloitte", title: "Deloitte Technology Consulting Internship", domain: "Consulting / Tech", desc: "Work on digital transformation and enterprise tech consulting projects at Deloitte.", duration: "2 months", stipend: "₹25,000–40,000/mo", tags: ["deloitte", "consulting", "technology", "digital", "enterprise"] },
  { id: 145, org: "Accenture", title: "Accenture Technology Intern", domain: "IT Consulting", desc: "Consulting internship on cloud migration, AI and industry 4.0 with Accenture clients.", duration: "2 months", stipend: "₹15,000–25,000/mo", tags: ["accenture", "consulting", "cloud", "ai", "technology", "industry"] },
  // ---- Other Global Tech ----
  { id: 146, org: "IBM", title: "IBM Research Internship", domain: "AI / Quantum", desc: "Research internship at IBM Research working on quantum computing, AI and hybrid cloud.", duration: "3 months", stipend: "Paid", tags: ["ibm", "research", "quantum", "ai", "cloud", "computing"] },
  { id: 147, org: "Intel", title: "Intel Hardware Engineering Internship", domain: "Computer Architecture", desc: "Work on chip design, VLSI, hardware verification, or compiler development at Intel.", duration: "3 months", stipend: "Paid", tags: ["intel", "hardware", "chip", "vlsi", "architecture", "engineering"] },
  { id: 148, org: "Qualcomm", title: "Qualcomm Engineering Internship", domain: "Semiconductor / Mobile", desc: "Work on 5G modems, Snapdragon SoC, AI at the edge and embedded systems at Qualcomm.", duration: "3 months", stipend: "Paid", tags: ["qualcomm", "semiconductor", "5g", "mobile", "engineering", "embedded"] },
  { id: 149, org: "Cisco", title: "Cisco Network Software Intern", domain: "Networking / Software", desc: "Develop software for routers, switches and security systems at Cisco.", duration: "3 months", stipend: "Paid", tags: ["cisco", "networking", "software", "security", "network", "engineering"] },
  { id: 150, org: "Oracle", title: "Oracle Cloud Infrastructure Intern", domain: "Cloud / Software", desc: "Work on OCI services, databases, and Java platform engineering at Oracle.", duration: "3 months", stipend: "Paid", tags: ["oracle", "cloud", "database", "java", "oci", "software"] },
  { id: 151, org: "SAP", title: "SAP Labs India Internship", domain: "Enterprise Software", desc: "Build enterprise applications, AI features and HANA database tools at SAP Labs Bangalore.", duration: "6 months", stipend: "₹20,000–30,000/mo", tags: ["sap", "enterprise", "database", "engineering", "india", "erp"] },
  { id: 152, org: "Uber", title: "Uber Software Engineering Internship", domain: "Mobility / Tech", desc: "Work on maps, pricing, payments or driver experience at Uber's engineering teams.", duration: "3 months", stipend: "Paid (competitive)", tags: ["uber", "mobility", "software", "maps", "engineering", "payments"] },
  { id: 153, org: "Stripe", title: "Stripe Engineering Internship", domain: "Payments / FinTech", desc: "Build global payments infrastructure at Stripe, one of the world's most valuable startups.", duration: "3 months", stipend: "Paid (top tier)", tags: ["stripe", "payments", "fintech", "engineering", "startup", "infrastructure"] },
];

const COMP_STATUSES = ["Interested", "Registered", "Ongoing", "Completed", "Won"];
const INTERN_STATUSES = ["Interested", "Applied", "Ongoing", "Completed"];

// Competition category aliases for smart search
const COMP_ALIASES = {
  "hack": "hackathon", "hackathon": "hackathon", "hacks": "hackathon", "hackfest": "hackathon",
  "olympiad": "olympiad", "olympiads": "olympiad", "imo": "olympiad", "ioi": "olympiad",
  "maths": "olympiad", "math": "olympiad", "mathematics": "olympiad",
  "code": "coding", "coding": "coding", "competitive": "coding", "algorithm": "coding",
  "codeforces": "coding", "leetcode": "coding", "codechef": "coding",
  "data": "data", "kaggle": "data", "datathon": "data", "ml competition": "data",
  "ai competition": "ai", "design challenge": "design", "design": "design",
  "business": "business", "finance competition": "business",
};

const MOCK_ACTIVITY = [
  { text: "Added Python as learning goal", time: "2 days ago" },
  { text: "Completed 'Variables & Data Types' in JavaScript", time: "3 days ago" },
  { text: "Applied for Google Summer of Code", time: "5 days ago" },
  { text: "Won HackFest 2025", time: "1 week ago" },
  { text: "Started learning React", time: "2 weeks ago" },
];



// ==================== COMPONENTS ====================

function Modal({ icon, title, msg, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">{icon}</div>
        <div className="modal-title">{title}</div>
        <div className="modal-msg">{msg}</div>
        <div className="modal-actions">{children}</div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>DSS for Students</h3>
            <p>Empowering students to make structured, informed decisions about their academic and career future.</p>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <div className="footer-contact">
              <a href="tel:+919876543210">📞 +91 98765 43210</a>
              <a href="https://instagram.com/dss_students" target="_blank" rel="noreferrer">📸 @dss_students</a>
              <a href="https://twitter.com/dss_students" target="_blank" rel="noreferrer">🐦 @dss_students</a>
              <a href="mailto:support@dssstudents.in">✉️ support@dssstudents.in</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Decision Support System for Students. All rights reserved.</div>
      </div>
    </footer>
  );
}

function Navbar({ page, setPage, isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const links = isLoggedIn
    ? [["🏠 Home", "home"], ["📊 Dashboard", "dashboard"], ["🎯 Decision", "decision"], ["🚀 Opportunities", "opportunities"], ["📜 History", "history"], ["👤 Profile", "profile"]]
    : [];

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => setPage(isLoggedIn ? "home" : "welcome")}>
        DSS<span>•</span>
      </div>
      {isLoggedIn && (
        <>
          <div className={`navbar-links${open ? " open" : ""}`}>
            {links.map(([label, id]) => (
              <button key={id} className={`nav-link${page === id ? " active" : ""}`}
                onClick={() => { setPage(id); setOpen(false); }}>{label}</button>
            ))}
          </div>
          <div className="hamburger" onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </div>
        </>
      )}
    </nav>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Won": "badge-green", "Completed": "badge-green", "Ongoing": "badge-yellow",
    "Applied": "badge-blue", "Registered": "badge-blue", "Interested": "badge-gray"
  };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
}

// ==================== WELCOME PAGE ====================
function WelcomePage({ storedUser, onLogin, onGoSignup }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [modal, setModal] = useState(null);

  const handleLogin = () => {
    if (!storedUser) { setModal("nouser"); return; }
    const ok = form.email === storedUser.email && form.password === storedUser.password;
    if (ok) onLogin();
    else setModal("error");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="welcome-wrap">
        <div className="welcome-left">
          <div className="welcome-brand">
            <h1>DSS • for Students</h1>
            <p>Make smarter academic & career decisions</p>
          </div>
          <div className="welcome-tabs">
            <button className={`welcome-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Login</button>
            <button className={`welcome-tab${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); onGoSignup(); }}>Sign Up</button>
          </div>
          {tab === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button className="btn btn-primary btn-lg btn-full" style={{ marginTop: 8 }} onClick={handleLogin}>
                Login →
              </button>
              {!storedUser && (
                <p className="text-sm text-muted text-center">
                  No account yet? <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => { setTab("signup"); onGoSignup(); }}>Create one</span>
                </p>
              )}
            </div>
          )}
          {tab === "signup" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>✨</div>
              <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>Create your profile to get started with personalized decision support.</p>
              <button className="btn btn-primary btn-lg btn-full" onClick={onGoSignup}>Create Your Profile →</button>
            </div>
          )}
        </div>
        <div className="welcome-right">
          <div className="welcome-geo" style={{ width: 200, height: 200, top: "10%", right: "5%", animationDelay: "0s" }} />
          <div className="welcome-geo" style={{ width: 120, height: 120, bottom: "20%", left: "8%", animationDelay: "1s" }} />
          <div className="welcome-geo" style={{ width: 80, height: 80, top: "50%", left: "20%", animationDelay: "2s" }} />
          <div className="welcome-right-content">
            <h2>Make Smarter Academic & Career Decisions</h2>
            <p>A structured system to help students evaluate choices, track skills, and build their professional future with clarity.</p>
            <div className="feature-list">
              <div className="feature-item"><span className="feature-icon">🎯</span><span>Multi-Criteria Evaluation Framework</span></div>
              <div className="feature-item"><span className="feature-icon">⚖️</span><span>Personalized Weight Assignment</span></div>
              <div className="feature-item"><span className="feature-icon">🔍</span><span>Transparent & Explainable Results</span></div>
            </div>
          </div>
        </div>
      </div>
      {modal === "error" && (
        <Modal icon="❌" title="Wrong Credentials" msg="Please check your email and password and try again.">
          <button className="btn btn-primary" onClick={() => setModal(null)}>Try Again</button>
        </Modal>
      )}
      {modal === "nouser" && (
        <Modal icon="👤" title="No Account Found" msg="Please sign up first to create your profile.">
          <button className="btn btn-primary" onClick={() => { setModal(null); setTab("signup"); onGoSignup(); }}>Sign Up Now</button>
          <button className="btn btn-outline" onClick={() => setModal(null)}>Close</button>
        </Modal>
      )}
    </>
  );
}

// ==================== SIGNUP FIELD (defined outside SignUpPage to prevent focus loss) ====================
function SignUpField({ label, name, type = "text", placeholder = "", opts = null, form, errors, set }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{errors[name] && <span style={{ color: "var(--error)", marginLeft: 6, fontWeight: 400 }}>{errors[name]}</span>}</label>
      {opts ? (
        <select className="form-input" value={form[name]} onChange={e => set(name, e.target.value)}>
          <option value="">Select…</option>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea className="form-input" placeholder={placeholder} value={form[name]} onChange={e => set(name, e.target.value)} />
      ) : (
        <input className="form-input" type={type} placeholder={placeholder} value={form[name]} onChange={e => set(name, e.target.value)} />
      )}
    </div>
  );
}

// ==================== SIGNUP PAGE ====================
function SignUpPage({ existing, onSave, onCancel }) {
  const blank = { name: "", email: "", phone: "", password: "", domainOfInterest: "", educationLevel: "", skills: "", careerGoal: "", primaryDomain: "", skillLevel: "", careerAspiration: "", learningHoursPerWeek: "" };
  const [form, setForm] = useState(existing ? { ...existing, skills: Array.isArray(existing.skills) ? existing.skills.join(", ") : existing.skills } : blank);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (!form.domainOfInterest) e.domainOfInterest = "Required";
    if (!form.educationLevel) e.educationLevel = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => { if (validate()) setModal(true); };
  const confirm = () => {
    onSave({ ...form, skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [] });
    setModal(false);
  };



  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="text-center mb-6">
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 8 }}>
              {existing ? "Edit Your Profile" : "Welcome to DSS"}
            </h1>
            <p className="text-muted">{existing ? "Update your information below." : "Let's personalize your journey and help you make smarter decisions."}</p>
          </div>
          <div className="card">
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="grid-2">
                <SignUpField label="Full Name *" name="name" placeholder="Anukriti Srivastava" form={form} errors={errors} set={set} />
                <SignUpField label="Email Address *" name="email" type="email" placeholder="you@example.com" form={form} errors={errors} set={set} />
              </div>
              <div className="grid-2">
                <SignUpField label="Phone Number *" name="phone" type="tel" placeholder="9876543210" form={form} errors={errors} set={set} />
                <SignUpField label="Password *" name="password" type="password" placeholder="Min 6 characters" form={form} errors={errors} set={set} />
              </div>
              <div className="grid-2">
                <SignUpField label="Domain of Interest *" name="domainOfInterest" placeholder="e.g. Web Development, AI" form={form} errors={errors} set={set} />
                <SignUpField label="Education Level *" name="educationLevel" opts={["High School", "Diploma", "B.Tech/B.E", "B.Sc", "BCA", "MCA", "M.Tech", "MBA", "Other"]} form={form} errors={errors} set={set} />
              </div>
              <SignUpField label="Skills (comma-separated)" name="skills" placeholder="JavaScript, Python, React" form={form} errors={errors} set={set} />
              <div className="grid-2">
                <SignUpField label="Primary Domain" name="primaryDomain" opts={["Web Development", "Artificial Intelligence", "Data Science", "Cybersecurity", "Cloud Computing", "Mobile Development", "Game Development", "Other"]} form={form} errors={errors} set={set} />
                <SignUpField label="Current Skill Level" name="skillLevel" opts={["Beginner", "Intermediate", "Advanced"]} form={form} errors={errors} set={set} />
              </div>
              <SignUpField label="Career Goal" name="careerGoal" type="textarea" placeholder="e.g. Become a Full Stack Developer" form={form} errors={errors} set={set} />
              <SignUpField label="Career Aspiration" name="careerAspiration" type="textarea" placeholder="e.g. Work at a top tech company" form={form} errors={errors} set={set} />
              <div className="grid-2">
                <SignUpField label="Learning Hours Per Week" name="learningHoursPerWeek" type="number" placeholder="15" form={form} errors={errors} set={set} />
                <div />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={submit}>
                  {existing ? "Update Profile ✓" : "Create Profile →"}
                </button>
                {onCancel && <button className="btn btn-outline" onClick={onCancel}>Cancel</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <Modal icon={existing ? "✅" : "🎉"} title={existing ? "Profile Updated!" : "Registration Successful!"}
          msg={existing ? "Your profile has been updated successfully." : "Your profile has been created. Welcome to DSS!"}>
          <button className="btn btn-primary" onClick={confirm}>{existing ? "Back to Profile" : "Go to Dashboard →"}</button>
        </Modal>
      )}
    </div>
  );
}

// ==================== HOME PAGE ====================
function HomePage({ user }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="container hero-content">
          <h1>Decision Support System<br /><em>for Students</em></h1>
          <p>Empowering students to make structured and informed decisions about their skills, careers, and opportunities.</p>
          <div className="hero-actions">
            <div className="badge badge-blue" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>✓ Skills Tracking</div>
            <div className="badge badge-green" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>✓ Opportunity Discovery</div>
            <div className="badge badge-yellow" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>✓ Progress Analytics</div>
          </div>
        </div>
      </div>
      <div className="container section">
        <div className="card about-card">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: 16, color: "var(--text)" }}>About This System</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.95rem" }}>
            The Decision Support System (DSS) for Students is a structured web platform designed to help students navigate their academic and career paths with clarity and confidence. In a world full of choices — which skills to learn, which internships to apply for, which competitions to participate in — DSS provides a personalized framework for rational, structured evaluation.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.95rem", marginTop: 14 }}>
            By tracking your learning progress, monitoring opportunities, and maintaining a clear history of your growth, DSS helps you see the bigger picture and make decisions that align with your long-term career aspirations.
          </p>
          <div className="card-grid" style={{ marginTop: 32 }}>
            {[["🎯", "Goal Setting", "Define and track your learning goals with precision"], ["📈", "Analytics", "Monitor your growth with detailed performance metrics"], ["🚀", "Opportunities", "Discover internships and competitions relevant to your domain"], ["📜", "History", "Maintain a transparent record of all your activities"]].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "var(--bg-section)", borderRadius: "var(--radius-sm)", padding: 20 }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
function DashboardPage({ user, learningSkills, opportunities }) {
  const completedSkills = learningSkills.filter(s => s.progress === 100);
  const activeSkills = learningSkills.filter(s => s.progress < 100);
  const competitions = opportunities.filter(o => o.type === "competition");
  const internships = opportunities.filter(o => o.type === "internship");
  const totalHours = user?.learningHoursPerWeek ? parseInt(user.learningHoursPerWeek) * 8 : 120;

  return (
    <div className="page">
      <div className="container section">
        <div className="welcome-banner">
          <h2>Welcome back, {user?.name || "Student"}! 👋</h2>
          <p>Track your progress and continue building your future.</p>
        </div>

        <div className="section-header"><h2 className="section-title">📊 Learning Analytics</h2></div>
        <div className="card-grid">
          {[
            ["📚", "#EFF6FF", learningSkills.length, "Skills Learning", "var(--primary)"],
            ["✅", "#F0FDF4", completedSkills.length, "Skills Completed", "var(--success)"],
            ["⏱️", "#FFFBEB", totalHours, "Learning Hours", "#D97706"],
            ["🎯", "#F5F3FF", user?.primaryDomain || "Web Dev", "Domain Focus", "#7C3AED"],
          ].map(([icon, bg, val, label, color]) => (
            <div key={label} className="stat-card">
              <div className="stat-icon" style={{ background: bg }}>{icon}</div>
              <div className="stat-value" style={{ color }}>{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="section-header mt-8"><h2 className="section-title">🧠 Skills Overview</h2></div>
        <div className="card-grid">
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Currently Learning</h3>
              {activeSkills.length === 0 && <p className="text-muted text-sm">No skills in progress. Go to Decision page to add skills.</p>}
              {activeSkills.map(s => (
                <div key={s.name} style={{ marginBottom: 16 }}>
                  <div className="flex-between mb-4">
                    <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{s.name}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 700 }}>{s.progress}%</span>
                  </div>
                  <ProgressBar value={s.progress} />
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Completed Skills</h3>
              {completedSkills.length === 0 && <p className="text-muted text-sm">No completed skills yet. Keep learning!</p>}
              {completedSkills.map(s => (
                <div key={s.name} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{s.name}</span>
                  <span className="badge badge-green">✓ Done</span>
                </div>
              ))}
              {user?.primaryDomain && (
                <div className="mt-6">
                  <div className="text-sm text-muted mb-4">Domain Focus</div>
                  <span className="badge badge-blue" style={{ padding: "6px 14px", fontSize: "0.85rem" }}>{user.primaryDomain}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="section-header mt-8"><h2 className="section-title">🏆 Participation Summary</h2></div>
        <div className="card-grid">
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏅 Competitions</h3>
              {[
                ["Total Participated", competitions.filter(c => c.status && c.status !== "Interested").length],
                ["Ongoing", competitions.filter(c => c.status === "Ongoing").length],
                ["Completed", competitions.filter(c => c.status === "Completed" || c.status === "Won").length],
                ["Won 🏆", competitions.filter(c => c.status === "Won").length],
              ].map(([k, v]) => (
                <div key={k} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm text-muted">{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>💼 Internships</h3>
              {[
                ["Applied", internships.filter(i => i.status === "Applied").length],
                ["Ongoing", internships.filter(i => i.status === "Ongoing").length],
                ["Completed", internships.filter(i => i.status === "Completed").length],
                ["Total Tracked", internships.filter(i => i.status).length],
              ].map(([k, v]) => (
                <div key={k} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm text-muted">{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ==================== DECISION PAGE ====================
function DecisionPage({ learningSkills, setLearningSkills, addActivity, addSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const doSearch = () => {
    if (!query.trim()) return;
    addSearch(query);
    const q = query.toLowerCase().trim();
    const allSkills = Object.keys(MOCK_SKILLS);

    // 1. Check alias map first
    const aliasHits = SKILL_ALIASES[q] || [];

    // 2. Direct name match
    const nameMatches = allSkills.filter(k =>
      k.toLowerCase().includes(q) || q.includes(k.toLowerCase().split(" ")[0])
    );

    // 3. Subtopic match (skill whose subtopics mention the query)
    const topicMatches = allSkills.filter(k =>
      MOCK_SKILLS[k].some(t => t.toLowerCase().includes(q))
    );

    // 4. Merge, deduplicate, preserve relevance order
    const ordered = [...new Set([...aliasHits, ...nameMatches, ...topicMatches])];
    setResults(ordered.length > 0 ? ordered.slice(0, 12) : allSkills.slice(0, 12));
    setSearched(true);
  };

  const addSkill = (skillName) => {
    if (learningSkills.find(s => s.name === skillName)) return;
    const topics = MOCK_SKILLS[skillName].map(t => ({ name: t, completed: false }));
    setLearningSkills(prev => [...prev, { name: skillName, topics, progress: 0 }]);
    addActivity(`Added ${skillName} as learning goal`);
  };

  const toggleTopic = (skillName, topicName) => {
    setLearningSkills(prev => prev.map(s => {
      if (s.name !== skillName) return s;
      const topics = s.topics.map(t => t.name === topicName ? { ...t, completed: !t.completed } : t);
      const done = topics.filter(t => t.completed).length;
      const progress = Math.round((done / topics.length) * 100);
      if (progress === 100 && s.progress < 100) addActivity(`Completed all topics in ${skillName}! 🎉`);
      else if (topics.find(t => t.name === topicName)?.completed === false) addActivity(`Completed "${topicName}" in ${skillName}`);
      return { ...s, topics, progress };
    }));
  };

  return (
    <div className="page">
      <div className="container section">
        <div className="section-header">
          <h1 className="section-title" style={{ fontSize: "1.6rem" }}>🎯 Decision — Skill Planning</h1>
          <p className="section-sub">Search skills, set learning goals, and track your progress.</p>
        </div>

        <div className="card mb-6">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🔍 Search Skills</h3>
            <div className="search-bar">
              <input className="form-input" placeholder="Search skills (e.g. JavaScript, AI, Web Development...)" value={query}
                onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} />
              <button className="btn btn-primary" onClick={doSearch}>Search</button>
            </div>
            {searched && (
              <div className="search-results">
                {results.map(r => {
                  const added = !!learningSkills.find(s => s.name === r);
                  return (
                    <div key={r} className={`result-chip${added ? " added" : ""}`} onClick={() => !added && addSkill(r)}>
                      {added ? "✓ " : "+ "}{r}
                    </div>
                  );
                })}
              </div>
            )}
            {!searched && (
              <div className="search-results">
                {Object.keys(MOCK_SKILLS).map(r => {
                  const added = !!learningSkills.find(s => s.name === r);
                  return (
                    <div key={r} className={`result-chip${added ? " added" : ""}`} onClick={() => !added && addSkill(r)}>
                      {added ? "✓ " : "+ "}{r}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {learningSkills.length > 0 && (
          <>
            <div className="section-header"><h2 className="section-title">📚 My Learning Goals</h2></div>
            <div className="card-grid">
              {learningSkills.map(skill => (
                <div key={skill.name} className="skill-card">
                  <div className="skill-card-header">
                    <div>
                      <div className="skill-name">{skill.name}</div>
                      <div className="text-sm text-muted">{skill.topics.filter(t => t.completed).length}/{skill.topics.length} topics</div>
                    </div>
                    {skill.progress === 100 ? <span className="badge badge-green">✓ Complete</span> : <span className="badge badge-blue">{skill.progress}%</span>}
                  </div>
                  <div className="mb-4"><ProgressBar value={skill.progress} /></div>
                  <div>
                    {skill.topics.map(t => (
                      <div key={t.name} className="subtopic-item">
                        <input type="checkbox" checked={t.completed} onChange={() => toggleTopic(skill.name, t.name)} />
                        <span className={`subtopic-label${t.completed ? " done" : ""}`}>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {learningSkills.length === 0 && (
          <div className="card text-center" style={{ padding: "48px 24px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🌱</div>
            <h3 style={{ marginBottom: 8 }}>No learning goals yet</h3>
            <p className="text-muted text-sm">Search and add skills above to start tracking your learning journey.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// ==================== OPPORTUNITIES PAGE ====================
function OpportunitiesPage({ opportunities, setOpportunities, addActivity, addSearch }) {
  const [type, setType] = useState("competition");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(MOCK_COMPETITIONS);

  const pool = type === "competition" ? MOCK_COMPETITIONS : MOCK_INTERNSHIPS;

  const doSearch = (q = query, currentPool = pool) => {
    const raw = q.toLowerCase().trim();
    if (raw && q.trim()) addSearch(q.trim());

    if (!raw) { setResults(currentPool); return; }

    if (type === "competition") {
      // Check if query matches a category alias
      const catMatch = COMP_ALIASES[raw];
      if (catMatch) {
        const catResults = currentPool.filter(p => p.category === catMatch);
        setResults(catResults.length > 0 ? catResults : currentPool);
        return;
      }
      // Otherwise do full text search across title, org, domain, desc and tags
      const res = currentPool.filter(p =>
        p.title.toLowerCase().includes(raw) ||
        p.org.toLowerCase().includes(raw) ||
        p.domain.toLowerCase().includes(raw) ||
        p.desc.toLowerCase().includes(raw) ||
        (p.tags || []).some(t => t.includes(raw))
      );
      setResults(res.length > 0 ? res : currentPool);
    } else {
      // Internship: search by org name, tags, title, domain, desc
      const res = currentPool.filter(p =>
        p.org.toLowerCase().includes(raw) ||
        p.title.toLowerCase().includes(raw) ||
        p.domain.toLowerCase().includes(raw) ||
        p.desc.toLowerCase().includes(raw) ||
        (p.tags || []).some(t => t.includes(raw))
      );
      setResults(res.length > 0 ? res : currentPool);
    }
  };

  const switchType = (t) => {
    setType(t);
    setQuery("");
    const newPool = t === "competition" ? MOCK_COMPETITIONS : MOCK_INTERNSHIPS;
    setResults(newPool);
  };

  const setStatus = (id, status) => {
    setOpportunities(prev => {
      const existing = prev.find(o => o.id === id);
      const item = pool.find(p => p.id === id);
      const newStatus = { id, type, title: item.title, domain: item.domain, status };
      addActivity(`Updated ${item.title} to "${status}"`);
      if (existing) return prev.map(o => o.id === id ? newStatus : o);
      return [...prev, newStatus];
    });
  };

  const getStatus = (id) => opportunities.find(o => o.id === id)?.status || null;
  const statuses = type === "competition" ? COMP_STATUSES : INTERN_STATUSES;

  const compPlaceholder = "Search by name, org or keyword (e.g. hack, olympiad, google, kaggle, codeforces…)";
  const internPlaceholder = "Search by org or keyword (e.g. google, tcs, fintech, swiggy, research, cloud…)";

  const categoryColors = { hackathon: "badge-blue", coding: "badge-yellow", olympiad: "badge-green", data: "badge-blue", ai: "badge-blue", design: "badge-gray", business: "badge-gray" };
  const categoryLabels = { hackathon: "🔨 Hackathon", coding: "💻 Coding", olympiad: "🏆 Olympiad", data: "📊 Data Science", ai: "🤖 AI/ML", design: "🎨 Design", business: "💼 Business" };

  return (
    <div className="page">
      <div className="container section">
        <div className="section-header">
          <h1 className="section-title" style={{ fontSize: "1.6rem" }}>🚀 Opportunities</h1>
          <p className="section-sub">Discover internships and competitions relevant to your interests.</p>
        </div>

        <div className="flex-gap mb-6">
          <div className="type-toggle">
            <button className={`type-btn${type === "competition" ? " active" : ""}`} onClick={() => switchType("competition")}>🏅 Competitions</button>
            <button className={`type-btn${type === "internship" ? " active" : ""}`} onClick={() => switchType("internship")}>💼 Internships</button>
          </div>
          <span className="text-sm text-muted">{results.length} result{results.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="card mb-6">
          <div className="card-body">
            <div className="search-bar">
              <input className="form-input" placeholder={type === "competition" ? compPlaceholder : internPlaceholder}
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch()} />
              <button className="btn btn-primary" onClick={() => doSearch()}>Search</button>
              {query && <button className="btn btn-outline" onClick={() => { setQuery(""); setResults(pool); }}>Clear</button>}
            </div>
            {type === "competition" && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["hack", "olympiad", "coding", "data", "design", "business"].map(cat => (
                  <span key={cat} style={{ cursor: "pointer", padding: "3px 10px", background: "var(--bg-section)", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", border: "1px solid var(--border)" }}
                    onClick={() => { setQuery(cat); doSearch(cat, MOCK_COMPETITIONS); }}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card-grid">
          {results.map(opp => {
            const status = getStatus(opp.id);
            return (
              <div key={opp.id} className="opp-card">
                <div className="opp-card-header">
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {type === "competition" && opp.category && (
                      <span className={`badge ${categoryColors[opp.category] || "badge-gray"}`} style={{ fontSize: "0.72rem" }}>
                        {categoryLabels[opp.category] || opp.category}
                      </span>
                    )}
                    <span className="badge badge-blue" style={{ fontSize: "0.72rem" }}>{opp.domain}</span>
                  </div>
                  {status && <StatusBadge status={status} />}
                </div>
                <div className="opp-title">{opp.title}</div>
                {opp.org && type === "internship" && (
                  <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>🏢 {opp.org}</div>
                )}
                {opp.org && type === "competition" && (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>by {opp.org}</div>
                )}
                <div className="opp-desc">{opp.desc}</div>
                {type === "internship" && (opp.duration || opp.stipend) && (
                  <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                    {opp.duration && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>⏱ {opp.duration}</span>}
                    {opp.stipend && <span style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 600 }}>💰 {opp.stipend}</span>}
                  </div>
                )}
                <div className="form-group">
                  <select className="form-input" value={status || ""} onChange={e => setStatus(opp.id, e.target.value)} style={{ fontSize: "0.82rem" }}>
                    <option value="">Set Status…</option>
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ==================== HISTORY PAGE ====================
function HistoryPage({ learningSkills, opportunities, searchHistory, activityLogs }) {
  const completedSkills = learningSkills.filter(s => s.progress === 100);

  return (
    <div className="page">
      <div className="container section">
        <div className="section-header">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 6 }}>Your Activity History</h1>
          <p className="text-muted">Track your learning journey and participation records.</p>
        </div>

        <div className="section-header"><h2 className="section-title">✅ Completed Skills</h2></div>
        <div className="card mb-6">
          <div className="card-body">
            {completedSkills.length === 0 && <p className="text-muted text-sm">No completed skills yet. Keep going!</p>}
            <div className="card-grid">
              {completedSkills.map(s => (
                <div key={s.name} style={{ background: "var(--bg-section)", borderRadius: "var(--radius-sm)", padding: 16 }}>
                  <div className="flex-between">
                    <span className="font-bold">{s.name}</span>
                    <span className="badge badge-green">100% ✓</span>
                  </div>
                  <div className="text-sm text-muted mt-4">{s.topics.length} topics mastered</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-header"><h2 className="section-title">🏆 Participation History</h2></div>
        <div className="card-grid mb-6">
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏅 Competitions</h3>
              {opportunities.filter(o => o.type === "competition" && o.status).length === 0 && <p className="text-muted text-sm">No competition history yet.</p>}
              {opportunities.filter(o => o.type === "competition" && o.status).map(o => (
                <div key={o.id} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{o.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{o.domain}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>💼 Internships</h3>
              {opportunities.filter(o => o.type === "internship" && o.status).length === 0 && <p className="text-muted text-sm">No internship history yet.</p>}
              {opportunities.filter(o => o.type === "internship" && o.status).map(o => (
                <div key={o.id} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{o.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{o.domain}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-header"><h2 className="section-title">🔍 Search History</h2></div>
        <div className="card mb-6">
          <div className="card-body">
            {searchHistory.length === 0 && <p className="text-muted text-sm">No searches yet.</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[...searchHistory].reverse().map((s, i) => (
                <span key={i} className="badge badge-gray" style={{ padding: "5px 12px" }}>🔍 {s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="section-header"><h2 className="section-title">📋 Activity Log</h2></div>
        <div className="card">
          <div className="card-body">
            {[...MOCK_ACTIVITY, ...activityLogs].reverse().length === 0 && <p className="text-muted text-sm">No activity yet.</p>}
            <div className="timeline">
              {[...activityLogs].reverse().map((a, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-title">{a.text}</div>
                    <div className="timeline-time">{a.time}</div>
                  </div>
                </div>
              ))}
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: "var(--border)" }} />
                  <div className="timeline-content">
                    <div className="timeline-title" style={{ color: "var(--text-muted)" }}>{a.text}</div>
                    <div className="timeline-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ==================== PROFILE PAGE ====================
function ProfilePage({ user, learningSkills, onEdit, onLogout }) {
  const completedSkills = learningSkills.filter(s => s.progress === 100).map(s => s.name);
  const allSkills = [...(user?.skills || []), ...completedSkills.filter(s => !(user?.skills || []).includes(s))];

  const rows = [
    ["Name", user?.name], ["Email", user?.email], ["Phone", user?.phone],
    ["Domain of Interest", user?.domainOfInterest], ["Education Level", user?.educationLevel],
    ["Skills", allSkills.join(", ") || "—"], ["Career Goal", user?.careerGoal],
    ["Primary Domain", user?.primaryDomain], ["Skill Level", user?.skillLevel],
    ["Career Aspiration", user?.careerAspiration], ["Learning Hours/Week", user?.learningHoursPerWeek ? `${user.learningHoursPerWeek} hrs` : "—"],
  ];

  return (
    <div className="page">
      <div className="container section">
        <div className="section-header">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 6 }}>My Profile</h1>
          <p className="text-muted">Manage your personal information and track your growth.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          <div className="card">
            <div className="card-body">
              <div className="flex-between mb-6">
                <h2 style={{ fontWeight: 700 }}>Personal Information</h2>
                <button className="btn btn-outline btn-sm" onClick={onEdit}>✏️ Edit Profile</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {rows.map(([k, v]) => v ? (
                  <div key={k} className="profile-info-row">
                    <span className="profile-info-key">{k}</span>
                    <span className="profile-info-val">{v}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Completed Skills</h3>
                {completedSkills.length === 0 ? (
                  <p className="text-sm text-muted">No skills completed yet.</p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {completedSkills.map(s => (
                      <span key={s} className="badge badge-green">{s} ✓</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ borderColor: "#FEE2E2" }}>
              <div className="card-body">
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Account</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 16 }}>Signed in as {user?.email}</p>
                <button className="btn btn-danger btn-full" onClick={onLogout}>Logout →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ==================== APP ROOT ====================
export default function App() {
  const [page, setPage] = useState("welcome");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [learningSkills, setLearningSkills] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const addActivity = useCallback((text) => {
    setActivityLogs(prev => [...prev, { text, time: "Just now" }]);
  }, []);

  const addSearch = useCallback((q) => {
    setSearchHistory(prev => [...prev.filter(s => s !== q), q]);
  }, []);

  const handleLogin = () => { setIsLoggedIn(true); setPage("home"); };
  const handleLogout = () => { setIsLoggedIn(false); setPage("welcome"); };
  const handleSaveUser = (data) => {
    setStoredUser(data);
    setIsLoggedIn(true);
    setIsEditing(false);
    setPage("dashboard");
  };

  if (!isLoggedIn && page === "signup") {
    return (
      <>
        <style>{styles}</style>
        <SignUpPage onSave={handleSaveUser} onCancel={() => setPage("welcome")} />
      </>
    );
  }

  if (!isLoggedIn) {
    return <WelcomePage storedUser={storedUser} onLogin={handleLogin} onGoSignup={() => setPage("signup")} />;
  }

  if (isEditing) {
    return (
      <>
        <style>{styles}</style>
        <Navbar page="profile" setPage={setPage} isLoggedIn={isLoggedIn} />
        <SignUpPage existing={storedUser} onSave={handleSaveUser} onCancel={() => setIsEditing(false)} />
      </>
    );
  }

  const navProps = { page, setPage, isLoggedIn, onLogout: handleLogout };

  return (
    <>
      <style>{styles}</style>
      <Navbar {...navProps} />
      {page === "home" && <HomePage user={storedUser} />}
      {page === "dashboard" && <DashboardPage user={storedUser} learningSkills={learningSkills} opportunities={opportunities} />}
      {page === "decision" && <DecisionPage learningSkills={learningSkills} setLearningSkills={setLearningSkills} addActivity={addActivity} addSearch={addSearch} />}
      {page === "opportunities" && <OpportunitiesPage opportunities={opportunities} setOpportunities={setOpportunities} addActivity={addActivity} addSearch={addSearch} />}
      {page === "history" && <HistoryPage learningSkills={learningSkills} opportunities={opportunities} searchHistory={searchHistory} activityLogs={activityLogs} />}
      {page === "profile" && <ProfilePage user={storedUser} learningSkills={learningSkills} onEdit={() => setIsEditing(true)} onLogout={handleLogout} />}
    </>
  );
}
