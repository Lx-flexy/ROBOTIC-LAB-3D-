/**
 * zones/backwall.js — 3D Printing, Design, and Coding zones along back wall (z=-15)
 */
import * as THREE from 'three';
import { box, cyl, put } from '../../utils/geometry.js';
import { M, Bm, C, codeScreenTex, cadScreenTex, canvasTex } from '../../utils/materials.js';
import { createTable, createChair, createMonitor, createSign, createRack, createPlant, createWindow } from '../props/furniture.js';
import { createPrinter, createDrone, createCar, createRobot, createBook, createMug } from '../props/equipment.js';
import { BRAND_SHORT } from '../../config.js';
import { create3DPrintingMural, createCodingZoneMural, createDesigningZoneMural, createMainWallMural } from '../props/wallmurals.js';

/* ═══════════════════════════════════════════════════════════════════
   3D PRINTING ZONE PROPS (Reference-matched)
   • Hero 3D Printer (generic Bambu-style with AMS spool unit & vase)
   • Filament Spool Shelf (6 thick 3D hollow spools on metal rod)
   • Pegboard (dark perforated board with 2 pliers, 4 screwdrivers,
     ruler, caliper, orange tool cup with pens)
   • Table Props (cutting mat, astronaut, rocket, gear, temple, orange parts)
   • Right Open Shelving Unit (wood+black metal, bust, orange vase,
     chess rook, truss bridge, yellow truck, clear storage boxes)
   • Single task chair (black with vibrant orange seat cushion)
   • Full-sized corner floor plant
═══════════════════════════════════════════════════════════════════ */

/** Hero 3D Printer (generic modern desktop FDM printer) */
function createHero3DPrinter(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xf0f0f3, { roughness: 0.35, metalness: 0.1 });
  const blackMat = M(0x1a1a1d, { roughness: 0.5, metalness: 0.5 });
  const silverMat = M(0xd0d0d5, { roughness: 0.2, metalness: 0.8 });
  const darkGlassMat = M(0x222228, { roughness: 0.1, transparent: true, opacity: 0.45 });

  // 1. Base enclosure
  box(g, 0.96, 0.14, 0.76, whiteMat, 0, 0.07, 0);
  box(g, 0.90, 0.02, 0.70, blackMat, 0, 0.145, 0); // top rim
  // Rubber feet
  [[-0.42, -0.32], [0.42, -0.32], [-0.42, 0.32], [0.42, 0.32]].forEach(([fx, fz]) => {
    cyl(g, 0.035, 0.035, 0.02, blackMat, fx, 0.01, fz, 10);
  });

  // 2. Heated build platform & spring steel sheet
  box(g, 0.54, 0.025, 0.54, blackMat, 0, 0.165, -0.02);
  box(g, 0.50, 0.010, 0.50, M(0x2c2c30, { roughness: 0.7 }), 0, 0.18, -0.02); // textured flex sheet

  // 3. Orange spiral printed vase on build plate (animated spinning object)
  const vasePoints = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const r = 0.055 + 0.065 * Math.sin(t * Math.PI) + 0.025 * Math.sin(t * Math.PI * 3.5);
    vasePoints.push(new THREE.Vector2(r, t * 0.34));
  }
  const vaseGeom = new THREE.LatheGeometry(vasePoints, 20);
  const vaseMat = M(0xff7a00, { roughness: 0.25, metalness: 0.15 });
  const printObj = new THREE.Mesh(vaseGeom, vaseMat);
  printObj.position.set(0, 0.185, -0.02);
  g.add(printObj);

  // 4. Twin Gantry Uprights & Top Crossbar
  [-0.42, 0.42].forEach(gx => {
    box(g, 0.07, 0.96, 0.08, blackMat, gx, 0.62, -0.22);
    // Silver lead screw inside each gantry post
    cyl(g, 0.010, 0.010, 0.90, silverMat, gx + (gx > 0 ? -0.045 : 0.045), 0.62, -0.22, 10);
  });
  // Top crossbeam
  box(g, 0.94, 0.07, 0.08, blackMat, 0, 1.10, -0.22);

  // 5. Horizontal X-axis linear rail & guide rods
  cyl(g, 0.008, 0.008, 0.84, silverMat, 0, 0.58, -0.18, 10).rotation.z = Math.PI / 2;
  cyl(g, 0.008, 0.008, 0.84, silverMat, 0, 0.64, -0.18, 10).rotation.z = Math.PI / 2;

  // 6. Extruder Toolhead Carriage
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.61, -0.18);
  box(headGroup, 0.15, 0.17, 0.15, whiteMat, 0, 0, 0); // white housing
  box(headGroup, 0.09, 0.09, 0.02, blackMat, 0, 0, 0.08); // fan grill
  // Black heatsink fins
  box(headGroup, 0.06, 0.08, 0.06, blackMat, 0, -0.08, 0);
  // Brass nozzle tip pointing directly at the orange printed vase
  cyl(headGroup, 0.018, 0.004, 0.03, M(0xd4af37, { metalness: 0.9, roughness: 0.2 }), 0, -0.13, 0, 12);
  g.add(headGroup);

  // 7. AMS Multi-Color Spool Unit on top of gantry
  const amsY = 1.14;
  box(g, 0.76, 0.09, 0.32, blackMat, 0, amsY + 0.045, -0.22);
  // Smoked transparent curved hood
  const hoodGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.74, 16, 1, false, 0, Math.PI);
  const hood = new THREE.Mesh(hoodGeom, darkGlassMat);
  hood.position.set(0, amsY + 0.09, -0.22);
  hood.rotation.z = Math.PI / 2;
  hood.rotation.x = -Math.PI / 2;
  g.add(hood);

  // 4 mini spools inside AMS: Orange, White, Blue, Black
  const amsColors = [0xff7a00, 0xffffff, 0x2563eb, 0x1f1f23];
  amsColors.forEach((col, idx) => {
    const sx = -0.26 + idx * 0.175;
    // Spool body
    const sp = cyl(g, 0.085, 0.085, 0.045, M(col, { roughness: 0.4 }), sx, amsY + 0.13, -0.22, 16);
    sp.rotation.z = Math.PI / 2;
    // Flanges
    [-0.025, 0.025].forEach(flangeOffset => {
      const fl = cyl(g, 0.095, 0.095, 0.005, blackMat, sx + flangeOffset, amsY + 0.13, -0.22, 16);
      fl.rotation.z = Math.PI / 2;
    });
    // PTFE guide tube curving down towards printhead
    const tubeCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(sx, amsY + 0.05, -0.16),
      new THREE.Vector3(sx * 0.5, 0.85, -0.12),
      new THREE.Vector3(0, 0.69, -0.18)
    );
    const tubeGeom = new THREE.TubeGeometry(tubeCurve, 12, 0.004, 6, false);
    g.add(new THREE.Mesh(tubeGeom, M(0xffffff, { transparent: true, opacity: 0.75 })));
  });

  // 8. Angled Touchscreen Display (front-right of base)
  const screenGroup = new THREE.Group();
  screenGroup.position.set(0.36, 0.09, 0.36);
  screenGroup.rotation.x = -0.65; // ~37° angle up
  box(screenGroup, 0.20, 0.14, 0.025, blackMat, 0, 0, 0);

  const screenTex = canvasTex(256, 180, (ctx, sw, sh) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, sw, sh);
    // Header
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('PRINTING: 78%', 16, 32);
    // Circular progress ring
    ctx.strokeStyle = '#ff7a00';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(sw / 2, sh / 2 + 10, 38, 0, Math.PI * 1.55);
    ctx.stroke();
    // Nozzle & Bed temps
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('N: 220°C', 16, sh - 18);
    ctx.fillText('B: 60°C', sw - 90, sh - 18);
  });
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.12), Bm(0xffffff));
  screenMesh.material.map = screenTex;
  screenMesh.position.set(0, 0, 0.014);
  screenGroup.add(screenMesh);
  g.add(screenGroup);

  // 9. Black cable chain / umbilical wire on left side
  const wireCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-0.43, 0.15, -0.18),
    new THREE.Vector3(-0.48, 0.45, -0.18),
    new THREE.Vector3(-0.48, 0.75, -0.18),
    new THREE.Vector3(-0.10, 0.65, -0.18)
  );
  const wireGeom = new THREE.TubeGeometry(wireCurve, 16, 0.012, 8, false);
  g.add(new THREE.Mesh(wireGeom, blackMat));

  parent.add(g);
  return printObj;
}

/** Filament Spool Shelf — wooden shelf with 6 thick 3D hollow spools on a metal rod */
function createFilamentSpoolShelf(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const woodMat = M(C.wood, { roughness: 0.45 });
  const bracketMat = M(0x1a1a1d, { roughness: 0.4, metalness: 0.7 });
  const rodMat = M(0xd5d5da, { roughness: 0.25, metalness: 0.8 });

  // 1. Natural wooden shelf board (1.8m x 0.04m x 0.30m)
  box(g, 1.80, 0.04, 0.30, woodMat, 0, 0, 0);

  // 2. Black steel L-brackets at ends
  [-0.85, 0.85].forEach(bx => {
    // Horizontal arm under shelf
    box(g, 0.03, 0.025, 0.28, bracketMat, bx, -0.03, 0);
    // Vertical wall bracket extending up to hold rod and down to anchor to wall
    box(g, 0.03, 0.36, 0.025, bracketMat, bx, 0.14, -0.13);
  });

  // 3. Horizontal steel rod running through all spools
  const rod = cyl(g, 0.014, 0.014, 1.76, rodMat, 0, 0.22, 0, 16);
  rod.rotation.z = Math.PI / 2;

  // 4. Six thick 3D hollow filament spools
  // Colours: Orange, White, Blue, Black, Yellow, Red
  const spoolColors = [
    0xff7a00, // Orange
    0xffffff, // White
    0x2563eb, // Blue
    0x202024, // Black
    0xfacc15, // Yellow
    0xdc2626  // Red
  ];

  spoolColors.forEach((col, i) => {
    const sx = -0.65 + i * 0.26;
    const spoolGroup = new THREE.Group();
    spoolGroup.position.set(sx, 0.22, 0);

    const filMat = M(col, { roughness: 0.45 });
    const spoolRimMat = M(0x2a2a2e, { roughness: 0.4, metalness: 0.3 });

    // Hollow filament winding cylinder (outer radius 0.17, inner hole radius 0.05, width 0.14)
    // Three.js CylinderGeometry with hollow look via ring flanges and inner tube
    const filDrum = cyl(spoolGroup, 0.17, 0.17, 0.14, filMat, 0, 0, 0, 20);
    filDrum.rotation.z = Math.PI / 2;

    // Two outer flange rings with large central viewing hole
    [-0.075, 0.075].forEach(fx => {
      // Outer rim ring
      const flangeGeom = new THREE.RingGeometry(0.048, 0.19, 20);
      const flange1 = new THREE.Mesh(flangeGeom, spoolRimMat);
      flange1.position.set(fx, 0, 0);
      flange1.rotation.y = Math.PI / 2;
      spoolGroup.add(flange1);

      // Flange thickness box
      const edge = cyl(spoolGroup, 0.19, 0.19, 0.008, spoolRimMat, fx, 0, 0, 20);
      edge.rotation.z = Math.PI / 2;
    });

    // Inner hollow core sleeve through which rod passes
    const core = cyl(spoolGroup, 0.048, 0.048, 0.16, spoolRimMat, 0, 0, 0, 16);
    core.rotation.z = Math.PI / 2;

    g.add(spoolGroup);
  });

  parent.add(g);
  return g;
}

