/**
 * zones/arvr.js — Photo-Accurate, Spacious AR / VR Innovation Lab
 *
 * Recreates the complete facility matching the reference images:
 *  - 14.0m wide (X = 19.80 to 33.80m) x 14.0m deep (Z = 2.40 to 16.40m), 3.60m ceiling.
 *  - Single entrance via the interactive hinged door on the West wall (X = 19.78, Z = 4.80).
 *  - North / Main Display Wall: 3.2m Smart TV, floating shelves with LED strips & VR headsets,
 *    navy credenza with wood top, vector mural with SRI logo, cube, and VR line-art.
 *  - Left / East Wall: Large architectural windows with grey roller blinds & daylight backdrop.
 *  - Right / West Wall: VR Equipment zone with 3 perforated pegboards, headsets, controllers,
 *    lower counter with 7 orange bins, and illuminated glass showcase rack.
 *  - South / Back Wall: Immersive lounge with green turf rug, 4 bean bags (2 navy, 2 orange),
 *    coffee table, bookcases, tall plants, and line-art VR headset wall graphic.
 *  - Center / Teaching Zone: 2 blocks of student tables with central 1.8m aisle,
 *    24 ergonomic chairs with NAVY cushion seats.
 */

import * as THREE from 'three';
import { box, cyl } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';
import { getBakedFloorTexture } from '../props/floor.js';

export const ARVR_CONFIG = {
  id: 'arvr',
  name: 'AR / VR Lab',
  icon: '🥽',
  xMin: 19.80,
  xMax: 33.80,
  zMin: 2.40,
  zMax: 16.40,
  floorY: 0.05,
  ceilingY: 3.65,
  centerX: 26.80,
  centerZ: 9.40,
};

