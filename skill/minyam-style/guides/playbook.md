# Playbook sutradara: Minyam aksi satset

Resep ini diambil dari cara dua video acuan dibuat. Tiap aturan punya alasan; kalau kamu melanggar, hasil jadi datar atau berantakan.

## 1. Prinsip besar
1. **Satu puncak, naik tingkat.** Cerita bertangga: gerombolan kecil → gerakan makin gila → bos → bos menang dulu → hening → jurus pamungkas → lega → CTA. Tanpa narasi, cerita harus terbaca dari gambar.
2. **Selalu ada gerak tiap detik**, di tiga lapis: latar (paling pelan), tengah, depan (paling cepat). Kamera juga bergerak (crane, zoom, pan).
3. **Variasi sumbu kamera tiap adegan** (turun, samping, depan lurus, vertikal naik, sudut rendah, tilt-up). Jangan dua adegan berturut-turut dengan arah gerak sama.
4. **Hening itu senjata.** Tiga hening pendek sebelum tiap puncak membuat hantaman terasa. Jangan isi semua detik dengan musik.
5. **Tiap tebasan, hantaman, dan kejadian punya suara sendiri** dan jatuh tepat di grid musik.
6. **Satu layar maksimal satu judul atau satu kalimat pendek**; sisanya gambar. Judul besar (Kanit Black Italic krom), bukan paragraf.
7. **Style 80s Cel Anime**: isi dua nada (bayangan dasar + bentuk terang digeser), garis tepi berwarna gelap, gerak boneka pada 12 fps (`q12`), langit airbrush dengan awan terang di bawah, matahari bergaris, garis kecepatan, impact frame, bayangan susul, still "harmony" di puncak, efek layar TV (CRT) tipis.

## 2. Grid waktu
- 160 BPM: **1 bar = 1,5 s**, 1 ketuk = 0,375 s, 1/8 = 0,1875 s, 1/16 = 0,09375 s. 26 bar = 39 s.
- Semua potongan adegan jatuh di garis bar. Semua tebasan beruntun jatuh di kelipatan 0,1875 (cepat) atau 0,375 (sedang). Badai puncak boleh dua kali lebih cepat (0,18 per 8 nada) dengan nada naik setengah.
- Rangka 39 detik (dari dua acuan, dipakai ulang):

| Waktu | Isi | Fungsi |
|---|---|---|
| 0–3,0 | Pembuka (hook visual + judul krom besar) | tangkap perhatian di detik pertama |
| 3,0–4,5 | Close-up mata + satu benda melintas | napas pendek, janji aksi |
| 4,5–6,75 | Montase 1: gerak lurus cepat, aksi tiap 1/8 | buka aksi |
| 6,75–8,25 | Montase 2: zig-zag / tendangan, aksi tertunda + impact frame | variasi |
| 8,25–10,5 | Montase 3: vertikal (putar naik / lompat atap / kabel) | variasi |
| 10,5–12,0 | Mendarat / hasil (benda berhamburan, tarikan ke bos) | jeda sebelum bos |
| 12,0–16,5 | Bos muncul dan meraung / menyedot, judul bos | ancaman |
| 16,5–21,0 | Bos menang (hantaman, tebasan mental, tokoh kalah / tertelan) | titik terendah |
| 21,0–24,0 | Mengisi jurus: hening, mata, aura | pembangkit puncak |
| 24,0–28,5 | Jurus pamungkas: terjang, freeze, impact frame, badai, still harmony, bos pecah jadi koin | puncak |
| 28,5–31,5 | Fajar (ganti model warna jadi terang): lega, hujan koin / tumpukan rapi | resolusi pesan |
| 31,5–39,0 | CTA: 5 tebasan membelah layar jadi pita bergeser, halaman putih bersih Artosku | ajakan unduh |