/** Pegboard with hanging tools (2 pliers, 4 screwdrivers, ruler, caliper, orange tool cup) */
function createPegboardWithTools(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const darkBoardMat = M(0x222226, { roughness: 0.65 });
  const orangeHandleMat = M(0xff7a00, { roughness: 0.4 });
  const blackGripMat = M(0x18181b, { roughness: 0.6 });
  const steelMat = M(0xd2d2d8, { metalness: 0.85, roughness: 0.2 });

  // 1. Pegboard base with hole pattern texture
  const pegTex = canvasTex(512, 320, (ctx, pw, ph) => {
    ctx.fillStyle = '#222226';
    ctx.fillRect(0, 0, pw, ph);
    // Grid of small round holes
    ctx.fillStyle = '#0f0f13';
    const step = 20;
    for (let py = 16; py < ph; py += step) {
      for (let px = 16; px < pw; px += step) {
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  const boardMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.80, 1.05, 0.025),
    new THREE.MeshStandardMaterial({ map: pegTex, roughness: 0.65 })
  );
  g.add(boardMesh);

  // 2. Hanging Tools on the Pegboard:
  // (A) Two Pliers on left side
  [-0.60, -0.42].forEach(px => {
    const plierGroup = new THREE.Group();
    plierGroup.position.set(px, 0.16, 0.025);
    // Silver steel jaws & pivot
    box(plierGroup, 0.04, 0.10, 0.016, steelMat, 0, 0.06, 0);
    cyl(plierGroup, 0.018, 0.018, 0.02, steelMat, 0, 0.03, 0, 10);
    // Two curved orange rubber handles
    [-0.035, 0.035].forEach((hx, i) => {
      const handle = box(plierGroup, 0.026, 0.15, 0.02, orangeHandleMat, hx, -0.06, 0);
      handle.rotation.z = (i === 0 ? 0.16 : -0.16);
      box(plierGroup, 0.028, 0.04, 0.022, blackGripMat, hx * 1.15, -0.11, 0);
    });
    g.add(plierGroup);
  });

  // (B) Four Screwdrivers side by side
  [-0.20, -0.10, 0.0, 0.10].forEach((sx, i) => {
    const sdGroup = new THREE.Group();
    sdGroup.position.set(sx, 0.10, 0.025);
    // Ribbed orange/black handle
    const hColor = i % 2 === 0 ? orangeHandleMat : blackGripMat;
    cyl(sdGroup, 0.024, 0.018, 0.13, hColor, 0, 0.08, 0, 10);
    box(sdGroup, 0.030, 0.025, 0.030, orangeHandleMat, 0, 0.12, 0);
    // Silver steel shaft & tip
    const shaftLen = 0.18 + (i % 3) * 0.06;
    cyl(sdGroup, 0.006, 0.006, shaftLen, steelMat, 0, -shaftLen / 2 + 0.02, 0, 8);
    g.add(sdGroup);
  });

  // (C) Vertical Steel Ruler
  const rulerGroup = new THREE.Group();
  rulerGroup.position.set(0.28, 0.05, 0.025);
  box(rulerGroup, 0.05, 0.44, 0.006, steelMat, 0, 0, 0);
  g.add(rulerGroup);

  // (D) Vernier Caliper
  const caliperGroup = new THREE.Group();
  caliperGroup.position.set(0.48, 0.05, 0.025);
  // Main beam
  box(caliperGroup, 0.032, 0.40, 0.008, steelMat, 0, 0, 0);
  // Top measuring jaw
  box(caliperGroup, 0.12, 0.03, 0.010, steelMat, -0.04, 0.18, 0);
  // Sliding jaw
  box(caliperGroup, 0.11, 0.04, 0.014, steelMat, -0.035, 0.04, 0.002);
  g.add(caliperGroup);

  // (E) Orange Pen & Tool Cup on bottom left
  const cupGroup = new THREE.Group();
  cupGroup.position.set(-0.62, -0.32, 0.06);
  // Orange cup container
  box(cupGroup, 0.20, 0.14, 0.10, orangeHandleMat, 0, 0, 0);
  // Pens & tools sticking out
  const penColors = [0xfacc15, 0x2563eb, 0x1f1f23, 0xff7a00];
  penColors.forEach((pcol, pi) => {
    const pen = cyl(cupGroup, 0.008, 0.008, 0.18, M(pcol), -0.06 + pi * 0.04, 0.08, 0, 8);
    pen.rotation.z = (pi - 1.5) * 0.12;
  });
  g.add(cupGroup);

  parent.add(g);
  return g;
}

/** Tabletop printed models and cutting mat */
function createTabletopProps(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xffffff, { roughness: 0.35 });
  const orangeMat = M(0xff7a00, { roughness: 0.3 });
  const greyMat = M(0x555560, { roughness: 0.4 });
  const goldVisorMat = M(0xd97706, { roughness: 0.1, metalness: 0.85 });

  // 1. Cutting Mat (dark teal-grey with white grid texture)
  const matTex = canvasTex(512, 384, (ctx, mw, mh) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, mw, mh);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    const step = 24;
    for (let px = 12; px < mw; px += step) {
      ctx.beginPath(); ctx.moveTo(px, 12); ctx.lineTo(px, mh - 12); ctx.stroke();
    }
    for (let py = 12; py < mh; py += step) {
      ctx.beginPath(); ctx.moveTo(12, py); ctx.lineTo(mw - 12, py); ctx.stroke();
    }
    // Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, mw - 16, mh - 16);
  });
  const cuttingMat = new THREE.Mesh(
    new THREE.BoxGeometry(0.96, 0.008, 0.60),
    new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.7 })
  );
  cuttingMat.position.set(-1.40, 0.004, 0.15);
  g.add(cuttingMat);

  // 2. White Miniature Astronaut Figurine
  const astroGroup = new THREE.Group();
  astroGroup.position.set(-1.95, 0.005, 0.15);
  // Legs
  box(astroGroup, 0.05, 0.10, 0.05, whiteMat, -0.035, 0.05, 0);
  box(astroGroup, 0.05, 0.10, 0.05, whiteMat, 0.035, 0.05, 0);
  // Torso & backpack
  box(astroGroup, 0.11, 0.12, 0.08, whiteMat, 0, 0.15, 0);
  box(astroGroup, 0.08, 0.10, 0.04, whiteMat, 0, 0.15, -0.055);
  // Arms
  box(astroGroup, 0.04, 0.10, 0.04, whiteMat, -0.07, 0.14, 0);
  box(astroGroup, 0.04, 0.10, 0.04, whiteMat, 0.07, 0.14, 0);
  // Helmet
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), whiteMat);
  helmet.position.set(0, 0.25, 0);
  astroGroup.add(helmet);
  // Golden reflective visor
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8, 0, Math.PI), goldVisorMat);
  visor.position.set(0, 0.25, 0.035);
  visor.rotation.y = -Math.PI / 2;
  astroGroup.add(visor);
  g.add(astroGroup);

  // 3. Bright Orange Toy Rocket
  const rocketGroup = new THREE.Group();
  rocketGroup.position.set(-1.60, 0.005, 0.22);
  // Fuselage cylinder
  cyl(rocketGroup, 0.042, 0.042, 0.18, orangeMat, 0, 0.09, 0, 14);
  // Nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.10, 14), whiteMat);
  nose.position.set(0, 0.23, 0);
  rocketGroup.add(nose);
  // 4 swept fins
  for (let f = 0; f < 4; f++) {
    const fin = box(rocketGroup, 0.015, 0.08, 0.05, orangeMat, 0, 0.04, 0.045);
    fin.rotation.y = (Math.PI / 2) * f;
  }
  g.add(rocketGroup);

  // 4. Grey Mechanical Gear
  const gearGroup = new THREE.Group();
  gearGroup.position.set(-1.25, 0.005, 0.12);
  cyl(gearGroup, 0.08, 0.08, 0.03, greyMat, 0, 0.015, 0, 16);
  // Center hole
  cyl(gearGroup, 0.03, 0.03, 0.032, M(0x18181b), 0, 0.016, 0, 12);
  // 8 Teeth around gear
  for (let t = 0; t < 8; t++) {
    const tooth = box(gearGroup, 0.03, 0.03, 0.035, greyMat, 0, 0.015, 0.085);
    tooth.rotation.y = (Math.PI / 4) * t;
  }
  g.add(gearGroup);

  // 5. White Classical Miniature Building / Temple
  const templeGroup = new THREE.Group();
  templeGroup.position.set(-0.85, 0.005, 0.08);
  // Stepped foundation
  box(templeGroup, 0.26, 0.02, 0.18, whiteMat, 0, 0.01, 0);
  box(templeGroup, 0.24, 0.02, 0.16, whiteMat, 0, 0.03, 0);
  // Row of mini columns
  [-0.09, -0.045, 0, 0.045, 0.09].forEach(cx => {
    cyl(templeGroup, 0.008, 0.008, 0.10, whiteMat, cx, 0.09, 0.06, 8);
    cyl(templeGroup, 0.008, 0.008, 0.10, whiteMat, cx, 0.09, -0.06, 8);
  });
  // Architrave & pediment roof
  box(templeGroup, 0.24, 0.02, 0.16, whiteMat, 0, 0.15, 0);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.06, 4), whiteMat);
  roof.position.set(0, 0.19, 0);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1.4, 1, 1);
  templeGroup.add(roof);
  g.add(templeGroup);

  // 6. Orange Articulated Gear / Fidget Pieces on cutting mat
  box(g, 0.08, 0.018, 0.08, orangeMat, -1.05, 0.015, 0.26);
  box(g, 0.06, 0.018, 0.06, M(0x2563eb), -0.98, 0.015, 0.28);

  parent.add(g);
  return g;
}