export function buildArVrLab(scene) {
  const g = new THREE.Group();
  const anim = { fans: [] };

  const { xMin, xMax, zMin, zMax, floorY, ceilingY, centerX, centerZ } = ARVR_CONFIG;
  const roomW = xMax - xMin; // 14.00m (along X)
  const roomL = zMax - zMin; // 14.00m (along Z)
  const roomH = ceilingY - floorY; // 3.60m
  const wallThick = 0.25;

  const wallMat = M(C.cream, { roughness: 0.88 });
  const navyMat = M(C.navy, { roughness: 0.55 });
  const orangeMat = M(C.orange, { roughness: 0.5 });
  const woodMat = M(0xd4a373, { roughness: 0.55 });
  const blackMetalMat = M(0x1a1a1e, { roughness: 0.45, metalness: 0.65 });
  const chromeMat = M(0xd1d5db, { roughness: 0.2, metalness: 0.9 });
  const ledWarmMat = Bm(0xfff6e5);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. MARBLE FLOOR SLAB (Matching main lab photo-accurate gray marble)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    const floorTex = getBakedFloorTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.0,
      envMapIntensity: 0.0,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.1, roomL), floorMat);
    slab.position.set(centerX, floorY - 0.05, centerZ);
    g.add(slab);
  } catch (err) {
    console.error('[AR/VR Lab] Floor slab build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. INDUSTRIAL DARK CEILING & LIGHTING
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    // Dark industrial grid ceiling slab
    const ceilingMat = M(0x1b1b1f, { roughness: 0.9 });
    box(g, roomW + wallThick * 2, 0.1, roomL + wallThick * 2, ceilingMat, centerX, ceilingY + 0.05, centerZ);

    // Suspended Linear LED Light Fixtures (4 longitudinal runs)
    const lightRunX = [xMin + 2.8, centerX - 1.6, centerX + 1.6, xMax - 2.8];
    lightRunX.forEach((lx) => {
      // Two fixtures per run along Z
      [zMin + 4.2, zMax - 4.2].forEach((lz) => {
        // Black aluminum housing
        box(g, 0.18, 0.08, 4.2, blackMetalMat, lx, ceilingY - 0.15, lz);
        // Soft glowing emissive diffuser
        box(g, 0.14, 0.02, 4.1, ledWarmMat, lx, ceilingY - 0.19, lz);
        // Thin drop suspension wires
        cyl(g, 0.003, 0.003, 0.12, chromeMat, lx, ceilingY - 0.06, lz - 1.8, 6);
        cyl(g, 0.003, 0.003, 0.12, chromeMat, lx, ceilingY - 0.06, lz + 1.8, 6);
      });
    });

    // Suspended Central AC Cassette Unit
    box(g, 1.30, 0.22, 1.30, M(0xf0f0f2, { roughness: 0.3 }), centerX, ceilingY - 0.11, centerZ);
    box(g, 1.15, 0.02, 1.15, M(0x222226), centerX, ceilingY - 0.21, centerZ);

    // Two Ceiling Fans
    [centerZ - 2.8, centerZ + 2.8].forEach((fz) => {
      const fanBase = new THREE.Group();
      fanBase.position.set(centerX, 0, fz);
      cyl(fanBase, 0.08, 0.11, 0.06, M(0x25252a), 0, ceilingY - 0.03, 0, 16);
      cyl(fanBase, 0.018, 0.018, 0.38, M(0x25252a), 0, ceilingY - 0.22, 0, 10);
      g.add(fanBase);

      const rotor = new THREE.Group();
      rotor.position.set(centerX, ceilingY - 0.42, fz);
      cyl(rotor, 0.18, 0.18, 0.07, M(0x2a2a30), 0, 0, 0, 20);
      for (let i = 0; i < 3; i++) {
        const arm = new THREE.Group();
        arm.rotation.y = (i * Math.PI * 2) / 3;
        box(arm, 0.85, 0.01, 0.14, M(0x18181c, { roughness: 0.4 }), 0.55, 0, 0);
        rotor.add(arm);
      }
      g.add(rotor);
      anim.fans.push(rotor);
    });

    // Two Balanced Interior Ambient Point Lights (warm natural fill matching main hall)
    const roomLight1 = new THREE.PointLight(0xfff5e4, 2.6, 16.0, 1.8);
    roomLight1.position.set(centerX - 2.8, ceilingY - 0.6, centerZ - 2.2);
    g.add(roomLight1);

    const roomLight2 = new THREE.PointLight(0xfff5e4, 2.6, 16.0, 1.8);
    roomLight2.position.set(centerX + 2.8, ceilingY - 0.6, centerZ + 2.2);
    g.add(roomLight2);
  } catch (err) {
    console.error('[AR/VR Lab] Ceiling/Lighting build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ARCHITECTURAL WALLS & SKIRTING
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    // North Wall (Z = zMin, Main Display Wall)
    box(g, roomW, roomH, wallThick, wallMat, centerX, floorY + roomH / 2, zMin - wallThick / 2);
    // South Wall (Z = zMax, Immersive Lounge Wall)
    box(g, roomW, roomH, wallThick, wallMat, centerX, floorY + roomH / 2, zMax + wallThick / 2);
    // East Wall (X = xMax, Large Window Wall)
    box(g, wallThick, roomH, roomL, wallMat, xMax + wallThick / 2, floorY + roomH / 2, centerZ);

    // West Wall (X = 20.20 inner surface, adjoining main robotics lab)
    // The main building shell in building.js provides the wall from z = -15 to 15.00 at X in [19.80, 20.20].
    // Here we extend the south section flush from z = 15.00 to zMax = 16.40:
    box(g, 0.40, roomH, zMax - 15.00, wallMat, 20.00, floorY + roomH / 2, (15.00 + zMax) / 2);

    // Skirting boards (Navy base with orange stripe)
    const skH = 0.12;
    // North skirting
    box(g, roomW, skH, 0.03, navyMat, centerX, floorY + skH / 2, zMin + 0.015);
    box(g, roomW, 0.015, 0.032, orangeMat, centerX, floorY + skH, zMin + 0.015);
    // South skirting
    box(g, roomW, skH, 0.03, navyMat, centerX, floorY + skH / 2, zMax - 0.015);
    box(g, roomW, 0.015, 0.032, orangeMat, centerX, floorY + skH, zMax - 0.015);
    // East skirting
    box(g, 0.03, skH, roomL, navyMat, xMax - 0.015, floorY + skH / 2, centerZ);
    box(g, 0.032, 0.015, roomL, orangeMat, xMax - 0.015, floorY + skH, centerZ);
    // West skirting (flush with inner wall surface at X = 20.20, split cleanly around door frame)
    const wNorthSkLen = Math.max(0.1, 4.08 - zMin);
    box(g, 0.03, skH, wNorthSkLen, navyMat, 20.20 + 0.015, floorY + skH / 2, zMin + wNorthSkLen / 2);
    box(g, 0.032, 0.015, wNorthSkLen, orangeMat, 20.20 + 0.015, floorY + skH, zMin + wNorthSkLen / 2);

    const wSouthSkStart = 5.52;
    const wSouthSkLen = Math.max(0.1, zMax - wSouthSkStart);
    box(g, 0.03, skH, wSouthSkLen, navyMat, 20.20 + 0.015, floorY + skH / 2, wSouthSkStart + wSouthSkLen / 2);
    box(g, 0.032, 0.015, wSouthSkLen, orangeMat, 20.20 + 0.015, floorY + skH, wSouthSkStart + wSouthSkLen / 2);
  } catch (err) {
    console.error('[AR/VR Lab] Architectural walls build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. NORTH WALL: COMPLETE MAIN DISPLAY WALL & HIGH-RES MURAL
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    buildMainDisplayWall(g, centerX, zMin, floorY, roomW, roomH);
  } catch (err) {
    console.error('[AR/VR Lab] Main Display Wall build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. EAST WALL: LARGE WINDOWS WITH ROLLER BLINDS & DAYLIGHT
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    buildEastWindowWall(g, xMax, centerZ, floorY, roomL, roomH);
  } catch (err) {
    console.error('[AR/VR Lab] East Window Wall build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. WEST WALL: VR EQUIPMENT ZONE (PEGBOARD, BINS, GLASS RACK)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    buildVrEquipmentZone(g, 20.20, floorY, zMin, zMax);
  } catch (err) {
    console.error('[AR/VR Lab] VR Equipment Zone build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. SOUTH WALL: IMMERSIVE LOUNGE (TURF, BEAN BAGS, BOOKCASES, VR GRAPHIC)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    buildImmersiveLounge(g, centerX, zMax, floorY, roomW);
  } catch (err) {
    console.error('[AR/VR Lab] Immersive Lounge build failed:', err);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. CENTER: TEACHING ZONE (TABLES, 24 NAVY SEAT CHAIRS, 1.8M AISLE)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    buildTeachingZone(g, centerX, floorY);
  } catch (err) {
    console.error('[AR/VR Lab] Teaching Zone build failed:', err);
  }

  scene.add(g);
  return anim;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DISPLAY WALL (North Wall, Z = zMin)
// ─────────────────────────────────────────────────────────────────────────────

/** Black-Framed Glass Window with Soft Blurred Warm Interior Backdrop */
function createSoftInteriorWindow(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const w = 1.02;
  const h = 1.85;
  const frameD = 0.035;
  const railT = 0.032;
  const frameMat = M(0x151518, { roughness: 0.35, metalness: 0.7 });

  // 1. Soft Warm Blurred Office Interior Backing
  const winTex = canvasTex(256, 256, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#f8f4ec');
    grad.addColorStop(0.3, '#f0e8d8');
    grad.addColorStop(0.7, '#e4d6be');
    grad.addColorStop(1, '#c8bca8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const ceilGlow = ctx.createRadialGradient(128, 40, 5, 128, 40, 90);
    ceilGlow.addColorStop(0, 'rgba(255, 250, 230, 0.85)');
    ceilGlow.addColorStop(1, 'rgba(240, 230, 210, 0)');
    ctx.fillStyle = ceilGlow;
    ctx.beginPath();
    ctx.arc(128, 40, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(70, 60, 50, 0.18)';
    ctx.fillRect(0, 160, 256, 96);
    ctx.fillStyle = 'rgba(40, 45, 55, 0.22)';
    ctx.fillRect(30, 140, 70, 70);
    ctx.fillRect(150, 145, 75, 65);
  });

  const backMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w - railT * 2, h - railT * 2),
    new THREE.MeshBasicMaterial({ map: winTex })
  );
  backMesh.position.set(0, 0, 0.005);
  g.add(backMesh);

  // 2. Translucent Reflective Glass Pane
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x90b8d8,
    transparent: true,
    opacity: 0.28,
    roughness: 0.12,
    metalness: 0.2,
    depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w - railT, h - railT),
    glassMat
  );
  glassMesh.position.set(0, 0, frameD * 0.5);
  g.add(glassMesh);

  // 3. Black Metal Outer Frame Rails
  box(g, w, railT, frameD, frameMat, 0, h / 2 - railT / 2, frameD / 2);
  box(g, w, railT, frameD, frameMat, 0, -h / 2 + railT / 2, frameD / 2);
  box(g, railT, h, frameD, frameMat, -w / 2 + railT / 2, 0, frameD / 2);
  box(g, railT, h, frameD, frameMat, w / 2 - railT / 2, 0, frameD / 2);

  // 4. Black Interior Mullions (1 vertical, 2 horizontal)
  box(g, 0.018, h - railT * 2, frameD * 0.75, frameMat, 0, 0, frameD * 0.5);
  [-h * 0.18, h * 0.18].forEach((my) => {
    box(g, w - railT * 2, 0.018, frameD * 0.75, frameMat, 0, my, frameD * 0.5);
  });

  parent.add(g);
  return g;
}

/** Small Tripod Tracking Sensor Camera */
function createTripodCamera(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const mat = M(0x18181c, { roughness: 0.35, metalness: 0.7 });
  box(g, 0.08, 0.05, 0.06, mat, 0, 0.16, 0);
  cyl(g, 0.016, 0.016, 0.02, M(0x0e7490, { roughness: 0.1 }), 0, 0.16, 0.035, 12);
  cyl(g, 0.012, 0.012, 0.03, mat, 0, 0.13, 0, 8);
  for (let i = 0; i < 3; i++) {
    const ang = (i * Math.PI * 2) / 3;
    const leg = new THREE.Group();
    leg.position.set(0, 0.12, 0);
    leg.rotation.y = ang;
    leg.rotation.z = 0.32;
    cyl(leg, 0.005, 0.005, 0.13, mat, 0, -0.065, 0, 6);
    g.add(leg);
  }
  parent.add(g);
  return g;
}

/** Modern Spherical Glowing Globe Lamp */
function createGlowingGlobeLamp(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  cyl(g, 0.06, 0.06, 0.015, M(0xd97706, { metalness: 0.8, roughness: 0.3 }), 0, 0.0075, 0, 16);
  const globeGeom = new THREE.SphereGeometry(0.085, 20, 16);
  const globeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const globeMesh = new THREE.Mesh(globeGeom, globeMat);
  globeMesh.position.set(0, 0.095, 0);
  g.add(globeMesh);

  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.20, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.20, 0.20), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.002, 0);
  g.add(shadow);

  parent.add(g);
  return g;
}

/** Black Tech Decor Box / Terrarium */
function createDecorBox(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  box(g, 0.16, 0.14, 0.14, M(0x18181c, { roughness: 0.35, metalness: 0.6 }), 0, 0.07, 0);
  box(g, 0.12, 0.10, 0.01, M(0x0e7490, { roughness: 0.2 }), 0, 0.07, 0.071);
  parent.add(g);
  return g;
}

function buildMainDisplayWall(parent, cx, zMin, floorY, roomW, roomH) {
  const g = new THREE.Group();
  g.position.set(cx, floorY, zMin);

  // 1. High-Resolution Painted Wall Texture (Aspect Ratio Matched 14.00m x 3.60m)
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const W = isMobile ? 2048 : 4096;
  const H = isMobile ? 1024 : 2048;
  const scale = W / 4096;

  const muralBlocks = [];

  const muralTex = canvasTex(W, H, (ctx) => {
    // Warm peach/cream base wall paint
    ctx.fillStyle = '#fff1e3';
    ctx.fillRect(0, 0, W, H);

    // Subtle realistic paint grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < 30000; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }

    // ── LEFT ANGLED NAVY PANEL WITH 4 STACKED ICONS ──
    const panelW = Math.round(W * (2.25 / 14.00));
    ctx.save();
    ctx.shadowColor = 'rgba(20, 40, 75, 0.35)';
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetX = 8 * scale;
    ctx.fillStyle = '#14284b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(panelW - 12 * scale, 0);
    ctx.lineTo(panelW + 36 * scale, H * 0.46);
    ctx.lineTo(panelW - 24 * scale, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Orange diagonal accent stripe
    ctx.strokeStyle = '#ff7a00';
    ctx.lineWidth = Math.max(6, Math.round(14 * scale));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(panelW - 12 * scale, 0);
    ctx.lineTo(panelW + 36 * scale, H * 0.46);
    ctx.lineTo(panelW - 24 * scale, H);
    ctx.stroke();

    // Strictly reset canvas shadow state before drawing panel contents
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // 4 Stacked Items on Navy Panel (Equal vertical spacing, text drawn ONCE, 0 overlap)
    const panelItems = [
      { id: 'Panel-VR', icon: 'headset', label: ['Virtual', 'Reality'], y: 220 },
      { id: 'Panel-AR', icon: 'ar', label: ['Augmented', 'Reality'], y: 660 },
      { id: 'Panel-360', icon: 'circle360', label: ['360° Immersive', 'Learning'], y: 1100 },
      { id: 'Panel-3D', icon: 'cube3d', label: ['3D', 'Visualization'], y: 1540 },
    ];
    const iconCx = Math.round(panelW * 0.46);
    const itemFontSize = Math.round(36 * scale);
    ctx.font = `bold ${itemFontSize}px 'Segoe UI', system-ui, sans-serif`;

    panelItems.forEach((item) => {
      const iy = Math.round(item.y * scale);
      const iconH = Math.round(60 * scale);
      drawPanelVectorIcon(ctx, iconCx, iy + iconH / 2, item.icon, scale);

      const labelTop = iy + iconH + Math.round(16 * scale);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${itemFontSize}px 'Segoe UI', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      let maxTextW = 0;
      item.label.forEach((line, li) => {
        const lineY = labelTop + li * Math.round(44 * scale);
        ctx.fillText(line, iconCx, lineY);
        const tw = ctx.measureText(line).width;
        if (tw > maxTextW) maxTextW = tw;
      });

      const blockW = Math.max(iconH, maxTextW);
      const blockH = iconH + Math.round(16 * scale) + item.label.length * Math.round(44 * scale);
      muralBlocks.push({
        id: item.id,
        x1: iconCx - blockW / 2,
        y1: iy,
        x2: iconCx + blockW / 2,
        y2: iy + blockH,
      });
    });

    // ── TOP-CENTER TITLE HEADER (Row 1: Title & Logos, Row 2: Tagline) ──
    const midX = Math.round(W * 0.535);
    const topY = Math.round(185 * scale); // Title baseline Y
    const logoR = Math.round(38 * scale);

    // (A) Left: Orange sketch-style isometric cube with dashed circle
    const leftCubeX = Math.round(midX - 980 * scale);
    const cubeRad = Math.round(70 * scale);
    drawSketchCubeWithCircle(ctx, leftCubeX, topY, cubeRad, Math.round(36 * scale));
    muralBlocks.push({
      id: 'SketchCube-Left',
      x1: leftCubeX - cubeRad,
      y1: topY - cubeRad,
      x2: leftCubeX + cubeRad,
      y2: topY + cubeRad,
    });

    // (B) Center: SRI Logo + Tree Emblem
    const logoX = Math.round(midX - 390 * scale);
    drawSriLotusEmblem(ctx, logoX, topY, logoR);
    muralBlocks.push({
      id: 'SRI-Logo',
      x1: logoX - Math.round(55 * scale),
      y1: topY - Math.round(52 * scale),
      x2: logoX + Math.round(55 * scale),
      y2: topY + Math.round(58 * scale),
    });

    // Thin vertical divider line
    const divX = Math.round(midX - 90 * scale);
    const divW = Math.max(3, Math.round(4 * scale));
    const divH = Math.round(70 * scale);
    ctx.fillStyle = '#ff7a00';
    ctx.fillRect(divX, topY - divH / 2, divW, divH);
    muralBlocks.push({
      id: 'Title-Divider',
      x1: divX,
      y1: topY - divH / 2,
      x2: divX + divW,
      y2: topY + divH / 2,
    });

    // "AR / VR LAB" Title (AR / VR in navy italic bold, LAB in orange)
    const titleFontSz = Math.round(112 * scale);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `italic 900 ${titleFontSz}px 'Segoe UI', system-ui, sans-serif`;
    ctx.fillStyle = '#14284b';
    const titleStartX = Math.round(midX - 35 * scale);
    ctx.fillText('AR / VR ', titleStartX, topY - Math.round(6 * scale));
    const arw = ctx.measureText('AR / VR ').width;
    ctx.fillStyle = '#ff7a00';
    ctx.fillText('LAB', titleStartX + arw, topY - Math.round(6 * scale));
    const labw = ctx.measureText('LAB').width;
    muralBlocks.push({
      id: 'Title-Text',
      x1: titleStartX,
      y1: topY - titleFontSz / 2,
      x2: titleStartX + arw + labw,
      y2: topY + titleFontSz / 2,
    });

    // Sub-motto: "— EXPLORE • CREATE • EXPERIENCE • BUILD —" (Row 2)
    // Placed at Y = 430 * scale: >= 0.32m below lowest point of SRI logo, and >= 0.31m above TV top!
    const taglineY = Math.round(430 * scale);
    const taglineFontSz = Math.round(42 * scale);
    const taglineText = '—   EXPLORE   •   CREATE   •   EXPERIENCE   •   BUILD   —';
    ctx.font = `900 ${taglineFontSz}px 'Segoe UI', system-ui, sans-serif`;
    const tagW = ctx.measureText(taglineText).width;
    const tagX = Math.round(midX + 130 * scale);
    ctx.fillStyle = '#14284b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(taglineText, tagX, taglineY);
    muralBlocks.push({
      id: 'Tagline',
      x1: tagX - tagW / 2,
      y1: taglineY - taglineFontSz / 2,
      x2: tagX + tagW / 2,
      y2: taglineY + taglineFontSz / 2,
    });

    // (C) Right: Orange sketch cube
    const rightCubeX = Math.round(midX + 820 * scale);
    drawSketchCubeWithCircle(ctx, rightCubeX, topY, cubeRad, Math.round(36 * scale));
    muralBlocks.push({
      id: 'SketchCube-Right',
      x1: rightCubeX - cubeRad,
      y1: topY - cubeRad,
      x2: rightCubeX + cubeRad,
      y2: topY + cubeRad,
    });

    // (D) Right: Navy line-art person wearing VR headset (pulled inward with ample margin)
    const vrPersonX = Math.round(3450 * scale);
    drawVrPersonSilhouette(ctx, vrPersonX, topY, scale);
    muralBlocks.push({
      id: 'VR-Person',
      x1: vrPersonX - Math.round(60 * scale),
      y1: topY - Math.round(60 * scale),
      x2: vrPersonX + Math.round(100 * scale),
      y2: topY + Math.round(70 * scale),
    });

    // Run safe-area validation
    checkMuralSafeAreas(W, H, muralBlocks);
  });

  muralTex.anisotropy = 16;
  const muralMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, roomH),
    new THREE.MeshBasicMaterial({ map: muralTex })
  );
  muralMesh.position.set(0, roomH / 2, 0.01);
  g.add(muralMesh);

  // 2. Center Wall-Mounted 75" Smart TV Display (3.00m x 1.68m, 16:9)
  const tvW = 3.00, tvH = 1.68;
  const tvY = 1.62; // TV center: bottom at 0.78m, top at 2.46m; soundbar at 2.50m (>= 0.30m gap below tagline!)

  // Soft drop shadow behind TV on wall
  const tvShadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false });
  const tvShadow = new THREE.Mesh(new THREE.PlaneGeometry(tvW + 0.16, tvH + 0.16), tvShadowMat);
  tvShadow.position.set(0, tvY - 0.02, 0.015);
  g.add(tvShadow);

  const tvScreenTex = canvasTex(1024, 576, (ctx) => {
    // Deep blue-purple tech gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 576);
    grad.addColorStop(0, '#081226');
    grad.addColorStop(0.5, '#162854');
    grad.addColorStop(1, '#204278');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 576);

    // Orange dynamic curve at bottom-left corner
    ctx.fillStyle = '#ff7a00';
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.bezierCurveTo(180, 410, 260, 520, 360, 576);
    ctx.lineTo(0, 576);
    ctx.closePath();
    ctx.fill();

    // Digital clock top right with margin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
    ctx.font = "600 24px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('10:24', 960, 36);

    // Larger Top SRI Logo Emblem
    drawSriLotusEmblem(ctx, 512, 75, 30);

    // Title text with clear vertical gap
    ctx.fillStyle = '#ffffff';
    ctx.font = "italic 700 38px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AR / VR Lab', 512, 175);

    // 4 App Tiles (approx 20% to 22% of screen width with equal gaps, large bold icons & labels)
    const cards = [
      { icon: 'headset', name: 'VR Suite' },
      { icon: 'ar', name: 'AR Scan' },
      { icon: 'circle360', name: '360° Lab' },
      { icon: 'cube3d', name: '3D Spatial' },
    ];
    const tileW = 205;
    const tileH = 145;
    const tileY = 260;
    const tileGap = 40;
    const startX = 40;

    cards.forEach((c, i) => {
      const bx = startX + i * (tileW + tileGap);
      const cx = bx + tileW / 2;

      // White rounded background card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, tileY, tileW, tileH, 14);
      } else {
        ctx.rect(bx, tileY, tileW, tileH);
      }
      ctx.fill();

      // Card Icon (Large, bold, crisp)
      drawPanelVectorIcon(ctx, cx, tileY + 54, c.icon, 1.25);

      // Card Label underneath with clear gap
      ctx.fillStyle = '#14284b';
      ctx.font = "bold 17px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.name, cx, tileY + 112);
    });

    // Pagination dots at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let d = 0; d < 5; d++) {
      ctx.beginPath();
      ctx.arc(472 + d * 20, 520, d === 0 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const tvScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(tvW, tvH),
    new THREE.MeshStandardMaterial({
      map: tvScreenTex,
      roughness: 0.18,
      metalness: 0.05,
      emissive: 0x142850,
      emissiveIntensity: 0.40,
    })
  );
  tvScreen.position.set(0, tvY, 0.055);
  g.add(tvScreen);

  // Black metallic TV frame / bezel
  box(g, tvW + 0.04, tvH + 0.04, 0.035, M(0x141416, { roughness: 0.35, metalness: 0.7 }), 0, tvY, 0.03);
  // Slim top webcam/soundbar bar
  box(g, 0.36, 0.035, 0.04, M(0x1a1a1e, { roughness: 0.4 }), 0, tvY + tvH / 2 + 0.02, 0.05);

  // 3. Navy Lowline Credenza / Cabinet below TV (8.4m wide x 0.62m high x 0.50m deep)
  const credW = 8.40, credH = 0.62, credD = 0.50;
  const credY = credH / 2;
  // Deep navy body
  box(g, credW, credH - 0.04, credD, M(C.navy, { roughness: 0.55 }), 0, credY - 0.02, credD / 2);
  // Blonde honey wood countertop
  box(g, credW + 0.04, 0.035, credD + 0.04, M(0xd8a878, { roughness: 0.4 }), 0, credH - 0.018, credD / 2);
  // Orange front bevel edge trim on countertop
  box(g, credW + 0.04, 0.012, 0.015, M(C.orange), 0, credH - 0.032, credD + 0.02);

  // 8 Cabinet doors with small orange round dot handles
  const doorWidth = credW / 8;
  for (let i = 0; i < 8; i++) {
    const dx = -credW / 2 + doorWidth * (i + 0.5);
    // Door dividing groove
    box(g, 0.012, credH - 0.10, 0.015, M(0x0e1b33), -credW / 2 + doorWidth * i, credY - 0.02, credD + 0.005);
    // Orange round dot handle
    cyl(g, 0.014, 0.014, 0.018, M(C.orange), dx + (i % 2 === 0 ? 0.22 : -0.22), credY + 0.12, credD + 0.012, 12);
  }
  // Warm LED toe-kick strip under cabinet
  box(g, credW - 0.2, 0.015, 0.03, Bm(0xfff2b0), 0, 0.015, credD * 0.4);

  // Cabinet Countertop Props:
  const topY0 = credH;
  // Left: Potted plant & glowing globe lamp
  createLeafyPlant(g, -3.20, topY0, credD * 0.5, { scale: 0.85, potColor: 0xffffff });
  createGlowingGlobeLamp(g, -2.60, topY0, credD * 0.5);
  // Right: Decor box, books, plant
  createDecorBox(g, 2.50, topY0, credD * 0.5);
  createBookRow(g, 3.10, topY0 + 0.12, credD * 0.5, 8);
  createLeafyPlant(g, 3.70, topY0, credD * 0.5, { scale: 0.85, potColor: 0xffffff });

  // 4. Floating Wooden Shelves on Left and Right of TV with LED Strips
  const shelfXPositions = [-2.35, 2.35];
  const shelfHeights = [1.15, 1.65, 2.15];
  const shelfW = 1.35, shelfD = 0.28, shelfT = 0.038;

  shelfXPositions.forEach((sx, stackIdx) => {
    shelfHeights.forEach((sy, tier) => {
      // Wood shelf plank
      box(g, shelfW, shelfT, shelfD, M(0xd8a878, { roughness: 0.4 }), sx, sy, shelfD / 2);
      // Warm LED underglow strip
      box(g, shelfW - 0.1, 0.008, 0.02, Bm(0xfff4be), sx, sy - shelfT / 2 - 0.004, shelfD / 2);

      // Shelf props
      if (stackIdx === 0) {
        // Left Stack:
        if (tier === 0) {
          // Bottom shelf: White VR Headset + 2 black controllers + books
          createMiniVrHeadset(g, sx - 0.35, sy + 0.11, shelfD / 2);
          createMiniVrController(g, sx + 0.15, sy + 0.06, shelfD / 2);
          createMiniVrController(g, sx + 0.38, sy + 0.06, shelfD / 2);
        } else if (tier === 1) {
          // Middle shelf: Row of colorful books + small robot figurine
          createBookRow(g, sx - 0.22, sy + 0.12, shelfD / 2, 7);
          createMiniRobotToy(g, sx + 0.36, sy + 0.02, shelfD / 2);
        } else if (tier === 2) {
          // Top shelf: Lush leafy plant with trailing ivy hanging down side
          createTrailingIvyPlant(g, sx - 0.25, sy + shelfT / 2, shelfD / 2);
          createLeafyPlant(g, sx + 0.25, sy + shelfT / 2, shelfD / 2, { scale: 0.70 });
        }
      } else {
        // Right Stack:
        if (tier === 0) {
          // Bottom shelf: White VR Headset + 2 controllers
          createMiniVrHeadset(g, sx - 0.25, sy + 0.11, shelfD / 2);
          createMiniVrController(g, sx + 0.20, sy + 0.06, shelfD / 2);
          createMiniVrController(g, sx + 0.42, sy + 0.06, shelfD / 2);
        } else if (tier === 1) {
          // Middle shelf: Tripod camera + books
          createTripodCamera(g, sx - 0.32, sy + shelfT / 2, shelfD / 2);
          createBookRow(g, sx + 0.15, sy + 0.12, shelfD / 2, 6);
        } else if (tier === 2) {
          // Top shelf: Cascading trailing ivy plant
          createTrailingIvyPlant(g, sx + 0.25, sy + shelfT / 2, shelfD / 2);
          createLeafyPlant(g, sx - 0.25, sy + shelfT / 2, shelfD / 2, { scale: 0.70 });
        }
      }
    });
  });

  // 5. Black-Framed Glass Windows Flanking Outer Shelves (Clean Architectural Windows, ZERO Solid Black Blocks!)
  [-3.85, 3.85].forEach((gx) => {
    createSoftInteriorWindow(g, gx, 1.625, 0.02);
  });

  // 6. Tall Floor Plant in Corner away from Left Navy Panel (100% visible panel text)
  createLeafyPlant(g, -6.45, 0, 0.40, { isTall: true });

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// EAST WINDOW WALL (Left Wall, X = xMax)
// ─────────────────────────────────────────────────────────────────────────────
function buildEastWindowWall(parent, xMax, cz, floorY, roomL, roomH) {
  const g = new THREE.Group();
  g.position.set(xMax, floorY, cz);
  g.rotation.y = -Math.PI / 2;

  const winW = roomL - 2.0; // 12.0m wide window expanse
  const winH = 2.30;
  const winY = 2.10;
  const frameMat = M(0x18181c, { roughness: 0.35, metalness: 0.6 });

  // 1. Soft Daylight Sky & Campus Backdrop
  const bgTex = canvasTex(1024, 512, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#7dd3fc');
    grad.addColorStop(0.65, '#e0f2fe');
    grad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Distant soft green trees
    ctx.fillStyle = '#4ade80';
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(i * 115 + 40, 440, 100, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < 11; i++) {
      ctx.beginPath();
      ctx.arc(i * 105 - 20, 480, 85, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const bgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(winW, winH),
    new THREE.MeshBasicMaterial({ map: bgTex })
  );
  bgMesh.position.set(0, winY, -0.15);
  g.add(bgMesh);

  // 2. Clear Architectural Glass Window Panes
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.88,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), glassMat);
  glassMesh.position.set(0, winY, 0.02);
  g.add(glassMesh);

  // 3. Black Window Mullions / Grid Frames
  // Outer frame perimeter
  box(g, winW + 0.1, 0.08, 0.12, frameMat, 0, winY + winH / 2, 0);
  box(g, winW + 0.1, 0.08, 0.12, frameMat, 0, winY - winH / 2, 0);
  box(g, 0.08, winH + 0.1, 0.12, frameMat, -winW / 2, winY, 0);
  box(g, 0.08, winH + 0.1, 0.12, frameMat, winW / 2, winY, 0);

  // Vertical mullions dividing into 6 panoramic bays
  const bayW = winW / 6;
  for (let m = -2.5; m <= 2.5; m++) {
    box(g, 0.06, winH, 0.10, frameMat, m * bayW, winY, 0);
  }
  // Horizontal transom bar
  box(g, winW, 0.05, 0.08, frameMat, 0, winY + 0.45, 0);

  // 4. Staggered Grey Roller Blinds (partially lowered to realistic heights)
  const blindMat = M(0x9ca3af, { roughness: 0.85 });
  const blindHeights = [0.85, 1.30, 0.65, 1.10, 0.90, 1.40];
  blindHeights.forEach((bh, i) => {
    const bx = -winW / 2 + bayW / 2 + i * bayW;
    const by = winY + winH / 2 - bh / 2;
    // Rolled fabric sheet
    box(g, bayW - 0.08, bh, 0.015, blindMat, bx, by, 0.05);
    // Bottom weighted pull hem bar
    box(g, bayW - 0.06, 0.03, 0.02, frameMat, bx, winY + winH / 2 - bh, 0.055);
  });

  // Tall corner indoor leafy plant
  createLeafyPlant(g, -winW / 2 + 0.8, 0, 0.8, { isTall: true });

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// VR EQUIPMENT ZONE (Right / West Wall, inner surface at X = 20.20m)
// ─────────────────────────────────────────────────────────────────────────────
function buildVrEquipmentZone(parent, wallX = 20.20, floorY, zMin, zMax) {
  const g = new THREE.Group();
  // Centered at Z = 9.60m, rotated so local -X is Left (South/Lounge) and +X is Right (North/Door)
  g.position.set(wallX, floorY, 9.60);
  g.rotation.y = Math.PI / 2;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const W = isMobile ? 2048 : 4096;
  const H = isMobile ? 1024 : 2048;
  const scale = W / 4096;

  const wallL = 7.80; // 7.8m span along wall
  const wallH = 3.60;

  const vrWallBlocks = [];

  // 1. High-Resolution Painted Wall Graphic Mural Texture (4096x2048, 2048x1024 on mobile)
  const muralTex = canvasTex(W, H, (ctx) => {
    // Warm peach/cream base wall paint
    ctx.fillStyle = '#fff1e3';
    ctx.fillRect(0, 0, W, H);

    // Subtle realistic paint grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < 25000; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }

    // ── LEFT CREAM COLUMN (X = 0 to 800) with 4 STACKED ITEMS ──
    const colW = Math.round(800 * scale);
    const iconX = Math.round(colW * 0.50);
    const itemFontSize = Math.round(34 * scale);

    const columnItems = [
      { id: 'Left-VR', icon: 'headset', label: ['Virtual', 'Reality'], y: 240 },
      { id: 'Left-AR', icon: 'ar', label: ['Augmented', 'Reality'], y: 680 },
      { id: 'Left-360', icon: 'circle360', label: ['360° Immersive', 'Learning'], y: 1120 },
      { id: 'Left-3D', icon: 'cube3d', label: ['3D', 'Visualization'], y: 1560 },
    ];

    columnItems.forEach((item, idx) => {
      const iy = Math.round(item.y * scale);
      const iconH = Math.round(60 * scale);
      drawPanelVectorIcon(ctx, iconX, iy + iconH / 2, item.icon, scale, '#14284b');

      const labelTop = iy + iconH + Math.round(16 * scale);
      ctx.fillStyle = '#14284b';
      ctx.font = `bold ${itemFontSize}px 'Segoe UI', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      let maxTextW = 0;
      item.label.forEach((line, li) => {
        const lineY = labelTop + li * Math.round(42 * scale);
        ctx.fillText(line, iconX, lineY);
        const tw = ctx.measureText(line).width;
        if (tw > maxTextW) maxTextW = tw;
      });

      const blockW = Math.max(iconH, maxTextW);
      const blockH = iconH + Math.round(16 * scale) + item.label.length * Math.round(42 * scale);
      vrWallBlocks.push({
        id: item.id,
        x1: iconX - blockW / 2,
        y1: iy,
        x2: iconX + blockW / 2,
        y2: iy + blockH,
      });

      // Thin horizontal orange divider line below item (except last)
      if (idx < 3) {
        const divY = iy + blockH + Math.round(60 * scale);
        const divLen = Math.round(240 * scale);
        ctx.strokeStyle = '#ff7a00';
        ctx.lineWidth = Math.max(2, Math.round(3.5 * scale));
        ctx.beginPath();
        ctx.moveTo(iconX - divLen / 2, divY);
        ctx.lineTo(iconX + divLen / 2, divY);
        ctx.stroke();

        vrWallBlocks.push({
          id: `Left-Div-${idx}`,
          x1: iconX - divLen / 2,
          y1: divY - 4 * scale,
          x2: iconX + divLen / 2,
          y2: divY + 4 * scale,
        });
      }
    });

    // ── TOP NAVY HEADER BAND (X = 760 to W, Y = 0 to 410) ──
    const headerLeft = Math.round(760 * scale);
    const headerH = Math.round(410 * scale);
    ctx.fillStyle = '#14284b';
    ctx.fillRect(headerLeft, 0, W - headerLeft, headerH);

    // Left vertical border column framing pegboard
    ctx.fillRect(headerLeft, headerH, Math.round(80 * scale), H - headerH);
    // Right vertical border column framing pegboard (near door)
    const rightColLeft = Math.round(3880 * scale);
    ctx.fillRect(rightColLeft, 0, W - rightColLeft, H);

    // SRI Logo in Header
    const logoX = Math.round(1050 * scale);
    const logoY = Math.round(205 * scale);
    const logoR = Math.round(42 * scale);
    drawSriLotusEmblem(ctx, logoX, logoY, logoR, { textCol: '#ffffff' });
    vrWallBlocks.push({
      id: 'Header-SRI-Logo',
      x1: logoX - Math.round(65 * scale),
      y1: logoY - Math.round(60 * scale),
      x2: logoX + Math.round(65 * scale),
      y2: logoY + Math.round(70 * scale),
    });

    // Thin vertical white divider
    const divX = Math.round(1270 * scale);
    const divH = Math.round(180 * scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(divX, logoY - divH / 2, Math.max(3, Math.round(4 * scale)), divH);
    vrWallBlocks.push({
      id: 'Header-Divider',
      x1: divX,
      y1: logoY - divH / 2,
      x2: divX + 4 * scale,
      y2: logoY + divH / 2,
    });

    // "AR / VR LAB" Title
    const titleFontSz = Math.round(92 * scale);
    ctx.font = `italic 900 ${titleFontSz}px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    const titleX = Math.round(1340 * scale);
    const arText = 'AR / VR ';
    ctx.fillText(arText, titleX, logoY);
    const arW = ctx.measureText(arText).width;
    ctx.fillStyle = '#ff7a00';
    ctx.fillText('LAB', titleX + arW, logoY);
    const labW = ctx.measureText('LAB').width;
    vrWallBlocks.push({
      id: 'Header-Title',
      x1: titleX,
      y1: logoY - titleFontSz / 2,
      x2: titleX + arW + labW,
      y2: logoY + titleFontSz / 2,
    });

    // Orange diagonal slash at right end of the band
    ctx.fillStyle = '#ff7a00';
    ctx.beginPath();
    ctx.moveTo(3520 * scale, headerH);
    ctx.lineTo(3690 * scale, headerH);
    ctx.lineTo(3820 * scale, 0);
    ctx.lineTo(3650 * scale, 0);
    ctx.closePath();
    ctx.fill();
    vrWallBlocks.push({
      id: 'Header-Slash',
      x1: 3520 * scale,
      y1: 0,
      x2: 3820 * scale,
      y2: headerH,
    });

    // Soft warm LED downward light gradient on alcove wall directly below header
    const alcoveLeft = Math.round(840 * scale);
    const alcoveW = rightColLeft - alcoveLeft;
    const glowGrad = ctx.createLinearGradient(0, headerH, 0, headerH + Math.round(220 * scale));
    glowGrad.addColorStop(0, 'rgba(255, 235, 180, 0.40)');
    glowGrad.addColorStop(1, 'rgba(255, 241, 227, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(alcoveLeft, headerH, alcoveW, Math.round(220 * scale));

    // Validate safe-areas
    checkMuralSafeAreas(W, H, vrWallBlocks);
  });

  muralTex.anisotropy = 16;
  const muralMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(wallL, wallH),
    new THREE.MeshBasicMaterial({
      map: muralTex,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );
  muralMesh.position.set(0, wallH / 2, 0.01);
  g.add(muralMesh);

  // 2. White Perforated Pegboard Section (4.50m wide x 2.00m tall)
  const pegW = 4.50, pegH = 2.00;
  const pegY = 1.88; // Bottom at 0.88m, top at 2.88m
  const pegX = 0.25;

  const pegTex = canvasTex(1024, 512, (ctx) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle drop shadow under holes
    ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
    for (let r = 16; r < 512; r += 20) {
      for (let c = 16; c < 1024; c += 20) {
        ctx.beginPath();
        ctx.arc(c, r + 0.8, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Crisp perforated holes
    ctx.fillStyle = '#1e293b';
    for (let r = 16; r < 512; r += 20) {
      for (let c = 16; c < 1024; c += 20) {
        ctx.beginPath();
        ctx.arc(c, r, 3.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  pegTex.anisotropy = 16;

  const pegMat = new THREE.MeshStandardMaterial({
    map: pegTex,
    roughness: 0.55,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const pegMesh = new THREE.Mesh(new THREE.PlaneGeometry(pegW, pegH), pegMat);
  pegMesh.position.set(pegX, pegY, 0.035);
  g.add(pegMesh);

  // Black metal outer frame trim around pegboard
  const frameMat = M(0x18181c, { roughness: 0.35, metalness: 0.8 });
  box(g, pegW + 0.04, 0.025, 0.04, frameMat, pegX, pegY + pegH / 2 + 0.012, 0.035);
  box(g, pegW + 0.04, 0.025, 0.04, frameMat, pegX, pegY - pegH / 2 - 0.012, 0.035);
  box(g, 0.025, pegH + 0.04, 0.04, frameMat, pegX - pegW / 2 - 0.012, pegY, 0.035);
  box(g, 0.025, pegH + 0.04, 0.04, frameMat, pegX + pegW / 2 + 0.012, pegY, 0.035);

  // Warm LED glow strip along top edge of pegboard (emissive mesh, no point lights!)
  box(g, pegW, 0.015, 0.025, Bm(0xfff0c8), pegX, pegY + pegH / 2, 0.048);

  // 3. Hanging 6 Generic White VR Headsets (3 columns x 2 rows, dark headstraps)
  const headsetCols = [-1.30, 0.0, +1.30];
  const headsetRows = [pegY + 0.50, pegY - 0.12]; // 2.38m and 1.76m

  headsetCols.forEach((cx) => {
    headsetRows.forEach((ry) => {
      createGenericVrHeadsetProp(g, pegX + cx, ry, 0.08);
    });
  });

  // 4. Hanging 3 Pairs of White VR Controllers below the headsets
  const controllerY = pegY - 0.65; // 1.23m
  headsetCols.forEach((cx) => {
    createGenericVrControllerProp(g, pegX + cx - 0.14, controllerY, 0.07, -0.08);
    createGenericVrControllerProp(g, pegX + cx + 0.14, controllerY, 0.07, 0.08);
  });

  // 5. Wooden-Top Workbench Counter with Black Metal Legs & Lower Wooden Shelf
  const benchW = 4.70, benchH = 0.85, benchD = 0.65;
  const benchX = pegX;
  const woodMat = M(0xd8a878, { roughness: 0.4 });
  const blackLegMat = M(0x18181c, { metalness: 0.8, roughness: 0.3 });

  // Natural blonde honey oak wooden countertop
  box(g, benchW, 0.045, benchD, woodMat, benchX, benchH - 0.0225, benchD / 2);
  // Subtle front bevel trim
  box(g, benchW + 0.02, 0.012, 0.015, M(0xc69260), benchX, benchH - 0.035, benchD + 0.007);

  // 5 Black square steel leg pairs along bench
  const legPositions = [-2.15, -1.08, 0.0, +1.08, +2.15];
  legPositions.forEach((lx) => {
    // Front leg
    box(g, 0.04, benchH - 0.045, 0.04, blackLegMat, benchX + lx, (benchH - 0.045) / 2, benchD - 0.035);
    // Rear leg
    box(g, 0.04, benchH - 0.045, 0.04, blackLegMat, benchX + lx, (benchH - 0.045) / 2, 0.055);
    // Horizontal cross-strut between front and back legs
    box(g, 0.03, 0.03, benchD - 0.08, blackLegMat, benchX + lx, 0.14, benchD / 2);
  });

  // Upper perimeter steel frame rails
  box(g, benchW - 0.08, 0.035, 0.035, blackLegMat, benchX, benchH - 0.062, benchD - 0.035);
  box(g, benchW - 0.08, 0.035, 0.035, blackLegMat, benchX, benchH - 0.062, 0.055);

  // Lower wooden storage shelf
  const shelfY = 0.155;
  box(g, benchW - 0.08, 0.03, benchD - 0.08, woodMat, benchX, shelfY, benchD / 2);

  // 6. Under-Counter Storage on Lower Shelf (Tidy, zero floating!)
  const itemFloorY = shelfY + 0.015;

  // Bay 1 (Left): 2 Dark Grey Storage Bins
  const greyBinMat = M(0x334155, { roughness: 0.55 });
  [-1.65, -1.20].forEach((bx) => {
    createStorageBin(g, benchX + bx, itemFloorY, benchD / 2, 0.38, 0.22, 0.48, greyBinMat);
  });

  // Bay 2 (Middle-Left): 2 Orange Storage Bins
  const orangeBinMat = M(0xff7a00, { roughness: 0.55 });
  [-0.60, -0.15].forEach((bx) => {
    createStorageBin(g, benchX + bx, itemFloorY, benchD / 2, 0.38, 0.22, 0.48, orangeBinMat);
  });

  // Bay 3 (Middle-Right): 1 Black Hard Flight / Equipment Case with Silver Latches
  createFlightHardCase(g, benchX + 0.55, itemFloorY, benchD / 2);

  // Bay 4 (Right): 4 Transparent Storage Boxes (Stacked 2x2)
  [+1.35, +1.80].forEach((tx) => {
    createTransparentStorageBox(g, benchX + tx, itemFloorY, benchD / 2);
    createTransparentStorageBox(g, benchX + tx, itemFloorY + 0.15, benchD / 2);
  });

  // 7. Countertop Potted Plants
  // Left: Leafy potted plant with cascading trailing vines hanging over wooden edge
  createTrailingIvyPlant(g, benchX - 2.05, benchH, benchD / 2);
  createLeafyPlant(g, benchX - 1.92, benchH, benchD / 2, { scale: 0.75, potColor: 0xffffff });

  // Right: Lush leafy potted plant
  createLeafyPlant(g, benchX + 2.05, benchH, benchD / 2, { scale: 0.85, potColor: 0xffffff });

  // Soft contact shadow under the bench
  const benchShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(benchW + 0.2, benchD + 0.1),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false })
  );
  benchShadow.rotation.x = -Math.PI / 2;
  benchShadow.position.set(benchX, 0.005, benchD / 2);
  g.add(benchShadow);

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// IMMERSIVE LOUNGE (South / Back Wall, Z = zMax)
// ─────────────────────────────────────────────────────────────────────────────
function buildImmersiveLounge(parent, cx, zMax, floorY, roomW) {
  const g = new THREE.Group();
  g.position.set(cx, floorY, zMax);
  g.rotation.y = Math.PI;

  // 1. Navy Painted Back Wall with Clean Vector Line-Art VR Headset Graphic
  const wallTex = canvasTex(2048, 1024, (ctx) => {
    // Deep royal navy matte wall paint
    ctx.fillStyle = '#14284b';
    ctx.fillRect(0, 0, 2048, 1024);

    // Subtle paint grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < 20000; i++) {
      ctx.fillRect(Math.random() * 2048, Math.random() * 1024, 2, 2);
    }

    // Crisp Vector Line-Art VR Headset (Front View with Nose Cutout, Straps & Optics)
    drawLoungeHeadsetGraphic(ctx, 1024, 460);
  });

  const wallMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, 3.6),
    new THREE.MeshBasicMaterial({ map: wallTex })
  );
  wallMesh.position.set(0, 1.8, 0.01);
  g.add(wallMesh);

  // 2. Rectangular Artificial-Grass Rug with Realistic Blade Texture (Raised 2.5cm)
  const turfW = 6.20, turfL = 3.80;
  const turfThickness = 0.025;
  const turfY = turfThickness / 2; // y = 0.0125 in local group -> y = 0.0625 to 0.075 in world
  const turfCenterZ = 2.05;

  const turfTex = getRealisticTurfTexture();
  const turfMat = new THREE.MeshStandardMaterial({
    map: turfTex,
    roughness: 0.92,
    metalness: 0.0,
  });

  // Solid raised turf slab (no cream border!)
  const turfSlab = new THREE.Mesh(new THREE.BoxGeometry(turfW, turfThickness, turfL), turfMat);
  turfSlab.position.set(0, turfY, turfCenterZ);
  g.add(turfSlab);

  // Thin Warm LED Strip along outer perimeter edges
  const ledStripMat = Bm(0xfff4bb);
  const sw = 0.022, sh = 0.015;
  const sy = turfThickness;
  box(g, turfW, sh, sw, ledStripMat, 0, sy, turfCenterZ - turfL / 2 + sw / 2);
  box(g, turfW, sh, sw, ledStripMat, 0, sy, turfCenterZ + turfL / 2 - sw / 2);
  box(g, sw, sh, turfL, ledStripMat, -turfW / 2 + sw / 2, sy, turfCenterZ);
  box(g, sw, sh, turfL, ledStripMat, turfW / 2 - sw / 2, sy, turfCenterZ);

  // 3. Proportioned Round White Coffee Table resting on the turf
  createLoungeCoffeeTable(g, 0, turfThickness, turfCenterZ);

  // 4. Four Symmetrically Placed Puffy Teardrop Bean Bags (2 Orange, 2 Royal Navy #1B2A6B)
  // Symmetrical layout around coffee table, >0.5m physical separation, angled inward
  const beanBagY = turfThickness; // Sits flush on raised turf
  // Left side of table
  createPuffyBeanBagMesh(g, -1.65, turfCenterZ + 0.70, C.orange, 0.65, beanBagY); // Front-left: Orange
  createPuffyBeanBagMesh(g, -1.65, turfCenterZ - 0.70, 0x1b2a6b, 0.82, beanBagY); // Rear-left: Royal Navy
  // Right side of table
  createPuffyBeanBagMesh(g, 1.65, turfCenterZ + 0.70, 0x1b2a6b, -0.65, beanBagY); // Front-right: Royal Navy
  createPuffyBeanBagMesh(g, 1.65, turfCenterZ - 0.70, C.orange, -0.82, beanBagY); // Rear-right: Orange

  // 5. Two Straight Wall-Mounted Wooden Shelf Units Flush to Back Wall
  // Spaced symmetrically at x = -2.60m and x = +2.60m, framing the headset graphic
  createWallMountedLoungeShelfUnit(g, -2.60, 0.90, 0.14);
  createWallMountedLoungeShelfUnit(g, 2.60, 0.90, 0.14);

  // 6. Tall Leafy Indoor Floor Plants in Corners (1.35m tall, multi-leaved)
  createLeafyPlant(g, -5.60, 0, 0.65, { isTall: true });
  createLeafyPlant(g, 5.60, 0, 0.65, { isTall: true });

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEACHING ZONE (2 Blocks of Tables, 24 Navy Ergonomic Chairs, Wide Centre Aisle)
// ─────────────────────────────────────────────────────────────────────────────
export function buildTeachingZone(parent, cx, floorY) {
  const g = new THREE.Group();
  g.position.set(cx, floorY, 0);

  // Two blocks of long study tables: Left Block (cx - 2.85m) and Right Block (cx + 2.85m)
  // Centre aisle between them is ~2.4m - 3.0m wide (well above 1.5m minimum)
  const blockOffsets = [-2.85, 2.85];
  const rowZ = [5.60, 7.30, 9.00]; // 3 rows per block, 1.70m apart (above 1.0m minimum)
  const tblW = 2.70, tblD = 0.82, tblH = 0.74;

  const totalTables = blockOffsets.length * rowZ.length; // 6 tables
  const totalChairs = totalTables * 4; // 24 chairs

  // Shared reusable materials
  const woodMat = M(0xd8a878, { roughness: 0.4 }); // Blonde honey wood tabletop
  const blackTrimMat = M(0x111116);
  const powerInsertMat = M(0x111115, { metalness: 0.8 });
  const legMat = M(0x18181c, { roughness: 0.45, metalness: 0.7 });
  const navySeatMat = M(0x14284b, { roughness: 0.65 }); // Deep navy cushion
  const blackFrameMat = M(0x18181c, { roughness: 0.45, metalness: 0.7 });

  // Geometries for InstancedMesh
  const tableTopGeom = new THREE.BoxGeometry(tblW, 0.045, tblD);
  const tableTrimGeom = new THREE.BoxGeometry(tblW + 0.01, 0.01, tblD + 0.01);
  const powerGeom = new THREE.BoxGeometry(0.35, 0.005, 0.14);
  const tableLegGeom = new THREE.BoxGeometry(0.045, tblH - 0.045, 0.045);
  const tableBraceGeom = new THREE.BoxGeometry(0.03, 0.03, tblD - 0.16);

  const seatGeom = new THREE.BoxGeometry(0.44, 0.05, 0.42);
  const backGeom = new THREE.BoxGeometry(0.42, 0.38, 0.03);
  const chairLegGeom = new THREE.CylinderGeometry(0.014, 0.012, 0.44, 8);

  // Instanced Meshes for maximum mobile performance
  const tableTopMesh = new THREE.InstancedMesh(tableTopGeom, woodMat, totalTables);
  const tableTrimMesh = new THREE.InstancedMesh(tableTrimGeom, blackTrimMat, totalTables);
  const powerMesh = new THREE.InstancedMesh(powerGeom, powerInsertMat, totalTables);
  const tableLegMesh = new THREE.InstancedMesh(tableLegGeom, legMat, totalTables * 4);
  const tableBraceMesh = new THREE.InstancedMesh(tableBraceGeom, legMat, totalTables * 2);

  // Perforated task chair back texture
  const perforatedDotTex = canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = '#1c1c22';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#0a0a0e';
    for (let py = 12; py < 256; py += 16) {
      for (let px = 12; px < 256; px += 16) {
        ctx.beginPath();
        ctx.arc(px, py, 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  perforatedDotTex.anisotropy = 4;
  const perforatedBackMat = new THREE.MeshStandardMaterial({
    map: perforatedDotTex,
    roughness: 0.55,
    metalness: 0.15,
  });

  const chairSeatMesh = new THREE.InstancedMesh(seatGeom, navySeatMat, totalChairs);
  const chairBackMesh = new THREE.InstancedMesh(backGeom, perforatedBackMat, totalChairs);
  const chairLegMesh = new THREE.InstancedMesh(chairLegGeom, blackFrameMat, totalChairs * 4);

  const dummy = new THREE.Object3D();
  let tableIdx = 0;
  let legIdx = 0;
  let braceIdx = 0;
  let chairIdx = 0;
  let chairLegIdx = 0;

  // Soft contact shadow plane material under tables
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const shadowGeom = new THREE.PlaneGeometry(tblW + 0.2, tblD + 0.2);

  blockOffsets.forEach((bx) => {
    rowZ.forEach((rz) => {
      // 1. Table Top
      dummy.position.set(bx, tblH - 0.022, rz);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      tableTopMesh.setMatrixAt(tableIdx, dummy.matrix);

      // Table Bevel Trim
      dummy.position.set(bx, tblH - 0.045, rz);
      dummy.updateMatrix();
      tableTrimMesh.setMatrixAt(tableIdx, dummy.matrix);

      // Power/Data Module in center of desk
      dummy.position.set(bx, tblH + 0.003, rz);
      dummy.updateMatrix();
      powerMesh.setMatrixAt(tableIdx, dummy.matrix);

      tableIdx++;

      // 4 Table Legs & Side Braces
      [-tblW / 2 + 0.1, tblW / 2 - 0.1].forEach((lx) => {
        [-tblD / 2 + 0.08, tblD / 2 - 0.08].forEach((lz) => {
          dummy.position.set(bx + lx, (tblH - 0.045) / 2, rz + lz);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          tableLegMesh.setMatrixAt(legIdx++, dummy.matrix);
        });
        // Side leg brace
        dummy.position.set(bx + lx, tblH * 0.35, rz);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        tableBraceMesh.setMatrixAt(braceIdx++, dummy.matrix);
      });

      // Shadow plane
      const shadow = new THREE.Mesh(shadowGeom, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(bx, 0.052, rz);
      g.add(shadow);

      // 4 Ergonomic Task Chairs per table (2 facing North, 2 facing South)
      [-tblW * 0.28, tblW * 0.28].forEach((cxPos) => {
        const chairConfigs = [
          { zOff: tblD / 2 + 0.28, yaw: 0 },
          { zOff: -tblD / 2 - 0.28, yaw: Math.PI },
        ];
        chairConfigs.forEach(({ zOff, yaw }) => {
          const chX = bx + cxPos;
          const chZ = rz + zOff;

          // Seat cushion
          dummy.position.set(chX, 0.44, chZ);
          dummy.rotation.set(0, yaw, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          chairSeatMesh.setMatrixAt(chairIdx, dummy.matrix);

          // Backrest (offset relative to chair center)
          const backOffsetZ = yaw === 0 ? -0.20 : 0.20;
          dummy.position.set(chX, 0.70, chZ + backOffsetZ);
          dummy.rotation.set(yaw === 0 ? -0.08 : 0.08, yaw, 0);
          dummy.updateMatrix();
          chairBackMesh.setMatrixAt(chairIdx, dummy.matrix);

          chairIdx++;

          // 4 Tubular legs per chair
          const legOffsets = [
            { lx: -0.18, lz: -0.17 },
            { lx: 0.18, lz: -0.17 },
            { lx: -0.18, lz: 0.17 },
            { lx: 0.18, lz: 0.17 },
          ];
          legOffsets.forEach(({ lx, lz }) => {
            const rx = yaw === 0 ? lx : -lx;
            const rzLeg = yaw === 0 ? lz : -lz;
            dummy.position.set(chX + rx, 0.22, chZ + rzLeg);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            chairLegMesh.setMatrixAt(chairLegIdx++, dummy.matrix);
          });
        });
      });
    });
  });

  tableTopMesh.instanceMatrix.needsUpdate = true;
  tableTrimMesh.instanceMatrix.needsUpdate = true;
  powerMesh.instanceMatrix.needsUpdate = true;
  tableLegMesh.instanceMatrix.needsUpdate = true;
  tableBraceMesh.instanceMatrix.needsUpdate = true;
  chairSeatMesh.instanceMatrix.needsUpdate = true;
  chairBackMesh.instanceMatrix.needsUpdate = true;
  chairLegMesh.instanceMatrix.needsUpdate = true;

  g.add(tableTopMesh);
  g.add(tableTrimMesh);
  g.add(powerMesh);
  g.add(tableLegMesh);
  g.add(tableBraceMesh);
  g.add(chairSeatMesh);
  g.add(chairBackMesh);
  g.add(chairLegMesh);

  parent.add(g);
  return g;
}

/** Ergonomic Student Task Chair with Perforated Back and NAVY Seat Cushion */
export function createNavySeatChair(parent, x, y, z, yaw = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = yaw;

  const navySeatMat = M(0x14284b, { roughness: 0.65 });
  const blackFrameMat = M(0x18181c, { roughness: 0.45, metalness: 0.7 });

  box(g, 0.44, 0.05, 0.42, navySeatMat, 0, 0.44, 0);
  const backMesh = box(g, 0.42, 0.38, 0.03, blackFrameMat, 0, 0.70, -0.20);
  backMesh.rotation.x = -0.08;

  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, -0.18, 0.22, -0.17, 8);
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, 0.18, 0.22, -0.17, 8);
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, -0.18, 0.22, 0.17, 8);
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, 0.18, 0.22, 0.17, 8);

  parent.add(g);
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE HIGH-DETAIL HELPER MESHES
// ─────────────────────────────────────────────────────────────────────────────

/** Coffee Table: Round white satin top, black metal ring base & 4 slim steel legs */
function createLoungeCoffeeTable(parent, x, floorY, z) {
  const g = new THREE.Group();
  g.position.set(x, floorY, z);

  const topR = 0.46;
  const topH = 0.024;
  const tableTotalH = 0.36;
  const legMat = M(0x1a1a1e, { roughness: 0.4, metalness: 0.8 });
  const topMat = M(0xfbfcfd, { roughness: 0.25, metalness: 0.04 });

  // 1. Round Satin White Top
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(topR, topR, topH, 28), topMat);
  tableTop.position.set(0, tableTotalH - topH / 2, 0);
  g.add(tableTop);

  // 2. Black Metal Circular Ring Base (resting flat on turf)
  const ringR = 0.43;
  const ringH = 0.016;
  cyl(g, ringR, ringR * 0.95, ringH, legMat, 0, ringH / 2, 0, 24);

  // 3. Four Slim Vertical Steel Legs
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const lx = Math.cos(ang) * (ringR - 0.02);
    const lz = Math.sin(ang) * (ringR - 0.02);
    cyl(g, 0.011, 0.011, tableTotalH - topH - ringH, legMat, lx, (tableTotalH - topH + ringH) / 2, lz, 8);
  }

  // 4. Center Crossbraces under top
  box(g, ringR * 1.8, 0.014, 0.018, legMat, 0, tableTotalH - topH - 0.01, 0);
  box(g, 0.018, 0.014, ringR * 1.8, legMat, 0, tableTotalH - topH - 0.01, 0);

  // 5. Tabletop Props (properly sized, resting flat on surface)
  const topSurfaceY = tableTotalH;
  // Leafy potted plant (12cm pot, lush radiating leaves)
  createLeafyPlant(g, -0.02, topSurfaceY, -0.04, { scale: 0.85, potColor: 0xffffff });
  // Stack of 2 Hardcover Books
  createStackedBooks(g, 0.18, topSurfaceY, 0.05);

  // Contact shadow under base ring
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(topR * 2.2, topR * 2.2), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.002, 0);
  g.add(shadow);

  parent.add(g);
  return g;
}

/** Puffy Teardrop / Pear-Shaped Bean Bag with Ergonomic Seat Dip & Wrinkle Folds */
function createPuffyBeanBagMesh(parent, x, z, colHex, yaw, floorY) {
  const g = new THREE.Group();
  g.position.set(x, floorY, z);
  g.rotation.y = yaw;

  // Sculpted parametric teardrop / pear bean bag geometry
  const widthSegs = 28;
  const heightSegs = 24;
  const geom = new THREE.SphereGeometry(0.46, widthSegs, heightSegs);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let px = pos.getX(i);
    let py = pos.getY(i);
    let pz = pos.getZ(i);

    // Height ratio v in [0, 1]
    const v = (py + 0.46) / 0.92;
    const angle = Math.atan2(px, pz);

    // 1. Asymmetric teardrop / pear shaping:
    // Backrest (pz < 0): expands upward and backward
    // Front cushion (pz > 0): squashes down into an ergonomic lap
    const backFactor = Math.max(0, -pz / 0.46);
    const frontFactor = Math.max(0, pz / 0.46);

    // Back rises up to ~0.66m; center-front dips down into deep seating bowl
    py += backFactor * 0.22 * Math.sin(v * Math.PI);
    py -= (1 - Math.abs(angle / Math.PI)) * 0.11 * Math.sin(v * Math.PI) * (1 - v);

    // Pear shape bulge: wider at base, tapering towards head
    const bulge = 1.0 + (1 - v) * 0.24 - v * 0.16;
    px *= bulge;
    pz *= bulge * (1.0 + backFactor * 0.14);

    // Flatten bottom against floor
    if (py < -0.36) {
      py = -0.36 + (py + 0.36) * 0.12;
    }

    // 2. Subtle organic crease ripples along side seams
    const fold = Math.sin(angle * 4 + v * 6) * 0.016 * Math.sin(v * Math.PI);
    px += Math.cos(angle) * fold;
    pz += Math.sin(angle) * fold;

    pos.setXYZ(i, px, py + 0.36, pz);
  }

  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: colHex,
    roughness: 0.88,
    metalness: 0.04,
  });

  const mesh = new THREE.Mesh(geom, mat);
  g.add(mesh);

  // Soft contact shadow plane beneath bean bag
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.003, 0);
  g.add(shadow);

  parent.add(g);
  return g;
}

/** Straight Wall-Mounted Wooden Shelf Unit (4 Shelves, Slim Black Side Frames, Warm LED Strips) */
function createWallMountedLoungeShelfUnit(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const unitW = 1.25;
  const unitH = 1.85;
  const unitD = 0.26;
  const shelfYPositions = [0.15, 0.65, 1.15, 1.65]; // 4 shelves
  const woodMat = M(0xd4a373, { roughness: 0.45 });
  const blackFrameMat = M(0x18181c, { roughness: 0.4, metalness: 0.75 });
  const ledWarmMat = Bm(0xfff2d0);

  // 1. Two Slim Black Metal Side Ladder Frames (flush against wall)
  [-unitW / 2 + 0.02, unitW / 2 - 0.02].forEach((sx) => {
    // Front vertical upright
    box(g, 0.018, unitH, 0.018, blackFrameMat, sx, unitH / 2, unitD - 0.01);
    // Rear vertical upright (wall side)
    box(g, 0.018, unitH, 0.018, blackFrameMat, sx, unitH / 2, 0.01);
    // Cross rungs under each shelf
    shelfYPositions.forEach((sy) => {
      box(g, 0.018, 0.018, unitD, blackFrameMat, sx, sy - 0.015, unitD / 2);
    });
  });

  // 2. Four Blonde Wood Shelves with Warm LED Underglow
  shelfYPositions.forEach((sy, idx) => {
    // Wood shelf plank
    box(g, unitW, 0.025, unitD, woodMat, 0, sy, unitD / 2);
    // Warm LED strip under each shelf
    box(g, unitW - 0.08, 0.008, 0.02, ledWarmMat, 0, sy - 0.015, unitD / 2);

    // Items on shelves (large and legible)
    if (idx === 0) {
      // Bottom shelf: Row of colorful upright books + small leafy plant
      createBookRow(g, -0.22, sy + 0.12, unitD / 2, 7);
      createLeafyPlant(g, 0.35, sy + 0.025, unitD / 2, { scale: 0.70, potColor: 0xffffff });
    } else if (idx === 1) {
      // Shelf 2: White VR Headset on display stand + mini book stack
      createMiniVrHeadset(g, -0.20, sy + 0.10, unitD / 2);
      createMiniBookStack(g, 0.28, sy + 0.025, unitD / 2);
    } else if (idx === 2) {
      // Shelf 3: Cute mini robot mascot figure + leafy succulent pot
      createMiniRobotToy(g, -0.25, sy + 0.025, unitD / 2);
      createLeafyPlant(g, 0.28, sy + 0.025, unitD / 2, { scale: 0.65, potColor: 0xff7a00 });
    } else if (idx === 3) {
      // Top shelf: Cascading trailing ivy plant + decorative tech artifact
      createTrailingIvyPlant(g, -0.32, sy + 0.025, unitD / 2);
      box(g, 0.14, 0.18, 0.14, M(0x1e293b, { roughness: 0.3, metalness: 0.5 }), 0.30, sy + 0.09, unitD / 2);
    }
  });

  parent.add(g);
  return g;
}

/** Multi-Leaved Low-Poly Leafy Plant (Broad arching leaves, zero sticks/spheres, 2-3cm pot rim) */
function createLeafyPlant(parent, x, y, z, opts = {}) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const scale = opts.scale || 1.0;
  g.scale.setScalar(scale);

  const isTall = opts.isTall || false;
  const potR = isTall ? 0.22 : 0.07;
  const potH = isTall ? 0.38 : 0.09;
  const potMat = M(opts.potColor || 0xf8fafc, { roughness: 0.3 });

  // Ceramic Planter Pot with 2.5cm realistic thick rim lip
  const rimLip = isTall ? 0.032 : 0.016;
  cyl(g, potR, potR * 0.85, potH, potMat, 0, potH / 2, 0, 16);
  cyl(g, potR + rimLip, potR + rimLip, potH * 0.16, potMat, 0, potH - potH * 0.08, 0, 16);
  cyl(g, potR * 0.92, potR * 0.92, 0.02, M(0x271c19, { roughness: 0.9 }), 0, potH * 0.92, 0, 12);

  // Leafy Foliage (radiating arching elongated leaf blades with contour)
  const leafCount = isTall ? 14 : 9;
  const leafMat1 = M(0x2e7d32, { roughness: 0.65, side: THREE.DoubleSide });
  const leafMat2 = M(0x388e3c, { roughness: 0.60, side: THREE.DoubleSide });

  for (let i = 0; i < leafCount; i++) {
    const leafGroup = new THREE.Group();
    const angle = (i * Math.PI * 2) / leafCount + (i % 2) * 0.2;
    leafGroup.rotation.y = angle;
    leafGroup.position.set(0, potH * 0.92, 0);

    const leafL = isTall ? (0.48 + (i % 3) * 0.10) : (0.15 + (i % 3) * 0.03);
    const leafW = isTall ? 0.20 : 0.085;
    const droop = isTall ? (0.35 + (i % 4) * 0.15) : (0.40 + (i % 3) * 0.12);

    // Contoured arching leaf blade shape
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(leafW * 0.55, leafL * 0.35, leafW * 0.48, leafL * 0.70);
    leafShape.quadraticCurveTo(leafW * 0.20, leafL * 0.95, 0, leafL);
    leafShape.quadraticCurveTo(-leafW * 0.20, leafL * 0.95, -leafW * 0.48, leafL * 0.70);
    leafShape.quadraticCurveTo(-leafW * 0.55, leafL * 0.35, 0, 0);

    const leafGeom = new THREE.ShapeGeometry(leafShape, 6);
    const lPos = leafGeom.attributes.position;
    for (let k = 0; k < lPos.count; k++) {
      const ly = lPos.getY(k);
      const normY = Math.max(0, Math.min(1, ly / leafL));
      const arch = Math.pow(normY, 1.8) * droop;
      lPos.setZ(k, arch);
    }
    leafGeom.computeVertexNormals();

    const leafMesh = new THREE.Mesh(leafGeom, i % 2 === 0 ? leafMat1 : leafMat2);
    leafMesh.rotation.x = 0.52 + (i % 3) * 0.18;
    leafGroup.add(leafMesh);

    g.add(leafGroup);
  }

  parent.add(g);
  return g;
}

/** Cascading Trailing Ivy Plant */
function createTrailingIvyPlant(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  cyl(g, 0.07, 0.055, 0.08, M(0xffffff, { roughness: 0.3 }), 0, 0.04, 0, 14);
  cyl(g, 0.082, 0.082, 0.018, M(0xffffff, { roughness: 0.3 }), 0, 0.075, 0, 14);
  cyl(g, 0.065, 0.065, 0.015, M(0x271c19, { roughness: 0.9 }), 0, 0.075, 0, 12);

  const leafMat = M(0x2e7d32, { roughness: 0.65, side: THREE.DoubleSide });
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI * 2) / 8;
    const l = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.11), leafMat);
    l.position.set(Math.cos(ang) * 0.045, 0.08, Math.sin(ang) * 0.045);
    l.rotation.x = 0.55;
    l.rotation.y = ang;
    g.add(l);
  }
  // Cascading ivy vine clusters hanging down the front/side
  [-0.04, 0.0, 0.04].forEach((vx, vi) => {
    const vineLen = 0.22 + vi * 0.08;
    for (let vy = 0.04; vy >= -vineLen; vy -= 0.05) {
      const l = new THREE.Mesh(new THREE.PlaneGeometry(0.065, 0.08), leafMat);
      l.position.set(vx + Math.sin(vy * 10) * 0.02, vy, 0.08);
      l.rotation.z = Math.sin(vy * 8) * 0.3;
      g.add(l);
    }
  });
  parent.add(g);
}

