import { useState } from "react";
import StartScreen from "./components/StartScreen";
import LevelSelect from "./components/LevelSelect";
import SkinSelect from "./components/SkinSelect";
import GameBoard from "./components/GameBoard";
import GameOverScreen from "./components/GameOverScreen";
import HowToPlay from "./components/HowToPlay";

function App() {
  const [screen, setScreen] = useState("start");
  const [level, setLevel] = useState("easy");
  const [skin, setSkin] = useState("classic");
  const [lastScore, setLastScore] = useState(0);

  const handlePlay = () => setScreen("levelSelect");
  const handleLevelSelect = (lvl) => {
    setLevel(lvl);
    setScreen("skinSelect");
  };
  const handleSkinSelect = (s) => {
    setSkin(s);
    setScreen("game");
  };
  const handleGameOver = (score) => {
    setLastScore(score);
    setScreen("gameOver");
  };
  const handleRestart = () => setScreen("game");
  const handleHome = () => setScreen("start");
  const handleHowToPlay = () => setScreen("howToPlay");

  return (
    <div className="app">
      <div className="game-container">
        {screen === "start" && (
          <StartScreen onPlay={handlePlay} onHowToPlay={handleHowToPlay} />
        )}
        {screen === "levelSelect" && (
          <LevelSelect onSelect={handleLevelSelect} onBack={handleHome} />
        )}
        {screen === "skinSelect" && (
          <SkinSelect
            onSelect={handleSkinSelect}
            onBack={() => setScreen("levelSelect")}
          />
        )}
        {screen === "game" && (
          <GameBoard
            level={level}
            skin={skin}
            onGameOver={handleGameOver}
            onHome={handleHome}
          />
        )}
        {screen === "gameOver" && (
          <GameOverScreen
            score={lastScore}
            level={level}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
        {screen === "howToPlay" && <HowToPlay onBack={handleHome} />}
      </div>
    </div>
  );
}

export default App;
