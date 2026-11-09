// 20 Style Video Motion · Minyam terjun bebas. Satu frame untuk persetujuan.
// Query: ?n=11 (nomor style yang sedang disebut). Semua digambar di satu canvas 1920x1080.
const q = new URLSearchParams(location.search);
const NOW = +(q.get('n') || 11);
const W = 1920, H = 1080;

export const STYLES = [
  'Whiteboard Explainer', 'Crayon Picture Book', 'Watercolor Brush', 'Chinese Ink Wash', 'Risograph Print',
  'Woodcut Print', 'Swiss Motion Graphics', 'Art Deco', 'Blueprint', 'Stained Glass',
  'Pixel RPG 16-bit', 'Rubber Hose Cartoon', '80s Cel Anime', 'Mid-century Cartoon', 'Red Paper-cut',
  'Ukiyo-e', 'Brick Toy', 'Tilt-Shift Miniature', 'Low-poly Island', 'Paper Pop-up Book',
];
const INK = '#101713', MATCHA9 = '#538248', MATCHA5 = '#86B77A';

await document.fonts.load('600 32px Inter'); await document.fonts.load('700 28px Inter');
const cv = document.getElementById('c'), ctx = cv.getContext('2d');

// ───────── logo primer resmi (path dari artosku_logo_primer.svg, tidak diubah)
const P_LEFT = new Path2D('M452 77 H769 C781 77 789 88 786 100 L613 590 C611 598 606 602 598 602 H288 C278 602 270 593 273 582 L438 89 C440 82 445 77 452 77 Z');
const P_RIGHT = new Path2D('M807 140 C813 139 818 143 821 149 L1039 581 C1044 591 1037 602 1027 602 H747 L679 487 L796 154 C798 146 802 141 807 140 Z');
function logoPrimer(x, y, h) {                   // x,y = pojok kiri-atas logomark; h = tinggi logomark (H)
  const s = h / 525;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-272.361387, -77);
  ctx.fillStyle = MATCHA9; ctx.fill(P_LEFT); ctx.fillStyle = MATCHA5; ctx.fill(P_RIGHT);
  ctx.fillStyle = INK; ctx.font = '600 304.5px Inter'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.letterSpacing = '-6.09px'; ctx.fillText('Artosku', 1139.1, 339.5);
  ctx.restore();
}

// ───────── panel kiri: daftar 1–20 (kolom 1–10 dan 11–20)
const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
function panel() {
  ctx.fillStyle = '#fbfaf6'; ctx.fillRect(0, 0, 960, H);
  logoPrimer(72, 62, 64);                          // H = 64 px, clear space ≥ H/8
  ctx.fillStyle = INK; ctx.font = '600 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
  ctx.fillText('20 Style Video Motion', 72, 206);
  const colX = [72, 508], y0 = 252, rowH = 74;
  for (let i = 0; i < 20; i++) {
    const n = i + 1, col = i < 10 ? 0 : 1, row = i % 10, x = colX[col], y = y0 + row * rowH;
    const shown = n <= NOW, active = n === NOW;
    if (active) { ctx.fillStyle = '#e6f1e1'; rr(x - 14, y - 6, 424, 64, 18); ctx.fill(); ctx.fillStyle = MATCHA9; rr(x - 14, y - 6, 8, 64, 4); ctx.fill(); }
    // lencana nomor
    rr(x, y, 52, 52, 14);
    if (shown) { ctx.fillStyle = active ? MATCHA9 : MATCHA5; ctx.fill(); } else { ctx.strokeStyle = '#d9ddd2'; ctx.lineWidth = 2.5; ctx.stroke(); }
    ctx.font = '700 27px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = shown ? '#ffffff' : '#b3b8ab';
    ctx.fillText(String(n), x + 26, y + 27.5);
    ctx.textAlign = 'left';
    if (shown) { ctx.font = `${active ? 700 : 600} 31px Inter`; ctx.fillStyle = INK; ctx.fillText(STYLES[i], x + 72, y + 27.5); }
    else { ctx.fillStyle = '#ecefe7'; rr(x + 72, y + 22, 250, 8, 4); ctx.fill(); }
  }
}

