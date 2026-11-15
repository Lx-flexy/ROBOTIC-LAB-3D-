/**
 * props/wallmurals.js — Properly aligned zone wall murals for SRI Robotics Lab
 * All murals use a strict grid layout with safe padding zones.
 */
import * as THREE from 'three';
import { canvasTex } from '../../utils/materials.js';

/* ─────────────────── SHARED HELPERS ─────────────────── */

function sriLogo(g, cx, cy, r) {
  // 8 petals
  g.fillStyle = '#ff7a00';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const px = cx + Math.cos(a) * r * 0.52;
    const py = cy + Math.sin(a) * r * 0.52;
    g.beginPath();
    g.ellipse(px, py, r * 0.26, r * 0.16, a, 0, Math.PI * 2);
    g.fill();
  }
  // Centre
  g.beginPath(); g.arc(cx, cy, r * 0.26, 0, Math.PI * 2); g.fill();
  // Wave underline
  g.strokeStyle = '#ff7a00'; g.lineWidth = r * 0.1;
  g.beginPath();
  g.arc(cx, cy + r * 0.85, r * 0.55, Math.PI * 0.15, Math.PI * 0.85);
  g.stroke();
  // "SRI" text
  g.fillStyle = '#14284b';
  g.font = `bold ${Math.round(r * 0.72)}px 'Segoe UI', sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'top';
  g.fillText('SRI', cx, cy + r * 1.4);
}

function pill(g, cx, cy, w, h, r, bg) {
  g.fillStyle = bg;
  g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, r); g.fill();
}

function card(g, cx, cy, w, h, r) {
  // white bg
  g.fillStyle = '#fff8f0';
  g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, r); g.fill();
  // orange border
  g.strokeStyle = '#ff7a00'; g.lineWidth = 5;
  g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, r); g.stroke();
  // orange top accent bar
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, 10, [r, r, 0, 0]); g.fill();
}

function label(g, cx, cy, text, size, col) {
  g.fillStyle = col || '#14284b';
  g.font = `bold ${size}px 'Segoe UI', sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, cx, cy);
}

function arrow(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath();
  g.moveTo(cx - s * 0.3, cy - s * 0.5);
  g.lineTo(cx + s * 0.4, cy);
  g.lineTo(cx - s * 0.3, cy + s * 0.5);
  g.closePath(); g.fill();
}

function hexBadge(g, cx, cy, r, text, lines) {
  // Hexagon
  g.fillStyle = '#14284b';
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
    i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
  }
  g.closePath(); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 6; g.stroke();
  // Icon text inside hex
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(r * 0.42)}px 'Segoe UI', monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, cx, cy - r * 0.08);
  // Badge label below hex
  g.fillStyle = '#14284b';
  g.font = `bold ${Math.round(r * 0.3)}px 'Segoe UI', sans-serif`;
  if (lines && lines.length > 0) {
    lines.forEach((l, i) => g.fillText(l, cx, cy + r + (i - (lines.length - 1) / 2) * r * 0.38 + 14));
  }
}

function circuitDeco(g, startX, startY, dir) {
  g.strokeStyle = '#ff7a00'; g.lineWidth = 4; g.lineCap = 'round';
  const d = dir; // 1 = right, -1 = left
  g.beginPath();
  g.moveTo(startX, startY);
  g.lineTo(startX + d * 70, startY);
  g.lineTo(startX + d * 70, startY - 28);
  g.lineTo(startX + d * 140, startY - 28);
  g.stroke();
  [0, 70, 140].forEach(o => {
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.arc(startX + d * o, startY, 7, 0, Math.PI * 2); g.fill();
  });
  g.beginPath();
  g.moveTo(startX + d * 20, startY + 38);
  g.lineTo(startX + d * 100, startY + 38);
  g.lineTo(startX + d * 100, startY + 65);
  g.lineTo(startX + d * 170, startY + 65);
  g.stroke();
  [20, 100, 170].forEach(o => {
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.arc(startX + d * o, startY + 38, 5, 0, Math.PI * 2); g.fill();
  });
}

/* ── Icon drawers (all draw at scale `s` around cx,cy) ── */

