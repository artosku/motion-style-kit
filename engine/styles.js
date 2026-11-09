// 20 style: latar, kuas ayam, dan rintangan. Ayam digambar ulang dari geometri anatomi (minyamParts); tiap style punya cara mewarnai sendiri.
import { crayonStroke, R, H, mk, noise, hash, rng, ell, rotp, rect, minyamParts, polyPath, drawCrayon, drawInk, drawPixel } from './main.js';

// ───────── alat kecil
const mod = (a, n) => ((a % n) + n) % n, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const tohex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = hx(a), B = hx(b); return tohex(A.map((v, i) => v + (B[i] - v) * t)); };
const dark = (h, t) => mix(h, '#000000', t), light = (h, t) => mix(h, '#ffffff', t);
const lum = h => { const c = hx(h); return (.3 * c[0] + .59 * c[1] + .11 * c[2]) / 255; };
const snap = (h, pal) => { const c = hx(h); let b = pal[0], bd = 1e9; for (const q of pal) { const d = hx(q).reduce((s, v, i) => s + (v - c[i]) ** 2, 0); if (d < bd) { bd = d; b = q; } } return b; };
const sat = (h, k) => { const c = hx(h), l = .3 * c[0] + .59 * c[1] + .11 * c[2]; return tohex(c.map(v => l + (v - l) * k)); };
const cen = poly => { let x = 0, y = 0; poly.forEach(p => { x += p[0]; y += p[1]; }); return [x / poly.length, y / poly.length]; };
const bbox = poly => { let a = 1e9, b = -1e9, c = 1e9, d = -1e9; poly.forEach(([x, y]) => { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); d = Math.max(d, y); }); return [a, b, c, d]; };
const rise = (t, v, off, span = H + 300) => mod(off - t * v, span) - 150;      // posisi y benda yang naik (karena ayam jatuh)
const ctx2 = c => c.getContext('2d');
const circles = [[-45, 0, 25], [-15, -18, 32], [22, -12, 28], [48, 4, 22]];
function cloud(g, x, y, s, fill, edge, w) {
  if (edge) { g.strokeStyle = edge; g.lineWidth = w * 2; circles.forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, 7); g.stroke(); }); }
  g.fillStyle = fill; circles.forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, 7); g.fill(); });
}
function blob(g, x, y, r, col, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r), c = hx(col); gr.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a})`); gr.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
function grainTile(sd, a, dk = '#000000') { const c = mk(), g = ctx2(c), id = g.createImageData(R, H), d = id.data, D = hx(dk);
  for (let y = 0; y < H; y++) for (let x = 0; x < R; x++) { const i = (y * R + x) * 4, n = noise(x * .8, y * .8, sd), w = hash(x, y, sd + 3) > .5; if (n > .62) { const k = w ? 255 : D[0]; d[i] = k; d[i + 1] = w ? 255 : D[1]; d[i + 2] = w ? 255 : D[2]; d[i + 3] = a * 255 * (n - .62) * 2.6; } }
  g.putImageData(id, 0, 0); return c; }
const cache = {}; const once = (k, f) => cache[k] ??= f();

// ───────── pasang bagian ayam (rotasi/gepeng) di ruang satuan
export function placeParts(parts, { rot = 0, sqx = 1, sqy = 1 }) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const f = ([x, y]) => { const dx = x, dy = y + 100, rx = dx * c - dy * s, ry = dx * s + dy * c; return [rx * sqx, ry * sqy - 100]; };
  return parts.map(p => ({ ...p, poly: p.poly.map(f) }));
}

// ───────── rintangan (bentuk sederhana, dicat oleh kuas style yang sedang aktif)
const OB = (k, poly, c, x = {}) => ({ k: 'ob', poly, c, sil: true, ...x });
const LN = (poly, c) => ({ k: 'Rline', line: true, poly, c });
export const OB_NAMES = ['burung', 'balon udara', 'drone', 'layang-layang', 'UFO', 'pesawat kertas', 'roket', 'awan petir'];
export function obstacleParts(kind, t = 0) {
  const f = Math.sin(t * 15);
  switch (kind % 8) {
    case 0: return [OB('ob', [[-8, -4], [-30, -46 * f], [10, -30 * f]], '#4f7fb5'), OB('ob', [[-34, 0], [-64, -8], [-58, 10]], '#4f7fb5'), OB('ob', ell(0, 0, 36, 20), '#7aa7d8'), OB('ob', ell(34, -8, 15, 13), '#7aa7d8'),
      OB('ob', [[46, -10], [64, -6], [46, -2]], '#FFB62D'), OB('ob', ell(38, -11, 3, 3), '#1a1a1a', { o: false }), OB('ob', [[-4, 2], [-34, 40 * f + 4], [14, 26 * f + 4]], '#4f7fb5')];
    case 1: return [OB('ob', ell(0, -40, 46, 56), '#E8353F'), OB('ob', ell(0, -40, 17, 56), '#FFB62D', { o: false }), OB('ob', rect(-14, 34, 28, 20), '#8A6A3E'), LN([[-26, 18], [-12, 34]], '#5a4630'), LN([[26, 18], [12, 34]], '#5a4630')];
    case 2: return [LN([[-30, -4], [-58, -16]], '#444a52'), LN([[30, -4], [58, -16]], '#444a52'), OB('ob', rect(-30, -9, 60, 18), '#444a52'), OB('ob', ell(0, 12, 9, 9), '#222222'),
      OB('ob', ell(-58, -20, 24 + 4 * f, 4), '#aab4c0'), OB('ob', ell(58, -20, 24 - 4 * f, 4), '#aab4c0'), OB('ob', ell(0, -2, 5, 5), '#EE3B45', { o: false })];
    case 3: return [OB('ob', [[0, -56], [34, -4], [0, 52], [-34, -4]], '#F6C431'), LN([[0, -56], [0, 52]], '#c97e0a'), LN([[-34, -4], [34, -4]], '#c97e0a'),
      LN([[0, 52], [-10, 72], [10, 88], [-10, 104], [8, 122]], '#E33D80'), OB('ob', ell(-10, 72, 8, 5), '#E33D80', { o: false }), OB('ob', ell(10, 88, 8, 5), '#16B3A4', { o: false })];
    case 4: return [OB('ob', ell(0, -12, 24, 20), '#7CC8FF'), OB('ob', ell(0, 6, 64, 16), '#b9c2cf'), OB('ob', ell(-38, 8, 5, 5), '#FFB62D', { o: false }), OB('ob', ell(0, 12, 5, 5), '#FFB62D', { o: false }), OB('ob', ell(38, 8, 5, 5), '#FFB62D', { o: false })];
    case 5: return [OB('ob', [[-60, 6], [60, -14], [-16, 26]], '#ffffff'), OB('ob', [[-60, 6], [60, -14], [-6, 8]], '#dfe6ee'), LN([[-60, 6], [-6, 8], [60, -14]], '#9aa7b6')];
    case 6: return [OB('ob', [[-8, 52], [0, 90 + 8 * f], [8, 52]], '#FF8A2B', { o: false }), OB('ob', ell(0, 0, 20, 50), '#d9dde3'), OB('ob', [[-20, -26], [0, -76], [20, -26]], '#E8353F'),
      OB('ob', [[-20, 20], [-42, 54], [-18, 44]], '#E8353F'), OB('ob', [[20, 20], [42, 54], [18, 44]], '#E8353F'), OB('ob', ell(0, -6, 9, 9), '#7CC8FF')];
    default: return [OB('ob', ell(-30, 0, 32, 22), '#6d7a8a'), OB('ob', ell(8, -12, 38, 28), '#6d7a8a'), OB('ob', ell(40, 2, 30, 22), '#6d7a8a'), OB('ob', [[8, 14], [-6, 44], [6, 44], [-4, 78], [22, 36], [10, 36], [20, 14]], '#FFD93D')];
  }
}

// ───────── pelukis umum: tiap style memberi fungsi warna / isi / garis
function paint(g, parts, ox, oy, sc, o, t) {
  g.save(); g.setTransform(sc, 0, 0, sc, ox, oy); g.lineCap = g.lineJoin = 'round';
  if (o.pre) o.pre(g);
  const r = rng(Math.floor(t * (o.fps || 1)) * 7 + 3);
  for (const p of parts) {
    const col = o.col ? o.col(p) : p.c; if (col === null) continue;
    let poly = p.poly; if (o.jit) poly = poly.map(([x, y]) => [x + (r() - .5) * o.jit, y + (r() - .5) * o.jit]);
    if (p.line) { g.strokeStyle = o.lineCol ? o.lineCol(p, col) : col; g.lineWidth = (o.lw || 2) * 1.1; polyPath(g, poly, false); g.stroke(); continue; }
    if (o.fill) o.fill(g, poly, col, p, t); else { g.fillStyle = col; polyPath(g, poly); g.fill(); }
    const sk = o.stroke ? o.stroke(p, col) : null;
    if (sk && (p.o !== false || o.all)) { g.strokeStyle = sk; g.lineWidth = o.lw || 2; if (o.sa) g.globalAlpha = o.sa; polyPath(g, poly); g.stroke(); g.globalAlpha = 1; }
  }
  if (o.post) o.post(g); g.restore();
}
const std = (S) => ({ draw: (g, parts, ox, oy, sc, t) => paint(g, parts, ox, oy, sc, S.paint, t) });

// ───────── 0: INTRO (Minyam asli dari kode resmi, latar langit polos)
export function drawIntro(g, st, t, info) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5fb4f5'); gr.addColorStop(1, '#cfeaff'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
  [[150, 0, 1.2], [790, 300, .9], [260, 620, 1.1], [820, 880, .8]].forEach(([x, off, s]) => cloud(g, x, rise(t, 520, off + 200), s, '#ffffff', null, 0));
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 5; g.lineCap = 'round';
  [[300, 0], [640, 260], [140, 520], [800, 700]].forEach(([x, off]) => { const y = rise(t, 1100, off); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 90); g.stroke(); });
  // pesawat (terbang ke kanan, meninggalkan layar setelah ayam meloncat)
  if (info.plane) { const { x, y } = info.plane; g.save(); g.translate(x, y); g.fillStyle = '#e9edf2'; g.beginPath(); g.ellipse(0, 0, 150, 36, 0, 0, 7); g.fill(); g.fillStyle = '#8fa0b4'; g.fillRect(-70, 20, 140, 6);
    g.fillStyle = '#E8353F'; g.beginPath(); g.moveTo(-130, -10); g.lineTo(-170, -70); g.lineTo(-100, -10); g.fill(); g.fillStyle = '#7CC8FF'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(30 + i * 22, -8, 8, 0, 7); g.fill(); }
    g.fillStyle = '#cfd6df'; g.beginPath(); g.moveTo(-20, 20); g.lineTo(-60, 90); g.lineTo(30, 24); g.fill(); g.fillStyle = '#9aa7b6'; g.fillRect(-4, -34, 10, 8); g.restore(); }
  g.save(); g.translate(st.x, st.y - 100 * st.sc); g.rotate(st.rot); g.scale(st.sqx, st.sqy);
  Minyam.draw(g, { x: 0, y: 100 * st.sc, scale: st.sc, t, shadow: false, pose: { view: 'front', mood: 'happy', eyes: 'shock', beak: .75, flap: .5 + .5 * Math.sin(t * 11), tilt: 0, lookY: .2, sweat: info.fall ? 1 : 0 } });
  g.restore();
}

// ───────── 1 WHITEBOARD
const whiteboard = {
  fps: 8,
  paint: { fps: 8, jit: 1.5, stroke: () => '#1b1b1b', lw: 3.2, all: true, fill: (g, poly, col) => { g.fillStyle = light(col, .3); polyPath(g, poly.map(([x, y]) => [x + 3.5, y + 3.5])); g.fill(); } },
  bg(g, t) { g.fillStyle = '#fbfbf7'; g.fillRect(0, 0, R, H); g.fillStyle = '#e4e4dc'; for (let x = 40; x < R; x += 80) for (let y = mod(40 - t * 120, 80); y < H; y += 80) g.fillRect(x, y, 3, 3);
    [[150, 0, 1], [780, 320, .85], [260, 640, 1.1], [820, 900, .7]].forEach(([x, off, s]) => cloud(g, x, rise(t, 480, off + 200), s, '#fbfbf7', '#3a74d6', 4));
    g.strokeStyle = '#222'; g.lineWidth = 4; g.lineCap = 'round'; [[420, 0], [560, 300], [330, 600], [700, 800]].forEach(([x, off]) => { const y = rise(t, 900, off); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 70); g.stroke(); });
    g.fillStyle = '#d9d9d2'; g.fillRect(0, H - 22, R, 22); g.fillStyle = '#c8c8bf'; g.fillRect(0, H - 22, R, 4); },
};
// ───────── 2 CRAYON
const crayon = {
  fps: 10,
  draw: (g, parts, ox, oy, sc, t) => drawCrayon(g, ox, oy, sc, 5 + Math.floor(t * 10), parts),
  bg(g, t) {
    g.drawImage(once('cray', () => { const c = mk(), q = ctx2(c), r = rng(7); q.fillStyle = '#fff4dc'; q.fillRect(0, 0, R, H);
      for (let y = -20; y < H + 20; y += 17) crayonStroke(q, [[-20, y + 40], [R / 3, y + 18], [R * 2 / 3, y + 34], [R + 20, y]], y < 520 ? '#79c4ef' : y < 820 ? '#a6dcf5' : '#bfe7f7', 26, r, 2); return c; }), 0, 0);
    const r = rng(Math.floor(t * 10) + 1);
    [[150, 0, 1.1], [780, 360, .9], [240, 700, 1]].forEach(([x, off, k]) => crayonStroke(g, Array.from({ length: 30 }, (_, i) => [x + Math.cos(i / 3) * (10 + i * 2) * k, rise(t, 480, off + 200) + Math.sin(i / 3) * (6 + i * 1.3) * k]), '#ffffff', 16, r, 3));
    [[250, 0], [700, 240], [120, 520], [830, 740]].forEach(([x, off]) => { const y = rise(t, 1000, off); crayonStroke(g, [[x, y], [x + 4, y + 110]], '#ffffff', 8, r, 2); });
    g.drawImage(once('cg', () => grainTile(3, .55, '#8a6a3e')), 0, 0);
  },
};
// ───────── 3 WATERCOLOR
const wc = {
  fps: 12,
  paint: { col: p => p.c, fps: 12, stroke: p => '#7b6a5a', sa: .55, lw: .9, all: true,
    fill(g, poly, col, p) { for (let k = 0; k < 3; k++) { const wp = poly.map(([x, y]) => [x + (noise(x * .05 + k * 7, y * .05, 3) - .5) * 6, y + (noise(x * .05, y * .05 + k * 9, 4) - .5) * 6]); g.globalAlpha = .42; g.fillStyle = light(col, .06 * k); polyPath(g, wp); g.fill(); }
      g.globalAlpha = .45; g.strokeStyle = dark(col, .3); g.lineWidth = 2; polyPath(g, poly); g.stroke(); g.globalAlpha = 1; } },
  bg(g, t) {
    g.drawImage(once('wc', () => { const c = mk(), q = ctx2(c), r = rng(11); q.fillStyle = '#fbf7ee'; q.fillRect(0, 0, R, H);
      for (let i = 0; i < 26; i++) { const y = r() * H; blob(q, r() * R, y, 150 + r() * 160, y < 420 ? ['#8ecae6', '#a9d6e5', '#bde0fe'][i % 3] : y < 800 ? ['#cdb4db', '#f4b6c2', '#ffd6a5'][i % 3] : ['#b7e4c7', '#95d5b2'][i % 2], .55); } return c; }), 0, 0);
    [[160, 0, 1], [790, 400, .9], [300, 760, 1.1]].forEach(([x, off, s]) => { const y = rise(t, 420, off + 200); blob(g, x, y, 170 * s, '#ffffff', .85); blob(g, x + 70 * s, y + 20, 120 * s, '#ffffff', .7); });
    g.fillStyle = 'rgba(60,120,200,.28)'; for (let i = 0; i < 14; i++) { const x = hash(i, 1, 5) * R, y = rise(t, 700 + hash(i, 2, 5) * 400, hash(i, 3, 5) * H), r = 2 + hash(i, 4, 5) * 5; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.drawImage(once('wg', () => grainTile(5, .28, '#6a5a4c')), 0, 0);
  },
};
// ───────── 4 INK WASH
const ink = {
  fps: 12,
  draw: (g, parts, ox, oy, sc) => { const l = mk(); drawInk(ctx2(l), ox, oy, sc, 5, parts); g.save(); g.filter = 'blur(5px)'; g.globalAlpha = .3; const s = ctx2(mk()); g.drawImage(sil(l, '#1c1c1c'), 0, 0); g.restore(); g.drawImage(l, 0, 0); },
  bg(g, t) {
    g.drawImage(once('ink', () => { const c = mk(), q = ctx2(c); q.fillStyle = '#efe9d8'; q.fillRect(0, 0, R, H);
      const mount = (pts, a, bl) => { q.save(); q.filter = `blur(${bl}px)`; q.fillStyle = `rgba(35,38,36,${a})`; q.beginPath(); pts.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.closePath(); q.fill(); q.restore(); };
      mount([[-40, 1100], [-40, 900], [120, 810], [260, 900], [380, 760], [520, 920], [700, 830], [860, 930], [1000, 880], [1000, 1100]], .22, 6);
      mount([[-40, 1100], [-40, 980], [180, 940], [360, 1010], [560, 950], [780, 1020], [1000, 960], [1000, 1100]], .5, 3);
      q.fillStyle = '#c8372d'; q.fillRect(830, 960, 64, 64); q.fillStyle = '#efe9d8'; q.fillRect(842, 972, 18, 40); q.fillRect(866, 972, 16, 16); q.fillRect(866, 996, 16, 16); return c; }), 0, 0);
    [[200, 0, 260, 80], [780, 420, 220, 64], [160, 760, 250, 74]].forEach(([x, off, rx, ry]) => { const y = rise(t, 300, off + 200); g.save(); g.filter = 'blur(26px)'; g.fillStyle = 'rgba(40,42,40,.11)'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.restore(); });
    [[270, 0, 150], [700, 260, 170], [110, 520, 130], [840, 700, 140]].forEach(([x, off, l]) => { const y = rise(t, 1000, off); const lg = g.createLinearGradient(0, y, 0, y + l); lg.addColorStop(0, 'rgba(40,40,40,0)'); lg.addColorStop(.5, 'rgba(40,40,40,.4)'); lg.addColorStop(1, 'rgba(40,40,40,0)'); g.fillStyle = lg; g.fillRect(x, y, 7, l); });
    g.drawImage(once('ig', () => grainTile(8, .18, '#555')), 0, 0);
  },
};
function sil(src, color) { const o = mk(), g = ctx2(o); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, R, H); return o; }
// ───────── 5 RISOGRAPH
const RB = '#0078bf', RP = '#ff48b0', RY = '#ffe800', RPAPER = '#f4efe1';
const riso = {
  fps: 12,
  paint: { fps: 12, jit: .8,
    col(p) { const m = { tosca: RB, toscain: mix(RB, RPAPER, .55), pink: RP, pinkin: mix(RP, RPAPER, .5), orange: RY, orangein: mix(RY, RPAPER, .4), leg: RP, sole: RY, body: RPAPER, shade: mix(RB, RPAPER, .22), coin: RY, coin2: '#ff9d00', wing: mix(RP, RPAPER, .4), slot: RB, comb: RP, gloss: mix(RP, RPAPER, .6), eyew: RPAPER, pupil: RB, glint: RPAPER, cheek: mix(RP, RPAPER, .5), wattle: RP, beak: RY, sweat: mix(RB, RPAPER, .4), Rline: RB };
      if (m[p.k]) return m[p.k]; const l = lum(p.c); return l < .35 ? RB : l < .62 ? RP : RY; },
    stroke: () => RB, lw: 1.8, all: true,
    fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly.map(([x, y]) => [x - 2.5, y - 1.5])); g.fill(); } },
  bg(g, t) { g.fillStyle = RPAPER; g.fillRect(0, 0, R, H); g.globalCompositeOperation = 'multiply';
    const sp = 20, off = mod(t * 260, sp); g.fillStyle = RB; for (let y = -sp + off; y < H + sp; y += sp) for (let x = (Math.round(y / sp) % 2) * sp / 2; x < R + sp; x += sp) { const k = 1 - y / H, r = Math.max(0, 1.5 + k * 7.5 + noise(x * .02, y * .02, 4) * 2); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.fillStyle = RY; g.beginPath(); g.arc(760, 220, 110, 0, 7); g.fill();
    [[180, 0, 1.2], [790, 380, .9], [300, 740, 1]].forEach(([x, off2, s]) => cloud(g, x, rise(t, 440, off2 + 200), s, RP, null, 0));
    g.globalCompositeOperation = 'source-over'; g.drawImage(once('rg', () => grainTile(9, .3, '#7a6f60')), 0, 0); },
};
// ───────── 6 WOODCUT
const WI = '#17110b', WP = '#eadfc4';
const woodcut = {
  fps: 6,
  paint: { fps: 6, jit: 1.8, stroke: () => WI, lw: 3.6, all: true,
    fill(g, poly, col, p) { g.fillStyle = WP; polyPath(g, poly); g.fill(); const l = lum(col); if (l > .86) return; if (l < .3) { g.fillStyle = WI; polyPath(g, poly); g.fill(); return; }
      const [x0, x1, y0, y1] = bbox(poly), sp = l > .6 ? 7 : 4; g.save(); polyPath(g, poly); g.clip(); g.strokeStyle = WI; g.lineWidth = l > .6 ? 1.6 : 2.2;
      for (let d = -(y1 - y0) - 40; d < x1 - x0 + 40; d += sp) { g.beginPath(); g.moveTo(x0 + d, y1 + 10); g.lineTo(x0 + d + (y1 - y0) + 20, y0 - 10); g.stroke(); } g.restore(); } },
  bg(g, t) { g.fillStyle = WP; g.fillRect(0, 0, R, H); g.strokeStyle = WI; g.lineCap = 'round';
    for (let y = -20; y < H; y += 15) { g.lineWidth = Math.max(.8, 5 * (1 - y / H) + 1); g.beginPath(); for (let x = 0; x <= R; x += 20) { const yy = y + Math.sin(x * .02 + y * .05 - t * 3) * 5; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    [[170, 0, 1.2], [780, 340, .95], [280, 700, 1.1]].forEach(([x, off, s]) => { const y = rise(t, 460, off + 200); cloud(g, x, y, s, WP, WI, 4); g.strokeStyle = WI; g.lineWidth = 3; g.beginPath(); g.arc(x - 12 * s, y - 14 * s, 14 * s, 3.4, 6); g.stroke(); });
    g.drawImage(once('wdg', () => grainTile(12, .35, '#3a2a18')), 0, 0); },
};
// ───────── 7 SWISS
const SR = '#e63a1e', SK = '#1a1a1a', SW = '#ffffff';
const swiss = {
  fps: 24,
  paint: { fps: 24, stroke: () => SK, lw: 2.2, all: false,
    col(p) { const m = { body: SW, shade: '#d9d9d2', tosca: SK, toscain: '#555555', pink: SR, pinkin: '#ff7a5a', orange: SK, orangein: '#8c8c8c', wing: SR, coin: SK, coin2: SW, Rline: SK, comb: SR, gloss: '#ff7a5a', eyew: SW, pupil: SK, glint: SW, cheek: SR, wattle: SR, beak: SR, leg: SK, sole: SK, slot: SK, sweat: SK };
      if (m[p.k]) return m[p.k]; const l = lum(p.c); return l < .35 ? SK : l < .65 ? SR : SW; } },
  bg(g, t) { g.fillStyle = '#ece9df'; g.fillRect(0, 0, R, H); g.strokeStyle = 'rgba(26,26,26,.13)'; g.lineWidth = 2; for (let x = 60; x < R; x += 120) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = mod(-t * 300, 120); y < H; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); }
    g.fillStyle = SR; g.beginPath(); g.arc(700, rise(t, 240, 500), 250, 0, 7); g.fill();
    g.fillStyle = SK; [[60, 0, 200], [520, 300, 130], [180, 640, 260], [640, 880, 150]].forEach(([x, off, w]) => g.fillRect(x, rise(t, 700, off), w, 16));
    g.font = '800 190px Inter'; g.textBaseline = 'alphabetic'; g.fillStyle = SK; g.fillText('↓', 70, rise(t, 480, 700) + 190); g.font = '700 26px Inter'; g.fillText(String(Math.floor(t * 100) % 1000).padStart(3, '0') + ' m/s', 64, 62); },
};
// ───────── 8 ART DECO
const DECO = ['#f3e6c4', '#d4af37', '#1f9aa8', '#0b1d3a', '#b3123b', '#2e8b57'];
const deco = {
  fps: 24,
  paint: { fps: 24, col: p => snap(p.c, DECO), stroke: () => '#d4af37', lw: 2.4, all: true,
    fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly); g.fill(); const [cx, cy] = cen(poly); g.strokeStyle = 'rgba(212,175,55,.65)'; g.lineWidth = 1; polyPath(g, poly.map(([x, y]) => [cx + (x - cx) * .8, cy + (y - cy) * .8])); g.stroke(); } },
  bg(g, t) { g.fillStyle = '#0b1d3a'; g.fillRect(0, 0, R, H); g.save(); g.translate(R / 2, 120); g.rotate(t * .08); g.fillStyle = 'rgba(212,175,55,.13)'; for (let i = 0; i < 28; i += 2) { const a = i / 28 * Math.PI * 2, b = (i + 1) / 28 * Math.PI * 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 1600, Math.sin(a) * 1600); g.lineTo(Math.cos(b) * 1600, Math.sin(b) * 1600); g.fill(); } g.restore();
    g.strokeStyle = '#d4af37'; g.lineWidth = 3; for (let k = 0; k < 9; k++) { const y = mod(k * 150 - t * 420, 1350) - 150; g.beginPath(); g.moveTo(60, y); g.lineTo(R / 2, y + 80); g.lineTo(R - 60, y); g.stroke(); g.globalAlpha = .5; g.beginPath(); g.moveTo(60, y + 22); g.lineTo(R / 2, y + 102); g.lineTo(R - 60, y + 22); g.stroke(); g.globalAlpha = 1; }
    g.fillStyle = '#d4af37'; g.fillRect(36, 0, 6, H); g.fillRect(R - 42, 0, 6, H); g.fillRect(48, 0, 2, H); g.fillRect(R - 50, 0, 2, H); },
};
// ───────── 9 BLUEPRINT
const blueprint = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#ffffff', lw: 1.8, all: true, fill(g, poly) { g.fillStyle = 'rgba(255,255,255,.11)'; polyPath(g, poly); g.fill(); }, lineCol: () => '#ffffff' },
  bg(g, t) { g.fillStyle = '#1c4f9e'; g.fillRect(0, 0, R, H); const off = mod(t * 360, 200);
    g.lineWidth = 1; g.strokeStyle = 'rgba(255,255,255,.13)'; for (let x = 0; x < R; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = -40 + mod(t * 360, 40); y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); }
    g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1.6; for (let x = 0; x < R; x += 200) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = -200 + off; y < H; y += 200) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '600 20px Inter'; for (let y = -200 + off, i = 0; y < H; y += 200, i++) g.fillText('ALT ' + (9800 - Math.round((t * 360 + (H - y)) / 2) % 9800 + 'm').toString(), 14, y - 8);
    g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(R - 300, H - 90, 280, 66); g.fillStyle = '#fff'; g.font = '700 18px Inter'; g.fillText('MINYAM / FREE FALL', R - 288, H - 60); g.font = '500 15px Inter'; g.fillText('SCALE 1:1   SHEET 01', R - 288, H - 38); },
  after(g, st) { g.save(); g.strokeStyle = 'rgba(255,255,255,.75)'; g.fillStyle = '#fff'; g.lineWidth = 1.2; g.setLineDash([10, 6]); g.beginPath(); g.arc(st.x, st.y - 100 * st.sc, 130 * st.sc, 0, 7); g.stroke(); g.setLineDash([]);
    const y = st.y + 34 * st.sc, a = st.x - 90 * st.sc, b = st.x + 90 * st.sc; g.beginPath(); g.moveTo(a, y); g.lineTo(b, y); g.moveTo(a, y - 10); g.lineTo(a, y + 10); g.moveTo(b, y - 10); g.lineTo(b, y + 10); g.stroke(); g.font = '600 16px Inter'; g.textAlign = 'center'; g.fillText('172', st.x, y + 24); g.restore(); },
};
// ───────── 10 STAINED GLASS
const glass = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, 1.25), stroke: () => '#0a0a0a', lw: 5, all: true, fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly); g.fill(); const [x0, , y0] = bbox(poly); const [cx, cy] = cen(poly); const gr = g.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, 60); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.save(); polyPath(g, poly); g.clip(); g.fillStyle = gr; g.fillRect(x0 - 5, y0 - 5, 300, 300); g.restore(); } },
  bg(g, t) { g.drawImage(once('glass', () => { const c = mk(), q = ctx2(c), id = q.createImageData(R, H), d = id.data, r = rng(21), S = [];
      for (let i = 0; i < 64; i++) S.push([r() * R, r() * H, hx(['#1d3a8a', '#2457c5', '#5b2a86', '#c2185b', '#e8a317', '#1e8f6a', '#2fa4d8', '#7a3b9e'][Math.floor(r() * 8)])]);
      for (let y = 0; y < H; y++) for (let x = 0; x < R; x++) { let b1 = 1e9, b2 = 1e9, bi = 0; for (let k = 0; k < S.length; k++) { const dd = Math.hypot(S[k][0] - x, S[k][1] - y); if (dd < b1) { b2 = b1; b1 = dd; bi = k; } else if (dd < b2) b2 = dd; }
        const i = (y * R + x) * 4, e = b2 - b1; if (e < 4.5) { d[i] = d[i + 1] = d[i + 2] = 12; } else { const sh = .78 + .3 * (1 - b1 / 150), cc = S[bi][2]; d[i] = cc[0] * sh; d[i + 1] = cc[1] * sh; d[i + 2] = cc[2] * sh; } d[i + 3] = 255; }
      q.putImageData(id, 0, 0); return c; }), 0, 0);
    g.save(); g.globalCompositeOperation = 'lighter'; const x = mod(t * 700, R + 600) - 300; const lg = g.createLinearGradient(x - 120, 0, x + 120, 300); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, 'rgba(255,240,200,.18)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(0, 0, R, H); g.restore(); },
};
// ───────── 11 PIXEL RPG (semua digambar di grid 240x270 lalu dibesarkan 4x tanpa penghalusan)
const PXC = once('pxc', () => new OffscreenCanvas(240, 270));
const pixel = {
  fps: 12,
  full(g, { t, st, parts, obs }) {
    const c = ctx2(PXC); c.clearRect(0, 0, 240, 270); const S = .75, fr = (x, y, w, h) => c.fillRect(Math.round(x * S), Math.round(y * S), Math.max(1, Math.round(w * S)), Math.max(1, Math.round(h * S)));
    const bands = ['#4aa8f0', '#5bb4f4', '#74c3f8', '#8fd0fb', '#aadcfd', '#c6e8fe']; bands.forEach((col, i) => { c.fillStyle = col; fr(0, Math.floor(i * 360 * .9 / 6), 320, i === 5 ? 220 : 62); });
    const cl = (x, y, w) => { c.fillStyle = '#e8f6ff'; fr(x + 6, y, w - 12, 6); fr(x, y + 6, w, 8); fr(x + 10, y - 6, w - 30, 6); c.fillStyle = '#bfe0f7'; fr(x, y + 12, w, 3); c.fillStyle = '#fff'; fr(x + 12, y - 6, 12, 3); };
    [[236, 0, 62], [18, 140, 48], [250, 220, 50], [6, 300, 66]].forEach(([x, off, w]) => cl(x, Math.round(mod(off - t * 300 + 40, 460) - 50), w));
    c.fillStyle = '#fff'; [[44, 0, 28], [64, 120, 36], [250, 40, 34], [276, 200, 26], [34, 260, 30], [286, 330, 36]].forEach(([x, off, l]) => fr(x, Math.round(mod(off - t * 700, 420) - 30), 3, l));
    drawPixel(c, 240, 270, st.x / 4, st.y / 4, st.sc / 4, parts);
    obs.forEach(o => drawPixel(c, 240, 270, o.x / 4, o.y / 4, o.sc / 4, o.parts));
    g.save(); g.imageSmoothingEnabled = false; g.drawImage(PXC, 0, 0, 960, 1080); g.restore(); },
};
// ───────── 12 RUBBER HOSE
const GR = ['#ffffff', '#e3e3df', '#b0b0ac', '#6f6f6c', '#1c1c1c'];
const hose = {
  fps: 12,
  paint: { fps: 12, jit: 2, stroke: () => '#111', lw: 5, all: true, col(p) { const l = lum(p.c); return l > .9 ? GR[0] : l > .7 ? GR[1] : l > .5 ? GR[2] : l > .3 ? GR[3] : GR[4]; } },
  bg(g, t) { g.fillStyle = '#e8dfc8'; g.fillRect(0, 0, R, H); g.save(); g.translate(R / 2, 540); g.rotate(t * .25); g.fillStyle = '#f3ecd9'; for (let i = 0; i < 24; i += 2) { const a = i / 24 * 6.2832, b = (i + 1) / 24 * 6.2832; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 1500, Math.sin(a) * 1500); g.lineTo(Math.cos(b) * 1500, Math.sin(b) * 1500); g.fill(); } g.restore();
    [[170, 0, 1.2], [790, 380, .95], [280, 740, 1.1]].forEach(([x, off, s]) => cloud(g, x, rise(t, 460, off + 200) + Math.sin(t * 9 + x) * 6, s, '#ffffff', '#111', 5));
    g.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 40; i++) { g.fillRect(hash(i, Math.floor(t * 12), 3) * R, hash(i, Math.floor(t * 12), 4) * H, 2, 30 + hash(i, 1, 2) * 60); }
    g.drawImage(once('hg', () => grainTile(14, .4, '#443')), Math.floor(hash(Math.floor(t * 12), 1, 1) * 6), 0); },
  post(g, t) { const gr = g.createRadialGradient(R / 2, H / 2, 300, R / 2, H / 2, 800); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,30,10,.42)'); g.fillStyle = gr; g.fillRect(0, 0, R, H); },
};
// ───────── 13 80s CEL ANIME
const anime = {
  fps: 12,
  paint: { fps: 12, stroke: (p, c) => dark(c, .6), lw: 1.6, all: true, fill(g, poly, col, p) { g.save(); polyPath(g, poly); g.clip(); g.fillStyle = dark(col, .3); g.fill(); g.fillStyle = col; polyPath(g, poly.map(([x, y]) => [x - 9, y - 7])); g.fill();
      if (p.k === 'body' || p.k === 'wing' || p.k === 'ob') { const [x0, x1, y0, y1] = bbox(poly); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.ellipse(x0 + (x1 - x0) * .28, y0 + (y1 - y0) * .22, (x1 - x0) * .08, (y1 - y0) * .14, -.5, 0, 7); g.fill(); } g.restore(); } },
  bg(g, t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#1a0b3a'); gr.addColorStop(.45, '#8e2a8f'); gr.addColorStop(.75, '#ff6b6b'); gr.addColorStop(1, '#ffb347'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(255,255,255,${.03 + i * .005})`; g.fillRect(0, i * 180, R, 90); }
    g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { const y = rise(t, 120 + hash(i, 2, 9) * 200, hash(i, 1, 9) * H); g.globalAlpha = .4 + hash(i, 3, 9) * .6; g.fillRect(hash(i, 4, 9) * R, y, 3, 3); } g.globalAlpha = 1;
    const r = rng(Math.floor(t * 12) + 5); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; for (let i = 0; i < 70; i++) { const a = i / 70 * 6.2832 + r() * .05, d0 = 300 + r() * 160, d1 = d0 + 160 + r() * 380; g.beginPath(); g.moveTo(R / 2 + Math.cos(a) * d0, 540 + Math.sin(a) * d0); g.lineTo(R / 2 + Math.cos(a) * d1, 540 + Math.sin(a) * d1); g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,.07)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, R, 1); },
};
// ───────── 14 MID-CENTURY
const MC = ['#f1e3c3', '#e8a33d', '#2a9d8f', '#e76f51', '#3d2b1f', '#8ab17d', '#264653'];
const midc = {
  fps: 12,
  paint: { fps: 12, col: p => snap(p.c, MC), stroke: () => '#3d2b1f', lw: 1.8, all: false, fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly); g.fill(); }, pre(g) {}, },
  bg(g, t) { g.fillStyle = '#f2e5c9'; g.fillRect(0, 0, R, H);
    g.fillStyle = '#2a9d8f'; g.beginPath(); g.arc(250, rise(t, 260, 200), 170, 0, 7); g.fill(); g.fillStyle = '#e76f51'; g.beginPath(); g.arc(760, rise(t, 320, 700), 120, 0, Math.PI); g.fill();
    g.fillStyle = '#e8a33d'; [[600, 120, 1], [120, 760, 1.2]].forEach(([x, off, s]) => { const y = rise(t, 380, off); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 90 * s, y + 20 * s, x + 150 * s, y + 130 * s); g.quadraticCurveTo(x + 60 * s, y + 60 * s, x - 20 * s, y + 70 * s); g.fill(); });
    g.fillStyle = '#3d2b1f'; [[90, 140], [860, 420], [420, 600], [120, 980], [840, 900]].forEach(([x, off]) => { const y = rise(t, 560, off), s = 22; g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + 5, y - 5); g.lineTo(x + s, y); g.lineTo(x + 5, y + 5); g.lineTo(x, y + s); g.lineTo(x - 5, y + 5); g.lineTo(x - s, y); g.lineTo(x - 5, y - 5); g.fill(); });
    g.strokeStyle = '#264653'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { const y = rise(t, 700, k * 240); g.beginPath(); g.moveTo(0, y); g.lineTo(150, y + 40); g.stroke(); }
    g.drawImage(once('mg', () => grainTile(17, .3, '#6a5238')), 0, 0); },
};
// ───────── 15 RED PAPER-CUT
const PR = '#d8261c', PCREAM = '#f7e9c9';
const papercut = {
  fps: 12,
  paint: { fps: 12, col(p) { const m = { eyew: PCREAM, coin2: PCREAM, cheek: PCREAM, glint: PCREAM, Rline: PCREAM, slot: PCREAM, gloss: '#f05a4a', shade: '#b81e15', toscain: '#f05a4a', pinkin: '#f05a4a', orangein: '#f05a4a', wattle: PCREAM }; return m[p.k] || (lum(p.c) < .25 && p.k !== 'pupil' ? '#a8160f' : PR); },
    lineCol: () => PCREAM, lw: 2.2, stroke: () => null,
    fill(g, poly, col, p) { if (['body', 'wing', 'tosca', 'pink', 'orange', 'leg', 'sole', 'comb', 'beak', 'ob'].includes(p.k)) { g.fillStyle = 'rgba(80,0,0,.28)'; polyPath(g, poly.map(([x, y]) => [x + 5, y + 8])); g.fill(); } g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = PCREAM; g.fillRect(0, 0, R, H); g.fillStyle = PR; g.beginPath(); g.arc(740, rise(t, 200, 360), 130, 0, 7); g.fill();
    g.fillStyle = PCREAM; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.2832; g.beginPath(); g.arc(740 + Math.cos(a) * 88, rise(t, 200, 360) + Math.sin(a) * 88, 9, 0, 7); g.fill(); }
    [[180, 0, 1.3], [790, 420, 1], [300, 780, 1.15]].forEach(([x, off, s]) => { const y = rise(t, 430, off + 200); g.fillStyle = 'rgba(90,0,0,.22)'; circles.forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s + 5, y + dy * s + 8, r * s, 0, 7); g.fill(); }); cloud(g, x, y, s, PR, null, 0); g.strokeStyle = PCREAM; g.lineWidth = 3; g.beginPath(); g.arc(x - 12 * s, y - 14 * s, 12 * s, 0, 5); g.stroke(); });
    g.strokeStyle = PR; g.lineWidth = 6; g.lineCap = 'round'; [[250, 0], [640, 260], [110, 560], [860, 720]].forEach(([x, off]) => { const y = rise(t, 950, off); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 90); g.stroke(); });
    g.drawImage(once('pg', () => grainTile(19, .22, '#7a5a2a')), 0, 0); },
};
// ───────── 16 UKIYO-E
const UK = ['#efe0bf', '#c8553d', '#264a73', '#d9a441', '#2b2b2b', '#6b8e6b', '#8c5e58', '#f6efdc'];
const ukiyo = {
  fps: 12,
  paint: { fps: 12, col: p => snap(mix(p.c, '#c9a46a', .15), UK), stroke: () => '#222222', lw: 1.9, all: true, fill(g, poly, col) { g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = '#ecdcb8'; g.fillRect(0, 0, R, H); const bk = g.createLinearGradient(0, 0, 0, 620); bk.addColorStop(0, '#27406b'); bk.addColorStop(1, 'rgba(39,64,107,0)'); g.fillStyle = bk; g.fillRect(0, 0, R, 620);
    g.fillStyle = '#c8402e'; g.beginPath(); g.arc(710, rise(t, 160, 300), 96, 0, 7); g.fill();
    [[0, 160], [1, 560], [2, 860]].forEach(([k, off]) => { const y = rise(t, 380 + k * 40, off); g.fillStyle = '#f6efdc'; g.strokeStyle = '#2b2b2b'; g.lineWidth = 3; g.beginPath(); g.moveTo(-10, y); for (let x = 0; x <= R + 10; x += 40) g.lineTo(x, y + Math.sin(x * .03 + k) * 16); g.lineTo(R + 10, y + 70); g.lineTo(-10, y + 70); g.closePath(); g.fill(); g.stroke(); });
    const wy = rise(t, 520, 760, 400) + 330; for (let row = 0; row < 7; row++) for (let x = -50 + (row % 2) * 40; x < R + 50; x += 80) { const y = wy + row * 36 - 150; if (y < 560) continue; for (let k = 0; k < 4; k++) { g.strokeStyle = k % 2 ? '#f6efdc' : '#264a73'; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 38 - k * 9, Math.PI, 0); g.stroke(); } }
    g.drawImage(once('ug', () => grainTile(23, .3, '#6a5238')), 0, 0); },
};
// ───────── 17 BRICK TOY (grid 96x108, tiap sel jadi satu balok dengan stud)
const BKC = once('bkc', () => new OffscreenCanvas(96, 108));
function bricks(g, c) { const id = ctx2(c).getImageData(0, 0, 96, 108), d = id.data; g.save();
  for (let y = 0; y < 108; y++) for (let x = 0; x < 96; x++) { const i = (y * 96 + x) * 4; if (!d[i + 3]) continue; const col = tohex([d[i], d[i + 1], d[i + 2]]), X = x * 10, Y = y * 10;
    g.fillStyle = col; g.fillRect(X, Y, 10, 10); g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(X, Y, 10, 2); g.fillRect(X, Y, 2, 10); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(X, Y + 8, 10, 2); g.fillRect(X + 8, Y, 2, 10);
    g.fillStyle = dark(col, .18); g.beginPath(); g.arc(X + 5, Y + 5.6, 3.2, 0, 7); g.fill(); g.fillStyle = light(col, .3); g.beginPath(); g.arc(X + 5, Y + 4.6, 3.2, 0, 7); g.fill(); } g.restore(); }
