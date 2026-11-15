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
import { createPlant } from '../props/furniture.js';
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
  // 1. MARBLE FLOOR SLAB (Exact matching gray marble)
  // ═══════════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. INDUSTRIAL DARK CEILING & LIGHTING
  // ═══════════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ARCHITECTURAL WALLS & SKIRTING
  // ═══════════════════════════════════════════════════════════════════════════
  // North Wall (Z = zMin, Main Display Wall)
  box(g, roomW, roomH, wallThick, wallMat, centerX, floorY + roomH / 2, zMin - wallThick / 2);
  // South Wall (Z = zMax, Immersive Lounge Wall)
  box(g, roomW, roomH, wallThick, wallMat, centerX, floorY + roomH / 2, zMax + wallThick / 2);
  // East Wall (X = xMax, Large Window Wall)
  box(g, wallThick, roomH, roomL, wallMat, xMax + wallThick / 2, floorY + roomH / 2, centerZ);

  // West Wall (X = xMin, Door Side adjoining main robotics lab)
  // Split around the door opening at z = 4.15 to 5.45 (height 2.40m)
  const doorZMin = 4.15;
  const doorZMax = 5.45;
  const doorH = 2.40;
  // West Wall North portion (zMin to 4.15m)
  const wNorthL = doorZMin - zMin; // 1.75m
  box(g, wallThick, roomH, wNorthL, wallMat, xMin - wallThick / 2, floorY + roomH / 2, zMin + wNorthL / 2);
  // West Wall South portion (5.45m to zMax)
  const wSouthL = zMax - doorZMax; // 10.95m
  box(g, wallThick, roomH, wSouthL, wallMat, xMin - wallThick / 2, floorY + roomH / 2, doorZMax + wSouthL / 2);
  // Header beam above door (y = 2.45 to 3.65)
  box(g, wallThick, roomH - doorH, doorZMax - doorZMin, wallMat, xMin - wallThick / 2, floorY + doorH + (roomH - doorH) / 2, (doorZMin + doorZMax) / 2);

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
  // West skirting (split around door)
  box(g, 0.03, skH, wNorthL, navyMat, xMin + 0.015, floorY + skH / 2, zMin + wNorthL / 2);
  box(g, 0.032, 0.015, wNorthL, orangeMat, xMin + 0.015, floorY + skH, zMin + wNorthL / 2);
  box(g, 0.03, skH, wSouthL, navyMat, xMin + 0.015, floorY + skH / 2, doorZMax + wSouthL / 2);
  box(g, 0.032, 0.015, wSouthL, orangeMat, xMin + 0.015, floorY + skH, doorZMax + wSouthL / 2);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. NORTH WALL: COMPLETE MAIN DISPLAY WALL & HIGH-RES MURAL
  // ═══════════════════════════════════════════════════════════════════════════
  buildMainDisplayWall(g, centerX, zMin, floorY, roomW, roomH);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. EAST WALL: LARGE WINDOWS WITH ROLLER BLINDS & DAYLIGHT
  // ═══════════════════════════════════════════════════════════════════════════
  buildEastWindowWall(g, xMax, centerZ, floorY, roomL, roomH);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. WEST WALL: VR EQUIPMENT ZONE (PEGBOARD, BINS, GLASS RACK)
  // ═══════════════════════════════════════════════════════════════════════════
  buildVrEquipmentZone(g, xMin, floorY, zMin, zMax);

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. SOUTH WALL: IMMERSIVE LOUNGE (TURF, BEAN BAGS, BOOKCASES, VR GRAPHIC)
  // ═══════════════════════════════════════════════════════════════════════════
  buildImmersiveLounge(g, centerX, zMax, floorY, roomW);

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. CENTER: TEACHING ZONE (TABLES, 24 NAVY SEAT CHAIRS, 1.8M AISLE)
  // ═══════════════════════════════════════════════════════════════════════════
  buildTeachingZone(g, centerX, floorY);

  scene.add(g);
  return anim;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DISPLAY WALL (North Wall, Z = zMin)
