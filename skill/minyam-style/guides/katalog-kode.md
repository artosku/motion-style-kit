# Katalog kode acuan

Semua nomor baris merujuk ke file di `{{SKILL}}/reference/`. Jangan menulis ulang yang sudah ada; **salin fungsinya** lalu ubah isinya.

Dua set kode:
- `reference\samurai\`: tokoh bersenjata katana, monster `monster()`, bos struk `boss()`, tebasan, puncak jurus. Cocok untuk konsep **pertarungan**.
- `reference\kejar-uang\`: kerangka yang sama (disalin dari samurai) dengan: katana diganti jaring penangkap, ikat kepala biru, latar kota `city()`, uang bersayap `bill()`, dompet, peti, tenda, tagihan, bos `bigMon()` (monster mulut besar), adegan lari/tendang dinding/atap/kabel/pasar, jurus jaring catatan. Cocok untuk konsep **kejar-kejaran / parkour / menangkap**. **Mulai dari yang ini** kalau tidak yakin.

## art.js (alat gambar, kedua set sama kecuali yang ditandai)
| Butuh | Fungsi (kejar-uang) | Isi |
|---|---|---|
| Kanvas, ukuran, kuantisasi | baris 4–9 | `W,H,GY`, `X` (warna), `G` (cahaya), `T` (sementara), `q12/q8`, warna `INK, MATCHA9, MATCHA5, NEON` |
| Model warna langit | `MODELS` baris ±13 | `day, dusk, dark, dawn` (sky, cl, far, mid, gr, sun, sunG, win) |
| Plat langit | `buildPlates()` baris 20 | awan airbrush, simpan di `PL[model]` |
| Latar bukit | `bg(model,o)` 39 | `o`: `cam, ox, sunX/sunY/sunR, between` |
| Latar kota | `city(model,o)` 58 (hanya kejar-uang) | dua lapis gedung dengan jendela, `o` sama dengan `bg` |
| Tanah bergulir | `ground(model,o)` 78 | `o.y, ox, cam` |
| Tokoh | `hero(o)` 116 | `o`: `x,y,s,t,pose,kat,glow,rot,ghost:{col,a,mix},wind,shadow`. `kat` = sudut senjata (null = tanpa). `ghost` = bayangan susul berwarna |
| Senjata | `katana` 103 (kejar-uang: jaring) | digambar lewat hook sayap; `katanaGlow` untuk menyala |
| Ikat kepala | `ribbon, band` 92–100 | warna di `ribbon`/`band` (merah di samurai, biru di kejar-uang) |
| Monster kecil | `monster/mon` 145/161, `KINDS` 137 | 8 jenis, label teks kecil (`o.notag` hilangkan) |
| Belah dua | `split(fn,cx,cy,ang,d,rot,drop)` 163 | menggambar `fn(c)` terbelah di garis sudut `ang` |
| Bos | samurai: `boss(c,x,y,s,o)` 151; kejar-uang: `bigMon` 235 | `o.mouth,eye,hl,hr,scars` / `o.mouth,eye,eyesOnly,inner` |
| Properti kejar-uang | `bill` 173, `wallet` 191, `crate` 203, `awning` 212, `slab` 221 | uang bersayap (flap), dompet (open 0..1), peti, tenda, tagihan |
| Tebasan garis | `slash(x,y,ang,len,k,w,edge,core)` 266 | k 0..1, jejak menyala lalu pudar |
| Tebasan busur | `arcSlash(cx,cy,r,a0,a1,k,th,edge)` 275 | |
| Garis radial | `radial(cx,cy,t,n,col,al,r0)` 283 | latar puncak |
| Garis kecepatan | `lines(t,n,col,al,vert,speed)` 288 | horizontal atau vertikal |
| Percikan | `sparks(x,y,k,n,seed,col,R)` 293 | |
| Koin | `coin(x,y,r,ph)` 299 | |
| Bintang kilau | `star(x,y,r,k,col)` 305 | |
| Debu | `dust(x,y,k,n,seed,col)` 309 | |
| Judul krom | `chrome(text,x,y,size,k,o)` 316 | `o.align,neon,grad` |
| Logo resmi | `logoPrimer(ctx,x,y,h)`, `logoW(h)` 329/335 | **jangan ubah** |

Pola dua kanvas: fungsi menggambar ke `X` dan `G`. Bentuk besar yang menghalangi cahaya digambar hitam ke `G`.

## film.js, alat bantu (kejar-uang, baris 14–47)
`each, zoom, BM (bos), fillAll, impact(), darkBg, label, flap, flock, stream, snatch, roofs, RUN(t)`.
- `impact()` 18: siluet monokrom terbalik dari `sc` ke `T`, lalu putih `.22` di `G`.
- `flock()` 25: kawanan uang melayang. `stream()` 28: uang tersedot berputar. `snatch()` 32: monster menyambar target (muncul label "-50RB").
- `roofs(off)` 38: atap berulang periode 900 px (640 atap + 260 celah) dengan cerobong dan jendela.

## film.js, adegan (resep siap salin)
| Pola | Kejar-uang | Samurai | Catatan |
|---|---|---|---|
| Pembuka dengan tokoh senang + judul | `s1` 50 | `s1` 24 (crane + gerombolan menyala) | `zoom` pelan, judul dari `overlay` |
| Close-up mata | `eyesCU` 68, `s2` 74 | `eyesCU` 43, `s2` 49 | mata 3 tahap (`eyeOpen` .06/.38/.72/1), pita cahaya `soft-light` |
| Lari samping + aksi per 1/8 | `s3a` 86 (lompat peti/merunduk tenda) | `s3a` 63 | `HIT_A(i)`, ghost 3, `snatch` / `split` |
| Zig-zag + aksi tertunda + impact | `s3b` 113 (tendang dinding) | `s3b` 85 (kilat zig-zag + terbelah serentak) | kejar-uang: 7 tendangan `KT(j)`; samurai: `ZV` titik zig-zag |
| Vertikal | `s3c` 139 (atap + kabel) | `s3c` 103 (putar naik) | `rot`, cincin hijau, `lines(…true)` |
| Mendarat | `s3d` 167 (pasar) | `s3d` 119 (belahan jadi koin) | squash + debu + bintang + gelap |
| Bos masuk | `s4` 186 | `s4` 134 | `ss(seg())`, `radial`, cincin kejut, `roar` |
| Bos menang | `s5` 204 (tagihan, rebut uang, ditelan) | `s5` 150 (cakar, tebasan mental, terpental) | hantaman bertarget, ghost, `slab` |
| Mengisi jurus | `s6` 243 (dalam perut) | `s6` 183 | mata, rumput hijau, `glow` |
| Jurus pamungkas | `s7` 287 (jaring tabel + uang masuk kotak) | `s7` 207 (44 tebasan + 8 kepingan) | `CUTS` 3 garis → 8 kepingan; `grid`, `caught` untuk jaring |
| Fajar | `dawn` 326 (uang turun ke 4 tumpukan) | `dawn` 254 (hujan koin) | `zoom` keluar |
| CTA | `cta` 345, `s9` 369 | `cta` 264, `s9` 286 | **hampir sama persis**; salin dan ganti teks/tokoh |

## film.js, jadwal dan overlay (baris 390 ke bawah)
- `SCENES = [[0,s1],[3,s2],[4.5,s3a],[6.75,s3b],[8.25,s3c],[10.5,s3d],[12,s4],[16.5,s5],[21,s6],[24,s7],[28.5,dawn],[31.5,s9]]`.
- `SHAKE = [[t0, kekuatan, durasi, flat?], …]`, `FLASH = [[t0, durasi], …]`.
- `overlay(t)`: judul krom + HUD. `window.TEXTS(t)`: daftar teks untuk `readcheck`. `window.DUR = 39`.
- `window.EV`: daftar kejadian suara `{t, type, …}`; disusun lalu `sort`.
- `window.render(t)`: urutan wajib ada di `guides\playbook.md` bagian 4.2.

## mix.py (musik + SFX)
- Bagian dibuka dengan huruf (A … M) per rentang waktu; ubah di dalam bagian yang sama, jangan menambah mixer baru.
- Instrumen: `kick, snare, hat, tom, crash, bass, brass, fm, ep, pad`. Bantu: `groove(t0, root, chord, …)` (4 ketuk), `pop(t0, root, ch, half)` (city-pop).
- SFX: blok `for e in EV:` dengan `elif ty == …`. Bank earshot dibaca lewat `BK[...]`.
- Master: `mute()` untuk hening, `duckat()`, pemotong bas, normalisasi, `sfx.limit`. Cetak statistik bas vs tengah dan rms hening.
- Tulis keluaran ke `<proyek>\out\mix.wav`; `build.sh` yang menggabungkan.

## build.sh
`events.mjs` (ambil `window.EV` jadi `events.json`) → `video.mjs` (gambar 24 fps, 4 pekerja) → `mix.py` → `mux.sh` (gabung + normalisasi). Ganti nama hasil di baris terakhir.
