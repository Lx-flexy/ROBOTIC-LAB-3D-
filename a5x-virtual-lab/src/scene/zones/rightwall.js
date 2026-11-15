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
import { createRoboticsLabMural, createRightWallSideMural } from '../props/wallmurals.js';

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

  // ━━━ BIG ROBOTICS LAB WALL MURAL (behind the TV area, z = -13 to +3) ━━━
  createRoboticsLabMural(scene);

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

  // ── (D) Neat Row of 4 Framed Pictures + Floating Trophy Shelf above Long Workbench (z = -3.5 to -0.1) ──
  createFramedRowAndTrophyShelf(scene, RW, RR);

  // ── (E) Seamless Painted Side Wall Mural (z = -1.5 to +14.5, includes A5X Mascot, Dashed Badge, Taglines, & Tech Mural) ──
  createRightWallSideMural(scene);

  // ── (F) Upgraded Architectural Window with Realistic Daylight Backdrop, Sill, Plant & Blinds (center at z = 1.0, y = 3.0) ──
  createWallWindow(scene, RW, 3.0, 1.0, RR, 2.0, 1.8);

  // ── (G) Fire Extinguisher with Black Steel Mounting Bracket & Red Safety Sign (z = 3.6, y = 1.85) ──
  createWallMountedExtinguisher(scene, RW, RR, 3.6, 1.85);

  // ── (H) Door to adjoining space with "ROBOTICS LAB" Header Sign & Room Plaque (center at z = 4.8) ──
  createWallDoor(scene, RW, 0, 4.8, RR, 1.6, 3.4);

  // ── (I) Two Floating Wooden Shelves with Plant & Test Drone beside Door (z = 5.95) ──
  createWallShelvesUnit(scene, RW, RR, 5.95);

  return anim;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS FOR WALL DETAILS
// ─────────────────────────────────────────────────────────────────────────────

