"""Mix audio film: narasi + musik (satu lagu, timbre ganti per style, nada/tempo ikut suasana topik) + SFX -> <folder>/out/mix.wav
   python tools/kit.py mix <folder>      (butuh timeline.json; voices/ boleh kosong = tanpa narasi)
Musik dibuat murni dari kode (tanpa sampel); SFX dari assets/sfx (earshot, uisfx, Openverse CC0). Loudness akhir diatur mux.sh (-14 LUFS)."""
import json, math, os, random, sys
import numpy as np, soundfile as sf
from scipy import signal
from kitlib import ASSETS, CATALOG, STYLES

WORK = os.path.abspath(sys.argv[1])
SR = 44100
TL = json.load(open(os.path.join(WORK, 'timeline.json'), encoding='utf-8'))
T = TL['T']; N = len(T); TOTAL = TL['total']; NS = int((TOTAL + 1.0) * SR); SIDS = TL['styles']
HOP = 1.05
rs = np.random.RandomState(5)
def db(x): return 10 ** (x / 20)
def load(path):
    x, sr = sf.read(path, dtype='float64')
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != SR: g = math.gcd(SR, sr); x = signal.resample_poly(x, SR // g, sr // g)
    return x
def lp(x, fc, order=2): return signal.sosfilt(signal.butter(order, fc / (SR / 2), 'low', output='sos'), x)
def hp(x, fc, order=2): return signal.sosfilt(signal.butter(order, fc / (SR / 2), 'high', output='sos'), x)
def bp(x, a, b): return signal.sosfilt(signal.butter(2, [a / (SR / 2), b / (SR / 2)], 'band', output='sos'), x)
def stereo_add(buf, x, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), buf.shape[0] - i)
    if n <= 0: return
    a = (pan + 1) * math.pi / 4; buf[i:i + n, 0] += x[:n] * gain * math.cos(a) * 1.414; buf[i:i + n, 1] += x[:n] * gain * math.sin(a) * 1.414

# ───────── narasi (kosong kalau belum ada rekaman: video tetap jadi, hanya musik + SFX + teks)
voice = np.zeros((NS, 2)); nvoice = 0
for k, t0 in TL['voice'].items():
    f = os.path.join(WORK, 'voices', k + '.wav')
    if not os.path.exists(f): continue
    x = load(f); x = x * (0.11 / (np.sqrt(np.mean(x ** 2)) + 1e-9)); stereo_add(voice, np.tanh(x * 1.6) / 1.6, t0, 1.0); nvoice += 1
env = np.abs(voice).max(axis=1); env = signal.sosfilt(signal.butter(2, 6 / (SR / 2), 'low', output='sos'), env); env = np.clip(env / (env.max() * .5 + 1e-9), 0, 1)
duck = 1 - .55 * env
print('narasi:', nvoice, 'baris')

# ───────── musik: suasana (mood) menentukan tempo, nada dasar, urutan akor, dan melodi
MAJ, MIN = [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10]
#            tempo, tonika, minor?, akor (jarak akar dari tonika, jenis), kerapatan melodi
MOODS = {'ceria': (120, 0, False, [(0, 'M'), (9, 'm'), (5, 'M'), (7, 'M')], 'orig'),       # lagu asli film contoh (melodi karangan tangan)
         'tenang': (90, 2, False, [(0, 'M'), (7, 'M'), (9, 'm'), (5, 'M')], 'sparse'),
         'semangat': (132, 0, False, [(0, 'M'), (5, 'M'), (9, 'm'), (7, 'M')], 'busy'),
         'hangat': (100, 5, False, [(9, 'm'), (5, 'M'), (0, 'M'), (7, 'M')], 'mid'),
         'serius': (104, 9, True, [(0, 'm'), (8, 'M'), (3, 'M'), (10, 'M')], 'mid'),
         'misterius': (96, 4, True, [(0, 'm'), (5, 'm'), (8, 'M'), (7, 'M')], 'sparse')}
