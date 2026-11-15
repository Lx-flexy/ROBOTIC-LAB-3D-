/**
 * zones/centre.js — Central tables, chairs, plants, floor guide lines
 */
import * as THREE from 'three';
import { box } from '../../utils/geometry.js';
import { M, C } from '../../utils/materials.js';
import { createTable, createChair, createPlant } from '../props/furniture.js';

export function buildCentre(scene) {
  // Two long tables running front-to-back
  [-6.5, 6.5].forEach(x => {
    createTable(scene, 5, 14, x, 2);
    // Orange centre stripe on table
    box(scene, 0.6, 0.025, 14, M(C.orange), x, 0.855, 2);

    // Chairs (6 per side = 12 per table = 24 total)
    for (let i = 0; i < 7; i++) {
      const z = -3.5 + i * 2;
      createChair(scene, x - 3, z, -Math.PI / 2);
      createChair(scene, x + 3, z, Math.PI / 2);
    }

    // Plants on tables
    for (let i = 0; i < 3; i++) {
      createPlant(scene, x, 0.84, -1 + i * 3.5, 0.6);
    }
  });

  // Floor cable boxes (dark grey strips near tables)
  [-6.5, 6.5].forEach(x => {
    box(scene, 1.2, 0.06, 0.4, M(0x333333), x, 0.03, -2);
    box(scene, 1.2, 0.06, 0.4, M(0x333333), x, 0.03, 6);
  });
}
