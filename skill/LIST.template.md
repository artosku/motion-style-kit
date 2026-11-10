---
name: motion-style-list
description: Menampilkan daftar 66 style yang bisa dibuat dengan /motion-style (kertas, cat air, pixel, berita, infografik, dst.), per kategori. Pakai saat user mengetik /motion-style-list atau bertanya style apa saja yang ada.
---

# /motion-style-list

Tampilkan daftar style untuk user. Jangan membuat video.

## Langkah
- Jalankan `python "{{KIT}}/tools/kit.py" styles` (66 style bernomor 1-66, dengan penjelasan singkat).
- Boleh juga `python "{{KIT}}/tools/kit.py" styles --lemo` untuk pengelompokan per kategori koleksi lemo-opuscar.
- Kalau folder kit tidak ada, bilang satu poin: "alat belum dipasang, kirim link repo kit dan ketik setup".

## Cara menjawab (wajib)
- Bahasa user. Poin pendek. Tanpa istilah teknis.
- Satu baris per style `nomor. nama: penjelasan pendek`, dikelompokkan supaya mudah dipindai:
  - **1-20, gambar dan kartun klasik:** whiteboard, crayon, watercolor, ink, riso, woodcut, swiss, deco, blueprint, glass, pixel, hose, anime, midcentury, papercut, ukiyoe, brick, tiltshift, lowpoly, popup.
  - **21-40, berita, dokumenter, dan data:** caption news, newsreel, countdown, investigasi, telestrator, satelit, lidar, teardown, mikroskop, impasto, one-line, urban sketch, papan tulis, dst.
  - **41-60, cetak, sains, dan tampilan digital:** shadow puppetry, halftone, engraving, silkscreen, ASCII, hologram, transit map, circuit board, HD-2D, dst.
  - **61-66:** game show, film bisu, liminal found footage, glass product, memphis, desktop.
- Tandai ★ untuk yang paling kuat: watercolor, pixel, hose, anime, swiss.
- Jelaskan jujur dalam 3 poin:
  - Semua 66 bisa langsung dibuat lewat `/motion-style`, dengan Minyam, dalam 16:9 atau potret 9:16.
  - Mesin hanya 2D: style bernuansa 3D (isometrik, HD-2D, brick, low-poly) adalah pendekatan 2D.
  - Style yang masih lemah ada di kolom "Catatan jujur" pada `guides/style.md` (misalnya Shadow Puppetry, Copperplate Engraving, ASCII, Dark Tech Keynote, Chalkboard).
- Tutup dengan: "Pakai: `/motion-style <style> <topik>`, contoh `/motion-style pixel 5 tips hemat jajan`. Style boleh dikosongkan, boleh pakai nomor."
