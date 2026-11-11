# Musik asli (disintesis dengan numpy) + efek suara per kejadian -> out/mix.wav
# Grid: 160 BPM, 1 bar = 1,5 detik. Semua waktu sama dengan film.js (events.json).
import sys, os, json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx
from sfx import SR, t_, bp, lp, hp, noise, norm, add
BANK = os.environ.get('SFXBANK', os.path.expanduser('~/.motion-style-kit/assets/sfx'))
rng = np.random.default_rng(7)
EVJ = json.load(open(os.path.join(HERE, 'events.json'))); DUR = EVJ['dur']; EV = EVJ['ev']
N = int(DUR * SR); mus = np.zeros((N, 2)); fx = np.zeros((N, 2)); duck = np.ones(N)
BT = .375; S16 = BT / 4
f = lambda m: 440 * 2 ** ((m - 69 + 5) / 12)

def ar(d, a=.005, r=.05):
    n = int(round(d * SR)); e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, min(n, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def saw(fr, d, det=0.0): return 2 * ((t_(d) * fr * (1 + det)) % 1) - 1
def kick(v=1.0):
    d = .3; tt = t_(d); ph = 2 * np.pi * (46 * tt + 110 * .028 * (1 - np.exp(-tt / .028)))
    return (np.sin(ph) * np.exp(-tt / .1) + hp(noise(d), 2500) * np.exp(-tt / .004) * .25) * v
def snare(v=1.0):
    d = .26; tt = t_(d); x = bp(noise(d), 1200, 7000) * np.exp(-tt / .06) + bp(noise(d), 700, 5000) * .4 * (tt < .17) + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt / .04) * .7
    return x * ar(d, .001, .02) * .6 * v
def hat(v=1.0):
    d = .05; return hp(noise(d), 7000) * np.exp(-t_(d) / .012) * .35 * v
def tom(fr, v=1.0):
    d = .34; tt = t_(d); return (np.sin(2 * np.pi * fr * tt * (1 - .25 * tt)) * np.exp(-tt / .11) + lp(noise(d), 900) * np.exp(-tt / .01) * .4) * v
def crash(v=1.0, tau=.45):
    d = 1.6; return hp(noise(d), 3800) * np.exp(-t_(d) / tau) * .5 * v
def bass(m, d, v=1.0):
    tt = t_(d); x = saw(f(m), d) * .6 + np.sign(np.sin(2 * np.pi * f(m) * tt)) * .3
    x = lp(x, 650) + lp(x, 2800) * np.exp(-tt / .03) * .9 + np.sin(2 * np.pi * f(m) * 2 * tt) * .25
    return x * np.exp(-tt / .28) * ar(d, .002, .02) * .55 * v
def brass(ms, d, v=1.0, cut=2600):
    x = sum(saw(f(m), d, .004) + saw(f(m), d, -.004) + saw(f(m) * .5, d) * .3 for m in ms)
    return lp(x, cut) * ar(d, .018, .07) * (.75 + .25 * np.exp(-t_(d) / .1)) * .16 * v
def fm(m, d, v=1.0, ratio=3.0, idx=4.0, tau=.12):
    tt = t_(d); return np.sin(2 * np.pi * f(m) * tt + np.sin(2 * np.pi * f(m) * ratio * tt) * idx * np.exp(-tt / (tau * .5))) * np.exp(-tt / tau) * ar(d, .002, .02) * .3 * v
def ep(ms, d, v=1.0):
    return sum(fm(m, d, 1, 1.0, 1.3, .55) + fm(m, d, .35, 14.0, .7, .04) for m in ms) * .5 * v
def pad(ms, d, v=1.0, att=.4, cut=1300):
    tt = t_(d); x = sum(np.sin(2 * np.pi * f(m) * tt) + lp(saw(f(m), d, .003), cut) * .5 for m in ms); return x * ar(d, att, min(.5, d / 2)) * .09 * v
M = lambda x, at, g=1.0, pan=0.0: add(mus, x, at, g, pan)