// ─────────────────────────────────────────────────────────────────────────────
function buildMainDisplayWall(parent, cx, zMin, floorY, roomW, roomH) {
  const g = new THREE.Group();
  g.position.set(cx, floorY, zMin);

  // 1. High-Resolution Painted Wall Texture (4096x2048)
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const W = isMobile ? 2048 : 4096;
  const H = isMobile ? 1024 : 2048;

  const muralTex = canvasTex(W, H, (ctx) => {
    // Cream base wall paint
    ctx.fillStyle = '#fff1e3';
    ctx.fillRect(0, 0, W, H);

    // Subtle realistic paint grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < 30000; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }

    // ── LEFT ANGLED NAVY PANEL WITH 4 STACKED ICONS ──
    ctx.save();
    ctx.shadowColor = 'rgba(20, 40, 75, 0.3)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 8;
    ctx.fillStyle = '#14284b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W * 0.16, 0);
    ctx.lineTo(W * 0.12, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Orange diagonal accent stripe
    ctx.fillStyle = '#ff7a00';
    ctx.beginPath();
    ctx.moveTo(W * 0.16, 0);
    ctx.lineTo(W * 0.168, 0);
    ctx.lineTo(W * 0.128, H);
    ctx.lineTo(W * 0.12, H);
    ctx.closePath();
    ctx.fill();

    // 4 Stacked Icons on Navy Panel
    const panelItems = [
      { icon: 'headset', label: 'Virtual\nReality' },
      { icon: 'ar', label: 'Augmented\nReality' },
      { icon: 'circle360', label: '360°\nImmersive\nLearning' },
      { icon: 'cube3d', label: '3D\nVisualization' },
    ];
    panelItems.forEach((item, idx) => {
      const iy = H * 0.18 + idx * (H * 0.19);
      const ix = W * 0.065;
      drawPanelVectorIcon(ctx, ix, iy, item.icon);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(W * 0.0125)}px 'Segoe UI', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const lines = item.label.split('\n');
      lines.forEach((l, li) => {
        ctx.fillText(l, ix, iy + W * 0.024 + li * (W * 0.014));
      });
    });

    // ── TOP-CENTER TITLE HEADER ──
    const midX = W * 0.54;
    const topY = H * 0.15;

    // (A) Left: Orange sketch-style isometric cube with dashed circle
    drawSketchCubeWithCircle(ctx, midX - W * 0.26, topY);

    // (B) Center SRI Logo + Tree
    drawSriLotusEmblem(ctx, midX - W * 0.11, topY, W * 0.042);

    // Thin vertical divider line
    ctx.fillStyle = '#ff7a00';
    ctx.fillRect(midX - W * 0.025, topY - H * 0.06, 6, H * 0.12);

    // "AR / VR LAB" Title (AR / VR in navy italic bold, LAB in orange)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `italic 900 ${Math.round(W * 0.038)}px 'Segoe UI', system-ui, sans-serif`;
    ctx.fillStyle = '#14284b';
    ctx.fillText('AR / VR ', midX - W * 0.01, topY - H * 0.01);
    const arw = ctx.measureText('AR / VR ').width;
    ctx.fillStyle = '#ff7a00';
    ctx.fillText('LAB', midX - W * 0.01 + arw, topY - H * 0.01);

    // Sub-motto: "— EXPLORE • CREATE • EXPERIENCE • BUILD —"
    ctx.fillStyle = '#14284b';
    ctx.font = `900 ${Math.round(W * 0.014)}px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('—  EXPLORE  •  CREATE  •  EXPERIENCE  •  BUILD  —', midX - W * 0.01, topY + H * 0.045);

    // (C) Right: Navy line-art person wearing VR headset with orange wireframe cube
    drawVrPersonSilhouette(ctx, midX + W * 0.25, topY);
  });

  const muralMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, roomH),
    new THREE.MeshBasicMaterial({ map: muralTex })
  );
  muralMesh.position.set(0, roomH / 2, 0.01);
  g.add(muralMesh);

  // 2. Center Wall-Mounted 75" Smart TV Display (3.2m x 1.8m)
  const tvW = 3.20, tvH = 1.80;
  const tvY = 2.05;

  const tvScreenTex = canvasTex(1024, 576, (ctx) => {
    // Deep blue-purple tech gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 576);
    grad.addColorStop(0, '#0a1226');
    grad.addColorStop(0.5, '#122550');
    grad.addColorStop(1, '#1b3a6b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 576);

    // Orange dynamic curves at bottom
    ctx.fillStyle = '#ff7a00';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.bezierCurveTo(300, 420, 700, 560, 1024, 460);
    ctx.lineTo(1024, 576);
    ctx.lineTo(0, 576);
    ctx.closePath();
    ctx.fill();

    // Top SRI Logo Emblem
    drawSriLotusEmblem(ctx, 512, 100, 32);

    // Title text
    ctx.fillStyle = '#ffffff';
    ctx.font = `italic 700 48px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AR / VR Lab', 512, 175);

    // 4 White Rounded App Cards
    const cards = [
      { icon: '🥽', name: 'VR Suite' },
      { icon: '📱', name: 'AR Scan' },
      { icon: '🔄', name: '360° Lab' },
      { icon: '🧊', name: '3D Spatial' },
    ];
    cards.forEach((c, i) => {
      const bx = 200 + i * 165;
      const by = 260;
      // White rounded background card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.roundRect(bx - 60, by, 120, 105, 14);
      ctx.fill();

      ctx.font = '40px sans-serif';
      ctx.fillText(c.icon, bx, by + 45);

      ctx.fillStyle = '#14284b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(c.name, bx, by + 85);
    });
  });

  const tvScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(tvW, tvH),
    new THREE.MeshBasicMaterial({ map: tvScreenTex })
  );
  tvScreen.position.set(0, tvY, 0.08);
  g.add(tvScreen);

  // Black metallic TV frame / bezel
  box(g, tvW + 0.08, tvH + 0.08, 0.05, M(0x111115, { roughness: 0.35, metalness: 0.8 }), 0, tvY, 0.04);
  // Slim top webcam bar
  box(g, 0.20, 0.03, 0.04, M(0x222226), 0, tvY + tvH / 2 + 0.02, 0.06);

  // 3. Navy Lowline Credenza / Cabinet below TV
  const credW = 6.60, credH = 0.68, credD = 0.58;
  const credY = credH / 2;
  // Deep navy body
  box(g, credW, credH - 0.04, credD, M(C.navy, { roughness: 0.5 }), 0, credY - 0.02, credD / 2);
  // Blonde wood countertop
  box(g, credW + 0.04, 0.04, credD + 0.04, M(0xd4a373, { roughness: 0.4 }), 0, credH - 0.02, credD / 2);
  // Cabinet door division grooves and chrome pull handles
  for (let d = -2.4; d <= 2.4; d += 1.2) {
    box(g, 0.015, credH - 0.12, 0.02, M(0x0e1b33), d, credY - 0.02, credD + 0.005);
    box(g, 0.12, 0.015, 0.02, M(0xd1d5db, { metalness: 0.8 }), d + 0.45, credY + 0.15, credD + 0.015);
  }

  // 4. Floating Wooden Shelves on Left and Right of TV with LED Strips
  const shelfXPositions = [-2.60, 2.60];
  const shelfHeights = [1.25, 1.85, 2.45];
  const shelfW = 1.70, shelfD = 0.30, shelfT = 0.04;

  shelfXPositions.forEach((sx) => {
    shelfHeights.forEach((sy, tier) => {
      // Wood shelf plank
      box(g, shelfW, shelfT, shelfD, M(0xd4a373, { roughness: 0.4 }), sx, sy, shelfD / 2);
      // Warm LED underglow strip
      box(g, shelfW - 0.1, 0.01, 0.03, Bm(0xfff6e5), sx, sy - shelfT / 2 - 0.005, shelfD / 2);

      // Shelf props
      if (tier === 0) {
        // Bottom shelf: Books and controllers
        createMiniBookStack(g, sx - 0.50, sy + 0.12, shelfD / 2);
        createMiniVrController(g, sx + 0.20, sy + 0.06, shelfD / 2);
        createMiniVrController(g, sx + 0.45, sy + 0.06, shelfD / 2);
      } else if (tier === 1) {
        // Middle shelf: White VR Headset in center & small succulent
        createMiniVrHeadset(g, sx, sy + 0.11, shelfD / 2);
        createPlant(g, sx + 0.55, sy + shelfT / 2, shelfD / 2, 0.35);
      } else if (tier === 2) {
        // Top shelf: Another VR headset and hanging trailing ivy plant
        createMiniVrHeadset(g, sx - 0.35, sy + 0.11, shelfD / 2);
        createPlant(g, sx + 0.45, sy + shelfT / 2, shelfD / 2, 0.45);
      }
    });
  });

  // 5. Black-Framed Glass Door/Window Panels Flanking Outer Shelves
  [-4.80, 4.80].forEach((gx) => {
    const gw = 1.80, gh = 2.60;
    // Outer black frame
    box(g, gw, gh, 0.08, M(0x111116, { roughness: 0.4, metalness: 0.5 }), gx, gh / 2, 0.05);
    // Dark tinted translucent glass pane
    const gMat = new THREE.MeshPhysicalMaterial({
      color: 0x90b5d0,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const gPane = new THREE.Mesh(new THREE.PlaneGeometry(gw - 0.1, gh - 0.1), gMat);
    gPane.position.set(gx, gh / 2, 0.05);
    g.add(gPane);
  });

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

  // Tall corner indoor palm plant
  createPlant(g, -winW / 2 + 0.8, 0, 0.8, 1.6);

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// VR EQUIPMENT ZONE (Right / West Wall, X = xMin)
// ─────────────────────────────────────────────────────────────────────────────
function buildVrEquipmentZone(parent, xMin, floorY, zMin, zMax) {
  const g = new THREE.Group();
  g.position.set(xMin, floorY, 0);
  g.rotation.y = Math.PI / 2;

  // The VR Equipment wall sits along z = 6.20 to 13.60m (comfortably past the door)
  const zoneZ = 9.80;
  const zoneL = 7.00;

  // 1. Navy Painted Wall Accent Panel Behind Pegboard
  const navyPanelTex = canvasTex(1024, 512, (ctx) => {
    ctx.fillStyle = '#14284b';
    ctx.fillRect(0, 0, 1024, 512);

    // Orange circuit tech lines
    ctx.strokeStyle = '#ff7a00';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(40, 60);
    ctx.lineTo(240, 60);
    ctx.lineTo(320, 140);
    ctx.lineTo(760, 140);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(40, 60, 12, 0, Math.PI * 2);
    ctx.arc(760, 140, 12, 0, Math.PI * 2);
    ctx.fill();
  });
  const navyPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(zoneL, 3.2),
    new THREE.MeshBasicMaterial({ map: navyPanelTex })
  );
  navyPanel.position.set(-zoneZ, 1.65, 0.01);
  g.add(navyPanel);

  // 2. White Perforated Pegboard Section (3 Panels, z = 7.2 to 11.2)
  const pegTex = canvasTex(512, 256, (ctx) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#cbd5e1';
    for (let r = 16; r < 256; r += 20) {
      for (let c = 16; c < 512; c += 20) {
        ctx.beginPath();
        ctx.arc(c, r, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  const pegMat = new THREE.MeshStandardMaterial({ map: pegTex, roughness: 0.6 });
  const pegBoardW = 3.80, pegBoardH = 1.30, pegY = 2.15;
  const pegMesh = new THREE.Mesh(new THREE.PlaneGeometry(pegBoardW, pegBoardH), pegMat);
  pegMesh.position.set(-9.20, pegY, 0.05);
  g.add(pegMesh);

  // Metal outer frame around pegboards
  box(g, pegBoardW + 0.06, 0.04, 0.06, M(0x222226), -9.20, pegY + pegBoardH / 2, 0.04);
  box(g, pegBoardW + 0.06, 0.04, 0.06, M(0x222226), -9.20, pegY - pegBoardH / 2, 0.04);

  // Hanging Generic White VR Headsets and Black Controllers on the Pegboard
  const pegHeadsetZ = [-8.0, -9.2, -10.4];
  pegHeadsetZ.forEach((hz) => {
    // Upper row: Headsets
    createMiniVrHeadset(g, hz, pegY + 0.28, 0.12);
    // Lower row: Controller pairs hanging from hooks
    createMiniVrController(g, hz - 0.18, pegY - 0.25, 0.08);
    createMiniVrController(g, hz + 0.18, pegY - 0.25, 0.08);
  });

  // 3. Lower Storage Counter with Navy Cabinet Doors and Wooden Top
  const counterL = 4.40, counterH = 0.86, counterD = 0.65;
  const counterY = counterH / 2;
  // Navy cabinet body
  box(g, counterL, counterH - 0.04, counterD, M(C.navy, { roughness: 0.5 }), -9.20, counterY - 0.02, counterD / 2);
  // Solid wood countertop
  box(g, counterL + 0.04, 0.04, counterD + 0.04, M(0xd4a373, { roughness: 0.4 }), -9.20, counterH - 0.02, counterD / 2);

  // 4. Row of 7 Bright Orange Storage Bins on Counter
  const binLabels = ['SENSORS', 'CABLES', 'CONTROLLERS', 'TRACKERS', 'LENSES', 'STRAPS', 'ADAPTERS'];
  const binW = 0.48, binD = 0.42, binH = 0.24;
  binLabels.forEach((label, i) => {
    const bx = -11.0 + i * 0.60;
    const by = counterH + binH / 2;
    // Orange bin body
    box(g, binW, binH, binD, M(C.orange, { roughness: 0.55 }), bx, by, counterD / 2);
    // Bin rim / lip
    box(g, binW + 0.02, 0.02, binD + 0.02, M(0xe06000), bx, counterH + binH, counterD / 2);
    // White front label badge
    const labelTex = canvasTex(256, 80, (ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 80);
      ctx.fillStyle = '#14284b';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 128, 40);
    });
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.08), new THREE.MeshBasicMaterial({ map: labelTex }));
    labelMesh.position.set(bx, by, counterD + 0.005);
    g.add(labelMesh);
  });

  // 5. Tall Black-Framed Glass Display Showcase Rack (z = 11.8 to 13.2)
  const rackL = 1.40, rackH = 2.30, rackD = 0.55;
  const rackX = -12.40;
  // Black metal frame pillars
  box(g, 0.04, rackH, 0.04, M(0x18181c, { metalness: 0.8 }), rackX - rackL / 2, rackH / 2, 0.03);
  box(g, 0.04, rackH, 0.04, M(0x18181c, { metalness: 0.8 }), rackX + rackL / 2, rackH / 2, 0.03);
  box(g, 0.04, rackH, 0.04, M(0x18181c, { metalness: 0.8 }), rackX - rackL / 2, rackH / 2, rackD);
  box(g, 0.04, rackH, 0.04, M(0x18181c, { metalness: 0.8 }), rackX + rackL / 2, rackH / 2, rackD);

  // 4 Tempered Glass Shelves with Warm LED Edge Strips
  const glassShelfMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
    depthWrite: false,
  });
  [0.45, 0.95, 1.45, 1.95].forEach((sy) => {
    box(g, rackL - 0.04, 0.012, rackD - 0.04, glassShelfMat, rackX, sy, rackD / 2);
    // Warm LED edge strip
    box(g, rackL - 0.06, 0.008, 0.015, Bm(0xfff5e0), rackX, sy - 0.006, rackD);

    // Boxed headsets and accessories on shelves
    box(g, 0.32, 0.22, 0.26, M(0x1e293b, { roughness: 0.4 }), rackX - 0.35, sy + 0.12, rackD / 2);
    box(g, 0.28, 0.18, 0.22, M(0x334155, { roughness: 0.4 }), rackX + 0.35, sy + 0.10, rackD / 2);
  });

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// IMMERSIVE LOUNGE (South / Back Wall, Z = zMax)
// ─────────────────────────────────────────────────────────────────────────────
function buildImmersiveLounge(parent, cx, zMax, floorY, roomW) {
  const g = new THREE.Group();
  g.position.set(cx, floorY, zMax);
  g.rotation.y = Math.PI;

  // 1. Navy Painted Back Wall with White Line-Art VR Headset Graphic
  const wallTex = canvasTex(2048, 1024, (ctx) => {
    ctx.fillStyle = '#14284b';
    ctx.fillRect(0, 0, 2048, 1024);

    // White Line-Art Futuristic VR Headset
    const hx = 1024, hy = 480;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Headset outer visor contour
    ctx.beginPath();
    ctx.roundRect(hx - 260, hy - 140, 520, 280, 70);
    ctx.stroke();

    // Inner visor screen dividing line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(hx - 220, hy - 100, 440, 200, 40);
    ctx.stroke();

    // Two front sensor cameras
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(hx - 140, hy, 16, 0, Math.PI * 2);
    ctx.arc(hx + 140, hy, 16, 0, Math.PI * 2);
    ctx.fill();

    // Two Orange Curved Halo Arcs flanking the headset
    ctx.strokeStyle = '#ff7a00';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(hx, hy, 360, Math.PI * 0.75, Math.PI * 1.25);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 360, -Math.PI * 0.25, Math.PI * 0.25);
    ctx.stroke();
  });

  const wallMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, 3.6),
    new THREE.MeshBasicMaterial({ map: wallTex })
  );
  wallMesh.position.set(0, 1.8, 0.01);
  g.add(wallMesh);

  // 2. Green Artificial Turf Area Rug (6.2m x 3.8m)
  const turfW = 6.20, turfL = 3.80;
  const turfTex = canvasTex(512, 512, (ctx) => {
    ctx.fillStyle = '#3a7d2c';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#2d6822';
    for (let i = 0; i < 8000; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 4);
    }
  });
  const turfMat = new THREE.MeshStandardMaterial({ map: turfTex, roughness: 0.95 });
  const turfMesh = new THREE.Mesh(new THREE.PlaneGeometry(turfW, turfL), turfMat);
  turfMesh.rotation.x = -Math.PI / 2;
  turfMesh.position.set(0, 0.055, 2.30);
  g.add(turfMesh);

  // Warm LED edge strip perimeter framing the turf rug
  const ledTrimMat = Bm(0xffe899);
  box(g, turfW + 0.04, 0.015, 0.03, ledTrimMat, 0, 0.058, 2.30 - turfL / 2);
  box(g, turfW + 0.04, 0.015, 0.03, ledTrimMat, 0, 0.058, 2.30 + turfL / 2);
  box(g, 0.03, 0.015, turfL + 0.04, ledTrimMat, -turfW / 2, 0.058, 2.30);
  box(g, 0.03, 0.015, turfL + 0.04, ledTrimMat, turfW / 2, 0.058, 2.30);

  // 3. Four Rounded Soft Bean Bags (2 Vibrant Orange, 2 Deep Navy)
  const beanBags = [
    { x: -1.9, z: 1.6, col: C.orange, yaw: 0.4 },
    { x: 1.9, z: 1.6, col: C.navy, yaw: -0.4 },
    { x: -1.8, z: 3.1, col: C.navy, yaw: 1.2 },
    { x: 1.8, z: 3.1, col: C.orange, yaw: -1.2 },
  ];
  beanBags.forEach((bb) => {
    createBeanBagMesh(g, bb.x, bb.z, bb.col, bb.yaw);
  });

  // 4. Round White Coffee Table in Center
  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.03, 24),
    M(0xffffff, { roughness: 0.3 })
  );
  tableTop.position.set(0, 0.42, 2.30);
  g.add(tableTop);

  // Hairpin black steel legs
  for (let a = 0; a < 3; a++) {
    const ang = (a * Math.PI * 2) / 3;
    const lx = Math.cos(ang) * 0.40;
    const lz = 2.30 + Math.sin(ang) * 0.40;
    cyl(g, 0.012, 0.012, 0.40, M(0x18181c, { metalness: 0.8 }), lx, 0.21, lz, 8);
  }

  // Coffee Table Items: Small potted succulent & books
  createPlant(g, 0, 0.44, 2.30, 0.30);
  createMiniBookStack(g, 0.22, 0.45, 2.32);

  // 5. Two Blonde Wood Bookcases Flanking Lounge Wall
  [-4.20, 4.20].forEach((bx) => {
    createLoungeBookcase(g, bx, 0, 0.35);
  });

  // Tall corner indoor plants
  createPlant(g, -5.8, 0, 0.6, 1.8);
  createPlant(g, 5.8, 0, 0.6, 1.8);

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEACHING ZONE (Center, Student Tables & Navy Chairs)
// ─────────────────────────────────────────────────────────────────────────────
function buildTeachingZone(parent, cx, floorY) {
  const g = new THREE.Group();
  g.position.set(cx, floorY, 0);

  // Two blocks of tables: Left Block (cx - 2.8m) and Right Block (cx + 2.8m)
  // Aisle between them is 1.8m wide
  const blockOffsets = [-2.85, 2.85];
  const rowZ = [5.60, 7.30, 9.00]; // 3 rows of long tables, 1.7m apart
  const tblW = 2.70, tblD = 0.82, tblH = 0.74;

  blockOffsets.forEach((bx) => {
    rowZ.forEach((rz) => {
      // 1. Long Study Table
      // Blonde honey wood tabletop
      box(g, tblW, 0.045, tblD, M(0xd8a878, { roughness: 0.4 }), bx, tblH - 0.022, rz);
      // Black bevel edge trim
      box(g, tblW + 0.01, 0.01, tblD + 0.01, M(0x111116), bx, tblH - 0.045, rz);

      // Recessed flush black power/data insert module in center of desk
      box(g, 0.35, 0.005, 0.14, M(0x111115, { metalness: 0.8 }), bx, tblH + 0.003, rz);

      // Black metal leg frames (4 corner legs + crossbeam)
      const legR = 0.025;
      const legMat = M(0x18181c, { roughness: 0.45, metalness: 0.7 });
      [-tblW / 2 + 0.1, tblW / 2 - 0.1].forEach((lx) => {
        [-tblD / 2 + 0.08, tblD / 2 - 0.08].forEach((lz) => {
          box(g, 0.045, tblH - 0.045, 0.045, legMat, bx + lx, (tblH - 0.045) / 2, rz + lz);
        });
        // Side leg connecting brace
        box(g, 0.03, 0.03, tblD - 0.16, legMat, bx + lx, tblH * 0.35, rz);
      });

      // Soft contact shadow plane under table
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(tblW + 0.2, tblD + 0.2), shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(bx, 0.052, rz);
      g.add(shadowMesh);

      // 2. Ergonomic Student Chairs with NAVY Padded Seats (4 chairs per table = 24 total)
      [-tblW * 0.28, tblW * 0.28].forEach((cxPos) => {
        // Chair facing table from South side (looking North towards TV)
        createNavySeatChair(g, bx + cxPos, 0, rz + tblD / 2 + 0.28, 0);
        // Chair on North side tucked under
        createNavySeatChair(g, bx + cxPos, 0, rz - tblD / 2 - 0.28, Math.PI);
      });
    });
  });

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE HIGH-DETAIL HELPER MESHES
// ─────────────────────────────────────────────────────────────────────────────

/** Ergonomic Student Task Chair with Perforated Back and NAVY Seat Cushion */
function createNavySeatChair(parent, x, y, z, yaw) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = yaw;

  const navySeatMat = M(0x14284b, { roughness: 0.65 }); // Deep navy cushion
  const blackFrameMat = M(0x18181c, { roughness: 0.45, metalness: 0.7 });

  // 1. Navy Padded Cushion Seat (y = 0.44m)
  const seatMesh = box(g, 0.44, 0.05, 0.42, navySeatMat, 0, 0.44, 0);

  // 2. Perforated Black Ergonomic Backrest
  const backMesh = box(g, 0.42, 0.38, 0.03, blackFrameMat, 0, 0.70, -0.20);
  backMesh.rotation.x = -0.08;

  // 3. Black Tubular Legs (4 splayed legs)
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, -0.18, 0.22, -0.17, 8);
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, 0.18, 0.22, -0.17, 8);
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, -0.18, 0.22, 0.17, 8);
  cyl(g, 0.014, 0.012, 0.44, blackFrameMat, 0.18, 0.22, 0.17, 8);

  parent.add(g);
}

