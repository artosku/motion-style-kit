// Alat gambar: kanvas, latar lukis, Minyam samurai, monster, bos, tebasan, judul.
// HAK CIPTA: karakter Minyam dan logo Artosku (logoPrimer/logoW) milik Artosku, hanya untuk penggunaan NONKOMERSIAL (CC BY-NC 4.0). Lihat LICENSE-ASSETS.md di repo motion-style-kit.
import { clamp, lerp, seg, eo, hash, TAU } from '/core/lib.js';

export const W = 1080, H = 1920, GY = 1300;
export const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
export const sc = mkc(W, H), glc = mkc(W, H), tmp = mkc(W, H);
export const X = sc.getContext('2d'), G = glc.getContext('2d'), T = tmp.getContext('2d');
export const q12 = t => Math.floor(t * 12 + 1e-6) / 12, q8 = t => Math.floor(t * 8 + 1e-6) / 8;
export const INK = '#101713', MATCHA9 = '#538248', MATCHA5 = '#86B77A', NEON = '#9dff8a';
const PI = Math.PI;

// ───────── latar lukis (dibuat sekali)
const MODELS = {
  day: { sky: ['#2466d6', '#4fb0f0', '#a6e6f2', '#ffd9c2', '#ffb3a6'], cl: ['#ffffff', '#ffd0e0'], far: ['#7a96e0', '#5f7ad0'], mid: ['#3f4fa6', '#2c3684'], gr: ['#3a4288', '#1c2050'], sun: '#fff6cf', sunG: '#ffd27a', win: '#bfe8ff' },
  dusk: { sky: ['#140b3a', '#3b1a6e', '#8a2c7c', '#e04a6a', '#ff9a4a'], cl: ['#2a1458', '#ff7a8a'], far: ['#6a2f86', '#4a1f6a'], mid: ['#3a1858', '#28103f'], gr: ['#2c1348', '#150a2a'], sun: '#ffd27a', sunG: '#ff9a4a', win: '#ffd27a' },
  dark: { sky: ['#05031a', '#1a0c3c', '#48145a', '#8c1f4f', '#c43a3a'], cl: ['#120828', '#a02a5a'], far: ['#34164e', '#220e38'], mid: ['#1f0c33', '#140822'], gr: ['#170a2a', '#090412'], sun: '#ff6a5a', sunG: '#c4283a', win: '#ff9a5a' },
  dawn: { sky: ['#5f72dc', '#a79af0', '#f3a6c0', '#ffc9a0', '#ffe9b0'], cl: ['#c9b6f4', '#fff0c8'], far: ['#9a8ad8', '#8474c8'], mid: ['#7462b8', '#5f4ea4'], gr: ['#6a58b0', '#463680'], sun: '#fff6cf', sunG: '#ffd27a', win: '#fff0c8' },
};
export const PL = {};
export function buildPlates() {
  for (const k in MODELS) {
    const m = MODELS[k], c = mkc(W, 2600), g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 2000); m.sky.forEach((s, i) => gr.addColorStop(i / (m.sky.length - 1), s));
    g.fillStyle = gr; g.fillRect(0, 0, W, 2600);
    for (let i = 0; i < 16; i++) {           // awan airbrush, bawahnya terang
      const x = hash(i * 3.1 + k.length) * W, y = 250 + hash(i * 7.7) * 1500, rx = 160 + hash(i * 1.3) * 260, ry = 26 + hash(i * 2.9) * 40;
      g.filter = 'blur(26px)'; g.globalAlpha = .75; g.fillStyle = m.cl[0]; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
      g.filter = 'blur(14px)'; g.globalAlpha = .55; g.fillStyle = m.cl[1]; g.beginPath(); g.ellipse(x + 20, y + ry * .75, rx * .8, ry * .28, 0, 0, TAU); g.fill();
    }
    g.filter = 'none'; g.globalAlpha = 1; PL[k] = c;
  }
}
function hillPath(c, yb, amp, seed, ox, f) {
  c.beginPath(); c.moveTo(-20, H + 400);
  for (let x = -20; x <= W + 20; x += 20) { const u = (x + ox) * f; c.lineTo(x, yb - amp * (.5 + .5 * Math.sin(u + seed) + .28 * Math.sin(u * 2.7 + seed * 2.3) + .12 * Math.sin(u * 6.1 + seed))); }
  c.lineTo(W + 20, H + 400); c.closePath();
}
// o: {cam (geser vertikal dunia), ox (geser horizontal), sunY, mid:false untuk menggambar bukit depan sendiri}
export function bg(model, o = {}) {
  const m = MODELS[model], cam = o.cam || 0, ox = o.ox || 0;
  X.drawImage(PL[model], 0, clamp(-640 + cam * .3, -680, 0));
  const sy = (o.sunY == null ? 1020 : o.sunY) + cam * .35, sx = o.sunX == null ? 560 : o.sunX, sr = o.sunR || 260;
  for (const c of [X, G]) { c.fillStyle = c === X ? m.sun : m.sunG; c.globalAlpha = c === X ? 1 : .55; c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill(); c.globalAlpha = 1; }
  X.fillStyle = m.sunG; X.globalAlpha = .5; for (let i = 0; i < 4; i++) X.fillRect(sx - sr, sy + sr * (.25 + i * .19), sr * 2, 6 + i * 5); X.globalAlpha = 1;   // garis-garis matahari ala 80-an (di depan cakram)
  const lay = (yb, amp, seed, par, f, cols) => {
    const y = yb + cam * par; hillPath(X, y, amp, seed, ox * par, f);
    const g = X.createLinearGradient(0, y - amp * 1.6, 0, y + 500); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]); X.fillStyle = g; X.fill();
    hillPath(G, y, amp, seed, ox * par, f); G.fillStyle = '#000'; G.fill();
  };
  lay(1180, 190, 1.7, .5, .0042, m.far);
  if (o.between) o.between();
  lay(1270, 110, 4.2, .78, .0061, m.mid);
}