# ── A. Pembuka 0–3: drone + taiko
M(pad([28, 40, 47], 3.2, 1.6, 1.2, 700), 0)
M(ep([62, 66, 69, 74], .8, 1.2), .3, 1.0); M(fm(74, .3, .9, 3.5, 2.5, .2), .3, .7); M(fm(78, .3, .9, 3.5, 2.5, .2), .49, .7); M(fm(81, .5, .9, 3.5, 2.5, .3), .68, .7)
for t0, v in [(.3, .6), (1.2, 1), (1.5, 1), (1.875, .6), (2.25, .9), (2.625, 1), (2.8125, .8)]: M(sfx.thump(1, 62), t0, .8 * v); M(tom(92, .4 * v), t0, 1, -.3)
M(brass([40, 47], 1.5, .9, 900) * np.linspace(.2, 1, int(1.5 * SR)), 1.5)
# ── B. 3–4,5: detak, lalu fill
for t0 in [3.0, 3.6]: M(sfx.heartbeat(.9), t0, .9)
for i, t0 in enumerate(np.arange(4.125, 4.5, S16)): M(tom(150 - i * 14, .5 + i * .14), t0, 1, -.5 + i * .25); M(snare(.3 + i * .15), t0, .7)
# ── C. 4,5–10,5: montase tebas (Em | C | D | Em)
PROG = [(40, [64, 67, 71]), (36, [64, 67, 72]), (38, [66, 69, 74]), (40, [64, 67, 71])]
RIFF = [76, 76, 79, 76, 83, 81, 79, 76, 88, 86, 83, 81, 79, 81, 83, 86]
def groove(t0, root, chord, lead=True, gate=None, lv=1.0, dbl=False):
    for b in range(4):
        tb = t0 + b * BT
        if gate and not gate(tb): continue
        M(kick(1), tb, .95); (b % 2 == 1) and M(snare(1), tb, .9)
        if dbl: M(kick(.8), tb + BT / 2, .8); M(snare(.6), tb + BT / 2, .55)
        for s in range(4): M(hat(.6 + .4 * (s % 2 == 0)), tb + s * S16, .6, .35)
        for h in range(2): M(bass(root + (12 if (b * 2 + h) % 4 == 3 else 0), BT / 2, 1), tb + h * BT / 2, .95)
        if lead:
            for s in range(4): M(fm(RIFF[(b * 4 + s) % 16], S16 * 1.6, lv, 2.0, 3.0, .1), tb + s * S16, .7, -.3 + .15 * s)
        M(brass([c + 12 for c in chord], .06, .8, 5200), tb + BT / 2, .55, -.35)
    for tb, d in [(t0, .16), (t0 + BT * .75, .1), (t0 + BT * 2.75, .12), (t0 + BT * 3.5, .1)]:
        if not gate or gate(tb): M(brass(chord, d, 1), tb, .9, .25)
for i in range(4):
    r, ch = PROG[i]; groove(4.5 + i * 1.5, r, ch, gate=lambda tb: not (7.55 < tb < 7.87))
M(crash(1), 4.5, .7); M(crash(1), 7.875, .8); M(crash(.8), 8.25, .6)
# ── D. 10,5–12: jeda
M(brass([52, 59, 64, 67], .7, 1), 10.62, .9); M(crash(1), 10.62, .7); M(brass([52, 59, 64, 71], .25, 1), 11.25, 1.0); M(crash(.9, .3), 11.25, .6)
# ── E. 12–16,5: tema bos (setengah tempo, tritone)
for i, m in enumerate([28, 29, 28, 34, 28, 29]):
    t0 = 12 + i * .75; M(brass([m + 12, m + 24], .7, 1.5, 700), t0, 1.0); M(bass(m, .7, 1.2), t0, .9)
    M(kick(1), t0, 1.0); M(tom(70, 1), t0 + BT, .8, -.4); (i % 2 == 1) and M(snare(1), t0, .8); M(tom(58, 1), t0 + BT * 1.5, .7, .4)
