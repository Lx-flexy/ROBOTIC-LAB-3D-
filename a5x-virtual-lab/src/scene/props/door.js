/**
 * props/door.js — Interactive, Hinged Door between Main Lab and Meeting Room
 *
 * Features:
 *  - Door leaf pivoting on a vertical hinge axis at z = 4.15m (left edge)
 *  - Outer black aluminum door frame with header and threshold
 *  - Chrome lever handles on both sides (lab side and meeting room side)
 *  - Transparent cyan-tinted glass observation panel
 *  - Existing "ROBOTICS LAB >>>" header sign above doorway
 *  - Smooth GSAP 0.85s toggle animation (90° swing outward into lab side)
 *  - Dynamic collision updates (blocks when closed, walkable when open)
 *  - Raycast click detection & proximity detection for 'E' key / UI hint
 *  - Optional soft synthesized latch sound via Web Audio API
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { box, cyl } from '../../utils/geometry.js';
import { M, Bm, C, canvasTex } from '../../utils/materials.js';
import { setDoorColliderOpen } from '../../controls/FirstPersonControls.js';

let _activeDoor = null;

export function getInteractiveDoor() {
  return _activeDoor;
}

export function createInteractiveDoor(scene) {
  const g = new THREE.Group();

  const DOOR_X = 19.78;       // Right wall inner surface
  const DOOR_Z = 4.80;        // Doorway center Z
  const DOOR_W = 1.30;        // Doorway width
  const DOOR_H = 2.40;        // Doorway height
  const HINGE_Z = DOOR_Z - DOOR_W / 2; // Hinge edge at z = 4.15m

  // 1. OUTER DOOR FRAME (Fixed around wall opening)
  const frameMat = M(C.black, { roughness: 0.45, metalness: 0.3 });
  const frameDepth = 0.22; // Covers wall thickness

  // Left jamb (at hinge side, z = 4.15 - 0.04)
  box(g, frameDepth, DOOR_H + 0.06, 0.06, frameMat, DOOR_X + 0.08, (DOOR_H + 0.06) / 2, HINGE_Z - 0.03);
  // Right jamb (at latch side, z = 5.45 + 0.04)
  box(g, frameDepth, DOOR_H + 0.06, 0.06, frameMat, DOOR_X + 0.08, (DOOR_H + 0.06) / 2, DOOR_Z + DOOR_W / 2 + 0.03);
  // Top header beam
  box(g, frameDepth, 0.06, DOOR_W + 0.12, frameMat, DOOR_X + 0.08, DOOR_H + 0.03, DOOR_Z);
  // Floor threshold plate (dark satin metal at y = 0.052)
  box(g, frameDepth + 0.04, 0.008, DOOR_W + 0.02, M(0x222226, { metalness: 0.8, roughness: 0.3 }), DOOR_X + 0.08, 0.052, DOOR_Z);

  // 2. NAVY ROUNDED PILL SIGN ABOVE DOOR ("ROBOTICS LAB >>>")
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

  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(signW, signH),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(DOOR_X - 0.02, DOOR_H + 0.28, DOOR_Z);
  signMesh.rotation.y = -Math.PI / 2;
  g.add(signMesh);

  // 3. MOVING DOOR PIVOT GROUP (Pivots around vertical axis at hinge: x = 19.78, z = 4.15)
  const pivotGroup = new THREE.Group();
  pivotGroup.position.set(DOOR_X, 0, HINGE_Z);
  g.add(pivotGroup);

  // Door leaf geometry inside pivotGroup:
  // In local space, hinge is at (0, 0, 0).
  // Leaf extends along local +Z from z = 0 to z = leafW.
  const leafW = DOOR_W - 0.02; // ~1.28m
  const leafH = DOOR_H - 0.03; // ~2.37m
  const leafThick = 0.048;     // 4.8cm thickness
  const leafCenterZ = leafW / 2;
  const leafCenterY = leafH / 2 + 0.015;

  const leafMat = M(0x1c1c20, { roughness: 0.45, metalness: 0.15 });
  const chromeMat = M(0xd1d5db, { metalness: 0.9, roughness: 0.2 });

  // Main door leaf body
  const leafBody = box(pivotGroup, leafThick, leafH, leafW, leafMat, 0, leafCenterY, leafCenterZ);
  leafBody.userData.isDoor = true;

  // Clear transparent cyan-tinted glass window
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x90b5d0,
    transparent: true,
    opacity: 0.45,
    roughness: 0.08,
    metalness: 0.2,
    transmission: 0.82,
    ior: 1.5,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const glassW = leafW * 0.65;
  const glassH = leafH * 0.42;
  const glassMesh = new THREE.Mesh(new THREE.PlaneGeometry(glassW, glassH), glassMat);
  glassMesh.position.set(0, leafH * 0.66, leafCenterZ);
  glassMesh.rotation.y = Math.PI / 2;
  glassMesh.userData.isDoor = true;
  pivotGroup.add(glassMesh);

  // Glass window frame rim
  box(pivotGroup, leafThick + 0.008, 0.025, glassW + 0.04, frameMat, 0, leafH * 0.66 + glassH / 2, leafCenterZ);
  box(pivotGroup, leafThick + 0.008, 0.025, glassW + 0.04, frameMat, 0, leafH * 0.66 - glassH / 2, leafCenterZ);
  box(pivotGroup, leafThick + 0.008, glassH + 0.04, 0.025, frameMat, 0, leafH * 0.66, leafCenterZ - glassW / 2);
  box(pivotGroup, leafThick + 0.008, glassH + 0.04, 0.025, frameMat, 0, leafH * 0.66, leafCenterZ + glassW / 2);

  // Door handles (Sleek chrome lever handle on both sides: -X lab side and +X meeting room side)
  const handleZ = leafW - 0.12;
  const handleY = 1.05;

  [-leafThick / 2 - 0.012, leafThick / 2 + 0.012].forEach((hx) => {
    // Escutcheon backplate
    box(pivotGroup, 0.008, 0.18, 0.04, chromeMat, hx, handleY, handleZ);
    // Spindle / stem
    cyl(pivotGroup, 0.008, 0.008, 0.045, chromeMat, hx + (hx < 0 ? -0.02 : 0.02), handleY, handleZ, 8).rotation.z = Math.PI / 2;
    // Horizontal lever handle (pointing toward hinge)
    cyl(pivotGroup, 0.01, 0.01, 0.12, chromeMat, hx + (hx < 0 ? -0.04 : 0.04), handleY, handleZ - 0.05, 8).rotation.x = Math.PI / 2;
  });

  // Hinge barrels on the hinge edge (z = 0)
  [0.35, leafH - 0.35].forEach((hy) => {
    cyl(pivotGroup, 0.014, 0.014, 0.10, chromeMat, 0, hy, 0.01, 8);
  });

  // 4. DOOR STATE & ANIMATION LOGIC
  let isOpen = false;
  let isAnimating = false;

  function playLatchSound(opening) {
    try {
      const soundBtn = document.getElementById('sound-toggle');
      if (soundBtn && !soundBtn.classList.contains('on')) return; // Muted

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = opening ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(opening ? 320 : 180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(opening ? 540 : 90, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.20);
    } catch (_) {}
  }

  function toggle(forcedState) {
    if (isAnimating && forcedState === undefined) return;
    const targetState = forcedState !== undefined ? forcedState : !isOpen;
    if (targetState === isOpen) return;

    isOpen = targetState;
    isAnimating = true;
    playLatchSound(isOpen);
    setDoorColliderOpen(isOpen);

    // Swing 90° into the lab side (-Math.PI / 2 around Y)
    const targetRot = isOpen ? -Math.PI / 2 : 0;

    gsap.to(pivotGroup.rotation, {
      y: targetRot,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating = false;
      },
    });

    updatePromptUI();
  }

  function updatePromptUI() {
    const prompt = document.getElementById('action-prompt');
    if (!prompt) return;
    const textEl = prompt.querySelector('.prompt-text');
    if (textEl) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        textEl.innerHTML = isOpen ? 'Tap to <b>Close Door</b>' : 'Tap to <b>Open Door</b>';
      } else {
        textEl.innerHTML = isOpen ? 'Press <b>E</b> or Click to close' : 'Press <b>E</b> or Click to open';
      }
    }
  }

  scene.add(g);

  _activeDoor = {
    group: g,
    pivot: pivotGroup,
    toggle,
    get isOpen() { return isOpen; },
    get isAnimating() { return isAnimating; },
    position: new THREE.Vector3(DOOR_X, 1.2, DOOR_Z),
    doorMeshes: [leafBody, glassMesh],
    updatePromptUI,
  };

  return _activeDoor;
}
