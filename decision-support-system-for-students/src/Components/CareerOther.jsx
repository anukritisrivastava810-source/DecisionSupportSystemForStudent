import React from 'react';
import { ChevronRight, Layout, ChevronLeft, ArrowRight, Code, Cpu, Shield, Globe, Briefcase, Zap, Rocket } from 'lucide-react';
import { DOMAIN_EXPLORATION_MAP } from '../utils/careerGoalMatcher';

/**
 * CareerOther Component (Revamped for Domain discovery)
 * Provides a highly polished discovery experience similar to Opportunities section.
 */
function CareerOther({ onSelectGoal, onBack }) {


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
          {/* External Career Explorer Link */}
          <div className="card mb-12 text-center" style={{ border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", borderRadius: 24, overflow: "hidden" }}>
            <div className="card-body" style={{ padding: "48px 32px" }}>
              <p style={{ fontSize: "1.1rem", color: "#64748B", marginBottom: "24px", fontWeight: 500 }}>
                Not sure which domain to choose? Explore detailed career insights on a trusted platform.
              </p>
              <button 
                onClick={() => window.open("https://www.careerexplorer.com/careers/", "_blank")}
                className="btn btn-primary d-inline-flex align-items-center gap-2" 
                style={{ padding: "0 40px", height: 56, borderRadius: 14, fontWeight: 700, fontSize: "1.1rem" }}
              >
                Explore Careers in Detail <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Domain Cards Grid */}
          <div className="goals-section">
            <div className="d-flex align-items-center justify-content-between mb-8 px-2">
              <h3 style={{ fontWeight: 800, color: "#0F172A", margin: 0, fontSize: "1.5rem" }}>Professional Domains</h3>
              <span className="badge badge-blue" style={{ padding: "6px 12px", borderRadius: 8 }}>{DOMAIN_EXPLORATION_MAP.length} paths available</span>
            </div>

            <div className="card-grid mobile-grid-2" style={{ gap: 24 }}>
              {DOMAIN_EXPLORATION_MAP.map((item, i) => (
                <div 
                  key={item.title}
                  id={`domain-option-${i}`}
                  onClick={() => onSelectGoal(item.title)}
                  className="domain-card card"
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    cursor: "pointer",
                    height: "100%"
                  }}
                  onMouseEnter={e => e.currentTarget.classList.add('hover')}
                  onMouseLeave={e => e.currentTarget.classList.remove('hover')}
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