M(pad([40, 41, 47, 52], 4.5, 1.3, 1.5, 900), 12)
# ── F. 16,5–19,5: dihajar (frigia)
for i in range(2):
    t0 = 16.5 + i * 1.5; groove(t0, 40, [65, 69, 72] if i == 0 else [64, 67, 71], lead=False)
    for b, m in enumerate([40, 40, 41, 40]): M(brass([m + 12], BT * .8, 1.3, 1100), t0 + b * BT, .8, -.2)
M(brass([53, 57, 60, 65], .3, 1.2), 19.12, 1.0); M(crash(1), 19.12, .7)
# ── G. 21,375–24: mengisi (hening satu ketuk di 21,0)
M(pad([40, 47, 52, 59], 2.7, 1.4, 1.8, 1500) * np.linspace(.3, 1, int(round(2.7 * SR))), 21.375)
for t0 in [21.42, 21.75, 22.5]: M(sfx.thump(1, 55), t0, .9); M(tom(80, .6), t0, 1)
nr = int(1.5 * SR); ris = bp(noise(1.5), 1500, 9000) * np.linspace(0, 1, nr) ** 2 * .35; M(ris, 22.5, .8)
k = 0; t0 = 22.5
while t0 < 23.99:
    p = (t0 - 22.5) / 1.5; M(snare(.25 + .75 * p), t0, .75); M(bass(28, .09, .6 + .4 * p), t0, .8); t0 += S16 if p < .6 else S16 / 2
# ── H. 24–24,6: terjang; 24,6–24,75 hening (freeze)
for i, t0 in enumerate(np.arange(24, 24.56, S16)): M(tom(90 + i * 12, .7 + i * .05), t0, 1, -.4 + i * .13); M(kick(.9), t0, .7)
M(brass([52, 59, 64], .55, 1.2) * np.linspace(.4, 1, int(round(.55 * SR))), 24.0)
M(crash(1.3), 24.75, .9); M(sfx.thump(1, 45), 24.75, 1.0)
# ── I. 24,96–26,4: badai tebasan (naik setengah nada, F minor, dua kali cepat)
LEAD = [77, 80, 84, 82, 80, 84, 87, 89]
for i in range(8):
    t0 = 24.96 + i * .18
    M(kick(1), t0, .95); M(snare(.9), t0 + .09, .8); M(hat(1), t0, .6, .3); M(hat(.7), t0 + .045, .6, .3); M(hat(1), t0 + .09, .6, .3); M(hat(.7), t0 + .135, .6, .3)
    M(bass(41, .085, 1), t0, .95); M(bass(53, .085, 1), t0 + .09, .9)
    M(brass([LEAD[i], LEAD[i] - 12], .16, 1.5, 3400), t0, 1.0); M(fm(LEAD[i] + 12, .15, .9), t0, .6, .3)
    if i % 2 == 0: M(brass([65, 68, 72], .1, 1), t0, .7, -.3)
# ── K. 27,3 retak, 27,75 runtuh → akor terang
M(brass([53, 60, 65, 69], .4, 1.2), 27.75, 1.0); M(crash(1.4, .6), 27.75, .9)
# ── L. 28,5–31,5: fajar (G mayor), napas
for i, ch in enumerate([[55, 59, 62, 66], [60, 64, 67, 71]]):
    t0 = 28.5 + i * 1.5; M(ep(ch, 1.6, 1), t0, 1.0); M(pad(ch, 1.7, 1, .5), t0, .9); M(bass(ch[0] - 12, 1.2, .7), t0, .7)
    for s, m in enumerate([ch[2] + 12, ch[3] + 12, ch[1] + 24, ch[3] + 12, ch[2] + 24, ch[1] + 24, ch[3] + 12, ch[2] + 12]): M(fm(m, .5, .7, 3.5, 2.5, .3), t0 + s * BT / 2, .6, -.4 + s * .1)
