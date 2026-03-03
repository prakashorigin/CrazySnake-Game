# 🐍 CrazySnake-Game

> Advanced Snake Game built with **React** and **Node.js** — Modern, Responsive, Feature-Rich

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)]()

## 🎮 Features

### Gameplay

- 🌱 **4 Difficulty Levels**: Easy → Medium → Hard → Extreme
- 🐉 **6 Unique Snake Skins**: Classic, Neon, Fire, Ice, Rainbow, Galaxy
- ⚡ **Power-Ups**: Slow Motion (🐌) • Double Points (⭐) • Ghost Mode (👻)
- 🧱 **Dynamic Obstacles**: Increases with difficulty
- 🎯 **High Score Leaderboard**: Per-level tracking
- ✨ **Particle Effects**: Smooth animations and visual feedback

### Technical

- 🎨 **Canvas Rendering**: Optimized 2D graphics with smooth animations
- 📱 **Fully Responsive**: Desktop, tablet, and mobile support
- 👆 **Multi-Input**: Keyboard, WASD, Mobile D-pad, Swipe controls
- 🎵 **Audio**: Game music, sound effects, mute support
- 🌙 **Dark Modern UI**: Gradient themes with Orbitron typography
- 💾 **Persistent Storage**: LocalStorage for high scores

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Deployment

```bash
# Build the app
npm run build

# Start Express server (http://localhost:4000)
npm run server
```

The Express server:

- Serves the production build
- Provides high score API endpoints
- Persists scores to `server/scores.json`

## 📋 Game Controls

### Desktop

| Key                    | Action       |
| ---------------------- | ------------ |
| ⬆️ Arrow Up / **W**    | Move Up      |
| ⬇️ Arrow Down / **S**  | Move Down    |
| ⬅️ Arrow Left / **A**  | Move Left    |
| ➡️ Arrow Right / **D** | Move Right   |
| **Space** / **Esc**    | Pause/Resume |

### Mobile

- 🔄 **Swipe** to change direction
- 👆 Use **D-pad buttons** for controls

## 🏗️ Architecture

```
SnakeGame/
├── src/
│   ├── components/          # React components
│   │   ├── StartScreen.jsx
│   │   ├── LevelSelect.jsx
│   │   ├── SkinSelect.jsx
│   │   ├── GameBoard.jsx
│   │   ├── GameOverScreen.jsx
│   │   └── HowToPlay.jsx
│   ├── utils/
│   │   ├── GameEngine.js    # Canvas game logic
│   │   └── constants.js     # Game config
│   ├── App.jsx              # Main app component
│   ├── App.css              # Styles
│   └── main.jsx             # React entry point
├── server/
│   └── index.js             # Express server
├── public/
│   ├── music/               # Audio files
│   └── img/                 # Assets
├── package.json
├── vite.config.js
└── index.html
```

## 🎯 Game Mechanics

### Scoring

- 🍎 Regular Food: **10 points**
- ⭐ Double Points (active): **20 points**

### Difficulty Levels

| Level   | Speed | Grid  | Obstacles | Best For  |
| ------- | ----- | ----- | --------- | --------- |
| Easy    | 7     | 18×18 | 0         | Learning  |
| Medium  | 11    | 18×18 | 6         | Casual    |
| Hard    | 15    | 20×20 | 12        | Challenge |
| Extreme | 20    | 22×22 | 20        | Mastery   |

### Power-Ups

- **🐌 Slow Motion** (5s): Reduces speed by 1.6x
- **⭐ Double Points** (8s): All food gives 2x points
- **👻 Ghost Mode** (4s): Pass through walls and yourself

### Game Over

💀 Collide with:

- Wall (unless Ghost Mode active)
- Obstacle
- Your own snake body

## 🎨 Snake Skins

| Skin    | Head Color | Body Colors     | Look      |
| ------- | ---------- | --------------- | --------- |
| Classic | Green      | Green gradient  | Original  |
| Neon    | Cyan       | Magenta/Purple  | Cyberpunk |
| Fire    | Orange     | Red/Orange      | Flaming   |
| Ice     | Light Blue | Blue gradient   | Frozen    |
| Rainbow | Red        | 7-color cycle   | Vibrant   |
| Galaxy  | Purple     | Purple gradient | Mystical  |

## 📊 API Reference

### High Scores Endpoint

**GET** `/api/scores`

```bash
curl http://localhost:4000/api/scores
```

Returns all high scores by level

**GET** `/api/scores?level=easy`

```bash
curl http://localhost:4000/api/scores?level=easy
```

Returns scores for a specific level

**POST** `/api/scores`

```bash
curl -X POST http://localhost:4000/api/scores \
  -H "Content-Type: application/json" \
  -d '{"level":"easy","score":150,"name":"Player"}'
```

Submit a new score

## 🛠️ Development

### Project Structure

- **Frontend**: React 18 with Vite bundler
- **Backend**: Express.js running on port 4000
- **Rendering**: HTML5 Canvas for game board
- **State**: React hooks (useState, useRef, useEffect)
- **Persistence**: LocalStorage (client) + JSON file (server)

### Building Custom Skins

Edit `src/utils/constants.js`:

```javascript
export const SKINS = {
  myCustom: {
    name: "My Custom Skin",
    headColor: "#FF0000",
    bodyColor: "#00FF00",
    bodyAlt: "#0000FF",
  },
};
```

## 📦 Dependencies

**Frontend:**

- `react` - UI library
- `react-dom` - DOM rendering

**Backend:**

- `express` - Web server
- `cors` - Cross-origin requests

**Build:**

- `vite` - Next-gen bundler
- `@vitejs/plugin-react` - React plugin

## 🚀 Deployment

### Vercel / Netlify (Frontend Only)

```bash
npm run build
# Deploy the `dist/` folder
```

### Heroku / Railway (Full Stack)

```bash
npm run build
npm start  # Runs server/index.js
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

## 📝 License

MIT License - See LICENSE file for details

## 🙌 Contributing

Contributions welcome! Fork → Clone → Branch → Commit → Push → PR

## 🎮 Play Online

🔗 **[Play CrazySnake-Game](https://github.com/prakashorigin/CrazySnake-Game)**

---

**Made with ❤️ using React + Node.js**
