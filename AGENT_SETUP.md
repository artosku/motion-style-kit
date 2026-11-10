# AGENT_SETUP.md: baca sekali, lalu pasang semuanya untuk user

Kamu AI agent (Claude Code atau sejenis). User ingin membuat video motion dengan `/motion-style <style> <topik>`. Tugasmu: pasang kit sebagai alat, lalu buat perintah itu.

## Cara bicara (ketat)
- Bahasa user. **Poin pendek**, kata sederhana, tanpa istilah teknis kecuali diminta.
- Maksimal 5 poin per pesan: apa yang sudah dilakukan, lalu apa berikutnya.
- Pertanyaan satu kelompok (maksimal 4), pilihan bertanda ★. "ok" = ambil semua ★.
- **Jangan minta kunci API di chat.** User mengisinya sendiri di file `.env`.
- Tanya izin sebelum memasang software. Jangan commit atau mengunggah apa pun.

## Langkah 1. Pasang kit di satu folder tetap
- Lokasi: `~/.motion-style-kit` (Windows: `%USERPROFILE%\.motion-style-kit`). Jangan pakai atau tulis ke folder tempat user sedang berada.
- Belum ada: `git clone <link repo ini> ~/.motion-style-kit` (repo publik, tanpa login). Satu poin: "satu folder alat, folder kerjamu tidak disentuh".
- Sudah ada: `git -C ~/.motion-style-kit pull`.
- Dari sini semua perintah dijalankan dari folder itu.

## Langkah 2. Cek dan lengkapi mesin
- `python tools/kit.py doctor`. Kalau ada GAGAL: jelaskan satu poin, minta izin, lalu `python tools/kit.py setup` (membuat `.venv`, memasang paket, mengunduh browser headless, ukuran unduhan sekitar 100 MB). Ulangi sampai `SIAP`.
- Node.js, ffmpeg, atau Git yang belum ada: beri cara pasang untuk OS user (Windows: `winget install OpenJS.NodeJS.LTS`, `winget install Gyan.FFmpeg`, `winget install Git.Git`).

## Langkah 3. Satu kelompok pertanyaan
1. Suara narasi: ★ lewati dulu (video dengan musik dan teks) / saya punya akun ElevenLabs (generate di situsnya) / saya punya kunci API.
2. Handle sosmed untuk tombol ajakan: ★ lewati (tombol "Follow Artosku") / isi handle. Kalau diisi, tulis `{"handle": "@..."}` ke `config.json` di folder kit.
- Kalau memilih kunci API: katakan "salin `.env.example` jadi `.env` di folder kit, isi kuncinya sendiri, bilang 'sudah'". Cek dengan `doctor` (baris "suara lewat API siap"). Jangan tampilkan isinya.
- Foto/video asli (opsional, hanya kalau user minta): kunci Pixabay `PIXABAY_API_KEY` di `.env` atau variabel lingkungan; panduan `skill/guides/media.md`.
- Kalau memilih ElevenLabs di situs: pasang juga `pip install -r requirements-voice.txt` di `.venv` (izin dulu).

## Langkah 4. Pasang perintah
- `python tools/kit.py install-skill` (menulis `~/.claude/skills/motion-style/`). Untuk agen lain: `python tools/kit.py install-skill <folder skills agen itu>`, atau berikan folder `~/.claude/skills/motion-style/` ke user.

## Langkah 5. Uji cepat
- `python tools/kit.py new uji` (mencetak folder), salin `examples/20-style/spec.json` ke folder itu.
- `python tools/kit.py build <folder>`, lalu `python tools/kit.py shots <folder> 12 41`. Buka satu gambar dari `<folder>/out/shots/` dan pastikan ada daftar kiri + ayam kanan.
- Jangan render penuh sekarang.
- Pasang juga pustaka style: `python tools/kit.py lemo` (mengunduh lemo-opuscar ke `~/lemo-opuscar`), lalu `python tools/kit.py lemo deps` (izin dulu; beberapa menit). Uji: `python tools/kit.py find pixel` harus menampilkan style.

## Langkah 6. Pesan akhir (poin-poin)
- Sudah siap. Ketik `/motion-style <style> <topik>` dari folder mana pun (buka sesi baru kalau perintahnya belum muncul). Lihat semua style: `/motion-style-list`.
- Contoh: `/motion-style kertas 5 tips hemat jajan`. Ada 66 style (nomor 1-66); boleh sebut nama atau nomor. Style boleh dikosongkan, nanti ditawari pilihan.
- Hasil tersimpan di `~/Videos/video-style/<nama>/` (path lengkap disebut tiap selesai).
- Satu video 30 detik butuh sekitar 1-2 menit render.
- Mau versi potret 9:16 (TikTok/Reels, dengan area aman kanan dan bawah)? Tambahkan `--portrait` pada `render`, `mux`, dan `shots`.
- Minyam hanya dipakai di video demo. Batasan: kualitas tiap style beda-beda; lihat `/motion-style-list`.

## Kalau gagal
- `skill/guides/kualitas.md` punya tabel kegagalan umum. Menjalankan ulang setup aman.