# ── M. 31,5–39: CTA city-pop (Gmaj7 | Gmaj7 | Em7 | Cmaj7 D7 | G)
M(pad([55, 59, 62, 66], 1.6, 1.3, .2), 31.5)
def pop(t0, root, ch, half=4):
    for b in range(half):
        tb = t0 + b * BT; (b % 2 == 0) and M(kick(1), tb, .95); (b % 2 == 1) and M(snare(1), tb, .85)
        if b == 1: M(kick(.8), tb + BT / 2, .8)
        for h in range(2): M(hat(1 if h == 0 else .6), tb + h * BT / 2, .6, .3); M(ep(ch, BT * .4, .9), tb + BT / 2, .9, -.2)
        M(bass(root + (12 if b == 3 else 0), BT * .9, 1), tb, .95); (b in (1, 3)) and M(bass(root + 7, BT * .4, .8), tb + BT / 2, .8)
    M(pad(ch, half * BT, .8, .1), t0, .8)
HOOK = [83, 86, 88, 86, 83, 81, 79, 81, 83, 79, 76, 79, 81, 83, 86, 88]
pop(33.0, 43, [59, 62, 66, 71]); pop(34.5, 40, [59, 62, 64, 67]); pop(36.0, 36, [60, 64, 67, 71], 2); pop(36.75, 38, [60, 62, 66, 69], 2)
for s, m in enumerate(HOOK): M(fm(m, .42, .9, 3.5, 2.5, .28), 33.0 + s * BT * .5 + (BT if s >= 8 else 0) * 0, .7, -.3 + (s % 4) * .2)
for s, m in enumerate([86, 88, 91, 88, 86, 83, 86, 90]): M(fm(m, .42, .9, 3.5, 2.5, .28), 36.0 + s * BT * .5, .7, .2)
M(brass([67, 71, 74, 78], .3, 1.2), 33.05, .9); M(crash(1), 33.0, .6)
for t0 in [37.5, 37.6875]: M(kick(1), t0, .9); M(brass([62, 66, 69], .12, 1), t0, .8); M(snare(.8), t0, .7)
M(brass([55, 62, 67, 71, 74], 1.0, 1.3), 38.0, 1.0); M(ep([67, 71, 74, 78], 1.0, 1.2), 38.0, 1.0); M(bass(31, .9, 1.2), 38.0, 1.0); M(kick(1), 38.0, 1.0); M(crash(1.2, .5), 38.0, .7)

# ───────── efek suara
def bank(name):
    p = os.path.join(BANK, name)
    try:
        x, sr = sf.read(p, dtype='float64', always_2d=True); x = x.mean(1)
        return resample_poly(x, SR, sr) if sr != SR else x
    except Exception as e:
        print('! bank gagal dibaca:', name, e); return None
BK = {k: bank(v) for k, v in dict(tight='es_whoosh_fast_tight.wav', crisp='es_whoosh_fast_crisp.wav', whistle='es_whoosh_fast_whistle.wav', jet='es_whoosh_big_jet.wav', gust='es_whoosh_big_gust.wav', impact='es_pro_impact_short.wav',
    zipu='es_pro_zip_up.wav', zipd='es_pro_zip_down.wav', shim='es_shimmer_m1.wav', ding='es_pro_notify_ding_1930.wav', flour='es_mallet_flourish.wav', boop='es_ui_pop_boop.wav', bloop='es_pro_pop_bloop.wav',
    latch='es_toggle_latch.wav', snap='es_click_snap.wav', paper='es_swipe_paper.wav', cloth='es_swipe_cloth.wav', sting='es_logo_sting_zip_ping.wav').items()}
def F(x, at, g=1.0, pan=0.0):
    if x is not None: add(fx, x, at, g, pan)
def ring(fs, d, tau): tt = t_(d); return sum(np.sin(2 * np.pi * fr * tt + rng.random() * 6) * np.exp(-tt / (tau * (.6 + .4 * rng.random()))) for fr in fs) / len(fs)
def shing(v=1.0, p=1.0, d=.42):
    tt = t_(d); return (bp(noise(d), 3500 * p, min(11000 * p, 20000)) * np.exp(-tt / .05) * ar(d, .004, .05) * .8 + ring([4200 * p, 5650 * p, 7300 * p, 9100 * p], d, .16) * .9) * v
def clang(v=1.0, p=1.0):
    d = .5; return (ring([1900 * p, 2750 * p, 3920 * p, 5230 * p], d, .14) + hp(noise(d), 3000) * np.exp(-t_(d) / .006) * .6) * v
