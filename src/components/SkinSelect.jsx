import { useRef, useEffect } from "react";
import { SKINS } from "../utils/constants";

function SkinPreview({ skin }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = 100;
    const h = 44;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    const segSize = 18;
    const gap = 3;
    const segments = 5;
    const startX = (w - segments * (segSize + gap)) / 2;

    // Head
    ctx.fillStyle = skin.headColor;
    roundRect(ctx, startX, (h - segSize) / 2, segSize, segSize, 5);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(startX + segSize * 0.6, (h - segSize) / 2 + 5, 2.5, 0, Math.PI * 2);
    ctx.arc(
      startX + segSize * 0.6,
      (h - segSize) / 2 + segSize - 5,
      2.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(startX + segSize * 0.7, (h - segSize) / 2 + 5, 1.2, 0, Math.PI * 2);
    ctx.arc(
      startX + segSize * 0.7,
      (h - segSize) / 2 + segSize - 5,
      1.2,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Body segments
    for (let i = 1; i < segments; i++) {
      let color;
      if (skin.bodyColors) {
        color = skin.bodyColors[i % skin.bodyColors.length];
      } else {
        color = i % 2 === 0 ? skin.bodyColor : skin.bodyAlt || skin.bodyColor;
      }
      const scale = 0.85 + 0.15 * (1 - i / segments);
      const s = segSize * scale;
      const offsetY = (h - s) / 2;
      const offsetX = startX + i * (segSize + gap) + (segSize - s) / 2;

      ctx.fillStyle = color;
      roundRect(ctx, offsetX, offsetY, s, s, 4);
      ctx.fill();

      // Shine
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      roundRect(ctx, offsetX + 2, offsetY + 2, s * 0.35, s * 0.25, 2);
      ctx.fill();
    }
  }, [skin]);

  return <canvas ref={canvasRef} className="skin-preview-canvas" />;
}

function roundRect(ctx, x, y, w, h, r) {
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
}

function SkinSelect({ onSelect, onBack }) {
  return (
    <div className="screen skin-screen">
      <h2 className="screen-title">Choose Your Snake</h2>
      <div className="skin-grid">
        {Object.entries(SKINS).map(([key, skin]) => (
          <button key={key} className="skin-card" onClick={() => onSelect(key)}>
            <SkinPreview skin={skin} />
            <h3 className="skin-name">{skin.name}</h3>
          </button>
        ))}
      </div>
      <button className="btn btn-back" onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

export default SkinSelect;
