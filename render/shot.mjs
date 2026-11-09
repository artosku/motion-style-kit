// Beberapa screenshot PNG sekaligus:  node render/shot.mjs <folder-video> <folder-keluaran> t1 t2 t3 ...   (t = detik di film)
import path from 'path'; import fs from 'fs';
import { openDemo, closeServer } from './page.mjs';
const dir = path.resolve(process.argv[2]), out = path.resolve(process.argv[3]); fs.mkdirSync(out, { recursive: true });
const { browser, page } = await openDemo(dir, {});
for (const t of process.argv.slice(4)) { await page.evaluate(t => window.render(t), +t); const f = path.join(out, 't' + String(t).replace('.', '_') + '.png'); await page.screenshot({ path: f, type: 'png' }); console.log('ok', f); }
await browser.close(); closeServer();
