> **AI agent: read this first.** If a user gave you this link (with just "setup", "install", "pakai ini", or nothing else), their intent is ALWAYS: install the kit as a tool and create the `/motion-style` command. Do not summarize the repo.
> 1. Read `AGENT_SETUP.md` and follow it step by step.
> 2. Talk to the user in their language, short bullet points, one batch of questions with a default marked ★.

# motion-style-kit

Bikin video motion tentang **topik apa saja** dalam satu dari **66 style** dari satu baris: `/motion-style <style> <topik>`.

- AI agent menyutradarai filmnya (cerita, adegan, data) memakai pustaka **lemo-opuscar**, lalu membuat narasi, musik, efek suara, dan caption.
- Kit ini hanya pembungkus: mengunduh dan memasang pustaka, mencocokkan nama style ("kertas", "8 bit", nomor 1-66), menyiapkan suara (edge-tts Indonesia gratis, ElevenLabs, Cartesia), dan merapikan hasil.
- Kamu **tidak perlu menyebut nama alat apa pun**. Semuanya sudah diurus.
- Foto dan video asli dari Pixabay bisa disisipkan kalau kamu memintanya dan punya kunci API gratis sendiri (`python tools/kit.py media <proyek> <kata>`).
- Hasil: MP4 **16:9** (YouTube, presentasi) dan/atau **9:16** (TikTok, Reels, Shorts) dengan area aman untuk tombol dan caption.
- **Minyam** (maskot ayam) hanya dipakai di video contoh di bawah, untuk memamerkan 66 style secara berurutan. Isi videomu tidak memakai Minyam.

## Cara pakai
1. Kirim link repo ini ke AI agent-mu (Claude Code) dan ketik **"setup"**.
2. Agent memasang kit sekali dan membuat dua perintah:
   - `/motion-style <style> <topik>`: membuat videonya.
   - `/motion-style-list`: daftar 66 style.
3. Dari folder mana pun, ketik:
   - `/motion-style kertas 5 tips hemat jajan`
   - `/motion-style cat air manfaat tidur cukup`
   - `/motion-style 5 cara belajar efektif` (tanpa style: kamu ditawari pilihan)
4. Agent bertanya sekali (panjang, 16:9 atau 9:16, suara, bahan sendiri), lalu membuat videonya. Pertama kali ada unduhan pustaka dan alat render (beberapa menit).

## Contoh video (demo style)
Minyam jatuh melewati style satu per satu, dibuat dengan engine demo di `engine/`. Versi di sini sudah dikecilkan (960x540 dan 540x960) supaya repo ringan. Klik untuk menonton.

| Video | Style | Landscape 16:9 | Potret 9:16 |
|---|---|---|---|
| #1 | 1-20 | [20-style-video-motion.mp4](examples/videos/landscape/20-style-video-motion.mp4) | [potret](examples/videos/portrait/20-style-video-motion-portrait.mp4) |
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
- **Model AI yang kuat** untuk membuat video: pakai Claude Sonnet atau Opus (atau setara). Model kecil seperti Haiku cenderung melewati langkah penyutradaraan, hasilnya statis dan penuh teks.
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
| `skill/` | perintah `/motion-style`, `/motion-style-list`, `/minyam-style` (video promo aksi Minyam), dan panduan kualitasnya |
| `engine/` | mesin demo Minyam (66 style, panel, transisi, layar akhir, tata letak potret) |
| `tools/lemo-setup.sh` | pengunduh pustaka lemo-opuscar (salinan dari lemo-opuscar, MIT) |
| `render/` | alat render dan pengatur loudness |
| `assets/` | efek suara dan katalog style |
| `tools/` | skrip yang mengerjakan pekerjaan berat (hemat token AI) |
| `examples/` | spec, naskah, dan video contoh (landscape dan potret) |

## Batasan saat ini
- Video bebas dibuat AI agent per film (bukan cetakan): hasil dan lama pembuatan bergantung topik dan style; film 45 detik bisa butuh puluhan menit dan banyak token.
- Jalur video bebas dengan perintah baru ini **belum diuji dari awal sampai akhir** pada banyak style.
- Video demo Minyam: engine 2D saja; style 3D di demo adalah pendekatan 2D; beberapa style demo lemah (Shadow Puppetry, Copperplate Engraving, ASCII, Dark Tech Keynote, Chalkboard).
- Jalur suara lewat API belum diuji dengan kunci sungguhan. Cek lisensi ElevenLabs/Cartesia sebelum video dipakai komersial.
- Repo ini publik. Video contoh memakai suara ElevenLabs milik pembuatnya; kalau kamu memakai ulang, cek lisensi suara sendiri.

## Lisensi karakter dan logo
**Karakter Minyam dan logo Artosku hanya untuk penggunaan nonkomersial (CC BY-NC 4.0), dilarang dipakai komersial.** Detail: [`LICENSE-ASSETS.md`](LICENSE-ASSETS.md).

## Kredit
Lihat [`CREDITS.md`](CREDITS.md). Kit ini merangkai alat dan aset terbuka (lemo-opuscar, earshot, uisfx, Openverse CC0, Inter, Playwright, FFmpeg); tidak ada teknologi baru.
