import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';

const ExploreCareers = ({ onBack }) => {
  const handleExplore = () => {
    window.open("https://roadmap.sh", "_blank");
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="card">
            <div className="card-body" style={{ padding: "40px 20px" }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                background: "var(--primary-100)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                margin: "0 auto 24px",
                color: "var(--primary)"
              }}>
                <Globe size={40} />
              </div>
              
              <h1 className="section-title" style={{ marginBottom: 16 }}>
                Explore Career Paths Beyond Defined Domains
              </h1>
              
              <p className="section-sub" style={{ margin: "0 auto 40px", fontSize: "1.1rem" }}>
                Not sure where to start? Discover curated career roadmaps and opportunities to help you find your professional calling.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={handleExplore}
                  style={{ minWidth: 280, boxShadow: "var(--shadow-lg)" }}
                >
                  Explore Career Options <ArrowRight size={20} style={{ marginLeft: 8 }} />
                </button>
                
                <button 
                  className="btn btn-outline" 
                  onClick={onBack}
                  style={{ minWidth: 200 }}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 40, color: "var(--text-muted)", fontSize: "0.9rem" }}>
            <p>We're constantly expanding our specific domain guides.</p>
            <p>Check back later to see if your chosen path has been added!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCareers;
