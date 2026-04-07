import React, { useState } from 'react';
import { Search, ChevronRight, Target } from 'lucide-react';
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
    <div className="page">
      <div className="container section">
        <button
          className="btn btn-outline mb-6"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          onClick={onBack}
        >
          ← Back
        </button>

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="text-center mb-6">
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginBottom: 8 }}>
              <Search size={24} style={{ marginRight: 10, verticalAlign: "middle", color: "var(--primary)" }} />
              Find Your Career Goal
            </h1>
            <p className="text-muted">Search for any career path or pick from the list below.</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 36 }}>
            <input
              id="career-other-search-input"
              className="form-input"
              type="text"
              placeholder="e.g. DevOps Engineer, Data Analyst, Blockchain…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              id="career-other-search-btn"
              type="submit"
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap" }}
            >
              <Search size={16} style={{ marginRight: 6 }} />
              Search
            </button>
          </form>

          {/* Predefined Goals List */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: "1rem" }}>
                <Target size={16} style={{ marginRight: 8, verticalAlign: "middle", color: "var(--primary)" }} />
                Choose a Predefined Goal
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {CAREER_GOAL_MAP.map((item, i) => (
                  <button
                    key={item.title}
                    id={`career-goal-option-${i}`}
                    onClick={() => onSelectGoal(item.title)}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      padding: "12px 8px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-section)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <ChevronRight size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerOther;
