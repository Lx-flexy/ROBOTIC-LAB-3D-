/**
 * zones/meeting.js — Photo-Accurate Meeting & Discussion Room Annex
 *
 * Connected directly behind the right wall doorway at x = 19.78, z = 4.8.
 *
 * Spatial Placement:
 *  - X: x = 19.80m to 25.40m (Width = 5.60m)
 *  - Z: z = 2.20m to 7.40m   (Length = 5.20m)
 *  - Y: y = 0.05m to 3.80m   (Height = 3.75m)
 *  - Entrance doorway at x = 19.80m, z = 4.80m (symmetrically centered)
 *  - Completely clear of main lab, windows, and exterior trees
 *
 * Features:
 *  1. Architectural Shell:
 *     - Warm peach/cream painted walls (#fff1e3) with navy skirting and orange stripe
 *     - Seamless continuation of the gray marble floor
 *     - Wide panoramic window on the East wall (x = 25.4m) with soft daylight backdrop
 *  2. Furniture & Props:
 *     - Large wooden conference table (2.4m x 1.2m, solid wood top, black metal frame)
 *     - 6 Ergonomic task chairs (black mesh back, vibrant orange seat, tucked under table)
 *     - 75" 4K Smart Presentation Board on North wall (Project Roadmap & System Architecture)
 *     - Row of 3 black-framed robotics achievement photos on South wall
 *     - Painted navy & orange diagonal graphic with "Meeting / Room" title
 *     - Potted lush green plant in ceramic planter in corner
 *     - Recessed warm LED ceiling panel with soft illumination
 *     - Generous walking clearances (>1.2m to walls, 1.4m at door)
 */

import * as THREE from 'three';
import { box, cyl } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';
import { createChair, createPlant } from '../props/furniture.js';

export const MEETING_ROOM_CONFIG = {
  title: 'Meeting Room',
  desc: 'Collaborative discussion space with conference table, presentation display, and panoramic campus window.',
  xMin: 19.80,
  xMax: 25.40,
  zMin: 2.20,
  zMax: 7.40,
  floorY: 0.05,
  ceilingY: 3.80,
};

