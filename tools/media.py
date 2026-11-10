"""Cari dan unduh foto atau video dari Pixabay ke folder proyek (hanya kalau user minta dan punya kunci API sendiri).
   python tools/kit.py media <proyek> <kata kunci> [--video] [--n 3] [--vertical|--horizontal] [--lang id] [--list]
Kunci: PIXABAY_API_KEY (variabel lingkungan atau file .env di folder kit). Tidak pernah dicetak.
Hasil: <proyek>/media/pixabay-<id>.jpg|mp4, daftar di media/media.json, dan baris kredit di media/CREDITS.md.
--list = hanya tampilkan hasil (tanpa mengunduh). Pixabay: lisensi Pixabay Content License (boleh komersial, tanpa wajib atribusi; jangan
dipakai seolah orang di foto mendukung produkmu; jangan dijual tanpa diubah). Batas API: 100 permintaan per menit."""
import json, os, sys, time, urllib.error, urllib.parse, urllib.request
from kitlib import load_env

KEYS = ('PIXABAY_API_KEY', 'PIXABAY_KEY', 'PIXABAY_API')


def win_env(name):
    """Windows: variabel yang baru dibuat belum masuk ke terminal yang sudah terbuka; baca langsung dari pengaturan Windows."""
    if os.name != 'nt': return None
    import winreg
    for hive, sub in ((winreg.HKEY_CURRENT_USER, 'Environment'), (winreg.HKEY_LOCAL_MACHINE, r'SYSTEM\CurrentControlSet\Control\Session Manager\Environment')):
        try:
            with winreg.OpenKey(hive, sub) as k: return winreg.QueryValueEx(k, name)[0]
        except OSError: pass
    return None


def key():
    load_env()
    for k in KEYS:
        v = os.environ.get(k) or win_env(k)
        if v: return v
    sys.exit('Belum ada kunci Pixabay. Isi PIXABAY_API_KEY sebagai variabel lingkungan atau di file .env folder kit (jangan kirim ke chat). Kunci gratis: pixabay.com/api/docs/')


def get(url, binary=False, tries=4):
    rq = urllib.request.Request(url, headers={'User-Agent': 'motion-style-kit'})
    try:
        with urllib.request.urlopen(rq, timeout=90) as r: return r.read() if binary else json.load(r)
    except urllib.error.HTTPError as e:
        if e.code == 429 and tries > 1:                     # kena batas: tunggu sebentar lalu coba lagi
            time.sleep(8 * (5 - tries) + 6); return get(url, binary, tries - 1)
        sys.exit({400: 'Permintaan ditolak Pixabay (kata kunci atau kunci salah).', 429: 'Terlalu banyak permintaan ke Pixabay (maksimal 100 per menit). Tunggu semenit.'}.get(e.code, f'Pixabay menolak (HTTP {e.code}).'))
    except urllib.error.URLError as e:
        sys.exit(f'Tidak bisa menghubungi Pixabay: {e.reason}')


def main(a):
    if len(a) < 2: sys.exit(__doc__)
    work, words = os.path.abspath(a[0]), []; video = '--video' in a; lst = '--list' in a; n = 3; lang = 'id'; ori = 'all'; i = 1
    while i < len(a):
        if a[i] == '--n': n = int(a[i + 1]); i += 1
        elif a[i] == '--lang': lang = a[i + 1]; i += 1
        elif a[i] == '--vertical': ori = 'vertical'
        elif a[i] == '--horizontal': ori = 'horizontal'
        elif a[i] not in ('--video', '--list'): words.append(a[i])
        i += 1
    q = ' '.join(words)
    if not q: sys.exit('Tulis kata kunci pencarian.')
    p = {'key': key(), 'q': q, 'lang': lang, 'safesearch': 'true', 'per_page': max(3, min(n * 2, 50)), 'order': 'popular'}
    if video: url = 'https://pixabay.com/api/videos/?' + urllib.parse.urlencode(p)
    else: url = 'https://pixabay.com/api/?' + urllib.parse.urlencode({**p, 'image_type': 'photo', 'orientation': ori})
    hits = get(url).get('hits', [])[:n]
    if not hits: sys.exit(f'Tidak ada hasil untuk "{q}". Coba kata lain (bahasa Inggris sering lebih banyak hasilnya: --lang en).')
    out = os.path.join(work, 'media'); os.makedirs(out, exist_ok=True)
    mp = os.path.join(out, 'media.json'); man = json.load(open(mp, encoding='utf-8')) if os.path.exists(mp) else []
    for h in hits:
        if video:
            v = next((h['videos'][s] for s in ('medium', 'large', 'small') if h['videos'].get(s, {}).get('url')), None)
            if not v: continue
            src, ext, info = v['url'], 'mp4', f"{v['width']}x{v['height']}, {h.get('duration', '?')} detik"
        else:
            src, ext, info = h.get('largeImageURL') or h['webformatURL'], 'jpg', f"{h['imageWidth']}x{h['imageHeight']}"
        name = f"pixabay-{'v' if video else 'f'}{h['id']}.{ext}"; path = os.path.join(out, name)
        print(f"{name} | {info} | oleh {h['user']} | {h['tags']} | {h['pageURL']}")
        if lst: continue
        if not os.path.exists(path):
            data = get(src, True); open(path + '.part', 'wb').write(data); os.replace(path + '.part', path); time.sleep(1)
        if not any(m['file'] == name for m in man):
            man.append({'file': name, 'path': path, 'type': 'video' if video else 'photo', 'info': info, 'by': h['user'], 'page': h['pageURL'], 'tags': h['tags'], 'query': q, 'license': 'Pixabay Content License'})
    if lst: return
    json.dump(man, open(mp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(out, 'CREDITS.md'), 'w', encoding='utf-8').write('# Kredit bahan (Pixabay, Pixabay Content License)\n\n' + ''.join(f"- {m['file']}: oleh {m['by']}, {m['page']}\n" for m in man))
    print('tersimpan di', out)


main(sys.argv[1:])
