/**
 * zones/backwall.js — 3D Printing, Design, and Coding zones along back wall (z=-15)
 */
import * as THREE from 'three';
import { box, cyl, put } from '../../utils/geometry.js';
import { M, Bm, C, codeScreenTex, cadScreenTex, canvasTex } from '../../utils/materials.js';
import { createTable, createChair, createMonitor, createSign, createRack, createPlant } from '../props/furniture.js';
import { createPrinter, createDrone, createCar, createRobot, createBook, createMug } from '../props/equipment.js';
import { BRAND_SHORT } from '../../config.js';
import { create3DPrintingMural, createCodingZoneMural, createMainWallMural } from '../props/wallmurals.js';

export function buildBackWall(scene) {
  const anim = { spin: [], head: null };

  // Helper: zone bay with sign + bench table
  const bay = (x, title) => {
    put(scene, createSign(title, 4.4, 1.05), x, 4.6, -14.76);
    createTable(scene, 5.5, 1.3, x, -14.1);
  };

  // ━━━━━━━ 3D PRINTING ZONE (x ≈ -11) ━━━━━━━
  bay(-11, '3D PRINTING ZONE');

  // Two 3D printers
  const print1 = createPrinter(scene, -12.4, 0.84, -14.1);
  const print2 = createPrinter(scene, -9.6, 0.84, -14.1);
  anim.spin.push(print1, print2);

  // Chairs
  createChair(scene, -12.4, -12.6);
  createChair(scene, -9.6, -12.6);

  // Filament spool shelf
  box(scene, 3.2, 0.06, 0.5, M(C.black), -11, 2.6, -14.5);
  const spoolColors = [0xff7a00, 0xffffff, 0x2f6bff, 0x222222, 0xffc400, 0xe53935];
  spoolColors.forEach((c, i) => {
    const s = cyl(scene, 0.25, 0.25, 0.18, M(c), -12.2 + i * 0.5, 2.9, -14.5, 16);
    s.rotation.x = Math.PI / 2;
  });

  // Pegboard with tools
  box(scene, 1.8, 1.4, 0.05, M(0x2a2a30), -15.2, 2, -14.76);
  // Tool pegs
  const pegColors = [C.orange, 0xff3333, C.orange, 0x4488ff, C.orange];
  pegColors.forEach((c, i) => {
    box(scene, 0.06, 0.4 + (i % 2) * 0.15, 0.04, M(c), -15.8 + i * 0.3, 2.1, -14.72);
  });

  // Shelf with printed models
  createRack(scene, -7.2, -14.3, 0, 1.8);
  // Small printed model shapes on shelf
  box(scene, 0.2, 0.3, 0.2, M(C.orange), -7.2, 0.6, -14.3);
  const printedSphere = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), M(0x2f6bff));
  printedSphere.position.set(-6.8, 0.55, -14.3);
  scene.add(printedSphere);

  // Sub-sign
  put(scene, createSign('Design > Slice > Print > Prototype', 4.2, 0.45, { bar: false }), -11, 3.9, -14.76);

  // ━━━━━━━ DESIGN ZONE (x ≈ 0) ━━━━━━━
  bay(0, 'DESIGN ZONE');

  // Dual monitors with CAD screens
  createMonitor(scene, -1, 1.3, -14.2, cadScreenTex);
  createMonitor(scene, 1, 1.3, -14.2, cadScreenTex);
  createChair(scene, -1, -12.6);
  createChair(scene, 1, -12.6);

  // Model display shelf
  box(scene, 3, 0.06, 0.5, M(C.black), 0, 2.6, -14.5);
  // Design models on shelf
  const cube = box(scene, 0.35, 0.35, 0.35, M(C.orange), -0.7, 2.85, -14.5);
  anim.spin.push(cube);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), M(C.white));
  sphere.position.set(0.2, 2.85, -14.5);
  scene.add(sphere);
  cyl(scene, 0.12, 0.2, 0.35, M(C.navy), 0.9, 2.85, -14.5);
  // Small pyramid
  const pyramid = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 4), M(C.orange));
  pyramid.position.set(-0.1, 2.85, -14.5);
  scene.add(pyramid);

  // ━━━━━━━ CODING ZONE (x ≈ 11) ━━━━━━━
  bay(11, 'CODING ZONE');

  // Dual monitors with code
  createMonitor(scene, 10, 1.3, -14.2, codeScreenTex);
  createMonitor(scene, 12, 1.3, -14.2, codeScreenTex);
  createChair(scene, 10, -12.6);
  createChair(scene, 12, -12.6);

  // Book shelf
  box(scene, 4, 0.06, 0.5, M(C.black), 11, 2.6, -14.5);
  createBook(scene, 9.6, 2.72, -14.5, C.navy);
  createBook(scene, 9.8, 2.72, -14.5, C.orange);
  createBook(scene, 10.0, 2.72, -14.5, 0x2f6bff);

  // Robot car on shelf
  createCar(scene, 10.9, 2.63, -14.5);

  // Coffee mug
  createMug(scene, 11.6, 2.66, -14.5);

  // Small mascot on shelf
  const codingBot = createRobot(scene, 12.3, 2.63, -14.5, 0.3);
  anim.head = codingBot;

  // Metal rack with drone
  createRack(scene, 15.5, -14.3, 0, 2.2);
  createDrone(scene, 15.5, 2.7, -14.3);

  // Hexagon icon signs removed — replaced by full wall murals below

  // ━━━━━━━ ZONE WALL MURALS (matching reference images exactly) ━━━━━━━
  // 3D Printing Zone mural (left bay)
  create3DPrintingMural(scene);
  // Coding Zone mural (right bay)
  createCodingZoneMural(scene);
  // Main centre wall mural: Build•Learn•Innovate + robot mascot + tech icons
  createMainWallMural(scene);

  // Corner plants
  createPlant(scene, -18, 2.2, -14.3, 0.5);
  createPlant(scene, 18, 2.2, -14.3, 0.5);

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
