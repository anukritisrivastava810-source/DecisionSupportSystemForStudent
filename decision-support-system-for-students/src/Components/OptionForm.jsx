import { useState } from "react";

const defaultOption = {
  name: "",
  interest: 5,
  career: 5,
  time: 5,
};

export default function OptionForm({ onAddOption }) {
  const [form, setForm] = useState(defaultOption);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Option name cannot be empty.");
      return;
    }
    setError("");
    onAddOption({ ...form, id: Date.now() });
    setForm(defaultOption);
  };

  const fields = [
    { label: "Interest", name: "interest", hint: "How much do you enjoy this?" },
    { label: "Career Relevance", name: "career", hint: "How relevant is this to your career goals?" },
    { label: "Time Required", name: "time", hint: "How time-intensive is this? (lower = better)" },
  ];

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="card-icon">＋</span> Add Option
      </h2>
      <form onSubmit={handleSubmit} className="option-form">
        <div className="form-group">
          <label htmlFor="name">Option Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Machine Learning, React Internship..."
            className="text-input"
          />
          {error && <span className="error-msg">{error}</span>}
        </div>

        <div className="slider-grid">
          {fields.map(({ label, name, hint }) => (
            <div className="form-group" key={name}>
              <div className="slider-label-row">
                <label htmlFor={name}>{label}</label>
                <span className="slider-value">{form[name]}</span>
              </div>
              <input
                id={name}
                name={name}
                type="range"
                min="1"
                max="10"
                value={form[name]}
                onChange={handleChange}
                className="slider"
              />
              <span className="slider-hint">{hint}</span>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          Add Option
        </button>
      </form>
    </div>
  );
}