/** Neat Row of 4 Framed Pictures + Floating Trophy Shelf with LED Strip above workbench */
function createFramedRowAndTrophyShelf(parent, RW, RR) {
  const g = new THREE.Group();

  const shadowMat = M(0x000000, { transparent: true, opacity: 0.18, roughness: 1 });
  const frameBorderMat = M(0x18181b, { roughness: 0.35, metalness: 0.5 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    metalness: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const makeFrame = (fz, texCallback, fW = 0.58, fH = 0.44) => {
    const fGroup = new THREE.Group();
    fGroup.position.set(RW - 0.02, 2.65, fz);
    fGroup.rotation.y = RR;

    const pad = new THREE.Mesh(new THREE.PlaneGeometry(fW + 0.06, fH + 0.06), shadowMat);
    pad.position.set(0, 0, -0.005);
    fGroup.add(pad);

    const bT = 0.025;
    box(fGroup, fW, bT, 0.025, frameBorderMat, 0, fH / 2 - bT / 2, 0.012);
    box(fGroup, fW, bT, 0.025, frameBorderMat, 0, -fH / 2 + bT / 2, 0.012);
    box(fGroup, bT, fH - bT * 2, 0.025, frameBorderMat, -fW / 2 + bT / 2, 0, 0.012);
    box(fGroup, bT, fH - bT * 2, 0.025, frameBorderMat, fW / 2 - bT / 2, 0, 0.012);

    box(fGroup, fW - bT * 2, fH - bT * 2, 0.005, M(0xffffff, { roughness: 0.8 }), 0, 0, 0.005);

    const tex = canvasTex(512, 384, texCallback);
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(fW - bT * 4, fH - bT * 4),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    art.position.set(0, 0, 0.012);
    fGroup.add(art);

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(fW - bT * 2, fH - bT * 2), glassMat);
    glass.position.set(0, 0, 0.018);
    fGroup.add(glass);

    g.add(fGroup);
  };

  // Frame 1 (z = -3.1): Certificate of Robotics Excellence
  makeFrame(-3.1, (ctx, cw, ch) => {
    ctx.fillStyle = '#fffdfa'; ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#c59b27'; ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, cw - 36, ch - 36);
    ctx.strokeStyle = '#e6c875'; ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, cw - 52, ch - 52);
    ctx.fillStyle = '#d4af37';
    ctx.beginPath(); ctx.arc(cw / 2, ch * 0.76, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px serif'; ctx.textAlign = 'center'; ctx.fillText('★', cw / 2, ch * 0.77);
    ctx.fillStyle = '#b45309';
    ctx.beginPath(); ctx.moveTo(cw / 2 - 14, ch * 0.82); ctx.lineTo(cw / 2 - 24, ch * 0.94); ctx.lineTo(cw / 2, ch * 0.88); ctx.lineTo(cw / 2 + 24, ch * 0.94); ctx.lineTo(cw / 2 + 14, ch * 0.82); ctx.fill();
    ctx.fillStyle = '#14284b';
    ctx.font = `bold 22px 'Georgia', serif`;
    ctx.fillText('CERTIFICATE OF EXCELLENCE', cw / 2, 70);
    ctx.font = `italic 14px 'Georgia', serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText('This honour is presented to the', cw / 2, 105);
    ctx.font = `bold 24px 'Segoe UI', sans-serif`;
    ctx.fillStyle = '#ff7a00';
    ctx.fillText('SRI ROBOTICS INNOVATION TEAM', cw / 2, 142);
    ctx.font = `13px 'Segoe UI', sans-serif`;
    ctx.fillStyle = '#334155';
    ctx.fillText('For Pioneering Achievement in Autonomous Systems', cw / 2, 178);
    ctx.fillText('& Applied Robotics Engineering', cw / 2, 198);
  });

  // Frame 2 (z = -2.3): Technical Blueprint — Autonomous Quadcopter
  makeFrame(-2.3, (ctx, cw, ch) => {
    ctx.fillStyle = '#0a192f'; ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.12)'; ctx.lineWidth = 1;
    for (let x = 0; x < cw; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke(); }
    for (let y = 0; y < ch; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke(); }
    ctx.fillStyle = '#00f5ff'; ctx.font = `bold 18px 'Segoe UI', monospace`; ctx.textAlign = 'left';
    ctx.fillText('SYSTEM BLUEPRINT: A5X-UAV', 24, 38);
    ctx.fillStyle = '#94a3b8'; ctx.font = `12px monospace`;
    ctx.fillText('AUTONOMOUS FLIGHT CONTROLLER v3.2', 24, 56);
    ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 3;
    const mx = cw / 2, my = ch / 2 + 15;
    ctx.strokeRect(mx - 35, my - 25, 70, 50);
    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx, sy]) => {
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + sx * 80, my + sy * 55); ctx.stroke();
      ctx.strokeStyle = '#ff7a00'; ctx.beginPath(); ctx.arc(mx + sx * 80, my + sy * 55, 24, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#00f5ff';
    });
    ctx.fillStyle = '#ff7a00'; ctx.font = `11px monospace`;
    ctx.fillText('[LiDAR SLAM]', mx - 120, my - 45);
    ctx.fillText('[OPTICAL FLOW]', mx + 45, my + 75);
  });

  // Frame 3 (z = -1.6): 1st Place National Championship Award
  makeFrame(-1.6, (ctx, cw, ch) => {
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#14284b'; ctx.lineWidth = 5;
    ctx.strokeRect(18, 18, cw - 36, ch - 36);
    ctx.strokeStyle = '#ff7a00'; ctx.lineWidth = 2.5;
    ctx.strokeRect(26, 26, cw - 52, ch - 52);
    ctx.fillStyle = '#eab308';
    ctx.font = '36px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🏆', cw / 2, 70);
    ctx.fillStyle = '#14284b'; ctx.font = `bold 20px 'Segoe UI', sans-serif`;
    ctx.fillText('FIRST PLACE CHAMPIONS', cw / 2, 115);
    ctx.fillStyle = '#ff7a00'; ctx.font = `bold 16px 'Segoe UI', sans-serif`;
    ctx.fillText('NATIONAL STEM & ROBOTICS CUP', cw / 2, 142);
    ctx.fillStyle = '#475569'; ctx.font = `italic 13px 'Georgia', serif`;
    ctx.fillText('Recognizing Excellence in Autonomous Robo-Soccer', cw / 2, 180);
    ctx.fillText('& Precision Maze Navigation', cw / 2, 202);
    ctx.fillStyle = '#64748b'; ctx.font = `bold 12px monospace`;
    ctx.fillText('SRI ROBOTICS CLUB • ACADEMIC HONOUR', cw / 2, 255);
  });

  // Frame 4 (z = -0.9): Technical Architecture — AI Obstacle Avoidance
  makeFrame(-0.9, (ctx, cw, ch) => {
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = 'rgba(255, 122, 0, 0.15)'; ctx.lineWidth = 1;
    for (let x = 0; x < cw; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke(); }
    for (let y = 0; y < ch; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke(); }
    ctx.fillStyle = '#ff7a00'; ctx.font = `bold 18px 'Segoe UI', monospace`; ctx.textAlign = 'left';
    ctx.fillText('AI ROBOTIC VISION SYSTEM', 24, 38);
    ctx.fillStyle = '#94a3b8'; ctx.font = `12px monospace`;
    ctx.fillText('REAL-TIME OBSTACLE RECOGNITION PIPELINE', 24, 56);
    const bY = ch / 2 - 10;
    const boxes = ['CAM FEED', 'NEURAL NET', 'MOTOR ACT'];
    boxes.forEach((bTitle, idx) => {
      const bx = 45 + idx * 145;
      ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, bY, 115, 60);
      ctx.fillStyle = 'rgba(0, 245, 255, 0.08)'; ctx.fillRect(bx, bY, 115, 60);
      ctx.fillStyle = '#ffffff'; ctx.font = `bold 12px monospace`; ctx.textAlign = 'center';
      ctx.fillText(bTitle, bx + 57, bY + 34);
      if (idx < 2) {
        ctx.fillStyle = '#ff7a00'; ctx.font = 'bold 18px sans-serif';
        ctx.fillText('→', bx + 130, bY + 34);
      }
    });
  });

  // 2. Floating Trophy Shelf (at z = -0.3, y = 2.45)
  const shelfZ = -0.3;
  const shelfY = 2.45;
  const shelfW = 0.70;
  const shelfD = 0.22;
  const shelfT = 0.035;

  const sGroup = new THREE.Group();
  sGroup.position.set(RW - 0.02, shelfY, shelfZ);
  sGroup.rotation.y = RR;

  const shelfShadow = new THREE.Mesh(new THREE.PlaneGeometry(shelfW + 0.1, 0.35), shadowMat);
  shelfShadow.position.set(0, -0.10, -0.005);
  sGroup.add(shelfShadow);

  box(sGroup, shelfW, shelfT, shelfD, M(C.wood, { roughness: 0.5 }), 0, 0, shelfD / 2);

  [-shelfW / 3, shelfW / 3].forEach((bx) => {
    box(sGroup, 0.025, 0.14, shelfD - 0.02, frameBorderMat, bx, -0.07, shelfD / 2);
  });

  // Trophy 1: 1st Place Gold Chalice Cup
  const trop1 = new THREE.Group();
  trop1.position.set(-0.20, shelfT / 2, shelfD / 2);
  box(trop1, 0.08, 0.04, 0.08, M(0x2d1810, { roughness: 0.7 }), 0, 0.02, 0);
  cyl(trop1, 0.035, 0.045, 0.015, M(0xd4af37, { metalness: 0.9, roughness: 0.2 }), 0, 0.048, 0, 12);
  cyl(trop1, 0.015, 0.015, 0.06, M(0xd4af37, { metalness: 0.9, roughness: 0.2 }), 0, 0.085, 0, 10);
  cyl(trop1, 0.045, 0.022, 0.07, M(0xd4af37, { metalness: 0.9, roughness: 0.2 }), 0, 0.145, 0, 14);
  sGroup.add(trop1);

  // Trophy 2: Golden Star Award
  const trop2 = new THREE.Group();
  trop2.position.set(0.0, shelfT / 2, shelfD / 2);
  cyl(trop2, 0.04, 0.04, 0.07, M(0x475569, { metalness: 0.8, roughness: 0.3 }), 0, 0.035, 0, 14);
  const starMesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.038, 0),
    M(0xffc107, { metalness: 0.85, roughness: 0.2 })
  );
  starMesh.position.set(0, 0.11, 0);
  trop2.add(starMesh);
  sGroup.add(trop2);

  // Trophy 3: Faceted Cyan STEM Crystal Award
  const trop3 = new THREE.Group();
  trop3.position.set(0.20, shelfT / 2, shelfD / 2);
  box(trop3, 0.07, 0.03, 0.07, M(0x18181b, { metalness: 0.7, roughness: 0.4 }), 0, 0.015, 0);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.08,
    transmission: 0.88,
    ior: 1.52,
    transparent: true,
    opacity: 0.85,
  });
  const crystalMesh = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 6), crystalMat);
  crystalMesh.position.set(0, 0.095, 0);
  trop3.add(crystalMesh);
  sGroup.add(trop3);

  g.add(sGroup);

  // 3. Low-profile Warm LED Strip under framed row (z = -3.4 to z = -0.1, y = 2.22)
  const ledStripZ = -1.75;
  const ledStripLen = 3.3;
  const ledGroup = new THREE.Group();
  ledGroup.position.set(RW - 0.02, 2.22, ledStripZ);
  ledGroup.rotation.y = RR;

  box(ledGroup, ledStripLen, 0.02, 0.025, frameBorderMat, 0, 0, 0.012);
  box(ledGroup, ledStripLen - 0.04, 0.006, 0.012, M(0xffe082, { emissive: 0xffe082, emissiveIntensity: 2.2, roughness: 0.2 }), 0, -0.01, 0.012);
  const ledLight = new THREE.PointLight(0xffb74d, 1.8, 3.2, 1.8);
  ledLight.position.set(0, -0.08, 0.12);
  ledGroup.add(ledLight);

  g.add(ledGroup);

  parent.add(g);
  return g;
}

/** Two floating shelves with plant and drone positioned safely on wall to right of door */
function createWallShelvesUnit(parent, RW, RR, z) {
  const g = new THREE.Group();
  const shadowMat = M(0x000000, { transparent: true, opacity: 0.18, roughness: 1 });

  // Upper Shelf at y = 3.25 with lush potted plant
  createFloatingShelf(g, RW - 0.02, 3.25, z, RR, 0.82, 0.26);
  createPlant(g, RW - 0.15, 3.28, z, 0.45);
  const sPad1 = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.22), shadowMat);
  sPad1.position.set(RW - 0.015, 3.18, z);
  sPad1.rotation.y = RR;
  g.add(sPad1);

  // Lower Shelf at y = 2.45 with quadcopter test drone
  createFloatingShelf(g, RW - 0.02, 2.45, z, RR, 0.82, 0.26);
  createDrone(g, RW - 0.15, 2.52, z);
  const sPad2 = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.22), shadowMat);
  sPad2.position.set(RW - 0.015, 2.38, z);
  sPad2.rotation.y = RR;
  g.add(sPad2);

  parent.add(g);
  return g;
}

/** Fire extinguisher with black steel bracket and red safety sign */
function createWallMountedExtinguisher(parent, RW, RR, z, y) {
  const g = new THREE.Group();
  g.position.set(RW - 0.02, y, z);
  g.rotation.y = RR;

  const shadowMat = M(0x000000, { transparent: true, opacity: 0.18, roughness: 1 });
  const bracketMat = M(0x1e293b, { metalness: 0.75, roughness: 0.35 });

  // 1. Contact shadow on wall
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.85), shadowMat);
  pad.position.set(0, 0.30, -0.005);
  g.add(pad);

  // 2. Black steel wall mounting bracket
  box(g, 0.08, 0.52, 0.015, bracketMat, 0, 0.30, 0.01);
  box(g, 0.14, 0.02, 0.12, bracketMat, 0, 0.04, 0.07);
  box(g, 0.16, 0.03, 0.14, bracketMat, 0, 0.32, 0.07);
  box(g, 0.025, 0.04, 0.02, M(0xd1d5db, { metalness: 0.9, roughness: 0.2 }), 0.085, 0.32, 0.07);

  // 3. Fire Extinguisher Unit
  const extGroup = new THREE.Group();
  extGroup.position.set(0, 0.05, 0.08);

  cyl(extGroup, 0.09, 0.09, 0.46, M(0xdc2626, { roughness: 0.2, metalness: 0.1 }), 0, 0.23, 0, 16);
  const domeMat = M(0xdc2626, { roughness: 0.2, metalness: 0.1 });
  const topDome = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  topDome.position.set(0, 0.46, 0);
  extGroup.add(topDome);

  cyl(extGroup, 0.03, 0.03, 0.06, M(0x18181b, { metalness: 0.8 }), 0, 0.53, 0, 10);
  box(extGroup, 0.05, 0.08, 0.02, M(0x18181b), 0.05, 0.55, 0);
  cyl(extGroup, 0.018, 0.018, 0.015, M(0xffffff), 0, 0.53, 0.038, 8).rotation.x = Math.PI / 2;
  cyl(extGroup, 0.012, 0.012, 0.22, M(0x18181b), -0.07, 0.38, 0.05, 6);
  cyl(extGroup, 0.092, 0.092, 0.12, M(0xf8fafc, { roughness: 0.4 }), 0, 0.22, 0, 16);

  g.add(extGroup);

  // 4. Red & White Safety Sign directly above extinguisher
  const signW = 0.28;
  const signH = 0.36;
  const signTex = canvasTex(256, 330, (ctx, cw, ch) => {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, cw - 20, ch - 20);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const fx = cw / 2, fy = 85;
    ctx.arc(fx, fy + 20, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fx - 26, fy + 20);
    ctx.quadraticCurveTo(fx - 15, fy - 25, fx, fy - 45);
    ctx.quadraticCurveTo(fx + 15, fy - 25, fx + 26, fy + 20);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(fx, fy + 22, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 22px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('FIRE', cw / 2, 175);
    ctx.font = `bold 16px 'Segoe UI', sans-serif`;
    ctx.fillText('EXTINGUISHER', cw / 2, 204);
    ctx.fillStyle = '#fef08a';
    ctx.font = `bold 13px 'Segoe UI', sans-serif`;
    ctx.fillText('FOR EMERGENCY USE', cw / 2, 245);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `11px sans-serif`;
    ctx.fillText('OPERATE: PULL PIN • AIM • SQUEEZE', cw / 2, 282);
  });

  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(signW, signH),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(0, 0.72, 0.01);
  g.add(signMesh);

  parent.add(g);
  return g;
}

/** Create a clean wall-mounted window with daylight outdoor view, sill, plant, blinds & daylight fill */
function createWallWindow(parent, x, y, z, ry, w, h) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;

  const frameMat = M(C.black, { roughness: 0.4, metalness: 0.4 });
  const fT = 0.06;

  // 1. Hollow Outer Aluminum Frame (4 outer bars, center is open)
  box(g, w + fT * 2, fT, 0.08, frameMat, 0, h / 2 + fT / 2, 0);
  box(g, w + fT * 2 + 0.06, fT + 0.02, 0.10, frameMat, 0, -h / 2 - (fT + 0.02) / 2, 0.01);
  box(g, fT, h, 0.08, frameMat, -w / 2 - fT / 2, 0, 0);
  box(g, fT, h, 0.08, frameMat, w / 2 + fT / 2, 0, 0);

  // Added architectural Window Sill extending past frame
  box(g, w + 0.20, 0.04, 0.16, frameMat, 0, -h / 2 - 0.02, 0.05);

  // Added small potted ceramic succulent on sill
  const plantX = w * 0.28;
  const plantY = -h / 2 + 0.04;
  cyl(g, 0.045, 0.035, 0.07, M(0xffffff, { roughness: 0.25 }), plantX, plantY, 0.05, 14);
  cyl(g, 0.038, 0.038, 0.01, M(0x3e2723, { roughness: 0.9 }), plantX, plantY + 0.038, 0.05, 10);
  const succMat = M(0x2e7d32, { roughness: 0.55 });
  for (let s = 0; s < 6; s++) {
    const sAng = (s * Math.PI) / 3;
    const pet = box(g, 0.032, 0.012, 0.04, succMat, plantX + Math.cos(sAng) * 0.025, plantY + 0.045, 0.05 + Math.sin(sAng) * 0.025);
    pet.rotation.y = sAng;
    pet.rotation.z = 0.25;
  }

  // Added modern architectural window blinds stacked near top
  box(g, w - 0.06, 0.06, 0.05, M(0xf1f5f9, { roughness: 0.4 }), 0, h / 2 - 0.05, 0.02);
  cyl(g, 0.003, 0.003, 0.45, M(0xffffff), w / 2 - 0.08, h / 2 - 0.28, 0.03, 6);

  // 2. Realistic Outdoor Daylight Garden Backdrop
  const daylightTex = canvasTex(1024, 768, (ctx, cw, ch) => {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, '#3b82f6');
    skyGrad.addColorStop(0.35, '#93c5fd');
    skyGrad.addColorStop(0.70, '#e0f2fe');
    skyGrad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cw * 0.05, ch * 0.45, 140, ch * 0.35);
    ctx.fillRect(cw * 0.55, ch * 0.48, 180, ch * 0.32);
    ctx.fillRect(cw * 0.78, ch * 0.42, 120, ch * 0.38);

    ctx.fillStyle = '#2d5028';
    ctx.beginPath();
    ctx.arc(cw * 0.20, ch * 0.65, 190, 0, Math.PI * 2);
    ctx.arc(cw * 0.68, ch * 0.68, 220, 0, Math.PI * 2);
    ctx.arc(cw * 0.45, ch * 0.78, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3f6b38';
    ctx.beginPath();
    ctx.arc(cw * 0.16, ch * 0.58, 120, 0, Math.PI * 2);
    ctx.arc(cw * 0.62, ch * 0.60, 150, 0, Math.PI * 2);
    ctx.arc(cw * 0.85, ch * 0.65, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.arc(cw * 0.28, ch * 0.52, 75, 0, Math.PI * 2);
    ctx.arc(cw * 0.55, ch * 0.54, 90, 0, Math.PI * 2);
    ctx.arc(cw * 0.74, ch * 0.58, 85, 0, Math.PI * 2);
    ctx.fill();

    const sunWash = ctx.createRadialGradient(cw * 0.8, ch * 0.2, 20, cw * 0.8, ch * 0.2, 450);
    sunWash.addColorStop(0, 'rgba(255, 250, 230, 0.35)');
    sunWash.addColorStop(1, 'rgba(255, 250, 230, 0.0)');
    ctx.fillStyle = sunWash;
    ctx.fillRect(0, 0, cw, ch);
  });

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: daylightTex })
  );
  backdrop.position.z = 0.005;
  g.add(backdrop);

  // 3. Clear Transparent Glass Pane
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

  // 4. Frame mullions
  box(g, 0.035, h, 0.04, frameMat, -w / 6, 0, 0.035);
  box(g, 0.035, h, 0.04, frameMat, w / 6, 0, 0.035);
  box(g, w, 0.035, 0.04, frameMat, 0, 0, 0.035);

  // 5. Gentle directional daylight illumination through the window into the room
  const winLight = new THREE.DirectionalLight(0xfff5ea, 0.55);
  winLight.position.set(2.0, 1.2, 0);
  winLight.target.position.set(-4.0, -1.0, 0);
  g.add(winLight);
  g.add(winLight.target);

  parent.add(g);
  return g;
}

/** Floating wall shelf */
function createFloatingShelf(parent, x, y, z, ry, w, d) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  box(g, w, 0.04, d, M(C.wood, { roughness: 0.4 }), 0, 0, d / 2);
  box(g, 0.03, 0.12, d - 0.04, M(C.black), -w / 3, -0.06, d / 2);
  box(g, 0.03, 0.12, d - 0.04, M(C.black), w / 3, -0.06, d / 2);
  parent.add(g);
  return g;
}

/** Wall door with handle, glass panels, navy header sign & room plaque */
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

  // 1. Navy Rounded Pill Sign ABOVE Door (y = h + 0.25)
  const signW = 1.45, signH = 0.34;
  const signTex = canvasTex(512, 120, (ctx, cw, ch) => {
    ctx.fillStyle = '#14284b';
    ctx.beginPath();
    ctx.roundRect(8, 8, cw - 16, ch - 16, (ch - 16) / 2);
    ctx.fill();
    ctx.strokeStyle = '#ff7a00';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 36px 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ROBOTICS LAB', cw / 2 - 25, ch / 2);

    ctx.fillStyle = '#ff7a00';
    for (let c = 0; c < 3; c++) {
      const cx = cw - 80 + c * 18;
      ctx.beginPath();
      ctx.moveTo(cx, ch / 2 - 14);
      ctx.lineTo(cx + 12, ch / 2);
      ctx.lineTo(cx, ch / 2 + 14);
      ctx.lineTo(cx - 5, ch / 2 + 14);
      ctx.lineTo(cx + 7, ch / 2);
      ctx.lineTo(cx - 5, ch / 2 - 14);
      ctx.closePath();
      ctx.fill();
    }
  });

  const doorSign = new THREE.Mesh(
    new THREE.PlaneGeometry(signW, signH),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  doorSign.position.set(0, h + 0.25, 0.035);
  g.add(doorSign);

  // 2. Room Plaque beside door
  const plaqueTex = canvasTex(256, 160, (ctx, cw, ch) => {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#14284b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, cw - 8, ch - 8);

    ctx.fillStyle = '#14284b';
    ctx.font = `bold 28px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('ROOM 102', cw / 2, 55);

    ctx.fillStyle = '#ff7a00';
    ctx.font = `bold 14px 'Segoe UI', sans-serif`;
    ctx.fillText('ROBOTICS & AI LAB', cw / 2, 90);

    ctx.fillStyle = '#64748b';
    ctx.font = `11px sans-serif`;
    ctx.fillText('STUDENTS & FACULTY ONLY', cw / 2, 122);
  });

  const plaqueMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.32, 0.20),
    new THREE.MeshBasicMaterial({ map: plaqueTex })
  );
  plaqueMesh.position.set(-w / 2 - 0.28, 2.15, 0.015);
  g.add(plaqueMesh);

  parent.add(g);
  return g;
}