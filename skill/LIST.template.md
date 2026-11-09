---
name: motion-style-list
description: Menampilkan semua style yang tersedia: 20 style siap pakai di /motion-style dan 66 style referensi dari lemo-opuscar. Pakai saat user mengetik /motion-style-list atau bertanya style apa saja yang ada.
---

# /motion-style-list

Tampilkan daftar style untuk user. Jangan membuat video.

## Langkah
- Jalankan dua perintah:
  - `python "{{KIT}}/tools/kit.py" styles` (20 style siap pakai)
  - `python "{{KIT}}/tools/kit.py" styles --lemo` (66 style dari lemo-opuscar, per kategori)
- Kalau folder kit tidak ada, bilang satu poin: "alat belum dipasang, kirim link repo kit dan ketik setup".

## Cara menjawab (wajib)
- Bahasa user. Poin pendek. Tanpa istilah teknis.
- **Bagian 1: siap dibuat sekarang (20 style)**, satu baris per style `nomor. nama: penjelasan`, dikelompokkan:
  - Gambar tangan: whiteboard, crayon, watercolor, ink, riso, woodcut
  - Desain grafis: swiss, deco, blueprint, glass, ukiyoe
  - Kartun dan game: pixel, hose, anime, midcentury, papercut
  - Dunia mini: brick, tiltshift, lowpoly, popup
  - Tandai ★ untuk yang paling kuat: watercolor, pixel, hose, anime, swiss.
- **Bagian 2: koleksi lemo-opuscar (66 style)**, per kategori, nama saja (tanpa penjelasan panjang). Kategori: Edit & Documentary, Evidence Films, Hand-drawn & Painting, Information & Keynote, Graphic & Type, Materials & 3D, Print & Printmaking, East Asian Traditions, Cartoon & Anime, Games, Cinema & Eras.
- Jelaskan jujur dalam 3 poin:
  - 20 style di bagian 1 bisa langsung dibuat lewat `/motion-style`, dengan Minyam.
  - 66 style di bagian 2 adalah koleksi referensi dari lemo-opuscar. Pembuatannya lewat plugin lemo-opuscar sendiri (lama dan butuh banyak token), belum lewat `/motion-style`.
  - Kalau user mau salah satu dari 66: bilang style mirip mana yang ada di 20, atau tawarkan memasang plugin lemo-opuscar (izin dulu).
- Tutup dengan: "Pakai: `/motion-style <style> <topik>`, contoh `/motion-style pixel 5 tips hemat jajan`. Style boleh dikosongkan."
- Jujur: ayam di riso, woodcut, blueprint, papercut paling lemah; brick, tiltshift, lowpoly, popup adalah pendekatan 2D.
