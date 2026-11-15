/**
 * props/equipment.js — 3D printer, drone, robot car, robotic arm, robot mascot, fire extinguisher
 */
import * as THREE from 'three';
import { box, cyl } from '../../utils/geometry.js';
import { M, Bm, C } from '../../utils/materials.js';

/** Bambu Lab style 3D printer with animated print object */
export function createPrinter(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  // Base plate
  box(g, 1, 0.14, 0.9, M(C.white), 0, 0.07, 0);
  // Vertical frame rails
  [-0.45, 0.45].forEach(a =>
    box(g, 0.08, 0.95, 0.08, M(0xcccccc), a, 0.55, -0.35));
  // Top beam
  box(g, 1, 0.06, 0.08, M(0xcccccc), 0, 1.02, -0.35);
  // Hotend carriage (moves)
  box(g, 0.2, 0.18, 0.18, M(C.black), 0, 0.85, -0.1);
  // Build plate
  box(g, 0.5, 0.03, 0.5, M(0x333333), 0, 0.16, 0);
  // Print object (animated — spinning orange shape)
  const printObj = cyl(g, 0.08, 0.15, 0.4, M(C.orange), 0, 0.38, 0);
  // LCD screen
  box(g, 0.28, 0.18, 0.03, M(C.black), 0.5, 0.14, 0.43);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.24, 0.14),
    Bm(0x33aaff)
  );
  screen.position.set(0.5, 0.14, 0.455);
  g.add(screen);
  parent.add(g);
  return printObj; // Return the spinning part for animation
}

/** Quadcopter drone */
export function createDrone(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  // Body
  box(g, 0.3, 0.08, 0.3, M(C.black), 0, 0, 0);
  // Camera bump
  cyl(g, 0.04, 0.04, 0.04, M(0x222222), 0, -0.05, 0.1, 8);
  // Arms (X shape)
  const armMat = M(C.black);
  const arm1 = box(g, 0.7, 0.025, 0.05, armMat, 0, 0, 0);
  arm1.rotation.y = Math.PI / 4;
  const arm2 = box(g, 0.7, 0.025, 0.05, armMat, 0, 0, 0);
  arm2.rotation.y = -Math.PI / 4;
  // Propellers (4)
  const propPositions = [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]];
  propPositions.forEach(([a, b]) => {
    // Motor mount
    cyl(g, 0.03, 0.03, 0.04, M(C.black), a, 0.05, b, 8);
    // Propeller disc
    cyl(g, 0.12, 0.12, 0.01, M(C.orange, { transparent: true, opacity: 0.6 }), a, 0.07, b, 12);
  });
  // Landing legs
  [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]].forEach(([a, b]) => {
    box(g, 0.02, 0.1, 0.02, M(C.black), a, -0.09, b);
  });
  parent.add(g);
  return g;
}

/** Small robot car */
export function createCar(parent, x, y, z, col = 0xffc400) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  // Chassis
  box(g, 0.5, 0.1, 0.32, M(col), 0, 0.12, 0);
  // Upper body / sensor platform
  box(g, 0.25, 0.08, 0.22, M(C.black), 0, 0.2, 0);
  // Sensor bumper (front)
  box(g, 0.3, 0.04, 0.04, M(0x444444), 0, 0.16, -0.18);
  // Wheels (4)
  const wheelPositions = [[-0.22, -0.14], [0.22, -0.14], [-0.22, 0.14], [0.22, 0.14]];
  wheelPositions.forEach(([a, b]) => {
    const w = cyl(g, 0.06, 0.06, 0.04, M(C.black), a, 0.06, b, 10);
    w.rotation.z = Math.PI / 2;
  });
  parent.add(g);
  return g;
}

