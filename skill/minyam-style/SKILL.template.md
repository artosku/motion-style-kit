---
name: minyam-style
description: Membuat video promo Artosku bergaya "Minyam aksi satset" (80s Cel Anime, potret 9:16, tanpa narasi, full aksi, musik dan SFX per adegan, CTA Play Store penuh tebasan) dengan meniru cara kerja dan kode dua video acuan (Minyam Samurai dan Minyam Kejar Uang Kabur). Pakai saat user mengetik /minyam-style atau minta video Minyam baru dengan gaya aksi cepat seperti itu.
argument-hint: "<konsep cerita>   contoh: /minyam-style Minyam astronaut terjun menembus bumi"
---

# /minyam-style

Kamu membuat **satu video promo Artosku** (pencatat keuangan, maskot **Minyam**) dengan gaya yang sama dengan dua video acuan buatan Fable:

- `{{VIDEOS}}/minyam-samurai/minyam-samurai.mp4` (Minyam samurai vs 1000 pengeluaran, bos struk "CICILAN").
- `{{VIDEOS}}/minyam-kejar-uang/minyam-kejar-uang.mp4` (Minyam kejar uang bersayap, bos "TANGGAL TUA").

Kode, rencana, dan skor suara kedua video itu disimpan **lengkap** di folder skill ini. Tugasmu: **meniru resep dan memakai ulang kodenya**, bukan menulis dari nol dan bukan mengarang gaya baru.