## 3. Teknik gerak (nama fungsi: lihat `katalog-kode.md`)
- **Aksi beruntun tiap 1/8 (montase 1):** tokoh dan latar bergeser, lawan masuk dari kanan, tiap lawan punya waktu kena `HIT(i) = awal + i*.1875`. Sebelum kena: lawan melayang masuk. Saat kena: `split()` (terbelah dua dengan putar dan jatuh), `sparks()`, `arcSlash()` atau `slash()`. Tiga bayangan susul (ghost) di belakang tokoh.
- **Aksi tertunda + impact frame (montase 2):** garis kilat beruntun dan tokoh "teleport" (ghost putih pudar) selama jeda, semua lawan masih utuh. Lalu **serentak** semuanya terbelah, dengan 2 gambar `impact()` (0,085 s) dan kilat putih.
- **Vertikal (montase 3):** latar `PL` bergeser vertikal, `lines(…vert=true)`, tokoh berputar (`rot`) dengan cincin tebasan hijau, atau lompat atap (`roofs`) dan meluncur di kabel dengan percikan.
- **Squash mendarat:** `squashY/squashX` dengan peluruhan `exp(-w*9)*cos(w*22)`, `dust()`, `star()`.
- **Bos masuk:** naik lewat `ss(seg())` dari bawah layar, mata menyala bertahap, `radial()` merah, cincin kejut `ellipse` membesar, napas `sin(q12(t)*3)*6`, getar saat meraung.
- **Bos menang:** dua hantaman dengan jalur `lerp` (naik, kena, kembali), tokoh menghindar dengan 3 ghost; lalu tokoh membalas 6 kali tapi mental (percikan kuning, bintang); lalu tokoh terpental atau tertelan.
- **Titik terendah lalu hening:** layar gelap, hanya mata bos dan satu teks besar (misalnya "SALDO Rp 0"). Musik dan SFX dimute sekitar 0,36 s.
- **Mengisi jurus:** satu ketukan hening, close-up (koin dada, mata), mata menyala, rumput cahaya hijau (`quadraticCurveTo`) naik, senjata menyala (`glow`), tokoh berdenyut `1 + .025*sin(fr*2.1)`.
- **Jurus pamungkas:** (1) terjang 0,6 s dengan 3 ghost; (2) **freeze** 0,15 s (putih penuh, lalu impact frame + garis diagonal tebal) lalu hening; (3) badai tebasan (24–44 garis acak, bos berkedip, ghost tokoh di dua tempat); (4) **still harmony**: bos membeku dengan bekas tebasan, tokoh diam di kiri bawah; (5) hening panjang 0,9 s; (6) klik, bos terbelah tiga garis jadi 8 kepingan yang terpental, 56 koin menyembur, putih memenuhi layar.
- **Fajar:** model warna `dawn`, zoom keluar pelan 1,09→1, matahari naik, hujan koin atau uang tersusun rapi, tokoh gembira (`mood: 'joy'`).
- **CTA:** snapshot adegan fajar ke `snapC/snapG`, `cta()` digambar di bawahnya, 6 pita diagonal dari snapshot bergeser keluar bergantian, 5 garis putih + tebasan 30 px mendahului tiap pita. Lalu isi halaman muncul berurutan: logo (back-ease), headline, tombol Play Store, tokoh naik dari bawah. **Tebasan hijau dekoratif muncul tiap 0,375 s** sampai akhir, tebasan terakhir menjadi garis bawah headline. Akhir dengan ding.
- **Bintang kilau (`star()`)** di tiap puncak kecil. **Pita ikat kepala** berkibar mengikuti `wind` (naikkan `wind` saat melaju).
- **Hitungan di sudut (HUD)** memberi rasa skala tanpa narasi ("TEBAS ×N" atau "SALDO Rp …" yang turun tiap kena). Tandai `pass:true` di `TEXTS` karena berubah cepat.
- **Gaya warna:** tiap adegan satu model langit (`dusk`, `dark`, `dawn`, `day`); puncak memakai `darkBg()` ungu gelap dengan `radial()` putih/hijau; CTA putih bersih dengan hijau matcha (`MATCHA9 #538248`, `MATCHA5 #86B77A`, `NEON #9dff8a`). Aksen tokoh: ikat kepala (merah di samurai, biru di kejar-uang). Aksen jurus: hijau matcha.

