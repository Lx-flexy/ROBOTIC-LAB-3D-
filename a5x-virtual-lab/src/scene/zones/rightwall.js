/**
 * zones/rightwall.js — Complete, photo-accurate recreation of the ROBOTICS LAB Wall
 * Matches Reference Image 1 (media_1794726866629_0d38a747.jpg) exactly.
 */
import * as THREE from 'three';
import { box, cyl, put } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';
import { createChair, createPlant } from '../props/furniture.js';
import {
  createPrinter,
  createDrone,
  createCar,
  createRobot,
  createRoboticArm,
  createFireExtinguisher,
  createLaptop,
  createPartsOrganizer,
  createSpoolRack,
} from '../props/equipment.js';
import { BRAND_SHORT, WALL_TEXTS } from '../../config.js';

export function buildRightWall(scene) {
  const RW = 19.78;          // Right wall inner surface X
  const RR = -Math.PI / 2;    // Rotation facing -X (into the room)
  const anim = { spin: [] };

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. CONTINUOUS MAKER WORKBENCH (from z = -12.6 to z = +2.4, length = 15.0m)
  // ═════════════════════════════════════════════════════════════════════════════
  const benchGroup = new THREE.Group();
  scene.add(benchGroup);

  const benchX = 19.38;       // Center of workbench in X
  const benchW = 0.76;        // Depth from wall (along X)
  const benchL = 15.0;        // Total length (along Z)
  const benchZ = -5.1;        // Center in Z (spans -12.6 to +2.4)
  const topY = 0.82;          // Tabletop height

  // Solid wood tabletop (warm honey-wood finish)
  box(benchGroup, benchW, 0.05, benchL, M(C.wood, { roughness: 0.4 }), benchX, topY, benchZ);

  // Lower wooden storage shelf (underneath the desk)
  box(benchGroup, benchW - 0.08, 0.03, benchL - 0.2, M(C.wood, { roughness: 0.5 }), benchX, 0.22, benchZ);

  // Black steel support frame legs at intervals of ~2.5m along Z
  const legZPositions = [-12.5, -10.0, -7.5, -5.1, -2.7, -0.3, 2.3];
  legZPositions.forEach(lz => {
    // Outer leg (room side)
    box(benchGroup, 0.05, topY, 0.05, M(C.black, { roughness: 0.5 }), benchX - benchW / 2 + 0.03, topY / 2, lz);
    // Inner leg (wall side)
    box(benchGroup, 0.05, topY, 0.05, M(C.black, { roughness: 0.5 }), benchX + benchW / 2 - 0.03, topY / 2, lz);
    // Crossbar under top
    box(benchGroup, benchW - 0.06, 0.04, 0.04, M(C.black), benchX, topY - 0.04, lz);
    // Crossbar supporting lower shelf
    box(benchGroup, benchW - 0.06, 0.03, 0.03, M(C.black), benchX, 0.20, lz);
  });

  // Longitudinal steel rails
  box(benchGroup, 0.04, 0.04, benchL, M(C.black), benchX - benchW / 2 + 0.03, topY - 0.04, benchZ);
  box(benchGroup, 0.04, 0.04, benchL, M(C.black), benchX + benchW / 2 - 0.03, topY - 0.04, benchZ);

  // Storage boxes and organizer bins on the lower shelf (y = 0.24)
  const storageBins = [
    { z: -11.8, w: 0.5, col: C.orange, label: 'PARTS' },
    { z: -11.2, w: 0.5, col: 0x222225, label: 'TOOLS' },
    { z: -8.8, w: 0.6, col: C.white, label: 'SENSORS' },
    { z: -8.1, w: 0.6, col: C.orange, label: 'MOTORS' },
    { z: -6.4, w: 0.7, col: 0x1b1b1f, label: 'HARDWARE' },
    { z: -3.8, w: 0.55, col: C.orange, label: 'PROJECTS' },
    { z: -1.8, w: 0.6, col: 0x2f6bff, label: 'CABLES' },
    { z: 0.8, w: 0.6, col: C.white, label: 'BOARDS' },
    { z: 1.6, w: 0.55, col: C.orange, label: 'BATTERIES' },
  ];
  storageBins.forEach(b => {
    // Bin body
    box(benchGroup, 0.5, 0.22, b.w, M(b.col, { roughness: 0.6 }), benchX, 0.35, b.z);
    // Bin lid / rim
    box(benchGroup, 0.52, 0.03, b.w + 0.02, M(C.black), benchX, 0.46, b.z);
  });

  // Two student chairs tucked under the open leg bays (at z = -10.0 and z = -5.1)
  createChair(scene, benchX - 0.6, -10.0, Math.PI / 2);
  createChair(scene, benchX - 0.6, -5.1, Math.PI / 2);

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. WORKBENCH TOP ITEMS (y = topY + half_height = sitting rock-solid on wood)
  // ═════════════════════════════════════════════════════════════════════════════
  const itemY = topY + 0.025; // 0.845m (exactly on tabletop)

  // (a) Laptop at z = -12.0
  createLaptop(scene, benchX, itemY, -12.0, -Math.PI / 2);

  // (b) 3D Printer at z = -10.6 (Bambu Lab style with animated rotating print)
  const printerObj = createPrinter(scene, benchX, itemY, -10.6);
  anim.spin.push(printerObj);

  // (c) Filament Spool Rack at z = -9.2 (6 colorful spools on rack)
  createSpoolRack(scene, benchX, itemY, -9.2, -Math.PI / 2);

  // (d) Multi-drawer Component Storage Cabinet at z = -8.0
  createPartsOrganizer(scene, benchX, itemY, -8.0, -Math.PI / 2);

  // (e) 4WD Robot Car at z = -6.8
  createCar(scene, benchX, itemY, -6.8, 0xffc400);

  // (f) 6-Axis Robotic Arm at z = -5.1 (center stage below TV)
  createRoboticArm(scene, benchX, itemY, -5.1, 0.65);

  // (g) Quadcopter Test Drone at z = -3.6
  createDrone(scene, benchX, itemY + 0.08, -3.6);

  // (h) Second Robot Car at z = -2.3
  createCar(scene, benchX, itemY, -2.3, 0x2f6bff);

  // (i) Second Component Organizer at z = -1.1
  createPartsOrganizer(scene, benchX, itemY, -1.1, -Math.PI / 2);

  // (j) Small Potted Plant at z = 0.4
  createPlant(scene, benchX, itemY, 0.4, 0.5);

  // (k) Small trophy / 3D model at z = 1.6
  cyl(scene, 0.08, 0.12, 0.22, M(C.orange), benchX, itemY + 0.11, 1.6, 12);
  const trophyBall = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), M(C.wood));
  trophyBall.position.set(benchX, itemY + 0.26, 1.6);
  scene.add(trophyBall);

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. WALL GRAPHICS & EMBEDDED OBJECTS (Above Workbench, Y: 1.5 to 5.6)
  // ═════════════════════════════════════════════════════════════════════════════

  // ── (A) Far Left Navy Chevron Strip (z = -13.6, y = 3.4) ──
  // Base navy vertical chevron panel
  const chevTex = canvasTex(256, 768, (g, w, h) => {
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(w, h * 0.08);
    g.lineTo(w, h * 0.92);
    g.lineTo(0, h);
    g.closePath();
    g.fill();

    // Orange diagonal accent stripe at bottom
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(0, h * 0.95);
    g.lineTo(w, h * 0.88);
    g.lineTo(w, h * 0.93);
    g.lineTo(0, h);
    g.closePath();
    g.fill();
  });
  const chevMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 4.4),
    new THREE.MeshBasicMaterial({ map: chevTex, transparent: true })
  );
  put(scene, chevMesh, RW, 3.2, -13.6, RR);

  // 4 Icon Pills on the Navy Strip: ROBOTICS, CODING, IoT, AR/VR
  const leftWallPills = [
    { title: 'ROBOTICS', icon: '🤖', y: 4.4 },
    { title: 'CODING', icon: '</>', y: 3.6 },
    { title: 'IoT', icon: '📡', y: 2.8 },
    { title: 'AR / VR', icon: '🥽', y: 2.0 },
  ];
  leftWallPills.forEach(p => {
    const pTex = canvasTex(320, 100, (g, w, h) => {
      // Rounded pill container
      g.fillStyle = 'rgba(255, 255, 255, 0.12)';
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 4;
      g.beginPath();
      g.roundRect(8, 8, w - 16, h - 16, 16);
      g.fill();
      g.stroke();

      // Icon & text
      g.fillStyle = '#fff';
      g.font = 'bold 36px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(`${p.icon}  ${p.title}`, w / 2, h / 2);
    });
    const pMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 0.42),
      new THREE.MeshBasicMaterial({ map: pTex, transparent: true })
    );
    put(scene, pMesh, RW - 0.01, p.y, -13.6, RR);
  });

  // ── (B) Left Black-Framed Window (center at z = -11.2, y = 3.0) ──
  createWallWindow(scene, RW, 3.0, -11.2, RR, 2.0, 1.8);

  // Floating wooden shelves beside left window (z = -9.8)
  createFloatingShelf(scene, RW - 0.02, 3.7, -9.8, RR, 0.8, 0.25);
  createPlant(scene, RW - 0.15, 3.75, -9.8, 0.45);

  createFloatingShelf(scene, RW - 0.02, 2.8, -9.8, RR, 0.8, 0.25);
  // Mini mascot robot toy on shelf
  createRobot(scene, RW - 0.15, 2.84, -9.8, 0.22);

  createFloatingShelf(scene, RW - 0.02, 2.0, -9.8, RR, 0.8, 0.25);
  // Small trophy on shelf
  cyl(scene, 0.04, 0.07, 0.18, M(C.orange), RW - 0.15, 2.12, -9.8, 10);

  // ── (C) Center Stage: Big Wall Title + Smart TV (z = -5.1) ──
  // 1. Big Wall Title Sign (Transparent, sits natively on the cream wall!)
  const wallTitleTex = canvasTex(1400, 320, (g, w, h) => {
    // Tree / Flower Emblem
    const cx = w / 2;
    g.fillStyle = '#ff7a00';
    // Petal fan logo
    for (let a = -3; a <= 3; a++) {
      const ang = (a * 15 * Math.PI) / 180;
      const lx = cx - 220 + Math.sin(ang) * 35;
      const ly = 55 - Math.cos(ang) * 35;
      g.beginPath();
      g.ellipse(lx, ly, 10, 18, ang, 0, Math.PI * 2);
      g.fill();
    }

    // "A5X" in navy bold
    g.fillStyle = '#14284b';
    g.font = `bold 82px 'Segoe UI', system-ui, sans-serif`;
    g.textAlign = 'right';
    g.fillText(BRAND_SHORT, cx - 130, 95);

    // Orange vertical separator line
    g.fillStyle = '#ff7a00';
    g.fillRect(cx - 105, 30, 6, 80);

    // "ROBOTICS LAB" in orange / navy bold
    g.textAlign = 'left';
    g.fillStyle = '#ff7a00';
    g.fillText('ROBOTICS ', cx - 80, 95);
    const robW = g.measureText('ROBOTICS ').width;
    g.fillStyle = '#14284b';
    g.fillText('LAB', cx - 80 + robW, 95);

    // Underline motto: "LEARN  •  BUILD  •  CODE  •  INNOVATE"
    g.textAlign = 'center';
    g.font = `bold 28px 'Segoe UI', system-ui, sans-serif`;
    g.fillStyle = '#14284b';
    g.fillText('LEARN   •   BUILD   •   CODE   •   INNOVATE', cx, 160);

    // Orange accent underline
    g.fillStyle = '#ff7a00';
    g.fillRect(cx - 280, 180, 560, 4);
  });
  const wallTitleMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.6, 1.5),
    new THREE.MeshBasicMaterial({ map: wallTitleTex, transparent: true })
  );
  // Positioned comfortably between y = 4.2 and y = 5.7 (well below ceiling!)
  put(scene, wallTitleMesh, RW, 4.9, -5.1, RR);

  // 2. Large Smart TV (Center at z = -5.1, y = 2.8)
  const tvW = 3.6, tvH = 2.1;
  const smartTvTex = canvasTex(1024, 600, (g, w, h) => {
    // Deep blue background with orange swoosh
    g.fillStyle = '#0f2038';
    g.fillRect(0, 0, w, h);

    // Orange dynamic wave at bottom
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(0, h * 0.7);
    g.bezierCurveTo(w * 0.3, h * 0.55, w * 0.7, h * 0.85, w, h * 0.65);
    g.lineTo(w, h);
    g.lineTo(0, h);
    g.closePath();
    g.fill();

    // Tree logo icon
    g.fillStyle = '#ff7a00';
    const tx = w / 2, ty = 90;
    for (let a = -3; a <= 3; a++) {
      const ang = (a * 15 * Math.PI) / 180;
      g.beginPath();
      g.ellipse(tx + Math.sin(ang) * 28, ty - Math.cos(ang) * 28, 8, 16, ang, 0, Math.PI * 2);
      g.fill();
    }

    // Screen Title
    g.fillStyle = '#ffffff';
    g.font = `bold 54px 'Segoe UI', sans-serif`;
    g.textAlign = 'center';
    g.fillText(`${BRAND_SHORT} Robotics Lab`, tx, 160);

    // Subtitle
    g.font = `24px 'Segoe UI', sans-serif`;
    g.fillStyle = 'rgba(255, 255, 255, 0.8)';
    g.fillText('Innovation & Applied STEM Center', tx, 205);

    // 4 App Icon Cards
    const cards = [
      { name: 'Robotics', icon: '🤖' },
      { name: 'Coding', icon: '</>' },
      { name: 'IoT', icon: '📡' },
      { name: 'Drones', icon: '🚁' },
    ];
    cards.forEach((c, i) => {
      const cardX = 160 + i * 190;
      const cardY = 320;
      // White rounded box
      g.fillStyle = 'rgba(255, 255, 255, 0.95)';
      g.beginPath();
      g.roundRect(cardX, cardY, 140, 110, 14);
      g.fill();

      // Card icon
      g.font = '38px sans-serif';
      g.fillStyle = '#14284b';
      g.fillText(c.icon, cardX + 70, cardY + 50);

      // Card title
      g.font = 'bold 20px sans-serif';
      g.fillStyle = '#14284b';
      g.fillText(c.name, cardX + 70, cardY + 90);
    });
  });

  // TV Screen mesh
  const tvScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(tvW, tvH),
    new THREE.MeshBasicMaterial({ map: smartTvTex })
  );
  put(scene, tvScreen, RW - 0.04, 2.75, -5.1, RR);

  // TV Outer Frame / Bezel (thin black frame with metallic edge)
  box(scene, 0.06, tvH + 0.1, tvW + 0.1, M(C.black, { roughness: 0.3 }), RW - 0.02, 2.75, -5.1);

  // Webcam mounted on top center of TV
  box(scene, 0.08, 0.04, 0.18, M(0x222222), RW - 0.04, 2.75 + tvH / 2 + 0.04, -5.1);
  cyl(scene, 0.015, 0.015, 0.02, Bm(0x33b5ff), RW - 0.09, 2.75 + tvH / 2 + 0.04, -5.1, 8).rotation.z = Math.PI / 2;

  // ── (D) Right Black-Framed Window (center at z = 1.0, y = 3.0) ──
  createWallWindow(scene, RW, 3.0, 1.0, RR, 2.0, 1.8);

  // Floating shelves beside right window (z = -0.4)
  createFloatingShelf(scene, RW - 0.02, 3.7, -0.4, RR, 0.8, 0.25);
  createPlant(scene, RW - 0.15, 3.75, -0.4, 0.45);

  createFloatingShelf(scene, RW - 0.02, 2.8, -0.4, RR, 0.8, 0.25);
  createDrone(scene, RW - 0.15, 2.92, -0.4);

  // ── (E) Wall Murals: Drone Schematic, Gears, Thumbs-up Mascot ──
  // Drone Schematic Decal (z = 2.4, y = 4.6)
  const droneSchematicTex = canvasTex(300, 300, (g, w, h) => {
    // Stylized technical drone icon in navy
    g.strokeStyle = '#14284b';
    g.lineWidth = 6;
    g.beginPath();
    g.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
    g.stroke();

    // 4 arms
    const len = 80;
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
      const px = w / 2 + sx * len;
      const py = h / 2 + sy * len;
      g.beginPath();
      g.moveTo(w / 2, h / 2);
      g.lineTo(px, py);
      g.stroke();

      // Rotor ring
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 4;
      g.beginPath();
      g.arc(px, py, 26, 0, Math.PI * 2);
      g.stroke();
      g.strokeStyle = '#14284b';
      g.lineWidth = 6;
    });
  });
  const droneDecal = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 1.4),
    new THREE.MeshBasicMaterial({ map: droneSchematicTex, transparent: true })
  );
  put(scene, droneDecal, RW, 4.6, 2.4, RR);

  // Gear Graphics (z = 2.8, y = 3.9)
  const gearsTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#ff7a00';
    g.font = '110px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('⚙', w / 2, h / 2);
  });
  const gear1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 1.0),
    new THREE.MeshBasicMaterial({ map: gearsTex, transparent: true })
  );
  put(scene, gear1, RW, 4.0, 2.8, RR);

  const gear2 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.7),
    new THREE.MeshBasicMaterial({ map: gearsTex, transparent: true })
  );
  put(scene, gear2, RW, 3.4, 3.4, RR);

  // Robot Mascot Painted Graphic (Thumbs Up) at z = 2.4, y = 2.6
  const mascotGraphicTex = canvasTex(320, 420, (g, w, h) => {
    const cx = w / 2;
    // Head
    g.fillStyle = '#ffffff';
    g.strokeStyle = '#14284b';
    g.lineWidth = 8;
    g.beginPath();
    g.roundRect(cx - 70, 40, 140, 110, 30);
    g.fill();
    g.stroke();

    // Antenna
    g.beginPath();
    g.moveTo(cx, 40);
    g.lineTo(cx, 15);
    g.stroke();
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.arc(cx, 15, 12, 0, Math.PI * 2);
    g.fill();
    g.stroke();

    // Blue glowing eyes
    g.fillStyle = '#33b5ff';
    g.beginPath();
    g.roundRect(cx - 50, 75, 35, 30, 8);
    g.roundRect(cx + 15, 75, 35, 30, 8);
    g.fill();

    // Happy smile
    g.strokeStyle = '#14284b';
    g.lineWidth = 5;
    g.beginPath();
    g.arc(cx, 110, 22, 0.2 * Math.PI, 0.8 * Math.PI);
    g.stroke();

    // Torso
    g.fillStyle = '#ffffff';
    g.lineWidth = 8;
    g.beginPath();
    g.roundRect(cx - 60, 160, 120, 130, 24);
    g.fill();
    g.stroke();

    // Chest badge (A5X logo)
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.roundRect(cx - 35, 195, 70, 35, 8);
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = 'bold 22px sans-serif';
    g.textAlign = 'center';
    g.fillText(BRAND_SHORT, cx, 220);

    // Thumbs-up Arm
    g.strokeStyle = '#14284b';
    g.lineWidth = 10;
    g.beginPath();
    g.moveTo(cx + 60, 200);
    g.lineTo(cx + 105, 175);
    g.stroke();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(cx + 115, 165, 18, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    // Thumb
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.roundRect(cx + 108, 140, 14, 25, 6);
    g.fill();
    g.stroke();
  });
  const mascotGraphicMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 1.7),
    new THREE.MeshBasicMaterial({ map: mascotGraphicTex, transparent: true })
  );
  put(scene, mascotGraphicMesh, RW, 2.7, 2.3, RR);

  // Fire Extinguisher on Wall (z = 3.6, y = 2.2)
  createFireExtinguisher(scene, RW - 0.08, 1.9, 3.6);

  // ── (F) Door to adjoining space (z = 4.8) ──
  createWallDoor(scene, RW, 0, 4.8, RR, 1.6, 3.4);

  return anim;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS FOR WALL DETAILS
