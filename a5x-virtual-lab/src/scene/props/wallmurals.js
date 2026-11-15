/**
 * props/wallmurals.js
 * Zone wall murals — slim upper-wall banners that sit cleanly
 * ABOVE all furniture (workbench top ≈ y 0.82, shelves ≈ y 2.6, TV top ≈ y 3.8)
 * Every mural is a wide, low-profile strip placed high on the wall (y ≥ 4.0).
 */
import * as THREE from 'three';
import { canvasTex } from '../../utils/materials.js';

/* ═══════════════ TINY SHARED HELPERS ═══════════════ */

function rrect(g, x, y, w, h, r, fill, stroke) {
  g.beginPath(); g.roundRect(x, y, w, h, r);
  if (fill)   { g.fillStyle   = fill;   g.fill();   }
  if (stroke) { g.strokeStyle = stroke; g.stroke(); }
}

function txt(g, text, x, y, size, col, align = 'center', base = 'middle') {
  g.fillStyle = col;
  g.font = `bold ${size}px 'Segoe UI', sans-serif`;
  g.textAlign = align; g.textBaseline = base;
  g.fillText(text, x, y);
}

/**
 * Real SRI logo — lotus tree icon + bold "SRI" text + orange swoosh underline
 * cx,cy = centre of the whole logo block; r = scale unit (~half the icon radius)
 * textColor: '#14284b' for light backgrounds, '#fff' for dark backgrounds
 */
function sriLogo(g, cx, cy, r, textColor = '#14284b') {
  // ── LOTUS TREE (orange leaf clusters fanning upward) ──
  const treeTop = cy - r * 1.05; // top of tree
  const stemBase = cy - r * 0.05; // where stem meets text area

  // Stem
  g.fillStyle = '#c05010';
  g.fillRect(cx - r * 0.07, treeTop + r * 0.55, r * 0.14, stemBase - (treeTop + r * 0.55));

  // Leaf clusters — 13 blobs in a wide fan arc (upward half-circle)
  const leafCount = 13;
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);           // 0 … 1
    const angle = Math.PI + t * Math.PI;     // 180° → 360° (bottom-left → bottom-right arc = upward fan)
    const dist = r * (0.42 + 0.26 * Math.sin(t * Math.PI)); // taller in center
    const lx = cx + Math.cos(angle) * dist;
    const ly = treeTop + r * 0.68 + Math.sin(angle) * dist * 0.72;
    // radius: larger in the middle
    const lr = r * (0.19 + 0.10 * Math.sin(t * Math.PI));
    // colour: dark orange center → warm orange outer
    const mix = Math.sin(t * Math.PI);
    const red = Math.round(200 + 30 * mix);
    const grn = Math.round(80 + 20 * (1 - Math.abs(t - 0.5) * 2));
    g.fillStyle = `rgb(${red},${grn},10)`;
    g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fill();
  }
  // A few inner highlight blobs (lighter orange)
  for (let i = 1; i < leafCount - 1; i += 2) {
    const t = i / (leafCount - 1);
    const angle = Math.PI + t * Math.PI;
    const dist = r * (0.22 + 0.14 * Math.sin(t * Math.PI));
    const lx = cx + Math.cos(angle) * dist;
    const ly = treeTop + r * 0.68 + Math.sin(angle) * dist * 0.65;
    g.fillStyle = '#f5a030';
    g.beginPath(); g.arc(lx, ly, r * 0.10, 0, Math.PI * 2); g.fill();
  }

  // ── "SRI" in bold serif (textColor) ──
  const fontSize = Math.round(r * 1.05);
  g.fillStyle = textColor;
  g.font = `900 ${fontSize}px Georgia, 'Times New Roman', serif`;
  g.textAlign = 'center'; g.textBaseline = 'top';
  g.fillText('SRI', cx, stemBase + r * 0.08);

  // ── Orange swoosh underline beneath "SRI" ──
  const swY = stemBase + r * 0.08 + fontSize + r * 0.08; // just below text
  g.strokeStyle = '#ff7a00';
  g.lineWidth = Math.max(3, r * 0.13);
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - r * 1.0, swY);
  g.quadraticCurveTo(cx + r * 0.15, swY + r * 0.38, cx + r * 1.0, swY - r * 0.08);
  g.stroke();
}

/** Hexagonal badge */
function hexBadge(g, cx, cy, r, iconText) {
  g.fillStyle = '#14284b';
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i/6)*Math.PI*2 - Math.PI/6;
    const px = cx + r*Math.cos(a), py = cy + r*Math.sin(a);
    i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
  }
  g.closePath(); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 5; g.stroke();
  txt(g, iconText, cx, cy, Math.round(r*.45), '#ff7a00');
}

/** Small icon card (outline only) */
function iconCard(g, cx, cy, cW, cH, iconFn, labelText) {
  g.lineWidth = 4; g.strokeStyle = '#ff7a00'; g.fillStyle = '#fff8f0';
  g.beginPath(); g.roundRect(cx - cW/2, cy - cH/2, cW, cH, 14); g.fill(); g.stroke();
  // orange top pip
  g.fillStyle = '#ff7a00';
  g.beginPath(); g.roundRect(cx - cW/2, cy - cH/2, cW, 8, [14,14,0,0]); g.fill();
  iconFn(g, cx, cy - cH*.1, cW*.38);
  txt(g, labelText, cx, cy + cH*.34, Math.round(cW*.14), '#14284b');
}

/** Arrow between flow steps */
function arrowRight(g, cx, cy, s) {
  g.fillStyle = '#14284b';
  g.beginPath();
  g.moveTo(cx - s, cy - s*.55); g.lineTo(cx + s, cy); g.lineTo(cx - s, cy + s*.55);
  g.closePath(); g.fill();
}

/** Orange circuit-line decoration */
function circuit(g, x, y, dir) {
  g.strokeStyle = '#ff7a00'; g.lineWidth = 4; g.lineCap = 'round';
  g.beginPath();
  g.moveTo(x, y); g.lineTo(x + dir*72, y);
  g.lineTo(x + dir*72, y - 26); g.lineTo(x + dir*140, y - 26);
  g.stroke();
  [0, 72, 140].forEach(d => {
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.arc(x + dir*d, y, 7, 0, Math.PI*2); g.fill();
  });
  g.beginPath();
  g.moveTo(x + dir*20, y + 40); g.lineTo(x + dir*105, y + 40);
  g.lineTo(x + dir*105, y + 68); g.lineTo(x + dir*175, y + 68);
  g.stroke();
  [20, 105, 175].forEach(d => {
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.arc(x + dir*d, y + 40, 5, 0, Math.PI*2); g.fill();
  });
}

/* ══════════ ICON DRAWERS (all draw at scale `s` around cx,cy) ══════════ */

