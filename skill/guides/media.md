# Foto dan video asli (opsional)

Pakai **hanya kalau user memintanya** (atau topiknya jelas butuh gambar nyata: tempat, produk, orang). Sumbernya Pixabay, dengan **kunci API milik user sendiri**.

## Kunci
- Nama: `PIXABAY_API_KEY`, sebagai variabel lingkungan atau satu baris di file `.env` folder kit (`{{KIT}}/.env`).
- Belum ada? Katakan: daftar gratis di pixabay.com/api/docs/, simpan sendiri (jangan kirim ke chat), lalu bilang "sudah". Cek dengan `kit.py doctor` (baris "foto/video Pixabay siap"). Jangan tampilkan kuncinya.
- Tanpa kunci, film tetap dibuat dengan gambar buatan kode; jangan memaksa.

## Mencari dan mengunduh
- `python "{{KIT}}/tools/kit.py" media <proyek> <kata kunci> [--video] [--n 3] [--vertical|--horizontal] [--lang id|en] [--list]`
- `--list` hanya menampilkan hasil (nama, ukuran, pembuat, tag, tautan) tanpa mengunduh: pakai dulu untuk memilih, lalu unduh yang cocok. Kata kunci bahasa Inggris (`--lang en`) biasanya lebih banyak hasilnya.
- Hasil: `<proyek>/media/pixabay-<id>.jpg|mp4`, `media/media.json`, dan `media/CREDITS.md` (pembuat dan tautan). Satu pencarian satu topik adegan; jangan mengunduh puluhan file.
- Batas API: 100 permintaan per menit; kalau kena batas, alat menunggu dan mencoba lagi sendiri.
- Ukuran: foto maksimal 1280 px di sisi terpanjang (batas Pixabay untuk kunci biasa), cukup untuk dipakai sebagai bagian adegan, kurang tajam kalau diperbesar memenuhi layar 1080p. Video diambil versi menengah (sekitar 1080p), biasanya 10-25 MB per klip.

## Memakainya di film
- Rancang dulu adegan mana yang butuh gambar nyata (bukti, tempat, produk, suasana), jangan menaruh stok di setiap adegan.
- **Sesuaikan dengan style**, jangan menempel mentah: ikuti `STYLE.md` (misalnya jadi potongan kertas, titik halftone, cat air, hitam-putih berbutir). Foto di gambar lawas atau kartun harus diolah supaya menyatu.
- Video di halaman render harus **deterministik**: ekstrak dulu jadi urutan gambar dengan ffmpeg (`ffmpeg -i klip.mp4 -vf fps=24,scale=1280:-2 -q:v 3 frames/%04d.jpg`), lalu gambar frame ke-`round(t*24)` di `render(t)`. Jangan mengandalkan `<video>` yang berjalan sendiri.
- Foto/video orang dari stok hanya sebagai **ilustrasi**. Jangan membuatnya seolah orang itu berbicara atau mendukung produk. Untuk video talking head, utamakan rekaman user sendiri (video atau foto + suara), dipotong dan dibingkai sesuai style, dengan caption dan b-roll di sekelilingnya.
- Salin isi `media/CREDITS.md` ke kredit film. Lisensi Pixabay Content License: boleh komersial dan tanpa wajib atribusi, tidak boleh dijual tanpa diubah dan tidak boleh menyiratkan dukungan orang di foto.