## 4. Aturan keras (jangan dilanggar)
1. **Dua kanvas**: `X` (warna, `sc`) dan `G` (peta cahaya untuk bloom, `glc`). Setiap fungsi gambar menggambar ke keduanya (`each(c => …)`). Hitam di `G` = tidak menyala. Siluet penghalang digambar hitam di `G`. Reset kedua konteks di awal `window.render`.
2. **Mulai `window.render(t)` dengan** `t = clamp(t, 0, 38.999)`, isi hitam kedua kanvas, `save()`, guncangan `SHAKE`, panggil fungsi adegan, `restore()`, `overlay(t)` (teks krom di luar zoom/geser kamera), `FLASH`, lalu CRT (`post.render`) atau `?raw=1`.
3. **Tabel `SHAKE` dan `FLASH`** (waktu, kekuatan, durasi) untuk semua hantaman; flat=1 untuk getar terus-menerus. Kilat putih hanya di hantaman besar; jangan menutupi 2 gambar berturut-turut kecuali impact frame yang disengaja.
4. **Zona aman potret:** bawah sekitar **470 px** dan kanan sekitar **175 px** tanpa teks penting; area aman teks `x 0–904, y 0–1450`. Beri tahu user bahwa ini perkiraan.
5. **Teks dan keterbacaan (`readcheck.mjs`):** waktu tampil minimal **sekitar 1,5 s + 0,066 s × jumlah huruf** (7 huruf ≈ 2,0 s; 15 ≈ 2,5 s; 24 ≈ 3,1 s). Judul diperpanjang atau dipersingkat sampai tidak ada `BAD`. Teks yang berubah cepat (hitungan, angka) ditandai `pass:true`. Tiap teks yang tampil harus punya entri di `window.TEXTS` dengan kotak `x0,y0,x1,y1`.
6. **Hero tidak tertutup:** jangan taruh matahari, bos, atau flash tepat di belakang tokoh sehingga siluetnya hilang (kesalahan di render pertama samurai: matahari di belakang tokoh; dipindah ke sisi). `eyeGlow` di close-up dibiarkan 0 supaya mata tidak hilang.
7. **Bloom diturunkan di puncak** (badai tebasan: `bloom .34`, `halo .1`) supaya tebasan tidak jadi bubur putih. Efek CRT di CTA dibuat tipis (`light`).
8. **Karakter resmi:** `Minyam.draw` dipakai apa adanya, tambahan hanya lewat `hooks` (`overHead`, `overWing`, `overNearWing`, `overTail`). Properti `pose` yang tersedia: `view` (`front/back/side`), `mood` (`frozen/joy/sad`), `eyes` (`angry/shock/dizzy/sadClosed`), `eyeOpen`, `eyeOpenRight`, `eyeGlow`, `facing`, `flap`, `lift`, `look`, `lookY`, `squashX`, `squashY`, `stars`, `step`, `sweat`, `tilt`, `wingLeft`, `wingRight`, `wingCover`, `legKick`, `peek`, `sit`, `grime`, `beak`, `coin`.
9. **Warna dasar Artosku:** matcha `#538248`, `#86B77A`, tinta `#101713`. Logo hanya lewat `logoPrimer/logoW`.
10. **Tidak ada narasi dan tidak ada subtitle.**

## 5. Suara
**Musik asli (numpy, `mix.py`), tanpa sampel musik berhak cipta.** Urutan adegan dan suasana:

