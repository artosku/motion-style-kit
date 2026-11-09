// style tambahan untuk video 3 (dari koleksi lemo-opuscar), nomor katalog 41..60. Pendekatan 2D kanvas ringkas.
import { R, H, mk, noise, hash, rng, ell, rotp, rect, polyPath, drawPixel } from './main.js';
import { mod, clamp, hx, tohex, mix, dark, light, lum, snap, sat, cen, bbox, rise, ctx2, circles, cloud, blob, grainTile, once, OB, LN, paint, std, sil } from './styles.js';

// ───────── alat kecil bersama
const hatch = (g, b, sp, ang, lw, col, off = 0) => { const [x0, x1, y0, y1] = b, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, L = Math.hypot(x1 - x0, y1 - y0) / 2 + 4, c = Math.cos(ang), s = Math.sin(ang);
  g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); for (let d = -L + off; d < L; d += sp) { g.moveTo(cx - c * L - s * d, cy - s * L + c * d); g.lineTo(cx + c * L - s * d, cy + s * L + c * d); } g.stroke(); };
const dotgrid = (g, b, step, r, col, alt = true) => { const [x0, x1, y0, y1] = b; g.fillStyle = col; g.beginPath(); for (let y = Math.floor(y0 / step) * step, i = 0; y < y1; y += step, i++) for (let x = Math.floor(x0 / step) * step + (alt && i & 1 ? step / 2 : 0); x < x1; x += step) { g.moveTo(x + r, y); g.arc(x, y, r, 0, 7); } g.fill(); };
const clipped = (g, poly, fn) => { g.save(); polyPath(g, poly); g.clip(); fn(); g.restore(); };
const vgrad = (g, stops, y0 = 0, y1 = H) => { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(0, 0, R, H); };
const rrect = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
const wave = (g, y, amp, ph, col, depth = 420, k = 130) => { g.fillStyle = col; g.beginPath(); g.moveTo(-10, y + depth); for (let x = -10; x <= R + 10; x += 20) g.lineTo(x, y + Math.sin(x / k + ph) * amp + Math.sin(x / (k * .37) + ph * 2) * amp * .3); g.lineTo(R + 10, y + depth); g.closePath(); g.fill(); };
const peaks = (g, y, h, seed, col, depth = 520) => { g.fillStyle = col; g.beginPath(); g.moveTo(-10, y + depth); for (let i = -1; i < 9; i++) { g.lineTo(i * 130 + 40, y - h * (.55 + hash(i, seed, 5) * .45)); g.lineTo(i * 130 + 105, y - h * (.15 + hash(i, seed, 9) * .25)); } g.lineTo(R + 10, y + depth); g.closePath(); g.fill(); };

// ───────── 41 SHADOW PUPPET (wayang: kulit berlubang, lampu minyak dari belakang)
const SPD = '#2a1407';
const leaf = (g, x, y, s) => { g.beginPath(); g.moveTo(x, y - 120 * s); g.bezierCurveTo(x + 70 * s, y - 60 * s, x + 60 * s, y + 60 * s, x, y + 110 * s); g.bezierCurveTo(x - 60 * s, y + 60 * s, x - 70 * s, y - 60 * s, x, y - 120 * s); g.closePath(); };
const shadow = {
  fps: 12,
  paint: { fps: 12, jit: .8, col: p => lum(p.c) > .93 && p.k !== 'body' ? '#f3b351' : SPD, stroke: () => '#120803', lw: 2.4, all: true,
    fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly); g.fill(); if (col === SPD) clipped(g, poly, () => dotgrid(g, bbox(poly), 8, 1.5, 'rgba(255,176,70,.8)')); } },
  bg(g, t) { const gr = g.createRadialGradient(R / 2, H * .45, 60, R / 2, H * .5, 820); gr.addColorStop(0, '#ffd884'); gr.addColorStop(.55, '#e8902f'); gr.addColorStop(1, '#5e2608'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    [[150, 0, .95], [800, 380, .8], [260, 740, .9], [740, 940, .7]].forEach(([x, off, s]) => { const y = rise(t, 380, off + 250, H + 400); g.save(); leaf(g, x, y, s); g.fillStyle = SPD; g.fill(); g.clip(); dotgrid(g, [x - 90, x + 90, y - 130, y + 130], 11, 2, 'rgba(255,176,70,.75)'); g.restore(); });
    g.drawImage(once('sp-g', () => grainTile(41, .38, '#5a2a08')), 0, 0); vgrad(g, [[0, 'rgba(30,10,0,.6)'], [.16, 'rgba(30,10,0,0)'], [.84, 'rgba(30,10,0,0)'], [1, 'rgba(30,10,0,.7)']]); },
};

// ───────── 42 PAPER-CUT LIGHTBOX (kertas berlapis, bercahaya dari belakang)
const lantern = {
  fps: 24,
  paint: { fps: 24, col: p => mix(p.c, '#ffd9a0', .2), stroke: p => dark(p.c, .25), sa: .5, lw: 1, all: true,
    fill(g, poly, col) { g.fillStyle = 'rgba(4,6,22,.5)'; polyPath(g, poly.map(([x, y]) => [x + 4, y + 6])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); const [cx, cy] = cen(poly); const gr = g.createRadialGradient(cx, cy, 1, cx, cy, 70); gr.addColorStop(0, 'rgba(255,236,180,.45)'); gr.addColorStop(1, 'rgba(255,236,180,0)'); clipped(g, poly, () => { g.fillStyle = gr; g.fillRect(cx - 80, cy - 80, 160, 160); }); } },
  bg(g, t) { vgrad(g, [[0, '#0a1330'], [.55, '#1c2c68'], [1, '#2b3f86']]); blob(g, R / 2, H * .5, 560, '#ffb862', .22);
    [['#6a86c2', 160, 1], ['#3f5a92', 250, 2], ['#26386e', 360, 3], ['#0e1532', 480, 4]].forEach(([col, v, k]) => { for (let j = 0; j < 2; j++) { const y = mod(-t * v + j * 700 + k * 130, 1400) - 300; wave(g, y, 34 + k * 8, k * 1.7 + j, col, 460, 120);
        g.fillStyle = '#ffb862'; for (let i = 0; i < 7; i++) { const x = hash(i, k * 3 + j, 3) * R, yy = y + 80 + hash(i, k, 8) * 260; g.globalAlpha = .9; g.fillRect(x, yy, 12, 16); } g.globalAlpha = 1; } });
    g.drawImage(once('ll-g', () => grainTile(42, .2, '#2a1a0a')), 0, 0); },
};

