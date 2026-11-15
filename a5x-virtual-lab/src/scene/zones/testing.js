/**
 * zones/testing.js — Testing Zone on left wall (x ≈ -15.5)
 * Robo Race, Robo Soccer, Line Following, Obstacle Test arenas
 */
import * as THREE from 'three';
import { box, cyl, put } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex, stripeTexture } from '../../utils/materials.js';
import { createSign, createRack, createPlant } from '../props/furniture.js';
import { createDrone, createCar } from '../props/equipment.js';

export function buildTestingZone(scene) {
  const anim = { bob: [], ball: null };
  const LW = -19.76; // left wall x
  const RY = Math.PI / 2;
  const X = -15.5; // centre of arena floor

  // ━━━━━━━ WALL BANNER ━━━━━━━
  put(scene, createSign('TESTING ZONE', 4.8, 1.1), LW, 4.6, -3, RY);

  // Icon row banner (6 icons: Robo Race, Robo Soccer, Line Following, Obstacle Test, Drone Test, Project Testing)
  const iconLabels = ['Robo\nRace', 'Robo\nSoccer', 'Line\nFollow', 'Obstacle\nTest', 'Drone\nTest', 'Project\nTesting'];
  const iconSymbols = ['🏁', '⚽', '〰️', '⚠️', '🚁', '⚙️'];
  iconLabels.forEach((t, i) => {
    const iconTex = canvasTex(280, 220, (g, w, h) => {
      // Orange border rounded rect
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 6;
      g.fillStyle = '#fff';
      g.beginPath(); g.roundRect(8, 8, w - 16, h - 16, 16); g.fill(); g.stroke();
      // Icon
      g.font = '52px sans-serif';
      g.textAlign = 'center';
      g.fillText(iconSymbols[i], w / 2, 70);
      // Label
      g.fillStyle = '#14284b';
      g.font = 'bold 26px sans-serif';
      const lines = t.split('\n');
      lines.forEach((l, li) => g.fillText(l, w / 2, 120 + li * 30));
    });
    const icon = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.1),
      new THREE.MeshBasicMaterial({ map: iconTex, transparent: true })
    );
    put(scene, icon, LW, 3.1, -9 + i * 1.75, RY);
  });

  // "BUILD • TEST • COMPETE • INNOVATE" text
  put(scene, createSign('BUILD • TEST • COMPETE • INNOVATE', 6, 0.5, {
    bg: 'none', fg: '#14284b', bar: false
  }), LW, 1.9, 6, RY);

  // ━━━━━━━ HAZARD BORDER (yellow/black) ━━━━━━━
  const hz = (w, d, x, z) => {
    const t = stripeTexture(Math.max(w, d));
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d),
      new THREE.MeshBasicMaterial({ map: t }));
    m.position.set(x, 0.06, z);
    scene.add(m);
  };
  hz(7.6, 0.3, X, -8.2);
  hz(7.6, 0.3, X, 12.2);
  hz(0.3, 20.7, -19.2, 2);
  hz(0.3, 20.7, -11.8, 2);

  // ━━━━━━━ ROBO SOCCER FIELD ━━━━━━━
  const flat = (w, d, col, x, z) =>
    box(scene, w, 0.04, d, M(col, { roughness: 0.9 }), x, 0.05, z);

  flat(7, 4.6, C.green, X, -5.6);
  // Centre line
  box(scene, 0.05, 0.02, 4.6, M(C.white), X, 0.08, -5.6);
  // Centre circle
  const cc = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.03, 6, 32),
    M(C.white)
  );
  cc.rotation.x = Math.PI / 2;
  cc.position.set(X, 0.08, -5.6);
  scene.add(cc);
  // Penalty areas
  [X - 3, X + 3].forEach(px => {
    box(scene, 0.04, 0.02, 2.5, M(C.white), px, 0.08, -5.6);
    box(scene, 0.6, 0.02, 0.04, M(C.white), px + (px < X ? 0.3 : -0.3), 0.08, -5.6 - 1.25);
    box(scene, 0.6, 0.02, 0.04, M(C.white), px + (px < X ? 0.3 : -0.3), 0.08, -5.6 + 1.25);
  });
  // Goals
  [-19, -12].forEach(gx => {
    box(scene, 0.06, 0.8, 1.7, M(C.white), gx, 0.4, -5.6);
    box(scene, 0.4, 0.06, 1.7, M(C.white), gx + (gx < X ? 0.2 : -0.2), 0.8, -5.6);
    // Goal net (semi-transparent)
    box(scene, 0.3, 0.75, 1.6, M(C.white, { transparent: true, opacity: 0.15, wireframe: true }),
      gx + (gx < X ? 0.15 : -0.15), 0.4, -5.6);
  });
  // Soccer ball
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 14, 10),
    M(C.white)
  );
  ball.position.set(X, 0.2, -5.6);
  scene.add(ball);
  anim.ball = ball;

  // ━━━━━━━ ROBO RACE TRACK ━━━━━━━
  flat(7, 5.4, 0x2a2a30, X, 0.3);
  // Red/white dashed racing line (S-curve)
  const raceTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#2a2a30';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#e53935';
    g.lineWidth = 8;
    g.setLineDash([12, 8]);
    g.beginPath();
    g.moveTo(20, h / 2);
    g.bezierCurveTo(w * 0.25, h * 0.1, w * 0.35, h * 0.9, w * 0.55, h / 2);
    g.bezierCurveTo(w * 0.7, h * 0.2, w * 0.85, h * 0.8, w - 20, h / 2);
    g.stroke();
    g.strokeStyle = '#fff';
    g.lineWidth = 3;
    g.stroke();
  });
  const raceOverlay = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 5.4),
    new THREE.MeshBasicMaterial({ map: raceTex, transparent: true })
  );
  raceOverlay.rotation.x = -Math.PI / 2;
  raceOverlay.position.set(X, 0.08, 0.3);
  scene.add(raceOverlay);
  // Race car
  createCar(scene, X + 2.2, 0.06, 0.3, 0xe53935);

  // ━━━━━━━ LINE FOLLOWING MAT ━━━━━━━
  flat(7, 3.8, C.white, X, 5.9);
  const lfTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#fff';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#111';
    g.lineWidth = 12;
    g.beginPath();
    g.moveTo(20, h / 2);
    g.bezierCurveTo(100, 30, 200, h - 30, 300, h / 2);
    g.bezierCurveTo(380, 30, 440, h - 30, w - 20, h / 2);
    g.stroke();
  });
  const lfMat = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 3.8),
    new THREE.MeshBasicMaterial({ map: lfTex })
  );
  lfMat.rotation.x = -Math.PI / 2;
  lfMat.position.set(X, 0.07, 5.9);
  scene.add(lfMat);

  // ━━━━━━━ OBSTACLE TEST AREA ━━━━━━━
  flat(7, 3.8, 0x777780, X, 10);
  // Ramp
  const ramp = box(scene, 1.6, 0.12, 1.2, M(C.orange), X - 1.8, 0.3, 10);
  ramp.rotation.z = 0.35;
  // Cones
  [[0, 9.5], [0.5, 10.5], [-0.5, 9.6]].forEach(([a, b]) => {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.45, 8),
      M(C.orange)
    );
    cone.position.set(X + a, 0.27, b);
    scene.add(cone);
    // Cone stripe
    const stripe = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.1, 8),
      M(C.black)
    );
    stripe.position.set(X + a, 0.35, b);
    scene.add(stripe);
  });
  // Tunnel (two walls + roof)
  box(scene, 0.12, 0.7, 1.4, M(C.orange), X + 1.8, 0.35, 10);
  box(scene, 0.12, 0.7, 1.4, M(C.orange), X + 3, 0.35, 10);
  box(scene, 1.3, 0.12, 1.4, M(C.black), X + 2.4, 0.72, 10);

  // ━━━━━━━ FLOOR LABELS ━━━━━━━
  const flab = (text, z) => {
    const g = new THREE.Group();
    g.position.set(-12.2, 0.09, z);
    g.rotation.y = Math.PI / 2;
    const s = createSign(text, 2.2, 0.45, { bg: 'none', bar: false, fg: '#ffffff' });
    s.rotation.x = -Math.PI / 2;
    g.add(s);
    scene.add(g);
  };
  flab('ROBO SOCCER', -7.6);
  flab('ROBO RACE', -2.1);
  flab('LINE FOLLOWING', 4.2);
  flab('OBSTACLE TEST', 7.9);

  // ━━━━━━━ HOVERING DRONE ━━━━━━━
  const drone = createDrone(scene, X, 3.5, 1);
  anim.bob.push(drone);

  // ━━━━━━━ STORAGE RACKS ━━━━━━━
  createRack(scene, -12.5, 8, -Math.PI / 2, 2.2);
  // Robot cars on rack
  createCar(scene, -12.5, 0.5, 7.5, C.orange);
  createCar(scene, -12.5, 1.3, 8.3, 0x2f6bff);

  // ━━━━━━━ CORNER DIAGONAL STRIPES (wall graphics) ━━━━━━━
  const diagTex = canvasTex(200, 512, (g, w, h) => {
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(0, h * 0.6); g.fill();
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(0, h * 0.12); g.lineTo(w * 0.6, 0); g.lineTo(0, h * 0.35); g.fill();
  });
  const diag1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 6),
    new THREE.MeshBasicMaterial({ map: diagTex, transparent: true })
  );
  put(scene, diag1, LW, 3, -14, RY);
  const diag2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 6),
    new THREE.MeshBasicMaterial({ map: diagTex, transparent: true })
  );
  put(scene, diag2, LW, 3, 14, RY);

  // ━━━━━━━ ICON PILLS (Coding, Electronics, Robotics) on left wall ━━━━━━━
  const pillLabels = ['Coding', 'Electronics', 'Robotics', 'AI & ML', 'IoT', '3D Printing', 'Drones'];
  pillLabels.forEach((t, i) => {
    const pillTex = canvasTex(280, 80, (g, w, h) => {
      g.fillStyle = '#14284b';
      g.beginPath();
      g.moveTo(0, 0); g.lineTo(w - 20, 0); g.lineTo(w, h / 2);
      g.lineTo(w - 20, h); g.lineTo(0, h); g.closePath(); g.fill();
      g.fillStyle = '#fff';
      g.font = 'bold 26px sans-serif';
      g.textAlign = 'center';
      g.fillText(t, w / 2 - 8, h / 2 + 9);
    });
    const pill = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.45),
      new THREE.MeshBasicMaterial({ map: pillTex, transparent: true })
    );
    put(scene, pill, LW, 3.6 - i * 0.55, -12 + i * 0.1, RY);
  });

  return anim;
}