/** Row of Upright Books with Metal Bookend */
function createBookRow(parent, x, y, z, count = 6) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const bookColors = [0x1d4ed8, 0xb91c1c, 0xf59e0b, 0x059669, 0x7c3aed, 0xe11d48, 0x0284c7];
  const startX = -(count * 0.04) / 2;
  for (let i = 0; i < count; i++) {
    const col = bookColors[i % bookColors.length];
    const bH = 0.18 + (i % 3) * 0.025;
    const bD = 0.16 + (i % 2) * 0.02;
    box(g, 0.032, bH, bD, M(col, { roughness: 0.4 }), startX + i * 0.038, bH / 2, 0);
  }
  box(g, 0.008, 0.15, 0.12, M(0x18181c, { metalness: 0.8 }), startX + count * 0.038 + 0.004, 0.075, 0);
  parent.add(g);
}

/** Cute Low-Poly Mini Robot Mascot Toy */
function createMiniRobotToy(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const whiteMat = M(0xf0f4f8, { roughness: 0.3 });
  const cyanMat = Bm(0x00f0ff);
  const orangeMat = M(0xff7a00);

  box(g, 0.14, 0.12, 0.10, whiteMat, 0, 0.06, 0);
  box(g, 0.08, 0.04, 0.01, orangeMat, 0, 0.06, 0.052);
  box(g, 0.12, 0.09, 0.09, whiteMat, 0, 0.165, 0);
  box(g, 0.09, 0.03, 0.01, cyanMat, 0, 0.17, 0.048);
  cyl(g, 0.005, 0.005, 0.04, orangeMat, 0, 0.23, 0, 6);
  cyl(g, 0.015, 0.015, 0.03, whiteMat, -0.04, 0.015, 0, 6);
  cyl(g, 0.015, 0.015, 0.03, whiteMat, 0.04, 0.015, 0, 6);

  parent.add(g);
}