/** 6-axis robotic arm */
export function createRoboticArm(parent, x, y, z, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  // Base
  cyl(g, 0.2, 0.25, 0.15, M(C.black), 0, 0.075, 0);
  // Turntable
  cyl(g, 0.18, 0.18, 0.06, M(C.orange), 0, 0.18, 0);
  // Lower arm
  box(g, 0.1, 0.6, 0.1, M(0xcc3300), 0, 0.51, 0);
  // Elbow joint
  cyl(g, 0.06, 0.06, 0.12, M(C.black), 0, 0.82, 0, 8);
  // Upper arm
  const upper = box(g, 0.08, 0.4, 0.08, M(0xcc3300), 0.15, 0.95, 0);
  upper.rotation.z = -0.5;
  // Wrist
  cyl(g, 0.04, 0.04, 0.08, M(C.black), 0.32, 1.1, 0, 8);
  // Gripper
  box(g, 0.03, 0.12, 0.06, M(C.orange), 0.36, 1.05, -0.04);
  box(g, 0.03, 0.12, 0.06, M(C.orange), 0.36, 1.05, 0.04);
  parent.add(g);
  return g;
}

/** Robot mascot (white body, orange legs, blue eyes) */
export function createRobot(parent, x, y, z, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  // Body
  box(g, 0.8, 0.9, 0.5, M(C.white), 0, 1.05, 0);
  // Chest detail
  box(g, 0.5, 0.3, 0.02, M(C.orange), 0, 1.0, 0.26);
  // Arms
  box(g, 0.25, 0.7, 0.25, M(C.white), -0.55, 1.0, 0);
  box(g, 0.25, 0.7, 0.25, M(C.white), 0.55, 1.0, 0);
  // Hands
  cyl(g, 0.1, 0.1, 0.1, M(C.orange), -0.55, 0.6, 0, 8);
  cyl(g, 0.1, 0.1, 0.1, M(C.orange), 0.55, 0.6, 0, 8);
  // Legs
  box(g, 0.22, 0.55, 0.25, M(C.orange), -0.18, 0.3, 0);
  box(g, 0.22, 0.55, 0.25, M(C.orange), 0.18, 0.3, 0);
  // Feet
  box(g, 0.25, 0.1, 0.35, M(C.orange), -0.18, 0.05, 0.05);
  box(g, 0.25, 0.1, 0.35, M(C.orange), 0.18, 0.05, 0.05);
  // Head
  const head = new THREE.Group();
  head.name = 'mascotHead';
  head.position.y = 1.85;
  g.add(head);
  box(head, 0.7, 0.55, 0.5, M(C.white), 0, 0, 0);
  // Antenna
  cyl(head, 0.03, 0.03, 0.2, M(C.black), 0, 0.38, 0, 6);
  const antBall = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), M(C.orange));
  antBall.position.set(0, 0.5, 0);
  head.add(antBall);
  // Eyes (glowing blue)
  [-0.15, 0.15].forEach(a => {
    const eye = box(head, 0.14, 0.12, 0.04, Bm(0x33b5ff), a, 0.03, 0.26);
    // Eye border
    box(head, 0.16, 0.14, 0.02, M(C.black), a, 0.03, 0.25);
  });
  // Mouth
  box(head, 0.2, 0.04, 0.04, M(C.black), 0, -0.12, 0.26);
  parent.add(g);
  return g;
}

/** Fire extinguisher */
export function createFireExtinguisher(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  // Tank
  cyl(g, 0.1, 0.1, 0.5, M(0xcc1f1f), 0, 0.25, 0);
  // Top valve
  cyl(g, 0.04, 0.04, 0.08, M(C.black), 0, 0.54, 0, 8);
  // Handle
  box(g, 0.06, 0.08, 0.03, M(C.black), 0.06, 0.54, 0);
  // Nozzle/hose
  cyl(g, 0.015, 0.015, 0.15, M(C.black), 0.08, 0.45, 0.05, 6);
  // Label band
  cyl(g, 0.102, 0.102, 0.1, M(C.white), 0, 0.2, 0);
  parent.add(g);
  return g;
}

/** Book (simple box with spine color) */
export function createBook(parent, x, y, z, color = C.navy, title = '') {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  box(g, 0.15, 0.22, 0.04, M(color), 0, 0, 0);
  // Pages
  box(g, 0.13, 0.2, 0.02, M(C.white), 0.01, 0, -0.01);
  parent.add(g);
  return g;
}

