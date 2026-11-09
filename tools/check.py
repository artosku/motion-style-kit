"""Cek hasil video: durasi, loudness, ujung rekaman suara, urutan nama (opsional, pakai Whisper), dan lembar kontak (1 gambar berisi banyak frame).
   python tools/kit.py check <folder> [--whisper]"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from kitlib import load_spec, ids_of

def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)

def main(work, whisper=False):
    spec = load_spec(work); TL = json.load(open(os.path.join(work, 'timeline.json'), encoding='utf-8')); slug = spec.get('slug', 'video')
    mp4 = os.path.join(work, slug + '.mp4'); ok = True
    if not os.path.exists(mp4): sys.exit('Belum ada ' + mp4 + ' (jalankan render + mux dulu).')
    dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).stdout.strip())
    print(f'durasi {dur:.1f}s (jadwal {TL["total"]}s)', 'OK' if abs(dur - TL['total']) < 1.0 else 'BEDA!'); ok &= abs(dur - TL['total']) < 1.0
    r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
    I = re.findall(r'\n\s+I:\s+(-?[\d.]+) LUFS', r); P = re.findall(r'\n\s+Peak:\s+(-?[\d.]+) dBFS', r)
    if I and P:
        i, p = float(I[-1]), float(P[-1]); good = -15 <= i <= -13 and p <= -1.0
        print(f'loudness {i} LUFS, puncak {p} dBFS', 'OK' if good else 'DI LUAR TARGET (-14 LUFS, puncak <= -1)'); ok &= good
    vd = os.path.join(work, 'voices'); bad = []
    for k in ids_of(spec):
        f = os.path.join(vd, k + '.wav')
        if not os.path.exists(f): continue
        x, sr = sf.read(f); x = x.mean(axis=1) if x.ndim > 1 else x; tail = x[-int(.03 * sr):]
        e = 20 * np.log10(np.sqrt(np.mean(tail ** 2)) + 1e-9)
        if e > -45: bad.append((k, round(e, 1)))
    if os.path.isdir(vd): print('ujung suara:', 'semua bersih' if not bad else f'MUNGKIN TERPOTONG di {bad} (generate ulang baris itu)'); ok &= not bad
    if whisper:
        from faster_whisper import WhisperModel
        tmp = os.path.join(work, 'out', '_final16k.wav'); run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4, '-vn', '-ac', '1', '-ar', '16000', tmp])
        segs, _ = WhisperModel('small', device='cpu', compute_type='int8').transcribe(tmp, language=spec.get('lang', 'id'), word_timestamps=True)
        ws = [(w.start, w.word.strip()) for s in segs for w in s.words]
        for k, t in TL['voice'].items():
            near = [w for w in ws if abs(w[0] - t) < 1.2]; print(f'  {k:5s} jadwal {t:6.1f}s | terdengar:', near[0][1] if near else '(TIDAK ADA SUARA)')
    # lembar kontak: satu frame per poin (1,4 dtk setelah nama muncul) + layar akhir
    from PIL import Image
    times = [t + 1.4 for t in TL['T']] + [TL['ctaStart'] + 3.5]; tiles = []
    od = os.path.join(work, 'out', 'contact'); os.makedirs(od, exist_ok=True)
    for j, t in enumerate(times):
        f = os.path.join(od, f'{j:02d}.jpg'); run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(min(t, dur - .2)), '-i', mp4, '-frames:v', '1', '-vf', 'scale=640:-1', f])
        if os.path.exists(f): tiles.append(Image.open(f))
    if tiles:
        cols = 3; w, h = tiles[0].size; rows = (len(tiles) + cols - 1) // cols; sheet = Image.new('RGB', (cols * w, rows * h), 'white')
        for j, im in enumerate(tiles): sheet.paste(im, ((j % cols) * w, (j // cols) * h))
        sp = os.path.join(work, 'out', 'contact.jpg'); sheet.save(sp, quality=85); print('lembar kontak:', sp)
    print('HASIL:', 'LOLOS' if ok else 'ADA YANG PERLU DIPERBAIKI (lihat di atas)')
    return ok

if __name__ == '__main__':
    main(sys.argv[1], '--whisper' in sys.argv)