/** Two Flat Stacked Hardcover Books on Table */
function createStackedBooks(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Bottom book: royal blue
  box(g, 0.22, 0.028, 0.16, M(0x1d4ed8, { roughness: 0.4 }), 0, 0.014, 0);
  // Top book: coral / amber, rotated 12 degrees
  const b2 = box(g, 0.19, 0.024, 0.14, M(C.orange, { roughness: 0.4 }), 0.01, 0.040, 0);
  b2.rotation.y = 0.21;

  parent.add(g);
}

/** Vector Line-Art VR Headset Graphic on Back Navy Wall */
function drawLoungeHeadsetGraphic(ctx, cx, cy) {
  ctx.save();

  const w = 480;
  const h = 230;
  const r = 50;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Visor outer contour with bottom nose bridge cutout
  ctx.beginPath();
  ctx.moveTo(cx - w / 2 + r, cy - h / 2);
  ctx.lineTo(cx + w / 2 - r, cy - h / 2);
  ctx.arcTo(cx + w / 2, cy - h / 2, cx + w / 2, cy + h / 2, r);
  ctx.lineTo(cx + w / 2, cy + h / 2 - r);
  ctx.arcTo(cx + w / 2, cy + h / 2, cx, cy + h / 2, r);
  ctx.lineTo(cx + 65, cy + h / 2);
  ctx.quadraticCurveTo(cx, cy + h / 2 - 45, cx - 65, cy + h / 2);
  ctx.lineTo(cx - w / 2 + r, cy + h / 2);
  ctx.arcTo(cx - w / 2, cy + h / 2, cx - w / 2, cy - h / 2, r);
  ctx.lineTo(cx - w / 2, cy - h / 2 + r);
  ctx.arcTo(cx - w / 2, cy - h / 2, cx + w / 2, cy - h / 2, r);
  ctx.closePath();
  ctx.stroke();

  // Inner visor display frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  const iw = w - 48;
  const ih = h - 48;
  const ir = 35;
  ctx.moveTo(cx - iw / 2 + ir, cy - ih / 2);
  ctx.lineTo(cx + iw / 2 - ir, cy - ih / 2);
  ctx.arcTo(cx + iw / 2, cy - ih / 2, cx + iw / 2, cy + ih / 2, ir);
  ctx.lineTo(cx + iw / 2, cy + ih / 2 - ir);
  ctx.arcTo(cx + iw / 2, cy + ih / 2, cx, cy + ih / 2, ir);
  ctx.lineTo(cx + 50, cy + ih / 2);
  ctx.quadraticCurveTo(cx, cy + ih / 2 - 32, cx - 50, cy + ih / 2);
  ctx.lineTo(cx - iw / 2 + ir, cy + ih / 2);
  ctx.arcTo(cx - iw / 2, cy + ih / 2, cx - iw / 2, cy - ih / 2, ir);
  ctx.lineTo(cx - iw / 2, cy - ih / 2 + ir);
  ctx.arcTo(cx - iw / 2, cy - ih / 2, cx + iw / 2, cy - ih / 2, ir);
  ctx.closePath();
  ctx.stroke();

  // Two Front Lenses / Camera Sensor Rings
  [-115, 115].forEach((lx) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx + lx, cy - 8, 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + lx, cy - 8, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(20, 40, 75, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx + lx, cy - 8, 26, -0.6 * Math.PI, 0.1 * Math.PI);
    ctx.stroke();
  });

  // Left & Right Horizontal Head Straps
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy - 10);
  ctx.lineTo(cx - w / 2 - 95, cy - 10);
  ctx.stroke();
  ctx.strokeRect(cx - w / 2 - 110, cy - 30, 16, 40);

  ctx.beginPath();
  ctx.moveTo(cx + w / 2, cy - 10);
  ctx.lineTo(cx + w / 2 + 95, cy - 10);
  ctx.stroke();
  ctx.strokeRect(cx + w / 2 + 94, cy - 30, 16, 40);

  // Top strap bracket
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx, cy - h / 2 - 50);
  ctx.stroke();
  ctx.strokeRect(cx - 24, cy - h / 2 - 62, 48, 14);

  // Radiant Orange Halo Arcs flanking the headset
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, 390, 0.76 * Math.PI, 1.24 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 390, -0.24 * Math.PI, 0.24 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 122, 0, 0.45)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 430, 0.80 * Math.PI, 1.20 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 430, -0.20 * Math.PI, 0.20 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