M = TL['music']; mood = M.get('mood') or 'ceria'
if mood not in MOODS: sys.exit(f"mood '{mood}' tidak dikenal. Pilihan: " + ', '.join(MOODS))
BPM, TON, MINOR, PROG, DENS = MOODS[mood]
if M.get('bpm'): BPM = float(M['bpm'])
if M.get('key') is not None: TON = int(M['key']) % 12
BEAT = 60.0 / BPM
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
LEAD0 = [(0, 76, 1), (1, 79, .5), (1.5, 76, .5), (2, 72, 1), (3, 74, 1), (4, 72, 1.5), (5.5, 76, .5), (6, 81, 1), (7, 79, 1),
         (8, 77, 1), (9, 81, .5), (9.5, 77, .5), (10, 72, 1), (11, 74, 1), (12, 74, 1.5), (13.5, 71, .5), (14, 67, 1), (15, 72, 1)]
def chord(root_off, q):
    """Tiga nada akor (MIDI), akar ditaruh di 41..52. Untuk C-Am-F-G hasilnya persis akor lagu asli."""
    pc = (TON + root_off) % 12; r = 41 + ((pc - 41) % 12); return (r, r + (3 if q == 'm' else 4), r + 7)
CHORDS = [chord(o, q) for o, q in PROG]
def gen_lead():
    """Melodi dibuat otomatis tapi aman: nada kuat = nada akor, nada lemah = nada tangga nada, gerak per langkah (tidak melompat jauh)."""
    r = random.Random(sum(map(ord, mood)) + TON * 31); scale = {(TON + s) % 12 for s in (MIN if MINOR else MAJ)}
    pats = {'sparse': [[(0, 2), (2, 1), (3, 1)], [(0, 1.5), (1.5, .5), (2, 2)]],
            'mid': [[(0, 1), (1, .5), (1.5, .5), (2, 1), (3, 1)], [(0, 1.5), (1.5, .5), (2, 1), (3, 1)]],
            'busy': [[(0, .5), (.5, .5), (1, .5), (1.5, .5), (2, 1), (3, 1)], [(0, 1), (1, .5), (1.5, .5), (2, .5), (2.5, .5), (3, 1)]]}[DENS]
    out, prev = [], 72
    for bar, (ro, q) in enumerate(PROG):
        rp = (TON + ro) % 12; ct = {rp, (rp + (3 if q == 'm' else 4)) % 12, (rp + 7) % 12}
        for b, d in r.choice(pats):
            pool = [p for p in range(64, 82) if (p % 12 in ct if b in (0, 2) else p % 12 in scale)]
            pool.sort(key=lambda p: abs(p - prev) + (3 if p == prev else 0)); p = r.choice(pool[:3]); out.append((bar * 4 + b, p, d)); prev = p
    return out
LEAD = [(b, m + TON, d) for b, m, d in LEAD0] if DENS == 'orig' else gen_lead()
def adsr(n, a, hold, r):
    t = np.arange(n) / SR; e = np.minimum(t / max(a, 1e-3), 1); e = np.where(t > hold, e * np.exp(-(t - hold) / max(r, 1e-3)), e); return e
def ks(f, n, decay=.996):
    N_ = max(2, int(SR / f)); x = np.zeros(n); x[:N_] = np.random.RandomState(int(f) % 997).uniform(-1, 1, N_); a = np.zeros(N_ + 2); a[0] = 1; a[N_] = -decay * .5; a[N_ + 1] = -decay * .5
    y = signal.lfilter([1], a, x); return y / (np.abs(y).max() + 1e-9)