| Waktu | Musik |
|---|---|
| 0–3 | drone rendah + taiko atau jingle ringan (versi kejar-uang: jingle gajian ep + fm), crescendo brass |
| 3–4,5 | detak jantung, fill tom/snare naik |
| 4,5–10,5 | grup Em / C / D / Em, kick-snare-hat 16, bas 1/8, lead fm, brass stab tiap 1,5 ketuk; tiap bar berganti akor |
| 10,5–12 | jeda: akor brass + crash, klik |
| 12–16,5 | tema bos setengah tempo, tritone (28, 29, 28, 34), tom besar, pad |
| 16,5–19,5 | frigia (Em, F), bas melangkah, brass pendek; putus total di 19,5 |
| 21,375–24 | pad naik, thump pelan, riser noise, snare roll yang makin rapat |
| 24–24,6 | tom naik + brass naik; **hening 24,6–24,75** |
| 24,96–26,4 | badai: naik setengah nada (F minor), double-time, lead naik |
| 26,4–27,3 | **hening** |
| 27,75 | akor terang + crash besar |
| 28,5–31,5 | G mayor lembut (ep, pad, arpeggio fm) |
| 31,5–39 | city-pop (Gmaj7 | Gmaj7 | Em7 | Cmaj7 D7 | G), kick-snare-hat-epiano, hook fm, brass hit di akhir, ding penutup |

Catatan: di versi kejar-uang semua nada dinaikkan satu kuart (`f(m)` ditambah 5 semiton) dan riff diganti supaya tidak terdengar sama dengan samurai. Lakukan variasi serupa untuk tiap konsep baru (ganti riff, kunci, jingle pembuka, bukan struktur).

**SFX per kejadian** (`window.EV` di `film.js` → `events.json` → `mix.py`): tiap kejadian punya `t` dan `type`. Jenis yang sudah ada di `mix.py`: `wind, slam, rumble, eyes, draw, ting, cut, zip, bigcut, spin, land, click, coins, ignite, roar, boom, clang, whoosh, thud, laugh, coinglow, aura, dash, crack, explode, shimmer, slide, pop, cutsoft, ding` (samurai) dan tambahan `rattle, burst, flutter, munch, hop, duck, kick, step, grind, crash, suck, grab, gulp, gridline, snap` (kejar-uang). Konsep baru: tambah jenis baru di blok `elif ty == …` dan jangan biarkan `print('! jenis kejadian tanpa suara')` muncul.
- Bank SFX siap pakai: `{{KIT}}/assets/sfx` (earshot: whoosh, impact, zip, pop, shimmer, ding, klik; semua MIT). Sisanya disintesis (`sfx.thump/whoosh/rumble/ignite/crash/roar/heartbeat`, `ring`, `shing`, `clang`, `boom`).
- **Ducking** musik di tiap hantaman besar (`duckat`), **mute** di hening yang disengaja (`mute(mus,…)`, `mute(fx,…)`), potong bas (`hp 32`, kurangi `lp 120/125`) karena versi pertama terlalu berat. Target bas (30–120 Hz) tidak lebih dari sekitar 3 dB di atas tengah (300–3000 Hz); kejar-uang hasilnya seimbang (−22,9 vs −22,9), samurai masih 1 dB berat.
- Normalisasi puncak 0,8 lalu limiter 0,92. Kenyaringan akhir dari `mux.sh` (`-14 LUFS`, ±1).
- Suara sebagai transisi (J-cut): gemuruh bos masuk beberapa detik sebelum bos muncul; shing tebasan CTA mulai di akhir adegan fajar.
- Kamu **tidak bisa mendengar** hasilnya. Periksa dengan angka (puncak, LUFS, bas vs tengah, rms di hening) dan katakan jujur ke user supaya mendengar sekali.

## 6. Teks dan penamaan
- Judul: Kanit Black Italic gradasi krom (`chrome()`), garis luar gelap + neon (pink/merah untuk ancaman, hijau untuk Artosku/jurus). Label kecil: Inter 900 dengan garis luar (`label()` di kejar-uang).
- Pola hook yang dipakai: (1) angka + ketimpangan ("1 MINYAM VS 1000 PENGELUARAN"); (2) kejadian yang semua orang kenal lalu pertanyaan ("GAJIAN!" → "UANGNYA KABUR?!"). Kata kunci produk: "pengeluaran", "gajian", "tanggal tua", "catat". Jangan menjanjikan viral.
- Teks jurus mengarah ke fitur: "CATAT SEMUA!" atau "SAATNYA MENCATAT" / "SEMUA TERCATAT!". Pesan akhir: "Download Artosku" + "Pencatat Keuanganmu" + tombol "Play Store".
- Semua kata Indonesia sederhana, huruf kapital untuk judul aksi.