// ─────────────────────────────────────────────────────────────────────────────

/** Create a clean wall-mounted window with daylight outdoor view and transparent glass */
function createWallWindow(parent, x, y, z, ry, w, h) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;

  const frameMat = M(C.black, { roughness: 0.4, metalness: 0.4 });
  const fT = 0.06; // frame profile thickness

  // 1. Hollow Outer Aluminum Frame (4 outer bars, center is open)
  box(g, w + fT * 2, fT, 0.08, frameMat, 0, h / 2 + fT / 2, 0);       // Top
  box(g, w + fT * 2 + 0.06, fT + 0.02, 0.10, frameMat, 0, -h / 2 - (fT + 0.02) / 2, 0.01); // Bottom sill
  box(g, fT, h, 0.08, frameMat, -w / 2 - fT / 2, 0, 0);              // Left
  box(g, fT, h, 0.08, frameMat, w / 2 + fT / 2, 0, 0);               // Right

  // 2. Realistic Outdoor Daylight Garden Backdrop (visible through the glass)
  const daylightTex = canvasTex(512, 384, (ctx, cw, ch) => {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, '#9cd1ff');
    skyGrad.addColorStop(0.5, '#dbeeff');
    skyGrad.addColorStop(1, '#eef6fc');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);
    // Outdoor sunlit green garden trees
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.arc(cw * 0.25, ch * 0.65, 130, 0, Math.PI * 2);
    ctx.arc(cw * 0.72, ch * 0.72, 150, 0, Math.PI * 2);
    ctx.arc(cw * 0.50, ch * 0.85, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.arc(cw * 0.22, ch * 0.58, 85, 0, Math.PI * 2);
    ctx.arc(cw * 0.68, ch * 0.65, 105, 0, Math.PI * 2);
    ctx.fill();
    // Sunlit bright highlights
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    ctx.arc(cw * 0.35, ch * 0.52, 50, 0, Math.PI * 2);
    ctx.arc(cw * 0.60, ch * 0.58, 65, 0, Math.PI * 2);
    ctx.fill();
  });
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: daylightTex })
  );
  backdrop.position.z = 0.005;
  g.add(backdrop);

  // 3. Clear Transparent Glass Pane in front of outdoor view
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.24,
    roughness: 0.05,
    metalness: 0.15,
    transmission: 0.85,
    ior: 1.5,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat);
  glass.position.z = 0.025;
  g.add(glass);

  // 4. Vertical & horizontal frame mullions
  box(g, 0.035, h, 0.04, frameMat, -w / 6, 0, 0.035);
  box(g, 0.035, h, 0.04, frameMat, w / 6, 0, 0.035);
  box(g, w, 0.035, 0.04, frameMat, 0, 0, 0.035);

  parent.add(g);
  return g;
}