// ───────── 43 HALFTONE DOSSIER (titik cetak, kertas krem, stempel)
const halftone = {
  fps: 12,
  paint: { fps: 12, jit: .7, col: p => p.c, stroke: () => '#14234a', lw: 2.6, all: true,
    fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly.map(([x, y]) => [x + 2, y + 2])); g.fillStyle = col; polyPath(g, poly); g.fill(); clipped(g, poly, () => dotgrid(g, bbox(poly), 6, 1.5, dark(col, .38))); } },
  bg(g, t) { g.fillStyle = '#f3ead3'; g.fillRect(0, 0, R, H); const off = mod(t * 260, 36);
    g.fillStyle = '#ec4d9b'; g.beginPath(); for (let y = -36 + off, i = 0; y < H + 36; y += 36, i++) for (let x = (i & 1) * 18; x < R + 18; x += 36) { const r = 1 + 15 * clamp(x / R * 1.1 - .1 + Math.sin(y / 240) * .08); g.moveTo(x + r, y); g.arc(x, y, r, 0, 7); } g.fill();
    g.fillStyle = '#1b4bd6'; g.beginPath(); for (let y = -36 + off + 18, i = 0; y < H + 36; y += 36, i++) for (let x = (i & 1) * 18 + 9; x < R + 18; x += 36) { const r = 1 + 12 * clamp(1.05 - x / R * 1.2); g.moveTo(x + r, y); g.arc(x, y, r, 0, 7); } g.fill();
    const y = rise(t, 300, 300 + 200, H + 400); g.save(); g.translate(660, y); g.rotate(-.14); g.strokeStyle = '#d8281f'; g.lineWidth = 8; g.strokeRect(-190, -52, 380, 104); g.fillStyle = '#d8281f'; g.font = '800 60px Inter'; g.textAlign = 'center'; g.fillText('TOP SECRET', 0, 20); g.restore();
    g.drawImage(once('ht-g', () => grainTile(43, .22, '#6a5a3a')), 0, 0); },
};

// ───────── 44 COPPERPLATE ENGRAVING (garis arsir, tinta tunggal di kertas laid)
const INKE = '#1c1510', PAPE = '#f1e8d2';
const engraving = {
  fps: 8,
  paint: { fps: 8, jit: .6, col: p => p.c, stroke: () => INKE, lw: 2.4, all: true, lineCol: () => INKE,
    fill(g, poly, col) { g.fillStyle = PAPE; polyPath(g, poly); g.fill(); const L = lum(col), b = bbox(poly); clipped(g, poly, () => { if (L < .93) hatch(g, b, 2.4 + L * 9, .8, .7, INKE); else { const [cx, cy] = cen(poly); g.beginPath(); g.moveTo(cx + 400, cy - 400); g.lineTo(cx - 400, cy + 400); g.lineTo(cx + 400, cy + 400); g.closePath(); g.save(); g.clip(); hatch(g, b, 3.2, .8, .6, INKE); hatch(g, b, 4.4, -.8, .5, INKE); g.restore(); } if (L < .6) hatch(g, b, 3.4 + L * 7, -.8, .6, INKE); if (L < .3) hatch(g, b, 2.6, 0, .5, INKE); }); } },
  bg(g, t) { g.fillStyle = PAPE; g.fillRect(0, 0, R, H); g.strokeStyle = 'rgba(120,90,50,.12)'; g.lineWidth = 1; g.beginPath(); for (let y = 3; y < H; y += 7) { g.moveTo(0, y); g.lineTo(R, y); } g.stroke();
    [[170, 0, 1.2], [780, 380, 1], [320, 780, 1.1]].forEach(([x, off, s]) => { const y = rise(t, 340, off + 200, H + 400); g.save(); g.beginPath(); circles.forEach(([dx, dy, r]) => { g.moveTo(x + (dx + r) * s, y + dy * s); g.arc(x + dx * s, y + dy * s, r * s, 0, 7); }); g.fillStyle = PAPE; g.fill(); g.clip(); for (let k = 0; k < 3; k++) hatch(g, [x - 100 * s, x + 100 * s, y - 60 * s, y + 60 * s], 4, .6 + k * .5, .8, INKE, k); g.restore(); g.beginPath(); circles.forEach(([dx, dy, r]) => { g.moveTo(x + (dx + r) * s, y + dy * s); g.arc(x + dx * s, y + dy * s, r * s, 0, 7); }); g.strokeStyle = INKE; g.lineWidth = 2; g.stroke(); });
    g.strokeStyle = INKE; g.lineWidth = 3; g.strokeRect(28, 28, R - 56, H - 56); g.lineWidth = 1; g.strokeRect(38, 38, R - 76, H - 76); g.drawImage(once('en-g', () => grainTile(44, .16, '#7a6040')), 0, 0); },
};