/** Rounded Bean Bag with Fabric Creases and Organic Feel */
function createBeanBagMesh(parent, x, z, colHex, yaw) {
  const g = new THREE.Group();
  g.position.set(x, 0.05, z);
  g.rotation.y = yaw;

  const mat = M(colHex, { roughness: 0.88 });

  // Main bean bag body (squashed sphere with tufts)
  const geom = new THREE.SphereGeometry(0.55, 16, 12);
  geom.scale(1.05, 0.65, 1.15);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(0, 0.32, 0);
  g.add(mesh);

  // Indented seat top
  const topCush = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.14, 14), mat);
  topCush.position.set(0, 0.45, -0.06);
  topCush.rotation.x = -0.25;
  g.add(topCush);

  parent.add(g);
}

/** Low-Poly White VR Headset */
function createMiniVrHeadset(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const whiteMat = M(0xf8fafc, { roughness: 0.3 });
  const blackMat = M(0x18181c, { roughness: 0.5 });

  // Visor body
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.15), whiteMat);
  g.add(visor);

  // Black face gasket foam
  box(g, 0.23, 0.12, 0.04, blackMat, 0, 0, -0.08);

  // Black side headstraps
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

  // Grip handle
  cyl(g, 0.022, 0.018, 0.14, mat, 0, 0, 0, 8);
  // Tracking ring / halo on top
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