/** Right Open Shelving Unit with 3D printed models & clear storage boxes */
function createOpenShelfUnit(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const blackSteelMat = M(0x18181b, { metalness: 0.7, roughness: 0.35 });
  const shelfWoodMat = M(C.wood, { roughness: 0.45 });
  const whiteMat = M(0xffffff, { roughness: 0.35 });
  const orangeMat = M(0xff7a00, { roughness: 0.3 });
  const yellowMat = M(0xfacc15, { roughness: 0.35 });
  const clearBoxMat = M(0xffffff, { transparent: true, opacity: 0.40, roughness: 0.2 });

  const sW = 1.25, sD = 0.46, sH = 2.10;

  // 1. Black steel tubular frame (4 uprights)
  [[-sW / 2 + 0.02, -sD / 2 + 0.02], [sW / 2 - 0.02, -sD / 2 + 0.02],
   [-sW / 2 + 0.02, sD / 2 - 0.02], [sW / 2 - 0.02, sD / 2 - 0.02]].forEach(([px, pz]) => {
    box(g, 0.035, sH, 0.035, blackSteelMat, px, sH / 2, pz);
  });
  // Crossbeams at shelf levels
  const shelfYs = [0.15, 0.65, 1.18, 1.70, 2.08];
  shelfYs.forEach(sy => {
    box(g, sW, 0.03, 0.025, blackSteelMat, 0, sy - 0.015, -sD / 2 + 0.02);
    box(g, sW, 0.03, 0.025, blackSteelMat, 0, sy - 0.015, sD / 2 - 0.02);
    box(g, 0.025, 0.03, sD - 0.04, blackSteelMat, -sW / 2 + 0.02, sy - 0.015, 0);
    box(g, 0.025, 0.03, sD - 0.04, blackSteelMat, sW / 2 - 0.02, sy - 0.015, 0);
    // Wooden shelf board
    box(g, sW - 0.05, 0.032, sD - 0.05, shelfWoodMat, 0, sy + 0.016, 0);
  });

  // 2. Shelf Items:
  // (A) Top Shelf (y = 1.73):
  // • White classical bust sculpture
  const bustGroup = new THREE.Group();
  bustGroup.position.set(-0.35, 1.74, 0);
  box(bustGroup, 0.12, 0.04, 0.12, whiteMat, 0, 0.02, 0); // pedestal
  cyl(bustGroup, 0.07, 0.11, 0.14, whiteMat, 0, 0.11, 0, 12); // shoulders/torso
  const bustHead = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), whiteMat);
  bustHead.position.set(0, 0.22, 0);
  bustGroup.add(bustHead);
  g.add(bustGroup);

  // • Orange 3D printed lattice vase
  const vasePoints2 = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const r = 0.045 + 0.045 * Math.sin(t * Math.PI) + 0.015 * Math.sin(t * Math.PI * 3);
    vasePoints2.push(new THREE.Vector2(r, t * 0.26));
  }
  const vaseMesh2 = new THREE.Mesh(new THREE.LatheGeometry(vasePoints2, 16), orangeMat);
  vaseMesh2.position.set(0.0, 1.74, 0);
  g.add(vaseMesh2);

  // • White chess rook
  const rookGroup = new THREE.Group();
  rookGroup.position.set(0.35, 1.74, 0);
  cyl(rookGroup, 0.055, 0.065, 0.04, whiteMat, 0, 0.02, 0, 14); // base
  cyl(rookGroup, 0.042, 0.050, 0.14, whiteMat, 0, 0.11, 0, 14); // column
  cyl(rookGroup, 0.058, 0.050, 0.05, whiteMat, 0, 0.20, 0, 14); // crenelated top
  g.add(rookGroup);

  // (B) Middle Shelf (y = 1.21):
  // • White geometric truss bridge cube
  const trussGroup = new THREE.Group();
  trussGroup.position.set(-0.32, 1.22, 0);
  box(trussGroup, 0.18, 0.18, 0.18, M(0xffffff, { wireframe: true }), 0, 0.09, 0);
  box(trussGroup, 0.16, 0.01, 0.16, whiteMat, 0, 0.005, 0);
  box(trussGroup, 0.16, 0.01, 0.16, whiteMat, 0, 0.175, 0);
  g.add(trussGroup);

  // • Bright Yellow Toy Truck
  const truckGroup = new THREE.Group();
  truckGroup.position.set(0.20, 1.22, 0);
  // Yellow chassis & cab
  box(truckGroup, 0.26, 0.05, 0.14, yellowMat, 0, 0.045, 0);
  box(truckGroup, 0.10, 0.08, 0.12, yellowMat, 0.06, 0.10, 0);
  // Cab windshield
  box(truckGroup, 0.01, 0.05, 0.10, M(0x38bdf8), 0.115, 0.105, 0);
  // Yellow dump bucket
  box(truckGroup, 0.14, 0.07, 0.13, yellowMat, -0.06, 0.095, 0);
  // 4 Black chunky wheels
  [[-0.08, -0.075], [0.08, -0.075], [-0.08, 0.075], [0.08, 0.075]].forEach(([wx, wz]) => {
    const wheel = cyl(truckGroup, 0.035, 0.035, 0.024, blackSteelMat, wx, 0.035, wz, 12);
    wheel.rotation.x = Math.PI / 2;
  });
  g.add(truckGroup);

  // (C) Lower Shelves (y = 0.68 and 0.18):
  // • Stacked clear/translucent storage organizer boxes with latch handles
  [0.68, 0.18].forEach(by => {
    [-0.30, 0.30].forEach(bx => {
      // Clear plastic box
      box(g, 0.52, 0.18, 0.38, clearBoxMat, bx, by + 0.11, 0);
      // Grey lid rim
      box(g, 0.54, 0.02, 0.40, M(0xd1d5db, { roughness: 0.4 }), bx, by + 0.21, 0);
      // Orange latch handles
      [-0.265, 0.265].forEach(lx => {
        box(g, 0.015, 0.06, 0.08, orangeMat, bx + lx, by + 0.18, 0);
      });
      // Small colorful parts visible inside
      box(g, 0.10, 0.04, 0.08, M(0xff7a00), bx - 0.12, by + 0.04, 0.06);
      box(g, 0.08, 0.04, 0.08, M(0x2563eb), bx + 0.10, by + 0.04, -0.06);
    });
  });

  parent.add(g);
  return g;
}

/** Floor standing lush potted plant */
function createFloorPlant(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Clean white ceramic cylinder pot
  const potMat = M(0xffffff, { roughness: 0.2, metalness: 0.1 });
  cyl(g, 0.26, 0.20, 0.52, potMat, 0, 0.26, 0, 16);
  // Dark soil
  cyl(g, 0.24, 0.24, 0.04, M(0x3e2723, { roughness: 0.9 }), 0, 0.51, 0, 14);

  // Lush green broadleaf foliage spreading upward
  const leafMat = M(0x2e7d32, { roughness: 0.6 });
  const leafMatLight = M(0x43a047, { roughness: 0.6 });

  for (let l = 0; l < 10; l++) {
    const angle = (l / 10) * Math.PI * 2 + (l % 2) * 0.3;
    const stemH = 0.35 + (l % 4) * 0.18;
    const stemGroup = new THREE.Group();
    stemGroup.position.set(0, 0.52, 0);
    stemGroup.rotation.y = angle;

    // Stem
    const stem = cyl(stemGroup, 0.010, 0.010, stemH, M(0x1b5e20), 0, stemH / 2, 0.08, 8);
    stem.rotation.x = 0.35 + (l % 3) * 0.12;

    // Broad leaf
    const leafGeom = new THREE.SphereGeometry(0.16, 8, 6);
    leafGeom.scale(1.2, 0.08, 0.65);
    const leaf = new THREE.Mesh(leafGeom, l % 2 === 0 ? leafMat : leafMatLight);
    leaf.position.set(0, stemH, 0.22);
    leaf.rotation.x = 0.45;
    leaf.rotation.z = (l % 2 === 0 ? 0.2 : -0.2);
    stemGroup.add(leaf);

    g.add(stemGroup);
  }

  parent.add(g);
  return g;
}

/* ═══════════════════════════════════════════════════════════════════
   CODING ZONE PROPS (Reference-matched Overhaul)
   • Dual Large Monitors with thin bezels, desktop stands, glowing IDE screens
   • Black mechanical keyboards and ergonomic optical mice with desk pads
   • Two chairs: black frame + mesh back + vibrant ORANGE seat cushions
   • Floating black shelf with warm LED strip light underneath
   • 3 stacked books ("Web Development", "C++", "Python") with crisp spine text
   • RC robot car with 4 rubber tires and front ultrasonic sensor
   • White ceramic mug with A5X logo
   • Cute waving robot mascot with glowing cyan LED eyes
   • Right industrial rack: base 2-door black cabinet with silver handles,
     2 black </> organizer boxes, clear acrylic box with electronics,
     and quadcopter drone resting safely ON top shelf
═══════════════════════════════════════════════════════════════════ */

/** High-res VS Code IDE screen texture (1024x640) */
function createIdeScreenTexture(fileName, lang = 'python') {
  return canvasTex(1024, 640, (g, w, h) => {
    // 1. Editor background (dark slate)
    g.fillStyle = '#1e1e24';
    g.fillRect(0, 0, w, h);

    // 2. Left Activity Bar (narrow icon column)
    g.fillStyle = '#18181c';
    g.fillRect(0, 0, 48, h);

    // Activity bar icons (simplified file tree, search, git, debug)
    g.strokeStyle = '#858595';
    g.lineWidth = 3;
    // File icon
    g.strokeRect(14, 20, 20, 24);
    // Search icon
    g.beginPath();
    g.arc(22, 70, 8, 0, Math.PI * 2);
    g.moveTo(28, 76);
    g.lineTo(34, 82);
    g.stroke();
    // Source control branch icon
    g.beginPath();
    g.arc(24, 115, 4, 0, Math.PI * 2);
    g.arc(24, 135, 4, 0, Math.PI * 2);
    g.moveTo(24, 119);
    g.lineTo(24, 131);
    g.stroke();

    // 3. Explorer Sidebar
    g.fillStyle = '#22232a';
    g.fillRect(48, 0, 190, h);
    g.fillStyle = '#a0a0b0';
    g.font = "bold 15px 'Segoe UI', sans-serif";
    g.fillText('EXPLORER', 64, 28);

    g.font = "14px 'Segoe UI', sans-serif";
    const files = [
      '∨ src',
      '    > controllers',
      '    > models',
      '    > sensors',
      `    ${fileName}`,
      '    config.yaml',
      '    requirements.txt',
      '    README.md'
    ];
    files.forEach((f, i) => {
      if (f.includes(fileName)) {
        g.fillStyle = '#2d303e';
        g.fillRect(48, 48 + i * 26, 190, 24);
        g.fillStyle = '#ffffff';
      } else {
        g.fillStyle = '#9aa0b0';
      }
      g.fillText(f, 64, 65 + i * 26);
    });

    // 4. Tab Bar
    g.fillStyle = '#252630';
    g.fillRect(238, 0, w - 238, 36);

    // Active tab
    g.fillStyle = '#1e1e24';
    g.fillRect(238, 0, 180, 36);
    g.fillStyle = '#ff7a00';
    g.fillRect(238, 0, 180, 3); // Orange top accent line
    g.fillStyle = '#ffffff';
    g.font = "14px 'Segoe UI', monospace";
    g.fillText(fileName, 258, 22);
    g.fillStyle = '#858595';
    g.fillText('×', 396, 22);

    // 5. Line numbers column
    g.fillStyle = '#565c6e';
    g.font = "14px 'Consolas', 'Courier New', monospace";
    for (let l = 1; l <= 22; l++) {
      g.fillText(String(l).padStart(2, ' '), 250, 60 + (l - 1) * 24);
    }

    // 6. Code syntax lines
    const codeLines = lang === 'python' ? [
      { text: '#!/usr/bin/env python3', col: '#6a9955' },
      { text: 'import time, math, rospy', col: '#c586c0' },
      { text: 'from sensor_msgs.msg import LaserScan', col: '#c586c0' },
      { text: 'from geometry_msgs.msg import Twist', col: '#c586c0' },
      { text: '', col: '#ffffff' },
      { text: 'class AutonomousNavigator:', col: '#4ec9b0' },
      { text: '    def __init__(self, target_speed=1.2):', col: '#dcdcaa' },
      { text: '        self.speed = target_speed', col: '#9cdcfe' },
      { text: '        self.obstacle_dist = float("inf")', col: '#9cdcfe' },
      { text: '        self.cmd_pub = rospy.Publisher("/cmd_vel", Twist)', col: '#9cdcfe' },
      { text: '', col: '#ffffff' },
      { text: '    def laser_callback(self, data):', col: '#dcdcaa' },
      { text: '        # Process 360-degree LiDAR range data', col: '#6a9955' },
      { text: '        ranges = [r for r in data.ranges if r > 0.05]', col: '#d4d4d4' },
      { text: '        self.obstacle_dist = min(ranges) if ranges else 10.0', col: '#d4d4d4' },
      { text: '        if self.obstacle_dist < 0.6:', col: '#c586c0' },
      { text: '            self.emergency_evasion()', col: '#dcdcaa' },
      { text: '        else:', col: '#c586c0' },
      { text: '            self.navigate_forward()', col: '#dcdcaa' },
      { text: '', col: '#ffffff' },
      { text: 'if __name__ == "__main__":', col: '#c586c0' },
      { text: '    nav = AutonomousNavigator()', col: '#4ec9b0' }
    ] : [
      { text: '#include <iostream>', col: '#c586c0' },
      { text: '#include <vector>', col: '#c586c0' },
      { text: '#include "robot_core.hpp"', col: '#ce9178' },
      { text: '', col: '#ffffff' },
      { text: 'namespace SRI::Robotics {', col: '#4ec9b0' },
      { text: '', col: '#ffffff' },
      { text: 'class KinematicsSolver {', col: '#4ec9b0' },
      { text: 'public:', col: '#c586c0' },
      { text: '    KinematicsSolver(double l1, double l2) : arm1(l1), arm2(l2) {}', col: '#dcdcaa' },
      { text: '', col: '#ffffff' },
      { text: '    bool computeIK(double targetX, double targetY, double& theta1) {', col: '#dcdcaa' },
      { text: '        double d = (targetX * targetX + targetY * targetY);', col: '#9cdcfe' },
      { text: '        if (d > (arm1 + arm2) * (arm1 + arm2)) return false;', col: '#c586c0' },
      { text: '        theta1 = std::atan2(targetY, targetX);', col: '#dcdcaa' },
      { text: '        return true;', col: '#c586c0' },
      { text: '    }', col: '#d4d4d4' },
      { text: '', col: '#ffffff' },
      { text: 'private:', col: '#c586c0' },
      { text: '    double arm1, arm2;', col: '#9cdcfe' },
      { text: '};', col: '#d4d4d4' },
      { text: '', col: '#ffffff' },
      { text: '} // namespace SRI', col: '#6a9955' }
    ];

    codeLines.forEach((cl, i) => {
      g.fillStyle = cl.col;
      g.font = "14px 'Consolas', 'Courier New', monospace";
      g.fillText(cl.text, 285, 60 + i * 24);
    });

    // 7. Minimap on right edge
    g.fillStyle = '#22232a';
    g.fillRect(w - 75, 36, 75, h - 60);
    for (let m = 0; m < 35; m++) {
      g.fillStyle = m % 3 === 0 ? '#4ec9b0' : m % 2 === 0 ? '#9cdcfe' : '#c586c0';
      const mw = 20 + ((m * 17) % 40);
      g.fillRect(w - 68, 48 + m * 14, mw, 5);
    }

    // 8. Bottom Status Bar (VS Code blue)
    g.fillStyle = '#007acc';
    g.fillRect(0, h - 24, w, 24);
    g.fillStyle = '#ffffff';
    g.font = "12px 'Segoe UI', sans-serif";
    g.fillText('  main*  |  0 errors, 0 warnings  |  SRI Lab v2.5', 12, h - 8);
    g.textAlign = 'right';
    g.fillText(`UTF-8  |  ${lang === 'python' ? 'Python 3.11' : 'C++20'}  |  Ln 18, Col 24  `, w - 10, h - 8);
  });
}

