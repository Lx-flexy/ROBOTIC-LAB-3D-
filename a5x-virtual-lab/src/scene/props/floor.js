/**
 * props/floor.js — Robust, Single-Mesh Gray Marble Floor with Baked Walkway & Guide Lines.
 *
 * All floor elements (gray marble base, 1.25m tile seams, lighter walkway strip,
 * dark slate border inlays, and two thin muted yellow guide lines) are baked directly
 * into ONE single high-resolution texture applied to ONE single floor mesh.
 *
 * This completely ELIMINATES:
 *  - Z-fighting between floor, walkway, borders, and guide lines (zero extra meshes)
 *  - Transparent sorting glitches
 *  - Fractional UV tiling moiré and seams
 *  - Glancing-angle depth buffer quantization errors
 */

import * as THREE from 'three';
import { box } from '../../utils/geometry.js';
import { M } from '../../utils/materials.js';

let _cachedFloorTex = null;

/** Create and return the single-mesh marble floor */
export function createHallFloor(scene) {
  const g = new THREE.Group();

  // 1. Single structural slab with baked gray marble floor material
  const floorTex = getBakedFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.0,
    envMapIntensity: 0.0, // Clean non-flickering specular
  });

  // Top surface is at y = 0.05, bottom at y = -0.05, exactly meeting the walls & baseboard
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, 30), floorMat);
  floorMesh.position.set(0, 0, 0);
  g.add(floorMesh);

  scene.add(g);
  return g;
}

/**
 * Generate a single comprehensive floor texture containing:
 *  - Gray marble field (#B2B2B7) across the 40m x 30m hall
 *  - Faint, elegant tile grout seams (every 1.25m in world coordinates)
 *  - Organic flowing white and smoky slate-charcoal veining
 *  - Central lighter walkway strip (#CDCDD2, x = -2.1m to +2.1m)
 *  - Dark slate border inlays along walkway edges (x = ±2.07m, width 0.06m)
 *  - Two thin muted golden-yellow guide lines (x = -0.65m and +0.65m, width 0.035m)
 */
function getBakedFloorTexture() {
  if (_cachedFloorTex) return _cachedFloorTex;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const W = isMobile ? 1024 : 2048;
  const H = isMobile ? 1024 : 2048;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(W, H);
  const data = imgData.data;

  // Hall dimensions: X: -20m to +20m (40m), Z: -15m to +15m (30m)
  // Tile pitch: 1.25m (32 tiles across X, 24 tiles across Z)
  for (let y = 0; y < H; y++) {
    const v = y / H;
    const worldZ = -15 + v * 30;

    for (let x = 0; x < W; x++) {
      const u = x / W;
      const worldX = -20 + u * 40;

      // 1. Zone masks in world coordinates
      const isWalkway = Math.abs(worldX) <= 2.1 && Math.abs(worldZ) <= 14.6;
      const isBorder = isWalkway && Math.abs(Math.abs(worldX) - 2.07) <= 0.035;
      const isYellow = isWalkway && Math.abs(Math.abs(worldX) - 0.65) <= 0.022 && Math.abs(worldZ) <= 14.4;

      // 2. Continuous organic marble veining across the whole hall
      // Scaled by tile size for natural proportions
      const sX = worldX / 1.25;
      const sZ = worldZ / 1.25;

      const w1 = Math.sin(sX * 0.75 + sZ * 0.6) * 0.5 + Math.cos(sX * 0.4 - sZ * 0.85) * 0.3;
      const w2 = Math.cos(sX * 1.05 - sZ * 0.5) * 0.4 + Math.sin(sX * 0.65 + sZ * 0.95) * 0.3;

      const coord1 = (sX * 0.55 + sZ * 0.75 + w1 * 0.65) * Math.PI;
      const coord2 = (sX * 1.2 - sZ * 1.05 + w2 * 0.75) * Math.PI;

      const v1 = Math.sin(coord1);
      const v2 = Math.sin(coord2);

      // Soft mineral clouds
      const cloud = Math.sin(worldX * 0.18 + worldZ * 0.22) * 5.0;

      // Veins: smooth power response without harsh high-frequency noise (prevents shimmer)
      const veinDark = Math.pow(Math.max(0, -v1), 3.2) * 44 + Math.pow(Math.max(0, -v2), 3.8) * 26;
      const veinWhite = Math.pow(Math.max(0, v1), 2.8) * 38 + Math.pow(Math.max(0, v2), 3.2) * 24;

      // 3. Faint 1.25m tile grout seams
      const tileU = Math.abs(sX) % 1;
      const tileV = Math.abs(sZ) % 1;
      const distU = Math.min(tileU, 1 - tileU) * 1.25;
      const distV = Math.min(tileV, 1 - tileV) * 1.25;
      const seamDist = Math.min(distU, distV); // Distance in meters to nearest seam

      let seamMod = 0;
      if (seamDist < 0.022) {
        // Very soft darkening on the grout seam
        seamMod = -((0.022 - seamDist) / 0.022) * 14;
      } else if (seamDist >= 0.022 && seamDist < 0.04) {
        // Subtle micro-highlight on beveled edge
        seamMod = ((0.04 - seamDist) / 0.018) * 2.5;
      }

      // 4. Base color selection
      // Outside: Mid-gray marble (#B2B2B7, R=178, G=178, B=183)
      // Walkway: Lighter gray marble (#CECED3, R=206, G=206, B=211)
      let r = isWalkway ? 206 : 178;
      let g = isWalkway ? 206 : 178;
      let b = isWalkway ? 211 : 183;

      r += cloud + veinWhite - veinDark + seamMod;
      g += cloud + veinWhite - veinDark + seamMod;
      b += cloud + veinWhite * 1.04 - veinDark * 0.96 + seamMod;

      // 5. Walkway Inlay Features
      if (isBorder) {
        // Slate-charcoal border strip
        r = 92 + cloud * 0.5;
        g = 92 + cloud * 0.5;
        b = 98 + cloud * 0.5;
      } else if (isYellow) {
        // Muted golden-yellow guide lines (#D4A237)
        r = 212;
        g = 162;
        b = 55;
      }

      const idx = (y * W + x) * 4;
      data[idx] = Math.min(255, Math.max(0, Math.round(r)));
      data[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      data[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;

  _cachedFloorTex = tex;
  return tex;
}