export function buildMeetingRoom(scene) {
  const g = new THREE.Group();

  const { xMin, xMax, zMin, zMax, floorY, ceilingY } = MEETING_ROOM_CONFIG;
  const roomW = xMax - xMin; // 5.60m (along X)
  const roomL = zMax - zMin; // 5.20m (along Z)
  const roomH = ceilingY - floorY; // 3.75m
  const centerX = (xMin + xMax) / 2; // 22.60m
  const centerZ = (zMin + zMax) / 2; // 4.80m
  const wallThick = 0.20;

  const wallMat = M(C.cream, { roughness: 0.85 });
  const navyMat = M(C.navy, { roughness: 0.5 });
  const orangeMat = M(C.orange, { roughness: 0.5 });

  // 1. MARBLE FLOOR SLAB
  const floorMat = M(0xb2b2b6, { roughness: 0.35, metalness: 0.0 });
  box(g, roomW, 0.08, roomL, floorMat, centerX, floorY - 0.04, centerZ);

  // 2. CEILING SLAB & ROOF
  box(g, roomW + wallThick * 2, 0.15, roomL + wallThick * 2, M(0xf4f4f5, { roughness: 0.9 }), centerX, ceilingY + 0.075, centerZ);

  // 3. WALLS:
  // (A) North Wall (z = zMin = 2.20m, solid)
  box(g, roomW, roomH, wallThick, wallMat, centerX, floorY + roomH / 2, zMin - wallThick / 2);
  // (B) South Wall (z = zMax = 7.40m, solid)
  box(g, roomW, roomH, wallThick, wallMat, centerX, floorY + roomH / 2, zMax + wallThick / 2);
  // (C) East Wall (x = xMax = 25.40m, with window opening)
  // Lower wall below window (y = 0 to 1.4m)
  box(g, wallThick, 1.4, roomL, wallMat, xMax + wallThick / 2, floorY + 0.7, centerZ);
  // Upper wall above window (y = 3.1 to 3.8m)
  box(g, wallThick, 0.7, roomL, wallMat, xMax + wallThick / 2, floorY + 3.45, centerZ);
  // Left pier (z = 2.2 to 3.5)
  box(g, wallThick, 1.7, 1.3, wallMat, xMax + wallThick / 2, floorY + 2.25, zMin + 0.65);
  // Right pier (z = 6.1 to 7.4)
  box(g, wallThick, 1.7, 1.3, wallMat, xMax + wallThick / 2, floorY + 2.25, zMax - 0.65);

  // (D) West Wall (x = xMin = 19.80m, shared with main lab, with doorway opening z = 4.15 to 5.45)
  // North section: z = 2.20 to 4.15 (length = 1.95m)
  box(g, wallThick, roomH, 1.95, wallMat, xMin - wallThick / 2, floorY + roomH / 2, zMin + 1.95 / 2);
  // South section: z = 5.45 to 7.40 (length = 1.95m)
  box(g, wallThick, roomH, 1.95, wallMat, xMin - wallThick / 2, floorY + roomH / 2, zMax - 1.95 / 2);
  // Header above doorway: y = 2.45 to 3.80 (height = 1.35m)
  box(g, wallThick, 1.35, 1.30, wallMat, xMin - wallThick / 2, floorY + 2.45 + 1.35 / 2, centerZ);

  // 4. SKIRTING BOARDS (Navy base with orange accent stripe)
  const skH = 0.12;
  // North skirting
  box(g, roomW, skH, 0.04, navyMat, centerX, floorY + skH / 2, zMin + 0.02);
  box(g, roomW, 0.015, 0.042, orangeMat, centerX, floorY + skH, zMin + 0.02);
  // South skirting
  box(g, roomW, skH, 0.04, navyMat, centerX, floorY + skH / 2, zMax - 0.02);
  box(g, roomW, 0.015, 0.042, orangeMat, centerX, floorY + skH, zMax - 0.02);
  // East skirting
  box(g, 0.04, skH, roomL, navyMat, xMax - 0.02, floorY + skH / 2, centerZ);
  box(g, 0.042, 0.015, roomL, orangeMat, xMax - 0.02, floorY + skH, centerZ);
  // West skirting (split around door)
  box(g, 0.04, skH, 1.95, navyMat, xMin + 0.02, floorY + skH / 2, zMin + 1.95 / 2);
  box(g, 0.042, 0.015, 1.95, orangeMat, xMin + 0.02, floorY + skH, zMin + 1.95 / 2);
  box(g, 0.04, skH, 1.95, navyMat, xMin + 0.02, floorY + skH / 2, zMax - 1.95 / 2);
  box(g, 0.042, 0.015, 1.95, orangeMat, xMin + 0.02, floorY + skH, zMax - 1.95 / 2);

  // 5. EAST PANORAMIC WINDOW (Window opening z = 3.5 to 6.1, width = 2.6m, height = 1.7m)
  createMeetingRoomWindow(g, xMax, floorY + 2.25, centerZ, 2.6, 1.7);

  // 6. LARGE CONFERENCE TABLE (2.4m x 1.2m, blonde wood top, black metal frame)
  createConferenceTable(g, centerX + 0.20, floorY, centerZ);

  // 7. SIX ERGONOMIC CHAIRS (Mesh back, vibrant orange seat cushion)
  createMeetingChairs(g, centerX + 0.20, floorY, centerZ);

  // 8. 75" SMART PRESENTATION BOARD ON NORTH WALL (z = 2.23m)
  createPresentationDisplay(g, centerX + 0.20, floorY + 2.15, zMin + 0.03);

  // 9. PAINTED WALL GRAPHIC & FRAMED PICTURES ON SOUTH WALL (z = 7.37m)
  createSouthWallDecor(g, centerX, floorY, zMax - 0.02);

  // 10. CORNER POTTED PLANT IN SOUTH-EAST CORNER
  createPlant(g, xMax - 0.60, floorY, zMax - 0.60, 0.85);

  // 11. CEILING LIGHT PANEL & SOFT ILLUMINATION
  createCeilingLighting(g, centerX, ceilingY, centerZ);

  scene.add(g);
  return g;
}

/** Panoramic window with soft daylight backdrop and transparent glass */
function createMeetingRoomWindow(parent, x, y, z, w, h) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = -Math.PI / 2;

  const frameMat = M(C.black, { roughness: 0.35, metalness: 0.5 });

  // Outer frame
  box(g, w + 0.08, h + 0.08, 0.16, frameMat, 0, 0, 0);

  // Soft sky & distant greenery backdrop canvas
  const bgTex = canvasTex(512, 320, (ctx, cw, ch) => {
    const sky = ctx.createLinearGradient(0, 0, 0, ch);
    sky.addColorStop(0, '#7dd3fc');
    sky.addColorStop(0.65, '#e0f2fe');
    sky.addColorStop(1, '#f8fafc');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, cw, ch);

    // Distant soft green trees
    ctx.fillStyle = '#4ade80';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(i * 100 + 40, ch * 0.85, 90, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(i * 90 - 20, ch * 0.92, 75, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const bgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: bgTex })
  );
  bgMesh.position.z = 0.06;
  g.add(bgMesh);

  // Transparent glass pane
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    transmission: 0.85,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat);
  glass.position.z = -0.01;
  g.add(glass);

  // Mullions
  box(g, 0.03, h, 0.04, frameMat, -w / 3, 0, 0);
  box(g, 0.03, h, 0.04, frameMat, w / 3, 0, 0);

  // Gentle directional daylight wash entering room
  const winLight = new THREE.DirectionalLight(0xfffaec, 0.50);
  winLight.position.set(-2.0, 1.5, 0);
  winLight.target.position.set(4.0, -1.0, 0);
  g.add(winLight);
  g.add(winLight.target);

  parent.add(g);
}

