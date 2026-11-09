// style tambahan untuk video 2 (dari koleksi lemo-opuscar). Urutan = nomor katalog 21..40.
import { R, H, mk, noise, hash, rng, ell, rotp, rect, polyPath } from './main.js';
import { mod, clamp, hx, tohex, mix, dark, light, lum, snap, sat, cen, bbox, rise, ctx2, circles, cloud, blob, grainTile, once, OB, LN, paint, std, sil } from './styles.js';

const gray = h => { const l = lum(h) * 255; return tohex([l, l, l]); };
const tx = (g, s, x, y, f, c) => { g.font = f; g.fillStyle = c; g.fillText(s, x, y); };
const bgFill = (g, c) => { g.fillStyle = c; g.fillRect(0, 0, R, H); };
const lin = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, R, H); };
const clipPoly = (g, poly, f) => { g.save(); polyPath(g, poly); g.clip(); f(); g.restore(); };

// ───────── 21 CAPTION NEWS
const captionnews = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, 1.15), stroke: () => '#0b0b0b', lw: 3, all: true },
  bg(g, t) { lin(g, 0, H, '#1d2c44', '#0c1420'); g.fillStyle = 'rgba(255,255,255,.06)'; [[60, 0, 300, 200], [520, 350, 340, 260], [140, 700, 420, 240]].forEach(([x, o, w, h]) => g.fillRect(x, rise(t, 300, o), w, h));
    g.font = '900 170px Inter'; g.fillStyle = 'rgba(255,255,255,.1)'; g.fillText('BREAKING', -30, rise(t, 520, 300)); g.fillText('FAKTA', 30, rise(t, 520, 780));
    const y = rise(t, 420, 560); g.fillStyle = '#ffe100'; g.fillRect(50, y - 100, 600, 124); tx(g, 'ANGKA', 78, y - 4, '900 100px Inter', '#0b0b0b');
    g.fillStyle = '#fff'; g.fillRect(0, 36, 430, 54); tx(g, 'SUMBER: DATA RESMI', 18, 74, '800 28px Inter', '#0b0b0b'); g.fillStyle = '#e8211b'; g.fillRect(0, 36, 12, 54); },
};

// ───────── 22 1920s NEWSREEL
const sepia = h => { const l = lum(h); return tohex([36 + l * 215, 28 + l * 195, 16 + l * 150]); };
const newsreel = {
  fps: 12,
  paint: { fps: 12, jit: 1.2, col: p => sepia(p.c), stroke: () => '#20150a', lw: 2.4, all: true, lineCol: () => '#20150a' },
  bg(g, t) { lin(g, 0, H, '#d8c79b', '#b9a56f'); g.fillStyle = '#17110a'; g.fillRect(0, 0, 70, H); g.fillRect(R - 70, 0, 70, H); g.fillStyle = '#d8c79b';
    for (let y = mod(-t * 380, 90) - 90; y < H; y += 90) { g.fillRect(22, y, 26, 40); g.fillRect(R - 48, y, 26, 40); }
    const y = rise(t, 400, 460); g.strokeStyle = '#2a1d0c'; g.lineWidth = 6; g.strokeRect(150, y - 120, 660, 200); g.lineWidth = 2; g.strokeRect(162, y - 108, 636, 176);
    g.textAlign = 'center'; tx(g, 'BERITA DUNIA', R / 2, y - 20, '900 78px Inter', '#2a1d0c'); tx(g, 'EDISI KHUSUS', R / 2, y + 36, '700 30px Inter', '#2a1d0c'); g.textAlign = 'left'; },
  post(g, t) { const r = rng(Math.floor(t * 12) * 13 + 1); g.fillStyle = 'rgba(255,255,255,.4)'; for (let i = 0; i < 3; i++) g.fillRect(r() * R, 0, 1.6, H);
    g.fillStyle = 'rgba(20,12,4,.55)'; for (let i = 0; i < 70; i++) { const s = r() * 3; g.fillRect(r() * R, r() * H, s, s); }
    const v = g.createRadialGradient(R / 2, H / 2, 280, R / 2, H / 2, 760); v.addColorStop(0, 'rgba(30,18,4,0)'); v.addColorStop(1, 'rgba(30,18,4,.6)'); g.fillStyle = v; g.fillRect(0, 0, R, H);
    g.fillStyle = `rgba(0,0,0,${r() * .14})`; g.fillRect(0, 0, R, H); },
};

