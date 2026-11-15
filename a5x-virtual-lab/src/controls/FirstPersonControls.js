/**
 * controls/FirstPersonControls.js
 * Desktop: WASD + mouse look (pointer-lock), Shift to run, click hotspots
 * Mobile: on-screen joystick (left) + drag to look (right half)
 * Collision with walls, tables, pillars, racks
 */
import * as THREE from 'three';
import { HALL } from '../config.js';

// Collision bodies: axis-aligned boxes { xMin, xMax, zMin, zMax }
const COLLIDERS = [
  // Left table
  { xMin: -9.7, xMax: -3.3, zMin: -5.2, zMax: 9.2 },
  // Right table
  { xMin: 3.3, xMax: 9.7, zMin: -5.2, zMax: 9.2 },
  // Left pillar
  { xMin: -4.4, xMax: -3.6, zMin: -9.9, zMax: -9.1 },
  // Right pillar
  { xMin: 3.6, xMax: 4.4, zMin: -9.9, zMax: -9.1 },
  // Back wall zones (benches)
  { xMin: -14, xMax: -8, zMin: -14.9, zMax: -13.3 },
  { xMin: -3, xMax: 3, zMin: -14.9, zMax: -13.3 },
  { xMin: 8, xMax: 14, zMin: -14.9, zMax: -13.3 },
  // Right wall North section (z = -14 to 4.15)
  { xMin: 18.5, xMax: 20.2, zMin: -14, zMax: 4.15 },
  // Right wall South section / Hardware Zone (z = 5.45 to 14.5)
  { xMin: 18.5, xMax: 20.2, zMin: 5.45, zMax: 14.5 },
  // Doorway blocker (active when door is closed)
  { id: 'door_passage', xMin: 19.2, xMax: 20.2, zMin: 4.15, zMax: 5.45 },
  // AR / VR Lab North wall (z = 2.4, Main Display Wall)
  { xMin: 19.8, xMax: 34.0, zMin: 2.0, zMax: 2.45 },
  // AR / VR Lab South wall (z = 16.4, Lounge Wall)
  { xMin: 19.8, xMax: 34.0, zMin: 16.35, zMax: 16.8 },
  // AR / VR Lab East wall (x = 33.8, Window Wall)
  { xMin: 33.65, xMax: 34.2, zMin: 2.4, zMax: 16.4 },
  // AR / VR Lab TV Credenza (8.4m wide)
  { xMin: 22.5, xMax: 31.1, zMin: 2.35, zMax: 3.05 },
  // AR / VR Lab Left Study Tables block
  { xMin: 22.2, xMax: 25.6, zMin: 5.2, zMax: 9.5 },
  // AR / VR Lab Right Study Tables block
  { xMin: 28.0, xMax: 31.4, zMin: 5.2, zMax: 9.5 },
  // AR / VR Lab VR Counter & Showcase
  { xMin: 20.15, xMax: 20.95, zMin: 6.2, zMax: 13.5 },
  // AR / VR Lab Lounge Bookcases & Wall
  { xMin: 22.2, xMax: 31.4, zMin: 15.8, zMax: 16.4 },
  // AR / VR Lab Lounge Coffee Table
  { xMin: 26.2, xMax: 27.4, zMin: 13.7, zMax: 14.7 },
  // Testing zone racks
  { xMin: -20, xMax: -18.5, zMin: -8.5, zMax: 12.5 },
  // Front wall racks
  { xMin: 12.5, xMax: 19, zMin: 13, zMax: 15 },
  // Left wall racks near testing
  { xMin: -14, xMax: -11, zMin: 6, zMax: 10 },
];

/** Dynamically toggle door collision between closed (blocks doorway) and open (blocks open leaf) */
export function setDoorColliderOpen(isOpen) {
  const passageIdx = COLLIDERS.findIndex((c) => c.id === 'door_passage');
  const leafIdx = COLLIDERS.findIndex((c) => c.id === 'door_leaf');

  if (isOpen) {
    if (passageIdx !== -1) COLLIDERS.splice(passageIdx, 1);
    if (leafIdx === -1) {
      // Leaf open into lab at z = 4.15m, x = 18.5 to 19.8m
      COLLIDERS.push({ id: 'door_leaf', xMin: 18.45, xMax: 19.8, zMin: 4.05, zMax: 4.25 });
    }
  } else {
    if (leafIdx !== -1) COLLIDERS.splice(leafIdx, 1);
    if (passageIdx === -1) {
      COLLIDERS.push({ id: 'door_passage', xMin: 19.2, xMax: 20.2, zMin: 4.15, zMax: 5.45 });
    }
  }
}

