/**
 * frontwall.js — Front wall (z = +14.73) decorations:
 *   1. Top navy banner "WELCOME TO SRI ROBOTICS LAB"
 *   2. Painted wall art LEFT of door — circuit + tech paint mural (transparent, looks painted)
 *   3. Painted wall art RIGHT of door — gear/circuit paint mural
 *   4. SRI Mascot on front wall right side (painted look)
 *   5. SRI Mascot also on LEFT wall (z ≈ +8)
 */
import * as THREE from 'three';
import { canvasTex } from '../../utils/materials.js';

/* ══════════════════════════════════════════════════════════════════
   1. TOP BANNER — full width, navy bg
   PlaneGeometry(29, 1.6)  y=5.1  z=14.70  ry=PI
══════════════════════════════════════════════════════════════════ */
function createFrontTopBanner(scene) {
  const W = 3072, H = 320;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#14284b'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#ff7a00';
    g.fillRect(0, 0, W, 14);
    g.fillRect(0, H - 14, W, 14);
    // Left diagonal
    g.beginPath(); g.moveTo(0,14); g.lineTo(160,14); g.lineTo(60,H-14); g.lineTo(0,H-14); g.fill();
    // Right diagonal
    g.beginPath(); g.moveTo(W,14); g.lineTo(W-160,14); g.lineTo(W-60,H-14); g.lineTo(W,H-14); g.fill();
    // Circuit dots
    const circ = (x, y, dir) => {
      g.strokeStyle = 'rgba(255,122,0,0.4)'; g.lineWidth = 3; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x,y); g.lineTo(x+dir*60,y); g.lineTo(x+dir*60,y-20); g.lineTo(x+dir*120,y-20); g.stroke();
      [0,60,120].forEach(d => { g.fillStyle='rgba(255,122,0,0.5)'; g.beginPath(); g.arc(x+dir*d,y,4,0,Math.PI*2); g.fill(); });
    };
    circ(220, 90, 1); circ(W-220, 90, -1); circ(220, 220, 1); circ(W-220, 220, -1);
    // "WELCOME TO"
    g.fillStyle = '#ff7a00';
    g.font = `600 52px 'Segoe UI', sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('WELCOME TO', W/2, 86);
    // "SRI ROBOTICS LAB"
    g.fillStyle = '#ffffff';
    g.font = `900 112px 'Segoe UI', sans-serif`;
    g.fillText('SRI ROBOTICS LAB', W/2, 208);
    // Tagline
    g.fillStyle = 'rgba(255,255,255,0.5)';
    g.font = `400 34px 'Segoe UI', sans-serif`;
    g.fillText('LEARN  •  BUILD  •  CODE  •  INNOVATE', W/2, 283);
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(29, 1.6),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(0, 5.1, 14.70);
  mesh.rotation.y = Math.PI;
  scene.add(mesh);
}

/* ══════════════════════════════════════════════════════════════════
   2. PAINTED WALL ART — LEFT of door (x ≈ -8)
   Transparent canvas so paint looks directly on the wall.
   Circuit traces + gear outlines + "CODE • BUILD" text in paint style
   PlaneGeometry(9, 5.2)  y=2.8  x=-8  z=14.68  ry=PI
══════════════════════════════════════════════════════════════════ */
function createFrontLeftPaint(scene) {
  const W = 1920, H = 1100;
  const tex = canvasTex(W, H, (g) => {
    // TRANSPARENT background — only paint strokes visible
    g.clearRect(0, 0, W, H);

    // Helper: thick paint stroke
    function stroke(x1, y1, x2, y2, col, lw) {
      g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    }

    // ── BIG CIRCUIT TRACE network (orange) ──
    g.strokeStyle = '#ff7a00'; g.lineWidth = 8; g.lineCap = 'round';
    // Horizontal main line
    g.beginPath(); g.moveTo(60, 300); g.lineTo(W-60, 300); g.stroke();
    // Branches going up
    [[200,300],[500,300],[900,300],[1300,300],[1700,300]].forEach(([x,y]) => {
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 160); g.stroke();
      g.beginPath(); g.arc(x, y-160, 18, 0, Math.PI*2);
      g.fillStyle = '#ff7a00'; g.fill();
    });
    // Branches going down
    [[350,300],[750,300],[1100,300],[1550,300]].forEach(([x,y]) => {
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, y+200); g.stroke();
      g.fillStyle = '#14284b';
      g.beginPath(); g.arc(x, y+200, 14, 0, Math.PI*2); g.fill();
    });
    // Junction nodes
    [[200,300],[500,300],[900,300],[1300,300],[1700,300],[350,300],[750,300],[1100,300],[1550,300]].forEach(([x,y]) => {
      g.fillStyle = '#fff8f0';
      g.beginPath(); g.arc(x, y, 10, 0, Math.PI*2); g.fill();
      g.strokeStyle = '#ff7a00'; g.lineWidth = 4;
      g.beginPath(); g.arc(x, y, 10, 0, Math.PI*2); g.stroke();
    });

    // ── Second circuit row (navy) ──
    g.strokeStyle = '#14284b'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(100, 650); g.lineTo(W-100, 650); g.stroke();
    [[300,650],[700,650],[1200,650],[1600,650]].forEach(([x,y]) => {
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, y+160); g.stroke();
      g.fillStyle = '#ff7a00';
      g.beginPath(); g.arc(x, y+160, 14, 0, Math.PI*2); g.fill();
    });

    // ── GEAR outlines (hollow, painted look) ──
    function paintGear(cx, cy, R, col, alpha) {
      g.globalAlpha = alpha;
      const teeth = 10;
      g.strokeStyle = col; g.lineWidth = 7; g.lineJoin = 'round';
      g.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const a = (i / (teeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? R : R * 0.74;
        i === 0 ? g.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
                : g.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
      }
      g.closePath(); g.stroke();
      g.beginPath(); g.arc(cx, cy, R*0.32, 0, Math.PI*2); g.stroke();
      g.globalAlpha = 1;
    }
    paintGear(160, 700, 110, '#ff7a00', 0.35);
    paintGear(1760, 180, 90, '#14284b', 0.3);
    paintGear(1600, 820, 70, '#ff7a00', 0.25);
    paintGear(80, 200, 65, '#14284b', 0.2);

    // ── Robot head outline (top-right area) ──
    g.globalAlpha = 0.22;
    g.strokeStyle = '#14284b'; g.lineWidth = 10; g.lineCap = 'round';
    // Head box
    g.beginPath(); g.roundRect(1480, 480, 340, 280, 30); g.stroke();
    // Eyes
    [1570, 1740].forEach(ex => {
      g.beginPath(); g.arc(ex, 580, 36, 0, Math.PI*2); g.stroke();
      g.fillStyle = '#ff7a00'; g.globalAlpha = 0.18;
      g.beginPath(); g.arc(ex, 580, 22, 0, Math.PI*2); g.fill();
    });
    g.globalAlpha = 0.22; g.strokeStyle = '#14284b';
    // Antenna
    g.beginPath(); g.moveTo(1650, 480); g.lineTo(1650, 380); g.stroke();
    g.beginPath(); g.arc(1650, 360, 22, 0, Math.PI*2); g.stroke();
    g.globalAlpha = 1;

    // ── "CODE" big painted text ──
    g.globalAlpha = 0.13;
    g.fillStyle = '#ff7a00';
    g.font = `900 320px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'bottom';
    g.fillText('CODE', 60, H - 20);
    g.globalAlpha = 1;

    // ── Small "< / >" code icon ──
    g.strokeStyle = '#ff7a00'; g.lineWidth = 14; g.lineCap = 'round';
    g.globalAlpha = 0.7;
    // <
    g.beginPath(); g.moveTo(360, 480); g.lineTo(290, 550); g.lineTo(360, 620); g.stroke();
    // >
    g.beginPath(); g.moveTo(430, 480); g.lineTo(500, 550); g.lineTo(430, 620); g.stroke();
    // /
    g.beginPath(); g.moveTo(410, 460); g.lineTo(380, 640); g.stroke();
    g.globalAlpha = 1;

    // ── Dot matrix pattern (bottom left) ──
    g.fillStyle = '#ff7a00';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        g.globalAlpha = 0.15 + (r + c) * 0.015;
        g.beginPath(); g.arc(60 + c*55, H-240 + r*48, 8, 0, Math.PI*2); g.fill();
      }
    }
    g.globalAlpha = 1;
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 5.2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  mesh.position.set(-8, 2.8, 14.68);
  mesh.rotation.y = Math.PI;
  scene.add(mesh);
}