/** Large conference table with wooden top, perimeter frame, and wire management */
function createConferenceTable(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const tW = 2.40; // Length along X
  const tD = 1.20; // Width along Z
  const tH = 0.82; // Height

  const woodMat = M(C.wood, { roughness: 0.52 });
  const steelMat = M(C.black, { roughness: 0.4, metalness: 0.6 });
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false });

  // 1. Soft footprint contact shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(tW + 0.3, tD + 0.3), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.005, 0);
  shadow.renderOrder = 2;
  g.add(shadow);

  // 2. Solid oak tabletop with beveled edge
  box(g, tW, 0.055, tD, woodMat, 0, tH, 0);

  // Central cable management well (anodized aluminum cover plate)
  box(g, 0.60, 0.008, 0.16, M(0x2d3748, { metalness: 0.8, roughness: 0.3 }), 0, tH + 0.004, 0);

  // 3. Sturdy perimeter sub-frame
  box(g, tW - 0.12, 0.04, 0.04, steelMat, 0, tH - 0.045, -tD / 2 + 0.08);
  box(g, tW - 0.12, 0.04, 0.04, steelMat, 0, tH - 0.045, tD / 2 - 0.08);

  // 4. Heavy-duty black steel legs (4 corners) with leveling pads
  const lx = tW / 2 - 0.12;
  const lz = tD / 2 - 0.12;
  [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([px, pz]) => {
    box(g, 0.055, tH, 0.055, steelMat, px, tH / 2, pz);
    box(g, 0.075, 0.02, 0.075, steelMat, px, 0.01, pz);
  });

  // Center crossbar
  box(g, tW - 0.24, 0.04, 0.04, steelMat, 0, 0.18, 0);

  parent.add(g);
}

/** 6 Ergonomic task chairs (3 on north, 3 on south) matching Coding Zone style */
function createMeetingChairs(parent, tableX, tableY, tableZ) {
  const chairOffsetsX = [-0.75, 0.0, 0.75];

  // North side chairs (facing South: yaw = 0)
  chairOffsetsX.forEach((dx) => {
    createChair(parent, tableX + dx, tableZ - 0.72, 0, { orangeSeat: true });
  });

  // South side chairs (facing North: yaw = Math.PI)
  chairOffsetsX.forEach((dx) => {
    createChair(parent, tableX + dx, tableZ + 0.72, Math.PI, { orangeSeat: true });
  });
}