// ───────── kota: dua lapis gedung dengan jendela (pengganti bukit)
function mkSky(seed, hmin, hmax, wmin, wmax) { const a = []; let x = 0, i = 0; while (x < 2600) { const w = wmin + hash(seed + i * 1.7) * (wmax - wmin); a.push([x, w, hmin + hash(seed + i * 3.1) * (hmax - hmin), hash(seed + i * 5.3)]); x += w + 8; i++; } a.P = x; return a; }
const SKY = { far: mkSky(3, 120, 520, 90, 190), mid: mkSky(41, 60, 330, 120, 260) };
export function city(model, o = {}) {
  const m = MODELS[model], cam = o.cam || 0, ox = o.ox || 0;
  X.drawImage(PL[model], 0, clamp(-640 + cam * .3, -680, 0));
  const sy = (o.sunY == null ? 1020 : o.sunY) + cam * .35, sx = o.sunX == null ? 560 : o.sunX, sr = o.sunR || 260;
  for (const c of [X, G]) { c.fillStyle = c === X ? m.sun : m.sunG; c.globalAlpha = c === X ? 1 : .55; c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill(); c.globalAlpha = 1; }
  X.fillStyle = m.sunG; X.globalAlpha = .5; for (let i = 0; i < 4; i++) X.fillRect(sx - sr, sy + sr * (.25 + i * .19), sr * 2, 6 + i * 5); X.globalAlpha = 1;
  const lay = (key, yb, par, cols, win) => {
    const L = SKY[key], y = yb + cam * par, off = (((ox * par) % L.P) + L.P) % L.P;
    const g = X.createLinearGradient(0, y - 520, 0, y + 300); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]);
    for (let k = 0; k < 2; k++) for (const [bx, w, h, r] of L) {
      const x = bx - off + k * L.P; if (x > W + 20 || x + w < -20) continue;
      X.fillStyle = g; X.fillRect(x, y - h, w, h + 1200); G.fillStyle = '#000'; G.fillRect(x, y - h, w, h + 1200);
      if (r > .62) { X.fillRect(x + w * .3, y - h - 26, w * .4, 26); X.fillRect(x + w * .5 - 3, y - h - 90, 6, 64); }
      if (win) { X.fillStyle = win; X.globalAlpha = .85; for (let wy = 26; wy < h + 160; wy += 46) for (let wx = 16; wx < w - 30; wx += 36) if (hash(wx * .37 + wy * .11 + bx) > .5) X.fillRect(x + wx, y - h + wy, 17, 24); X.globalAlpha = 1; }
    }
  };
  lay('far', 1180, .5, m.far, null);
  if (o.between) o.between();
  lay('mid', 1290, .78, m.mid, m.win);
}
export function ground(model, o = {}) {
  const m = MODELS[model], cam = o.cam || 0, ox = o.ox || 0, y = (o.y || GY) - 40 + cam;
  const g = X.createLinearGradient(0, y, 0, y + 700); g.addColorStop(0, m.gr[0]); g.addColorStop(1, m.gr[1]);
  X.fillStyle = g; X.fillRect(-40, y, W + 80, H); G.fillStyle = '#000'; G.fillRect(-40, y, W + 80, H);
  X.fillStyle = m.far[0]; X.globalAlpha = .55; X.fillRect(-40, y, W + 80, 8); X.globalAlpha = .35;
  for (let i = 0; i < 26; i++) {              // guratan tanah (ikut bergeser, memberi rasa laju)
    const d = hash(i * 5.3), yy = y + 30 + d * 560, sp = .8 + d * 1.6, len = 60 + hash(i * 2.1) * 160;
    let x = (hash(i * 9.7) * (W + 400) - ox * sp) % (W + 400); if (x < 0) x += W + 400;
    X.fillRect(x - 200, yy, len, 5 + d * 6);
  }
  X.globalAlpha = 1;
}

