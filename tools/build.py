"""spec.json (+ voices/dur.json kalau ada) -> timeline.json + naskah suara + salinan mesin video.
Satu sumber jadwal untuk video (JS) dan audio (mix.py).   python tools/kit.py build <folder>"""
import json, os, re, shutil, sys
from kitlib import KIT, STYLES, load_spec, resolve_styles, say_of, load_durs, ids_of

INTRO_END = 3.7                      # intro: pesawat, ayam loncat, narasi pembuka
TR = ['iris', 'slices', 'blocks', 'wave', 'clock']
ENGINE_FILES = ['index.html', 'film.js', 'main.js', 'styles.js', 'minyam.js']


def copy_engine(work):
    """Salin mesin ke folder kerja (selalu ditimpa, supaya perbaikan mesin ikut masuk)."""
    for f in ENGINE_FILES:
        shutil.copy2(os.path.join(KIT, 'engine', f), os.path.join(work, f))
    os.makedirs(os.path.join(work, 'fonts'), exist_ok=True)
    shutil.copy2(os.path.join(KIT, 'engine', 'fonts', 'Inter.ttf'), os.path.join(work, 'fonts', 'Inter.ttf'))


def cap(s):
    s = s.strip()
    return s[:1].upper() + s[1:]


def main(work):
    spec = load_spec(work); items = spec['items']; n = len(items)
    D, real = load_durs(work, spec)
    sids = resolve_styles(spec, n)
    T, t = [], INTRO_END
    for i in range(1, n + 1):
        T.append(round(t, 3)); t += max(2.4, D[f's{i:02d}'] + 0.55)
    cta_start = round(t, 3); cta_voice = round(cta_start + 0.55, 3)
    total = round(cta_voice + D['cta'] + 1.8, 3)
    tr = ['roll' if k > 0 and sids[k] == sids[k - 1] else TR[k % 5] for k in range(n)]
    intro_text = spec['intro']['text'].strip().rstrip('.!?')
    caps = [{'t0': 0.35, 't1': round(0.35 + D['intro'] + .15, 3), 'text': cap(intro_text) + '.'}]
    for i, it in enumerate(items, 1):
        t0 = round(T[i - 1] + 0.05, 3)
        tag = it.get('tag', '')
        caps.append({'t0': t0, 't1': round(t0 + D[f's{i:02d}'] + .15, 3), 'text': (it['name'] + ('. ' + tag if tag else '')).strip()})
    c = dict(spec['cta'])
    cfgp = os.path.join(KIT, 'config.json'); cfg = json.load(open(cfgp, encoding='utf-8')) if os.path.exists(cfgp) else {}
    c.setdefault('button', 'Follow ' + (cfg.get('handle') or 'Artosku')); c.setdefault('footer', 'Catat keuanganmu bareng Minyam'); c.setdefault('sub', '')
    music = {'mood': spec.get('mood', 'ceria'), 'bpm': spec.get('bpm'), 'key': spec.get('key')}
    tl = {'introEnd': INTRO_END, 'T': T, 'ctaStart': cta_start, 'total': total, 'trHalf': 0.3, 'title': spec['title'], 'durReal': real,
          'voice': {'intro': 0.35, **{f's{i:02d}': T[i - 1] + 0.05 for i in range(1, n + 1)}, 'cta': cta_voice},
          'styles': sids, 'styleIds': [STYLES[s]['id'] for s in sids], 'names': [it['name'] for it in items], 'tags': [it.get('tag', '') for it in items],
          'obs': [round(T[i] + 0.35, 3) for i in range(n)], 'obsKind': [int(it.get('obstacle', i)) % 8 for i, it in enumerate(items)], 'tr': tr,
          'caps': caps, 'music': music, 'itemSfx': [it.get('sfx', []) for it in items],
          'cta': {k: c[k] for k in ('head1', 'head2', 'mid', 'button', 'sub', 'footer')}}
    for k, v in tl['cta'].items():
        if k != 'sub' and not str(v).strip():
            sys.exit(f"cta.{k} kosong di spec.json")
    copy_engine(work)
    json.dump(tl, open(os.path.join(work, 'timeline.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    # naskah untuk suara: lines.json (API) dan script_elevenlabs.txt (satu kali generate di situs, jeda 1,2 dtk antar baris)
    say = say_of(spec); ids = ids_of(spec)
    json.dump([{'id': k, 'say': say[k]} for k in ids], open(os.path.join(work, 'lines.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    body = ' <break time="1.2s" />\n'.join(re.sub(r'\s+', ' ', say[k]).strip() for k in ids)
    open(os.path.join(work, 'script_elevenlabs.txt'), 'w', encoding='utf-8').write(body + '\n')
    mode = 'durasi suara asli' if real else 'durasi PERKIRAAN (belum ada rekaman suara)'
    print(f'ok {n} poin | {mode} | total {total}s | CTA mulai {cta_start}s | style: ' + ', '.join(STYLES[s]['id'] for s in dict.fromkeys(sids)))


if __name__ == '__main__':
    main(sys.argv[1])