function icoRobot(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  // Head
  g.beginPath(); g.roundRect(cx - s * .28, cy - s * .48, s * .56, s * .4, 7); g.fill();
  // Eyes
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.arc(cx - s * .1, cy - s * .3, s * .07, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s * .1, cy - s * .3, s * .07, 0, Math.PI * 2); g.fill();
  // Body
  g.fillStyle = '#14284b';
  g.fillRect(cx - s * .22, cy - s * .05, s * .44, s * .36);
  // Chest accent
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - s * .12, cy + s * .04, s * .24, s * .17, 3); g.fill();
  // Arms
  g.fillStyle = '#14284b';
  [-1, 1].forEach(d => g.fillRect(cx + d * s * .22, cy - s * .05, d * s * .17, s * .26));
  // Legs
  [-1, 1].forEach(d => g.fillRect(cx + d * s * .1, cy + s * .31, s * .09, s * .18));
}

function icoDrone(g, cx, cy, s) {
  const a = s * 0.42;
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx, dy]) => {
    g.strokeStyle = '#14284b'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + dx * a, cy + dy * a * 0.6); g.stroke();
    g.strokeStyle = '#ff7a00'; g.lineWidth = 4;
    g.beginPath(); g.arc(cx + dx * a, cy + dy * a * 0.6, s * .11, 0, Math.PI * 2); g.stroke();
  });
  g.fillStyle = '#14284b'; g.beginPath(); g.arc(cx, cy, s * .12, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#ff7a00'; g.beginPath(); g.arc(cx, cy + s * .12, 5, 0, Math.PI * 2); g.fill();
}

function icoVR(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - s * .48, cy - s * .26, s * .96, s * .52, 14); g.fill();
  [[cx - s*.2, cy],[cx + s*.2, cy]].forEach(([lx, ly]) => {
    g.fillStyle = '#1a9af7';
    g.beginPath(); g.ellipse(lx, ly, s*.15, s*.19, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(lx - 4, ly - 4, 4, 0, Math.PI * 2); g.fill();
  });
}

function icoAI(g, cx, cy, s) {
  const sq = s * .62;
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - sq/2, cy - sq/2, sq, sq, 9); g.fill();
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(sq * .42)}px monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('AI', cx, cy - 3);
  g.font = `${Math.round(sq * .24)}px monospace`;
  g.fillText('ML', cx, cy + sq * .22);
  g.fillStyle = '#fff';
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx, dy]) => {
    g.beginPath(); g.arc(cx + dx * sq * .4, cy + dy * sq * .4, 4, 0, Math.PI * 2); g.fill();
  });
}

function icoCode(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - s*.48, cy - s*.42, s*.96, s*.84, 10); g.fill();
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(s * .44)}px monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('</>', cx, cy + 2);
}

function icoChip(g, cx, cy, s) {
  const sq = s * .62;
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - sq/2, cy - sq/2, sq, sq, 9); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 4;
  [-sq*.22, 0, sq*.22].forEach(d => {
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([ax, ay]) => {
      g.beginPath();
      g.moveTo(cx + d*ax + ay*sq/2, cy + d*ay + ax*sq/2);
      g.lineTo(cx + d*ax + ay*(sq/2+12), cy + d*ay + ax*(sq/2+12));
      g.stroke();
    });
  });
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - sq*.28, cy - sq*.28, sq*.56, sq*.56, 5); g.fill();
}

function icoFlag(g, cx, cy, s) {
  const sq = s * .2, cols = 5, rows = 4;
  const sx = cx - cols*sq/2, sy = cy - s*.45;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    g.fillStyle = (r+c) % 2 === 0 ? '#111' : '#fff';
    g.fillRect(sx + c*sq, sy + r*sq, sq, sq);
  }
  g.fillStyle = '#14284b';
  g.fillRect(sx - 7, sy - 2, 5, s * .88);
}

function icoSoccer(g, cx, cy, s) {
  const r = s * .46;
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#111'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#111';
  [[0,-1],[-0.65,0.4],[0.65,0.4]].forEach(([dx, dy]) => {
    g.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i/5)*Math.PI*2 - Math.PI/2;
      const px = cx + dx*r*.5 + Math.cos(a)*r*.2;
      const py = cy + dy*r*.5 + Math.sin(a)*r*.2;
      i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath(); g.fill();
  });
}

