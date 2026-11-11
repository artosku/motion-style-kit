# Kredit dan lisensi

Kit ini **tidak membuat teknologi baru**. Ia merangkai alat dan aset terbuka supaya orang awam cukup mengetik `/motion-style`. Ini semua yang dipakai.

## Karakter dan logo (hanya nonkomersial)
Karakter **Minyam** dan **nama serta logo Artosku** milik Artosku, dilisensikan CC BY-NC 4.0: **dilarang dipakai komersial**. Lihat [`LICENSE-ASSETS.md`](LICENSE-ASSETS.md).

## Wajib (ada syaratnya)
| Apa | Dipakai untuk | Lisensi | Syarat | Sudah dipenuhi |
|---|---|---|---|---|
| [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) oleh LemoLab | alat render (`render/*.mjs`, `mux.sh`) | MIT | menyertakan pemberitahuan hak cipta dan lisensi | `render/LICENSE-lemo-opuscar` |
| [earshot](https://github.com/Leonxlnx/earshot) oleh Leon Lin | bank efek suara (41 suara yang sudah dirender di `assets/sfx/es_*.wav`) | MIT | menyertakan lisensi | `assets/sfx/LICENSE-earshot` |
| [uisfx](https://github.com/romainsimon/uisfx) oleh Yuki Capital | 5 suara antarmuka (`assets/sfx/ui/`) | kode MIT, audio CC0 | CC0: tanpa syarat. Kode MIT: lisensi disertakan | `assets/sfx/ui/LICENSE-uisfx-*` |
| [Inter](https://github.com/rsms/inter) oleh The Inter Project Authors | font teks di video | SIL OFL 1.1 | font boleh dipakai dan dibagikan bersama kit; teks lisensi ikut font | `engine/fonts/Inter.ttf` (lisensi tertanam di dalam font) |

## Tanpa syarat (tetap dicantumkan karena sopan)
Rekaman nyata dari [Openverse/Freesound](https://openverse.org), semuanya **CC0** (domain publik, boleh dipakai komersial, atribusi tidak wajib), ada di `assets/sfx/ov_*.mp3`:
- "Scissors Snipping in Air" oleh megashroom: https://freesound.org/people/megashroom/sounds/390167
- "Pencil Drawing on Paper" oleh rylandbrooks: https://freesound.org/people/rylandbrooks/sounds/387926
- "Wood Chop 9" oleh wavecal22: https://freesound.org/people/wavecal22/sounds/537434
- "Lego Piece Pressed" oleh 18hiltc: https://freesound.org/people/18hiltc/sounds/203939
- "Paper Flap" oleh amholma: https://freesound.org/people/amholma/sounds/344356
- "Wind Gust" oleh crashoverride6: https://freesound.org/people/crashoverride6/sounds/146932
- "glass chimes loop" oleh arseniiv: https://freesound.org/people/arseniiv/sounds/260017

## Alat yang dipasang pengguna (tidak ikut di repo)
- [Playwright](https://playwright.dev) (Apache-2.0): browser headless untuk menggambar frame.
- [FFmpeg](https://ffmpeg.org): menyusun video dan mengatur loudness.
- numpy, scipy, soundfile, Pillow: pembuatan musik dan lembar kontak.
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (opsional): memotong dan memeriksa rekaman suara.

## Dibuat sendiri
- Musik: disintesis dari kode (gelombang dasar, algoritma Karplus-Strong untuk petikan senar, drum sintetis). Tanpa sampel luar.
- Animasi, 20 style, dan Minyam: kode di `engine/`. `engine/minyam.js` identik dengan kode resmi maskot Artosku.

## Layanan suara (akun milik pengguna sendiri)
Narasi dibuat lewat [ElevenLabs](https://elevenlabs.io) atau [Cartesia](https://cartesia.ai) memakai akun pengguna. Ketentuan atribusi dan pemakaian komersial mengikuti **paket akun dan lisensi suara yang dipilih**. Periksa sebelum memposting video promosi. Kit ini tidak menyertakan suara apa pun.

## Teks siap tempel untuk deskripsi video
```
Suara: ElevenLabs. Efek suara: earshot, uisfx, Freesound (CC0). Musik dibuat dengan kode. Dibuat dengan motion-style-kit (Artosku).
```
Tidak ada kredit yang **wajib** muncul di video untuk aset yang disertakan; teks di atas hanya sopan santun. Atribusi ElevenLabs bisa diwajibkan oleh paket gratis mereka.

## Daftar style lemo-opuscar
`assets/lemo-styles.json` hanya berisi nama dan kategori 66 style dari [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) oleh Lemomo (MIT, konten CC BY 4.0), untuk ditampilkan di `/motion-style-list`. Isi style-nya tidak disalin.
