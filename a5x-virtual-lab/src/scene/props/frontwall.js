/**
 * frontwall.js
 * Decorative panels + SRI mascot on the front wall (south wall, z = +14.73)
 * Also adds a decorative panel on the small right-side empty wall area.
 */
import * as THREE from 'three';
import { canvasTex } from '../../utils/materials.js';

/* ── helpers ── */
function txt(g, text, x, y, size, col, align = 'center', base = 'middle') {
  g.fillStyle = col;
  g.font = `bold ${size}px 'Segoe UI', sans-serif`;
  g.textAlign = align; g.textBaseline = base;
  g.fillText(text, x, y);
}
function rrect(g, x, y, w, h, r, fill, stroke) {
  g.beginPath(); g.roundRect(x, y, w, h, r);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.stroke(); }
}
function circuit(g, x, y, dir, col = '#ff7a00') {
  g.strokeStyle = col; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath();
  g.moveTo(x, y); g.lineTo(x + dir * 60, y);
  g.lineTo(x + dir * 60, y - 22); g.lineTo(x + dir * 120, y - 22);
  g.stroke();
  [0, 60, 120].forEach(d => {
    g.fillStyle = col;
    g.beginPath(); g.arc(x + dir * d, y, 5, 0, Math.PI * 2); g.fill();
  });
}

/* ══════════════════════════════════════════════════════════════════
   FRONT WALL — TOP BANNER  (above door + windows)
   "WELCOME TO SRI ROBOTICS LAB" strip across the full top
   Canvas: 3072 × 320   PlaneGeometry(29, 1.6)
   y = 5.1, z = 14.70  rotation.y = Math.PI
══════════════════════════════════════════════════════════════════ */
function createFrontTopBanner(scene) {
  const W = 3072, H = 320;
  const tex = canvasTex(W, H, (g) => {
    // Deep navy background
    g.fillStyle = '#14284b'; g.fillRect(0, 0, W, H);

    // Orange top + bottom bars
    g.fillStyle = '#ff7a00';
    g.fillRect(0, 0, W, 14);
    g.fillRect(0, H - 14, W, 14);

    // Left orange diagonal accent
    g.beginPath();
    g.moveTo(0, 14); g.lineTo(160, 14); g.lineTo(60, H - 14); g.lineTo(0, H - 14);
    g.fillStyle = '#ff7a00'; g.fill();

    // Right orange diagonal accent
    g.beginPath();
    g.moveTo(W, 14); g.lineTo(W - 160, 14); g.lineTo(W - 60, H - 14); g.lineTo(W, H - 14);
    g.fill();

    // Circuit decorations
    circuit(g, 220, 90, 1, 'rgba(255,122,0,0.5)');
    circuit(g, W - 220, 90, -1, 'rgba(255,122,0,0.5)');
    circuit(g, 220, 220, 1, 'rgba(255,122,0,0.3)');
    circuit(g, W - 220, 220, -1, 'rgba(255,122,0,0.3)');

    // "WELCOME TO" small
    g.fillStyle = '#ff7a00';
    g.font = `600 52px 'Segoe UI', sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('WELCOME TO', W / 2, 90);

    // "SRI ROBOTICS LAB" big
    g.fillStyle = '#ffffff';
    g.font = `900 112px 'Segoe UI Black', 'Segoe UI', sans-serif`;
    g.fillText('SRI ROBOTICS LAB', W / 2, 210);

    // Dot separators in title area
    ['●', '●', '●'].forEach((d, i) => {
      const offsets = [-580, 0, 580];
      // small orange stars at sides
    });

    // Small tagline dots
    const dots = ['LEARN', '•', 'BUILD', '•', 'CODE', '•', 'INNOVATE'];
    let dx = W / 2 - 460;
    dots.forEach(word => {
      const col = word === '•' ? '#ff7a00' : 'rgba(255,255,255,0.55)';
      g.fillStyle = col;
      g.font = `${word === '•' ? 'bold' : '400'} 36px 'Segoe UI', sans-serif`;
      g.textAlign = 'left'; g.textBaseline = 'middle';
      g.fillText(word, dx, 282);
      dx += g.measureText(word + '  ').width + 10;
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(29, 1.6),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide })
  );
  mesh.position.set(0, 5.1, 14.70);
  mesh.rotation.y = Math.PI;
  scene.add(mesh);
}

/* ══════════════════════════════════════════════════════════════════
   FRONT WALL — LEFT SIDE PANEL  (left of door)
   Tech subjects grid panel
   Canvas: 1024 × 1280   PlaneGeometry(4.2, 5.2)
   y = 2.8, x = -10.5, z = 14.70  rotation.y = Math.PI
══════════════════════════════════════════════════════════════════ */
function createFrontLeftPanel(scene) {
  const W = 1024, H = 1280;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange top bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, 0, W, 16);
    g.fillStyle = '#14284b'; g.fillRect(0, 16, W, 8);

    // Title
    txt(g, 'LAB MODULES', W / 2, 68, 56, '#14284b');
    // Orange underline
    g.fillStyle = '#ff7a00'; g.fillRect(W * 0.2, 100, W * 0.6, 5);

    // 6 module cards in 2×3 grid
    const modules = [
      { icon: '🤖', label: 'Robotics' },
      { icon: '💻', label: 'Coding' },
      { icon: '🖨️', label: '3D Printing' },
      { icon: '📡', label: 'IoT' },
      { icon: '🧠', label: 'AI / ML' },
      { icon: '🚁', label: 'Drones' },
    ];
    const cols = 2, rows = 3;
    const cW = 420, cH = 300, gapX = 40, gapY = 32;
    const startX = (W - cols * cW - (cols - 1) * gapX) / 2 + cW / 2;
    const startY = 160;

    modules.forEach(({ icon, label }, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cW + gapX);
      const cy = startY + cH / 2 + row * (cH + gapY);

      // Card bg
      rrect(g, cx - cW / 2, cy - cH / 2, cW, cH, 18, '#fff', null);
      g.strokeStyle = '#ff7a00'; g.lineWidth = 4;
      g.beginPath(); g.roundRect(cx - cW / 2, cy - cH / 2, cW, cH, 18); g.stroke();

      // Orange top pip
      g.fillStyle = '#ff7a00';
      g.beginPath(); g.roundRect(cx - cW / 2, cy - cH / 2, cW, 10, [18, 18, 0, 0]); g.fill();

      // Icon
      g.font = `${Math.round(cH * 0.38)}px serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(icon, cx, cy - cH * 0.08);

      // Label
      txt(g, label, cx, cy + cH * 0.33, 38, '#14284b');
    });

    // Bottom orange bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H - 10, W, 10);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 5.2),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide })
  );
  mesh.position.set(-10.5, 2.8, 14.70);
  mesh.rotation.y = Math.PI;
  scene.add(mesh);
}