// ───────── 23 LIVE COUNTDOWN SPLIT-SCREEN
const countdown = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#0a0a0f', lw: 3, all: true },
  bg(g, t) { bgFill(g, '#0a0a10'); g.fillStyle = '#12121c'; g.fillRect(0, 0, R / 2, H); g.fillStyle = '#ff5a1f'; g.fillRect(R / 2 - 3, 0, 6, H);
    g.textAlign = 'center'; tx(g, String(9 - Math.floor(t) % 10), R / 2, 760, '900 640px Inter', 'rgba(255,90,31,.2)'); g.textAlign = 'left';
    g.fillStyle = 'rgba(255,255,255,.35)'; for (let y = mod(-t * 400, 40) - 40; y < H; y += 40) { g.fillRect(24, y, y % 120 < 40 ? 44 : 24, 3); g.fillRect(R - 68, y, 44, 3); }
    tx(g, 'T-MINUS', 60, 90, '800 38px Inter', '#ff5a1f'); g.fillStyle = '#e8211b'; g.beginPath(); g.arc(R - 130, 80, 11, 0, 7); g.fill(); tx(g, 'LIVE', R - 106, 92, '800 32px Inter', '#fff'); },
  after(g, st, t) { g.save(); g.strokeStyle = '#ff5a1f'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.arc(st.x, st.y - 100 * st.sc, 150 * st.sc, -Math.PI / 2, -Math.PI / 2 + (t % 1) * Math.PI * 2); g.stroke(); g.restore(); },
};

// ───────── 24 TIME-LAPSE SYMPHONY
const citysymphony = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, 1.1), stroke: () => '#120f2e', lw: 2.4, all: true },
  bg(g, t) { lin(g, 0, H, '#17123f', '#ff8a4c'); g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 40; i++) g.fillRect(hash(i, 1, 5) * R, mod(hash(i, 2, 5) * H - t * 60, H), 2, 2);
    [[0, 520, '#1c1744', 330], [1, 780, '#0f0b2a', 560]].forEach(([k, v, c, sp]) => { g.fillStyle = c; for (let i = 0; i < 7; i++) { const w = 120 + hash(i, k, 3) * 90, h = 300 + hash(i, k, 7) * 260, x = i * 150 - 20, y = mod(k * 400 + i * 140 - t * sp, H + 700) - 400; g.fillRect(x, y, w, h);
        g.fillStyle = 'rgba(255,214,120,.8)'; for (let a = 0; a < 5; a++) for (let b = 0; b < 6; b++) if (hash(i * 7 + a, b, k + 9) > .45) g.fillRect(x + 14 + a * 20, y + 20 + b * 36, 9, 14); g.fillStyle = c; } });
    g.lineWidth = 4; g.lineCap = 'round'; for (let i = 0; i < 14; i++) { const x = 40 + hash(i, 4, 8) * 880, y = mod(hash(i, 5, 8) * H * 2 - t * 1400, H * 2) - 300, len = 160 + hash(i, 6, 8) * 220; const gr = g.createLinearGradient(0, y, 0, y + len); gr.addColorStop(0, 'rgba(255,230,160,0)'); gr.addColorStop(1, i % 2 ? 'rgba(255,255,255,.7)' : 'rgba(255,90,70,.75)'); g.strokeStyle = gr; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + len); g.stroke(); } },
};

// ───────── 25 VISUAL INVESTIGATION
const visualinvest = {
  fps: 24,
  paint: { fps: 24, col: p => mix(sat(p.c, .75), '#202830', .2), stroke: () => '#e9eef2', lw: 1.6, all: true },
  bg(g, t) { bgFill(g, '#15181d'); g.fillStyle = 'rgba(255,255,255,.1)'; for (let x = 30; x < R; x += 60) for (let y = mod(30 - t * 260, 60); y < H; y += 60) g.fillRect(x, y, 2, 2);
    const pts = [[160, 0], [700, 200], [320, 430], [780, 620], [200, 820]].map(([x, o], i) => [x, rise(t, 300, o + 100, H + 300), i]); g.strokeStyle = '#e8372c'; g.lineWidth = 3; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    pts.forEach(([x, y, i]) => { g.fillStyle = '#e8372c'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.fillStyle = '#e9e5d8'; g.fillRect(x - 80, y + 14, 160, 90); g.fillStyle = '#9aa0a6'; g.fillRect(x - 68, y + 26, 100, 8); g.fillRect(x - 68, y + 44, 130, 8); g.fillRect(x - 68, y + 62, 80, 8); tx(g, 'BUKTI ' + String(7 + i).padStart(2, '0'), x - 80, y + 128, '700 20px Inter', '#9fb0bf'); }); },
  after(g, st) { const x = st.x, y = st.y - 100 * st.sc, w = 170 * st.sc; g.save(); g.strokeStyle = '#38e0ff'; g.lineWidth = 4; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { g.beginPath(); g.moveTo(x + a * w, y + b * (w - 40)); g.lineTo(x + a * w, y + b * w * 1.1); g.lineTo(x + a * (w - 40), y + b * w * 1.1); g.stroke(); }); tx(g, 'SUBJEK 01', x - w, y - w * 1.1 - 12, '700 24px Inter', '#38e0ff'); g.restore(); },
};

