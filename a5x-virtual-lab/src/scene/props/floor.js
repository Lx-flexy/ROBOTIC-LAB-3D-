/**
 * props/floor.js — Photo-Accurate Gray Marble Floor with Subtle Seams,
 * Central Lighter Walkway Strip, Muted Yellow Guide Lines, and Soft Glossy Reflections.
 *
 * Built to match reference image (media_1794746907831_7860e79d.jpg):
 *  - Light-to-mid gray marble base (#B2B2B7 / #A8A8AD to #B9B9BD)
 *  - Organic white and soft charcoal veining with clouding
 *  - Subtle 1.2m x 1.2m tile seams with faint beveled edge highlights
 *  - Satin sheen (roughness = 0.35, metalness = 0.0) removing specular glare spots
 *  - Lighter rectangular walkway strip (#C8C8CD) along the central aisle (x = -2.0 to +2.0)
 *  - Two thin muted golden-yellow guide lines (#D4A237) centered in walkway
 *  - Outer darker marble inlay border bands
 *  - Seamless procedural texture (2048x2048, toroidal wrapping, max anisotropy, sRGB)
 */

import * as THREE from 'three';
import { box } from '../../utils/geometry.js';
import { M } from '../../utils/materials.js';

// Cached textures
let _mainMarbleTex = null;
let _walkwayMarbleTex = null;

