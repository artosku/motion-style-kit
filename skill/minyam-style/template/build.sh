#!/bin/sh
# Bangun ulang film dengan satu perintah: sh build.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB ke folder lemo-opuscar"; exit 1; }
PY="$LIB/.venv/Scripts/python.exe"; [ -f "$PY" ] || PY="$LIB/.venv/bin/python"
cd "$LIB"
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/hasil.mp4" 24 1