// ───────── 26 CONSTRUCTIVIST MONTAGE
const KR = '#d62718', KK = '#141414', KC = '#efe3c8';
const kinomontage = {
  fps: 12,
  paint: { fps: 12, jit: 1, stroke: () => KK, lw: 3, all: false,
    col(p) { const m = { body: KC, shade: '#d9ccae', glint: KC, eyew: KC, coin2: KC }; if (m[p.k]) return m[p.k]; const l = lum(p.c); return l < .35 ? KK : l < .68 ? KR : KC; } },
  bg(g, t) { bgFill(g, KC); g.fillStyle = KR; g.beginPath(); g.arc(150, rise(t, 260, 600), 330, 0, 7); g.fill();
    g.fillStyle = KK; for (let i = 0; i < 4; i++) { const y = rise(t, 560, i * 420, H + 400); g.beginPath(); g.moveTo(-40, y + 120); g.lineTo(R + 40, y - 120); g.lineTo(R + 40, y - 40); g.lineTo(-40, y + 200); g.fill(); }
    g.fillStyle = KR; g.beginPath(); g.moveTo(R, 0); g.lineTo(R, rise(t, 300, 400, 1500) + 300); g.lineTo(R - 360, rise(t, 300, 400, 1500) + 520); g.fill();
    g.save(); g.translate(R / 2, rise(t, 380, 700)); g.rotate(-.21); g.textAlign = 'center'; tx(g, 'MAJU!', 0, 0, '900 220px Inter', KK); g.restore(); g.textAlign = 'left'; },
};

// ───────── 27 SPORTS TELESTRATOR
const telestrator = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#0c2a14', lw: 3, all: true },
  bg(g, t) { for (let i = -1; i < 9; i++) { g.fillStyle = (i + Math.floor(t * 300 / 140)) % 2 ? '#2f8f46' : '#379c4e'; g.fillRect(0, mod(i * 140 - t * 300, 1400) - 140 + 0, R, 140); }
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 5; const y = rise(t, 300, 540, 1300); g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); g.beginPath(); g.arc(R / 2, y, 170, 0, 7); g.stroke();
    g.strokeStyle = '#ffe600'; g.lineWidth = 8; g.lineCap = 'round'; g.setLineDash([22, 14]); const y2 = rise(t, 300, 150, 1300); g.beginPath(); g.moveTo(120, y2 + 300); g.quadraticCurveTo(480, y2 - 60, 780, y2 + 120); g.stroke(); g.setLineDash([]); g.beginPath(); g.moveTo(780, y2 + 120); g.lineTo(730, y2 + 112); g.moveTo(780, y2 + 120); g.lineTo(762, y2 + 164); g.stroke(); },
  under(g, st) { const x = st.x, y = st.y + 170 * st.sc * .55; g.save(); g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(x - 40, 0); g.lineTo(x + 40, 0); g.lineTo(x + 190, y); g.lineTo(x - 190, y); g.fill(); g.strokeStyle = '#ffe600'; g.lineWidth = 6; g.setLineDash([14, 8]); g.beginPath(); g.ellipse(x, y, 190, 44, 0, 0, 7); g.stroke(); g.restore(); },
};

// ───────── 28 BROADCAST NEWS PACKAGE
const newspackage = {
  fps: 24,
  paint: { fps: 24, col: p => sat(p.c, 1.1), stroke: () => '#06143a', lw: 2.6, all: true },
  bg(g, t) { lin(g, 0, H, '#0a2a6b', '#1550bd'); g.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 4; i++) { const x = mod(i * 420 - t * 240, R + 600) - 300; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 140, 0); g.lineTo(x - 260, H); g.lineTo(x - 400, H); g.fill(); }
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; for (let y = mod(-t * 300, 90); y < H; y += 90) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); }
    g.fillStyle = '#e8211b'; g.fillRect(0, 40, 250, 66); tx(g, 'LIVE', 22, 90, '900 48px Inter', '#fff'); g.fillStyle = '#fff'; g.fillRect(250, 40, 460, 66); tx(g, 'BERITA TERKINI', 270, 88, '800 36px Inter', '#0a2a6b');
    g.fillStyle = '#fff'; g.fillRect(0, 800, R, 56); g.fillStyle = '#e8211b'; g.fillRect(0, 800, 14, 56); tx(g, 'KABAR PENTING • UPDATE HARI INI • LIPUTAN KHUSUS • ', -mod(t * 220, 900), 842, '800 34px Inter', '#0a2a6b'); tx(g, 'KABAR PENTING • UPDATE HARI INI • LIPUTAN KHUSUS • ', 900 - mod(t * 220, 900), 842, '800 34px Inter', '#0a2a6b'); },
};

