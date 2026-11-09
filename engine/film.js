// Film Minyam terjun bebas: panel kiri (daftar poin yang terisi saat disebut) + panel kanan (Minyam jatuh, style per poin).
// Semua isi dibaca dari timeline.json (dibuat oleh tools/build.py dari spec.json). render(t) dipanggil per frame oleh perekam video.
import * as M from './main.js';
import { drawIntro, obstacleParts, placeParts } from './styles.js';
import { ALL as STY } from './registry.js';
const { ctx, H, R, INK, MATCHA9, MATCHA5, logoPrimer, rr, mk, hash, rotp, minyamParts } = M;
const TL = await (await fetch('timeline.json')).json();
const T = TL.T, HALF = TL.trHalf, N = T.length, SID = TL.styles;
await document.fonts.load('800 20px Inter'); await document.fonts.load('500 16px Inter');
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, p) => a + (b - a) * p;
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const backOut = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

// ───────── gerak ayam (kontinu lewat semua style) dan rintangan
const OBS_V = 1500, SC = 1.3;
function obsState(k, t) {
  const s = TL.obs[k], side = k % 2 ? 1 : -1, y = 1180 - (t - s) * OBS_V;
  if (t < s || y < -240 || y > 1300) return null;
  return { k, side, x: 480 + side * 60, y, rot: Math.sin((t - s) * 7) * .3 * side };
}
function state(t) {
  let x = 480 + 40 * Math.sin(t * 1.7 + .5), y = 585 + 16 * Math.sin(t * 2.6), rot = .26 * Math.sin(t * 2.2), sqx = 1, sqy = 1 + .03 * Math.sin(t * 7);
  for (let k = 0; k < N; k++) { const o = obsState(k, t); if (o) { const g = Math.exp(-(((o.y - 585) / 280) ** 2)); x -= o.side * 200 * g; rot -= o.side * .55 * g; sqx *= 1 + .12 * g; } }
  for (let k = 0; k < N; k++) { const a = T[k] - HALF; if (t >= a && t <= a + 2 * HALF) { const p = (t - a) / (2 * HALF); rot += Math.PI * 2 * ease(p); sqy *= 1 + .1 * Math.sin(Math.PI * p); } }
  return { x, y, rot, sqx, sqy, wa: .55 * Math.sin(t * 11), sc: SC };
}
const HOP = 1.05, LAND = 2.45;
function introState(t) {
  const plane = { x: 140 + t * 300 + Math.max(0, t - HOP) * 520, y: 190 };
  if (t >= LAND) return { st: state(t), plane, fall: true };
  if (t < HOP) { const c = clamp((t - .75) / .3); return { st: { x: 140 + t * 300 + 60, y: 160 + 6 * Math.sin(t * 9), rot: 0, sqx: 1 + .08 * c, sqy: 1 - .2 * c * (t < .95 ? 1 : 0) + .0, wa: 0, sc: .55 }, plane, fall: false }; }
  const tau = t - HOP, p = ease(clamp(tau / (LAND - HOP))), s0 = state(LAND), x0 = 140 + HOP * 300 + 60, y0 = 160, tg = state(t);
  const hopArc = 70 * Math.sin(Math.PI * clamp(tau / .75)) * (1 - p);
  return { st: { x: lerp(x0, tg.x, p), y: lerp(y0, tg.y, p) - hopArc, rot: (1 - p) * -9.4 + tg.rot * p, sqx: 1, sqy: 1 + .15 * Math.sin(Math.PI * p), wa: tg.wa * p, sc: lerp(.55, SC, p) }, plane, fall: p > .3 };
}

// ───────── satu frame style k (k = -1: intro) pada waktu t
const cvs = T.map(() => mk()), cvIntro = mk();
function renderStyle(k, t) {
  const c = k < 0 ? cvIntro : cvs[k], g = c.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.clearRect(0, 0, R, H);
  if (k < 0) { const { st, plane, fall } = introState(t); drawIntro(g, st, t, { plane: plane.x < 1300 && t < 3 ? plane : null, fall }); return c; }
  const S = STY[SID[k]], tq = S.fps ? Math.floor(t * S.fps) / S.fps : t, st = state(tq);
  const parts = placeParts(minyamParts(st.wa), st), o = obsState(k, tq);
  const obs = o ? [{ parts: obstacleParts(TL.obsKind[k], tq).map(p => ({ ...p, poly: rotp(p.poly, o.rot, 0, 0) })), x: o.x, y: o.y, sc: SC }] : [];
  if (S.full) { S.full(g, { t: tq, st, parts, obs }); } else {
    S.bg(g, tq); S.under?.(g, st, tq); S.draw(g, parts, st.x, st.y, st.sc, tq); obs.forEach(q => S.draw(g, q.parts, q.x, q.y, q.sc, tq)); S.after?.(g, st, tq);
  }
  S.post?.(g, tq); return c;
}

