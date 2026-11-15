/**
 * props/wallmurals.js
 * Zone-specific wall murals matching the SRI lab reference images.
 * Each mural is a large CanvasTexture PlaneGeometry placed on the wall.
 * Images referenced:
 *   - Testing Zone wall  (orange/navy, 6 activity icons, SRI logo)
 *   - 3D Printing Zone   (SRI logo + hexagon badge, Design>Slice>Print>Prototype flow, circuit lines)
 *   - Coding Zone        (SRI logo + </> badge, Python>C++>WebDev>GitHub flow, circuit lines)
 *   - Back main wall     (Build•Learn•Innovate, SRI robot mascot, left+right icon columns)
 */
import * as THREE from 'three';
import { put } from '../../utils/geometry.js';
import { canvasTex } from '../../utils/materials.js';

/* ─── SHARED DRAWING HELPERS ─────────────────────────────────── */

/** Draw SRI flower logo at (cx, cy) with radius r */
function drawSriLogo(g, cx, cy, r) {
  // Flower petals (orange)
  g.fillStyle = '#ff7a00';
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const px = cx + Math.cos(angle) * r * 0.55;
    const py = cy + Math.sin(angle) * r * 0.55;
    g.beginPath();
    g.ellipse(px, py, r * 0.28, r * 0.18, angle, 0, Math.PI * 2);
    g.fill();
  }
  // Centre circle orange
  g.beginPath();
  g.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
  g.fillStyle = '#ff7a00';
  g.fill();
  // Orange underline arc (wave)
  g.strokeStyle = '#ff7a00';
  g.lineWidth = r * 0.12;
  g.beginPath();
  g.arc(cx, cy + r * 0.9, r * 0.6, Math.PI * 0.1, Math.PI * 0.9);
  g.stroke();
  // "SRI" text
  g.fillStyle = '#14284b';
  g.font = `bold ${r * 0.7}px 'Segoe UI', system-ui, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('SRI', cx, cy + r * 1.55);
}

/** Orange circuit-line decoration */
function drawCircuitLines(g, x, y, dir = 1) {
  g.strokeStyle = '#ff7a00';
  g.lineWidth = 4;
  g.setLineDash([]);
  // Horizontal segment
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + dir * 80, y);
  g.lineTo(x + dir * 80, y - 25);
  g.lineTo(x + dir * 140, y - 25);
  g.stroke();
  // Dot nodes
  [0, 80, 140].forEach(d => {
    g.beginPath();
    g.arc(x + dir * d, y, 7, 0, Math.PI * 2);
    g.fillStyle = '#ff7a00';
    g.fill();
  });
  // Second line lower
  g.beginPath();
  g.moveTo(x + dir * 20, y + 35);
  g.lineTo(x + dir * 100, y + 35);
  g.lineTo(x + dir * 100, y + 60);
  g.lineTo(x + dir * 170, y + 60);
  g.stroke();
  [20, 100, 170].forEach(d => {
    g.beginPath();
    g.arc(x + dir * d, y + 35, 5, 0, Math.PI * 2);
    g.fillStyle = '#ff7a00';
    g.fill();
  });
}

/** Draw an orange rounded-rect icon card with text */
function drawIconCard(g, cx, cy, cw, ch, r, labelLines, iconDrawFn) {
  // Card background
  g.fillStyle = '#fff8f0';
  g.beginPath();
  g.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, r);
  g.fill();
  // Orange border
  g.strokeStyle = '#ff7a00';
  g.lineWidth = 4;
  g.stroke();
  // Icon area (top 55%)
  if (iconDrawFn) iconDrawFn(g, cx, cy - ch * 0.12, cw * 0.55);
  // Label (bottom)
  g.fillStyle = '#14284b';
  g.font = `bold ${Math.round(cw * 0.11)}px 'Segoe UI', system-ui, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  if (typeof labelLines === 'string') labelLines = [labelLines];
  labelLines.forEach((line, i) => {
    g.fillText(line, cx, cy + ch * 0.33 + i * Math.round(cw * 0.13));
  });
}

/** Arrow separator between flow steps */
function drawArrow(g, cx, cy, size) {
  g.fillStyle = '#14284b';
  g.beginPath();
  g.moveTo(cx - size * 0.1, cy - size * 0.5);
  g.lineTo(cx + size * 0.5, cy);
  g.lineTo(cx - size * 0.1, cy + size * 0.5);
  g.closePath();
  g.fill();
}