function icoLine(g, cx, cy, s) {
  g.strokeStyle = '#ff7a00'; g.lineWidth = 9; g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - s*.5, cy + s*.28);
  g.quadraticCurveTo(cx - s*.1, cy - s*.45, cx, cy);
  g.quadraticCurveTo(cx + s*.1, cy + s*.45, cx + s*.5, cy - s*.28);
  g.stroke();
  g.fillStyle = '#14284b';
  [[cx - s*.38, cy + s*.18],[cx, cy],[cx + s*.38, cy - s*.18]].forEach(([px, py]) => {
    g.beginPath(); g.arc(px, py, 7, 0, Math.PI * 2); g.fill();
  });
}

function icoCone(g, cx, cy, s) {
  g.fillStyle = '#ff7a00';
  g.beginPath();
  g.moveTo(cx, cy - s*.5); g.lineTo(cx + s*.38, cy + s*.36); g.lineTo(cx - s*.38, cy + s*.36);
  g.closePath(); g.fill();
  g.fillStyle = '#fff'; g.fillRect(cx - s*.24, cy + s*.04, s*.48, s*.09);
  g.fillStyle = '#14284b'; g.fillRect(cx - s*.42, cy + s*.36, s*.84, s*.09);
}

function icoGear(g, cx, cy, s) {
  const r1 = s*.48, r2 = s*.33, teeth = 10;
  g.fillStyle = '#14284b';
  g.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? r1 : r2;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
  }
  g.closePath(); g.fill();
  g.fillStyle = '#fff8f0'; g.beginPath(); g.arc(cx, cy, r2*.45, 0, Math.PI * 2); g.fill();
}

function icoMonitor(g, cx, cy, s) {
  const mw = s*.9, mh = s*.64;
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - mw/2, cy - mh/2, mw, mh, 7); g.fill();
  g.fillStyle = '#1a3a5a'; g.fillRect(cx - mw/2+4, cy - mh/2+4, mw-8, mh-18);
  g.fillStyle = '#ff7a00'; g.fillRect(cx - mw/2+8, cy - mh/2+8, mw*.5, 6);
  g.fillStyle = '#4fc3f7'; g.fillRect(cx - mw/2+8, cy - mh/2+18, mw*.7, 4);
  g.fillStyle = '#14284b'; g.fillRect(cx - 7, cy + mh/2 - 2, 14, 10);
  g.fillRect(cx - 18, cy + mh/2 + 8, 36, 4);
}

function icoLayers(g, cx, cy, s) {
  [-s*.26, 0, s*.26].forEach((dy, i) => {
    g.fillStyle = i === 2 ? '#ff7a00' : '#14284b';
    g.beginPath();
    g.moveTo(cx, cy + dy - 13);
    g.lineTo(cx + s*.44, cy + dy); g.lineTo(cx, cy + dy + 13); g.lineTo(cx - s*.44, cy + dy);
    g.closePath(); g.fill();
  });
}

function icoPrinter(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.fillRect(cx - s*.11, cy - s*.48, s*.22, s*.48);
  g.fillRect(cx - s*.38, cy - s*.53, s*.76, s*.1);
  g.beginPath();
  g.moveTo(cx - s*.06, cy); g.lineTo(cx + s*.06, cy); g.lineTo(cx, cy + s*.13);
  g.closePath(); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(cx, cy + s*.13); g.lineTo(cx, cy + s*.46); g.stroke();
  g.fillStyle = '#ff7a00'; g.fillRect(cx - s*.32, cy + s*.38, s*.64, s*.11);
}

function icoBox(g, cx, cy, s) {
  const w = s * .68;
  g.fillStyle = '#ff7a00'; // top face
  g.beginPath(); g.moveTo(cx, cy - s*.44); g.lineTo(cx+w*.5, cy - s*.2);
  g.lineTo(cx, cy+s*.04); g.lineTo(cx - w*.5, cy - s*.2); g.closePath(); g.fill();
  g.fillStyle = '#14284b'; // left face
  g.beginPath(); g.moveTo(cx - w*.5, cy - s*.2); g.lineTo(cx, cy+s*.04);
  g.lineTo(cx, cy+s*.44); g.lineTo(cx - w*.5, cy + s*.2); g.closePath(); g.fill();
  g.fillStyle = '#1e3a60'; // right face
  g.beginPath(); g.moveTo(cx + w*.5, cy - s*.2); g.lineTo(cx, cy+s*.04);
  g.lineTo(cx, cy+s*.44); g.lineTo(cx + w*.5, cy + s*.2); g.closePath(); g.fill();
}