// ───────── 29 SATELLITE BRIEFING
const satellite = {
  fps: 24,
  paint: { fps: 24, col: p => mix(sat(p.c, .8), '#0a1a22', .1), stroke: () => '#9be8f0', lw: 1.6, all: true },
  bg(g, t) { bgFill(g, '#07131c'); g.fillStyle = '#0f2a24'; for (let i = 0; i < 5; i++) { const y = rise(t, 280, i * 300, H + 400), x = hash(i, 2, 4) * 600; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 340, y + 40); g.lineTo(x + 420, y + 250); g.lineTo(x + 60, y + 270); g.fill(); }
    g.strokeStyle = 'rgba(70,170,180,.4)'; g.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = rise(t, 280, i * 110, H + 200); g.beginPath(); for (let x = 0; x <= R; x += 20) g.lineTo(x, y + Math.sin(x / 90 + i) * 30); g.stroke(); }
    g.fillStyle = '#ffd36b'; for (let i = 0; i < 60; i++) g.fillRect(hash(i, 3, 6) * R, mod(hash(i, 4, 6) * H - t * 280, H), 3, 3);
    g.strokeStyle = 'rgba(155,232,240,.5)'; g.lineWidth = 1; for (let x = 0; x < R; x += 120) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } tx(g, '6.21°S  106.85°E', 40, 70, '600 26px Inter', '#9be8f0'); tx(g, 'ORBIT 417 • RES 0.5m', 40, 104, '500 20px Inter', 'rgba(155,232,240,.7)'); },
  after(g, st) { const x = st.x, y = st.y - 100 * st.sc, w = 160 * st.sc; g.save(); g.strokeStyle = '#ffd36b'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - w * 1.4, y); g.lineTo(x - w * .5, y); g.moveTo(x + w * .5, y); g.lineTo(x + w * 1.4, y); g.moveTo(x, y - w * 1.4); g.lineTo(x, y - w * .5); g.moveTo(x, y + w * .5); g.lineTo(x, y + w * 1.4); g.stroke(); g.strokeRect(x - w, y - w, w * 2, w * 2); g.restore(); },
};

// ───────── 30 ENGINEERING BRIEFING BOARD
const briefingboard = {
  fps: 24,
  paint: { fps: 24, col: p => mix(p.c, '#8fa3b8', .4), stroke: () => '#e6edf5', lw: 1.7, all: true },
  bg(g, t) { bgFill(g, '#232a33'); g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1; for (let x = 0; x < R; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = mod(-t * 280, 60); y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); }
    [[100, 0, 'A'], [560, 330, 'B'], [180, 660, 'C']].forEach(([x, o, l]) => { const y = rise(t, 300, o + 200, H + 300); g.strokeStyle = '#e6edf5'; g.lineWidth = 2; g.strokeRect(x, y, 300, 190); g.fillStyle = '#2e3744'; g.fillRect(x, y, 300, 44); tx(g, 'OPSI ' + l, x + 16, y + 32, '700 26px Inter', '#e6edf5'); g.fillStyle = '#7f8ea0'; g.fillRect(x + 16, y + 70, 200, 8); g.fillRect(x + 16, y + 100, 240, 8); g.fillRect(x + 16, y + 130, 150, 8); g.fillStyle = '#ff8a2b'; g.beginPath(); g.arc(x + 276, y + 160, 14, 0, 7); g.fill(); });
    const y = rise(t, 300, 520, H + 300); g.strokeStyle = '#ff8a2b'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, y); g.lineTo(900, y); g.moveTo(60, y - 10); g.lineTo(60, y + 10); g.moveTo(900, y - 10); g.lineTo(900, y + 10); g.stroke(); g.textAlign = 'center'; tx(g, '240 mm', R / 2, y - 12, '600 22px Inter', '#ff8a2b'); g.textAlign = 'left'; },
  after(g, st) { const x = st.x + 150 * st.sc, y = st.y - 220 * st.sc; g.save(); g.strokeStyle = '#ff8a2b'; g.fillStyle = '#ff8a2b'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(st.x + 70 * st.sc, st.y - 150 * st.sc); g.lineTo(x, y); g.lineTo(x + 70, y); g.stroke(); g.beginPath(); g.arc(x + 90, y, 22, 0, 7); g.fill(); g.textAlign = 'center'; tx(g, '1', x + 90, y + 9, '800 26px Inter', '#232a33'); g.restore(); },
};

