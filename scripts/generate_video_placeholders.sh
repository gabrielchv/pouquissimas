#!/usr/bin/env bash
# Generate the placeholder video loops and their poster frames.
# Replace the .mp4/.jpg files in public/media/video with real edits later.
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="public/media/video"
mkdir -p "$OUT"

# name  colour0   colour1   colour2   speed  duration
clips=(
  "bg-loop      0x161a2e 0x554490 0x1e4050 0.030 8"
  "clip-01      0x050608 0x4a2f6e 0x121b2e 0.045 10"
  "clip-02      0x07090a 0x25300c 0x0a1010 0.040 10"
  "clip-03      0x0a0707 0x54291c 0x1a1410 0.050 10"
)

for entry in "${clips[@]}"; do
  read -r name c0 c1 c2 speed duration <<<"$entry"
  ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -i "gradients=s=1280x720:c0=${c0}:c1=${c1}:c2=${c2}:n=3:speed=${speed}:duration=${duration}" \
    -vf "noise=alls=12:allf=t+u,gblur=sigma=1.4,eq=saturation=1.5:brightness=0.06,format=yuv420p" \
    -t "${duration}" -r 24 -c:v libx264 -preset veryfast -crf 30 \
    -movflags +faststart "${OUT}/${name}.mp4"

  ffmpeg -y -hide_banner -loglevel error -ss 2 -i "${OUT}/${name}.mp4" \
    -frames:v 1 -q:v 4 "${OUT}/${name}.jpg"

  echo "wrote ${OUT}/${name}.mp4 + .jpg"
done