def boom(v=1.0):
    d = 1.1; tt = t_(d); return (np.sin(2 * np.pi * 42 * tt * (1 - .2 * tt)) * np.exp(-tt / .28) + lp(noise(d), 500) * np.exp(-tt / .12) * .8 + hp(noise(d), 1500) * np.exp(-tt / .03) * .3) * v
def duckat(t0, depth=.5, d=.5):
    a, b = int(t0 * SR), min(N, int((t0 + d) * SR)); duck[a:b] = np.minimum(duck[a:b], 1 - depth * np.linspace(1, 0, b - a) ** .7)
def wind(d):
    n = noise(d); tt = t_(d); return (bp(n, 300, 1400) * (.6 + .4 * np.sin(2 * np.pi * .35 * tt + 1)) + bp(n, 1400, 3200) * .25 * (.5 + .5 * np.sin(2 * np.pi * .8 * tt))) * ar(d, min(.8, d / 3), min(.6, d / 3)) * .35
for e in EV:
    t0, ty, i = e['t'], e['type'], e.get('i', 0); pan = ((i * 37) % 9 - 4) / 8
    if ty == 'wind': F(wind(min(e['d'], 20.98 - t0) if 20 < t0 < 21 else e['d']), t0, .8)
    elif ty == 'slam': F(sfx.thump(1, 50), t0, .9); F(BK['impact'], t0, .5)
    elif ty == 'rumble': F(sfx.rumble(e['d'], 1), t0, .9)
    elif ty == 'eyes': tt = t_(.16); F(np.sin(2 * np.pi * np.cumsum(700 + 1900 * tt / .16) / SR) * ar(.16, .01, .08) * .35, t0, .8); F(BK['shim'], t0 + .05, .35)
    elif ty == 'draw': d = .3; F(bp(noise(d), 4500, 9500) * np.linspace(.1, 1, int(round(d * SR))) ** 2 * .5 + ring([5200, 6900, 8300], d, .2) * .4, t0, .8, -.3)
    elif ty == 'ting': F(ring([3140, 4710, 6280], .9, .35), t0, .7, .3)
    elif ty == 'cut':
        g = .45 if e.get('soft') else .8; F(BK['tight'], t0 - .05, g * .7, pan); F(shing(1, .9 + (i % 5) * .06), t0, g * .6, pan); F(BK['boop'], t0 + .03, g * .25, pan)
    elif ty == 'zip': F(BK['crisp'], t0 - .03, .7, pan); F(shing(.6, 1.2 + i * .05, .2), t0, .4, pan)
    elif ty == 'bigcut':
        g = .7 if e.get('soft') else 1.0; F(BK['jet'], t0 - .05, g * .5, pan * .6); F(BK['whistle'], t0 - .06, g * .7, pan * .6); F(sfx.thump(1, 58), t0, g * .7); (not e.get('soft')) and (F(BK['impact'], t0, .9), duckat(t0, .5, .5))
    elif ty == 'spin':
        for k2, tt2 in enumerate(np.arange(t0, t0 + e['d'], .19)): F(sfx.whoosh(.2, 1), tt2, .35, np.sin(k2 * 1.6) * .7)
    elif ty == 'land': F(boom(1), t0, 1.0); F(BK['impact'], t0, .8); duckat(t0, .5, .5)
    elif ty == 'click': F(BK['latch'], t0, .9); F(BK['snap'], t0, .7); F(ring([2400, 3600], .3, .08), t0, .4)
    elif ty == 'coins':
        sp = 1.8 if e.get('slow') else .7
        for k2 in range(e['n']): F(ring([2600 + rng.random() * 2600, 5200 + rng.random() * 2500], .35, .09), t0 + rng.random() * sp, .28, rng.random() * 1.6 - .8)
    elif ty == 'ignite': F(sfx.ignite(1), t0, .7); F(ring([220, 331], .8, .3), t0, .3)
    elif ty == 'roar':
        d = 1.5; tt = t_(d); gr = saw(52 * (1 + .06 * np.sin(2 * np.pi * 27 * tt)) * 1.0, d) * (1 + .5 * np.sin(2 * np.pi * 31 * tt))
        x = bp(gr, 180, 1100) * 1.2 + lp(sfx.roar(d, 1), 1800) * 1.0 + np.sin(2 * np.pi * 38 * tt) * .6; F(norm(x * ar(d, .06, .7)), t0, 1.0); duckat(t0, .65, 1.2)
    elif ty == 'boom': F(boom(1.1), t0, 1.0, pan * .5); F(BK['impact'], t0, .9); duckat(t0, .45, .4)
    elif ty == 'clang': F(clang(1, .9 + (i % 3) * .12), t0 + .03, .7, pan); F(BK['tight'], t0 - .05, .5, pan)
    elif ty == 'whoosh': F(BK['gust'], t0, .8)
    elif ty == 'thud': F(sfx.thump(1, 80), t0, .9, -.5); F(BK['cloth'], t0, .7, -.5)
    elif ty == 'laugh':
        for k2 in range(5): d = .1; tt = t_(d); F(bp(saw(96 - k2 * 7, d), 200, 900) * ar(d, .01, .05) * 1.2, t0 + k2 * .13, .55)
    elif ty == 'coinglow': F(BK['shim'], t0, .8); F(ring([1318, 1976, 2637], 1.2, .5), t0, .35)
    elif ty == 'aura':
        d = e['d']; tt = t_(d); F((bp(noise(d), 250, 2400) * (.5 + .5 * np.sin(2 * np.pi * 11 * tt)) * .5 + np.sin(2 * np.pi * np.cumsum(55 + 90 * tt / d) / SR) * .6) * np.linspace(.15, 1, len(tt)) ** 1.5, t0, .7)
    elif ty == 'dash': F(BK['jet'], t0, 1.0); F(shing(.7, 1.1, .5), t0, .5)
    elif ty == 'crack': F(sfx.crash(1), t0, .8); F(boom(.8), t0, .8); F(ring([3100, 4400, 6100], .5, .1), t0, .5)
    elif ty == 'explode': F(sfx.ignite(1), t0, 1.0); F(boom(1.3), t0, 1.0); d = 1.3; F(lp(noise(d), 4000) * np.exp(-t_(d) / .35) * .6, t0, .8); duckat(t0, .4, .6)
    elif ty == 'shimmer': F(BK['shim'], t0, .9); F(BK['flour'], t0 + .1, .7)
    elif ty == 'slide': F(BK['paper'], t0, .9); F(BK['gust'], t0, .5)
    elif ty == 'pop': F(BK['bloop'], t0, .8); F(BK['boop'], t0, .5)
    elif ty == 'cutsoft': F(BK['crisp'], t0 - .04, .3, pan); F(bp(noise(.05), 900, 4200) * ar(.05, .005, .03) * .5, t0 + .05, .25, pan); F(bp(noise(.05), 900, 4200) * ar(.05, .005, .03) * .5, t0 + .12, .2, pan)
    elif ty == 'ding': F(BK['ding'], t0, .9); F(BK['flour'], t0, .6); F(BK['sting'], t0, .4)
    elif ty == 'rattle':
        for k2 in range(5): F(BK['snap'], t0 + k2 * .065, .5)
    elif ty == 'burst': F(BK['bloop'], t0, 1.0); F(boom(.7), t0, .7); F(BK['gust'], t0, .7); duckat(t0, .4, .4)
    elif ty == 'flutter':
        for k2, tt2 in enumerate(np.arange(t0, t0 + e['d'], .07)): F(bp(noise(.05), 900, 4200) * ar(.05, .005, .03) * .5, tt2, .2 + .1 * rng.random(), np.sin(k2 * 1.3) * .8)
    elif ty == 'munch':
        g = .45 if e.get('soft') else .75; d = .12; F(bp(saw(140 - (i % 4) * 14, d), 200, 1600) * ar(d, .004, .06) * 1.1, t0, g * .6, pan); F(BK['boop'], t0 + .02, g * .6, pan); F(BK['snap'], t0, g * .4, pan)
    elif ty == 'hop': F(BK['zipu'], t0, .55, -.3); F(sfx.whoosh(.18, 1), t0, .4, -.3)
    elif ty == 'duck': F(BK['cloth'], t0, .7, -.3); F(BK['zipd'], t0, .4, -.3)
    elif ty == 'kick': F(sfx.thump(1, 95 + i * 8), t0, .7, -.6 if i % 2 == 0 else .6); F(BK['tight'], t0, .5, -.6 if i % 2 == 0 else .6)
    elif ty == 'step': F(sfx.thump(1, 85), t0, .6, -.3)
    elif ty == 'grind':
        d = e['d']; tt = t_(d); F((hp(noise(d), 4500) * (.6 + .4 * np.sin(2 * np.pi * 37 * tt)) * .5 + ring([2300, 3450, 5100], d, .6) * .4) * ar(d, .03, .15), t0, .6)
    elif ty == 'crash':
        F(sfx.crash(1), t0, .7)
        for k2 in range(6): F(tom(110 + rng.random() * 90, .5), t0 + .05 + rng.random() * .5, .5, rng.random() * 1.4 - .7)
    elif ty == 'suck':
        d = e['d']; tt = t_(d); up = np.linspace(.05, 1, len(tt)); F(bp(noise(d), 300, 3000) * up ** 2 * .7 + np.sin(2 * np.pi * np.cumsum(90 + 260 * tt / d) / SR) * up * .35, t0, .7)
    elif ty == 'grab': F(ring([1568 * 2 ** (i / 12), 3136 * 2 ** (i / 12)], .35, .1), t0 + .03, .6, pan); F(BK['tight'], t0 - .05, .5, pan); F(BK['bloop'], t0 + .03, .5, pan)
    elif ty == 'gulp': tt = t_(.3); F(np.sin(2 * np.pi * np.cumsum(240 - 170 * tt / .3) / SR) * ar(.3, .01, .12) * .9, t0, .9); F(sfx.thump(1, 60), t0 + .22, .9)
    elif ty == 'gridline': F(BK['crisp'], t0 - .03, .6, pan); F(ring([880 * 2 ** ((i % 7) * 2 / 12), 1760 * 2 ** ((i % 7) * 2 / 12)], .3, .09), t0 + .05, .45, pan)
    elif ty == 'snap': g = .3 if e.get('soft') else .5; F(BK['snap'], t0, g, pan); F(BK['boop'], t0, g * .7, pan)
    else: print('! jenis kejadian tanpa suara:', ty)

