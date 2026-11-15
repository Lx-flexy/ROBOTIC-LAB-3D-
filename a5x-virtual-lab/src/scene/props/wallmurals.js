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
   1. TESTING ZONE MURAL  — Reference-matched layout
   Left wall (x = -19.74), no furniture → full-height banner OK
   y = 3.2 centre, H = 4.8m, W = 13m
   Canvas: 2048 × 756  (AR ≈ 2.71)
═══════════════════════════════════════════════════════════════════ */
export function createTestingZoneMural(scene) {
  const W = 2048, H = 756;
  const tex = canvasTex(W, H, (g) => {
    // ── CREAM BACKGROUND ──
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // ── HEADER: navy diagonal slab (left ~40%) + orange chevron strip ──
    const bandH = 210;

    // Navy left parallelogram
    g.fillStyle = '#14284b';
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(W * 0.44, 0);
    g.lineTo(W * 0.33, bandH); g.lineTo(0, bandH);
    g.closePath(); g.fill();

    // Orange diagonal stripe edge
    g.fillStyle = '#ff7a00';
    g.beginPath();
    g.moveTo(W * 0.44, 0); g.lineTo(W * 0.47, 0);
    g.lineTo(W * 0.36, bandH); g.lineTo(W * 0.33, bandH);
    g.closePath(); g.fill();

    // Blue horizontal top bar (full width, thin)
    g.fillStyle = '#14284b';
    g.fillRect(0, 0, W, 10);

    // Orange bottom bar of header
    g.fillStyle = '#ff7a00'; g.fillRect(0, bandH, W, 12);

    // ── SRI LOGO — centred in navy slab (white text on dark bg) ──
    // Logo is 140px tall; slab centre ~x=160, y=bandH/2
    const logoX = 148, logoY = bandH * 0.46, logoR = 52;
    sriLogo(g, logoX, logoY, logoR, '#fff');

    // White vertical divider after logo
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(240, 20); g.lineTo(240, bandH - 20); g.stroke();

    // ── "Testing Zone" dark navy pill (right of divider) ──
    g.fillStyle = '#14284b';
    g.beginPath(); g.roundRect(258, 32, 490, 148, 20); g.fill();
    // "Testing Zone" in white inside pill
    g.fillStyle = '#fff';
    g.font = `bold 80px 'Segoe UI', sans-serif`;
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('Testing Zone', 278, 32 + 74);

    // ── 3 orange chevron arrows after pill ──
    const chevX0 = 762, chevY0 = 36, chevH2 = 68;
    [0, 46, 92].forEach(dx => {
      g.strokeStyle = '#ff7a00'; g.lineWidth = 14; g.lineCap = 'round';
      g.beginPath();
      g.moveTo(chevX0 + dx, chevY0);
      g.lineTo(chevX0 + dx + 42, chevY0 + chevH2);
      g.lineTo(chevX0 + dx, chevY0 + chevH2 * 2);
      g.stroke();
    });

    // ── 6 ICON CARDS ──
    const cards = [
      { l: 'Robo Race',      f: ico.flag   },
      { l: 'Robo Soccer',    f: ico.soccer },
      { l: 'Line Following', f: ico.line   },
      { l: 'Obstacle Test',  f: ico.cone   },
      { l: 'Drone Test',     f: ico.drone  },
      { l: 'Project Testing',f: ico.gear   },
    ];
    const cW = 290, cH = 320, gap = 22;
    const totalW = cards.length * (cW + gap) - gap;
    let cx = (W - totalW) / 2 + cW / 2;
    const cy = bandH + 12 + (H - bandH - 12) / 2;
    cards.forEach(({ l, f }) => {
      iconCard(g, cx, cy, cW, cH, f, l);
      cx += cW + gap;
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 4.8),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(-19.74, 3.2, -4);
  mesh.rotation.y = Math.PI / 2;
  scene.add(mesh);
}

/* ═══════════════════════════════════════════════════════════════════
   2. 3D PRINTING ZONE MURAL
   Back wall, x = -11, z = -14.73
   Sits HIGH on wall: y = 4.4, H = 2.2m (bottom edge ≈ y 3.3)
   Canvas: 2048 × 480  (AR ≈ 4.27)
═══════════════════════════════════════════════════════════════════ */
export function create3DPrintingMural(scene) {
  const W = 2048, H = 480;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Left diagonal accents
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(0,0); g.lineTo(80,0); g.lineTo(0,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(80,0); g.lineTo(130,0); g.lineTo(50,H); g.lineTo(0,H); g.closePath(); g.fill();

    // Right diagonal accents
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(W,0); g.lineTo(W-80,0); g.lineTo(W,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(W-80,0); g.lineTo(W-130,0); g.lineTo(W-50,H); g.lineTo(W,H); g.closePath(); g.fill();

    // Orange bottom bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H-12, W, 12);

    // ── HEADER ROW (y: 20 → 200) ──
    const pad = 160; // skip diagonal accent area
    sriLogo(g, pad + 70, 100, 64);

    // Divider
    g.strokeStyle = '#14284b'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(pad+185, 24); g.lineTo(pad+185, 188); g.stroke();

    // Hex badge
    hexBadge(g, pad+248, 100, 64, '3D');

    // Zone name
    txt(g, '3D Printing Zone', pad+360, 72, 68, '#14284b', 'left', 'top');

    // Orange underline under title
    g.fillStyle = '#ff7a00'; g.fillRect(pad+360, 150, 600, 6);

    // Subtitle
    txt(g, 'Design  ›  Slice  ›  Print  ›  Prototype', pad+360, 168, 30, '#14284b', 'left', 'top');

    // Circuit decoration
    circuit(g, W - 340, 70, 1);

    // ── FLOW CARDS ──
    const steps = [
      { l:'Design',    f:ico.monitor },
      { l:'Slice',     f:ico.layers },
      { l:'Print',     f:ico.printer },
      { l:'Prototype', f:ico.box },
    ];
    const cW=220, cH=200, arrowW=52;
    const totalW = steps.length*cW + (steps.length-1)*arrowW;
    let cx = (W - totalW)/2 + cW/2;
    const cy = 350;
    steps.forEach(({ l, f }, i) => {
      iconCard(g, cx, cy, cW, cH, f, l);
      if (i < steps.length-1) arrowRight(g, cx + cW/2 + arrowW/2, cy, 20);
      cx += cW + arrowW;
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10.0, 2.3),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(-11, 4.4, -14.73);
  scene.add(mesh);
}

/* ═══════════════════════════════════════════════════════════════════
   3. CODING ZONE MURAL
   Back wall, x = 11, z = -14.73   y = 4.4, H = 2.2m
   Canvas: 2048 × 480
═══════════════════════════════════════════════════════════════════ */
export function createCodingZoneMural(scene) {
  const W = 2048, H = 480;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Diagonal accents
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(0,0); g.lineTo(80,0); g.lineTo(0,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(80,0); g.lineTo(130,0); g.lineTo(50,H); g.lineTo(0,H); g.closePath(); g.fill();
    g.fillStyle = '#ff7a00';
    g.beginPath(); g.moveTo(W,0); g.lineTo(W-80,0); g.lineTo(W,H); g.closePath(); g.fill();
    g.fillStyle = '#14284b';
    g.beginPath(); g.moveTo(W-80,0); g.lineTo(W-130,0); g.lineTo(W-50,H); g.lineTo(W,H); g.closePath(); g.fill();

    g.fillStyle = '#ff7a00'; g.fillRect(0, H-12, W, 12);

    const pad = 160;
    sriLogo(g, pad+70, 100, 64);

    g.strokeStyle = '#14284b'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(pad+185, 24); g.lineTo(pad+185, 188); g.stroke();

    hexBadge(g, pad+248, 100, 64, '</>');

    txt(g, 'Coding Zone', pad+360, 72, 68, '#14284b', 'left', 'top');
    g.fillStyle = '#ff7a00'; g.fillRect(pad+360, 150, 500, 6);
    txt(g, 'Python  ›  C++  ›  Web Dev  ›  GitHub', pad+360, 168, 30, '#14284b', 'left', 'top');

    circuit(g, W - 340, 70, 1);

    const steps = [
      { l:'Python',  f:ico.python },
      { l:'C++',     f:ico.cpp },
      { l:'Web Dev', f:ico.webdev },
      { l:'GitHub',  f:ico.github },
    ];
    const cW=220, cH=200, arrowW=52;
    const totalW = steps.length*cW + (steps.length-1)*arrowW;
    let cx = (W - totalW)/2 + cW/2;
    const cy = 350;
    steps.forEach(({ l, f }, i) => {
      iconCard(g, cx, cy, cW, cH, f, l);
      if (i < steps.length-1) arrowRight(g, cx + cW/2 + arrowW/2, cy, 20);
      cx += cW + arrowW;
    });
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10.0, 2.3),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(11, 4.4, -14.73);
  scene.add(mesh);
}

/* ═══════════════════════════════════════════════════════════════════
   4. MAIN BACK-WALL MURAL  (between zones, x = 0, z = -14.73)
   "Build · Learn · Innovate" + side tech icons
   y = 4.4, H = 2.4m  Canvas: 1600 × 540
═══════════════════════════════════════════════════════════════════ */
export function createMainWallMural(scene) {
  const W = 1600, H = 540;
  const tex = canvasTex(W, H, (g) => {
    g.fillStyle = '#fff8f0'; g.fillRect(0, 0, W, H);

    // Orange bottom bar
    g.fillStyle = '#ff7a00'; g.fillRect(0, H-12, W, 12);

    // ── Centre: stacked pills ──
    const pW=380, pH=86, pR=15;
    const pX = W/2;
    [
      { t:'Build',    bg:'#14284b', fg:'#fff', y: 32 },
      { t:'Learn',    bg:'#ff7a00', fg:'#fff', y:132 },
      { t:'Innovate', bg:'#ff7a00', fg:'#fff', y:232 },
    ].forEach(({ t, bg, fg, y }) => {
      g.fillStyle = bg;
      g.beginPath(); g.roundRect(pX - pW/2, y, pW, pH, pR); g.fill();
      txt(g, t, pX, y + pH/2, 50, fg);
    });

    // SRI logo small below pills
    sriLogo(g, pX, 400, 44);

    // ── LEFT icons: Coding, Electronics, Robotics ──
    const leftX = 180;
    [
      { l:'Coding',      f:ico.code },
      { l:'Electronics', f:ico.chip },
      { l:'Robotics',    f:ico.robot },
    ].forEach(({ l, f }, i) => {
      const cy = 100 + i*150;
      g.strokeStyle = '#14284b'; g.fillStyle = 'rgba(20,40,75,0.06)';
      g.lineWidth = 4;
      g.beginPath(); g.roundRect(leftX-100, cy-60, 200, 120, 12); g.fill(); g.stroke();
      f(g, leftX, cy-14, 44);
      txt(g, l, leftX, cy+54, 26, '#14284b');
    });

    // ── RIGHT icons: Drones, AR/VR, AI/ML ──
    const rightX = W - 180;
    [
      { l:'Drones', f:ico.drone },
      { l:'AR / VR', f:ico.vr },
      { l:'AI / ML', f:ico.ai },
    ].forEach(({ l, f }, i) => {
      const cy = 100 + i*150;
      g.strokeStyle = '#14284b'; g.fillStyle = 'rgba(20,40,75,0.06)';
      g.lineWidth = 4;
      g.beginPath(); g.roundRect(rightX-100, cy-60, 200, 120, 12); g.fill(); g.stroke();
      f(g, rightX, cy-14, 44);
      txt(g, l, rightX, cy+54, 26, '#14284b');
    });

    // Gear decor
    function gd(cx, cy, r) {
      const t=8; g.fillStyle='#ff7a00';
      g.beginPath();
      for (let i=0;i<t*2;i++) {
        const a=(i/(t*2))*Math.PI*2;
        const rad=i%2===0?r:r*.74;
        const px=cx+Math.cos(a)*rad, py=cy+Math.sin(a)*rad;
        i===0?g.moveTo(px,py):g.lineTo(px,py);
      }
      g.closePath(); g.fill();
      g.fillStyle='#fff8f0'; g.beginPath(); g.arc(cx,cy,r*.36,0,Math.PI*2); g.fill();
    }
    gd(W*.32, 290, 24); gd(W*.68, 270, 18);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0, 2.7),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  mesh.position.set(0, 4.4, -14.73);
  scene.add(mesh);
}

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
