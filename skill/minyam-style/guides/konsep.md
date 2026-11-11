# Konsep cerita dan cara mengubah acuan

Pola umum semua konsep: **Minyam melawan "pengeluaran" yang berwujud musuh/rintangan, kalah sementara oleh yang paling besar, bangkit dengan "mencatat", menang, lalu ajakan unduh Artosku.** Pesan produk: mencatat membuat uang terlihat dan terkendali. Tanpa narasi.

## Konsep yang sudah dibuat
1. **Samurai** (`reference\samurai\`): Minyam menebas 1000 monster pengeluaran, bos struk "CICILAN Rp 3.200.000", jurus "CATAT SEMUA!".
2. **Kejar Uang Kabur** (`reference\kejar-uang\`): "GAJIAN!" lalu uang bersayap kabur, Minyam lari/tendang dinding/lompat atap/meluncur di kabel, bos "TANGGAL TUA" menyedot dan menelan, jaring catatan, uang tersusun rapi.

## Konsep berikutnya (diurutkan kecocokan dengan gaya satset)
1. **Robot Raksasa vs Monster Tanggal Tua**: monster setinggi gedung menyerang kota tiap tanggal 25. Minyam merakit robot dari catatan keuangan dan menghajarnya dengan pukulan "ANGGARAN". Aksi: kota hancur-hancuran, kamera orbit.
2. **Terjun Tembus Bumi**: Minyam astronaut loncat dari luar angkasa menembus lapisan langit, laut, palung, kerak, mantel, inti; tiap lapisan satu pengeluaran (awan = jajan, laut = langganan, palung = cicilan, inti = "bocor halus"); bumi pecah jadi koin dan struk, Minyam keluar membawa logo Artosku. Aksi: jatuh vertikal terus-menerus, ganti model warna tiap lapisan.
3. **Detektif Minyam "Siapa Pencuri Gajiku?"**: gaya hitam-putih hujan, mengejar jejak struk dari gang ke gang; pelakunya ratusan pengeluaran kecil. Aksi lebih sedikit; tambah kejar-kejaran.
4. **Hari yang Terulang**: bangun, gajian, bokek, berulang makin cepat; di putaran terakhir mencatat lalu lingkarannya pecah. Aksi paling sedikit.

Jika user tidak menyebut konsep, tawarkan 3 dari daftar ini dengan satu kalimat tiap konsep (tandai ★ yang paling banyak aksi).

## Cara mengubah acuan jadi konsep baru
1. **Tentukan lima unsur:** (a) musuh kecil (apa bentuknya, label teks), (b) bos paling besar (nama + label), (c) gerakan montase 3 jenis (lurus, zig-zag/tertunda, vertikal), (d) titik terendah (apa yang hilang), (e) jurus pamungkas (bagaimana mencatat menyelamatkan).
2. **Ganti properti, jangan ganti struktur.** Ubah `art.js`: tambah fungsi gambar baru (musuh, bos, properti), ubah `KINDS`/`MODELS` bila perlu. Struktur 12 adegan di `film.js` dan jadwal 39 detik tetap.
3. **Ganti teks**: judul pembuka, judul bos, hitungan HUD, teks jurus. Update `window.TEXTS` dengan kotak yang benar dan waktu tampil sesuai aturan 1,5 s + 0,066 s per huruf.
4. **Ganti SFX**: kejadian di `window.EV` + blok `elif ty == …` baru di `mix.py`. Setiap kejadian baru wajib punya suara.
5. **Ganti musik secukupnya**: kunci/riff/jingle pembuka berbeda dari dua acuan (jangan menyalin persis), struktur A–M tetap.
6. **Pertahankan** adegan 3a/3b/3c yang jenisnya berbeda, hening di 21,0 / 24,6 / 26,4–27,3, CTA 31,5–39 yang hampir sama persis.
7. **Tetap jaga**: kesan "satset" (aksi tiap 0,1875 s di montase), tebasan banyak di CTA, tokoh Minyam resmi (jangan digambar ulang), 9:16, tanpa narasi.

## Variasi gaya yang boleh (tetap satu style)
- Aksen tokoh: ikat kepala beda warna, senjata beda (katana, jaring, palu, tameng), pita berkibar.
- Model warna langit baru di `MODELS` (misalnya `space`, `ocean`).
- Properti latar baru (kota, pasar, gunung, lorong, dasar laut) dengan pola `city()` atau `roofs()`.
- Bos dengan gambar baru (struk, monster, robot). Syarat: `mouth`, `eye`, dan bisa dipecah jadi 8 kepingan dengan `CUTS`.
- Tetap putih bersih hijau matcha untuk CTA.
