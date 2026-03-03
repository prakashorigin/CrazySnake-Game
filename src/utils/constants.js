export const LEVELS = {
  easy: {
    name: "Easy",
    speed: 7,
    gridSize: 18,
    obstacles: 0,
    color: "#4CAF50",
    icon: "🌱",
    description: "No obstacles, relaxed speed",
  },
  medium: {
    name: "Medium",
    speed: 11,
    gridSize: 18,
    obstacles: 6,
    color: "#FF9800",
    icon: "🔥",
    description: "Some obstacles, moderate speed",
  },
  hard: {
    name: "Hard",
    speed: 15,
    gridSize: 20,
    obstacles: 12,
    color: "#f44336",
    icon: "💀",
    description: "Many obstacles, fast speed",
  },
  extreme: {
    name: "Extreme",
    speed: 20,
    gridSize: 22,
    obstacles: 20,
    color: "#9C27B0",
    icon: "☠️",
    description: "Maximum chaos, insane speed",
  },
};

export const SKINS = {
  classic: {
    name: "Classic",
    headColor: "#2E7D32",
    bodyColor: "#4CAF50",
    bodyAlt: "#66BB6A",
  },
  neon: {
    name: "Neon",
    headColor: "#00E5FF",
    bodyColor: "#E040FB",
    bodyAlt: "#7C4DFF",
  },
  fire: {
    name: "Fire",
    headColor: "#FF6F00",
    bodyColor: "#F44336",
    bodyAlt: "#FF9800",
  },
  ice: {
    name: "Ice",
    headColor: "#E1F5FE",
    bodyColor: "#03A9F4",
    bodyAlt: "#B3E5FC",
  },
  rainbow: {
    name: "Rainbow",
    headColor: "#FF1744",
    bodyColors: [
      "#FF1744",
      "#FF9100",
      "#FFEA00",
      "#00E676",
      "#2979FF",
      "#651FFF",
      "#D500F9",
    ],
  },
  galaxy: {
    name: "Galaxy",
    headColor: "#CE93D8",
    bodyColor: "#4A148C",
    bodyAlt: "#7B1FA2",
  },
};

export const POWER_UP_TYPES = {
  SLOW_MOTION: {
    name: "Slow Motion",
    color: "#2196F3",
    duration: 5000,
    icon: "🐌",
  },
  DOUBLE_POINTS: {
    name: "Double Points",
    color: "#FFD700",
    duration: 8000,
    icon: "⭐",
  },
  GHOST: {
    name: "Ghost Mode",
    color: "#B0BEC5",
    duration: 4000,
    icon: "👻",
  },
};
