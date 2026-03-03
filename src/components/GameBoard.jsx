import { useRef, useEffect, useState, useCallback } from "react";
import { GameEngine } from "../utils/GameEngine";
import { LEVELS } from "../utils/constants";

function GameBoard({ level, skin, onGameOver, onHome }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(`snake_hs_${level}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Initialize and start the game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const levelConfig = LEVELS[level];
    const maxSize = Math.min(
      window.innerWidth * 0.92,
      window.innerHeight * 0.62,
      600,
    );
    const cellSize = Math.floor(maxSize / levelConfig.gridSize);

    const engine = new GameEngine(canvas, {
      gridSize: levelConfig.gridSize,
      cellSize,
      speed: levelConfig.speed,
      skin,
      levelKey: level,
      obstacles: levelConfig.obstacles,
      onScoreChange: (s) => {
        setScore(s);
        const saved = localStorage.getItem(`snake_hs_${level}`);
        const hs = saved ? parseInt(saved, 10) : 0;
        if (s > hs) {
          localStorage.setItem(`snake_hs_${level}`, s.toString());
          setHighScore(s);
        }
      },
      onGameOver: (s) => {
        onGameOver(s);
      },
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [level, skin, onGameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      const engine = engineRef.current;
      if (!engine) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          engine.setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          engine.setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          engine.setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          engine.setDirection({ x: 1, y: 0 });
          break;
        case " ":
        case "Escape":
          e.preventDefault();
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Touch / swipe controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const engine = engineRef.current;
      if (!engine) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const minSwipe = 20;
      if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        engine.setDirection({ x: dx > 0 ? 1 : -1, y: 0 });
      } else {
        engine.setDirection({ x: 0, y: dy > 0 ? 1 : -1 });
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const togglePause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    setIsPaused((prev) => {
      if (prev) {
        engine.resume();
      } else {
        engine.pause();
      }
      return !prev;
    });
  }, []);

  const handleDir = (dir) => {
    engineRef.current?.setDirection(dir);
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="btn-icon" onClick={onHome} title="Home">
          🏠
        </button>
        <div className="score-display">
          <div className="score-item">
            <span className="score-label">SCORE</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-divider" />
          <div className="score-item">
            <span className="score-label">BEST</span>
            <span className="score-value hi">{highScore}</span>
          </div>
        </div>
        <button className="btn-icon" onClick={togglePause} title="Pause">
          {isPaused ? "▶️" : "⏸️"}
        </button>
      </div>

      <div className="canvas-wrapper" ref={containerRef}>
        <canvas ref={canvasRef} className="game-canvas" />
        {isPaused && (
          <div className="pause-overlay">
            <h2>PAUSED</h2>
            <div className="pause-buttons">
              <button className="btn btn-primary" onClick={togglePause}>
                ▶ Resume
              </button>
              <button className="btn btn-secondary" onClick={onHome}>
                🏠 Quit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mobile-controls">
        <button
          className="control-btn up"
          onPointerDown={() => handleDir({ x: 0, y: -1 })}
        >
          ▲
        </button>
        <div className="control-row">
          <button
            className="control-btn left"
            onPointerDown={() => handleDir({ x: -1, y: 0 })}
          >
            ◄
          </button>
          <button
            className="control-btn down"
            onPointerDown={() => handleDir({ x: 0, y: 1 })}
          >
            ▼
          </button>
          <button
            className="control-btn right"
            onPointerDown={() => handleDir({ x: 1, y: 0 })}
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
