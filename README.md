> **AI agent: read this first.** If a user gave you this link (with just "setup", "install", "pakai ini", or nothing else), their intent is ALWAYS: install the kit as a tool and create the `/motion-style` command. Do not summarize the repo.
> 1. Read `AGENT_SETUP.md` and follow it step by step.
> 2. Talk to the user in their language, short bullet points, one batch of questions with a default marked ★.

# motion-style-kit

Bikin video motion dari satu baris: `/motion-style <style> <topik>`.

- Maskot **Minyam** jatuh bebas melewati rintangan, melewati poin-poin topikmu satu per satu.
- **66 style gambar** (dari koleksi lemo-opuscar): kertas, cat air, pixel, kartun lawas, anime 80an, berita, infografik, cetak, sains, dan lainnya.
- Narasi (opsional), musik, efek suara, caption, dan ajakan (CTA) dibuat otomatis sesuai topik.
- Kamu **tidak perlu menyebut nama alat apa pun**. Semuanya sudah diurus.
- Hasil: MP4 **16:9** (YouTube, presentasi) dan **9:16** (TikTok, Reels, Shorts) dengan area aman untuk tombol dan caption.

## Cara pakai
1. Kirim link repo ini ke AI agent-mu (Claude Code) dan ketik **"setup"**.
2. Agent memasang kit sekali dan membuat dua perintah:
   - `/motion-style <style> <topik>`: membuat videonya.
   - `/motion-style-list`: daftar 66 style.
3. Dari folder mana pun, ketik:
   - `/motion-style kertas 5 tips hemat jajan`
   - `/motion-style cat air manfaat tidur cukup`
   - `/motion-style 5 cara belajar efektif` (tanpa style: kamu ditawari pilihan)

## Contoh video
Semua dibuat dengan kit ini: Minyam jatuh melewati style satu per satu. Versi di sini sudah dikecilkan (960x540 dan 540x960) supaya repo ringan. Klik untuk menonton.

| Video | Style | Landscape 16:9 | Potret 9:16 |
|---|---|---|---|
| #1 | 1-20 | [20-style-video-motion.mp4](examples/videos/landscape/20-style-video-motion.mp4) | belum ada |
| #2 | 21-40 | [20-style-video-motion-2.mp4](examples/videos/landscape/20-style-video-motion-2.mp4) | [potret](examples/videos/portrait/20-style-video-motion-2-portrait.mp4) |
| #3 | 41-60 | [20-style-video-motion-3.mp4](examples/videos/landscape/20-style-video-motion-3.mp4) | [potret](examples/videos/portrait/20-style-video-motion-3-portrait.mp4) |
| #4 | 61-66 | [6-style-video-motion-4.mp4](examples/videos/landscape/6-style-video-motion-4.mp4) | [potret](examples/videos/portrait/6-style-video-motion-4-portrait.mp4) |

Spec dan naskah narasi contoh ada di `examples/20-style/` (#1) dan `examples/lemo-46/` (#2 sampai #4; jalankan `make_specs.py` untuk membuat ulang folder kerjanya).

## 66 style
- **1-20** (video #1): Whiteboard Explainer, Crayon Picture Book, Watercolor Brush, Chinese Ink Wash, Risograph Print, Woodcut Print, Swiss Motion Graphics, Art Deco, Blueprint, Stained Glass, Pixel RPG 16-bit, Rubber Hose Cartoon, 80s Cel Anime, Mid-century Cartoon, Red Paper-cut, Ukiyo-e, Brick Toy, Tilt-Shift Miniature, Low-poly Island, Paper Pop-up Book.
- **21-40** (video #2): Caption News, 1920s Newsreel, Live Countdown Split-screen, Time-lapse Symphony, Visual Investigation, Constructivist Montage, Sports Telestrator, Broadcast News Package, Satellite Briefing, Engineering Briefing Board, LiDAR Survey, Projection on White Model, Data Physicalization, Exploded Teardown, Microscope Story, Archive Light Table, Impasto Oil Painting, One-line Drawing, Urban Sketch, Chalkboard.
- **41-60** (video #3): Shadow Puppetry, Paper-cut Lightbox, Halftone Dossier, Copperplate Engraving, Silkscreen Travel Poster, Printed Long Take, 60s Spy Title Sequence, Pictogram Motion, ASCII / CRT Terminal, Data Storytelling, Isometric Infographic, Dark Tech Keynote, Living Screencast, Sci-fi Hologram HUD, Transit Map, Isometric Picture Book, Circuit Board, Sci-Fi Sitcom Toon, HD-2D, Microgame Frenzy.
- **61-66** (video #4): Game Show Flat, 1920s Silent Film, Liminal Found Footage, Glass Product Render, Memphis Diorama, Desktop Flythrough.

Daftar lengkap dengan deskripsi: `python tools/kit.py styles`. Daftar semua style referensi lemo-opuscar (nama saja): `python tools/kit.py styles --lemo`.

## Yang kamu butuhkan
- Node.js 20+, Python 3.9+, ffmpeg, Git. (Agent mengecek dan memberi tahu cara memasang yang kurang.)
- Suara narasi: **boleh dilewati**. Pilihannya: akun ElevenLabs (generate di situsnya), atau kunci API Cartesia/ElevenLabs di file `.env`. Tanpa suara, video tetap jadi dengan musik dan teks.

## Versi potret 9:16
Tambahkan `--portrait` pada perintah `render`, `mux`, dan `shots`:
```
python tools/kit.py render <folder> --portrait
python tools/kit.py mux <folder> --portrait
```
Layar 1080x1920: logo, judul, dan penanda progres di atas; area animasi di tengah (864x972); kolom kanan sekitar 175 px dan bagian bawah sekitar 470 px dikosongkan untuk tombol dan caption TikTok/Instagram. Ukuran area aman ini perkiraan, cek di aplikasinya sebelum posting.

## Isi repo
| Folder | Isi |
|---|---|
| `AGENT_SETUP.md` | satu file yang dibaca agent untuk memasang semuanya |
| `skill/` | perintah `/motion-style`, `/motion-style-list`, dan panduan kualitasnya |
| `engine/` | mesin gambar (Minyam, 66 style, panel, transisi, layar akhir, tata letak potret) |
| `render/` | alat render dan pengatur loudness |
| `assets/` | efek suara dan katalog style |
| `tools/` | skrip yang mengerjakan pekerjaan berat (hemat token AI) |
| `examples/` | spec, naskah, dan video contoh (landscape dan potret) |

## Batasan saat ini
- Karakter hanya Minyam. Mesin hanya 2D: style 3D (isometrik, HD-2D, brick, low-poly) adalah pendekatan 2D.
- Style yang masih lemah: Shadow Puppetry, Paper-cut Lightbox, Copperplate Engraving, ASCII / CRT, Dark Tech Keynote, Chalkboard, dan beberapa lain (ayam di riso, woodcut, blueprint, paper-cut juga paling lemah).
- Satu video maksimal 30 poin.
- Musik `ceria` ditulis tangan dan sudah didengar; mood lain dibuat otomatis dan belum sehalus itu.
- Jalur suara lewat API belum diuji dengan kunci sungguhan. Cek lisensi ElevenLabs/Cartesia sebelum video dipakai komersial.
- Repo ini **private** untuk uji coba.

## Kredit
Lihat [`CREDITS.md`](CREDITS.md). Kit ini merangkai alat dan aset terbuka (lemo-opuscar, earshot, uisfx, Openverse CC0, Inter, Playwright, FFmpeg); tidak ada teknologi baru.
