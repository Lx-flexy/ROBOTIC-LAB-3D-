/**
 * ui/infoPanel.js — Clickable hotspot info panels
 */
import { HOTSPOTS } from '../config.js';
import * as THREE from 'three';

export function createInfoPanel(onClose) {
  const panel = document.getElementById('info-panel');
  const titleEl = panel?.querySelector('.info-title');
  const descEl = panel?.querySelector('.info-desc');
  const closeBtn = panel?.querySelector('.info-close');

  function hide() {
    if (panel?.classList.contains('visible')) {
      panel.classList.remove('visible');
      if (typeof onClose === 'function') onClose();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hide();
    });
  }

  // Close on Escape or E key
  window.addEventListener('keydown', (e) => {
    if (panel?.classList.contains('visible')) {
      if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') {
        hide();
        e.stopPropagation();
      }
    }
  });

  return {
    show(hotspot) {
      if (!panel) return;
      if (titleEl) titleEl.textContent = hotspot.title;
      if (descEl) descEl.textContent = hotspot.desc;
      panel.classList.add('visible');
    },
    hide,
    isOpen() {
      return panel?.classList.contains('visible') || false;
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