// ───────── adegan kanan: gaya Pixel RPG 16-bit (piksel 4x4; warna Minyam dikunci ke palet aslinya)
const PX = 4, LW = 240, LH = 270, S = 0.75;                 // koordinat desain 320x360 -> grid 240x270
const MPAL = ['#FFF3D8', '#F0D9AE', '#D9BF93', '#FFE7B8', '#E8CF9C', '#F6C431', '#D99A12', '#B97C0B', '#EE3B45', '#FF6F78', '#E8353F',
  '#FFB62D', '#E0951A', '#F3A21F', '#C97E0A', '#FF9AA6', '#2A1D14', '#FFFFFF', '#8A6A3E', '#7CC8FF',
  '#16B3A4', '#3FD9C8', '#E33D80', '#FF7AA8', '#FF8A2B', '#FFC15E'].map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
function pixelScene() {
  const lo = new OffscreenCanvas(LW, LH), g = lo.getContext('2d');
  const fr = (x, y, w, h) => g.fillRect(Math.round(x * S), Math.round(y * S), Math.max(1, Math.round(w * S)), Math.max(1, Math.round(h * S)));
  const bands = ['#4aa8f0', '#5bb4f4', '#74c3f8', '#8fd0fb', '#aadcfd', '#c6e8fe'];
  bands.forEach((c, i) => { g.fillStyle = c; fr(0, Math.floor(i * LH / S * 0.9 / bands.length), 320, Math.ceil(LH / S * 0.9 / bands.length) + 2); });
  g.fillStyle = bands[5]; fr(0, 324, 320, 40);
  const cloud = (x, y, w) => { g.fillStyle = '#e8f6ff'; fr(x + 6, y, w - 12, 6); fr(x, y + 6, w, 8); fr(x + 10, y - 6, w - 30, 6); g.fillStyle = '#bfe0f7'; fr(x, y + 12, w, 3); g.fillStyle = '#ffffff'; fr(x + 12, y - 6, 12, 3); };
  cloud(236, 70, 62); cloud(18, 150, 48); cloud(250, 205, 50); cloud(6, 262, 66); cloud(222, 296, 70);
  const pl = (x, y) => { g.fillStyle = '#d9dde3'; fr(x, y + 4, 54, 10); fr(x + 54, y + 6, 8, 6); g.fillStyle = '#e03a3e'; fr(x + 6, y + 8, 40, 3); g.fillStyle = '#8fa0b4'; fr(x + 14, y + 14, 26, 4); g.fillStyle = '#b9c2cf'; fr(x - 10, y - 4, 10, 10); fr(x - 6, y + 2, 8, 4); g.fillStyle = '#4aa8f0'; fr(x + 40, y + 6, 8, 4); g.fillStyle = '#ffffff'; for (let i = 0; i < 3; i++) fr(x - 28 - i * 14, y + 8, 8, 2); };
  pl(58, 24);
  const gr = ['#5db85a', '#7ed36b', '#4aa14f', '#c9a36b', '#6fc0ff', '#8ddb78'];
  for (let yy = 336; yy < 364; yy += 8) for (let xx = 0; xx < 320; xx += 8) { const k = (xx * 7 + yy * 13) % gr.length; g.fillStyle = gr[((xx / 8 + yy / 8 + k) | 0) % gr.length]; fr(xx, yy, 8, 8); }
  g.fillStyle = '#2f6d3a'; fr(0, 334, 320, 2);
  g.fillStyle = '#ffffff';
  [[44, 120, 28], [64, 190, 36], [250, 100, 34], [276, 176, 26], [34, 250, 30], [286, 262, 36], [96, 70, 22], [226, 60, 20]].forEach(([x, y, l]) => fr(x, y, 3, l));
  g.fillStyle = '#d7efff'; [[56, 160, 20], [262, 140, 24], [72, 280, 18], [244, 240, 22]].forEach(([x, y, l]) => fr(x, y, 3, l));
  drawPixel(g, LW, LH, 120, 180, 0.36);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(lo, 960, 0, LW * PX, LH * PX); ctx.restore();
}


