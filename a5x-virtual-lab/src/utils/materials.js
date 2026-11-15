/**
 * utils/materials.js — Cached material factory + canvas texture helpers
 */
import * as THREE from 'three';
import { COLORS } from '../config.js';

// Polyfill roundRect for older browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') r = [r, r, r, r];
    const [tl, tr, br, bl] = r;
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y); this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br); this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h); this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl); this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

const _cache = {};
/** Cached MeshStandardMaterial */
export function M(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!_cache[key]) {
    _cache[key] = new THREE.MeshStandardMaterial({ color, roughness: 0.6, ...opts });
  }
  return _cache[key];
}

/** MeshBasicMaterial (emissive, no lighting) */
export function Bm(color, opts = {}) {
  return new THREE.MeshBasicMaterial({ color, ...opts });
}

/** Shorthand colour constants */
export const C = COLORS;

/** Create a CanvasTexture from a draw callback */
export function canvasTex(w, h, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Yellow/black hazard stripe texture */
export function stripeTexture(length) {
  const tex = canvasTex(64, 32, (g) => {
    g.fillStyle = '#ffc400';
    g.fillRect(0, 0, 64, 32);
    g.fillStyle = '#111';
    for (let i = -1; i < 4; i++) {
      g.beginPath();
      g.moveTo(i * 24, 32);
      g.lineTo(i * 24 + 12, 32);
      g.lineTo(i * 24 + 28, 0);
      g.lineTo(i * 24 + 16, 0);
      g.fill();
    }
  });
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(length * 2, 1);
  return tex;
}

/** Code editor screen texture */
export function codeScreenTex() {
  return canvasTex(512, 320, (g, w, h) => {
    g.fillStyle = '#0d1b2e';
    g.fillRect(0, 0, w, h);
    // Sidebar
    g.fillStyle = '#0a1522';
    g.fillRect(0, 0, 40, h);
    // Line numbers
    g.fillStyle = '#555';
    g.font = '11px monospace';
    for (let i = 0; i < 22; i++) g.fillText(`${i + 1}`, 8, 18 + i * 14);
    // Code lines
    const colors = ['#4fc3f7', '#ffb74d', '#81c784', '#e57373', '#ba68c8', '#90a4ae', '#fff176'];
    for (let i = 0; i < 22; i++) {
      const indent = 50 + (i % 4) * 12;
      g.fillStyle = colors[i % colors.length];
      g.fillRect(indent, 10 + i * 14, 30 + Math.random() * 180, 8);
      if (Math.random() > 0.5) {
        g.fillStyle = colors[(i + 3) % colors.length];
        g.fillRect(indent + 40 + Math.random() * 60, 10 + i * 14, 20 + Math.random() * 80, 8);
      }
    }
    // Cursor blink line
    g.fillStyle = '#fff';
    g.fillRect(130, 150, 2, 14);
  });
}

/** CAD wireframe screen texture */
export function cadScreenTex() {
  return canvasTex(512, 320, (g, w, h) => {
    g.fillStyle = '#16304f';
    g.fillRect(0, 0, w, h);
    // Grid
    g.strokeStyle = '#1a3a5f';
    g.lineWidth = 0.5;
    for (let x = 0; x < w; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    // 3D wireframe box
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 2;
    const cx = w / 2, cy = h / 2;
    // Front face
    g.strokeRect(cx - 60, cy - 40, 100, 80);
    // Back face
    g.strokeRect(cx - 30, cy - 65, 100, 80);
    // Connect corners
    [[cx - 60, cy - 40, cx - 30, cy - 65], [cx + 40, cy - 40, cx + 70, cy - 65],
     [cx - 60, cy + 40, cx - 30, cy + 15], [cx + 40, cy + 40, cx + 70, cy + 15]].forEach(([a, b, c, d]) => {
      g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke();
    });
    // Dimension lines
    g.strokeStyle = '#4fc3f7';
    g.lineWidth = 1;
    g.setLineDash([4, 4]);
    g.beginPath(); g.moveTo(cx - 70, cy + 50); g.lineTo(cx + 50, cy + 50); g.stroke();
    g.beginPath(); g.moveTo(cx + 50, cy - 50); g.lineTo(cx + 50, cy + 50); g.stroke();
    g.setLineDash([]);
    // Text
    g.fillStyle = '#fff';
    g.font = '12px monospace';
    g.fillText('100mm', cx - 30, cy + 65);
    g.fillText('80mm', cx + 55, cy + 5);
  });
}

/** Diagonal navy/orange/white stripe band texture for beams */
export function diagonalStripeTex(w = 512, h = 128) {
  return canvasTex(w, h, (g, W, H) => {
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, W, H);
    const stripes = [
      { color: '#14284b', x: W * 0.1 },
      { color: '#ff7a00', x: W * 0.15 },
      { color: '#14284b', x: W * 0.22 },
    ];
    stripes.forEach(({ color, x }) => {
      g.fillStyle = color;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + W * 0.06, 0);
      g.lineTo(x + W * 0.06 - H * 0.5, H);
      g.lineTo(x - H * 0.5, H);
      g.fill();
    });
    // Right side mirror
    stripes.forEach(({ color, x }) => {
      const rx = W - x - W * 0.06;
      g.fillStyle = color;
      g.beginPath();
      g.moveTo(rx, 0);
      g.lineTo(rx + W * 0.06, 0);
      g.lineTo(rx + W * 0.06 + H * 0.5, H);
      g.lineTo(rx + H * 0.5, H);
      g.fill();
    });
  });
}
