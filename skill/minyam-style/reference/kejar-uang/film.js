// Minyam Kejar Uang Kabur. 1080x1920, 39 detik, 160 BPM (1 bar = 1,5 detik).
import { clamp, lerp, seg, ss, eo, ei, eio, back, hash, TAU } from '/core/lib.js';
import { makePost } from '/core/post/crt.js';
import { W, H, GY, sc, glc, tmp, mkc, X, G, T, q12, INK, MATCHA9, MATCHA5, NEON, buildPlates, city, ground, hero, monster, mon, split, bigMon, bill, wallet, crate, awning, slab, slash, radial, lines, sparks, coin, star, dust, chrome, logoPrimer, logoW, PL } from './art.js';

const PI = Math.PI, Q = new URLSearchParams(location.search), RAW = Q.get('raw') === '1';
const out = document.getElementById('c'); out.width = W; out.height = H;
await document.fonts.load('italic 900 80px Kanit'); await document.fonts.load('600 32px Inter'); await document.fonts.load('800 32px Inter'); await document.fonts.load('900 32px Inter');
buildPlates();
const post = RAW ? null : makePost(out), octx = RAW ? out.getContext('2d') : null;
const snapC = mkc(W, H), snapG = mkc(W, H);
const CY = '#8fe4ff';

const each = fn => { fn(X); fn(G); };
const zoom = (z, cx, cy) => each(c => { c.translate(cx, cy); c.scale(z, z); c.translate(-cx, -cy); });
const BM = (x, y, s, o) => { bigMon(X, x, y, s, o); bigMon(G, x, y, s, o); };
const fillAll = (col, a = 1, c = X) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); };
function impact() {             // impact frame: siluet monokrom terbalik
  T.setTransform(1, 0, 0, 1, 0, 0); T.clearRect(0, 0, W, H); T.filter = 'grayscale(1) contrast(5) invert(1)'; T.drawImage(sc, 0, 0); T.filter = 'none';
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(tmp, 0, 0); X.restore(); fillAll('#fff', .22, G);
}
const darkBg = (a = '#0a0418', b = '#3a1458') => { const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); X.fillStyle = g; X.fillRect(-60, -60, W + 120, H + 120); };
const label = (txt, x, y, size, col = '#fff', k = 1) => { if (k <= 0) return; X.save(); X.globalAlpha = k; X.font = `900 ${size}px Inter`; X.textAlign = 'center'; X.textBaseline = 'alphabetic'; X.lineJoin = 'round'; X.strokeStyle = '#1a0b33'; X.lineWidth = size * .28; X.strokeText(txt, x, y); X.fillStyle = col; X.fillText(txt, x, y); X.restore(); };
const flap = (t, i) => Math.sin(q12(t) * 26 + i * 2);
function flock(t, cx, cy, n, sx, sy, s, seed = 0) {
  for (let i = 0; i < n; i++) bill(cx + (hash(seed + i * 2.3) - .5) * sx + Math.sin(t * 5 + i) * 16, cy + (hash(seed + i * 4.9) - .5) * sy + Math.sin(t * 7 + i * 1.7) * 14, s * (.7 + hash(seed + i) * .6), { rot: Math.sin(t * 6 + i) * .22, flap: flap(t, i) });
}
function stream(t, mx, my, n, pw = 1) {       // uang tersedot berputar ke mulut
  for (let i = 0; i < n; i++) { const p = (t * (.9 + hash(i * 1.3) * .5) * pw + hash(i * 7.7)) % 1, a = PI * (.12 + hash(i * 3.1) * .76) + (1 - p) * 1.6 * (i % 2 ? 1 : -1), r = 1500 * Math.pow(1 - p, 1.4) + 20; bill(mx + Math.cos(a) * r, my + Math.sin(a) * r, .3 + (1 - p) * 1.1, { rot: a + PI / 2, flap: flap(t, i) }); }
}
const LOSS = ['50RB', '35RB', '120RB', '20RB', '75RB', '250RB'];
function snatch(t, ti, i, fx, fy, drift = 520) {   // monster melompat menyambar uang
  const v = t - ti, mx = fx + (i % 3 - 1) * 95 - v * drift, my = fy + ((i * 37) % 5 - 2) * 40 + 2500 * v * v;
  if (v < -.5 || v > .62 || my > GY + 260) return;
  mon(mx, my, 1.25, i, { rot: v * 2.2 * (i % 2 ? 1 : -1), sy: v < 0 ? 1.12 : 1 });
  if (v >= 0) { bill(mx - 10, my + 30, .8, { rot: .4 + v * 3 }); sparks(mx, my, seg(v, 0, .2), 8, i * 7); label('-' + LOSS[i % 6], mx - 40, my - 120 - v * 160, 46, '#ff6a8a', 1 - seg(v, .3, .6)); }
}
function roofs(off, gy = GY, col = '#28103f', top = '#5a2a86') {   // atap bergulir, periode 900: atap 640 + celah 260
  const base = Math.floor(off / 900), fr = off - base * 900;
  for (let k = -1; k < 3; k++) {
    const x = k * 900 - fr, id = base + k;
    each(c => { c.fillStyle = c === G ? '#000' : col; c.fillRect(x, gy, 640, H); c.fillRect(x + 420, gy - 120, 110, 120); c.fillRect(x + 408, gy - 142, 134, 26); c.fillRect(x + 120, gy - 200, 8, 200); c.fillRect(x + 92, gy - 172, 64, 6); });
    X.fillStyle = top; X.fillRect(x - 10, gy, 660, 20);
    X.fillStyle = '#ffd27a'; X.globalAlpha = .8; for (let wy = gy + 80; wy < H; wy += 112) for (let wx = 44; wx < 600; wx += 96) if (hash(wx * .3 + wy * .7 + id * 3.3) > .5) X.fillRect(x + wx, wy, 44, 62); X.globalAlpha = 1;
  }
}
const RUN = t => ({ view: 'side', step: q12(t) * 4.4, tilt: .22, wingRight: -2.2, mood: 'frozen' });