/** Multi-Tone Artificial Turf Grass Texture Generator */
function getRealisticTurfTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3a8726';
  ctx.fillRect(0, 0, 512, 512);

  const bladeColors = ['#4ca632', '#2f721e', '#59bc38', '#265d18', '#63ca40', '#367c22'];
  for (let i = 0; i < 35000; i++) {
    const bx = Math.random() * 512;
    const by = Math.random() * 512;
    const blen = 6 + Math.random() * 8;
    const bcol = bladeColors[Math.floor(Math.random() * bladeColors.length)];
    ctx.strokeStyle = bcol;
    ctx.lineWidth = 1.2 + Math.random() * 0.8;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + (Math.random() - 0.5) * 4, by - blen);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 3);
  tex.anisotropy = 8;
  return tex;
}

/** Pristine AR / VR Lab Gray Marble Floor Texture (1.2m Tile Seams, Zero Stray Lines) */
let _cachedArVrFloorTex = null;

function getArVrFloorTexture() {
  if (_cachedArVrFloorTex) return _cachedArVrFloorTex;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const W = isMobile ? 1024 : 2048;
  const H = isMobile ? 1024 : 2048;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Light-to-mid gray marble base (#B4B4B8)
  ctx.fillStyle = '#b4b4b8';
  ctx.fillRect(0, 0, W, H);

  // Multi-scale marble mineral clouds
  for (let i = 0; i < 45; i++) {
    const rx = Math.random() * W;
    const ry = Math.random() * H;
    const rad = 80 + Math.random() * 220;
    const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
    const isLighter = Math.random() > 0.45;
    grad.addColorStop(0, isLighter ? 'rgba(235, 235, 240, 0.28)' : 'rgba(150, 150, 156, 0.22)');
    grad.addColorStop(1, 'rgba(180, 180, 184, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Flowing marble veining (smoky slate and crisp white veins)
  function drawVeinBranch(x0, y0, length, angle, width, col) {
    ctx.strokeStyle = col;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    let cx = x0, cy = y0;
    ctx.moveTo(cx, cy);
    const steps = 14;
    for (let s = 0; s < steps; s++) {
      angle += (Math.random() - 0.5) * 0.45;
      const stepLen = length / steps;
      cx += Math.cos(angle) * stepLen;
      cy += Math.sin(angle) * stepLen;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  for (let v = 0; v < 36; v++) {
    const vx = Math.random() * W;
    const vy = Math.random() * H;
    const vlen = 180 + Math.random() * 380;
    const vang = -0.55 + (Math.random() - 0.5) * 0.6;
    const isWhite = Math.random() > 0.4;
    const vcol = isWhite ? 'rgba(255, 255, 255, 0.32)' : 'rgba(135, 135, 142, 0.25)';
    drawVeinBranch(vx, vy, vlen, vang, 1.5 + Math.random() * 2.5, vcol);
  }

  // Crisp, faint tile grout seams (every 1.20m in room space)
  const tileSize = W / 11.66;
  ctx.strokeStyle = 'rgba(110, 110, 116, 0.35)';
  ctx.lineWidth = 1.8;
  for (let tx = 0; tx <= W; tx += tileSize) {
    ctx.beginPath();
    ctx.moveTo(tx, 0);
    ctx.lineTo(tx, H);
    ctx.stroke();
  }
  for (let ty = 0; ty <= H; ty += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, ty);
    ctx.lineTo(W, ty);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;

  _cachedArVrFloorTex = tex;
  return tex;
}

/** Low-Poly White VR Headset */
function createMiniVrHeadset(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xf8fafc, { roughness: 0.3 });
  const blackMat = M(0x18181c, { roughness: 0.5 });

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.15), whiteMat);
  g.add(visor);
  box(g, 0.23, 0.12, 0.04, blackMat, 0, 0, -0.08);
  box(g, 0.02, 0.04, 0.22, blackMat, -0.12, 0, -0.05);
  box(g, 0.02, 0.04, 0.22, blackMat, 0.12, 0, -0.05);
  box(g, 0.24, 0.04, 0.02, blackMat, 0, 0, -0.16);

  parent.add(g);
}

/** Low-Poly VR Motion Controller */
function createMiniVrController(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const mat = M(0x222226, { roughness: 0.45 });

  cyl(g, 0.022, 0.018, 0.14, mat, 0, 0, 0, 8);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.010, 8, 16), mat);
  halo.position.set(0, 0.08, 0.02);
  halo.rotation.x = 0.5;
  g.add(halo);

  parent.add(g);
}