// ───────── Minyam samurai (karakter resmi + aksesori lewat hook)
function ribbon(c, x, y, dir, len, tt, ph) {
  const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([x + dir * u * len, y + Math.sin(u * 5 - tt * 16 + ph) * (4 + u * 16) + u * u * 14]); }
  for (const [w, col] of [[11, '#1b3fa8'], [7, '#3d8bff']]) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
}
function band(c, pa, knot, dir, tt, wind) {
  ribbon(c, knot[0], knot[1], dir, 96 * wind, tt, 0); ribbon(c, knot[0], knot[1] + 6, dir, 74 * wind, tt, 1.9);
  c.fillStyle = '#3d8bff'; c.strokeStyle = '#1b3fa8'; c.lineWidth = 2.5; c.fill(pa); c.stroke(pa);
  c.beginPath(); c.arc(knot[0], knot[1], 8, 0, TAU); c.fill(); c.stroke();
}
const BF = new Path2D('M-70 -146 Q0 -176 70 -146 L67 -133 Q0 -162 -67 -133 Z');
const BS = new Path2D('M-62 -150 Q4 -174 68 -148 L66 -135 Q4 -161 -60 -137 Z');
export function katana(c, glow = 0) {            // jaring penangkap (gagang ke atas)
  c.lineCap = 'round'; c.strokeStyle = '#5a3a1a'; c.lineWidth = 10; c.beginPath(); c.moveTo(0, 14); c.lineTo(0, -104); c.stroke();
  c.strokeStyle = '#d09a4a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-2, 12); c.lineTo(-2, -102); c.stroke();
  c.fillStyle = glow > 0 ? `rgba(157,255,138,${.22 + .3 * glow})` : 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(0, -150, 42, 50, 0, 0, TAU); c.fill();
  c.save(); c.clip(); c.strokeStyle = glow > 0 ? '#eaffea' : '#ffffff'; c.lineWidth = 2; c.beginPath();
  for (let i = -5; i <= 5; i++) { c.moveTo(i * 15 - 50, -200); c.lineTo(i * 15 + 50, -100); c.moveTo(i * 15 + 50, -200); c.lineTo(i * 15 - 50, -100); } c.stroke(); c.restore();
  c.strokeStyle = glow > 0 ? MATCHA9 : '#3a4a7a'; c.lineWidth = 8; c.beginPath(); c.ellipse(0, -150, 42, 50, 0, 0, TAU); c.stroke();
  c.strokeStyle = glow > 0 ? NEON : '#eef4ff'; c.lineWidth = 3; c.stroke();
}
function katanaGlow(c, glow) {
  c.strokeStyle = NEON; c.globalAlpha = .9 * glow; c.lineWidth = 14; c.beginPath(); c.ellipse(0, -150, 42, 50, 0, 0, TAU); c.stroke(); c.globalAlpha = 1;
}
// o: {x,y,s,t,pose,kat (sudut dari arah sayap; null = tanpa katana),glow,rot,ghost:{col,a},wind,shadow,c}
export function hero(o) {
  const c = o.ghost ? T : X, s = o.s || 1, pose = Object.assign({ view: 'front' }, o.pose), tt = q12(o.t || 0), wind = o.wind == null ? 1 : o.wind;
  let km = null;
  const kat = (x, y) => { if (o.kat == null) return; c.save(); c.translate(x, y); c.rotate(PI + o.kat); km = c.getTransform(); katana(c, o.glow || 0); c.restore(); };
  const hooks = {};
  if (pose.view === 'side') { hooks.overHead = () => band(c, BS, [-60, -143], -1, tt, wind); hooks.overNearWing = () => kat(-2, 62); }
  else if (pose.view === 'back') { hooks.overTail = () => band(c, BF, [0, -150], 1, tt, wind); hooks.overWing = sd => { if (sd === 1) kat(8, 46); }; }
  else { hooks.overHead = () => band(c, BF, [-68, -140], -1, tt, wind); hooks.overWing = sd => { if (sd === 1) kat(8, 46); }; }
  if (o.ghost) { T.setTransform(1, 0, 0, 1, 0, 0); T.clearRect(0, 0, W, H); T.setTransform(X.getTransform()); }
  c.save();
  if (o.rot) { c.translate(o.x, o.y - 95 * s); c.rotate(o.rot); c.translate(-o.x, -(o.y - 95 * s)); }
  Minyam.draw(c, { x: o.x, y: o.y, scale: s, t: tt, pose, shadow: o.shadow !== false && !o.rot && !o.ghost, hooks });
  c.restore();
  if (o.ghost) {
    T.setTransform(1, 0, 0, 1, 0, 0); T.globalCompositeOperation = 'source-atop'; T.fillStyle = o.ghost.col; T.globalAlpha = o.ghost.mix == null ? .8 : o.ghost.mix; T.fillRect(0, 0, W, H);
    T.globalCompositeOperation = 'source-over'; T.globalAlpha = 1;
    for (const d of [X, G]) { d.save(); d.setTransform(1, 0, 0, 1, 0, 0); d.globalAlpha = o.ghost.a * (d === G ? .5 : 1); d.drawImage(tmp, 0, 0); d.restore(); }
  } else if (o.glow > 0 && km) { G.save(); G.setTransform(km); katanaGlow(G, o.glow); G.restore(); }
}

