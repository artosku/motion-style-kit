---
name: motion-style
description: Membuat video motion apa saja (penjelasan, produk, cerita, berita, data) dalam satu dari 66 style gambar (cat air, pixel, papan tulis, kartun lawas, berita, infografik, dst.) lewat lemo-opuscar, lengkap dengan narasi, musik, efek suara, dan caption; 16:9 atau potret 9:16. Pakai saat user mengetik /motion-style atau minta video motion bergaya tertentu tentang sebuah topik.
argument-hint: "[style] <topik>   contoh: /motion-style cat air manfaat tidur cukup"
---

# /motion-style

Kamu menyutradarai dan membuat **video motion tentang topik user** dalam **satu style** dari koleksi lemo-opuscar. Videonya bebas: penjelasan, produk, cerita, berita, data, apa saja. Minyam (maskot) hanya dipakai sebagai demo style, bukan isi video.

Alat kita (pembungkus, hemat langkah): `{{KIT}}`. Perintah: `python "{{KIT}}/tools/kit.py" <perintah>`.
Pustaka style dan mesin render: **lemo-opuscar** (diunduh otomatis sekali ke `~/lemo-opuscar`, disebut `$LIB`).

Panduan di folder skill ini (`guides/`), baca hanya yang perlu:
- `guides/style.md`: tabel 66 style, cocok untuk apa, catatan jujur.
- `guides/suara.md`: narasi (jalur API dan jalur situs ElevenLabs).
- `guides/media.md`: foto dan video asli dari Pixabay (hanya kalau user minta).
- `guides/film-bebas.md`: standar mutu film bebas (pilih style, rencana gerak, potret). **Wajib dibaca.**
- `guides/minyam.md`: jalur demo Minyam (hanya kalau user minta demo "ayam jatuh").

## Cara bicara dengan user (wajib)
- Bahasa user (bawaan Indonesia). **Poin-poin pendek**, kata sederhana, tanpa istilah teknis (jangan sebut "render", "mux", "spec", nama file) kecuali diminta.
- Maksimal 5 poin per pesan: apa yang sudah dilakukan, lalu berikutnya.
- Pertanyaan **satu kali**, satu kelompok (maksimal 4), pilihan bertanda ★ = rekomendasi, "ok" = ambil semua ★. Setelah itu tidak bertanya lagi kecuali butuh keputusan.
- Selalu tulis **path lengkap** (mulai dari huruf drive) setiap menyebut file.
- Jangan minta kunci API di chat. Jangan mengunggah atau memposting apa pun.
- Jujur soal batasan: kamu tidak bisa mendengar audio; style yang lemah (kolom "Catatan jujur"); lisensi suara; fakta harus bersumber.

## Alur

**0. Siapkan alat (diam-diam, tanpa bertanya).** User sudah setuju saat setup.
- `kit.py doctor`. Kalau semua SIAP, lanjut. Kalau ada yang kurang: jalankan `kit.py ready` langsung (aman diulang), tanpa bertanya izin lagi, lalu `doctor` ulang.
- `kit.py lemo` mencetak `LIB=<path>`. Catat path itu. Jangan menawarkan pemasangan ulang paket yang sudah ada.

**1. Baca permintaan** (`$ARGUMENTS`).
- **Style:** `kit.py find <kata>` mengubah sebutan user (nomor 1-66, nama, "kertas", "8 bit", "kartun lawas") jadi style lemo; hasil pertama yang cocok. Ambigu: tawarkan dua atau tiga teratas.
- **Style kosong:** usulkan 3 style yang paling cocok dengan topik (lihat `guides/style.md`, tandai ★) dan bilang daftar lengkap ada di `/motion-style-list`.
- **Topik kosong:** tanya topiknya.

**2. Satu kelompok pertanyaan** (lewati yang sudah dijawab user):
1. Panjang: ★ 45 detik / 30 detik / 1-2 menit (makin panjang makin lama dan mahal).
2. Format: ★ 16:9 (YouTube) / 9:16 (TikTok, Reels; area kanan dan bawah dikosongkan untuk tombol dan caption) / keduanya.
3. Suara: ★ suara Indonesia gratis (Microsoft edge-tts, perlu internet) / ElevenLabs lewat situs / kunci API ElevenLabs atau Cartesia / tanpa suara (musik dan teks). Detail: `guides/suara.md`.
4. Bahan sendiri: logo, foto, rekaman suara, musik, data (boleh kosong). Style berbasis fakta (Evidence Films) butuh sumber yang bisa dipertanggungjawabkan.

**3. Sutradarai dan buat.** Ikuti pustaka lemo-opuscar, bukan kebiasaanmu sendiri.

