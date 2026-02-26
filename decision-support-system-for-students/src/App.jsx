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
  "JavaScript": [
    "Variables & Data Types", "Functions", "DOM Manipulation", "ES6 Concepts", "Async/Await", "APIs", "Error Handling"
  ],
  "Python": [
    "Syntax & Basics", "Data Structures", "File Handling", "OOP Concepts", "Libraries (NumPy)", "Web Scraping"
  ],
  "React": [
    "JSX Basics", "Components & Props", "State & Hooks", "Routing", "Context API", "Performance Optimization"
  ],
  "Machine Learning": [
    "Math Foundations", "Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering", "Neural Networks"
  ],
  "Data Science": [
    "Python for Data", "Pandas & NumPy", "Data Visualization", "Statistics", "SQL Basics", "ML Intro"
  ],
  "Web Development": [
    "HTML5", "CSS3", "JavaScript", "Responsive Design", "Version Control", "REST APIs"
  ],
  "AI": [
    "Intro to AI", "Search Algorithms", "Knowledge Representation", "Machine Learning", "Deep Learning", "NLP Basics"
  ],
  "SQL": [
    "SELECT Statements", "Joins", "Aggregations", "Subqueries", "Indexes", "Stored Procedures"
  ]
};

const MOCK_COMPETITIONS = [
  { id: 1, title: "HackFest 2026", domain: "Web Development", desc: "48-hour hackathon focused on building social impact solutions.", status: null },
  { id: 2, title: "AI Challenge Cup", domain: "Artificial Intelligence", desc: "Build AI models to solve real-world problems.", status: null },
  { id: 3, title: "Data Olympiad", domain: "Data Science", desc: "Compete in data analysis and visualization challenges.", status: null },
  { id: 4, title: "CodeWar Sprint", domain: "Competitive Programming", desc: "Solve algorithmic challenges in 3 hours.", status: null },
];

const MOCK_INTERNSHIPS = [
  { id: 5, title: "Google Summer of Code", domain: "Open Source", desc: "3-month paid open source coding program.", status: null },
  { id: 6, title: "Microsoft Azure Internship", domain: "Cloud Computing", desc: "Work on Azure services and cloud infrastructure.", status: null },
  { id: 7, title: "StartupAI Fellowship", domain: "AI/ML", desc: "8-week intensive AI startup experience.", status: null },
  { id: 8, title: "NASSCOM Internship Program", domain: "IT Industry", desc: "Industry-integrated learning program.", status: null },
];

const COMP_STATUSES = ["Interested", "Registered", "Ongoing", "Completed", "Won"];
const INTERN_STATUSES = ["Interested", "Applied", "Ongoing", "Completed"];

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
    const q = query.toLowerCase();
    const matches = Object.keys(MOCK_SKILLS).filter(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
    setResults(matches.length > 0 ? matches : Object.keys(MOCK_SKILLS).slice(0, 4));
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
  const [results, setResults] = useState(type === "competition" ? MOCK_COMPETITIONS : MOCK_INTERNSHIPS);
  const [searched, setSearched] = useState(true);

  const pool = type === "competition" ? MOCK_COMPETITIONS : MOCK_INTERNSHIPS;

  const doSearch = () => {
    if (query.trim()) addSearch(query);
    const q = query.toLowerCase();
    const res = q ? pool.filter(p => p.title.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : pool;
    setResults(res.length > 0 ? res : pool);
    setSearched(true);
  };

  const switchType = (t) => {
    setType(t);
    setQuery("");
    setResults(t === "competition" ? MOCK_COMPETITIONS : MOCK_INTERNSHIPS);
    setSearched(true);
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
        </div>

        <div className="card mb-6">
          <div className="card-body">
            <div className="search-bar">
              <input className="form-input" placeholder={`Search ${type}s by domain or keyword...`} value={query}
                onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} />
              <button className="btn btn-primary" onClick={doSearch}>Search</button>
            </div>
          </div>
        </div>

        <div className="card-grid">
          {results.map(opp => {
            const status = getStatus(opp.id);
            return (
              <div key={opp.id} className="opp-card">
                <div className="opp-card-header">
                  <span className="badge badge-blue">{opp.domain}</span>
                  {status && <StatusBadge status={status} />}
                </div>
                <div className="opp-title">{opp.title}</div>
                <div className="opp-desc">{opp.desc}</div>
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