/* ─── DIAGONAL ORANGE CORNER ACCENT ─────────────────────────── */
function drawDiagonalCorner(g, side, W, H) {
  // side: 'left' or 'right'
  g.fillStyle = '#ff7a00';
  if (side === 'left') {
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W * 0.07, 0); g.lineTo(0, H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(W * 0.07, 0); g.lineTo(W * 0.115, 0); g.lineTo(W * 0.045, H); g.lineTo(0, H); g.closePath(); g.fill();
  } else {
    g.beginPath();
    g.moveTo(W, 0); g.lineTo(W * 0.93, 0); g.lineTo(W, H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(W * 0.93, 0); g.lineTo(W * 0.885, 0); g.lineTo(W * 0.955, H); g.lineTo(W, H); g.closePath(); g.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════
   1. TESTING ZONE WALL MURAL
   Left wall (x = -19.76), z = -3, facing into room (ry = PI/2)
   Full wall mural: cream bg, navy/orange banner, 6 icon cards
══════════════════════════════════════════════════════════════ */
export function createTestingZoneMural(scene) {
  const W = 2048, H = 768;
  const tex = canvasTex(W, H, (g) => {
    // 1. Cream background
    g.fillStyle = '#fff8f0';
    g.fillRect(0, 0, W, H);

    // 2. Top navy diagonal background band
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W * 0.52, 0); g.lineTo(W * 0.42, H * 0.5); g.lineTo(0, H * 0.5);
    g.closePath(); g.fill();

    // Orange diagonal stripes (left side)
    [[W * 0.42, W * 0.455], [W * 0.455, W * 0.48]].forEach(([x1, x2], idx) => {
      g.fillStyle = idx === 0 ? '#ff7a00' : '#ff7a00';
      g.globalAlpha = idx === 0 ? 1 : 0.5;
      g.beginPath();
      g.moveTo(x1, 0); g.lineTo(x2, 0); g.lineTo(x2 - W * 0.1, H * 0.5); g.lineTo(x1 - W * 0.1, H * 0.5);
      g.closePath(); g.fill();
    });
    g.globalAlpha = 1;

    // 3. SRI Flower logo (top-left inside navy area)
    drawSriLogo(g, 90, 85, 50);

    // 4. "Testing Zone" title on navy bg
    g.fillStyle = '#14284b';
    g.fillRect(W * 0.19, 25, W * 0.28, 115);
    // Orange pill behind "Testing Zone" text
    g.fillStyle = '#ff7a00'; // actually draw rounded rect
    g.beginPath();
    g.roundRect(W * 0.19, 25, W * 0.28, 115, 18);
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = `bold 72px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('Testing Zone', W * 0.33, 85);

    // 5. Orange chevron arrows (right side of title)
    const chev = (x) => {
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 14;
      g.beginPath();
      g.moveTo(x, 30); g.lineTo(x + 38, 85); g.lineTo(x, 140);
      g.stroke();
    };
    [W * 0.5, W * 0.52, W * 0.54].forEach(chev);

    // 6. SRI logo bottom line
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(20, H * 0.52);
    g.lineTo(W * 0.44, H * 0.52);
    g.stroke();

    // 7. Six activity icon cards (bottom row)
    const icons = [
      { label: 'Robo Race',    draw: (g, cx, cy, s) => drawCheckeredFlag(g, cx, cy, s) },
      { label: 'Robo Soccer',  draw: (g, cx, cy, s) => drawSoccerBall(g, cx, cy, s) },
      { label: 'Line Following',draw: (g, cx, cy, s) => drawLineFollow(g, cx, cy, s) },
      { label: 'Obstacle Test', draw: (g, cx, cy, s) => drawCone(g, cx, cy, s) },
      { label: 'Drone Test',   draw: (g, cx, cy, s) => drawDroneIcon(g, cx, cy, s) },
      { label: 'Project Testing',draw: (g, cx, cy, s) => drawGear(g, cx, cy, s) },
    ];
    const cardW = 290, cardH = 230, startX = 125, cardY = H * 0.69, gap = 310;
    icons.forEach(({ label, draw }, i) => {
      drawIconCard(g, startX + i * gap, cardY, cardW, cardH, 22, label, draw);
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 5.5),
    new THREE.MeshBasicMaterial({ map: tex, transparent: false })
  );
  put(scene, mesh, -19.74, 3.0, -4, Math.PI / 2);
}

/* ═══════════════════════════════════════════════════════════════
   2. 3D PRINTING ZONE MURAL  — back wall left bay (x ≈ -11)
══════════════════════════════════════════════════════════════ */
export function create3DPrintingMural(scene) {
  const W = 1600, H = 600;
  const tex = canvasTex(W, H, (g) => {
    // Cream base
    g.fillStyle = '#fff8f0';
    g.fillRect(0, 0, W, H);

    // Left diagonal corner accent
    drawDiagonalCorner(g, 'left', W, H);

    // --- SRI Logo ---
    drawSriLogo(g, 185, 125, 55);

    // Vertical divider between logo and title
    g.strokeStyle = '#14284b';
    g.lineWidth = 6;
    g.beginPath(); g.moveTo(300, 40); g.lineTo(300, 220); g.stroke();

    // Hexagon badge for "3D Printing Zone"
    drawHexBadge(g, 390, 130, 90, '#14284b', '3D Printing\nZone', '#fff');

    // --- Zone title text (right of badge) ---
    g.fillStyle = '#14284b';
    g.font = `bold 68px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('3D Printing Zone', 490, 90);

    // Orange underline
    g.fillStyle = '#ff7a00';
    g.fillRect(490, 158, 580, 7);

    // Circuit lines decoration (right side)
    drawCircuitLines(g, W * 0.78, H * 0.18, 1);

    // Flow: Design > Slice > Print > Prototype
    const steps = [
      { label: 'Design',    draw: (g, cx, cy, s) => drawMonitorIcon(g, cx, cy, s) },
      { label: 'Slice',     draw: (g, cx, cy, s) => drawLayersIcon(g, cx, cy, s) },
      { label: 'Print',     draw: (g, cx, cy, s) => drawPrinterIcon(g, cx, cy, s) },
      { label: 'Prototype', draw: (g, cx, cy, s) => drawBoxIcon(g, cx, cy, s) },
    ];
    const startX = 220, stepGap = 330, cy = H * 0.76, cw = 240, ch = 200;
    steps.forEach(({ label, draw }, i) => {
      const cx = startX + i * stepGap;
      drawIconCard(g, cx, cy, cw, ch, 20, label, draw);
      if (i < steps.length - 1) {
        drawArrow(g, cx + cw / 2 + 42, cy, 38);
      }
    });

    // Right diagonal
    drawDiagonalCorner(g, 'right', W, H);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 3.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: false })
  );
  put(scene, mesh, -11, 3.5, -14.73);
}

/* ═══════════════════════════════════════════════════════════════
   3. CODING ZONE MURAL  — back wall right bay (x ≈ 11)
══════════════════════════════════════════════════════════════ */
export function createCodingZoneMural(scene) {
  const W = 1600, H = 600;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0';
    g.fillRect(0, 0, W, H);

    drawDiagonalCorner(g, 'left', W, H);

    drawSriLogo(g, 185, 125, 55);

    g.strokeStyle = '#14284b';
    g.lineWidth = 6;
    g.beginPath(); g.moveTo(300, 40); g.lineTo(300, 220); g.stroke();

    // </> hexagon badge
    drawHexBadge(g, 390, 130, 90, '#14284b', '</>', '#fff');

    g.fillStyle = '#14284b';
    g.font = `bold 68px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Coding Zone', 490, 90);

    g.fillStyle = '#ff7a00';
    g.fillRect(490, 158, 480, 7);

    // Circuit lines right
    drawCircuitLines(g, W * 0.78, H * 0.18, 1);

    // Flow: Python > C++ > Web Dev > GitHub
    const steps = [
      { label: 'Python',  draw: (g, cx, cy, s) => drawPythonIcon(g, cx, cy, s) },
      { label: 'C++',     draw: (g, cx, cy, s) => drawCppIcon(g, cx, cy, s) },
      { label: 'Web Dev', draw: (g, cx, cy, s) => drawWebDevIcon(g, cx, cy, s) },
      { label: 'GitHub',  draw: (g, cx, cy, s) => drawGitHubIcon(g, cx, cy, s) },
    ];
    const startX = 220, stepGap = 330, cy = H * 0.76, cw = 240, ch = 200;
    steps.forEach(({ label, draw }, i) => {
      const cx = startX + i * stepGap;
      drawIconCard(g, cx, cy, cw, ch, 20, label, draw);
      if (i < steps.length - 1) drawArrow(g, cx + cw / 2 + 42, cy, 38);
    });

    drawDiagonalCorner(g, 'right', W, H);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 3.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: false })
  );
  put(scene, mesh, 11, 3.5, -14.73);
}

/* ═══════════════════════════════════════════════════════════════
   4. MAIN BACK-WALL CENTRE MURAL
   "Build • Learn • Innovate" with robot mascot + tech icons
   Placed on the flat cream wall at z = -15 between x = -7 and +7
══════════════════════════════════════════════════════════════ */
export function createMainWallMural(scene) {
  const W = 1400, H = 900;
  const tex = canvasTex(W, H, (g) => {
    // Cream
    g.fillStyle = '#fff8f0';
    g.fillRect(0, 0, W, H);

    // Orange bottom stripe
    g.fillStyle = '#ff7a00';
    g.fillRect(0, H * 0.86, W, H);
    // Navy layer on top of orange
    g.fillStyle = '#14284b';
    g.fillRect(0, H * 0.9, W, H);

    // "Build / Learn / Innovate" stacked pill labels (centre)
    const words = [
      { text: 'Build',    bg: '#14284b', fg: '#fff' },
      { text: 'Learn',    bg: '#ff7a00', fg: '#fff' },
      { text: 'Innovate', bg: '#ff7a00', fg: '#fff' },
    ];
    words.forEach(({ text, bg, fg }, i) => {
      const bx = W * 0.34, by = 60 + i * 115, bw = W * 0.32, bh = 95;
      g.fillStyle = bg;
      g.beginPath(); g.roundRect(bx, by, bw, bh, 16); g.fill();
      g.fillStyle = fg;
      g.font = `bold 56px 'Segoe UI', system-ui, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(text, bx + bw / 2, by + bh / 2);
    });

    // SRI Robot mascot silhouette (centre lower)
    drawRobotMascot(g, W / 2, H * 0.65, 170);

    // === LEFT COLUMN icons: Coding, Electronics, Robotics ===
    const leftIcons = [
      { label: 'Coding',      draw: (g, cx, cy, s) => drawCodeBracket(g, cx, cy, s) },
      { label: 'Electronics', draw: (g, cx, cy, s) => drawChipIcon(g, cx, cy, s) },
      { label: 'Robotics',    draw: (g, cx, cy, s) => drawRobotIcon(g, cx, cy, s) },
    ];
    leftIcons.forEach(({ label, draw }, i) => {
      const cx = W * 0.1, cy = 160 + i * 230;
      drawOutlineIconCard(g, cx, cy, 190, 170, label, draw);
    });

    // === RIGHT COLUMN icons: Drones, AR/VR, AI/ML ===
    const rightIcons = [
      { label: 'Drones', draw: (g, cx, cy, s) => drawDroneIcon(g, cx, cy, s) },
      { label: 'AR / VR', draw: (g, cx, cy, s) => drawVRIcon(g, cx, cy, s) },
      { label: 'AI / ML', draw: (g, cx, cy, s) => drawAIIcon(g, cx, cy, s) },
    ];
    rightIcons.forEach(({ label, draw }, i) => {
      const cx = W * 0.9, cy = 160 + i * 230;
      drawOutlineIconCard(g, cx, cy, 190, 170, label, draw);
    });

    // Gear decoration near mascot
    drawGearDecor(g, W * 0.3, H * 0.52, 32);
    drawGearDecor(g, W * 0.68, H * 0.48, 24);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6.5),
    new THREE.MeshBasicMaterial({ map: tex, transparent: false })
  );
  put(scene, mesh, 0, 3.3, -14.73);
}