/* ══════════════════════════════════════════════════════════════════
   3. PAINTED WALL ART — RIGHT of door  (x ≈ +10)
   Transparent paint: gear + circuit + "ROBO" text watermark
   PlaneGeometry(7, 5.2)  y=2.8  x=+10  z=14.68  ry=PI
══════════════════════════════════════════════════════════════════ */
function createFrontRightPaint(scene) {
  const W = 1600, H = 1100;
  const tex = canvasTex(W, H, (g) => {
    g.clearRect(0, 0, W, H);

    // ── Big gear (top left) ──
    function paintGear(cx, cy, R, col, alpha) {
      g.globalAlpha = alpha;
      const teeth = 12;
      g.strokeStyle = col; g.lineWidth = 8;
      g.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const a = (i / (teeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? R : R * 0.76;
        i === 0 ? g.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
                : g.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
      }
      g.closePath(); g.stroke();
      g.beginPath(); g.arc(cx, cy, R*0.3, 0, Math.PI*2); g.stroke();
      g.globalAlpha = 1;
    }
    paintGear(300, 280, 200, '#ff7a00', 0.3);
    paintGear(1350, 700, 150, '#14284b', 0.25);
    paintGear(1500, 200, 80, '#ff7a00', 0.2);
    paintGear(80, 820, 90, '#14284b', 0.18);

    // ── Circuit traces ──
    g.strokeStyle = '#14284b'; g.lineWidth = 7; g.lineCap = 'round';
    g.globalAlpha = 0.35;
    g.beginPath(); g.moveTo(0, 450); g.lineTo(W, 450); g.stroke();
    [[200,450],[600,450],[1000,450],[1400,450]].forEach(([x,y]) => {
      g.beginPath(); g.moveTo(x,y); g.lineTo(x, y-180); g.stroke();
      g.fillStyle = '#ff7a00';
      g.beginPath(); g.arc(x, y-180, 16, 0, Math.PI*2); g.fill();
    });
    [[400,450],[800,450],[1200,450]].forEach(([x,y]) => {
      g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+180); g.stroke();
      g.fillStyle = '#14284b';
      g.beginPath(); g.arc(x,y+180,13,0,Math.PI*2); g.fill();
    });
    g.globalAlpha = 1;

    // ── Dot matrix ──
    for (let r=0; r<5; r++) for (let c=0; c<6; c++) {
      g.globalAlpha = 0.12 + (r+c)*0.015;
      g.fillStyle = '#14284b';
      g.beginPath(); g.arc(W-80-c*55, 60+r*55, 7, 0, Math.PI*2); g.fill();
    }
    g.globalAlpha = 1;

    // ── "ROBO" watermark ──
    g.globalAlpha = 0.1;
    g.fillStyle = '#14284b';
    g.font = `900 260px 'Segoe UI', sans-serif`;
    g.textAlign = 'right'; g.textBaseline = 'bottom';
    g.fillText('ROBO', W-30, H-10);
    g.globalAlpha = 1;

    // ── SRI small text ──
    g.globalAlpha = 0.55;
    g.fillStyle = '#ff7a00';
    g.font = `bold 48px Georgia, serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('SRI PUBLIC SCHOOL', W/2, H - 80);
    g.strokeStyle = '#ff7a00'; g.lineWidth = 3;
    g.globalAlpha = 0.4;
    g.beginPath(); g.moveTo(W*0.15, H-50); g.lineTo(W*0.85, H-50); g.stroke();
    g.globalAlpha = 1;
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 5.2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  mesh.position.set(10, 2.8, 14.68);
  mesh.rotation.y = Math.PI;
  scene.add(mesh);
}

/* ══════════════════════════════════════════════════════════════════
   4. SRI MASCOT — Front wall RIGHT side  (x ≈ +6, z=14.65)
   Painted look: mascot PNG on transparent plane, blends with wall art
   PlaneGeometry(2.6, 3.2)  y=1.8
══════════════════════════════════════════════════════════════════ */
function createFrontMascot(scene) {
  const loader = new THREE.TextureLoader();
  loader.load('/mascot.png', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 3.2),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, depthWrite: false })
    );
    mesh.position.set(7.0, 1.8, 14.65);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);
  });
}

/* ══════════════════════════════════════════════════════════════════
   5. SRI MASCOT — Left wall (testing zone empty area, z ≈ +8)
   PlaneGeometry(3.0, 3.6)  y=2.0  x=-19.70  ry=PI/2
══════════════════════════════════════════════════════════════════ */
function createLeftWallMascot(scene) {
  // Orange glow halo behind mascot
  const W = 600, H = 720;
  const bgTex = canvasTex(W, H, (g) => {
    g.clearRect(0, 0, W, H);
    const grad = g.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.5);
    grad.addColorStop(0, 'rgba(255,122,0,0.28)');
    grad.addColorStop(0.55, 'rgba(255,122,0,0.1)');
    grad.addColorStop(1, 'rgba(255,122,0,0)');
    g.fillStyle = grad;
    g.beginPath(); g.arc(W/2, H/2, W*0.5, 0, Math.PI*2); g.fill();
    // Dashed ring
    g.strokeStyle = '#ff7a00'; g.lineWidth = 5; g.setLineDash([16,10]);
    g.beginPath(); g.arc(W/2, H/2, W*0.44, 0, Math.PI*2); g.stroke();
    g.setLineDash([]);
  });
  const bgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 4.2),
    new THREE.MeshBasicMaterial({ map: bgTex, transparent: true, depthWrite: false })
  );
  bgMesh.position.set(-19.71, 2.1, 8);
  bgMesh.rotation.y = Math.PI / 2;
  scene.add(bgMesh);

  const loader = new THREE.TextureLoader();
  loader.load('/mascot.png', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 3.6),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, depthWrite: false })
    );
    mesh.position.set(-19.70, 2.1, 8);
    mesh.rotation.y = Math.PI / 2;
    scene.add(mesh);
  });
}

/* ── EXPORT ── */
export function createFrontWallDecor(scene) {
  createFrontTopBanner(scene);
  createFrontLeftPaint(scene);
  createFrontRightPaint(scene);
  createFrontMascot(scene);
  createLeftWallMascot(scene);
}
