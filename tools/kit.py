"""Pintu masuk semua perintah.   python tools/kit.py <perintah> [folder] [opsi]
Perintah: doctor | setup | install-skill | styles [--lemo] | find <teks> | lemo [deps [voice] [music]] | vo <proyek> script|ingest|cartesia|elevenlabs | new <slug>
Jalur demo Minyam: build | voice | ingest | mix | render | mux | check | shots | all"""
import os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kitlib import KIT, STYLES, home_videos, load_spec, run_py_in_venv

if sys.argv[1:2] not in (['setup'], ['doctor']):
    run_py_in_venv()
T = os.path.join(KIT, 'tools')
WIN = os.name == 'nt'


def sh(cmd, **kw):
    r = subprocess.run(cmd, **kw)
    if r.returncode:
        sys.exit(r.returncode)


def py(script, *args):
    sh([sys.executable, os.path.join(T, script), *map(str, args)])


def doctor():
    bad = []

    def chk(name, ok, fix):
        print(('  OK     ' if ok else '  GAGAL  ') + name + ('' if ok else '   -> ' + fix))
        if not ok:
            bad.append(name)
    node = shutil.which('node'); nv = 0
    if node:
        try:
            nv = int(subprocess.run([node, '-v'], capture_output=True, text=True).stdout.strip().lstrip('v').split('.')[0])
        except Exception:
            pass
    chk('Node.js 20 ke atas', nv >= 20, 'pasang Node.js dari nodejs.org')
    chk('ffmpeg dan ffprobe', bool(shutil.which('ffmpeg') and shutil.which('ffprobe')), 'pasang ffmpeg (Windows: winget install ffmpeg)')
    chk('sh (dipakai mux.sh)', bool(shutil.which('sh')), 'di Windows pasang Git for Windows (sudah termasuk sh)')
    mods = True
    try:
        import numpy, scipy, soundfile, PIL  # noqa
    except Exception:
        mods = False
    chk('paket Python (numpy, scipy, soundfile, Pillow)', mods, 'jalankan: python tools/kit.py setup')
    has_pw = os.path.isdir(os.path.join(KIT, 'node_modules', 'playwright-core'))
    chk('playwright-core', has_pw, 'jalankan: python tools/kit.py setup')
    if has_pw and node:
        code = "import('playwright-core').then(async m=>{const b=await m.chromium.launch();await b.close();console.log('ok')}).catch(e=>console.log('gagal'))"
        r = subprocess.run([node, '--input-type=module', '-e', code], cwd=KIT, capture_output=True, text=True)
        chk('browser headless (Chromium)', 'ok' in r.stdout, 'jalankan: python tools/kit.py setup')
    try:
        import faster_whisper  # noqa
    except Exception:
        print('  (opsional) faster-whisper belum ada. Hanya perlu untuk memotong rekaman ElevenLabs dari situs dan cek --whisper: pip install -r requirements-voice.txt')
    from kitlib import load_env
    load_env(); prov = [n for n, a_, b_ in (('cartesia', 'CARTESIA_API_KEY', 'CARTESIA_VOICE_ID'), ('elevenlabs', 'ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID')) if os.environ.get(a_) and os.environ.get(b_)]
    print('  suara lewat API siap:', ', '.join(prov) if prov else 'belum ada (boleh: suara lewat situs ElevenLabs, atau tanpa suara)')
    print('SIAP' if not bad else 'BELUM SIAP: ' + ', '.join(bad))
    return not bad


def setup():
    vp = os.path.join(KIT, '.venv')
    if not os.path.exists(vp):
        sh([sys.executable, '-m', 'venv', vp])
    pyx = os.path.join(vp, 'Scripts' if WIN else 'bin', 'python.exe' if WIN else 'python')
    sh([pyx, '-m', 'pip', 'install', '-q', '-r', os.path.join(KIT, 'requirements.txt')])
    sh(['npm', 'install', '--no-audit', '--no-fund'], cwd=KIT, shell=WIN)
    sh(['node', os.path.join('node_modules', 'playwright-core', 'cli.js'), 'install', 'chromium-headless-shell'], cwd=KIT)
    print('setup selesai. Cek: python tools/kit.py doctor')


def render(w, workers=4, portrait=False):
    extra = ['--q', 'layout=portrait', '--size', '1080x1920'] if portrait else []
    sh(['node', os.path.join(KIT, 'render', 'video.mjs'), w, '--fps', '24', '--workers', str(workers), '--out', os.path.join(w, 'out', 'video-portrait.mp4' if portrait else 'video.mp4'), *extra])


def mux(w, portrait=False):
    slug = load_spec(w).get('slug', 'video'); out = os.path.join(w, slug + ('-portrait' if portrait else '') + '.mp4')
    sh(['sh', os.path.join(KIT, 'render', 'mux.sh'), os.path.join(w, 'out', 'video-portrait.mp4' if portrait else 'video.mp4'), os.path.join(w, 'out', 'mix.wav'), out, '24', '0'])
    print('VIDEO:', out)


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__); return
    c, rest = a[0], a[1:]
    w = os.path.abspath(rest[0]) if rest and c not in ('styles', 'doctor', 'setup', 'new', 'find', 'lemo', 'vo', 'install-skill') else None
    if c == 'doctor': sys.exit(0 if doctor() else 1)
    elif c == 'setup': setup()
    elif c == 'install-skill': py('install_skill.py', *rest)
    elif c == 'find':
        from kitlib import lemo_find
        r = lemo_find(' '.join(rest))
        if not r: print('tidak ketemu; lihat: python tools/kit.py styles')
        for x in r[:5]: print(f"{x['n']:2d}. {x['slug']:22s} {x['name']} [{x['cat']}] {x['tagline']}")
    elif c == 'lemo':
        sh(['sh', os.path.join(T, 'lemo-setup.sh'), *rest])
    elif c == 'vo': py('vo.py', *rest)
    elif c == 'styles' and '--lemo' in rest:
        import json
        L = json.load(open(os.path.join(KIT, 'assets', 'lemo-styles.json'), encoding='utf-8')); cat = None
        for s in L:
            if s['cat'] != cat: cat = s['cat']; print(); print(f"## {cat}")
            print(f"- {s['name']} ({s['slug']}): {', '.join(s['uses'])}")
    elif c == 'styles':
        for s in STYLES:
            print(f"{s['n']:2d}. {s['id']:11s} {s['name']:24s} {s['tagline']}")
    elif c == 'new':
        d = os.path.join(home_videos(), rest[0]); os.makedirs(d, exist_ok=True); print(d)
    elif c == 'build': py('build.py', w)
    elif c == 'voice': py('voice.py', w, *rest[1:])
    elif c == 'ingest': py('ingest.py', w)
    elif c == 'mix': py('mix.py', w)
    elif c == 'render':
        nums = [x for x in rest[1:] if x.isdigit()]; render(w, int(nums[0]) if nums else 4, '--portrait' in rest)
    elif c == 'mux': mux(w, '--portrait' in rest)
    elif c == 'check': py('check.py', w, *rest[1:])
    elif c == 'shots':
        pt = '--portrait' in rest
        if pt: os.environ['LAYOUT'] = 'portrait'
        sh(['node', os.path.join(KIT, 'render', 'shot.mjs'), w, os.path.join(w, 'out', 'shots-portrait' if pt else 'shots'), *[x for x in rest[1:] if x != '--portrait']])
    elif c == 'all':
        py('build.py', w); py('mix.py', w); render(w); mux(w); py('check.py', w)
    else:
        sys.exit('perintah tidak dikenal: ' + c + '\n' + __doc__)


main()