// ───────── 45 SILKSCREEN TRAVEL POSTER (≤6 tinta datar, gunung bersudut, band info)
const SK = ['#F6CD98', '#EE9A73', '#9A7FA8', '#3E7079', '#1E3B3F', '#FBE6B4'];
const silkscreen = {
  fps: 12,
  paint: { fps: 12, col: p => snap(p.c, SK), stroke: () => null,
    fill(g, poly, col) { g.fillStyle = 'rgba(30,59,63,.55)'; polyPath(g, poly.map(([x, y]) => [x + 2.5, y + 2.5])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { vgrad(g, [[0, SK[0]], [.34, SK[0]], [.34, SK[1]], [.6, SK[1]]]); g.fillStyle = SK[5]; g.beginPath(); g.arc(R * .7, rise(t, 150, 200, H + 600) % 1300 - 100 + 220, 120, 0, 7); g.fill();
    [[SK[2], 200, 340, 1], [SK[3], 330, 300, 2], [SK[4], 470, 260, 3]].forEach(([col, v, h, k]) => { for (let j = 0; j < 2; j++) { const y = mod(-t * v + j * 800 + k * 200, 1600) - 450; peaks(g, y + 360, h, k, col, 520); } });
    g.fillStyle = SK[4]; g.font = '800 46px Inter'; g.textAlign = 'left'; g.fillText('MINYAM FALLS', 40, 84); g.font = '600 20px Inter'; g.fillText('NATIONAL PARK · SEE THE SKY', 42, 114);
    g.drawImage(once('sk-g', () => { const c = mk(), q = ctx2(c), r = rng(45); q.fillStyle = 'rgba(255,248,230,.5)'; for (let i = 0; i < 1400; i++) q.fillRect(r() * R, r() * H, 1.6, 1.6); return grainTile(45, .1, '#6a4a2a') && c; }), 0, 0); },
};

// ───────── 46 PRINTED LONG TAKE (empat tinta di kertas koran, sungai & hutan)
const PI = ['#16171b', '#ede5cd', '#c4332b', '#dfa443'];
const longtake = {
  fps: 8,
  paint: { fps: 8, jit: 1, col: p => snap(p.c, PI), stroke: () => PI[0], lw: 2.8, all: true },
  bg(g, t) { g.fillStyle = PI[1]; g.fillRect(0, 0, R, H); const sc = t * 300;
    g.strokeStyle = 'rgba(22,23,27,.16)'; g.lineWidth = 1.4; for (let k = 0; k < 9; k++) { g.beginPath(); for (let x = -10; x <= R + 10; x += 20) { const y = mod(k * 140 - t * 60 * (1 + k % 3 * .2), 1260) - 90 + Math.sin(x / 110 + k) * 26; x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    const riv = (w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); for (let y = -40; y <= H + 40; y += 24) { const x = 520 + Math.sin((y + sc) / 190) * 210 + Math.sin((y + sc) / 70) * 24; y < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); };
    riv(96, PI[3]); riv(74, PI[0]); g.setLineDash([22, 34]); g.lineDashOffset = sc * .6; riv(5, PI[1]); g.setLineDash([]);
    for (let i = 0; i < 20; i++) { const y = mod(hash(i, 1, 6) * 1300 - sc * (.9 + hash(i, 2, 6) * .3), 1300) - 100, ry = 520 + Math.sin((y + sc) / 190) * 210, side = i & 1 ? 1 : -1, x = ry + side * (110 + hash(i, 3, 6) * 260); if (x < 20 || x > R - 20) continue; const s = 22 + hash(i, 4, 6) * 22; g.fillStyle = i % 5 ? PI[0] : PI[2]; g.beginPath(); g.moveTo(x, y - s * 1.7); g.lineTo(x + s, y + s * .4); g.lineTo(x - s, y + s * .4); g.fill(); g.fillRect(x - 3, y + s * .4, 6, s * .5); }
    g.drawImage(once('lt-g', () => grainTile(46, .3, '#5a4a2a')), 0, 0); },
};

// ───────── 47 SIXTIES SPY TITLES (siluet kertas gunting, tinta hitam/krem/merah/mustard)
const spy = {
  fps: 12,
  paint: { fps: 12, jit: .6, col: p => lum(p.c) < .3 ? '#efe4c9' : '#1b1714', stroke: () => '#efe4c9', lw: 3.4, all: true,
    fill(g, poly, col) { g.fillStyle = 'rgba(0,0,0,.35)'; polyPath(g, poly.map(([x, y]) => [x + 3, y + 5])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = '#e2a52a'; g.fillRect(0, 0, R, H); const off = mod(t * 380, 420);
    for (let i = -2; i < 5; i++) { const y = i * 420 + off; g.fillStyle = i & 1 ? '#d23a22' : '#1b1714'; g.beginPath(); g.moveTo(-20, y + 200); g.lineTo(R + 20, y - 120); g.lineTo(R + 20, y - 20); g.lineTo(-20, y + 300); g.fill(); }
    g.fillStyle = '#efe4c9'; g.beginPath(); g.arc(210, rise(t, 260, 600, H + 500) + 100, 90, 0, 7); g.fill(); g.fillStyle = '#d23a22'; g.beginPath(); g.arc(210, rise(t, 260, 600, H + 500) + 100, 56, 0, 7); g.fill();
    g.strokeStyle = 'rgba(27,23,20,.8)'; g.lineWidth = 6; for (let k = 0; k < 4; k++) { const y = rise(t, 900, k * 300, H + 300); g.beginPath(); g.moveTo(760 + k * 40, y); g.lineTo(760 + k * 40, y + 110); g.stroke(); }
    g.drawImage(once('sp2-g', () => grainTile(47, .3, '#4a3418')), 0, 0); },
};

// ───────── 48 PICTOGRAM MOTION (bentuk geometris ala Aicher, baris berselang-seling)
const PIC = ['#1d4ed8', '#f5b700', '#e63946', '#0b132b', '#ffffff'];
const pictogram = {
  fps: 24,
  paint: { fps: 24, col: p => snap(p.c, PIC), stroke: () => null },
  bg(g, t) { g.fillStyle = '#f2efe6'; g.fillRect(0, 0, R, H); const off = mod(t * 320, 160);
    for (let r = -1; r < 8; r++) { const y = r * 160 + off, k = Math.floor((t * 320 - off) / 160) * -1 + r, dir = r & 1 ? 1 : -1, sh = mod(dir * t * 60, 160);
      for (let c = -1; c < 7; c++) { const x = c * 160 + sh + 80, h = hash(c, k, 9), col = PIC[Math.floor(h * 4)], s = 44; g.fillStyle = col;
        if (h < .25) { g.beginPath(); g.arc(x, y + 80, s, 0, 7); g.fill(); } else if (h < .5) g.fillRect(x - s, y + 80 - s, s * 2, s * 2); else if (h < .75) { g.beginPath(); g.moveTo(x, y + 80 - s); g.lineTo(x + s, y + 80 + s); g.lineTo(x - s, y + 80 + s); g.fill(); } else { g.beginPath(); g.arc(x, y + 80, s, Math.PI, 0); g.fill(); g.fillRect(x - s, y + 80, s * 2, 10); } } }
    g.fillStyle = 'rgba(242,239,230,.55)'; g.fillRect(0, 0, R, H); },
};

// ───────── 49 ASCII / CRT TERMINAL (ayam dibentuk dari huruf hijau fosfor)
const ASC = once('asc', () => new OffscreenCanvas(96, 108)), RAMP = ' .:-=+*#%@';
function asciiDraw(g, parts, ox, oy, sc, t) {
  const c = ASC, q = c.getContext('2d', { willReadFrequently: true }); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, 96, 108);
  paint(q, parts, ox / 10, oy / 10, sc / 10, { fps: 12, col: p => { const v = Math.round(60 + lum(p.c) * 195); return tohex([v, v, v]); }, stroke: () => '#ffffff', lw: 2.2, all: true, lineCol: () => '#ffffff' }, t);
  const d = q.getImageData(0, 0, 96, 108).data; g.save(); g.font = '800 13px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let y = 0; y < 108; y++) for (let x = 0; x < 96; x++) { const i = (y * 96 + x) * 4, a = d[i + 3]; if (a < 70) continue; const v = d[i] / 255, ch = RAMP[Math.min(9, 1 + Math.floor(v * 9))]; g.fillStyle = v > .45 ? '#0a3a18' : '#042210'; g.fillRect(x * 10, y * 10, 10, 10); g.fillStyle = v > .75 ? '#e4ffe9' : v > .45 ? '#6dff95' : '#2fd25f'; g.fillText(ch, x * 10 + 5, y * 10 + 5); }
  g.restore();
}
const ascii = {
  fps: 12, draw: asciiDraw,
  bg(g, t) { g.fillStyle = '#021006'; g.fillRect(0, 0, R, H); g.font = '700 14px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; const f = Math.floor(t * 8);
    for (let c = 0; c < 48; c++) { const sp = 160 + hash(c, 1, 4) * 340, y0 = mod(-t * sp + hash(c, 2, 4) * H * 1.5, H + 280) - 140; for (let k = 0; k < 7; k++) { g.globalAlpha = .12 + .4 * (1 - k / 7); g.fillStyle = k ? '#1fa84a' : '#8dffa6'; g.fillText('01#$%&@*+=<>'[Math.floor(hash(c, k + f, 12) * 12)], c * 20 + 10, y0 + k * 22); } }
    g.globalAlpha = 1; g.fillStyle = '#4dff7c'; g.font = '700 16px monospace'; g.textAlign = 'left'; g.fillText('> minyam --free-fall', 24, 40); g.fillText('> altitude: ' + String(9800 - Math.round(t * 340) % 9800) + ' m_', 24, 66); },
  post(g, t) { g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, R, 2); const gr = g.createRadialGradient(R / 2, H / 2, 300, R / 2, H / 2, 780); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, R, H); },
};

// ───────── 50 DATA STORYTELLING (batang bersih, grid tipis, tooltip)
const dataviz = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, .85), stroke: () => '#3a3f4a', lw: 1.3, all: true },
  bg(g, t) { g.fillStyle = '#f7f7f5'; g.fillRect(0, 0, R, H); g.strokeStyle = '#dcdcd6'; g.lineWidth = 1; for (let x = 140; x < R; x += 160) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    g.fillStyle = '#8a8f98'; g.font = '500 16px Inter'; g.textAlign = 'center'; [0, 25, 50, 75, 100].forEach((v, i) => g.fillText(v + '%', 140 + i * 160, 28)); const off = mod(t * 260, 96);
    for (let r = -1; r < 13; r++) { const y = r * 96 + off, k = r - Math.floor((t * 260 - off) / 96), v = .25 + hash(k, 3, 7) * .7; g.fillStyle = ['#3b6fb6', '#2a9d8f', '#e9a23b', '#8e6bbf'][Math.abs(k) % 4]; rrect(g, 140, y + 20, 640 * v, 46, 6); g.fill(); g.fillStyle = '#3a3f4a'; g.font = '600 18px Inter'; g.textAlign = 'right'; g.fillText('Seri ' + (Math.abs(k) % 90 + 10), 128, y + 50); g.textAlign = 'left'; g.fillText(Math.round(v * 100) + '', 140 + 640 * v + 10, y + 50); } },
  after(g, st) { const x = st.x + 120 * st.sc, y = st.y - 150 * st.sc; g.save(); g.fillStyle = '#ffffff'; g.strokeStyle = '#c8c8c0'; g.lineWidth = 1.4; rrect(g, x, y, 190, 62, 10); g.fill(); g.stroke(); g.fillStyle = '#6b7280'; g.font = '500 14px Inter'; g.textAlign = 'left'; g.fillText('Minyam', x + 14, y + 24); g.fillStyle = '#1f2430'; g.font = '700 22px Inter'; g.fillText(String(Math.round(98.6 - (st.y % 40) * .1 * 10) / 10) + ' m/s', x + 14, y + 50); g.restore(); },
};