/** Complete Workstation (Large Monitor + Stand + Keyboard + Mouse + Desk Pad) */
function createWorkstationWithScreen(parent, x, z, screenTex) {
  const g = new THREE.Group();
  g.position.set(x, 0.82, z);

  const blackMat = M(0x141418, { roughness: 0.35, metalness: 0.4 });
  const standMat = M(0x101014, { roughness: 0.3, metalness: 0.6 });

  // 1. Desk Pad / Mousepad
  const padMat = M(0x1a1a20, { roughness: 0.85 });
  box(g, 0.88, 0.005, 0.38, padMat, 0, 0.002, 0.16);
  // Pad orange border stitch
  box(g, 0.88, 0.006, 0.008, M(0xff7a00), 0, 0.003, 0.35);

  // 2. Monitor Stand
  // Base plate
  box(g, 0.38, 0.016, 0.22, standMat, 0, 0.008, -0.15);
  // Neck post
  const neck = box(g, 0.065, 0.36, 0.045, standMat, 0, 0.18, -0.17);
  neck.rotation.x = -0.05;

  // 3. Monitor Frame & Bezel
  const frameY = 0.46;
  const frameZ = -0.14;
  box(g, 1.10, 0.65, 0.035, blackMat, 0, frameY, frameZ);

  // 4. Glowing Screen
  const tex = typeof screenTex === 'function' ? screenTex() : screenTex;
  tex.anisotropy = 4;
  const screenMat = new THREE.MeshStandardMaterial({
    map: tex,
    emissive: 0xffffff,
    emissiveMap: tex,
    emissiveIntensity: 0.62,
    roughness: 0.25,
    metalness: 0.05
  });
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 0.61), screenMat);
  screenMesh.position.set(0, frameY, frameZ + 0.019);
  g.add(screenMesh);

  // 5. Mechanical Keyboard
  const kbMat = M(0x111114, { roughness: 0.4 });
  const kbX = -0.08, kbY = 0.012, kbZ = 0.16;
  const kbGroup = new THREE.Group();
  kbGroup.position.set(kbX, kbY, kbZ);
  kbGroup.rotation.x = 0.06; // tilted slightly towards user
  box(kbGroup, 0.46, 0.016, 0.145, kbMat, 0, 0, 0);

  // Keyboard keys texture
  const keysTex = canvasTex(256, 128, (kg) => {
    kg.fillStyle = '#16161a';
    kg.fillRect(0, 0, 256, 128);
    kg.fillStyle = '#282830';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 14; c++) {
        if (r === 4 && c > 3 && c < 9) continue; // spacebar area
        kg.fillRect(6 + c * 17.5, 6 + r * 23, 14, 18);
      }
    }
    // Spacebar
    kg.fillRect(6 + 4 * 17.5, 6 + 4 * 23, 85, 18);
  });
  const keysPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.44, 0.13),
    new THREE.MeshStandardMaterial({ map: keysTex, roughness: 0.5 })
  );
  keysPlane.rotation.x = -Math.PI / 2;
  keysPlane.position.y = 0.009;
  kbGroup.add(keysPlane);
  g.add(kbGroup);

  // 6. Ergonomic Optical Mouse
  const mouseGroup = new THREE.Group();
  mouseGroup.position.set(0.26, 0.016, 0.16);
  const mouseBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.030, 0.115),
    M(0x16161a, { roughness: 0.35 })
  );
  mouseGroup.add(mouseBody);
  // Scroll wheel
  cyl(mouseGroup, 0.006, 0.006, 0.018, M(0xff7a00), 0, 0.016, -0.02, 8);
  g.add(mouseGroup);

  parent.add(g);
  return g;
}

/** Complete Realistic Workstation (Large Monitor + Stand + Keyboard + Mouse + Desk Pad) */
function createCodingWorkstation(parent, x, z, fileName, lang) {
  return createWorkstationWithScreen(parent, x, z, createIdeScreenTexture(fileName, lang));
}