// ───────── alat bersama untuk style lain
const R = 960;                                      // lebar panel kanan
const hash = (x, y, sd) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(sd, 1274126177) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
const sm = t => t * t * (3 - 2 * t);
function noise(x, y, sd = 0) { const ix = Math.floor(x), iy = Math.floor(y), fx = sm(x - ix), fy = sm(y - iy);
  const a = hash(ix, iy, sd), b = hash(ix + 1, iy, sd), c = hash(ix, iy + 1, sd), d = hash(ix + 1, iy + 1, sd);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; }
const mk = () => new OffscreenCanvas(R, H);
function warp(src, amp, sc, sd) {
  const o = mk(), a = src.getContext('2d').getImageData(0, 0, R, H), b = o.getContext('2d').createImageData(R, H);
  const s32 = new Uint32Array(a.data.buffer), d32 = new Uint32Array(b.data.buffer);
  for (let y = 0; y < H; y++) for (let x = 0; x < R; x++) {
    const sx = Math.min(R - 1, Math.max(0, Math.round(x + (noise(x / sc, y / sc, sd) - .5) * 2 * amp)));
    const sy = Math.min(H - 1, Math.max(0, Math.round(y + (noise(x / sc + 50, y / sc + 50, sd + 1) - .5) * 2 * amp)));
    d32[y * R + x] = s32[sy * R + sx];
  }
  o.getContext('2d').putImageData(b, 0, 0); return o;
}
function silhouette(src, color) { const o = mk(), g = o.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, R, H); return o; }
function chickenLayer(sc = 1.45) { const o = mk(), g = o.getContext('2d');
  Minyam.draw(g, { x: 480, y: 690, scale: sc, t: 1.3, shadow: false, pose: { view: 'front', mood: 'happy', eyes: 'shock', beak: 0.75, flap: 1, tilt: 0.1, lookY: 0.2, sweat: 1 } }); return o; }
const rng = sd => () => (sd = Math.imul(sd ^ (sd >>> 15), 2246822507) + 1013904223 | 0, ((sd ^ (sd >>> 13)) >>> 0) / 4294967295);

// ───────── CRAYON: ayam ditulis ulang jadi gambar krayon (garis goyang, isi berbutir, kertas terlihat)
function crayonStroke(g, pts, color, w, r, passes = 3) { g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = color;
  for (let p = 0; p < passes; p++) { g.globalAlpha = .55; g.lineWidth = w * (.7 + r() * .5); g.beginPath();
    pts.forEach(([x, y], i) => { const jx = x + (r() - .5) * 5, jy = y + (r() - .5) * 5; i ? g.lineTo(jx, jy) : g.moveTo(jx, jy); }); g.stroke(); } g.globalAlpha = 1; }
