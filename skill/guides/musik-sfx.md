# Musik dan efek suara

Semua dibuat otomatis dari `mood` dan style. Tugasmu hanya memilih `mood` yang pas dan, kalau perlu, 1 sampai 2 suara tambahan per poin.

## Musik
- Musik **dibuat dari kode**, satu lagu. Yang berubah: **nada instrumen mengikuti style** (misalnya Pixel terdengar 8-bit, Watercolor lembut), dan **tempo, nada dasar, akor, melodi mengikuti `mood`**.
- Musik otomatis merendah saat narasi bicara.

| mood | Rasa | Cocok untuk | Tempo |
|---|---|---|---|
| `ceria` | riang, ringan (lagu asli film contoh, ditulis tangan) | tips, hiburan, produk | 120 |
| `tenang` | santai, lega | kesehatan, relaksasi, mindfulness | 90 |
| `semangat` | cepat, padat | tantangan, olahraga, promo | 132 |
| `hangat` | akrab, nostalgia | keluarga, cerita, kebiasaan | 100 |
| `serius` | mantap, fokus | bisnis, keuangan, edukasi serius | 104 |
| `misterius` | penasaran | fakta unik, rahasia, teknologi | 96 |

- Pilih satu mood dari topik. Kalau ragu: `ceria` (paling matang, ditulis tangan). Mood lain dibuat otomatis dengan aturan musik (nada kuat = nada akor, jadi tidak sumbang), tapi belum sehalus `ceria`. Beri tahu user kalau memakai mood lain.
- Opsional di `spec.json`: `"bpm": 110` dan `"key": 0..11` (0 = C, 2 = D, 9 = A) untuk menimpa tempo dan nada dasar.

## Efek suara
Sudah otomatis: transisi antar poin, "pop" saat nama muncul, suara khas bahan tiap style (gunting untuk paper-cut, pensil untuk whiteboard, klik Lego untuk brick, dst.), lewatnya rintangan, angin jatuh, dan penutup CTA. **Jangan menambah banyak.** Suara tambahan hanya untuk momen yang memang perlu ditekankan.

Format di `items[].sfx`: `["jenis:nama", detik_setelah_nama_muncul, dB]`. Volume lazimnya -12 sampai -16.

| Kebutuhan | Pilihan (`es:` = bank earshot, `ov:` = rekaman nyata, `ui:` = suara antarmuka) |
|---|---|
| Berhasil, uang, penting | `es:pro_notify/ding_1930`, `es:pro_notify/ding_2296`, `es:mallet/flourish`, `es:mallet/celesta`, `es:mallet/glock`, `es:shimmer/m1`, `es:logo_sting/zip_ping`, `ui:dreamy/reward`, `ui:arcade/level-up` |
| Muncul, kejutan kecil | `es:ui_pop/boop`, `es:ui_pop/blip`, `es:ui_pop/soft`, `es:pro_pop/bloop`, `es:pro_pop/chirp`, `es:pro_pop/double`, `ui:rubber/reaction` |
| Klik, tombol, mekanik | `es:click/snap`, `es:click/thock`, `es:toggle/latch`, `es:hover_tick/detent`, `es:pro_hover_tick/ping`, `es:pro_click/glass`, `es:pro_tap/knock`, `ui:mechanical/press`, `ui:minimal/select` |
| Air, kayu, alam, lembut | `es:drip/drop`, `es:drip/bloop`, `es:knock/wood`, `es:fit/hit/bamboo_tok`, `es:pluck/kalimba`, `es:mallet/marimba`, `es:mallet/pluck`, `es:fit/bell/small_bell`, `ov:ov_glass`, `ov:ov_wind` |
| Gerak, lewat cepat | `es:whoosh_fast/crisp`, `es:whoosh_fast/tight`, `es:whoosh_fast/whistle`, `es:whoosh_big/jet`, `es:whoosh_big/gust`, `es:swipe/paper`, `es:swipe/velvet`, `es:swipe/cloth`, `es:pro_zip/up`, `es:pro_zip/down`, `es:downlifter/air_fall` |
| Benturan, foto | `es:pro_impact/short`, `es:shutter/film` |
| Rekaman nyata | `ov:ov_scissors`, `ov:ov_pencil`, `ov:ov_woodchop`, `ov:ov_lego`, `ov:ov_paper` |

- Nama di luar tabel tidak ada: skrip akan mencetak `! SFX tidak ada`. Perbaiki sebelum lanjut.
- Satu poin: maksimal 2 suara tambahan, jangan di detik yang sama dengan nama yang sedang dibacakan lebih dari 0,3 detik pertama (menutupi suara).
- Kalau user minta suara yang tidak ada di daftar: bilang jujur, tawarkan yang paling mirip.
