/**
 * utils/geometry.js — Reusable geometry helpers: box, cylinder, placement
 */
import * as THREE from 'three';

/** Add a box mesh to parent and return it */
export function box(parent, w, h, d, mat, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

/** Add a cylinder mesh to parent and return it */
export function cyl(parent, rt, rb, h, mat, x = 0, y = 0, z = 0, seg = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

/** Place an existing object in parent at position with optional Y rotation */
export function put(parent, obj, x, y, z, ry = 0) {
  obj.position.set(x, y, z);
  obj.rotation.y = ry;
  parent.add(obj);
  return obj;
}