function crayonScene() {
  const bg = mk(), g = bg.getContext('2d'), r = rng(7);
  g.fillStyle = '#fff4dc'; g.fillRect(0, 0, R, H);
  for (let y = -20; y < 900; y += 17) crayonStroke(g, [[-20, y + 40], [R / 3, y + 18], [R * 2 / 3, y + 34], [R + 20, y]], y < 500 ? '#79c4ef' : '#a6dcf5', 26, r, 2);
  crayonStroke(g, Array.from({ length: 40 }, (_, i) => [820 + Math.cos(i / 4) * (8 + i * 1.6), 150 + Math.sin(i / 4) * (8 + i * 1.6)]), '#f7c531', 14, r, 2);
  const cloud = (x, y, k) => { crayonStroke(g, Array.from({ length: 30 }, (_, i) => [x + Math.cos(i / 3) * (10 + i * 2) * k, y + Math.sin(i / 3) * (6 + i * 1.3) * k]), '#ffffff', 16, r, 3); };
  cloud(150, 330, 1.1); cloud(760, 520, .9); cloud(110, 760, 1);
  for (let y = 880; y < 1090; y += 16) crayonStroke(g, [[-20, y], [200, y - 26], [480, y + 6], [760, y - 30], [R + 20, y - 4]], y % 32 ? '#58b04c' : '#7bc866', 24, r, 2);
  crayonStroke(g, [[560, 905], [560, 850], [610, 815], [660, 850], [660, 905], [560, 905]], '#e0554a', 9, r, 2);
  crayonStroke(g, [[110, 120], [250, 112], [292, 132], [250, 146], [110, 146], [110, 120]], '#d8dde6', 18, r, 3);
  crayonStroke(g, [[110, 118], [88, 84], [124, 118]], '#e0554a', 12, r, 2);
  crayonStroke(g, [[170, 146], [210, 190], [226, 146]], '#8fa0b4', 12, r, 2);
  [[250, 460, 120], [700, 330, 140], [120, 600, 110], [820, 700, 120]].forEach(([x, y, l]) => crayonStroke(g, [[x, y], [x + 4, y + l]], '#ffffff', 8, r, 2));
  const id = g.getImageData(0, 0, R, H), d = id.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < R; x++) { const i = (y * R + x) * 4, n = noise(x * .7, y * .7, 3), m = noise(x * .06, y * 1.1, 4);
    const k = n > .78 ? 1.18 : (.93 + .1 * m - .08 * n); d[i] = Math.min(255, d[i] * k + (n > .78 ? 14 : 0)); d[i + 1] = Math.min(255, d[i + 1] * k + (n > .78 ? 14 : 0)); d[i + 2] = Math.min(255, d[i + 2] * k + (n > .78 ? 10 : 0)); }
  g.putImageData(id, 0, 0);
  const cl = mk(); drawCrayon(cl.getContext('2d'), 480, 690, 1.45, 5);
  const cg = cl.getContext('2d'), cd = cg.getImageData(0, 0, R, H), q = cd.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < R; x++) { const i = (y * R + x) * 4; if (!q[i + 3]) continue;
    const n = noise(x * .9, y * .9, 7), k = .88 + .12 * n; q[i] *= k; q[i + 1] *= k; q[i + 2] *= k; if (noise(x * .5, y * .5, 11) > .9) q[i + 3] *= .35; }
  cg.putImageData(cd, 0, 0); g.drawImage(cl, 0, 0);
  return bg;
}

// ───────── INK WASH: ayam jadi lukisan tinta (nada abu, tepi lembut, hanya jengger/paruh merah cinnabar)
function inkScene() {
  const bg = mk(), g = bg.getContext('2d');
  g.fillStyle = '#efe9d8'; g.fillRect(0, 0, R, H);
  const wash = (x, y, rx, ry, a, blur) => { g.save(); g.filter = `blur(${blur}px)`; g.fillStyle = `rgba(40,42,40,${a})`; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.restore(); };
  wash(200, 330, 260, 90, .10, 30); wash(780, 560, 220, 70, .10, 28); wash(160, 790, 250, 80, .12, 30);
  const mount = (pts, a, blur) => { g.save(); g.filter = `blur(${blur}px)`; g.fillStyle = `rgba(35,38,36,${a})`; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.restore(); };
  mount([[-40, 1100], [-40, 900], [120, 810], [260, 900], [380, 760], [520, 920], [700, 830], [860, 930], [1000, 880], [1000, 1100]], .22, 6);
  mount([[-40, 1100], [-40, 980], [180, 940], [360, 1010], [560, 950], [780, 1020], [1000, 960], [1000, 1100]], .5, 3);
  g.save(); g.filter = 'blur(28px)'; const mg = g.createLinearGradient(0, 860, 0, 1000); mg.addColorStop(0, 'rgba(239,233,216,0)'); mg.addColorStop(.5, 'rgba(239,233,216,.95)'); mg.addColorStop(1, 'rgba(239,233,216,0)'); g.fillStyle = mg; g.fillRect(0, 820, R, 200); g.restore();
  g.save(); g.filter = 'blur(1.5px)'; g.fillStyle = 'rgba(30,30,30,.82)'; g.beginPath(); g.moveTo(100, 126); g.quadraticCurveTo(190, 104, 292, 128); g.quadraticCurveTo(200, 150, 100, 146); g.fill();
  g.beginPath(); g.moveTo(100, 122); g.lineTo(84, 88); g.lineTo(130, 122); g.fill(); g.beginPath(); g.moveTo(170, 140); g.lineTo(212, 190); g.lineTo(228, 140); g.fill(); g.restore();
  [[270, 430, 150], [700, 300, 170], [110, 620, 130], [840, 690, 140]].forEach(([x, y, l]) => { g.save(); g.filter = 'blur(2px)'; const lg = g.createLinearGradient(0, y, 0, y + l); lg.addColorStop(0, 'rgba(40,40,40,0)'); lg.addColorStop(.5, 'rgba(40,40,40,.4)'); lg.addColorStop(1, 'rgba(40,40,40,0)'); g.fillStyle = lg; g.fillRect(x, y, 7, l); g.restore(); });
  g.fillStyle = '#c8372d'; g.fillRect(830, 960, 64, 64); g.fillStyle = '#efe9d8'; g.fillRect(842, 972, 18, 40); g.fillRect(866, 972, 16, 16); g.fillRect(866, 996, 16, 16);
  const cl = mk(); drawInk(cl.getContext('2d'), 480, 690, 1.45, 5);
  g.save(); g.filter = 'blur(5px)'; g.globalAlpha = .35; g.drawImage(silhouette(cl, '#1c1c1c'), 0, 0); g.restore(); g.drawImage(cl, 0, 0);
  return bg;
}


