"""Pasang perintah /motion-style ke Claude Code (dan agen lain yang membaca folder skills).
   python tools/kit.py install-skill [folder-tujuan]     bawaan: ~/.claude/skills
Isi SKILL.md dan guides disalin dengan path kit yang benar, jadi skill berdiri sendiri.
   Juga memasang /minyam-style (skill/minyam-style/: panduan, kode acuan, template)."""
import os, shutil, sys
from kitlib import KIT

dest_root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser('~'), '.claude', 'skills')
dest = os.path.join(dest_root, 'motion-style'); kit = KIT.replace(chr(92), '/')
if os.path.isdir(dest): shutil.rmtree(dest)
os.makedirs(os.path.join(dest, 'guides'))
def put(src, dst):
    open(dst, 'w', encoding='utf-8').write(open(src, encoding='utf-8').read().replace('{{KIT}}', kit))
put(os.path.join(KIT, 'skill', 'SKILL.template.md'), os.path.join(dest, 'SKILL.md'))
for f in os.listdir(os.path.join(KIT, 'skill', 'guides')):
    put(os.path.join(KIT, 'skill', 'guides', f), os.path.join(dest, 'guides', f))
lst = os.path.join(dest_root, 'motion-style-list')
if os.path.isdir(lst): shutil.rmtree(lst)
os.makedirs(lst); put(os.path.join(KIT, 'skill', 'LIST.template.md'), os.path.join(lst, 'SKILL.md'))
# /minyam-style: penanda {{SKILL}} {{VIDEOS}} {{KIT}} {{LIB}} {{HOME}} diisi path komputer ini
ms_src, ms_dst = os.path.join(KIT, 'skill', 'minyam-style'), os.path.join(dest_root, 'minyam-style')
if os.path.isdir(ms_src):
    home = os.path.expanduser('~').replace(chr(92), '/')
    rep = {'{{SKILL}}': ms_dst.replace(chr(92), '/'), '{{VIDEOS}}': home + '/Videos/video-style', '{{KIT}}': kit, '{{LIB}}': home + '/lemo-opuscar', '{{HOME}}': home}
    if os.path.isdir(ms_dst): shutil.rmtree(ms_dst)
    for root, _, files in os.walk(ms_src):
        for f in files:
            sp = os.path.join(root, f); rel = os.path.relpath(sp, ms_src); rel = 'SKILL.md' if rel == 'SKILL.template.md' else rel
            dp = os.path.join(ms_dst, rel); os.makedirs(os.path.dirname(dp), exist_ok=True)
            if os.path.splitext(f)[1].lower() in ('.md', '.js', '.py', '.sh', '.html', '.txt') or f == 'CREDITS':
                t = open(sp, encoding='utf-8').read()
                for k, v in rep.items(): t = t.replace(k, v)
                open(dp, 'w', encoding='utf-8', newline=chr(10)).write(t)
            else: shutil.copyfile(sp, dp)
    print('terpasang:', ms_dst.replace(chr(92), '/'), '| ketik /minyam-style')
print('terpasang:', dest.replace(chr(92), '/'), '| ketik /motion-style dan /motion-style-list di Claude Code (buka sesi baru kalau belum muncul)')