const ico = {
  robot(g, cx, cy, s) {
    g.fillStyle = '#14284b';
    g.beginPath(); g.roundRect(cx - s*.28, cy - s*.46, s*.56, s*.38, 6); g.fill();
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.arc(cx - s*.1, cy - s*.29, s*.07, 0, Math.PI*2); g.fill();
    g.beginPath(); g.arc(cx + s*.1, cy - s*.29, s*.07, 0, Math.PI*2); g.fill();
    g.fillStyle = '#14284b'; g.fillRect(cx - s*.22, cy - s*.05, s*.44, s*.35);
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.roundRect(cx - s*.12, cy + s*.04, s*.24, s*.16, 3); g.fill();
    g.fillStyle = '#14284b';
    [-1,1].forEach(d => g.fillRect(cx+d*s*.22, cy-s*.05, d*s*.17, s*.25));
    [-1,1].forEach(d => g.fillRect(cx+d*s*.1, cy+s*.3, s*.09, s*.17));
  },
  drone(g, cx, cy, s) {
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy]) => {
      g.strokeStyle = '#14284b'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+dx*s*.4, cy+dy*s*.32); g.stroke();
      g.strokeStyle = '#ff7a00'; g.lineWidth = 3;
      g.beginPath(); g.arc(cx+dx*s*.4, cy+dy*s*.32, s*.1, 0, Math.PI*2); g.stroke();
    });
    g.fillStyle = '#14284b'; g.beginPath(); g.arc(cx,cy,s*.11,0,Math.PI*2); g.fill();
  },
  vr(g, cx, cy, s) {
    g.fillStyle = '#14284b';
    g.beginPath(); g.roundRect(cx-s*.47, cy-s*.25, s*.94, s*.5, 12); g.fill();
    [[cx-s*.19,cy],[cx+s*.19,cy]].forEach(([lx,ly]) => {
      g.fillStyle = '#1a9af7';
      g.beginPath(); g.ellipse(lx, ly, s*.14, s*.18, 0, 0, Math.PI*2); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(lx-3, ly-3, 3, 0, Math.PI*2); g.fill();
    });
  },
  ai(g, cx, cy, s) {
    const sq = s*.62;
    g.fillStyle = '#14284b';
    g.beginPath(); g.roundRect(cx-sq/2, cy-sq/2, sq, sq, 8); g.fill();
    g.fillStyle = '#ff7a00';
    g.font = `bold ${Math.round(sq*.42)}px monospace`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('AI', cx, cy-2);
    g.font = `${Math.round(sq*.24)}px monospace`;
    g.fillText('ML', cx, cy+sq*.22);
    g.fillStyle = '#fff';
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx,dy]) => {
      g.beginPath(); g.arc(cx+dx*sq*.4, cy+dy*sq*.4, 3.5, 0, Math.PI*2); g.fill();
    });
  },
  code(g, cx, cy, s) {
    g.fillStyle = '#14284b';
    g.beginPath(); g.roundRect(cx-s*.47, cy-s*.4, s*.94, s*.8, 9); g.fill();
    g.fillStyle = '#ff7a00';
    g.font = `bold ${Math.round(s*.42)}px monospace`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('</>', cx, cy+2);
  },
  chip(g, cx, cy, s) {
    const sq = s*.62;
    g.fillStyle = '#14284b';
    g.beginPath(); g.roundRect(cx-sq/2, cy-sq/2, sq, sq, 8); g.fill();
    g.strokeStyle = '#ff7a00'; g.lineWidth = 3.5;
    [-sq*.2, 0, sq*.2].forEach(d => {
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(([ax,ay]) => {
        g.beginPath();
        g.moveTo(cx+d*ax+ay*sq/2, cy+d*ay+ax*sq/2);
        g.lineTo(cx+d*ax+ay*(sq/2+10), cy+d*ay+ax*(sq/2+10));
        g.stroke();
      });
    });
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.roundRect(cx-sq*.26, cy-sq*.26, sq*.52, sq*.52, 4); g.fill();
  },
  flag(g, cx, cy, s) {
    const sq=s*.19, cols=5, rows=4;
    const sx=cx-cols*sq/2, sy=cy-s*.44;
    for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
      g.fillStyle = (r+c)%2===0?'#111':'#fff';
      g.fillRect(sx+c*sq, sy+r*sq, sq, sq);
    }
    g.fillStyle='#14284b'; g.fillRect(sx-6, sy-2, 5, s*.85);
  },
  soccer(g, cx, cy, s) {
    const r=s*.45;
    g.fillStyle='#fff'; g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill();
    g.strokeStyle='#111'; g.lineWidth=2; g.stroke();
    g.fillStyle='#111';
    [[0,-1],[-0.65,0.4],[0.65,0.4]].forEach(([dx,dy]) => {
      g.beginPath();
      for (let i=0;i<5;i++) {
        const a=(i/5)*Math.PI*2-Math.PI/2;
        const px=cx+dx*r*.5+Math.cos(a)*r*.19;
        const py=cy+dy*r*.5+Math.sin(a)*r*.19;
        i===0?g.moveTo(px,py):g.lineTo(px,py);
      }
      g.closePath(); g.fill();
    });
  },
  line(g, cx, cy, s) {
    g.strokeStyle='#ff7a00'; g.lineWidth=8; g.lineCap='round';
    g.beginPath();
    g.moveTo(cx-s*.48, cy+s*.26);
    g.quadraticCurveTo(cx-s*.1, cy-s*.44, cx, cy);
    g.quadraticCurveTo(cx+s*.1, cy+s*.44, cx+s*.48, cy-s*.26);
    g.stroke();
    [[cx-s*.36,cy+s*.16],[cx,cy],[cx+s*.36,cy-s*.16]].forEach(([px,py]) => {
      g.fillStyle='#14284b'; g.beginPath(); g.arc(px,py,6,0,Math.PI*2); g.fill();
    });
  },
  cone(g, cx, cy, s) {
    g.fillStyle='#ff7a00';
    g.beginPath(); g.moveTo(cx,cy-s*.48); g.lineTo(cx+s*.37,cy+s*.34); g.lineTo(cx-s*.37,cy+s*.34); g.closePath(); g.fill();
    g.fillStyle='#fff'; g.fillRect(cx-s*.23,cy+s*.04,s*.46,s*.08);
    g.fillStyle='#14284b'; g.fillRect(cx-s*.41,cy+s*.34,s*.82,s*.08);
  },
  gear(g, cx, cy, s) {
    const r1=s*.47, r2=s*.32, t=10;
    g.fillStyle='#14284b';
    g.beginPath();
    for (let i=0;i<t*2;i++) {
      const a=(i/(t*2))*Math.PI*2;
      const r=i%2===0?r1:r2;
      const px=cx+Math.cos(a)*r, py=cy+Math.sin(a)*r;
      i===0?g.moveTo(px,py):g.lineTo(px,py);
    }
    g.closePath(); g.fill();
    g.fillStyle='#fff8f0'; g.beginPath(); g.arc(cx,cy,r2*.44,0,Math.PI*2); g.fill();
  },
  monitor(g, cx, cy, s) {
    const mw=s*.88, mh=s*.62;
    g.fillStyle='#14284b';
    g.beginPath(); g.roundRect(cx-mw/2, cy-mh/2, mw, mh, 6); g.fill();
    g.fillStyle='#1a3a5a'; g.fillRect(cx-mw/2+4, cy-mh/2+4, mw-8, mh-18);
    g.fillStyle='#ff7a00'; g.fillRect(cx-mw/2+7, cy-mh/2+8, mw*.5, 5);
    g.fillStyle='#4fc3f7'; g.fillRect(cx-mw/2+7, cy-mh/2+17, mw*.7, 4);
    g.fillStyle='#14284b'; g.fillRect(cx-6, cy+mh/2-2, 12, 9); g.fillRect(cx-16, cy+mh/2+7, 32, 4);
  },
  layers(g, cx, cy, s) {
    [-s*.25, 0, s*.25].forEach((dy,i) => {
      g.fillStyle = i===2?'#ff7a00':'#14284b';
      g.beginPath();
      g.moveTo(cx, cy+dy-12); g.lineTo(cx+s*.43, cy+dy); g.lineTo(cx, cy+dy+12); g.lineTo(cx-s*.43, cy+dy);
      g.closePath(); g.fill();
    });
  },
  printer(g, cx, cy, s) {
    g.fillStyle='#14284b';
    g.fillRect(cx-s*.11, cy-s*.47, s*.22, s*.47);
    g.fillRect(cx-s*.38, cy-s*.52, s*.76, s*.1);
    g.beginPath(); g.moveTo(cx-s*.06,cy); g.lineTo(cx+s*.06,cy); g.lineTo(cx,cy+s*.13); g.closePath(); g.fill();
    g.strokeStyle='#ff7a00'; g.lineWidth=5;
    g.beginPath(); g.moveTo(cx,cy+s*.13); g.lineTo(cx,cy+s*.45); g.stroke();
    g.fillStyle='#ff7a00'; g.fillRect(cx-s*.32, cy+s*.37, s*.64, s*.11);
  },
  box(g, cx, cy, s) {
    const w=s*.68;
    g.fillStyle='#ff7a00';
    g.beginPath(); g.moveTo(cx,cy-s*.43); g.lineTo(cx+w*.5,cy-s*.19); g.lineTo(cx,cy+s*.04); g.lineTo(cx-w*.5,cy-s*.19); g.closePath(); g.fill();
    g.fillStyle='#14284b';
    g.beginPath(); g.moveTo(cx-w*.5,cy-s*.19); g.lineTo(cx,cy+s*.04); g.lineTo(cx,cy+s*.44); g.lineTo(cx-w*.5,cy+s*.2); g.closePath(); g.fill();
    g.fillStyle='#1e3a60';
    g.beginPath(); g.moveTo(cx+w*.5,cy-s*.19); g.lineTo(cx,cy+s*.04); g.lineTo(cx,cy+s*.44); g.lineTo(cx+w*.5,cy+s*.2); g.closePath(); g.fill();
  },
  python(g, cx, cy, s) {
    g.fillStyle='#3776ab'; g.beginPath(); g.roundRect(cx-s*.43,cy-s*.47,s*.39,s*.47,8); g.fill();
    g.fillStyle='#ffd343'; g.beginPath(); g.roundRect(cx+s*.04,cy,s*.39,s*.47,8); g.fill();
    g.fillStyle='#fff';
    g.beginPath(); g.arc(cx-s*.1,cy-s*.25,5,0,Math.PI*2); g.fill();
    g.beginPath(); g.arc(cx+s*.23,cy+s*.21,5,0,Math.PI*2); g.fill();
  },
  cpp(g, cx, cy, s) {
    g.fillStyle='#00599c'; g.beginPath(); g.arc(cx,cy,s*.49,0,Math.PI*2); g.fill();
    txt(g,'C++',cx,cy+2,Math.round(s*.38),'#fff');
  },
  webdev(g, cx, cy, s) {
    g.fillStyle='#14284b'; g.beginPath(); g.roundRect(cx-s*.47,cy-s*.4,s*.94,s*.8,8); g.fill();
    txt(g,'</>',cx,cy+2,Math.round(s*.38),'#ff7a00');
  },
  github(g, cx, cy, s) {
    g.fillStyle='#24292f'; g.beginPath(); g.arc(cx,cy,s*.49,0,Math.PI*2); g.fill();
    txt(g,'GH',cx,cy+1,Math.round(s*.28),'#fff');
  },
  iot(g, cx, cy, s) {
    g.strokeStyle='#14284b';
    [s*.44, s*.29, s*.14].forEach((r,i) => {
      g.lineWidth=4-i;
      g.beginPath(); g.arc(cx,cy+s*.1,r,Math.PI*1.1,Math.PI*1.9); g.stroke();
    });
    g.fillStyle='#ff7a00'; g.beginPath(); g.arc(cx,cy+s*.1,s*.07,0,Math.PI*2); g.fill();
  },
};