def inst(kind, f, dur):
    n = int((dur + .6) * SR); t = np.arange(n) / SR; w = 2 * np.pi * f * t
    if kind == 'sine': return np.sin(w) * np.exp(-t / (dur * .8 + .2))
    if kind == 'tri': return signal.sawtooth(w, .5) * np.exp(-t / (dur * .7 + .15))
    if kind == 'sq50': return signal.square(w, .5) * .5 * adsr(n, .005, dur, .08)
    if kind == 'sq25': return signal.square(w, .25) * .45 * np.exp(-t / .22)
    if kind == 'sq12': return signal.square(w, .125) * .45 * np.exp(-t / .16)
    if kind == 'saw': return lp(signal.sawtooth(w) + signal.sawtooth(w * 1.006), 2400) * .45 * adsr(n, .01, dur, .12)
    if kind == 'marimba': return (np.sin(w) + .45 * np.sin(4 * w) * np.exp(-t / .04)) * np.exp(-t / .32)
    if kind == 'glock': return (np.sin(w) + .6 * np.sin(2.76 * w) + .3 * np.sin(5.4 * w)) * np.exp(-t / .55) * .6
    if kind == 'kalimba': return (np.sin(w) + .25 * np.sin(5 * w) * np.exp(-t / .03)) * np.exp(-t / .5)
    if kind == 'fm': return np.sin(w + 2.2 * np.exp(-t / .35) * np.sin(2 * w)) * np.exp(-t / .75) * .8
    if kind == 'organ': return (np.sin(w) + .5 * np.sin(2 * w) + .25 * np.sin(3 * w) + .12 * np.sin(4 * w)) * .5 * adsr(n, .02, dur, .15)
    if kind == 'pad': return lp(signal.sawtooth(w) + signal.sawtooth(w * 1.004) + signal.sawtooth(w * .997), 1100) * .3 * adsr(n, .25, dur, .45)
    if kind == 'brass': return lp(signal.sawtooth(w * (1 + .004 * np.sin(2 * np.pi * 5.5 * t))), 1800) * .6 * adsr(n, .05, dur, .1) * (.6 + .4 * (1 - np.exp(-t / .12)))
    if kind == 'pluck': return ks(f, n, .994 if f > 200 else .997) * np.exp(-t / (dur * .8 + .5)) * .9
    return np.sin(w) * np.exp(-t / .3)
SUSTAINED = ('pad', 'organ')
def drum(kind):
    n = int(.35 * SR); t = np.arange(n) / SR
    if kind == 'kick': return np.sin(2 * np.pi * (50 + 110 * np.exp(-t / .03)) * t) * np.exp(-t / .16)
    if kind == 'kick_soft': return np.sin(2 * np.pi * (60 + 70 * np.exp(-t / .03)) * t) * np.exp(-t / .12) * .7
    if kind == 'snare': return (lp(rs.randn(n), 6000) * np.exp(-t / .09) + .4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / .06)) * .6
    if kind == 'brush': return bp(rs.randn(n), 2500, 9000) * np.exp(-t / .12) * .5
    if kind == 'hat': return hp(rs.randn(n), 7000) * np.exp(-t / .035) * .35
    if kind == 'tick': return hp(rs.randn(n), 4000) * np.exp(-t / .008) * .6
    if kind == 'wood': return np.sin(2 * np.pi * 820 * t) * np.exp(-t / .03) * .6 + hp(rs.randn(n), 2000) * np.exp(-t / .012) * .2
    if kind == 'wood_lo': return np.sin(2 * np.pi * 420 * t) * np.exp(-t / .05) * .7
    if kind == 'taiko': return np.sin(2 * np.pi * (70 + 60 * np.exp(-t / .05)) * t) * np.exp(-t / .3) * .9
    if kind == 'chip_k': return signal.square(2 * np.pi * (60 + 200 * np.exp(-t / .025)) * t) * np.exp(-t / .1) * .35
    if kind == 'chip_s': return np.sign(rs.randn(n)) * np.exp(-t / .07) * .3
    if kind == 'chip_h': return np.sign(rs.randn(n)) * np.exp(-t / .02) * .18
    if kind == 'gate_s': return (lp(rs.randn(n), 8000) * np.exp(-t / .2) * (t < .16)) * .6
    return np.zeros(n)
KITS = {'soft': ('kick_soft', 'brush', 'hat'), 'wood': ('wood_lo', 'wood', 'tick'), 'chip': ('chip_k', 'chip_s', 'chip_h'), 'tick': ('tick', None, 'tick'),
        'taiko': ('taiko', None, None), 'lofi': ('kick', 'snare', 'hat'), 'gated': ('kick', 'gate_s', 'hat'), 'none': (None, None, None)}