// ───────── monster pengeluaran (cel: isi bayangan, bentuk terang digeser, garis berwarna)
export const KINDS = [
  ['KOPI', '#9a52e0', '#5a2496', '#2b0d52'], ['ONGKIR', '#e0508a', '#96245a', '#520d2e'], ['JAJAN', '#3fb8c8', '#1f6e8a', '#0d3348'], ['PARKIR', '#e07a3a', '#964a1a', '#52240a'],
  ['TOPUP', '#6a6ae8', '#3434a0', '#15155a'], ['NONGKRONG', '#c84ad0', '#7a2288', '#400d4a'], ['LANGGANAN', '#48c088', '#1f7a52', '#0d4028'], ['CHECKOUT', '#e8546a', '#9a2438', '#520d1a'],
];
const MB = new Path2D('M-60 50 C-78 -10 -46 -72 0 -72 C46 -72 78 -10 60 50 L40 36 L20 54 L0 36 L-20 54 L-40 36 Z');
const MH = new Path2D('M-44 -52 L-58 -100 L-20 -66 Z M44 -52 L58 -100 L20 -66 Z');
const ME = new Path2D('M-38 -26 L-8 -12 L-13 3 L-34 -7 Z M38 -26 L8 -12 L13 3 L34 -7 Z');
const MM = new Path2D('M-28 16 L-18 26 L-9 16 L0 26 L9 16 L18 26 L28 16 L22 34 L-22 34 Z');
export function monster(c, x, y, s, k, o = {}) {
  const K = KINDS[k % KINDS.length], glow = c === G;
  c.save(); c.translate(x, y); c.scale(s * (o.sx || 1), s * (o.sy || 1)); if (o.rot) c.rotate(o.rot);
  if (glow) { c.fillStyle = '#000'; c.fill(MB); c.fill(MH); c.fillStyle = '#ffd84a'; c.globalAlpha = o.eye == null ? .9 : o.eye; c.fill(ME); c.restore(); return; }
  c.fillStyle = K[2]; c.fill(MB); c.fillStyle = K[2]; c.fill(MH);
  c.save(); c.clip(MB); c.translate(-12, -10); c.fillStyle = K[1]; c.fill(MB); c.restore();
  c.save(); c.clip(MB); c.fillStyle = '#fff'; c.globalAlpha = .28; c.beginPath(); c.ellipse(-30, -44, 16, 9, -.6, 0, TAU); c.fill(); c.restore();
  c.strokeStyle = K[3]; c.lineWidth = 4; c.lineJoin = 'round'; c.stroke(MB); c.stroke(MH);
  c.fillStyle = '#ffe66a'; c.fill(ME); c.fillStyle = K[3]; c.fillRect(-22, -16, 5, 9); c.fillRect(17, -16, 5, 9);
  c.fillStyle = '#1a0820'; c.fill(MM); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-18, 26); c.lineTo(-13.5, 18); c.lineTo(-9, 26); c.moveTo(9, 26); c.lineTo(13.5, 18); c.lineTo(18, 26); c.fill();
  if (!o.notag) {
    c.translate(46, -52); c.rotate(.28); c.fillStyle = '#fff3d8'; c.strokeStyle = K[3]; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-4, -14, K[0].length * 11 + 16, 28, 5); c.fill(); c.stroke();
    c.fillStyle = K[3]; c.font = '800 17px Inter'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(K[0], 5, 1);
  }
  c.restore();
}
export const mon = (x, y, s, k, o) => { monster(X, x, y, s, k, o); monster(G, x, y, s, k, o); };
// gambar terbelah dua di garis lewat (cx,cy) bersudut ang; d = jarak pisah, rot = putaran tiap belahan
export function split(fn, cx, cy, ang, d, rot = 0, drop = 0) {
  const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux, R = 3000;
  for (const c of [X, G]) for (const sd of [-1, 1]) {
    c.save(); c.translate(nx * d * sd, ny * d * sd + drop); c.translate(cx, cy); c.rotate(rot * sd); c.translate(-cx, -cy);
    c.beginPath(); c.moveTo(cx - ux * R, cy - uy * R); c.lineTo(cx + ux * R, cy + uy * R); c.lineTo(cx + ux * R + nx * R * sd, cy + uy * R + ny * R * sd); c.lineTo(cx - ux * R + nx * R * sd, cy - uy * R + ny * R * sd); c.closePath(); c.clip();
    fn(c); c.restore();
  }
}

