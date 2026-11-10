# Film bebas (jalur lemo): standar mutu

Dibuat dari uji nyata: video pertama jelek karena statis, penuh teks, dan style salah pilih. Standar ini wajib.

## 0. Struktur konten (kerangka naskah, urut)
1. **Hook (0-3 detik):** satu kalimat atau gambar yang membuat orang berhenti menggulir.
2. **Taruhan / relevansi (3-8 detik):** kenapa ini penting buat penonton sekarang.
3. **Isi (inti):** poin-poin, tiap poin satu adegan, urut dari yang paling mengejutkan atau berguna.
4. **Puncak / twist:** satu fakta atau pembalikan yang paling diingat.
5. **Penutup + ajakan (3-5 detik):** ringkasan satu kalimat, lalu satu ajakan (follow, simpan, bagikan).
6. **Loop (opsional):** akhir yang nyambung ke hook supaya diputar ulang.

## 0b. Riset
- **Fakta:** cari dari sumber terpercaya (jurnal, lembaga kesehatan/resmi, media bereputasi). Tulis di `FACTS.md`: klaim, sumber, tanggal. Tidak ada sumber = jangan dipakai.
- **Hook:** cari contoh video pendek populer untuk topik sejenis dan analisis publik tentang hook. Ambil POLA-nya, bukan kalimatnya.
- Pola hook yang umum berhasil (jadikan bahan pilihan, bukan jaminan):
  - Pertanyaan yang bikin penasaran: "Kenapa makin capek makin susah tidur?"
  - Klaim berlawanan dengan dugaan: "Tidur 8 jam bukan kuncinya."
  - Angka spesifik: "3 kebiasaan jam 9 malam yang merusak tidurmu."
  - Kesalahan umum: "Kamu salah soal kopi dan tidur."
  - Hasil dulu, caranya kemudian: "Tidur dalam 10 menit, begini caranya."
  - Langsung di tengah cerita atau situasi yang dikenal penonton.
- Tulis 3 hook, pilih satu, dan jelaskan alasannya di TREATMENT.md. Hook harus ditepati isinya (jangan clickbait kosong).
- Jujur: tidak ada yang bisa menjamin viral. Bilang ke user bahwa ini pola yang umum berhasil, hasilnya tergantung banyak hal.

## 1. Pilih style yang cocok
| Jenis topik | Style yang cocok | Hindari |
|---|---|---|
| Tips, gaya hidup, kesehatan, edukasi ringan | cat air, crayon, kertas, kartun lawas, anime, pop-up, midcentury, memphis | Evidence, Visual Investigation, Newsreel, Telestrator |
| Sains, cara kerja, teknik | blueprint, papan tulis, whiteboard, mikroskop, teardown, hologram | gaya arsip |
| Berita, kasus nyata, sejarah | caption news, newsreel, investigasi, telestrator | gaya kartun penuh |
| Data, angka | swiss, infografik, transit map, circuit board | gaya lukisan |
| Produk | glass product, deco, desktop, liminal | gaya arsip |

Kalau pilihan user tidak cocok: bilang satu poin, tawarkan dua alternatif. Kalau tetap dipakai, ubah isi supaya masuk akal di gaya itu (mis. "arsip" diganti "catatan penyelidik" untuk topik tidur).

## 1b. Patokan mutu: DEMO.md style itu
- Buka `$LIB/styles/<slug>/DEMO.md` sebelum menulis TREATMENT. Lihat tabelnya: berapa adegan per menit, berapa detik tiap adegan, tata letak, dan "Native move" (gerakan khas) per adegan.
- Pakai sebagai ukuran kepadatan dan mutu. Jangan memakai ulang cerita, adegan, properti, atau waktunya.
- Rencana gerak kamu harus sama padat atau lebih padat daripada tabel itu. Kalau adegan kamu jauh lebih sedikit atau lebih kosong, tambah.

## 2. Isi per adegan (rencana gerak, ditulis di TREATMENT.md)
Tiap adegan ditulis seperti ini:
- Tujuan satu kalimat.
- Durasi (variasikan: 2 sampai 7 detik, jangan semua sama).
- Latar (lapisan jauh), tengah (subjek), depan (aksen). Tiap lapisan bergerak beda kecepatan = kedalaman.
- Subjek yang digambar: karakter, benda, atau ikon dalam gaya itu. Wajib ada di tiap adegan.
- Gerakan: masuk, tengah (hidup: napas, goyang, kedip, jalan), keluar. Minimal satu elemen bergerak tiap detik.
- Teks: satu judul atau satu kalimat pendek. Bukan paragraf.
- Efek suara: satu per kejadian utama (muncul, geser, benturan, angka naik).
- Transisi ke adegan berikut: ganti-ganti jenis (potong, geser, sapuan, zoom, lipat), jangan satu jenis untuk semua.

## 3. Foto stok (hanya kalau user minta)
- Jangan ditaruh polos sebagai latar. Olah sesuai gaya: potong bentuk, beri bingkai atau tekstur, warna disesuaikan palet, gerak kamera pelan (zoom 3 sampai 8 persen).
- Boleh dipakai sebagai satu elemen komposisi bersama subjek gambar. Kalau tidak bisa menyatu dengan gaya, jangan dipakai.

## 4. Potret 9:16
- Kanvas 1080x1920. Isi penting di area aman: x 0 sampai 904, y 0 sampai 1450 (kanan 176 px dan bawah 470 px dikosongkan).
- Judul di sepertiga atas (y 120 sampai 600). Subjek di tengah (y 500 sampai 1300). Caption di y 1250 sampai 1450.
- Rancang dari nol untuk tegak; STYLE.md biasanya ditulis 16:9, jadi terjemahkan posisinya, jangan dipotong.

## 5. Urutan kerja dan gerbang
1. TREATMENT.md (tiga struktur, pilih satu, alasannya). 2. Rencana gerak per adegan. 3. Look: 2-3 frame contoh, bandingkan dengan STYLE.md. 4. Produksi. 5. Lembar kontak 1 frame per 2 detik dan cek. 6. Perbaiki. 7. Serahkan.
Versi 1 yang statis dibuang dan dibuat ulang, jangan ditambal.

## 6. Daftar cek akhir
- Setiap adegan: ada subjek digambar, ada gerak, teks sedikit.
- Ritme: durasi adegan bervariasi, ada puncak dan jeda.
- Transisi bervariasi, efek suara ada per adegan, musik tidak menutupi suara.
- Potret: tidak ada elemen di zona kosong.
- Jujur ke user bila ada bagian yang masih lemah.
