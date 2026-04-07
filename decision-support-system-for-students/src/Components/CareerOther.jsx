import React, { useState } from 'react';
import { Search, ChevronRight, Target, ChevronLeft } from 'lucide-react';
import { CAREER_GOAL_MAP } from '../utils/careerGoalMatcher';

/**
 * CareerOtherPage component
 * Provides a search interface and a list of predefined career goals.
 * Uses smart matching to navigate to existing app routes.
 */
function CareerOther({ onSearch, onSelectGoal, onBack }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch(q);
  };

  return (
    <div className="career-other-page fade-in">
      <div className="container py-5">
        <button
          className="btn btn-outline-secondary btn-sm mb-4 rounded-pill d-inline-flex align-items-center gap-2"
          onClick={onBack}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="search-hero-container text-center mb-5 mt-2">
          <div className="search-icon-wrapper mx-auto mb-3 shadow-sm">
            <Search size={32} className="text-primary" />
          </div>
          <h1 className="display-6 fw-bold mb-2">Discover Your Future</h1>
          <p className="text-secondary mx-auto" style={{ maxWidth: '500px' }}>
            Enter a career path or skill to see a tailored roadmap, required skills, and market insights.
          </p>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-container-premium p-2 glass-morphism rounded-pill shadow-lg mb-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <Search size={20} className="text-muted" />
              </span>
              <input
                id="career-other-search-input"
                className="form-control border-0 bg-transparent py-3"
                type="text"
                placeholder="Try 'Blockchain Dev', 'Robotics', or 'UI Designer'..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button
                id="career-other-search-btn"
                type="submit"
                className="btn btn-primary rounded-pill px-4 ms-2"
              >
                Search
              </button>
            </div>
          </form>

          {/* Predefined Goals Section */}
          <div className="goals-section">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="bg-soft-primary p-2 rounded-3">
                <Target size={18} className="text-primary" />
              </div>
              <h5 className="fw-bold mb-0">Popular Career Goals</h5>
            </div>

            <div className="goals-grid">
              {CAREER_GOAL_MAP.map((item, i) => (
                <button
                  key={item.title}
                  id={`career-goal-option-${i}`}
                  onClick={() => onSelectGoal(item.title)}
                  className="goal-chip d-flex align-items-center justify-content-between p-3"
                >
                  <span className="fw-medium">{item.title}</span>
                  <ChevronRight size={14} className="text-primary" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .career-other-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }
        .search-icon-wrapper {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-container-premium {
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .search-container-premium:focus-within {
          box-shadow: 0 10px 30px -10px rgba(var(--primary-rgb), 0.2);
          border-color: var(--primary-color);
        }
        .search-container-premium input:focus {
          box-shadow: none;
        }
        
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .goal-chip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }
        .goal-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: var(--primary-color);
        }
        
        .bg-soft-primary { background: rgba(var(--primary-rgb), 0.1); }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 576px) {
          .goals-grid {
            grid-template-columns: 1fr;
          }
          .display-6 {
            font-size: 1.8rem;
          }
          .search-hero-container p {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CareerOther;