/* ─── ICON HELPER DRAWERS ─────────────────────────────────── */

function drawCheckeredFlag(g, cx, cy, s) {
  const sq = s * 0.22;
  const cols = 5, rows = 4;
  const startX = cx - cols * sq / 2, startY = cy - s * 0.5;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      g.fillStyle = (r + c) % 2 === 0 ? '#111' : '#fff';
      g.fillRect(startX + c * sq, startY + r * sq, sq, sq);
    }
  }
  // Flag pole
  g.fillStyle = '#14284b';
  g.fillRect(cx - cols * sq / 2 - 8, cy - s * 0.52, 6, s * 0.9);
}

function drawSoccerBall(g, cx, cy, s) {
  const r = s * 0.52;
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(cx, cy - s * 0.05, r, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#111'; g.lineWidth = 2.5;
  g.stroke();
  // Pentagons
  g.fillStyle = '#111';
  [[0, -1], [-0.7, 0.4], [0.7, 0.4]].forEach(([dx, dy]) => {
    g.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = cx + dx * r * 0.55 + Math.cos(a) * r * 0.22;
      const py = (cy - s * 0.05) + dy * r * 0.55 + Math.sin(a) * r * 0.22;
      i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath(); g.fill();
  });
}

function drawLineFollow(g, cx, cy, s) {
  g.strokeStyle = '#ff7a00';
  g.lineWidth = 10;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - s * 0.5, cy + s * 0.3);
  g.quadraticCurveTo(cx - s * 0.1, cy - s * 0.5, cx, cy);
  g.quadraticCurveTo(cx + s * 0.1, cy + s * 0.5, cx + s * 0.5, cy - s * 0.3);
  g.stroke();
  // Dots on path
  g.fillStyle = '#14284b';
  [[cx - s * 0.4, cy + s * 0.2], [cx, cy], [cx + s * 0.4, cy - s * 0.2]].forEach(([px, py]) => {
    g.beginPath(); g.arc(px, py, 8, 0, Math.PI * 2); g.fill();
  });
}

