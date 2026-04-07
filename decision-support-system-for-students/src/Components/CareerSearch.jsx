import React from 'react';
import { Search } from 'lucide-react';

/**
 * CareerSearch component
 * Simple placeholder results page for custom career searches.
 */
function CareerSearch({ query, onBack }) {
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
          <div className="card text-center" style={{ padding: "60px 24px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>
              <Search size={56} style={{ color: "var(--primary)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 8 }}>
              Results for "{query}"
            </h2>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              Smart matching coming soon. For now, browse predefined goals or update your profile.
            </p>
            <button className="btn btn-primary" onClick={onBack}>
              ← Search Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerSearch;
