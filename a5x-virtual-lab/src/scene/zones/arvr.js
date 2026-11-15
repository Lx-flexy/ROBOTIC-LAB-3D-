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
  // 1. MARBLE FLOOR SLAB (Pristine gray marble, 1.2m tiles, zero stray lines)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    const floorTex = getArVrFloorTexture();
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
    buildVrEquipmentZone(g, xMin, floorY, zMin, zMax);
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
        createLeafyPlant(g, sx + 0.55, sy + shelfT / 2, shelfD / 2, { scale: 0.65 });
      } else if (tier === 2) {
        // Top shelf: Another VR headset and hanging trailing ivy plant
        createMiniVrHeadset(g, sx - 0.35, sy + 0.11, shelfD / 2);
        createTrailingIvyPlant(g, sx + 0.45, sy + shelfT / 2, shelfD / 2);
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

  // Tall corner indoor leafy plant
  createLeafyPlant(g, -winW / 2 + 0.8, 0, 0.8, { isTall: true });

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

  const chairSeatMesh = new THREE.InstancedMesh(seatGeom, navySeatMat, totalChairs);
  const chairBackMesh = new THREE.InstancedMesh(backGeom, blackFrameMat, totalChairs);
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

/** Multi-Leaved Low-Poly Leafy Plant (Broad arching leaves, zero spheres) */
function createLeafyPlant(parent, x, y, z, opts = {}) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const scale = opts.scale || 1.0;
  g.scale.setScalar(scale);

  const isTall = opts.isTall || false;
  const potR = isTall ? 0.22 : 0.07;
  const potH = isTall ? 0.38 : 0.09;
  const potMat = M(opts.potColor || 0xf8fafc, { roughness: 0.3 });

  // Ceramic Planter Pot
  cyl(g, potR, potR * 0.85, potH, potMat, 0, potH / 2, 0, 16);
  cyl(g, potR * 1.04, potR * 1.04, potH * 0.12, potMat, 0, potH - potH * 0.06, 0, 16);
  cyl(g, potR * 0.92, potR * 0.92, 0.02, M(0x3e2723, { roughness: 0.9 }), 0, potH * 0.92, 0, 12);

  // Leafy Foliage (radiating arching elongated leaves)
  const leafCount = isTall ? 14 : 9;
  const leafMat1 = M(0x2e7d32, { roughness: 0.65, side: THREE.DoubleSide });
  const leafMat2 = M(0x388e3c, { roughness: 0.60, side: THREE.DoubleSide });

  for (let i = 0; i < leafCount; i++) {
    const leafGroup = new THREE.Group();
    const angle = (i * Math.PI * 2) / leafCount + (i % 2) * 0.2;
    leafGroup.rotation.y = angle;
    leafGroup.position.set(0, potH * 0.92, 0);

    const leafL = isTall ? (0.45 + (i % 3) * 0.12) : (0.14 + (i % 3) * 0.04);
    const leafW = isTall ? 0.16 : 0.065;
    const droop = isTall ? (0.35 + (i % 4) * 0.15) : (0.45 + (i % 3) * 0.15);

    // Arching leaf blade geometry
    const leafGeom = new THREE.PlaneGeometry(leafW, leafL, 3, 5);
    const lPos = leafGeom.attributes.position;
    for (let k = 0; k < lPos.count; k++) {
      const ly = lPos.getY(k);
      const normY = (ly + leafL / 2) / leafL;
      const arch = Math.pow(normY, 1.8) * droop;
      lPos.setZ(k, arch);
    }
    leafGeom.computeVertexNormals();

    const leafMesh = new THREE.Mesh(leafGeom, i % 2 === 0 ? leafMat1 : leafMat2);
    leafMesh.position.set(0, leafL / 2, 0);
    leafMesh.rotation.x = 0.45 + (i % 3) * 0.2;
    leafGroup.add(leafMesh);

    // Stem
    cyl(leafGroup, 0.005, 0.005, leafL * 0.4, M(0x1b5e20), 0, leafL * 0.2, 0, 6);

    g.add(leafGroup);
  }

  parent.add(g);
  return g;
}

/** Cascading Trailing Ivy Plant */
function createTrailingIvyPlant(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  cyl(g, 0.07, 0.055, 0.08, M(0xffffff, { roughness: 0.3 }), 0, 0.04, 0, 12);

  const leafMat = M(0x2e7d32, { roughness: 0.65, side: THREE.DoubleSide });
  for (let a = 0; a < 6; a++) {
    const ang = (a * Math.PI * 2) / 6;
    const l = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.09), leafMat);
    l.position.set(Math.cos(ang) * 0.04, 0.08, Math.sin(ang) * 0.04);
    l.rotation.x = 0.5;
    l.rotation.y = ang;
    g.add(l);
  }
  // Cascading ivy vine clusters hanging down the front/side
  [-0.04, 0.0, 0.04].forEach((vx, vi) => {
    const vineLen = 0.25 + vi * 0.12;
    for (let vy = 0.04; vy >= -vineLen; vy -= 0.05) {
      const l = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.06), leafMat);
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