// ───────── 31 LIDAR SURVEY (titik-titik)
const turbo = v => `hsl(${Math.round(240 - 240 * clamp(v))},95%,${58 + 8 * Math.sin(v * 9)}%)`;
const lidar = {
  fps: 12,
  paint: { fps: 12, stroke: () => null, col: p => p.c,
    fill(g, poly, col, p, t) { const [x0, x1, y0, y1] = bbox(poly), id = Math.round(x0 + y0 * 3); clipPoly(g, poly, () => { g.fillStyle = col; for (let x = x0; x < x1; x += 3.3) for (let y = y0; y < y1; y += 3.3) { const h = hash(Math.round(x), Math.round(y), id + Math.floor(t * 12)); if (h > .12) g.fillRect(x + h * 1.5, y + hash(Math.round(y), Math.round(x), 4) * 1.5, 2.7, 2.7); } }); } },
  bg(g, t) { bgFill(g, '#05060a'); for (let y = mod(-t * 300, 24) - 24, r = 0; y < H; y += 24, r++) for (let x = 0; x < R; x += 24) { const h = hash(x, r + Math.floor(t * 300 / 24), 7), v = (Math.sin(x / 130 + (r + Math.floor(t * 300 / 24)) / 7) + 1) / 2; if (h > .35) { g.fillStyle = turbo(v * .8 + h * .2); g.globalAlpha = .55; g.fillRect(x + h * 8, y + h * 6, 2.6, 2.6); g.globalAlpha = 1; } } },
};

// ───────── 32 PROJECTION ON WHITE MODEL
const whitemodel = {
  fps: 24,
  paint: { fps: 24, col: p => { const l = lum(p.c); return tohex([172 + l * 80, 172 + l * 78, 168 + l * 76].map(v => Math.min(250, v))); }, stroke: () => '#6f6f68', lw: 1.6, all: true,
    fill(g, poly, col, p, t) { g.fillStyle = col; polyPath(g, poly); g.fill(); clipPoly(g, poly, () => { const [x0, x1, y0, y1] = bbox(poly); for (let i = -6; i < 14; i++) { g.fillStyle = `hsla(${(i * 40 + t * 120) % 360},90%,60%,.13)`; g.fillRect(x0 - 20 + mod(i * 18 + t * 70, 220) - 110, y0 - 10, 9, y1 - y0 + 20); } }); } },
  bg(g, t) { bgFill(g, '#e8e8e4'); const bx = (x, y, w, h) => { g.fillStyle = '#fbfbf9'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y - w * .5); g.lineTo(x + 2 * w, y); g.lineTo(x + w, y + w * .5); g.fill(); g.fillStyle = '#d2d2cd'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + w * .5); g.lineTo(x + w, y + w * .5 + h); g.lineTo(x, y + h); g.fill(); g.fillStyle = '#b8b8b2'; g.beginPath(); g.moveTo(x + 2 * w, y); g.lineTo(x + w, y + w * .5); g.lineTo(x + w, y + w * .5 + h); g.lineTo(x + 2 * w, y + h); g.fill(); };
    [[40, 0, 100, 150], [420, 240, 120, 220], [90, 520, 90, 120], [600, 780, 100, 180], [300, 1000, 110, 160]].forEach(([x, o, w, h]) => bx(x, rise(t, 360, o + 100, H + 400), w, h));
    g.globalCompositeOperation = 'multiply'; for (let i = 0; i < 5; i++) { g.fillStyle = `hsla(${(i * 70 + t * 80) % 360},90%,70%,.35)`; g.fillRect(0, mod(i * 260 - t * 260, 1300) - 160, R, 110); } g.globalCompositeOperation = 'source-over'; },
};