/** Stack of 2 Colorful Hardcover Books */
function createMiniBookStack(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const b1 = box(g, 0.24, 0.035, 0.18, M(0x0284c7), 0, 0.018, 0);
  const b2 = box(g, 0.22, 0.035, 0.16, M(C.orange), 0.01, 0.053, 0);
  b2.rotation.y = 0.15;

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// VECTOR ART HELPERS FOR CANVAS MURAL TEXTURE
// ─────────────────────────────────────────────────────────────────────────────

/** SRI Lotus Logo Helper */
function drawSriLotusEmblem(ctx, cx, cy, r, opts = {}) {
  const treeTop = cy - r * 1.05;
  const stemBase = cy - r * 0.05;

  ctx.fillStyle = opts.stemCol || '#c05010';
  ctx.fillRect(cx - r * 0.07, treeTop + r * 0.55, r * 0.14, stemBase - (treeTop + r * 0.55));

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
    ctx.fillStyle = opts.leafCol || `rgb(${red},${grn},10)`;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }

  // "SRI" in bold serif
  const fontSize = Math.round(r * 1.05);
  ctx.fillStyle = opts.textCol || '#14284b';
  ctx.font = `900 ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('SRI', cx, stemBase + r * 0.08);

  // Orange swoosh underline
  const swY = stemBase + r * 0.08 + fontSize + r * 0.08;
  ctx.strokeStyle = opts.swooshCol || '#ff7a00';
  ctx.lineWidth = Math.max(4, r * 0.13);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.0, swY);
  ctx.quadraticCurveTo(cx + r * 0.15, swY + r * 0.38, cx + r * 1.0, swY - r * 0.08);
  ctx.stroke();
}

/** Orange Sketch-Style Isometric Cube with Dashed Orbital Circle */
function drawSketchCubeWithCircle(ctx, cx, cy, radius = 70, s = 36) {
  ctx.save();
  // Dashed orbital circle
  ctx.strokeStyle = 'rgba(255, 122, 0, 0.45)';
  ctx.lineWidth = Math.max(2, Math.round(radius * 0.05));
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Isometric orange cube
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = Math.max(3, Math.round(s * 0.12));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const dx = s * Math.cos(Math.PI / 6);
  const dy = s * Math.sin(Math.PI / 6);

  // Top face
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.lineTo(cx + dx, cy - dy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - dx, cy - dy);
  ctx.closePath();
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(cx - dx, cy - dy);
  ctx.lineTo(cx - dx, cy + s - dy);
  ctx.lineTo(cx, cy + s);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + s);
  ctx.lineTo(cx + dx, cy + s - dy);
  ctx.lineTo(cx + dx, cy - dy);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

/** Navy Line-Art Silhouette of Person Wearing VR Headset */
function drawVrPersonSilhouette(ctx, cx, cy, scale = 1.0) {
  ctx.save();
  ctx.strokeStyle = '#14284b';
  ctx.lineWidth = Math.max(3, Math.round(6 * scale));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const rHead = 38 * scale;
  // Head outline
  ctx.beginPath();
  ctx.arc(cx, cy - 20 * scale, rHead, 0, Math.PI * 2);
  ctx.stroke();

  // VR Headset on face
  ctx.fillStyle = '#14284b';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cx - 24 * scale, cy - 34 * scale, 52 * scale, 26 * scale, 8 * scale);
  } else {
    ctx.rect(cx - 24 * scale, cy - 34 * scale, 52 * scale, 26 * scale);
  }
  ctx.fill();

  // Headband
  ctx.beginPath();
  ctx.moveTo(cx - 24 * scale, cy - 21 * scale);
  ctx.lineTo(cx - 40 * scale, cy - 18 * scale);
  ctx.stroke();

  // Neck & Shoulders
  ctx.beginPath();
  ctx.moveTo(cx - 12 * scale, cy + 18 * scale);
  ctx.lineTo(cx - 32 * scale, cy + 52 * scale);
  ctx.lineTo(cx + 32 * scale, cy + 52 * scale);
  ctx.lineTo(cx + 12 * scale, cy + 18 * scale);
  ctx.stroke();

  // Orange holographic wireframe cube in front of headset
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = Math.max(2, Math.round(4 * scale));
  ctx.strokeRect(cx + 42 * scale, cy - 32 * scale, 34 * scale, 34 * scale);
  ctx.restore();
}

/** Vector Icons for the Navy Panel, VR Wall and TV Screen */
function drawPanelVectorIcon(ctx, cx, cy, type, scale = 1.0, strokeColor = '#ffffff') {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = Math.max(3, Math.round(4.5 * scale));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'headset') {
    const hw = 26 * scale, hh = 14 * scale;
    ctx.strokeRect(cx - hw, cy - hh, hw * 2, hh * 2);
    ctx.beginPath();
    ctx.moveTo(cx - hw, cy);
    ctx.lineTo(cx - hw - 12 * scale, cy);
    ctx.moveTo(cx + hw, cy);
    ctx.lineTo(cx + hw + 12 * scale, cy);
    ctx.stroke();
  } else if (type === 'ar') {
    const sz = 20 * scale;
    const cr = 8 * scale;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(cx - sz, cy - sz + cr); ctx.lineTo(cx - sz, cy - sz); ctx.lineTo(cx - sz + cr, cy - sz);
    // Top-right
    ctx.moveTo(cx + sz - cr, cy - sz); ctx.lineTo(cx + sz, cy - sz); ctx.lineTo(cx + sz, cy - sz + cr);
    // Bottom-left
    ctx.moveTo(cx - sz, cy + sz - cr); ctx.lineTo(cx - sz, cy + sz); ctx.lineTo(cx - sz + cr, cy + sz);
    // Bottom-right
    ctx.moveTo(cx + sz - cr, cy + sz); ctx.lineTo(cx + sz, cy + sz); ctx.lineTo(cx + sz, cy + sz - cr);
    ctx.stroke();
  } else if (type === 'circle360') {
    const rad = 20 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();
    // Arrow tip
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(0.2 * Math.PI) * rad - 5 * scale, cy + Math.sin(0.2 * Math.PI) * rad - 5 * scale);
    ctx.lineTo(cx + Math.cos(0.2 * Math.PI) * rad, cy + Math.sin(0.2 * Math.PI) * rad);
    ctx.lineTo(cx + Math.cos(0.2 * Math.PI) * rad + 5 * scale, cy + Math.sin(0.2 * Math.PI) * rad - 3 * scale);
    ctx.stroke();

    ctx.fillStyle = strokeColor;
    ctx.font = `bold ${Math.round(14 * scale)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('360°', cx, cy);
  } else if (type === 'cube3d') {
    const s = 14 * scale;
    const off = 7 * scale;
    ctx.strokeRect(cx - s - off / 2, cy - s + off / 2, s * 2, s * 2);
    ctx.strokeRect(cx - s + off / 2, cy - s - off / 2, s * 2, s * 2);
    ctx.beginPath();
    ctx.moveTo(cx - s - off / 2, cy - s + off / 2); ctx.lineTo(cx - s + off / 2, cy - s - off / 2);
    ctx.moveTo(cx + s - off / 2, cy - s + off / 2); ctx.lineTo(cx + s + off / 2, cy - s - off / 2);
    ctx.moveTo(cx - s - off / 2, cy + s + off / 2); ctx.lineTo(cx - s + off / 2, cy + s - off / 2);
    ctx.moveTo(cx + s - off / 2, cy + s + off / 2); ctx.lineTo(cx + s + off / 2, cy + s - off / 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** Generic White VR Headset on Pegboard Hook */
function createGenericVrHeadsetProp(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xf8fafc, { roughness: 0.25 });
  const darkMat = M(0x18181c, { roughness: 0.5 });
  const hookMat = M(0x222226, { metalness: 0.8, roughness: 0.3 });

  // Pegboard black metal hook
  cyl(g, 0.005, 0.005, 0.08, hookMat, 0, 0, -0.04, 8).rotation.x = Math.PI / 2;

  // Front visor body (rounded, modern VR headset)
  box(g, 0.26, 0.13, 0.11, whiteMat, 0, 0, 0.05);

  // Black side hinge/mount blocks
  box(g, 0.025, 0.035, 0.04, darkMat, -0.135, 0, 0.03);
  box(g, 0.025, 0.035, 0.04, darkMat, +0.135, 0, 0.03);

  // Two front optical camera tracking dots
  cyl(g, 0.007, 0.007, 0.004, M(0x0a0a0e), -0.08, 0, 0.106, 12).rotation.x = Math.PI / 2;
  cyl(g, 0.007, 0.007, 0.004, M(0x0a0a0e), +0.08, 0, 0.106, 12).rotation.x = Math.PI / 2;

  // Dark curved headstrap
  const strapGeom = new THREE.TorusGeometry(0.09, 0.012, 6, 18, Math.PI);
  const strapMesh = new THREE.Mesh(strapGeom, darkMat);
  strapMesh.rotation.x = Math.PI / 2;
  strapMesh.position.set(0, 0.02, 0.01);
  g.add(strapMesh);

  parent.add(g);
}

/** Generic White VR Controller on Pegboard Hook */
function createGenericVrControllerProp(parent, x, y, z, tiltZ = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.z = tiltZ;

  const whiteMat = M(0xf8fafc, { roughness: 0.25 });
  const darkMat = M(0x18181c, { roughness: 0.5 });
  const hookMat = M(0x222226, { metalness: 0.8, roughness: 0.3 });

  // Metal hook
  cyl(g, 0.004, 0.004, 0.06, hookMat, 0, 0.05, -0.03, 8).rotation.x = Math.PI / 2;

  // Handle grip
  cyl(g, 0.014, 0.012, 0.14, whiteMat, 0, -0.02, 0.02, 12);

  // Tracking ring / halo on top
  const haloGeom = new THREE.TorusGeometry(0.042, 0.007, 8, 20);
  const haloMesh = new THREE.Mesh(haloGeom, whiteMat);
  haloMesh.rotation.x = 0.45;
  haloMesh.position.set(0, 0.045, 0.03);
  g.add(haloMesh);

  // Black thumbstick and button cluster
  cyl(g, 0.006, 0.006, 0.012, darkMat, 0, 0.045, 0.015, 8);

  parent.add(g);
}

/** Tidy Storage Bin with Top Lip */
function createStorageBin(parent, x, y, z, w, h, d, mat) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Bin main box body
  box(g, w, h, d, mat, 0, h / 2, 0);
  // Reinforced molded top lip
  box(g, w + 0.02, 0.018, d + 0.02, mat, 0, h - 0.009, 0);
  // Recessed front handle pocket
  box(g, 0.12, 0.035, 0.012, M(0x18181c), 0, h - 0.06, d / 2 + 0.002);

  parent.add(g);
}

/** Black Flight / Equipment Hard Case with Silver Latches & Braces */
function createFlightHardCase(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const w = 0.62, h = 0.22, d = 0.44;
  const blackShellMat = M(0x111827, { roughness: 0.5 });
  const silverMetalMat = M(0xd1d5db, { metalness: 0.9, roughness: 0.2 });

  // Main case body
  box(g, w, h, d, blackShellMat, 0, h / 2, 0);

  // Aluminum center rim extrusion
  box(g, w + 0.006, 0.015, d + 0.006, silverMetalMat, 0, h / 2, 0);

  // 4 Silver corner edge protectors on the front
  [-w / 2 + 0.025, w / 2 - 0.025].forEach((cx) => {
    [0.025, h - 0.025].forEach((cy) => {
      box(g, 0.04, 0.04, 0.012, silverMetalMat, cx, cy, d / 2 + 0.002);
    });
  });

  // 2 Silver draw-latches on front face
  box(g, 0.045, 0.055, 0.014, silverMetalMat, -0.16, h / 2, d / 2 + 0.004);
  box(g, 0.045, 0.055, 0.014, silverMetalMat, +0.16, h / 2, d / 2 + 0.004);

  // Center carry handle
  box(g, 0.14, 0.018, 0.035, M(0x1f2937), 0, h / 2, d / 2 + 0.025);

  parent.add(g);
}

/** Clear Frosted Acrylic Storage Box with Visible Accessories Inside */
function createTransparentStorageBox(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const w = 0.38, h = 0.13, d = 0.44;
  const acrylicMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.36,
    roughness: 0.1,
    transmission: 0.82,
    depthWrite: false,
  });

  // Transparent box body
  box(g, w, h, d, acrylicMat, 0, h / 2, 0);

  // Opaque lid and rim latches
  box(g, w + 0.01, 0.014, d + 0.01, M(0xe2e8f0, { roughness: 0.4 }), 0, h - 0.007, 0);
  box(g, 0.04, 0.025, 0.015, M(0x94a3b8), -w / 2 - 0.004, h - 0.015, 0);
  box(g, 0.04, 0.025, 0.015, M(0x94a3b8), +w / 2 + 0.004, h - 0.015, 0);

  // Stored hardware components inside box
  box(g, 0.22, 0.06, 0.26, M(0x1e293b, { roughness: 0.5 }), 0, 0.035, 0);

  parent.add(g);
}