/* ═══════════════════════════════════════════════════════════════════
   1. TESTING ZONE MURAL — Full wall repaint (reference-matched)
   ─────────────────────────────────────────────────────────────────
   Wall: left wall, x = -19.74, faces +X (ry = PI/2)
   Mesh: PlaneGeometry(19, 6)  →  covers wall z=-5 to +14, y=0 to 6
   Canvas: 4096 × 1280  (AR = 3.2)
   
   FIXES applied:
   • No white board feel — painted directly on cream wall bg
   • Logo top-left, NOT overlapping pill/cards
   • Cards: equal width, equal gaps, pill label at bottom with padding
   • Chevrons: 3 bold >>> after pill
   • Tagline on the right side wall via testing.js (not on mural)
   • No lonely dot
═══════════════════════════════════════════════════════════════════ */
export function createTestingZoneMural(scene) {
  const W = 4096, H = 1280;
  const tex = canvasTex(W, H, (g) => {

    // ── 1. BASE: warm cream/peach wall colour (matches Three.js wall) ──
    g.fillStyle = '#f5e6d0';
    g.fillRect(0, 0, W, H);

    // ── 2. BIG DIAGONAL NAVY STRIPE (top-left → bottom-right) ──
    // Large navy parallelogram sweeping from left edge to ~55% width
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(W * 0.52, 0);
    g.lineTo(W * 0.38, H);
    g.lineTo(0, H);
    g.closePath();
    g.fill();

    // ── 3. ORANGE DIAGONAL STRIPE (edge between navy and cream) ──
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(W * 0.52, 0);
    g.lineTo(W * 0.555, 0);
    g.lineTo(W * 0.415, H);
    g.lineTo(W * 0.38, H);
    g.closePath();
    g.fill();

    // ── 4. ORANGE BOTTOM STRIP ──
    g.fillStyle = '#ff7a00';
    g.fillRect(0, H - 56, W, 56);

    // ── 5. SRI LOGO — top-left corner, inside navy area, well clear of pill ──
    // Positioned at x=170, y=200 (well above and left of the pill)
    sriLogo(g, 200, 220, 110, '#fff');

    // ── 6. "TESTING ZONE" PILL — navy rounded rect, to the RIGHT of logo ──
    const pillX = 460, pillY = 60, pillW = 820, pillH = 230, pillR = 36;
    g.fillStyle = '#14284b';
    g.beginPath();
    g.roundRect(pillX, pillY, pillW, pillH, pillR);
    g.fill();
    // White text
    g.fillStyle = '#fff';
    g.font = `900 148px 'Segoe UI', sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Testing Zone', pillX + 48, pillY + pillH / 2);

    // ── 7. THREE ORANGE CHEVRONS >>> after pill ──
    const chBase = pillX + pillW + 32;
    const chMid  = pillY + pillH / 2;
    const chH    = pillH * 0.55;
    [0, 68, 136].forEach(dx => {
      g.strokeStyle = '#ff7a00';
      g.lineWidth   = 22;
      g.lineCap     = 'round';
      g.lineJoin    = 'round';
      g.beginPath();
      g.moveTo(chBase + dx,        chMid - chH / 2);
      g.lineTo(chBase + dx + 56,   chMid);
      g.lineTo(chBase + dx,        chMid + chH / 2);
      g.stroke();
    });

    // ── 8. SIX ICON CARDS — equal width, equal gaps, navy pill label ──
    // Card row starts below header, centred across the full canvas width
    const CARDS = [
      { l: 'Robo Race',       f: ico.flag   },
      { l: 'Robo Soccer',     f: ico.soccer },
      { l: 'Line Following',  f: ico.line   },
      { l: 'Obstacle Test',   f: ico.cone   },
      { l: 'Drone Test',      f: ico.drone  },
      { l: 'Project Testing', f: ico.gear   },
    ];

    // Fixed card dimensions
    const CW  = 540;   // card width  (px)
    const CH  = 580;   // card height (px)
    const CGP = 42;    // gap between cards
    const totalW = CARDS.length * CW + (CARDS.length - 1) * CGP;
    const startX = (W - totalW) / 2;
    const cardTop = 360;  // top of card row
    const CR  = 28;    // corner radius

    CARDS.forEach(({ l, f }, i) => {
      const cx = startX + i * (CW + CGP);
      const cy = cardTop;

      // Card background — wall colour (blends with cream bg)
      g.fillStyle = '#f5e6d0';
      g.beginPath(); g.roundRect(cx, cy, CW, CH, CR); g.fill();

      // Orange border stroke (3 px)
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 7;
      g.beginPath(); g.roundRect(cx, cy, CW, CH, CR); g.stroke();

      // Icon centred in upper 65% of card
      const iconCX = cx + CW / 2;
      const iconCY = cy + CH * 0.38;
      const iconS  = CW * 0.34;
      f(g, iconCX, iconCY, iconS);

      // Navy pill label — bottom 22% of card, with 20px side margin
      const lPadH = 72;
      const lPadSide = 20;
      const lY = cy + CH - lPadH - 20;
      g.fillStyle = '#14284b';
      g.beginPath();
      g.roundRect(cx + lPadSide, lY, CW - lPadSide * 2, lPadH, lPadH / 2);
      g.fill();

      // White label text — sized to fit, never touch edges
      const maxFS = 36;
      g.fillStyle = '#fff';
      g.font = `bold ${maxFS}px 'Segoe UI', sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      // Shrink font if too wide
      let fs = maxFS;
      while (g.measureText(l).width > CW - lPadSide * 2 - 24 && fs > 22) {
        fs -= 2;
        g.font = `bold ${fs}px 'Segoe UI', sans-serif`;
      }
      g.fillText(l, cx + CW / 2, lY + lPadH / 2);
    });
  });

  // Material: matte paint look (roughness 0.9, metalness 0)
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.9,
    metalness: 0,
  });
  tex.anisotropy = 4; // sharper at angles

  // Mesh: covers y=0.1 → y=6.1  (full wall height), z=-5 → z=+14 (13m span)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(19, 6),
    mat
  );
  mesh.position.set(-19.74, 3.1, -1);  // centre z=-1 → spans -1±9.5 = z=-10.5 to +8.5
  mesh.rotation.y = Math.PI / 2;
  scene.add(mesh);
}

