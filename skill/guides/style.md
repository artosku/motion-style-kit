# Katalog 20 style

Pilih style dari **suasana topik**, bukan dari selera acak. Satu style dipakai untuk satu video (paling rapi), atau `campur` untuk beberapa style bergantian.

| No | id | Nama | Kesan | Cocok untuk | Catatan jujur |
|---|---|---|---|---|---|
| 1 | `whiteboard` | Whiteboard Explainer | bersih, hitam-putih, seperti dijelaskan guru | edukasi, tutorial, penjelasan konsep |  |
| 2 | `crayon` | Crayon Picture Book | hangat, mirip buku cerita anak | anak, cerita, parenting, pendidikan dasar |  |
| 3 | `watercolor` | Watercolor Brush | lembut, warna meleber | gaya hidup, kesehatan, ketenangan, kuliner lembut |  |
| 4 | `ink` | Chinese Ink Wash | elegan, hitam-putih, tenang | budaya, filosofi, tenang, premium |  |
| 5 | `riso` | Risograph Print | mencolok, tegas, anak muda | anak muda, komunitas, event, zine | ayam kurang matang |
| 6 | `woodcut` | Woodcut Print | kuat, kontras tinggi | sejarah, tradisi, pesan tegas | ayam kurang matang |
| 7 | `swiss` | Swiss Motion Graphics | profesional, rapi, tegas | bisnis, data, teknologi, korporat |  |
| 8 | `deco` | Art Deco | mewah, klasik, elegan | produk mewah, perayaan, fashion, perbankan |  |
| 9 | `blueprint` | Blueprint | teknis, serius, rapi | teknik, rencana, cara kerja, startup | ayam kurang matang |
| 10 | `glass` | Stained Glass | indah, warna-warni, megah | perayaan, religi, seni, momen spesial |  |
| 11 | `pixel` | Pixel RPG 16-bit | nostalgia game, seru | game, teknologi, nostalgia, tantangan |  |
| 12 | `hose` | Rubber Hose Cartoon | lucu, kenyal, lawas | hiburan, humor, cerita lucu |  |
| 13 | `anime` | 80s Cel Anime | nostalgia, dramatis | nostalgia, drama, cerita, hiburan anak muda |  |
| 14 | `midcentury` | Mid-century Cartoon | klasik, ramah, datar | edukasi ramah, gaya hidup, tips harian |  |
| 15 | `papercut` | Red Paper-cut | tradisional, meriah | tradisi, perayaan, cerita, DIY (paling matang) | ayam kurang matang (tapi latar kuat) |
| 16 | `ukiyoe` | Ukiyo-e | tenang, klasik, artistik | budaya Jepang, alam, seni, perjalanan |  |
| 17 | `brick` | Brick Toy | main-main, ceria | anak, mainan, membangun, langkah bertahap | pendekatan 2D |
| 18 | `tiltshift` | Tilt-Shift Miniature | manis, imut, santai | kota, perjalanan, rutinitas, "dunia kecil" | pendekatan 2D |
| 19 | `lowpoly` | Low-poly Island | modern, ringan, tenang | alam, teknologi ringan, startup, modern | pendekatan 2D |
| 20 | `popup` | Paper Pop-up Book | magis, ceria, bercerita | cerita, buku, edukasi anak, perkenalan produk | pendekatan 2D |

## Cara user menyebut style
- Boleh pakai id, nama, nomor, atau sebutan umum: `kertas`, `lego`, `cat air`, `8 bit`, `kartun lawas`, `miniatur`.
- Sistem mengenali sebutan itu sendiri (`python "{{KIT}}/tools/kit.py" styles` menampilkan daftar). Kalau tidak dikenali, build berhenti dan menyebut pilihan yang ada.
- `campur`: semua poin memakai style berbeda (lihat transisi gambar antar poin). Cocok kalau user ingin "pamer variasi".

## Kalau user tidak menyebut style
- Tanya sekali, 4 pilihan: **3 style yang paling cocok dengan topik** (tandai yang paling cocok dengan ★) + `campur`. Beri satu kalimat pendek per pilihan.
- Jangan menampilkan seluruh 20 kecuali diminta ("lihat semua").

## Batasan jujur (sampaikan kalau relevan)
- Hanya 16:9 (YouTube, presentasi). Vertikal 9:16 belum didukung.
- Ayam di riso, woodcut, blueprint, paper-cut paling lemah. Brick, tilt-shift, low-poly, pop-up adalah pendekatan 2D, bukan 3D sungguhan.
- Karakternya selalu Minyam (maskot Artosku). Maskot lain belum didukung.
- Font Inter: huruf Latin saja (tidak ada Mandarin/Jepang/Arab).
