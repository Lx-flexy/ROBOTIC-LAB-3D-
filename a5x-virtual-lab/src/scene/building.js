/**
 * scene/building.js — Hall shell: floor, walls, ceiling, beams, pillars, exterior
 */
import * as THREE from 'three';
import { box, cyl, put } from '../utils/geometry.js';
import { M, Bm, C, canvasTex, diagonalStripeTex } from '../utils/materials.js';
import { createSign, createWindow, createRack, createPlant } from './props/furniture.js';
import { createRobot, createFireExtinguisher } from './props/equipment.js';
import { BRAND_NAME, BRAND_SHORT, LAB_TITLE } from '../config.js';

import { createFrontWallDecor } from './props/frontwall.js';

export function buildShell(scene) {
  const animParts = { fans: [], lights: [] };

  // ──────── SKY + GROUND (exterior) ────────
  scene.background = new THREE.Color(C.sky);
  scene.fog = new THREE.Fog(C.sky, 50, 120);

  // Ground plane (grass)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    M(0x5a9e4b, { roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  scene.add(ground);

  // Driveway / walkway
  box(scene, 6, 0.02, 60, M(0x888888), 0, 0, 45);

  // ──────── BUILDING EXTERIOR ────────
  // Driveway / walkway
  box(scene, 6, 0.02, 60, M(0x888888), 0, 0, 45);

  // Diagonal navy/orange stripes on facade corners
  const cornerStripeTex = canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, w, h);
    // Navy diagonal
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(0, h * 0.7); g.fill();
    // Orange diagonal
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(0, h * 0.15); g.lineTo(w * 0.7, 0); g.lineTo(0, h * 0.5); g.fill();
  });
  // Left corner stripe
  const lStripe = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 6),
    new THREE.MeshBasicMaterial({ map: cornerStripeTex })
  );
  put(scene, lStripe, -18.5, 3, 15.28);
  // Right corner (mirrored)
  const rStripeTex = canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(w, 0); g.lineTo(0, 0); g.lineTo(w, h * 0.7); g.fill();
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(w, h * 0.15); g.lineTo(w * 0.3, 0); g.lineTo(w, h * 0.5); g.fill();
  });
  const rStripe = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 6),
    new THREE.MeshBasicMaterial({ map: rStripeTex })
  );
  put(scene, rStripe, 18.5, 3, 15.28);

  // Exterior lit sign
  const signText = `${BRAND_NAME}\n${LAB_TITLE.toUpperCase()}`;
  put(scene, createSign(signText, 7, 1.8, { bar: true }), 0, 5.2, 15.28);

  // ──────── HALL FLOOR ────────
  const floorMat = M(C.floor, { roughness: 0.15, metalness: 0.05 });
  box(scene, 40, 0.1, 30, floorMat, 0, 0, 0);

  // ──────── INTERIOR WALLS ────────
  const wallMat = M(C.cream, { roughness: 0.85 });
  // Back wall (z=-15)
  box(scene, 40, 6, 0.4, wallMat, 0, 3, -15);
  // Left wall (x=-20)
  box(scene, 0.4, 6, 30, wallMat, -20, 3, 0);
  // Right wall (x=20)
  box(scene, 0.4, 6, 30, wallMat, 20, 3, 0);
  // ──────── FRONT ENTRANCE WALL (with Door & Window Openings at z=15) ────────
  // Thickness = 0.5m (from z=14.75 to 15.25)
  // 1. Above openings (y = 4.4 to 6.0, h = 1.6)
  box(scene, 17, 1.6, 0.5, wallMat, 11.5, 5.2, 15);   // Above right windows
  box(scene, 17, 1.6, 0.5, wallMat, -11.5, 5.2, 15);  // Above left windows
  box(scene, 6, 1.4, 0.5, M(C.navy), 0, 5.3, 15);     // Header beam above entrance doors

  // 2. Below windows (y = 0 to 2.6, h = 2.6)
  box(scene, 17, 2.6, 0.5, wallMat, 11.5, 1.3, 15);   // Under right windows
  box(scene, 17, 2.6, 0.5, wallMat, -11.5, 1.3, 15);  // Under left windows

  // 3. Piers between window openings (y = 2.6 to 4.4, h = 1.8)
  // Right side (x = 3 to 20): Window is at x=9 (x: 7.8 to 10.2)
  box(scene, 4.8, 1.8, 0.5, wallMat, 5.4, 3.5, 15);   // Between door and right window
  box(scene, 9.8, 1.8, 0.5, wallMat, 15.1, 3.5, 15);  // Right of right window

  // Left side (x = -20 to -3): Windows are at x=-9 (x: -10.2 to -7.8) and x=-16 (x: -17.2 to -14.8)
  box(scene, 4.8, 1.8, 0.5, wallMat, -5.4, 3.5, 15);  // Between door and window 1
  box(scene, 4.6, 1.8, 0.5, wallMat, -12.5, 3.5, 15); // Between window 1 and window 2
  box(scene, 2.8, 1.8, 0.5, wallMat, -18.6, 3.5, 15); // Left of window 2

  // Skirting boards (navy at floor level on back wall)
  box(scene, 40, 0.12, 0.08, M(C.navy), 0, 0.06, -14.78);
  box(scene, 0.08, 0.12, 30, M(C.navy), -19.78, 0.06, 0);
  box(scene, 0.08, 0.12, 30, M(C.navy), 19.78, 0.06, 0);

  // Orange ceiling cornice / crown molding (placed neatly at ceiling junction y=5.88)
  box(scene, 40, 0.12, 0.15, M(C.orange), 0, 5.88, -14.88);
  box(scene, 40, 0.12, 0.15, M(C.orange), 0, 5.88, 14.88);
  box(scene, 0.15, 0.12, 30, M(C.orange), -19.88, 5.88, 0);
  box(scene, 0.15, 0.12, 30, M(C.orange), 19.88, 5.88, 0);

  // ──────── CEILING ────────
  box(scene, 40, 0.2, 30, M(C.cream), 0, 6, 0);

  // ──────── PILLARS + ARCH BEAM ────────
  // Two white pillars
  const pillarMat = M(C.white, { roughness: 0.5 });
  box(scene, 0.6, 6, 0.6, pillarMat, -4, 3, -9.5);
  box(scene, 0.6, 6, 0.6, pillarMat, 4, 3, -9.5);
  // Arch header beam connecting pillars with diagonal stripe texture
  const beamTex = diagonalStripeTex();
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex });
  const beam = box(scene, 14, 0.5, 0.5, beamMat, 0, 5.7, -9.5);
  // Brand sign on beam (facing front = toward entrance)
  const beamSign = createSign(
    `${BRAND_NAME}  |  ${LAB_TITLE.toUpperCase()}`,
    9, 0.9, {}
  );
  put(scene, beamSign, 0, 5.7, -9.2);
  // Brand sign (facing back wall too)
  const beamSignBack = createSign(
    `${BRAND_NAME}  |  ${LAB_TITLE.toUpperCase()}`,
    9, 0.9, {}
  );
  put(scene, beamSignBack, 0, 5.7, -9.8, Math.PI);

  // ──────── GATE SIGNS ────────
  // Exterior gate sign (facing outside)
  put(scene, createSign(
    `${BRAND_NAME}\n${LAB_TITLE.toUpperCase()}`,
    6, 1.5, { bar: false }
  ), 0, 5.25, 15.25);
  // Interior gate sign (facing inside)
  put(scene, createSign(
    `${BRAND_NAME}  |  ${LAB_TITLE.toUpperCase()}`,
    9, 1, {}
  ), 0, 5.2, 14.75, Math.PI);

  // ──────── DOORS (crystal clear architectural glass with navy frame) ────────
  const doors = [];
  const doorFrameMat = M(0x131f33, { metalness: 0.6, roughness: 0.35 });
  const doorGlassMat = new THREE.MeshStandardMaterial({
    color: 0xd8eeff,
    transparent: true,
    opacity: 0.20,
    roughness: 0.05,
    metalness: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const handleBarMat = M(0xe0e6ed, { metalness: 0.85, roughness: 0.2 });
  const handleAccentMat = M(C.orange, { metalness: 0.5, roughness: 0.3 });

  [-1, 1].forEach(s => {
    const pivot = new THREE.Group();
    pivot.position.set(s * 3, 0, 15);
    scene.add(pivot);

    const dW = 2.94; // Width of one door leaf
    const dH = 4.50; // Height of one door leaf
    const dT = 0.08; // Frame depth
    const stW = 0.14; // Stiles width
    const railMidY = 2.05;

    // A. Outer Frame Stiles (Vertical)
    // 1. Hinge stile (at pivot side)
    box(pivot, stW, dH, dT, doorFrameMat, -s * (stW / 2), dH / 2, 0);
    // 2. Meeting stile (at center meeting edge)
    box(pivot, stW, dH, dT, doorFrameMat, -s * (dW - stW / 2), dH / 2, 0);

    // B. Horizontal Rails
    const glassW = dW - 2 * stW; // 2.66m
    // 1. Bottom kickplate (sturdy commercial door kickplate)
    const kickH = 0.32;
    box(pivot, dW, kickH, dT, doorFrameMat, -s * (dW / 2), kickH / 2, 0);
    // 2. Top header rail
    const topH = 0.16;
    box(pivot, dW, topH, dT, doorFrameMat, -s * (dW / 2), dH - topH / 2, 0);
    // 3. Waist / push rail
    const waistH = 0.08;
    box(pivot, glassW, waistH, dT, doorFrameMat, -s * (dW / 2), railMidY, 0);

    // C. Crystal Clear Transparent Glass Panes
    // Upper glass pane
    const upperH = (dH - topH) - (railMidY + waistH / 2);
    const upperPane = new THREE.Mesh(new THREE.PlaneGeometry(glassW, upperH), doorGlassMat);
    upperPane.position.set(-s * (dW / 2), railMidY + waistH / 2 + upperH / 2, 0);
    pivot.add(upperPane);

    // Lower glass pane
    const lowerH = (railMidY - waistH / 2) - kickH;
    const lowerPane = new THREE.Mesh(new THREE.PlaneGeometry(glassW, lowerH), doorGlassMat);
    lowerPane.position.set(-s * (dW / 2), kickH + lowerH / 2, 0);
    pivot.add(lowerPane);

    // D. Architectural Tubular Door Pull Handles (Inside & Outside)
    const handleX = -s * (dW - 0.24);
    [-1, 1].forEach(side => { // side -1 = outside (z = -0.07), side +1 = inside (z = +0.07)
      const hZ = side * 0.07;
      // Standoff mount blocks
      box(pivot, 0.035, 0.035, 0.06, handleAccentMat, handleX, railMidY + 0.35, hZ / 2);
      box(pivot, 0.035, 0.035, 0.06, handleAccentMat, handleX, railMidY - 0.35, hZ / 2);
      // Vertical stainless steel pull bar
      cyl(pivot, 0.022, 0.022, 0.85, handleBarMat, handleX, railMidY, hZ, 12);
      // Orange decorative accent rings on handle
      cyl(pivot, 0.025, 0.025, 0.04, handleAccentMat, handleX, railMidY + 0.35, hZ, 12);
      cyl(pivot, 0.025, 0.025, 0.04, handleAccentMat, handleX, railMidY - 0.35, hZ, 12);
    });

    doors.push({ pivot, s });
  });

  // ──────── FLOOR GUIDE LINES (Removed - static decorative floor stripes) ────────

  // ──────── CEILING LIGHTS (tube lights) ────────
  for (let x = -15; x <= 15; x += 7.5) {
    for (let z = -10; z <= 10; z += 10) {
      // Tube housing
      box(scene, 2.8, 0.05, 0.35, Bm(0xffffff), x, 5.88, z);
      box(scene, 2.6, 0.02, 0.08, Bm(0xffffe8), x, 5.84, z);
    }
  }

  // Point lights (fewer for performance)
  const lightPositions = [
    [-10, 5.4, -8], [10, 5.4, -8],
    [-10, 5.4, 5], [10, 5.4, 5],
    [0, 5.4, 0], [0, 5.4, -12],
  ];
  lightPositions.forEach(([x, y, z]) => {
    const light = new THREE.PointLight(0xfff5e0, 18, 20, 1.5);
    light.position.set(x, y, z);
    scene.add(light);
    animParts.lights.push(light);
  });

  // ──────── CEILING FANS ────────
  const fanPositions = [
    [-8, -4], [8, -4], [-8, 8], [8, 8], [0, 2],
  ];
  fanPositions.forEach(([x, z]) => {
    // 1. Stationary base assembly (fixed to ceiling at y=5.95)
    const baseGroup = new THREE.Group();
    baseGroup.position.set(x, 0, z);
    scene.add(baseGroup);

    // Ceiling mount canopy (tapered cup at ceiling)
    cyl(baseGroup, 0.09, 0.13, 0.08, M(0xf0f0f0, { roughness: 0.4 }), 0, 5.92, 0, 16);

    // Downrod (vertical steel drop rod from ceiling down to motor)
    cyl(baseGroup, 0.02, 0.02, 0.45, M(0xf0f0f0, { roughness: 0.4 }), 0, 5.66, 0, 12);

    // Stationary motor top cover / cowl
    cyl(baseGroup, 0.12, 0.16, 0.06, M(0xe8e8e8, { roughness: 0.3 }), 0, 5.42, 0, 16);

    // 2. Rotating Rotor assembly (spins around Y axis at y = 5.37)
    const rotor = new THREE.Group();
    rotor.position.set(x, 5.37, z);
    scene.add(rotor);

    // Central motor body (sleek white cylinder with chrome decorative ring)
    cyl(rotor, 0.20, 0.20, 0.08, M(0xffffff, { roughness: 0.2 }), 0, 0, 0, 24);
    cyl(rotor, 0.205, 0.205, 0.015, M(0xcccccc, { metalness: 0.7, roughness: 0.2 }), 0, 0, 0, 24);
    // Bottom dome / decorative cap
    cyl(rotor, 0.16, 0.08, 0.04, M(0xeeeeee, { roughness: 0.3 }), 0, -0.05, 0, 20);

    // 3 Aerodynamic Blades spaced evenly at exactly 120 degrees
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const bladeArm = new THREE.Group();
      bladeArm.rotation.y = angle;
      rotor.add(bladeArm);

      // Metal blade bracket / iron extending from motor
      box(bladeArm, 0.12, 0.015, 0.045, M(0xaaaaaa, { metalness: 0.6 }), 0.14, 0.01, 0);

      // Blade: extends outward from r = 0.19 to r = 1.15 (length = 0.96m, width = 0.15m)
      const blade = box(bladeArm, 0.96, 0.01, 0.15, M(0xfafafa, { roughness: 0.3 }), 0.67, 0.01, 0);
      // Aerodynamic blade pitch (slight angle of attack)
      blade.rotation.x = 0.08;
    }

    // Only the rotor + blades rotate smoothly around the vertical axis
    animParts.fans.push(rotor);
  });

  // ──────── FRONT WALL: transparent windows, racks, storage, mascot ────────
  createRack(scene, 14, 14.3, Math.PI, 2.6);
  createRack(scene, 17.5, 14.3, Math.PI, 2.6);
  // Transparent windows situated directly inside the front wall openings at z = 15.0
  createWindow(scene, 9, 3.5, 15.0, 0, 2.4, 1.8);
  createWindow(scene, -9, 3.5, 15.0, 0, 2.4, 1.8);
  createWindow(scene, -16, 3.5, 15.0, 0, 2.4, 1.8);
  createPlant(scene, -3.5, 0, 14, 1.8);
  createPlant(scene, 3.5, 0, 14, 1.8);

  // Mascot robot near entrance (inside)
  const mascot = createRobot(scene, 4.5, 0, 12, 0.9);

  // Exterior storage rack beside door
  createRack(scene, -5, 16, 0, 2);
  // Exterior plants
  createPlant(scene, -14, 0, 16, 1.5);
  createPlant(scene, 7, 0, 16, 1.5);

  // ──────── OUTDOOR TREES & SCENERY (visible through windows & doors) ────────
  function createOutdoorTree(px, pz, h = 6.5, r = 2.2) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(px, 0, pz);
    // Tree trunk
    cyl(treeGroup, 0.22, 0.32, h * 0.45, M(0x5c4033, { roughness: 0.9 }), 0, (h * 0.45) / 2, 0, 10);
    // 3 layered leafy foliage canopies
    const leafCols = [0x2e7d32, 0x388e3c, 0x43a047];
    for (let i = 0; i < 3; i++) {
      const cy = h * 0.4 + i * (h * 0.22);
      const rad = r * (1 - i * 0.22);
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(rad, 10, 8),
        M(leafCols[i], { roughness: 0.75 })
      );
      canopy.scale.set(1, 0.85, 1);
      canopy.position.set(0, cy, 0);
      treeGroup.add(canopy);
    }
    scene.add(treeGroup);
  }

  // Row of trees along the campus garden
  const outdoorTreePos = [
    [-18, 22, 7, 2.4],
    [-12, 26, 6, 2.0],
    [-7, 21, 5.5, 1.8],
    [7, 21, 5.5, 1.8],
    [13, 25, 6.2, 2.1],
    [18, 22, 7, 2.4],
    [-24, 30, 8, 2.6],
    [24, 30, 8, 2.6],
  ];
  outdoorTreePos.forEach(([tx, tz, th, tr]) => createOutdoorTree(tx, tz, th, tr));

  // Low hedge landscaping along the front building wall (z = 16.2)
  [-16, -9, 9, 15].forEach(hx => {
    box(scene, 3.2, 0.65, 0.6, M(0x2d682a, { roughness: 0.8 }), hx, 0.32, 16.2);
    // Decorative colored flower accents on the hedge
    for (let fx = -1.2; fx <= 1.2; fx += 0.6) {
      box(scene, 0.12, 0.12, 0.12, M(fx > 0 ? 0xff4081 : 0xffeb3b), hx + fx, 0.68, 16.2 + (fx % 0.4));
    }
  });

  // Outdoor campus pathway bollard lights
  [-3.8, 3.8].forEach(lx => {
    cyl(scene, 0.08, 0.08, 1.2, M(0x222225, { metalness: 0.7 }), lx, 0.6, 17.5, 12);
    cyl(scene, 0.07, 0.07, 0.18, Bm(0xfff4d6), lx, 1.05, 17.5, 12);
    cyl(scene, 0.10, 0.10, 0.04, M(0x111111), lx, 1.18, 17.5, 12);
  });

  // ── FRONT WALL DECOR: banners + mascot + panels ──
  createFrontWallDecor(scene);

  return { doors, animParts, mascot };
}