# ───────── hening yang disengaja + master
def mute(buf, a, b, fd=.03):
    i0, i1, nf = int(a * SR), int(b * SR), int(fd * SR); buf[i0 - nf:i0] *= np.linspace(1, 0, nf)[:, None]; buf[i0:i1] = 0
mute(mus, 19.5, 21.375); mute(mus, 24.6, 24.75); mute(mus, 26.4, 27.3); mute(mus, 3.0, 3.0)
mute(fx, 21.0, 21.36); mute(fx, 24.6, 24.745); mute(fx, 26.42, 26.98)
for ch in range(2): mus[:, ch] = (hp(mus[:, ch], 32) - lp(mus[:, ch], 120) * .38) * duck; fx[:, ch] -= lp(fx[:, ch], 110) * .3
mix = mus * .8 + fx * .9
for ch in range(2): mix[:, ch] -= lp(mix[:, ch], 125) * .5
pk = np.percentile(np.abs(mix), 99.99); mix = mix / pk * .8
for ch in range(2): mix[:, ch] = sfx.limit(mix[:, ch], .92)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR)
def band(x, lo, hi): return 10 * np.log10(np.mean(bp(x, lo, hi) ** 2) + 1e-12)
m = mix.mean(1); print('mix ok', mix.shape, 'peak %.2f' % np.abs(mix).max(), 'low(30-120) %.1f dB vs mid(300-3000) %.1f dB' % (band(m, 30, 120), band(m, 300, 3000)))
for a, b in [(21.02, 21.34), (24.62, 24.74), (26.45, 26.95)]: print('hening %.2f-%.2f rms %.5f' % (a, b, np.sqrt(np.mean(mix[int(a * SR):int(b * SR)] ** 2))))