// ───────── 33 DATA PHYSICALIZATION
const dataphysical = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#3a2a15', lw: 2.2, all: true, fill(g, poly, col) { g.fillStyle = 'rgba(40,24,6,.3)'; polyPath(g, poly.map(([x, y]) => [x + 6, y + 9])); g.fill(); g.fillStyle = col; polyPath(g, poly); g.fill(); } },
  bg(g, t) { bgFill(g, '#c9a26b'); g.strokeStyle = 'rgba(90,55,20,.28)'; g.lineWidth = 2; for (let y = mod(-t * 280, 120); y < H; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(R, y); g.stroke(); for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(0, y + 18 + k * 17); g.bezierCurveTo(300, y + 10 + k * 17, 600, y + 26 + k * 17, R, y + 18 + k * 17); g.globalAlpha = .35; g.stroke(); g.globalAlpha = 1; } }
    const cols = ['#e8594f', '#2f9e8f', '#f2b134', '#4f7fd9'];
    [[130, 0], [370, 140], [610, 60], [250, 620], [490, 700]].forEach(([x, o], i) => { const y = rise(t, 330, o + 300, H + 360), h = 90 + hash(i, 1, 2) * 190, c = cols[i % 4]; g.fillStyle = 'rgba(40,24,6,.3)'; g.beginPath(); g.ellipse(x + 20, y + 22, 74, 24, 0, 0, 7); g.fill(); g.fillStyle = dark(c, .2); g.fillRect(x - 60, y - h, 120, h); g.fillStyle = c; g.beginPath(); g.ellipse(x, y - h, 60, 22, 0, 0, 7); g.fill(); g.fillStyle = dark(c, .35); g.beginPath(); g.ellipse(x, y, 60, 22, 0, 0, Math.PI); g.fill(); g.fillStyle = dark(c, .2); g.fillRect(x - 60, y - h, 120, h); g.fillStyle = c; g.beginPath(); g.ellipse(x, y - h, 60, 22, 0, 0, 7); g.fill(); g.textAlign = 'center'; tx(g, String(Math.round(h / 2.2)) + '%', x, y - h + 7, '800 24px Inter', '#fff'); g.textAlign = 'left'; }); },
};

// ───────── 34 EXPLODED TEARDOWN (bagian ayam melayang terpisah)
function explode(g, parts, ox, oy, sc, t) {
  const cs = parts.filter(p => !p.line).map(p => cen(p.poly)), c0 = [cs.reduce((s, c) => s + c[0], 0) / cs.length, cs.reduce((s, c) => s + c[1], 0) / cs.length], k = .75 + .25 * Math.sin(t * 2.2);
  const moved = parts.map(p => { if (p.line) return { ...p, poly: p.poly.map(([x, y]) => [x + (x - c0[0]) * k, y + (y - c0[1]) * k]) }; const c = cen(p.poly), dx = (c[0] - c0[0]) * k, dy = (c[1] - c0[1]) * k; return { ...p, poly: p.poly.map(([x, y]) => [x + dx, y + dy]), _o: c, _d: [dx, dy] }; });
  g.save(); g.setTransform(sc, 0, 0, sc, ox, oy); g.strokeStyle = 'rgba(40,50,64,.55)'; g.lineWidth = 1.2; g.setLineDash([5, 5]); moved.forEach(p => { if (p._o) { g.beginPath(); g.moveTo(p._o[0], p._o[1]); g.lineTo(p._o[0] + p._d[0], p._o[1] + p._d[1]); g.stroke(); } }); g.restore();
  paint(g, moved, ox, oy, sc, teardown.paint, t);
}
const teardown = {
  fps: 24,
  paint: { fps: 24, col: p => p.c, stroke: () => '#2b2f36', lw: 2, all: true },
  draw: explode,
  bg(g, t) { bgFill(g, '#f0f1f3'); g.strokeStyle = 'rgba(60,70,85,.3)'; g.lineWidth = 1.4; g.setLineDash([8, 7]); g.beginPath(); g.moveTo(R / 2, 0); g.lineTo(R / 2, H); g.stroke(); g.setLineDash([]);
    for (let i = 0; i < 6; i++) { const y = rise(t, 340, i * 230 + 100, H + 300), x = 90 + hash(i, 8, 3) * 780; g.strokeStyle = '#5a6472'; g.fillStyle = '#d8dce2'; g.lineWidth = 2; g.beginPath(); for (let a = 0; a < 6; a++) g.lineTo(x + Math.cos(a * 1.047) * 28, y + Math.sin(a * 1.047) * 28); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.arc(x, y, 9, 0, 7); g.stroke(); tx(g, String(i + 1), x + 40, y - 26, '700 22px Inter', '#5a6472'); } },
};

