/**
 * ui/loader.js — Loading screen with progress bar and brand logo
 */
import { BRAND_SHORT, LAB_TITLE, CSS_COLORS } from '../config.js';

export function createLoader() {
  const el = document.getElementById('loader');
  if (!el) return { update: () => {}, hide: () => {} };

  const bar = el.querySelector('.loader-bar-fill');
  const text = el.querySelector('.loader-text');

  return {
    update(progress) {
      if (bar) bar.style.width = `${Math.min(progress * 100, 100)}%`;
      if (text) text.textContent = `Loading ${Math.round(progress * 100)}%`;
    },
    hide() {
      el.style.opacity = '0';
      setTimeout(() => { el.style.display = 'none'; }, 800);
    },
  };
}