/** Create and return the complete marble floor assembly */
export function createHallFloor(scene) {
  const g = new THREE.Group();

  // 1. Structural base slab (replaces old plain floor box)
  box(g, 40, 0.1, 30, M(0x808084, { roughness: 0.9 }), 0, 0, 0);

  // 2. High-Res Procedural Gray Marble Floor Surface (40m x 30m at y = 0.05)
  const mainTex = getMarbleTexture(false);
  const mainMat = new THREE.MeshStandardMaterial({
    map: mainTex,
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.0,
    envMapIntensity: 0.4,
  });

  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), mainMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.05, 0);
  floorMesh.receiveShadow = true;
  g.add(floorMesh);

  // 3. Central Lighter Marble Walkway Strip (x = -2.0 to +2.0, z = -14.6 to +14.6)
  // Clear of central tables (tables are at x = ±6.5, chairs end at x = ±3.5)
  const walkW = 4.0;
  const walkL = 29.2;
  const walkTex = getMarbleTexture(true);

  const walkMat = new THREE.MeshStandardMaterial({
    map: walkTex,
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.0,
    envMapIntensity: 0.4,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const walkwayMesh = new THREE.Mesh(new THREE.PlaneGeometry(walkW, walkL), walkMat);
  walkwayMesh.rotation.x = -Math.PI / 2;
  walkwayMesh.position.set(0, 0.051, 0);
  walkwayMesh.receiveShadow = true;
  g.add(walkwayMesh);

  // 4. Darker Charcoal Marble Inlay Border Bands on Walkway Edges (width = 0.06m)
  const borderMat = M(0x5c5c62, { roughness: 0.38, metalness: 0.0 });
  [-walkW / 2 + 0.03, walkW / 2 - 0.03].forEach((bx) => {
    box(g, 0.06, 0.002, walkL, borderMat, bx, 0.0515, 0);
  });

  // 5. Two Thin Muted Golden-Yellow Guide Lines (width = 0.035m, spaced 1.3m apart)
  const yellowLineMat = M(0xd4a237, { roughness: 0.55, metalness: 0.0 });
  [-0.65, 0.65].forEach((lx) => {
    box(g, 0.035, 0.002, walkL - 0.2, yellowLineMat, lx, 0.052, 0);
  });

  scene.add(g);
  return g;
}

/**
 * Generate a 2048x2048 seamless, tileable gray marble texture with organic veining
 * and subtle 1.2m x 1.2m tile grout seams.
 */
function getMarbleTexture(isWalkway = false) {
  if (isWalkway && _walkwayMarbleTex) return _walkwayMarbleTex;
  if (!isWalkway && _mainMarbleTex) return _mainMarbleTex;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const W = isMobile ? 1024 : 2048;
  const H = isMobile ? 1024 : 2048;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(W, H);
  const data = imgData.data;

  // Base tones:
  // Main floor: mid-gray (#B2B2B7, R=178, G=178, B=183)
  // Walkway: lighter gray (#CECED2, R=206, G=206, B=210)
  const baseR = isWalkway ? 206 : 178;
  const baseG = isWalkway ? 206 : 178;
  const baseB = isWalkway ? 210 : 183;

  for (let y = 0; y < H; y++) {
    const v = y / H;
    const sinV = Math.sin(v * Math.PI * 2);
    const cosV = Math.cos(v * Math.PI * 2);

    for (let x = 0; x < W; x++) {
      const u = x / W;
      const sinU = Math.sin(u * Math.PI * 2);
      const cosU = Math.cos(u * Math.PI * 2);

      // 1. Toroidal periodic domain warping (guarantees 100% seamless tileability)
      const w1 = Math.sin((u * 4 + v * 3) * Math.PI * 2) * 0.45 + Math.cos((u * 2 - v * 5) * Math.PI * 2) * 0.30;
      const w2 = Math.cos((u * 5 - v * 2) * Math.PI * 2) * 0.35 + Math.sin((u * 3 + v * 4) * Math.PI * 2) * 0.25;

      // 2. Vein Coordinates with natural diagonal fracture flow
      const coord1 = (u * 3 + v * 4 + w1 * 0.65) * Math.PI * 2;
      const coord2 = (u * 6 - v * 5 + w2 * 0.75) * Math.PI * 2;
      const coord3 = (u * 12 + v * 10 + (w1 - w2) * 0.4) * Math.PI * 2;

      const v1 = Math.sin(coord1);
      const v2 = Math.sin(coord2);
      const v3 = Math.sin(coord3);

      // 3. Organic mineral clouds / mottling
      const cloud = (sinU * cosV + cosU * sinV) * 5.5 + Math.sin((u * 2 - v * 2) * Math.PI * 2) * 3.0;

      // 4. Non-linear veining response:
      // Dark smoky charcoal veins
      const veinDark =
        Math.pow(Math.max(0, -v1), 3.5) * 52 +
        Math.pow(Math.max(0, -v2), 4.0) * 32 +
        Math.pow(Math.max(0, -v3), 5.0) * 18;

      // Crisp frosty white/light-gray veins
      const veinWhite =
        Math.pow(Math.max(0, v1), 3.0) * 44 +
        Math.pow(Math.max(0, v2), 3.5) * 28 +
        Math.pow(Math.max(0, v3), 4.5) * 16;

      // 5. Subtle Tile Grout Seams (4x4 tiles in 4.8m x 4.8m patch = 1.2m x 1.2m tiles)
      const tileU = (u * 4) % 1;
      const tileV = (v * 4) % 1;
      const distU = Math.min(tileU, 1 - tileU);
      const distV = Math.min(tileV, 1 - tileV);
      const seamDist = Math.min(distU, distV) * (W / 4); // distance in pixels to nearest seam

      let seamMod = 0;
      if (seamDist < 2.5) {
        // Soft darkening on the seam line
        seamMod = -(2.5 - seamDist) * 14;
      } else if (seamDist >= 2.5 && seamDist < 4.5) {
        // Very subtle micro-highlight on beveled edge
        seamMod = (4.5 - seamDist) * 3.5;
      }

      // Final RGB composition
      const r = Math.min(255, Math.max(0, Math.round(baseR + cloud + veinWhite - veinDark + seamMod)));
      const g = Math.min(255, Math.max(0, Math.round(baseG + cloud + veinWhite - veinDark + seamMod)));
      const b = Math.min(255, Math.max(0, Math.round(baseB + cloud + veinWhite * 1.04 - veinDark * 0.96 + seamMod)));

      const idx = (y * W + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;

  // 4.8m x 4.8m patch repeat:
  // Main hall: 40m x 30m -> 40/4.8 ≈ 8.333, 30/4.8 = 6.25
  // Walkway: 4.0m x 29.2m -> 4.0/4.8 ≈ 0.833, 29.2/4.8 ≈ 6.083
  if (isWalkway) {
    tex.repeat.set(4.0 / 4.8, 29.2 / 4.8);
  } else {
    tex.repeat.set(40 / 4.8, 30 / 4.8);
  }

  tex.anisotropy = isMobile ? 4 : 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;

  if (isWalkway) {
    _walkwayMarbleTex = tex;
  } else {
    _mainMarbleTex = tex;
  }

  return tex;
}
