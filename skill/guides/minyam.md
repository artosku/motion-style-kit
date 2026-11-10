
# Jalur demo Minyam (hanya untuk memamerkan style)

Pakai jalur ini **hanya** kalau user minta demo "ayam jatuh" / "Minyam" untuk memperlihatkan style. Video biasa dengan topik apa pun memakai jalur utama di `SKILL.md` (lemo-opuscar). Di jalur ini, panduan `konsep-naskah.md`, `musik-sfx.md`, `kualitas.md` berlaku penuh.

Kamu membuat video demo Minyam dari **topik** dan **style**. Semua alat sudah ada di folder kit:

`{{KIT}}`

Perintah dasar (selalu dengan path penuh): `python "{{KIT}}/tools/kit.py" <perintah> ...`

Panduan detail ada di folder skill ini (`guides/`). **Baca hanya yang dibutuhkan tahap itu**:
- `guides/style.md`: 66 style, cocok untuk apa, batasannya.
- `guides/konsep-naskah.md`: isi `spec.json`, aturan menulis, rintangan.
- `guides/musik-sfx.md`: mood musik dan daftar efek suara.
- `guides/suara.md`: narasi (API, situs ElevenLabs, atau tanpa suara).
- `guides/kualitas.md`: pemeriksaan, urutan perintah, kegagalan umum, serah ke user.

## Cara bicara dengan user (wajib)
- Bahasa yang sama dengan user. **Poin-poin pendek**, kalimat sederhana, tanpa istilah teknis (jangan sebut "render", "mux", "spec", nama file) kecuali diminta.
- Maksimal 5 poin per pesan: apa yang sudah dilakukan, lalu apa yang terjadi berikutnya.
- Pertanyaan **satu kali** dalam satu kelompok (maksimal 4), pilihan bertanda ★ = rekomendasi. "ok" berarti ambil semua ★.
- Selalu tulis **path lengkap** (mulai dari huruf drive) setiap menyebut file.
- Jangan minta kunci API di chat. Jangan mengunggah atau membagikan apa pun.
- Jujur soal batasan: kamu tidak bisa mendengar audio; style yang lemah; lisensi suara.

## Alur

**0. Cek alat.** Jalankan `doctor`. Kalau ada GAGAL, jelaskan satu poin apa yang kurang, **tanya izin**, lalu jalankan `setup` (atau pasang yang kurang). Ulangi sampai `SIAP`. Kalau folder kit tidak ada, ikuti `AGENT_SETUP.md` di repo kit.

**1. Baca permintaan.** Dari `$ARGUMENTS`: style (kata pertama kalau cocok dengan `kit.py styles`, termasuk sebutan umum seperti "kertas", "lego", "8 bit"), topik, dan permintaan tambahan (jumlah poin, durasi, suara, bahasa).
- **Topik kosong** → tanya topiknya.
- **Style kosong** → tanya dengan 4 pilihan: 3 style paling cocok untuk topik (lihat `guides/style.md`, tandai ★ yang terbaik) + `campur`. Jangan tampilkan semua 66 kecuali diminta.
- **Suara**: kalau belum jelas, ikut `guides/suara.md` (cek `doctor`: "suara lewat API siap"). Satu kelompok pertanyaan dengan style bila keduanya kosong.
- Bawaan kalau user bilang "terserah": 5 poin, mood sesuai topik, tanpa suara kecuali kunci API sudah ada.

**2. Rancang konsep.** Ikuti `guides/konsep-naskah.md` dan `guides/musik-sfx.md`: judul, hook intro, 3 sampai 10 poin (nama 2-4 kata + tagline maksimal 6 kata), mood musik, rintangan per poin yang nyambung topik, suara tambahan seperlunya, CTA. Konsep, musik, dan SFX **disesuaikan topik** (kamu yang memilih, user tidak perlu menyebut nama alatnya).

**3. Bikin folder dan `spec.json`.** `new <slug>` mencetak path folder. Tulis `spec.json` di folder itu dengan tool Write.

**4. Jalankan.** Ikuti urutan di `guides/kualitas.md`:
- Tanpa suara: `all <folder>` (membuat jadwal, audio, gambar, video, dan pemeriksaan sekaligus).
- Dengan suara: `build` → suara (`voice` atau `ingest`) → `build` → `mix` → `render` → `mux` → `check`.
- Render butuh 1-2 menit per 30 detik video. Beri tahu user satu poin singkat sebelum mulai.

**5. Periksa.** `check` harus `LOLOS`. Buka `<folder>/out/contact.jpg` **satu kali** dan cek dengan daftar di `guides/kualitas.md`. Perbaiki lalu ulangi dari tahap yang terdampak. Jangan menyerahkan hasil yang belum lolos.

**6. Serahkan.** Format serah ada di `guides/kualitas.md` (path lengkap MP4, ringkasan, batasan jujur, tawaran teks kredit). Tutup dengan satu pertanyaan: mau ubah apa?

## Larangan
- Jangan mengubah `engine/minyam.js`, logo, atau menggambar ulang Minyam dari deskripsi.
- Jangan membaca file di `engine/` dan `render/` kecuali ada error yang tidak dimengerti (hemat token).
- Karakter selain Minyam belum ada di jalur ini. Versi 9:16: `render`/`mux` dengan `--portrait` (lihat `guides/kualitas.md`).
- Jangan membuat repo, mengunggah, atau memposting hasil tanpa diminta.

