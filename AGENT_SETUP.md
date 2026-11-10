# AGENT_SETUP.md: baca sekali, lalu pasang SEMUANYA dalam satu putaran

Kamu AI agent (Claude Code atau sejenis). User ingin membuat video motion dengan `/motion-style <style> <topik>`. Tujuan setup: **setelah ini user tidak pernah ditanya soal pemasangan lagi**. Semua pertanyaan di awal, semua pemasangan sekali jalan, lalu uji.

## Cara bicara (ketat)
- Bahasa user. **Poin pendek**, kata sederhana, tanpa istilah teknis kecuali diminta.
- Maksimal 5 poin per pesan.
- **Jangan minta kunci API di chat.** User mengisinya sendiri di file `.env`.
- Jangan commit atau mengunggah apa pun.

## Langkah 1. SATU kelompok pertanyaan di depan (jangan bertanya lagi sesudahnya)
Tanyakan sekaligus (pilihan ★ = rekomendasi, "ok" = ambil semua ★):
1. **Izin memasang semuanya** (satu "ya" untuk semua): ★ ya, pasang kit, pustaka style, paket render, suara Indonesia gratis, musik (total sekitar 1-2 GB, beberapa menit) / tidak.
2. Suara narasi bawaan: ★ suara Indonesia gratis (Microsoft, perlu internet) / ElevenLabs lewat situs / punya kunci API ElevenLabs atau Cartesia / tanpa suara.
3. Foto dan video asli dari Pixabay: ★ tidak dulu / ya, saya punya kunci (isi `PIXABAY_API_KEY` di `.env`, bukan di chat).
4. Handle sosmed untuk tombol ajakan: ★ lewati / isi handle (`{"handle": "@..."}` ke `config.json` di folder kit).

Jawaban dipakai seterusnya; jangan tanya ulang di langkah mana pun.

## Langkah 2. Pasang semuanya sekali jalan
- Lokasi kit: `~/.motion-style-kit` (Windows: `%USERPROFILE%\.motion-style-kit`). Jangan menulis ke folder tempat user berada.
- Belum ada: `git clone <link repo ini> ~/.motion-style-kit` (publik). Sudah ada: `git -C ~/.motion-style-kit pull`.
- Node.js, ffmpeg, atau Git belum ada: pasang dulu (Windows: `winget install OpenJS.NodeJS.LTS`, `winget install Gyan.FFmpeg`, `winget install Git.Git`).
- Dari folder kit jalankan **satu perintah**: `python tools/kit.py ready`. Ini memasang berurutan: lingkungan kit + browser headless, pustaka lemo-opuscar, paket render, paket suara dan musik lemo, suara Indonesia gratis (edge-tts). Hasil akhirnya `doctor`.
- Kalau user memilih ElevenLabs lewat situs: tambah `pip install -r requirements-voice.txt` di `.venv` kit.
- Kalau user memilih kunci API: katakan "salin `.env.example` jadi `.env` di folder kit, isi sendiri, bilang 'sudah'". Cek dengan `doctor`, jangan tampilkan isinya.
- Kalau ada langkah gagal: baca error, perbaiki, jalankan `ready` lagi (aman diulang). Jangan kembali ke user kecuali butuh sesuatu yang hanya user punya.

## Langkah 3. Pasang perintah
- `python tools/kit.py install-skill` (menulis `~/.claude/skills/motion-style/` dan `motion-style-list/`). Untuk agen lain: `install-skill <folder skills agen itu>`.

## Langkah 4. Uji sampai ujung (sekali, supaya video pertama user tidak gagal)
- `python tools/kit.py find pixel` harus menampilkan style.
- Uji suara: tulis dua kalimat ke folder uji `lines.json`, buat lewat `core/tts/tts_zh.py` lemo; harus keluar `voices/*.wav`.
- Uji gambar: `python tools/kit.py new uji`, salin `examples/20-style/spec.json`, `build`, `shots <folder> 12 41`; pastikan ada gambar.
- Jangan render penuh sekarang. Hapus folder uji.

## Langkah 5. Pesan akhir (poin-poin)
- Sudah siap, tidak akan ada pertanyaan pemasangan lagi. Ketik `/motion-style <style> <topik>` dari folder mana pun (buka sesi baru kalau perintahnya belum muncul). Lihat semua style: `/motion-style-list`.
- Contoh: `/motion-style kertas 5 tips hemat jajan`. 66 style (nomor 1-66), boleh nama atau nomor, boleh dikosongkan.
- Hasil tersimpan di `~/Videos/video-style/<nama>/` (path lengkap disebut tiap selesai).
- Satu video 45 detik butuh beberapa menit render. Versi potret 9:16 tersedia.
- Minyam hanya dipakai di video demo. Kualitas tiap style beda; lihat `/motion-style-list`.
- Tip model: untuk membuat video, sarankan user memakai model kuat (Sonnet atau Opus), bukan model kecil seperti Haiku; model kecil sering melewati penyutradaraan dan hasilnya jelek.
- Tip izin: kalau Claude Code terlalu sering meminta izin, user bisa mengizinkan perintah `python`, `node`, `ffmpeg` untuk folder `~/.motion-style-kit` dan `~/lemo-opuscar` lewat `/permissions` (kamu tidak mengubah izin sendiri).

## Kalau gagal
- `skill/guides/kualitas.md` punya tabel kegagalan umum. Menjalankan ulang `ready` aman.