// ───────── transisi: gaya berganti-ganti, pusatnya di ayam (ayam selalu di tempat yang sama di kedua style)
const OUT = mk(), og = OUT.getContext('2d');
function compose(A, B, type, p, k, t) {
  og.setTransform(1, 0, 0, 1, 0, 0); og.globalAlpha = 1; og.clearRect(0, 0, R, H); og.drawImage(A, 0, 0);
  const st = state(t), cx = st.x, cy = st.y - 90;
  if (type === 'iris') { og.save(); og.beginPath(); og.arc(cx, cy, p * 1350, 0, 7); og.clip(); og.drawImage(B, 0, 0); og.restore(); og.strokeStyle = `rgba(255,255,255,${1 - p})`; og.lineWidth = 4 + 22 * (1 - p); og.beginPath(); og.arc(cx, cy, p * 1350, 0, 7); og.stroke(); }
  else if (type === 'slices') { const N = 8, bh = H / N; for (let b = 0; b < N; b++) { const q = ease(clamp(p * 1.8 - b * .1)), w = q * R, x = b % 2 ? R - w : 0; if (w > 1) { og.drawImage(B, x, b * bh, w, bh, x, b * bh, w, bh); og.fillStyle = 'rgba(255,255,255,.85)'; og.fillRect(b % 2 ? x : x + w - 5, b * bh, 5, bh); } } }
  else if (type === 'blocks') { const S = 80; for (let i = 0; i < R / S; i++) for (let j = 0; j < Math.ceil(H / S); j++) { const h = hash(i, j, k + 3) * .75, q = clamp((p - h) / .25); if (q > 0) { const sz = S * (q < 1 ? backOut(q) : 1), x = i * S + S / 2 - sz / 2, y = j * S + S / 2 - sz / 2; og.save(); og.beginPath(); og.rect(x, y, sz, sz); og.clip(); og.drawImage(B, 0, 0); og.restore(); } } }
  else if (type === 'wave') { const by = H * (1.08 - p * 1.2); og.save(); og.beginPath(); og.moveTo(0, H + 10); for (let x = 0; x <= R; x += 16) og.lineTo(x, by + Math.sin(x / 70 + p * 9) * 38); og.lineTo(R, H + 10); og.closePath(); og.clip(); og.drawImage(B, 0, 0); og.restore();
    og.strokeStyle = 'rgba(255,255,255,.9)'; og.lineWidth = 8; og.beginPath(); for (let x = 0; x <= R; x += 16) { const y = by + Math.sin(x / 70 + p * 9) * 38; x ? og.lineTo(x, y) : og.moveTo(x, y); } og.stroke(); }
  else { og.save(); og.beginPath(); og.moveTo(cx, cy); og.arc(cx, cy, 1800, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); og.closePath(); og.clip(); og.drawImage(B, 0, 0); og.restore(); }
  og.fillStyle = `rgba(255,255,255,${.22 * Math.sin(Math.PI * p)})`; og.fillRect(0, 0, R, H);
  return OUT;
}
function right(t) {
  const same = k => k > 0 && SID[k] === SID[k - 1];                         // style sama dengan poin sebelumnya: tidak perlu transisi gambar
  for (let k = 0; k < N; k++) { const a = T[k] - HALF, b = T[k] + HALF; if (t >= a && t < b && !same(k)) { const p = ease((t - a) / (b - a)); return compose(renderStyle(k - 1, t), renderStyle(k, t), TL.tr[k], p, k, t); } }
  let k = -1; for (let i = 0; i < N; i++) if (t >= T[i]) k = i; return renderStyle(k, t);
}