/** 3D Modeling Screen Texture (Blender-style dark grid with wireframe drone) */
function create3DModelingScreenTexture() {
  return canvasTex(1024, 640, (g, w, h) => {
    // 1. Dark 3D Viewport background
    g.fillStyle = '#16181f';
    g.fillRect(0, 0, w, h);

    // 2. Perspective 3D Grid lines
    g.strokeStyle = '#252936';
    g.lineWidth = 1;
    const originX = 490, originY = 380;
    for (let x = 60; x <= 800; x += 36) {
      g.beginPath();
      g.moveTo(x, 180);
      g.lineTo(originX + (x - originX) * 1.8, 560);
      g.stroke();
    }
    for (let y = 200; y <= 560; y += 32) {
      const span = 200 + (y - 180) * 1.2;
      g.beginPath();
      g.moveTo(originX - span, y);
      g.lineTo(originX + span, y);
      g.stroke();
    }

    // Coordinate Axes (Red X, Green Y)
    g.strokeStyle = '#e53935';
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(originX - 220, originY);
    g.lineTo(originX + 220, originY);
    g.stroke();

    g.strokeStyle = '#43a047';
    g.beginPath();
    g.moveTo(originX, originY - 180);
    g.lineTo(originX, originY + 180);
    g.stroke();

    // 3. Detailed 3D Wireframe Drone model
    const dx = originX, dy = originY - 45;
    g.strokeStyle = '#cfd8dc';
    g.lineWidth = 2.5;

    // Center body (aerodynamic pod)
    g.beginPath();
    g.moveTo(dx - 55, dy - 20);
    g.lineTo(dx + 55, dy - 20);
    g.lineTo(dx + 75, dy + 15);
    g.lineTo(dx + 35, dy + 45);
    g.lineTo(dx - 35, dy + 45);
    g.lineTo(dx - 75, dy + 15);
    g.closePath();
    g.stroke();

    // Body triangulation wireframe
    g.beginPath();
    g.moveTo(dx - 55, dy - 20); g.lineTo(dx, dy + 10); g.lineTo(dx + 55, dy - 20);
    g.moveTo(dx - 75, dy + 15); g.lineTo(dx, dy + 10); g.lineTo(dx + 75, dy + 15);
    g.moveTo(dx - 35, dy + 45); g.lineTo(dx, dy + 10); g.lineTo(dx + 35, dy + 45);
    g.stroke();

    // 4 Diagonal Motor Arms with Motor Pods & Rotor Circles
    const arms = [
      { ax: -140, ay: -80 },
      { ax: 140,  ay: -80 },
      { ax: -160, ay: 65 },
      { ax: 160,  ay: 65 }
    ];
    arms.forEach((arm) => {
      // Carbon arm tube
      g.strokeStyle = '#90a4ae';
      g.lineWidth = 3.5;
      g.beginPath();
      g.moveTo(dx + (arm.ax > 0 ? 40 : -40), dy + (arm.ay > 0 ? 25 : -10));
      g.lineTo(dx + arm.ax, dy + arm.ay);
      g.stroke();

      // Motor pod
      g.fillStyle = '#37474f';
      g.beginPath();
      g.arc(dx + arm.ax, dy + arm.ay, 12, 0, Math.PI * 2);
      g.fill();
      g.stroke();

      // Spinning rotor blade circle outline
      g.strokeStyle = '#607d8b';
      g.lineWidth = 1.5;
      g.beginPath();
      g.ellipse(dx + arm.ax, dy + arm.ay, 52, 22, (arm.ax > 0 ? 0.35 : -0.35), 0, Math.PI * 2);
      g.stroke();
    });

    // Camera gimbal beneath
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(dx, dy + 42, 16, 0, Math.PI * 2);
    g.stroke();

    // Vertex dots (orange and cyan)
    g.fillStyle = '#ff7a00';
    [
      [dx - 55, dy - 20], [dx + 55, dy - 20], [dx, dy + 10],
      [dx - 35, dy + 45], [dx + 35, dy + 45]
    ].forEach(([vx, vy]) => {
      g.beginPath(); g.arc(vx, vy, 4, 0, Math.PI * 2); g.fill();
    });

    g.fillStyle = '#00e5ff';
    arms.forEach((arm) => {
      g.beginPath(); g.arc(dx + arm.ax, dy + arm.ay, 4, 0, Math.PI * 2); g.fill();
    });

    // 4. Header Bar (Blender workspace tabs)
    g.fillStyle = '#20222a';
    g.fillRect(0, 0, w, 36);

    const tabs = ['Layout', 'Modeling', 'Sculpting', 'UV Editing', 'Shading', 'Animation', 'Render'];
    let tabX = 20;
    tabs.forEach((tab) => {
      if (tab === 'Modeling') {
        g.fillStyle = '#323747';
        g.fillRect(tabX - 8, 0, 85, 36);
        g.fillStyle = '#ff7a00';
        g.fillRect(tabX - 8, 33, 85, 3);
        g.fillStyle = '#ffffff';
      } else {
        g.fillStyle = '#9aa0b4';
      }
      g.font = "bold 13px 'Segoe UI', sans-serif";
      g.fillText(tab, tabX, 22);
      tabX += tab === 'Modeling' ? 95 : 85;
    });

    // 5. Left Toolbar
    g.fillStyle = '#1b1d24';
    g.fillRect(0, 36, 46, h - 36);
    g.strokeStyle = '#858b9e';
    g.lineWidth = 2;
    g.strokeRect(14, 52, 18, 18);
    g.beginPath(); g.arc(23, 96, 8, 0, Math.PI * 2); g.moveTo(23, 84); g.lineTo(23, 108); g.moveTo(11, 96); g.lineTo(35, 96); g.stroke();
    g.beginPath(); g.moveTo(23, 126); g.lineTo(23, 146); g.moveTo(13, 136); g.lineTo(33, 136); g.stroke();
    g.strokeRect(14, 168, 18, 14);

    // 6. Right Outliner & Properties Panel
    g.fillStyle = '#1e2028';
    g.fillRect(w - 210, 36, 210, h - 36);
    g.fillStyle = '#a0a6b8';
    g.font = "bold 13px 'Segoe UI', sans-serif";
    g.fillText('Scene Collection', w - 195, 58);

    g.font = "12px 'Segoe UI', sans-serif";
    const hierarchy = [
      'v Collection',
      '    > Drone_Body_v2 (Mesh)',
      '    > Rotor_Front_Left',
      '    > Rotor_Front_Right',
      '    > Rotor_Rear_Left',
      '    > Rotor_Rear_Right',
      '    > Gimbal_Camera',
      '    > Studio_KeyLight'
    ];
    hierarchy.forEach((item, i) => {
      if (item.includes('Drone_Body')) {
        g.fillStyle = '#34394d';
        g.fillRect(w - 210, 72 + i * 22, 210, 20);
        g.fillStyle = '#ffffff';
      } else {
        g.fillStyle = '#8e94a6';
      }
      g.fillText(item, w - 195, 87 + i * 22);
    });

    // Transform properties subpanel
    g.fillStyle = '#262933';
    g.fillRect(w - 200, 275, 190, 180);
    g.fillStyle = '#ff7a00';
    g.font = "bold 12px 'Segoe UI', sans-serif";
    g.fillText('Transform', w - 190, 295);
    g.fillStyle = '#a0a6b8';
    g.font = "11px 'Segoe UI', monospace";
    g.fillText('Loc X: 0.000m', w - 190, 320);
    g.fillText('Loc Y: 0.000m', w - 190, 338);
    g.fillText('Loc Z: 0.650m', w - 190, 356);
    g.fillText('Rot X: 0.0°', w - 190, 380);
    g.fillText('Rot Y: 0.0°', w - 190, 398);
    g.fillText('Rot Z: 15.0°', w - 190, 416);
    g.fillText('Scale: 1.000', w - 190, 438);

    // 7. Bottom Status Bar
    g.fillStyle = '#17191f';
    g.fillRect(0, h - 24, w, 24);
    g.fillStyle = '#7a8196';
    g.font = "12px 'Segoe UI', sans-serif";
    g.fillText('Verts: 14,820  |  Faces: 12,450  |  Tris: 24,900  |  SRI 3D Studio v4.2', 14, h - 8);
    g.textAlign = 'right';
    g.fillText('Object Mode  |  3D Viewport  |  Units: Metric  ', w - 10, h - 8);
  });
}

/** Graphic Design App Screen Texture (Photoshop/Illustrator style with SRI Drone Poster) */
function createGraphicDesignScreenTexture() {
  return canvasTex(1024, 640, (g, w, h) => {
    // 1. Dark workspace background
    g.fillStyle = '#23252d';
    g.fillRect(0, 0, w, h);

    // 2. Top Menu Bar
    g.fillStyle = '#1c1e24';
    g.fillRect(0, 0, w, 34);
    g.fillStyle = '#9aa0b4';
    g.font = "12px 'Segoe UI', sans-serif";
    g.fillText('File   Edit   Object   Type   Select   Effect   View   Window   Help', 18, 22);

    // 3. Central Poster Artwork Canvas (width 480, height 530)
    const cw = 480, ch = 530;
    const cx = 100, cy = 56;

    // Canvas drop shadow
    g.fillStyle = 'rgba(0, 0, 0, 0.45)';
    g.fillRect(cx + 8, cy + 8, cw, ch);

    // White/Cream Poster Base
    g.fillStyle = '#fff9f2';
    g.fillRect(cx, cy, cw, ch);

    // Poster Graphic Layout:
    // Navy & Orange diagonal background shapes
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + cw, cy);
    g.lineTo(cx + cw, cy + ch * 0.42);
    g.lineTo(cx, cy + ch * 0.28);
    g.closePath();
    g.fill();

    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(cx + cw, cy + ch * 0.35);
    g.lineTo(cx + cw, cy + ch * 0.48);
    g.lineTo(cx, cy + ch * 0.34);
    g.lineTo(cx, cy + ch * 0.28);
    g.closePath();
    g.fill();

    // SRI Logo at top left of poster
    g.fillStyle = '#ff7a00';
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      const lx = cx + 70 + Math.cos(a) * 20;
      const ly = cy + 45 + Math.sin(a) * 14;
      g.beginPath(); g.arc(lx, ly, 3.5, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#ffffff';
    g.font = "900 24px Georgia, serif";
    g.textAlign = 'center';
    g.fillText('SRI', cx + 70, cy + 68);
    g.strokeStyle = '#ff7a00'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 45, cy + 76); g.quadraticCurveTo(cx + 70, cy + 82, cx + 95, cy + 74); g.stroke();

    // Central Blue & Orange Drone Vector Illustration on poster
    const dX = cx + cw / 2, dY = cy + ch * 0.52;
    // Glow behind drone
    const radGlow = g.createRadialGradient(dX, dY, 10, dX, dY, 140);
    radGlow.addColorStop(0, 'rgba(255, 122, 0, 0.2)');
    radGlow.addColorStop(1, 'rgba(255, 249, 242, 0)');
    g.fillStyle = radGlow;
    g.beginPath(); g.arc(dX, dY, 140, 0, Math.PI * 2); g.fill();

    // Drone Body
    g.fillStyle = '#14284b';
    g.beginPath();
    g.roundRect(dX - 60, dY - 20, 120, 40, 12);
    g.fill();
    // Drone Orange stripe
    g.fillStyle = '#ff7a00';
    g.fillRect(dX - 50, dY - 4, 100, 8);

    // 4 Diagonal Arms
    g.strokeStyle = '#14284b';
    g.lineWidth = 8;
    [[-85, -55], [85, -55], [-95, 45], [95, 45]].forEach(([ax, ay]) => {
      g.beginPath();
      g.moveTo(dX + (ax > 0 ? 30 : -30), dY);
      g.lineTo(dX + ax, dY + ay);
      g.stroke();

      // Motor pod
      g.fillStyle = '#ff7a00';
      g.beginPath(); g.arc(dX + ax, dY + ay, 10, 0, Math.PI * 2); g.fill();

      // Propeller blades
      g.strokeStyle = '#007acc';
      g.lineWidth = 3;
      g.beginPath();
      g.ellipse(dX + ax, dY + ay, 38, 12, ax > 0 ? 0.3 : -0.3, 0, Math.PI * 2);
      g.stroke();
    });

    // Poster Title text below drone
    g.fillStyle = '#14284b';
    g.font = "900 24px 'Segoe UI', Arial, sans-serif";
    g.textAlign = 'center';
    g.fillText('NEXT-GEN ROBOTICS', dX, cy + ch * 0.78);
    g.fillStyle = '#ff7a00';
    g.font = "bold 15px 'Segoe UI', sans-serif";
    g.fillText('DESIGN • PROTOTYPE • INNOVATE', dX, cy + ch * 0.84);

    // 4. Left Vertical Tool Palette
    g.fillStyle = '#1a1c22';
    g.fillRect(0, 34, 48, h - 34);
    g.strokeStyle = '#858b9e';
    g.lineWidth = 2;
    // Active Pen tool icon (orange highlight)
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.roundRect(8, 48, 32, 32, 6); g.fill();
    g.strokeStyle = '#ffffff';
    g.beginPath(); g.moveTo(24, 54); g.lineTo(32, 70); g.lineTo(26, 70); g.lineTo(24, 74); g.lineTo(22, 70); g.lineTo(16, 70); g.closePath(); g.stroke();
    // Selection tools
    g.strokeStyle = '#858b9e';
    g.strokeRect(14, 94, 20, 20);
    g.strokeRect(14, 130, 20, 16);

    // 5. Right Docking Panels (Color & Layers)
    g.fillStyle = '#1e2028';
    g.fillRect(w - 220, 34, 220, h - 34);

    // Color panel header
    g.fillStyle = '#a0a6b8';
    g.font = "bold 13px 'Segoe UI', sans-serif";
    g.textAlign = 'left';
    g.fillText('Color Spectrum', w - 205, 56);

    // Spectrum swatch bar
    const grad = g.createLinearGradient(w - 205, 0, w - 25, 0);
    grad.addColorStop(0, '#ff0000');
    grad.addColorStop(0.2, '#ffff00');
    grad.addColorStop(0.4, '#00ff00');
    grad.addColorStop(0.6, '#00ffff');
    grad.addColorStop(0.8, '#0000ff');
    grad.addColorStop(1, '#ff00ff');
    g.fillStyle = grad;
    g.fillRect(w - 205, 68, 180, 20);

    // Layers panel
    g.fillStyle = '#a0a6b8';
    g.font = "bold 13px 'Segoe UI', sans-serif";
    g.fillText('Layers', w - 205, 125);

    const layers = [
      '  [👁] Layer 4: Drone_Aero',
      '  [👁] Layer 3: Tech_Vectors',
      '  [👁] Layer 2: SRI_Lotus_Logo',
      '  [👁] Layer 1: Navy_Shapes',
      '  [🔒] Background'
    ];
    layers.forEach((l, i) => {
      if (i === 0) {
        g.fillStyle = '#2f3547';
        g.fillRect(w - 220, 138 + i * 26, 220, 24);
        g.fillStyle = '#ffffff';
      } else {
        g.fillStyle = '#8e94a6';
      }
      g.font = "12px 'Segoe UI', sans-serif";
      g.fillText(l, w - 205, 155 + i * 26);
    });

    // 6. Bottom Status Bar
    g.fillStyle = '#17191f';
    g.fillRect(0, h - 24, w, 24);
    g.fillStyle = '#7a8196';
    g.font = "12px 'Segoe UI', sans-serif";
    g.fillText('Doc: 4000px × 3000px (300 ppi)  |  100%  |  SRI_Drone_Poster.ai', 14, h - 8);
    g.textAlign = 'right';
    g.fillText('CMYK/8  |  GPU Accelerated  ', w - 10, h - 8);
  });
}

