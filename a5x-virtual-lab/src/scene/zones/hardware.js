/**
 * zones/hardware.js — Photo-Accurate, Spacious Recreation of the HARDWARE ZONE
 * Built to match reference image (media_1794745193113_8aaf06a5.jpg) with a spacious,
 * breathing layout, real painted-wall feel, and high-fidelity props.
 *
 * Layout Overview (Right Wall, x = 19.78, facing -X into room):
 *  - Doorway walking buffer: z = 5.95 to 7.60 (1.65m clear walking corridor)
 *  - Group 1: Tool Pegboard & Dedicated Workbench (z = 7.60 to 8.70, width = 1.10m)
 *  - Gap 1: 0.50m breathing gap (z = 8.70 to 9.20)
 *  - Group 2: Main Prototyping Workbench (z = 9.20 to 12.50, width = 3.30m, depth = 1.15m)
 *      • Left Workstation: Soldering area (cutting mat, blue soldering station, iron stand,
 *        helping hands with PCB, solder spool, ESD parts tray)
 *      • Right Workstation: Assembly area (digital multimeter, prototype board, components)
 *      • Center: 12-Bin Component Rack with crisp, high-contrast readable labels & icons
 *      • Top of rack: RC car, articulated robotic arm, test drone, mini robot car
 *      • Warm orange LED strip under rack casting downlight
 *      • 2 Full-Sized Ergonomic Chairs with mesh back & vibrant orange seat
 *      • 3 Under-table storage bins tucked neatly inside footprint with soft contact shadows
 *  - Gap 2: 0.50m breathing gap (z = 12.50 to 13.00)
 *  - Group 3: Floor-Standing Instrument Rack (z = 13.00 to 14.30, width = 1.30m, y = 0 to 2.20m)
 *      • Bottom shelf: 2 large storage boxes
 *      • Desk-level shelf: Bench DC power supply ("30.00 V / 5.000 A") & digital oscilloscope (sine wave)
 *      • Middle shelf: Blue 12-drawer component organizer
 *      • Top shelf: 3 stacked storage boxes
 *  - Corner buffer: z = 14.30 to 14.70 (0.40m buffer to front wall corner)
 */

import * as THREE from 'three';
import { box, cyl } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';
import { createChair } from '../props/furniture.js';
import { createDrone, createCar, createRoboticArm } from '../props/equipment.js';

export function buildHardwareZone(scene) {
  const anim = { spin: [] };

  const HW_X = 19.78;         // Right wall inner surface X
  const HW_R = -Math.PI / 2;   // Facing into room (-X)

  // 1. HIGH-RES WALL MURAL (4096x2048, Authentic Painted Wall)
  createHardwareWallMural(scene, HW_X, HW_R);

  // 2. GROUP 1: TOOL PEGBOARD & WORKBENCH SECTION (z = 7.60 to 8.70)
  createToolStation(scene, HW_X, HW_R);

  // 3. GROUP 2: MAIN PROTOTYPING WORKBENCH & 12-BIN RACK (z = 9.20 to 12.50)
  createMainWorkbenchAndRack(scene, HW_X, HW_R, anim);

  // 4. TABLETOP WORKSTATIONS: SOLDERING (Left) & ASSEMBLY (Right)
  createTabletopWorkstations(scene, HW_X, HW_R);

  // 5. TWO ERGONOMIC CHAIRS (Mesh back, vibrant orange seat)
  createChairs(scene, HW_X);

  // 6. UNDER-TABLE STORAGE BINS (Safely inside footprint with contact shadows)
  createUnderTableBins(scene, HW_X);

  // 7. GROUP 3: FLOOR-STANDING INSTRUMENT RACK (z = 13.00 to 14.30)
  createFloorInstrumentRack(scene, HW_X, HW_R);

  // 8. WARM FILL ILLUMINATION
  const hwLight = new THREE.DirectionalLight(0xfffaed, 0.65);
  hwLight.position.set(HW_X - 5.5, 4.8, 10.85);
  hwLight.target.position.set(HW_X, 1.2, 10.85);
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

    // Subtle paint texture/grain across entire wall
    g.fillStyle = 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < 40000; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      g.fillRect(rx, ry, 2, 2);
    }

    // 2. Bottom orange horizontal stripe (meeting skirting board)
    g.fillStyle = '#ff7a00';
    g.fillRect(0, H - 32, W, 32);

    // 3. Top-left corner orange painted triangle
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(720, 0);
    g.lineTo(0, 520);
    g.closePath();
    g.fill();

    // 4. SRI Logo at Top-Left (Scaled up ~35% for balanced upper wall)
    drawLotusSriLogo(g, 420, 290, 95);

    // 5. Thin vertical orange divider line
    g.fillStyle = '#ff7a00';
    g.fillRect(750, 140, 10, 320);

    // 6. Navy Outlined Microchip Icon (Scaled up ~40%)
    drawMicrochipIcon(g, 980, 290, 120);

    // 7. Bold Navy "Hardware / Zone" Title (Scaled up ~37%)
    g.fillStyle = '#14284b';
    g.font = `900 185px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Hardware', 1180, 225);
    g.fillText('Zone', 1180, 395);

    // 8. Vibrant Orange Brush-Stroke Underline below "Hardware Zone"
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(1180, 465);
    g.lineTo(2180, 465);
    g.quadraticCurveTo(2250, 472, 2220, 486);
    g.lineTo(1170, 486);
    g.quadraticCurveTo(1140, 474, 1180, 465);
    g.fill();

    // 9. Large Orange Gear Icon on the Left (positioned nicely above pegboard)
    drawLargeOrangeGear(g, 500, 760, 200, 8);

    // 10. Large Navy Diagonal Panel on the Right Side
    // Slanted boundary: top x = 2460 to bottom x = 3300
    // Subtle drop shadow under paint edge
    g.save();
    g.shadowColor = 'rgba(20, 40, 75, 0.25)';
    g.shadowBlur = 12;
    g.shadowOffsetX = -4;

    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(2460, 0);
    g.lineTo(W, 0);
    g.lineTo(W, H);
    g.lineTo(3300, H);
    g.closePath();
    g.fill();
    g.restore();

    // Orange diagonal accent stripe alongside navy panel
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(2390, 0);
    g.lineTo(2450, 0);
    g.lineTo(3290, H);
    g.lineTo(3230, H);
    g.closePath();
    g.fill();

    // 11. Orange Double Chevron (>>) on Navy Panel (Scaled up)
    drawDoubleChevron(g, 2760, 305, 65);

    // 12. Stacked White Bold Text on Navy Panel (Scaled up ~35%)
    // Placed high in top 30% of wall so it stays completely clear of all objects
    g.fillStyle = '#ffffff';
    g.font = `900 115px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Electronics', 2900, 175);
    g.fillText('Components', 2900, 310);
    g.fillText('Robotics', 2900, 445);
    g.fillText('IoT  •  Sensors', 2900, 580);
  });

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Physical plane covering from z = 7.4 to z = 14.6 (7.2m wide, 5.8m tall, center z = 11.0)
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 5.8), mat);
  mesh.position.set(HW_X - 0.02, 3.0, 11.0);
  mesh.rotation.y = HW_R;
  parent.add(mesh);
}

