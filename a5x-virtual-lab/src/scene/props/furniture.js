/**
 * props/furniture.js — Tables, chairs, plants, monitors, racks, glass windows
 */
import * as THREE from 'three';
import { box, cyl, put } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';

/** Long table with wood top, black metal legs */
export function createTable(parent, w, d, x, z, h = 0.8) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  // Tabletop
  box(g, w, 0.08, d, M(C.wood), 0, h, 0);
  // Legs
  const lx = w / 2 - 0.12, lz = d / 2 - 0.12;
  [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([a, b]) =>
    box(g, 0.08, h, 0.08, M(C.black), a, h / 2, b));
  // Cross bars
  box(g, w - 0.3, 0.04, 0.04, M(C.black), 0, 0.15, -lz);
  box(g, w - 0.3, 0.04, 0.04, M(C.black), 0, 0.15, lz);
  parent.add(g);
  return g;
}

// Cached chair textures for performance
let _chairBackTex = null;
let _chairSeatTex = null;

function getChairTextures() {
  if (!_chairBackTex) {
    _chairBackTex = canvasTex(256, 256, (g, w, h) => {
      // Matte charcoal/black shell background
      g.fillStyle = '#16161a';
      g.fillRect(0, 0, w, h);
      // Molded ergonomic border rim
      g.strokeStyle = '#26262e';
      g.lineWidth = 12;
      g.beginPath();
      g.roundRect(8, 8, w - 16, h - 16, 28);
      g.stroke();
      // Breathable perforated matrix of dots (like in reference photos)
      g.fillStyle = '#0a0a0d';
      for (let r = 36; r <= h - 36; r += 16) {
        for (let c = 36; c <= w - 36; c += 16) {
          g.beginPath();
          g.arc(c, r, 3.2, 0, Math.PI * 2);
          g.fill();
        }
      }
    });
  }
  if (!_chairSeatTex) {
    _chairSeatTex = canvasTex(256, 256, (g, w, h) => {
      // Premium dark textured cushion
      g.fillStyle = '#18181c';
      g.fillRect(0, 0, w, h);
      // Subtle orange accent perimeter stitch line
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 4;
      g.beginPath();
      g.roundRect(14, 14, w - 28, h - 28, 22);
      g.stroke();
      // Fine fabric weave
      g.fillStyle = 'rgba(255, 122, 0, 0.06)';
      for (let i = 20; i < w - 20; i += 10) {
        g.fillRect(i, 16, 2, h - 32);
      }
    });
  }
  return { backTex: _chairBackTex, seatTex: _chairSeatTex };
}

/** Helper to draw an angled metal tube leg between two 3D points */
function createTubeLeg(parent, x1, y1, z1, x2, y2, z2, radius, mat) {
  const p1 = new THREE.Vector3(x1, y1, z1);
  const p2 = new THREE.Vector3(x2, y2, z2);
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

  const geom = new THREE.CylinderGeometry(radius, radius * 0.9, len, 10);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(mid);

  const yAxis = new THREE.Vector3(0, 1, 0);
  mesh.quaternion.setFromUnitVectors(yAxis, dir.clone().normalize());
  parent.add(mesh);

  // Rubber foot glide at floor contact point
  const foot = cyl(parent, radius * 1.4, radius * 1.4, 0.02, M(0x111111), p2.x, p2.y + 0.01, p2.z, 10);
  return mesh;
}

