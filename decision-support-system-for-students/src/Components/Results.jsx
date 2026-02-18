export default function Results({ rankedOptions, onRemoveOption }) {
  if (rankedOptions.length === 0) {
    return (
      <div className="card results-empty">
        <h2 className="card-title">
          <span className="card-icon">📊</span> Results
        </h2>
        <p className="empty-msg">Add options above to see your ranked results here.</p>
      </div>
    );
  }

  const maxScore = rankedOptions[0]?.score || 1;

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="card-icon">📊</span> Ranked Results
      </h2>
      <p className="card-subtitle">{rankedOptions.length} option{rankedOptions.length !== 1 ? "s" : ""} evaluated</p>

      <ol className="results-list">
        {rankedOptions.map((option) => {
          const isTop = option.rank === 1;
          const barWidth = ((option.score / maxScore) * 100).toFixed(1);

          return (
            <li key={option.id} className={`result-item ${isTop ? "result-top" : ""}`}>
              <div className="result-header">
                <div className="result-left">
                  <span className={`rank-badge ${isTop ? "rank-top" : ""}`}>
                    {isTop ? "★" : `#${option.rank}`}
                  </span>
                  <div className="result-info">
                    <span className="result-name">{option.name}</span>
                    {isTop && <span className="top-label">Top Pick</span>}
                  </div>
                </div>
                <div className="result-right">
                  <span className="result-score">{option.score}</span>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveOption(option.id)}
                    title="Remove option"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="score-bar-track">
                <div
                  className={`score-bar-fill ${isTop ? "score-bar-top" : ""}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