/* ═══════════════════════════════════════════════════════════════════
   2. 3D PRINTING ZONE MURAL
   Back wall, x = -11, z = -14.73
   Sits HIGH on wall: y = 4.4, H = 2.2m (bottom edge ≈ y 3.3)
   Canvas: 2048 × 480  (AR ≈ 4.27)
═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   2. 3D PRINTING ZONE MURAL — Full painted wall (reference-matched)
   ─────────────────────────────────────────────────────────────────
   Wall: back wall, centered at x = -11.0, z = -14.78 (faces +Z)
   Mesh: PlaneGeometry(8.5, 5.76)  →  spans x=-15.25 to -6.75, y=0.12 to 5.88
   Canvas: 4096 × 2764  (AR = 1.48)
   
   MATCHES REFERENCE IMAGE:
   • Warm peach/cream wall background (exact C.cream #fff1e3)
   • Top-left corner: painted orange triangle
   • Top-left: SRI logo, thin orange vertical divider
   • Navy hexagon outline badge with 3D printer nozzle head
   • Bold navy title: "3D Printing" / "Zone" on two lines + orange brush-stroke underline
   • Painted process row (NO cards/boxes):
     [Monitor] Design > [Layers] Slice > [Nozzle] Print > [Cube] Prototype
   • Right side: painted navy diagonal panel with stacked tagline:
     "Create / Print / Test / Iterate" in bold white + orange underline stroke
   • Matte paint standard material (roughness 0.85, metalness 0)
═══════════════════════════════════════════════════════════════════ */
export function create3DPrintingMural(scene) {
  const W = 4096, H = 2764;
  const tex = canvasTex(W, H, (g) => {
    // ── 1. Base wall colour: warm peach/cream (matches 3D wall exactly) ──
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, W, H);

    // ── 2. Top-left corner: painted orange triangle ──
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(760, 0);
    g.lineTo(0, 760);
    g.closePath();
    g.fill();

    // ── 3. Right side: large painted navy diagonal panel ──
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(2780, 0);
    g.lineTo(W, 0);
    g.lineTo(W, 2050);
    g.lineTo(2100, H);
    g.lineTo(1980, 1600);
    g.closePath();
    g.fill();

    // ── 4. Tagline on navy panel (stacked bold white text) ──
    g.fillStyle = '#ffffff';
    g.font = `900 136px 'Segoe UI', sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    const tagX = 3380;
    const tagLines = ['Create', 'Print', 'Test', 'Iterate'];
    tagLines.forEach((t, i) => {
      g.fillText(t, tagX, 290 + i * 160);
    });

    // Orange brush-stroke underline beneath "Iterate"
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 18;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(tagX - 20, 840);
    g.quadraticCurveTo(tagX + 240, 865, tagX + 500, 830);
    g.stroke();

    // ── 5. Top-left: SRI Logo ──
    sriLogo(g, 580, 340, 95, '#14284b');

    // ── 6. Thin orange vertical divider ──
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 7;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(940, 170);
    g.lineTo(940, 520);
    g.stroke();

    // ── 7. Navy hexagon outline badge with 3D printer nozzle head ──
    const hexCX = 1200, hexCY = 345, hexR = 150;
    g.strokeStyle = '#14284b';
    g.lineWidth = 14;
    g.lineJoin = 'round';
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const px = hexCX + hexR * Math.cos(a);
      const py = hexCY + hexR * Math.sin(a);
      i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath();
    g.stroke();

    // 3D printer nozzle icon inside hexagon
    g.fillStyle = '#14284b';
    g.strokeStyle = '#14284b';
    g.lineWidth = 8;
    g.lineCap = 'round';
    // Top cross-rail
    g.fillRect(hexCX - 65, hexCY - 60, 130, 20);
    // Vertical neck
    g.fillRect(hexCX - 22, hexCY - 40, 44, 45);
    // Extruder cone nozzle
    g.beginPath();
    g.moveTo(hexCX - 32, hexCY + 5);
    g.lineTo(hexCX + 32, hexCY + 5);
    g.lineTo(hexCX + 6, hexCY + 50);
    g.lineTo(hexCX - 6, hexCY + 50);
    g.closePath();
    g.fill();
    // Build plate line below nozzle
    g.fillRect(hexCX - 55, hexCY + 64, 110, 12);

    // ── 8. Title: "3D Printing" / "Zone" (two lines) ──
    const titleX = 1460;
    g.fillStyle = '#14284b';
    g.font = `900 136px 'Segoe UI', sans-serif`;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillText('3D Printing', titleX, 205);
    g.fillText('Zone', titleX, 355);

    // Orange brush-stroke underline under "Zone"
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 16;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(titleX, 510);
    g.quadraticCurveTo(titleX + 450, 530, titleX + 880, 500);
    g.stroke();

    // ── 9. Process Row: Design > Slice > Print > Prototype (Painted on wall) ──
    // Direct wall paint — NO cards, NO background boxes
    const steps = [
      {
        l: 'Design',
        draw: (cx, cy) => {
          // Monitor outline with 3D cube inside
          g.strokeStyle = '#14284b';
          g.lineWidth = 7;
          g.beginPath();
          g.roundRect(cx - 60, cy - 55, 120, 84, 10);
          g.stroke();
          // Stand
          g.beginPath();
          g.moveTo(cx, cy + 29); g.lineTo(cx, cy + 50);
          g.moveTo(cx - 35, cy + 50); g.lineTo(cx + 35, cy + 50);
          g.stroke();
          // Isometric cube inside monitor
          const cw = 26;
          g.beginPath();
          // Top diamond
          g.moveTo(cx, cy - 30); g.lineTo(cx + cw, cy - 18);
          g.lineTo(cx, cy - 6); g.lineTo(cx - cw, cy - 18);
          g.closePath(); g.stroke();
          // Left face
          g.beginPath();
          g.moveTo(cx - cw, cy - 18); g.lineTo(cx, cy - 6);
          g.lineTo(cx, cy + 18); g.lineTo(cx - cw, cy + 6);
          g.closePath(); g.stroke();
          // Right face
          g.beginPath();
          g.moveTo(cx + cw, cy - 18); g.lineTo(cx, cy - 6);
          g.lineTo(cx, cy + 18); g.lineTo(cx + cw, cy + 6);
          g.closePath(); g.stroke();
        }
      },
      {
        l: 'Slice',
        draw: (cx, cy) => {
          // 3 stacked isometric slice layers
          g.strokeStyle = '#14284b';
          g.lineWidth = 7;
          [-28, 0, 28].forEach((dy, idx) => {
            if (idx === 1) g.fillStyle = 'rgba(255,122,0,0.18)';
            const lw = 62, lh = 22;
            g.beginPath();
            g.moveTo(cx, cy + dy - lh);
            g.lineTo(cx + lw, cy + dy);
            g.lineTo(cx, cy + dy + lh);
            g.lineTo(cx - lw, cy + dy);
            g.closePath();
            g.stroke();
            if (idx === 1) g.fill();
          });
        }
      },
      {
        l: 'Print',
        draw: (cx, cy) => {
          // 3D printer nozzle extruding filament onto layer
          g.fillStyle = '#14284b';
          g.strokeStyle = '#14284b';
          g.lineWidth = 7;
          // Gantry bar
          g.fillRect(cx - 55, cy - 50, 110, 16);
          // Block
          g.fillRect(cx - 20, cy - 34, 40, 36);
          // Cone nozzle
          g.beginPath();
          g.moveTo(cx - 25, cy + 2);
          g.lineTo(cx + 25, cy + 2);
          g.lineTo(cx + 6, cy + 34);
          g.lineTo(cx - 6, cy + 34);
          g.closePath();
          g.fill();
          // Extruded bead
          g.strokeStyle = '#ff7a00';
          g.lineWidth = 8;
          g.beginPath();
          g.moveTo(cx, cy + 34);
          g.lineTo(cx, cy + 48);
          g.stroke();
          // Bed line
          g.fillStyle = '#14284b';
          g.fillRect(cx - 50, cy + 48, 100, 10);
        }
      },
      {
        l: 'Prototype',
        draw: (cx, cy) => {
          // Large isometric 3D prototype cube
          g.strokeStyle = '#14284b';
          g.lineWidth = 7;
          const s = 48;
          // Top diamond
          g.beginPath();
          g.moveTo(cx, cy - s);
          g.lineTo(cx + s * 0.9, cy - s * 0.45);
          g.lineTo(cx, cy + s * 0.1);
          g.lineTo(cx - s * 0.9, cy - s * 0.45);
          g.closePath();
          g.stroke();
          // Left face
          g.beginPath();
          g.moveTo(cx - s * 0.9, cy - s * 0.45);
          g.lineTo(cx, cy + s * 0.1);
          g.lineTo(cx, cy + s * 1.0);
          g.lineTo(cx - s * 0.9, cy + s * 0.45);
          g.closePath();
          g.stroke();
          // Right face (orange fill tint)
          g.fillStyle = 'rgba(255,122,0,0.18)';
          g.beginPath();
          g.moveTo(cx + s * 0.9, cy - s * 0.45);
          g.lineTo(cx, cy + s * 0.1);
          g.lineTo(cx, cy + s * 1.0);
          g.lineTo(cx + s * 0.9, cy + s * 0.45);
          g.closePath();
          g.fill();
          g.stroke();
        }
      }
    ];

    const stepCenters = [960, 1450, 1940, 2430];
    const stepY = 760;

    steps.forEach((step, idx) => {
      const scx = stepCenters[idx];
      // Draw icon
      step.draw(scx, stepY);
      // Label in bold navy text below icon
      g.fillStyle = '#14284b';
      g.font = `900 52px 'Segoe UI', sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'top';
      g.fillText(step.l, scx, stepY + 74);

      // Orange chevron arrow > between steps
      if (idx < steps.length - 1) {
        const arrX = (stepCenters[idx] + stepCenters[idx + 1]) / 2;
        g.strokeStyle = '#ff7a00';
        g.lineWidth = 10;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.beginPath();
        g.moveTo(arrX - 16, stepY - 24);
        g.lineTo(arrX + 16, stepY);
        g.lineTo(arrX - 16, stepY + 24);
        g.stroke();
      }
    });
  });

  // Material: matte paint standard material (roughness 0.85, metalness 0)
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0,
  });
  tex.anisotropy = 4;

  // Mesh: full wall height (y=0.12 to 5.88, h=5.76), 8.5m wide
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, 5.76),
    mat
  );
  mesh.position.set(-11.0, 3.0, -14.78);
  scene.add(mesh);
}