/** Floating wall shelf */
function createFloatingShelf(parent, x, y, z, ry, w, d) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  // Wooden shelf board
  box(g, w, 0.04, d, M(C.wood, { roughness: 0.4 }), 0, 0, d / 2);
  // Metal wall brackets
  box(g, 0.03, 0.12, d - 0.04, M(C.black), -w / 3, -0.06, d / 2);
  box(g, 0.03, 0.12, d - 0.04, M(C.black), w / 3, -0.06, d / 2);
  parent.add(g);
  return g;
}

/** Wall door with handle and glass panels */
function createWallDoor(parent, x, y, z, ry, w, h) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  // Outer frame
  box(g, w + 0.1, h + 0.1, 0.06, M(C.black), 0, h / 2, 0);
  // Door panel
  box(g, w, h, 0.04, M(0x202025), 0, h / 2, 0.01);
  // Door glass inserts
  const dGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.7, h * 0.4),
    new THREE.MeshBasicMaterial({ color: 0x90b5d0, transparent: true, opacity: 0.6 })
  );
  dGlass.position.set(0, h * 0.68, 0.035);
  g.add(dGlass);
  // Door handle
  box(g, 0.04, 0.25, 0.08, M(0xcccccc, { metalness: 0.8 }), -w / 2 + 0.15, h / 2, 0.06);
  parent.add(g);
  return g;
}