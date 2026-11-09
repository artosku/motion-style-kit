/*
 * MINYAM — maskot ayam Artosku, versi JavaScript (Canvas 2D).
 *
 * Ini salinan LANGSUNG (angka demi angka) dari kode asli aplikasi:
 *   lib/features/streak/maskot/mascot_painter.dart   (tampak depan + pose)
 *   lib/features/streak/maskot/mascot_views.dart     (tampak samping + belakang)
 * Salinan Dart-nya ada di ../kode_dart/. Kalau Dart berubah, port ini harus ikut berubah.
 *
 * JANGAN mengubah angka di file ini untuk "memperbaiki" tampilan. Bentuk Minyam
 * terkunci. Lihat ../ATURAN_MINYAM.md.
 *
 * Pakai (browser):
 *   <script src="minyam.js"></script>
 *   Minyam.draw(ctx, { x: 400, y: 700, scale: 2, t: 1.0, pose: { mood: 'joy' } });
 *
 * Pakai (node, dengan paket "canvas"):
 *   const Minyam = require('./minyam.js');
 *
 * Sistem koordinat: kaki Minyam ada di (0,0) lokal, sumbu y ke BAWAH, tinggi badan
 * sekitar 230 satuan (kepala + jengger sampai -208), lebar kipas ekor ~150 ke tiap sisi.
 * `scale` mengalikan semuanya. Semua gambar hanya memakai: save/restore, translate,
 * scale, rotate, beginPath, moveTo, lineTo, quadraticCurveTo, bezierCurveTo, ellipse,
 * closePath, fill, stroke, createRadialGradient. Jadi ctx apa pun yang mengerti ini
 * (termasuk perekam SVG di svg_ctx.js) bisa dipakai.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Minyam = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI = Math.PI;
  const rad = (d) => (d * PI) / 180;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const mixN = (a, b, k) => a + (b - a) * k;

  // ---------- warna ----------
  const C = (rgb, a = 1) => ({ r: (rgb >> 16) & 255, g: (rgb >> 8) & 255, b: rgb & 255, a });
  const alpha = (c, a) => ({ r: c.r, g: c.g, b: c.b, a });
  const lerp = (c1, c2, k) => ({
    r: Math.round(mixN(c1.r, c2.r, k)),
    g: Math.round(mixN(c1.g, c2.g, k)),
    b: Math.round(mixN(c1.b, c2.b, k)),
    a: mixN(c1.a, c2.a, k),
  });
  const css = (c) => `rgba(${c.r},${c.g},${c.b},${+c.a.toFixed(4)})`;
  const WHITE = C(0xffffff);

  function toHsl(c) {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const l = (mx + mn) / 2;
    let h = 0, s = 0;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s, l, a: c.a };
  }
  function fromHsl(o) {
    const { h, s, l } = o;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255), a: o.a };
  }

  // ---------- palet (nilai asli dari kode aplikasi) ----------
  const PALETTE = {
    cream: C(0xfff3d8),
    creamShade: C(0xf0d9ae),
    outline: C(0xa06e32, 0x66 / 255),
    wing: C(0xffe7b8),
    wingLine: C(0xe8cf9c),
    gold: C(0xf6c431),
    goldRim: C(0xd99a12),
    goldInner: C(0xe5a91c),
    goldLetter: C(0xb97c0b),
    comb: C(0xee3b45),
    combShine: C(0xff6f78),
    wattle: C(0xe8353f),
    beak: C(0xffb62d),
    beakEdge: C(0xe0951a),
    beakInside: C(0xff9d1f),
    mouth: C(0x7a2b2b),
    leg: C(0xf3a21f),
    foot: C(0xf5a623),
    toe: C(0xc97e0a),
    cheek: C(0xff9aa6),
    eye: C(0x2a1d14),
    brow: C(0x4a2f1b),
    slot: C(0x8a6a3e),
    tear: C(0x7cc8ff),
    starGold: C(0xffd84a),
    featherTeal: [C(0x16b3a4), C(0x3fd9c8)],
    featherPink: [C(0xe33d80), C(0xff7aa8)],
    featherOrange: [C(0xff8a2b), C(0xffc15e)],
    // warna saat kotor ("grime" = 1, hari pertama)
    dirt: {
      cream: C(0xd6c3a2), shade: C(0xb9a582), wing: C(0xd9c29a), gold: C(0xb59a4a),
      comb: C(0xb7545a), leg: C(0xb07e34), foot: C(0xb4803a), beak: C(0xd59a3a),
      featherA: C(0x7a7468), featherB: C(0xa39b8a),
    },
  };
  const P = PALETTE;

  // ---------- pose ----------
  const MOODS = ['happy', 'sleepy', 'sleep', 'wait', 'joy', 'sad', 'frozen'];
  const EYES = ['normal', 'shock', 'dizzy', 'cross', 'sadClosed', 'angry'];
  const VIEWS = ['front', 'side', 'back'];

  const DEFAULT_POSE = {
    mood: 'happy', squashX: 1, squashY: 1, lift: 0, flap: 0, beak: 0, look: 0, coin: 0,
    facing: 1, grime: 0, view: 'front', step: 0, legKick: 1, sit: 0,
    wingLeft: null, wingRight: null, eyeGlow: 0, lookY: 0, eyeOpen: null, eyes: 'normal',
    sweat: 0, tilt: 0, wingCover: 0, stars: 0, peek: 0, eyeOpenRight: null,
  };
  const withPose = (p) => Object.assign({}, DEFAULT_POSE, p || {});

  function blinkOpen(t) {
    const period = 3.4;
    const m = (t % period) / period;
    const d = 0.05;
    if (m > 0.9 && m < 0.9 + d) return 1 - Math.sin(((m - 0.9) / d) * PI);
    return 1;
  }

  // ---------- alat gambar ----------
  const fillP = (color) => ({ fill: color });
  const lineP = (color, w) => ({ stroke: color, w });

  function paint(ctx, p) {
    if (p.fill) {
      ctx.fillStyle = css(p.fill);
      ctx.fill();
    } else {
      ctx.strokeStyle = css(p.stroke);
      ctx.lineWidth = p.w;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }

  class Path {
    constructor() { this.s = []; }
    moveTo(x, y) { this.s.push(['M', x, y]); return this; }
    lineTo(x, y) { this.s.push(['L', x, y]); return this; }
    quadTo(a, b, x, y) { this.s.push(['Q', a, b, x, y]); return this; }
    cubicTo(a, b, c, d, x, y) { this.s.push(['C', a, b, c, d, x, y]); return this; }
    close() { this.s.push(['Z']); return this; }
  }
  const path = () => new Path();

  function drawPath(ctx, pa, p) {
    ctx.beginPath();
    for (const s of pa.s) {
      if (s[0] === 'M') ctx.moveTo(s[1], s[2]);
      else if (s[0] === 'L') ctx.lineTo(s[1], s[2]);
      else if (s[0] === 'Q') ctx.quadraticCurveTo(s[1], s[2], s[3], s[4]);
      else if (s[0] === 'C') ctx.bezierCurveTo(s[1], s[2], s[3], s[4], s[5], s[6]);
      else ctx.closePath();
    }
    paint(ctx, p);
  }

  function oval(ctx, cx, cy, rx, ry, p) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * PI);
    paint(ctx, p);
  }

  function line(ctx, x1, y1, x2, y2, p) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    paint(ctx, p);
  }

  // persegi bulat (RRect) lewat kurva kubik, tanpa bergantung ctx.roundRect
  function rrect(ctx, x, y, w, h, r, p) {
    const k = 0.5522847498 * r;
    const x2 = x + w, y2 = y + h;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x2 - r, y);
    ctx.bezierCurveTo(x2 - r + k, y, x2, y + r - k, x2, y + r);
    ctx.lineTo(x2, y2 - r);
    ctx.bezierCurveTo(x2, y2 - r + k, x2 - r + k, y2, x2 - r, y2);
    ctx.lineTo(x + r, y2);
    ctx.bezierCurveTo(x + r - k, y2, x, y2 - r + k, x, y2 - r);
    ctx.lineTo(x, y + r);
    ctx.bezierCurveTo(x, y + r - k, x + r - k, y, x + r, y);
    ctx.closePath();
    paint(ctx, p);
  }

  // ---------- kilau mata (Aura Kilat) ----------
  function eyeGlow(ctx, lookX, open, glow, t) {
    if (glow <= 0 || open < 0.2) return;
    const g = clamp(glow);
    const flicker = 0.85 + 0.15 * Math.sin(t * 17);
    const grad = ctx.createRadialGradient(lookX, 0, 0, lookX, 0, 27 * g);
    grad.addColorStop(0, css(alpha(C(0xfff2a0), 0.8 * g * flicker)));
    grad.addColorStop(1, css(alpha(C(0xffc800), 0)));
    ctx.beginPath();
    ctx.ellipse(lookX, 0, 27 * g, 27 * g, 0, 0, 2 * PI);
    ctx.fillStyle = grad;
    ctx.fill();
    oval(ctx, lookX, 1, 9.5, 11 * open, fillP(alpha(C(0xffd84a), 0.96 * g)));
    oval(ctx, lookX, 1, 5.2, 6.4 * open, fillP(alpha(WHITE, g)));
  }

  // ---------- warna + gerak kecil yang dipakai semua tampak ----------
  function makeFx(pose, t, hideComb, hideCoin) {
    const mood = pose.mood;
    const grime = clamp(pose.grime);
    const joy = mood === 'joy';
    const D = P.dirt;
    const droop = mood === 'sleepy' || mood === 'sleep' || mood === 'wait' || mood === 'sad' ? 1 : 0;
    const fx = {
      pose, t, hideComb, hideCoin, grime, joy, droop,
      tailSway: Math.sin(t * (joy ? 9 : 2.4)) * (joy ? 9 : 5),
      combWob: Math.sin(t * 3.1 + 1) * 2.2 + (joy ? Math.sin(t * 12) * 2 : 0),
      breathe: 1 + 0.018 * Math.sin(t * 2.2),
      cream: lerp(P.cream, D.cream, grime * 0.75),
      shade: lerp(P.creamShade, D.shade, grime * 0.7),
      wing: lerp(P.wing, D.wing, grime * 0.7),
      gold: lerp(P.gold, D.gold, grime * 0.8),
      comb: lerp(P.comb, D.comb, grime * 0.55),
      leg: lerp(P.leg, D.leg, grime * 0.6),
      foot: lerp(P.foot, D.foot, grime * 0.6),
      beak: lerp(P.beak, D.beak, grime * 0.5),
    };
    return fx;
  }
  // seberapa terbuka mata di tampak samping/belakang (Dart: MascotFx.eyeOpen)
  function fxEyeOpen(fx) {
    const { mood } = fx.pose;
    const t = fx.t;
    switch (mood) {
      case 'sleep': return 0;
      case 'sleepy': return 0.45 + 0.1 * Math.sin(t * 1.3);
      case 'wait': return 0.9 * blinkOpen(t) + 0.1;
      case 'sad': return 0.82;
      case 'frozen': return 1;
      default: return blinkOpen(t);
    }
  }
  const wingAmount = (fx, left) => {
    const v = left ? fx.pose.wingLeft : fx.pose.wingRight;
    return v == null ? fx.pose.flap : v;
  };
  const wingAngle = (fx, left) => rad(14 + wingAmount(fx, left) * -38 + Math.sin(fx.t * 2.4) * 2);

  // =====================================================================
  //  TAMPAK DEPAN  (paintMascot)
  // =====================================================================
  function drawFront(ctx, fx, hooks) {
    const { pose, t, grime, joy, droop } = fx;
    const mood = pose.mood;
    const D = P.dirt;
    const eyeOpen =
      pose.eyeOpen != null
        ? pose.eyeOpen
        : mood === 'sleep' ? 0
        : mood === 'sad' ? 0.82 + 0.06 * Math.sin(t * 1.7)
        : mood === 'frozen' ? 1
        : mood === 'sleepy' ? 0.45 + 0.1 * Math.sin(t * 1.3)
        : mood === 'wait' ? 0.9 * blinkOpen(t) + 0.1
        : blinkOpen(t);
    const happyEyes = joy;
    const lookX = pose.look * 4.5;
    const { cream, shade, gold: goldColor, comb, wing: wingColor } = fx;
    const outline = P.outline;

    if (hooks.behindBody) hooks.behindBody();

    // bulu ekor, di belakang segalanya
    ctx.save();
    ctx.translate(0, -96);
    ctx.rotate((fx.tailSway * 0.4 * PI) / 180);
    const feather = (deg, rx, ry, cy, ab, inRx, inRy, inCy) => {
      ctx.save();
      ctx.rotate(rad(deg));
      ctx.translate(0, -8);
      oval(ctx, 0, cy, rx, ry, fillP(lerp(ab[0], D.featherA, grime * 0.55)));
      oval(ctx, 0, inCy, inRx, inRy, fillP(alpha(lerp(ab[1], D.featherB, grime * 0.55), 0.7)));
      ctx.restore();
    };
    feather(-34 + fx.tailSway, 22, 62, -62, P.featherTeal, 10, 40, -70);
    feather(34 - fx.tailSway, 22, 62, -62, P.featherPink, 10, 40, -70);
    feather(fx.tailSway * 0.6, 24, 72, -72, P.featherOrange, 11, 46, -80);
    ctx.restore();

    // kaki
    const toes = lineP(P.toe, 2.4);
    for (const side of [-1, 1]) {
      const lift =
        pose.step === 0
          ? 0
          : Math.max(0, Math.sin((pose.step + (side < 0 ? 0 : 0.5)) * PI * 2)) * 10 * pose.legKick;
      ctx.save();
      ctx.translate(0, -lift);
      rrect(ctx, side < 0 ? -30 : 19, -34, 11, 30, 5, fillP(fx.leg));
      oval(ctx, side * 24, -4, 24, 9, fillP(fx.foot));
      drawPath(
        ctx,
        path()
          .moveTo(side * 42, -3).quadTo(side * 48, -3, side * 50, 0)
          .moveTo(side * 33, 0).quadTo(side * 35, 4, side * 38, 5)
          .moveTo(side * 24, 1).quadTo(side * 24, 5, side * 26, 7),
        toes
      );
      ctx.restore();
    }

    // badan, bernapas di tengahnya
    ctx.save();
    ctx.translate(0, -92);
    ctx.scale(1 / fx.breathe, fx.breathe);
    ctx.translate(0, 92);
    const body = path()
      .moveTo(0, -176)
      .cubicTo(52, -176, 86, -138, 86, -88)
      .cubicTo(86, -36, 52, -14, 0, -14)
      .cubicTo(-52, -14, -86, -36, -86, -88)
      .cubicTo(-86, -138, -52, -176, 0, -176)
      .close();
    drawPath(ctx, body, fillP(cream));
    drawPath(ctx, body, lineP(outline, 3));
    drawPath(
      ctx,
      path()
        .moveTo(34, -168)
        .cubicTo(70, -150, 86, -118, 80, -78)
        .cubicTo(76, -44, 56, -24, 22, -16)
        .cubicTo(60, -40, 66, -108, 34, -168)
        .close(),
      fillP(alpha(shade, 0.55))
    );
    if (grime > 0.05) {
      const dust = fillP(alpha(C(0x7a5c3a), 0.28 * grime));
      oval(ctx, -34, -70, 22, 11, dust);
      oval(ctx, 28, -40, 18, 9, dust);
      oval(ctx, 14, -128, 15, 8, dust);
      oval(ctx, -52, -112, 10, 6, dust);
    }
    if (!fx.hideCoin) {
      oval(ctx, 0, -40, 22, 22, fillP(goldColor));
      oval(ctx, 0, -40, 22, 22, lineP(lerp(P.goldRim, C(0x8c7536), grime * 0.8), 3));
      oval(ctx, 0, -40, 15, 15, lineP(lerp(P.goldInner, C(0x9e8640), grime * 0.8), 2.2));
      drawPath(
        ctx,
        path()
          .moveTo(-5, -48).lineTo(-5, -32)
          .moveTo(-5, -48).lineTo(2, -48)
          .quadTo(7, -48, 7, -43.5).quadTo(7, -39, 2, -39)
          .lineTo(-5, -39)
          .moveTo(2, -39).lineTo(8, -32),
        lineP(P.goldLetter, 2.6)
      );
    }
    ctx.restore();

    // yang dipakai di badan ada di bawah sayap
    if (hooks.overBody) hooks.overBody();

    // sayap
    const wing = (side) => {
      ctx.save();
      ctx.translate(80 * side, -92);
      const wa = rad(
        14 + (side < 0 ? (pose.wingLeft != null ? pose.wingLeft : pose.flap)
                       : (pose.wingRight != null ? pose.wingRight : pose.flap)) * -38 +
          Math.sin(t * 2.4) * 2
      );
      ctx.rotate(wa * -side);
      ctx.save();
      const cx = 6 * side;
      oval(ctx, cx, 14, 20, 38, fillP(wingColor));
      oval(ctx, cx, 14, 20, 38, lineP(outline, 2.5));
      drawPath(ctx, path().moveTo(12 * side, 4).quadTo(6 * side, 24, 10 * side, 40), lineP(P.wingLine, 2.4));
      if (hooks.overWing) hooks.overWing(side);
      ctx.restore();
      if (grime > 0.45 && side > 0) {
        ctx.save();
        ctx.translate(8, 18);
        ctx.rotate(-0.35);
        rrect(ctx, -14, -9, 28, 18, 3, fillP(C(0xf2ebdd)));
        rrect(ctx, -14, -9, 28, 18, 3, lineP(C(0xbfb29a), 1.6));
        drawPath(ctx, path().moveTo(-6, -4).lineTo(6, 4).moveTo(6, -4).lineTo(-6, 4), lineP(C(0xb07a6a), 2));
        ctx.restore();
      }
      ctx.restore();
    };
    if (pose.wingCover <= 0.02) {
      wing(-1);
      wing(1);
    }

    // kepala: lubang koin dan jengger
    ctx.save();
    ctx.translate(0, droop * 3);
    ctx.save();
    ctx.translate(-40, -160);
    ctx.rotate(rad(-32));
    if (pose.coin > 0.01) {
      ctx.save();
      ctx.translate(0, -pose.coin * 20 + 2);
      oval(ctx, 0, 0, 14, 14, fillP(P.gold));
      oval(ctx, 0, 0, 14, 14, lineP(P.goldRim, 2.4));
      oval(ctx, 0, 0, 8, 8, lineP(P.goldInner, 1.8));
      ctx.restore();
    }
    rrect(ctx, -12, -3, 24, 6, 3, fillP(P.slot));
    ctx.restore();

    ctx.save();
    ctx.translate(0, -170 + droop * 4);
    ctx.rotate(rad(fx.combWob * 0.5 + grime * -14));
    ctx.translate(0, 170);
    if (!fx.hideComb) {
      oval(ctx, -14, -176, 15, 15, fillP(comb));
      oval(ctx, 2, -188, 19, 19, fillP(comb));
      oval(ctx, 20, -178, 14, 14, fillP(comb));
    }
    oval(ctx, 2, -190, 9, 9, fillP(alpha(P.combShine, 0.6 * (1 - grime * 0.6))));
    ctx.restore();
    ctx.restore();

    // wajah
    ctx.save();
    ctx.translate(0, droop * 2);
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.translate(s * 28, -122);
      const sideOpen = s > 0 && pose.eyeOpenRight != null ? pose.eyeOpenRight : eyeOpen;
      const bowed = pose.eyes === 'sadClosed';
      const shutArc =
        bowed || ((happyEyes || mood === 'sleep') && !(s > 0 && pose.eyeOpenRight != null && sideOpen > 0.06));
      if (shutArc) {
        const pa = path();
        if (bowed) pa.moveTo(-13, 4).quadTo(0, -10, 13, 4);
        else if (mood === 'sleep') pa.moveTo(-13, 0).quadTo(0, 8, 13, 0);
        else pa.moveTo(-13, 4).quadTo(0, -12, 13, 4);
        drawPath(ctx, pa, lineP(P.eye, 5));
        if (bowed) line(ctx, s * 15, -22, -s * 13, -33, lineP(P.brow, 4.6));
      } else {
        const o = clamp(sideOpen, 0.08);
        const shock = pose.eyes === 'shock';
        const lookDown = pose.lookY * 4;
        oval(ctx, 0, 0, shock ? 17 : 15, (shock ? 20 : 17) * o, fillP(WHITE));
        if (pose.eyes === 'dizzy') {
          const sp = path().moveTo(0, 0);
          for (let i = 1; i <= 40; i++) {
            const a = i * 0.45 + t * 6 * -s;
            const r = i * 0.24;
            sp.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          drawPath(ctx, sp, lineP(P.eye, 2.4));
        } else if (pose.eyes === 'cross') {
          drawPath(ctx, path().moveTo(-8, -8).lineTo(8, 8).moveTo(8, -8).lineTo(-8, 8), lineP(P.eye, 3.6));
        } else {
          oval(ctx, lookX, 1 + lookDown, shock ? 5 : 9.5, (shock ? 6 : 11) * o, fillP(P.eye));
          const h = clamp(sideOpen, 0.2);
          oval(ctx, lookX + (shock ? 1.5 : 3), -4 * h + lookDown, 3.2 * h, 3.2 * h, fillP(WHITE));
          eyeGlow(ctx, lookX, o, pose.eyeGlow, t);
        }
        if (pose.eyes === 'angry') line(ctx, s * 17, -30, -s * 14, -15, lineP(P.brow, 5));
        if (mood === 'sad') {
          line(ctx, s * 15, -22, -s * 13, -33, lineP(P.brow, 4.6));
          const drip = (t * 0.55 + (s > 0 ? 0.4 : 0)) % 1;
          const tx = s * 7, ty = 14 + drip * 26;
          drawPath(
            ctx,
            path().moveTo(tx, ty - 7).quadTo(tx + 6, ty + 1, tx, ty + 6).quadTo(tx - 6, ty + 1, tx, ty - 7).close(),
            fillP(alpha(P.tear, 0.9 * (1 - drip * 0.6)))
          );
        }
        if (mood === 'sleepy') {
          drawPath(
            ctx,
            path().moveTo(-17, -19).lineTo(17, -19).lineTo(17, -1).quadTo(0, 7, -17, -1).close(),
            fillP(cream)
          );
          drawPath(ctx, path().moveTo(-16, -1).quadTo(0, 6, 16, -1), lineP(C(0xc9a96e), 2.4));
        }
      }
      ctx.restore();
    }
    const cheek = fillP(alpha(P.cheek, joy ? 0.95 : 0.7 * (1 - grime * 0.4)));
    oval(ctx, -52, -96, 13, 8.5, cheek);
    oval(ctx, 52, -96, 13, 8.5, cheek);
    // pial dulu, paruh di atasnya
    oval(ctx, 0, -66 + pose.beak * 3, 7, 11, fillP(P.wattle));
    if (hooks.overWattle) hooks.overWattle();
    ctx.save();
    ctx.translate(0, -104);
    if (pose.beak > 0.05) oval(ctx, 0, 11 + pose.beak * 4, 10, 3 + pose.beak * 9, fillP(P.mouth));
    const beakPath = path()
      .moveTo(-17, 0).quadTo(0, -11, 17, 0).quadTo(14, 15, 0, 27).quadTo(-14, 15, -17, 0).close();
    drawPath(ctx, beakPath, fillP(fx.beak));
    drawPath(ctx, beakPath, lineP(P.beakEdge, 2.2));
    drawPath(ctx, path().moveTo(-11, 1).quadTo(0, -3, 11, 1), lineP(alpha(WHITE, 0.5), 2.4));
    if (pose.beak > 0.05) {
      const b = pose.beak;
      drawPath(
        ctx,
        path().moveTo(-12, 7 + b * 8).quadTo(0, 17 + b * 11, 12, 7 + b * 8).quadTo(0, 11 + b * 5, -12, 7 + b * 8).close(),
        fillP(P.beakInside)
      );
    }
    ctx.restore();
    ctx.restore();

    // benda di kepala ada di atas jengger dan wajah
    if (hooks.overHead) hooks.overHead();

    // sayap diangkat menutup mata
    if (pose.wingCover > 0.02) {
      const k = clamp(pose.wingCover);
      for (const side of [-1, 1]) {
        ctx.save();
        const slide = side < 0 ? clamp(pose.peek) : 0;
        ctx.translate(mixN(86 * side, 28 * side, k) + slide * 28, mixN(-78, -121, k) + droop * 3 + slide * 4);
        ctx.rotate(side * mixN(-0.35, 0.1, k));
        const rx = mixN(20, 19, k), ry = mixN(38, 24, k);
        oval(ctx, 0, 0, rx, ry, fillP(wingColor));
        oval(ctx, 0, 0, rx, ry, lineP(outline, 2.5));
        drawPath(ctx, path().moveTo(6 * side, -ry * 0.6).quadTo(2 * side, 0, 5 * side, ry * 0.6), lineP(P.wingLine, 2.2));
        ctx.restore();
      }
    }

    // setetes keringat
    if (pose.sweat > 0.02) {
      const w = clamp(pose.sweat);
      const dy = 5 * Math.sin(t * 3);
      const cx = 56, cy = -148 + dy;
      drawPath(
        ctx,
        path().moveTo(cx, cy - 10).quadTo(cx + 8, cy + 2, cx, cy + 8).quadTo(cx - 8, cy + 2, cx, cy - 10).close(),
        fillP(alpha(P.tear, 0.9 * w))
      );
    }

    // bintang mengitari kepala
    if (pose.stars > 0.02) {
      for (let i = 0; i < 3; i++) {
        const a = t * 3.2 + i * 2.094;
        const cx = Math.cos(a) * 42, cy = -196 + Math.sin(a) * 9;
        const r = 7;
        const star = path();
        for (let j = 0; j < 8; j++) {
          const rr = j % 2 === 0 ? r : r * 0.42;
          const aa = (j * PI) / 4 - PI / 2;
          const px = cx + Math.cos(aa) * rr, py = cy + Math.sin(aa) * rr;
          if (j === 0) star.moveTo(px, py); else star.lineTo(px, py);
        }
        star.close();
        drawPath(ctx, star, fillP(alpha(P.starGold, clamp(pose.stars))));
      }
    }
  }

  // =====================================================================
  //  TAMPAK SAMPING (menghadap +x; cermin lewat facing = -1)
  // =====================================================================
  function sideLeg(ctx, fx, hipX, phase, far) {
    const walking = fx.pose.step !== 0;
    const swing = walking ? Math.sin(phase * PI * 2) : 0;
    const a = swing * 0.55;
    const len = 30;
    const lift = walking ? Math.max(0, Math.cos(phase * PI * 2)) * 9 : 0;
    const hx = hipX, hy = -34;
    const fx_ = hipX + Math.sin(a) * len;
    const fy = -34 + Math.cos(a) * len - lift;
    const dim = far ? -0.12 : 0;
    const tone = (base) => {
      const h = toHsl(base);
      h.l = clamp(h.l + dim);
      return fromHsl(h);
    };
    line(ctx, hx, hy, fx_, fy, lineP(tone(fx.leg), 11));
    oval(ctx, fx_ + 11, fy + 1, 20, 8, fillP(tone(fx.foot)));
    drawPath(
      ctx,
      path()
        .moveTo(fx_ + 26, fy).quadTo(fx_ + 32, fy + 1, fx_ + 34, fy + 4)
        .moveTo(fx_ + 22, fy + 4).quadTo(fx_ + 25, fy + 7, fx_ + 24, fy + 9),
      lineP(P.toe, 2.4)
    );
  }

  function drawSide(ctx, fx, hooks) {
    const { pose, grime, droop } = fx;
    const step = pose.step;
    const D = P.dirt;
    const outline = P.outline;

    sideLeg(ctx, fx, 14, step + 0.5, true);

    // bulu ekor mengipas ke atas dan belakang
    ctx.save();
    ctx.translate(-62, -94);
    const feather = (deg, rx, ry, ab) => {
      ctx.save();
      ctx.rotate(rad(deg + fx.tailSway * 0.5));
      oval(ctx, 0, -ry * 0.9, rx, ry, fillP(lerp(ab[0], D.featherA, grime * 0.55)));
      oval(ctx, 0, -ry * 1.0, rx * 0.45, ry * 0.7, fillP(alpha(lerp(ab[1], D.featherB, grime * 0.55), 0.7)));
      ctx.restore();
    };
    feather(-78, 20, 62, P.featherTeal);
    feather(-52, 22, 66, P.featherPink);
    feather(-28, 24, 72, P.featherOrange);
    ctx.restore();

    // badan
    ctx.save();
    ctx.translate(0, -92);
    ctx.scale(1 / fx.breathe, fx.breathe);
    ctx.translate(0, 92);
    const body = path()
      .moveTo(4, -176)
      .cubicTo(56, -176, 86, -140, 86, -90)
      .cubicTo(86, -38, 54, -14, 4, -14)
      .cubicTo(-46, -14, -80, -38, -80, -90)
      .cubicTo(-80, -140, -46, -176, 4, -176)
      .close();
    drawPath(ctx, body, fillP(fx.cream));
    drawPath(ctx, body, lineP(outline, 3));
    drawPath(
      ctx,
      path()
        .moveTo(-30, -168)
        .cubicTo(-70, -150, -78, -110, -72, -76)
        .cubicTo(-66, -42, -44, -24, -10, -16)
        .cubicTo(-46, -44, -52, -112, -30, -168)
        .close(),
      fillP(alpha(fx.shade, 0.6))
    );
    if (!fx.hideCoin) {
      oval(ctx, 28, -46, 12, 22, fillP(fx.gold));
      oval(ctx, 28, -46, 12, 22, lineP(P.goldRim, 2.6));
      oval(ctx, 30, -46, 6, 15, lineP(P.goldInner, 1.8));
    }
    ctx.restore();

    sideLeg(ctx, fx, -6, step, false);

    if (hooks.overBody) hooks.overBody();

    // sayap dekat
    ctx.save();
    ctx.translate(-6, -112);
    ctx.rotate(-wingAngle(fx, false) + (step !== 0 ? Math.sin(step * PI * 2) * 0.1 : 0));
    oval(ctx, -4, 30, 22, 44, fillP(fx.wing));
    oval(ctx, -4, 30, 22, 44, lineP(outline, 2.5));
    drawPath(ctx, path().moveTo(0, 6).quadTo(-8, 34, -2, 66), lineP(P.wingLine, 2.4));
    if (hooks.overNearWing) hooks.overNearWing();
    ctx.restore();

    // kepala: jengger dan lubang koin
    ctx.save();
    ctx.translate(0, droop * 3);
    ctx.save();
    ctx.translate(2, -170 + droop * 3);
    ctx.rotate(rad(fx.combWob * 0.5 + grime * -14));
    ctx.translate(0, 170);
    if (!fx.hideComb) {
      oval(ctx, -16, -178, 14, 14, fillP(fx.comb));
      oval(ctx, 4, -190, 18, 18, fillP(fx.comb));
      oval(ctx, 24, -176, 13, 13, fillP(fx.comb));
    }
    oval(ctx, 4, -192, 8, 8, fillP(alpha(P.combShine, 0.6 * (1 - grime * 0.6))));
    ctx.restore();
    ctx.save();
    ctx.translate(10, -172);
    ctx.rotate(0.35);
    if (pose.coin > 0.01) {
      ctx.save();
      ctx.translate(0, -pose.coin * 20 + 2);
      oval(ctx, 0, 0, 5, 14, fillP(P.gold));
      oval(ctx, 0, 0, 5, 14, lineP(P.goldRim, 2));
      ctx.restore();
    }
    rrect(ctx, -14, -3, 28, 6, 3, fillP(P.slot));
    ctx.restore();
    ctx.restore();

    // wajah
    ctx.save();
    ctx.translate(0, droop * 2);
    ctx.save();
    ctx.translate(42, -126);
    if (fx.joy || pose.mood === 'sleep') {
      const pa = path();
      if (pose.mood === 'sleep') pa.moveTo(-12, 0).quadTo(0, 8, 12, 0);
      else pa.moveTo(-12, 4).quadTo(0, -12, 12, 4);
      drawPath(ctx, pa, lineP(P.eye, 5));
    } else {
      const eo = fxEyeOpen(fx);
      const o = clamp(eo, 0.08, 1);
      const lookX = pose.look * 3.5 + 3;
      oval(ctx, 0, 0, 13, 16 * o, fillP(WHITE));
      oval(ctx, lookX, 1, 8.5, 10.5 * o, fillP(P.eye));
      const h = clamp(eo, 0.2, 1);
      oval(ctx, lookX + 3, -4 * h, 3 * h, 3 * h, fillP(WHITE));
      eyeGlow(ctx, lookX, o, pose.eyeGlow, fx.t);
      if (pose.mood === 'sleepy') {
        drawPath(
          ctx,
          path().moveTo(-15, -18).lineTo(15, -18).lineTo(15, -1).quadTo(0, 6, -15, -1).close(),
          fillP(fx.cream)
        );
      }
    }
    ctx.restore();
    oval(ctx, 30, -98, 12, 8, fillP(alpha(P.cheek, fx.joy ? 0.95 : 0.7 * (1 - grime * 0.4))));
    // pial, lalu paruh menunjuk ke depan
    oval(ctx, 64, -84 + pose.beak * 3, 7, 11, fillP(P.wattle));
    ctx.save();
    ctx.translate(66, -110);
    if (pose.beak > 0.05) {
      const b = pose.beak;
      drawPath(
        ctx,
        path().moveTo(0, 6).quadTo(20, 8 + b * 8, 30, 10 + b * 14).quadTo(14, 14 + b * 6, 0, 12).close(),
        fillP(P.beakInside)
      );
      oval(ctx, 12, 10 + b * 5, 10, 2 + b * 6, fillP(P.mouth));
    }
    const upper = path().moveTo(-4, -12).quadTo(22, -14, 32, 2).quadTo(14, 10, -4, 8).close();
    drawPath(ctx, upper, fillP(fx.beak));
    drawPath(ctx, upper, lineP(P.beakEdge, 2.2));
    drawPath(ctx, path().moveTo(2, -9).quadTo(16, -10, 24, -2), lineP(alpha(WHITE, 0.5), 2.2));
    ctx.restore();
    ctx.restore();
    if (hooks.overHead) hooks.overHead();
  }

  // =====================================================================
  //  TAMPAK BELAKANG
  // =====================================================================
  function drawBack(ctx, fx, hooks) {
    const { pose, grime, droop } = fx;
    const walking = pose.step !== 0;
    const D = P.dirt;
    const outline = P.outline;

    for (const side of [-1, 1]) {
      const phase = pose.step + (side < 0 ? 0 : 0.5);
      const lift = walking ? Math.max(0, Math.sin(phase * PI * 2)) * 10 : 0;
      const x = side * 24;
      line(ctx, x, -34, x, -4 - lift, lineP(fx.leg, 11));
      oval(ctx, x, -4 - lift, 20, 9, fillP(fx.foot));
      drawPath(
        ctx,
        path().moveTo(x + side * 14, -3 - lift).quadTo(x + side * 20, -2 - lift, x + side * 22, 1 - lift),
        lineP(P.toe, 2.4)
      );
    }

    // badan
    ctx.save();
    ctx.translate(0, -92);
    ctx.scale(1 / fx.breathe, fx.breathe);
    ctx.translate(0, 92);
    const body = path()
      .moveTo(0, -176)
      .cubicTo(52, -176, 86, -138, 86, -88)
      .cubicTo(86, -36, 52, -14, 0, -14)
      .cubicTo(-52, -14, -86, -36, -86, -88)
      .cubicTo(-86, -138, -52, -176, 0, -176)
      .close();
    drawPath(ctx, body, fillP(fx.cream));
    drawPath(ctx, body, lineP(outline, 3));
    // sisik bulu lembut di punggung
    for (let row = 0; row < 4; row++) {
      for (let col = -2; col <= 2; col++) {
        const x = col * 26 + (row % 2 === 1 ? 13 : 0);
        const y = -150 + row * 30;
        if (Math.abs(x) > 60) continue;
        ctx.beginPath();
        ctx.ellipse(x, y, 13, 10, 0, 0.2, 0.2 + 2.7);
        paint(ctx, lineP(alpha(fx.shade, 0.8), 2));
      }
    }
    ctx.restore();

    // jengger dan lubang koin
    ctx.save();
    ctx.translate(0, droop * 3);
    ctx.save();
    ctx.translate(0, -170 + droop * 4);
    ctx.rotate(rad(fx.combWob * 0.5 + grime * -14));
    ctx.translate(0, 170);
    if (!fx.hideComb) {
      oval(ctx, -14, -176, 15, 15, fillP(fx.comb));
      oval(ctx, 2, -188, 19, 19, fillP(fx.comb));
      oval(ctx, 20, -178, 14, 14, fillP(fx.comb));
    }
    ctx.restore();
    ctx.save();
    ctx.translate(-40, -160);
    ctx.rotate(rad(-32));
    rrect(ctx, -12, -3, 24, 6, 3, fillP(P.slot));
    ctx.restore();
    ctx.restore();

    if (hooks.overBody) hooks.overBody(); // Dart: beforeTail

    // kipas ekor di depan punggung
    ctx.save();
    ctx.translate(0, -66);
    const feather = (deg, rx, ry, ab) => {
      ctx.save();
      ctx.rotate(rad(deg + fx.tailSway * 0.4));
      oval(ctx, 0, -ry * 0.85, rx, ry, fillP(lerp(ab[0], D.featherA, grime * 0.55)));
      oval(ctx, 0, -ry * 0.95, rx * 0.45, ry * 0.7, fillP(alpha(lerp(ab[1], D.featherB, grime * 0.55), 0.7)));
      ctx.restore();
    };
    feather(-38, 24, 70, P.featherTeal);
    feather(38, 24, 70, P.featherPink);
    feather(0, 28, 80, P.featherOrange);
    ctx.restore();

    // sayap terlipat di sisi
    for (const left of [true, false]) {
      const side = left ? -1 : 1;
      ctx.save();
      ctx.translate(82 * side, -96);
      ctx.rotate(wingAngle(fx, left) * -side);
      oval(ctx, 6 * side, 14, 20, 38, fillP(fx.wing));
      oval(ctx, 6 * side, 14, 20, 38, lineP(outline, 2.5));
      if (hooks.overWing) hooks.overWing(side);
      ctx.restore();
    }

    if (hooks.overTail) hooks.overTail();
  }

  // =====================================================================
  //  PINTU MASUK: Minyam.draw
  // =====================================================================
  /**
   * Gambar Minyam dengan kakinya di (x, y) piksel.
   * opts: { x, y, scale, t, pose, shadow=true, hideComb, hideCoin, hooks }
   *   t     : waktu dalam DETIK (menggerakkan napas, kedip, goyang ekor).
   *   hooks : behindBody, overBody, overTail, overWing(side), overNearWing, overWattle, overHead
   */
  function draw(ctx, opts) {
    const o = opts || {};
    const pose = withPose(o.pose);
    const scale = o.scale == null ? 1 : o.scale;
    const t = o.t == null ? 0 : o.t;
    const x = o.x || 0, y = o.y || 0;
    const hooks = o.hooks || {};
    const fx = makeFx(pose, t, !!o.hideComb, !!o.hideCoin);
    const bob = pose.mood === 'sleep' ? 0 : Math.sin(t * 2.2) * 1.2;

    if (o.shadow !== false) {
      const shadowK = clamp(1 - pose.lift / 220, 0.35, 1);
      const lie = clamp(-pose.tilt / 1.45);
      const shadowRx = 74 * scale * shadowK * (1 + 0.5 * lie);
      ctx.save();
      ctx.translate(x - lie * shadowRx, y);
      oval(ctx, 0, 2, shadowRx, 12 * scale * shadowK, fillP(alpha(C(0x000000), 0.22 * shadowK)));
      ctx.restore();
    }

    ctx.save();
    ctx.translate(x, y - pose.lift);
    ctx.scale(scale * pose.squashX * pose.facing, scale * pose.squashY);
    ctx.translate(0, bob + pose.sit * 16);
    if (pose.tilt !== 0) ctx.rotate(pose.tilt);
    if (pose.view === 'side') drawSide(ctx, fx, hooks);
    else if (pose.view === 'back') drawBack(ctx, fx, hooks);
    else drawFront(ctx, fx, hooks);
    ctx.restore();
  }

  return { draw, DEFAULT_POSE, withPose, PALETTE, MOODS, EYES, VIEWS, util: { clamp, mixN, lerp, alpha, css, C } };
});