// ───────── 35 MICROSCOPE STORY
const microscope = {
  fps: 24,
  paint: { fps: 24, col: p => mix(p.c, '#b64cc9', .32), stroke: () => '#4a1d63', sa: .8, lw: 1.5, all: true },
  bg(g, t) { const gr = g.createRadialGradient(R / 2, H / 2, 40, R / 2, H / 2, 640); gr.addColorStop(0, '#f6efe4'); gr.addColorStop(1, '#d9ccbb'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    for (let i = 0; i < 16; i++) { const x = hash(i, 1, 9) * R, y = rise(t, 120 + hash(i, 5, 9) * 160, hash(i, 2, 9) * H, H + 300), r = 30 + hash(i, 3, 9) * 70; const c = i % 3 ? '#b64cc9' : '#2fa8a0'; g.globalAlpha = .28; g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.globalAlpha = .6; g.strokeStyle = dark(c, .3); g.lineWidth = 2; g.stroke(); g.fillStyle = dark(c, .3); g.beginPath(); g.arc(x + r * .2, y - r * .1, r * .36, 0, 7); g.fill(); g.globalAlpha = 1; } },
  post(g, t) { const v = g.createRadialGradient(R / 2, H / 2, 470, R / 2, H / 2, 560); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = v; g.fillRect(0, 0, R, H); g.strokeStyle = 'rgba(40,20,60,.35)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(R / 2, 180); g.lineTo(R / 2, 900); g.moveTo(100, H / 2); g.lineTo(R - 100, H / 2); g.stroke();
    g.fillStyle = '#1b1b1b'; g.fillRect(70, 120, 180, 6); tx(g, '40×  |  50 µm', 70, 108, '700 22px Inter', '#1b1b1b'); },
};

// ───────── 36 ARCHIVE LIGHT TABLE
const archive = {
  fps: 12,
  paint: { fps: 12, jit: .8, col: p => mix(sat(p.c, .7), '#f4f0e4', .25), stroke: () => '#2a2a2a', lw: 1.8, all: true },
  bg(g, t) { const gr = g.createRadialGradient(R / 2, H / 2, 60, R / 2, H / 2, 720); gr.addColorStop(0, '#fbfdff'); gr.addColorStop(1, '#cfdde6'); g.fillStyle = gr; g.fillRect(0, 0, R, H);
    [[26, 0], [R - 134, 190]].forEach(([x, o]) => { g.fillStyle = '#17181a'; g.fillRect(x, 0, 108, H); for (let y = mod(-t * 300, 100); y < H + 100; y += 100) { g.fillStyle = '#eef2f5'; g.fillRect(x + 8, y, 14, 22); g.fillRect(x + 86, y, 14, 22); g.fillStyle = '#7b8791'; g.fillRect(x + 28, y + 6, 52, 84); } });
    [[230, 0, -.08], [520, 330, .1], [260, 700, .05]].forEach(([x, o, r]) => { const y = rise(t, 290, o + 200, H + 340); g.save(); g.translate(x + 100, y); g.rotate(r); g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-92, -64, 200, 150); g.fillStyle = '#fbfaf6'; g.fillRect(-100, -70, 200, 150); g.fillStyle = '#9aa7b0'; g.fillRect(-84, -54, 168, 94); g.fillStyle = '#6a757d'; g.fillRect(-84, 46, 100, 8); g.restore(); }); },
  after(g, st, t) { const x = st.x, y = st.y - 100 * st.sc, r = 170 * st.sc; g.save(); g.strokeStyle = 'rgba(214,40,40,.9)'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); for (let a = 0; a <= 6.9; a += .15) { const q = r + Math.sin(a * 3 + Math.floor(t * 6)) * 5 + a * 3; a ? g.lineTo(x + Math.cos(a - 1.2) * q * 1.05, y + Math.sin(a - 1.2) * q) : g.moveTo(x + Math.cos(-1.2) * q, y + Math.sin(-1.2) * q); } g.stroke(); g.restore(); },
};

// ───────── 37 IMPASTO OIL PAINTING (sapuan cat tebal)
function strokes(g, poly, col, seed, n, len, w) { const [x0, x1, y0, y1] = bbox(poly); clipPoly(g, poly, () => { g.lineCap = 'round'; for (let i = 0; i < n; i++) { const x = x0 + hash(i, seed, 2) * (x1 - x0), y = y0 + hash(i, seed, 3) * (y1 - y0), a = -.7 + hash(i, seed, 4) * .5; g.strokeStyle = hash(i, seed, 5) > .5 ? light(col, .22) : dark(col, .22); g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke(); } }); }
const impasto = {
  fps: 8,
  paint: { fps: 8, col: p => sat(p.c, 1.2), stroke: () => '#1d2a5a', sa: .55, lw: 3.5, all: true,
    fill(g, poly, col, p, t) { g.fillStyle = col; polyPath(g, poly); g.fill(); strokes(g, poly, col, Math.round(cen(poly)[0]) + Math.floor(t * 8), 18, 26, 7); } },
  bg(g, t) { lin(g, 0, H, '#1b3a8f', '#3a6fd0'); for (let i = 0; i < 70; i++) { const x = hash(i, 1, 6) * R, y = mod(hash(i, 2, 6) * (H + 200) - t * 300 * (.5 + hash(i, 3, 6)), H + 200) - 100, k = hash(i, 4, 6); g.strokeStyle = k > .66 ? '#ffd23f' : k > .33 ? '#5aa0ff' : '#10286a'; g.lineWidth = 12 + k * 10; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, 44 + k * 60, 3.3 + k, 5 + k); g.stroke(); } },
};