function drawCone(g, cx, cy, s) {
  // Traffic cone
  g.fillStyle = '#ff7a00';
  g.beginPath();
  g.moveTo(cx, cy - s * 0.52);
  g.lineTo(cx + s * 0.4, cy + s * 0.38);
  g.lineTo(cx - s * 0.4, cy + s * 0.38);
  g.closePath(); g.fill();
  // White stripe
  g.fillStyle = '#fff';
  g.fillRect(cx - s * 0.25, cy + s * 0.05, s * 0.5, s * 0.1);
  // Base
  g.fillStyle = '#14284b';
  g.fillRect(cx - s * 0.45, cy + s * 0.38, s * 0.9, s * 0.1);
}

function drawDroneIcon(g, cx, cy, s) {
  const a = s * 0.42; // arm length
  // 4 arms
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx, dy]) => {
    g.strokeStyle = '#14284b'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + dx * a, cy + dy * a * 0.6); g.stroke();
    // Propeller circle
    g.strokeStyle = '#ff7a00'; g.lineWidth = 4;
    g.beginPath(); g.arc(cx + dx * a, cy + dy * a * 0.6, s * 0.12, 0, Math.PI * 2); g.stroke();
  });
  // Centre body
  g.fillStyle = '#14284b';
  g.beginPath(); g.arc(cx, cy, s * 0.14, 0, Math.PI * 2); g.fill();
  // Camera dot
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.arc(cx, cy + s * 0.14, 5, 0, Math.PI * 2); g.fill();
}

function drawGear(g, cx, cy, s) {
  const r1 = s * 0.5, r2 = s * 0.35, teeth = 10;
  g.fillStyle = '#14284b';
  g.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? r1 : r2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.closePath(); g.fill();
  g.fillStyle = '#fff8f0';
  g.beginPath(); g.arc(cx, cy, r2 * 0.5, 0, Math.PI * 2); g.fill();
}

function drawGearDecor(g, cx, cy, r) {
  const teeth = 8;
  g.fillStyle = '#ff7a00';
  g.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rad = i % 2 === 0 ? r : r * 0.75;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.closePath(); g.fill();
  g.fillStyle = '#fff8f0';
  g.beginPath(); g.arc(cx, cy, r * 0.38, 0, Math.PI * 2); g.fill();
}

