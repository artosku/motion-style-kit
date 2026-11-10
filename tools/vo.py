"""Suara untuk proyek bebas (lemo-opuscar): <proyek>/lines.json = [{"id":"s01","text":"...","lang":"id"}, ...]
   python tools/kit.py vo <proyek> script            -> tulis script_elevenlabs.txt (satu baris per id) untuk jalur situs ElevenLabs
   python tools/kit.py vo <proyek> ingest            -> potong voices_el/semua.mp3 jadi voices/<id>.wav + dur.json (format sama dengan tts lemo)
   python tools/kit.py vo <proyek> cartesia|elevenlabs [id,id]   -> lewat API (kunci di .env kit)"""
import os, sys, subprocess
from kitlib import script_of, KIT
w, mode = os.path.abspath(sys.argv[1]), sys.argv[2]
T = os.path.join(KIT, 'tools')
if mode == 'script':
    ids, say, _ = script_of(w)
    open(os.path.join(w, 'script_elevenlabs.txt'), 'w', encoding='utf-8').write('\n'.join(say[i] for i in ids) + '\n')
    os.makedirs(os.path.join(w, 'voices_el'), exist_ok=True)
    print('naskah:', os.path.join(w, 'script_elevenlabs.txt'), '| taruh rekaman di', os.path.join(w, 'voices_el', 'semua.mp3'))
elif mode == 'ingest':
    sys.exit(subprocess.call([sys.executable, os.path.join(T, 'ingest.py'), w]))
else:
    sys.exit(subprocess.call([sys.executable, os.path.join(T, 'voice.py'), w, mode, *sys.argv[3:]]))