/* ═══════════════════════════════════════════════════════════════════
   3. CODING ZONE MURAL (Reference-matched full painted wall)
   Back wall, x = 11.0, z = -14.78   Full wall height (5.76m), W = 8.5m
   Canvas: 4096 × 2764
   Features:
   • Warm cream base (#fff1e3) painted directly on wall (no floating board)
   • Elongated navy hexagon title banner with white </> and "Coding" / "Zone"
   • Dynamic offset orange shadow shape behind title banner
   • Stepped orange circuit traces on both sides of title
   • Left vertical column of 4 stacked orange-outline hexagons (Python, C++, </>, GitHub)
   • Bottom-left bold orange diagonal stripes
   • Right bold orange diagonal stripe behind storage rack
   • Dark skirting board along floor line
═══════════════════════════════════════════════════════════════════ */
export function createCodingZoneMural(scene) {
  const W = 4096, H = 2764;
  const tex = canvasTex(W, H, (g) => {
    // 1. Base Wall Colour: warm cream/peach (seamless blend with room back wall)
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, W, H);

    // 2. Dark skirting board along bottom (matching room floor baseboard)
    g.fillStyle = '#1c1c20';
    g.fillRect(0, H - 42, W, 42);

    // 3. Bottom-Left Bold Orange Diagonal Stripes
    g.fillStyle = '#ff7a00';
    // Stripe 1 (outer lower)
    g.beginPath();
    g.moveTo(0, 2460);
    g.lineTo(240, 2220);
    g.lineTo(760, 2740);
    g.lineTo(520, 2740);
    g.closePath();
    g.fill();

    // Stripe 2 (inner wider stripe)
    g.beginPath();
    g.moveTo(260, 2740);
    g.lineTo(840, 2160);
    g.lineTo(1080, 2400);
    g.lineTo(500, 2740);
    g.closePath();
    g.fill();

    // 4. Right Bold Orange Diagonal Stripe (painted behind the industrial rack)
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(3340, 2740);
    g.lineTo(3920, 1380);
    g.lineTo(4096, 1380);
    g.lineTo(4096, 1720);
    g.lineTo(3660, 2740);
    g.closePath();
    g.fill();

    // 5. Left Vertical Column: 4 Stacked Orange-Outline Hexagons
    const hx = 410;
    const hexRadius = 142;
    const hexY = [620, 1020, 1420, 1820];

    function drawHexOutline(cx, cy, r) {
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 18;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 30) * Math.PI / 180;
        const px = cx + r * Math.cos(a);
        const py = cy + r * Math.sin(a);
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
      g.stroke();
    }

    // Hexagon 1: Python Logo
    drawHexOutline(hx, hexY[0], hexRadius);
    {
      const cy = hexY[0];
      // Blue upper snake
      g.fillStyle = '#3776ab';
      g.beginPath();
      g.arc(hx - 18, cy - 32, 34, Math.PI, Math.PI * 2);
      g.lineTo(hx + 28, cy - 32);
      g.arc(hx + 28, cy - 14, 18, -Math.PI / 2, Math.PI / 2);
      g.lineTo(hx - 2, cy - 14);
      g.arc(hx - 2, cy + 8, 22, -Math.PI / 2, Math.PI / 2);
      g.lineTo(hx - 18, cy + 30);
      g.arc(hx - 18, cy + 18, 12, Math.PI / 2, Math.PI * 1.5);
      g.closePath();
      g.fill();
      // Blue eye dot (yellow)
      g.fillStyle = '#ffd43b';
      g.beginPath();
      g.arc(hx - 24, cy - 40, 7, 0, Math.PI * 2);
      g.fill();

      // Yellow lower snake
      g.fillStyle = '#ffd43b';
      g.beginPath();
      g.arc(hx + 18, cy + 32, 34, 0, Math.PI);
      g.lineTo(hx - 28, cy + 32);
      g.arc(hx - 28, cy + 14, 18, Math.PI / 2, -Math.PI / 2);
      g.lineTo(hx + 2, cy + 14);
      g.arc(hx + 2, cy - 8, 22, Math.PI / 2, -Math.PI / 2);
      g.lineTo(hx + 18, cy - 30);
      g.arc(hx + 18, cy - 18, 12, -Math.PI / 2, Math.PI / 2);
      g.closePath();
      g.fill();
      // Yellow eye dot (blue)
      g.fillStyle = '#3776ab';
      g.beginPath();
      g.arc(hx + 24, cy + 40, 7, 0, Math.PI * 2);
      g.fill();
    }

    // Hexagon 2: C++
    drawHexOutline(hx, hexY[1], hexRadius);
    {
      const cy = hexY[1];
      g.fillStyle = '#14284b';
      g.font = '900 114px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('C++', hx, cy + 2);
    }

    // Hexagon 3: </>
    drawHexOutline(hx, hexY[2], hexRadius);
    {
      const cy = hexY[2];
      g.fillStyle = '#14284b';
      g.font = '900 120px monospace, "Courier New", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('</>', hx, cy + 2);
    }

    // Hexagon 4: GitHub Octocat
    drawHexOutline(hx, hexY[3], hexRadius);
    {
      const cy = hexY[3];
      g.fillStyle = '#14284b';
      // Head
      g.beginPath();
      g.arc(hx, cy + 6, 54, 0, Math.PI * 2);
      g.fill();
      // Left ear
      g.beginPath();
      g.moveTo(hx - 44, cy - 16);
      g.lineTo(hx - 58, cy - 64);
      g.lineTo(hx - 16, cy - 42);
      g.closePath();
      g.fill();
      // Right ear
      g.beginPath();
      g.moveTo(hx + 44, cy - 16);
      g.lineTo(hx + 58, cy - 64);
      g.lineTo(hx + 16, cy - 42);
      g.closePath();
      g.fill();
      // Body arc
      g.beginPath();
      g.moveTo(hx - 46, cy + 46);
      g.quadraticCurveTo(hx - 62, cy + 86, hx - 28, cy + 96);
      g.lineTo(hx + 28, cy + 96);
      g.quadraticCurveTo(hx + 62, cy + 86, hx + 46, cy + 46);
      g.closePath();
      g.fill();
    }

    // 6. Title Banner: Navy Rounded Hexagon with Offset Orange Shadow
    const bx = 2050, by = 640;
    const bw = 1760, bh = 430;
    const inX = 160;

    function drawHexBanner(cx, cy, w, h, inset) {
      g.beginPath();
      g.moveTo(cx - w / 2 + inset, cy - h / 2);
      g.lineTo(cx + w / 2 - inset, cy - h / 2);
      g.lineTo(cx + w / 2, cy);
      g.lineTo(cx + w / 2 - inset, cy + h / 2);
      g.lineTo(cx - w / 2 + inset, cy + h / 2);
      g.lineTo(cx - w / 2, cy);
      g.closePath();
    }

    // Offset orange shadow banner
    g.fillStyle = '#ff7a00';
    drawHexBanner(bx + 28, by + 32, bw, bh, inX);
    g.fill();

    // Front navy banner
    g.fillStyle = '#14284b';
    drawHexBanner(bx, by, bw, bh, inX);
    g.fill();

    // Large white </> symbol inside banner
    const iconX = bx - bw / 2 + 320, iconY = by;
    g.strokeStyle = '#ffffff';
    g.lineWidth = 26;
    g.lineCap = 'round';
    g.lineJoin = 'round';

    // <
    g.beginPath();
    g.moveTo(iconX - 45, iconY - 70);
    g.lineTo(iconX - 105, iconY);
    g.lineTo(iconX - 45, iconY + 70);
    g.stroke();

    // /
    g.beginPath();
    g.moveTo(iconX - 18, iconY + 85);
    g.lineTo(iconX + 18, iconY - 85);
    g.stroke();

    // >
    g.beginPath();
    g.moveTo(iconX + 45, iconY - 70);
    g.lineTo(iconX + 105, iconY);
    g.lineTo(iconX + 45, iconY + 70);
    g.stroke();

    // Two-line bold white title: "Coding" / "Zone"
    const textX = bx + 40;
    g.fillStyle = '#ffffff';
    g.font = '900 162px "Segoe UI", Arial, sans-serif';
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Coding', textX, by - 86);
    g.fillText('Zone', textX, by + 86);

    // 7. Orange Circuit Traces (stepping out with circular dots)
    g.strokeStyle = '#ff7a00';
    g.fillStyle = '#ff7a00';
    g.lineWidth = 14;
    g.lineCap = 'round';
    g.lineJoin = 'round';

    function dot(x, y, r = 18) {
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }

    // Top-left traces
    g.beginPath();
    g.moveTo(1110, 560);
    g.lineTo(890, 560);
    g.lineTo(810, 480);
    g.lineTo(540, 480);
    g.stroke();
    dot(540, 480);
    dot(810, 480);

    g.beginPath();
    g.moveTo(1010, 430);
    g.lineTo(760, 430);
    g.lineTo(680, 350);
    g.lineTo(490, 350);
    g.stroke();
    dot(490, 350);

    // Right traces
    g.beginPath();
    g.moveTo(2980, 640);
    g.lineTo(3210, 640);
    g.lineTo(3290, 720);
    g.lineTo(3540, 720);
    g.stroke();
    dot(3540, 720);
    dot(3290, 720);

    g.beginPath();
    g.moveTo(3070, 530);
    g.lineTo(3290, 530);
    g.lineTo(3370, 450);
    g.lineTo(3610, 450);
    g.stroke();
    dot(3610, 450);
  });

  // Material: Matte paint look (roughness: 0.85, metalness: 0)
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0,
  });
  tex.anisotropy = 4;

  // Mesh: full wall height (y=0.12 to 5.88, h=5.76m, w=8.5m)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, 5.76),
    mat
  );
  mesh.position.set(11.0, 3.0, -14.78);
  scene.add(mesh);
}