function drawMonitorIcon(g, cx, cy, s) {
  const mw = s * 0.9, mh = s * 0.68;
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - mw/2, cy - mh/2, mw, mh, 8); g.fill();
  g.fillStyle = '#1a3a5a';
  g.fillRect(cx - mw/2 + 4, cy - mh/2 + 4, mw - 8, mh - 18);
  // Orange screen content
  g.fillStyle = '#ff7a00';
  g.fillRect(cx - mw/2 + 8, cy - mh/2 + 8, mw * 0.5, 7);
  g.fillStyle = '#4fc3f7';
  g.fillRect(cx - mw/2 + 8, cy - mh/2 + 20, mw * 0.7, 5);
  // Stand
  g.fillStyle = '#14284b';
  g.fillRect(cx - 8, cy + mh/2 - 2, 16, 12);
  g.fillRect(cx - 20, cy + mh/2 + 10, 40, 5);
}

function drawLayersIcon(g, cx, cy, s) {
  [[0, -s * 0.28], [0, 0], [0, s * 0.28]].forEach(([dx, dy]) => {
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(cx, cy + dy - 15);
    g.lineTo(cx + s * 0.45, cy + dy);
    g.lineTo(cx, cy + dy + 15);
    g.lineTo(cx - s * 0.45, cy + dy);
    g.closePath(); g.fill();
  });
  // Highlight front
  g.fillStyle = '#ff7a00';
  const dy = s * 0.28;
  g.beginPath();
  g.moveTo(cx, cy + dy - 15);
  g.lineTo(cx + s * 0.45, cy + dy);
  g.lineTo(cx, cy + dy + 15);
  g.lineTo(cx - s * 0.45, cy + dy);
  g.closePath(); g.fill();
}

function drawPrinterIcon(g, cx, cy, s) {
  // Nozzle / extruder head
  g.fillStyle = '#14284b';
  g.fillRect(cx - s * 0.12, cy - s * 0.5, s * 0.24, s * 0.5);
  // Print head
  g.fillRect(cx - s * 0.4, cy - s * 0.55, s * 0.8, s * 0.1);
  // Nozzle tip
  g.beginPath();
  g.moveTo(cx - s * 0.06, cy);
  g.lineTo(cx + s * 0.06, cy);
  g.lineTo(cx, cy + s * 0.14);
  g.closePath(); g.fill();
  // Orange extruded material line
  g.strokeStyle = '#ff7a00'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(cx, cy + s * 0.14); g.lineTo(cx, cy + s * 0.5); g.stroke();
  // Printed base
  g.fillStyle = '#ff7a00';
  g.fillRect(cx - s * 0.35, cy + s * 0.4, s * 0.7, s * 0.12);
}

function drawBoxIcon(g, cx, cy, s) {
  const w = s * 0.7;
  // Top face
  g.fillStyle = '#ff7a00';
  g.beginPath();
  g.moveTo(cx, cy - s * 0.45);
  g.lineTo(cx + w * 0.5, cy - s * 0.2);
  g.lineTo(cx, cy + s * 0.05);
  g.lineTo(cx - w * 0.5, cy - s * 0.2);
  g.closePath(); g.fill();
  // Left face
  g.fillStyle = '#14284b';
  g.beginPath();
  g.moveTo(cx - w * 0.5, cy - s * 0.2);
  g.lineTo(cx, cy + s * 0.05);
  g.lineTo(cx, cy + s * 0.45);
  g.lineTo(cx - w * 0.5, cy + s * 0.2);
  g.closePath(); g.fill();
  // Right face
  g.fillStyle = '#1e3a60';
  g.beginPath();
  g.moveTo(cx + w * 0.5, cy - s * 0.2);
  g.lineTo(cx, cy + s * 0.05);
  g.lineTo(cx, cy + s * 0.45);
  g.lineTo(cx + w * 0.5, cy + s * 0.2);
  g.closePath(); g.fill();
}

function drawPythonIcon(g, cx, cy, s) {
  // Simplified Python-style interlocked snake
  g.fillStyle = '#3776ab';
  g.beginPath(); g.roundRect(cx - s * 0.45, cy - s * 0.5, s * 0.42, s * 0.5, 10); g.fill();
  g.fillStyle = '#ffd343';
  g.beginPath(); g.roundRect(cx + s * 0.03, cy, s * 0.42, s * 0.5, 10); g.fill();
  // Eyes
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cx - s * 0.12, cy - s * 0.28, 7, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cx + s * 0.24, cy + s * 0.22, 7, 0, Math.PI * 2); g.fill();
}

function drawCppIcon(g, cx, cy, s) {
  g.fillStyle = '#00599c';
  g.beginPath(); g.arc(cx, cy, s * 0.52, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.font = `bold ${Math.round(s * 0.52)}px 'Segoe UI', monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('C++', cx, cy + 3);
}

function drawWebDevIcon(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - s * 0.5, cy - s * 0.45, s, s * 0.9, 10); g.fill();
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(s * 0.44)}px 'Segoe UI', monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('</>', cx, cy + 3);
}

function drawGitHubIcon(g, cx, cy, s) {
  g.fillStyle = '#24292f';
  g.beginPath(); g.arc(cx, cy, s * 0.52, 0, Math.PI * 2); g.fill();
  // Simple cat logo silhouette
  g.fillStyle = '#fff';
  g.font = `bold ${Math.round(s * 0.5)}px 'Segoe UI', monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('GH', cx, cy + 3);
}

function drawCodeBracket(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - s * 0.52, cy - s * 0.52, s * 1.04, s * 1.04, 14); g.fill();
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(s * 0.6)}px 'Segoe UI', monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('</>', cx, cy + 3);
}

