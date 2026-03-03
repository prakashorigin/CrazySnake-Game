import { SKINS, POWER_UP_TYPES } from "./constants.js";

export class GameEngine {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gridSize = config.gridSize;
    this.cellSize = config.cellSize;
    this.speed = config.speed;
    this.skinName = config.skin;
    this.levelKey = config.levelKey;
    this.obstacleCount = config.obstacles;
    this.onScoreChange = config.onScoreChange || (() => {});
    this.onGameOver = config.onGameOver || (() => {});

    this.canvas.width = this.gridSize * this.cellSize;
    this.canvas.height = this.gridSize * this.cellSize;

    this.snake = [];
    this.food = null;
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.obstacles = [];
    this.powerUp = null;
    this.activePowerUp = null;
    this.particles = [];
    this.score = 0;
    this.foodEaten = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.lastTick = 0;
    this.animFrame = null;

    // Sounds (safe loading)
    this.sounds = {};
    try {
      this.sounds.food = new Audio("/music/food.mp3");
      this.sounds.gameOver = new Audio("/music/gameover.mp3");
      this.sounds.move = new Audio("/music/move.mp3");
      this.sounds.music = new Audio("/music/music.mp3");
      this.sounds.music.loop = true;
      this.sounds.music.volume = 0.3;
      this.sounds.food.volume = 0.5;
      this.sounds.move.volume = 0.2;
    } catch (e) {
      console.warn("Audio loading failed:", e);
    }
  }

  // ===== INITIALIZATION =====

  init() {
    const center = Math.floor(this.gridSize / 2);
    this.snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.foodEaten = 0;
    this.particles = [];
    this.powerUp = null;
    this.activePowerUp = null;
    this.generateObstacles();
    this.spawnFood();
    this.onScoreChange(0);
  }

  generateObstacles() {
    this.obstacles = [];
    if (this.obstacleCount === 0) return;

    const center = Math.floor(this.gridSize / 2);
    const safeZone = new Set();

    // Safe zone around snake start
    for (let dx = -4; dx <= 4; dx++) {
      for (let dy = -4; dy <= 4; dy++) {
        safeZone.add(`${center + dx},${center + dy}`);
      }
    }

    for (let i = 0; i < this.obstacleCount; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = Math.floor(Math.random() * (this.gridSize - 4)) + 2;
        y = Math.floor(Math.random() * (this.gridSize - 4)) + 2;
        attempts++;
      } while (safeZone.has(`${x},${y}`) && attempts < 200);

      if (attempts < 200) {
        this.obstacles.push({ x, y });
        safeZone.add(`${x},${y}`);
      }
    }
  }

  getOccupiedSet() {
    const occupied = new Set();
    this.snake.forEach((s) => occupied.add(`${s.x},${s.y}`));
    this.obstacles.forEach((o) => occupied.add(`${o.x},${o.y}`));
    if (this.food) occupied.add(`${this.food.x},${this.food.y}`);
    if (this.powerUp) occupied.add(`${this.powerUp.x},${this.powerUp.y}`);
    return occupied;
  }

  spawnFood() {
    const occupied = this.getOccupiedSet();
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * this.gridSize);
      y = Math.floor(Math.random() * this.gridSize);
      attempts++;
    } while (occupied.has(`${x},${y}`) && attempts < 500);
    this.food = { x, y };
  }

  spawnPowerUp() {
    if (this.powerUp) return;

    const occupied = this.getOccupiedSet();
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * this.gridSize);
      y = Math.floor(Math.random() * this.gridSize);
      attempts++;
    } while (occupied.has(`${x},${y}`) && attempts < 200);

    if (attempts >= 200) return;

    const types = Object.keys(POWER_UP_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const ticksToLive = Math.ceil((8000 / 1000) * this.speed);
    this.powerUp = { x, y, type, ticksRemaining: ticksToLive };
  }

  collectPowerUp() {
    if (!this.powerUp) return;

    const type = this.powerUp.type;
    const config = POWER_UP_TYPES[type];
    const totalTicks = Math.ceil((config.duration / 1000) * this.speed);
    this.activePowerUp = { type, ticksRemaining: totalTicks, totalTicks };
    this.createParticles(this.powerUp.x, this.powerUp.y, config.color, 15);
    this.powerUp = null;
  }

  // ===== PARTICLES =====

  createParticles(gridX, gridY, color, count) {
    const cx = (gridX + 0.5) * this.cellSize;
    const cy = (gridY + 0.5) * this.cellSize;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      return p.life > 0;
    });
  }

  // ===== GAME LIFECYCLE =====

  start() {
    this.init();
    this.isRunning = true;
    this.isPaused = false;
    this.lastTick = performance.now();
    this.playSound("music");
    this.loop(performance.now());
  }

  pause() {
    this.isPaused = true;
    this.pauseSound("music");
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  resume() {
    if (!this.isRunning) return;
    this.isPaused = false;
    this.lastTick = performance.now();
    this.playSound("music");
    this.loop(performance.now());
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.stopSound("music");
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  destroy() {
    this.stop();
    this.sounds = {};
  }

  setDirection(dir) {
    if (dir.x !== -this.direction.x || dir.y !== -this.direction.y) {
      if (dir.x !== 0 || dir.y !== 0) {
        this.nextDirection = { ...dir };
      }
    }
  }

  playSound(name) {
    try {
      if (this.sounds[name]) {
        this.sounds[name].currentTime = 0;
        this.sounds[name].play().catch(() => {});
      }
    } catch (e) {}
  }

  pauseSound(name) {
    try {
      if (this.sounds[name]) this.sounds[name].pause();
    } catch (e) {}
  }

  stopSound(name) {
    try {
      if (this.sounds[name]) {
        this.sounds[name].pause();
        this.sounds[name].currentTime = 0;
      }
    } catch (e) {}
  }

  // ===== GAME LOOP =====

  loop(timestamp) {
    if (!this.isRunning || this.isPaused) return;

    const elapsed = timestamp - this.lastTick;
    let interval = 1000 / this.speed;

    if (this.activePowerUp?.type === "SLOW_MOTION") {
      interval *= 1.6;
    }

    if (elapsed >= interval) {
      this.update();
      this.lastTick = timestamp;
    }

    this.render(timestamp);
    this.animFrame = requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    if (!this.isRunning) return;

    this.direction = { ...this.nextDirection };

    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y,
    };

    const isGhost = this.activePowerUp?.type === "GHOST";

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= this.gridSize ||
      head.y < 0 ||
      head.y >= this.gridSize
    ) {
      if (isGhost) {
        head.x = (head.x + this.gridSize) % this.gridSize;
        head.y = (head.y + this.gridSize) % this.gridSize;
      } else {
        this.handleGameOver();
        return;
      }
    }

    // Self collision
    if (this.snake.some((s) => s.x === head.x && s.y === head.y)) {
      if (!isGhost) {
        this.handleGameOver();
        return;
      }
    }

    // Obstacle collision
    if (this.obstacles.some((o) => o.x === head.x && o.y === head.y)) {
      if (!isGhost) {
        this.handleGameOver();
        return;
      }
    }

    this.snake.unshift(head);

    // Food check
    if (head.x === this.food.x && head.y === this.food.y) {
      this.eatFood();
    } else {
      this.snake.pop();
    }

    // Power-up pickup
    if (
      this.powerUp &&
      head.x === this.powerUp.x &&
      head.y === this.powerUp.y
    ) {
      this.collectPowerUp();
    }

    // Decrement power-up timers
    if (this.activePowerUp) {
      this.activePowerUp.ticksRemaining--;
      if (this.activePowerUp.ticksRemaining <= 0) {
        this.activePowerUp = null;
      }
    }

    if (this.powerUp) {
      this.powerUp.ticksRemaining--;
      if (this.powerUp.ticksRemaining <= 0) {
        this.powerUp = null;
      }
    }

    this.updateParticles();

    // Random power-up spawn
    if (
      !this.powerUp &&
      !this.activePowerUp &&
      this.foodEaten > 2 &&
      Math.random() < 0.01
    ) {
      this.spawnPowerUp();
    }
  }

  eatFood() {
    const points = this.activePowerUp?.type === "DOUBLE_POINTS" ? 20 : 10;
    this.score += points;
    this.foodEaten++;
    this.onScoreChange(this.score);
    this.playSound("food");
    this.createParticles(this.food.x, this.food.y, "#FFD700", 10);
    this.spawnFood();
  }

  handleGameOver() {
    this.isRunning = false;
    this.pauseSound("music");
    this.playSound("gameOver");
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    // Flash red
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    setTimeout(() => {
      this.onGameOver(this.score);
    }, 800);
  }

  // ===== RENDERING =====

  render(timestamp) {
    const { ctx, canvas } = this;

    // Clear with dark background
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawGrid();
    this.drawObstacles();
    this.drawFood(timestamp);
    this.drawPowerUp(timestamp);
    this.drawSnake(timestamp);
    this.drawParticles();
    this.drawBorder();
    this.drawPowerUpIndicator();
  }

  drawGrid() {
    const { ctx, cellSize, gridSize } = this;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  drawBorder() {
    const { ctx, canvas } = this;

    // Inner glowing border
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#00d2ff");
    gradient.addColorStop(0.5, "#7b2ff7");
    gradient.addColorStop(1, "#00d2ff");

    ctx.save();
    ctx.shadowColor = "#7b2ff7";
    ctx.shadowBlur = 20;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    ctx.restore();

    // Decorative corners
    const cornerSize = 12;
    ctx.strokeStyle = "#00d2ff";
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(canvas.width - cornerSize, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - cornerSize);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(cornerSize, canvas.height);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(canvas.width - cornerSize, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, canvas.height - cornerSize);
    ctx.stroke();
  }

  drawSnake() {
    const { ctx, cellSize } = this;
    const skin = SKINS[this.skinName];
    const isGhost = this.activePowerUp?.type === "GHOST";

    // Draw tail to head (head on top)
    for (let i = this.snake.length - 1; i >= 0; i--) {
      const seg = this.snake[i];
      const x = seg.x * cellSize;
      const y = seg.y * cellSize;
      const padding = 1;
      const size = cellSize - padding * 2;

      if (isGhost && i !== 0) {
        ctx.globalAlpha = 0.4;
      }

      if (i === 0) {
        // HEAD
        ctx.fillStyle = skin.headColor;
        ctx.save();
        ctx.shadowColor = skin.headColor;
        ctx.shadowBlur = 8;
        this.fillRoundRect(x + padding, y + padding, size, size, 8);
        ctx.restore();

        // Eyes
        this.drawEyes(x, y);
      } else {
        // BODY
        let color;
        if (skin.bodyColors) {
          color = skin.bodyColors[i % skin.bodyColors.length];
        } else {
          color = i % 2 === 0 ? skin.bodyColor : skin.bodyAlt || skin.bodyColor;
        }

        // Slight scale down toward tail
        const scale = 0.85 + 0.15 * (1 - i / Math.max(this.snake.length, 1));
        const segSize = size * scale;
        const segOffset = (cellSize - segSize) / 2;

        ctx.fillStyle = color;
        this.fillRoundRect(x + segOffset, y + segOffset, segSize, segSize, 5);

        // Subtle shine
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        this.fillRoundRect(
          x + segOffset + 2,
          y + segOffset + 2,
          segSize * 0.4,
          segSize * 0.3,
          3,
        );
      }

      ctx.globalAlpha = 1;
    }
  }

  drawEyes(x, y) {
    const { ctx, cellSize } = this;
    const cx = x + cellSize / 2;
    const cy = y + cellSize / 2;
    const eyeOffset = cellSize * 0.2;
    const eyeSize = cellSize * 0.13;
    const pupilSize = cellSize * 0.065;

    let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

    if (this.direction.x === 1) {
      // Right
      leftEyeX = cx + eyeOffset * 0.5;
      leftEyeY = cy - eyeOffset;
      rightEyeX = cx + eyeOffset * 0.5;
      rightEyeY = cy + eyeOffset;
    } else if (this.direction.x === -1) {
      // Left
      leftEyeX = cx - eyeOffset * 0.5;
      leftEyeY = cy - eyeOffset;
      rightEyeX = cx - eyeOffset * 0.5;
      rightEyeY = cy + eyeOffset;
    } else if (this.direction.y === -1) {
      // Up
      leftEyeX = cx - eyeOffset;
      leftEyeY = cy - eyeOffset * 0.5;
      rightEyeX = cx + eyeOffset;
      rightEyeY = cy - eyeOffset * 0.5;
    } else {
      // Down
      leftEyeX = cx - eyeOffset;
      leftEyeY = cy + eyeOffset * 0.5;
      rightEyeX = cx + eyeOffset;
      rightEyeY = cy + eyeOffset * 0.5;
    }

    // Eye whites
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    const pOffX = this.direction.x * pupilSize * 0.5;
    const pOffY = this.direction.y * pupilSize * 0.5;
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(leftEyeX + pOffX, leftEyeY + pOffY, pupilSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX + pOffX, rightEyeY + pOffY, pupilSize, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFood(timestamp) {
    const { ctx, cellSize } = this;
    const pulse = Math.sin(timestamp / 200) * 2;
    const x = this.food.x * cellSize + cellSize / 2;
    const y = this.food.y * cellSize + cellSize / 2;
    const baseRadius = (cellSize - 6) / 2;
    const radius = Math.max(baseRadius + pulse, 3);

    // Glow
    ctx.save();
    ctx.shadowColor = "#ff4444";
    ctx.shadowBlur = 15;

    // Apple gradient
    const gradient = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, radius);
    gradient.addColorStop(0, "#ff6b6b");
    gradient.addColorStop(0.6, "#ee5a24");
    gradient.addColorStop(1, "#c0392b");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Shine highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Leaf
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.ellipse(x + 2, y - radius - 2, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawObstacles() {
    const { ctx, cellSize } = this;

    this.obstacles.forEach((obs) => {
      const x = obs.x * cellSize;
      const y = obs.y * cellSize;

      // Dark brick
      const gradient = ctx.createLinearGradient(
        x,
        y,
        x + cellSize,
        y + cellSize,
      );
      gradient.addColorStop(0, "#4a4a5a");
      gradient.addColorStop(1, "#2a2a3a");

      ctx.fillStyle = gradient;
      this.fillRoundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 3);

      // Cross pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + cellSize / 2);
      ctx.lineTo(x + cellSize - 4, y + cellSize / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2, y + 4);
      ctx.lineTo(x + cellSize / 2, y + cellSize - 4);
      ctx.stroke();

      // Border
      ctx.strokeStyle = "rgba(255, 100, 100, 0.3)";
      ctx.lineWidth = 1;
      this.strokeRoundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 3);
    });
  }

  drawPowerUp(timestamp) {
    if (!this.powerUp) return;

    const { ctx, cellSize } = this;
    const config = POWER_UP_TYPES[this.powerUp.type];
    const x = this.powerUp.x * cellSize + cellSize / 2;
    const y = this.powerUp.y * cellSize + cellSize / 2;
    const pulse = Math.sin(timestamp / 150) * 2;
    const radius = Math.max((cellSize - 8) / 2 + pulse, 3);

    ctx.save();
    ctx.shadowColor = config.color;
    ctx.shadowBlur = 20;

    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Icon
    ctx.font = `${cellSize * 0.5}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.icon, x, y + 1);
  }

  drawParticles() {
    const { ctx } = this;
    this.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  drawPowerUpIndicator() {
    if (!this.activePowerUp) return;

    const config = POWER_UP_TYPES[this.activePowerUp.type];
    const remaining =
      this.activePowerUp.ticksRemaining / this.activePowerUp.totalTicks;

    if (remaining <= 0) return;

    const { ctx, canvas } = this;
    const barHeight = 6;
    const barY = canvas.height - barHeight - 6;
    const barWidth = (canvas.width - 24) * remaining;

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.fillRoundRect(12, barY, canvas.width - 24, barHeight, 3);

    // Active bar
    ctx.fillStyle = config.color;
    this.fillRoundRect(12, barY, barWidth, barHeight, 3);

    // Label
    ctx.fillStyle = "#fff";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${config.icon} ${config.name}`, canvas.width / 2, barY - 4);
  }

  // ===== CANVAS HELPERS =====

  fillRoundRect(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  strokeRoundRect(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
  }
}