/** Realistic 4-legged ergonomic training/conference chair (matching Reference 2 & 4) */
export function createChair(parent, x, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;

  const { backTex, seatTex } = getChairTextures();
  const frameMat = M(0x1a1a1e, { roughness: 0.4, metalness: 0.6 }); // Black satin steel tubing
  const shellMat = M(0x141416, { roughness: 0.5 }); // Matte black molded plastic

  // 1. Under-seat Tubular Steel Frame
  const fY = 0.43; // frame height
  box(g, 0.38, 0.02, 0.02, frameMat, 0, fY, -0.17); // Front crossbar
  box(g, 0.38, 0.02, 0.02, frameMat, 0, fY, 0.17);  // Rear crossbar
  box(g, 0.02, 0.02, 0.34, frameMat, -0.19, fY, 0); // Left side rail
  box(g, 0.02, 0.02, 0.34, frameMat, 0.19, fY, 0);  // Right side rail

  // 2. Four Splayed Tubular Steel Legs (angled outwards for realism and stability)
  const legR = 0.012; // leg tube radius (~24mm diameter)
  // Front-left leg (splays forward and left)
  createTubeLeg(g, -0.18, fY, -0.16, -0.23, 0.0, -0.22, legR, frameMat);
  // Front-right leg (splays forward and right)
  createTubeLeg(g, 0.18, fY, -0.16, 0.23, 0.0, -0.22, legR, frameMat);
  // Rear-left leg (splays backward and left)
  createTubeLeg(g, -0.18, fY, 0.16, -0.24, 0.0, 0.24, legR, frameMat);
  // Rear-right leg (splays backward and right)
  createTubeLeg(g, 0.18, fY, 0.16, 0.24, 0.0, 0.24, legR, frameMat);

  // 3. Ergonomic Molded Seat Shell (y = 0.46m)
  // Base shell
  box(g, 0.48, 0.03, 0.46, shellMat, 0, 0.455, -0.01);
  // Waterfall curved front edge
  const wf = cyl(g, 0.022, 0.022, 0.48, shellMat, 0, 0.45, -0.23, 12);
  wf.rotation.z = Math.PI / 2;

  // Textured contoured seat cushion with orange accent perimeter
  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(0.43, 0.018, 0.40),
    new THREE.MeshStandardMaterial({ map: seatTex, roughness: 0.6 })
  );
  cushion.position.set(0, 0.472, -0.01);
  g.add(cushion);

  // 4. Backrest Support Steel Tubes (extending up from rear frame)
  createTubeLeg(g, -0.15, fY, 0.16, -0.15, 0.70, 0.21, 0.010, frameMat);
  createTubeLeg(g, 0.15, fY, 0.16, 0.15, 0.70, 0.21, 0.010, frameMat);

  // 5. Ergonomic Curved Backrest (recline angle ~8 degrees backward)
  const backGroup = new THREE.Group();
  backGroup.position.set(0, 0.67, 0.20);
  backGroup.rotation.x = 0.14; // gentle recline

  // Center backrest panel with breathable perforation texture
  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.36, 0.018),
    new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.5 })
  );
  backGroup.add(backPanel);

  // Left & right gentle curved wings (wrap-around ergonomic contour)
  const leftWing = box(backGroup, 0.07, 0.36, 0.016, shellMat, -0.18, 0, -0.012);
  leftWing.rotation.y = 0.22;
  const rightWing = box(backGroup, 0.07, 0.36, 0.016, shellMat, 0.18, 0, -0.012);
  rightWing.rotation.y = -0.22;

  // Top rounded border / grip handle
  const topBar = cyl(backGroup, 0.012, 0.012, 0.44, frameMat, 0, 0.185, 0, 10);
  topBar.rotation.z = Math.PI / 2;

  g.add(backGroup);

  parent.add(g);
  return g;
}

/** Potted plant */
export function createPlant(parent, x, y, z, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  // Pot
  cyl(g, 0.14, 0.1, 0.25, M(C.white), 0, 0.125, 0);
  // Soil
  cyl(g, 0.13, 0.13, 0.04, M(0x5a3a1a), 0, 0.26, 0);
  // Leaves (sphere cluster)
  const leafMat = M(C.green);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), leafMat);
  leaf.position.y = 0.48;
  leaf.scale.set(1, 0.75, 1);
  g.add(leaf);
  // Small leaf clusters
  [[-0.1, 0.4, 0.08], [0.12, 0.42, -0.06], [0, 0.55, 0]].forEach(([a, b, c]) => {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), leafMat);
    l.position.set(a, b, c);
    g.add(l);
  });
  parent.add(g);
  return g;
}