// ───────── 1. Gajian, dompet meledak, uang kabur (0–3,0)
function s1(t) {
  const v = t - 1.2, sh = t > .85 && v < 0 ? (hash(Math.floor(t * 24)) - .5) * 20 : 0, hop = v < 0 ? 26 * Math.abs(Math.sin(q12(t) * 8.38)) : 0;
  zoom(1 + .07 * ss(seg(t, 0, 3)), 470, 1200);
  city('day', { ox: t * 30, sunX: 250, sunY: 640, sunR: 200 }); ground('day', { y: 1440 });
  const pose = v < 0 ? { mood: 'joy', flap: .5 + .5 * Math.sin(q12(t) * 14), lift: hop } : { mood: 'frozen', eyes: 'shock', lookY: -1.2, squashY: 1 - .14 * Math.exp(-v * 8) * Math.cos(v * 22) };
  hero({ x: 470, y: 1440, s: 2.3, t, pose, wind: v < 0 ? 1 : 1.8 });
  wallet(470 + sh, 1262 - hop, 1.45, v < 0 ? 0 : eo(seg(v, 0, .12)));
  if (v < 0) { star(590, 1190 - hop, 90, seg(t, .3, .7), '#ffe9a0'); star(360, 1300, 70, seg(t, .6, 1.0), '#ffe9a0'); }
  else {
    sparks(470, 1200, seg(v, 0, .3), 14, 3, '#ffe66a', 340);
    for (let i = 0; i < 34; i++) {
      const a = -PI / 2 + (hash(i * 3.3) - .5) * 2.4, r = eo(seg(v, 0, .45)) * (260 + hash(i * 1.7) * 560), dr = Math.max(0, v - .55 - hash(i) * .5);
      const x = 470 + Math.cos(a) * r + Math.sin(t * 5 + i) * 16 + dr * dr * 2600, y = 1180 + Math.sin(a) * r - dr * 500 + Math.sin(t * 7 + i * 1.7) * 14;
      if (x < W + 120) bill(x, y, .8 + hash(i * 2.1) * .7, { rot: Math.sin(t * 6 + i) * .25 + dr * .5, flap: flap(t, i) });
    }
  }
}
// ───────── 2. Mata menyipit, uang melesat lewat (3,0–4,5)
function eyesCU(t, u, glow, col) {
  darkBg('#160a34', '#5a1f6e'); lines(t, 26, col, .4, false, 3600);
  const e = u < .4 ? .06 : u < .525 ? .38 : u < .65 ? .72 : 1;
  hero({ x: 480, y: 1745, s: 6 + u * .25, t, pose: { mood: 'frozen', eyes: 'angry', eyeOpen: e, eyeGlow: glow }, wind: 1.3, shadow: false });
  X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = col; const bx = lerp(-500, 1500, seg(u, .1, .95)); X.beginPath(); X.moveTo(bx, 0); X.lineTo(bx + 260, 0); X.lineTo(bx - 140, H); X.lineTo(bx - 400, H); X.fill(); X.restore();
}
function s2(t) {
  const u = t - 3; eyesCU(t, u, 0, '#7dffb0');
  for (let i = 0; i < 4; i++) {
    const k = seg(u, .68 + i * .07, .98 + i * .07); if (k <= 0 || k >= 1) continue;
    const x = lerp(-200, 1300, k), y = 1130 + i * 120 - k * 120;
    each(c => { c.fillStyle = c === G ? '#7dffb0' : '#fff'; c.globalAlpha = .5; c.fillRect(x - 460, y - 12, 460, 24); c.globalAlpha = 1; });
    bill(x, y, 2.3, { rot: -.12, flap: flap(t, i) });
  }
  star(800, 1240, 150, seg(u, .98, 1.38));
}
// ───────── 3a. Sprint di jalan: lompat peti, merunduk di bawah tenda (4,5–6,75)
const HIT_A = i => 4.65 + i * .1875, OB = i => 4.72 + i * .375;
function s3a(t) {
  const u = t - 4.5, ox = u * 2600;
  city('day', { ox: ox * .3, sunX: 830, sunY: 520, sunR: 190 }); ground('day', { ox }); lines(t, 22, '#fff', .45, false);
  const hx = 320, hy = GY + 20; let lift = 0, sl = 0;
  for (let i = 0; i < 6; i++) { const d = (t - OB(i)) / .17; if (Math.abs(d) < 1) { if (i % 2 === 0) lift = 300 * (1 - d * d); else sl = 1 - d * d * d * d; } }
  const pose = sl > 0 ? { view: 'side', step: 1, tilt: -.5 * sl, squashY: 1 - .42 * sl, squashX: 1 + .22 * sl, wingRight: -.6, mood: 'frozen' } : lift > 0 ? { view: 'side', step: .8, tilt: .38, wingRight: -2.8, mood: 'frozen' } : RUN(t);
  const bob = lift || sl ? 0 : Math.abs(Math.sin(q12(t) * 14)) * 16, eaten = clamp(Math.floor((t - 4.65) / .1875) + 1, 0, 12);
  flock(t, 760, 560, 17 - eaten, 300, 340, 1.05, 5);
  for (let i = 0; i < 12; i++) snatch(t, HIT_A(i), i, 700, 600);
  for (let i = 0; i < 6; i++) {
    const x = hx + 40 - (t - OB(i)) * 2600; if (x < -300 || x > W + 300) continue;
    if (i % 2) awning(x, GY - 372, 300, 120, i, 0); else { crate(x - 44, GY + 12, 88); crate(x + 44, GY + 12, 88); crate(x, GY - 76, 88, .08); }
  }
  if (sl > 0) dust(hx - 60, hy, 1 - sl, 5, 7, '#c9d4ff');
  for (let j = 3; j >= 1; j--) hero({ x: hx - 80 * j, y: hy - bob - lift, s: 1.9, t: t - j * .04, pose, ghost: { col: CY, a: .34 - j * .08 } });
  hero({ x: hx, y: hy - bob - lift, s: 1.9, t, pose, wind: 1.5, shadow: !lift });
}
// ───────── 3b. Tendang dinding naik gang sempit, lalu melompat di depan matahari (6,75–8,25)
const KT = j => 6.85 + j * .125, KX = j => j % 2 ? 715 : 245;
function walls(u, speed) {
  for (const sd of [0, 1]) {
    const x0 = sd ? 800 : -40, w = sd ? 320 : 210;
    each(c => { c.fillStyle = c === G ? '#000' : (sd ? '#2c3684' : '#3f4fa6'); c.fillRect(x0, -40, w, H + 80); });
    X.fillStyle = sd ? '#1c2050' : '#2c3684'; X.fillRect(sd ? 800 : 150, -40, 20, H + 80);
    for (let i = 0; i < 14; i++) { const y = ((i * 170 + u * speed) % 2380) - 200, lit = hash(i + sd * 9) > .45; X.fillStyle = lit ? '#ffe9a0' : '#6f86d8'; for (let k = 0; k < (sd ? 3 : 2); k++) X.fillRect(x0 + (sd ? 56 : 30) + k * 78, y, 44, 92); }
  }
}
function s3b(t) {
  const u = t - 6.75, v = u - 1.125;
  if (v < 0) {
    X.drawImage(PL.day, 0, -520 + u * 140); lines(t, 26, '#fff', .4, true, 4200); walls(u, 2600);
    flock(t, 480, 340 - u * 150, 10, 420, 260, .9, 11);
    const idx = (t - KT(0)) / .125, j = Math.floor(idx), ph = idx - j; let x, y, f;
    if (idx < 0) { const k = eo(seg(u, 0, .1)); x = lerp(560, KX(0), k); y = lerp(1900, 1150, k); f = -1; }
    else if (j < 6) { x = lerp(KX(j), KX(j + 1), ph); y = 1150 - Math.sin(ph * PI) * 110 - j * 14; f = KX(j + 1) > KX(j) ? 1 : -1; }
    else { const k = seg(u, .85, 1.12); x = lerp(KX(6), 500, k); y = lerp(1066, -500, k * k); f = 1; }
    for (let k = 0; k <= Math.min(j, 6); k++) {
      const dt = t - KT(k), a = [KX(k), 1090 - k * 14], b = k < 6 ? [KX(k + 1), 1000 - k * 14] : [500, 300];
      slash(a[0], a[1], Math.atan2(b[1] - a[1], b[0] - a[0]), Math.hypot(b[0] - a[0], b[1] - a[1]), seg(dt, 0, .32), 26, CY);
      sparks(KX(k) + (k % 2 ? 40 : -40), 1150 + dt * 1800, seg(dt, 0, .22), 9, k * 5, '#fff', 130);
    }
    const pose = { view: 'side', facing: f, tilt: .32, step: .7, wingRight: -2.5, mood: 'frozen' };
    for (let g = 2; g >= 1; g--) hero({ x: x - f * 70 * g, y: y + 100 + 30 * g, s: 1.45, t, pose, ghost: { col: CY, a: .36 - g * .1 } });
    hero({ x, y: y + 100, s: 1.45, t, pose, wind: 1.7, shadow: false });
  } else {
    zoom(1 + .05 * v / .375, 430, 800);
    city('dusk', { cam: 420, ox: 200, sunX: 730, sunY: 470, sunR: 300 }); roofs(140 + v * 60, 1580);
    flock(t, 700, 560 - v * 90, 9, 320, 300, .95, 17);
    hero({ x: 420 - v * 40, y: 1010 - v * 130, s: 2.1, t: 7.875 + v * .3, rot: -.25, pose: { view: 'side', tilt: .3, step: .6, wingRight: -2.9, mood: 'frozen' }, wind: 1.6, shadow: false });
    if (v < .085) impact();
  }
}
// ───────── 3c. Lompat antar atap, lalu meluncur di kabel (8,25–10,5)
function s3c(t) {
  const u = t - 8.25;
  if (u < 1.125) {
    const off = u * 2400; city('dusk', { ox: off * .25, sunX: 700, sunY: 640, sunR: 260 }); lines(t, 20, '#ffd0f0', .45, false); roofs(off);
    const p = ((off + 330) % 900) / 900, ph = p >= .55 ? (p - .55) / .5 : p < .05 ? (p + .45) / .5 : -1, lift = ph >= 0 ? Math.sin(ph * PI) * 250 : 0;
    flock(t, 740, 560, 8, 280, 300, 1, 21);
    for (let i = 0; i < 4; i++) snatch(t, 8.4 + i * .21, i + 3, 720, 600, 480);
    const pose = lift > 0 ? { view: 'side', step: .8, tilt: .4, wingRight: -2.9, mood: 'frozen' } : RUN(t), bob = lift ? 0 : Math.abs(Math.sin(q12(t) * 14)) * 16;
    for (let j = 3; j >= 1; j--) hero({ x: 330 - 80 * j, y: GY + 20 - bob - lift, s: 1.9, t: t - j * .04, pose, ghost: { col: NEON, a: .32 - j * .08 } });
    hero({ x: 330, y: GY + 20 - bob - lift, s: 1.9, t, pose, wind: 1.5, shadow: !lift });
  } else {
    const w = u - 1.125, drop = Math.max(0, w - .9), hx = 438, cy = 757, hy = cy + 338 + drop * drop * 9000, sw = Math.sin(w * 9) * .12;
    city('dusk', { ox: 700 + w * 800, cam: 430 - w * 380, sunX: 700, sunY: 520, sunR: 260 }); lines(t, 24, '#ffd0f0', .4, false);
    each(c => { c.strokeStyle = c === G ? '#000' : '#1a0b33'; c.lineWidth = 10; c.beginPath(); c.moveTo(-100, 480); c.lineTo(1180, 1140); c.stroke(); });
    X.strokeStyle = '#a99ad8'; X.lineWidth = 3; X.beginPath(); X.moveTo(-100, 476); X.lineTo(1180, 1136); X.stroke();
    for (let i = 0; i < 3; i++) { const p = 1.2 - ((w * 1.9 + i / 3) % 1) * 1.5, x = lerp(-100, 1180, p), y = lerp(480, 1140, p); X.fillStyle = '#1a0b33'; X.fillRect(x - 9, y - 34, 18, 68); X.fillStyle = '#a99ad8'; X.fillRect(x - 14, y - 6, 28, 12); }
    flock(t, 740, 1180 - w * 60, 7, 260, 280, 1, 27);
    for (let i = 0; i < 3; i++) snatch(t, 9.55 + i * .21, i + 1, 760, 1150, 300);
    const pose = { view: 'side', tilt: .15, step: .4, wingRight: -3.3, mood: 'frozen' };
    if (!drop) { sparks(hx + 6, cy, (w * 7) % 1, 7, Math.floor(w * 7) * 3, '#ffe66a', 170); for (let j = 3; j >= 1; j--) hero({ x: hx - 78 * j, y: hy - 40 * j, s: 1.8, t, rot: sw, pose, ghost: { col: NEON, a: .32 - j * .08 } }); }
    hero({ x: hx, y: hy, s: 1.8, t, rot: sw + drop * 3, pose, wind: 1.8, shadow: false });
  }
}
// ───────── 3d. Mendarat di pasar, peti dan buah berhamburan, uang tersedot ke atas (10,5–12,0)
function fruit(x, y, r, k) {
  X.fillStyle = ['#ff8a2a', '#ee3b45', '#ffd84a'][k % 3]; X.strokeStyle = '#3a1f0a'; X.lineWidth = 4; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.stroke();
  X.fillStyle = '#fff'; X.globalAlpha = .5; X.beginPath(); X.arc(x - r * .3, y - r * .35, r * .28, 0, TAU); X.fill(); X.globalAlpha = 1;
}
function s3d(t) {
  const u = t - 10.5, v = u - .75, w0 = Math.max(0, u - .12);
  city('dusk', { ox: 300, sunX: 760, sunY: 700, sunR: 230 });
  for (let i = 0; i < 3; i++) awning(130 + i * 340, 1020, 310, 130, i, 420);
  ground('dusk', { y: 1420 });
  const pull = v > 0 ? v * v * 3200 : 0;
  for (let i = 0; i < 12; i++) { const x = 90 + hash(i * 3.7) * 800 + Math.sin(t * 5 + i) * 14, y = 330 + hash(i * 5.9) * 420 + Math.sin(t * 7 + i) * 12 - pull * (.6 + hash(i)); if (v > 0) each(c => { c.fillStyle = c === G ? '#ff2d6f' : '#fff'; c.globalAlpha = .35; c.fillRect(x - 5, y, 10, 60 + pull * .5); c.globalAlpha = 1; }); if (y > -120) bill(x, y, 1, { rot: Math.sin(t * 6 + i) * .2, flap: flap(t, i) }); }
  for (let i = 0; i < 24; i++) {
    const a = -PI / 2 + (hash(i * 3.3) - .5) * 2.7, r = w0 * (500 + hash(i * 1.7) * 900), x = 480 + Math.cos(a) * r, y = 1370 + Math.sin(a) * r + w0 * w0 * 1700;
    if (u < .12) { if (i < 6) crate(330 + (i % 3) * 150, 1420 - Math.floor(i / 3) * 92, 92); }
    else if (y < 1480) { if (i % 3) fruit(x, y, 20 + hash(i) * 12, i); else crate(x, y + 40, 80, w0 * 9 * (i % 2 ? 1 : -1)); }
  }
  const ld = seg(u, 0, .12), hy = lerp(-320, 1420, ld * ld), w = Math.max(0, u - .12), sq = u < .12 ? 1.12 : 1 - .3 * Math.exp(-w * 9) * Math.cos(w * 22);
  dust(480, 1420, seg(u, .12, .75), 12, 3);
  hero({ x: 480, y: hy, s: 2.3, t, pose: { mood: 'frozen', squashY: sq, squashX: 1 / Math.sqrt(sq), eyes: u > .78 ? 'shock' : 'angry', eyeOpen: u < .6 ? .1 : null, lookY: u > .78 ? -1.2 : 0, wingRight: -.2 }, wind: u < .5 ? 2 : 1 });
  star(690, 1405, 120, seg(u, .14, .45));
  const dk = ss(seg(u, .9, 1.45)); if (dk > 0) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(8,3,20,${.85 * dk})`); g.addColorStop(clamp(dk * 1.2, .01, 1), `rgba(8,3,20,${.55 * dk})`); g.addColorStop(1, `rgba(8,3,20,${.2 * dk})`); X.fillStyle = g; X.fillRect(0, 0, W, H); X.restore(); }
}
// ───────── 4. Tanggal Tua naik dan menyedot (12,0–16,5)
function s4(t) {
  const u = t - 12, cam = 260 * ss(seg(u, .2, 2.0)) - 140 * ss(seg(u, 2.9, 3.6)), r = ss(seg(q12(u), .2, 2.2)), suck = seg(u, 2.6, 2.75);
  const bs = 1.4, by = lerp(2100, 520, r) + cam * .6, eye = seg(u, 2.2, 2.35), br = Math.sin(q12(t) * 3) * 6, my = by + 320 * bs;
  city('dark', { cam, sunY: 640, sunR: 340, between: () => {
    if (suck > 0) radial(480, my, t, 34, '#ff3d7a', .3 * suck, 420);
    BM(480, by + br, bs, { mouth: .1 + .9 * suck, eye });
    if (u < 2.3) dust(480, 1230 + cam * .78, (u * 2.5) % 1, 10, Math.floor(u * 2.5) * 9, '#4a2a6a');
  } });
  ground('dark', { cam: cam * .25, y: 1440 });
  if (suck > 0) {
    stream(u, 480, my, 44);
    for (let j = 0; j < 3; j++) { const k = ((u - 2.6) * 1.3 + j / 3) % 1; each(c => { c.strokeStyle = c === G ? '#ff2d6f' : '#fff'; c.globalAlpha = k * .8; c.lineWidth = 16 * k + 3; c.beginPath(); c.ellipse(480, my, (1 - k) * 1000 + 30, (1 - k) * 800 + 20, 0, 0, TAU); c.stroke(); c.globalAlpha = 1; }); }
  }
  hero({ x: 480 + suck * Math.sin(q12(t) * 30) * 6, y: 1450 + cam * .25, s: 1.3, t, pose: { view: 'back', squashY: 1 - .07 * suck, wingRight: -.5 }, wind: 1 + suck * 2 });
  if (u >= 2.6 && u < 2.685) impact();
}
// ───────── 5. Dihajar: hindari tagihan, rebut uang, lalu tersedot dan ditelan (16,5–21,0)
const PT = [[300, 830], [690, 720], [320, 600], [670, 960], [470, 660], [480, 840]];
function s5(t) {
  const u = t - 16.5, bs = 1.4, by = 592 + Math.sin(q12(t) * 3) * 6, my = by + 320 * bs, big = seg(u, 2.5, 2.62), shut = seg(u, 3.0, 3.08);
  city('dark', { cam: 120, sunY: 640, sunR: 340 }); ground('dark', { y: 1440 });
  if (u < 3.0) radial(480, my, t, 30, '#ff3d7a', .18 + .2 * big, 440);
  BM(480 + (u > 2.5 && u < 3 ? (hash(Math.floor(t * 24)) - .5) * 14 : 0), by, bs, { mouth: u < 3 ? .7 + .3 * big : lerp(1, .04, shut), eye: 1 });
  if (u < 3.0) stream(u + 5, 480, my, 30, 1 + big);
  for (const [u0, x] of [[0, 300], [.55, 700]]) {            // dua tagihan dimuntahkan lalu menghantam
    if (u < u0 || u > u0 + 1.0) continue;
    const a = eo(seg(u, u0, u0 + .3)), b = seg(u, u0 + .3, u0 + .4), xx = lerp(480, x, a), y = lerp(lerp(my, 520, a), 1290, b * b), fd = 1 - seg(u, u0 + .7, u0 + 1.0);
    X.globalAlpha = fd; slab(xx, y, lerp(.3, 1.25, a), (x < 480 ? -1 : 1) * (.5 * (1 - b) + .06)); X.globalAlpha = 1;
  }
  dust(300, 1420, seg(u, .4, .9), 10, 21, '#4a2a6a'); dust(700, 1420, seg(u, .95, 1.45), 10, 33, '#4a2a6a');
  const GH = (x, y, s, pose, a) => hero({ x, y, s, t, pose, ghost: { col: NEON, a } });
  if (u < 1.1) {
    const d1 = seg(u, .33, .41), d2 = seg(u, .88, .96), x = lerp(lerp(300, 700, eo(d1)), 250, eo(d2)), pose = { mood: 'frozen', eyes: u > .3 ? 'angry' : 'shock', wingRight: -1, lookY: -1 };
    if (d1 > 0 && u < .6) for (let j = 1; j <= 3; j++) GH(lerp(300, 700, j / 4), 1430, 1.5, pose, .3);
    if (d2 > 0) for (let j = 1; j <= 3; j++) GH(lerp(700, 250, j / 4), 1430, 1.5, pose, .3 * (1 - seg(u, .96, 1.1)));
    hero({ x, y: 1430, s: 1.5, t, pose, wind: 1.6 });
  } else if (u < 2.62) {
    const j = clamp(Math.floor((u - 1.3) / .2), 0, 5), p = PT[j], f = p[0] < 480 ? 1 : -1, ts = 1.3 + j * .2, jm = eo(seg(u, 1.1, 1.3));
    const x = u < 1.3 ? lerp(250, p[0], jm) : p[0] - f * 40 * seg(u, ts + .05, ts + .2), y = u < 1.3 ? lerp(1430, p[1], jm) : p[1], pose = { view: 'side', facing: f, tilt: .3, wingRight: -2.6, mood: 'frozen' };
    for (let k = 0; k < 6; k++) { const q = PT[k], g = q[0] < 480 ? 1 : -1, tk = 1.3 + k * .2; if (u < tk) bill(q[0] + g * 170, q[1] - 40 + Math.sin(t * 8 + k) * 10, 1.5, { rot: Math.sin(t * 6 + k) * .2, flap: flap(t, k) }); }
    if (j > 0) { const q = PT[j - 1]; GH(q[0], q[1] + 100, 1.3, Object.assign({}, pose, { facing: q[0] < 480 ? 1 : -1 }), .4 * (1 - seg(u, ts, ts + .18))); }
    if (u < 1.3) for (let k = 1; k <= 3; k++) GH(lerp(250, p[0], jm * k / 4), lerp(1430, p[1], jm * k / 4) + 100, 1.3, pose, .25);
    hero({ x, y: y + 100, s: 1.3, t, pose, wind: 1.6, shadow: false });
    for (let k = 0; k <= j; k++) { const q = PT[k], g = q[0] < 480 ? 1 : -1, tk = 1.3 + k * .2; slash(q[0] + g * 30, q[1] - 170, g > 0 ? .55 : PI - .55, 380, seg(u, tk, tk + .24), 22, CY); sparks(q[0] + g * 170, q[1] - 40, seg(u, tk + .02, tk + .3), 14, k * 11, '#ffe66a', 170); star(q[0] + g * 170, q[1] - 40, 100, seg(u, tk + .01, tk + .22), '#ffe9a0'); label('+1', q[0] + g * 170, q[1] - 110 - (u - tk) * 200, 54, '#9dff8a', 1 - seg(u, tk + .2, tk + .45)); }
  } else if (u < 3.0) {
    const k = seg(u, 2.62, 3.0), a = k * TAU * 2, rad = (1 - k) * 280, x = 480 + Math.cos(a) * rad, y = lerp(940, my, k) + Math.sin(a) * rad * .5, s = lerp(1.5, .2, k);
    for (let j = 1; j <= 3; j++) { const kk = clamp(k - j * .05), aa = kk * TAU * 2, rr = (1 - kk) * 280; GH(480 + Math.cos(aa) * rr, lerp(940, my, kk) + Math.sin(aa) * rr * .5 + 95 * s, lerp(1.5, .2, kk), { eyes: 'dizzy' }, .22); }
    hero({ x, y: y + 95 * s, s, t, rot: -k * TAU * 2.5, pose: { mood: 'frozen', eyes: 'dizzy' } });
  }
  if (u >= 2.62 && u < 2.705) impact();
  const dk = ss(seg(u, 3.05, 3.5)); if (dk > 0) { fillAll('#05020f', .9 * dk); fillAll('#000', .7 * dk, G); const b2 = by + (u > 3.8 ? Math.abs(Math.sin(q12(t) * 24)) * 10 : 0); bigMon(X, 480, b2, bs, { eyesOnly: true, mouth: .04 }); bigMon(G, 480, b2, bs, { eyesOnly: true, mouth: .04 }); }
}
// ───────── 6. Di dalam perut: jaring menyala (21,0–24,0)
function belly(t) {
  darkBg('#05020f', '#2a0b3a'); X.fillStyle = '#5a1470';
  for (let i = 0; i < 9; i++) { X.globalAlpha = .22; X.beginPath(); X.ellipse(i % 2 ? W + 20 : -20, 140 + i * 210, 190 + 50 * Math.sin(q12(t) * 3 + i), 150, 0, 0, TAU); X.fill(); } X.globalAlpha = 1;
}
function s6(t) {
  const u = t - 21;
  if (u < .75) {
    const gk = seg(u, .3, .75); belly(t); flock(t * .3, 480, 620, 9, 760, 800, 1, 31); fillAll('#05020f', .5);
    hero({ x: 480, y: 1440, s: 2.2, t, pose: { mood: 'sad', eyes: 'sadClosed', sweat: .6 }, wind: .3, shadow: false }); fillAll('#05020f', .5 * (1 - gk));
    each(c => { const g = c.createRadialGradient(480, 1090, 10, 480, 1090, 430 * gk + 12); g.addColorStop(0, `rgba(157,255,138,${.8 * gk})`); g.addColorStop(1, 'rgba(157,255,138,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    star(480, 1090, 200, seg(u, .38, .75), NEON);
  } else if (u < 1.5) {
    const w = u - .75; eyesCU(-t, w + (w < .375 ? .4 : .3), 0, NEON); star(650, 1000, 150, seg(w, .36, .7), NEON);
  } else {
    const w = u - 1.5, fr = Math.floor(t * 12), pul = 1 + .025 * Math.sin(fr * 2.1), gr = seg(w, 0, .5);
    belly(t); lines(-t, 26, NEON, .4, true, 3000);
    each(c => { for (let i = 0; i < 11; i++) { const x = 480 + (i - 5) * 62, h = (240 + hash(i + fr * 3.1) * 300) * gr * (1 - Math.abs(i - 5) * .09); c.fillStyle = c === G ? MATCHA9 : NEON; c.globalAlpha = c === G ? .7 : .32; c.beginPath(); c.moveTo(x - 46, 1420); c.quadraticCurveTo(x - 40, 1420 - h * .5, x + (hash(i + fr) - .5) * 40, 1420 - h); c.quadraticCurveTo(x + 40, 1420 - h * .5, x + 46, 1420); c.fill(); } c.globalAlpha = 1; });
    for (let i = 0; i < 12; i++) { const d = hash(i * 2.9), y = 1420 - ((w * 420 * (1 + d)) % 900); bill(120 + hash(i * 6.1) * 720, y, .6 + d * .5, { rot: w * 3 + i, flap: flap(t, i), glow: .15 }); }
    each(c => { c.fillStyle = NEON; c.globalAlpha = .5 * gr; c.beginPath(); c.ellipse(480, 1425, 330 * gr, 34, 0, 0, TAU); c.fill(); c.globalAlpha = 1; });
    hero({ x: 480, y: 1420, s: 2.4 * pul, t, pose: { mood: 'frozen', eyes: 'angry', eyeGlow: 0, wingRight: lerp(0, -3.6, eo(seg(w, 0, .45))), wingLeft: -.7 }, kat: 0, glow: seg(w, .15, 1.1), wind: 2 });
    star(585, 640, 200, seg(w, .9, 1.4), NEON);
  }
}
// ───────── 7. Jurus pamungkas: jaring catatan (24,0–28,5)
const GR = { x0: 70, y0: 560, cw: 158, ch: 118 };       // 5 kolom x 6 baris
const GL = j => j < 7 ? { t: .96 + j * .055, h: 1, p: GR.y0 + j * GR.ch } : { t: 1.0 + (j - 7) * .065, h: 0, p: GR.x0 + (j - 7) * GR.cw };
const BC = j => ({ t: 1.22 + j * .038, x: GR.x0 + (j % 5 + .5) * GR.cw, y: GR.y0 + (Math.floor(j / 5) + .5) * GR.ch + 6 });
const SL = j => ({ t: .96 + j * .058, x: 480 + (hash(j * 3.1) - .5) * 440, y: 900 + (hash(j * 5.7) - .5) * 820, a: hash(j * 9.3) * PI });
const CUTS = [{ x: 480, y: 760, a: -.5 }, { x: 480, y: 1040, a: .35 }, { x: 470, y: 900, a: 1.42 }];
const BX = 480, BY = 530, BS = 1.3;
function grid(u, a = .8, w = 6) {
  each(c => { c.strokeStyle = c === G ? MATCHA9 : NEON; c.lineWidth = w; c.lineCap = 'round'; c.globalAlpha = a * (c === G ? .8 : 1); c.beginPath(); for (let j = 0; j < 13; j++) { const g = GL(j); if (g.t + .12 > u) continue; if (g.h) { c.moveTo(GR.x0, g.p); c.lineTo(GR.x0 + 5 * GR.cw, g.p); } else { c.moveTo(g.p, GR.y0); c.lineTo(g.p, GR.y0 + 6 * GR.ch); } } c.stroke(); c.globalAlpha = 1; });
}
function caught(u, t, dy = 0) {
  for (let j = 0; j < 30; j++) {
    const b = BC(j), k = seg(u, b.t - .09, b.t);
    if (k < 1) { const a = j * 2.4 + u * 9, x = 480 + Math.cos(a) * (300 + hash(j) * 200), y = 860 + Math.sin(a) * 380; bill(lerp(x, b.x, k * k), lerp(y, b.y, k * k), 1, { rot: a, flap: flap(t, j) }); }
    else { const pk = back(seg(u, b.t, b.t + .14)); bill(b.x, b.y + dy, .95 * pk, { nowing: true, glow: .45 }); sparks(b.x, b.y, seg(u, b.t, b.t + .2), 6, j * 3, NEON, 90); }
  }
}
function burstOut(v) {
  const k = eo(v / .6); darkBg('#05020f', '#2a0b4a'); radial(480, BY + 320 * BS, 24 + v, 44, '#fff', .5, 260);
  BM(BX, BY, BS, { eye: 1, mouth: 1, inner: '#9dff8a' });
  each(c => { const g = c.createRadialGradient(480, BY + 330 * BS, 10, 480, BY + 330 * BS, 200 + 500 * k); g.addColorStop(0, c === G ? 'rgba(157,255,138,.35)' : 'rgba(157,255,138,.6)'); g.addColorStop(1, 'rgba(157,255,138,0)'); c.fillStyle = g; c.fillRect(-60, -60, W + 120, H + 120); });
  const pose = { mood: 'frozen', eyes: 'angry', wingRight: -3.3, wingLeft: -.6 };
  for (let j = 3; j >= 1; j--) { const kk = eo(clamp(v - j * .05) / .6); hero({ x: 480, y: lerp(BY + 360 * BS, 1560, kk), s: lerp(.25, 2.7, kk), t: 24 + v, pose, kat: -.2, ghost: { col: NEON, a: .3 * (1 - kk) + .02 } }); }
  hero({ x: 480, y: lerp(BY + 360 * BS, 1560, k), s: lerp(.25, 2.7, k), t: 24 + v, pose, kat: -.2, glow: 1, wind: 2, shadow: false });
}
function s7(t) {
  const u = t - 24, fr = Math.floor(u * 12);
  if (u < .75) burstOut(Math.min(u, .6));
  else if (u < .96) { burstOut(.6); if (u < .835) { fillAll('#fff'); fillAll('#fff', .5, G); } else { impact(); each(c => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.strokeStyle = c === G ? NEON : '#000'; c.lineWidth = 30; c.beginPath(); c.moveTo(-50, 1540); c.lineTo(1130, 260); c.stroke(); c.restore(); }); } }
  else if (u < 2.4) {
    darkBg(['#12062a', '#2a0b4a', '#0a2a1a'][Math.floor(u * 8) % 3], '#05020f'); radial(480, 900, t, 30, NEON, .2, 600);
    BM(BX + (hash(fr * 1.3) - .5) * 26, BY + (hash(fr * 2.9) - .5) * 20, BS, { eye: .5 + .5 * hash(fr), mouth: 1 });
    grid(u);
    for (let j = 0; j < 13; j++) { const g = GL(j); g.h ? slash(-200, g.p, 0, 1500, seg(u, g.t, g.t + .3), 26) : slash(g.p, 200, PI / 2, 1500, seg(u, g.t, g.t + .3), 26); }
    caught(u, t);
    for (let g = 0; g < 2; g++) { const x = 120 + hash(fr * 3.7 + g * 9) * 720, y = 720 + hash(fr * 5.1 + g * 4) * 760; hero({ x, y, s: 1.25, t, rot: (hash(fr + g) - .5) * 1.2, pose: { view: 'side', facing: x < 480 ? 1 : -1, wingRight: -2.6, mood: 'frozen' }, kat: (hash(fr * 7 + g) - .5) * 2, ghost: { col: g ? '#fff' : NEON, a: .7, mix: g ? .85 : .55 } }); }
    for (let j = 0; j < 24; j++) { const s = SL(j); slash(s.x - Math.cos(s.a) * 780, s.y - Math.sin(s.a) * 780, s.a, 1560, seg(u, s.t, s.t + .4), 14, CY); }
  } else {
    const w = u - 2.4, v = u - 3.3;
    X.save(); G.save(); zoom(1.02 + .03 * Math.min(w, .9) / .9, 300, 1100);
    darkBg('#0a0418', '#3a1458');
    const lb = v > 0 ? seg(v, .25, 1) : 0;
    each(c => { const g = c.createRadialGradient(480, 900, 40, 480, 900, 900 + lb * 900); g.addColorStop(0, c === G ? `rgba(180,255,170,${.4 + lb * .5})` : `rgba(${190 + lb * 60},255,${170 + lb * 80},${.6 + lb * .4})`); g.addColorStop(1, 'rgba(60,160,90,0)'); c.fillStyle = g; c.fillRect(-100, -100, W + 200, H + 200); });
    if (v < 0) BM(BX, BY, BS, { eye: .25, mouth: 1 });
    else {
      const d = 16 * seg(v, 0, .1) + (v > .45 ? (v - .45) * (v - .45) * 5200 + (v - .45) * 500 : 0), ck = seg(v, 0, .45);
      for (let m = 0; m < 8; m++) {
        let ox = 0, oy = 0; const sg = CUTS.map((c, i) => (m >> i & 1) ? 1 : -1); CUTS.forEach((c, i) => { ox += -Math.sin(c.a) * sg[i] * d; oy += Math.cos(c.a) * sg[i] * d; });
        each(c => { c.save(); c.translate(ox, oy + v * v * 260 * ((m % 3) - 1)); c.translate(480, 900); c.rotate(sg[0] * .16 * seg(v, .45, 1.2)); c.translate(-480, -900);
          CUTS.forEach((q, i) => { const ux = Math.cos(q.a), uy = Math.sin(q.a), nx = -uy * sg[i], ny = ux * sg[i], R = 3000; c.beginPath(); c.moveTo(q.x - ux * R, q.y - uy * R); c.lineTo(q.x + ux * R, q.y + uy * R); c.lineTo(q.x + ux * R + nx * R, q.y + uy * R + ny * R); c.lineTo(q.x - ux * R + nx * R, q.y - uy * R + ny * R); c.closePath(); c.clip(); });
          bigMon(c, BX, BY, BS, { eye: .25 * (1 - seg(v, 0, .4)), mouth: 1 }); c.restore(); });
      }
      if (v < .6) each(c => { c.strokeStyle = c === G ? '#ffe9a0' : '#fff'; c.lineCap = 'round'; c.lineWidth = lerp(8, 70, ck); c.globalAlpha = 1 - seg(v, .45, .6); c.beginPath(); for (const q of CUTS) { c.moveTo(q.x - Math.cos(q.a) * 700, q.y - Math.sin(q.a) * 700); c.lineTo(q.x + Math.cos(q.a) * 700, q.y + Math.sin(q.a) * 700); } c.stroke(); c.globalAlpha = 1; });
      if (v > .45) for (let i = 0; i < 56; i++) { const a = hash(i * 3.3) * TAU, q = v - .45, r = q * 1900 * (.35 + hash(i * 1.7)); coin(480 + Math.cos(a) * r, 900 + Math.sin(a) * r + q * q * 900, 20 + hash(i) * 14, q * 12 + i); }
    }
    grid(9, v < 0 ? .6 + .35 * Math.sin(w * 20) : 1, 7); caught(9, t);
    hero({ x: 230, y: 1640, s: 1.7, t: v < 0 ? 26.4 + w * .25 : t, pose: { view: 'side', facing: -1, tilt: .1, wingRight: w < .6 ? -2.6 : lerp(-2.6, -.4, eo(seg(w, .6, .75))), mood: 'frozen' }, kat: 0, glow: 1 - seg(w, 0, .6) * .6, wind: v < 0 ? 1.2 : 2 });
    star(96, 1420, 150, seg(w, .58, .9), NEON);
    X.restore(); G.restore();
    if (v > .85) { fillAll('#fff', seg(v, .85, 1.15)); fillAll('#fff', seg(v, .85, 1.15) * .5, G); }
  }
}
// ───────── 8. Fajar: uang turun rapi ke tumpukan berlabel (28,5–31,5)
const PILE = [[100, 'MAKAN'], [262, 'TRANSPOR'], [672, 'TABUNGAN'], [830, 'HIBURAN']];
function dawn(t) {
  const u = clamp(t - 28.5, 0, 3);
  zoom(1.09 - .09 * ss(u / 3), 480, 1100);
  city('dawn', { sunY: lerp(1130, 950, ss(u / 3)), sunR: 250, sunX: 240, ox: u * 30 }); ground('dawn', { y: 1440 });
  for (let i = 0; i < 16; i++) { const x = 50 + hash(i * 2.3) * 860, gy = 1470 + hash(i * 4.1) * 300, y = (u - hash(i * 6.7) * 1.6) * (760 + hash(i) * 600) - 100; if (y < -60) continue; y < gy ? coin(x, y, 20 + hash(i * 3) * 10, u * 9 + i) : coin(x, gy, 20 + hash(i * 3) * 10, PI / 2 - .2); }
  hero({ x: 480, y: 1440, s: 2.2, t, pose: { mood: 'joy', flap: .5 + .5 * Math.sin(q12(t) * 14), lift: 34 * Math.abs(Math.sin(q12(t) * 8.38)) }, wind: 1 });
  for (let i = 0; i < 28; i++) {
    const pi = i % 4, lv = Math.floor(i / 4), tl = .3 + i * .055, k = seg(u, tl - .32, tl), px = PILE[pi][0] + (hash(i * 3.9) - .5) * 12, ty = 1436 - lv * 17;
    if (k <= 0) continue;
    k < 1 ? bill(px + (1 - k) * (hash(i * 1.3) - .5) * 360, lerp(-90, ty, k * k), 1.05, { rot: (1 - k) * (hash(i) - .5) * 2, flap: flap(t, i) }) : bill(px, ty, 1.05, { nowing: true, rot: (hash(i * 7.1) - .5) * .08, glow: .12 });
  }
  PILE.forEach(([x, name], i) => label(name, x, i % 2 ? 1232 : 1284, 33, '#fff', seg(u, .5 + i * .2, .7 + i * .2)));
  for (let i = 0; i < 5; i++) star(120 + hash(i * 5.5) * 760, 560 + hash(i * 7.7) * 520, 70, ((u * .9 + hash(i)) % 1), '#fff');
}
// ───────── 9. CTA (31,5–39,0)
const BA = -.38, OFF = [-2400, -440, -220, 0, 220, 440, 2400], ORD = [3, 1, 5, 2, 4];
function zipBill(x, y, a, len, k, s = 1.4, t = 0) {     // uang di ujung garis laju
  if (k <= 0 || k > .5) return; const p = eo(seg(k, 0, .3)); bill(x + Math.cos(a) * len * p, y + Math.sin(a) * len * p, s, { rot: Math.cos(a) < 0 ? a + PI : a, flap: flap(t, 3), glow: 0 });
}
function cta(t, u) {
  X.fillStyle = '#fbfaf6'; X.fillRect(0, 0, W, H);
  X.fillStyle = '#f0f5ea'; X.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + u * .06; X.moveTo(452, 1150); X.lineTo(452 + Math.cos(a) * 2600, 1150 + Math.sin(a) * 2600); X.lineTo(452 + Math.cos(a + .2) * 2600, 1150 + Math.sin(a + .2) * 2600); } X.fill();
  for (let j = 0; j < 15; j++) {
    const tj = 1.75 + j * .375, px = 100 + hash(j * 4.1) * 760, py = 250 + hash(j * 6.3) * 1150, a = (hash(j * 2.7) - .5) * 1.3 + (j % 2 ? PI : 0), ux = Math.cos(a), uy = Math.sin(a);
    if (u > tj + .15) { X.strokeStyle = MATCHA5; X.globalAlpha = .2; X.lineWidth = 5; X.beginPath(); X.moveTo(px - ux * 1500, py - uy * 1500); X.lineTo(px + ux * 1500, py + uy * 1500); X.stroke(); X.globalAlpha = 1; }
    slash(px - ux * 800, py - uy * 800, a, 1600, seg(u, tj, tj + .5), 16, MATCHA5, MATCHA9); zipBill(px - ux * 800, py - uy * 800, a, 1600, seg(u, tj, tj + .5), 1.3, t);
  }
  const lk = seg(u, 1.55, 1.9); if (lk > 0) { const h = 150, w = logoW(h); X.save(); X.translate(452, 330); X.scale(back(lk), back(lk)); logoPrimer(X, -w / 2, -h / 2, h); X.restore(); }
  const hk = seg(u, 1.95, 2.3); if (hk > 0) {
    X.save(); X.translate((1 - eo(hk)) * -900, 0); X.font = 'italic 900 92px Kanit'; X.textAlign = 'center'; X.textBaseline = 'alphabetic'; X.fillStyle = MATCHA5; X.fillText('Download Artosku', 458, 606); X.fillStyle = INK; X.fillText('Download Artosku', 452, 600);
    X.font = '800 46px Inter'; X.fillStyle = MATCHA9; X.fillText('Pencatat Keuanganmu', 452, 708); X.restore();
  }
  const uk = eo(seg(u, 6.3, 6.55)); if (uk > 0) { X.strokeStyle = MATCHA9; X.lineWidth = 12; X.lineCap = 'round'; X.beginPath(); X.moveTo(70, 640); X.lineTo(lerp(70, 836, uk), lerp(640, 626, uk)); X.stroke(); } slash(40, 641, -.018, 860, seg(u, 6.3, 6.75), 22, MATCHA5, '#fff'); zipBill(40, 641, -.018, 860, seg(u, 6.3, 6.75), 1.2, t);
  const bk = seg(u, 2.35, 2.7); if (bk > 0) {
    const s = back(bk) * (1 + .03 * Math.sin(q12(t) * 8.38)); X.save(); X.translate(452, 840); X.scale(s, s);
    X.fillStyle = INK; X.beginPath(); X.roundRect(-280, -66, 560, 132, 66); X.fill(); X.save(); X.clip(); X.fillStyle = '#fff'; X.globalAlpha = .2; const sx = -500 + ((u * .6) % 1) * 1100; X.beginPath(); X.moveTo(sx, -80); X.lineTo(sx + 70, -80); X.lineTo(sx + 20, 80); X.lineTo(sx - 50, 80); X.fill(); X.restore();
    X.fillStyle = MATCHA5; X.beginPath(); X.moveTo(-196, -34); X.lineTo(-136, 0); X.lineTo(-196, 34); X.closePath(); X.fill();
    X.fillStyle = '#fff'; X.font = '800 60px Inter'; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText('Play Store', -106, 4); X.restore();
  }
  const mk = eo(seg(u, 1.7, 2.1)), hop = 30 * Math.abs(Math.sin(q12(t) * 8.38));
  hero({ x: 452, y: 1540 + (1 - mk) * 800, s: 2.0, t, pose: { mood: 'joy', wingRight: -3.9, wingLeft: -.3 - .5 * Math.abs(Math.sin(q12(t) * 8.38)), lift: hop }, kat: 0, wind: 1 });
  for (let i = 0; i < 4; i++) star(130 + hash(i * 9.1) * 700, 980 + hash(i * 4.4) * 380, 60, ((u * .8 + hash(i * 2)) % 1), MATCHA5);
}
function s9(t) {
  const u = t - 31.5, ux = Math.cos(BA), uy = Math.sin(BA), nx = -uy, ny = ux, cx = 540, cy = 960;
  if (u < 1.7) {
    X.save(); G.save(); dawn(31.5); X.restore(); G.restore();
    const sx = snapC.getContext('2d'), sg = snapG.getContext('2d'); sx.drawImage(sc, 0, 0); sg.drawImage(glc, 0, 0); fillAll('#000', 1, G);
  }
  cta(t, u);
  if (u < 1.7) {
    for (let b = 0; b < 6; b++) {
      const sl = (b % 2 ? 1 : -1) * ei(seg(u, .92 + b * .035, 1.62)) * 2300;
      [[X, snapC], [G, snapG]].forEach(([c, im]) => { c.save(); c.translate(ux * sl, uy * sl); c.beginPath(); const R = 2600, a = OFF[b], d = OFF[b + 1];
        c.moveTo(cx - ux * R + nx * a, cy - uy * R + ny * a); c.lineTo(cx + ux * R + nx * a, cy + uy * R + ny * a); c.lineTo(cx + ux * R + nx * d, cy + uy * R + ny * d); c.lineTo(cx - ux * R + nx * d, cy - uy * R + ny * d); c.closePath(); c.clip(); c.drawImage(im, 0, 0); c.restore(); });
    }
    for (let j = 0; j < 5; j++) {
      const o = OFF[ORD[j]], dir = j % 2 ? -1 : 1, x0 = cx + nx * o - ux * dir * 1000, y0 = cy + ny * o - uy * dir * 1000, k = seg(u, j * .2, j * .2 + .45);
      if (u > j * .2 + .08 && u < .95) each(c => { c.strokeStyle = '#fff'; c.lineWidth = 5; c.beginPath(); c.moveTo(cx + nx * o - ux * 1100, cy + ny * o - uy * 1100); c.lineTo(cx + nx * o + ux * 1100, cy + ny * o + uy * 1100); c.stroke(); });
      slash(x0, y0, dir > 0 ? BA : BA + PI, 2000, k, 30); zipBill(x0, y0, dir > 0 ? BA : BA + PI, 2000, k, 2.2, t);
    }
  }
}

// ───────── jadwal
const SCENES = [[0, s1], [3, s2], [4.5, s3a], [6.75, s3b], [8.25, s3c], [10.5, s3d], [12, s4], [16.5, s5], [21, s6], [24, s7], [28.5, dawn], [31.5, s9]];
const SHAKE = [[.85, 5, .35, 1], [1.2, 18, .4], [4.65, 5, 2.1, 1], [7.875, 20, .35], [8.4, 5, .95, 1], [9.375, 6, 1.0, 1], [10.62, 24, .4], [11.55, 6, .45, 1], [12.2, 9, 2.1, 1], [14.6, 28, 1.0], [15.6, 7, .9, 1], [16.9, 28, .4], [17.45, 28, .4], [17.8, 8, 1.2, 1], [19.12, 32, .45], [19.5, 18, .3], [22.5, 5, 1.5, 1], [24.96, 11, 1.44, 1], [27.3, 14, .45], [27.75, 32, .7]];
const FLASH = [[1.2, .2], [4.5, .2], [6.75, .12], [8.25, .15], [9.375, .12], [10.5, .15], [11.25, .2], [12.0, .1], [14.6, .2], [16.5, .1], [21.75, .15], [22.5, .2], [25.0, .14], [25.45, .12], [25.9, .12], [26.35, .14], [28.5, .7]];
const saldo = t => t < 4.65 ? 5000000 : t < 6.75 ? 5000000 - (Math.floor((t - 4.65) / .1875 + 1e-6) + 1) * 185000 : t < 8.25 ? 2780000 - Math.floor((t - 6.75) / .125) * 40000 : Math.max(640000, 2300000 - Math.floor((t - 8.25) / .105) * 80000);
const rp = n => 'Rp ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
function overlay(t) {
  if (t < 2.0) chrome('GAJIAN!', 470, 380, 190, seg(t, 0, .16), { neon: '#2fbf5a' });
  if (t >= 2.0 && t < 4.5) { chrome('UANGNYA', 470, 290, 132, seg(t, 2.0, 2.16)); chrome('KABUR?!', 470, 452, 164, seg(t, 2.1, 2.26)); }
  if (t >= 4.5 && t < 12) {
    X.font = '900 36px Inter'; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.lineJoin = 'round'; X.strokeStyle = '#1a0b33'; X.lineWidth = 10; X.strokeText('SALDO', 62, 96); X.fillStyle = '#fff'; X.fillText('SALDO', 62, 96);
    chrome(rp(saldo(t)), 58, 196, 92, 1, { align: 'left', neon: '#ff2d2d' });
  }
  if (t >= 14.7 && t < 17.95) { chrome('TANGGAL TUA', 462, 150, 98, seg(t, 14.7, 14.9), { neon: '#ff2d2d' }); chrome('MENYEDOT GAJIMU', 462, 252, 82, seg(t, 14.82, 15.02), { neon: '#ff2d2d' }); }
  if (t >= 19.6 && t < 21) { chrome('SALDO', 462, 960, 110, seg(t, 19.6, 19.75), { neon: '#ff2d2d' }); chrome('Rp 0', 462, 1160, 210, seg(t, 19.7, 19.85), { neon: '#ff2d2d' }); }
  if (t >= 21.42 && t < 23.97) chrome('SAATNYA MENCATAT', 456, 250, 80, seg(t, 21.42, 21.6), { neon: '#2fbf5a' });
  if (t >= 25.0 && t < 27.5) chrome('SEMUA TERCATAT!', 462, 232, 94, seg(t, 25.0, 25.16), { neon: '#2fbf5a' });
  if (t >= 28.9 && t < 31.92) { chrome('TAHU KE MANA', 462, 250, 96, seg(t, 28.9, 29.1), { neon: '#2fbf5a' }); chrome('UANGMU PERGI', 462, 362, 96, seg(t, 29.05, 29.25), { neon: '#2fbf5a' }); }
}
window.TEXTS = t => {
  const r = [], add = (id, text, x0, y0, x1, y1, pass) => r.push({ id, text, x0, y0, x1, y1, pass });
  if (t < 2.0) add('h0', 'GAJIAN!', 110, 210, 830, 400);
  if (t >= 2.0 && t < 4.5) add('h1', 'UANGNYA', 150, 180, 790, 300);
  if (t >= 2.1 && t < 4.5) add('h2', 'KABUR?!', 130, 320, 810, 470);
  if (t >= 4.5 && t < 12) add('cnt', 'SALDO Rp', 50, 60, 700, 210, true);
  if (t >= 14.7 && t < 17.95) add('b1', 'TANGGAL TUA MENYEDOT GAJIMU', 60, 60, 870, 262);
  if (t >= 19.7 && t < 21) add('z0', 'SALDO Rp 0', 150, 860, 780, 1170, true);
  if (t >= 21.42 && t < 23.97) add('j1', 'SAATNYA MENCATAT', 60, 180, 860, 260);
  if (t >= 25.0 && t < 27.5) add('j2', 'SEMUA TERCATAT!', 60, 152, 870, 242);
  if (t >= 28.9 && t < 31.92) add('d1', 'TAHU KE MANA UANGMU PERGI', 90, 160, 840, 372);
  if (t >= 33.05) add('logo', 'Artosku', 180, 250, 720, 410);
  if (t >= 33.45) add('dl', 'Download Artosku', 40, 520, 860, 610);
  if (t >= 33.45) add('tg', 'Pencatat Keuanganmu', 200, 664, 710, 720);
  if (t >= 33.85) add('ps', 'Play Store', 170, 774, 734, 906);
  return r;
};
window.DUR = 39;
// peristiwa suara (dibaca mix.py)
const EV = [{ t: 0, type: 'wind', d: 3.0 }, { t: .02, type: 'slam' }, { t: .3, type: 'ding' }, { t: .86, type: 'rattle' }, { t: 1.2, type: 'burst' }, { t: 1.25, type: 'flutter', d: 1.7 }, { t: 2.0, type: 'slam' }, { t: 3.4, type: 'eyes' }, { t: 3.7, type: 'zip', i: 2 }, { t: 3.84, type: 'zip', i: 4 }, { t: 3.98, type: 'ting' }];
for (let i = 0; i < 12; i++) EV.push({ t: HIT_A(i), type: 'munch', i });
for (let i = 0; i < 6; i++) EV.push({ t: OB(i) - .15, type: i % 2 ? 'duck' : 'hop', i });
for (let j = 0; j < 7; j++) EV.push({ t: KT(j), type: 'kick', i: j });
EV.push({ t: 7.6, type: 'zip', i: 5 }, { t: 7.875, type: 'bigcut' });
for (let k = 0; k < 3; k++) EV.push({ t: 8.319 + k * .375, type: 'hop', i: k }, { t: 8.506 + k * .375, type: 'step', i: k });
for (let i = 0; i < 4; i++) EV.push({ t: 8.4 + i * .21, type: 'munch', i: i + 3, soft: 1 });
EV.push({ t: 9.375, type: 'grind', d: .9 }); for (let i = 0; i < 3; i++) EV.push({ t: 9.55 + i * .21, type: 'munch', i: i + 1, soft: 1 });
EV.push({ t: 10.3, type: 'zip', i: 5 }, { t: 10.62, type: 'land' }, { t: 10.64, type: 'crash' }, { t: 11.25, type: 'click' }, { t: 11.25, type: 'suck', d: .75 }, { t: 11.5, type: 'rumble', d: 3.1 }, { t: 14.2, type: 'ignite' }, { t: 14.6, type: 'roar' }, { t: 14.6, type: 'suck', d: 1.9 }, { t: 14.7, type: 'slam' }, { t: 14.9, type: 'flutter', d: 1.5 });
EV.push({ t: 16.83, type: 'zip', i: 1 }, { t: 16.9, type: 'boom' }, { t: 17.38, type: 'zip', i: 3 }, { t: 17.45, type: 'boom' }, { t: 17.6, type: 'zip', i: 4 });
for (let j = 0; j < 6; j++) EV.push({ t: 17.8 + j * .2, type: 'grab', i: j });
EV.push({ t: 19.0, type: 'suck', d: .5 }, { t: 19.12, type: 'boom' }, { t: 19.5, type: 'gulp' }, { t: 20.3, type: 'laugh' });
EV.push({ t: 21.375, type: 'coinglow' }, { t: 21.42, type: 'slam' }, { t: 21.75, type: 'eyes' }, { t: 22.5, type: 'aura', d: 1.5 }, { t: 24.0, type: 'dash' }, { t: 24.75, type: 'bigcut' }, { t: 25.0, type: 'slam' });
for (let j = 0; j < 13; j++) EV.push({ t: 24 + GL(j).t, type: 'gridline', i: j });
for (let j = 0; j < 30; j += 2) EV.push({ t: 24 + BC(j).t, type: 'snap', i: j });
EV.push({ t: 27.0, type: 'click' }, { t: 27.3, type: 'crack' }, { t: 27.75, type: 'explode' }, { t: 27.85, type: 'coins', n: 26 }, { t: 28.55, type: 'shimmer' }, { t: 29.0, type: 'coins', n: 12, slow: 1 });
for (let i = 0; i < 28; i += 3) EV.push({ t: 28.8 + i * .055, type: 'snap', i, soft: 1 });
for (let j = 0; j < 5; j++) EV.push({ t: 31.5 + j * .2, type: 'bigcut', i: j, soft: 1 });
EV.push({ t: 32.42, type: 'slide' }, { t: 33.05, type: 'pop' }, { t: 33.45, type: 'whoosh' }, { t: 33.85, type: 'pop' });
for (let j = 0; j < 15; j++) EV.push({ t: 33.25 + j * .375, type: 'cutsoft', i: j });
EV.push({ t: 37.8, type: 'bigcut', i: 2, soft: 1 }, { t: 38.0, type: 'ding' });
window.EV = EV.sort((a, b) => a.t - b.t);

window.render = (t) => {
  t = clamp(t, 0, 38.999); const fr = Math.round(t * 24);
  for (const c of [X, G]) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.save(); }
  let sx = 0, sy = 0; for (const [t0, a, d, flat] of SHAKE) { const k = (t - t0) / d; if (k >= 0 && k < 1) { const m = a * (flat ? 1 : (1 - k) * (1 - k)); sx += (hash(fr * 1.31 + t0) - .5) * 2 * m; sy += (hash(fr * 2.77 + t0) - .5) * 2 * m; } }
  if (sx || sy) each(c => { c.translate(sx, sy); c.translate(W / 2, H / 2); c.scale(1.04, 1.04); c.translate(-W / 2, -H / 2); });
  let f = SCENES[0][1]; for (const [t0, fn] of SCENES) if (t >= t0) f = fn; f(t);
  X.restore(); G.restore(); X.setTransform(1, 0, 0, 1, 0, 0); G.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; G.globalAlpha = 1;
  overlay(t);
  for (const [t0, d] of FLASH) { const k = (t - t0) / d; if (k >= 0 && k < 1) { fillAll('#fff', (1 - k) * (1 - k)); fillAll('#fff', (1 - k) * .4, G); } }
  if (RAW) octx.drawImage(sc, 0, 0);
  else { const light = t >= 32.5, day = t < 3 || (t >= 4.5 && t < 7.875); post.render(sc, glc, fr, null, light ? { scan: .05, grille: .02, bloom: .35, halo: .06, sk: 0, bleed: 3, rshift: 1, corner: .12, noiseA: .012, lift: 0, contrast: .05, expo: 1, tint: [1, 1, 1] } : { scan: .11, grille: .035, bleed: 5, rshift: 1.5, bloom: (t >= 24.9 && t < 27.3) ? .34 : day ? .5 : .8, halo: (t >= 24.9 && t < 27.3) ? .1 : day ? .14 : .22, corner: .24, noiseA: .009 }); }
};
window.READY = true;
