# Suara narasi

## Jalur utama: video bebas (lemo-opuscar)
Video **tetap jadi tanpa suara** (musik, efek, teks di layar). Suara itu pilihan. Naskah ditulis ke `<proyek>/lines.json`: `[{"id":"s01","text":"...","lang":"id"}, ...]` (satu id per ucapan; angka dieja di `say`, ditulis angka di teks layar). Hasil semua jalur sama: `<proyek>/voices/<id>.wav` + `dur.json`, yang dipakai timeline film.

| Jalur | Kapan | Langkah |
|---|---|---|
| **1. Suara Indonesia gratis (edge-tts Microsoft)** ★ | tidak punya akun apa pun; perlu internet | pasang `edge-tts` ke venv lemo (kecil; izin dulu): `uv pip install --python "$LIB/.venv/Scripts/python.exe" edge-tts` (Windows) atau `"$LIB/.venv/bin/python" -m pip install edge-tts`. Isi `"voice":"id-ID-ArdiNeural"` (pria) atau `"id-ID-GadisNeural"` (wanita) per baris, lalu `cd "$LIB" && .venv/bin/python core/tts/tts_zh.py <proyek>/lines.json <proyek>/voices` |
| **2. API** | `.env` kit berisi kunci + ID suara (`kit.py doctor`, baris "suara lewat API siap") | `python "{{KIT}}/tools/kit.py" vo <proyek> elevenlabs` atau `cartesia` |
| **3. Situs ElevenLabs** | punya akun, belum punya kunci API | `kit.py vo <proyek> script` menulis `<proyek>/script_elevenlabs.txt`; ikuti bagian B di bawah (generate satu kali, taruh di `<proyek>/voices_el/semua.mp3`), lalu `kit.py vo <proyek> ingest` |
| **4. Tanpa suara** | tidak mau | lewati; timeline memakai durasi perkiraan |

- Jangan meminta kunci API di chat: salin `.env.example` jadi `.env` di folder kit, user mengisi sendiri.
- Periksa ketentuan lisensi: layanan Microsoft (edge-tts) dan ElevenLabs/Cartesia; video komersial perlu dicek user. Katakan jujur bahwa kamu tidak bisa mendengar hasilnya.
- Suara Indonesia terdengar wajar di edge-tts, tapi tetap suruh user mendengarkan sebelum memposting; baris yang salah baca bisa diganti dengan menulis ulang ejaannya (misal nama asing).

---
## Jalur demo Minyam (spec.json)

Video **tetap jadi tanpa suara** (musik, efek, dan teks di layar). Suara itu pilihan. Tanya user sekali, lalu ikuti jalur yang dipilih.

## Pilih jalur (cek dulu `python "{{KIT}}/tools/kit.py" doctor`, baris "suara lewat API siap")
| Jalur | Kapan | Langkah |
|---|---|---|
| **A. Lewat API** | `.env` sudah berisi kunci + ID suara | `kit.py voice <folder> cartesia` atau `elevenlabs`, lalu `build` ulang |
| **B. Generate di situs ElevenLabs** (paling banyak dipakai) | user punya akun ElevenLabs, belum punya kunci API | lihat bagian B |
| **C. Tanpa suara** | user tidak mau/ tidak punya akun | lanjut tanpa langkah suara. Durasi diperkirakan dari panjang teks |

Jangan pernah meminta kunci API di chat. Katakan: salin `.env.example` jadi `.env` di folder kit, isi sendiri, lalu bilang "sudah". Suara perpustakaan ElevenLabs lewat API butuh paket berbayar, dan di paket gratis suara bawaannya beraksen Amerika. Untuk bahasa Indonesia, **jangan pakai suara beraksen asing**.

## B. Lewat situs ElevenLabs
1. Setelah `build`, naskah ada di `<folder>/script_elevenlabs.txt`. Satu baris per ucapan (intro, tiap poin, CTA), diselingi `<break time="1.2s" />`.
2. Beri user petunjuk pendek (poin-poin):
   - Buka elevenlabs.io, menu Text to Speech.
   - Model **Multilingual v2**, pilih suara **berbahasa Indonesia** (bukan suara bule).
   - Stability sekitar **40**, ekspresi sedang.
   - **Tempel seluruh isi naskah, generate satu kali** (bukan satu-satu), unduh MP3.
3. Minta user menyebut path file MP3-nya. Simpan/salin ke `<folder>/voices_el/semua.mp3`.
4. Jalankan `kit.py ingest <folder>`. Skrip memotong per baris dengan Whisper (butuh `pip install -r requirements-voice.txt` sekali), memotong di titik paling hening, memberi fade 25 ms, dan menulis `voices/dur.json`.
5. Jalankan `build` ulang (jadwal memakai durasi suara asli), lalu `mix`, `render`, `mux`, `check --whisper`.
6. Satu baris jelek (salah baca, nama asing aneh)? Generate ulang **hanya baris itu** di situs, simpan sebagai `<folder>/voices_el/s03.mp3` (nomor poin dua digit; `intro`, `cta` untuk dua lainnya). `ingest` memakainya menggantikan potongan.

## Kualitas
- `check` mencetak "ujung suara: semua bersih". Kalau "MUNGKIN TERPOTONG", generate ulang baris itu.
- `check --whisper` mencetak kata pertama tiap baris di waktunya. Whisper kadang salah dengar nama asing; itu bukan berarti suara salah. Dengarkan sendiri kalau ragu, dan jujur ke user bahwa kamu tidak bisa mendengar hasilnya.
- Lisensi: periksa ketentuan paket ElevenLabs/Cartesia user (atribusi, pemakaian komersial) dan lisensi suara pilihan. Video untuk promosi Artosku bisa dianggap komersial.
