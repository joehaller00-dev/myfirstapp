#!/bin/bash
# Renders every campaign product film (wide + square) and a review strip for each.
# Usage: ./render_all.sh [parallel jobs, default 3]
cd "$(dirname "$0")" && mkdir -p out review
export NODE_PATH=$(npm root -g)
jq -r '.[] | "\(.title | ascii_downcase | gsub("[^a-z0-9]+";"-")) \(.handle)"' products.raw.json | while read name handle; do
  [ "$name" = "chandra" ] && continue   # Chandra has its own 3D film
  echo "node capture.js $handle 1920 1080 out/$name-wide.mp4 && node capture.js $handle 1920 1080 --stills review/$name-wide.jpg"
  echo "node capture.js $handle 1080 1080 out/$name-square.mp4 && node capture.js $handle 1080 1080 --stills review/$name-square.jpg"
done | xargs -P "${1:-3}" -I{} sh -c '{} 2>&1 | tail -2'