// ───────── Minyam digambar ulang per style. Geometri = angka anatomi tampak depan (ATURAN_MINYAM.md bagian 3),
// diubah jadi poligon; tiap style punya "kuas" sendiri untuk mengisi dan menggaris bagian-bagian itu.
const ell = (cx, cy, rx, ry, rt = 0, n = 40) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry, c = Math.cos(rt), s = Math.sin(rt); return [cx + x * c - y * s, cy + x * s + y * c]; });
const rotp = (pts, a, ox, oy) => pts.map(([x, y]) => { const dx = x - ox, dy = y - oy, c = Math.cos(a), s = Math.sin(a); return [ox + dx * c - dy * s, oy + dx * s + dy * c]; });
const cub = (p0, p1, p2, p3, n = 14) => Array.from({ length: n }, (_, i) => { const t = i / n, u = 1 - t; return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]); });
const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function minyamParts(wa = 0) {
  const P = [], add = (k, poly, c, o = {}) => P.push({ k, poly, c, ...o });
  [['tosca', -34, '#16B3A4', '#3FD9C8', 22, 62, -62, 10, 40, -70], ['pink', 34, '#E33D80', '#FF7AA8', 22, 62, -62, 10, 40, -70], ['orange', 0, '#FF8A2B', '#FFC15E', 24, 72, -72, 11, 46, -80]]
    .forEach(([k, a, c, ci, rx, ry, cy, rx2, ry2, cy2]) => { const A = a * Math.PI / 180; add(k, rotp(ell(0, -96 + cy - 8, rx, ry), A, 0, -96), c); add(k + 'in', rotp(ell(0, -96 + cy2 - 8, rx2, ry2), A, 0, -96), ci, { o: false }); });
  add('leg', rect(-30, -34, 11, 30), '#F3A21F'); add('leg', rect(19, -34, 11, 30), '#F3A21F');
  add('sole', ell(-24, -4, 24, 9), '#F5A623'); add('sole', ell(24, -4, 24, 9), '#F5A623');
  const right = [...cub([0, -176], [50, -176], [86, -136], [86, -88]), ...cub([86, -88], [86, -48], [48, -14], [0, -14])];
  const left = [...cub([0, -14], [-48, -14], [-86, -48], [-86, -88]), ...cub([-86, -88], [-86, -136], [-50, -176], [0, -176])];
  const body = [...right, ...left]; add('body', body, '#FFF3D8');
  const edge = right.filter(([x]) => x > 30); add('shade', [...edge, ...edge.slice().reverse().map(([x, y]) => [x * 0.84 - 4, y])], '#F0D9AE', { o: false });
  add('coin', ell(0, -40, 22, 22), '#D99A12'); add('coin2', ell(0, -40, 17, 17), '#F6C431', { o: false });
  P.push({ k: 'Rline', line: true, c: '#B97C0B', poly: [[-6, -30], [-6, -50], [3, -50], [8, -46], [3, -41], [-6, -41]] }); P.push({ k: 'Rline', line: true, c: '#B97C0B', poly: [[0, -41], [8, -30]] });
  [1, -1].forEach(s => { const px = s * 80, py = -92; add('wing', rotp(ell(px + s * 6, py + 14, 20, 38), s > 0 ? -2.0 + wa : 2.0 - wa, px, py), '#FFE7B8'); });
  add('slot', rotp(rect(-52, -163, 24, 6), -0.56, -40, -160), '#8A6A3E', { o: false });
  add('comb', ell(-14, -176, 15, 15), '#EE3B45', { o: false }); add('comb', ell(20, -178, 14, 14), '#EE3B45', { o: false }); add('comb', ell(2, -188, 19, 19), '#EE3B45', { o: false }); add('gloss', ell(2, -190, 9, 9), '#FF6F78', { o: false });
  [-1, 1].forEach(s => { add('eyew', ell(s * 28, -122, 15, 17), '#FFFFFF', { oc: '#8a6a3e' }); add('pupil', ell(s * 28, -120, 6.5, 8), '#2A1D14', { o: false }); add('glint', ell(s * 28 + 3, -125, 3, 3), '#FFFFFF', { o: false }); add('cheek', ell(s * 52, -96, 13, 8.5), '#FF9AA6', { o: false }); });
  add('wattle', ell(0, -66, 7, 11), '#E8353F'); add('beak', [[-17, -104], [-9, -103], [9, -103], [17, -104], [10, -90], [0, -77], [-10, -90]], '#FFB62D', { oc: '#E0951A' });
  add('sweat', ell(60, -146, 5, 7), '#7CC8FF', { oc: '#4aa0d8' });
  return P;
}
function polyPath(g, poly, close = true) { g.beginPath(); poly.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); }