/** 3 Stacked Books ("Adobe Illustrator", "Adobe Photoshop", "Blender 3D") */
function createDesignStackedBooks(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const books = [
    { title: 'Adobe Illustrator', col: '#14284b', band: '#ff7a00', w: 0.36, h: 0.055, d: 0.24, dy: 0.028 },
    { title: 'Adobe Photoshop',   col: '#182b52', band: '#31a8ff', w: 0.33, h: 0.055, d: 0.23, dy: 0.083 },
    { title: 'Blender 3D',        col: '#1b3260', band: '#f59e0b', w: 0.30, h: 0.055, d: 0.21, dy: 0.138 }
  ];

  books.forEach((b) => {
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, b.dy, 0);

    box(bookGroup, b.w, b.h, b.d, M(b.col, { roughness: 0.5 }), 0, 0, 0);
    box(bookGroup, b.w - 0.02, b.h - 0.012, 0.015, M(0xf5f5f5, { roughness: 0.9 }), 0, 0, -b.d / 2 + 0.008);

    const spineTex = canvasTex(512, 128, (sg) => {
      sg.fillStyle = b.col;
      sg.fillRect(0, 0, 512, 128);
      sg.fillStyle = b.band;
      sg.fillRect(20, 10, 8, 108);
      sg.fillRect(484, 10, 8, 108);
      sg.fillStyle = '#ffffff';
      sg.font = "900 42px 'Segoe UI', Arial, sans-serif";
      sg.textAlign = 'center';
      sg.textBaseline = 'middle';
      sg.fillText(b.title, 256, 64);
    });
    spineTex.anisotropy = 4;
    const spineMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(b.w, b.h),
      new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.45 })
    );
    spineMesh.position.set(0, 0, b.d / 2 + 0.001);
    bookGroup.add(spineMesh);

    g.add(bookGroup);
  });

  parent.add(g);
  return g;
}

/** White Ceramic Mug with authentic SRI Lotus Logo */
function createDesignWhiteMug(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const ceramicMat = M(0xffffff, { roughness: 0.15, metalness: 0.05 });
  cyl(g, 0.052, 0.048, 0.11, ceramicMat, 0, 0.055, 0, 16);
  cyl(g, 0.046, 0.046, 0.01, M(0x2d1810, { roughness: 0.3 }), 0, 0.10, 0, 14);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.038, 0.010, 8, 16, Math.PI),
    ceramicMat
  );
  handle.position.set(0.062, 0.055, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);

  const logoTex = canvasTex(128, 64, (lg) => {
    lg.fillStyle = '#ffffff';
    lg.fillRect(0, 0, 128, 64);
    // Leaf fan
    lg.fillStyle = '#ff7a00';
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      const lx = 64 + Math.cos(a) * 20;
      const ly = 24 + Math.sin(a) * 12;
      lg.beginPath(); lg.arc(lx, ly, 3.5, 0, Math.PI * 2); lg.fill();
    }
    // SRI text
    lg.fillStyle = '#14284b';
    lg.font = "900 22px Georgia, serif";
    lg.textAlign = 'center';
    lg.textBaseline = 'top';
    lg.fillText('SRI', 64, 25);
    // Swoosh
    lg.strokeStyle = '#ff7a00';
    lg.lineWidth = 2.5;
    lg.beginPath();
    lg.moveTo(42, 50);
    lg.quadraticCurveTo(64, 56, 86, 48);
    lg.stroke();
  });
  const logoMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.055, 0.028),
    new THREE.MeshStandardMaterial({ map: logoTex, roughness: 0.2 })
  );
  logoMesh.position.set(0, 0.058, 0.053);
  g.add(logoMesh);

  parent.add(g);
  return g;
}

/** Floating black shelf with warm LED strip underneath + props */
function createDesignFloatingShelfWithProps(parent, x, y, z, anim) {
  const g = new THREE.Group();

  const shelfMat = M(0x161618, { roughness: 0.45, metalness: 0.2 });
  box(g, 3.8, 0.05, 0.30, shelfMat, x, y, z);

  const ledMat = M(0xffe082, {
    emissive: 0xffe082,
    emissiveIntensity: 2.2,
    roughness: 0.2
  });
  box(g, 3.6, 0.012, 0.035, ledMat, x, y - 0.028, z + 0.04);

  const shelfLight = new THREE.PointLight(0xffb74d, 2.0, 3.2, 2.0);
  shelfLight.position.set(x, y - 0.06, z + 0.12);
  g.add(shelfLight);

  const topY = y + 0.025;

  // 3 Stacked Books ("Adobe Illustrator", "Adobe Photoshop", "Blender 3D")
  createDesignStackedBooks(g, x - 1.45, topY, z);

  // RC Robot Car
  createRcRobotCar(g, x - 0.45, topY, z);

  // White Ceramic Mug with authentic SRI logo
  createDesignWhiteMug(g, x + 0.45, topY, z);

  // Cute Waving Robot Mascot
  const wavingBot = createWavingMascot(g, x + 1.25, topY, z);
  if (anim) {
    anim.head = wavingBot.getObjectByName('codingZoneMascotHead');
  }

  parent.add(g);
  return g;
}

/** Designing Zone Industrial Rack with Cabinet, 2 Pen-Nib Boxes, Clear Box, Drone */
function createDesigningZoneRack(parent, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const blackSteelMat = M(0x1a1a1e, { roughness: 0.4, metalness: 0.6 });
  const woodMat = M(C.wood, { roughness: 0.6 });
  const silverMat = M(0xd1d5db, { roughness: 0.25, metalness: 0.8 });

  const rW = 1.22, rD = 0.54, cabH = 0.74;

  // 1. Base 2-Door Black Cabinet
  box(g, rW, cabH, rD, blackSteelMat, 0, cabH / 2, 0);
  box(g, rW + 0.02, 0.035, rD + 0.02, woodMat, 0, cabH + 0.0175, 0);
  box(g, 0.008, cabH - 0.08, 0.005, M(0x0a0a0d), 0, cabH / 2, rD / 2 + 0.002);
  [-0.04, 0.04].forEach(hx => {
    cyl(g, 0.007, 0.007, 0.14, silverMat, hx, cabH * 0.65, rD / 2 + 0.025, 8);
  });

  // 2. Black Steel Corner Uprights
  const postH = 1.62;
  const postY = cabH + postH / 2;
  const px = rW / 2 - 0.025, pz = rD / 2 - 0.025;
  [[-px, -pz], [px, -pz], [-px, pz], [px, pz]].forEach(([a, b]) => {
    box(g, 0.035, postH, 0.035, blackSteelMat, a, postY, b);
  });

  // 3. Wooden Shelves
  const shelfHeights = [1.25, 1.70, 2.15];
  shelfHeights.forEach(sy => {
    box(g, rW - 0.02, 0.030, rD - 0.02, woodMat, 0, sy, 0);
  });

  // 4. Shelf 1 (y = 1.25): Two black boxes with white pen-nib icon
  [-0.24, 0.24].forEach((bx) => {
    const boxGroup = new THREE.Group();
    boxGroup.position.set(bx, 1.25 + 0.11, 0);
    box(boxGroup, 0.28, 0.20, 0.32, M(0x18181c, { roughness: 0.5 }), 0, 0, 0);

    const markTex = canvasTex(128, 128, (mg) => {
      mg.fillStyle = '#18181c';
      mg.fillRect(0, 0, 128, 128);
      // White fountain pen drafting nib
      mg.fillStyle = '#ffffff';
      mg.beginPath();
      mg.moveTo(42, 34);
      mg.lineTo(86, 34);
      mg.lineTo(76, 68);
      mg.lineTo(65, 98);
      mg.lineTo(63, 98);
      mg.lineTo(52, 68);
      mg.closePath();
      mg.fill();
      mg.fillStyle = '#18181c';
      mg.beginPath(); mg.arc(64, 62, 5, 0, Math.PI * 2); mg.fill();
      mg.strokeStyle = '#18181c'; mg.lineWidth = 3;
      mg.beginPath(); mg.moveTo(64, 67); mg.lineTo(64, 98); mg.stroke();
    });
    const markMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.14),
      new THREE.MeshStandardMaterial({ map: markTex, roughness: 0.4 })
    );
    markMesh.position.set(0, 0, 0.161);
    boxGroup.add(markMesh);
    g.add(boxGroup);
  });

  // 5. Shelf 2 (y = 1.70): Transparent acrylic storage box with visible electronics
  const clearMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.12,
    transmission: 0.75,
    ior: 1.45
  });
  box(g, 0.52, 0.18, 0.34, clearMat, 0, 1.70 + 0.10, 0);
  [-0.18, 0.18].forEach(lx => {
    box(g, 0.018, 0.05, 0.015, M(0xff7a00), lx, 1.70 + 0.17, 0.172);
  });
  box(g, 0.20, 0.015, 0.14, M(0x15803d), -0.08, 1.70 + 0.04, 0);
  box(g, 0.12, 0.035, 0.08, M(0xff7a00), 0.12, 1.70 + 0.04, 0);
  cyl(g, 0.02, 0.02, 0.08, M(0x2563eb), 0, 1.70 + 0.04, -0.06, 8);

  // 6. Shelf 3 (y = 2.15): Quadcopter Drone sitting safely ON top wooden shelf
  createDrone(g, 0, 2.165, 0);

  // 7. Orange faceted ceramic vase on top of rack
  const vaseGroup = new THREE.Group();
  vaseGroup.position.set(0, 2.38, 0);
  const orangeVaseMat = M(0xff7a00, { roughness: 0.35 });
  cyl(vaseGroup, 0.06, 0.10, 0.18, orangeVaseMat, 0, 0.09, 0, 8);
  cyl(vaseGroup, 0.09, 0.05, 0.14, orangeVaseMat, 0, 0.23, 0, 8);
  cyl(vaseGroup, 0.045, 0.055, 0.08, orangeVaseMat, 0, 0.32, 0, 8);
  g.add(vaseGroup);

  parent.add(g);
  return g;
}

/** White Miniature Astronaut Figurine for Tabletop */
function createAstronautFigurine(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xf0f0f3, { roughness: 0.35, metalness: 0.1 });
  const goldVisorMat = M(0xffb300, { roughness: 0.15, metalness: 0.9 });
  const darkMat = M(0x222228, { roughness: 0.5 });

  // Legs & boots
  box(g, 0.045, 0.09, 0.05, whiteMat, -0.035, 0.045, 0);
  box(g, 0.045, 0.09, 0.05, whiteMat, 0.035, 0.045, 0);
  box(g, 0.05, 0.02, 0.065, darkMat, -0.035, 0.01, 0.008);
  box(g, 0.05, 0.02, 0.065, darkMat, 0.035, 0.01, 0.008);

  // Torso & backpack
  box(g, 0.10, 0.11, 0.075, whiteMat, 0, 0.14, 0);
  box(g, 0.075, 0.09, 0.04, whiteMat, 0, 0.14, -0.05);

  // Arms
  box(g, 0.038, 0.09, 0.038, whiteMat, -0.065, 0.13, 0);
  box(g, 0.038, 0.09, 0.038, whiteMat, 0.065, 0.13, 0);

  // Helmet & gold visor
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), whiteMat);
  helmet.position.set(0, 0.23, 0);
  g.add(helmet);

  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), goldVisorMat);
  visor.position.set(0, 0.23, 0.035);
  visor.scale.set(1.1, 0.85, 0.65);
  g.add(visor);

  parent.add(g);
  return g;
}