## 7. Perintah (Git Bash, dari folder mana pun)
Ganti `P` dengan folder proyek.
```
LIB={{LIB}}
P={{VIDEOS}}/<nama>
PY=$LIB/.venv/Scripts/python.exe
# gambar contoh
cd $LIB && node core/render/still.mjs "$P" 0.8 3.9 5.0 7.2 9.0 10.8 13.5 16.2 19.3 21.5 24.4 25.6 27.9 31.0 34.5 38.5 --size 1080x1920
# lembar kontak (jalankan di dalam $P/stills)
cd $P/stills && $PY $LIB/core/render/sheet.py ../out/look_a.jpg t_0.8.jpg t_3.9.jpg … --cols 8 --w 300
# cek teks
cd $LIB && node core/render/readcheck.mjs "$P" --size 1080x1920
# bangun penuh (gambar, mix, gabung)
LIB=$LIB sh $P/build.sh
# cek hasil jadi
ffmpeg -v error -i $P/<nama>.mp4 -vf "fps=1,scale=200:-1,tile=13x3" -frames:v 1 -y $P/out/contact.jpg
ffmpeg -i $P/<nama>.mp4 -vf blackdetect=d=0.2:pix_th=0.05 -an -f null - 2>&1 | grep -c black_start
ffmpeg -v error -ss 7.9 -i $P/<nama>.mp4 -frames:v 1 -y $P/poster.jpg
```
- **Gunakan alat Write untuk skrip panjang**; heredoc dengan tanda kutip tunggal di dalam kode JS sering rusak di Git Bash (pelajaran dari sesi acuan).
- `sed -i` untuk ubah angka kecil di `film.js` aman; periksa dengan `grep -c` sesudahnya.
- Gambar penuh 936 frame dengan 4 pekerja ≈ 2 menit; beri tahu user satu poin singkat sebelum mulai.

## 8. Daftar cek sebelum menyerahkan
- [ ] 14+ gambar contoh dilihat dan diperbaiki (Look wajib).
- [ ] `readcheck`: tidak ada `BAD`.
- [ ] Lembar kontak per 1 detik: ada gerak tiap gambar, tidak ada elemen penting di zona aman, tidak ada tokoh tertutup, tidak ada putih penuh yang tidak disengaja lebih dari dua kali.
- [ ] `blackdetect` 0; kenyaringan ≈ −14 LUFS; puncak di bawah −1 dBFS; rms hening ≈ 0.
- [ ] `minyam.js` dan logo tidak berubah; tidak ada string "LemoLab/Opus" di proyek.
- [ ] `CREDITS` ada (lemo-opuscar MIT, earshot MIT, Kanit OFL, Inter OFL; catatan tombol Play Store generik) **dan memuat catatan bahwa karakter Minyam + logo Artosku hanya untuk penggunaan nonkomersial (CC BY-NC 4.0)**.
- [ ] Jangan menempelkan karakter Minyam atau logo Artosku ke repo/rilis publik tanpa `LICENSE-ASSETS.md` yang menyatakan nonkomersial.
- [ ] Tidak ada yang diunggah, tidak ada repo dibuat.

## 9. Batasan jujur (sampaikan di serah-terima)
- AI tidak bisa mendengar audio; suara hasil sintesis kode dan belum didengar.
- Jumlah musuh di layar puluhan; kesan "1000" datang dari hitungan/HUD dan montase.
- Angka dan nama di cerita adalah karangan.
- Tombol Play Store generik; user dapat mengganti dengan lencana resmi Google Play.
- Ukuran file ±45–55 MB karena tekstur CRT/pita.
- Zona aman potret perkiraan.
- Satu atau dua kilat putih hampir penuh di puncak (sengaja); bas bisa sedikit berat.
