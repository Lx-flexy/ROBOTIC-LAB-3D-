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

  // Map world coords to canvas (encompassing Main Hall + Meeting Room annex)
  const minX = -20.5, maxX = 26.2, minZ = -15.5, maxZ = 15.5;
  const mapX = (wx) => 4 + ((wx - minX) / (maxX - minX)) * (W - 8);
  const mapZ = (wz) => 4 + ((maxZ - wz) / (maxZ - minZ)) * (H - 8);

  return {
    update() {
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);

      // Floor background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // Main Hall outline
      const hX1 = mapX(-20), hX2 = mapX(20);
      const hZ1 = mapZ(15), hZ2 = mapZ(-15);
      const dZ1 = mapZ(5.45), dZ2 = mapZ(4.15); // Doorway gap

      ctx.strokeStyle = '#ff7a00';
      ctx.lineWidth = 2;

      // Draw Main Hall perimeter with doorway opening
      ctx.beginPath();
      ctx.moveTo(hX1, hZ1);
      ctx.lineTo(hX2, hZ1);
      ctx.lineTo(hX2, dZ1); // Down to door opening
      ctx.moveTo(hX2, dZ2); // Across door opening
      ctx.lineTo(hX2, hZ2); // Up to back wall
      ctx.lineTo(hX1, hZ2);
      ctx.closePath();
      ctx.stroke();

      // Meeting Room annex outline
      const mrX1 = mapX(19.8), mrX2 = mapX(25.4);
      const mrZ1 = mapZ(7.4), mrZ2 = mapZ(2.2);

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(mrX1, mrZ2, mrX2 - mrX1, mrZ1 - mrZ2);

      ctx.beginPath();
      ctx.moveTo(mrX1, dZ1);
      ctx.lineTo(mrX1, mrZ1);
      ctx.lineTo(mrX2, mrZ1);
      ctx.lineTo(mrX2, mrZ2);
      ctx.lineTo(mrX1, mrZ2);
      ctx.lineTo(mrX1, dZ2);
      ctx.stroke();

      // Tables
      ctx.fillStyle = '#deb887';
      const drawBox = (xMin, xMax, zMin, zMax) => {
        const x1 = mapX(xMin), x2 = mapX(xMax);
        const y1 = mapZ(zMax), y2 = mapZ(zMin);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      };
      drawBox(-9, -4, -5, 9);
      drawBox(4, 9, -5, 9);
      // Meeting room table
      drawBox(21.6, 24.0, 4.2, 5.4);

      // Zone areas
      ctx.globalAlpha = 0.25;
      ZONES.forEach((z) => {
        ctx.fillStyle = '#ff7a00';
        const cx = mapX(z.center[0]);
        const cy = mapZ(z.center[1]);
        ctx.beginPath();
        ctx.arc(cx, cy, z.r * ((W - 8) / (maxX - minX)), 0, Math.PI * 2);
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
