# Konsep dan naskah (isi `spec.json`)

Semua isi video ditulis di **satu file**: `<folder video>/spec.json`. Mesin dan skrip mengerjakan sisanya. Jangan membaca kode mesin untuk ini.

## Bentuk `spec.json`
```json
{
 "slug": "5-tips-hemat-jajan",
 "title": "5 Tips Hemat Jajan",
 "lang": "id",
 "style": "kertas",
 "mood": "hangat",
 "intro": {"text": "5 tips hemat jajan yang gampang dicoba", "say": "Lima tips hemat jajan... yang gampang dicoba!"},
 "items": [
  {"name": "Bawa bekal dari rumah", "tag": "Lebih murah, lebih sehat.", "obstacle": 1,
   "sfx": [["es:mallet/glock", 0.3, -14]]}
 ],
 "cta": {"say": "Tips mana yang mau kamu coba duluan? Tulis di komentar. Dan follow Artosku... biar uangmu lebih rapi!",
         "head1": "Tips mana yang", "head2": "mau kamu coba?", "mid": "Tulis di komentar.", "button": "Follow Artosku",
         "sub": "Biar uangmu makin rapi.", "footer": "Catat keuanganmu bareng Minyam"}
}
```
| Isian | Aturan |
|---|---|
| `slug` | huruf kecil dan strip, jadi nama folder dan nama file MP4 |
| `title` | judul di panel kiri, maksimal sekitar 28 huruf |
| `lang` | kode bahasa suara: `id`, `en`, dst. Bahasa teks yang ditulis sama dengan bahasa user |
| `style` | satu nama style, daftar nama, atau `campur` (lihat `style.md`). `items[].style` menimpa per poin |
| `mood` | `ceria` `tenang` `semangat` `hangat` `serius` `misterius` (lihat `musik-sfx.md`) |
| `items` | **3 sampai 10 poin** (maksimal 20). Lebih dari 10 membuat video panjang dan daftar padat |
| `items[].name` | nama poin, **2 sampai 4 kata**, tampil di daftar |
| `items[].tag` | penjelasan super singkat, **maksimal 6 kata**, kalimat utuh, titik di akhir |
| `items[].say` | opsional. Isi kalau cara baca beda dari tulisan (lihat "Menulis untuk suara") |
| `items[].obstacle` | 0 sampai 7, rintangan yang dilewati ayam (tabel di bawah) |
| `items[].sfx` | opsional, maksimal 2 suara tambahan: `[kode, detik setelah nama muncul, dB]` |
| `cta.*` | `head1` + `head2` = judul 2 baris (maks sekitar 18 huruf per baris), `mid` = satu kalimat, `button`, `sub`, `footer`. `button` dan `footer` punya isi bawaan Artosku |

## Alur cerita yang bagus
1. **Intro (hook)**: satu kalimat yang menjanjikan sesuatu ("5 tips hemat jajan yang gampang dicoba"). Bukan "Halo semuanya".
2. **Poin**: urut dari yang paling mudah ke yang paling berdampak, atau urutan logis. Satu ide per poin.
3. **CTA**: tanya sesuatu yang gampang dijawab di komentar (nomor favorit, mana yang sudah dicoba), lalu ajak follow. Kalimat suara dan teks layar akhir harus sepadan.

## Menulis untuk suara (penting, memengaruhi kualitas)
- Satu baris suara = `name. tag`. Pendek: 5 sampai 9 kata. Slot minimal per poin 2,4 detik, jadi baris panjang memperpanjang video.
- Angka ditulis huruf di `say` ("lima", "dua puluh style", "sixteen bit"). Singkatan dieja sesuai bunyi.
- Nama asing: tulis ejaan bunyinya di `name_say` (contoh `"name": "Pixel RPG 16-bit"`, `"name_say": "Pixel RPG sixteen bit"`).
- Ekspresi ringan lewat tanda baca: `!` untuk semangat, `...` untuk jeda napas. Jangan semua baris pakai `!`.
- Satu bahasa per baris. Jangan menyisipkan bahasa lain kecuali nama istilah.

## Rintangan (`obstacle`) dan pilihan sesuai topik
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| burung | balon udara | drone | layang-layang | UFO | pesawat kertas | roket | awan petir |
- Pilih yang nyambung dengan poin (uang/naik: balon, roket; ide: pesawat kertas; teknologi: drone, UFO; peringatan: awan petir; santai: burung, layang-layang).
- Jangan memakai rintangan yang sama dua poin berturut-turut.

## Judul tombol dan CTA
- Tombol bawaan: `Follow Artosku` (atau `Follow <handle>` kalau `config.json` di folder kit berisi `{"handle": "@..."}`). Tanya user handle-nya **sekali**, simpan di `config.json`.
- Jangan menjanjikan hal yang tidak ada (diskon, giveaway) di CTA.

## Hal yang tidak boleh
- Mengubah `engine/minyam.js` atau menggambar ulang Minyam dari deskripsi. Logo mengikuti pedoman resmi (sudah ada di mesin).
- Menulis klaim kesehatan/keuangan yang tidak bisa dipertanggungjawabkan. Kalau topiknya sensitif, tulis tips umum saja.
