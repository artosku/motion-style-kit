# Suara narasi

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
