/**
 * zones/hardware.js — Complete, photo-accurate recreation of the HARDWARE ZONE
 * Built to match reference image (media_1794745193113_8aaf06a5.jpg) exactly.
 *
 * Features:
 *  1. Wall Mural (4096x2048 high-res painted wall):
 *     - Warm peach/cream matte base (#fff1e3)
 *     - Top-left orange corner triangle
 *     - SRI Lotus Logo + vertical divider + microchip icon + bold navy "Hardware / Zone" + orange brush underline
 *     - Large orange gear icon on the left above pegboard
 *     - Right side: Navy diagonal panel with orange >> chevron and stacked white text:
 *       "Electronics / Components / Robotics / IoT • Sensors"
 *     - Orange diagonal divider stripe separating peach wall from navy panel
 *
 *  2. 3D Workbench & Prototyping Workstation:
 *     - Heavy-duty wooden workbench table with black steel frame
 *     - Dark pegboard with 12+ hanging tools (2 pliers, 3 screwdrivers, blue glue gun,
 *       digital multimeter, white tape roll, 2 side cutters) + stack of 4 clear boxes
 *     - Centre black metal rack with wooden shelves holding 3x4 (12) transparent bins with
 *       orange clips and crisp technical labels & icons:
 *       (Microcontrollers, Sensors, Actuators, Motor Drivers, Modules, Displays,
 *        Communication, Power & Battery, Connectors, Cables & Wires, Switches, Passive Components)
 *     - Top of centre rack: RC car, articulated robotic arm, drone, mini robot car
 *     - Warm orange LED strip illuminating the workbench with ambient downlight
 *     - Tabletop: Green cutting mat, blue digital soldering station with iron in stand,
 *       helping-hands magnifier with PCB, solder wire spool, component parts tray
 *     - Under-table: 3 large transparent storage bins with orange latches
 *     - Right rack: 3 stacked boxes on top, blue drawer cabinet in middle, bench DC power supply
 *       ("30.00 V / 5.000 A" glowing LED readout) and digital storage oscilloscope showing glowing sine wave
 *     - Ergonomic task chair with black perforated back and vibrant ORANGE cushioned seat
 */

import * as THREE from 'three';
import { box, cyl, put } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';
import { createChair } from '../props/furniture.js';
import { createDrone, createCar, createRoboticArm } from '../props/equipment.js';

export function buildHardwareZone(scene) {
  const anim = { spin: [] };

  const HW_X = 19.78;         // Right wall inner surface X
  const HW_R = -Math.PI / 2;   // Facing into room (-X)

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. HIGH-RES WALL MURAL (4096x2048, Reference-Accurate Painted Wall)
  // ═════════════════════════════════════════════════════════════════════════════
  createHardwareWallMural(scene, HW_X, HW_R);

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. WORKBENCH TABLE (Spanning z = 6.8 to 12.8, Length = 6.0m, Depth = 0.92m)
  // ═════════════════════════════════════════════════════════════════════════════
  createHardwareWorkbench(scene, HW_X, HW_R);

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. LEFT SIDE: TOOL PEGBOARD & HANGING TOOLS + 4 STORAGE BOXES (z ≈ 7.4)
  // ═════════════════════════════════════════════════════════════════════════════
  createPegboardAndTools(scene, HW_X, HW_R);

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. CENTRE COMPONENT RACK: 12 TRANSPARENT BINS WITH LABELS & ICONS (z ≈ 9.4)
  // ═════════════════════════════════════════════════════════════════════════════
  createCentreComponentRack(scene, HW_X, HW_R, anim);

  // ═════════════════════════════════════════════════════════════════════════════
  // 5. TABLETOP PROTOTYPING & SOLDERING STATION (z ≈ 9.2 to 10.4)
  // ═════════════════════════════════════════════════════════════════════════════
  createTabletopSolderingStation(scene, HW_X, HW_R);

  // ═════════════════════════════════════════════════════════════════════════════
  // 6. RIGHT SIDE RACK: POWER SUPPLY, OSCILLOSCOPE & DRAWER CABINET (z ≈ 11.8)
  // ═════════════════════════════════════════════════════════════════════════════
  createInstrumentRack(scene, HW_X, HW_R);

  // ═════════════════════════════════════════════════════════════════════════════
  // 7. TASK CHAIR: BLACK MESH BACK WITH VIBRANT ORANGE SEAT CUSHION
  // ═════════════════════════════════════════════════════════════════════════════
  createChair(scene, HW_X - 1.15, 9.8, Math.PI / 2, { orangeSeat: true });

  // ═════════════════════════════════════════════════════════════════════════════
  // 8. DIRECTIONAL DAYLIGHT ILLUMINATION & FILL
  // ═════════════════════════════════════════════════════════════════════════════
  const hwLight = new THREE.DirectionalLight(0xfffaed, 0.65);
  hwLight.position.set(HW_X - 5.0, 4.5, 9.8);
  hwLight.target.position.set(HW_X, 1.2, 9.8);
  scene.add(hwLight);
  scene.add(hwLight.target);

  return anim;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HIGH-RES WALL MURAL (4096x2048, Reference-Accurate Painted Wall)
// ─────────────────────────────────────────────────────────────────────────────
function createHardwareWallMural(parent, HW_X, HW_R) {
  const W = 4096, H = 2048;

  const tex = canvasTex(W, H, (g) => {
    // 1. Warm peach/cream base wall paint
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, W, H);

    // 2. Bottom orange horizontal stripe (meeting skirting board)
    g.fillStyle = '#ff7a00';
    g.fillRect(0, H - 32, W, 32);

    // 3. Top-left corner orange painted triangle
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(580, 0);
    g.lineTo(0, 420);
    g.closePath();
    g.fill();

    // 4. SRI Logo at Top-Left (Lotus icon + "SRI" + swoosh)
    drawLotusSriLogo(g, 360, 260, 68);

    // 5. Thin vertical orange divider line
    g.fillStyle = '#ff7a00';
    g.fillRect(640, 140, 8, 240);

    // 6. Navy Outlined Microchip Icon
    drawMicrochipIcon(g, 800, 260, 85);

    // 7. Bold Navy "Hardware / Zone" Title on two lines
    g.fillStyle = '#14284b';
    g.font = `900 135px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Hardware', 960, 205);
    g.fillText('Zone', 960, 335);

    // 8. Vibrant Orange Brush-Stroke Underline below "Hardware Zone"
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(960, 395);
    g.lineTo(1680, 395);
    g.quadraticCurveTo(1740, 400, 1720, 412);
    g.lineTo(950, 412);
    g.quadraticCurveTo(930, 403, 960, 395);
    g.fill();

    // 9. Large Orange Gear Icon on the Left (above the tool pegboard)
    drawLargeOrangeGear(g, 430, 820, 210, 8);

    // 10. Large Navy Diagonal Panel on the Right Side
    // Slanted boundary from x ≈ 2550 (top) to x ≈ 3400 (bottom)
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(2550, 0);
    g.lineTo(W, 0);
    g.lineTo(W, H);
    g.lineTo(3360, H);
    g.closePath();
    g.fill();

    // Orange diagonal accent stripe alongside navy panel
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(2490, 0);
    g.lineTo(2540, 0);
    g.lineTo(3350, H);
    g.lineTo(3300, H);
    g.closePath();
    g.fill();

    // 11. Orange Double Chevron (>>) on Navy Panel
    drawDoubleChevron(g, 2820, 265, 45);

    // 12. Stacked White Handwritten-Style Text on Navy Panel
    // "Electronics / Components / Robotics / IoT • Sensors"
    g.fillStyle = '#ffffff';
    g.font = `800 86px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Electronics', 2960, 160);
    g.fillText('Components', 2960, 265);
    g.fillText('Robotics', 2960, 370);
    g.fillText('IoT  •  Sensors', 2960, 475);
  });

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Physical plane covering from z = 6.6 to z = 13.6 (7.0m wide, 5.8m tall, center z = 10.1)
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 5.8), mat);
  mesh.position.set(HW_X - 0.02, 3.0, 10.1);
  mesh.rotation.y = HW_R;
  parent.add(mesh);
}

