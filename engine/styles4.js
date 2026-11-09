// style tambahan untuk video 4 (dari koleksi lemo-opuscar). Urutan = nomor katalog 61-66.
import { R, H, mk, noise, hash, rng, ell, rotp, rect, polyPath } from './main.js';
import { mod, clamp, hx, tohex, mix, dark, light, lum, snap, sat, cen, bbox, rise, ctx2, circles, cloud, blob, grainTile, once, OB, LN, paint, std, sil } from './styles.js';

// ───────── 61 GAME SHOW
const gameshow = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, 1.3), stroke: () => '#ffffff', lw: 5, all: true },
  bg(g, t) { g.fillStyle = '#4b2a9b'; g.fillRect(0, 0, R, H); const a0 = t * .25; g.save(); g.translate(R / 2, H / 2);
    for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#6a3fd0' : '#3a1f80'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1200, a0 + i * Math.PI / 8, a0 + (i + 1) * Math.PI / 8); g.fill(); } g.restore();
    [['#ffd23f', 150, 0, 1], ['#ff4f8b', 800, 330, .8], ['#2ee6a6', 280, 660, 1.1]].forEach(([c, x, off, s]) => { const y = rise(t, 520, off); g.fillStyle = c; g.beginPath(); g.arc(x, y, 26 * s, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x - 8 * s, y - 8 * s, 8 * s, 0, 7); g.fill(); });
    for (let i = 0; i < 14; i++) { const x = 40 + (i * 71) % (R - 80), y = mod(i * 97 - t * 620, H + 60) - 30, w = 8 + i % 3 * 3; g.save(); g.translate(x, y); g.rotate(t * 3 + i); g.fillStyle = ['#ffd23f', '#ff4f8b', '#2ee6a6', '#fff'][i % 4]; g.fillRect(-w, -w / 2, w * 2, w); g.restore(); }
    for (let i = 0; i < 12; i++) { const y = 40 + i * 90; [14, R - 14].forEach(x => { g.fillStyle = (Math.floor(t * 6) + i) % 2 ? '#fff3a0' : '#ffb000'; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); }); } },
};
// ───────── 62 SILENT FILM
const silent = {
  fps: 12,
  paint: { fps: 12, jit: 1.2, col: p => { const l = Math.round(lum(p.c) * 255); return tohex([l * 1.02, l * .97, l * .88]); }, stroke: () => '#1a1510', lw: 3, all: true },
  bg(g, t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#bfb394'); gr.addColorStop(1, '#e6dcc4'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    [[170, 0, 1.2], [770, 320, .9], [300, 650, 1.1]].forEach(([x, off, s]) => cloud(g, x, rise(t, 480, off + 200), s, '#efe6d0', '#8a7d62', 3));
    const r = rng(Math.floor(t * 12) + 5); g.strokeStyle = 'rgba(30,20,10,.35)'; g.lineWidth = 1.2; for (let i = 0; i < 4; i++) { const x = r() * R; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r() - .5) * 6, H); g.stroke(); }
    g.fillStyle = 'rgba(30,20,10,.5)'; for (let i = 0; i < 24; i++) g.fillRect(r() * R, r() * H, 2, 2 + r() * 3);
    g.fillStyle = `rgba(255,245,220,${.06 * r()})`; g.fillRect(0, 0, R, H); },
  post(g) { const v = g.createRadialGradient(R / 2, H / 2, 320, R / 2, H / 2, 800); v.addColorStop(0, 'rgba(20,10,0,0)'); v.addColorStop(1, 'rgba(20,10,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, R, H); },
};
// ───────── 63 BACKROOMS
const backrooms = {
  fps: 15,
  paint: { fps: 15, jit: .6, col: p => sat(p.c, .75), stroke: () => '#2a2410', sa: .8, lw: 2.2, all: true },
  bg(g, t) { g.fillStyle = '#c9b65a'; g.fillRect(0, 0, R, H); for (let x = 0; x < R; x += 54) { g.fillStyle = 'rgba(120,100,30,.22)'; g.fillRect(x, 0, 18, H); g.fillStyle = 'rgba(255,240,150,.12)'; g.fillRect(x + 28, 0, 6, H); }
    for (let y = mod(-t * 380, 540) - 540; y < H; y += 540) { g.fillStyle = '#e7ddb0'; g.fillRect(0, y + 230, R, 70); g.fillStyle = 'rgba(80,60,10,.35)'; g.fillRect(0, y + 300, R, 8); }
    for (let i = 0; i < 3; i++) { const y = mod(300 + i * 360 - t * 650, H + 400) - 200, fl = .85 + .15 * Math.sin(t * 60 + i * 7); g.fillStyle = `rgba(255,255,235,${fl})`; g.fillRect(250, y, 460, 38); g.fillStyle = 'rgba(255,255,220,.18)'; g.fillRect(180, y - 40, 600, 120); }
    const r = rng(Math.floor(t * 15) + 2); g.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, R, 1.5); g.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 40; i++) g.fillRect(r() * R, r() * H, 40 + r() * 80, 2);
    g.fillStyle = 'rgba(70,55,10,.35)'; g.fillRect(0, H - 40, R, 40); },
  post(g) { const v = g.createRadialGradient(R / 2, H / 2, 300, R / 2, H / 2, 760); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, R, H); },
};
// ───────── 64 GLASS PRODUCT
const glassp = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => 'rgba(255,255,255,.7)', lw: 1.6, all: true,
    fill(g, poly, col, p) { const [x0, x1, y0, y1] = bbox(poly), gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, light(col, .55)); gr.addColorStop(.5, col); gr.addColorStop(1, dark(col, .35)); g.save(); g.globalAlpha = .93; g.fillStyle = gr; polyPath(g, poly); g.fill(); g.clip(); g.globalAlpha = .5; g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x0 + (x1 - x0) * .3, y0 + (y1 - y0) * .25, (x1 - x0) * .22, (y1 - y0) * .1, -.5, 0, 7); g.fill(); g.restore(); } },
  bg(g, t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e1220'); gr.addColorStop(1, '#232c48'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    [[190, 0, 70, '#5ec8ff'], [760, 300, 52, '#ff7ad9'], [300, 640, 88, '#9a7bff'], [800, 900, 44, '#5effc2']].forEach(([x, off, r0, c]) => { const y = rise(t, 380, off + 200), q = g.createRadialGradient(x - r0 * .3, y - r0 * .3, r0 * .1, x, y, r0); q.addColorStop(0, 'rgba(255,255,255,.9)'); q.addColorStop(.35, c); q.addColorStop(1, 'rgba(255,255,255,.08)'); g.fillStyle = q; g.beginPath(); g.arc(x, y, r0, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.stroke(); });
    const sw = mod(t * 160, R + 400) - 200; g.fillStyle = 'rgba(255,255,255,.05)'; g.save(); g.translate(sw, 0); g.transform(1, 0, -.4, 1, 0, 0); g.fillRect(0, 0, 90, H); g.restore(); },
  under(g, st) { g.save(); g.fillStyle = 'rgba(120,180,255,.18)'; g.filter = 'blur(14px)'; g.beginPath(); g.ellipse(st.x, st.y + 210, 120 * st.sc, 24, 0, 0, 7); g.fill(); g.restore(); },
};
// ───────── 65 MEMPHIS DIORAMA
const MEMC = ['#ff6f91', '#ffc75f', '#2ec4b6', '#4d8bff', '#ffffff', '#1a1a1a'];
const memphis = {
  fps: 12,
  paint: { fps: 12, col: p => snap(p.c, MEMC), stroke: () => '#1a1a1a', lw: 4, all: true,
    fill(g, poly, col) { g.fillStyle = '#1a1a1a'; polyPath(g, poly.map(([x, y]) => [x + 6, y + 6])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { g.fillStyle = '#fff1d6'; g.fillRect(0, 0, R, H); g.fillStyle = '#ffd9e4'; for (let y = 0; y < H; y += 36) for (let x = (y / 36 % 2) * 18; x < R; x += 36) { g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill(); }
    const K = ['#2ec4b6', '#ff6f91', '#ffc75f', '#4d8bff', '#1a1a1a'];
    for (let i = 0; i < 12; i++) { const x = 60 + (i * 197) % (R - 120), y = rise(t, 360 + (i % 3) * 70, i * 140, H + 260), c = K[i % 5], k = i % 5, s = 30 + (i * 13) % 26;
      for (const pass of [0, 1]) { g.save(); g.translate(x + (pass ? 0 : 5), y + (pass ? 0 : 5)); g.rotate(i + t * .8); g.fillStyle = pass ? c : '#1a1a1a'; g.strokeStyle = pass ? c : '#1a1a1a'; g.lineWidth = 8; g.beginPath();
        if (k === 0) { g.moveTo(-s, s); g.lineTo(0, -s); g.lineTo(s, s); g.closePath(); g.fill(); }
        else if (k === 1) { g.arc(0, 0, s * .8, 0, 7); g.fill(); }
        else if (k === 2) { g.rect(-s * .8, -s * .8, s * 1.6, s * 1.6); g.fill(); }
        else if (k === 3) { g.moveTo(-s, 0); for (let j = 1; j <= 6; j++) g.quadraticCurveTo(-s + j * s / 3 - s / 6, j % 2 ? -s * .6 : s * .6, -s + j * s / 3, 0); g.stroke(); }
        else { g.arc(0, 0, s * .7, 0, 7); g.arc(0, 0, s * .35, 0, 7, true); g.fill('evenodd'); }
        g.restore(); } } },
};
// ───────── 66 DESKTOP FLYTHROUGH
const desktop = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#ffffff', lw: 4, all: true, fill(g, poly, col) { g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 14; g.shadowOffsetY = 6; g.fillStyle = col; polyPath(g, poly); g.fill(); g.restore(); } },
  bg(g, t) { const gr = g.createLinearGradient(0, 0, R, H); gr.addColorStop(0, '#3a6df0'); gr.addColorStop(.5, '#8a5cf0'); gr.addColorStop(1, '#f06aa8'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    const W = [[60, 0, 360, 240, '#ffffff'], [540, 250, 340, 220, '#f4f6ff'], [140, 520, 400, 260, '#ffffff'], [520, 820, 360, 230, '#f4f6ff']];
    W.forEach(([x, off, w, h, c], i) => { const y = rise(t, 330, off + 260, H + 360); g.save(); g.shadowColor = 'rgba(10,10,60,.35)'; g.shadowBlur = 30; g.shadowOffsetY = 12; g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, 14); g.fill(); g.restore();
      g.fillStyle = '#e3e6f2'; g.beginPath(); g.roundRect(x, y, w, 34, [14, 14, 0, 0]); g.fill(); ['#ff5f57', '#febc2e', '#28c840'].forEach((cc, j) => { g.fillStyle = cc; g.beginPath(); g.arc(x + 20 + j * 20, y + 17, 6, 0, 7); g.fill(); });
      g.fillStyle = '#c9cfe6'; for (let k = 0; k < 4; k++) g.fillRect(x + 20, y + 56 + k * 34, (w - 40) * (.9 - ((i + k) % 3) * .22), 14); g.fillStyle = ['#3a6df0', '#8a5cf0', '#f06aa8', '#28c840'][i]; g.fillRect(x + 20, y + h - 52, 90, 30); });
    const cy = rise(t, 200, 500, H + 200), cx = 480 + Math.sin(t * 1.5) * 220; g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + 40); g.lineTo(cx + 10, cy + 31); g.lineTo(cx + 19, cy + 48); g.lineTo(cx + 26, cy + 44); g.lineTo(cx + 17, cy + 28); g.lineTo(cx + 30, cy + 27); g.closePath(); g.fill(); g.stroke(); },
};
export const STY4 = [gameshow, silent, backrooms, glassp, memphis, desktop];
