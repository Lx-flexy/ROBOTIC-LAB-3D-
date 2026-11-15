/**
 * main.js — Entry point: init renderer, scene, controls, UI, animation loop
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ZONES, BRAND_SHORT, LAB_TITLE } from './config.js';
import { detectQuality, showWebGLFallback } from './utils/performance.js';
import { buildShell } from './scene/building.js';
import { buildCentre } from './scene/zones/centre.js';
import { buildBackWall } from './scene/zones/backwall.js';
import { buildTestingZone } from './scene/zones/testing.js';
import { buildRightWall } from './scene/zones/rightwall.js';
import { buildHardwareZone } from './scene/zones/hardware.js';
import { buildArVrLab } from './scene/zones/arvr.js';
import { getInteractiveDoor } from './scene/props/door.js';
import { FirstPersonControls } from './controls/FirstPersonControls.js';
import { createLoader } from './ui/loader.js';
import { createMenu, createZoneCard } from './ui/menu.js';
import { createInfoPanel, findNearestHotspot } from './ui/infoPanel.js';
import { createMinimap } from './ui/minimap.js';
import { createSoundToggle } from './ui/sound.js';

const $ = (s) => document.querySelector(s);

// ══════════════════ QUALITY CHECK ══════════════════
const quality = detectQuality();
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas: $('#scene'),
    antialias: quality.antialias,
    powerPreference: 'high-performance',
  });
} catch (e) {
  showWebGLFallback();
  throw e;
}
if (!renderer.capabilities.isWebGL2 && !renderer.capabilities) {
  showWebGLFallback();
  throw new Error('WebGL not available');
}

renderer.setPixelRatio(quality.dpr);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ══════════════════ SCENE + CAMERA ══════════════════
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1, 0.15, 120);
camera.position.set(0, 1.7, 32); // Start outside

// ══════════════════ LIGHTING ══════════════════
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffd9b0, 1.0);
scene.add(hemiLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(15, 30, 25);
scene.add(sun);

// ══════════════════ BUILD WORLD ══════════════════
const loader = createLoader();
loader.update(0.1);

const { doors, animParts, mascot } = buildShell(scene);
loader.update(0.3);

buildCentre(scene);
loader.update(0.45);

const backWallAnim = buildBackWall(scene);
loader.update(0.6);

const testingAnim = buildTestingZone(scene);
loader.update(0.75);

const rightWallAnim = buildRightWall(scene);
loader.update(0.85);

const hardwareAnim = buildHardwareZone(scene);
loader.update(0.92);

let arvrAnim;
try {
  arvrAnim = buildArVrLab(scene);
} catch (err) {
  console.error('[AR/VR Lab] Error during build:', err);
}
loader.update(0.98);

// ══════════════════ CONTROLS ══════════════════
const controls = new FirstPersonControls(camera, renderer.domElement, $('#stick'));

// ══════════════════ UI ══════════════════
const zoneCard = createZoneCard();
const infoPanel = createInfoPanel();
const minimap = createMinimap(camera);

createMenu((zone) => {
  // Close all popups on teleport
  infoPanel.hide();
  zoneCard.hide();
  currentZone = null;
  $('#action-prompt')?.classList.add('hidden');

  // If teleporting to AR / VR Lab, make sure the door is open so the user sees inside
  if (zone.id === 'arvr' || zone.id === 'meeting') {
    const door = getInteractiveDoor();
    if (door && !door.isOpen) {
      door.toggle(true);
    }
  }
  // Smooth fly-to teleport
  gsap.to(camera.position, {
    x: zone.stand[0],
    z: zone.stand[1],
    y: 1.7,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => controls.setYaw(zone.yaw),
  });
});

loader.update(1.0);
createSoundToggle();
setTimeout(() => loader.hide(), 400);

// ══════════════════ RESIZE ══════════════════
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);
onResize();

// ══════════════════ STATE MACHINE ══════════════════
let state = 'intro';  // intro -> opening -> walking -> free
let transTime = 0;
let currentZone = null;

function startFreeMode() {
  state = 'free';
  controls.enabled = true;
  $('#hud')?.classList.remove('hidden');
  if (quality.isMobile) {
    $('#stick')?.classList.remove('hidden');
  }
}

// ── Enter button ──
$('#enterBtn')?.addEventListener('click', () => {
  state = 'opening';
  transTime = 0;
  gsap.to($('#intro'), { opacity: 0, duration: 0.8, onComplete: () => {
    $('#intro')?.classList.add('hidden');
  }});
});

// ── Skip intro ──
$('#skipBtn')?.addEventListener('click', () => {
  doors.forEach((d) => { d.pivot.rotation.y = d.s * -1.7; });
  camera.position.set(0, 1.7, 8);
  controls.setYaw(0);
  $('#intro')?.classList.add('hidden');
  startFreeMode();
});

// ── Door interaction & Hotspot click ──
const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();

function handleInteraction(clientX, clientY) {
  if (state !== 'free') return;

  // If an info popup is currently open, clicking anywhere closes it
  if (infoPanel.isOpen()) {
    infoPanel.hide();
    return;
  }

  const door = getInteractiveDoor();
  if (door) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);
    const hits = raycaster.intersectObjects(door.doorMeshes, true);
    if (hits.length > 0 && hits[0].distance < 6.5) {
      door.toggle();
      return;
    }
  }

  const hotspot = findNearestHotspot(camera, 5);
  if (hotspot) {
    // Only ONE popup at a time: close zoneCard and door prompt, then open infoPanel
    zoneCard.hide();
    currentZone = null;
    $('#action-prompt')?.classList.add('hidden');
    infoPanel.show(hotspot);
  }
}

renderer.domElement.addEventListener('click', (e) => {
  handleInteraction(e.clientX, e.clientY);
});

// Key E for door open/close or closing active popup
window.addEventListener('keydown', (e) => {
  if (state !== 'free') return;
  if (e.key === 'e' || e.key === 'E') {
    if (infoPanel.isOpen()) {
      infoPanel.hide();
      return;
    }
    const door = getInteractiveDoor();
    if (door && camera.position.distanceTo(door.position) < 4.0) {
      door.toggle();
    }
  }
});

// Action prompt click (for both desktop and mobile tap)
$('#action-prompt')?.addEventListener('click', () => {
  const door = getInteractiveDoor();
  if (door) door.toggle();
});

// ══════════════════ ANIMATION LOOP ══════════════════
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  // ── Animated elements ──
  // Spinning print objects
  backWallAnim.spin.forEach((o) => { o.rotation.y += dt * 1.5; });
  if (rightWallAnim?.spin) {
    rightWallAnim.spin.forEach((o) => { o.rotation.y += dt * 1.5; });
  }
  if (hardwareAnim?.spin) {
    hardwareAnim.spin.forEach((o) => { o.rotation.y += dt * 1.5; });
  }
  // Ceiling fans
  animParts.fans.forEach((f) => { f.rotation.y += dt * 5; });
  if (arvrAnim?.fans) {
    arvrAnim.fans.forEach((f) => { f.rotation.y += dt * 4.5; });
  }
  // Hovering drone (bob)
  testingAnim.bob.forEach((o) => {
    o.position.y = 3.5 + Math.sin(elapsed * 2) * 0.2;
    o.rotation.y += dt * 0.8;
  });
  // Soccer ball movement
  if (testingAnim.ball) {
    testingAnim.ball.position.x = -15.5 + Math.sin(elapsed * 0.7) * 1.5;
    testingAnim.ball.position.z = -5.6 + Math.cos(elapsed * 0.5) * 0.6;
  }
  // Mascot head turn
  const headObj = scene.getObjectByName('mascotHead');
  if (headObj) {
    headObj.rotation.y = Math.sin(elapsed * 0.8) * 0.5;
  }

  // ── State machine ──
  switch (state) {
    case 'intro':
      // Gentle camera sway
      camera.position.x = Math.sin(elapsed * 0.3) * 1.5;
      camera.position.y = 1.7 + Math.sin(elapsed * 0.5) * 0.1;
      camera.lookAt(0, 3, 15);
      break;

    case 'opening':
      transTime += dt;
      // Swing doors open
      const doorAngle = Math.min(transTime / 2.2, 1) * 1.7;
      doors.forEach((d) => { d.pivot.rotation.y = d.s * -doorAngle; });
      if (transTime > 2.2) {
        state = 'walking';
      }
      break;

    case 'walking':
      // Glide camera forward through the gate
      camera.position.z -= dt * 5;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
      camera.lookAt(0, 2.5, camera.position.z - 10);
      if (camera.position.z < 8) {
        startFreeMode();
      }
      break;

    case 'free':
      controls.update(dt);

      if (infoPanel.isOpen()) {
        // While hotspot popup is active, keep other popups suppressed
        zoneCard.hide();
        currentZone = null;
        $('#action-prompt')?.classList.add('hidden');
      } else {
        // Zone proximity check (only 1 zone card at a time)
        let nearestZone = null;
        let bestDist = Infinity;
        for (const z of ZONES) {
          const d = Math.hypot(
            camera.position.x - z.center[0],
            camera.position.z - z.center[1]
          );
          if (d < z.r && d < bestDist) {
            bestDist = d;
            nearestZone = z;
          }
        }
        if (nearestZone !== currentZone) {
          currentZone = nearestZone;
          zoneCard.show(nearestZone);
        }

        // Check interactive door proximity for prompt (only when no info popup is open)
        const door = getInteractiveDoor();
        const promptEl = $('#action-prompt');
        if (door && promptEl) {
          const dDoor = camera.position.distanceTo(door.position);
          if (dDoor < 4.0) {
            promptEl.classList.remove('hidden');
            door.updatePromptUI();
          } else {
            promptEl.classList.add('hidden');
          }
        }
      }
      // Update minimap
      minimap.update();
      break;
  }

  renderer.render(scene, camera);
});