function drawChipIcon(g, cx, cy, s) {
  const sq = s * 0.65;
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - sq/2, cy - sq/2, sq, sq, 10); g.fill();
  // Pins
  g.strokeStyle = '#ff7a00'; g.lineWidth = 5;
  [-sq * 0.25, 0, sq * 0.25].forEach(d => {
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
      g.beginPath();
      g.moveTo(cx + d * dx + (dy * sq / 2), cy + d * dy + (dx * sq / 2));
      g.lineTo(cx + d * dx + (dy * (sq / 2 + 14)), cy + d * dy + (dx * (sq / 2 + 14)));
      g.stroke();
    });
  });
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - sq * 0.3, cy - sq * 0.3, sq * 0.6, sq * 0.6, 6); g.fill();
}

function drawRobotIcon(g, cx, cy, s) {
  // Head
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - s * 0.3, cy - s * 0.52, s * 0.6, s * 0.44, 8); g.fill();
  // Eyes
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.arc(cx - s * 0.12, cy - s * 0.33, 7, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s * 0.12, cy - s * 0.33, 7, 0, Math.PI * 2); g.fill();
  // Body
  g.fillStyle = '#14284b';
  g.fillRect(cx - s * 0.26, cy - s * 0.06, s * 0.52, s * 0.4);
  // Orange chest
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - s * 0.14, cy + s * 0.04, s * 0.28, s * 0.2, 4); g.fill();
  // Arms
  g.fillStyle = '#14284b';
  [-1, 1].forEach(dx => {
    g.fillRect(cx + dx * s * 0.26, cy - s * 0.06, dx * s * 0.2, s * 0.3);
  });
  // Legs
  [-1, 1].forEach(dx => {
    g.fillRect(cx + dx * s * 0.12, cy + s * 0.34, s * 0.1, s * 0.2);
  });
}