// ───────── uang bersayap, dompet, peti, tenda, tagihan
export function bill(x, y, s, o = {}) {
  const fl = o.flap || 0;
  for (const c of [X, G]) {
    c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s, s);
    if (c === G) { c.fillStyle = '#7dffb0'; c.globalAlpha = o.glow == null ? .3 : o.glow; c.fillRect(-46, -30, 92, 56); c.restore(); continue; }
    if (!o.nowing) for (const sd of [-1, 1]) {
      c.save(); c.translate(sd * 30, -22); c.scale(sd, 1); c.rotate(-.45 - fl * .75); c.fillStyle = '#fff'; c.strokeStyle = '#3a4a7a'; c.lineWidth = 3; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(30, -48, 76, -30); c.quadraticCurveTo(58, -18, 62, -6); c.quadraticCurveTo(44, -6, 40, 6); c.quadraticCurveTo(20, 0, 0, 8); c.closePath(); c.fill(); c.stroke(); c.restore();
    }
    c.fillStyle = '#1f7a52'; c.beginPath(); c.roundRect(-46, -26, 92, 52, 6); c.fill();
    c.fillStyle = '#58d08a'; c.beginPath(); c.roundRect(-46, -30, 92, 50, 6); c.fill();
    c.strokeStyle = '#0d4028'; c.lineWidth = 3.5; c.beginPath(); c.roundRect(-46, -30, 92, 56, 6); c.stroke();
    c.strokeStyle = '#d6ffe2'; c.lineWidth = 2; c.strokeRect(-38, -22, 76, 36);
    c.fillStyle = '#fff3d8'; c.beginPath(); c.arc(0, -4, 14, 0, TAU); c.fill();
    c.fillStyle = '#0d4028'; c.font = '900 15px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Rp', 0, -3);
    c.restore();
  }
}
export function wallet(x, y, s, open = 0) {
  for (const c of [X, G]) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (c === G) { c.fillStyle = '#000'; c.fillRect(-80, -52, 160, 104); c.restore(); continue; }
    c.fillStyle = '#6a3414'; c.beginPath(); c.roundRect(-80, -46, 160, 98, 14); c.fill();
    c.fillStyle = '#b96a2e'; c.beginPath(); c.roundRect(-80, -52, 160, 96, 14); c.fill();
    c.strokeStyle = '#3a1a08'; c.lineWidth = 5; c.lineJoin = 'round'; c.beginPath(); c.roundRect(-80, -52, 160, 104, 14); c.stroke();
    c.save(); c.translate(0, -52); c.scale(1, lerp(1, -1.1, open)); c.fillStyle = '#d98a44'; c.beginPath(); c.moveTo(-80, 0); c.lineTo(80, 0); c.lineTo(80, 30); c.quadraticCurveTo(0, 78, -80, 30); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#f6c431'; c.beginPath(); c.arc(0, 44, 11, 0, TAU); c.fill(); c.stroke(); c.restore();
    c.restore();
  }
}
export function crate(x, y, sz, rot = 0) {          // x,y = tengah-bawah
  for (const c of [X, G]) {
    c.save(); c.translate(x, y - sz / 2); c.rotate(rot);
    if (c === G) { c.fillStyle = '#000'; c.fillRect(-sz / 2, -sz / 2, sz, sz); c.restore(); continue; }
    c.fillStyle = '#8a5a2a'; c.fillRect(-sz / 2, -sz / 2, sz, sz); c.fillStyle = '#c8924a'; c.fillRect(-sz / 2, -sz / 2, sz * .86, sz * .86);
    c.strokeStyle = '#3a1f0a'; c.lineWidth = 5; c.lineJoin = 'round'; c.strokeRect(-sz / 2, -sz / 2, sz, sz); c.lineWidth = 4; c.beginPath(); c.moveTo(-sz / 2, -sz / 2); c.lineTo(sz / 2, sz / 2); c.moveTo(sz / 2, -sz / 2); c.lineTo(-sz / 2, sz / 2); c.stroke();
    c.restore();
  }
}
export function awning(x, y, w, h, k = 0, post = 0) { // x = tengah, y = atas
  const cols = [['#ee3b45', '#a81e2c'], ['#3d8bff', '#1b3fa8'], ['#f6a431', '#b96a0b']][k % 3];
  for (const c of [X, G]) {
    if (c === G) { c.fillStyle = '#000'; c.fillRect(x - w / 2, y, w, h); continue; }
    if (post) { c.fillStyle = '#2a1d3a'; c.fillRect(x - w / 2 + 10, y, 12, post); c.fillRect(x + w / 2 - 22, y, 12, post); }
    const n = 6; for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? '#fff3d8' : cols[0]; c.beginPath(); c.moveTo(x - w / 2 + i * w / n, y); c.lineTo(x - w / 2 + (i + 1) * w / n, y); c.lineTo(x - w / 2 + (i + 1) * w / n, y + h - 18); c.arc(x - w / 2 + (i + .5) * w / n, y + h - 18, w / n / 2, 0, PI); c.closePath(); c.fill(); }
    c.fillStyle = cols[1]; c.fillRect(x - w / 2, y, w, 14); c.strokeStyle = '#2a1d3a'; c.lineWidth = 4; c.strokeRect(x - w / 2, y, w, h - 18);
  }
}
export function slab(x, y, s, rot = 0) {             // tagihan jatuh; x,y = tengah
  for (const c of [X, G]) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    if (c === G) { c.fillStyle = '#000'; c.fillRect(-120, -150, 240, 300); c.restore(); continue; }
    c.fillStyle = '#b9a2cc'; c.fillRect(-120, -150, 240, 300); c.fillStyle = '#f6edd8'; c.fillRect(-120, -150, 214, 300);
    c.fillStyle = '#c81e3c'; c.fillRect(-120, -150, 240, 74); c.strokeStyle = '#3a1c50'; c.lineWidth = 7; c.lineJoin = 'round'; c.strokeRect(-120, -150, 240, 300);
    c.fillStyle = '#fff'; c.font = '900 44px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('TAGIHAN', 0, -111);
    c.fillStyle = '#8f7aa8'; for (let i = 0; i < 4; i++) { c.fillRect(-96, -44 + i * 40, 110 + (i * 37) % 50, 14); c.fillRect(40, -44 + i * 40, 52, 14); }
    c.restore();
  }
}
// ───────── bos: monster Tanggal Tua. o: {mouth 0..1, eye, eyesOnly, inner, rot}
const BB = new Path2D('M-300 520 C-400 200 -250 -160 0 -160 C250 -160 400 200 300 520 L200 450 L100 540 L0 450 L-100 540 L-200 450 Z');
const BH = new Path2D('M-215 -50 L-300 -300 L-95 -125 Z M215 -50 L300 -300 L95 -125 Z');
export function bigMon(c, x, y, s, o = {}) {
  const glow = c === G, m = o.mouth || 0, eye = o.eye == null ? 1 : o.eye;
  c.save(); c.translate(x, y); c.scale(s, s); if (o.rot) c.rotate(o.rot);
  if (!o.eyesOnly) {
    if (glow) { c.fillStyle = '#000'; c.fill(BB); c.fill(BH); }
    else {
      c.fillStyle = '#35105e'; c.fill(BB); c.fill(BH);
      c.save(); c.clip(BB); c.translate(-46, -34); c.fillStyle = '#6a2cb0'; c.fill(BB); c.restore();
      c.save(); c.clip(BB); c.fillStyle = '#fff'; c.globalAlpha = .2; c.beginPath(); c.ellipse(-170, 0, 60, 34, -.7, 0, TAU); c.fill(); c.restore();
      c.strokeStyle = '#1a0633'; c.lineWidth = 9; c.lineJoin = 'round'; c.stroke(BB); c.stroke(BH);
      c.fillStyle = '#fff3d8'; c.lineWidth = 6; c.beginPath(); c.roundRect(-178, -98, 356, 70, 10); c.fill(); c.stroke();
      c.fillStyle = '#c81e3c'; c.font = '900 46px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('TANGGAL TUA', 0, -61);
    }
  }
  for (const sd of [-1, 1]) {
    c.beginPath(); c.moveTo(sd * 205, 20); c.lineTo(sd * 40, 96); c.lineTo(sd * 62, 172); c.lineTo(sd * 190, 124); c.closePath();
    c.fillStyle = glow ? '#ff2d6f' : (eye > .05 ? '#ffe66a' : '#1a0633'); c.globalAlpha = glow ? eye * .9 : 1; c.fill(); c.globalAlpha = 1;
    if (!glow) { c.strokeStyle = '#1a0633'; c.lineWidth = 7; c.lineJoin = 'round'; c.stroke(); if (eye > .05) { c.fillStyle = '#c81e3c'; c.beginPath(); c.ellipse(sd * 112, 108, 13, 32, sd * .5, 0, TAU); c.fill(); } }
  }
  const rx = 150 * (.65 + .35 * m), ry = 22 + 120 * m;
  if (glow) { if (m > .3 && !o.eyesOnly) { c.fillStyle = o.inner || '#ff5a2a'; c.globalAlpha = .5 * m; c.beginPath(); c.ellipse(0, 320, rx * .7, ry * .7, 0, 0, TAU); c.fill(); c.globalAlpha = 1; } }
  else {
    c.fillStyle = '#12041f'; c.beginPath(); c.ellipse(0, 320, rx, ry, 0, 0, TAU); c.fill(); c.strokeStyle = '#1a0633'; c.lineWidth = 8; c.stroke();
    if (m > .3) { c.fillStyle = o.inner || '#c81e3c'; c.beginPath(); c.ellipse(0, 320 + ry * .25, rx * .62, ry * .55, 0, 0, TAU); c.fill(); c.fillStyle = '#12041f'; c.beginPath(); c.ellipse(0, 320 + ry * .2, rx * .3, ry * .3, 0, 0, TAU); c.fill(); }
    c.fillStyle = '#fff3d8'; c.lineWidth = 4;
    for (let i = -3; i <= 3; i++) { const a = i / 3.6 * 1.45, tx = Math.sin(a) * rx * .96, ty = 320 - Math.cos(a) * ry * .96; c.beginPath(); c.moveTo(tx - 20, ty - 2); c.lineTo(tx, ty + 30 + 22 * m); c.lineTo(tx + 20, ty - 2); c.closePath(); c.fill(); c.stroke(); }
  }
  c.restore();
}