function icoPython(g, cx, cy, s) {
  g.fillStyle = '#3776ab';
  g.beginPath(); g.roundRect(cx - s*.44, cy - s*.48, s*.4, s*.48, 9); g.fill();
  g.fillStyle = '#ffd343';
  g.beginPath(); g.roundRect(cx + s*.04, cy, s*.4, s*.48, 9); g.fill();
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(cx - s*.11, cy - s*.26, 6, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s*.24, cy + s*.22, 6, 0, Math.PI * 2); g.fill();
}

function icoCpp(g, cx, cy, s) {
  g.fillStyle = '#00599c';
  g.beginPath(); g.arc(cx, cy, s*.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.font = `bold ${Math.round(s*.45)}px monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('C++', cx, cy + 2);
}

function icoWebDev(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - s*.48, cy - s*.42, s*.96, s*.84, 9); g.fill();
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(s*.4)}px monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('</>', cx, cy + 2);
}

function icoGitHub(g, cx, cy, s) {
  g.fillStyle = '#24292f';
  g.beginPath(); g.arc(cx, cy, s*.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.font = `bold ${Math.round(s*.28)}px 'Segoe UI', sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('GH', cx, cy + 1);
}

function icoIoT(g, cx, cy, s) {
  g.strokeStyle = '#14284b';
  [s*.46, s*.3, s*.15].forEach((r, i) => {
    g.lineWidth = 4 - i;
    g.beginPath(); g.arc(cx, cy + s*.1, r, Math.PI*1.1, Math.PI*1.9); g.stroke();
  });
  g.fillStyle = '#ff7a00'; g.beginPath(); g.arc(cx, cy + s*.1, s*.07, 0, Math.PI * 2); g.fill();
}

function robotMascot(g, cx, cy, s) {
  // Body
  g.fillStyle = '#fff'; g.strokeStyle = '#14284b'; g.lineWidth = 5;
  g.beginPath(); g.roundRect(cx - s*.38, cy - s*.18, s*.76, s*.62, 18); g.fill(); g.stroke();
  // Orange chest
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - s*.2, cy + s*.05, s*.4, s*.24, 9); g.fill();
  // SRI text on chest
  g.fillStyle = '#fff'; g.font = `bold ${Math.round(s*.12)}px 'Segoe UI', sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SRI', cx, cy + s*.17);
  // Head
  g.fillStyle = '#fff';
  g.beginPath(); g.roundRect(cx - s*.28, cy - s*.68, s*.56, s*.48, 16); g.fill(); g.stroke();
  // Antenna
  g.lineWidth = 4;
  g.beginPath(); g.moveTo(cx, cy - s*.68); g.lineTo(cx, cy - s*.86); g.stroke();
  g.fillStyle = '#ff7a00'; g.beginPath(); g.arc(cx, cy - s*.86, 9, 0, Math.PI * 2); g.fill();
  // Eyes (blue glow)
  g.fillStyle = '#1a9af7';
  g.beginPath(); g.arc(cx - s*.11, cy - s*.48, s*.085, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s*.11, cy - s*.48, s*.085, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(cx - s*.085, cy - s*.51, 3.5, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s*.135, cy - s*.51, 3.5, 0, Math.PI * 2); g.fill();
  // Smile
  g.strokeStyle = '#14284b'; g.lineWidth = 4;
  g.beginPath(); g.arc(cx, cy - s*.35, s*.09, 0.1*Math.PI, 0.9*Math.PI); g.stroke();
  // Arms
  g.fillStyle = '#ff7a00';
  // Left arm raised
  g.beginPath(); g.roundRect(cx - s*.62, cy - s*.12, s*.24, s*.46, 9); g.fill();
  g.strokeStyle = '#14284b'; g.lineWidth = 3; g.stroke();
  // Right arm
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx + s*.38, cy + s*.04, s*.24, s*.46, 9); g.fill(); g.stroke();
  // Legs
  g.fillStyle = '#14284b';
  [-1, 1].forEach(d => {
    g.beginPath(); g.roundRect(cx + d*s*.2 - s*.11, cy + s*.42, s*.22, s*.28, 7); g.fill();
  });
  // Orange shoes
  g.fillStyle = '#ff7a00';
  [-1, 1].forEach(d => {
    g.beginPath(); g.roundRect(cx + d*s*.2 - s*.13, cy + s*.68, s*.26, s*.09, 4); g.fill();
  });
}

/* ════════════════════════════════════════════════════════════════
   1.  TESTING ZONE MURAL  — Left wall, z ≈ -4, ry = PI/2
   Canvas: 2048 × 760 → PlaneGeometry(13.5, 5.0)
════════════════════════════════════════════════════════════════ */
export function createTestingZoneMural(scene) {
  const W = 2048, H = 760;
  const tex = canvasTex(W, H, (g) => {
    // ── Background ──
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // ── TOP SECTION: navy diagonal + SRI logo + title ──
    const topH = 290;

    // Navy left diagonal band
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W * 0.44, 0); g.lineTo(W * 0.33, topH); g.lineTo(0, topH);
    g.closePath(); g.fill();

    // Orange diagonal strip (right edge of navy)
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(W * 0.44, 0); g.lineTo(W * 0.47, 0);
    g.lineTo(W * 0.36, topH); g.lineTo(W * 0.33, topH);
    g.closePath(); g.fill();

    // SRI logo centred inside navy area
    sriLogo(g, 115, 118, 70);

    // Vertical divider line after logo
    g.strokeStyle = '#ff7a00'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(240, 36); g.lineTo(240, 254); g.stroke();

    // "Testing Zone" pill banner
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.roundRect(265, 60, 580, 155, 20); g.fill();
    g.fillStyle = '#fff';
    g.font = `bold 86px 'Segoe UI', sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('Testing Zone', 555, 140);

    // Orange chevron arrows right of title
    [W * 0.51, W * 0.535, W * 0.558].forEach(ax => {
      g.strokeStyle = '#ff7a00'; g.lineWidth = 14; g.lineCap = 'round';
      g.beginPath(); g.moveTo(ax, 70); g.lineTo(ax + 42, 143); g.lineTo(ax, 216); g.stroke();
    });

    // Orange underline across full width
    g.fillStyle = '#ff7a00';
    g.fillRect(0, topH, W, 10);

    // ── BOTTOM SECTION: 6 Icon Cards ──
    const icons = [
      { lbl: 'Robo Race',      fn: icoFlag },
      { lbl: 'Robo Soccer',    fn: icoSoccer },
      { lbl: 'Line Following', fn: icoLine },
      { lbl: 'Obstacle Test',  fn: icoCone },
      { lbl: 'Drone Test',     fn: icoDrone },
      { lbl: 'Project Testing',fn: icoGear },
    ];

    const cW = 288, cH = 350, cR = 18;
    const totalW = icons.length * cW + (icons.length - 1) * 32;
    const startX = (W - totalW) / 2 + cW / 2;
    const cy = topH + 10 + (H - topH - 10) / 2;

    icons.forEach(({ lbl, fn }, i) => {
      const cx = startX + i * (cW + 32);
      card(g, cx, cy, cW, cH, cR);
      fn(g, cx, cy - 50, 72);
      label(g, cx, cy + 100, lbl, 32, '#14284b');
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(13.5, 5.0),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(-19.74, 3.0, -4);
  mesh.rotation.y = Math.PI / 2;
  scene.add(mesh);
}

/* ════════════════════════════════════════════════════════════════
   2.  3D PRINTING ZONE MURAL  — Back wall, x ≈ -11, z = -14.73
   Canvas: 1600 × 580 → PlaneGeometry(10.5, 3.8)
════════════════════════════════════════════════════════════════ */
export function create3DPrintingMural(scene) {
  const W = 1600, H = 580;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // ── LEFT DIAGONAL CORNER ──
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(0,0); g.lineTo(90,0); g.lineTo(0,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(90,0); g.lineTo(145,0); g.lineTo(55,H); g.lineTo(0,H); g.closePath(); g.fill();

    // ── RIGHT DIAGONAL CORNER ──
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(W,0); g.lineTo(W-90,0); g.lineTo(W,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(W-90,0); g.lineTo(W-145,0); g.lineTo(W-55,H); g.lineTo(W,H); g.closePath(); g.fill();

    // Orange bottom bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H - 16, W, 16);

    // ── HEADER ROW (y: 30 → 220) ──
    // SRI logo block
    sriLogo(g, 230, 115, 68);

    // Vertical divider
    g.strokeStyle = '#14284b'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(360, 32); g.lineTo(360, 210); g.stroke();

    // Hex badge
    hexBadge(g, 445, 115, 72, '3D', ['3D Printing', 'Zone']);

    // Zone title text
    g.fillStyle = '#14284b';
    g.font = `bold 72px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('3D Printing Zone', 548, 95);
    // Orange underline
    g.fillStyle = '#ff7a00'; g.fillRect(548, 155, 650, 7);
    // Sub text
    g.fillStyle = '#14284b';
    g.font = `32px 'Segoe UI', sans-serif`;
    g.fillText('Design  >  Slice  >  Print  >  Prototype', 548, 192);

    // Circuit decoration (top right)
    circuitDeco(g, W - 320, 80, 1);

    // ── FLOW CARDS (bottom half: y: 240 → H-30) ──
    const steps = [
      { lbl: 'Design',    fn: icoMonitor },
      { lbl: 'Slice',     fn: icoLayers },
      { lbl: 'Print',     fn: icoPrinter },
      { lbl: 'Prototype', fn: icoBox },
    ];

    const cW = 240, cH = 240, cR = 18;
    const arrowGap = 60;
    const totalW = steps.length * cW + (steps.length - 1) * arrowGap;
    const startX = (W - totalW) / 2 + cW / 2;
    const cy = 350;

    steps.forEach(({ lbl, fn }, i) => {
      const cx = startX + i * (cW + arrowGap);
      card(g, cx, cy, cW, cH, cR);
      fn(g, cx, cy - 42, 60);
      label(g, cx, cy + 72, lbl, 30, '#14284b');
      if (i < steps.length - 1) arrow(g, cx + cW/2 + arrowGap/2, cy, 28);
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 3.8),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(-11, 3.5, -14.73);
  scene.add(mesh);
}

/* ════════════════════════════════════════════════════════════════
   3.  CODING ZONE MURAL  — Back wall, x ≈ 11, z = -14.73
   Canvas: 1600 × 580 → PlaneGeometry(10.5, 3.8)
════════════════════════════════════════════════════════════════ */
export function createCodingZoneMural(scene) {
  const W = 1600, H = 580;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Diagonal corners (same as 3D Printing)
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(0,0); g.lineTo(90,0); g.lineTo(0,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(90,0); g.lineTo(145,0); g.lineTo(55,H); g.lineTo(0,H); g.closePath(); g.fill();
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(W,0); g.lineTo(W-90,0); g.lineTo(W,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(W-90,0); g.lineTo(W-145,0); g.lineTo(W-55,H); g.lineTo(W,H); g.closePath(); g.fill();

    g.fillStyle = '#ff7a00'; g.fillRect(0, H - 16, W, 16);

    // ── HEADER ──
    sriLogo(g, 230, 115, 68);
    g.strokeStyle = '#14284b'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(360, 32); g.lineTo(360, 210); g.stroke();

    hexBadge(g, 445, 115, 72, '</>', ['Coding', 'Zone']);

    g.fillStyle = '#14284b';
    g.font = `bold 72px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('Coding Zone', 548, 95);
    g.fillStyle = '#ff7a00'; g.fillRect(548, 155, 530, 7);
    g.fillStyle = '#14284b';
    g.font = `32px 'Segoe UI', sans-serif`;
    g.fillText('Python  >  C++  >  Web Dev  >  GitHub', 548, 192);

    circuitDeco(g, W - 320, 80, 1);

    // ── FLOW CARDS ──
    const steps = [
      { lbl: 'Python',  fn: icoPython },
      { lbl: 'C++',     fn: icoCpp },
      { lbl: 'Web Dev', fn: icoWebDev },
      { lbl: 'GitHub',  fn: icoGitHub },
    ];

    const cW = 240, cH = 240, cR = 18, arrowGap = 60;
    const totalW = steps.length * cW + (steps.length - 1) * arrowGap;
    const startX = (W - totalW) / 2 + cW / 2;
    const cy = 350;

    steps.forEach(({ lbl, fn }, i) => {
      const cx = startX + i * (cW + arrowGap);
      card(g, cx, cy, cW, cH, cR);
      fn(g, cx, cy - 42, 60);
      label(g, cx, cy + 72, lbl, 30, '#14284b');
      if (i < steps.length - 1) arrow(g, cx + cW/2 + arrowGap/2, cy, 28);
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 3.8),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(11, 3.5, -14.73);
  scene.add(mesh);
}

/* ════════════════════════════════════════════════════════════════
   4.  MAIN BACK-WALL MURAL  — x = 0, z = -14.73
   "Build•Learn•Innovate" + robot mascot + tech icon columns
   Canvas: 1300 × 880 → PlaneGeometry(8.8, 5.9)
════════════════════════════════════════════════════════════════ */
export function createMainWallMural(scene) {
  const W = 1300, H = 880;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange bottom bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H - 55, W, 55);
    g.fillStyle = '#14284b'; g.fillRect(0, H - 25, W, 25);

    // ── "Build / Learn / Innovate" stacked pills ──
    const pillW = 420, pillH = 90, pillR = 16;
    const pillX = W / 2;
    [
      { text: 'Build',    bg: '#14284b', fg: '#fff', y: 60 },
      { text: 'Learn',    bg: '#ff7a00', fg: '#fff', y: 165 },
      { text: 'Innovate', bg: '#ff7a00', fg: '#fff', y: 270 },
    ].forEach(({ text, bg, fg, y }) => {
      g.fillStyle = bg;
      g.beginPath(); g.roundRect(pillX - pillW/2, y, pillW, pillH, pillR); g.fill();
      g.fillStyle = fg;
      g.font = `bold 54px 'Segoe UI', sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(text, pillX, y + pillH / 2);
    });

    // ── SRI Robot Mascot (centre lower) ──
    robotMascot(g, W / 2, 580, 165);

    // ── LEFT ICON COLUMN: Coding, Electronics, Robotics ──
    const leftIcons = [
      { lbl: 'Coding',      fn: icoCode },
      { lbl: 'Electronics', fn: icoChip },
      { lbl: 'Robotics',    fn: icoRobot },
    ];
    const colW = 230, colH = 190, colR = 14;
    const leftCX = 150;
    leftIcons.forEach(({ lbl, fn }, i) => {
      const cy = 160 + i * 220;
      g.fillStyle = '#fff8f0'; g.strokeStyle = '#14284b'; g.lineWidth = 4;
      g.beginPath(); g.roundRect(leftCX - colW/2, cy - colH/2, colW, colH, colR); g.fill(); g.stroke();
      fn(g, leftCX, cy - 32, 54);
      label(g, leftCX, cy + 60, lbl, 28, '#14284b');
    });

    // ── RIGHT ICON COLUMN: Drones, AR/VR, AI/ML ──
    const rightIcons = [
      { lbl: 'Drones', fn: icoDrone },
      { lbl: 'AR / VR', fn: icoVR },
      { lbl: 'AI / ML', fn: icoAI },
    ];
    const rightCX = W - 150;
    rightIcons.forEach(({ lbl, fn }, i) => {
      const cy = 160 + i * 220;
      g.fillStyle = '#fff8f0'; g.strokeStyle = '#14284b'; g.lineWidth = 4;
      g.beginPath(); g.roundRect(rightCX - colW/2, cy - colH/2, colW, colH, colR); g.fill(); g.stroke();
      fn(g, rightCX, cy - 32, 54);
      label(g, rightCX, cy + 60, lbl, 28, '#14284b');
    });

    // Gear decorations near mascot
    function gearDeco(cx, cy, r) {
      const teeth = 8;
      g.fillStyle = '#ff7a00';
      g.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const a = (i / (teeth * 2)) * Math.PI * 2;
        const rad = i % 2 === 0 ? r : r * .74;
        const px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad;
        i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.closePath(); g.fill();
      g.fillStyle = '#fff8f0'; g.beginPath(); g.arc(cx, cy, r * .36, 0, Math.PI * 2); g.fill();
    }
    gearDeco(W * .32, 395, 28);
    gearDeco(W * .68, 370, 22);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.8, 5.9),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(0, 3.3, -14.73);
  scene.add(mesh);
}

/* ════════════════════════════════════════════════════════════════
   5.  ROBOTICS LAB WALL MURAL  — Right wall, x = 19.78
   Two sections: main title + icons, innovation cards
════════════════════════════════════════════════════════════════ */
export function createRoboticsLabMural(scene) {
  // ── SECTION A: Title + left icon pills (z = -11, 10m wide) ──
  const W = 2048, H = 1000;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange bottom bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H - 50, W, 50);

    // Navy left diagonal
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W * .18, 0); g.lineTo(0, H * .55); g.closePath(); g.fill();
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(W * .18, 0); g.lineTo(W * .215, 0); g.lineTo(W * .035, H * .55); g.lineTo(0, H * .55); g.closePath(); g.fill();

    // ── SRI LOGO (top-left inside navy) ──
    sriLogo(g, 110, 155, 80);

    // ── Title area (right of logo) ──
    // Orange vertical divider
    g.fillStyle = '#ff7a00'; g.fillRect(258, 48, 8, 240);

    // "ROBOTICS" in orange
    g.fillStyle = '#ff7a00';
    g.font = `bold 108px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'top';
    g.fillText('ROBOTICS', 290, 48);

    // "LAB" in navy beside it
    const robW = g.measureText('ROBOTICS ').width;
    g.fillStyle = '#14284b';
    g.fillText('LAB', 290 + robW, 48);

    // Orange underline
    g.fillStyle = '#ff7a00'; g.fillRect(290, 170, 950, 8);

    // "LEARN • BUILD • CODE • INNOVATE" subtitle
    g.fillStyle = '#14284b';
    g.font = `bold 42px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'top';
    g.fillText('LEARN  •  BUILD  •  CODE  •  INNOVATE', 290, 196);

    // Circuit decoration (far right)
    circuitDeco(g, W - 280, 90, 1);

    // ── ICON PILLS (left column, below title) ──
    const pills = [
      { lbl: 'Robotics',  fn: icoRobot },
      { lbl: 'AI / ML',   fn: icoAI },
      { lbl: 'IoT',       fn: icoIoT },
      { lbl: 'Drones',    fn: icoDrone },
      { lbl: 'AR / VR',   fn: icoVR },
    ];
    const pW = 380, pH = 100, pR = 50;
    pills.forEach(({ lbl, fn }, i) => {
      const px = 300 + pW / 2;
      const py = 340 + i * 118;
      g.fillStyle = 'rgba(20,40,75,0.07)';
      g.strokeStyle = '#14284b'; g.lineWidth = 4;
      g.beginPath(); g.roundRect(px - pW/2, py - pH/2, pW, pH, pR); g.fill(); g.stroke();
      fn(g, px - 130, py, 34);
      g.fillStyle = '#14284b';
      g.font = `bold 34px 'Segoe UI', sans-serif`;
      g.textAlign = 'left'; g.textBaseline = 'middle';
      g.fillText(lbl, px - 80, py + 2);
    });

    // ── Big feature cards (right of pills) ──
    const cards3 = [
      { title: '3D Printing',  fn: icoPrinter },
      { title: 'Robotics',     fn: icoRobot },
      { title: 'Smart Lab',    fn: icoAI },
    ];
    const cW = 310, cH = 420, cR = 18;
    const cardsStartX = 760, cardsY = 600;
    const cardGap = 340;
    cards3.forEach(({ title, fn }, i) => {
      const cx = cardsStartX + i * cardGap;
      card(g, cx, cardsY, cW, cH, cR);
      fn(g, cx, cardsY - 90, 76);
      label(g, cx, cardsY + 110, title, 36, '#14284b');
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 5.1),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(19.76, 3.3, -8);
  mesh.rotation.y = -Math.PI / 2;
  scene.add(mesh);
}