/** Lounge Blonde Wood Bookcase Unit */
function createLoungeBookcase(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const bW = 1.30, bH = 2.40, bD = 0.36;
  const mat = M(0xd4a373, { roughness: 0.45 });

  // Outer frame
  box(g, bW, 0.04, bD, mat, 0, 0.02, 0);
  box(g, bW, 0.04, bD, mat, 0, bH - 0.02, 0);
  box(g, 0.04, bH, bD, mat, -bW / 2 + 0.02, bH / 2, 0);
  box(g, 0.04, bH, bD, mat, bW / 2 - 0.02, bH / 2, 0);

  // 4 Shelves
  [0.60, 1.15, 1.70].forEach((sy) => {
    box(g, bW - 0.08, 0.03, bD - 0.02, mat, 0, sy, 0);
    // Books and mini plant on each shelf
    createMiniBookStack(g, -0.32, sy + 0.02, 0);
    createPlant(g, 0.35, sy + 0.02, 0, 0.35);
  });

  parent.add(g);
}

// ─────────────────────────────────────────────────────────────────────────────
// VECTOR ART HELPERS FOR CANVAS MURAL TEXTURE
// ─────────────────────────────────────────────────────────────────────────────

/** SRI Lotus Logo Helper */
function drawSriLotusEmblem(ctx, cx, cy, r) {
  const treeTop = cy - r * 1.05;
  const stemBase = cy - r * 0.05;

  ctx.fillStyle = '#c05010';
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
    ctx.fillStyle = `rgb(${red},${grn},10)`;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }

  // "SRI" in bold serif
  const fontSize = Math.round(r * 1.05);
  ctx.fillStyle = '#14284b';
  ctx.font = `900 ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('SRI', cx, stemBase + r * 0.08);

  // Orange swoosh underline
  const swY = stemBase + r * 0.08 + fontSize + r * 0.08;
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = Math.max(4, r * 0.13);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.0, swY);
  ctx.quadraticCurveTo(cx + r * 0.15, swY + r * 0.38, cx + r * 1.0, swY - r * 0.08);
  ctx.stroke();
}

/** Orange Sketch-Style Isometric Cube with Dashed Orbital Circle */
function drawSketchCubeWithCircle(ctx, cx, cy) {
  ctx.save();
  // Dashed orbital circle
  ctx.strokeStyle = 'rgba(255, 122, 0, 0.45)';
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Isometric orange cube
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const s = 55;
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
function drawVrPersonSilhouette(ctx, cx, cy) {
  ctx.save();
  ctx.strokeStyle = '#14284b';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Head outline
  ctx.beginPath();
  ctx.arc(cx, cy - 25, 48, 0, Math.PI * 2);
  ctx.stroke();

  // VR Headset on face
  ctx.fillStyle = '#14284b';
  ctx.beginPath();
  ctx.roundRect(cx - 30, cy - 42, 65, 32, 10);
  ctx.fill();

  // Headband
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy - 26);
  ctx.lineTo(cx - 50, cy - 22);
  ctx.stroke();

  // Neck & Shoulders
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + 23);
  ctx.lineTo(cx - 40, cy + 65);
  ctx.lineTo(cx + 40, cy + 65);
  ctx.lineTo(cx + 15, cy + 23);
  ctx.stroke();

  // Orange holographic wireframe cube in front of headset
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = 5;
  ctx.strokeRect(cx + 52, cy - 40, 42, 42);
  ctx.restore();
}

/** Vector Icons for the Navy Panel */
function drawPanelVectorIcon(ctx, cx, cy, type) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'headset') {
    ctx.strokeRect(cx - 28, cy - 14, 56, 28);
    ctx.beginPath();
    ctx.moveTo(cx - 28, cy);
    ctx.lineTo(cx - 42, cy);
    ctx.moveTo(cx + 28, cy);
    ctx.lineTo(cx + 42, cy);
    ctx.stroke();
  } else if (type === 'ar') {
    // AR Frame corners
    const sz = 24;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(cx - sz, cy - sz + 12); ctx.lineTo(cx - sz, cy - sz); ctx.lineTo(cx - sz + 12, cy - sz);
    // Top-right
    ctx.moveTo(cx + sz - 12, cy - sz); ctx.lineTo(cx + sz, cy - sz); ctx.lineTo(cx + sz, cy - sz + 12);
    // Bottom-left
    ctx.moveTo(cx - sz, cy + sz - 12); ctx.lineTo(cx - sz, cy + sz); ctx.lineTo(cx - sz + 12, cy + sz);
    // Bottom-right
    ctx.moveTo(cx + sz - 12, cy + sz); ctx.lineTo(cx + sz, cy + sz); ctx.lineTo(cx + sz, cy + sz - 12);
    ctx.stroke();
  } else if (type === 'circle360') {
    // 360 circle with arrows
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('360°', cx, cy);
  } else if (type === 'cube3d') {
    // 3D wireframe cube
    ctx.strokeRect(cx - 16, cy - 16, 32, 32);
    ctx.strokeRect(cx - 8, cy - 8, 32, 32);
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 16); ctx.lineTo(cx - 8, cy - 8);
    ctx.moveTo(cx + 16, cy - 16); ctx.lineTo(cx + 24, cy - 8);
    ctx.moveTo(cx - 16, cy + 16); ctx.lineTo(cx - 8, cy + 24);
    ctx.moveTo(cx + 16, cy + 16); ctx.lineTo(cx + 24, cy + 24);
    ctx.stroke();
  }
  ctx.restore();
}
