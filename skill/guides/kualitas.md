# Pemeriksaan kualitas dan serah

Video dianggap siap hanya kalau **semua** ini terpenuhi. Skrip mengerjakan angka-angkanya; kamu mengerjakan yang perlu mata.

## Otomatis (`kit.py check <folder>`, sudah dijalankan oleh `kit.py all`)
- Durasi video sama dengan jadwal (selisih kurang dari 1 detik).
- Loudness 14 LUFS (toleransi 1) dan puncak -1 dBFS atau lebih rendah.
- Ujung tiap rekaman suara bersih (tidak terpotong).
- Hasil: `HASIL: LOLOS`. Kalau tidak, perbaiki sebab yang disebut lalu ulangi `mix`, `mux`, `check`.

## Dengan mata (satu gambar saja: `<folder>/out/contact.jpg`)
Buka lembar kontak itu satu kali (hemat token; jangan memeriksa video frame demi frame) dan cek:
- Ayam terlihat utuh di tiap poin, tidak terpotong, style-nya benar-benar berubah (bukan sekadar garis).
- Daftar kiri terisi berurutan, nama tidak terpotong, tagline terbaca.
- Caption di bawah panel kanan terbaca dan tidak menutupi ayam.
- Layar akhir: judul, tombol, dan footer tidak terpotong.
- Kalau ada yang janggal, lihat frame yang bersangkutan: `kit.py shots <folder> <detik> ...` (hasil di `<folder>/out/shots/`). Perbaiki di `spec.json` (nama terlalu panjang → pendekkan), lalu ulangi dari `build`.

## Urutan perintah (semua lewat `python "{{KIT}}/tools/kit.py"`)
| Tujuan | Perintah |
|---|---|
| Cek mesin | `doctor` |
| Buat folder | `new <slug>` (mencetak path folder) |
| Jadwal + naskah | `build <folder>` |
| Suara | `voice <folder> cartesia|elevenlabs` atau `ingest <folder>` |
| Audio | `mix <folder>` |
| Gambar | `render <folder>` |
| Gabung + loudness | `mux <folder>` |
| Periksa | `check <folder> [--whisper]` |
| Semua sekaligus (tanpa suara) | `all <folder>` |

Urutan lengkap dengan suara: `build` → suara/`ingest` → `build` (jadwal baru dari durasi asli) → `mix` → `render` → `mux` → `check`. Render sekitar 1 sampai 2 menit per 30 detik video tergantung mesin.

## Kegagalan yang umum
| Gejala | Penyebab | Perbaikan |
|---|---|---|
| `doctor` GAGAL | alat belum terpasang | `kit.py setup`, atau pasang Node.js/ffmpeg (tanyakan dulu ke user) |
| `Style '...' tidak dikenali` | ejaan | pakai id dari `kit.py styles` |
| `cta.head1 kosong` | isian wajib kosong | lengkapi `spec.json` |
| `! SFX tidak ada` | nama suara salah | pakai nama dari `musik-sfx.md` |
| `Baris N tidak ketemu` (ingest) | naskah yang digenerate beda dari `script_elevenlabs.txt` | generate ulang dari naskah itu persis |
| Render berhenti dengan error halaman | `spec.json` rusak (JSON tidak valid) | periksa koma dan tanda kutip |
| Loudness di luar target | musik terlalu keras/ada clipping | `mux` ulang; kalau tetap, turunkan SFX tambahan |

## Serah ke user (poin-poin, kalimat pendek)
- Path **lengkap** MP4 (`<folder>/<slug>.mp4`) dan path lembar kontak.
- Durasi, style yang dipakai, mood musik, jalur suara.
- **Jujur**: kamu belum mendengar audionya; style yang lemah (lihat `style.md`); suara dan lisensi yang perlu dicek user.
- Satu pertanyaan penutup: mau ubah apa (style, poin, suara)?
- Kredit: sebutkan bahwa daftar kredit ada di `CREDITS.md` di folder kit dan tawarkan teks siap tempel untuk deskripsi.

## Hemat token
- Skrip melakukan semua pekerjaan berat. **Jangan membaca file di `engine/` atau `render/`** kecuali ada error yang tidak jelas.
- Baca guide hanya yang dibutuhkan tahap itu. Jangan memutar video, cukup lembar kontak.
- Jangan menjalankan ulang `all` untuk perubahan kecil; ulangi dari tahap yang terdampak (teks berubah → `build` dan seterusnya; suara berubah → `ingest`, `build`, `mix`, `render`, `mux`).
