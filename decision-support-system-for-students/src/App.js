import { useState } from "react";
import OptionForm from "./Components/OptionForm";
import WeightConfig from "./Components/WeightConfig";
import Results from "./Components/Results";
import { evaluateOptions } from "./utils/decisionEngine";
import "./App.css";

const defaultWeights = {
  interestWeight: 4,
  careerWeight: 4,
  timeWeight: 2,
};

export default function App() {
  const [options, setOptions] = useState([]);
  const [weights, setWeights] = useState(defaultWeights);

  const handleAddOption = (option) => {
    setOptions((prev) => [...prev, option]);
  };

  const handleRemoveOption = (id) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleWeightChange = (name, value) => {
    setWeights((prev) => ({ ...prev, [name]: value }));
  };

  const rankedOptions = evaluateOptions(options, weights);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-badge">DSS</div>
          <div>
            <h1 className="app-title">Student Decision Support System</h1>
            <p className="app-desc">
              Evaluate your options using weighted scoring to make smarter academic choices.
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="layout-left">
          <OptionForm onAddOption={handleAddOption} />
          <WeightConfig weights={weights} onWeightChange={handleWeightChange} />
        </div>
        <div className="layout-right">
          <Results rankedOptions={rankedOptions} onRemoveOption={handleRemoveOption} />
        </div>
      </main>

      <footer className="app-footer">
        Score = (Interest × W₁) + (Career × W₂) + ((10 − Time) × W₃)
      </footer>
    </div>
  );
}