/** 75" 4K Smart Presentation Screen on North Wall */
function createPresentationDisplay(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const screenW = 2.10;
  const screenH = 1.25;

  const frameMat = M(0x18181b, { metalness: 0.8, roughness: 0.3 });
  box(g, screenW + 0.04, screenH + 0.04, 0.04, frameMat, 0, 0, 0);

  // High-res interactive slide presentation texture
  const slideTex = canvasTex(1024, 600, (ctx, cw, ch) => {
    // Deep navy background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, cw, ch);

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, cw, 75);
    ctx.fillStyle = '#ff7a00';
    ctx.fillRect(0, 72, cw, 3);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 28px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('SRI PUBLIC SCHOOL  |  ROBOTICS LAB', 30, 48);

    // Presentation Title
    ctx.fillStyle = '#38bdf8';
    ctx.font = `bold 32px 'Segoe UI', system-ui, sans-serif`;
    ctx.fillText('Autonomous Robotics — Strategic Project Roadmap', 30, 135);

    // 4 Architecture Flowchart Cards
    const cards = [
      { num: '01', title: 'Perception', desc: 'LiDAR + Stereo Vision\nSensor Fusion Pipeline', col: '#ff7a00' },
      { num: '02', title: 'Planning', desc: 'A* Pathfinding & SLAM\nDynamic Obstacle Avoidance', col: '#00f5ff' },
      { num: '03', title: 'Control', desc: 'PID Motor Drivers\nKinematic Motion Control', col: '#22c55e' },
      { num: '04', title: 'Telemetry', desc: 'Wi-Fi / ROS2 Node\nReal-Time Telemetry Cloud', col: '#a855f7' },
    ];

    cards.forEach((c, i) => {
      const bx = 30 + i * 240;
      const by = 180;
      const bw = 220;
      const bh = 340;

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 14);
      ctx.fill();
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = c.col;
      ctx.font = '900 36px monospace';
      ctx.fillText(c.num, bx + 20, by + 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 22px 'Segoe UI', system-ui, sans-serif`;
      ctx.fillText(c.title, bx + 20, by + 95);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `16px 'Segoe UI', system-ui, sans-serif`;
      const lines = c.desc.split('\n');
      lines.forEach((l, li) => {
        ctx.fillText(l, bx + 20, by + 145 + li * 28);
      });
    });
  });

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(screenW, screenH),
    new THREE.MeshBasicMaterial({ map: slideTex })
  );
  screenMesh.position.z = 0.022;
  g.add(screenMesh);

  // Soundbar under TV
  box(g, 1.40, 0.08, 0.06, M(0x18181b), 0, -screenH / 2 - 0.07, 0.02);

  parent.add(g);
}

/** South wall decor: painted graphic title & framed picture gallery */
function createSouthWallDecor(parent, centerX, floorY, wallZ) {
  const g = new THREE.Group();
  g.position.set(centerX, floorY, wallZ);

  // 1. Painted wall graphic canvas: "Meeting / Room" with navy/orange diagonal shapes
  const titleTex = canvasTex(512, 256, (ctx, cw, ch) => {
    // Transparent background
    ctx.clearRect(0, 0, cw, ch);

    // Diagonal navy chevron
    ctx.fillStyle = '#14284b';
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(80, 20);
    ctx.lineTo(130, 140);
    ctx.lineTo(80, 140);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ff7a00';
    ctx.beginPath();
    ctx.moveTo(90, 20);
    ctx.lineTo(110, 20);
    ctx.lineTo(160, 140);
    ctx.lineTo(140, 140);
    ctx.closePath();
    ctx.fill();

    // Bold title text
    ctx.fillStyle = '#14284b';
    ctx.font = `900 48px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Meeting &', 180, 35);
    ctx.fillText('Discussion', 180, 90);

    ctx.fillStyle = '#ff7a00';
    ctx.fillRect(180, 155, 260, 6);
  });

  const titleMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.80, 0.90),
    new THREE.MeshBasicMaterial({ map: titleTex, transparent: true })
  );
  titleMesh.position.set(-1.10, 2.70, -0.01);
  titleMesh.rotation.y = Math.PI;
  g.add(titleMesh);

  // 2. Row of 3 framed robotics photos
  const frameMat = M(0x18181b, { metalness: 0.6, roughness: 0.4 });
  const fW = 0.65, fH = 0.48;

  [-0.9, 0.0, 0.9].forEach((fx, idx) => {
    const fGroup = new THREE.Group();
    fGroup.position.set(fx + 0.8, 1.80, -0.015);
    fGroup.rotation.y = Math.PI;

    box(fGroup, fW, fH, 0.02, frameMat, 0, 0, 0);

    const pTex = canvasTex(256, 192, (ctx, cw, ch) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = idx === 0 ? '#ff7a00' : idx === 1 ? '#0284c7' : '#16a34a';
      ctx.fillRect(10, 10, cw - 20, ch - 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const titles = ['National Champions', 'RoboCup Finalists', 'Innovation Award'];
      ctx.fillText(titles[idx], cw / 2, ch / 2);
    });

    const pMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(fW - 0.06, fH - 0.06),
      new THREE.MeshBasicMaterial({ map: pTex })
    );
    pMesh.position.z = 0.012;
    fGroup.add(pMesh);

    g.add(fGroup);
  });

  parent.add(g);
}

/** Recessed warm LED ceiling light panel */
function createCeilingLighting(parent, x, ceilingY, z) {
  const g = new THREE.Group();
  g.position.set(x, ceilingY, z);

  // Recessed frame
  box(g, 2.20, 0.04, 1.40, M(0x27272a, { metalness: 0.6 }), 0, -0.02, 0);

  // Diffuser panel
  const panelMat = M(0xfffaec, { emissive: 0xfffaec, emissiveIntensity: 1.8, roughness: 0.2 });
  box(g, 2.00, 0.01, 1.20, panelMat, 0, -0.015, 0);

  // Warm downward illumination
  const light = new THREE.PointLight(0xfffaec, 1.1, 7.5, 1.6);
  light.position.set(0, -0.2, 0);
  g.add(light);

  parent.add(g);
}