/** Coffee mug */
export function createMug(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  cyl(g, 0.06, 0.05, 0.1, M(C.white), 0, 0.05, 0, 12);
  // Handle
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.01, 6, 12, Math.PI),
    M(C.white)
  );
  handle.position.set(0.07, 0.05, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);
  // Coffee
  cyl(g, 0.05, 0.05, 0.01, M(0x3a1a0a), 0, 0.09, 0, 12);
  parent.add(g);
  return g;
}

/** Open Laptop */
export function createLaptop(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  // Base / keyboard
  box(g, 0.38, 0.015, 0.26, M(0x222225, { metalness: 0.5 }), 0, 0.008, 0);
  box(g, 0.34, 0.005, 0.12, M(0x111111), 0, 0.018, -0.02); // keyboard
  box(g, 0.12, 0.003, 0.07, M(0x333338), 0, 0.017, 0.08); // trackpad
  // Screen lid (tilted back ~110 deg)
  const lid = new THREE.Group();
  lid.position.set(0, 0.015, -0.13);
  lid.rotation.x = -0.35;
  box(lid, 0.38, 0.25, 0.01, M(0x222225, { metalness: 0.5 }), 0, 0.125, 0);
  // Screen glow
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.22), Bm(0x1a73e8));
  scr.position.set(0, 0.125, 0.006);
  lid.add(scr);
  g.add(lid);
  parent.add(g);
  return g;
}

/** Multi-drawer parts organizer / component storage cabinet */
export function createPartsOrganizer(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  const w = 0.5, h = 0.35, d = 0.2;
  // Outer frame
  box(g, w, h, d, M(C.black), 0, h / 2, 0);
  // Grid of small translucent drawers (4 columns x 3 rows)
  const cols = 4, rows = 3;
  const dw = (w - 0.06) / cols;
  const dh = (h - 0.06) / rows;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cx = -w / 2 + 0.04 + c * dw + dw / 2;
      const cy = 0.04 + r * dh + dh / 2;
      const drawer = box(g, dw - 0.015, dh - 0.015, 0.02, M(0xdddddd, { transparent: true, opacity: 0.7 }), cx, cy, d / 2 + 0.005);
      // Tiny handle
      box(g, 0.025, 0.01, 0.01, M(C.orange), cx, cy, d / 2 + 0.02);
    }
  }
  parent.add(g);
  return g;
}

/** Tabletop Filament Spool Rack holding 6 spools */
export function createSpoolRack(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  // Base stand & axle
  box(g, 0.25, 0.02, 0.85, M(C.black), 0, 0.01, 0);
  cyl(g, 0.015, 0.015, 0.82, M(0xaaaaaa), 0, 0.16, 0, 8).rotation.x = Math.PI / 2;
  // Upright supports
  box(g, 0.04, 0.18, 0.03, M(C.black), 0, 0.09, -0.4);
  box(g, 0.04, 0.18, 0.03, M(C.black), 0, 0.09, 0.4);
  // 6 spools standing in a row
  const colors = [0xff7a00, 0x2e9e44, 0x2f6bff, 0xffc400, 0x1b1b1f, 0xe53935];
  colors.forEach((col, i) => {
    const sz = -0.32 + i * 0.13;
    // Spool cylinder
    const spool = cyl(g, 0.12, 0.12, 0.08, M(col), 0, 0.16, sz, 16);
    spool.rotation.x = Math.PI / 2;
    // Rim flanges
    const f1 = cyl(g, 0.13, 0.13, 0.008, M(0x222222), 0, 0.16, sz - 0.042, 16);
    f1.rotation.x = Math.PI / 2;
    const f2 = cyl(g, 0.13, 0.13, 0.008, M(0x222222), 0, 0.16, sz + 0.042, 16);
    f2.rotation.x = Math.PI / 2;
  });
  parent.add(g);
  return g;
}
