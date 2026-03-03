function HowToPlay({ onBack }) {
  return (
    <div className="screen howto-screen">
      <h2 className="screen-title">How to Play</h2>

      <div className="howto-content">
        <div className="howto-item">
          <span className="howto-icon">🎮</span>
          <div>
            <h3>Controls</h3>
            <p>
              <strong>Desktop:</strong> Arrow Keys or WASD
            </p>
            <p>
              <strong>Mobile:</strong> Swipe or use on-screen buttons
            </p>
            <p>
              <strong>Pause:</strong> Space or Esc
            </p>
          </div>
        </div>

        <div className="howto-item">
          <span className="howto-icon">🍎</span>
          <div>
            <h3>Eat Food</h3>
            <p>Collect the red food to grow longer and earn 10 points each.</p>
          </div>
        </div>

        <div className="howto-item">
          <span className="howto-icon">⚡</span>
          <div>
            <h3>Power-Ups</h3>
            <p>
              <strong>🐌 Slow Motion</strong> — Reduces speed for 5s
            </p>
            <p>
              <strong>⭐ Double Points</strong> — 2x scoring for 8s
            </p>
            <p>
              <strong>👻 Ghost Mode</strong> — Pass through walls for 4s
            </p>
          </div>
        </div>

        <div className="howto-item">
          <span className="howto-icon">🧱</span>
          <div>
            <h3>Obstacles</h3>
            <p>
              Higher difficulty levels have walls on the board. Avoid them or
              use Ghost Mode to phase through!
            </p>
          </div>
        </div>

        <div className="howto-item">
          <span className="howto-icon">💀</span>
          <div>
            <h3>Game Over</h3>
            <p>
              Hitting a wall, obstacle, or your own body ends the game. Try to
              beat your high score!
            </p>
          </div>
        </div>
      </div>

      <button className="btn btn-back" onClick={onBack}>
        ← Back to Menu
      </button>
    </div>
  );
}

export default HowToPlay;