def bitcrush(x, bits=6, hold=3): y = np.repeat(x[::hold], hold)[:len(x)]; q = 2 ** bits; return np.round(y * q) / q
def render_section(ins, t0, t1):
    lead, comp, bass, kit = ins; buf = np.zeros(NS)
    def add(x, t, g):
        if t < t0 or t > t1: return
        i = int(t * SR); n = min(len(x), NS - i)
        if n > 0: buf[i:i + n] += x[:n] * g
    for L in range(int(TOTAL / (16 * BEAT)) + 2):
        base = L * 16 * BEAT
        for (b, m, d) in LEAD: add(inst(lead, mf(m + (12 if lead in ('sq12',) else 0)), d * BEAT), base + b * BEAT, .5)
        for bar in range(4):
            bt = base + bar * 4 * BEAT; ch = CHORDS[bar]
            if comp in SUSTAINED:
                for m in ch: add(inst(comp, mf(m + 12), 4 * BEAT), bt, .16)
            else:
                for j, b in enumerate([0, 1, 1.5, 2, 3, 3.5]): add(inst(comp, mf(ch[j % 3] + 12), .5 * BEAT), bt + b * BEAT, .22)
            add(inst(bass, mf(ch[0] - 12), 1.5 * BEAT), bt, .55); add(inst(bass, mf(ch[0] - 12), 1.5 * BEAT), bt + 2 * BEAT, .45); add(inst(bass, mf(ch[2] - 12), .5 * BEAT), bt + 3.5 * BEAT, .3)
            k, s, h = KITS[kit]
            for b in range(4):
                if k and b in (0, 2): add(drum(k), bt + b * BEAT, .5)
                if s and b in (1, 3): add(drum(s), bt + b * BEAT, .4)
            if h:
                for b in np.arange(0, 4, .5): add(drum(h), bt + b * BEAT, .25 if b % 1 == 0 else .15)
    if kit == 'lofi': buf = bitcrush(buf, 7, 3)
    return buf
# bagian lagu: intro lalu tiap poin; poin berurutan dengan alat musik sama digabung (tanpa sambungan)
INTRO_INS = tuple(STYLES[SIDS[0]]['instr']) if len(set(SIDS)) == 1 else tuple(CATALOG['intro_instr'])
secs = [[tuple(INTRO_INS), 0.0, T[0]]]
for k in range(N):
    ins = tuple(STYLES[SIDS[k]]['instr']); a = T[k]; b = T[k + 1] if k + 1 < N else 1e9
    if secs[-1][0] == ins: secs[-1][2] = b
    else: secs.append([ins, a, b])
music = np.zeros(NS); tt = np.arange(NS) / SR
for si, (ins, a, b) in enumerate(secs):
    x = render_section(ins, 0.0 if si == 0 else a - .55, (b if b < 1e9 else TOTAL) + .55)
    g = np.ones(NS)
    if si > 0: g *= np.clip((tt - (a - .3)) / .6, 0, 1)
    if b < 1e9: g *= np.clip(((b + .3) - tt) / .6, 0, 1)
    music += x * g
music = music / (np.abs(music).max() + 1e-9) * .34
music *= np.clip((TOTAL + .3 - tt) / 1.4, 0, 1)                                             # fade-out akhir
print('musik:', mood, round(BPM), 'bpm,', len(secs), 'bagian timbre')

# ───────── SFX
sfx = np.zeros((NS, 2)); wind = np.zeros((NS, 2))
SD = os.path.join(ASSETS, 'sfx')
def es(i): return os.path.join(SD, 'es_' + i.replace('/', '_') + '.wav')
def ov(n): return os.path.join(SD, n + '.mp3')
def ui(p): return os.path.join(SD, 'ui', p + '.mp3')
def src_path(tok):
    kind, _, name = tok.partition(':')
    return {'es': es, 'ov': ov, 'ui': ui}[kind](name)
