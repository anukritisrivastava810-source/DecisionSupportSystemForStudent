export default function WeightConfig({ weights, onWeightChange }) {
  const fields = [
    { label: "Interest Weight", name: "interestWeight", color: "var(--accent-blue)" },
    { label: "Career Weight", name: "careerWeight", color: "var(--accent-green)" },
    { label: "Time Weight", name: "timeWeight", color: "var(--accent-orange)" },
  ];

  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="card-icon">⚖</span> Weight Configuration
      </h2>
      <p className="card-subtitle">
        Adjust how much each factor influences the final score.
      </p>

      <div className="weight-fields">
        {fields.map(({ label, name, color }) => (
          <div className="form-group" key={name}>
            <div className="slider-label-row">
              <label htmlFor={name} style={{ color }}>
                {label}
              </label>
              <span className="slider-value" style={{ color }}>
                {weights[name]}
              </span>
            </div>
            <input
              id={name}
              type="range"
              min="0"
              max="10"
              value={weights[name]}
              onChange={(e) => onWeightChange(name, Number(e.target.value))}
              className="slider"
              style={{ "--thumb-color": color }}
            />
          </div>
        ))}
      </div>

      <div className="weight-total">
        <span>Total Weight</span>
        <span className="total-badge">{total}</span>
      </div>
    </div>
  );
}