// ───────── 51 ISOMETRIC INFOGRAPHIC (kubus pastel, ayam diekstrusi)
const isoBox = (g, x, y, w, h, col) => { const a = w, b = w * .5; g.fillStyle = light(col, .22); g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + a, y - h + b); g.lineTo(x, y - h + 2 * b); g.lineTo(x - a, y - h + b); g.fill(); g.fillStyle = col; g.beginPath(); g.moveTo(x - a, y - h + b); g.lineTo(x, y - h + 2 * b); g.lineTo(x, y + 2 * b); g.lineTo(x - a, y + b); g.fill(); g.fillStyle = dark(col, .2); g.beginPath(); g.moveTo(x + a, y - h + b); g.lineTo(x, y - h + 2 * b); g.lineTo(x, y + 2 * b); g.lineTo(x + a, y + b); g.fill(); };
const isoinfo = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: p => dark(p.c, .35), lw: 1.5, all: true,
    fill(g, poly, col) { for (let k = 9; k > 0; k--) { g.fillStyle = dark(col, .32); polyPath(g, poly.map(([x, y]) => [x + k * .9, y + k * .5])); g.fill(); } g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = '#e8f0f7'; g.fillRect(0, 0, R, H); g.strokeStyle = '#cbd8e6'; g.lineWidth = 1.2; const o = mod(t * 300, 60);
    for (let i = -20; i < 40; i++) { g.beginPath(); g.moveTo(i * 60, 0); g.lineTo(i * 60 + 1100, 635); g.stroke(); g.beginPath(); g.moveTo(i * 60, 0); g.lineTo(i * 60 - 1100, 635); g.stroke(); }
    const cols = ['#7fb3e6', '#f2a6a0', '#a8d8a0', '#f5d27a', '#b9a6e6'];
    [[130, 0, 1], [800, 260, 1.4], [330, 520, 1.1], [760, 780, 1], [120, 960, 1.3]].forEach(([x, off, s], i) => { const y = rise(t, 330, off + 180, H + 400); isoBox(g, x, y, 56 * s, (40 + 30 * (i % 3)) * s, cols[i % 5]); }); },
};

