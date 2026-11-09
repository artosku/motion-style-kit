---
name: motion-style-list
description: Menampilkan daftar 20 style gambar yang tersedia untuk /motion-style, lengkap dengan penjelasan singkat. Pakai saat user mengetik /motion-style-list atau bertanya style apa saja yang ada.
---

# /motion-style-list

Tampilkan daftar style untuk user. Jangan membuat video.

## Langkah
- Jalankan: `python "{{KIT}}/tools/kit.py" styles`
- Kalau folder kit tidak ada, bilang satu poin: "alat belum dipasang, kirim link repo kit dan ketik setup".

## Cara menjawab (wajib)
- Bahasa user. Poin pendek. Tanpa istilah teknis.
- Kelompokkan jadi 4 poin tema, tiap style satu baris `nomor. nama: penjelasan`:
  - Gambar tangan: whiteboard, crayon, watercolor, ink, riso, woodcut
  - Desain grafis: swiss, deco, blueprint, glass, ukiyoe
  - Kartun dan game: pixel, hose, anime, midcentury, papercut
  - Dunia mini: brick, tiltshift, lowpoly, popup
- Tandai yang paling kuat dengan ★: watercolor, pixel, hose, anime, swiss.
- Tutup dengan 2 poin:
  - "Pakai: `/motion-style <style> <topik>`, contoh `/motion-style pixel 5 tips hemat jajan`"
  - "Style boleh dikosongkan, nanti ditawari pilihan."
- Jujur: ayam di riso, woodcut, blueprint, papercut paling lemah; brick, tiltshift, lowpoly, popup adalah pendekatan 2D.
