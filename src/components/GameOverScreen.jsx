import { LEVELS } from "../utils/constants";

function GameOverScreen({ score, level, onRestart, onHome }) {
  const highScore = parseInt(
    localStorage.getItem(`snake_hs_${level}`) || "0",
    10,
  );
  const isNewHighScore = score >= highScore && score > 0;
  const levelInfo = LEVELS[level];

  return (
    <div className="screen gameover-screen">
      <div className="gameover-icon">💀</div>
      <h1 className="gameover-title">GAME OVER</h1>

      {isNewHighScore && (
        <div className="new-highscore-badge">
          <span>🏆</span> New High Score!
        </div>
      )}

      <div className="score-card">
        <div className="score-card-item">
          <span className="sc-label">Score</span>
          <span className="sc-value">{score}</span>
        </div>
        <div className="score-card-divider" />
        <div className="score-card-item">
          <span className="sc-label">Best</span>
          <span className="sc-value gold">{highScore}</span>
        </div>
      </div>

      <div className="level-badge" style={{ "--level-color": levelInfo.color }}>
        {levelInfo.icon} {levelInfo.name}
      </div>

      <div className="menu-buttons">
        <button className="btn btn-primary btn-glow" onClick={onRestart}>
          🔄 Play Again
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          🏠 Main Menu
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;