// ───────── 38 ONE-LINE DRAWING
const oneline = {
  fps: 12,
  paint: { fps: 12, jit: .9, col: p => '#fffefb', stroke: () => '#111', lw: 3.4, all: true, lineCol: () => '#111', fill(g, poly) { g.fillStyle = '#fffefb'; polyPath(g, poly); g.fill(); } },
  bg(g, t) { bgFill(g, '#fffefb'); g.strokeStyle = '#111'; g.lineWidth = 3.4; g.lineJoin = 'round'; g.beginPath(); for (let y = -60; y < H + 60; y += 14) { const yy = y + mod(t * 330, 14), k = (yy + t * 330) / 90; const x = R / 2 + Math.sin(k) * 300 + Math.sin(k * 2.3) * 90; y === -60 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke();
    g.fillStyle = '#e8372c'; g.beginPath(); g.arc(90, rise(t, 260, 400), 16, 0, 7); g.fill(); },
};

// ───────── 39 URBAN SKETCH · PEN & WASH
const urbansketch = {
  fps: 8,
  paint: { fps: 8, jit: 1.1, col: p => p.c, stroke: () => '#252525', lw: 1.7, all: true, lineCol: () => '#252525',
    fill(g, poly, col) { g.globalAlpha = .88; g.fillStyle = light(col, .22); polyPath(g, poly.map(([x, y]) => [x + 4, y + 3])); g.fill(); g.globalAlpha = 1; } },
  bg(g, t) { bgFill(g, '#f6f0e1'); const wash = ['#e9b8a0', '#a9cfd6', '#efd9a0', '#b9c9a2']; [[40, 0, 260, 560], [330, 380, 300, 460], [640, 120, 280, 620]].forEach(([x, o, w, h], i) => { const y = rise(t, 280, o + 300, H + 600) - 300; g.globalAlpha = .5; g.fillStyle = wash[i]; g.fillRect(x + 8, y + 10, w, h); g.globalAlpha = 1; g.strokeStyle = '#252525'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
      for (let a = 0; a < Math.floor(w / 60); a++) for (let b = 0; b < Math.floor(h / 90); b++) g.strokeRect(x + 22 + a * 58, y + 24 + b * 86, 30, 46); g.lineWidth = 1; for (let s = 0; s < 14; s++) { g.beginPath(); g.moveTo(x + w - 90 + s * 6, y + h); g.lineTo(x + w - 60 + s * 6, y + h - 60); g.stroke(); } }); },
};

// ───────── 40 CHALKBOARD
const chalkboard = {
  fps: 8,
  paint: { fps: 8, jit: 1.1, col: p => mix(p.c, '#f2f2e8', .22), stroke: () => '#fdfdf5', lw: 2.2, all: true, lineCol: () => '#fdfdf5',
    fill(g, poly, col) { g.globalAlpha = 1; g.fillStyle = col; polyPath(g, poly); g.fill(); g.globalAlpha = 1; } },
  bg(g, t) { lin(g, 0, H, '#1f2f28', '#17231e'); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(hash(i, 1, 4) * R, mod(hash(i, 2, 4) * H - t * 200, H), 140, 50, .3, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(246,246,238,.8)'; g.fillStyle = 'rgba(246,246,238,.85)'; g.lineWidth = 3; g.lineCap = 'round'; [['E = mc²', 70, 0], ['x² + y² = r²', 420, 300], ['a ≠ b', 160, 620], ['π ≈ 3,14', 480, 880]].forEach(([s, x, o]) => tx(g, s, x, rise(t, 340, o + 200, H + 300), '600 54px Inter', 'rgba(246,246,238,.8)'));
    [[780, 100], [90, 520], [800, 760]].forEach(([x, o]) => { const y = rise(t, 340, o + 100, H + 300); g.beginPath(); for (let a = 0; a < 5; a++) { const r = a % 2 ? 14 : 34, an = a * 1.2566 - 1.57; g.lineTo(x + Math.cos(an) * 30, y + Math.sin(an) * 30); } g.closePath(); g.stroke(); });
    g.fillStyle = '#6b4a2b'; g.fillRect(0, H - 24, R, 24); g.fillStyle = '#f6f6ee'; g.fillRect(100, H - 34, 80, 10); },
};

export const STY2 = [captionnews, newsreel, countdown, citysymphony, visualinvest, kinomontage, telestrator, newspackage, satellite, briefingboard, lidar, whitemodel, dataphysical, teardown, microscope, archive, impasto, oneline, urbansketch, chalkboard];
