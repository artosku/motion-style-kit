// Minyam Samurai: 1 vs 1000 Pengeluaran. 1080x1920, 39 detik, 160 BPM (1 bar = 1,5 detik).
import { clamp, lerp, seg, ss, eo, ei, eio, back, hash, TAU } from '/core/lib.js';
import { makePost } from '/core/post/crt.js';
import { W, H, GY, sc, glc, tmp, mkc, X, G, T, q12, INK, MATCHA9, MATCHA5, NEON, buildPlates, bg, ground, hero, monster, mon, split, boss, slash, arcSlash, radial, lines, sparks, coin, star, dust, chrome, logoPrimer, logoW, PL } from './art.js';

const PI = Math.PI, Q = new URLSearchParams(location.search), RAW = Q.get('raw') === '1';
const out = document.getElementById('c'); out.width = W; out.height = H;
await document.fonts.load('italic 900 80px Kanit'); await document.fonts.load('600 32px Inter'); await document.fonts.load('800 32px Inter'); await document.fonts.load('900 32px Inter');
buildPlates();
const post = RAW ? null : makePost(out), octx = RAW ? out.getContext('2d') : null;
const snapC = mkc(W, H), snapG = mkc(W, H);

const each = fn => { fn(X); fn(G); };
const zoom = (z, cx, cy) => each(c => { c.translate(cx, cy); c.scale(z, z); c.translate(-cx, -cy); });
const B = (x, y, s, o) => { boss(X, x, y, s, o); boss(G, x, y, s, o); };
const fillAll = (col, a = 1, c = X) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); };
function impact() {             // impact frame: siluet monokrom terbalik
  T.setTransform(1, 0, 0, 1, 0, 0); T.clearRect(0, 0, W, H); T.filter = 'grayscale(1) contrast(5) invert(1)'; T.drawImage(sc, 0, 0); T.filter = 'none';
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(tmp, 0, 0); X.restore(); fillAll('#fff', .22, G);
}
const darkBg = (a = '#0a0418', b = '#3a1458') => { const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); X.fillStyle = g; X.fillRect(-60, -60, W + 120, H + 120); };

