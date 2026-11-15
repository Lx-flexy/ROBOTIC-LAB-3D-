/**
 * zones/centre.js — Central tables, chairs, plants, and grounded contact shadows
 */
import * as THREE from 'three';
import { box } from '../../utils/geometry.js';
import { M, C } from '../../utils/materials.js';
import { createTable, createChair, createPlant } from '../props/furniture.js';

export function buildCentre(scene) {
  const shadowMat = M(0x000000, { transparent: true, opacity: 0.16, roughness: 1 });
  const legShadowMat = M(0x000000, { transparent: true, opacity: 0.22, roughness: 1 });

  // Two long tables running front-to-back
  [-6.5, 6.5].forEach(x => {
    // 1. Soft Table Footprint Contact Shadow / AO on Floor (y = 0.052)
    const tableShadow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 14.2), shadowMat);
    tableShadow.rotation.x = -Math.PI / 2;
    tableShadow.position.set(x, 0.052, 2);
    scene.add(tableShadow);

    // 2. Table Leg Darker Contact Pads (4 corners)
    const lx = 5 / 2 - 0.12, lz = 14 / 2 - 0.12;
    [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([a, b]) => {
      const legPad = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), legShadowMat);
      legPad.rotation.x = -Math.PI / 2;
      legPad.position.set(x + a, 0.0525, 2 + b);
      scene.add(legPad);
    });

    createTable(scene, 5, 14, x, 2);

    // Orange centre stripe on table
    box(scene, 0.6, 0.025, 14, M(C.orange), x, 0.855, 2);

    // Chairs (7 per side = 14 per table = 28 total) + Contact Shadows
    for (let i = 0; i < 7; i++) {
      const z = -3.5 + i * 2;

      // Inner chair & contact shadow
      const cPad1 = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), shadowMat);
      cPad1.rotation.x = -Math.PI / 2;
      cPad1.position.set(x - 3, 0.052, z);
      scene.add(cPad1);
      createChair(scene, x - 3, z, -Math.PI / 2);

      // Outer chair & contact shadow
      const cPad2 = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), shadowMat);
      cPad2.rotation.x = -Math.PI / 2;
      cPad2.position.set(x + 3, 0.052, z);
      scene.add(cPad2);
      createChair(scene, x + 3, z, Math.PI / 2);
    }

    // Plants on tables
    for (let i = 0; i < 3; i++) {
      createPlant(scene, x, 0.84, -1 + i * 3.5, 0.6);
    }
  });

  // Floor cable boxes (dark grey strips resting cleanly on marble floor at y = 0.065)
  [-6.5, 6.5].forEach(x => {
    box(scene, 1.2, 0.04, 0.4, M(0x333333), x, 0.07, -2);
    box(scene, 1.2, 0.04, 0.4, M(0x333333), x, 0.07, 6);
  });
}
