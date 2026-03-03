import { LEVELS } from "../utils/constants";

function LevelSelect({ onSelect, onBack }) {
  return (
    <div className="screen level-screen">
      <h2 className="screen-title">Select Difficulty</h2>
      <div className="level-grid">
        {Object.entries(LEVELS).map(([key, level]) => (
          <button
            key={key}
            className="level-card"
            style={{ "--level-color": level.color }}
            onClick={() => onSelect(key)}
          >
            <span className="level-icon">{level.icon}</span>
            <h3 className="level-name">{level.name}</h3>
            <div className="level-stats">
              <span className="stat">
                <span className="stat-label">Speed</span>
                <span className="stat-value">{level.speed}</span>
              </span>
              <span className="stat">
                <span className="stat-label">Walls</span>
                <span className="stat-value">{level.obstacles || "—"}</span>
              </span>
            </div>
            <p className="level-desc">{level.description}</p>
          </button>
        ))}
      </div>
      <button className="btn btn-back" onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

export default LevelSelect;