/* ═══════════════════════════════════════════════════════════════════
   4. DESIGNING ZONE MURAL (Reference-matched full painted wall)
   Back wall center, x = 0.0, z = -14.78   Full wall height (5.76m), W = 8.5m
   Canvas: 4096 × 2764
   Features:
   • Warm cream/peach base (#fff1e3) painted directly on wall (no floating panel)
   • Top centre: Authentic SRI Lotus Logo with horizontal orange flanking lines
   • Navy rounded-hexagon title banner with white pen-nib/bezier curve icon,
     orange slash divider, and bold white "Designing" / "Zone"
   • Dynamic offset orange shadow shape behind title banner
   • Stepped orange circuit traces on both sides of title
   • Left vertical column of 5 stacked orange-outline hexagons with clean labels:
     3D Modeling, Graphic Design, Photo & Illustration, Product Design, AR / VR Design
   • Bottom-left bold orange diagonal stripes
   • Right bold orange diagonal stripe behind storage rack
   • Dark skirting board along floor line
═══════════════════════════════════════════════════════════════════ */
export function createDesigningZoneMural(scene) {
  const W = 4096, H = 2764;
  const tex = canvasTex(W, H, (g) => {
    // 1. Base Wall Colour: warm cream/peach (seamless blend with room back wall)
    g.fillStyle = '#fff1e3';
    g.fillRect(0, 0, W, H);

    // 2. Dark skirting board along bottom (matching room floor baseboard)
    g.fillStyle = '#1c1c20';
    g.fillRect(0, H - 42, W, 42);

    // 3. Bottom-Left Bold Orange Diagonal Stripes
    g.fillStyle = '#ff7a00';
    // Stripe 1 (outer lower)
    g.beginPath();
    g.moveTo(0, 2460);
    g.lineTo(240, 2220);
    g.lineTo(760, 2740);
    g.lineTo(520, 2740);
    g.closePath();
    g.fill();

    // Stripe 2 (inner wider stripe)
    g.beginPath();
    g.moveTo(260, 2740);
    g.lineTo(840, 2160);
    g.lineTo(1080, 2400);
    g.lineTo(500, 2740);
    g.closePath();
    g.fill();

    // 4. Right Bold Orange Diagonal Stripe (painted behind the industrial rack)
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(3340, 2740);
    g.lineTo(3920, 1380);
    g.lineTo(4096, 1380);
    g.lineTo(4096, 1720);
    g.lineTo(3660, 2740);
    g.closePath();
    g.fill();

    // 5. Top Centre: Authentic SRI Lotus Logo with Flanking Lines
    const logoCx = W / 2; // 2048
    const logoCy = 270;
    const logoR = 76;
    sriLogo(g, logoCx, logoCy, logoR);

    // Flanking horizontal orange lines
    g.fillStyle = '#ff7a00';
    // Left flanking line
    g.beginPath();
    g.roundRect(1120, logoCy - 4, 480, 8, 4);
    g.fill();
    // Right flanking line
    g.beginPath();
    g.roundRect(2496, logoCy - 4, 480, 8, 4);
    g.fill();

    // 6. Title Banner: Navy Rounded Hexagon with Offset Orange Shadow
    const bx = 2048, by = 680;
    const bw = 1860, bh = 430;
    const inX = 160;

    function drawHexBanner(cx, cy, w, h, inset) {
      g.beginPath();
      g.moveTo(cx - w / 2 + inset, cy - h / 2);
      g.lineTo(cx + w / 2 - inset, cy - h / 2);
      g.lineTo(cx + w / 2, cy);
      g.lineTo(cx + w / 2 - inset, cy + h / 2);
      g.lineTo(cx - w / 2 + inset, cy + h / 2);
      g.lineTo(cx - w / 2, cy);
      g.closePath();
    }

    // Offset orange shadow banner
    g.fillStyle = '#ff7a00';
    drawHexBanner(bx + 28, by + 32, bw, bh, inX);
    g.fill();

    // Front navy banner
    g.fillStyle = '#14284b';
    drawHexBanner(bx, by, bw, bh, inX);
    g.fill();

    // White Pen-Nib / Bezier Curve Icon inside left side of banner
    const iconX = bx - bw / 2 + 340, iconY = by;

    // Bezier curve arc on top
    g.strokeStyle = '#ffffff';
    g.lineWidth = 14;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(iconX - 95, iconY - 26);
    g.bezierCurveTo(iconX - 60, iconY - 88, iconX + 60, iconY - 88, iconX + 95, iconY - 26);
    g.stroke();

    // Tangent handle lines
    g.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(iconX - 95, iconY - 26);
    g.lineTo(iconX - 95, iconY - 60);
    g.moveTo(iconX + 95, iconY - 26);
    g.lineTo(iconX + 95, iconY - 60);
    g.moveTo(iconX - 45, iconY - 82);
    g.lineTo(iconX + 45, iconY - 82);
    g.stroke();

    // 3 Square control point handle handles
    function drawHandle(hx, hy) {
      g.fillStyle = '#ffffff';
      g.fillRect(hx - 12, hy - 12, 24, 24);
      g.fillStyle = '#14284b';
      g.fillRect(hx - 6, hy - 6, 12, 12);
    }
    drawHandle(iconX - 95, iconY - 26);
    drawHandle(iconX, iconY - 82);
    drawHandle(iconX + 95, iconY - 26);

    // Fountain pen drafting nib pointing down
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.moveTo(iconX - 52, iconY - 6);
    g.lineTo(iconX + 52, iconY - 6);
    g.lineTo(iconX + 38, iconY + 36);
    g.lineTo(iconX + 6, iconY + 84);
    g.lineTo(iconX - 6, iconY + 84);
    g.lineTo(iconX - 38, iconY + 36);
    g.closePath();
    g.fill();

    // Nib ink breather hole and slit
    g.fillStyle = '#14284b';
    g.beginPath();
    g.arc(iconX, iconY + 34, 7, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#14284b';
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(iconX, iconY + 41);
    g.lineTo(iconX, iconY + 85);
    g.stroke();

    // Orange Slash Divider /
    const slashX = bx - bw / 2 + 630;
    g.strokeStyle = '#ff7a00';
    g.lineWidth = 20;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(slashX - 25, by + 120);
    g.lineTo(slashX + 25, by - 120);
    g.stroke();

    // Two-line bold white title: "Designing" / "Zone"
    const textX = bx - 140;
    g.fillStyle = '#ffffff';
    g.font = '900 162px "Segoe UI", Arial, sans-serif';
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText('Designing', textX, by - 86);
    g.fillText('Zone', textX, by + 86);

    // 7. Orange Circuit Traces (stepping out with circular node dots)
    g.strokeStyle = '#ff7a00';
    g.fillStyle = '#ff7a00';
    g.lineWidth = 14;
    g.lineCap = 'round';
    g.lineJoin = 'round';

    function dot(x, y, r = 18) {
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }

    // Top-left traces
    g.beginPath();
    g.moveTo(1050, 600);
    g.lineTo(840, 600);
    g.lineTo(760, 520);
    g.lineTo(480, 520);
    g.stroke();
    dot(480, 520);
    dot(760, 520);

    g.beginPath();
    g.moveTo(940, 460);
    g.lineTo(700, 460);
    g.lineTo(620, 380);
    g.lineTo(420, 380);
    g.stroke();
    dot(420, 380);

    // Right traces
    g.beginPath();
    g.moveTo(3040, 680);
    g.lineTo(3270, 680);
    g.lineTo(3350, 760);
    g.lineTo(3620, 760);
    g.stroke();
    dot(3620, 760);
    dot(3350, 760);

    g.beginPath();
    g.moveTo(3140, 570);
    g.lineTo(3360, 570);
    g.lineTo(3440, 490);
    g.lineTo(3700, 490);
    g.stroke();
    dot(3700, 490);

    // 8. Left Vertical Column: 5 Stacked Orange-Outline Hexagons with Icons & Labels
    const hx = 410;
    const hexRadius = 126;
    const hexY = [620, 990, 1360, 1730, 2100];

    function drawHexOutline(cx, cy, r) {
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 16;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 30) * Math.PI * 180 / 180 / 180 * Math.PI; // angle in rad
        const rad = (i * 60 - 30) * Math.PI / 180;
        const px = cx + r * Math.cos(rad);
        const py = cy + r * Math.sin(rad);
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
      g.stroke();
    }

    // Hexagon 1: 3D Modeling (Isometric wireframe cube)
    drawHexOutline(hx, hexY[0], hexRadius);
    {
      const cy = hexY[0] - 22;
      const s = 36;
      g.strokeStyle = '#14284b';
      g.lineWidth = 6;
      // Top diamond
      g.beginPath();
      g.moveTo(hx, cy - s);
      g.lineTo(hx + s * 0.86, cy - s * 0.5);
      g.lineTo(hx, cy);
      g.lineTo(hx - s * 0.86, cy - s * 0.5);
      g.closePath();
      g.stroke();
      // Left face
      g.beginPath();
      g.moveTo(hx - s * 0.86, cy - s * 0.5);
      g.lineTo(hx, cy);
      g.lineTo(hx, cy + s);
      g.lineTo(hx - s * 0.86, cy + s * 0.5);
      g.closePath();
      g.stroke();
      // Right face
      g.beginPath();
      g.moveTo(hx + s * 0.86, cy - s * 0.5);
      g.lineTo(hx, cy);
      g.lineTo(hx, cy + s);
      g.lineTo(hx + s * 0.86, cy + s * 0.5);
      g.closePath();
      g.stroke();
      // Corner vertex dots
      g.fillStyle = '#ff7a00';
      [
        [hx, cy - s], [hx + s * 0.86, cy - s * 0.5], [hx, cy],
        [hx - s * 0.86, cy - s * 0.5], [hx - s * 0.86, cy + s * 0.5],
        [hx, cy + s], [hx + s * 0.86, cy + s * 0.5]
      ].forEach(([vx, vy]) => {
        g.beginPath(); g.arc(vx, vy, 4.5, 0, Math.PI * 2); g.fill();
      });

      // Label below icon
      g.fillStyle = '#14284b';
      g.font = '900 34px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('3D Modeling', hx, hexY[0] + 66);
    }

    // Hexagon 2: Graphic Design (Monitor + Stylus Pen)
    drawHexOutline(hx, hexY[1], hexRadius);
    {
      const cy = hexY[1] - 22;
      g.strokeStyle = '#14284b';
      g.lineWidth = 5;
      // Monitor frame
      g.strokeRect(hx - 38, cy - 32, 76, 50);
      // Screen fill
      g.fillStyle = 'rgba(20, 40, 75, 0.08)';
      g.fillRect(hx - 36, cy - 30, 72, 46);
      // Stand
      g.beginPath();
      g.moveTo(hx, cy + 18);
      g.lineTo(hx, cy + 28);
      g.moveTo(hx - 20, cy + 28);
      g.lineTo(hx + 20, cy + 28);
      g.stroke();

      // Stylus pen angled across screen
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 6;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(hx - 16, cy + 8);
      g.lineTo(hx + 26, cy - 26);
      g.stroke();
      // Pen tip dot
      g.fillStyle = '#ff7a00';
      g.beginPath();
      g.arc(hx - 16, cy + 8, 4, 0, Math.PI * 2);
      g.fill();

      // Label below icon
      g.fillStyle = '#14284b';
      g.font = '900 34px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('Graphic Design', hx, hexY[1] + 66);
    }

    // Hexagon 3: Photo & Illustration (Generic Ps and Ai badges)
    drawHexOutline(hx, hexY[2], hexRadius);
    {
      const cy = hexY[2] - 22;
      // Blue "Ps" square badge
      g.fillStyle = '#001e36';
      g.beginPath();
      g.roundRect(hx - 48, cy - 24, 42, 42, 6);
      g.fill();
      g.fillStyle = '#31a8ff';
      g.font = '900 24px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('Ps', hx - 27, cy - 2);

      // Dark "Ai" square badge
      g.fillStyle = '#261300';
      g.beginPath();
      g.roundRect(hx + 6, cy - 24, 42, 42, 6);
      g.fill();
      g.fillStyle = '#ff7a00';
      g.font = '900 24px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('Ai', hx + 27, cy - 2);

      // Label on 2 lines
      g.fillStyle = '#14284b';
      g.font = '900 30px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('Photo &', hx, hexY[2] + 52);
      g.fillText('Illustration', hx, hexY[2] + 84);
    }

    // Hexagon 4: Product Design (3D isometric product box)
    drawHexOutline(hx, hexY[3], hexRadius);
    {
      const cy = hexY[3] - 22;
      const s = 34;
      g.strokeStyle = '#14284b';
      g.lineWidth = 6;
      // Top diamond
      g.fillStyle = '#ff7a00';
      g.beginPath();
      g.moveTo(hx, cy - s);
      g.lineTo(hx + s * 0.86, cy - s * 0.5);
      g.lineTo(hx, cy);
      g.lineTo(hx - s * 0.86, cy - s * 0.5);
      g.closePath();
      g.fill();
      g.stroke();
      // Left face
      g.fillStyle = 'rgba(20, 40, 75, 0.12)';
      g.beginPath();
      g.moveTo(hx - s * 0.86, cy - s * 0.5);
      g.lineTo(hx, cy);
      g.lineTo(hx, cy + s);
      g.lineTo(hx - s * 0.86, cy + s * 0.5);
      g.closePath();
      g.fill();
      g.stroke();
      // Right face
      g.fillStyle = 'rgba(20, 40, 75, 0.22)';
      g.beginPath();
      g.moveTo(hx + s * 0.86, cy - s * 0.5);
      g.lineTo(hx, cy);
      g.lineTo(hx, cy + s);
      g.lineTo(hx + s * 0.86, cy + s * 0.5);
      g.closePath();
      g.fill();
      g.stroke();

      // Label below icon
      g.fillStyle = '#14284b';
      g.font = '900 34px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('Product Design', hx, hexY[3] + 66);
    }

    // Hexagon 5: AR / VR Design (3D cube inside bracketed viewfinder)
    drawHexOutline(hx, hexY[4], hexRadius);
    {
      const cy = hexY[4] - 22;
      // Bracketed viewfinder corners [ ]
      g.strokeStyle = '#ff7a00';
      g.lineWidth = 5;
      const bW = 38, bH = 34;
      // Top-left
      g.beginPath(); g.moveTo(hx - bW, cy - bH + 12); g.lineTo(hx - bW, cy - bH); g.lineTo(hx - bW + 12, cy - bH); g.stroke();
      // Top-right
      g.beginPath(); g.moveTo(hx + bW - 12, cy - bH); g.lineTo(hx + bW, cy - bH); g.lineTo(hx + bW, cy - bH + 12); g.stroke();
      // Bottom-left
      g.beginPath(); g.moveTo(hx - bW, cy + bH - 12); g.lineTo(hx - bW, cy + bH); g.lineTo(hx - bW + 12, cy + bH); g.stroke();
      // Bottom-right
      g.beginPath(); g.moveTo(hx + bW - 12, cy + bH); g.lineTo(hx + bW, cy + bH); g.lineTo(hx + bW, cy + bH - 12); g.stroke();

      // 3D cube inside
      const s = 20;
      g.strokeStyle = '#14284b';
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(hx, cy - s); g.lineTo(hx + s * 0.86, cy - s * 0.5); g.lineTo(hx, cy); g.lineTo(hx - s * 0.86, cy - s * 0.5); g.closePath();
      g.moveTo(hx - s * 0.86, cy - s * 0.5); g.lineTo(hx, cy); g.lineTo(hx, cy + s); g.lineTo(hx - s * 0.86, cy + s * 0.5); g.closePath();
      g.moveTo(hx + s * 0.86, cy - s * 0.5); g.lineTo(hx, cy); g.lineTo(hx, cy + s); g.lineTo(hx + s * 0.86, cy + s * 0.5); g.closePath();
      g.stroke();

      // Label below icon
      g.fillStyle = '#14284b';
      g.font = '900 34px "Segoe UI", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('AR / VR Design', hx, hexY[4] + 66);
    }
  });

  // Material: Matte paint look (roughness: 0.85, metalness: 0)
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0,
  });
  tex.anisotropy = 4;

  // Mesh: full wall height (y=0.12 to 5.88, h=5.76m, w=8.5m)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, 5.76),
    mat
  );
  mesh.position.set(0.0, 3.0, -14.78);
  scene.add(mesh);
}

