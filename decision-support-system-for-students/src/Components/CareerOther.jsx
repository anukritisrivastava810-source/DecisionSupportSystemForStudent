import React, { useState } from 'react';
import { Search, ChevronRight, Layout, ChevronLeft, ArrowRight, Code, Cpu, Shield, Globe, Briefcase, Zap, Rocket } from 'lucide-react';
import { DOMAIN_EXPLORATION_MAP } from '../utils/careerGoalMatcher';

/**
 * CareerOther Component (Revamped for Domain discovery)
 * Provides a highly polished discovery experience similar to Opportunities section.
 */
function CareerOther({ onSearch, onSelectGoal, onBack }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch(q);
  };

  const getDomainIcon = (title) => {
    if (title.includes("Web")) return <Globe size={24} />;
    if (title.includes("App")) return <Zap size={24} />;
    if (title.includes("Data")) return <Layout size={24} />;
    if (title.includes("AI")) return <Cpu size={24} />;
    if (title.includes("Cyber")) return <Shield size={24} />;
    if (title.includes("UI")) return <Zap size={24} />;
    if (title.includes("Cloud")) return <Globe size={24} />;
    if (title.includes("Product")) return <Briefcase size={24} />;
    if (title.includes("Entre")) return <Rocket size={24} />;
    return <Code size={24} />;
  };

  return (
    <div className="page career-other-page fade-in" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div style={{ paddingTop: "2rem", marginBottom: "2rem" }}>
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-2"
            onClick={onBack}
            style={{ padding: "8px 16px", fontWeight: 600, border: "1.5px solid #E2E8F0" }}
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
        </div>

        <div className="search-hero-container text-center mb-12 animate-slide-up" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)", 
            fontWeight: 800, 
            color: "#0F172A", 
            marginBottom: 16,
            lineHeight: 1.25,
            maxWidth: "800px"
          }}>
            Explore Your Next Big Path
          </h1>
          <p className="text-muted" style={{ maxWidth: '640px', fontSize: "1.1rem", lineHeight: 1.6, margin: "0 auto" }}>
            Discover roadmaps, expert-curated skills, and premium opportunities tailored to your professional interests.
          </p>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Opportunities-style Search Bar */}
          <div className="card mb-12" style={{ border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", borderRadius: 24, overflow: "hidden" }}>
            <div className="card-body" style={{ padding: 32 }}>
              <form onSubmit={handleSearch} className="search-bar d-flex gap-3">
                <div style={{ flex: 1, position: "relative" }}>
                  <input 
                    className="form-input" 
                    style={{ width: "100%", paddingLeft: 48, borderRadius: 12, border: "1.5px solid #E2E8F0", height: 52, fontSize: "1rem" }}
                    placeholder="Search for domains (e.g. Blockchain, DevOps, UI Designer...)"
                    value={query} 
                    onChange={e => setQuery(e.target.value)} 
                  />
                  <span style={{ position: "absolute", left: 16, top: 15, opacity: 0.5 }}>
                    <Search size={22} className="text-primary" />
                  </span>
                </div>
                <button 
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2" 
                  style={{ padding: "0 32px", height: 52, borderRadius: 12, fontWeight: 700 }}
                >
                  Search Path <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Domain Cards Grid */}
          <div className="goals-section">
            <div className="d-flex align-items-center justify-content-between mb-8 px-2">
              <h3 style={{ fontWeight: 800, color: "#0F172A", margin: 0, fontSize: "1.5rem" }}>Professional Domains</h3>
              <span className="badge badge-blue" style={{ padding: "6px 12px", borderRadius: 8 }}>{DOMAIN_EXPLORATION_MAP.length} paths available</span>
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {DOMAIN_EXPLORATION_MAP.map((item, i) => (
                <div 
                  key={item.title}
                  id={`domain-option-${i}`}
                  onClick={() => onSelectGoal(item.title)}
                  className="domain-card"
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    padding: 32, 
                    background: "white",
                    borderRadius: 24, 
                    border: "1.5px solid #F1F5F9",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)";
                    e.currentTarget.style.borderColor = "#F1F5F9";
                  }}
                >
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    background: "rgba(37, 99, 235, 0.08)", 
                    color: "var(--primary)", 
                    borderRadius: 16, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: 24
                  }}>
                    {getDomainIcon(item.title)}
                  </div>
                  <h4 style={{ fontWeight: 800, marginBottom: 12, color: "#0F172A", fontSize: "1.2rem" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
                    Learn foundational concepts, master industry tools, and explore high-demand roles in {item.title}.
                  </p>
                  <div className="mt-auto d-flex align-items-center text-primary" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    Explore Roadmap <ChevronRight size={16} className="ms-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .domain-card:active {
          transform: scale(0.98) !important;
        }
      `}</style>
    </div>
  );
}

export default CareerOther;