// ───────── 52 DARK TECH KEYNOTE (gelap, cahaya ungu-biru, tepi bersinar)
const keynote = {
  fps: 24,
  paint: { fps: 24, col: p => mix(p.c, '#141830', .04), stroke: () => 'rgba(210,220,255,.85)', lw: 2, all: true,
    fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly); g.fill(); const [x0, , y0, y1] = bbox(poly); const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, 'rgba(120,140,255,.28)'); gr.addColorStop(1, 'rgba(120,140,255,0)'); g.fillStyle = gr; g.fill(); } },
  bg(g, t) { vgrad(g, [[0, '#05060a'], [1, '#0d1022']]); blob(g, 220, 220, 520, '#6a3df0', .35); blob(g, 780, 760, 560, '#1e6bff', .3); g.strokeStyle = 'rgba(160,170,255,.08)'; g.lineWidth = 1; const o = mod(t * 280, 90); for (let y = -90 + o; y < H; y += 90) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); } for (let x = 0; x < R; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    g.fillStyle = 'rgba(200,210,255,.7)'; for (let i = 0; i < 40; i++) { const x = hash(i, 1, 2) * R, y = rise(t, 200 + hash(i, 2, 2) * 500, hash(i, 3, 2) * H, H + 40), r = .8 + hash(i, 4, 2) * 2; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } },
  under(g, st) { blob(g, st.x, st.y - 90 * st.sc, 330 * st.sc, '#7a5cff', .5); },
};

// ───────── 53 LIVING SCREENCAST (jendela aplikasi, kartu daftar, kursor)
const screencast = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => null,
    fill(g, poly, col) { g.fillStyle = 'rgba(30,30,60,.18)'; polyPath(g, poly.map(([x, y]) => [x + 3, y + 7])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { const gr = g.createLinearGradient(0, 0, R, H); gr.addColorStop(0, '#7b8cf0'); gr.addColorStop(1, '#f0a3d2'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    g.save(); g.shadowColor = 'rgba(20,20,60,.35)'; g.shadowBlur = 40; g.fillStyle = '#fafafc'; rrect(g, 36, 36, R - 72, H - 72, 22); g.fill(); g.restore(); g.save(); rrect(g, 36, 36, R - 72, H - 72, 22); g.clip();
    g.fillStyle = '#eceef4'; g.fillRect(36, 36, R - 72, 64); ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(72 + i * 26, 68, 8, 0, 7); g.fill(); }); g.fillStyle = '#7a7f8c'; g.font = '600 18px Inter'; g.textAlign = 'center'; g.fillText('Minyam.app', R / 2, 74);
    const off = mod(t * 280, 130); for (let r = -1; r < 9; r++) { const y = 120 + r * 130 + off, k = r - Math.floor((t * 280 - off) / 130); g.fillStyle = '#ffffff'; g.strokeStyle = '#e4e6ee'; g.lineWidth = 1.4; rrect(g, 64, y, R - 128, 106, 16); g.fill(); g.stroke(); g.fillStyle = ['#7b8cf0', '#f0a3d2', '#7ad3b5', '#f5c36a'][Math.abs(k) % 4]; g.beginPath(); g.arc(120, y + 53, 28, 0, 7); g.fill(); g.fillStyle = '#d9dce6'; rrect(g, 168, y + 30, 300 + hash(k, 1, 3) * 200, 16, 8); g.fill(); rrect(g, 168, y + 58, 200 + hash(k, 2, 3) * 150, 14, 7); g.fill(); g.fillStyle = hash(k, 5, 3) > .5 ? '#34c759' : '#d9dce6'; rrect(g, R - 190, y + 38, 62, 30, 15); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(hash(k, 5, 3) > .5 ? R - 148 : R - 174, y + 53, 12, 0, 7); g.fill(); }
    g.restore(); },
  after(g, st, t) { const x = st.x + 150 * st.sc, y = st.y - 40 * st.sc, p = mod(t, 1.2) / 1.2; g.save(); g.strokeStyle = `rgba(80,100,240,${1 - p})`; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 8 + p * 40, 0, 7); g.stroke(); g.fillStyle = '#111'; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 30); g.lineTo(x + 8, y + 23); g.lineTo(x + 15, y + 36); g.lineTo(x + 20, y + 33); g.lineTo(x + 13, y + 21); g.lineTo(x + 23, y + 21); g.closePath(); g.stroke(); g.fill(); g.restore(); },
};