export class FirstPersonControls {
  constructor(camera, domElement, stickEl) {
    this.cam = camera;
    this.dom = domElement;
    this.enabled = false;
    this.keys = {};
    this.yaw = 0;
    this.pitch = 0;
    this.moveInput = new THREE.Vector2();
    this.pointerLocked = false;

    // Bounds
    this.bounds = {
      xMin: HALL.xMin + 0.6,
      xMax: HALL.xMax - 0.6,
      zMin: HALL.zMin + 0.6,
      zMax: HALL.zMax - 0.5,
    };

    // ── Keyboard ──
    window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

    // ── Mouse look (click to lock, or drag) ──
    this.drag = false;
    domElement.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      if (e.button === 0) {
        this.drag = true;
        if (!this.pointerLocked && document.pointerLockElement !== domElement) {
          domElement.requestPointerLock?.();
        }
      }
    });
    window.addEventListener('mouseup', () => { this.drag = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      if (this.pointerLocked || this.drag) {
        this.look(e.movementX, e.movementY, 0.002);
      }
    });
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === domElement;
    });

    // ── Touch: joystick (left) + look (right) ──
    this.touchLook = null;
    this.stickId = null;
    const knob = stickEl?.querySelector('.stick-knob');

    if (stickEl) {
      stickEl.addEventListener('touchstart', (e) => {
        this.stickId = e.changedTouches[0].identifier;
        e.stopPropagation();
        e.preventDefault();
      }, { passive: false });
    }

    domElement.addEventListener('touchstart', (e) => {
      for (const t of e.changedTouches) {
        if (t.clientX > window.innerWidth * 0.35) {
          this.touchLook = { id: t.identifier, x: t.clientX, y: t.clientY };
        }
      }
    });

    window.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === this.stickId && stickEl) {
          const rect = stickEl.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const maxR = rect.width / 2 - 20;
          let dx = (t.clientX - cx) / maxR;
          let dy = (t.clientY - cy) / maxR;
          const len = Math.min(1, Math.hypot(dx, dy));
          if (len > 0.01) {
            const angle = Math.atan2(dy, dx);
            dx = Math.cos(angle) * len;
            dy = Math.sin(angle) * len;
          }
          this.moveInput.set(dx, dy);
          if (knob) {
            knob.style.transform = `translate(${dx * (maxR - 5)}px, ${dy * (maxR - 5)}px)`;
          }
        } else if (this.touchLook && t.identifier === this.touchLook.id && this.enabled) {
          this.look(t.clientX - this.touchLook.x, t.clientY - this.touchLook.y, 0.004);
          this.touchLook.x = t.clientX;
          this.touchLook.y = t.clientY;
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === this.stickId) {
          this.stickId = null;
          this.moveInput.set(0, 0);
          if (knob) knob.style.transform = '';
        }
        if (this.touchLook && t.identifier === this.touchLook.id) {
          this.touchLook = null;
        }
      }
    });
  }

  look(dx, dy, sensitivity) {
    this.yaw -= dx * sensitivity;
    this.pitch = Math.max(-1.3, Math.min(1.3, this.pitch - dy * sensitivity));
    this.cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  setYaw(y) {
    this.yaw = y;
    this.cam.rotation.set(this.pitch, y, 0, 'YXZ');
  }

  update(dt) {
    if (!this.enabled) return;
    const k = this.keys;

    // Forward/back & strafe from keyboard
    let fwd = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    let strafe = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);

    // Add mobile joystick input
    fwd -= this.moveInput.y;
    strafe += this.moveInput.x;

    // Sprint
    const speed = (k.ShiftLeft || k.ShiftRight ? 9 : 5) * dt;

    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    const pos = this.cam.position;
    const oldX = pos.x;
    const oldZ = pos.z;

    // Move
    pos.x += (-sinY * fwd + cosY * strafe) * speed;
    pos.z += (-cosY * fwd - sinY * strafe) * speed;

    // Dynamic boundary clamping (Main hall + AR / VR Lab annex)
    if (pos.x > 19.4) {
      // Inside AR / VR Lab
      pos.x = Math.min(33.4, pos.x);
      pos.z = Math.max(2.7, Math.min(16.0, pos.z));
    } else {
      // Inside Main Lab
      pos.x = Math.max(this.bounds.xMin, pos.x);
      pos.z = Math.max(this.bounds.zMin, Math.min(this.bounds.zMax, pos.z));
    }

    // Collision response (slide along surfaces)
    if (this.hitTest(pos.x, pos.z)) {
      // Try keeping new X only
      if (!this.hitTest(pos.x, oldZ)) {
        pos.z = oldZ;
      }
      // Try keeping new Z only
      else if (!this.hitTest(oldX, pos.z)) {
        pos.x = oldX;
      }
      // Both fail — revert
      else {
        pos.x = oldX;
        pos.z = oldZ;
      }
    }

    // Keep camera at eye height
    pos.y = 1.7;
  }

  hitTest(x, z) {
    const r = 0.35; // player radius
    for (const c of COLLIDERS) {
      if (x + r > c.xMin && x - r < c.xMax && z + r > c.zMin && z - r < c.zMax) {
        return true;
      }
    }
    return false;
  }
}