/** SRI Lotus Logo Helper */
function drawLotusSriLogo(g, cx, cy, r) {
  // Lotus leaf clusters fanning upward
  const treeTop = cy - r * 1.05;
  const stemBase = cy - r * 0.05;

  g.fillStyle = '#c05010';
  g.fillRect(cx - r * 0.07, treeTop + r * 0.55, r * 0.14, stemBase - (treeTop + r * 0.55));

  const leafCount = 13;
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);
    const angle = Math.PI + t * Math.PI;
    const dist = r * (0.42 + 0.26 * Math.sin(t * Math.PI));
    const lx = cx + Math.cos(angle) * dist;
    const ly = treeTop + r * 0.68 + Math.sin(angle) * dist * 0.72;
    const lr = r * (0.19 + 0.10 * Math.sin(t * Math.PI));
    const mix = Math.sin(t * Math.PI);
    const red = Math.round(200 + 30 * mix);
    const grn = Math.round(80 + 20 * (1 - Math.abs(t - 0.5) * 2));
    g.fillStyle = `rgb(${red},${grn},10)`;
    g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fill();
  }

  // "SRI" in bold serif
  const fontSize = Math.round(r * 1.05);
  g.fillStyle = '#14284b';
  g.font = `900 ${fontSize}px Georgia, serif`;
  g.textAlign = 'center';
  g.textBaseline = 'top';
  g.fillText('SRI', cx, stemBase + r * 0.08);

  // Orange swoosh underline beneath "SRI"
  const swY = stemBase + r * 0.08 + fontSize + r * 0.08;
  g.strokeStyle = '#ff7a00';
  g.lineWidth = Math.max(3, r * 0.13);
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - r * 1.0, swY);
  g.quadraticCurveTo(cx + r * 0.15, swY + r * 0.38, cx + r * 1.0, swY - r * 0.08);
  g.stroke();
}

/** Microchip Icon Helper */
function drawMicrochipIcon(g, cx, cy, s) {
  g.strokeStyle = '#14284b';
  g.lineWidth = 10;
  g.lineCap = 'round';
  g.lineJoin = 'round';

  // Outer chip body with rounded corners
  const bW = s * 0.85;
  g.beginPath();
  g.roundRect(cx - bW / 2, cy - bW / 2, bW, bW, 16);
  g.stroke();

  // Inner die square
  const dW = s * 0.45;
  g.beginPath();
  g.roundRect(cx - dW / 2, cy - dW / 2, dW, dW, 8);
  g.stroke();

  // 3 Pin legs on each of the 4 sides
  const pinLen = s * 0.22;
  const pinSpacing = bW * 0.26;
  [-pinSpacing, 0, pinSpacing].forEach((offset) => {
    // Top & Bottom pins
    g.beginPath(); g.moveTo(cx + offset, cy - bW / 2); g.lineTo(cx + offset, cy - bW / 2 - pinLen); g.stroke();
    g.beginPath(); g.moveTo(cx + offset, cy + bW / 2); g.lineTo(cx + offset, cy + bW / 2 + pinLen); g.stroke();
    // Left & Right pins
    g.beginPath(); g.moveTo(cx - bW / 2, cy + offset); g.lineTo(cx - bW / 2 - pinLen, cy + offset); g.stroke();
    g.beginPath(); g.moveTo(cx + bW / 2, cy + offset); g.lineTo(cx + bW / 2 + pinLen, cy + offset); g.stroke();
  });
}