/** 3 Stacked Books ("Web Development", "C++", "Python") with crisp spine titles */
function createStackedBooks(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const books = [
    { title: 'Web Development', col: '#14284b', band: '#ffd43b', w: 0.36, h: 0.055, d: 0.24, dy: 0.028 },
    { title: 'C++',             col: '#182b52', band: '#e0e0e0', w: 0.33, h: 0.055, d: 0.23, dy: 0.083 },
    { title: 'Python',          col: '#1b3260', band: '#ff7a00', w: 0.30, h: 0.055, d: 0.21, dy: 0.138 }
  ];

  books.forEach((b) => {
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, b.dy, 0);

    // Book body
    box(bookGroup, b.w, b.h, b.d, M(b.col, { roughness: 0.5 }), 0, 0, 0);
    // White pages on side edges
    box(bookGroup, b.w - 0.02, b.h - 0.012, 0.015, M(0xf5f5f5, { roughness: 0.9 }), 0, 0, -b.d / 2 + 0.008);

    // Front Spine with canvas text
    const spineTex = canvasTex(512, 128, (sg) => {
      sg.fillStyle = b.col;
      sg.fillRect(0, 0, 512, 128);
      // Accent metallic bands
      sg.fillStyle = b.band;
      sg.fillRect(20, 10, 8, 108);
      sg.fillRect(484, 10, 8, 108);
      // Spine title
      sg.fillStyle = '#ffffff';
      sg.font = "900 44px 'Segoe UI', Arial, sans-serif";
      sg.textAlign = 'center';
      sg.textBaseline = 'middle';
      sg.fillText(b.title, 256, 64);
    });
    spineTex.anisotropy = 4;
    const spineMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(b.w, b.h),
      new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.45 })
    );
    spineMesh.position.set(0, 0, b.d / 2 + 0.001);
    bookGroup.add(spineMesh);

    g.add(bookGroup);
  });

  parent.add(g);
  return g;
}

/** Small RC Robot Car with 4 knobby rubber wheels and front sensor */
function createRcRobotCar(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const chassisMat = M(0x1a1a1e, { roughness: 0.4 });
  const yellowMat = M(0xf59e0b, { roughness: 0.35 });
  const tireMat = M(0x111111, { roughness: 0.8 });

  // Chassis lower and upper decks
  box(g, 0.28, 0.025, 0.17, chassisMat, 0, 0.035, 0);
  box(g, 0.24, 0.020, 0.14, yellowMat, 0, 0.065, 0);

  // Standoff pillars
  [[-0.10, -0.06], [0.10, -0.06], [-0.10, 0.06], [0.10, 0.06]].forEach(([px, pz]) => {
    cyl(g, 0.005, 0.005, 0.03, M(0xc0c0c0), px, 0.05, pz, 6);
  });

  // Top microcontroller circuit board (green PCB)
  box(g, 0.14, 0.012, 0.09, M(0x15803d, { roughness: 0.6 }), -0.02, 0.08, 0);
  // Microcontroller chip
  box(g, 0.04, 0.008, 0.04, M(0x0a0a0a), -0.02, 0.09, 0);
  // Indicator LED (glowing red)
  box(g, 0.012, 0.012, 0.012, Bm(0xef4444), -0.06, 0.09, 0.03);

  // Front dual ultrasonic distance sensor eyes
  cyl(g, 0.018, 0.018, 0.022, M(0xd1d5db), 0.14, 0.075, -0.03, 10);
  cyl(g, 0.018, 0.018, 0.022, M(0xd1d5db), 0.14, 0.075, 0.03, 10);
  cyl(g, 0.010, 0.010, 0.024, M(0x111111), 0.14, 0.075, -0.03, 8);
  cyl(g, 0.010, 0.010, 0.024, M(0x111111), 0.14, 0.075, 0.03, 8);

  // 4 Off-road rubber wheels with yellow rims
  const wheelR = 0.042;
  const wheelW = 0.032;
  [
    [-0.09, 0.042, -0.105],
    [0.09, 0.042, -0.105],
    [-0.09, 0.042, 0.105],
    [0.09, 0.042, 0.105]
  ].forEach(([wx, wy, wz]) => {
    // Tire
    const tire = cyl(g, wheelR, wheelR, wheelW, tireMat, wx, wy, wz, 12);
    tire.rotation.x = Math.PI / 2;
    // Rim
    const rim = cyl(g, wheelR * 0.58, wheelR * 0.58, wheelW + 0.002, yellowMat, wx, wy, wz, 10);
    rim.rotation.x = Math.PI / 2;
  });

  parent.add(g);
  return g;
}

/** White Ceramic Coffee Mug with A5X Logo */
function createWhiteMug(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const ceramicMat = M(0xffffff, { roughness: 0.15, metalness: 0.05 });
  // Mug cylinder body
  cyl(g, 0.052, 0.048, 0.11, ceramicMat, 0, 0.055, 0, 16);
  // Coffee inside
  cyl(g, 0.046, 0.046, 0.01, M(0x2d1810, { roughness: 0.3 }), 0, 0.10, 0, 14);
  // Handle
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.038, 0.010, 8, 16, Math.PI),
    ceramicMat
  );
  handle.position.set(0.062, 0.055, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);

  // Mug front logo
  const logoTex = canvasTex(128, 64, (lg) => {
    lg.fillStyle = '#ffffff';
    lg.fillRect(0, 0, 128, 64);
    lg.fillStyle = '#ff7a00';
    lg.font = "900 28px 'Segoe UI', sans-serif";
    lg.textAlign = 'center';
    lg.textBaseline = 'middle';
    lg.fillText('A5X', 64, 32);
  });
  const logoMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.05, 0.025),
    new THREE.MeshStandardMaterial({ map: logoTex, roughness: 0.2 })
  );
  logoMesh.position.set(0, 0.058, 0.053);
  g.add(logoMesh);

  parent.add(g);
  return g;
}

/** Cute Waving Robot Mascot (White Body, Orange Trim, Glowing Cyan Eyes) */
function createWavingMascot(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xf8fafc, { roughness: 0.3, metalness: 0.05 });
  const orangeMat = M(0xff7a00, { roughness: 0.4 });
  const darkMat = M(0x141418, { roughness: 0.4 });

  // Feet & Legs
  box(g, 0.065, 0.05, 0.09, orangeMat, -0.055, 0.025, 0.01);
  box(g, 0.065, 0.05, 0.09, orangeMat, 0.055, 0.025, 0.01);

  // Torso
  box(g, 0.18, 0.16, 0.13, whiteMat, 0, 0.13, 0);
  // Orange belly plate
  box(g, 0.12, 0.09, 0.015, orangeMat, 0, 0.12, 0.068);

  // Left arm resting at side
  const leftArm = box(g, 0.045, 0.12, 0.045, whiteMat, -0.115, 0.13, 0);
  leftArm.rotation.z = -0.12;

  // Right waving arm (angled up at 45° with hand waving)
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.10, 0.18, 0);
  rightShoulder.rotation.z = -0.85; // Raised upward
  box(rightShoulder, 0.045, 0.10, 0.045, whiteMat, 0, 0.05, 0);
  // Forearm & Hand bent upward in wave
  const rightHand = new THREE.Group();
  rightHand.position.set(0, 0.10, 0);
  rightHand.rotation.z = 0.55;
  box(rightHand, 0.042, 0.06, 0.042, whiteMat, 0, 0.03, 0);
  cyl(rightHand, 0.022, 0.022, 0.025, orangeMat, 0, 0.06, 0, 8);
  rightShoulder.add(rightHand);
  g.add(rightShoulder);

  // Neck
  cyl(g, 0.025, 0.025, 0.025, darkMat, 0, 0.22, 0, 8);

  // Head
  const head = new THREE.Group();
  head.name = 'codingZoneMascotHead';
  head.position.set(0, 0.29, 0);
  // Head block
  box(head, 0.19, 0.14, 0.13, whiteMat, 0, 0, 0);
  // Black visor face
  box(head, 0.15, 0.09, 0.015, darkMat, 0, 0, 0.067);
  // Glowing cyan eyes
  const eyeMat = Bm(0x00f5ff);
  box(head, 0.032, 0.028, 0.018, eyeMat, -0.042, 0.008, 0.070);
  box(head, 0.032, 0.028, 0.018, eyeMat, 0.042, 0.008, 0.070);
  // Orange ear cups
  cyl(head, 0.028, 0.028, 0.025, orangeMat, -0.105, 0, 0, 10);
  cyl(head, 0.028, 0.028, 0.025, orangeMat, 0.105, 0, 0, 10);
  // Antenna
  cyl(head, 0.006, 0.006, 0.04, darkMat, 0, 0.09, 0, 6);
  const antBall = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), orangeMat);
  antBall.position.set(0, 0.115, 0);
  head.add(antBall);

  g.add(head);

  parent.add(g);
  return g;
}

/** Floating Black Top Shelf with warm LED strip underneath + props */
function createFloatingShelfWithProps(parent, x, y, z, anim) {
  const g = new THREE.Group();

  // 1. Floating Matte Black Shelf Board
  const shelfMat = M(0x161618, { roughness: 0.45, metalness: 0.2 });
  box(g, 3.8, 0.05, 0.30, shelfMat, x, y, z);

  // 2. Warm LED Strip along full underside
  const ledMat = M(0xffe082, {
    emissive: 0xffe082,
    emissiveIntensity: 2.2,
    roughness: 0.2
  });
  box(g, 3.6, 0.012, 0.035, ledMat, x, y - 0.028, z + 0.04);

  // 3. Warm Downlight illuminating workstation below
  const shelfLight = new THREE.PointLight(0xffb74d, 2.0, 3.2, 2.0);
  shelfLight.position.set(x, y - 0.06, z + 0.12);
  g.add(shelfLight);

  // 4. Shelf Props (standing on top surface y + 0.025 = 2.475)
  const topY = y + 0.025;

  // 3 Stacked Books ("Web Development", "C++", "Python")
  createStackedBooks(g, x - 1.45, topY, z);

  // RC Robot Car
  createRcRobotCar(g, x - 0.45, topY, z);

  // White Ceramic Mug with A5X logo
  createWhiteMug(g, x + 0.45, topY, z);

  // Cute Waving Robot Mascot
  const wavingBot = createWavingMascot(g, x + 1.25, topY, z);
  if (anim) {
    anim.head = wavingBot.getObjectByName('codingZoneMascotHead');
  }

  parent.add(g);
  return g;
}

