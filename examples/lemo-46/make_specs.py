"""Buat spec.json untuk 3 video lemo-46 dari katalog + naskah ElevenLabs.
   python examples/lemo-46/make_specs.py   -> folder kerja ~/Videos/video-style/lemo-v2, lemo-v3, lemo-v4
Naskah (script_elevenlabs_videoN.txt) = sumber 'say'. Baris pertama = intro, terakhir = CTA."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.normpath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(KIT, 'tools'))
from kitlib import STYLES, home_videos

PLAN = {2: (21, 40, 'Dua puluh style', '20 Style Video Motion #2', 'ceria'),
        3: (41, 60, 'Dua puluh style', '20 Style Video Motion #3', 'ceria'),
        4: (61, 66, 'Enam style', '6 Style Video Motion #4', 'ceria')}
for v, (a, b, _, title, mood) in PLAN.items():
    lines = [re.sub(r'<[^>]+>', '', l).strip() for l in open(os.path.join(HERE, f'script_elevenlabs_video{v}.txt'), encoding='utf-8').read().splitlines() if l.strip()]
    sts = [s for s in STYLES if a <= s['n'] <= b]
    assert len(lines) == len(sts) + 2, (v, len(lines), len(sts))
    n = len(sts)
    items = [{'name': s['name'], 'tag': s['tagline'], 'say': lines[i + 1], 'obstacle': i % 8, 'style': s['id']} for i, s in enumerate(sts)]
    spec = {'slug': f'lemo-v{v}', 'title': title, 'lang': 'id', 'style': [s['id'] for s in sts], 'mood': mood,
            'intro': {'text': f'{n} style video motion lagi', 'say': lines[0]},
            'cta': {'say': lines[-1], 'head1': 'Style favoritmu', 'head2': 'nomor berapa?', 'mid': 'Tulis di komentar.', 'button': 'Follow Artosku',
                    'sub': 'Biar Minyam terus jatuh ke style yang baru.', 'footer': 'Catat keuanganmu bareng Minyam'},
            'items': items}
    d = os.path.join(home_videos(), f'lemo-v{v}'); os.makedirs(os.path.join(d, 'voices_el'), exist_ok=True)
    json.dump(spec, open(os.path.join(d, 'spec.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('ok', d)