// ───────── panel kiri
// teks dikecilkan seperlunya supaya muat (nama poin dari topik bisa panjang)
function fit(txt, weight, size, maxW, min = 18) { ctx.font = `${weight} ${size}px Inter`; const w = ctx.measureText(txt).width; const sz = w > maxW ? Math.max(min, Math.floor(size * maxW / w)) : size; ctx.font = `${weight} ${sz}px Inter`; return sz; }
function clip(txt, maxW) { if (ctx.measureText(txt).width <= maxW) return txt; while (txt.length > 1 && ctx.measureText(txt + '…').width > maxW) txt = txt.slice(0, -1); return txt + '…'; }
function panel(t) {
  const now = T.filter(x => t >= x).length;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fbfaf6'; ctx.fillRect(0, 0, 960, H); logoPrimer(72, 62, 64);
  ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px'; fit(TL.title, 600, 34, 816, 24); ctx.fillText(TL.title, 72, 206);
  const two = N > 10, rows = two ? Math.ceil(N / 2) : N, colX = two ? [72, 508] : [72], rowH = Math.min(118, Math.floor(740 / rows)), y0 = 252 + Math.round((740 - rows * rowH) * .3), bw = two ? 424 : 790, nameW = bw - 86;
  for (let i = 0; i < N; i++) {
    const n = i + 1, col = two && i >= rows ? 1 : 0, row = i - col * rows, x = colX[col], y = y0 + row * rowH, shown = n <= now, active = n === now, u = t - T[i], nm = TL.names[i];
    ctx.save();
    if (active) { const s = backOut(clamp(u / .38)), pcx = x + 26, pcy = y + 26; ctx.translate(pcx, pcy); ctx.scale(s, s); ctx.translate(-pcx, -pcy); ctx.globalAlpha = clamp(u / .12); }
    if (active) { ctx.fillStyle = '#e6f1e1'; rr(x - 14, y - 6, bw, 64, 18); ctx.fill(); ctx.fillStyle = MATCHA9; rr(x - 14, y - 6, 8, 64, 4); ctx.fill(); }
    rr(x, y, 52, 52, 14); if (shown) { ctx.fillStyle = active ? MATCHA9 : MATCHA5; ctx.fill(); } else { ctx.strokeStyle = '#d9ddd2'; ctx.lineWidth = 2.5; ctx.stroke(); }
    ctx.font = '700 27px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = shown ? '#ffffff' : '#b3b8ab'; ctx.fillText(String(n), x + 26, y + 27.5); ctx.textAlign = 'left';
    if (shown) { ctx.fillStyle = INK; if (active) { fit(nm, 700, 29, nameW, 20); ctx.fillText(clip(nm, nameW), x + 72, y + 18); ctx.font = '500 18px Inter'; ctx.fillStyle = `rgba(70,92,64,${clamp((u - .5) / .3)})`; ctx.fillText(clip(TL.tags[i], nameW), x + 72, y + 42); } else { fit(nm, 600, 31, nameW, 20); ctx.fillText(clip(nm, nameW), x + 72, y + 27.5); } }
    else { ctx.fillStyle = '#ecefe7'; rr(x + 72, y + 22, 250, 8, 4); ctx.fill(); }
    ctx.restore();
    if (active && u < .45) { ctx.save(); ctx.strokeStyle = `rgba(134,183,122,${1 - u / .45})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x + 26, y + 26, 28 + u * 110, 0, 7); ctx.stroke(); ctx.restore(); }
  }
}
// ───────── caption (bawah panel kanan): teks narasi, muncul saat baris itu diucapkan
function wrap(g, text, maxW) { const out = []; let cur = ''; for (const w of text.split(' ')) { const test = cur ? cur + ' ' + w : w; if (g.measureText(test).width > maxW && cur) { out.push(cur); cur = w; } else cur = test; } if (cur) out.push(cur); return out; }
function caption(t) {
  const c = TL.caps.find(c => t >= c.t0 && t < c.t1); if (!c) return;
  const a = clamp((t - c.t0) / .15) * clamp((c.t1 - t) / .15);
  ctx.save(); ctx.globalAlpha = a; ctx.font = '700 38px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '0px';
  const lines = wrap(ctx, c.text, 780), lh = 52, h = lines.length * lh + 30, w = Math.min(880, Math.max(...lines.map(l => ctx.measureText(l).width)) + 72), cx = 1440, y = 1032 - h;
  ctx.fillStyle = 'rgba(16,23,19,.84)'; rr(cx - w / 2, y, w, h, 24); ctx.fill(); ctx.fillStyle = '#ffffff'; lines.forEach((l, i) => ctx.fillText(l, cx, y + 15 + lh / 2 + i * lh)); ctx.restore();
}
// ───────── layar akhir CTA: dibuka dengan iris dari ayam; Minyam asli (kode resmi) mendarat dan melompat gembira
function endCard(t) {
  const u = t - TL.ctaStart, cfg = TL.cta, fade = (d, k = .3) => clamp((u - d) / k);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createLinearGradient(0, 0, 1920, 1080); bg.addColorStop(0, '#fbfaf6'); bg.addColorStop(1, '#e9f3e3'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = 'rgba(134,183,122,.18)'; ctx.beginPath(); ctx.arc(1500, 560, 430, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(83,130,72,.10)'; ctx.beginPath(); ctx.arc(1180, 980, 220, 0, 7); ctx.fill();
  const row = (d, fn) => { const a = fade(d); ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 26 * (1 - a)); fn(); ctx.restore(); };
  row(.35, () => logoPrimer(150, 120, 112));
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '-1px';
  const cw = 1000;
  row(.6, () => { ctx.fillStyle = INK; fit(cfg.head1, 800, 84, cw, 48); ctx.fillText(cfg.head1, 150, 430); ctx.fillStyle = MATCHA9; fit(cfg.head2, 800, 84, cw, 48); ctx.fillText(cfg.head2, 150, 530); });
  ctx.letterSpacing = '0px';
  row(1.0, () => { ctx.fillStyle = '#3d4a39'; fit(cfg.mid, 600, 50, cw, 30); ctx.fillText(cfg.mid, 150, 628); });
  row(1.9, () => { ctx.fillStyle = MATCHA9; rr(150, 690, 760, 110, 55); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; fit(cfg.button, 700, 44, 700, 26);
    ctx.fillText(cfg.button, 530, 747); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; });
  row(2.2, () => { ctx.fillStyle = '#5d6b57'; fit(cfg.sub, 500, 32, cw, 20); ctx.fillText(cfg.sub, 150, 870); });
  row(3.0, () => { ctx.fillStyle = INK; fit(cfg.footer, 600, 30, cw, 20); ctx.fillText(cfg.footer, 150, 990); });
  const land = ease(clamp((u - .25) / .75)), hop = u > 1.1 ? Math.abs(Math.sin((u - 1.1) * 3.4)) * 46 : 0, my = lerp(-260, 850, land) - hop;
  Minyam.draw(ctx, { x: 1440, y: my, scale: 2.1, t: u, shadow: false, pose: { view: 'front', mood: u > 1.0 ? 'joy' : 'happy', eyes: u > 1.0 ? undefined : 'shock', flap: u > 1.0 ? .5 + .5 * Math.sin(u * 9) : 1, squashY: land > .98 && u < 1.25 ? .9 : 1 } });
  ctx.fillStyle = `rgba(16,23,19,${.18 * land})`; ctx.beginPath(); ctx.ellipse(1440, 858, 120 * (1 - hop / 220), 18, 0, 0, 7); ctx.fill();
  ctx.restore();
}
function base(t) { panel(t); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(right(t), 960, 0); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(960, 0, 3, H); caption(t); }
function render(t) {
  const CS = TL.ctaStart;
  if (t < CS) { base(t); return; }
  const p = ease(clamp((t - CS) / .7));
  if (p < 1) { base(t); const st = state(t); ctx.save(); ctx.beginPath(); ctx.arc(960 + st.x, st.y - 90, p * 2100, 0, 7); ctx.clip(); endCard(t); ctx.restore();
    ctx.strokeStyle = `rgba(134,183,122,${1 - p})`; ctx.lineWidth = 6 + 26 * (1 - p); ctx.beginPath(); ctx.arc(960 + st.x, st.y - 90, p * 2100, 0, 7); ctx.stroke(); }
  else endCard(t);
}
window.FILM_TL = TL; window.DUR = TL.total; window.render = render; render(0); window.READY = true;
