import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ===== HIGH SCORES (persisted to JSON file) =====
const SCORES_FILE = path.join(__dirname, "scores.json");

function loadScores() {
  try {
    if (fs.existsSync(SCORES_FILE)) {
      return JSON.parse(fs.readFileSync(SCORES_FILE, "utf-8"));
    }
  } catch (e) {
    console.warn("Failed to load scores:", e.message);
  }
  return {};
}

function saveScores(scores) {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  } catch (e) {
    console.warn("Failed to save scores:", e.message);
  }
}

let highScores = loadScores();

// GET high scores (optionally filter by level)
app.get("/api/scores", (req, res) => {
  const { level } = req.query;
  if (level && highScores[level]) {
    return res.json({ [level]: highScores[level] });
  }
  res.json(highScores);
});

// POST a new score
app.post("/api/scores", (req, res) => {
  const { level, score, name = "Player" } = req.body;

  if (!level || typeof score !== "number") {
    return res.status(400).json({ error: "level and score are required" });
  }

  if (!highScores[level]) {
    highScores[level] = [];
  }

  highScores[level].push({
    score,
    name: String(name).slice(0, 20),
    date: new Date().toISOString(),
  });

  // Keep top 10 per level
  highScores[level].sort((a, b) => b.score - a.score);
  highScores[level] = highScores[level].slice(0, 10);
  saveScores(highScores);

  res.json({ leaderboard: highScores[level] });
});

// ===== SERVE STATIC BUILD (production) =====
const distPath = path.join(__dirname, "..", "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`
  🐍 SnakeMania Server running!
  
  Local:   http://localhost:${PORT}
  
  API:
    GET  /api/scores          - Get all high scores
    GET  /api/scores?level=easy - Get scores for a level
    POST /api/scores          - Submit a score { level, score, name }
  `);
});