const brick = {
  fps: 12,
  full(g, { t, st, parts, obs }) {
    g.fillStyle = '#3d9be9'; g.fillRect(0, 0, R, H); g.fillStyle = 'rgba(0,0,0,.06)'; for (let y = mod(-t * 400, 120); y < H; y += 120) g.fillRect(0, y, R, 4);
    const bb = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x * 10, y * 10, w * 10, h * 10); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x * 10, (y + h) * 10 - 3, w * 10, 3); g.fillStyle = light(col, .35); for (let i = 0; i < w; i++) { g.beginPath(); g.arc((x + i) * 10 + 5, y * 10 - 1, 4, 0, 7); g.fill(); } };
    [[10, 0, 1], [70, 36, 1], [22, 72, 1]].forEach(([x, off, s]) => { const y = Math.round(mod(off - t * 40 + 12, 130) - 14); bb(x, y, 12, 3, '#ffffff'); bb(x + 2, y - 3, 8, 3, '#ffffff'); bb(x + 12, y + 1, 5, 2, '#e8f1fb'); });
    const c = ctx2(BKC); c.clearRect(0, 0, 96, 108); drawPixel(c, 96, 108, st.x / 10, st.y / 10, st.sc / 10, parts); obs.forEach(o => drawPixel(c, 96, 108, o.x / 10, o.y / 10, o.sc / 10, o.parts)); bricks(g, BKC); },
};
// ───────── 18 TILT-SHIFT
const TSA = once('tsa', () => mk()), TSB = once('tsb', () => mk());
const tilt = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, 1.2), stroke: (p, c) => dark(c, .5), sa: .7, lw: 1.3, all: true, fill(g, poly, col, p) { g.fillStyle = col; polyPath(g, poly); g.fill(); if (p.k === 'body' || p.k === 'ob') { const [x0, x1, y0, y1] = bbox(poly); g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(x0 + (x1 - x0) * .3, y0 + (y1 - y0) * .25, (x1 - x0) * .13, (y1 - y0) * .1, -.6, 0, 7); g.fill(); } } },
  bg(g, t) { const q = ctx2(TSA); q.fillStyle = '#86c765'; q.fillRect(0, 0, R, H); const CS = 190, oy = mod(t * 420, CS * 2);
    for (let r = -1; r < 8; r++) for (let cc = 0; cc < 6; cc++) { const row = r + Math.floor(t * 420 / (CS * 2)) * 0, x = cc * CS - 30, y = r * CS + oy - CS; const h = hash(cc, Math.round((y - oy + t * 420) / CS), 31);
      q.fillStyle = '#d8d2c4'; q.fillRect(x + CS - 38, y, 38, CS); q.fillRect(x, y + CS - 38, CS, 38);
      if (h > .25) { const hw = 70 + h * 40, hh = 60 + hash(cc, r, 8) * 40, col = ['#e8594f', '#f2b134', '#4f9bd9', '#b57edc'][Math.floor(h * 10) % 4]; q.fillStyle = 'rgba(0,0,0,.25)'; q.fillRect(x + 22, y + 34, hw, hh); q.fillStyle = '#f4efe3'; q.fillRect(x + 14, y + 20, hw, hh); q.fillStyle = col; q.fillRect(x + 14, y + 20, hw, hh * .45); }
      else { q.fillStyle = '#3f8f4a'; q.beginPath(); q.arc(x + 70, y + 70, 34, 0, 7); q.arc(x + 100, y + 90, 26, 0, 7); q.fill(); } }
    const b = ctx2(TSB); b.clearRect(0, 0, R, H); b.filter = 'blur(10px)'; b.drawImage(TSA, 0, 0); b.filter = 'none';
    const m = mk(), mg = ctx2(m); mg.drawImage(TSA, 0, 0); mg.globalCompositeOperation = 'destination-in'; const gr = mg.createLinearGradient(0, 250, 0, 850); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.3, 'rgba(0,0,0,1)'); gr.addColorStop(.7, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); mg.fillStyle = gr; mg.fillRect(0, 0, R, H);
    g.drawImage(TSB, 0, 0); g.drawImage(m, 0, 0); g.fillStyle = 'rgba(255,230,160,.06)'; g.fillRect(0, 0, R, H); },
  under(g, st) { g.save(); g.fillStyle = 'rgba(0,0,0,.28)'; g.filter = 'blur(8px)'; g.beginPath(); g.ellipse(st.x + 40, st.y + 200, 90 * st.sc * .8, 22, 0, 0, 7); g.fill(); g.restore(); },
};
// ───────── 19 LOW-POLY
const lowpoly = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => null,
    fill(g, poly, col, p) { const [cx, cy] = cen(poly), n = poly.length; for (let i = 0; i < n; i++) { const a = poly[i], b = poly[(i + 1) % n], mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy, l = (-mx * .6 - my * .8) / (Math.hypot(mx, my) + 1), j = (hash(i, p.k.length * 7 + Math.round(cx), 5) - .5) * .14, c2 = l > 0 ? light(col, clamp(l * .22 + j, 0, .5)) : dark(col, clamp(-l * .22 - j, 0, .5));
        g.fillStyle = g.strokeStyle = c2; g.lineWidth = .7; g.beginPath(); g.moveTo(cx, cy); g.lineTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.closePath(); g.fill(); g.stroke(); } } },
  bg(g, t) { g.drawImage(once('lp', () => { const c = mk(), q = ctx2(c), r = rng(33), cols = 9, rows = 11, cw = R / (cols - 1), ch = H / (rows - 1), V = [];
      for (let y = 0; y < rows; y++) { V[y] = []; for (let x = 0; x < cols; x++) V[y][x] = [x * cw + (x && x < cols - 1 ? (r() - .5) * cw * .7 : 0), y * ch + (y && y < rows - 1 ? (r() - .5) * ch * .7 : 0)]; }
      for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) { const a = V[y][x], b = V[y][x + 1], c2 = V[y + 1][x], d = V[y + 1][x + 1]; [[a, b, c2], [b, d, c2]].forEach((tri, k) => { const yy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3 / H; q.fillStyle = mix(mix('#3a8dde', '#bfe6ff', yy), '#ffffff', (r() - .5) * .16 + .08); q.strokeStyle = q.fillStyle; q.lineWidth = .8; q.beginPath(); tri.forEach(([px, py], i) => i ? q.lineTo(px, py) : q.moveTo(px, py)); q.closePath(); q.fill(); q.stroke(); }); } return c; }), 0, 0);
    [[0, 160], [1, 560], [2, 860]].forEach(([k, off]) => { const y = rise(t, 420 + k * 40, off, H + 320); for (let i = 0; i < 6; i++) { const x = 120 + (k * 280 + i * 110) % 800, w = 150 + hash(i, k, 4) * 80; g.fillStyle = `rgba(255,255,255,${.35 + i % 3 * .12})`; g.beginPath(); g.moveTo(x - w / 2, y + 40); g.lineTo(x - w / 4, y); g.lineTo(x + w / 5, y + 6); g.lineTo(x + w / 2, y + 40); g.closePath(); g.fill(); } }); },
};
// ───────── 20 PAPER POP-UP
const popup = {
  fps: 12,
  paint: { fps: 12, col: p => p.c, stroke: () => null,
    fill(g, poly, col, p) { g.fillStyle = 'rgba(40,25,10,.25)'; polyPath(g, poly.map(([x, y]) => [x + 5, y + 9])); g.fill(); g.strokeStyle = '#fffdf6'; g.lineWidth = 6; polyPath(g, poly); g.stroke(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = '#f3ead6'; g.fillRect(0, 0, R, H); g.fillStyle = '#8ecae6'; g.fillRect(40, 0, R - 80, H);
    const sh = (fn) => { g.save(); g.fillStyle = 'rgba(40,25,10,.28)'; g.translate(5, 8); fn(); g.restore(); fn(); };
    [[170, 0, 1.3], [780, 420, 1], [300, 780, 1.15]].forEach(([x, off, s]) => { const y = rise(t, 450, off + 200); g.save(); g.fillStyle = 'rgba(40,25,10,.25)'; circles.forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s + 5, y + dy * s + 9, r * s, 0, 7); g.fill(); }); g.restore(); cloud(g, x, y, s, '#fffdf6', null, 0); });
    const cg = g.createLinearGradient(R / 2 - 60, 0, R / 2 + 60, 0); cg.addColorStop(0, 'rgba(0,0,0,0)'); cg.addColorStop(.5, 'rgba(0,0,0,.18)'); cg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = cg; g.fillRect(R / 2 - 60, 0, 120, H);
    g.fillStyle = '#fffdf6'; g.fillRect(0, 0, 40, H); g.fillRect(R - 40, 0, 40, H); g.fillStyle = 'rgba(40,25,10,.2)'; g.fillRect(40, 0, 8, H); g.fillRect(R - 48, 0, 8, H);
    [[0, 0], [1, 500]].forEach(([k, off]) => { const y = rise(t, 380, off, H + 300); sh(() => { g.fillStyle = k ? '#52b788' : '#74c69d'; g.beginPath(); g.moveTo(40, y + 120); g.quadraticCurveTo(R / 2, y - 40, R - 40, y + 120); g.lineTo(R - 40, y + 220); g.lineTo(40, y + 220); g.fill(); }); });
    g.drawImage(once('pug', () => grainTile(29, .25, '#8a7a5a')), 0, 0); },
};

export const STY = [whiteboard, crayon, wc, ink, riso, woodcut, swiss, deco, blueprint, glass, pixel, hose, anime, midc, papercut, ukiyo, brick, tilt, lowpoly, popup];
// style yang memakai pelukis umum diberi draw bawaan
STY.forEach(S => { if (!S.draw && !S.full && S.paint) Object.assign(S, std(S)); });
// dipakai paket style tambahan (styles2/3/4.js)
export { mod, clamp, hx, tohex, mix, dark, light, lum, snap, sat, cen, bbox, rise, ctx2, circles, cloud, blob, grainTile, once, OB, LN, paint, std, sil };
