function StartScreen({ onPlay, onHowToPlay }) {
  return (
    <div className="screen start-screen">
      <div className="logo-section">
        <div className="snake-logo">
          <span className="snake-emoji-large" role="img" aria-label="snake">
            🐍
          </span>
        </div>
        <h1 className="game-title">
          SNAKE<span className="accent">MANIA</span>
        </h1>
        <p className="subtitle">The Ultimate Snake Experience</p>
      </div>

      <div className="menu-buttons">
        <button className="btn btn-primary btn-glow" onClick={onPlay}>
          <span className="btn-icon">🎮</span>
          <span>Play Game</span>
        </button>
        <button className="btn btn-secondary" onClick={onHowToPlay}>
          <span className="btn-icon">📖</span>
          <span>How to Play</span>
        </button>
      </div>

      <div className="start-footer">
        <p>Arrow Keys / WASD to move • Space to pause</p>
        <p className="version">v2.0</p>
      </div>
    </div>
  );
}

export default StartScreen;