// ── kuas CRAYON: isi diarsir dua arah, garis tepi goyang dua lapis, bentuk dibuat sedikit lebih polos
function drawCrayon(g, ox, oy, sc, seed, parts = minyamParts()) {
  const r = rng(seed); g.save(); g.setTransform(sc, 0, 0, sc, ox, oy); g.lineCap = 'round'; g.lineJoin = 'round';
  const wob = (poly, a) => poly.map(([x, y]) => [x + (r() - .5) * a, y + (r() - .5) * a]);
  for (const p of parts) {
    if (p.line) { for (let k = 0; k < 2; k++) { g.globalAlpha = .8; g.strokeStyle = p.c; g.lineWidth = 2.4; polyPath(g, wob(p.poly, 1.4), false); g.stroke(); } g.globalAlpha = 1; continue; }
    const small = p.k === 'pupil' || p.k === 'glint', poly = wob(p.poly, small ? .8 : 2.6);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; poly.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, Rr = Math.hypot(x1 - x0, y1 - y0) / 2 + 2, sp = small ? 1.5 : 3.0;
    g.save(); polyPath(g, poly); g.clip();
    [[.55, .85], [-.4, .55]].forEach(([ang, al]) => { g.save(); g.translate(cx, cy); g.rotate(ang); g.strokeStyle = p.c; g.globalAlpha = al; g.lineWidth = sp * 1.25;
      for (let y = -Rr; y <= Rr; y += sp) { g.beginPath(); g.moveTo(-Rr, y + (r() - .5) * 1.2); g.quadraticCurveTo(0, y + (r() - .5) * 2.4, Rr, y + (r() - .5) * 1.2); g.stroke(); } g.restore(); });
    g.restore();
    if (p.o !== false) for (let k = 0; k < 2; k++) { g.globalAlpha = .85; g.strokeStyle = p.oc || '#6b3f1a'; g.lineWidth = 1.8; polyPath(g, wob(p.poly, 2.2)); g.stroke(); }
    g.globalAlpha = 1;
  }
  g.restore();
}