/* ══════════════════════════════════════════════════════════════════
   FRONT WALL — RIGHT SIDE PANEL  (right of door)
   Achievement / rules / facts panel
   Canvas: 1024 × 1280   PlaneGeometry(4.2, 5.2)
   y = 2.8, x = +6, z = 14.70  rotation.y = Math.PI
══════════════════════════════════════════════════════════════════ */
function createFrontRightPanel(scene) {
  const W = 1024, H = 1280;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange top bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, 0, W, 16);
    g.fillStyle = '#14284b'; g.fillRect(0, 16, W, 8);

    // Title
    txt(g, 'LAB RULES', W / 2, 68, 56, '#14284b');
    g.fillStyle = '#ff7a00'; g.fillRect(W * 0.25, 100, W * 0.5, 5);

    const rules = [
      { no: '01', rule: 'Respect all\nequipment' },
      { no: '02', rule: 'No food or\ndrink in lab' },
      { no: '03', rule: 'Safety first\nalways' },
      { no: '04', rule: 'Clean up\nafter use' },
      { no: '05', rule: 'Collaborate\n& share' },
    ];

    rules.forEach(({ no, rule }, i) => {
      const ry = 160 + i * 210;
      // Navy number badge
      g.fillStyle = '#14284b';
      g.beginPath(); g.arc(80, ry + 60, 52, 0, Math.PI * 2); g.fill();
      txt(g, no, 80, 62 + ry, 42, '#ff7a00');

      // Orange line
      g.fillStyle = '#ff7a00'; g.fillRect(150, ry + 54, 6, 44);

      // Rule text
      const lines = rule.split('\n');
      lines.forEach((line, li) => {
        txt(g, line, 580, ry + 36 + li * 54, 40, '#14284b', 'center', 'top');
      });

      // Divider
      if (i < rules.length - 1) {
        g.strokeStyle = 'rgba(20,40,75,0.12)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(40, ry + 170); g.lineTo(W - 40, ry + 170); g.stroke();
      }
    });

    // Bottom orange bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H - 10, W, 10);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 5.2),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide })
  );
  mesh.position.set(8.5, 2.8, 14.70);
  mesh.rotation.y = Math.PI;
  scene.add(mesh);
}