// ───────── 1. Pembuka: crane turun, gerombolan menyala (0–3,0)
function s1(t) {
  const cam = lerp(520, 0, eo(seg(t, 0, 1.9)));
  zoom(1 + .06 * ss(seg(t, 1.8, 3)), 430, 1250);
  bg('dusk', { cam, ox: t * 40, between: () => {
    for (let i = 0; i < 240; i++) {            // kawanan jauh: titik mata
      const x = hash(i * 1.7) * W, y = 1075 + hash(i * 3.9) * 150 + cam * .5, on = seg(t, .5 + x / W * .9 + hash(i) * .3, .8 + x / W * .9 + hash(i) * .3);
      if (on <= 0) continue; each(c => { c.fillStyle = '#ffd84a'; c.globalAlpha = on * (c === G ? .7 : 1) * (.6 + .4 * Math.sin(q12(t) * 9 + i)); c.fillRect(x, y, 5, 4); c.fillRect(x + 9, y, 5, 4); c.globalAlpha = 1; });
    }
  } });
  for (let r = 0; r < 4; r++) for (let i = 0; i < 11 - r * 2; i++) {
    const n = 11 - r * 2, x = (i + .5 + (r % 2) * .25) / n * (W + 120) - 60, on = seg(t, .75 + i / n * .9 + r * .14, 1.0 + i / n * .9 + r * .14);
    const y = 1175 + r * 58 + cam * (.82 + r * .05) + (1 - eo(on)) * 90 + Math.sin(q12(t) * 7 + i * 1.7 + r) * 5;
    mon(x, y, .62 + r * .2, i + r * 3, { notag: r < 3, eye: on });
  }
  ground('dusk', { cam, y: 1440 });
  hero({ x: 420, y: 1445 + cam, s: 1.75, t, pose: { view: 'back', wingRight: -.4 }, kat: .1, wind: 1.4 });
  X.fillStyle = '#0c0518'; for (let i = 0; i < 30; i++) { const x = i * 40 - 20 + hash(i) * 20, h = 70 + hash(i * 3.3) * 110, sw = Math.sin(q12(t) * 5 + i) * 14, y = 1960 + cam * 1.3; X.beginPath(); X.moveTo(x - 12, y); X.quadraticCurveTo(x, y - h * .6, x + sw, y - h); X.quadraticCurveTo(x + 6, y - h * .5, x + 14, y); X.fill(); }
}
// ───────── 2. Mata dan bilah (3,0–4,5)
function eyesCU(t, u, glow, col) {
  darkBg('#160a34', '#5a1f6e'); lines(t, 26, col, .4, false, 3600);
  const e = u < .4 ? .06 : u < .525 ? .38 : u < .65 ? .72 : 1;
  hero({ x: 480, y: 1745, s: 6 + u * .25, t, pose: { mood: 'frozen', eyes: 'angry', eyeOpen: e, eyeGlow: glow }, wind: 1.3, shadow: false });
  X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = col; const bx = lerp(-500, 1500, seg(u, .1, .95)); X.beginPath(); X.moveTo(bx, 0); X.lineTo(bx + 260, 0); X.lineTo(bx - 140, H); X.lineTo(bx - 400, H); X.fill(); X.restore();
}
function s2(t) {
  const u = t - 3; eyesCU(t, u, 0, '#ff7ac0');
  const bk = eo(seg(u, .72, .95));
  if (bk > 0) {
    X.save(); X.translate(lerp(-1300, 0, bk), 0);
    const P = new Path2D('M-100 1455 L1180 1150 L1180 1238 L-100 1543 Z'); X.fillStyle = '#eaf2ff'; X.fill(P);
    X.fillStyle = '#8e9cc4'; X.beginPath(); X.moveTo(-100, 1508); X.lineTo(1180, 1203); X.lineTo(1180, 1238); X.lineTo(-100, 1543); X.fill();
    X.save(); X.clip(P); X.fillStyle = '#fff'; const hx = lerp(-300, 1400, seg(u, .92, 1.4)); X.beginPath(); X.moveTo(hx, 1100); X.lineTo(hx + 120, 1100); X.lineTo(hx + 20, 1600); X.lineTo(hx - 100, 1600); X.fill(); X.restore();
    X.strokeStyle = '#3a4a7a'; X.lineWidth = 5; X.stroke(P); X.restore();
  }
  star(800, 1240, 150, seg(u, .98, 1.38));
}
// ───────── 3a. Lari menyamping, tebas tiap setengah ketuk (4,5–6,75)
const HIT_A = i => 4.65 + i * .1875;
function s3a(t) {
  const u = t - 4.5, ox = u * 2600;
  bg('dusk', { ox: ox * .3, sunX: 830, sunY: 860, sunR: 220 }); ground('dusk', { ox }); lines(t, 22, '#ffd0f0', .5, false);
  const hx = 330, hy = GY + 20, idx = (t - 4.65) / .1875, i0 = Math.floor(idx), ph = idx - i0, A = [-1.1, .75];
  const kat = idx < 0 ? .75 : lerp(A[((i0 % 2) + 2) % 2], A[(i0 + 1) % 2], eo(seg(ph, .5, 1)));
  const pose = { view: 'side', step: q12(t) * 4.4, tilt: .2, wingRight: -2.2, mood: 'frozen' }, bob = Math.abs(Math.sin(q12(t) * 14)) * 16;
  for (let j = 3; j >= 1; j--) hero({ x: hx - 80 * j, y: hy - bob, s: 1.9, t: t - j * .04, pose, kat, ghost: { col: NEON, a: .34 - j * .08 } });
  for (let i = 0; i < 12; i++) {
    const ti = HIT_A(i), v = t - ti, y = GY - 115 - (i % 3 === 1 ? 150 : 0), s = 1.5;
    if (v < 0) { const x = hx + 260 - v * 2400; if (x < W + 160) mon(x, y + Math.sin(t * 20 + i) * 8, s, i, { rot: Math.sin(t * 14 + i) * .12 }); }
    else if (v < .75) {
      const cx = hx + 260 - v * 620, cy = y - v * 260;
      split(c => monster(c, cx, cy, s, i, { eye: 1 - v }), cx, cy, i % 2 ? .65 : -.65, v * 380 + 10, v * 3.2, v * v * 1500);
      sparks(hx + 250, y, seg(v, 0, .22), 9, i * 7);
      i % 2 ? arcSlash(hx + 250, GY - 190, 215, -1.25, 1.0, seg(t, ti - .06, ti + .17)) : arcSlash(hx + 250, GY - 190, 215, 1.0, -1.25, seg(t, ti - .06, ti + .17));
    }
  }
  hero({ x: hx, y: hy - bob, s: 1.9, t, pose, kat, wind: 1.5 });
}
// ───────── 3b. Kilat zig-zag lalu terbelah serentak (6,75–8,25)
const GRIDM = []; [[560, 3], [770, 4], [980, 3], [1190, 4]].forEach(([y, n], r) => { for (let i = 0; i < n; i++) GRIDM.push({ x: n === 3 ? 230 + i * 250 : 130 + i * 235, y, s: 1.0 + r * .16, k: GRIDM.length }); });
const ZV = [[-140, 1340], [930, 1190], [50, 980], [930, 770], [50, 560], [780, 410], [480, 1330]];
function s3b(t) {
  const u = t - 6.75, v = u - 1.125;
  zoom(1 + .05 * u / 1.5, 480, 900);
  bg('dusk', { cam: -700, sunY: 690, sunR: 300 }); ground('dusk', { y: 520 });
  for (const m of GRIDM) {
    const bob = u < .85 ? Math.sin(q12(t) * 9 + m.k) * 7 : 0, ang = (hash(m.k * 2.3) - .5) * 1.7;
    if (v < 0) mon(m.x, m.y + bob, m.s, m.k, { sy: u < .85 ? 1 : .94 });
    else { split(c => monster(c, m.x, m.y, m.s, m.k, { eye: 1 - v * 2 }), m.x, m.y, ang, eo(v / .35) * 34 + v * 190, v * 1.3, v * v * 1100); slash(m.x - Math.cos(ang) * 190, m.y - Math.sin(ang) * 190, ang, 380, seg(v, -.03, .3), 12); }
  }
  for (let j = 0; j < 6; j++) {
    const st = .1 + j * .12, a = ZV[j], b = ZV[j + 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    slash(a[0], a[1], ang, len, seg(u, st, st + .34), 30);
    const gk = seg(u, st + .08, st + .24); if (gk > 0 && gk < 1 && j < 5) hero({ x: b[0], y: b[1] + 110, s: 1.25, t, pose: { view: 'side', facing: b[0] > a[0] ? 1 : -1, tilt: .25, wingRight: -2.2, mood: 'frozen' }, kat: 0, ghost: { col: '#eaffea', a: .75 * (1 - gk), mix: .7 } });
  }
  if (u >= .82) { hero({ x: 480, y: 1450, s: 1.55, t, pose: { view: 'back', squashY: .9, squashX: 1.06, wingRight: -1.6 }, kat: .2, wind: u < 1.0 ? 1.8 : 1 }); star(640, 1250, 110, seg(u, .88, 1.12)); }
  if (v >= 0 && v < .085) impact();
}
// ───────── 3c. Putaran naik (8,25–10,5)
function s3c(t) {
  const u = t - 8.25, rise = Math.max(0, u - 1.92), hy = 1150 + Math.sin(u * 3) * 30 - rise * rise * 12000, a = q12(u) * TAU * 2.2, cy = hy - 190;
  X.drawImage(PL.dusk, 0, -260 - u * 50);
  X.fillStyle = '#ff7a8a'; for (let i = 0; i < 7; i++) { const y = ((hash(i * 3.1) * 2600 + u * 1700 * (.7 + hash(i))) % 2600) - 300; X.globalAlpha = .22; X.beginPath(); X.ellipse(hash(i * 7.3) * W, y, 70 + hash(i) * 60, 300, 0, 0, TAU); X.fill(); } X.globalAlpha = 1;
  lines(t, 30, '#ffd0f0', .45, true, 4200);
  for (let i = 0; i < 18; i++) {
    const ti = 8.4 + i * .105, v = t - ti, x = (i % 2 ? 775 : 185) + (hash(i * 1.9) - .5) * 70, s = 1.35;
    if (v < 0) { const y = 1000 + v * 1900; if (y > -160) mon(x, y, s, i + 2, { rot: Math.sin(t * 9 + i) * .3 }); }
    else if (v < .6) { const yy = 1000 + v * 520; split(c => monster(c, x, yy, s, i + 2, { eye: 1 - v }), x, yy, (i % 2 ? -.5 : .5) + hash(i) * .4, v * 380 + 8, v * 4, v * v * 1700); sparks(x, 1000, seg(v, 0, .2), 8, i * 5); }
  }
  each(c => { c.lineCap = 'round'; for (let j = 0; j < 2; j++) for (const [w, col, al] of [[46, NEON, .5], [18, c === G ? NEON : '#fff', .95]]) { c.strokeStyle = col; c.globalAlpha = al; c.lineWidth = w; c.beginPath(); c.arc(480, cy, 318, a + j * PI - 2.3, a + j * PI - .15); c.stroke(); } c.globalAlpha = 1; });
  const pose = { mood: 'frozen', eyes: 'angry', wingRight: -2.6, wingLeft: -1.6 };
  for (let j = 2; j >= 1; j--) hero({ x: 480, y: hy, s: 2, t, rot: a - j * .55, pose, kat: 0, ghost: { col: NEON, a: .3 - j * .09 } });
  hero({ x: 480, y: hy, s: 2, t, rot: a, pose, kat: 0, wind: 1.6 });
}
// ───────── 3d. Mendarat, belahan pecah jadi koin (10,5–12,0)
function s3d(t) {
  const u = t - 10.5, v = u - .75;
  bg('dusk', { ox: 300 }); ground('dusk', { y: 1420 });
  for (let i = 0; i < 22; i++) {
    const px = 70 + hash(i * 3.3) * 800, py = 250 + hash(i * 5.1) * 640 + u * 26, ang = (hash(i * 2.2) - .5) * 2;
    if (v < 0) split(c => monster(c, px, py, 1.05, i, { notag: true, eye: .5 }), px, py, ang, 22 + u * 14, u * .25, 0);
    else { sparks(px, py, seg(v, 0, .3), 8, i * 7, '#ffd84a', 130); for (let j = 0; j < 3; j++) { const y = py + v * v * 1500 - 260 * v * (.5 + hash(i + j)); if (y < 1400) coin(px + (j - 1) * 46 * (1 + v * 2), y, 22, v * 10 + j + i); } }
  }
  const ld = seg(u, 0, .12), hy = lerp(-320, 1420, ld * ld), w = Math.max(0, u - .12), sq = u < .12 ? 1.12 : 1 - .3 * Math.exp(-w * 9) * Math.cos(w * 22);
  dust(480, 1420, seg(u, .12, .75), 12, 3);
  hero({ x: 480, y: hy, s: 2.3, t, pose: { mood: 'frozen', squashY: sq, squashX: 1 / Math.sqrt(sq), eyes: u > 1.22 ? 'shock' : 'angry', eyeOpen: u < .75 ? .1 : null, lookY: u > 1.1 ? -1.2 : 0, wingRight: -.2 }, kat: 0, wind: u < .5 ? 2 : 1 });
  star(690, 1405, 120, seg(u, .73, 1.0));
  const dk = ss(seg(u, 1.0, 1.45)); if (dk > 0) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(8,3,20,${.85 * dk})`); g.addColorStop(clamp(dk * 1.2, .01, 1), `rgba(8,3,20,${.55 * dk})`); g.addColorStop(1, `rgba(8,3,20,${.2 * dk})`); X.fillStyle = g; X.fillRect(0, 0, W, H); X.restore(); }
}
// ───────── 4. Bos naik dan meraung (12,0–16,5)
function s4(t) {
  const u = t - 12, cam = 260 * ss(seg(u, .2, 2.0)) - 140 * ss(seg(u, 2.9, 3.6)), r = ss(seg(q12(u), .2, 2.2));
  const roar = seg(u, 2.6, 2.75) * (1 - seg(u, 3.5, 3.95)), by = lerp(1900, 328, r) + cam * .6, eye = seg(u, 2.2, 2.35), br = Math.sin(q12(t) * 3) * 6;
  const arm = sd => [sd * lerp(360, 440, roar), lerp(520, 120, roar)];
  bg('dark', { cam, sunY: 640, sunR: 340, between: () => {
    if (roar > 0) radial(480, by + 700, t, 34, '#ff3d7a', .3 * roar, 560);
    B(480, by + br, 1.45, { mouth: .12 + .88 * roar, eye, hl: arm(-1), hr: arm(1) });
    if (u < 2.3) dust(480, 1230 + cam * .78, (u * 2.5) % 1, 10, Math.floor(u * 2.5) * 9, '#4a2a6a');
  } });
  ground('dark', { cam: cam * .25, y: 1440 });
  for (let j = 0; j < 3; j++) { const k = seg(u, 2.6 + j * .2, 3.3 + j * .2); if (k > 0 && k < 1) each(c => { c.strokeStyle = c === G ? '#ff2d6f' : '#fff'; c.globalAlpha = 1 - k; c.lineWidth = 22 * (1 - k) + 4; c.beginPath(); c.ellipse(480, by + 720, k * 1000, k * 760, 0, 0, TAU); c.stroke(); c.globalAlpha = 1; }); }
  hero({ x: 480, y: 1450 + cam * .25, s: 1.3, t, pose: { view: 'back', squashY: 1 - .07 * roar, wingRight: -.5 }, kat: .15, wind: 1 + roar * 2 });
  if (u >= 2.6 && u < 2.685) impact();
}
// ───────── 5. Dihajar: hindar, tebasan mental, terpental (16,5–21,0)
const PT = [[300, 830], [690, 720], [320, 600], [670, 960], [470, 660], [480, 840]];
function s5(t) {
  const u = t - 16.5, lean = ss(seg(u, 3.8, 4.4)), bs = 1.45 + .15 * lean, by = 400 - 70 * lean + Math.sin(q12(t) * 3) * 6;
  const L = (sx, sy) => [(sx - 480) / bs, (sy - by) / bs];
  const slam = (u0, tg, rest, up) => { const a = eo(seg(u, u0, u0 + .3)), b = seg(u, u0 + .3, u0 + .4), c = ss(seg(u, u0 + .55, u0 + .85)); let p = [lerp(rest[0], up[0], a), lerp(rest[1], up[1], a)]; p = [lerp(p[0], tg[0], b * b), lerp(p[1], tg[1], b * b)]; return [lerp(p[0], rest[0], c), lerp(p[1], rest[1], c)]; };
  let hl = slam(0, L(300, 1340), [-360, 520], [-440, 40]), hr = slam(.55, L(700, 1340), [360, 520], [440, 40]);
  if (u > 2.4) { const k = eo(seg(u, 2.4, 2.62)), k2 = seg(u, 2.62, 2.85), k3 = ss(seg(u, 3.0, 3.5)), a = L(980, 640), b = L(160, 900); let p = [lerp(360, a[0], k), lerp(520, a[1], k)]; p = [lerp(p[0], b[0], k2), lerp(p[1], b[1], k2)]; hr = [lerp(p[0], 360, k3), lerp(p[1], 520, k3)]; }
  const mouth = u > 3.8 ? .3 + .35 * (Math.sin(q12(t) * 20) > 0 ? 1 : 0) : u > 1.3 && u < 2.5 ? .28 : .1;
  bg('dark', { cam: 120, sunY: 640, sunR: 340 }); ground('dark', { y: 1440 });
  B(480, by, bs, { mouth, eye: 1, hl, hr });
  dust(300, 1420, seg(u, .4, .9), 10, 21, '#4a2a6a'); dust(700, 1420, seg(u, .95, 1.45), 10, 33, '#4a2a6a');
  const GH = (x, y, s, pose, a) => hero({ x, y, s, t, pose, kat: 0, ghost: { col: NEON, a } });
  if (u < 1.1) {
    const d1 = seg(u, .33, .41), d2 = seg(u, .88, .96), x = lerp(lerp(300, 700, eo(d1)), 250, eo(d2)), pose = { mood: 'frozen', eyes: u > .3 ? 'angry' : 'shock', wingRight: -1, lookY: -1 };
    if (d1 > 0 && d1 < 1.4 && u < .6) for (let j = 1; j <= 3; j++) GH(lerp(300, 700, j / 4), 1430, 1.5, pose, .3);
    if (d2 > 0 && u < 1.1) for (let j = 1; j <= 3; j++) GH(lerp(700, 250, j / 4), 1430, 1.5, pose, .3 * (1 - seg(u, .96, 1.1)));
    hero({ x, y: 1430, s: 1.5, t, pose, kat: 0, wind: 1.6 });
  } else if (u < 2.62) {
    const j = clamp(Math.floor((u - 1.3) / .2), 0, 5), p = PT[j], f = p[0] < 480 ? 1 : -1, ts = 1.3 + j * .2, jm = eo(seg(u, 1.1, 1.3));
    const x = u < 1.3 ? lerp(250, p[0], jm) : p[0] - f * 40 * seg(u, ts + .05, ts + .2), y = u < 1.3 ? lerp(1430, p[1], jm) : p[1], pose = { view: 'side', facing: f, tilt: .3, wingRight: -2.2, mood: 'frozen' };
    if (j > 0) { const q = PT[j - 1]; GH(q[0], q[1] + 100, 1.3, Object.assign({}, pose, { facing: q[0] < 480 ? 1 : -1 }), .4 * (1 - seg(u, ts, ts + .18))); }
    if (u < 1.3) for (let k = 1; k <= 3; k++) GH(lerp(250, p[0], jm * k / 4), lerp(1430, p[1], jm * k / 4) + 100, 1.3, pose, .25);
    hero({ x, y: y + 100, s: 1.3, t, pose, kat: lerp(-1, .8, eo(seg(u, ts - .05, ts + .08))), wind: 1.6, shadow: false });
    for (let k = 0; k <= j; k++) { const q = PT[k], g = q[0] < 480 ? 1 : -1, tk = 1.3 + k * .2; slash(q[0] + g * 30, q[1] - 170, g > 0 ? .55 : PI - .55, 380, seg(u, tk, tk + .24), 22); sparks(q[0] + g * 190, q[1] - 30, seg(u, tk + .04, tk + .3), 14, k * 11, '#ffe66a', 170); star(q[0] + g * 190, q[1] - 30, 90, seg(u, tk + .03, tk + .22), '#ffe9a0'); }
  } else {
    const k = seg(u, 2.62, 3.0), up = ss(seg(q12(u), 3.8, 4.25)), x = lerp(480, 200, k), y = lerp(940, 1430, k * k) - Math.sin(clamp((u - 3.0) / .3) * PI) * 60;
    if (u < 3.0) { for (let j = 1; j <= 3; j++) GH(lerp(480, x, j / 4), lerp(940, y, j / 4), 1.5, { eyes: 'dizzy' }, .25); hero({ x, y, s: 1.5, t, rot: -k * TAU * 1.5, pose: { mood: 'frozen', eyes: 'dizzy' }, kat: 0 }); }
    else hero({ x, y, s: 1.5, t, pose: up < 1 ? { mood: 'frozen', eyes: 'dizzy', stars: 1 - up, sweat: 1, tilt: -1.25 * (1 - up) } : { mood: 'sad', eyes: 'sadClosed', sweat: .7 }, kat: 0, wind: .6 });
    dust(200, 1430, seg(u, 3.0, 3.5), 8, 51, '#4a2a6a');
  }
  if (u >= 2.62 && u < 2.705) impact();
  if (lean > 0) fillAll('#05020f', .3 * lean);
}
// ───────── 6. Mengisi jurus (21,0–24,0)
function s6(t) {
  const u = t - 21;
  if (u < .75) {
    darkBg('#05020f', '#2a1244'); X.fillStyle = '#ffd84a'; for (let i = 0; i < 9; i++) { X.globalAlpha = .1; X.beginPath(); X.arc(hash(i * 3.7) * W, hash(i * 5.3) * H + u * 60, 60 + hash(i) * 90, 0, TAU); X.fill(); } X.globalAlpha = 1;
    const z = 7 + u * .7, gk = seg(u, .375, .75);
    hero({ x: 480, y: 950 + 40 * z, s: z, t: 0, pose: { mood: 'frozen' }, shadow: false, wind: 0 });
    X.save(); X.beginPath(); X.arc(480, 950, 22 * z, 0, TAU); X.clip(); X.globalAlpha = .7; X.fillStyle = '#fff'; const hx = 480 + lerp(-360, 360, seg(u, .32, .72)); X.beginPath(); X.moveTo(hx, 700); X.lineTo(hx + 70, 700); X.lineTo(hx - 30, 1200); X.lineTo(hx - 100, 1200); X.fill(); X.restore();
    G.fillStyle = '#ffd84a'; G.globalAlpha = gk * .8; G.beginPath(); G.arc(480, 950, 22 * z, 0, TAU); G.fill(); G.globalAlpha = 1;
    star(600, 840, 170, seg(u, .42, .75), '#ffe9a0');
  } else if (u < 1.5) {
    const w = u - .75; eyesCU(-t, w + (w < .375 ? .4 : .3), 0, NEON); star(650, 1000, 150, seg(w, .36, .7), NEON);
  } else {
    const w = u - 1.5, fr = Math.floor(t * 12), pul = 1 + .025 * Math.sin(fr * 2.1);
    darkBg('#05020f', '#1c0d3d'); boss(X, 480, 120, 1.75, { eye: 1, mouth: .3 }); boss(G, 480, 120, 1.75, { eye: .6 }); fillAll('#05020f', .6);
    lines(-t, 26, NEON, .4, true, 3000);
    const gr = seg(w, 0, .5);
    each(c => { for (let i = 0; i < 11; i++) { const x = 480 + (i - 5) * 62, h = (240 + hash(i + fr * 3.1) * 300) * gr * (1 - Math.abs(i - 5) * .09); c.fillStyle = c === G ? MATCHA9 : NEON; c.globalAlpha = c === G ? .7 : .32; c.beginPath(); c.moveTo(x - 46, 1420); c.quadraticCurveTo(x - 40, 1420 - h * .5, x + (hash(i + fr) - .5) * 40, 1420 - h); c.quadraticCurveTo(x + 40, 1420 - h * .5, x + 46, 1420); c.fill(); } c.globalAlpha = 1; });
    X.fillStyle = '#1c0d3d'; for (let i = 0; i < 16; i++) { const d = hash(i * 2.9), y = 1420 - ((w * 420 * (1 + d)) % 760), sz = 10 + d * 22; X.fillRect(120 + hash(i * 6.1) * 720, y, sz, sz * .7); }
    each(c => { c.fillStyle = NEON; c.globalAlpha = .5 * gr; c.beginPath(); c.ellipse(480, 1425, 330 * gr, 34, 0, 0, TAU); c.fill(); c.globalAlpha = 1; });
    hero({ x: 480, y: 1420, s: 2.4 * pul, t, pose: { mood: 'frozen', eyes: 'angry', eyeGlow: 0, wingRight: lerp(0, -3.6, eo(seg(w, 0, .45))), wingLeft: -.7 }, kat: 0, glow: seg(w, .15, 1.1), wind: 2 });
    star(585, 700, 200, seg(w, .9, 1.4), NEON);
  }
}
// ───────── 7. Jurus pamungkas (24,0–28,5)
const SL = j => ({ t: .96 + j * .031, x: 480 + (hash(j * 3.1) - .5) * 440, y: 880 + (hash(j * 5.7) - .5) * 820, a: hash(j * 9.3) * PI });
const CUTS = [{ x: 480, y: 720, a: -.5 }, { x: 480, y: 1020, a: .35 }, { x: 470, y: 880, a: 1.42 }];
function charge(v) {
  const k = eo(v / .6); darkBg('#05020f', '#2a0b4a'); radial(480, 760, 24 + v, 44, '#fff', .5, 300);
  B(480, lerp(360, 300, k), lerp(1.15, 1.4, k), { eye: 1, mouth: .6, hl: [-430, 180], hr: [430, 180] });
  const pose = { view: 'back', wingRight: -2.8 };
  for (let j = 3; j >= 1; j--) { const kk = eo(clamp(v - j * .05) / .6); hero({ x: 480, y: lerp(1900, 1290, kk), s: lerp(3.2, 1.1, kk), t: 24 + v, pose, kat: -.3, ghost: { col: NEON, a: .3 } }); }
  hero({ x: 480, y: lerp(1900, 1290, k), s: lerp(3.2, 1.1, k), t: 24 + v, pose, kat: -.3, glow: 1, wind: 2, shadow: false });
}
function scars(u, a = .6, w = 5) {
  each(c => { c.strokeStyle = NEON; c.lineWidth = w; c.lineCap = 'round'; c.globalAlpha = a; c.beginPath(); for (let j = 0; j < 44; j++) { const s = SL(j); if (s.t + .2 > u) continue; c.moveTo(s.x - Math.cos(s.a) * 430, s.y - Math.sin(s.a) * 430); c.lineTo(s.x + Math.cos(s.a) * 430, s.y + Math.sin(s.a) * 430); } c.stroke(); c.globalAlpha = 1; });
}
function s7(t) {
  const u = t - 24, fr = Math.floor(u * 12);
  if (u < .75) { charge(Math.min(u, .6)); }
  else if (u < .96) { charge(.6); if (u < .835) { fillAll('#fff'); fillAll('#fff', .5, G); } else { impact(); each(c => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.strokeStyle = c === G ? NEON : '#000'; c.lineWidth = 30; c.beginPath(); c.moveTo(-50, 1540); c.lineTo(1130, 260); c.stroke(); c.restore(); }); } }
  else if (u < 2.4) {
    darkBg(['#12062a', '#2a0b4a', '#0a2a1a'][Math.floor(u * 8) % 3], '#05020f'); radial(480, 880, t, 30, NEON, .2, 600);
    B(480 + (hash(fr * 1.3) - .5) * 26, 300 + (hash(fr * 2.9) - .5) * 20, 1.4, { eye: .5 + .5 * hash(fr), mouth: 1, hl: [-430, 150 + hash(fr) * 60], hr: [430, 150 + hash(fr * 3) * 60] });
    scars(u);
    for (let g = 0; g < 2; g++) { const x = 120 + hash(fr * 3.7 + g * 9) * 720, y = 620 + hash(fr * 5.1 + g * 4) * 760; hero({ x, y, s: 1.25, t, rot: (hash(fr + g) - .5) * 1.2, pose: { view: 'side', facing: x < 480 ? 1 : -1, wingRight: -2.2, mood: 'frozen' }, kat: (hash(fr * 7 + g) - .5) * 2, ghost: { col: g ? '#fff' : NEON, a: .7, mix: g ? .85 : .55 } }); }
    for (let j = 0; j < 44; j++) { const s = SL(j); slash(s.x - Math.cos(s.a) * 780, s.y - Math.sin(s.a) * 780, s.a, 1560, seg(u, s.t, s.t + .42), 20); }
  } else {
    const w = u - 2.4, v = u - 3.3;
    X.save(); G.save(); zoom(1.03 + .035 * Math.min(w, .9) / .9, 300, 1100); each(c => c.translate(-Math.min(w, .9) * 34, 0));
    darkBg('#0a0418', '#3a1458');
    const lb = v > 0 ? seg(v, .25, 1) : 0;
    each(c => { const g = c.createRadialGradient(480, 880, 40, 480, 880, 900 + lb * 900); g.addColorStop(0, c === G ? `rgba(255,220,140,${.5 + lb * .5})` : `rgba(255,${190 + lb * 60},${110 + lb * 140},${.75 + lb * .25})`); g.addColorStop(1, 'rgba(255,120,60,0)'); c.fillStyle = g; c.fillRect(-100, -100, W + 200, H + 200); });
    if (v < 0) { B(480, 300, 1.4, { eye: .25, mouth: 1, hl: [-430, 170], hr: [430, 170] }); scars(9, .55 + .35 * Math.sin(w * 20), 6); }
    else {
      const d = 16 * seg(v, 0, .1) + (v > .45 ? (v - .45) * (v - .45) * 5200 + (v - .45) * 500 : 0), ck = seg(v, 0, .45);
      for (let m = 0; m < 8; m++) {
        let ox = 0, oy = 0; const sg = CUTS.map((c, i) => (m >> i & 1) ? 1 : -1); CUTS.forEach((c, i) => { ox += -Math.sin(c.a) * sg[i] * d; oy += Math.cos(c.a) * sg[i] * d; });
        each(c => { c.save(); c.translate(ox, oy + v * v * 260 * ((m % 3) - 1)); c.translate(480, 880); c.rotate(sg[0] * .16 * seg(v, .45, 1.2)); c.translate(-480, -880);
          CUTS.forEach((q, i) => { const ux = Math.cos(q.a), uy = Math.sin(q.a), nx = -uy * sg[i], ny = ux * sg[i], R = 3000; c.beginPath(); c.moveTo(q.x - ux * R, q.y - uy * R); c.lineTo(q.x + ux * R, q.y + uy * R); c.lineTo(q.x + ux * R + nx * R, q.y + uy * R + ny * R); c.lineTo(q.x - ux * R + nx * R, q.y - uy * R + ny * R); c.closePath(); c.clip(); });
          boss(c, 480, 300, 1.4, { eye: .25 * (1 - seg(v, 0, .4)), mouth: 1, hl: [-430, 170], hr: [430, 170] }); c.restore(); });
      }
      if (v < .6) each(c => { c.strokeStyle = c === G ? '#ffe9a0' : '#fff'; c.lineCap = 'round'; c.lineWidth = lerp(8, 70, ck); c.globalAlpha = 1 - seg(v, .45, .6); c.beginPath(); for (const q of CUTS) { c.moveTo(q.x - Math.cos(q.a) * 700, q.y - Math.sin(q.a) * 700); c.lineTo(q.x + Math.cos(q.a) * 700, q.y + Math.sin(q.a) * 700); } c.stroke(); c.globalAlpha = 1; });
      if (v > .45) for (let i = 0; i < 56; i++) { const a = hash(i * 3.3) * TAU, q = v - .45, r = q * 1900 * (.35 + hash(i * 1.7)); coin(480 + Math.cos(a) * r, 880 + Math.sin(a) * r + q * q * 900, 20 + hash(i) * 14, q * 12 + i); }
    }
    hero({ x: 250, y: 1285, s: 2, t: v < 0 ? 26.4 + w * .25 : t, pose: { view: 'side', facing: -1, tilt: .1, wingRight: w < .6 ? -2.2 : lerp(-2.2, 0, eo(seg(w, .6, .75))), mood: 'frozen' }, kat: w < .6 ? 0 : null, glow: 1 - seg(w, 0, .6) * .7, wind: v < 0 ? 1.2 : 2 });
    star(78, 1155, 150, seg(w, .58, .9), NEON);
    X.restore(); G.restore();
    if (v > .85) { fillAll('#fff', seg(v, .85, 1.15)); fillAll('#fff', seg(v, .85, 1.15) * .5, G); }
  }
}
// ───────── 8. Fajar (28,5–31,5)
function dawn(t) {
  const u = clamp(t - 28.5, 0, 3);
  zoom(1.09 - .09 * ss(u / 3), 480, 1100);
  bg('dawn', { sunY: lerp(1130, 950, ss(u / 3)), sunR: 250, sunX: 240, ox: u * 30 }); ground('dawn', { y: 1440 });
  for (let i = 0; i < 40; i++) { const x = 50 + hash(i * 2.3) * 860, gy = 1420 + hash(i * 4.1) * 330, y = (u - hash(i * 6.7) * 1.6) * (760 + hash(i) * 600) - 100; if (y < -60) continue; y < gy ? coin(x, y, 20 + hash(i * 3) * 10, u * 9 + i) : coin(x, gy, 20 + hash(i * 3) * 10, PI / 2 - .2); }
  hero({ x: 480, y: 1440, s: 2.35, t, pose: { mood: 'joy', flap: .5 + .5 * Math.sin(q12(t) * 14), lift: 34 * Math.abs(Math.sin(q12(t) * 8.38)) }, kat: null, wind: 1 });
  for (let i = 0; i < 5; i++) star(120 + hash(i * 5.5) * 760, 500 + hash(i * 7.7) * 600, 70, ((u * .9 + hash(i)) % 1), '#fff');
}
// ───────── 9. CTA (31,5–39,0)
const BA = -.38, OFF = [-2400, -440, -220, 0, 220, 440, 2400], ORD = [3, 1, 5, 2, 4];
function cta(t, u) {
  X.fillStyle = '#fbfaf6'; X.fillRect(0, 0, W, H);
  X.fillStyle = '#f0f5ea'; X.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + u * .06; X.moveTo(452, 1150); X.lineTo(452 + Math.cos(a) * 2600, 1150 + Math.sin(a) * 2600); X.lineTo(452 + Math.cos(a + .2) * 2600, 1150 + Math.sin(a + .2) * 2600); } X.fill();
  for (let j = 0; j < 15; j++) {
    const tj = 1.75 + j * .375, px = 100 + hash(j * 4.1) * 760, py = 250 + hash(j * 6.3) * 1150, a = (hash(j * 2.7) - .5) * 1.3 + (j % 2 ? PI : 0), ux = Math.cos(a), uy = Math.sin(a);
    if (u > tj + .15) { X.strokeStyle = MATCHA5; X.globalAlpha = .2; X.lineWidth = 5; X.beginPath(); X.moveTo(px - ux * 1500, py - uy * 1500); X.lineTo(px + ux * 1500, py + uy * 1500); X.stroke(); X.globalAlpha = 1; }
    slash(px - ux * 800, py - uy * 800, a, 1600, seg(u, tj, tj + .5), 16, MATCHA5, MATCHA9);
  }
  const lk = seg(u, 1.55, 1.9); if (lk > 0) { const h = 150, w = logoW(h); X.save(); X.translate(452, 330); X.scale(back(lk), back(lk)); logoPrimer(X, -w / 2, -h / 2, h); X.restore(); }
  const hk = seg(u, 1.95, 2.3); if (hk > 0) { X.save(); X.translate((1 - eo(hk)) * -900, 0); X.font = 'italic 900 92px Kanit'; X.textAlign = 'center'; X.textBaseline = 'alphabetic'; X.fillStyle = MATCHA5; X.fillText('Download Artosku', 458, 606); X.fillStyle = INK; X.fillText('Download Artosku', 452, 600); X.restore(); }
  const uk = eo(seg(u, 6.3, 6.55)); if (uk > 0) { X.strokeStyle = MATCHA9; X.lineWidth = 12; X.lineCap = 'round'; X.beginPath(); X.moveTo(70, 640); X.lineTo(lerp(70, 836, uk), lerp(640, 626, uk)); X.stroke(); } slash(40, 641, -.018, 860, seg(u, 6.3, 6.75), 22, MATCHA5, '#fff');
  const bk = seg(u, 2.35, 2.7); if (bk > 0) {
    const s = back(bk) * (1 + .03 * Math.sin(q12(t) * 8.38)); X.save(); X.translate(452, 760); X.scale(s, s);
    X.fillStyle = INK; X.beginPath(); X.roundRect(-280, -66, 560, 132, 66); X.fill(); X.save(); X.clip(); X.fillStyle = '#fff'; X.globalAlpha = .2; const sx = -500 + ((u * .6) % 1) * 1100; X.beginPath(); X.moveTo(sx, -80); X.lineTo(sx + 70, -80); X.lineTo(sx + 20, 80); X.lineTo(sx - 50, 80); X.fill(); X.restore();
    X.fillStyle = MATCHA5; X.beginPath(); X.moveTo(-196, -34); X.lineTo(-136, 0); X.lineTo(-196, 34); X.closePath(); X.fill();
    X.fillStyle = '#fff'; X.font = '800 60px Inter'; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText('Play Store', -106, 4); X.restore();
  }
  const mk = eo(seg(u, 1.7, 2.1)), hop = 30 * Math.abs(Math.sin(q12(t) * 8.38));
  hero({ x: 452, y: 1425 + (1 - mk) * 800, s: 2.45, t, pose: { mood: 'joy', wingRight: -3.9, wingLeft: -.3 - .5 * Math.abs(Math.sin(q12(t) * 8.38)), lift: hop }, kat: 0, wind: 1 });
  star(806, 706 - hop, 70, ((u * .66) % 1), MATCHA5); for (let i = 0; i < 4; i++) star(130 + hash(i * 9.1) * 700, 900 + hash(i * 4.4) * 420, 60, ((u * .8 + hash(i * 2)) % 1), MATCHA5);
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
      slash(x0, y0, dir > 0 ? BA : BA + PI, 2000, k, 30);
    }
  }
}

// ───────── jadwal
const SCENES = [[0, s1], [3, s2], [4.5, s3a], [6.75, s3b], [8.25, s3c], [10.5, s3d], [12, s4], [16.5, s5], [21, s6], [24, s7], [28.5, dawn], [31.5, s9]];
const SHAKE = [[4.65, 5, 2.1, 1], [7.875, 20, .35], [8.4, 6, 1.9, 1], [10.62, 24, .4], [11.55, 6, .45, 1], [12.2, 9, 2.1, 1], [14.6, 28, 1.0], [16.9, 28, .4], [17.45, 28, .4], [17.8, 8, 1.2, 1], [19.12, 32, .45], [19.5, 18, .3], [22.5, 5, 1.5, 1], [24.96, 11, 1.44, 1], [27.3, 14, .45], [27.75, 32, .7]];
const FLASH = [[4.5, .2], [6.75, .12], [8.25, .15], [10.5, .15], [11.25, .22], [12.0, .1], [14.6, .2], [16.5, .1], [21.75, .15], [22.5, .2], [25.0, .14], [25.45, .12], [25.9, .12], [26.35, .14], [28.5, .7]];
const counter = t => t < 4.65 ? 0 : t < 6.75 ? 1 + Math.floor((t - 4.65) / .1875) * 13 : t < 7.875 ? 157 : t < 8.4 ? 480 : Math.min(930, 480 + Math.floor((t - 8.4) / .105) * 25);
function overlay(t) {
  if (t < 4.5) { chrome('1 MINYAM', 470, 270, 128, seg(t, .3, .5)); chrome('VS 1000', 470, 425, 150, seg(t, .85, 1.05)); chrome('PENGELUARAN', 470, 545, 98, seg(t, .95, 1.15)); }
  if (t >= 4.5 && t < 10.5) {
    X.font = '900 36px Inter'; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.lineJoin = 'round'; X.strokeStyle = '#1a0b33'; X.lineWidth = 10; X.strokeText('TEBAS', 62, 96); X.fillStyle = '#fff'; X.fillText('TEBAS', 62, 96);
    const n = counter(t), pk = 1 - seg(t - (t < 6.75 ? 4.65 + Math.floor((t - 4.65) / .1875) * .1875 : t), 0, .1) * 0;
    chrome('×' + n, 58, 206, 112, 1, { align: 'left' });
  }
  if (t >= 11.25 && t < 12) chrome('×999', 470, 520, 230, seg(t, 11.25, 11.4) * (1 - seg(t, 11.85, 12)));
  if (t >= 14.7 && t < 17.6) { chrome('BOS TERMAHAL', 462, 150, 92, seg(t, 14.7, 14.9), { neon: '#ff2d2d' }); chrome('BULAN INI', 462, 252, 92, seg(t, 14.82, 15.02), { neon: '#ff2d2d' }); }
  if (t >= 21.42 && t < 23.97) chrome('JURUS PAMUNGKAS', 456, 250, 84, seg(t, 21.42, 21.6), { neon: '#2fbf5a' });
  if (t >= 25.0 && t < 27.3) chrome('CATAT SEMUA!', 452, 1445, 116, seg(t, 25.0, 25.16), { neon: '#2fbf5a' });
}
window.TEXTS = t => {
  const r = [], add = (id, text, x0, y0, x1, y1, pass) => r.push({ id, text, x0, y0, x1, y1, pass });
  if (t >= .3 && t < 4.5) add('h1', '1 MINYAM', 150, 160, 790, 280);
  if (t >= .85 && t < 4.5) add('h2', 'VS 1000 PENGELUARAN', 110, 300, 830, 560);
  if (t >= 4.5 && t < 10.5) add('cnt', 'TEBAS ×', 50, 60, 400, 210, true);
  if (t >= 11.25 && t < 12) add('k999', '×999', 200, 330, 740, 530, true);
  if (t >= 14.2 && t < 21) add('boss', 'CICILAN Rp 3.200.000', 180, 500, 780, 1650, true);
  if (t >= 14.7 && t < 17.6) add('b1', 'BOS TERMAHAL BULAN INI', 110, 70, 810, 262);
  if (t >= 21.42 && t < 23.97) add('j1', 'JURUS PAMUNGKAS', 70, 180, 840, 260);
  if (t >= 25.0 && t < 27.3) add('j2', 'CATAT SEMUA!', 30, 1310, 880, 1420);
  if (t >= 33.05) add('logo', 'Artosku', 180, 250, 720, 410);
  if (t >= 33.45) add('dl', 'Download Artosku', 40, 520, 860, 610);
  if (t >= 33.85) add('ps', 'Play Store', 170, 694, 734, 826);
  return r;
};
window.DUR = 39;
// peristiwa suara (dibaca mix.py)
const EV = [{ t: 0, type: 'wind', d: 4.6 }, { t: .3, type: 'slam' }, { t: .85, type: 'slam' }, { t: .7, type: 'rumble', d: 2.2 }, { t: 3.4, type: 'eyes' }, { t: 3.72, type: 'draw' }, { t: 3.98, type: 'ting' }];
for (let i = 0; i < 12; i++) EV.push({ t: HIT_A(i), type: 'cut', i });
for (let j = 0; j < 6; j++) EV.push({ t: 6.85 + j * .12, type: 'zip', i: j });
EV.push({ t: 7.875, type: 'bigcut' });
EV.push({ t: 8.25, type: 'spin', d: 2.0 }); for (let i = 0; i < 18; i++) EV.push({ t: 8.4 + i * .105, type: 'cut', i, soft: 1 });
EV.push({ t: 10.15, type: 'zip', i: 5 }, { t: 10.62, type: 'land' }, { t: 11.25, type: 'click' }, { t: 11.27, type: 'coins', n: 14 }, { t: 11.5, type: 'rumble', d: 3.1 }, { t: 14.2, type: 'ignite' }, { t: 14.6, type: 'roar' }, { t: 14.7, type: 'slam' });
EV.push({ t: 16.83, type: 'zip', i: 1 }, { t: 16.9, type: 'boom' }, { t: 17.38, type: 'zip', i: 3 }, { t: 17.45, type: 'boom' }, { t: 17.6, type: 'zip', i: 4 });
for (let j = 0; j < 6; j++) EV.push({ t: 17.8 + j * .2, type: 'clang', i: j });
EV.push({ t: 19.0, type: 'whoosh' }, { t: 19.12, type: 'boom' }, { t: 19.5, type: 'thud' }, { t: 20.3, type: 'laugh' }, { t: 20.2, type: 'wind', d: 1.4 });
EV.push({ t: 21.375, type: 'coinglow' }, { t: 21.42, type: 'slam' }, { t: 21.75, type: 'eyes' }, { t: 22.5, type: 'aura', d: 1.5 }, { t: 24.0, type: 'dash' }, { t: 24.75, type: 'bigcut' }, { t: 25.0, type: 'slam' });
for (let j = 0; j < 44; j += 2) EV.push({ t: 24 + SL(j).t, type: 'cut', i: j, soft: 1 });
EV.push({ t: 27.0, type: 'click' }, { t: 27.3, type: 'crack' }, { t: 27.75, type: 'explode' }, { t: 27.85, type: 'coins', n: 26 }, { t: 28.55, type: 'shimmer' }, { t: 29.0, type: 'coins', n: 16, slow: 1 });
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
  else { const light = t >= 32.5; post.render(sc, glc, fr, null, light ? { scan: .05, grille: .02, bloom: .35, halo: .06, sk: 0, bleed: 3, rshift: 1, corner: .12, noiseA: .012, lift: 0, contrast: .05, expo: 1, tint: [1, 1, 1] } : { scan: .11, grille: .035, bleed: 5, rshift: 1.5, bloom: (t >= 24.9 && t < 27.3) ? .34 : .8, halo: (t >= 24.9 && t < 27.3) ? .1 : .22, corner: .24, noiseA: .009 }); }
};
window.READY = true;
