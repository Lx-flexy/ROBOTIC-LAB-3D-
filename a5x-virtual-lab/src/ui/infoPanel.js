/**
 * ui/infoPanel.js — Clickable hotspot info panels
 */
import { HOTSPOTS } from '../config.js';
import * as THREE from 'three';

export function createInfoPanel() {
  const panel = document.getElementById('info-panel');
  const titleEl = panel?.querySelector('.info-title');
  const descEl = panel?.querySelector('.info-desc');
  const closeBtn = panel?.querySelector('.info-close');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('visible');
    });
  }

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') panel?.classList.remove('visible');
  });

  return {
    show(hotspot) {
      if (!panel) return;
      if (titleEl) titleEl.textContent = hotspot.title;
      if (descEl) descEl.textContent = hotspot.desc;
      panel.classList.add('visible');
    },
    hide() {
      panel?.classList.remove('visible');
    },
  };
}

/** Check if camera is near a hotspot and player clicked */
export function findNearestHotspot(camera, maxDist = 4) {
  let nearest = null;
  let bestDist = maxDist;
  for (const hs of HOTSPOTS) {
    const d = camera.position.distanceTo(new THREE.Vector3(...hs.pos));
    if (d < bestDist) {
      bestDist = d;
      nearest = hs;
    }
  }
  return nearest;
}