// ── kuas INK WASH: isi cuci abu (tepi lembut), garis kuas tebal-tipis dan putus-putus, hanya jengger/pial/paruh merah cinnabar
function drawInk(g, ox, oy, sc, seed, parts = minyamParts()) {
  g.save(); g.setTransform(sc, 0, 0, sc, ox, oy); g.lineCap = 'round'; g.lineJoin = 'round';
  const RED = '#c8372d';
  const TONE = { tosca: '#8f8d86', pink: '#c3c0b6', orange: '#5b5b58', toscain: '#b4b1a8', pinkin: '#dedad0', orangein: '#8a8985', leg: '#7a7975', sole: '#9a988f', body: '#ebe7da', shade: '#c4c0b2', coin: '#8d8a80', coin2: '#c8c4b8', wing: '#d6d2c4', slot: '#2a2a28', eyew: '#f4f1e6', pupil: '#141414', glint: '#f4f1e6', cheek: '#b9b6ab', sweat: '#c6ccd0' };
  const skip = ['comb', 'gloss', 'shade', 'cheek', 'glint', 'pupil', 'toscain', 'pinkin', 'orangein', 'sweat', 'coin2', 'leg'];
  for (const p of parts) {
    if (p.line) { g.globalAlpha = 1; g.strokeStyle = '#171717'; g.lineWidth = 2.2; polyPath(g, p.poly, false); g.stroke(); continue; }
    const red = ['comb', 'wattle', 'beak', 'gloss'].includes(p.k);
    g.save(); g.filter = 'blur(1.2px)'; g.fillStyle = red ? (p.k === 'gloss' ? '#e0675c' : RED) : (TONE[p.k] || (() => { const q = [1, 3, 5].map(i => parseInt(p.c.slice(i, i + 2), 16)), l = .3 * q[0] + .59 * q[1] + .11 * q[2]; return l > 200 ? '#e2dfd2' : l > 140 ? '#bdbab0' : l > 90 ? '#8f8d86' : '#4a4a47'; })()); g.globalAlpha = p.k === 'cheek' ? .5 : p.k === 'gloss' ? .6 : .96; polyPath(g, p.poly); g.fill(); g.restore();
    if (skip.includes(p.k)) continue;
    const pts = p.poly, n = pts.length;
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; if (p.k === 'body' && noise(i * .22, 3, 9) > .82) continue;
      g.strokeStyle = '#171717'; g.globalAlpha = .88; g.lineWidth = 1.0 + 2.6 * noise(i * .35 + seed, p.k.length, 5); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  }
  g.restore();
}

// ── kuas PIXEL: tiap bagian jadi blok warna datar tanpa anti-alias, garis tepi 1 piksel, detail kecil (R, mata) dari kotak
function drawPixel(c, W, Hh, ox, oy, sc, parts = minyamParts()) {
  const t = new OffscreenCanvas(W, Hh), tg = t.getContext('2d', { willReadFrequently: true }), DARK = '#4a2f1b';
  const put = (poly, color, { fill = true, lw = 0 } = {}) => {
    tg.clearRect(0, 0, W, Hh); tg.fillStyle = tg.strokeStyle = '#000'; tg.lineWidth = lw; tg.lineJoin = 'round';
    tg.beginPath(); poly.forEach(([x, y], i) => { const X = ox + x * sc, Y = oy + y * sc; i ? tg.lineTo(X, Y) : tg.moveTo(X, Y); }); tg.closePath();
    if (fill) tg.fill(); if (lw) tg.stroke();
    const id = tg.getImageData(0, 0, W, Hh), d = id.data, rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] >= 110) { d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255; } else d[i + 3] = 0; }
    tg.putImageData(id, 0, 0); c.drawImage(t, 0, 0);
  };
  const sil = ['tosca', 'pink', 'orange', 'leg', 'sole', 'body', 'wing', 'comb', 'beak', 'wattle'];
  parts.filter(p => sil.includes(p.k) || p.sil).forEach(p => put(p.poly, DARK, { lw: 2.2 }));
  for (const p of parts) {
    if (p.line) { put(p.poly, p.c, { fill: false, lw: 1.3 }); continue; }
    put(p.poly, p.c);
    if (['wing', 'tosca', 'pink', 'orange', 'body'].includes(p.k) || p.sil) put(p.poly, DARK, { fill: false, lw: 1.1 });
  }
}

const SCENES = { 2: crayonScene, 4: inkScene };
function render() {
  panel();
  if (SCENES[NOW]) ctx.drawImage(SCENES[NOW](), 960, 0); else pixelScene();
}
if (!window.FILM) { window.DUR = 3; window.render = render; render(); window.READY = true; }
export { crayonStroke, ctx, cv, W, H, R, INK, MATCHA9, MATCHA5, logoPrimer, rr, mk, noise, hash, rng, ell, rotp, rect, cub, minyamParts, polyPath, drawCrayon, drawInk, drawPixel, silhouette, warp };