// ───────── 54 SCI-FI HOLOGRAM HUD (cyan tembus pandang, cincin, pemindai)
const hologram = {
  fps: 24,
  paint: { fps: 24, jit: .5, col: p => mix('#06333f', '#79f4ff', .15 + lum(p.c) * .7), stroke: () => 'rgba(150,250,255,.9)', lw: 1.5, all: true, lineCol: () => 'rgba(150,250,255,.9)',
    fill(g, poly, col) { g.globalAlpha = .6; g.fillStyle = col; polyPath(g, poly); g.fill(); g.globalAlpha = 1; } },
  bg(g, t) { vgrad(g, [[0, '#02111a'], [1, '#04202b']]); g.strokeStyle = 'rgba(80,230,255,.12)'; g.lineWidth = 1; const o = mod(t * 300, 60); for (let y = -60 + o; y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); } for (let x = 0; x < R; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    g.fillStyle = 'rgba(100,240,255,.7)'; g.font = '600 15px monospace'; g.textAlign = 'left'; for (let i = 0; i < 9; i++) { const y = rise(t, 240, i * 150, H + 200); g.fillText(['SYS', 'VEL', 'ALT', 'PWR', 'GYR', 'NAV', 'TMP', 'LNK', 'SCN'][i] + ' ' + String(Math.floor(hash(i, Math.floor(t * 6), 4) * 9000 + 1000)), 28, y); g.fillText('0x' + Math.floor(hash(i, Math.floor(t * 3), 5) * 65535).toString(16).toUpperCase().padStart(4, '0'), R - 120, y + 40); }
    const bk = (x, y, dx, dy) => { g.strokeStyle = 'rgba(120,245,255,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + dx, y); g.lineTo(x, y); g.lineTo(x, y + dy); g.stroke(); }; bk(24, 24, 60, 60); bk(R - 24, 24, -60, 60); bk(24, H - 24, 60, -60); bk(R - 24, H - 24, -60, -60); },
  after(g, st, t) { g.save(); g.strokeStyle = 'rgba(120,245,255,.75)'; g.lineWidth = 2; g.setLineDash([14, 10]); g.beginPath(); g.ellipse(st.x, st.y + 30 * st.sc, 120 * st.sc, 30 * st.sc, 0, 0, 7); g.stroke(); g.setLineDash([]); g.beginPath(); g.arc(st.x, st.y - 100 * st.sc, 150 * st.sc, t * 2, t * 2 + 2.2); g.stroke(); g.restore(); },
  post(g, t) { g.fillStyle = 'rgba(0,30,40,.28)'; for (let y = Math.floor(mod(t * 40, 4)); y < H; y += 4) g.fillRect(0, y, R, 1.5); g.fillStyle = 'rgba(120,245,255,.05)'; g.fillRect(0, mod(t * 500, H + 200) - 100, R, 100); },
};

// ───────── 55 TRANSIT MAP (jalur metro berwarna, stasiun lingkaran)
const TRL = [['#e32636', [[120, 0], [120, 340], [260, 480], [260, 800], [120, 940], [120, 1200]]], ['#0a6ebd', [[400, 0], [400, 220], [560, 380], [560, 700], [400, 860], [400, 1200]]], ['#00a050', [[820, 0], [820, 300], [680, 440], [680, 720], [820, 860], [820, 1200]]], ['#f5b700', [[640, 0], [640, 160], [760, 280], [900, 280], [900, 1000], [640, 1000], [640, 1200]]], ['#8e44ad', [[40, 200], [330, 200], [330, 1000], [40, 1000]]]];
const transit = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#20232b', lw: 3.2, all: true, lineCol: () => '#20232b' },
  bg(g, t) { g.fillStyle = '#f5f1e6'; g.fillRect(0, 0, R, H); g.strokeStyle = '#e6e0cf'; g.lineWidth = 1.2; for (let x = 0; x < R; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    const sc = mod(t * 260, 1200); g.lineCap = g.lineJoin = 'round';
    TRL.forEach(([col, pts]) => { for (let j = -1; j < 1; j++) { g.strokeStyle = col; g.lineWidth = 24; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y - sc + j * 1200 + 1200) : g.moveTo(x, y - sc + j * 1200 + 1200)); g.stroke(); g.fillStyle = '#fff'; g.strokeStyle = '#20232b'; g.lineWidth = 5; pts.forEach(([x, y]) => { g.beginPath(); g.arc(x, y - sc + j * 1200 + 1200, 15, 0, 7); g.fill(); g.stroke(); }); } }); },
};

