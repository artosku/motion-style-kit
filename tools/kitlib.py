"""Fungsi bersama: lokasi folder, baca spec.json, pilih style, durasi narasi."""
import json, os, re, sys

KIT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
ASSETS = os.path.join(KIT, 'assets')
CATALOG = json.load(open(os.path.join(ASSETS, 'catalog.json'), encoding='utf-8'))
STYLES = list(CATALOG['styles'])
for _f in sorted(os.listdir(ASSETS)):                  # paket style tambahan: catalog_*.json (nomor 21 dst.)
    if _f.startswith('catalog_') and _f.endswith('.json'):
        STYLES += json.load(open(os.path.join(ASSETS, _f), encoding='utf-8'))['styles']
NS = len(STYLES)


def home_videos():
    """Folder hasil bawaan: ~/Videos/video-style (bisa diganti lewat env VIDEO_STYLE_OUT)."""
    return os.environ.get('VIDEO_STYLE_OUT') or os.path.join(os.path.expanduser('~'), 'Videos', 'video-style')


def norm(s):
    return re.sub(r'[^a-z0-9]', '', str(s).lower())


def find_style(name):
    """Terima id, nama, nomor 1-20, atau sebutan umum ('kertas', 'lego'); balikkan indeks 0-19 atau None."""
    if isinstance(name, int):
        return name - 1 if 1 <= name <= NS else None
    key = norm(name)
    if key.isdigit() and 1 <= int(key) <= NS:
        return int(key) - 1
    for i, s in enumerate(STYLES):
        if key in (norm(s['id']), norm(s['name'])) or key in [norm(a) for a in s['aliases']]:
            return i
    for i, s in enumerate(STYLES):                     # cocokkan sebagian ('paper' -> Red Paper-cut)
        if key and (key in norm(s['name']) or any(key in norm(a) for a in s['aliases'])):
            return i
    return None


def resolve_styles(spec, n):
    """Daftar indeks style (0-19) untuk n poin. style: satu nama | 'campur' | daftar nama; item.style menimpa."""
    st = spec.get('style', 'campur')
    if isinstance(st, str) and norm(st) in ('campur', 'mix', 'semua', 'all', ''):
        base = [round(i * 20 / n) % 20 for i in range(n)] if n < 20 else [i % 20 for i in range(n)]
    else:
        names = st if isinstance(st, list) else [st]
        idx = []
        for nm in names:
            i = find_style(nm)
            if i is None:
                sys.exit(f"Style '{nm}' tidak dikenali. Pilihan: " + ', '.join(s['id'] for s in STYLES))
            idx.append(i)
        base = [idx[i % len(idx)] for i in range(n)]
    out = []
    for i, it in enumerate(spec['items']):
        if it.get('style') is not None:
            j = find_style(it['style'])
            if j is None:
                sys.exit(f"Style '{it['style']}' (poin {i + 1}) tidak dikenali.")
            out.append(j)
        else:
            out.append(base[i])
    return out


def load_spec(work):
    p = os.path.join(work, 'spec.json')
    if not os.path.exists(p):
        sys.exit(f'Tidak ada {p}. Buat spec.json dulu.')
    spec = json.load(open(p, encoding='utf-8'))
    n = len(spec.get('items', []))
    if not 1 <= n <= 30:
        sys.exit(f'Jumlah poin harus 1-30 (sekarang {n}).')
    return spec


def ids_of(spec):
    return ['intro'] + [f's{i:02d}' for i in range(1, len(spec['items']) + 1)] + ['cta']


def say_of(spec):
    """Kalimat yang dibacakan per id (urutan intro, poin, cta)."""
    out = {'intro': spec['intro'].get('say') or spec['intro']['text']}
    for i, it in enumerate(spec['items'], 1):
        out[f's{i:02d}'] = it.get('say') or f"{it.get('name_say') or it['name']}. {it.get('tag', '')}".strip()
    out['cta'] = spec['cta']['say']
    return out


def est_dur(text):
    """Perkiraan durasi baca (detik) kalau belum ada rekaman: sekitar 14 huruf per detik."""
    return round(0.4 + len(re.sub(r'<[^>]+>|\s+', ' ', text)) / 14.0, 3)


def load_durs(work, spec):
    p = os.path.join(work, 'voices', 'dur.json')
    real = json.load(open(p)) if os.path.exists(p) else {}
    say = say_of(spec)
    return {k: real.get(k) or est_dur(v) for k, v in say.items()}, bool(real)


def run_py_in_venv():
    """Pakai python di .venv kit kalau ada (dipanggil di awal kit.py)."""
    sub = 'Scripts' if os.name == 'nt' else 'bin'
    exe = os.path.join(KIT, '.venv', sub, 'python.exe' if os.name == 'nt' else 'python')
    if os.path.exists(exe) and os.path.normcase(os.path.abspath(sys.executable)) != os.path.normcase(os.path.abspath(exe)):
        import subprocess
        sys.exit(subprocess.call([exe] + sys.argv))


def load_env():
    """Baca .env di folder kit (kunci API ditaruh user sendiri di sana; tidak pernah dicetak)."""
    p = os.path.join(KIT, '.env')
    if os.path.exists(p):
        for ln in open(p, encoding='utf-8'):
            ln = ln.strip()
            if ln and not ln.startswith('#') and '=' in ln:
                k, v = ln.split('=', 1); os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def script_of(work):
    """(ids, say, lang) untuk suara. Proyek lama: spec.json. Proyek bebas (lemo-opuscar): lines.json = [{"id","text","lang"?}, ...]."""
    if os.path.exists(os.path.join(work, 'spec.json')):
        spec = load_spec(work); return ids_of(spec), say_of(spec), spec.get('lang', 'id')
    p = os.path.join(work, 'lines.json')
    if not os.path.exists(p):
        sys.exit(f'Tidak ada spec.json atau lines.json di {work}.')
    L = json.load(open(p, encoding='utf-8'))
    return [x['id'] for x in L], {x['id']: x['text'] for x in L}, (L[0].get('lang') or 'id')[:2]


def lemo_find(text):
    """Cocokkan sebutan user (nomor 1-66, id, nama, sebutan umum) ke style lemo-opuscar. Balikkan daftar {n, slug, name, cat} (paling cocok dulu)."""
    L = json.load(open(os.path.join(ASSETS, 'lemo-styles.json'), encoding='utf-8'))
    by = {norm(x['name']): x for x in L}
    alt = {'pixelrpg16bit': '16-bit Pixel RPG', 'rubberhosecartoon': '1930s Rubber Hose Cartoon', 'lowpolyisland': 'Low-poly Isometric Island'}
    def lemo_of(s):
        k = norm(s['name']); k = norm(alt[k]) if k in alt else k; return by.get(k) or next((x for x in L if norm(x['name']).startswith(k) or k.startswith(norm(x['name']))), None)
    key = norm(text); out = []
    for s in STYLES:
        x = lemo_of(s)
        if not x: continue
        al = [norm(a) for a in s['aliases']]
        sc = 3 if key in (str(s['n']), norm(s['id']), norm(s['name']), norm(x['slug'])) or key in al else (1 if key and (key in norm(s['name']) or any(key in a for a in al) or key in norm(x['slug'])) else 0)
        if sc: out.append((sc, {'n': s['n'], 'slug': x['slug'], 'name': s['name'], 'cat': x['cat'], 'tagline': s['tagline']}))
    out.sort(key=lambda o: -o[0]); return [o[1] for o in out]