/** Dev-Only Safe Area Check to Assert Zero Overlaps and Zero Margin Violations */
function checkMuralSafeAreas(W, H, blocks) {
  const safeTop = H * 0.05;
  const warnings = [];
  blocks.forEach((b) => {
    if (b.y1 < safeTop) {
      warnings.push(`[Safe-Area Warning] Block '${b.id}' y1 (${b.y1}) touches or exceeds 5% safe top margin (${safeTop})`);
    }
    if (b.x1 < 0 || b.x2 > W || b.y2 > H) {
      warnings.push(`[Safe-Area Warning] Block '${b.id}' exceeds canvas bounds [0,0,${W},${H}]`);
    }
  });

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const A = blocks[i], B = blocks[j];
      const overlap = !(A.x2 < B.x1 || A.x1 > B.x2 || A.y2 < B.y1 || A.y1 > B.y2);
      if (overlap) {
        warnings.push(`[Safe-Area Warning] OVERLAP between '${A.id}' [${Math.round(A.x1)},${Math.round(A.y1)},${Math.round(A.x2)},${Math.round(A.y2)}] and '${B.id}' [${Math.round(B.x1)},${Math.round(B.y1)},${Math.round(B.x2)},${Math.round(B.y2)}]`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn('[Safe-Area Check] Overlaps/Bounds warnings found:\n' + warnings.join('\n'));
  } else {
    console.log(`[Safe-Area Check] PASSED: 0 overlaps, 0 edge violations across ${blocks.length} blocks!`);
  }
  return { passed: warnings.length === 0, warnings, blocks };
}
