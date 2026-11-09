"""Suara narasi lewat API -> <folder>/voices/<id>.wav + dur.json.
   python tools/kit.py voice <folder> cartesia|elevenlabs [id1,id2,...]     (id kosong = semua baris)
Kunci ada di .env kit: CARTESIA_API_KEY + CARTESIA_VOICE_ID, atau ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID."""
import io, json, os, sys, urllib.error, urllib.request
import numpy as np, soundfile as sf
from kitlib import load_env, load_spec, say_of, ids_of

LANG = {'id': 'id', 'en': 'en', 'ms': 'ms', 'ja': 'ja', 'ko': 'ko', 'es': 'es', 'fr': 'fr', 'de': 'de', 'pt': 'pt', 'hi': 'hi', 'zh': 'zh'}


def trim(x, sr, thr=0.006, pad=0.03):
    m = np.abs(x) if x.ndim == 1 else np.abs(x).max(axis=1); idx = np.where(m > thr)[0]
    return x[max(0, idx[0] - int(pad * sr)):min(len(x), idx[-1] + int(pad * sr))] if len(idx) else x


def need(*names):
    miss = [n for n in names if not os.environ.get(n)]
    if miss:
        sys.exit('Belum diisi di file .env kit: ' + ', '.join(miss) + '\n(Isi sendiri di file .env, jangan kirim ke chat.)')


def cartesia(text, lang, first):
    body = {'model_id': 'sonic-3', 'transcript': text, 'voice': {'mode': 'id', 'id': os.environ['CARTESIA_VOICE_ID']}, 'language': LANG.get(lang, lang),
            'output_format': {'container': 'wav', 'encoding': 'pcm_s16le', 'sample_rate': 44100},
            'generation_config': {'speed': 1.0 if first else 1.05, 'emotion': 'content' if first else 'enthusiastic'}}
    def post(b):
        rq = urllib.request.Request('https://api.cartesia.ai/tts/bytes', json.dumps(b).encode(),
                                    {'X-API-Key': os.environ['CARTESIA_API_KEY'], 'Cartesia-Version': '2025-04-16', 'Content-Type': 'application/json'})
        with urllib.request.urlopen(rq, timeout=90) as r: return r.read()
    try: return post(body)
    except urllib.error.HTTPError:
        body['generation_config'].pop('emotion'); return post(body)


def elevenlabs(text, lang, first):
    body = {'text': text, 'model_id': 'eleven_multilingual_v2', 'voice_settings': {'stability': .42, 'similarity_boost': .8, 'style': .45, 'use_speaker_boost': True}}
    rq = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{os.environ['ELEVENLABS_VOICE_ID']}?output_format=mp3_44100_128", json.dumps(body).encode(),
                                {'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(rq, timeout=90) as r: return r.read()
    except urllib.error.HTTPError as e:
        hint = {401: 'kunci API salah', 402: 'suara perpustakaan butuh paket berbayar (atau pakai jalur "web": generate di situs ElevenLabs)', 403: 'paket tidak mengizinkan fitur ini'}.get(e.code, '')
        sys.exit(f'ElevenLabs menolak (HTTP {e.code}): {hint}')


def main(work, provider, only=None):
    load_env(); spec = load_spec(work); lang = spec.get('lang', 'id'); say = say_of(spec)
    if provider == 'cartesia': need('CARTESIA_API_KEY', 'CARTESIA_VOICE_ID'); fn = cartesia
    elif provider == 'elevenlabs': need('ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID'); fn = elevenlabs
    else: sys.exit('provider harus cartesia atau elevenlabs')
    out = os.path.join(work, 'voices'); os.makedirs(out, exist_ok=True)
    dp = os.path.join(out, 'dur.json'); dur = json.load(open(dp)) if os.path.exists(dp) else {}
    for k in ids_of(spec):
        if only and k not in only: continue
        raw = fn(say[k], lang, k == 'intro'); tmp = os.path.join(out, k + '.tmp')
        open(tmp, 'wb').write(raw); x, sr = sf.read(tmp); os.remove(tmp); x = trim(x, sr)
        sf.write(os.path.join(out, k + '.wav'), x, sr, subtype='PCM_16'); dur[k] = round(len(x) / sr, 3); print(k, dur[k], say[k][:50])
    json.dump(dur, open(dp, 'w'), indent=1)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3].split(',') if len(sys.argv) > 3 else None)