/** Right Industrial Shelving Unit (Base 2-Door Cabinet + Wooden Shelves + Drone) */
function createCodingZoneRack(parent, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const blackSteelMat = M(0x1a1a1e, { roughness: 0.4, metalness: 0.6 });
  const woodMat = M(C.wood, { roughness: 0.6 });
  const silverMat = M(0xd1d5db, { roughness: 0.25, metalness: 0.8 });

  const rW = 1.22, rD = 0.54, cabH = 0.74;

  // 1. Base 2-Door Black Cabinet
  box(g, rW, cabH, rD, blackSteelMat, 0, cabH / 2, 0);
  // Blonde wood countertop on top of cabinet
  box(g, rW + 0.02, 0.035, rD + 0.02, woodMat, 0, cabH + 0.0175, 0);

  // Cabinet front doors slit line
  box(g, 0.008, cabH - 0.08, 0.005, M(0x0a0a0d), 0, cabH / 2, rD / 2 + 0.002);
  // Two sleek vertical chrome handles
  [-0.04, 0.04].forEach(hx => {
    cyl(g, 0.007, 0.007, 0.14, silverMat, hx, cabH * 0.65, rD / 2 + 0.025, 8);
  });

  // 2. Black Steel Corner Uprights
  const postH = 1.62;
  const postY = cabH + postH / 2;
  const px = rW / 2 - 0.025, pz = rD / 2 - 0.025;
  [[-px, -pz], [px, -pz], [-px, pz], [px, pz]].forEach(([a, b]) => {
    box(g, 0.035, postH, 0.035, blackSteelMat, a, postY, b);
  });

  // 3. Wooden Shelves
  const shelfHeights = [1.25, 1.70, 2.15];
  shelfHeights.forEach(sy => {
    box(g, rW - 0.02, 0.030, rD - 0.02, woodMat, 0, sy, 0);
  });

  // 4. Shelf 1 (y = 1.25): Two black boxes with orange </> mark
  [-0.24, 0.24].forEach((bx, idx) => {
    const boxGroup = new THREE.Group();
    boxGroup.position.set(bx, 1.25 + 0.11, 0);
    // Black box body
    box(boxGroup, 0.28, 0.20, 0.32, M(0x18181c, { roughness: 0.5 }), 0, 0, 0);

    // Front face with </> mark
    const markTex = canvasTex(128, 128, (mg) => {
      mg.fillStyle = '#18181c';
      mg.fillRect(0, 0, 128, 128);
      mg.fillStyle = idx === 0 ? '#ff7a00' : '#ffffff';
      mg.font = "900 52px monospace, sans-serif";
      mg.textAlign = 'center';
      mg.textBaseline = 'middle';
      mg.fillText('</>', 64, 64);
    });
    const markMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.14),
      new THREE.MeshStandardMaterial({ map: markTex, roughness: 0.4 })
    );
    markMesh.position.set(0, 0, 0.161);
    boxGroup.add(markMesh);
    g.add(boxGroup);
  });

  // 5. Shelf 2 (y = 1.70): Transparent acrylic storage box with visible electronics
  const clearMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.12,
    transmission: 0.75,
    ior: 1.45
  });
  box(g, 0.52, 0.18, 0.34, clearMat, 0, 1.70 + 0.10, 0);
  // Orange latches on lid
  [-0.18, 0.18].forEach(lx => {
    box(g, 0.018, 0.05, 0.015, M(0xff7a00), lx, 1.70 + 0.17, 0.172);
  });
  // Visible electronics inside
  box(g, 0.20, 0.015, 0.14, M(0x15803d), -0.08, 1.70 + 0.04, 0); // green PCB
  box(g, 0.12, 0.035, 0.08, M(0xff7a00), 0.12, 1.70 + 0.04, 0);  // orange battery pack
  cyl(g, 0.02, 0.02, 0.08, M(0x2563eb), 0, 1.70 + 0.04, -0.06, 8); // capacitor

  // 6. Shelf 3 (y = 2.15): Quadcopter Drone sitting safely ON top wooden shelf
  createDrone(g, 0, 2.165, 0);

  parent.add(g);
  return g;
}

export function buildBackWall(scene) {
  const anim = { spin: [], head: null };

  // Helper: zone bay with sign + bench table (used for Design and Coding zones)
  const bay = (x, title) => {
    put(scene, createSign(title, 4.4, 1.05), x, 4.6, -14.76);
    createTable(scene, 5.5, 1.3, x, -14.1);
  };

  // ━━━━━━━ 3D PRINTING ZONE (x ≈ -11.0) ━━━━━━━
  // Workbench Table (5.8m wide, 1.25m deep, 0.82m tall)
  createTable(scene, 5.8, 1.25, -11.0, -14.1, 0.82);

  // Hero 3D Printer (center of workbench)
  const heroPrinter = createHero3DPrinter(scene, -11.0, 0.82, -14.1);
  anim.spin.push(heroPrinter);

  // Tabletop props (cutting mat, astronaut, rocket, gear, temple, orange parts)
  createTabletopProps(scene, -11.0, 0.82, -14.1);

  // Filament Spool Shelf (above pegboard, wooden shelf with 6 hollow spools on rod)
  createFilamentSpoolShelf(scene, -13.1, 2.65, -14.62);

  // Pegboard with tools (2 pliers, 4 screwdrivers, ruler, caliper, orange tool cup)
  createPegboardWithTools(scene, -13.1, 1.62, -14.73);

  // Right Open Shelving Unit (black metal + wood shelves with models & storage boxes)
  createOpenShelfUnit(scene, -8.2, 0.0, -14.25);

  // Single task chair: black frame, vibrant orange seat cushion (facing the desk)
  createChair(scene, -10.2, -13.1, Math.PI, { orangeSeat: true });

  // Full-sized floor plant near corner
  createFloorPlant(scene, -15.5, 0.0, -13.8);

  // ━━━━━━━ DESIGNING ZONE (x ≈ 0.0, reference-matched overhaul) ━━━━━━━
  // Workbench Table (5.4m wide, 1.25m deep, 0.82m tall, blonde wood top + black metal legs)
  createTable(scene, 5.4, 1.25, 0.0, -14.15, 0.82);

  // Soft grounding contact shadows under table legs
  [
    [-2.58, -14.15 - 0.505],
    [2.58, -14.15 - 0.505],
    [-2.58, -14.15 + 0.505],
    [2.58, -14.15 + 0.505]
  ].forEach(([cx, cz]) => {
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), legContactMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(cx, 0.005, cz);
    scene.add(pad);
  });

  // Dual large monitors with stands, keyboards, mice, and glowing screens
  // Left: 3D Modeling Viewport (wireframe drone on dark grid)
  createWorkstationWithScreen(scene, -1.2, -14.15, create3DModelingScreenTexture());
  // Right: Graphic Design App (SRI drone poster with color/layer tools)
  createWorkstationWithScreen(scene, 1.2, -14.15, createGraphicDesignScreenTexture());

  // Miniature white astronaut figurine standing on the left side of the table
  createAstronautFigurine(scene, -2.15, 0.82, -14.05);

  // Modern sleek black linear LED pendant fixture suspended from ceiling above workstation
  const pendantY = 4.8;
  const pendantZ = -13.85;
  box(scene, 4.2, 0.07, 0.07, M(0x1a1a1e, { roughness: 0.4 }), 0.0, pendantY, pendantZ);
  box(scene, 4.15, 0.012, 0.05, M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1.6 }), 0.0, pendantY - 0.038, pendantZ);
  cyl(scene, 0.003, 0.003, 1.0, M(0x888888, { metalness: 0.8 }), -1.6, pendantY + 0.5, pendantZ, 6);
  cyl(scene, 0.003, 0.003, 1.0, M(0x888888, { metalness: 0.8 }), 1.6, pendantY + 0.5, pendantZ, 6);

  // Two ergonomic chairs with black mesh backs and vibrant orange seat cushions, tucked under desk
  createChair(scene, -1.2, -13.35, 0, { orangeSeat: true });
  createChair(scene, 1.2, -13.35, 0, { orangeSeat: true });

  // Floating black shelf with warm LED strip underneath, 3 stacked books ("Adobe Illustrator", "Adobe Photoshop", "Blender 3D"), RC car, white mug with SRI logo & waving mascot
  createDesignFloatingShelfWithProps(scene, 0.0, 2.45, -14.58, anim);

  // Right industrial rack: base 2-door cabinet with silver handles, 2 black pen-nib boxes, clear electronics box, and quadcopter drone ON top shelf
  createDesigningZoneRack(scene, 3.2, -14.25);

  // Window with dark frame next to the rack
  createWindow(scene, 4.8, 2.8, -14.73, 0, 1.8, 1.6);

  // Soft directional window daylight illuminating the workstation from the right
  const designWindowLight = new THREE.DirectionalLight(0xfff5e6, 0.85);
  designWindowLight.position.set(5.5, 5.2, -11.5);
  designWindowLight.target.position.set(0.0, 1.0, -14.15);
  scene.add(designWindowLight);
  scene.add(designWindowLight.target);

  // ━━━━━━━ CODING ZONE (x ≈ 11.0, reference-matched overhaul) ━━━━━━━
  // Workbench Table (5.4m wide, 1.25m deep, 0.82m tall, blonde wood top + black metal legs)
  createTable(scene, 5.4, 1.25, 10.9, -14.15, 0.82);

  // Soft grounding contact shadows under table legs
  const legContactMat = M(0x000000, { transparent: true, opacity: 0.16, roughness: 1 });
  [
    [10.9 - 2.58, -14.15 - 0.505],
    [10.9 + 2.58, -14.15 - 0.505],
    [10.9 - 2.58, -14.15 + 0.505],
    [10.9 + 2.58, -14.15 + 0.505]
  ].forEach(([cx, cz]) => {
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), legContactMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(cx, 0.005, cz);
    scene.add(pad);
  });

  // Dual large monitors with stands, keyboards, mice, and glowing dark VS Code IDE screens
  createCodingWorkstation(scene, 9.7, -14.15, 'robot_ai.py', 'python');
  createCodingWorkstation(scene, 12.1, -14.15, 'controller.cpp', 'cpp');

  // Two ergonomic chairs with black mesh backs and vibrant orange seat cushions, tucked under desk
  createChair(scene, 9.7, -13.35, 0, { orangeSeat: true });
  createChair(scene, 12.1, -13.35, 0, { orangeSeat: true });

  // Floating black shelf with warm LED strip underneath, 3 stacked books, RC car, white mug & waving robot mascot
  createFloatingShelfWithProps(scene, 10.9, 2.45, -14.58, anim);

  // Right industrial rack: base 2-door cabinet with silver handles, 2 black </> boxes, clear electronics box, and quadcopter drone ON top shelf
  createCodingZoneRack(scene, 14.1, -14.25);

  // Soft directional window daylight illuminating the workstation from the right
  const windowLight = new THREE.DirectionalLight(0xfff5e6, 0.85);
  windowLight.position.set(17.5, 5.2, -11.5);
  windowLight.target.position.set(10.9, 1.0, -14.15);
  scene.add(windowLight);
  scene.add(windowLight.target);

  // ━━━━━━━ ZONE WALL MURALS ━━━━━━━
  // 3D Printing Zone mural (left bay, reference-matched full painted wall)
  create3DPrintingMural(scene);
  // Coding Zone mural (right bay, reference-matched full painted wall)
  createCodingZoneMural(scene);
  // Main centre wall mural: Build•Learn•Innovate + robot mascot + tech icons
  createMainWallMural(scene);

  return anim;
}

/** Hexagon-shaped icon sign */
function createHexSign(text) {
  const tex = canvasTex(200, 200, (g, w, h) => {
    const cx = w / 2, cy = h / 2, r = w * 0.42;
    g.fillStyle = '#14284b';
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.closePath();
    g.fill();
    // Border
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 4;
    g.stroke();
    // Text
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `bold ${text.length > 4 ? 28 : 40}px 'Segoe UI', sans-serif`;
    g.fillText(text, cx, cy);
  });
  return new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
}