/** Backward compatibility alias for main mural */
export const createMainWallMural = createDesigningZoneMural;

/* ═══════════════════════════════════════════════════════════════════
   5. ROBOTICS LAB MURAL  — Right wall, x = 19.78
   THIN HEADER BANNER only — sits ABOVE TV and workbench items
   y = 4.95 centre  (bottom ≈ y 3.95, top ≈ y 5.95)
   Canvas: 2048 × 384  (AR ≈ 5.33)   PlaneGeometry(13, 2.0)
═══════════════════════════════════════════════════════════════════ */
export function createRoboticsLabMural(scene) {
  const W = 2048, H = 384;
  const tex = canvasTex(W, H, (g) => {
    // Cream bg
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange bottom bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H-12, W, 12);

    // Navy left slab with diagonal
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0,0); g.lineTo(W*.20,0); g.lineTo(0,H);
    g.closePath(); g.fill();

    // Orange edge strip
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(W*.20,0); g.lineTo(W*.225,0); g.lineTo(W*.025,H); g.lineTo(0,H);
    g.closePath(); g.fill();

    // SRI logo inside navy (white text)
    sriLogo(g, 110, 155, 72, '#fff');

    // Orange vertical divider
    g.fillStyle = '#ff7a00'; g.fillRect(255, 36, 7, 240);

    // "ROBOTICS" (orange) + "LAB" (navy) — single row centred in banner
    g.font = `bold 118px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillStyle = '#ff7a00';
    g.fillText('ROBOTICS', 282, H*.38);
    const rW = g.measureText('ROBOTICS ').width;
    g.fillStyle = '#14284b';
    g.fillText('LAB', 282 + rW, H*.38);

    // Orange underline
    g.fillStyle = '#ff7a00'; g.fillRect(282, H*.62, 850, 7);

    // "LEARN • BUILD • CODE • INNOVATE" subtitle
    txt(g, 'LEARN  •  BUILD  •  CODE  •  INNOVATE', 282 + 425, H*.76, 36, '#14284b');

    // Right: 5 horizontal pills (Robotics, AI/ML, IoT, Drones, AR/VR)
    const pills = ['Robotics', 'AI / ML', 'IoT', 'Drones', 'AR / VR'];
    const pW=200, pH=58, pR=29, pGap=14;
    const totalPW = pills.length*(pW+pGap)-pGap;
    let px = W - totalPW - 60;
    const py = H / 2;

    pills.forEach(label => {
      g.fillStyle = 'rgba(20,40,75,0.09)';
      g.strokeStyle = '#14284b'; g.lineWidth = 4;
      g.beginPath(); g.roundRect(px, py - pH/2, pW, pH, pR); g.fill(); g.stroke();
      txt(g, label, px + pW/2, py + 2, 28, '#14284b');
      px += pW + pGap;
    });

    // Circuit decoration (between title and pills)
    circuit(g, W*.64, H*.28, 1);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 2.0),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  // High on wall — bottom edge at y ≈ 3.95, well above TV top (≈3.8) and workbench items
  mesh.position.set(19.76, 4.95, -8);
  mesh.rotation.y = -Math.PI / 2;
  scene.add(mesh);
}
