/**
 * ui/minimap.js — Bottom-right toggle minimap showing player position
 */
import { HALL, ZONES, CSS_COLORS } from '../config.js';

export function createMinimap(camera) {
  const container = document.getElementById('minimap');
  const canvas = document.getElementById('minimap-canvas');
  const toggleBtn = document.getElementById('minimap-toggle');
  if (!canvas || !container) return { update: () => {} };

  const ctx = canvas.getContext('2d');
  const W = canvas.width = 180;
  const H = canvas.height = 140;
  let visible = true;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      visible = !visible;
      container.classList.toggle('hidden', !visible);
      toggleBtn.textContent = visible ? '🗺' : '🗺';
      toggleBtn.classList.toggle('off', !visible);
    });
  }

  // Map world coords to canvas
  const mapX = (wx) => ((wx - HALL.xMin) / (HALL.xMax - HALL.xMin)) * W;
  const mapZ = (wz) => ((HALL.zMax - wz) / (HALL.zMax - HALL.zMin)) * H;

  return {
    update() {
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);

      // Floor
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // Hall outline
      ctx.strokeStyle = '#ff7a00';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, W - 4, H - 4);

      // Tables
      ctx.fillStyle = '#deb887';
      const drawBox = (xMin, xMax, zMin, zMax) => {
        const x1 = mapX(xMin), x2 = mapX(xMax);
        const y1 = mapZ(zMax), y2 = mapZ(zMin);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      };
      drawBox(-9, -4, -5, 9);
      drawBox(4, 9, -5, 9);

      // Zone areas
      ctx.globalAlpha = 0.25;
      ZONES.forEach((z) => {
        ctx.fillStyle = '#ff7a00';
        const cx = mapX(z.center[0]);
        const cy = mapZ(z.center[1]);
        ctx.beginPath();
        ctx.arc(cx, cy, z.r * (W / HALL.w), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Zone labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ZONES.forEach((z) => {
        ctx.fillText(z.title.split(' ')[0], mapX(z.center[0]), mapZ(z.center[1]) + 3);
      });

      // Player position + direction
      const px = mapX(camera.position.x);
      const py = mapZ(camera.position.z);

      // Direction triangle
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-camera.rotation.y);
      ctx.fillStyle = '#ff7a00';
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(-4, 5);
      ctx.lineTo(4, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Player dot
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}