/** SRI Lotus Logo Helper */
function drawLotusSriLogo(g, cx, cy, r) {
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
    g.beginPath();
    g.arc(lx, ly, lr, 0, Math.PI * 2);
    g.fill();
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
  g.lineWidth = Math.max(4, r * 0.13);
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - r * 1.0, swY);
  g.quadraticCurveTo(cx + r * 0.15, swY + r * 0.38, cx + r * 1.0, swY - r * 0.08);
  g.stroke();
}

/** Microchip Icon Helper */
function drawMicrochipIcon(g, cx, cy, s) {
  g.strokeStyle = '#14284b';
  g.lineWidth = 12;
  g.lineCap = 'round';
  g.lineJoin = 'round';

  const bW = s * 0.85;
  g.beginPath();
  g.roundRect(cx - bW / 2, cy - bW / 2, bW, bW, 20);
  g.stroke();

  const dW = s * 0.45;
  g.beginPath();
  g.roundRect(cx - dW / 2, cy - dW / 2, dW, dW, 10);
  g.stroke();

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

  // Central circular cutout
  g.fillStyle = '#fff1e3';
  g.beginPath();
  g.arc(cx, cy, holeR, 0, Math.PI * 2);
  g.fill();
}

/** Orange Double Chevron Helper (>>) */
function drawDoubleChevron(g, cx, cy, h) {
  g.fillStyle = '#ff7a00';
  [-h * 0.38, h * 0.38].forEach((dx) => {
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
// 2. GROUP 1: TOOL PEGBOARD & WORKBENCH SECTION (z = 7.60 to 8.70, width = 1.10m)
// ─────────────────────────────────────────────────────────────────────────────
function createToolStation(parent, HW_X, HW_R) {
  const g = new THREE.Group();

  const pbZ = 8.15;
  const tW = 1.10;
  const tD = 1.10;
  const tH = 0.84;
  const tX = HW_X - tD / 2;

  const woodMat = M(C.wood, { roughness: 0.55 });
  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  const shadowMat = M(0x000000, { transparent: true, opacity: 0.22, roughness: 1 });

  // Dedicated Workbench section under pegboard
  // Thick blonde wood top with beveled edges
  box(g, tD, 0.055, tW, woodMat, tX, tH, pbZ);

  // Black steel perimeter sub-frame
  box(g, 0.04, 0.04, tW - 0.08, steelMat, tX - tD / 2 + 0.04, tH - 0.045, pbZ);
  box(g, 0.04, 0.04, tW - 0.08, steelMat, tX + tD / 2 - 0.04, tH - 0.045, pbZ);

  // 4 Black steel square legs
  const legZ = [pbZ - tW / 2 + 0.06, pbZ + tW / 2 - 0.06];
  const legX = [tX - tD / 2 + 0.06, tX + tD / 2 - 0.06];

  legZ.forEach((lz) => {
    legX.forEach((lx) => {
      // Leg pillar
      box(g, 0.05, tH, 0.05, steelMat, lx, tH / 2, lz);
      // Leg leveling foot
      box(g, 0.07, 0.02, 0.07, steelMat, lx, 0.01, lz);
      // Soft contact shadow pad
      const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.20, 0.20), shadowMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(lx, 0.005, lz);
      g.add(pad);
    });
    // Crossbar connecting legs
    box(g, tD - 0.12, 0.035, 0.035, steelMat, tX, 0.18, lz);
  });

  // WALL-MOUNTED PEGBOARD (Centered at z = 8.15, y = 1.95)
  const pbY = 1.95;
  const pbW = 1.05;
  const pbH = 1.25;

  const pegboardTex = canvasTex(512, 512, (ctx, cw, ch) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, cw, ch);

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

  // HANGING TOOLS ON PEGBOARD
  const tGroup = new THREE.Group();
  tGroup.position.set(HW_X - 0.06, pbY, pbZ);
  tGroup.rotation.y = HW_R;

  const orangeGripMat = M(0xff7a00, { roughness: 0.5 });
  const redOrangeMat = M(0xe04020, { roughness: 0.5 });
  const steelHeadMat = M(0x94a3b8, { metalness: 0.85, roughness: 0.25 });
  const yellowMat = M(0xf59e0b, { roughness: 0.4 });
  const blueMat = M(0x2563eb, { roughness: 0.4 });

  // (a) 2 Pliers (Orange handles, chrome jaws) at top left
  [-0.34, -0.18].forEach((px) => {
    const plier = new THREE.Group();
    plier.position.set(px, 0.28, 0.02);
    box(plier, 0.045, 0.09, 0.02, steelHeadMat, 0, 0.05, 0);
    cyl(plier, 0.012, 0.012, 0.022, M(C.black), 0, 0.03, 0, 8);
    cyl(plier, 0.014, 0.012, 0.12, orangeGripMat, -0.025, -0.04, 0, 8);
    cyl(plier, 0.014, 0.012, 0.12, orangeGripMat, 0.025, -0.04, 0, 8);
    tGroup.add(plier);
  });

  // (b) 3 Screwdrivers (Fluted black & yellow handles) at top center
  [-0.02, 0.09, 0.20].forEach((sx, i) => {
    const sdriver = new THREE.Group();
    sdriver.position.set(sx, 0.30, 0.02);
    cyl(sdriver, 0.005, 0.005, 0.14 + i * 0.02, steelHeadMat, 0, -0.06, 0, 6);
    cyl(sdriver, 0.016, 0.014, 0.09, yellowMat, 0, 0.04, 0, 8);
    cyl(sdriver, 0.017, 0.017, 0.015, M(C.black), 0, 0.04, 0, 8);
    tGroup.add(sdriver);
  });

  // (c) Blue Hot Glue Gun (hanging at top right)
  const glueGun = new THREE.Group();
  glueGun.position.set(0.36, 0.26, 0.02);
  box(glueGun, 0.12, 0.05, 0.03, blueMat, 0, 0, 0);
  const gunHandle = box(glueGun, 0.032, 0.08, 0.028, blueMat, -0.03, -0.05, 0);
  gunHandle.rotation.z = 0.2;
  box(glueGun, 0.015, 0.03, 0.015, orangeGripMat, -0.01, -0.03, 0);
  cyl(glueGun, 0.006, 0.01, 0.03, steelHeadMat, 0.07, 0, 0, 6).rotation.z = Math.PI / 2;
  tGroup.add(glueGun);

  // (d) 2 Side Cutters (Red-orange handles) at lower left
  [-0.34, -0.18].forEach((cx) => {
    const cutter = new THREE.Group();
    cutter.position.set(cx, -0.18, 0.02);
    box(cutter, 0.04, 0.06, 0.02, steelHeadMat, 0, 0.03, 0);
    cyl(cutter, 0.013, 0.011, 0.10, redOrangeMat, -0.022, -0.04, 0, 8);
    cyl(cutter, 0.013, 0.011, 0.10, redOrangeMat, 0.022, -0.04, 0, 8);
    tGroup.add(cutter);
  });

  // (e) Roll of White Electrical Tape hanging on peg
  const tapeRoll = new THREE.Group();
  tapeRoll.position.set(0.02, -0.18, 0.025);
  cyl(tapeRoll, 0.055, 0.055, 0.035, M(0xffffff, { roughness: 0.3 }), 0, 0, 0, 16);
  cyl(tapeRoll, 0.025, 0.025, 0.036, M(0xd1d5db, { roughness: 0.5 }), 0, 0, 0, 16);
  tGroup.add(tapeRoll);

  g.add(tGroup);

  // STACK OF 4 CLEAR STORAGE BOXES (Resting on table rear under pegboard)
  const boxW = 0.26, boxH = 0.14, boxD = 0.24;
  [
    [-boxW / 2 - 0.02, tH + boxH / 2 + 0.01],
    [boxW / 2 + 0.02, tH + boxH / 2 + 0.01],
    [-boxW / 2 - 0.02, tH + boxH * 1.5 + 0.02],
    [boxW / 2 + 0.02, tH + boxH * 1.5 + 0.02],
  ].forEach(([dz, by]) => {
    createClearStorageBox(g, HW_X - 0.36, by, pbZ + dz, boxW, boxH, boxD);
  });

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GROUP 2: MAIN PROTOTYPING WORKBENCH & 12-BIN RACK (z = 9.20 to 12.50)
// ─────────────────────────────────────────────────────────────────────────────
function createMainWorkbenchAndRack(parent, HW_X, HW_R, anim) {
  const g = new THREE.Group();

  const tW = 3.30;  // Spans z = 9.20 to 12.50
  const tD = 1.15;  // Deeper, heavy-duty workbench
  const tH = 0.84;  // Height
  const tZ = 10.85; // Center in Z
  const tX = HW_X - tD / 2;

  const woodMat = M(C.wood, { roughness: 0.55 });
  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  const shadowMat = M(0x000000, { transparent: true, opacity: 0.22, roughness: 1 });

  // 1. Thick solid blonde wood tabletop with rounded front edge
  box(g, tD, 0.06, tW, woodMat, tX, tH, tZ);

  // Front bevel / bullnose strip
  const bevelMat = M(C.wood, { roughness: 0.50 });
  cyl(g, 0.03, 0.03, tW, bevelMat, tX - tD / 2, tH, tZ, 12).rotation.x = Math.PI / 2;

  // Black steel perimeter sub-frame
  box(g, 0.045, 0.045, tW - 0.08, steelMat, tX - tD / 2 + 0.05, tH - 0.05, tZ);
  box(g, 0.045, 0.045, tW - 0.08, steelMat, tX + tD / 2 - 0.05, tH - 0.05, tZ);

  // 6 Sturdy black steel square legs (Left, Center, Right)
  const legZ = [tZ - tW / 2 + 0.08, tZ, tZ + tW / 2 - 0.08];
  const legX = [tX - tD / 2 + 0.06, tX + tD / 2 - 0.06];

  legZ.forEach((lz) => {
    legX.forEach((lx) => {
      // Main leg
      box(g, 0.055, tH, 0.055, steelMat, lx, tH / 2, lz);
      // Leveling foot pad
      box(g, 0.075, 0.02, 0.075, steelMat, lx, 0.01, lz);
      // Soft contact shadow pad
      const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), shadowMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(lx, 0.005, lz);
      g.add(pad);
    });
    // Crossbar connecting front & back legs
    box(g, tD - 0.12, 0.04, 0.04, steelMat, tX, 0.18, lz);
  });

  // Long longitudinal lower rear stretcher bar for extreme rigidity
  box(g, 0.04, 0.04, tW - 0.16, steelMat, tX + tD / 2 - 0.06, 0.18, tZ);

  // 2. CENTRE 12-BIN COMPONENT RACK (Mounted against wall at rear of desk)
  const rZ = tZ;
  const rX = HW_X - 0.25;
  const rW = 2.60;  // Width along Z
  const rD = 0.38;  // Depth along X
  const rH = 1.30;  // Height above table
  const topY = tH + rH;

  // 4 Black steel upright vertical posts
  [-rW / 2, rW / 2].forEach((pz) => {
    [-rD / 2, rD / 2].forEach((px) => {
      box(g, 0.035, rH, 0.035, steelMat, rX + px, tH + rH / 2, rZ + pz);
    });
  });

  // 4 Horizontal wooden shelf boards
  const tierH = rH / 3; // ~0.43m
  for (let t = 0; t <= 3; t++) {
    const sY = tH + t * tierH;
    box(g, rD, 0.025, rW, woodMat, rX, sY, rZ);
  }

  // 12 Individual Transparent Parts Bins with Labels & Icons (3 Rows x 4 Cols)
  const binCols = 4;
  const binRows = 3;
  const colStep = (rW - 0.08) / binCols; // ~0.63m
  const bW = colStep - 0.04;            // ~0.59m wide
  const bH = 0.32;
  const bD = rD - 0.04;

  const binSpecs = [
    // Row 0 (Top tier):
    { label: 'Microcontrollers', icon: 'IC' },
    { label: 'Sensors', icon: 'WAVE' },
    { label: 'Actuators', icon: 'GEAR' },
    { label: 'Motor Drivers', icon: 'MOTOR' },
    // Row 1 (Middle tier):
    { label: 'Modules', icon: 'CHIP' },
    { label: 'Displays', icon: 'SCREEN' },
    { label: 'Communication', icon: 'WIFI' },
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

      const bz = rZ - rW / 2 + 0.04 + col * colStep + colStep / 2;
      const worldRow = 2 - row; // row 0 at top tier
      const by = tH + worldRow * tierH + 0.02 + bH / 2;

      createLabelledComponentBin(g, rX, by, bz, bW, bH, bD, spec, HW_R);
    }
  }

  // 3. Warm Orange LED Strip along the underside of the rack
  const ledY = tH + 0.02;
  const ledMat = M(0xffa040, {
    emissive: 0xffa040,
    emissiveIntensity: 2.5,
    roughness: 0.2,
  });
  box(g, 0.02, 0.015, rW - 0.1, ledMat, rX - rD / 2 + 0.03, ledY, rZ);

  // Soft warm downlight
  const rackLight = new THREE.PointLight(0xff9933, 1.4, 3.2, 1.8);
  rackLight.position.set(rX - rD / 2 - 0.15, ledY - 0.05, rZ);
  g.add(rackLight);

  // 4. Props sitting proudly on the TOP shelf (y = topY + 0.02):
  const shelfTopY = topY + 0.015;

  // (a) Small RC Robot Car (z ≈ 9.85)
  createCar(g, rX, shelfTopY + 0.03, tZ - 1.0, 0xffc400);

  // (b) Articulated Robotic Arm in Orange & Black (z ≈ 10.45)
  createRoboticArm(g, rX, shelfTopY, tZ - 0.40, 0.65);

  // (c) Quadcopter Test Drone (z ≈ 11.25)
  const drone = createDrone(g, rX, shelfTopY + 0.05, tZ + 0.40);
  if (anim && drone) anim.spin.push(drone);

  // (d) Mini Robot Car (z ≈ 11.85)
  createCar(g, rX, shelfTopY + 0.03, tZ + 1.0, 0x2563eb);

  parent.add(g);
  return g;
}

/** Individual Labelled Transparent Component Bin (Crisp, High-Contrast Text & Visible Latch Clips) */
function createLabelledComponentBin(parent, x, y, z, w, h, d, spec, HW_R) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // 1. Semi-transparent frosted acrylic box body (proper roughness to avoid blown out highlights)
  const binMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.38,
    roughness: 0.28,
    transmission: 0.78,
    ior: 1.48,
    depthWrite: false,
  });
  box(g, d, h, w, binMat, 0, 0, 0);

  // Top rim
  box(g, d + 0.01, 0.015, w + 0.01, M(0xffffff, { roughness: 0.4 }), 0, h / 2, 0);

  // 2 High-visibility orange latch clips on the front face (room side, x = -d/2)
  const clipMat = M(0xff7a00, { roughness: 0.35 });
  [-w * 0.28, w * 0.28].forEach((cz) => {
    box(g, 0.02, 0.045, 0.065, clipMat, -d / 2 - 0.006, h / 2 - 0.018, cz);
  });

  // Large White Front Label Card with BOLD, High-Contrast Text & Vector Technical Icon
  // Text is rendered large (50px bold navy) so it is crisp and readable from walking distance
  const labelTex = canvasTex(512, 256, (ctx, cw, ch) => {
    // Pure white background card with clean edge
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, cw - 6, ch - 6);

    // Mini Technical Icon
    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const ix = cw / 2;
    const iy = 68;

    switch (spec.icon) {
      case 'IC':
        ctx.strokeRect(ix - 26, iy - 26, 52, 52);
        ctx.fillRect(ix - 13, iy - 13, 26, 26);
        [-15, 0, 15].forEach((o) => {
          ctx.beginPath(); ctx.moveTo(ix + o, iy - 26); ctx.lineTo(ix + o, iy - 38); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ix + o, iy + 26); ctx.lineTo(ix + o, iy + 38); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ix - 26, iy + o); ctx.lineTo(ix - 38, iy + o); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ix + 26, iy + o); ctx.lineTo(ix + 38, iy + o); ctx.stroke();
        });
        break;
      case 'WAVE':
        ctx.beginPath(); ctx.arc(ix, iy + 14, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ix, iy + 14, 22, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix, iy + 14, 36, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke();
        break;
      case 'GEAR':
        ctx.beginPath(); ctx.arc(ix, iy, 22, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix, iy, 10, 0, Math.PI * 2); ctx.fill();
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          ctx.fillRect(ix + Math.cos(ang) * 21 - 5, iy + Math.sin(ang) * 21 - 5, 10, 10);
        }
        break;
      case 'MOTOR':
        ctx.strokeRect(ix - 28, iy - 20, 56, 40);
        ctx.font = '900 24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('M', ix, iy);
        ctx.fillRect(ix + 28, iy - 6, 12, 12);
        break;
      case 'SCREEN':
        ctx.strokeRect(ix - 30, iy - 22, 60, 44);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(ix - 24, iy - 16, 48, 32);
        break;
      case 'WIFI':
        ctx.beginPath(); ctx.arc(ix, iy + 16, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ix, iy + 16, 22, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix, iy + 16, 36, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
        break;
      case 'BATT':
        ctx.strokeRect(ix - 26, iy - 18, 52, 36);
        ctx.fillRect(ix + 26, iy - 7, 7, 14);
        ctx.fillStyle = '#ff7a00';
        ctx.fillRect(ix - 20, iy - 12, 28, 24);
        break;
      default:
        ctx.strokeRect(ix - 22, iy - 22, 44, 44);
        ctx.beginPath(); ctx.moveTo(ix - 22, iy); ctx.lineTo(ix + 22, iy); ctx.stroke();
        break;
    }

    // Bold Large Navy Label Text
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 48px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spec.label, cw / 2, 185);
  });

  const labelCard = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.82, h * 0.48),
    new THREE.MeshBasicMaterial({ map: labelTex })
  );
  labelCard.position.set(-d / 2 - 0.008, -0.01, 0);
  labelCard.rotation.y = HW_R;
  g.add(labelCard);

  // Components visible inside (internal electronic models)
  box(g, d * 0.5, h * 0.25, w * 0.55, M(0x1e293b, { roughness: 0.8 }), 0, -h * 0.22, 0);

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TABLETOP WORKSTATIONS: SOLDERING (Left) & ASSEMBLY (Right)
// ─────────────────────────────────────────────────────────────────────────────
function createTabletopWorkstations(parent, HW_X, HW_R) {
  const g = new THREE.Group();

  const deskY = 0.84;
  const deskX = HW_X - 0.70; // Positioned forward on the desk

  // ═════════════════════════════════════════════════════════════════════════════
  // WORKSTATION 1: SOLDERING & REWORK AREA (Left, z ≈ 10.0)
  // ═════════════════════════════════════════════════════════════════════════════

  // 1. Green Self-Healing Cutting Mat (z ≈ 10.0, 0.80m x 0.50m)
  const matW = 0.80, matD = 0.50;
  const matTex = canvasTex(512, 340, (ctx, cw, ch) => {
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, cw, ch);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = 10; x < cw; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, ch - 10); ctx.stroke();
    }
    for (let y = 10; y < ch; y += step) {
      ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(cw - 10, y); ctx.stroke();
    }

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(10, 10, cw - 20, ch - 20);

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
  cuttingMat.position.set(deskX, deskY + 0.005, 10.0);
  g.add(cuttingMat);

  // 2. Blue Digital Soldering Station (z ≈ 9.42)
  const sStation = new THREE.Group();
  sStation.position.set(deskX, deskY + 0.01, 9.42);

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
  cyl(sStation, 0.025, 0.022, 0.10, M(0xd1d5db, { metalness: 0.85 }), standX, 0.06, standZ, 12).rotation.x = -0.55;
  cyl(sStation, 0.022, 0.022, 0.02, M(0xd4af37, { roughness: 0.8 }), standX, 0.025, standZ - 0.04, 10);
  cyl(sStation, 0.012, 0.012, 0.14, M(0x18181b), standX, 0.09, standZ + 0.02, 8).rotation.x = -0.55;
  g.add(sStation);

  // 3. Helping-Hands Magnifier with PCB (z ≈ 10.0)
  const hhGroup = new THREE.Group();
  hhGroup.position.set(deskX + 0.15, deskY + 0.01, 10.0);
  box(hhGroup, 0.09, 0.025, 0.08, M(0x18181b, { metalness: 0.8, roughness: 0.6 }), 0, 0.012, 0);
  cyl(hhGroup, 0.006, 0.006, 0.14, M(0xd1d5db, { metalness: 0.9 }), 0, 0.08, 0, 8);
  cyl(hhGroup, 0.005, 0.005, 0.18, M(0xd1d5db, { metalness: 0.9 }), 0, 0.12, 0, 8).rotation.x = Math.PI / 2;

  // Dual alligator clips holding green PCB
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

  // 4. Rosin-Core Solder Wire Spool on Stand (z ≈ 10.35)
  const spoolGroup = new THREE.Group();
  spoolGroup.position.set(deskX + 0.12, deskY + 0.01, 10.35);
  box(spoolGroup, 0.06, 0.08, 0.01, M(C.black), 0, 0.04, -0.04);
  box(spoolGroup, 0.06, 0.08, 0.01, M(C.black), 0, 0.04, 0.04);
  cyl(spoolGroup, 0.035, 0.035, 0.06, M(0x2563eb), 0, 0.045, 0, 14).rotation.x = Math.PI / 2;
  cyl(spoolGroup, 0.032, 0.032, 0.045, M(0xd1d5db, { metalness: 0.9 }), 0, 0.045, 0, 14).rotation.x = Math.PI / 2;
  g.add(spoolGroup);

  // 5. Anti-Static ESD Component Parts Tray (Rear, z ≈ 9.65)
  const trayGroup = new THREE.Group();
  trayGroup.position.set(deskX + 0.22, deskY + 0.01, 9.65);
  box(trayGroup, 0.18, 0.025, 0.24, M(0x0f172a, { roughness: 0.7 }), 0, 0.012, 0);
  box(trayGroup, 0.16, 0.02, 0.005, M(0x334155), 0, 0.015, 0);
  box(trayGroup, 0.005, 0.02, 0.22, M(0x334155), 0, 0.015, 0);
  box(trayGroup, 0.03, 0.008, 0.05, M(0x22c55e), -0.04, 0.015, -0.05);
  box(trayGroup, 0.025, 0.01, 0.04, M(0xff7a00), 0.04, 0.015, 0.05);
  g.add(trayGroup);

  // ═════════════════════════════════════════════════════════════════════════════
  // WORKSTATION 2: ASSEMBLY & TESTING AREA (Right, z ≈ 11.7)
  // ═════════════════════════════════════════════════════════════════════════════

  // 6. Digital Multimeter in Rugged Yellow Holster (z ≈ 11.45)
  const dmm = new THREE.Group();
  dmm.position.set(deskX + 0.08, deskY + 0.015, 11.45);
  dmm.rotation.y = -0.25;
  box(dmm, 0.16, 0.032, 0.09, M(0xf59e0b, { roughness: 0.4 }), 0, 0.016, 0);
  box(dmm, 0.145, 0.01, 0.076, M(0x18181b), 0, 0.032, 0);
  box(dmm, 0.04, 0.005, 0.06, Bm(0x94a3b8), -0.04, 0.038, 0);
  cyl(dmm, 0.015, 0.015, 0.01, M(0xff7a00), 0.02, 0.038, 0, 10);
  // Red & Black probe cables trailing
  cyl(dmm, 0.004, 0.004, 0.16, M(0xdc2626), 0.12, 0.01, -0.02, 6).rotation.z = Math.PI / 2;
  cyl(dmm, 0.004, 0.004, 0.16, M(0x18181b), 0.12, 0.01, 0.02, 6).rotation.z = Math.PI / 2;
  g.add(dmm);

  // 7. Solderless Breadboard with Microcontroller & Jumpers (z ≈ 11.75)
  const bbGroup = new THREE.Group();
  bbGroup.position.set(deskX, deskY + 0.01, 11.75);
  // White breadboard body
  box(bbGroup, 0.16, 0.015, 0.22, M(0xf8fafc, { roughness: 0.3 }), 0, 0.008, 0);
  // Microcontroller module (blue PCB with metal USB port)
  box(bbGroup, 0.05, 0.01, 0.10, M(0x1e3a8a), 0, 0.018, 0);
  box(bbGroup, 0.015, 0.01, 0.02, M(0xd1d5db, { metalness: 0.9 }), -0.025, 0.018, 0);
  // Colorful jumper wires arched on breadboard
  const wireMat1 = M(0xef4444);
  const wireMat2 = M(0x22c55e);
  const wireMat3 = M(0xf59e0b);
  cyl(bbGroup, 0.003, 0.003, 0.06, wireMat1, -0.04, 0.02, -0.03, 6).rotation.x = 0.5;
  cyl(bbGroup, 0.003, 0.003, 0.06, wireMat2, 0.04, 0.02, 0.03, 6).rotation.x = -0.5;
  cyl(bbGroup, 0.003, 0.003, 0.06, wireMat3, 0.02, 0.02, -0.04, 6).rotation.z = 0.4;
  g.add(bbGroup);

  // 8. Electronic Component Organizer Tray (z ≈ 12.08)
  const compTray = new THREE.Group();
  compTray.position.set(deskX + 0.14, deskY + 0.01, 12.08);
  box(compTray, 0.16, 0.025, 0.22, M(0x0f172a, { roughness: 0.7 }), 0, 0.012, 0);
  box(compTray, 0.14, 0.02, 0.005, M(0x334155), 0, 0.015, 0);
  box(compTray, 0.005, 0.02, 0.20, M(0x334155), 0, 0.015, 0);
  // Small ICs and LEDs inside
  box(compTray, 0.02, 0.008, 0.03, M(0x3b82f6), -0.04, 0.015, -0.04);
  box(compTray, 0.02, 0.008, 0.03, M(0xef4444), 0.04, 0.015, 0.04);
  g.add(compTray);

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TWO ERGONOMIC CHAIRS (Mesh back, vibrant orange seat cushion)
// ─────────────────────────────────────────────────────────────────────────────
function createChairs(parent, HW_X) {
  // Chair 1: In front of Workstation 1 (Soldering Area) at z = 10.0
  createChair(parent, HW_X - 1.25, 10.0, Math.PI / 2, { orangeSeat: true });

  // Chair 2: In front of Workstation 2 (Assembly Area) at z = 11.7
  createChair(parent, HW_X - 1.25, 11.7, Math.PI / 2, { orangeSeat: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. UNDER-TABLE STORAGE BINS (Strictly inside footprint with contact shadows)
// ─────────────────────────────────────────────────────────────────────────────
function createUnderTableBins(parent, HW_X) {
  const g = new THREE.Group();
  const shadowMat = M(0x000000, { transparent: true, opacity: 0.28, roughness: 1 });

  // 3 Bins safely under the main table (x = 19.30, within x = 18.63 to 19.78)
  const binZ = [9.85, 10.85, 11.85];
  const bW = 0.50, bH = 0.28, bD = 0.38;
  const bX = HW_X - 0.48;

  binZ.forEach((bz) => {
    // Soft contact shadow pad directly under each box
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.44), shadowMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(bX, 0.005, bz);
    g.add(pad);

    // Box body resting directly on the floor
    createClearStorageBox(g, bX, 0.01 + bH / 2, bz, bW, bH, bD);
  });

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. GROUP 3: FLOOR-STANDING INSTRUMENT RACK (z = 13.00 to 14.30, width = 1.30m)
// ─────────────────────────────────────────────────────────────────────────────
function createFloorInstrumentRack(parent, HW_X, HW_R) {
  const g = new THREE.Group();

  const rZ = 13.65;
  const rX = HW_X - 0.36;
  const rW = 1.30; // Width along Z
  const rD = 0.58; // Depth along X
  const rH = 2.20; // Full floor-standing height

  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  const woodMat = M(C.wood, { roughness: 0.55 });
  const shadowMat = M(0x000000, { transparent: true, opacity: 0.25, roughness: 1 });

  // 1. Four Floor-Standing Black Steel Corner Posts (From floor y = 0 to y = 2.20m)
  [-rW / 2, rW / 2].forEach((pz) => {
    [-rD / 2, rD / 2].forEach((px) => {
      // Upright post
      box(g, 0.04, rH, 0.04, steelMat, rX + px, rH / 2, rZ + pz);
      // Floor leveling foot pad
      box(g, 0.065, 0.02, 0.065, steelMat, rX + px, 0.01, rZ + pz);
      // Contact shadow pad
      const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.20, 0.20), shadowMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(rX + px, 0.005, rZ + pz);
      g.add(pad);
    });
  });

  // 2. Four Wooden Shelves:
  const shelfY1 = 0.15; // Bottom shelf
  const shelfY2 = 0.85; // Instrument bench level
  const shelfY3 = 1.38; // Middle shelf
  const shelfY4 = 1.95; // Top shelf

  [shelfY1, shelfY2, shelfY3, shelfY4].forEach((sy) => {
    // Shelf board
    box(g, rD, 0.025, rW, woodMat, rX, sy, rZ);
    // Steel crossbeams under shelf
    box(g, rD - 0.06, 0.03, 0.03, steelMat, rX, sy - 0.02, rZ - rW / 2 + 0.03);
    box(g, rD - 0.06, 0.03, 0.03, steelMat, rX, sy - 0.02, rZ + rW / 2 - 0.03);
  });

  // 3. BOTTOM SHELF (y = 0.15): 2 Large Storage Boxes
  const botBoxW = 0.45, botBoxH = 0.26, botBoxD = 0.40;
  [-0.30, 0.30].forEach((dz) => {
    createClearStorageBox(g, rX, shelfY1 + botBoxH / 2 + 0.015, rZ + dz, botBoxW, botBoxH, botBoxD);
  });

  // 4. DESK-LEVEL SHELF (y = 0.85): Precision Test Instruments
  // (a) Bench DC Power Supply (z ≈ rZ - 0.28)
  const psGroup = new THREE.Group();
  psGroup.position.set(rX, shelfY2 + 0.16, rZ - 0.28);

  const psMat = M(0xf1f5f9, { roughness: 0.4 });
  box(psGroup, 0.34, 0.28, 0.24, psMat, 0, 0, 0);

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
  psDisplay.position.set(-0.171, 0.04, 0);
  psDisplay.rotation.y = -Math.PI / 2;
  psGroup.add(psDisplay);

  // Binding post terminals (Red +, Black -, Green GND)
  cyl(psGroup, 0.01, 0.01, 0.02, M(0xdc2626), -0.175, -0.08, -0.05, 8).rotation.z = Math.PI / 2;
  cyl(psGroup, 0.01, 0.01, 0.02, M(0x18181b), -0.175, -0.08, 0.0, 8).rotation.z = Math.PI / 2;
  cyl(psGroup, 0.01, 0.01, 0.02, M(0x16a34a), -0.175, -0.08, 0.05, 8).rotation.z = Math.PI / 2;

  // Adjustment knobs
  cyl(psGroup, 0.014, 0.014, 0.015, M(0x334155), -0.175, -0.03, -0.05, 10).rotation.z = Math.PI / 2;
  cyl(psGroup, 0.014, 0.014, 0.015, M(0x334155), -0.175, -0.03, 0.05, 10).rotation.z = Math.PI / 2;

  g.add(psGroup);

  // (b) Digital Storage Oscilloscope (z ≈ rZ + 0.28)
  const oScopeGroup = new THREE.Group();
  oScopeGroup.position.set(rX, shelfY2 + 0.16, rZ + 0.28);

  const scopeMat = M(0xf8fafc, { roughness: 0.35 });
  box(oScopeGroup, 0.32, 0.26, 0.38, scopeMat, 0, 0, 0);

  // Glowing Screen with Graticule Grid & Bright Green Sine Wave Trace
  const scopeScreenTex = canvasTex(256, 192, (ctx, cw, ch) => {
    ctx.fillStyle = '#05131e';
    ctx.fillRect(0, 0, cw, ch);

    // Fine oscilloscope graticule grid
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

    // Measurement telemetry text
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 13px monospace';
    ctx.shadowBlur = 0;
    ctx.fillText('CH1: 2.00V', 10, 18);
    ctx.fillText('1.00 kHz', 10, 34);
  });

  const scopeScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.14),
    new THREE.MeshBasicMaterial({ map: scopeScreenTex })
  );
  scopeScreen.position.set(-0.161, 0.02, -0.06);
  scopeScreen.rotation.y = -Math.PI / 2;
  oScopeGroup.add(scopeScreen);

  // Control knobs & BNC inputs
  [0.05, 0.11].forEach((kz) => {
    cyl(oScopeGroup, 0.015, 0.015, 0.018, M(0x475569), -0.162, 0.05, kz, 10).rotation.z = Math.PI / 2;
    cyl(oScopeGroup, 0.012, 0.012, 0.018, M(0x475569), -0.162, -0.02, kz, 10).rotation.z = Math.PI / 2;
    cyl(oScopeGroup, 0.008, 0.008, 0.02, M(0xd1d5db, { metalness: 0.9 }), -0.162, -0.07, kz, 8).rotation.z = Math.PI / 2;
  });

  g.add(oScopeGroup);

  // 5. MIDDLE SHELF (y = 1.38): Blue Multi-Drawer Component Organizer
  const cabW = 1.05, cabH = 0.42, cabD = 0.34;
  const cabGroup = new THREE.Group();
  cabGroup.position.set(rX, shelfY3 + cabH / 2 + 0.015, rZ);

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
      box(cabGroup, 0.012, 0.015, 0.04, M(0xff7a00), -cabD / 2 - 0.005, dy, dz);
    }
  }
  g.add(cabGroup);

  // 6. TOP SHELF (y = 1.95): 3 Stacked Transparent Storage Boxes with Orange Clips
  const boxW = 0.32, boxH = 0.15, boxD = 0.30;
  [-0.35, 0.0, 0.35].forEach((dz) => {
    createClearStorageBox(g, rX, shelfY4 + boxH / 2 + 0.015, rZ + dz, boxW, boxH, boxD);
  });

  parent.add(g);
  return g;
}

/** Clear Plastic Storage Box with Orange Latch Clip */
function createClearStorageBox(parent, x, y, z, w, h, d) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Frosted acrylic body with balanced opacity
  const clearMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.38,
    roughness: 0.28,
    metalness: 0.08,
    transmission: 0.78,
    ior: 1.48,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  box(g, d, h, w, clearMat, 0, 0, 0);

  // Box lid rim
  box(g, d + 0.01, 0.015, w + 0.01, M(0xffffff, { roughness: 0.4 }), 0, h / 2 + 0.005, 0);

  // Orange front latch clips
  const clipMat = M(0xff7a00, { roughness: 0.4 });
  box(g, 0.018, 0.038, 0.055, clipMat, -d / 2 - 0.005, h / 2 - 0.01, 0);

  // Visible components inside (small grey/green blocks)
  box(g, d * 0.5, h * 0.3, w * 0.5, M(0x334155, { roughness: 0.7 }), 0, -h * 0.2, 0);

  parent.add(g);
  return g;
}