// ───────── tebasan, garis kecepatan, percikan, koin
export function slash(x, y, ang, len, k, w = 16, edge = NEON, core = '#fff') {
  if (k <= 0 || k >= 1) return;
  const p = eo(seg(k, 0, .3)), f = 1 - seg(k, .4, 1), tl = seg(k, .25, .9) * .8;
  const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux, a = len * tl, b = len * p, m = (a + b) / 2;
  for (const c of [X, G]) for (const [ww, col, al] of [[w * 2.6, edge, .55 * f], [w, c === G ? edge : core, f]]) {
    c.fillStyle = col; c.globalAlpha = al * (c === G ? .9 : 1); c.beginPath(); c.moveTo(x + ux * a, y + uy * a);
    c.lineTo(x + ux * m + nx * ww / 2, y + uy * m + ny * ww / 2); c.lineTo(x + ux * b, y + uy * b); c.lineTo(x + ux * m - nx * ww / 2, y + uy * m - ny * ww / 2); c.closePath(); c.fill(); c.globalAlpha = 1;
  }
}
export function arcSlash(cx, cy, r, a0, a1, k, th = 60, edge = NEON) {
  if (k <= 0 || k >= 1) return;
  const p = eo(seg(k, 0, .45)), f = 1 - seg(k, .45, 1), e = lerp(a0, a1, p), s0 = lerp(a0, a1, seg(k, .3, 1) * .9);
  for (const c of [X, G]) for (const [t2, col, al] of [[th, edge, .6 * f * (c === G ? .5 : 1)], [th * .55, c === G ? edge : '#fff', f * (c === G ? .5 : 1)]]) {
    c.fillStyle = col; c.globalAlpha = al; c.beginPath(); c.arc(cx, cy, r, s0, e, a1 < a0);
    const mx = (s0 + e) / 2; c.quadraticCurveTo(cx + Math.cos(mx) * (r - t2) * 1.02, cy + Math.sin(mx) * (r - t2) * 1.02, cx + Math.cos(s0) * r, cy + Math.sin(s0) * r); c.closePath(); c.fill(); c.globalAlpha = 1;
  }
}
export function radial(cx, cy, t, n, col, al, r0 = 380) {
  const fr = Math.floor(t * 12); X.fillStyle = col; X.globalAlpha = al; X.beginPath();
  for (let i = 0; i < n; i++) { const a = (i + hash(i + fr * 13.7)) / n * TAU, r = r0 * (.7 + hash(i * 3.3 + fr) * .9), w = .012 + hash(i * 7.1 + fr * 2.2) * .02; X.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); X.lineTo(cx + Math.cos(a - w) * 2600, cy + Math.sin(a - w) * 2600); X.lineTo(cx + Math.cos(a + w) * 2600, cy + Math.sin(a + w) * 2600); }
  X.fill(); X.globalAlpha = 1;
}
export function lines(t, n, col, al, vert, speed = 5200) {
  X.fillStyle = col;
  for (let i = 0; i < n; i++) { const d = hash(i * 4.7), L = 200 + hash(i * 2.3) * 520, span = (vert ? H : W) + L * 2, p = ((((hash(i * 8.9) * span + t * speed * (.6 + d)) % span) + span) % span) - L, q = hash(i * 6.1) * (vert ? W : H); X.globalAlpha = al * (.4 + d * .6); vert ? X.fillRect(q, p, 3 + d * 5, L) : X.fillRect(W - p - L, q, L, 3 + d * 5); }
  X.globalAlpha = 1;
}
export function sparks(x, y, k, n, seed, col = '#ffe66a', R = 190) {
  if (k <= 0 || k >= 1) return;
  for (const c of [X, G]) { c.strokeStyle = c === G ? col : '#fff'; c.lineCap = 'round'; c.globalAlpha = 1 - k; c.lineWidth = 7 * (1 - k) + 1; c.beginPath();
    for (let i = 0; i < n; i++) { const a = hash(seed + i * 3.7) * TAU, r1 = R * eo(k) * (.5 + hash(seed + i) * .7), r0 = r1 * (.35 + k * .6); c.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); c.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); }
    c.stroke(); c.globalAlpha = 1; }
}
export function coin(x, y, r, ph) {
  const w = Math.abs(Math.cos(ph)) * .85 + .15;
  X.fillStyle = '#f6c431'; X.strokeStyle = '#b97c0b'; X.lineWidth = r * .16; X.beginPath(); X.ellipse(x, y, r * w, r, 0, 0, TAU); X.fill(); X.stroke();
  X.fillStyle = '#ffe9a0'; X.beginPath(); X.ellipse(x - r * .25 * w, y - r * .3, r * .28 * w, r * .2, 0, 0, TAU); X.fill();
  if (w > .9) { G.fillStyle = '#ffd84a'; G.globalAlpha = .7; G.beginPath(); G.arc(x, y, r * .8, 0, TAU); G.fill(); G.globalAlpha = 1; }
}
export function star(x, y, r, k, col = '#fff') {
  if (k <= 0 || k >= 1) return; const s = Math.sin(k * PI) * r;
  for (const c of [X, G]) { c.fillStyle = col; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4 + k, rr = i % 2 ? s * .12 : s; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
}
export function dust(x, y, k, n, seed, col = '#b8a0d8') {
  if (k <= 0 || k >= 1) return; X.fillStyle = col; X.globalAlpha = (1 - k) * .8;
  for (let i = 0; i < n; i++) { const sd = i % 2 ? 1 : -1, d = eo(k) * (120 + hash(seed + i) * 260), r = (30 + hash(seed + i * 2.1) * 46) * (1 - k * .5); X.beginPath(); X.arc(x + sd * d, y - hash(seed + i * 5) * 50 * eo(k), r, 0, TAU); X.fill(); }
  X.globalAlpha = 1;
}

// ───────── judul krom
export function chrome(text, x, y, size, k = 1, o = {}) {
  if (k <= 0) return; const sc2 = 1 + (1 - eo(clamp(k))) * 1.8;
  for (const c of [X, G]) {
    c.save(); c.translate(x, y - size * .35); c.scale(sc2, sc2); c.translate(0, size * .35); c.globalAlpha = clamp(k * 3) * (c === G ? .45 : 1);
    c.font = `italic 900 ${size}px Kanit`; c.textAlign = o.align || 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
    if (c === X) { c.strokeStyle = o.neon || '#ff3d8a'; c.lineWidth = size * .26; c.strokeText(text, 0, 0); c.strokeStyle = '#1a0b33'; c.lineWidth = size * .17; c.strokeText(text, 0, 0); }
    const g = c.createLinearGradient(0, -size * .78, 0, size * .04);
    for (const [p, col] of o.grad || [[0, '#8fe4ff'], [.42, '#ffffff'], [.5, '#6a3fd0'], [.72, '#ff6fb0'], [1, '#ffd84a']]) g.addColorStop(p, col);
    c.fillStyle = g; c.fillText(text, 0, 0); c.restore();
  }
}
const P_LEFT = new Path2D('M452 77 H769 C781 77 789 88 786 100 L613 590 C611 598 606 602 598 602 H288 C278 602 270 593 273 582 L438 89 C440 82 445 77 452 77 Z');
const P_RIGHT = new Path2D('M807 140 C813 139 818 143 821 149 L1039 581 C1044 591 1037 602 1027 602 H747 L679 487 L796 154 C798 146 802 141 807 140 Z');
export function logoPrimer(ctx, x, y, h) {       // logo resmi Artosku (path tidak diubah); x,y = pojok kiri-atas
  const s = h / 525; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-272.361387, -77);
  ctx.fillStyle = MATCHA9; ctx.fill(P_LEFT); ctx.fillStyle = MATCHA5; ctx.fill(P_RIGHT);
  ctx.fillStyle = INK; ctx.font = '600 304.5px Inter'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.letterSpacing = '-6.09px'; ctx.fillText('Artosku', 1139.1, 339.5);
  ctx.letterSpacing = '0px'; ctx.restore();
}
export const logoW = h => { const s = h / 525; X.save(); X.font = '600 304.5px Inter'; X.letterSpacing = '-6.09px'; const w = X.measureText('Artosku').width; X.restore(); return (1139.1 - 272.36 + w) * s; };
