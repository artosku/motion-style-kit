"""Pasang perintah /motion-style ke Claude Code (dan agen lain yang membaca folder skills).
   python tools/kit.py install-skill [folder-tujuan]     bawaan: ~/.claude/skills
Isi SKILL.md dan guides disalin dengan path kit yang benar, jadi skill berdiri sendiri."""
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
print('terpasang:', dest.replace(chr(92), '/'), '| ketik /motion-style dan /motion-style-list di Claude Code (buka sesi baru kalau belum muncul)')