def get(path, start=0.0, dur=None):
    if not os.path.exists(path): print('! SFX tidak ada:', path); return None
    x = load(path); a = int(start * SR); x = x[a:a + int(dur * SR)] if dur else x[a:]
    if dur: x = x * np.minimum(1, np.minimum(np.arange(len(x)) / (.01 * SR), (len(x) - np.arange(len(x))) / (.04 * SR)))
    return x
def put(path, t, gdb, pan=0, start=0.0, dur=None, peak_align=False):
    x = get(path, start, dur)
    if x is None: return
    if peak_align: t = t - np.argmax(np.abs(x)) / SR
    stereo_add(sfx, x / (np.abs(x).max() + 1e-9), t, db(gdb), pan)
# intro: pesawat, ayam loncat, mulai jatuh
eng = bp(rs.randn(NS), 60, 400) * .5 + np.sin(2 * np.pi * 92 * np.arange(NS) / SR) * .3; eng *= np.clip((2.3 - np.arange(NS) / SR) / .9, 0, 1) * np.clip(np.arange(NS) / SR / .3, 0, 1); wind[:, 0] += eng * .05; wind[:, 1] += eng * .05
put(es('swipe/cloth'), HOP - .08, -9, 0.3); put(es('pro_zip/down'), HOP + .55, -13, 0); put(es('downlifter/air_fall'), HOP + .25, -17, 0)
w = get(ov('ov_wind'))
if w is not None:
    w = lp(w, 5000); bed = np.zeros(NS); pos = 0; xf = int(.8 * SR); fade = np.linspace(0, 1, xf)
    while pos < NS: seg = w.copy(); seg[:xf] *= fade; seg[-xf:] *= fade[::-1]; n = min(len(seg), NS - pos); bed[pos:pos + n] += seg[:n]; pos += len(seg) - xf
    ramp = np.clip((np.arange(NS) / SR - 1.2) / 1.4, 0, 1); bed *= ramp / (np.abs(bed).max() + 1e-9) * db(-27); wind[:, 0] += bed; wind[:, 1] += bed
WH = {**CATALOG['transitions'], 'roll': ('swipe/cloth', -10)}
POPS = ['ui_pop/boop', 'ui_pop/blip', 'ui_pop/soft', 'pro_pop/bloop', 'pro_pop/chirp', 'pro_pop/double']
for k in range(N):
    t = T[k]; wh, g = WH[TL['tr'][k]]; put(es(wh), t - .02, g, 0, peak_align=True)
    put(es(POPS[k % len(POPS)]), t + .0, -13, (-.3 if k % 2 else .3))
    for src, name, off, g2, kw in STYLES[SIDS[k]]['accent']:                     # suara khas bahan/gaya tiap style
        put(src_path(src + ':' + name), t + off, g2, 0, **kw)
    for tok, off, g2 in TL['itemSfx'][k]:                                         # suara tambahan sesuai topik (dipilih di spec.json)
        put(src_path(tok), t + off, g2, 0)
    side = 1 if k % 2 else -1; put(es('whoosh_fast/tight'), TL['obs'][k] + .40, -13, side * .6, peak_align=True)
CS = TL['ctaStart']; put(es('whoosh_big/jet'), CS + .05, -9, 0, peak_align=True); put(es('mallet/flourish'), CS + .85, -12, 0); put(es('pro_notify/ding_1930'), CS + 2.0, -14, 0); put(es('pro_pop/chirp'), CS + 1.95, -15, 0)

# ───────── mix akhir (musik ditunduk saat narasi), puncak dinormalkan; loudness akhir diatur mux.sh (-14 LUFS)
mix = voice * 1.0 + music[:, None] * duck[:, None] * 1.0 + sfx * .45 + wind * (0.7 + .3 * duck[:, None])
mix = mix[:int((TOTAL + .5) * SR)]
pk = np.abs(mix).max(); print('puncak sebelum norm', round(20 * math.log10(pk), 1), 'dBFS')
mix = mix / pk * db(-1.5)
os.makedirs(os.path.join(WORK, 'out'), exist_ok=True); sf.write(os.path.join(WORK, 'out', 'mix.wav'), mix, SR, subtype='PCM_24'); print('ok', round(len(mix) / SR, 2), 's')