Folder skill: `{{SKILL}}/`
- `guides\playbook.md`: resep sutradara (struktur, ritme, teknik gerak, suara, cek mutu). **Wajib dibaca sampai habis sebelum membangun.**
- `guides\katalog-kode.md`: peta fungsi di kode acuan (mau efek apa, salin dari mana). **Wajib dibaca.**
- `guides\konsep.md`: daftar konsep cerita dan cara mengubah acuan jadi konsep baru.
- `reference\samurai\` dan `reference\kejar-uang\`: `art.js`, `film.js`, `mix.py`, `TREATMENT.md`, `FACTS.md`, `build.sh`, `index.html` utuh dari dua video.
- `template\`: `index.html`, `build.sh`, `CREDITS`, dan `fonts\` (Kanit Black Italic, Inter) untuk proyek baru.

## Cara bicara dengan user (wajib)
- Bahasa Indonesia, **poin pendek, maksimal 5 poin per pesan**, kata sederhana, tanpa istilah teknis (jangan sebut "render", "canvas", nama fungsi) kecuali diminta.
- Selalu tulis **path lengkap** (mulai huruf drive) setiap menyebut file.
- Jangan minta kunci API di chat. **Jangan membuat repo, mengunggah, atau memposting apa pun** tanpa diminta. Jangan mengubah isi `$LIB\core\` dan `$LIB\styles\`. Jangan menjalankan atau menghentikan proses yang bukan kamu mulai.
- Jujur soal batasan: kamu tidak bisa mendengar audio; angka cerita itu karangan; tombol Play Store itu gambar generik, bukan lencana resmi.
- Bertanya **hanya kalau benar-benar perlu**. Bawaan sudah ditetapkan di bawah; jangan menanyakan ulang hal yang bawaannya jelas.

## Bawaan (ambil kecuali user menyebut lain)
| Hal | Bawaan |
|---|---|
| Style | 80s Cel Anime (`cel-anime-80s`, no. 13 di lemo-opuscar) |
| Format | potret 9:16, 1080x1920, 24 fps |
| Durasi | 39 detik (26 bar pada 160 BPM, 1 bar = 1,5 detik) |
| Suara | tanpa narasi, tanpa subtitle; musik asli dari kode + SFX per kejadian |
| Isi | Minyam beraksi cepat lawan "pengeluaran" dalam bentuk monster, bos, puncak, fajar, lalu CTA |
| CTA | logo resmi Artosku, "Download Artosku", "Pencatat Keuanganmu", tombol Play Store, banyak tebasan |
| Konsep | dari argumen user. Kalau kosong, tawarkan 3 konsep dari `guides\konsep.md` (tandai ★ rekomendasi) lalu pilih satu |

## Alur
**0. Siapkan alat (diam-diam).** `python "{{KIT}}/tools/kit.py" doctor`. Kalau kurang, jalankan `kit.py ready`, lalu `doctor` lagi. `LIB={{LIB}}` (cek dengan `kit.py lemo`).

**1. Baca bahan.** `guides\playbook.md`, `guides\katalog-kode.md`, `guides\konsep.md`. Lalu baca `$LIB/AGENTS.md`, `$LIB/DIRECTOR.md`, `$LIB/TECHNIQUE.md`, `$LIB/styles/cel-anime-80s/STYLE.md` dan `DEMO.md`. Lalu `reference\kejar-uang\TREATMENT.md` dan `reference\samurai\TREATMENT.md` sebagai contoh bentuk rencana.

**2. Folder proyek.** `kit.py new <nama-pendek>` (folder di `{{VIDEOS}}/<nama>`). Kerja hanya di sana. Salin:
- `template\index.html`, `template\build.sh`, `template\CREDITS`, `template\fonts\` ke proyek.
- `{{KIT}}/engine/minyam.js` ke proyek, **tanpa diubah** (karakter resmi).
- Dari `reference\kejar-uang\` (atau `samurai\` kalau konsepnya pertarungan): `art.js`, `film.js`, `mix.py` sebagai **titik awal yang ikut diubah** (lihat `guides\konsep.md`).
- Ganti nama hasil di `build.sh` (`hasil.mp4` jadi `<nama>.mp4`).

**3. Rencana (TREATMENT.md + FACTS.md).** Tiga struktur (pilih satu), tiga hook (pilih satu), tabel adegan dengan gerak, teks, dan suara per adegan, grid musik. Ikuti bentuk di `reference\*\TREATMENT.md`. Tanpa klaim fakta nyata; angka cerita ditandai karangan di `FACTS.md`. Tidak perlu riset web untuk hook.

**4. Bangun gambar dan suara.** Ubah `art.js` (properti dan monster baru), `film.js` (adegan, teks, `window.EV`), `mix.py` (musik dan SFX baru). Patuhi `guides\playbook.md` bagian "Aturan keras".

**5. Look (wajib).** Ambil 14 sampai 20 gambar contoh dengan `still.mjs`, susun lembar kontak dengan `sheet.py`, lihat dengan Read, perbaiki. Ulangi sampai tidak ada tabrakan teks, matahari di belakang tokoh, atau kilat putih penuh yang tidak disengaja. Cek teks dengan `readcheck.mjs` sampai tidak ada `BAD`. Perintah persisnya ada di `guides\playbook.md` bagian "Perintah".

**6. Bangun penuh.** `LIB={{LIB}} sh <proyek>/build.sh` (sekitar 2 menit gambar + mix + gabung). Kenyaringan harus sekitar -14 LUFS (mux gagal kalau salah).

**7. Periksa hasil.** Lembar kontak 1 gambar per detik dari MP4 jadi, `blackdetect` harus 0, statistik bas vs tengah dari `mix.py`. Perbaiki lalu bangun ulang (satu putaran perbaikan biasanya cukup).

**8. Serahkan.** Poin pendek: path lengkap MP4, durasi, style, ringkasan isi per adegan, suara, batasan jujur, path `CREDITS`. Tutup dengan satu pertanyaan: "mau ubah apa?".

## Yang tidak boleh diubah
- `minyam.js` (karakter resmi) dan path logo Artosku di `art.js` (`logoPrimer`, `logoW`). Jangan menggambar ulang Minyam dari deskripsi.
- Aturan keras di `guides\playbook.md` (zona aman, aturan teks, hening yang disengaja, pembagian kanvas warna dan cahaya).