// ───────── 56 ISOMETRIC PICTURE BOOK (rumah dan pohon mungil di atas petak)
const isobook = {
  fps: 12,
  paint: { fps: 12, jit: .5, col: p => p.c, stroke: () => '#5a4030', lw: 2.4, all: true,
    fill(g, poly, col) { g.fillStyle = 'rgba(70,50,20,.2)'; polyPath(g, poly.map(([x, y]) => [x + 5, y + 8])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = '#cfe8b8'; g.fillRect(0, 0, R, H); g.strokeStyle = 'rgba(80,120,60,.25)'; g.lineWidth = 2; for (let i = -20; i < 40; i++) { g.beginPath(); g.moveTo(i * 80, 0); g.lineTo(i * 80 + 1300, 750); g.stroke(); g.beginPath(); g.moveTo(i * 80, 0); g.lineTo(i * 80 - 1300, 750); g.stroke(); }
    g.fillStyle = '#e9d8b0'; g.beginPath(); const rx = 480 + 0; g.moveTo(rx - 60, 0); g.lineTo(rx + 60, 0); g.lineTo(rx + 60, H); g.lineTo(rx - 60, H); g.fill();
    for (let i = 0; i < 12; i++) { const x = 80 + hash(i, 1, 11) * (R - 160), y = rise(t, 300, i * 130, H + 300) - 100; if (Math.abs(x - 480) < 110) continue; if (i % 3) { g.fillStyle = '#4e9a4a'; g.beginPath(); g.ellipse(x, y - 26, 26, 34, 0, 0, 7); g.fill(); g.fillStyle = '#7a5230'; g.fillRect(x - 4, y, 8, 22); } else { isoBox(g, x, y, 40, 40, '#f2e2c6'); g.fillStyle = '#c4553a'; g.beginPath(); g.moveTo(x, y - 74); g.lineTo(x + 48, y - 40); g.lineTo(x, y - 16); g.lineTo(x - 48, y - 40); g.fill(); } } },
};

// ───────── 57 CIRCUIT BOARD (PCB hijau, jalur emas, denyut cahaya)
const TRC = once('trc', () => { const r = rng(57), L = []; for (let i = 0; i < 16; i++) { let x = 30 + i * 58, pts = [[x, 0]], y = 0; while (y < 1200) { y += 100 + r() * 160; pts.push([x, y]); if (r() < .6) { const d = (r() < .5 ? -1 : 1) * 29; x = clamp(x + d, 20, 940); y += 29; pts.push([x, y]); } } L.push(pts); } return L; });
const circuit = {
  fps: 24,
  paint: { fps: 24, col: p => mix(p.c, '#0b3d2a', .12), stroke: () => '#e8c34a', lw: 2.2, all: true, lineCol: () => '#e8c34a' },
  bg(g, t) { vgrad(g, [[0, '#08462f'], [1, '#0a5a3b']]); const sc = mod(t * 260, 1200); g.lineCap = g.lineJoin = 'round';
    TRC.forEach((pts, i) => { for (let j = 0; j < 2; j++) { const o = -sc + j * 1200; g.strokeStyle = '#d7b13c'; g.lineWidth = 5; g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y + o) : g.moveTo(x, y + o)); g.stroke(); g.fillStyle = '#d7b13c'; pts.forEach(([x, y], k) => { if (k % 2 === 0) { g.beginPath(); g.arc(x, y + o, 8, 0, 7); g.fill(); } });
        const py = mod(hash(i, 1, 5) * 1200 + t * 520, 1200); let seg = pts.findIndex((p, k) => k && pts[k - 1][1] <= py && p[1] > py); if (seg > 0) { const a = pts[seg - 1], b = pts[seg], u = (py - a[1]) / (b[1] - a[1] || 1); g.fillStyle = '#b6ffd4'; g.shadowColor = '#7dffb2'; g.shadowBlur = 14; g.beginPath(); g.arc(a[0] + (b[0] - a[0]) * u, py + o, 5, 0, 7); g.fill(); g.shadowBlur = 0; } } });
    [[150, 100, 0], [700, 600, 1]].forEach(([x, y0, k]) => { const y = rise(t, 260, y0 + 300, H + 400) - 80; g.fillStyle = '#14181c'; g.fillRect(x, y, 140, 100); g.fillStyle = '#c9cdd2'; for (let i = 0; i < 8; i++) { g.fillRect(x - 12, y + 8 + i * 11, 12, 5); g.fillRect(x + 140, y + 8 + i * 11, 12, 5); } g.fillStyle = '#444'; g.beginPath(); g.arc(x + 14, y + 14, 5, 0, 7); g.fill(); }); },
};

// ───────── 58 SCI-FI SITCOM TOON (kartun retro-futuristik, garis tebal)
const scifi = {
  fps: 12,
  paint: { fps: 12, jit: .6, col: p => sat(p.c, 1.25), stroke: () => '#12082a', lw: 4.6, all: true, lineCol: () => '#12082a' },
  bg(g, t) { vgrad(g, [[0, '#1b1346'], [1, '#3a1f78']]); g.fillStyle = '#fff'; for (let i = 0; i < 50; i++) { const y = rise(t, 160 + hash(i, 2, 6) * 300, hash(i, 3, 6) * H, H + 20); g.fillRect(hash(i, 1, 6) * R, y, 3, 3); }
    const planet = (x, y, r, c1, c2, ring) => { if (ring) { g.strokeStyle = c2; g.lineWidth = 12; g.beginPath(); g.ellipse(x, y, r * 1.7, r * .45, -.35, Math.PI, Math.PI * 2); g.stroke(); } g.fillStyle = c1; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = '#12082a'; g.lineWidth = 5; g.stroke(); g.fillStyle = c2; g.globalAlpha = .5; g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .5, 0, 7); g.fill(); g.globalAlpha = 1; if (ring) { g.strokeStyle = c2; g.lineWidth = 12; g.beginPath(); g.ellipse(x, y, r * 1.7, r * .45, -.35, 0, Math.PI); g.stroke(); } };
    planet(780, rise(t, 130, 100, H + 600) - 100, 110, '#ff7a45', '#ffc36a', true); planet(150, rise(t, 100, 700, H + 600) - 100, 80, '#3ecfc0', '#9af5e8', false);
    const sy = rise(t, 420, 400, H + 400); g.save(); g.translate(300, sy); g.fillStyle = '#d9dde8'; g.strokeStyle = '#12082a'; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 70, 22, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#7cf0ff'; g.beginPath(); g.ellipse(0, -14, 28, 20, 0, Math.PI, 0); g.fill(); g.stroke(); g.restore(); },
};

