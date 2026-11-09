> **AI agent: read this first.** If a user gave you this link (with just "setup", "install", "pakai ini", or nothing else), their intent is ALWAYS: install the kit as a tool and create the `/video-style` command. Do not summarize the repo.
> 1. Read `AGENT_SETUP.md` and follow it step by step.
> 2. Talk to the user in their language, short bullet points, one batch of questions with a default marked ★.

# video-style-kit

Bikin video motion dari satu baris: `/video-style <style> <topik>`.

- Maskot **Minyam** jatuh bebas melewati rintangan, melewati poin-poin topikmu satu per satu.
- **20 style gambar**: kertas, cat air, pixel, kartun lawas, anime 80an, Lego, miniatur, dan lainnya.
- Narasi (opsional), musik, efek suara, caption, dan ajakan (CTA) dibuat otomatis sesuai topik.
- Kamu **tidak perlu menyebut nama alat apa pun**. Semuanya sudah diurus.
- Hasil: MP4 16:9 (YouTube, presentasi).

## Cara pakai
1. Kirim link repo ini ke AI agent-mu (Claude Code) dan ketik **"setup"**.
2. Agent memasang kit sekali dan membuat perintah `/video-style`.
3. Dari folder mana pun, ketik:
   - `/video-style kertas 5 tips hemat jajan`
   - `/video-style cat air manfaat tidur cukup`
   - `/video-style 5 cara belajar efektif` (tanpa style: kamu ditawari pilihan)

## Yang kamu butuhkan
- Node.js 20+, Python 3.9+, ffmpeg, Git. (Agent mengecek dan memberi tahu cara memasang yang kurang.)
- Suara narasi: **boleh dilewati**. Pilihannya: akun ElevenLabs (generate di situsnya), atau kunci API Cartesia/ElevenLabs di file `.env`. Tanpa suara, video tetap jadi dengan musik dan teks.

## Isi repo
| Folder | Isi |
|---|---|
| `AGENT_SETUP.md` | satu file yang dibaca agent untuk memasang semuanya |
| `skill/` | perintah `/video-style` dan panduan kualitasnya |
| `engine/` | mesin gambar (Minyam, 20 style, panel, transisi, layar akhir) |
| `render/` | alat render dan pengatur loudness |
| `assets/` | efek suara dan katalog style |
| `tools/` | skrip yang mengerjakan pekerjaan berat (hemat token AI) |
| `examples/20-style/` | contoh `spec.json` film "20 Style Video Motion" |

## Batasan saat ini
- Hanya 16:9. Karakter hanya Minyam.
- Ayam di style riso, woodcut, blueprint, paper-cut paling lemah. Brick, tilt-shift, low-poly, pop-up adalah pendekatan 2D.
- Musik `ceria` ditulis tangan; mood lain dibuat otomatis dan belum sehalus itu.
- Repo ini **private** untuk uji coba.

## Kredit
Lihat [`CREDITS.md`](CREDITS.md). Kit ini merangkai alat dan aset terbuka (lemo-opuscar, earshot, uisfx, Openverse CC0, Inter, Playwright, FFmpeg); tidak ada teknologi baru.
