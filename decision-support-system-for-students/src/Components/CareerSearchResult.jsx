import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Layers, 
  TrendingUp, 
  BookOpen, 
  ChevronLeft,
  Search,
  CheckCircle2,
  Users
} from 'lucide-react';
import { careerSearchAPI } from '../services/api';

/**
 * CareerSearchResult Component
 * Displays dynamic, structured information based on the search query.
 */
const CareerSearchResult = ({ query, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await careerSearchAPI.search(query);
        if (response.data && response.data.success) {
          setContent(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Career search API failed:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-100 p-4">
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="mt-4 text-muted animate-pulse">Consulting expert database for "{query}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-100 p-4 text-center">
        <h3 className="fw-bold mb-3">Something went wrong</h3>
        <p className="text-secondary mb-4">We couldn't retrieve information for this career search right now.</p>
        <button className="btn btn-primary rounded-pill px-4" onClick={onBack}>
          Try Another Search
        </button>
      </div>
    );
  }

  if (!content || (content.success === false)) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-100 p-4 text-center fade-in">
        <div className="bg-soft-warning p-4 rounded-circle mb-4">
          <Search size={48} className="text-warning" />
        </div>
        <h3 className="fw-bold mb-2">No results for "{query}"</h3>
        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '400px' }}>
          We couldn't find a career path that matches your search. Try searching for a different role or skill.
        </p>
        <button className="btn btn-primary rounded-pill px-4" onClick={onBack}>
          Return to Search
        </button>
      </div>
    );
  }

  return (
    <div className="career-result-page fade-in">
      <header className="career-header py-3 mb-4 border-bottom glass-morphism sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <button className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2" onClick={onBack}>
            <ChevronLeft size={16} /> <span className="d-none d-sm-inline">Back to Search</span>
          </button>
          <div className="header-title-container text-center">
            <h2 className="mb-0 gradient-text-primary h5 fw-bold">{content.title}</h2>
            <span className="badge bg-soft-primary text-primary rounded-pill" style={{ fontSize: '0.7rem' }}>{content.domain}</span>
          </div>
          <div className="search-pill d-none d-md-flex align-items-center gap-2 border rounded-pill px-3 py-1 text-muted small bg-white shadow-sm">
            <Search size={12} /> {query}
          </div>
        </div>
      </header>

      <div className="container pb-5">
        <div className="row g-4">
          {/* Overview Section */}
          <div className="col-12 col-lg-8">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="icon-box bg-soft-info p-2 rounded-3 text-info">
                    <BookOpen size={20} />
                  </div>
                  <h5 className="mb-0 fw-bold">Overview</h5>
                </div>
                <p className="text-secondary leading-relaxed mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                  {content.overview}
                </p>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="col-12 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 bg-dark text-white p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="icon-box bg-primary p-2 rounded-3">
                  <TrendingUp size={20} />
                </div>
                <h5 className="mb-0 fw-bold">Market Scope</h5>
              </div>
              <div className="scope-items">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <span className="text-secondary-light small font-medium">Market Demand</span>
                  <span className="badge bg-success rounded-pill px-3 py-2">{content.scope.demand}</span>
                </div>
                <div className="mb-4">
                  <p className="small mb-2 text-secondary-light">Growth Trend</p>
                  <p className="mb-0 fw-medium h6 text-white">{content.scope.growth}</p>
                </div>
                <hr className="border-secondary opacity-25" />
                <div className="mt-4">
                  <p className="small mb-2 text-secondary-light">Career Trajectory</p>
                  <div className="progress rounded-pill bg-secondary bg-opacity-25" style={{ height: '8px' }}>
                    <div className="progress-bar rounded-pill bg-primary progress-bar-striped progress-bar-animated" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <div className="row">
                <div className="col-md-6 border-end-md">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="icon-box bg-soft-warning p-2 rounded-3 text-warning">
                      <Layers size={20} />
                    </div>
                    <h5 className="mb-0 fw-bold">Hard Skills</h5>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {content.skills.technical.map((skill, idx) => (
                      <span key={idx} className="skill-pill-light d-flex align-items-center gap-2">
                        <CheckCircle2 size={12} className="text-success" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-md-6 ps-md-4 mt-4 mt-md-0">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="icon-box bg-soft-success p-2 rounded-3 text-success">
                      <Users size={20} />
                    </div>
                    <h5 className="mb-0 fw-bold">Soft Skills</h5>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {content.skills.soft.map((skill, idx) => (
                      <span key={idx} className="skill-pill-light d-flex align-items-center gap-2">
                        <CheckCircle2 size={12} className="text-success" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Steps */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-5">
                <div className="icon-box bg-soft-primary p-2 rounded-3 text-primary">
                  <Target size={20} />
                </div>
                <h5 className="mb-0 fw-bold">Learning Roadmap</h5>
              </div>
              
              <div className="roadmap-stepper position-relative ps-md-5">
                <div className="stepper-line" style={{ left: '23px' }}></div>
                {content.path.map((item, idx) => (
                  <div key={idx} className="stepper-item position-relative mb-5 last-child-mb-0 d-flex">
                    <div className="step-marker-container" style={{ width: '40px', flexShrink: 0 }}>
                      <div className="step-marker rounded-circle shadow-sm border border-2 border-white" style={{ left: '0', position: 'relative' }}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="ms-4">
                      <h6 className="fw-bold mb-1 h5">{item.step}</h6>
                      <p className="text-secondary mb-0 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA / Next Steps */}
          <div className="col-12">
            <div className="next-steps-banner rounded-4 p-5 text-center shadow-lg border-0 position-relative overflow-hidden" 
                 style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: 'white' }}>
              <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ background: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
              <div className="position-relative z-1">
                <h3 className="fw-bold mb-3 text-white">Ready to start your {content.title} journey?</h3>
                <p className="text-white opacity-75 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                  Explore highly rated courses, open internships, and upcoming competitions specifically curated for aspiring {content.title}s.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="btn btn-white bg-white text-primary rounded-pill px-5 py-2 fw-bold" onClick={() => onBack()}>
                    Explore Feed
                  </button>
                  <button className="btn btn-outline-light rounded-pill px-5 py-2 fw-bold">
                    Save Pathway
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .career-result-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }
        .bg-soft-primary { background: rgba(37, 99, 235, 0.1); }
        .bg-soft-info { background: rgba(13, 202, 240, 0.1); }
        .bg-soft-warning { background: rgba(255, 193, 7, 0.1); }
        .bg-soft-success { background: rgba(25, 135, 84, 0.1); }
        
        .skill-pill-light {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #475569;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .skill-pill-light:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235,0.08);
          transform: translateY(-2px);
        }

        .stepper-line {
          position: absolute;
          top: 0;
          bottom: 20px;
          width: 3px;
          background: #e2e8f0;
          z-index: 1;
        }
        .step-marker {
          width: 32px;
          height: 32px;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: bold;
          z-index: 2;
        }
        
        .text-secondary-light { color: #cbd5e1; }
        .opacity-10 { opacity: 0.1; }
        .z-1 { z-index: 1; }
        
        @media (min-width: 768px) {
          .border-end-md { border-right: 1px solid #e2e8f0; }
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .last-child-mb-0:last-child {
          margin-bottom: 0 !important;
        }
        .leading-relaxed {
          line-height: 1.625;
        }
      `}</style>
    </div>
  );
};

export default CareerSearchResult;