/** Large Orange Gear Icon Helper */
function drawLargeOrangeGear(g, cx, cy, r, teeth = 8) {
  g.fillStyle = '#ff7a00';
  g.beginPath();

  const outerR = r;
  const innerR = r * 0.78;
  const holeR = r * 0.38;
  const toothWidth = (Math.PI * 2) / (teeth * 2);

  for (let i = 0; i < teeth; i++) {
    const a1 = (i * Math.PI * 2) / teeth;
    const a2 = a1 + toothWidth * 0.55;
    const a3 = a1 + toothWidth;
    const a4 = a1 + toothWidth * 1.45;

    g.lineTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR);
    g.lineTo(cx + Math.cos(a2) * outerR, cy + Math.sin(a2) * outerR);
    g.lineTo(cx + Math.cos(a3) * outerR, cy + Math.sin(a3) * outerR);
    g.lineTo(cx + Math.cos(a4) * innerR, cy + Math.sin(a4) * innerR);
  }
  g.closePath();
  g.fill();

  // Central circular cutout (cream background)
  g.fillStyle = '#fff1e3';
  g.beginPath();
  g.arc(cx, cy, holeR, 0, Math.PI * 2);
  g.fill();
}

/** Orange Double Chevron Helper (>>) */
function drawDoubleChevron(g, cx, cy, h) {
  g.fillStyle = '#ff7a00';
  [-h * 0.35, h * 0.35].forEach((dx) => {
    g.beginPath();
    g.moveTo(cx + dx - h * 0.35, cy - h * 0.5);
    g.lineTo(cx + dx + h * 0.15, cy);
    g.lineTo(cx + dx - h * 0.35, cy + h * 0.5);
    g.lineTo(cx + dx - h * 0.10, cy + h * 0.5);
    g.lineTo(cx + dx + h * 0.40, cy);
    g.lineTo(cx + dx - h * 0.10, cy - h * 0.5);
    g.closePath();
    g.fill();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. WORKBENCH TABLE
// ─────────────────────────────────────────────────────────────────────────────
function createHardwareWorkbench(parent, HW_X, HW_R) {
  const g = new THREE.Group();

  const tW = 6.0;   // Length along Z (from z = 6.8 to 12.8)
  const tD = 0.95;  // Depth along X
  const tH = 0.82;  // Height
  const tZ = 9.8;   // Center in Z
  const tX = HW_X - tD / 2;

  // Solid blonde wood tabletop with smooth bevelled edge
  const woodMat = M(C.wood, { roughness: 0.55 });
  box(g, tD, 0.05, tW, woodMat, tX, tH, tZ);

  // Black steel perimeter sub-frame
  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  box(g, 0.04, 0.04, tW - 0.08, steelMat, tX - tD / 2 + 0.04, tH - 0.04, tZ);
  box(g, 0.04, 0.04, tW - 0.08, steelMat, tX + tD / 2 - 0.04, tH - 0.04, tZ);

  // Black steel legs at intervals along Z
  const legZ = [tZ - tW / 2 + 0.08, tZ, tZ + tW / 2 - 0.08];
  const legContactMat = M(0x000000, { transparent: true, opacity: 0.18, roughness: 1 });

  legZ.forEach((lz) => {
    // Outer leg
    box(g, 0.05, tH, 0.05, steelMat, tX - tD / 2 + 0.05, tH / 2, lz);
    // Inner leg
    box(g, 0.05, tH, 0.05, steelMat, tX + tD / 2 - 0.05, tH / 2, lz);
    // Lower crossbar
    box(g, tD - 0.10, 0.04, 0.04, steelMat, tX, 0.18, lz);

    // Ground contact shadow pads
    const pad1 = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), legContactMat);
    pad1.rotation.x = -Math.PI / 2;
    pad1.position.set(tX - tD / 2 + 0.05, 0.005, lz);
    g.add(pad1);

    const pad2 = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), legContactMat);
    pad2.rotation.x = -Math.PI / 2;
    pad2.position.set(tX + tD / 2 - 0.05, 0.005, lz);
    g.add(pad2);
  });

  // 3 Large transparent storage bins on the floor under the table
  [-1.6, 0.2, 1.8].forEach((dz) => {
    createClearStorageBox(g, tX + 0.05, 0.02, tZ + dz, 0.48, 0.26, 0.38);
  });

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LEFT SIDE: TOOL PEGBOARD & HANGING TOOLS (z ≈ 7.4)
// ─────────────────────────────────────────────────────────────────────────────
function createPegboardAndTools(parent, HW_X, HW_R) {
  const g = new THREE.Group();
  const pbZ = 7.45;
  const pbY = 2.05;
  const pbW = 1.25;
  const pbH = 1.35;

  // 1. Dark Pegboard with Grid of Holes Texture
  const pegboardTex = canvasTex(512, 512, (ctx, cw, ch) => {
    // Dark slate background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, cw, ch);

    // Grid of small holes
    ctx.fillStyle = '#0f172a';
    const step = 20;
    for (let x = 12; x < cw; x += step) {
      for (let y = 12; y < ch; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  const pbMat = new THREE.MeshStandardMaterial({
    map: pegboardTex,
    roughness: 0.65,
    metalness: 0.3,
  });

  const pbMesh = new THREE.Mesh(new THREE.PlaneGeometry(pbW, pbH), pbMat);
  pbMesh.position.set(HW_X - 0.03, pbY, pbZ);
  pbMesh.rotation.y = HW_R;
  g.add(pbMesh);

  // Black aluminum border frame
  const frameMat = M(C.black, { roughness: 0.4, metalness: 0.5 });
  box(g, 0.03, pbH + 0.04, 0.03, frameMat, HW_X - 0.03, pbY, pbZ - pbW / 2);
  box(g, 0.03, pbH + 0.04, 0.03, frameMat, HW_X - 0.03, pbY, pbZ + pbW / 2);
  box(g, 0.03, 0.03, pbW + 0.04, frameMat, HW_X - 0.03, pbY + pbH / 2, pbZ);
  box(g, 0.03, 0.03, pbW + 0.04, frameMat, HW_X - 0.03, pbY - pbH / 2, pbZ);

  // 2. Hanging Tools on Pegboard:
  const tGroup = new THREE.Group();
  tGroup.position.set(HW_X - 0.06, pbY, pbZ);
  tGroup.rotation.y = HW_R;

  const orangeGripMat = M(0xff7a00, { roughness: 0.5 });
  const redOrangeMat = M(0xe04020, { roughness: 0.5 });
  const steelHeadMat = M(0x94a3b8, { metalness: 0.85, roughness: 0.25 });
  const yellowMat = M(0xf59e0b, { roughness: 0.4 });
  const blueMat = M(0x2563eb, { roughness: 0.4 });

  // (a) 2 Pliers (Orange handles, chrome jaws) at top left
  [-0.42, -0.24].forEach((px) => {
    const plier = new THREE.Group();
    plier.position.set(px, 0.32, 0.02);
    // Steel jaws
    box(plier, 0.045, 0.09, 0.02, steelHeadMat, 0, 0.05, 0);
    // Pivot rivet
    cyl(plier, 0.012, 0.012, 0.022, M(C.black), 0, 0.03, 0, 8);
    // Orange rubber handles
    cyl(plier, 0.014, 0.012, 0.12, orangeGripMat, -0.025, -0.04, 0, 8);
    cyl(plier, 0.014, 0.012, 0.12, orangeGripMat, 0.025, -0.04, 0, 8);
    tGroup.add(plier);
  });

  // (b) 3 Screwdrivers (Fluted black & yellow handles) at top center
  [-0.06, 0.06, 0.18].forEach((sx, i) => {
    const sdriver = new THREE.Group();
    sdriver.position.set(sx, 0.34, 0.02);
    // Steel shaft
    cyl(sdriver, 0.005, 0.005, 0.14 + i * 0.02, steelHeadMat, 0, -0.06, 0, 6);
    // Handle
    cyl(sdriver, 0.016, 0.014, 0.09, yellowMat, 0, 0.04, 0, 8);
    // Black grip ribs
    cyl(sdriver, 0.017, 0.017, 0.015, M(C.black), 0, 0.04, 0, 8);
    tGroup.add(sdriver);
  });

  // (c) Blue Hot Glue Gun (hanging at top right, x ≈ +0.38)
  const glueGun = new THREE.Group();
  glueGun.position.set(0.38, 0.30, 0.02);
  // Body
  box(glueGun, 0.12, 0.05, 0.03, blueMat, 0, 0, 0);
  // Handle angled down
  const gunHandle = box(glueGun, 0.032, 0.08, 0.028, blueMat, -0.03, -0.05, 0);
  gunHandle.rotation.z = 0.2;
  // Orange trigger
  box(glueGun, 0.015, 0.03, 0.015, orangeGripMat, -0.01, -0.03, 0);
  // Metallic nozzle
  cyl(glueGun, 0.006, 0.01, 0.03, steelHeadMat, 0.07, 0, 0, 6).rotation.z = Math.PI / 2;
  tGroup.add(glueGun);

  // (d) 2 Side Cutters / Wire Cutters (Red-orange handles) at lower left
  [-0.42, -0.24].forEach((cx) => {
    const cutter = new THREE.Group();
    cutter.position.set(cx, -0.16, 0.02);
    box(cutter, 0.04, 0.06, 0.02, steelHeadMat, 0, 0.03, 0);
    cyl(cutter, 0.013, 0.011, 0.10, redOrangeMat, -0.022, -0.04, 0, 8);
    cyl(cutter, 0.013, 0.011, 0.10, redOrangeMat, 0.022, -0.04, 0, 8);
    tGroup.add(cutter);
  });

  // (e) Roll of White Electrical Tape hanging on a peg (x ≈ -0.05, y ≈ -0.15)
  const tapeRoll = new THREE.Group();
  tapeRoll.position.set(-0.05, -0.16, 0.025);
  cyl(tapeRoll, 0.055, 0.055, 0.035, M(0xffffff, { roughness: 0.3 }), 0, 0, 0, 16);
  cyl(tapeRoll, 0.025, 0.025, 0.036, M(0xd1d5db, { roughness: 0.5 }), 0, 0, 0, 16); // cardboard core
  tGroup.add(tapeRoll);

  // (f) Digital Multimeter hanging at lower right (x ≈ 0.22, y ≈ -0.18)
  const dmm = new THREE.Group();
  dmm.position.set(0.22, -0.18, 0.025);
  // Rugged yellow bumper holster
  box(dmm, 0.09, 0.16, 0.032, yellowMat, 0, 0, 0);
  // Dark faceplate
  box(dmm, 0.076, 0.145, 0.01, M(0x18181b), 0, 0, 0.014);
  // LCD Display
  box(dmm, 0.055, 0.028, 0.005, Bm(0x94a3b8), 0, 0.042, 0.02);
  // Rotary switch dial
  cyl(dmm, 0.016, 0.016, 0.012, M(0xff7a00), 0, -0.012, 0.022, 10);
  // Hanging test leads (red & black)
  cyl(dmm, 0.004, 0.004, 0.18, M(0xdc2626), -0.018, -0.14, 0.02, 6);
  cyl(dmm, 0.004, 0.004, 0.18, M(0x18181b), 0.018, -0.14, 0.02, 6);
  tGroup.add(dmm);

  g.add(tGroup);

  // 3. Stack of 4 Transparent Storage Boxes on Table below Pegboard
  // 2 rows of 2 stacked on workbench surface (y = 0.82)
  const boxW = 0.26, boxH = 0.14, boxD = 0.24;
  [
    [-boxW / 2 - 0.02, 0.82 + boxH / 2],
    [boxW / 2 + 0.02, 0.82 + boxH / 2],
    [-boxW / 2 - 0.02, 0.82 + boxH * 1.5 + 0.01],
    [boxW / 2 + 0.02, 0.82 + boxH * 1.5 + 0.01],
  ].forEach(([dz, by]) => {
    createClearStorageBox(g, HW_X - 0.40, by, pbZ + dz, boxW, boxH, boxD);
  });

  parent.add(g);
  return g;
}

/** Clear Plastic Storage Box with Orange Latch Clip */
function createClearStorageBox(parent, x, y, z, w, h, d) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Semi-transparent frosted acrylic body
  const clearMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.38,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.80,
    ior: 1.48,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  box(g, d, h, w, clearMat, 0, 0, 0);

  // Box lid rim
  box(g, d + 0.01, 0.015, w + 0.01, M(0xffffff, { roughness: 0.4 }), 0, h / 2 + 0.005, 0);

  // Orange front latch clips
  const clipMat = M(0xff7a00, { roughness: 0.4 });
  box(g, 0.015, 0.035, 0.05, clipMat, -d / 2 - 0.005, h / 2 - 0.01, 0);

  // Visible components inside (small grey/green blocks)
  box(g, d * 0.5, h * 0.3, w * 0.5, M(0x334155, { roughness: 0.7 }), 0, -h * 0.2, 0);

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CENTRE COMPONENT RACK: 12 BINS WITH LABELS & ICONS (z ≈ 9.4)
// ─────────────────────────────────────────────────────────────────────────────
function createCentreComponentRack(parent, HW_X, HW_R, anim) {
  const g = new THREE.Group();

  const rZ = 9.4;
  const rX = HW_X - 0.35;
  const rW = 2.75;  // Width along Z
  const rD = 0.42;  // Depth along X
  const rH = 1.35;  // Height above table
  const topY = 0.82 + rH;

  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  const woodMat = M(C.wood, { roughness: 0.55 });

  // 1. Black Steel Frame uprights and shelf beams
  // 4 Upright vertical pillars
  [-rW / 2, rW / 2].forEach((pz) => {
    [-rD / 2, rD / 2].forEach((px) => {
      box(g, 0.035, rH, 0.035, steelMat, rX + px, 0.82 + rH / 2, rZ + pz);
    });
  });

  // 4 Horizontal Wooden Shelves (Tier 0, 1, 2, 3)
  const tierH = rH / 3; // ~0.45m
  for (let t = 0; t <= 3; t++) {
    const sY = 0.82 + t * tierH;
    box(g, rD, 0.025, rW, woodMat, rX, sY, rZ);
  }

  // 2. 12 Individual Transparent Parts Bins with Labels & Icons (3 Rows x 4 Cols)
  const binCols = 4;
  const binRows = 3;
  const colStep = (rW - 0.12) / binCols; // ~0.65m
  const bW = colStep - 0.05;            // ~0.60m wide
  const bH = 0.32;                      // Height of bin
  const bD = rD - 0.05;                 // Depth

  // 12 Label specifications matching the user reference
  const binSpecs = [
    // Row 0 (Top tier):
    { label: 'Microcontrollers', icon: 'IC' },
    { label: 'Sensors', icon: 'WAVE' },
    { label: 'Actuators', icon: 'GEAR' },
    { label: 'Motor Drivers', icon: 'MOTOR' },
    // Row 1 (Middle tier):
    { label: 'Modules', icon: 'CHIP' },
    { label: 'Displays (LCD / OLED)', icon: 'SCREEN' },
    { label: 'Communication (Wi-Fi/BLE)', icon: 'WIFI' },
    { label: 'Power & Battery', icon: 'BATT' },
    // Row 2 (Bottom tier):
    { label: 'Connectors', icon: 'PLUG' },
    { label: 'Cables & Wires', icon: 'WIRE' },
    { label: 'Switches', icon: 'SWITCH' },
    { label: 'Passive Components', icon: 'RESISTOR' },
  ];

  for (let row = 0; row < binRows; row++) {
    for (let col = 0; col < binCols; col++) {
      const idx = row * binCols + col;
      const spec = binSpecs[idx];

      const bz = rZ - rW / 2 + 0.06 + col * colStep + colStep / 2;
      // Top row in array = top shelf in world:
      const worldRow = 2 - row; // row 0 at top tier
      const by = 0.82 + worldRow * tierH + 0.02 + bH / 2;

      // Draw single component bin with custom label card
      createLabelledComponentBin(g, rX, by, bz, bW, bH, bD, spec, HW_R);
    }
  }

  // 3. Warm Orange LED Strip along the underside of the rack
  const ledY = 0.84;
  const ledMat = M(0xffa040, {
    emissive: 0xffa040,
    emissiveIntensity: 2.8,
    roughness: 0.2,
  });
  box(g, 0.02, 0.015, rW - 0.1, ledMat, rX - rD / 2 + 0.03, ledY, rZ);

  // Warm Downlight casting glow on cutting mat and workbench below
  const rackLight = new THREE.PointLight(0xff9933, 2.2, 3.5, 1.8);
  rackLight.position.set(rX - rD / 2 - 0.15, ledY - 0.05, rZ);
  g.add(rackLight);

  // 4. Props sitting proudly on the TOP shelf (y = topY + 0.02):
  const shelfTopY = topY + 0.015;

  // (a) Small RC Robot Car (z ≈ rZ - 0.95)
  createCar(g, rX, shelfTopY + 0.03, rZ - 0.95, 0xffc400);

  // (b) Articulated Robotic Arm in Orange & Black (z ≈ rZ - 0.35)
  const arm = createRoboticArm(g, rX, shelfTopY, rZ - 0.35, 0.65);

  // (c) Quadcopter Test Drone (z ≈ rZ + 0.35)
  const drone = createDrone(g, rX, shelfTopY + 0.05, rZ + 0.35);
  if (anim && drone) anim.spin.push(drone);

  // (d) Mini Robot Car (z ≈ rZ + 0.95)
  createCar(g, rX, shelfTopY + 0.03, rZ + 0.95, 0x2563eb);

  parent.add(g);
  return g;
}

/** Individual Labelled Transparent Component Bin */
function createLabelledComponentBin(parent, x, y, z, w, h, d, spec, HW_R) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // 1. Semi-transparent frosted acrylic box body
  const binMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.35,
    roughness: 0.22,
    transmission: 0.82,
    ior: 1.48,
    depthWrite: false,
  });
  box(g, d, h, w, binMat, 0, 0, 0);

  // Top rim
  box(g, d + 0.01, 0.015, w + 0.01, M(0xffffff, { roughness: 0.4 }), 0, h / 2, 0);

  // 2 Orange latch clips on the front face (room side, x = -d/2)
  const clipMat = M(0xff7a00, { roughness: 0.4 });
  [-w * 0.26, w * 0.26].forEach((cz) => {
    box(g, 0.018, 0.04, 0.055, clipMat, -d / 2 - 0.006, h / 2 - 0.015, cz);
  });

  // White front label card with crisp readable text & technical icon
  const labelTex = canvasTex(512, 220, (ctx, cw, ch) => {
    // White background card
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, cw - 8, ch - 8);

    // Mini Technical Icon
    ctx.strokeStyle = '#14284b';
    ctx.fillStyle = '#14284b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const ix = cw / 2;
    const iy = 62;

    switch (spec.icon) {
      case 'IC':
        ctx.strokeRect(ix - 24, iy - 24, 48, 48);
        ctx.fillRect(ix - 12, iy - 12, 24, 24);
        [-14, 0, 14].forEach((o) => {
          ctx.beginPath(); ctx.moveTo(ix + o, iy - 24); ctx.lineTo(ix + o, iy - 36); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ix + o, iy + 24); ctx.lineTo(ix + o, iy + 36); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ix - 24, iy + o); ctx.lineTo(ix - 36, iy + o); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ix + 24, iy + o); ctx.lineTo(ix + 36, iy + o); ctx.stroke();
        });
        break;
      case 'WAVE':
        ctx.beginPath(); ctx.arc(ix, iy + 14, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ix, iy + 14, 22, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix, iy + 14, 34, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke();
        break;
      case 'GEAR':
        ctx.beginPath(); ctx.arc(ix, iy, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix, iy, 9, 0, Math.PI * 2); ctx.fill();
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          ctx.fillRect(ix + Math.cos(ang) * 19 - 4, iy + Math.sin(ang) * 19 - 4, 8, 8);
        }
        break;
      case 'MOTOR':
        ctx.strokeRect(ix - 26, iy - 18, 52, 36);
        ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('M', ix, iy);
        ctx.fillRect(ix + 26, iy - 5, 12, 10);
        break;
      case 'SCREEN':
        ctx.strokeRect(ix - 28, iy - 20, 56, 40);
        ctx.fillStyle = '#00f5ff';
        ctx.fillRect(ix - 22, iy - 14, 44, 28);
        break;
      case 'WIFI':
        ctx.beginPath(); ctx.arc(ix, iy + 14, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ix, iy + 14, 20, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix, iy + 14, 32, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
        break;
      case 'BATT':
        ctx.strokeRect(ix - 24, iy - 16, 48, 32);
        ctx.fillRect(ix + 24, iy - 6, 6, 12);
        ctx.fillStyle = '#ff7a00';
        ctx.fillRect(ix - 18, iy - 10, 24, 20);
        break;
      default:
        ctx.strokeRect(ix - 20, iy - 20, 40, 40);
        ctx.beginPath(); ctx.moveTo(ix - 20, iy); ctx.lineTo(ix + 20, iy); ctx.stroke();
        break;
    }

    // Label Text
    ctx.fillStyle = '#14284b';
    ctx.font = `900 34px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spec.label, cw / 2, 160);
  });

  const labelCard = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.76, h * 0.44),
    new THREE.MeshBasicMaterial({ map: labelTex })
  );
  labelCard.position.set(-d / 2 - 0.008, -0.01, 0);
  labelCard.rotation.y = HW_R;
  g.add(labelCard);

  // Visible components inside (internal electronic models)
  box(g, d * 0.5, h * 0.25, w * 0.55, M(0x1e293b, { roughness: 0.8 }), 0, -h * 0.22, 0);

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TABLETOP PROTOTYPING & SOLDERING STATION (z ≈ 9.2 to 10.4)
// ─────────────────────────────────────────────────────────────────────────────
function createTabletopSolderingStation(parent, HW_X, HW_R) {
  const g = new THREE.Group();

  const deskY = 0.82;
  const deskX = HW_X - 0.65; // Positioned forward on the desk

  // 1. Green Self-Healing Cutting Mat (z ≈ 9.7, 0.85m x 0.55m)
  const matW = 0.85, matD = 0.55;
  const matTex = canvasTex(512, 340, (ctx, cw, ch) => {
    // Forest green background
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, cw, ch);

    // Fine grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = 10; x < cw; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, ch - 10); ctx.stroke();
    }
    for (let y = 10; y < ch; y += step) {
      ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(cw - 10, y); ctx.stroke();
    }

    // Outer border & grid centimeter markings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(10, 10, cw - 20, ch - 20);

    // Angle guide lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath(); ctx.moveTo(cw / 2, ch / 2); ctx.lineTo(cw - 10, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw / 2, ch / 2); ctx.lineTo(10, 10); ctx.stroke();
  });

  const cuttingMat = new THREE.Mesh(
    new THREE.PlaneGeometry(matD, matW),
    new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.5 })
  );
  cuttingMat.rotation.x = -Math.PI / 2;
  cuttingMat.rotation.z = Math.PI / 2;
  cuttingMat.position.set(deskX, deskY + 0.005, 9.7);
  g.add(cuttingMat);

  // 2. Blue Digital Soldering Station (z ≈ 9.05)
  const sStation = new THREE.Group();
  sStation.position.set(deskX, deskY + 0.01, 9.05);

  // Slanted blue enclosure
  const stationBlueMat = M(0x1d4ed8, { roughness: 0.35 });
  box(sStation, 0.16, 0.10, 0.14, stationBlueMat, 0, 0.05, 0);

  // Digital LED Screen showing "350°C" in glowing cyan
  const screenTex = canvasTex(128, 64, (ctx, cw, ch) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('350°C', cw / 2, ch / 2);
  });
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.08, 0.04),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screenMesh.position.set(-0.081, 0.06, 0);
  screenMesh.rotation.y = -Math.PI / 2;
  sStation.add(screenMesh);

  // Control knob & power switch
  cyl(sStation, 0.014, 0.014, 0.015, M(C.black), -0.081, 0.025, -0.03, 10).rotation.z = Math.PI / 2;
  box(sStation, 0.008, 0.015, 0.015, M(0xff7a00), -0.081, 0.025, 0.035);

  // Soldering iron safety stand with coiled spring
  const standX = 0.0, standZ = 0.16;
  box(sStation, 0.14, 0.025, 0.08, M(C.black), standX, 0.012, standZ);
  // Coiled metal spring cage
  cyl(sStation, 0.025, 0.022, 0.10, M(0xd1d5db, { metalness: 0.85 }), standX, 0.06, standZ, 12).rotation.x = -0.55;
  // Brass cleaning sponge cup
  cyl(sStation, 0.022, 0.022, 0.02, M(0xd4af37, { roughness: 0.8 }), standX, 0.025, standZ - 0.04, 10);
  // Soldering iron handle resting in stand
  cyl(sStation, 0.012, 0.012, 0.14, M(0x18181b), standX, 0.09, standZ + 0.02, 8).rotation.x = -0.55;

  g.add(sStation);

  // 3. Helping-Hands Magnifier with PCB (z ≈ 9.6)
  const hhGroup = new THREE.Group();
  hhGroup.position.set(deskX + 0.15, deskY + 0.01, 9.6);

  // Heavy cast-iron base
  box(hhGroup, 0.09, 0.025, 0.08, M(0x18181b, { metalness: 0.8, roughness: 0.6 }), 0, 0.012, 0);
  // Chrome upright post
  cyl(hhGroup, 0.006, 0.006, 0.14, M(0xd1d5db, { metalness: 0.9 }), 0, 0.08, 0, 8);
  // Horizontal crossbar
  cyl(hhGroup, 0.005, 0.005, 0.18, M(0xd1d5db, { metalness: 0.9 }), 0, 0.12, 0, 8).rotation.x = Math.PI / 2;

  // Dual alligator clips holding small green PCB
  box(hhGroup, 0.008, 0.06, 0.09, M(0x15803d, { roughness: 0.5 }), -0.04, 0.12, 0);

  // Circular magnifying glass on top
  const lensRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.005, 8, 20),
    M(0xd1d5db, { metalness: 0.9, roughness: 0.2 })
  );
  lensRing.position.set(0, 0.18, 0);
  lensRing.rotation.y = Math.PI / 2;
  hhGroup.add(lensRing);

  const lensGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.038, 16),
    new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.35, roughness: 0.05, transmission: 0.9 })
  );
  lensGlass.position.set(0, 0.18, 0);
  lensGlass.rotation.y = Math.PI / 2;
  hhGroup.add(lensGlass);

  g.add(hhGroup);

  // 4. Rosin-Core Solder Wire Spool on Stand (z ≈ 9.95)
  const spoolGroup = new THREE.Group();
  spoolGroup.position.set(deskX + 0.12, deskY + 0.01, 9.95);
  // Metal stand
  box(spoolGroup, 0.06, 0.08, 0.01, M(C.black), 0, 0.04, -0.04);
  box(spoolGroup, 0.06, 0.08, 0.01, M(C.black), 0, 0.04, 0.04);
  // Blue plastic spool core with silver solder wire
  cyl(spoolGroup, 0.035, 0.035, 0.06, M(0x2563eb), 0, 0.045, 0, 14).rotation.x = Math.PI / 2;
  cyl(spoolGroup, 0.032, 0.032, 0.045, M(0xd1d5db, { metalness: 0.9 }), 0, 0.045, 0, 14).rotation.x = Math.PI / 2;
  g.add(spoolGroup);

  // 5. Anti-Static ESD Component Parts Tray (z ≈ 10.3)
  const trayGroup = new THREE.Group();
  trayGroup.position.set(deskX, deskY + 0.01, 10.25);
  box(trayGroup, 0.18, 0.025, 0.26, M(0x0f172a, { roughness: 0.7 }), 0, 0.012, 0);
  // Multi-compartment dividers
  box(trayGroup, 0.16, 0.02, 0.005, M(0x334155), 0, 0.015, 0);
  box(trayGroup, 0.005, 0.02, 0.24, M(0x334155), 0, 0.015, 0);
  // Assorted resistors and small ICs inside
  box(trayGroup, 0.03, 0.008, 0.05, M(0x22c55e), -0.04, 0.015, -0.05);
  box(trayGroup, 0.025, 0.01, 0.04, M(0xff7a00), 0.04, 0.015, 0.05);
  g.add(trayGroup);

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RIGHT SIDE RACK: POWER SUPPLY, OSCILLOSCOPE & INSTRUMENTS (z ≈ 11.8)
// ─────────────────────────────────────────────────────────────────────────────
function createInstrumentRack(parent, HW_X, HW_R) {
  const g = new THREE.Group();

  const rZ = 11.85;
  const rX = HW_X - 0.38;
  const rW = 1.35; // Width along Z
  const rD = 0.52; // Depth along X
  const rH = 1.65; // Height above table
  const topY = 0.82 + rH;

  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  const woodMat = M(C.wood, { roughness: 0.55 });

  // 1. Black Steel Frame & 3 Wooden Shelves
  [-rW / 2, rW / 2].forEach((pz) => {
    [-rD / 2, rD / 2].forEach((px) => {
      box(g, 0.035, rH, 0.035, steelMat, rX + px, 0.82 + rH / 2, rZ + pz);
    });
  });

  const shelfY1 = 0.82;        // Table level
  const shelfY2 = 0.82 + 0.52; // Middle shelf
  const shelfY3 = 0.82 + 1.05; // Upper shelf
  const shelfY4 = topY;        // Top shelf

  [shelfY2, shelfY3, shelfY4].forEach((sy) => {
    box(g, rD, 0.025, rW, woodMat, rX, sy, rZ);
  });

  // 2. TOP SHELF (y = shelfY4): 3 Stacked Transparent Storage Boxes with Orange Clips
  const boxW = 0.32, boxH = 0.15, boxD = 0.28;
  [-0.35, 0.0, 0.35].forEach((dz) => {
    createClearStorageBox(g, rX, shelfY4 + boxH / 2 + 0.015, rZ + dz, boxW, boxH, boxD);
  });

  // 3. MIDDLE SHELF (y = shelfY3): Blue Multi-Drawer Component Organizer
  const cabW = 1.05, cabH = 0.42, cabD = 0.34;
  const cabGroup = new THREE.Group();
  cabGroup.position.set(rX, shelfY3 + cabH / 2 + 0.015, rZ);

  // Blue metal casing
  box(cabGroup, cabD, cabH, cabW, M(0x1d4ed8, { roughness: 0.4 }), 0, 0, 0);

  // 4 Columns x 3 Rows = 12 small transparent parts drawers
  const dCols = 4, dRows = 3;
  const dw = (cabW - 0.06) / dCols;
  const dh = (cabH - 0.06) / dRows;
  const drawerMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    transparent: true,
    opacity: 0.45,
    roughness: 0.3,
    transmission: 0.75,
  });

  for (let r = 0; r < dRows; r++) {
    for (let c = 0; c < dCols; c++) {
      const dz = -cabW / 2 + 0.03 + c * dw + dw / 2;
      const dy = -cabH / 2 + 0.03 + r * dh + dh / 2;
      box(cabGroup, cabD * 0.95, dh - 0.01, dw - 0.01, drawerMat, -0.01, dy, dz);
      // Small orange pull handle
      box(cabGroup, 0.012, 0.015, 0.04, M(0xff7a00), -cabD / 2 - 0.005, dy, dz);
    }
  }
  g.add(cabGroup);

  // 4. BOTTOM SHELF / TABLETOP (y = 0.82): Precision Instruments
  // (a) Bench DC Power Supply (z ≈ rZ - 0.28)
  const psGroup = new THREE.Group();
  psGroup.position.set(rX, shelfY1 + 0.16, rZ - 0.28);

  const psMat = M(0xf1f5f9, { roughness: 0.4 });
  box(psGroup, 0.32, 0.28, 0.24, psMat, 0, 0, 0);

  // Glowing Green/Cyan 7-Segment LED Displays ("30.00 V" / "5.000 A")
  const psScreenTex = canvasTex(256, 160, (ctx, cw, ch) => {
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, cw - 8, ch - 8);

    ctx.fillStyle = '#00ff88';
    ctx.font = '900 48px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('30.00 V', cw - 18, 62);
    ctx.fillText('5.000 A', cw - 18, 128);
  });

  const psDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.12),
    new THREE.MeshBasicMaterial({ map: psScreenTex })
  );
  psDisplay.position.set(-0.161, 0.04, 0);
  psDisplay.rotation.y = -Math.PI / 2;
  psGroup.add(psDisplay);

  // Binding post terminals (Red +, Black -, Green GND)
  cyl(psGroup, 0.01, 0.01, 0.02, M(0xdc2626), -0.165, -0.08, -0.05, 8).rotation.z = Math.PI / 2;
  cyl(psGroup, 0.01, 0.01, 0.02, M(0x18181b), -0.165, -0.08, 0.0, 8).rotation.z = Math.PI / 2;
  cyl(psGroup, 0.01, 0.01, 0.02, M(0x16a34a), -0.165, -0.08, 0.05, 8).rotation.z = Math.PI / 2;

  // Adjustment knobs
  cyl(psGroup, 0.014, 0.014, 0.015, M(0x334155), -0.165, -0.03, -0.05, 10).rotation.z = Math.PI / 2;
  cyl(psGroup, 0.014, 0.014, 0.015, M(0x334155), -0.165, -0.03, 0.05, 10).rotation.z = Math.PI / 2;

  g.add(psGroup);

  // (b) Digital Storage Oscilloscope (z ≈ rZ + 0.28)
  const oScopeGroup = new THREE.Group();
  oScopeGroup.position.set(rX, shelfY1 + 0.16, rZ + 0.28);

  const scopeMat = M(0xf8fafc, { roughness: 0.35 });
  box(oScopeGroup, 0.30, 0.26, 0.36, scopeMat, 0, 0, 0);

  // Glowing Screen with Graticule Grid & Bright Green Sine Wave Trace
  const scopeScreenTex = canvasTex(256, 192, (ctx, cw, ch) => {
    // Dark CRT navy background
    ctx.fillStyle = '#05131e';
    ctx.fillRect(0, 0, cw, ch);

    // Fine oscilloscope graticule grid (8 div x 10 div)
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.20)';
    ctx.lineWidth = 1;
    for (let x = 0; x < cw; x += 25.6) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
    }
    for (let y = 0; y < ch; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
    }

    // Bright glowing green sine wave trace
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let x = 0; x < cw; x++) {
      const y = ch / 2 + Math.sin(x * 0.06) * 55;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Measurement OSD telemetry text
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 13px monospace';
    ctx.shadowBlur = 0;
    ctx.fillText('CH1: 2.00V', 10, 18);
    ctx.fillText('1.00 kHz', 10, 34);
  });

  const scopeScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.14),
    new THREE.MeshBasicMaterial({ map: scopeScreenTex })
  );
  scopeScreen.position.set(-0.151, 0.02, -0.06);
  scopeScreen.rotation.y = -Math.PI / 2;
  oScopeGroup.add(scopeScreen);

  // Control knobs & BNC inputs on right side of front panel
  [0.04, 0.10].forEach((kz) => {
    cyl(oScopeGroup, 0.015, 0.015, 0.018, M(0x475569), -0.152, 0.05, kz, 10).rotation.z = Math.PI / 2;
    cyl(oScopeGroup, 0.012, 0.012, 0.018, M(0x475569), -0.152, -0.02, kz, 10).rotation.z = Math.PI / 2;
    // BNC connector
    cyl(oScopeGroup, 0.008, 0.008, 0.02, M(0xd1d5db, { metalness: 0.9 }), -0.152, -0.07, kz, 8).rotation.z = Math.PI / 2;
  });

  g.add(oScopeGroup);

  parent.add(g);
  return g;
}