function drawVRIcon(g, cx, cy, s) {
  // VR headset shape
  g.fillStyle = '#14284b';
  g.beginPath();
  g.roundRect(cx - s * 0.5, cy - s * 0.28, s, s * 0.56, 16);
  g.fill();
  // Lenses
  [[cx - s * 0.22, cy], [cx + s * 0.22, cy]].forEach(([lx, ly]) => {
    g.fillStyle = '#1a9af7';
    g.beginPath(); g.ellipse(lx, ly, s * 0.17, s * 0.21, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(lx - 5, ly - 5, 5, 0, Math.PI * 2); g.fill();
  });
  // Strap
  g.strokeStyle = '#ff7a00'; g.lineWidth = 6;
  g.beginPath();
  g.moveTo(cx - s * 0.5, cy);
  g.bezierCurveTo(cx - s * 0.6, cy - s * 0.5, cx + s * 0.6, cy - s * 0.5, cx + s * 0.5, cy);
  g.stroke();
}

function drawAIIcon(g, cx, cy, s) {
  // AI chip with neural-net look
  const sq = s * 0.65;
  g.fillStyle = '#14284b';
  g.beginPath(); g.roundRect(cx - sq/2, cy - sq/2, sq, sq, 10); g.fill();
  g.fillStyle = '#ff7a00';
  g.font = `bold ${Math.round(sq * 0.44)}px 'Segoe UI', monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('AI', cx, cy - 4);
  g.font = `${Math.round(sq * 0.26)}px 'Segoe UI', monospace`;
  g.fillText('ML', cx, cy + sq * 0.22);
  // Corner nodes
  g.fillStyle = '#fff';
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx, dy]) => {
    g.beginPath(); g.arc(cx + dx * sq * 0.42, cy + dy * sq * 0.42, 5, 0, Math.PI * 2); g.fill();
  });
}

function drawRobotMascot(g, cx, cy, s) {
  // Body (white/orange SRI style robot)
  // Body
  g.fillStyle = '#fff';
  g.beginPath(); g.roundRect(cx - s * 0.4, cy - s * 0.2, s * 0.8, s * 0.65, 20); g.fill();
  g.strokeStyle = '#14284b'; g.lineWidth = 4; g.stroke();
  // Chest orange accent
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - s * 0.22, cy + s * 0.05, s * 0.44, s * 0.25, 10); g.fill();
  // SRI text on chest
  g.fillStyle = '#fff';
  g.font = `bold ${Math.round(s * 0.14)}px 'Segoe UI', system-ui, sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('SRI', cx, cy + s * 0.175);
  // Head
  g.fillStyle = '#fff';
  g.beginPath(); g.roundRect(cx - s * 0.3, cy - s * 0.72, s * 0.6, s * 0.5, 18); g.fill();
  g.strokeStyle = '#14284b'; g.lineWidth = 4; g.stroke();
  // Antenna
  g.strokeStyle = '#14284b'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(cx, cy - s * 0.72); g.lineTo(cx, cy - s * 0.9); g.stroke();
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.arc(cx, cy - s * 0.9, 10, 0, Math.PI * 2); g.fill();
  // Eyes (blue glow)
  g.fillStyle = '#1a9af7';
  g.beginPath(); g.arc(cx - s * 0.12, cy - s * 0.52, s * 0.09, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s * 0.12, cy - s * 0.52, s * 0.09, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(cx - s * 0.09, cy - s * 0.55, 4, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + s * 0.15, cy - s * 0.55, 4, 0, Math.PI * 2); g.fill();
  // Mouth smile
  g.strokeStyle = '#14284b'; g.lineWidth = 4;
  g.beginPath();
  g.arc(cx, cy - s * 0.38, s * 0.1, 0.1, Math.PI - 0.1);
  g.stroke();
  // Arms
  g.fillStyle = '#ff7a00';
  // Left arm raised with thumbs up
  g.beginPath(); g.roundRect(cx - s * 0.65, cy - s * 0.1, s * 0.26, s * 0.5, 10); g.fill();
  g.strokeStyle = '#14284b'; g.lineWidth = 3; g.stroke();
  // Right arm at side
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx + s * 0.4, cy + s * 0.05, s * 0.26, s * 0.5, 10); g.fill();
  g.stroke();
  // Legs
  g.fillStyle = '#14284b';
  [-1, 1].forEach(dx => {
    g.beginPath(); g.roundRect(cx + dx * s * 0.22 - s * 0.12, cy + s * 0.44, s * 0.24, s * 0.3, 8); g.fill();
  });
  // Orange shoes
  g.fillStyle = '#ff7a00';
  [-1, 1].forEach(dx => {
    g.beginPath(); g.roundRect(cx + dx * s * 0.22 - s * 0.14, cy + s * 0.72, s * 0.28, s * 0.1, 5); g.fill();
  });
}

function drawOutlineIconCard(g, cx, cy, cw, ch, label, iconFn) {
  g.strokeStyle = '#14284b';
  g.lineWidth = 4;
  g.beginPath(); g.roundRect(cx - cw/2, cy - ch/2, cw, ch, 14); g.stroke();
  if (iconFn) iconFn(g, cx, cy - ch * 0.1, cw * 0.4);
  g.fillStyle = '#14284b';
  g.font = `bold ${Math.round(cw * 0.13)}px 'Segoe UI', system-ui, sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(label, cx, cy + ch * 0.38);
}

/** Hexagon badge */
function drawHexBadge(g, cx, cy, r, fill, text, textCol) {
  g.fillStyle = fill;
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
    i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
  }
  g.closePath(); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 5; g.stroke();
  g.fillStyle = textCol;
  const lines = text.split('\n');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `bold ${lines.length > 1 ? r * 0.4 : r * 0.52}px 'Segoe UI', system-ui, sans-serif`;
  lines.forEach((l, i) => {
    const lh = lines.length > 1 ? r * 0.44 : 0;
    g.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * lh);
  });
}


/* ═══════════════════════════════════════════════════════════════
   5. ROBOTICS LAB WALL MURAL — Right wall (x = 19.78)
   Full width banner: SRI | ROBOTICS LAB title + Build•Learn•Innovate
   + left icon column + TV area placeholder + circuit accents
══════════════════════════════════════════════════════════════ */
export function createRoboticsLabMural(scene) {
  // ── SECTION A: Far-left title zone (z = -13 to -7, 6m wide) ──
  const W1 = 2048, H1 = 1024;
  const leftTex = canvasTex(W1, H1, (g) => {
    // Cream base
    g.fillStyle = '#fff8f0';
    g.fillRect(0, 0, W1, H1);

    // Orange bottom accent bar
    g.fillStyle = '#ff7a00';
    g.fillRect(0, H1 * 0.88, W1, H1 * 0.12);

    // Navy diagonal accent top-left
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W1 * 0.22, 0); g.lineTo(0, H1 * 0.6);
    g.closePath(); g.fill();

    // Orange diagonal strip
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(W1 * 0.22, 0); g.lineTo(W1 * 0.26, 0);
    g.lineTo(W1 * 0.04, H1 * 0.6); g.lineTo(0, H1 * 0.6);
    g.closePath(); g.fill();

    // --- SRI Flower Logo ---
    drawSriLogo(g, 180, 170, 90);

    // Orange vertical divider
    g.fillStyle = '#ff7a00';
    g.fillRect(330, 60, 8, 240);

    // "ROBOTICS LAB" title
    g.fillStyle = '#ff7a00';
    g.font = `bold 100px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('ROBOTICS', 360, 135);

    g.fillStyle = '#14284b';
    g.font = `bold 100px 'Segoe UI', system-ui, sans-serif`;
    g.fillText('LAB', 360 + g.measureText('ROBOTICS ').width - 180, 220);
    // Orange underline
    g.fillStyle = '#ff7a00';
    g.fillRect(360, 290, 900, 8);

    // "LEARN • BUILD • CODE • INNOVATE" subtitle
    g.fillStyle = '#14284b';
    g.font = `bold 42px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'center';
    g.fillText('LEARN   •   BUILD   •   CODE   •   INNOVATE', W1 / 2, 370);

    // === Left column icon pills: Robotics, AI/ML, IoT, Drones, AR/VR ===
    const pills = [
      { label: 'Robotics',    draw: (g, cx, cy, s) => drawRobotIcon(g, cx, cy, s) },
      { label: 'AI / ML',     draw: (g, cx, cy, s) => drawAIIcon(g, cx, cy, s) },
      { label: 'IoT',         draw: (g, cx, cy, s) => drawIoTIcon(g, cx, cy, s) },
      { label: 'Drones',      draw: (g, cx, cy, s) => drawDroneIcon(g, cx, cy, s) },
      { label: 'AR / VR',     draw: (g, cx, cy, s) => drawVRIcon(g, cx, cy, s) },
    ];
    pills.forEach(({ label, draw }, i) => {
      const cx = 180, cy = 520 + i * 90;
      // Outlined pill container
      g.strokeStyle = '#14284b';
      g.lineWidth = 4;
      g.fillStyle = 'rgba(20,40,75,0.06)';
      g.beginPath(); g.roundRect(cx - 155, cy - 32, 310, 64, 32); g.fill(); g.stroke();
      // Mini icon
      draw(g, cx - 90, cy, 26);
      // Label text
      g.fillStyle = '#14284b';
      g.font = `bold 28px 'Segoe UI', system-ui, sans-serif`;
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(label, cx - 50, cy + 2);
    });

    // Circuit line decoration (right side of section)
    drawCircuitLines(g, W1 * 0.8, H1 * 0.25, 1);
    drawCircuitLines(g, W1 * 0.78, H1 * 0.6, 1);
  });

  const leftMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5.2),
    new THREE.MeshBasicMaterial({ map: leftTex, transparent: false })
  );
  // Right wall faces -X, so rotation.y = -PI/2
  leftMesh.position.set(19.76, 3.4, -8);
  leftMesh.rotation.y = -Math.PI / 2;
  scene.add(leftMesh);

  // ── SECTION B: Right zone (z = 0 to 4) with sub-zones display ──
  const W2 = 1200, H2 = 900;
  const rightTex = canvasTex(W2, H2, (g) => {
    g.fillStyle = '#fff8f0';
    g.fillRect(0, 0, W2, H2);

    // Orange bottom bar
    g.fillStyle = '#ff7a00';
    g.fillRect(0, H2 * 0.88, W2, H2 * 0.12);

    // Top navy strip
    g.fillStyle = '#14284b';
    g.fillRect(0, 0, W2, H2 * 0.08);

    // Right diagonal accent
    drawDiagonalCorner(g, 'right', W2, H2);

    // "Innovation Hub" label
    g.fillStyle = '#fff';
    g.font = `bold 36px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('INNOVATION HUB', W2 / 2, H2 * 0.04);

    // 3 feature cards
    const cards = [
      { title: '3D Printing',  sub: 'Design → Print',   draw: (g, cx, cy, s) => drawPrinterIcon(g, cx, cy, s) },
      { title: 'Robotics',     sub: 'Build → Code',     draw: (g, cx, cy, s) => drawRobotIcon(g, cx, cy, s) },
      { title: 'Smart Lab',    sub: 'IoT → Automate',   draw: (g, cx, cy, s) => drawAIIcon(g, cx, cy, s) },
    ];
    const cardW = 320, cardH = 350, startX = 180, cardY = H2 * 0.46, gap = 360;
    cards.forEach(({ title, sub, draw }, i) => {
      const cx = startX + i * gap;
      // Card
      g.fillStyle = '#fff';
      g.strokeStyle = '#14284b';
      g.lineWidth = 4;
      g.shadowColor = 'rgba(0,0,0,0.12)';
      g.shadowBlur = 15;
      g.beginPath(); g.roundRect(cx - cardW/2, cardY - cardH/2, cardW, cardH, 20); g.fill(); g.stroke();
      g.shadowBlur = 0;
      // Orange top bar on card
      g.fillStyle = '#ff7a00';
      g.beginPath(); g.roundRect(cx - cardW/2, cardY - cardH/2, cardW, 14, [20,20,0,0]); g.fill();
      // Icon
      draw(g, cx, cardY - 60, 65);
      // Title
      g.fillStyle = '#14284b';
      g.font = `bold 32px 'Segoe UI', system-ui, sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(title, cx, cardY + 50);
      // Sub
      g.fillStyle = '#ff7a00';
      g.font = `22px 'Segoe UI', system-ui, sans-serif`;
      g.fillText(sub, cx, cardY + 92);
    });
  });

  const rightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 4.4),
    new THREE.MeshBasicMaterial({ map: rightTex, transparent: false })
  );
  rightMesh.position.set(19.76, 3.0, 2);
  rightMesh.rotation.y = -Math.PI / 2;
  scene.add(rightMesh);
}

/* -- Reuse icon drawers also needed here (IoT icon) -- */
function drawIoTIcon(g, cx, cy, s) {
  // WiFi-style arc icon
  g.strokeStyle = '#14284b';
  [0.5, 0.33, 0.18].forEach((r, i) => {
    g.lineWidth = 4 - i;
    g.beginPath();
    g.arc(cx, cy + s * 0.1, s * r, Math.PI * 1.1, Math.PI * 1.9);
    g.stroke();
  });
  // Centre dot
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.arc(cx, cy + s * 0.1, s * 0.08, 0, Math.PI * 2); g.fill();
  // Label
  g.fillStyle = '#14284b';
  g.font = `bold ${Math.round(s * 0.3)}px 'Segoe UI', system-ui, sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('IoT', cx, cy + s * 0.5);
}