/** Dual monitors on a stand */
export function createMonitor(parent, x, y, z, screenTex, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  // Bezel
  box(g, 0.9, 0.55, 0.04, M(C.black), 0, 0, 0);
  // Stand post
  box(g, 0.06, 0.3, 0.06, M(C.black), 0, -0.42, 0);
  // Stand base
  box(g, 0.35, 0.02, 0.2, M(C.black), 0, -0.56, 0);
  // Screen
  const tex = typeof screenTex === 'function' ? screenTex() : screenTex;
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 0.48),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  screen.position.z = 0.025;
  g.add(screen);
  parent.add(g);
  return g;
}

/** Storage rack with shelves and bins */
export function createRack(parent, x, z, ry = 0, w = 2.6) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  // Uprights
  [-1, 1].forEach(s => box(g, 0.06, 2.4, 0.6, M(C.black), s * w / 2, 1.2, 0));
  // Shelves + bins
  [0.4, 1.2, 2.0].forEach(y => {
    box(g, w, 0.05, 0.6, M(C.orange), 0, y, 0);
    const binCount = Math.floor(w / 0.65);
    for (let i = 0; i < binCount; i++) {
      const binColor = i % 2 ? C.navy : 0xbfd8ee;
      box(g, w / (binCount + 0.5), 0.28, 0.45, M(binColor, { transparent: true, opacity: 0.85 }),
        -w / 2 + 0.35 + i * (w / (binCount + 0.2)), y + 0.18, 0);
    }
  });
  parent.add(g);
  return g;
}

/** Window with hollow frame and crystal clear transparent glass */
export function createWindow(parent, x, y, z, ry = 0, w = 2.4, h = 1.8) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;

  const frameMat = M(C.navy, { roughness: 0.35, metalness: 0.4 });

  // 1. Hollow Outer Frame (border around cutout - center is open)
  const fT = 0.07; // frame thickness
  const fD = 0.20; // frame depth (sits flush in 0.5m wall)
  // Top bar
  box(g, w + fT * 2, fT, fD, frameMat, 0, h / 2 + fT / 2, 0);
  // Bottom sill (slightly wider ledge)
  box(g, w + fT * 2 + 0.12, fT + 0.02, fD + 0.08, frameMat, 0, -h / 2 - (fT + 0.02) / 2, 0.02);
  // Left side bar
  box(g, fT, h, fD, frameMat, -w / 2 - fT / 2, 0, 0);
  // Right side bar
  box(g, fT, h, fD, frameMat, w / 2 + fT / 2, 0, 0);

  // 2. Crystal Clear Transparent Glass Pane (100% see-through, no dark shader artifact)
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xd8eeff,
    transparent: true,
    opacity: 0.20,
    roughness: 0.05,
    metalness: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat);
  pane.position.z = 0;
  g.add(pane);

  // 3. Slim Architectural Mullions (window grid bars)
  const mullionMat = M(0x1a2638, { roughness: 0.4, metalness: 0.3 });
  box(g, 0.035, h, 0.06, mullionMat, 0, 0, 0);
  box(g, w, 0.035, 0.06, mullionMat, 0, 0, 0);

  parent.add(g);
  return g;
}

/** Painted wall sign — navy rounded pill with text */
export function createSign(text, w, h, opts = {}) {
  const scale = 200;
  const lines = text.split('\n');
  const tex = canvasTex(w * scale, h * scale, (g, W, H) => {
    if (opts.bg !== 'none') {
      g.fillStyle = opts.bg || '#14284b';
      g.beginPath();
      g.roundRect(0, 0, W, H, H * 0.18);
      g.fill();
      if (opts.bar !== false) {
        g.fillStyle = '#ff7a00';
        g.fillRect(W * 0.08, H * 0.86, W * 0.84, H * 0.05);
      }
    }
    g.fillStyle = opts.fg || '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const maxChars = Math.max(...lines.map(l => l.length));
    const fs = Math.min(H * 0.7 / lines.length, W * 0.85 / (maxChars * 0.6));
    g.font = `bold ${fs}px 'Segoe UI', system-ui, sans-serif`;
    lines.forEach((line, i) => {
      const ty = H / 2 + (i - (lines.length - 1) / 2) * fs * 1.15;
      g.fillText(line, W / 2, ty);
    });
  });
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
}
