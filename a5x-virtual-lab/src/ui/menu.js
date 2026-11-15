/**
 * ui/menu.js — Collapsible zone teleport menu + zone info cards
 */
import { ZONES, CSS_COLORS } from '../config.js';

export function createMenu(onTeleport) {
  const nav = document.getElementById('menu');
  const toggleBtn = document.getElementById('menu-toggle');

  // Populate zone buttons
  ZONES.forEach((zone) => {
    const btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.innerHTML = `<span class="menu-icon">${zone.icon}</span> ${zone.title}`;
    btn.addEventListener('click', () => onTeleport(zone));
    nav.appendChild(btn);
  });

  // Toggle collapse on mobile
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('collapsed');
      toggleBtn.textContent = nav.classList.contains('collapsed') ? '☰' : '✕';
    });
  }
}

/** Zone info card that appears when player enters a zone */
export function createZoneCard() {
  const card = document.getElementById('zone-card');
  const titleEl = card?.querySelector('.zone-card-title');
  const descEl = card?.querySelector('.zone-card-desc');
  let current = null;

  return {
    show(zone) {
      if (zone === current) return;
      current = zone;
      if (!zone) {
        card?.classList.remove('visible');
        return;
      }
      if (titleEl) titleEl.textContent = zone.title;
      if (descEl) descEl.textContent = zone.desc;
      card?.classList.add('visible');
    },
    get current() { return current; },
  };
}