// ───────── 59 HD-2D (sprite pixel di diorama, tilt-shift, bloom hangat)
const HDC = once('hdc', () => new OffscreenCanvas(240, 270)), HDA = once('hda', () => mk()), HDB = once('hdb', () => mk()), HDM = once('hdm', () => mk());
const hd2d = {
  fps: 12,
  full(g, { t, st, parts, obs }) {
    const c = ctx2(HDC); c.clearRect(0, 0, 240, 270); const fr = (x, y, w, h) => c.fillRect(Math.round(x), Math.round(y), w, h), oy = mod(t * 70, 24);
    c.fillStyle = '#6aa84f'; c.fillRect(0, 0, 240, 270); for (let y = -24; y < 290; y += 12) for (let x = 0; x < 240; x += 12) { const k = Math.round((y + oy) / 12), h = hash(x / 12, k - Math.floor(t * 70 / 12), 5); c.fillStyle = h < .3 ? '#5a9a42' : h < .6 ? '#77b85b' : '#6aa84f'; fr(x, y + oy - 24 + 12, 12, 12); if (h > .93) { c.fillStyle = '#ffe066'; fr(x + 4, y + oy, 2, 2); } }
    c.fillStyle = '#d9b97a'; fr(88, 0, 64, 270); c.fillStyle = '#c4a262'; for (let y = -24 + oy; y < 270; y += 24) fr(88, y, 64, 2);
    for (let i = 0; i < 9; i++) { const x = i & 1 ? 190 + hash(i, 1, 9) * 40 : hash(i, 1, 9) * 60, y = mod(hash(i, 2, 9) * 330 - t * 70, 330) - 30; c.fillStyle = '#2e6b34'; fr(x, y, 22, 20); c.fillStyle = '#3f8a44'; fr(x + 3, y - 6, 16, 10); c.fillStyle = '#6b4a2a'; fr(x + 9, y + 20, 4, 8); }
    drawPixel(c, 240, 270, st.x / 4, st.y / 4, st.sc / 4, parts); obs.forEach(o => drawPixel(c, 240, 270, o.x / 4, o.y / 4, o.sc / 4, o.parts));
    const a = ctx2(HDA); a.setTransform(1, 0, 0, 1, 0, 0); a.imageSmoothingEnabled = false; a.drawImage(HDC, 0, 0, R, H);
    const b = ctx2(HDB); b.clearRect(0, 0, R, H); b.filter = 'blur(9px)'; b.drawImage(HDA, 0, 0); b.filter = 'none';
    const m = ctx2(HDM); m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, R, H); m.drawImage(HDA, 0, 0); m.globalCompositeOperation = 'destination-in';
    const mg = m.createLinearGradient(0, 250, 0, 850); mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(.3, 'rgba(0,0,0,1)'); mg.addColorStop(.7, 'rgba(0,0,0,1)'); mg.addColorStop(1, 'rgba(0,0,0,0)'); m.fillStyle = mg; m.fillRect(0, 0, R, H); m.globalCompositeOperation = 'source-over';
    g.drawImage(HDB, 0, 0); g.drawImage(HDM, 0, 0); g.fillStyle = 'rgba(255,200,120,.1)'; g.fillRect(0, 0, R, H);
  },
  post(g, t) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .14; g.filter = 'blur(22px) brightness(1.2)'; g.drawImage(g.canvas, 0, 0); g.restore(); const gr = g.createRadialGradient(R / 2, H / 2, 380, R / 2, H / 2, 780); gr.addColorStop(0, 'rgba(20,10,0,0)'); gr.addColorStop(1, 'rgba(20,10,0,.45)'); g.fillStyle = gr; g.fillRect(0, 0, R, H); },
};

// ───────── 60 MICROGAME FRENZY (warna terang, garis tebal, bom sumbu dan GO!)
const microgame = {
  fps: 12,
  paint: { fps: 12, jit: 1, col: p => sat(p.c, 1.4), stroke: () => '#111', lw: 6, all: true, lineCol: () => '#111' },
  bg(g, t) { const k = Math.floor(t / 1.2), cols = [['#ff4f8b', '#ffd23f'], ['#2ec4b6', '#fff3b0'], ['#7b5cff', '#ffb3c7'], ['#ff9f1c', '#ffe8a3']][k % 4]; g.fillStyle = cols[0]; g.fillRect(0, 0, R, H);
    g.save(); g.translate(R / 2, H / 2); g.rotate(t * .5); g.fillStyle = cols[1]; for (let i = 0; i < 14; i++) { g.rotate(Math.PI * 2 / 14); g.beginPath(); g.moveTo(0, 0); g.lineTo(1300, -90); g.lineTo(1300, 90); g.fill(); } g.restore();
    for (let i = 0; i < 12; i++) { const y = rise(t, 420, i * 110, H + 200), x = hash(i, 1, 13) * R; g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 5; g.beginPath(); g.arc(x, y, 12 + hash(i, 2, 13) * 14, 0, 7); g.fill(); g.stroke(); } },
  after(g, st, t) { const p = mod(t, 1.2) / 1.2; g.save(); g.fillStyle = '#111'; rrect(g, 60, H - 88, R - 120, 34, 17); g.fill(); g.fillStyle = p < .8 ? '#7dff6a' : '#ff3b30'; rrect(g, 66, H - 82, Math.max(10, (R - 132) * (1 - p)), 22, 11); g.fill();
    g.translate(R - 150, 150 + Math.sin(t * 14) * 5); g.rotate(Math.sin(t * 9) * .12); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 8; g.font = '900 78px Inter'; g.textAlign = 'center'; g.strokeText(p < .8 ? 'JATUH!' : 'AWAS!', 0, 0); g.fillText(p < .8 ? 'JATUH!' : 'AWAS!', 0, 0); g.restore(); },
};

export const STY3 = [shadow, lantern, halftone, engraving, silkscreen, longtake, spy, pictogram, ascii, dataviz, isoinfo, keynote, screencast, hologram, transit, isobook, circuit, scifi, hd2d, microgame];
STY3.forEach(S => { if (!S.draw && !S.full && S.paint) Object.assign(S, std(S)); });