Gerbang wajib (dari uji nyata: hasil jelek karena langkah ini dilewati):
- **G1. Baca SEMUA sampai habis, tanpa melewati:** `$LIB/AGENTS.md`, `$LIB/DIRECTOR.md`, `$LIB/TECHNIQUE.md`, `$LIB/styles/<slug>/STYLE.md`, **`$LIB/styles/<slug>/DEMO.md`** (contoh film style itu: pecahan adegan, waktu, tata letak, gerakan khas; dipakai sebagai patokan mutu dan kepadatan, BUKAN untuk ditiru cerita atau adegannya), dan `{{KIT}}/skill/guides/film-bebas.md`. Jangan mulai membangun sebelum selesai.
- **G2. Cek kecocokan style dan topik.** Tulis satu kalimat "kenapa style ini cocok". Style arsip atau bukti (Evidence, Visual Investigation, Newsreel, Caption News) hanya untuk peristiwa nyata yang punya arsip; untuk topik umum (tips, sains populer, gaya hidup) jangan dipaksakan: bilang ke user dan tawarkan 2 style yang lebih cocok. Kalau user tetap mau, lanjut tapi rancang ulang isinya supaya sesuai gaya.
- **G3. Rencana gerak per adegan** di TREATMENT.md: tiap adegan punya daftar elemen dan gerakannya (masuk, tengah, keluar), minimal satu elemen bergerak tiap detik, kedalaman lapisan (latar, tengah, depan bergerak beda kecepatan), transisi yang bervariasi, dan efek suara per adegan. Satu layar maksimal satu judul atau satu kalimat pendek; sisanya gambar.
- **G4. Look wajib.** Buat 2-3 frame contoh dengan kode gambar sungguhan, bandingkan dengan STYLE.md, perbaiki. Baru render penuh. Tidak boleh dilewati "karena buru-buru".
- **G5. Karakter dan ikon.** Isi video harus punya subjek yang digambar dalam gaya itu (karakter, benda, ikon), bukan hanya teks dan foto. Foto stok bukan latar mati: olah sesuai gaya (potong, beri bingkai, tekstur, gerak kamera pelan) atau jangan dipakai.
- **G6. Tonton dengan mata.** Sebelum menyerahkan, ambil minimal 1 frame per 2 detik (lembar kontak) dan cek: ada gerak, tidak penuh teks, tidak ada elemen di zona aman potret. Versi 1 yang statis wajib dibuang dan dibuat ulang.

Jalur: ini jalur lemo. Jalur Minyam (`kit.py build`, `guides/minyam.md`) hanya untuk demo "ayam jatuh"; jangan dicampur.

- Baca `$LIB/AGENTS.md` lalu `$LIB/styles/<slug>/STYLE.md` (slug dari `find`), lalu `$LIB/DIRECTOR.md` dan `$LIB/TECHNIQUE.md`. `STYLE.md` baku; cerita, struktur, adegan, dan data adalah milikmu, dari topik user (jangan membengkokkan topik ke demo).
- Urutan lemo: **TREATMENT.md** (tiga struktur, pilih satu) → **Look** (gambar contoh dengan kode gambar sungguhan, cek ke STYLE.md) → produksi (suara → musik → animasi → mix → render) → cek mandiri (DIRECTOR §11). Storyboard hanya kalau user minta.
- Perbedaan dari bawaan lemo (mode skill):
  - Folder proyek: `python "{{KIT}}/tools/kit.py" new <nama-pendek>` mencetak folder (di `~/Videos/video-style/`). Kerja hanya di sana. Jalankan alat lemo dari `$LIB` dengan path proyek absolut.
  - Bahasa film = bahasa user (bawaan Indonesia). Lewati pertanyaan bahasa lemo; satu kelompok pertanyaan di atas adalah "satu putaran" itu.
  - Suara: lihat `guides/suara.md`. Teks narasi ditulis ke `<proyek>/lines.json` (`[{"id","text","lang":"id"}]`); keluarannya `voices/<id>.wav` + `dur.json` (format sama dengan tts lemo) dipakai timeline.
  - Efek suara dan musik: boleh pakai `core/audio` lemo, atau bank kita di `{{KIT}}/assets/sfx` (efek earshot, uisfx, rekaman Openverse CC0). Musik asli yang ditulis dengan kode; jangan memakai musik berhak cipta.
  - Potret 9:16: rancang tata letak untuk 1080x1920 sejak awal (render dengan `--size 1080x1920`, tata letak dari `innerWidth` x `innerHeight`), jangan memotong versi 16:9. Kosongkan kolom kanan sekitar 175 px dan bagian bawah sekitar 470 px dari isi penting (perkiraan; bilang ke user).
  - Font Inter ada di `{{KIT}}/engine/fonts/Inter.ttf`; font lain mengikuti STYLE.md (OFL).
- Kalau satu langkah gagal: baca error, perbaiki, ulangi. Kembali ke user hanya untuk keputusan atau hal yang hanya user punya.
- Render makan waktu (beberapa menit untuk 45 detik); beri tahu satu poin singkat sebelum mulai.

**4. Periksa.** Loudness harus sekitar -14 LUFS (mux lemo mencetaknya dan gagal kalau salah). Lihat lembar kontak (`sheet.py`) minimal dua putaran, teks harus terbaca (`readcheck.mjs`). Perbaiki sebelum menyerahkan. Jangan memutar video, cukup gambar.

**5. Serahkan.** Poin pendek: path lengkap MP4 (dan versi potret kalau diminta), durasi, style yang dipakai, ringkasan isi, batasan jujur (audio belum didengar AI; cek lisensi suara; style lemah), kredit aset (`CREDITS` proyek). Tutup dengan satu pertanyaan: mau ubah apa?

## Larangan
- Jangan membuat repo, mengunggah, atau memposting hasil tanpa diminta.
- Jangan mengubah `$LIB/core/` atau `$LIB/styles/` untuk film user; bangun di folder proyek.
- Jangan menjalankan atau menghentikan proses yang bukan kamu mulai.
- Jangan memakai karakter Minyam di video user kecuali diminta (itu jalur demo).

Input user: $ARGUMENTS