/* ══════════════════════════════════════════════════════════════════
   SRI MASCOT — On the LEFT WALL, in the empty section near front
   (Testing zone mural covers z = -10.5 to +2.5; mascot goes z ≈ +8)
   Loaded from /mascot.png  PlaneGeometry(3.2, 3.8)
   x = -19.72, y = 2.0, z = 8   rotation.y = Math.PI/2 (faces into room)
══════════════════════════════════════════════════════════════════ */
function createMascot(scene) {
  // ── Background panel behind mascot ──
  const W = 640, H = 800;
  const bgTex = canvasTex(W, H, (g) => {
    // Orange gradient circle behind mascot
    const grad = g.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.52);
    grad.addColorStop(0, 'rgba(255,122,0,0.22)');
    grad.addColorStop(0.6, 'rgba(255,122,0,0.08)');
    grad.addColorStop(1, 'rgba(255,122,0,0)');
    g.fillStyle = grad;
    g.beginPath(); g.arc(W/2, H/2, W*0.52, 0, Math.PI*2); g.fill();

    // Dashed orange circle outline
    g.strokeStyle = '#ff7a00'; g.lineWidth = 6;
    g.setLineDash([18, 12]);
    g.beginPath(); g.arc(W/2, H/2, W*0.46, 0, Math.PI*2); g.stroke();
    g.setLineDash([]);

    // "SRI MASCOT" label below
    g.fillStyle = '#14284b';
    g.font = `bold 42px 'Segoe UI', sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('ROBO — SRI', W/2, H*0.9);
  });
  const bgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 4.5),
    new THREE.MeshBasicMaterial({ map: bgTex, transparent: true, depthWrite: false })
  );
  bgMesh.position.set(-19.71, 2.0, 8);
  bgMesh.rotation.y = Math.PI / 2;
  scene.add(bgMesh);

  // ── Mascot image ──
  const loader = new THREE.TextureLoader();
  loader.load('/mascot.png', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.6), mat);
    // Left wall (x = -19.74), facing +X into room → rotation.y = PI/2
    mesh.position.set(-19.70, 2.1, 8);
    mesh.rotation.y = Math.PI / 2;
    scene.add(mesh);
  });
}

/* ══════════════════════════════════════════════════════════════════
   EMPTY RIGHT WALL AREA  — decorative panel where wall is bare
   (The area to the right of the main Robotics Lab workbench,
    near the small window — x = 19.74, z = +6)
   Canvas: 1024 × 1280   PlaneGeometry(3.5, 4.5)
   y = 2.8, x = 19.72, z = 7  rotation.y = -Math.PI/2
══════════════════════════════════════════════════════════════════ */
function createRightEmptyPanel(scene) {
  const W = 1024, H = 1280;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange top bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, 0, W, 16);

    // Title "INNOVATION HUB"
    txt(g, 'INNOVATION', W / 2, 90, 68, '#14284b');
    txt(g, 'HUB', W / 2, 168, 68, '#ff7a00');
    g.fillStyle = '#ff7a00'; g.fillRect(W * 0.2, 212, W * 0.6, 6);

    // 4 stat blocks
    const stats = [
      { val: '50+', label: 'Projects\nBuilt' },
      { val: '200+', label: 'Students\nTrained' },
      { val: '10+', label: 'Robots\nAssembled' },
      { val: '5★', label: 'Rating' },
    ];
    stats.forEach(({ val, label }, i) => {
      const cy = 320 + i * 240;
      // Card
      rrect(g, 60, cy, W - 120, 190, 20, 'rgba(20,40,75,0.06)', null);
      g.strokeStyle = '#14284b'; g.lineWidth = 3;
      g.beginPath(); g.roundRect(60, cy, W - 120, 190, 20); g.stroke();
      // Value
      g.fillStyle = '#ff7a00';
      g.font = `900 90px 'Segoe UI', sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(val, W / 2, cy + 72);
      // Label
      label.split('\n').forEach((l, li) => {
        txt(g, l, W / 2, cy + 128 + li * 36, 30, '#14284b');
      });
    });

    // SRI at bottom
    g.fillStyle = '#14284b';
    g.font = `bold 42px Georgia, serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('SRI PUBLIC SCHOOL', W / 2, H - 50);
    g.fillStyle = '#ff7a00'; g.fillRect(W * 0.15, H - 20, W * 0.7, 8);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 4.5),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide })
  );
  mesh.position.set(19.72, 2.8, 7);
  mesh.rotation.y = -Math.PI / 2;
  scene.add(mesh);
}

/* ── EXPORT ── */
export function createFrontWallDecor(scene) {
  createFrontTopBanner(scene);
  createFrontLeftPanel(scene);
  createFrontRightPanel(scene);
  createMascot(scene);
  createRightEmptyPanel(scene);
}
