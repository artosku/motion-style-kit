"""Potong <folder>/voices_el/semua.mp3 (satu kali generate di situs ElevenLabs) jadi voices/<id>.wav + dur.json.   python tools/kit.py ingest <folder>
Cara: Whisper memberi waktu tiap kata -> dicocokkan ke naskah (script_elevenlabs.txt) -> dipotong di titik paling hening antar baris.
Baris dengan file sendiri (voices_el/s16.mp3, dst.) menggantikan hasil potongan."""
import os, re, sys, json, shutil, difflib
import numpy as np, soundfile as sf
from faster_whisper import WhisperModel
from kitlib import load_spec, ids_of
HERE = os.path.abspath(sys.argv[1]); SPEC = load_spec(HERE); IDS = ids_of(SPEC); NL = len(IDS)
LANGW = SPEC.get('lang', 'id')
x, sr = sf.read(os.path.join(HERE, 'voices_el', 'semua.mp3'), dtype='float64'); x = x.mean(axis=1) if x.ndim > 1 else x
print('durasi', round(len(x) / sr, 2), 's')
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
script = [re.sub(r'<[^>]+>', ' ', l).strip() for l in open(os.path.join(HERE, 'script_elevenlabs.txt'), encoding='utf-8').read().splitlines() if l.strip()]
assert len(script) == NL, (len(script), NL)
B = [(norm(w), li) for li, l in enumerate(script) for w in l.replace('...', ' ').split() if norm(w)]
import soundfile as _sf; tmp = os.path.join(HERE, 'out', '_semua16k.wav'); os.makedirs(os.path.dirname(tmp), exist_ok=True)
import subprocess; subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(HERE, 'voices_el', 'semua.mp3'), '-ac', '1', '-ar', '16000', tmp], check=True)
segs, _ = WhisperModel('small', device='cpu', compute_type='int8').transcribe(tmp, language=LANGW, word_timestamps=True, vad_filter=False)
A = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
print('kata terdengar', len(A), 'kata naskah', len(B))
m, n = len(A), len(B); G = .6; D = np.zeros((m + 1, n + 1)); D[:, 0] = np.arange(m + 1) * G; D[0, :] = np.arange(n + 1) * G
cost = lambda i, j: 1 - difflib.SequenceMatcher(None, A[i][0], B[j][0]).ratio()
for i in range(1, m + 1):
    for j in range(1, n + 1): D[i, j] = min(D[i - 1, j - 1] + cost(i - 1, j - 1), D[i - 1, j] + G, D[i, j - 1] + G)
i, j = m, n; pair = {}
while i > 0 and j > 0:
    if abs(D[i, j] - (D[i - 1, j - 1] + cost(i - 1, j - 1))) < 1e-9: pair[j - 1] = i - 1; i -= 1; j -= 1
    elif abs(D[i, j] - (D[i - 1, j] + G)) < 1e-9: i -= 1
    else: j -= 1
line_idx = {li: [pair[j] for j in range(n) if B[j][1] == li and j in pair and cost(pair[j], j) < .6] for li in range(NL)}
for li in range(NL):
    if not line_idx[li]: sys.exit(f'Baris {li} ({IDS[li]}) tidak ketemu di rekaman. Cek naskah yang digenerate.')
fr = int(.005 * sr); nn = len(x) // fr; rms = np.sqrt(np.mean(x[:nn * fr].reshape(nn, fr) ** 2, axis=1)) + 1e-9; dbv = 20 * np.log10(rms)
cand = []; k = 0                                                       # celah hening (< -50 dB) minimal 0,24 s = kandidat batas antarbaris
while k < nn:
    if dbv[k] < -50:
        j = k
        while j < nn and dbv[j] < -50: j += 1
        if (j - k) * .005 >= .24: cand.append(((k + j) / 2 * .005, (j - k) * .005))
        k = j
    else: k += 1
print('kandidat celah', len(cand)); cuts = []; last = 0
for li in range(NL - 1):
    a_end = A[max(line_idx[li])][2]; b_start = A[min(line_idx[li + 1])][1]; est = (a_end + b_start) / 2
    opts = [(c, l) for c, l in cand if abs(c - est) < 1.0 and c > last + .5]
    if not opts: sys.exit(f'Tidak ada celah hening dekat batas baris {li}->{li + 1} (sekitar {est:.1f}s). Generate ulang dengan jeda lebih panjang.')
    c = max(opts, key=lambda o: o[1] - .4 * abs(o[0] - est))[0]; cuts.append(c); last = c
edges = [0.0] + cuts + [len(x) / sr]
os.makedirs(os.path.join(HERE, 'voices'), exist_ok=True)
dur = {}
for li, id_ in enumerate(IDS):
    a, b = int(edges[li] * sr), int(edges[li + 1] * sr); seg = x[a:b]; idx = np.where(np.abs(seg) > .003)[0]
    if len(idx): seg = seg[max(0, idx[0] - int(.04 * sr)): idx[-1] + int(.12 * sr)]
    f = int(.025 * sr); seg = seg.copy(); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    ov = os.path.join(HERE, 'voices_el', id_ + '.mp3')
    if os.path.exists(ov): seg, _ = sf.read(ov, dtype='float64'); seg = seg.mean(axis=1) if seg.ndim > 1 else seg; print('  file sendiri:', id_)
    sf.write(os.path.join(HERE, 'voices', id_ + '.wav'), seg, sr, subtype='PCM_16'); dur[id_] = round(len(seg) / sr, 3); print(id_, dur[id_], '|', script[li][:50])
json.dump(dur, open(os.path.join(HERE, 'voices', 'dur.json'), 'w'), indent=1)
