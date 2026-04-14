import React, { useState, useCallback, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';


import { Home, LayoutDashboard, Target, Briefcase, History, User, Search, CheckCircle2, XCircle, Phone, Camera, Mail, Activity, BookOpen, Shield, Star, Settings, Scale, PartyPopper, TrendingUp, Trophy, Award, Globe, Clock, DollarSign, Building, Users, MapPin, Hammer, Monitor, Bot, Palette, Code, Database, ShoppingCart, Cloud, CreditCard, Stethoscope, Car, MessageSquare, ShieldAlert, Cpu, HardDrive, Smartphone, Gamepad2, Layers, PenTool, ChevronRight, ArrowRight, BarChart3, ClipboardList, RefreshCcw, Trash2 } from 'lucide-react';
import './App.css';
import { authAPI, skillsAPI, opportunitiesAPI, historyAPI, domainInfoAPI, careerGuideAPI, adminAPI, trafficAPI, healthAPI, profileAPI } from './services/api';
import { findCareerMatch, CAREER_GOAL_MAP } from './utils/careerGoalMatcher';
import { 
  MOCK_SKILLS, 
  SKILL_ALIASES, 
  MOCK_COMPETITIONS, 
  MOCK_INTERNSHIPS, 
  COMP_STATUSES, 
  INTERN_STATUSES, 
  COMP_ALIASES, 
  MOCK_ACTIVITY,
  COMPETITION_URLS,
  INTERNSHIP_URLS,
  withUrls,
} from './data/careerData';
import Footer from './Components/Footer';
import Modal from './Components/Modal';
import CareerOther from './Components/CareerOther';
import CareerSearchResult from './Components/CareerSearchResult';
// ==================== STYLES ====================


// ==================== MOCK DATA ====================
// Handled via imports from ./data/careerData


// Skill aliases for smart search

// Skill aliases handled via data/careerData



// Mock data handled via careerData.js



// Internship data moved to careerData.js



// Statuses and activity moved to careerData.js




// ==================== COMPONENTS ====================

function Navbar({ page, setPage, isLoggedIn, onLogout, user }) {
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  if (page === 'onboarding') return null;
  const links = isLoggedIn
    ? [
      [<><Home size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> Home</>, "home"],
      isAdmin ? [<><Settings size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> Admin</>, "admin"] : null,
      [<><LayoutDashboard size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> Dashboard</>, "dashboard"],
      [<><Target size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> Decision</>, "decision"],
      [<><Activity size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> Opportunities</>, "opportunities"],
      [<><History size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> History</>, "history"],
      [<><User size={18} style={{ marginRight: "6px", marginBottom: "-4px" }} /> Profile</>, "profile"]
    ].filter(Boolean)
    : [];

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => setPage(isLoggedIn ? "home" : "welcome")}>
        DSS<span>•</span>
      </div>
      {isLoggedIn && (
        <>
          <div className={`navbar-links${open ? " open mobile-menu" : ""}`}>
            {links.map(([label, id]) => (
              <button key={id} className={`nav-link${page === id ? " active" : ""}`}
                onClick={() => { setPage(id); setOpen(false); }}>{label}</button>
            ))}
          </div>
          <div className="hamburger" onClick={() => setOpen(!open)} style={{ padding: "10px" }}>
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
function WelcomePage({ storedUser, onLogin, onGoSignup, backendOnline }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [modal, setModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setLoginError("");
    if (!form.email || !form.password) { setLoginError("Please enter email and password."); return; }

    setIsLoading(true);
    try {
      // Always attempt network login first
      const res = await authAPI.login({ email: form.email, password: form.password });
      if (res.data.success) {
        const user = res.data.user;
        const token = res.data.token;
        // Forced override for the specified admin account
        if (user.email === 'anukritisrivastava810@gmail.com') {
          user.role = 'admin';
        }
        onLogin(user, token);
        return;
      }
    } catch (err) {
      console.error("[Login] Server login failed:", err.response?.data?.message || err.message);
      // If backend explicitly rejected them (401), show error
      if (err.response && err.response.status === 401) {
        setLoginError(err.response.data.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }
      // If network error, only then try fallback to localStorage
      console.log("[Login] Network error, trying local fallback...");
    } finally {
      setIsLoading(false);
    }

    // Fallback: match against locally stored user
    if (!storedUser) {
      setLoginError("Offline: No account found on this device.");
      setModal("nouser");
      return;
    }
    const ok = form.email === storedUser.email && form.password === storedUser.password;
    if (ok) {
      onLogin(storedUser, null);
    } else {
      setLoginError("Invalid email or password (offline mode).");
      setModal("error");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoginError("");
    setIsLoading(true);
    try {
      const res = await authAPI.googleAuth(credentialResponse.credential);
      if (res.data.success) {
        const user = res.data.user;
        const token = res.data.token;
        if (user.email === 'anukritisrivastava810@gmail.com') {
          user.role = 'admin';
        }
        onLogin(user, token);
      } else if (res.data.needsSignup) {
        // Redirect to sign up and pre-fill Google profile data
        setLoginError("We've retrieved your Google data! Please complete your profile to finish signing up.");
        setTab("signup");
        onGoSignup({
          ...res.data.prefillData,
          profileCompleted: false,
          credential: credentialResponse.credential
        });
      }
    } catch (err) {
      console.error("[Google Login] Failed:", err.response?.data?.message || err.message);
      if (err.response?.data?.isNewUser) {
        setLoginError("No account found. Please complete signup first.");
        setTab("signup");
      } else {
        setLoginError(err.response?.data?.message || "Google Sign-In failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignupSuccess = async (credentialResponse) => {
    setLoginError("");
    setIsLoading(true);
    try {
      // Funnel all Google Auth through the single robust backend route
      const res = await authAPI.googleAuth(credentialResponse.credential);
      if (res.data.success) {
        // They explicitly clicked signup, but they already exist! Let's just log them in seamlessly.
        const user = res.data.user;
        const token = res.data.token;
        if (user.email === 'anukritisrivastava810@gmail.com') {
          user.role = 'admin';
        }
        onLogin(user, token);
      } else if (res.data.needsSignup) {
        // Truly a new user, proceed to signup tab
        setTab("signup");
        onGoSignup({
          ...res.data.prefillData,
          profileCompleted: false,
          credential: credentialResponse.credential
        });
      }
    } catch (err) {
      console.error("[Google Signup] Failed:", err.response?.data?.message || err.message);
      setLoginError(err.response?.data?.message || "Google Sign-Up failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setLoginError("Google Sign-In was cancelled or failed.");
  };

  // Move GoogleLogin to top-level import


  return (
    <>

      <div className="welcome-wrap">
        <div className="welcome-left">
          <div className="welcome-brand">
            <h1>DSS • for Students</h1>
            <p>Make smarter academic &amp; career decisions</p>
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
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              {loginError && <p style={{ color: "var(--error)", fontSize: "0.85rem", margin: 0 }}><XCircle size={18} style={{ marginRight: "6px" }} /> {loginError}</p>}
              <button className="btn btn-primary btn-lg btn-full" style={{ marginTop: 8 }} onClick={handleLogin} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login →"}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* Google Login Button */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              {!storedUser && (
                <p className="text-sm text-muted text-center">
                  No account yet? <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => { setTab("signup"); onGoSignup(); }}>Create one</span>
                </p>
              )}
            </div>
          )}
          {tab === "signup" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}><Star size={18} style={{ marginRight: "6px" }} /></div>
              <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>Create your profile to get started with personalized decision support.</p>
              <button className="btn btn-primary btn-lg btn-full" onClick={onGoSignup}>Create Your Profile →</button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>or sign up with</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "center", maxWidth: "100%", overflow: "hidden" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSignupSuccess}
                  onError={handleGoogleError}
                  text="signup_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>
            </div>
          )}
        </div>
        <div className="welcome-right">
          <div className="welcome-geo" style={{ width: 200, height: 200, top: "10%", right: "5%", animationDelay: "0s" }} />
          <div className="welcome-geo" style={{ width: 120, height: 120, bottom: "20%", left: "8%", animationDelay: "1s" }} />
          <div className="welcome-geo" style={{ width: 80, height: 80, top: "50%", left: "20%", animationDelay: "2s" }} />
          <div className="welcome-right-content">
            <h2>Make Smarter Academic &amp; Career Decisions</h2>
            <p>A structured system to help students evaluate choices, track skills, and build their professional future with clarity.</p>
            <div className="feature-list">
              <div className="feature-item"><span className="feature-icon"><Target size={18} style={{ marginRight: "6px" }} /></span><span>Multi-Criteria Evaluation Framework</span></div>
              <div className="feature-item"><span className="feature-icon"><Scale size={18} style={{ marginRight: "6px" }} /></span><span>Personalized Weight Assignment</span></div>
              <div className="feature-item"><span className="feature-icon"><Search size={18} style={{ marginRight: "6px" }} /></span><span>Transparent &amp; Explainable Results</span></div>
            </div>
          </div>
        </div>
      </div>
      {modal === "error" && (
        <Modal icon={<XCircle size={18} style={{ marginRight: "6px" }} />} title="Wrong Credentials" msg="Please check your email and password and try again.">
          <button className="btn btn-primary" onClick={() => setModal(null)}>Try Again</button>
        </Modal>
      )}
      {modal === "nouser" && (
        <Modal icon={<User size={18} style={{ marginRight: "6px" }} />} title="No Account Found" msg="Please sign up first to create your profile.">
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
function SignUpPage({ existing, onSave, onCancel, onGoCareerOther }) {
  const isGoogleUser = existing?.authProvider === 'google';

  const blank = {
    name: "", email: "", phone: "", password: "",
    domainOfInterest: "", educationLevel: "", skills: "",
    careerGoal: "", primaryDomain: "", skillLevel: "Beginner",
    careerAspiration: "", learningHoursPerWeek: ""
  };

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        ...existing,
        skills: Array.isArray(existing.skills) ? existing.skills.join(", ") : (existing.skills || ""),
      };
    }
    return blank;
  });

  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(false);

  const set = (k, v) => {
    if (k === "careerGoal" && v === "Other" && onGoCareerOther) {
      onGoCareerOther();
      return;
    }
    setForm(f => ({ ...f, [k]: v }));
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    // Password only required for manual signup
    if (!isGoogleUser && (!form.password || form.password.length < 6)) e.password = "Min 6 characters";
    // Phone only required for manual signup
    if (!isGoogleUser && !form.phone) e.phone = "Required";
    if (!form.domainOfInterest) e.domainOfInterest = "Required";
    if (!form.educationLevel) e.educationLevel = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => { if (validate()) setModal(true); };

  const confirm = () => {
    const payload = {
      ...form,
      skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
      profileCompleted: true,
    };
    if (isGoogleUser) delete payload.password; // Never send blank password for Google users
    onSave(payload);
    setModal(false);
  };

  // Heading and subtitle differ by context
  const heading = isGoogleUser && existing?.profileCompleted === false
    ? "Complete Your Profile"
    : (existing ? "Edit Your Profile" : "Welcome to DSS");

  const subtitle = isGoogleUser && existing?.profileCompleted === false
    ? "Please fill in a few details to personalise your experience."
    : (existing ? "Update your information below." : "Let's personalise your journey and help you make smarter decisions.");

  const btnLabel = existing ? "Update Profile ✓" : "Create Profile →";

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="text-center mb-6">
            <h1 className="mb-4">{heading}</h1>
            <p className="text-muted">{subtitle}</p>
          </div>
          <div className="card">
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Row 1: Name + Email */}
                <div className="grid-2">
                  <SignUpField label="Full Name *" name="name" placeholder="Anukriti Srivastava" form={form} errors={errors} set={set} />
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email || ""}
                      onChange={e => !isGoogleUser && set("email", e.target.value)}
                      disabled={isGoogleUser}
                      style={isGoogleUser ? { background: "var(--bg-section)", cursor: "not-allowed", opacity: 0.7 } : {}}
                    />
                    {errors.email && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.email}</span>}
                  </div>
                </div>

                {/* Row 2: Phone + Password (manual only) OR Phone alone (Google) */}
                {!isGoogleUser ? (
                  <div className="grid-2">
                    <SignUpField label="Phone Number *" name="phone" type="tel" placeholder="9876543210" form={form} errors={errors} set={set} />
                    <SignUpField label="Password *" name="password" type="password" placeholder="Min 6 characters" form={form} errors={errors} set={set} />
                  </div>
                ) : (
                  <div className="grid-2">
                    <SignUpField label="Phone Number" name="phone" type="tel" placeholder="9876543210" form={form} errors={errors} set={set} />
                    <div /> {/* spacer to preserve grid layout */}
                  </div>
                )}

                {/* Row 3: Domain of Interest + Education Level */}
                <div className="grid-2">
                  <SignUpField label="Domain of Interest *" name="domainOfInterest" placeholder="e.g. Web Development, AI" form={form} errors={errors} set={set} />
                  <SignUpField label="Education Level *" name="educationLevel" opts={["High School", "Diploma", "B.Tech/B.E", "B.Sc", "BCA", "MCA", "M.Tech", "MBA", "Other"]} form={form} errors={errors} set={set} />
                </div>

                {/* Skills */}
                <SignUpField label="Skills (comma-separated)" name="skills" placeholder="JavaScript, Python, React" form={form} errors={errors} set={set} />

                {/* Row 4: Primary Domain + Skill Level */}
                <div className="grid-2">
                  <SignUpField label="Primary Domain" name="primaryDomain" opts={["Web Development", "Artificial Intelligence", "Data Science", "Cybersecurity", "Cloud Computing", "Mobile Development", "Game Development", "Other"]} form={form} errors={errors} set={set} />
                  <SignUpField label="Current Skill Level" name="skillLevel" opts={["Beginner", "Intermediate", "Advanced"]} form={form} errors={errors} set={set} />
                </div>

                {/* Career Goal */}
                <SignUpField
                  label="Career Goal"
                  name="careerGoal"
                  opts={[
                    ...CAREER_GOAL_MAP.map(goal => goal.title),
                    "Other"
                  ]}
                  form={form} errors={errors} set={set}
                />

                {/* Career Aspiration */}
                <SignUpField
                  label="Career Aspiration"
                  name="careerAspiration"
                  opts={[
                    "Software Engineer", "Full Stack Developer", "Frontend Developer",
                    "Backend Developer", "Web Developer", "App Developer",
                    "AI Engineer", "Machine Learning Engineer", "Data Scientist",
                    "Cybersecurity Analyst", "Cloud Engineer", "UI/UX Designer",
                    "Product Manager", "Business Analyst", "Researcher",
                    "Entrepreneur", "DevOps Engineer", "Blockchain Developer",
                    "Game Developer", "Data Analyst"
                  ]}
                  form={form} errors={errors} set={set}
                />

                {/* Learning Hours */}
                <div className="grid-2">
                  <SignUpField label="Learning Hours Per Week" name="learningHoursPerWeek" type="number" placeholder="15" form={form} errors={errors} set={set} />
                  <div />
                </div>

                <div className="flex-gap-responsive" style={{ marginTop: 12 }}>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={submit}>
                    {btnLabel}
                  </button>
                  {onCancel && <button className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>}
                </div>

              </div>
            </div>
          </div>
        </div>

        {modal && (
          <Modal
            icon={existing ? <CheckCircle2 size={18} style={{ marginRight: "6px" }} /> : <PartyPopper size={18} style={{ marginRight: "6px" }} />}
            title={existing ? "Profile Updated!" : "Registration Successful!"}
            msg={existing ? "Your profile has been updated successfully." : "Your profile has been created. Welcome to DSS!"}
          >
            <button className="btn btn-primary" onClick={confirm}>
              {existing ? "Back to Profile" : "Go to Dashboard →"}
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
}

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
            {[[<Target size={18} style={{ marginRight: "6px" }} />, "Goal Setting", "Define and track your learning goals with precision"], [<TrendingUp size={18} style={{ marginRight: "6px" }} />, "Analytics", "Monitor your growth with detailed performance metrics"], [<Activity size={18} style={{ marginRight: "6px" }} />, "Opportunities", "Discover internships and competitions relevant to your domain"], [<History size={18} style={{ marginRight: "6px" }} />, "History", "Maintain a transparent record of all your activities"]].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "var(--bg-section)", borderRadius: "var(--radius-sm)", padding: 20 }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PERSONALIZED GUIDE LOGIC ====================
function getPersonalizedGuide(user) {
  const aspiration = user?.careerAspiration || "Software Engineer";
  const goal = user?.careerGoal || "Improve coding skills";
  const domain = user?.primaryDomain || "Web Development";
  const level = user?.skillLevel || "Beginner";

  // Base Templates
  const guides = {
    "Web Development": {
      skills: ["HTML/CSS/JS", "React", "Node.js", "Database Design"],
      tools: ["VS Code", "Chrome DevTools", "GitHub", "Vercel"],
      path: "Master Frontend → Learn Backend Basics → Build Full Stack Apps",
      advice: "Consistency is key. Build 3 solid projects for your portfolio."
    },
    "Artificial Intelligence": {
      skills: ["Python", "Linear Algebra", "Machine Learning Intro", "PyTorch/TensorFlow"],
      tools: ["Jupyter Notebooks", "Google Colab", "Kaggle", "Conda"],
      path: "Python Mastery → Data Analysis → ML Models → Deep Learning",
      advice: "Focus on understanding the math behind the models, not just the code."
    },
    "Data Science": {
      skills: ["Python/R", "Pandas & NumPy", "SQL", "Data Visualization"],
      tools: ["Tableau/PowerBI", "SQL Server", "Excel", "Anaconda"],
      path: "Excel Basics → SQL & Data Cleaning → Viz → Predictive Modeling",
      advice: "The story the data tells is more important than the algorithm used."
    }
  };

  const base = guides[domain] || guides["Web Development"];

  // Refine advice based on level and goal
  let specificAdvice = base.advice;
  if (level === 'Beginner') specificAdvice = "Start with the absolute foundations. Don't skip the basics; they are your support for everything else.";
  if (goal.toLowerCase().includes('internship')) specificAdvice += " Focus on building 2 standout projects to show recruiters.";
  if (goal.toLowerCase().includes('freelancing')) specificAdvice += " Learn how to manage clients and set clear project scopes.";

  return {
    ...base,
    aspiration,
    goal,
    advice: specificAdvice,
    nextStep: level === 'Beginner' ? "Complete a fundamental course in " + base.skills[0] : "Build a complex project using " + base.skills[1]
  };
}

// ==================== DASHBOARD PAGE ====================
function DashboardPage({ user, learningSkills, opportunities, setPage, setPrevPage }) {
  // eslint-disable-next-line no-unused-vars
  const guide = getPersonalizedGuide(user);
  const completedSkills = learningSkills.filter(s => s.progress === 100);
  const activeSkills = learningSkills.filter(s => s.progress < 100);
  const competitions = opportunities.filter(o => o.type === "competition");
  const internships = opportunities.filter(o => o.type === "internship");
  const userHours = parseInt(user?.learningHoursPerWeek || 0);

  // eslint-disable-next-line no-unused-vars
  const regularStats = [
    [<BookOpen size={18} style={{ marginRight: "6px" }} />, "#EFF6FF", learningSkills.length, "Skills Learning", "var(--primary)"],
    [<CheckCircle2 size={18} style={{ marginRight: "6px" }} />, "#F0FDF4", completedSkills.length, "Skills Completed", "var(--success)"],
    [<TrendingUp size={18} style={{ marginRight: "6px" }} />, "#FDF2F8", userHours >= 15 ? 95 : 75, "Study Consistency", "#DB2777"],
  ];

  const careerGoalTitle = user?.careerAspiration || user?.careerGoal || "Product Manager";

  return (
    <div className="page">
      <div className="container section">
        <div className="welcome-banner">
          <h2>Welcome back, {user?.name || "Student"}! 👋</h2>
          <p>Track your progress and continue building your future.</p>
        </div>

        <div className="section-header"><h2 className="section-title"><TrendingUp size={18} style={{ marginRight: "6px" }} /> Learning Analytics</h2></div>
        <div className="card-grid">
          {/* Domain Focus Card */}
          {user?.primaryDomain && (
            <div className="stat-card domain-focus-card" style={{ borderLeft: "4px solid var(--primary)" }}>
              <div className="stat-icon" style={{ background: "rgba(59, 130, 246, 0.1)" }}><Target size={18} style={{ marginRight: "6px", color: "var(--primary)" }} /></div>
              <div className="stat-value" style={{ color: "var(--primary)" }}>{user.primaryDomain}</div>
              <div className="stat-label" style={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.05em", opacity: 0.8 }}>Primary Domain</div>
              
                <div style={{ marginTop: "auto" }}>
                  <button 
                    className="know-more-link" 
                    onClick={() => {
                      if (user.primaryDomain === "Other") {
                        setPrevPage("dashboard");
                        setPage("career-other");
                        return;
                      }
                      const match = findCareerMatch(user.primaryDomain);
                      setPrevPage("dashboard");
                      if (match) {
                        setPage("domain-detail:" + match.title);
                      } else {
                        setPage("domain-detail:" + user.primaryDomain);
                      }
                    }} 
                    style={{ 
                      backgroundColor: "rgba(59, 130, 246, 0.08)", 
                      borderColor: "rgba(59, 130, 246, 0.25)", 
                      color: "var(--primary)", 
                      width: "100%",
                      fontWeight: "600"
                    }}
                  >
                    {user.primaryDomain === "Other" ? "Explore Other Paths" : "View Domain Details →"}
                  </button>
                </div>
            </div>
          )}

          {/* Career Goal Card */}
          <div className="stat-card career-goal-card" style={{ borderLeft: "4px solid #D97706" }}>
            <div className="stat-icon" style={{ background: "#FFFBEB" }}><Briefcase size={18} style={{ marginRight: "6px", color: "#D97706" }} /></div>
            <div className="stat-value" style={{ color: "#D97706" }}>
              {careerGoalTitle.length > 20 ? careerGoalTitle.substring(0, 18) + "..." : careerGoalTitle}
            </div>
            <div className="stat-label" style={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.05em", opacity: 0.8 }}>Career Goal</div>
            <div style={{ marginTop: "auto" }}>
              <button className="know-more-link" onClick={() => setPage("career-guide")} style={{ backgroundColor: "rgba(217, 119, 6, 0.08)", borderColor: "rgba(217, 119, 6, 0.25)", color: "#D97706", width: "100%" }}>
                View Personalized Guide →
              </button>
            </div>
          </div>

          {/* Overall Progress Card */}
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)" }}><Star size={18} style={{ marginRight: "6px", color: "var(--green)" }} /></div>
            <div className="stat-value" style={{ color: "var(--green)" }}>{learningSkills.length > 0 ? Math.round(learningSkills.reduce((acc, s) => acc + s.progress, 0) / learningSkills.length) : 0}%</div>
            <div className="stat-label">Overall Progress</div>
          </div>
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
            </div>
          </div>
        </div>

        <div className="section-header mt-8"><h2 className="section-title"><Trophy size={18} style={{ marginRight: "6px" }} /> Participation Summary</h2></div>
        <div className="card-grid">
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏅 Competitions</h3>
              {[
                ["Total Participated", competitions.filter(c => c.status && c.status !== "Interested").length],
                ["Ongoing", competitions.filter(c => c.status === "Ongoing").length],
                ["Completed", competitions.filter(c => c.status === "Completed" || c.status === "Won").length],
                ["Won", competitions.filter(c => c.status === "Won").length],
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
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}><Briefcase size={18} style={{ marginRight: "6px" }} /> Internships</h3>
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
    </div>
  );
}

// ==================== DOMAIN DETAIL PAGE ====================
const APP_ICON_MAP = {
  ShoppingCart: <ShoppingCart size={24} />,
  Cloud: <Cloud size={24} />,
  Globe: <Globe size={24} />,
  CreditCard: <CreditCard size={24} />,
  Stethoscope: <Stethoscope size={24} />,
  Car: <Car size={24} />,
  MessageSquare: <MessageSquare size={24} />,
  Target: <Target size={24} />,
  Cpu: <Cpu size={24} />,
  HardDrive: <HardDrive size={24} />,
  Smartphone: <Smartphone size={24} />,
  Gamepad2: <Gamepad2 size={24} />,
  Layers: <Layers size={24} />,
  PenTool: <PenTool size={24} />,
  Users: <Users size={24} />,
  Shield: <Shield size={24} />,
};

const FALLBACK_DOMAIN_DATA = {
  "Web Development": {
    description: "Web Development covers building websites and web applications using frontend (HTML/CSS/JS, React) and backend (Node.js, databases) technologies. It is one of the most in-demand technical disciplines globally.",
    skills: [
      { name: "HTML & CSS", level: "Foundation" }, { name: "JavaScript (ES6+)", level: "Core" },
      { name: "React.js / Vue.js", level: "Advanced" }, { name: "Node.js & Express", level: "Backend" },
      { name: "REST APIs & GraphQL", level: "Intermediate" }, { name: "MongoDB / PostgreSQL", level: "Databases" },
      { name: "Git & GitHub", level: "Essential" }, { name: "TypeScript", level: "Advanced" },
    ],
    applications: [
      { title: "E-Commerce Platforms", description: "Building scalable online stores with seamless checkout and inventory.", icon: "ShoppingCart" },
      { title: "SaaS Products", description: "Subscription-based software products powering businesses worldwide.", icon: "Cloud" },
      { title: "Social Media & Communities", description: "Platforms like Instagram and LinkedIn where millions connect.", icon: "Globe" },
      { title: "FinTech Applications", description: "Banking portals, payment gateways, and financial dashboards.", icon: "CreditCard" },
    ],
  },
  "App Development": {
    description: "App Development focuses on creating software for mobile devices (iOS and Android) and desktop platforms. It involves mastering frameworks that deliver high-performance, touch-friendly user experiences.",
    skills: [
      { name: "Swift / Kotlin", level: "Native Hub" }, { name: "React Native / Flutter", level: "Cross-Platform" },
      { name: "Mobile UI Design", level: "Core" }, { name: "API Integration", level: "Essential" },
      { name: "State Management", level: "Intermediate" }, { name: "Firebase / AWS Amplify", level: "Backend" },
    ],
    applications: [
      { title: "On-Demand Services", description: "Apps like Uber or DoorDash that connect users to real-time services.", icon: "Car" },
      { title: "Mobile Banking", description: "Secure financial management on the go.", icon: "CreditCard" },
      { title: "Social Networking", description: "Mobile-first platforms for connection and content sharing.", icon: "MessageSquare" },
    ],
  },
  "Data Science": {
    description: "Data Science combines statistics, programming, and domain expertise to extract meaningful insights from data. It powers decision-making through predictive modeling and advanced analytics.",
    skills: [
      { name: "Python / R", level: "Core" }, { name: "SQL", level: "Database Specialist" },
      { name: "Statistics & Math", level: "Foundation" }, { name: "Data Visualization", level: "Advanced" },
      { name: "Pandas & Numpy", level: "Essential" }, { name: "Scikit-Learn", level: "Machine Learning" },
    ],
    applications: [
      { title: "Business Intelligence", description: "Helping companies make data-driven strategic decisions.", icon: "BarChart3" },
      { title: "Predictive Maintenance", description: "Forecasting equipment failures in manufacturing.", icon: "Settings" },
      { title: "Customer Analytics", description: "Understanding behavior patterns to drive engagement.", icon: "Users" },
    ],
  },
  "AI / ML": {
    description: "Artificial Intelligence and Machine Learning enable systems to learn from data. This domain covers everything from neural networks and deep learning to natural language processing and robotics.",
    skills: [
      { name: "Deep Learning", level: "Advanced" }, { name: "Neural Networks", level: "Core" },
      { name: "Natural Language Processing", level: "Specialization" }, { name: "PyTorch / TensorFlow", level: "Tools" },
      { name: "Algorithm Design", level: "Math-Heavy" }, { name: "MLOps", level: "Infrastructure" },
    ],
    applications: [
      { title: "Healthcare Diagnostics", description: "AI models diagnose diseases from medical scans.", icon: "Stethoscope" },
      { title: "Autonomous Systems", description: "Self-driving cars and drone navigation.", icon: "Car" },
      { title: "Generative AI", description: "Creating content, code, and art through models like GPT.", icon: "Cpu" },
    ],
  },
  "Cybersecurity": {
    description: "Cybersecurity protects systems, networks, and data from digital attacks. It involves ethical hacking, threat detection, and implementing robust security architectures.",
    skills: [
      { name: "Ethical Hacking", level: "Core" }, { name: "Network Security", level: "Foundation" },
      { name: "Cryptography", level: "Advanced" }, { name: "Incident Response", level: "Intermediate" },
      { name: "Cloud Security", level: "Emerging" }, { name: "Security Auditing", level: "Professional" },
    ],
    applications: [
      { title: "Financial Protection", description: "Securing online banking and preventing fraud.", icon: "Shield" },
      { title: "Infrastructure Security", description: "Protecting power grids and national communication lines.", icon: "Building" },
      { title: "Data Privacy", description: "Ensuring compliance with global privacy regulations.", icon: "Database" },
    ],
  },
  "UI/UX Design": {
    description: "UI/UX Design centers on the human experience with digital products. It blends visual aesthetics with functional usability to create intuitive and delightful interfaces.",
    skills: [
      { name: "User Research", level: "Foundation" }, { name: "Wireframing & Prototyping", level: "Core" },
      { name: "Visual Design", level: "Aesthetic" }, { name: "Figma / Adobe XD", level: "Mastery" },
      { name: "Interaction Design", level: "Advanced" }, { name: "Accessibility", level: "Essential" },
    ],
    applications: [
      { title: "Consumer Apps", description: "Creating simple, effective interfaces for everyday use.", icon: "Smartphone" },
      { title: "Enterprise Software", description: "Simplifying complex workflows for professional environments.", icon: "Layers" },
      { title: "Gaming UI", description: "High-engagement, immersive interface designs.", icon: "Gamepad2" },
    ],
  },
  "Cloud Computing": {
    description: "Cloud Computing involves delivering computing services over the internet. It focuses on scalability, reliable infrastructure, and high-availability systems on platforms like AWS, Azure, and GCP.",
    skills: [
      { name: "AWS / Azure / GCP", level: "Platform Expert" }, { name: "Serverless Architecture", level: "Advanced" },
      { name: "Cloud Infrastructure", level: "Core" }, { name: "Terraform / IaC", level: "Intermediate" },
      { name: "Networking", level: "Foundation" }, { name: "Cloud Security", level: "Essential" },
    ],
    applications: [
      { title: "Streaming Services", description: "Delivering high-definition video to millions simultaneously.", icon: "Globe" },
      { title: "Big Data Processing", description: "Handling massive datasets using cloud-scale compute.", icon: "Database" },
      { title: "High-Availability Web", description: "Sites that stay up under extreme traffic loads.", icon: "Cloud" },
    ],
  },
  "DevOps": {
    description: "DevOps bridges the gap between development and operations. It focuses on automation, CI/CD pipelines, and efficient system deployment to accelerate software delivery cycles.",
    skills: [
      { name: "CI / CD Pipelines", level: "Core" }, { name: "Docker & Kubernetes", level: "Containerization" },
      { name: "Infrastructure as Code", level: "Essential" }, { name: "Prometheus / Grafana", level: "Monitoring" },
      { name: "Shell Scripting", level: "Foundation" }, { name: "Linux Administration", level: "Core" },
    ],
    applications: [
      { title: "Continuous Delivery", description: "Deploying code updates dozens of times a day.", icon: "RefreshCcw" },
      { title: "Automated Testing", description: "Reducing errors through robust software verification.", icon: "ClipboardList" },
      { title: "System Reliability", description: "Ensuring uptime and performance across complex fleets.", icon: "Activity" },
    ],
  },
  "Product Management": {
    description: "Product Management involves leading the end-to-end development of a product. PMs act as the glue between tech, design, and business to ensure product-market fit.",
    skills: [
      { name: "Agile & Scrum", level: "Core" }, { name: "Product Roadmap", level: "Strategy" },
      { name: "Data-Driven Decisions", level: "Advanced" }, { name: "Market Research", level: "Essential" },
      { name: "Stakeholder Management", level: "Soft Skill" }, { name: "UX Fundamentals", level: "Secondary" },
    ],
    applications: [
      { title: "Product Launch", description: "Taking a concept from prototype to market leader.", icon: "Rocket" },
      { title: "Feature Prioritization", description: "Maximizing ROI by focusing on high-impact updates.", icon: "Target" },
      { title: "Startup Growth", description: "Scaling products rapidly to meet market demands.", icon: "TrendingUp" },
    ],
  },
  "Research": {
    description: "Research in technology dives into unsolved problems. It involves academic rigor, scientific methods, and building new theories or technologies that push industry boundaries.",
    skills: [
      { name: "Scientific Writing", level: "Essential" }, { name: "Data Analysis", level: "Core" },
      { name: "Literature Review", level: "Foundation" }, { name: "Experimental Design", level: "Advanced" },
      { name: "Presentation Skills", level: "Professional" }, { name: "Statistical Modeling", level: "Core" },
    ],
    applications: [
      { title: "Academic Publications", description: "Contributing to the global body of knowledge.", icon: "BookOpen" },
      { title: "R&D Labs", description: "Developing next-gen technologies for large corporations.", icon: "Settings" },
      { title: "Policy Development", description: "Informing government and ethics committees on tech.", icon: "Scale" },
    ],
  },
  "Entrepreneurship": {
    description: "Entrepreneurship is about building a business from the ground up. In tech, it focuses on identifying gaps, securing funding, and scaling innovative solutions with limited resources.",
    skills: [
      { name: "Business Model Design", level: "Core" }, { name: "Pitching & Fundraising", level: "Essential" },
      { name: "Product Strategy", level: "Advanced" }, { name: "Lean Startup", level: "Foundation" },
      { name: "Sales & Marketing", level: "Intermediate" }, { name: "Financial Literacy", level: "Essential" },
    ],
    applications: [
      { title: "Unicorn Startups", description: "Building companies valued at over a billion dollars.", icon: "Award" },
      { title: "Social Impact Venture", description: "Solving world problems through business models.", icon: "Globe" },
      { title: "Innovation Consulting", description: "Helping established firms adopt startup culture.", icon: "Briefcase" },
    ],
  },
};

function DomainDetailPage({ domain, onBack, backendOnline }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchInfo() {
      setLoading(true);
      setError(null);
      try {
        console.log(`[DomainDetail] Fetching info for domain: ${domain}`);
        const res = await domainInfoAPI.getByDomain(domain);
        if (!cancelled) {
          setInfo(res.data.data);
          console.log("[DomainDetail] Domain info loaded from server");
        }
      } catch (err) {
        console.log("[DomainDetail] Server fetch failed, using fallback:", err.message);
        if (!cancelled) {
          const fallback = FALLBACK_DOMAIN_DATA[domain];
          if (fallback) setInfo({ domain, ...fallback });
          else setError("Domain information not found.");
        }
      }
      if (!cancelled) setLoading(false);
    }
    fetchInfo();
    return () => { cancelled = true; };
  }, [domain, backendOnline]);

  return (
    <div className="page">
      <div className="container section">
        {/* Back button */}
        <button className="btn btn-outline mb-6" style={{ display: "inline-flex", alignItems: "center", gap: 8 }} onClick={onBack}>
          ← Back to Dashboard
        </button>

        {loading && (
          <div className="card text-center" style={{ padding: "60px 24px" }}>
            <div className="spinner-wrap" style={{ fontSize: "2.5rem", marginBottom: 16 }}>
              <Activity className="animate-spin" size={48} style={{ color: "var(--primary)" }} />
            </div>
            <p className="text-muted">Loading domain information…</p>
          </div>
        )}

        {!loading && error && (
          <div className="card text-center" style={{ padding: "60px 24px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16, color: "var(--text-light)" }}><ShieldAlert size={64} /></div>
            <p className="text-muted">{error}</p>
            <button className="btn btn-primary mt-6" onClick={onBack}>Go Back</button>
          </div>
        )}

        {!loading && info && (
          <>
            {/* Hero heading */}
            <div className="domain-detail-hero">
              <div className="domain-detail-icon-wrap">
                <Target size={32} />
              </div>
              <div>
                <h1 className="domain-detail-title">{info.domain}</h1>
                <span className="badge badge-blue" style={{ fontSize: "0.8rem", padding: "4px 12px" }}>Strategic Domain Guide</span>
              </div>
            </div>

            {/* About / Description */}
            <div className="card mb-6">
              <div className="card-body">
                <h2 style={{ fontWeight: 700, marginBottom: 14, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <Globe size={18} style={{ color: "var(--primary)" }} /> About this Domain
                </h2>
                <p style={{ lineHeight: 1.85, color: "var(--text-muted)", fontSize: "0.95rem" }}>{info.description}</p>
              </div>
            </div>

            {/* Skills to Master */}
            {info.skills && info.skills.length > 0 && (
              <div className="card mb-6">
                <div className="card-body">
                  <h2 style={{ fontWeight: 700, marginBottom: 18, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen size={18} style={{ color: "var(--primary)" }} /> Skills to Master
                  </h2>
                  <div className="domain-chips-grid">
                    {info.skills.map((s, i) => (
                      <div key={i} className="domain-chip">
                        <span className="domain-chip-name">{s.name}</span>
                        <span className="domain-chip-level">{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Industrial Applications */}
            {info.applications && info.applications.length > 0 && (
              <div className="card mb-6">
                <div className="card-body">
                  <h2 style={{ fontWeight: 700, marginBottom: 18, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <Building size={18} style={{ color: "var(--primary)" }} /> Industrial Applications
                  </h2>
                  <div className="domain-app-grid">
                    {info.applications.map((app, i) => (
                      <div key={i} className="domain-app-card">
                        <div className="domain-app-icon" style={{ color: "var(--primary)" }}>
                          {APP_ICON_MAP[app.icon] || <Layers size={24} />}
                        </div>
                        <div className="domain-app-content">
                          <div className="domain-app-title">{app.title}</div>
                          <div className="domain-app-desc">{app.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ==================== FLOWCHART COMPONENT ====================
// eslint-disable-next-line no-unused-vars
function Flowchart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="flowchart-container mt-8">
      <h3 className="section-title mb-6" style={{ width: "100%", padding: "0 20px" }}>
        <Activity size={20} style={{ marginRight: 10, color: "var(--primary)" }} /> Visual Strategic Roadmap
      </h3>
      {data.map((node, index) => (
        <React.Fragment key={node.id}>
          <div className={`flow-node ${node.type}`}>
            <span className="node-type">{node.type}</span>
            <div className="node-label">{node.label}</div>
          </div>
          {index < data.length - 1 && <div className="flow-connector"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ==================== DECISION PAGE ====================

function CareerGuidePage({ user, learningSkills, onBack, backendOnline }) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchGuide() {
      // 1. Domain to Default Career Aspiration mapping
      const domainToDefaultCareerGoal = {
        "Web Development": "Full Stack Developer",
        "Artificial Intelligence": "AI/ML Engineer",
        "Data Science": "Data Scientist",
        "Cybersecurity": "Cybersecurity Analyst",
        "Cloud Computing": "Cloud Architect",
        "Mobile Development": "Mobile App Developer",
        "Mobile App Development": "Mobile App Developer",
        "Game Development": "Game Developer",
        "DevOps & Infrastructure": "DevOps Engineer",
        "DevOps": "DevOps Engineer",
        "UI/UX Design": "UI/UX Designer",
        "Blockchain": "Blockchain Developer",
        "Product Management": "Product Manager",
        "Research": "Researcher",
        "Entrepreneurship": "Entrepreneur"
      };

      // 2. Fetch Logic: Precise role mapping prioritizing careerAspiration
      const goalToAspirationMap = {
        "Explore AI / ML field": "AI Engineer",
        "Learn web development": "Full Stack Developer",
        "Learn data science": "Data Scientist",
        "Learn app development": "App Developer",
        "Improve design skills": "UI/UX Designer",
        "Strengthen problem solving": "Software Engineer",
        "Prepare for placements": "Software Engineer",
        "Become job-ready": "Software Engineer",
        "Get internship": "Software Engineer",
        "Build resume": "Software Engineer",
        "Build personal brand": "Software Engineer"
      };

      const selectedGoal = user?.careerGoal;
      const selectedAspiration = user?.careerAspiration;

      const backendCareerGoal = (
        selectedAspiration ||
        goalToAspirationMap[selectedGoal] ||
        domainToDefaultCareerGoal[user?.primaryDomain] ||
        selectedGoal ||
        "Software Engineer"
      ).trim();

      // Console logs as requested
      console.log(`[CareerGuide] selected careerGoal: "${selectedGoal}"`);
      console.log(`[CareerGuide] selected careerAspiration: "${selectedAspiration}"`);
      console.log(`[CareerGuide] final target being sent to /api/career-guide: "${backendCareerGoal}"`);

      if (!backendCareerGoal) return;

      console.log(`[CareerGuide] Fetching roadmap for target: "${backendCareerGoal}"`);

      setLoading(true);
      setError(null);

      try {
        const res = await careerGuideAPI.getByGoal(backendCareerGoal);
        if (!cancelled) {
          if (res.data && res.data.success) {
            setGuide(res.data.data);
            console.log("[CareerGuide] Roadmap data loaded successfully");
          } else {
            throw new Error(res.data?.message || "Invalid roadmap data received");
          }
        }
      } catch (err) {
        console.error("[CareerGuide] Fetch error:", err.response?.data?.message || err.message);
        if (!cancelled) {
          // Dynamic Fallback Content for "Other" or unseeded domains
          const defaultGuide = {
            goalKeyword: backendCareerGoal || "Custom Career Path",
            overview: `You've chosen to explore a unique track in ${backendCareerGoal || 'Tech'}! While we don't have a pre-configured, highly specialized roadmap for this exact role yet, the industry heavily values adaptable problem solvers. Focus on building foundational concepts, creating a compelling portfolio, and engaging with professional communities.`,
            requiredSkills: ["Problem Solving", "Communication", "Critical Thinking", "Adaptability", "Project Management"],
            requiredHoursPerWeek: 15,
            steps: [
              { stepNumber: 1, title: 'Explore the Fundamentals', description: 'Start by researching the core concepts, industry trends, and fundamental skills required for this role.' },
              { stepNumber: 2, title: 'Learn the Essential Tools', description: 'Identify top tools or methodologies used by professionals in this field and begin learning them through tutorials.' },
              { stepNumber: 3, title: 'Build a Proof of Concept', description: 'Create a small project, case study, or thesis that demonstrates your understanding of the domain.' },
              { stepNumber: 4, title: 'Connect with Experts', description: 'Reach out to professionals on LinkedIn or specialized communities to gather insights and seek mentorship.' },
              { stepNumber: 5, title: 'Refine and Specialize', description: 'Based on your initial exploration, pick a specific niche within this path and focus deeply on mastering it.' },
            ],
            flowchart: [
              { id: 'start', label: 'Start Your Journey', type: 'start', nextIds: ['s1'] },
              { id: 's1', label: 'Research Fundamentals', type: 'step', nextIds: ['s2'] },
              { id: 's2', label: 'Learn Core Tools', type: 'step', nextIds: ['s3'] },
              { id: 's3', label: 'Build PoC / Project', type: 'step', nextIds: ['s4'] },
              { id: 's4', label: 'Network & Connect', type: 'step', nextIds: ['s5'] },
              { id: 's5', label: 'Refine & Specialize', type: 'step', nextIds: ['end'] },
              { id: 'end', label: backendCareerGoal || 'Your Target Career', type: 'end', nextIds: [] },
            ]
          };
          setGuide(defaultGuide);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (backendOnline === true) {
      fetchGuide();
    } else if (backendOnline === false) {
      setLoading(false);
      setError("Backend is currently offline. Persistence and guides are unavailable.");
    }

    return () => { cancelled = true; };
  }, [user, backendOnline]);

  const knownSkills = learningSkills.map(s => s.name.toLowerCase());
  const required = guide?.requiredSkills || [];
  const skillsToLearn = required.filter(s => !knownSkills.includes(s.toLowerCase()));
  const skillsKnown = required.filter(s => knownSkills.includes(s.toLowerCase()));

  const userHours = parseInt(user?.learningHoursPerWeek || 0);
  const requiredHours = guide?.requiredHoursPerWeek || 20;
  const hourProgress = Math.min(100, (userHours / requiredHours) * 100);

  return (
    <div className="page">
      <div className="container section">
        <button className="btn btn-outline mb-8" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /> Back to Dashboard
        </button>

        {loading ? (
          <div className="card text-center" style={{ padding: "80px 24px" }}>
            <Activity className="animate-spin" size={48} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
            <p className="text-muted">Analysing your career path…</p>
          </div>
        ) : error && !guide ? (
          <div className="card text-center" style={{ padding: "60px 24px" }}>
            <ShieldAlert size={48} style={{ color: "var(--amber)", margin: "0 auto 16px" }} />
            <h2 className="mb-2">Goal Not Found</h2>
            <p className="text-muted mb-6">{error}</p>
            <button className="btn btn-primary" onClick={onBack}>Update Career Goal</button>
          </div>
        ) : (
          <>
            {/* Professional Hero Section */}
            <div className="career-guide-hero">
              <div className="career-hero-content">
                <div className="badge badge-amber mb-4" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Award size={14} /> Personalised Career Roadmap
                </div>
                <h1 className="career-guide-title">{guide?.goalKeyword || user?.careerAspiration || user?.careerGoal}</h1>
                <p className="career-guide-aspiration">“{user?.careerAspiration || "Striving for excellence in tech."}”</p>
              </div>
              <div className="career-hero-icon">
                <Briefcase size={80} strokeWidth={1} />
              </div>
            </div>

            {/* Overview Section */}
            <div className="card mb-8">
              <div className="card-body">
                <h2 className="guide-section-title"><Target size={20} /> Career Overview</h2>
                <p className="guide-text">{guide?.overview}</p>
              </div>
            </div>

            <div className="card-grid mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
              {/* Skills Gap Analysis */}
              <div className="card">
                <div className="card-body">
                  <h2 className="guide-section-title"><Shield size={20} /> Skills Gap Analysis</h2>
                  <div className="skills-gap-container mt-4">
                    <div className="skills-column">
                      <div className="skills-column-label">Already Known</div>
                      {skillsKnown.length > 0 ? (
                        skillsKnown.map(s => (
                          <div key={s} className="skill-gap-item known">
                            <CheckCircle2 size={16} /> <span>{s}</span>
                          </div>
                        ))
                      ) : <p className="text-sm text-muted italic">No matching skills found in your profile yet.</p>}
                    </div>
                    <div className="skills-column">
                      <div className="skills-column-label">Required to Learn</div>
                      {skillsToLearn.length > 0 ? (
                        skillsToLearn.map(s => (
                          <div key={s} className="skill-gap-item missing">
                            <XCircle size={16} /> <span>{s}</span>
                          </div>
                        ))
                      ) : <p className="text-sm text-success font-bold italic">You have mastered all core skills!</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Benchmark */}
              <div className="card">
                <div className="card-body">
                  <h2 className="guide-section-title"><Clock size={20} /> Learning Commitment</h2>
                  <p className="text-sm text-muted mb-6">Comparison of your current commitment vs. industry benchmark.</p>

                  <div className="hours-comparison">
                    <div className="flex-between mb-2">
                      <span className="text-sm font-600">Your Current Commitment</span>
                      <span className="text-sm font-700">{userHours} hrs/week</span>
                    </div>
                    <div className="hour-track">
                      <div className="hour-bar" style={{ width: `${hourProgress}%` }}></div>
                    </div>
                    <div className="flex-between mt-4">
                      <span className="text-sm text-muted">Goal Benchmark</span>
                      <span className="badge badge-blue">{requiredHours} hrs/week</span>
                    </div>
                  </div>

                  <div className="info-box mt-8">
                    <TrendingUp size={16} />
                    <p className="text-sm">
                      {userHours >= requiredHours
                        ? "Excellent! You are maintaining an optimal learning pace for this career goal."
                        : `Increasing your weekly commitment by ${requiredHours - userHours} hours will significantly accelerate your progress.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Flowchart Section */}
            <div className="card mb-12">
              <div className="card-body">
                <h2 className="guide-section-title"><Monitor size={20} /> Technical Journey Map</h2>
                <div className="flowchart-container">
                  {guide?.flowchart?.map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <div className={`flow-node node-${node.type}`}>
                        {node.type === 'start' && <Globe size={14} />}
                        {node.type === 'decision' && <ShieldAlert size={14} />}
                        {node.type === 'end' && <Trophy size={14} />}
                        <span>{node.label}</span>
                      </div>
                      {idx < guide.flowchart.length - 1 && (
                        <div className="flow-connector">
                          <div className="connector-line"></div>
                          <ChevronRight size={16} className="connector-arrow" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

function DecisionPage({ learningSkills, setLearningSkills, addActivity, addSearch, backendOnline }) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const performSearch = (val) => {
    const q = val.toLowerCase().trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }

    const allSkills = Object.keys(MOCK_SKILLS);

    // 1. Check alias map first
    const aliasHits = SKILL_ALIASES[q] || [];

    // 2. Direct name match (starts with or word boundary)
    const nameMatches = allSkills.filter(k => {
      const lowerK = k.toLowerCase();
      return lowerK.startsWith(q) || lowerK.includes(" " + q);
    });

    // 3. Subtopic match (more strict for short queries)
    const topicMatches = q.length < 3 ? [] : allSkills.filter(k =>
      MOCK_SKILLS[k].some(t => {
        const words = t.toLowerCase().split(/[\s&/()+,.-]+/);
        return words.some(w => w.startsWith(q));
      })
    );

    // 4. Fallback search (only if no results so far)
    let ordered = [...new Set([...aliasHits, ...nameMatches, ...topicMatches])];

    if (ordered.length === 0) {
      // Loose name match
      ordered = allSkills.filter(k => k.toLowerCase().includes(q));
    }

    setResults(ordered.length > 0 ? ordered.slice(0, 12) : []);
    setSearched(true);
  };

  const doSearch = () => {
    if (!query.trim()) return;
    addSearch(query);
    performSearch(query);
  };

  const handleQueryChange = (val) => {
    setQuery(val);
    performSearch(val);
  };

  const addSkill = async (skillName) => {
    if (learningSkills.find(s => s.name === skillName)) return;
    const topics = MOCK_SKILLS[skillName].map(t => ({ name: t, completed: false }));
    const newSkill = { name: skillName, topics, progress: 0 };

    // Optimistic UI update
    setLearningSkills(prev => [...prev, newSkill]);
    addActivity(`Added ${skillName} as learning goal`);

    if (backendOnline) {
      try {
        // Send topics as strings to the backend as expected by the robust controller
        const apiTopics = MOCK_SKILLS[skillName]; 
        const res = await skillsAPI.add({ skillName, topics: apiTopics });
        if (res.data?.skill) {
          const syncedSkill = {
            _id: res.data.skill._id,
            name: res.data.skill.skillName,
            progress: res.data.skill.progress,
            topics: res.data.skill.topics.map(t => ({ name: t.name, done: t.completed, completed: t.completed })),
          };
          setLearningSkills(prev => prev.map(s => s.name === skillName ? syncedSkill : s));
          console.log(`[Decision] Skill ${skillName} persisted with ID: ${res.data.skill._id}`);
        }
      } catch (err) {
        console.error("Failed to add skill to backend:", err);
      }
    }
  };

  const toggleTopic = async (skillName, topicName) => {
    // 1. Find the skill to update from current state
    const skill = learningSkills.find(s => s.name === skillName);
    if (!skill) return;

    // 2. Calculate new state immediately to avoid closure/async issues
    const newTopics = skill.topics.map(t => {
      const isDone = t.done !== undefined ? t.done : t.completed;
      const newDone = t.name === topicName ? !isDone : isDone;
      return { ...t, done: newDone, completed: newDone };
    });

    const doneCount = newTopics.filter(t => t.done || t.completed).length;
    const newProgress = Math.round((doneCount / newTopics.length) * 100);
    const updatedSkill = { ...skill, topics: newTopics, progress: newProgress };

    // 3. Optimistic local update
    setLearningSkills(prev => prev.map(s => s.name === skillName ? updatedSkill : s));

    // 4. Logs as requested
    if (newProgress === 100 && skill.progress < 100) {
      addActivity(`Completed all topics in ${skillName}!`);
    } else if (newTopics.find(t => t.name === topicName)?.done) {
      addActivity(`Completed "${topicName}" in ${skillName}`);
    }

    // 5. Backend sync using calculated data
    if (backendOnline && skill._id) {
      try {
        const apiTopics = newTopics.map(t => ({
          name: t.name,
          completed: !!(t.done || t.completed)
        }));
        
        console.log(`[Decision] Syncing ${skillName} progress: ${newProgress}%`);
        const res = await skillsAPI.update(skill._id, { topics: apiTopics });
        
        if (res.data?.skill) {
          const syncedSkill = {
            _id: res.data.skill._id,
            name: res.data.skill.skillName,
            progress: res.data.skill.progress,
            topics: res.data.skill.topics.map(t => ({ name: t.name, done: t.completed, completed: t.completed })),
          };
          setLearningSkills(prev => prev.map(s => s._id === skill._id ? syncedSkill : s));
        }
      } catch (err) {
        console.error("Failed to update skill on backend:", err);
      }
    }
  };

  return (
    <div className="page">
      <div className="container section">
        <div className="section-header">
          <h1 className="section-title" style={{ fontSize: "1.6rem" }}><Target size={18} style={{ marginRight: "6px" }} /> Decision — Skill Planning</h1>
          <p className="section-sub">Search skills, set learning goals, and track your progress.</p>
        </div>

        <div className="card mb-8">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}><Search size={18} style={{ marginRight: "6px" }} /> Search Skills</h3>
            <div className="search-bar">
              <input className="form-input" placeholder="Search skills (e.g. JavaScript, AI, Web Development...)" value={query}
                onChange={e => handleQueryChange(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} />
              <button className="btn btn-primary" onClick={doSearch}>Search</button>
            </div>
            {searched && results.length > 0 && (
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

            {searched && results.length === 0 && (
              <div className="card text-center" style={{ marginTop: 20, padding: 24, background: "var(--bg-section)" }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}><Search size={18} style={{ marginRight: "6px" }} /></div>
                <p className="text-muted">No matching skills found. Try a different term or check spelling.</p>
              </div>
            )}
            {!searched && (
              <div style={{ marginTop: 10 }}>
                <p className="text-muted text-sm">Start typing to find skills...</p>
              </div>
            )}
          </div>
        </div>

        {learningSkills.length > 0 && (
          <>
            <div className="section-header"><h2 className="section-title"><BookOpen size={18} style={{ marginRight: "6px" }} /> My Learning Goals</h2></div>
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
                        <input type="checkbox" checked={t.done || t.completed} onChange={() => toggleTopic(skill.name, t.name)} />
                        <span className={`subtopic-label${(t.done || t.completed) ? " done" : ""}`}>{t.name}</span>
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
    </div>
  );
}

// ==================== OPPORTUNITIES PAGE ====================

const WORK_TYPES = ["In Office", "Work from Home", "Hybrid", "Field Work"];
const LOCATIONS = ["Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune", "Remote", "Global"];
const ROLES = ["AI Research", "Backend", "Blockchain", "Business Development", "Cloud Engineering", "Cybersecurity", "Data Analysis", "Data Science", "DevOps", "Digital Marketing", "Finance", "Frontend", "Full Stack", "Graphic Design", "HR", "Machine Learning", "Mobile App Dev", "Product Management", "SDE", "Software Development", "UI", "UI/UX Design", "Web Development"];
const SORT_OPTIONS = ["Latest", "Relevant", "Alphabetical"];

const CATEGORY_ITEMS = [
  { name: "Software Development", icon: <Code size={18} style={{ marginRight: "6px" }} /> },
  { name: "Web Development", icon: <Globe size={18} style={{ marginRight: "6px" }} /> },
  { name: "Data Science", icon: <Database size={18} style={{ marginRight: "6px" }} /> },
  { name: "Cybersecurity", icon: <Shield size={18} style={{ marginRight: "6px" }} /> },
  { name: "UI/UX Design", icon: <Palette size={18} style={{ marginRight: "6px" }} /> },
  { name: "Mobile Development", icon: <Phone size={18} style={{ marginRight: "6px" }} /> },
  { name: "Research", icon: "🔬" },
  { name: "Product Management", icon: "📋" },
  { name: "Finance", icon: "💳" },
  { name: "Digital Marketing", icon: "📢" },
  { name: "HR", icon: "👥" }
];

const COMP_STATUS_OPTIONS = ["Live", "Expired", "Closed", "Recent"];
const EVENT_TYPE_OPTIONS = ["Online", "Offline"];
const PAYMENT_OPTIONS = ["Paid", "Free"];
const TEAM_SIZE_OPTIONS = ["1", "2", "2+"];
const COMP_LOCATIONS = ["Pune", "Gurgaon", "Delhi", "Bangalore", "Mumbai", "Hyderabad", "Chennai", "Noida", "Kolkata", "Remote / Online"];
const COMP_CATEGORIES = [
  "Architecture", "Artificial Intelligence & Machine Learning", "Chemical Engineering",
  "Civil Engineering", "Cloud & Infrastructure", "Consulting & Strategy", "Content & Editorial",
  "Creative & Performing Arts", "Cybersecurity", "Data & Analytics", "Design",
  "Education & Training", "Electrical Engineering", "Electronics Engineering",
  "Environmental & Sustainability", "Finance & Banking", "Full Stack Development",
  "Hardware & Embedded", "HealthTech", "Information Technology", "Law & Policy",
  "Management & Leadership", "Marketing & Growth", "Mathematics", "Mechanical Engineering",
  "Mobile Development", "Open Source", "Physics & Science", "Product Management",
  "Robotics & Automation", "Social Impact", "Space & Astronomy", "UI/UX Design",
  "Web Development"
];
const USER_TYPES = ["College Students", "Fresher", "Professionals", "School Students"];
const COMP_SKILLS = [
  "Java", "JavaScript", "Python", "C++", "React", "Node.js", "SQL", "Machine Learning",
  "Data Science", "UI/UX Design", "Blockchain", "Cloud Computing", "DevOps",
  "Competitive Programming", "Android", "iOS", "AR/VR", "Cybersecurity",
  "NLP", "Computer Vision", "Financial Modeling", "Research & Analysis"
];


// eslint-disable-next-line no-unused-vars
function FilterDropdown({ label, options, selected, onSelect, searchable = false, icon = "⚡" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = searchable
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="filter-dropdown-wrap">
      <button className={`filter-btn${selected ? " active" : ""}${isOpen ? " open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {icon} {selected || label} <span className="chevron">▼</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {searchable && (
            <input className="search-dropdown-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          )}
          <div className="dropdown-item" onClick={() => { onSelect(null); setIsOpen(false); }}>All {label}s</div>
          {filtered.map(o => (
            <div key={o} className={`dropdown-item${selected === o ? " selected" : ""}`} onClick={() => { onSelect(o); setIsOpen(false); }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AllFiltersModal({ onClose, filters, setFilters, apply, currentSort, setSort, type }) {
  const [activeTab, setActiveTab] = useState(type === "internship" ? "Work Type" : "Status");
  const [tempFilters, setTempFilters] = useState(filters);
  const [tempSort, setTempSort] = useState(currentSort);

  const internshipTabs = ["Work Type", "Location", "Roles", "Sort By"];
  const competitionTabs = ["Quick Filters", "Status", "Event Type", "Payment", "Team Size", "Locations", "Categories", "User Type", "Skills", "Sort By"];
  const tabs = type === "internship" ? internshipTabs : competitionTabs;

  const [catSearch, setCatSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [locSearch, setLocSearch] = useState("");

  const toggleRole = (r) => {
    setTempFilters(prev => {
      const roles = prev.roles.includes(r) ? prev.roles.filter(x => x !== r) : [...prev.roles, r];
      return { ...prev, roles };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Quick Filters":
        return (
          <div className="filter-options-grid">
            <label className={`filter-option-item${tempFilters.openToAll ? " active" : ""}`}>
              <input type="checkbox" checked={tempFilters.openToAll} onChange={() => setTempFilters(f => ({ ...f, openToAll: !f.openToAll }))} />
              <span>🚪 Open to all</span>
            </label>
          </div>
        );
      case "Status":
        return (
          <div className="filter-options-grid">
            {COMP_STATUS_OPTIONS.map(s => (
              <label key={s} className={`filter-option-item${tempFilters.status === s ? " active" : ""}`}>
                <input type="radio" name="status" checked={tempFilters.status === s} onChange={() => setTempFilters(f => ({ ...f, status: s }))} />
                <span>{s}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.status ? " active" : ""}`}>
              <input type="radio" name="status" checked={!tempFilters.status} onChange={() => setTempFilters(f => ({ ...f, status: null }))} />
              <span>All Statuses</span>
            </label>
          </div>
        );
      case "Event Type":
        return (
          <div className="filter-options-grid">
            {EVENT_TYPE_OPTIONS.map(e => (
              <label key={e} className={`filter-option-item${tempFilters.eventType === e ? " active" : ""}`}>
                <input type="radio" name="eventType" checked={tempFilters.eventType === e} onChange={() => setTempFilters(f => ({ ...f, eventType: e }))} />
                <span>{e}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.eventType ? " active" : ""}`}>
              <input type="radio" name="eventType" checked={!tempFilters.eventType} onChange={() => setTempFilters(f => ({ ...f, eventType: null }))} />
              <span>Any Event Type</span>
            </label>
          </div>
        );
      case "Payment":
        return (
          <div className="filter-options-grid">
            {PAYMENT_OPTIONS.map(p => (
              <label key={p} className={`filter-option-item${tempFilters.payment === p ? " active" : ""}`}>
                <input type="radio" name="payment" checked={tempFilters.payment === p} onChange={() => setTempFilters(f => ({ ...f, payment: p }))} />
                <span>{p}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.payment ? " active" : ""}`}>
              <input type="radio" name="payment" checked={!tempFilters.payment} onChange={() => setTempFilters(f => ({ ...f, payment: null }))} />
              <span>All</span>
            </label>
          </div>
        );
      case "Team Size":
        return (
          <div className="filter-options-grid">
            {TEAM_SIZE_OPTIONS.map(t => (
              <label key={t} className={`filter-option-item${tempFilters.teamSize === t ? " active" : ""}`}>
                <input type="radio" name="teamSize" checked={tempFilters.teamSize === t} onChange={() => setTempFilters(f => ({ ...f, teamSize: t }))} />
                <span>{t}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.teamSize ? " active" : ""}`}>
              <input type="radio" name="teamSize" checked={!tempFilters.teamSize} onChange={() => setTempFilters(f => ({ ...f, teamSize: null }))} />
              <span>Any Size</span>
            </label>
          </div>
        );
      case "Work Type":
        return (
          <div className="filter-options-grid">
            {WORK_TYPES.map(t => (
              <label key={t} className={`filter-option-item${tempFilters.type === t ? " active" : ""}`}>
                <input type="radio" name="workType" checked={tempFilters.type === t} onChange={() => setTempFilters(f => ({ ...f, type: t }))} />
                <span>{t}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.type ? " active" : ""}`}>
              <input type="radio" name="workType" checked={!tempFilters.type} onChange={() => setTempFilters(f => ({ ...f, type: null }))} />
              <span>Any Type</span>
            </label>
          </div>
        );
      case "Location":
        return (
          <div className="filter-options-grid">
            {LOCATIONS.map(l => (
              <label key={l} className={`filter-option-item${tempFilters.location === l ? " active" : ""}`}>
                <input type="radio" name="location" checked={tempFilters.location === l} onChange={() => setTempFilters(f => ({ ...f, location: l }))} />
                <span>{l}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.location ? " active" : ""}`}>
              <input type="radio" name="location" checked={!tempFilters.location} onChange={() => setTempFilters(f => ({ ...f, location: null }))} />
              <span>Anywhere</span>
            </label>
          </div>
        );
      case "Roles":
        return (
          <div className="filter-options-grid">
            {ROLES.map(r => (
              <label key={r} className={`filter-option-item${tempFilters.roles.includes(r) ? " active" : ""}`}>
                <input type="checkbox" checked={tempFilters.roles.includes(r)} onChange={() => toggleRole(r)} />
                <span>{r}</span>
              </label>
            ))}
          </div>
        );
      case "Locations":
        return (
          <div className="filter-options-grid">
            <div style={{ marginBottom: 12 }}>
              <input className="form-input" placeholder="Search location..." value={locSearch} onChange={e => setLocSearch(e.target.value)} style={{ borderRadius: 10, height: 40 }} />
            </div>
            {COMP_LOCATIONS.filter(l => l.toLowerCase().includes(locSearch.toLowerCase())).map(l => (
              <label key={l} className={`filter-option-item${tempFilters.compLocation === l ? " active" : ""}`}>
                <input type="radio" name="compLocation" checked={tempFilters.compLocation === l} onChange={() => setTempFilters(f => ({ ...f, compLocation: l }))} />
                <span>📍 {l}</span>
              </label>
            ))}
            <label className={`filter-option-item${!tempFilters.compLocation ? " active" : ""}`}>
              <input type="radio" name="compLocation" checked={!tempFilters.compLocation} onChange={() => setTempFilters(f => ({ ...f, compLocation: null }))} />
              <span>Anywhere</span>
            </label>
          </div>
        );
      case "Categories":
        return (
          <div>
            <div style={{ marginBottom: 12 }}>
              <input className="form-input" placeholder="Search Categories..." value={catSearch} onChange={e => setCatSearch(e.target.value)} style={{ borderRadius: 10, height: 40 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {COMP_CATEGORIES.filter(c => c.toLowerCase().includes(catSearch.toLowerCase())).map(c => (
                <button
                  key={c}
                  onClick={() => setTempFilters(f => ({ ...f, compCategories: f.compCategories?.includes(c) ? f.compCategories.filter(x => x !== c) : [...(f.compCategories || []), c] }))}
                  style={{
                    padding: "6px 14px", borderRadius: 20,
                    border: `1.5px dashed ${tempFilters.compCategories?.includes(c) ? "var(--primary)" : "#CBD5E1"}`,
                    background: tempFilters.compCategories?.includes(c) ? "var(--primary-light, #EEF2FF)" : "white",
                    color: tempFilters.compCategories?.includes(c) ? "var(--primary)" : "#475569",
                    fontWeight: 500, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.15s"
                  }}
                >{c}</button>
              ))}
            </div>
          </div>
        );
      case "User Type":
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 8 }}>
            {USER_TYPES.map(u => (
              <button
                key={u}
                onClick={() => setTempFilters(f => ({ ...f, userType: f.userType === u ? null : u }))}
                style={{
                  padding: "8px 18px", borderRadius: 20,
                  border: `1.5px dashed ${tempFilters.userType === u ? "var(--primary)" : "#CBD5E1"}`,
                  background: tempFilters.userType === u ? "var(--primary-light, #EEF2FF)" : "white",
                  color: tempFilters.userType === u ? "var(--primary)" : "#475569",
                  fontWeight: 500, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.15s"
                }}
              >{u}</button>
            ))}
          </div>
        );
      case "Skills":
        return (
          <div>
            <div style={{ marginBottom: 12 }}>
              <input className="form-input" placeholder="Search Skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)} style={{ borderRadius: 10, height: 40 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {COMP_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map(s => (
                <button
                  key={s}
                  onClick={() => setTempFilters(f => ({ ...f, compSkills: f.compSkills?.includes(s) ? f.compSkills.filter(x => x !== s) : [...(f.compSkills || []), s] }))}
                  style={{
                    padding: "6px 14px", borderRadius: 20,
                    border: `1.5px dashed ${tempFilters.compSkills?.includes(s) ? "var(--primary)" : "#CBD5E1"}`,
                    background: tempFilters.compSkills?.includes(s) ? "var(--primary-light, #EEF2FF)" : "white",
                    color: tempFilters.compSkills?.includes(s) ? "var(--primary)" : "#475569",
                    fontWeight: 500, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.15s"
                  }}
                >{s}</button>
              ))}
            </div>
          </div>
        );
      case "Sort By":
        return (
          <div className="filter-options-grid">
            {SORT_OPTIONS.map(s => (
              <label key={s} className={`filter-option-item${tempSort === s ? " active" : ""}`}>
                <input type="radio" name="sort" checked={tempSort === s} onChange={() => setTempSort(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal all-filters-modal redesigned" onClick={e => e.stopPropagation()}>
        <div className="filters-modal-header">
          <h3 style={{ margin: 0 }}>Filters & Sort</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="filters-modal-layout">
          <div className="filters-sidebar">
            {tabs.map(tab => (
              <div
                key={tab}
                className={`sidebar-item${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {(tab === "Work Type" && tempFilters.type) ||
                  (tab === "Location" && tempFilters.location) ||
                  (tab === "Roles" && tempFilters.roles.length > 0) ||
                  (tab === "Status" && tempFilters.status) ||
                  (tab === "Event Type" && tempFilters.eventType) ||
                  (tab === "Payment" && tempFilters.payment) ||
                  (tab === "Team Size" && tempFilters.teamSize) ||
                  (tab === "Locations" && tempFilters.compLocation) ||
                  (tab === "Categories" && tempFilters.compCategories?.length > 0) ||
                  (tab === "User Type" && tempFilters.userType) ||
                  (tab === "Skills" && tempFilters.compSkills?.length > 0)
                  ? <span className="dot" /> : null}
              </div>
            ))}
          </div>
          <div className="filters-content">
            <div className="content-header">
              <h4>{activeTab}</h4>
              <p className="text-muted small">Select your preferred {activeTab.toLowerCase()}</p>
            </div>
            {renderContent()}
          </div>
        </div>
        <div className="filters-modal-footer">
          <button className="btn btn-outline" onClick={() => { setTempFilters({ type: null, location: null, roles: [], status: null, eventType: null, payment: null, teamSize: null, openToAll: false, compLocation: null, compCategories: [], userType: null, compSkills: [] }); setTempSort("Latest"); }}>Clear All</button>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { setSort(tempSort); apply(tempFilters); onClose(); }}>Apply Results</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CategoryBar = ({ selected, onSelect }) => {
  return (
    <div className="category-bar">
      {CATEGORY_ITEMS.map((cat) => (
        <div
          key={cat.name}
          className={`category-card${selected === cat.name ? " active" : ""}`}
          onClick={() => onSelect(cat.name === selected ? null : cat.name)}
        >
          <div className="cat-icon-wrapper">{cat.icon}</div>
          <div className="cat-card-label">{cat.name}</div>
        </div>
      ))}
    </div>
  );
};

function OpportunitiesPage({ opportunities, setOpportunities, addActivity, addSearch, backendOnline }) {
  const [type, setType] = useState("competition");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searched, setSearched] = useState(false);

  const [filters, setFilters] = useState({
    type: null,
    location: null,
    roles: [],
    status: null,
    eventType: null,
    payment: null,
    teamSize: null,
    openToAll: false,
    compLocation: null,
    compCategories: [],
    userType: null,
    compSkills: []
  });
  // eslint-disable-next-line no-unused-vars
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("Latest");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const pool = type === "competition"
    ? withUrls(MOCK_COMPETITIONS, COMPETITION_URLS)
    : withUrls(MOCK_INTERNSHIPS, INTERNSHIP_URLS);

  const performSearch = (q = query, currentPool = pool) => {
    const raw = q.toLowerCase().trim();
    if (!raw) {
      setSuggestions([]);
      return;
    }
    const matching = currentPool.filter(p =>
      p.title.toLowerCase().includes(raw) ||
      p.org.toLowerCase().includes(raw)
    ).map(p => p.title);
    setSuggestions([...new Set(matching)].slice(0, 8));
  };

  const getFilteredResults = useCallback(() => {
    let res = [...pool];

    // 1. Search Query
    if (searched && query.trim()) {
      const q = query.toLowerCase().trim();
      const catMatch = type === "competition" ? COMP_ALIASES[q] : null;
      res = res.filter(p => {
        if (catMatch) return p.category === catMatch;
        return (
          p.title.toLowerCase().includes(q) ||
          p.org.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
        );
      });
    }

    // 1b. Category Selection (Quick Filter)
    if (type === "internship" && selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      res = res.filter(p => {
        const title = (p.title || "").toLowerCase();
        const role = (p.role || "").toLowerCase();
        const tags = (p.tags || []).map(t => t.toLowerCase());
        const domain = (p.domain || "").toLowerCase();

        // Standard role matching
        if (role.includes(cat) || title.includes(cat) || tags.some(t => t.includes(cat))) return true;

        // Custom mappings for specific categories
        if (cat === "software development") {
          return role.includes("sde") || role.includes("software") || role.includes("full stack") || role.includes("backend") || role.includes("frontend") || title.includes("developer") || title.includes("engineer");
        }
        if (cat === "ui/ux design") {
          return role.includes("ui") || role.includes("ux") || role.includes("design") || title.includes("interface");
        }
        if (cat === "web development") {
          return role.includes("web") || role.includes("frontend") || role.includes("backend") || title.includes("web") || tags.includes("web");
        }
        if (cat === "mobile development") {
          return role.includes("mobile") || role.includes("android") || role.includes("ios") || role.includes("app") || title.includes("app");
        }
        if (cat === "hr") {
          return role.includes("hr") || role.includes("resource") || title.includes("human resource") || title.includes("talent");
        }
        if (cat === "finance") {
          return role.includes("finance") || role.includes("banking") || title.includes("finance") || title.includes("bank") || domain.includes("finance") || domain.includes("fintech");
        }
        if (cat === "cybersecurity") {
          return role.includes("security") || title.includes("security") || tags.includes("cyber");
        }
        if (cat === "research") {
          return role.includes("research") || title.includes("research") || tags.includes("research");
        }
        if (cat === "cloud engineering") {
          return role.includes("cloud") || role.includes("infra") || title.includes("cloud") || tags.includes("cloud");
        }
        if (cat === "product management") {
          return role.includes("product") || role.includes("pm") || title.includes("product") || tags.includes("pm");
        }
        if (cat === "digital marketing") {
          return role.includes("marketing") || title.includes("marketing") || tags.includes("digital");
        }
        return false;
      });
    }

    // Advanced filters
    if (type === "internship") {
      if (filters.type) res = res.filter(p => p.workType === filters.type);
      if (filters.location) res = res.filter(p => p.location === filters.location);
      if (filters.roles.length > 0) res = res.filter(p => filters.roles.some(r => p.role?.includes(r) || p.title.includes(r)));
    } else {
      if (filters.status) res = res.filter(p => p.status === filters.status);
      if (filters.eventType) res = res.filter(p => p.eventType === filters.eventType);
      if (filters.payment) res = res.filter(p => p.payment === filters.payment);
      if (filters.teamSize) res = res.filter(p => p.teamSize === filters.teamSize);
      if (filters.openToAll) res = res.filter(p => p.userType === "All" || (p.tags || []).includes("open"));
      if (filters.compLocation) res = res.filter(p => (p.compLocation || "").toLowerCase().includes(filters.compLocation.toLowerCase()));
      if (filters.compCategories?.length > 0) res = res.filter(p => filters.compCategories.some(cat => (p.compCategories || []).includes(cat) || (p.domain || "").toLowerCase().includes(cat.toLowerCase())));
      if (filters.userType) res = res.filter(p => !p.userType || p.userType === filters.userType || p.userType === "All");
      if (filters.compSkills?.length > 0) res = res.filter(p => filters.compSkills.some(skill => (p.compSkills || []).includes(skill) || (p.tags || []).some(t => t.toLowerCase().includes(skill.toLowerCase()))));
    }

    // 5. Sort (Applied to both)
    if (sortBy === "Latest") {
      res.sort((a, b) => new Date(b.datePosted || 0) - new Date(a.datePosted || 0));
    } else if (sortBy === "Alphabetical") {
      res.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "Relevant") {
      res.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
    }

    return res;
  }, [pool, query, searched, filters, sortBy, type, selectedCategory]);

  useEffect(() => {
    setResults(getFilteredResults());
  }, [getFilteredResults]);

  const doSearch = (customQuery = query) => {
    setSearched(true);
    addSearch(customQuery || query);
    setSuggestions([]);
  };

  const handleQueryChange = (val) => {
    setQuery(val);
    performSearch(val, pool);
  };

  const switchType = (t) => {
    setType(t);
    setQuery("");
    setFilters({
      type: null,
      location: null,
      roles: [],
      status: null,
      eventType: null,
      payment: null,
      teamSize: null,
      openToAll: false,
      compLocation: null,
      compCategories: [],
      userType: null,
      compSkills: []
    });
    setSelectedCategory(null);
    setSearched(false);
    setSuggestions([]);
  };

  const setStatus = async (id, status) => {
    const item = pool.find(p => p.id === id);
    if (!item) return;

    const newStatusData = { type, title: item.title, domain: item.domain || "General", status };

    // Update local state first to feel instantaneous
    setOpportunities(prev => {
      const existing = prev.find(o => o.title === item.title && o.type === type);
      addActivity(`Updated ${item.title} to "${status}"`);
      if (existing) return prev.map(o => (o.title === item.title && o.type === type) ? { ...o, status } : o);
      return [...prev, { ...newStatusData, id: item.id }]; // keep mock id locally for layout
    });

    if (backendOnline) {
      try {
        const existingFromServer = opportunities.find(o => o.title === item.title && o.type === type);
        if (existingFromServer && existingFromServer._id) {
          const res = await opportunitiesAPI.update(existingFromServer._id, { status });
          if (res.data?.opportunity) {
            setOpportunities(prev => prev.map(o =>
              (o._id === existingFromServer._id) ? { ...o, status: res.data.opportunity.status } : o
            ));
            console.log(`[Opportunities] Updated ${item.title} status to ${status} on server`);
          }
        } else {
          const res = await opportunitiesAPI.save(newStatusData);
          if (res.data?.opportunity) {
            setOpportunities(prev => {
              const updatedOpp = {
                _id: res.data.opportunity._id,
                id: res.data.opportunity._id,
                type: res.data.opportunity.type,
                title: res.data.opportunity.title,
                domain: res.data.opportunity.domain,
                status: res.data.opportunity.status
              };
              // Remove the optimistic mock-id version and add the real one
              const filtered = prev.filter(o => !(o.title === item.title && o.type === type && !o._id));
              return [...filtered, updatedOpp];
            });
            console.log(`[Opportunities] Saved ${item.title} to server with ID: ${res.data.opportunity._id}`);
          }
        }
      } catch (err) {
        console.error("Failed to sync opportunity status with server:", err);
      }
    }
  };

  const getStatus = (id) => {
    const item = pool.find(p => p.id === id);
    if (!item) return null;
    return opportunities.find(o => o.title === item.title && o.type === type)?.status || null;
  };
  const statuses = type === "competition" ? COMP_STATUSES : INTERN_STATUSES;

  const categoryColors = { hackathon: "badge-blue", coding: "badge-yellow", olympiad: "badge-green", data: "badge-blue", ai: "badge-blue", design: "badge-gray", business: "badge-gray" };
  const categoryLabels = {
    hackathon: <><Hammer size={12} /> Hackathon</>,
    coding: <><Code size={12} /> Coding</>,
    olympiad: <><Trophy size={12} /> Olympiad</>,
    data: <><Database size={12} /> Data Science</>,
    ai: <><Bot size={12} /> AI/ML</>,
    design: <><Palette size={12} /> Design</>,
    business: <><Briefcase size={12} /> Business</>
  };

  const activeFilterCount = type === "internship"
    ? (filters.type ? 1 : 0) + (filters.location ? 1 : 0) + (filters.roles.length > 0 ? 1 : 0)
    : (filters.status ? 1 : 0) + (filters.eventType ? 1 : 0) + (filters.payment ? 1 : 0) + (filters.teamSize ? 1 : 0) + (filters.openToAll ? 1 : 0) + (filters.compLocation ? 1 : 0) + (filters.compCategories?.length > 0 ? 1 : 0) + (filters.userType ? 1 : 0) + (filters.compSkills?.length > 0 ? 1 : 0);

  return (
    <div className="page" style={{ background: "#F8FAFC" }}>
      <div className="container section">
        <div className="section-header">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}><Activity size={18} style={{ marginRight: "6px" }} /> Opportunities</h1>
          <p className="text-muted" style={{ fontSize: "1rem" }}>Discover premium internships and competitions tailored for your career growth.</p>
        </div>

        <div className="flex-between mb-8" style={{ background: "white", padding: "16px 24px", borderRadius: "16px", boxShadow: "var(--shadow)", border: "1px solid var(--border-light)" }}>
          <div className="type-toggle tab-container">
            <button className={`type-btn${type === "competition" ? " active" : ""}`} onClick={() => switchType("competition")}>🏅 Competitions</button>
            <button className={`type-btn${type === "internship" ? " active" : ""}`} onClick={() => switchType("internship")}><Briefcase size={18} style={{ marginRight: "6px" }} /> Internships</button>
          </div>
        </div>

        <div className="card mb-8">
          <div className="card-body">
            <div className="search-bar" style={{ gap: 12 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input className="form-input" style={{ width: "100%", paddingLeft: 44, background: "#F9FAFB", border: "1px solid #E2E8F0" }}
                  placeholder={`Search for ${type}s (e.g. Google, AI, Web Dev...)`}
                  value={query} onChange={e => handleQueryChange(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && doSearch()} />
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}><Search size={18} /></span>
              </div>
              <button className="btn btn-primary" onClick={() => doSearch()}>Search</button>
            </div>

            {type === "internship" && (
              <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
            )}

            <div className="filter-bar" style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
              <button className={`btn btn-outline filter-main-btn${activeFilterCount > 0 ? " active" : ""}`} onClick={() => setShowAllFilters(true)} style={{ borderRadius: 12, padding: "0 20px", height: 44, display: "flex", alignItems: "center", gap: 8, fontWeight: 600, borderColor: "#E2E8F0" }}>
                <span><Settings size={18} style={{ marginRight: "6px" }} /></span> Filters {activeFilterCount > 0 && <span className="filter-count-pill">{activeFilterCount}</span>}
              </button>
              <div style={{ marginLeft: "auto", color: "#64748B", fontSize: "0.85rem", fontWeight: 500 }}>
                Sorted by: <span style={{ color: "var(--primary)", fontWeight: 700 }}>{sortBy}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="card-grid" style={{ gap: 24 }}>
          {results.length === 0 && (
            <div className="card text-center" style={{ gridColumn: "1 / -1", padding: "64px 24px" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔎</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>No matching opportunities</h3>
              <p className="text-muted">We couldn't find anything matching your current filters. Try adjusting them!</p>
              <button className="btn btn-outline mt-6" onClick={() => { setQuery(""); setFilters({ type: null, location: null, roles: [], status: null, eventType: null, payment: null, teamSize: null, openToAll: false }); setSearched(false); }}>Reset All Filters</button>
            </div>
          )}
          {results.map(opp => {
            const status = getStatus(opp.id);
            return (
              <div key={opp.id} className="opp-card card" style={{ display: "flex", flexDirection: "column", height: "auto", cursor: "pointer" }}>
                <div className="opp-card-header" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {type === "competition" && (
                      <span className={`badge ${categoryColors[opp.category] || "badge-gray"}`} style={{ padding: "4px 10px", borderRadius: 8 }}>
                        {categoryLabels[opp.category] || opp.category}
                      </span>
                    )}
                    <span className="badge badge-blue" style={{ padding: "4px 10px", borderRadius: 8 }}>{opp.domain}</span>
                  </div>
                  {status && <StatusBadge status={status} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    className="opp-title"
                    style={{ fontSize: "1.1rem", lineHeight: 1.4, marginBottom: 6, cursor: opp.url ? "pointer" : "default" }}
                    onClick={() => opp.url && window.open(opp.url, "_blank", "noopener,noreferrer")}
                    title={opp.url ? `Open ${opp.title}` : undefined}
                  >{opp.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>{opp.org}</span>
                    {opp.url && (
                      <a
                        href={opp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", border: "1px solid var(--primary)", borderRadius: 6, padding: "2px 8px", opacity: 0.85, whiteSpace: "nowrap" }}
                      >Visit Site →</a>
                    )}
                  </div>
                  <div className="opp-desc" style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "#64748B" }}>{opp.desc}</div>
                </div>

                <div className="opp-meta">
                  {type === "internship" ? (
                    <>
                      {opp.location && <div className="opp-meta-item"><MapPin size={14} style={{ marginRight: "4px" }} /> {opp.location}</div>}
                      {opp.workType && <div className="opp-meta-item"><Home size={14} style={{ marginRight: "4px" }} /> {opp.workType}</div>}
                      {opp.duration && <div className="opp-meta-item"><Clock size={14} style={{ marginRight: "4px" }} /> {opp.duration}</div>}
                      {opp.stipend && <div className="opp-meta-item" style={{ color: "var(--success)" }}><DollarSign size={14} style={{ marginRight: "4px" }} /> {opp.stipend}</div>}
                    </>
                  ) : (
                    <>
                      {opp.payment && <div className="opp-meta-item">🏛 {opp.payment}</div>}
                      {opp.teamSize && <div className="opp-meta-item">👥 Team: {opp.teamSize}</div>}
                    </>
                  )}
                </div>

                <div className="divider" style={{ margin: "16px 0" }} />
                <div className="form-group" onClick={e => e.stopPropagation()}>
                  <select className="form-input" style={{ borderRadius: 10, background: "#F8FAFC", fontSize: "0.85rem", fontWeight: 600 }} value={status || ""} onChange={e => setStatus(opp.id, e.target.value)}>
                    <option value="">Update Status</option>
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showAllFilters && (
        <AllFiltersModal
          type={type}
          onClose={() => setShowAllFilters(false)}
          filters={filters}
          setFilters={setFilters}
          apply={setFilters}
          currentSort={sortBy}
          setSort={setSortBy}
        />
      )}
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

        <div className="section-header"><h2 className="section-title"><CheckCircle2 size={18} style={{ marginRight: "6px" }} /> Completed Skills</h2></div>
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

        <div className="section-header"><h2 className="section-title"><Trophy size={18} style={{ marginRight: "6px" }} /> Participation History</h2></div>
        <div className="card-grid mb-6">
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}><Award size={18} style={{ marginRight: "6px" }} /> Competitions</h3>
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
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}><Briefcase size={18} style={{ marginRight: "6px" }} /> Internships</h3>
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

        <div className="section-header"><h2 className="section-title"><Search size={18} style={{ marginRight: "6px" }} /> Search History</h2></div>
        <div className="card mb-6">
          <div className="card-body">
            {searchHistory.length === 0 && <p className="text-muted text-sm">No searches yet.</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[...searchHistory].reverse().map((s, i) => (
                <span key={i} className="badge badge-gray" style={{ padding: "5px 12px" }}><Search size={18} style={{ marginRight: "6px" }} /> {s}</span>
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
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard({ user, onBack, backendOnline }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ overview: {}, users: [], searches: [], activity: [], traffic: [], trafficStats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // Attempt fetch regardless of initial health status
    setLoading(true);
    try {
      console.log("[AdminDashboard] Fetching admin data...");
      const [ov, us, se, ac, tr] = await Promise.all([
        adminAPI.getOverview(),
        adminAPI.getUsers(),
        adminAPI.getSearches(),
        adminAPI.getActivity(),
        adminAPI.getTraffic()
      ]);
      setData({
        overview: ov.data.data,
        users: us.data.users,
        searches: se.data.searches,
        activity: ac.data.logs,
        traffic: tr.data.traffic,
        trafficStats: tr.data.trafficStats || []
      });
      console.log("[AdminDashboard] Admin data loaded successfully");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("[AdminDashboard] Admin fetch error:", msg);
      setError("Failed to load admin analytics: " + msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res.data.success) {
        setData(prev => ({ ...prev, users: prev.users.filter(u => u._id !== userId) }));
        // Also update overview count
        setData(prev => ({
          ...prev,
          overview: { ...prev.overview, totalUsers: (prev.overview.totalUsers || 1) - 1 }
        }));
      }
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="page section text-center">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <button className="btn btn-primary mt-4" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Monitor size={18} /> },
    { id: 'users', label: 'User Records', icon: <Users size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'activity', label: 'Activity Logs', icon: <ClipboardList size={18} /> },
    { id: 'traffic', label: 'Traffic', icon: <Globe size={18} /> }
  ];

  return (
    <div className="page" style={{ background: "#F1F5F9" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="flex-between mb-8">
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.4rem", color: "#0F172A" }}>Admin Console</h1>
            <p className="text-muted">Monitor platform performance and user engagement</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-outline" onClick={fetchData}><RefreshCcw size={16} /> Refresh</button>
            <button className="btn btn-primary" onClick={onBack}>← Student View</button>
          </div>
        </div>

        <div className="admin-layout">
          <div className="admin-sidebar card">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-btn${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="admin-main">
            {error && (
              <div className="card mb-6" style={{ borderColor: "#FEE2E2", backgroundColor: "#FEF2F2", color: "#DC2626", padding: "12px 16px", borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <ShieldAlert size={20} />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}
            {loading ? (
              <div className="card section text-center">
                <p>Loading analytics data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="admin-tab-content">
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-val">{data.overview.totalUsers || 0}</div>
                        <div className="stat-label">Total Users</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-val">{data.overview.totalSearches || 0}</div>
                        <div className="stat-label">Total Searches</div>
                        <div className="text-xs text-muted mt-1">
                          S: {data.overview.searchBreakdown?.skill || 0} |
                          C: {data.overview.searchBreakdown?.competition || 0} |
                          I: {data.overview.searchBreakdown?.internship || 0}
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-val">{data.overview.totalLogins || 0}</div>
                        <div className="stat-label">Total Logins</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-val">{data.overview.totalSkills || 0}</div>
                        <div className="stat-label">Skills Tracked</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-val">{data.overview.totalInternships || 0}</div>
                        <div className="stat-label">Internships</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-val">{data.overview.totalCompetitions || 0}</div>
                        <div className="stat-label">Competitions</div>
                      </div>
                    </div>

                    <div className="card mt-8">
                      <div className="card-body">
                        <h3 className="mb-4">Platform Health</h3>
                        <div className="flex-between" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                          <span>Backend Status</span>
                          <span className="badge badge-green">Online</span>
                        </div>
                        <div className="flex-between" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                          <span>Database Sync</span>
                          <span className="badge badge-blue">Real-time</span>
                        </div>
                        <div className="flex-between" style={{ padding: "12px 0" }}>
                          <span>Data Retention</span>
                          <span className="text-muted text-sm">365 Days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="admin-tab-content">
                    <div className="card">
                      <div className="card-body">
                        <div className="admin-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Domain</th>
                                <th>Skill Level</th>
                                <th>Hours/Wk</th>
                                <th>Joined</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.users.map(u => (
                                <tr key={u._id}>
                                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                                  <td>{u.email}</td>
                                  <td><span className="badge badge-blue">{u.primaryDomain || u.domainOfInterest}</span></td>
                                  <td>{u.skillLevel}</td>
                                  <td>{u.learningHoursPerWeek}</td>
                                  <td className="text-muted text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                  <td style={{ textAlign: "right" }}>
                                    <button
                                      className="btn btn-sm btn-outline"
                                      style={{ color: "#EF4444", borderColor: "#FEE2E2", padding: "4px 8px" }}
                                      onClick={() => handleDeleteUser(u._id)}
                                      title="Delete User"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {activeTab === 'analytics' && (
                  <div className="admin-tab-content">
                    <div className="grid-2">
                      <div className="card">
                        <div className="card-body">
                          <h3>Recent Searches</h3>
                          <div className="mt-4">
                            {data.searches.slice(0, 10).map((s, i) => (
                              <div key={i} className="flex-between mb-4 pb-2" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{s.query}</div>
                                  <div className="text-xs text-muted">{s.userId?.name || 'Guest'} • {s.searchType}</div>
                                </div>
                                <span className="text-xs text-muted">{new Date(s.createdAt).toLocaleTimeString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body">
                          <h3>Domain Distribution</h3>
                          <div className="mt-8 admin-chart-container">
                            <div className="pie-chart-mock" style={{
                              background: data.overview.domainDistribution?.length > 0
                                ? `conic-gradient(${data.overview.domainDistribution.map((d, i, arr) => {
                                  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
                                  const total = arr.reduce((sum, curr) => sum + curr.count, 0);
                                  const startPercent = arr.slice(0, i).reduce((sum, curr) => sum + (curr.count / total) * 100, 0);
                                  const endPercent = startPercent + (d.count / total) * 100;
                                  return `${colors[i % colors.length]} ${startPercent}% ${endPercent}%`;
                                }).join(', ')})`
                                : 'var(--bg-section)'
                            }}></div>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-4 justify-center">
                            {data.overview.domainDistribution?.map((d, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <div style={{ width: 10, height: 10, borderRadius: '2px', background: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][i % 6] }}></div>
                                <span>{d._id}: {d.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="admin-tab-content">
                    <div className="card">
                      <div className="card-body">
                        <div className="timeline">
                          {data.activity.map((l, i) => (
                            <div key={i} className="timeline-item">
                              <div className="timeline-dot" />
                              <div className="timeline-content">
                                <div className="flex-between">
                                  <div className="timeline-title">{l.action} — {l.details}</div>
                                  <div className="timeline-time">{new Date(l.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="text-xs text-muted">{l.userId?.name || 'System'} ({l.userId?.email || 'N/A'})</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'traffic' && (
                  <div className="admin-tab-content">
                    <div className="card mb-8">
                      <div className="card-body">
                        <h3 className="mb-6">Daily User Engagement (Time Spent)</h3>
                        <div style={{ height: 250, padding: '20px 0' }}>
                          {data.trafficStats?.length > 1 ? (
                            <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              {(() => {
                                const stats = data.trafficStats.slice(-7);
                                const maxDur = Math.max(...stats.map(s => s.totalDuration || 0), 1);
                                const points = stats.map((s, i) => {
                                  const x = (i / (stats.length - 1)) * 800;
                                  const y = 200 - ((s.totalDuration || 0) / maxDur) * 180;
                                  return `${x},${y}`;
                                }).join(' ');

                                return (
                                  <>
                                    {/* Area under the line */}
                                    <polyline
                                      fill="url(#lineGrad)"
                                      points={`0,200 ${points} 800,200`}
                                    />
                                    {/* The line itself */}
                                    <polyline
                                      fill="none"
                                      stroke="var(--primary)"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      points={points}
                                    />
                                    {/* Data Dots */}
                                    {stats.map((s, i) => {
                                      const x = (i / (stats.length - 1)) * 800;
                                      const y = 200 - ((s.totalDuration || 0) / maxDur) * 180;
                                      return (
                                        <g key={i}>
                                          <circle cx={x} cy={y} r="5" fill="white" stroke="var(--primary)" strokeWidth="2" />
                                          <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--primary)">
                                            {Math.round((s.totalDuration || 0) / 60)}m
                                          </text>
                                          <text x={x} y={200} textAnchor="middle" fontSize="10" fill="var(--text-muted)" transform={`rotate(-30 ${x},205)`}>
                                            {s._id.split('-').slice(1).join('/')}
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </>
                                );
                              })()}
                            </svg>
                          ) : (
                            <div className="flex-center h-full text-muted">
                              <TrendingUp size={48} className="opacity-20 mb-4" />
                              <p>Insufficient data to generate trend line. (Need 2+ days)</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-8 pt-4 border-t border-dashed flex items-center justify-between text-xs text-muted">
                          <span>* Graph shows total minutes spent by all users daily.</span>
                          <span>Last 7 Days</span>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h3 className="mb-4">Real-time Traffic Feed</h3>
                        <div className="admin-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>User</th>
                                <th>Page</th>
                                <th>Route</th>
                                <th>Timestamp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.traffic.map((t, i) => (
                                <tr key={i}>
                                  <td>{t.userId?.name || 'Guest'}</td>
                                  <td><span className="badge badge-gray">{t.pageVisited}</span></td>
                                  <td className="text-sm code">{t.route}</td>
                                  <td className="text-muted text-sm">{new Date(t.createdAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
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
          <h1>My Profile</h1>
          <p className="text-muted">Manage your personal information and track your growth.</p>
        </div>

        <div className="profile-layout-grid">
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
    </div>
  );
}

// ==================== APP ROOT ====================

export default function App() {
  const [page, _setPage] = useState("welcome"); // Default to welcome for fresh startup

  const setPage = useCallback((p) => {
    setApiError(null);
    _setPage(p);
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setStoredUser(null);
    setLearningSkills([]);
    setOpportunities([]);
    setSearchHistory([]);
    setActivityLogs([]);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setPage("welcome");
  }, [setPage]);

  const handleLogin = useCallback((userData, token) => {
    setIsLoggedIn(true);
    if (userData) {
      console.log("Login User Data:", userData);
      setStoredUser(userData);
      localStorage.setItem("userId", userData._id);
      localStorage.setItem("user", JSON.stringify(userData));
      if (token) localStorage.setItem("token", token);

      if (userData.role === 'admin' || userData.email === 'anukritisrivastava810@gmail.com') {
        setPage("admin");
      } else if (userData.profileCompleted === false) {
        setPage("onboarding");
      } else {
        setPage("home");
      }
    } else {
      setPage("home");
    }
  }, [setPage]);

  // Initialize page and auth from localStorage on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{ }");
        setStoredUser(user);

        // Decide initial landing page
        if (user.role === 'admin' || user.email === 'anukritisrivastava810@gmail.com') {
          _setPage("admin");
        } else if (user.profileCompleted === false) {
          _setPage("onboarding");
        } else {
          _setPage("home");
        }
      } catch (e) {
        console.error("Local storage parse error:", e);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      _setPage("welcome");
    }
  }, [handleLogout]);
  const [apiError, setApiError] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [learningSkills, setLearningSkills] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [backendOnline, setBackendOnline] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [prevPage, setPrevPage] = useState("dashboard"); // Track previous page for Back button
  const trafficLogId = React.useRef(null);


  const checkBackend = useCallback(async (retries = 5) => {
    setBackendOnline(null); // Set to connecting state
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`[App] Checking backend (attempt ${i + 1}/${retries})...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased 8s timeout

        const res = await healthAPI.check({ signal: controller.signal });
        clearTimeout(timeoutId);

        console.log("[App] Health response:", res.data);

        if (res.data && res.data.status === "ok") {
          setBackendOnline(true);
          console.log("[App] Backend online confirmed");
          return true;
        }
      } catch (error) {
        console.warn(`[App] Backend check attempt ${i + 1} failed:`, error.message);
        if (i < retries - 1) {
          const delay = Math.min(Math.pow(2, i) * 1000, 10000); // 1s, 2s, 4s, 8s, max 10s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    console.error("[App] All health check attempts failed.");
    setBackendOnline(false);
    return false;
  }, []);

  // Check if backend is reachable on mount
  useEffect(() => {
    checkBackend(2); setTimeout(() => checkBackend(8), 500);
  }, [checkBackend, isLoggedIn]);

  // Load user data from backend when logged in
  useEffect(() => {
    if (!isLoggedIn) return; // Wait for login
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    console.log("[App] Fetching user sync data for:", userId);

    // Sync Profile First
    profileAPI.get()
      .then(r => {
        if (r.data && r.data.user) {
          const syncedUser = r.data.user;
          setStoredUser(syncedUser);
          localStorage.setItem("user", JSON.stringify(syncedUser));
          console.log("[App] Profile synced from server");

          // Check if onboarding is needed
          const isAdmin = syncedUser.role === 'admin' || syncedUser.email === 'anukritisrivastava810@gmail.com';
          if (!isAdmin && syncedUser.profileCompleted === false && page !== 'onboarding') {
            setPage('onboarding');
          }
        }
      })
      .catch((err) => {
        console.error("[App] Profile sync failed:", err.response?.data?.message || err.message);
        // Handle 401 Unauthorised or 404 User Not Found — clear stale session
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
          console.warn("[App] Auth invalid or user deleted. Redirecting to welcome.");
          handleLogout();
        }
      });

    // Load skills
    skillsAPI.getAll()
      .then(r => {
        if (r.data && r.data.skills) {
          const apiSkills = r.data.skills.map(s => ({
            _id: s._id,
            name: s.skillName,
            progress: s.progress,
            topics: s.topics.map(t => ({ name: t.name, done: t.completed })),
          }));
          setLearningSkills(apiSkills);
          console.log("[App] Skills synced from server");
        }
      })
      .catch((err) => {
        console.error("[App] Skills sync failed:", err.response?.data?.message || err.message);
      });

    // Load opportunities
    opportunitiesAPI.getAll()
      .then(r => {
        if (r.data && r.data.opportunities) {
          setOpportunities(r.data.opportunities.map(o => ({
            id: o._id,
            _id: o._id,
            type: o.type,
            title: o.title,
            domain: o.domain,
            status: o.status,
          })));
          console.log("[App] Opportunities synced from server");
        }
      })
      .catch((err) => {
        console.error("[App] Opportunities sync failed:", err.response?.data?.message || err.message);
      });

    // Load history
    historyAPI.get()
      .then(r => {
        if (r.data && r.data.history) {
          setSearchHistory(r.data.history.searchHistory || []);
          setActivityLogs((r.data.history.activityLogs || []).map(t => ({ text: t, time: "" })));
          console.log("[App] History synced from server");
        }
      })
      .catch((err) => {
        console.error("[App] History sync failed:", err.response?.data?.message || err.message);
      });
  }, [isLoggedIn, page, setPage, backendOnline]); // Added backendOnline dependency to trigger sync when connection established

  // ── Traffic Logging & Heartbeat ────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !backendOnline) return;

    const logVisit = async () => {
      try {
        const res = await trafficAPI.logVisit({
          userId: localStorage.getItem("userId"),
          pageVisited: page,
          route: `/${page}`
        });
        if (res.data.success) {
          trafficLogId.current = res.data.logId;
        }
      } catch (err) {
        console.error("Traffic log error:", err);
      }
    };

    logVisit();

    const interval = setInterval(async () => {
      if (trafficLogId.current) {
        try {
          await trafficAPI.logHeartbeat({ logId: trafficLogId.current, increment: 30 });
        } catch (err) {
          console.error("Heartbeat error:", err);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [page, isLoggedIn, backendOnline]);

  // ── Activity & Search (persisted to backend if online) ──────────
  const addActivity = useCallback((text) => {
    setActivityLogs(prev => [...prev, { text, time: "Just now" }]);
    if (backendOnline) {
      historyAPI.addActivity(text).catch((err) => {
        console.warn("[App] Failed to save activity to server:", err.message);
      });
    }
  }, [backendOnline]);

  const addSearch = useCallback((q) => {
    if (!q?.trim()) return;
    setSearchHistory(prev => [...prev.filter(s => s !== q), q]);
    if (backendOnline) {
      historyAPI.addSearch(q).catch((err) => {
        console.warn("[App] Failed to save search to server:", err.message);
      });
    }
  }, [backendOnline]);

  // ── Auth ────────────────────────────────────────────────────────




  const handleSaveUser = async (data) => {
    let finalUser = data;
    setIsLoading(true);

    try {
      let res;
      // Google users always have an _id already (created by googleAuth); use update path.
      // Manual new signup will have no _id.
      const isUpdate = !!data._id;

      if (isUpdate) {
        console.log("[App] Attempting profile update for:", data._id);
        res = await profileAPI.update(data);
        finalUser = res.data.user;
        console.log("[App] Profile updated successfully on server");
      } else {
        console.log("[App] Attempting signup for:", data.email);
        res = await authAPI.signup(data);
        finalUser = res.data.user;
        console.log("[App] Signup successful on server");
      }

      // Update state and storage on success
      setStoredUser(finalUser);
      localStorage.setItem("userId", finalUser._id);
      localStorage.setItem("user", JSON.stringify(finalUser));
      if (res.data.token) localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      setIsEditing(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      console.error("[App] Save failed:", errMsg);
      setApiError("Error: " + errMsg);
      // Stop here — do not redirect or log in with bad data
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }

    const userRole = finalUser?.role;
    const userEmail = finalUser?.email;
    if (userRole === 'admin' || userEmail === 'anukritisrivastava810@gmail.com') {
      setPage("admin");
    } else if (page === "welcome" || page === "signup" || page === "onboarding") {
      setPage("dashboard");
    }
  };

  // ── Skill sync helpers ───────────────────────────────────────────
  const setLearningSkillsWithSync = useCallback(async (updaterOrValue) => {
    setLearningSkills(prev => {
      const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;
      return next;
    });
  }, []);

  // ── Opportunity sync helpers ─────────────────────────────────────
  const setOpportunitiesWithSync = useCallback((updaterOrValue) => {
    setOpportunities(updaterOrValue);
  }, []);

  // ─── Traffic Tracking ───────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;

    // Internal Traffic Logging
    const logVisit = async () => {
      try {
        const userId = localStorage.getItem("userId");
        await trafficAPI.logVisit({
          userId,
          pageVisited: page.charAt(0).toUpperCase() + page.slice(1),
          route: `/${page}`
        });
      } catch (err) {
        console.error("Traffic log error:", err);
      }
    };

    logVisit();

    // GA4 Placeholder (Would typically use react-ga4)
    console.log(`[GA4] Page View: ${page}`);
  }, [page, backendOnline, isLoggedIn]);

  if (!isLoggedIn && page === "signup") {
    return (
      <>

        <SignUpPage
          existing={storedUser}
          onSave={handleSaveUser}
          onCancel={() => setPage("welcome")}
          onGoCareerOther={() => { setPrevPage("signup"); setPage("career-other"); }}
          backendOnline={backendOnline}
        />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <WelcomePage
        storedUser={storedUser}
        onLogin={handleLogin}
        onGoSignup={(googleData) => {
          if (googleData) setStoredUser(googleData);
          setPage("signup");
        }}
        backendOnline={backendOnline}
      />
    );
  }

  if (isEditing) {
    return (
      <>

        <Navbar page="profile" setPage={setPage} isLoggedIn={isLoggedIn} user={storedUser} />
        <SignUpPage existing={storedUser} onSave={handleSaveUser} onCancel={() => setIsEditing(false)} onGoCareerOther={() => { setIsEditing(false); setPrevPage("profile"); setPage("career-other"); }} backendOnline={backendOnline} />
      </>
    );
  }

  const navProps = { page, setPage, isLoggedIn, onLogout: handleLogout, user: storedUser };

  return (
    <>

      {backendOnline === null && (
        <div style={{ background: "#DBEAFE", borderBottom: "1px solid #3B82F6", padding: "8px 24px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8, position: "fixed", top: 68, left: 0, right: 0, zIndex: 1001, color: "#1E40AF" }}>
          🔄 <strong>Connecting to backend...</strong> Render may take a moment to wake up.
        </div>
      )}
      {backendOnline === false && (
        <div style={{ background: "#FEF3C7", borderBottom: "1px solid #F59E0B", padding: "8px 24px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 12, position: "fixed", top: 68, left: 0, right: 0, zIndex: 1001, color: "#92400E" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            ⚠️ <strong>Backend offline.</strong> Start the server for full persistence.
          </div>
          <button className="btn btn-primary" onClick={() => checkBackend(3)} style={{ padding: "4px 12px", height: "auto", fontSize: "0.75rem" }}>
            <RefreshCcw size={12} /> Retry Connection
          </button>
        </div>
      )}
      {apiError && (
        <div style={{ background: "#FEE2E2", borderBottom: "1px solid #EF4444", padding: "8px 24px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 12, position: "fixed", top: backendOnline === true ? 0 : 100, left: 0, right: 0, zIndex: 1002, color: "#991B1B" }}>
          <div style={{ flex: 1 }}>⚠️ <strong>Error:</strong> {apiError}</div>
          <button onClick={() => setApiError(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}>✕</button>
        </div>
      )}
      <Navbar {...navProps} />
      {page === "onboarding" && <SignUpPage existing={storedUser} onSave={handleSaveUser} onGoCareerOther={() => { setPrevPage("onboarding"); setPage("career-other"); }} />}
      {page === "home" && <HomePage user={storedUser} />}
      {page === "dashboard" && <DashboardPage user={storedUser} learningSkills={learningSkills} opportunities={opportunities} setPage={setPage} setPrevPage={setPrevPage} />}
      {page === "admin" && (
        <AdminDashboard
          user={storedUser}
          onBack={() => setPage("home")}
          backendOnline={backendOnline}
        />
      )}
      {page?.startsWith("domain-detail") && (
        <DomainDetailPage
          domain={page.includes(":") ? page.split(":")[1] : (storedUser?.primaryDomain || "Web Development")}
          onBack={() => setPage(prevPage || "dashboard")}
          backendOnline={backendOnline}
        />
      )}
      {page === "career-guide" && (
        <CareerGuidePage
          user={storedUser}
          learningSkills={learningSkills}
          onBack={() => setPage("dashboard")}
          backendOnline={backendOnline}
        />
      )}
      {page === "career-other" && (
        <CareerOther
          onSelectGoal={(goal) => {
            const match = findCareerMatch(goal);
            if (match) {
              if (match.route === "domain-detail") setPage("domain-detail:" + match.title);
              else setPage(match.route);
            } else {
              setPage("career-search:" + goal);
            }
          }}
          onBack={() => setPage(prevPage || "dashboard")}
        />
      )}
      {page?.startsWith("career-search:") && (
        <CareerSearchResult
          query={page.replace("career-search:", "")}
          onBack={() => setPage("career-other")}
        />
      )}
      {page === "decision" && <DecisionPage learningSkills={learningSkills} setLearningSkills={setLearningSkillsWithSync} addActivity={addActivity} addSearch={addSearch} backendOnline={backendOnline} />}

      {page === "opportunities" && <OpportunitiesPage opportunities={opportunities} setOpportunities={setOpportunitiesWithSync} addActivity={addActivity} addSearch={addSearch} backendOnline={backendOnline} />}
      {page === "history" && <HistoryPage learningSkills={learningSkills} opportunities={opportunities} searchHistory={searchHistory} activityLogs={activityLogs} />}
      {page === "profile" && <ProfilePage user={storedUser} learningSkills={learningSkills} onEdit={() => setIsEditing(true)} onLogout={handleLogout} />}
      <Footer />
    </>
  );
}
