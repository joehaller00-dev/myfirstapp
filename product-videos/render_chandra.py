#!/usr/bin/env python3
"""Render the Chandra (Full Moon Wall Lamp) product-page showcase video.

Built only from the store's real product photos: eased camera moves,
dip-to-dark dissolves, a light-on ramp, soft bloom, vignette and fine grain.
No text is burned in: the theme's "NF product film" section adds the caption.
No generative footage, so the product itself is never altered.

Usage: render_chandra.py <photo_dir> <out.mp4> <width> <height> [--still T out.jpg]
"""
import math
import subprocess
import sys

import numpy as np
from PIL import Image, ImageFilter

SRC, OUT, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
STILL = None
if "--still" in sys.argv:
    i = sys.argv.index("--still")
    STILL = (float(sys.argv[i + 1]), sys.argv[i + 2])

FPS = 30
XF = 0.8  # crossfade seconds
DZ = "lunar-moon-dimmable-led-modern-wall-lamp-wall-sconces-lighting-wall-lightsdazuma-"

# Each shot: file, duration, (cx, cy, zoom) start -> end, in source pixels.
# zoom 1.0 = the largest crop of the output aspect that fits the photo.
SQUARE = W == H
# (file, seconds, wide start, wide end, square start, square end, extras)
_S = [
    ("full-moon-wall-lamp-above-bed.jpg", 5.5, (1033, 1150, 1.0), (1033, 740, 1.1), (1024, 1024, 1.0), (1033, 900, 1.18), dict(fx="lighton")),
    ("full-moon-wall-lamp-11-8-in-3-step-dimming.jpg", 4.2, (1024, 1400, 1.0), (1024, 760, 1.12), (1024, 900, 1.2), (1024, 1024, 1.0), {}),
    ("full-moon-wall-lamp-11-8-in-warm-white.jpg", 4.2, (1110, 650, 1.06), (930, 620, 1.06), (1024, 1024, 1.0), (900, 900, 1.15), {}),
    ("full-moon-wall-lamp-19-7-in-3-step-dimming.jpg", 4.2, (1024, 820, 1.0), (1050, 720, 1.25), (1050, 850, 1.2), (1024, 1024, 1.0), {}),
    (DZ + "832895.jpg", 3.8, (470, 600, 1.0), (560, 620, 1.12), (480, 540, 1.0), (540, 560, 1.1), dict(sharpen=True)),
    ("full-moon-wall-lamp-23-6-in-warm-white.jpg", 4.2, (931, 720, 1.1), (1117, 770, 1.1), (1024, 1024, 1.0), (1100, 900, 1.15), {}),
    ("full-moon-wall-lamp-31-5-in-warm-white.jpg", 4.2, (1024, 1380, 1.0), (1024, 945, 1.0), (1060, 900, 1.18), (1024, 1024, 1.0), {}),
    ("full-moon-wall-lamp-9-4-in-warm-white.jpg", 5.2, (1024, 1300, 1.0), (1024, 780, 1.0), (1024, 1024, 1.0), (900, 980, 1.1), dict(fx="end")),
]
SHOTS = [dict(f=f, d=d, a=(sa if SQUARE else wa), b=(sb if SQUARE else wb), **x) for f, d, wa, wb, sa, sb, x in _S]

t0 = 0.0
for s in SHOTS:
    s["t0"] = t0
    s["img"] = Image.open(f"{SRC}/{s['f']}").convert("RGB")
    t0 += s["d"] - XF
TOTAL = t0 + XF


def ease(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def soft(x):  # gentler ease so moves never fully stop mid-shot
    x = min(1.0, max(0.0, x))
    return 0.5 * x + 0.5 * ease(x)


def frame_of(s, u):
    im = s["img"]
    iw, ih = im.size
    k = soft(u)
    cx = s["a"][0] + (s["b"][0] - s["a"][0]) * k
    cy = s["a"][1] + (s["b"][1] - s["a"][1]) * k
    z = s["a"][2] * (s["b"][2] / s["a"][2]) ** k
    cw = min(iw, ih * W / H) / z
    ch = cw * H / W
    cx = min(max(cx, cw / 2), iw - cw / 2)
    cy = min(max(cy, ch / 2), ih - ch / 2)
    box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
    out = im.transform((W, H), Image.EXTENT, box, Image.BICUBIC)
    if s.get("sharpen"):
        out = out.filter(ImageFilter.UnsharpMask(radius=2.2, percent=60, threshold=2))
    return np.asarray(out, dtype=np.float32) / 255.0


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
r2 = ((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2
VIGNETTE = (1.0 - 0.16 * np.clip(r2, 0, 2) ** 1.2)[..., None]
RNG = np.random.default_rng(7)


def bloom(a, amt):
    small = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    g = np.asarray(small, dtype=np.float32) / 255.0
    g = np.clip(g - 0.72, 0, 1) / 0.28
    g = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(W / 8 * 0.035))
    g = np.asarray(g.resize((W, H), Image.BICUBIC), dtype=np.float32) / 255.0
    return 1.0 - (1.0 - a) * (1.0 - g * amt)  # screen blend


def render(t):
    acc = None
    for s in SHOTS:
        lt = t - s["t0"]
        if lt < 0 or lt >= s["d"]:
            continue
        a = frame_of(s, lt / s["d"])
        if s.get("fx") == "lighton":
            # room at rest, then the lamp comes up
            k = ease((lt - 0.5) / 2.4)
            a = a * (0.13 + 0.87 * k) ** 1.3
        if s.get("fx") == "end":
            a = a * (1 - ease((lt - (s["d"] - 1.1)) / 1.0))  # fade out -> loops into the dark open
        w = 1.0 if s is SHOTS[0] else ease(lt / XF)
        if acc is None:
            acc = a
        else:
            # dissolve that dips slightly darker mid-way, so two lamps never ghost over each other
            acc = (acc * (1 - w) + a * w) * (1 - 0.85 * math.sin(math.pi * w) ** 1.5)
    breath = 0.20 + 0.05 * math.sin(t * 2 * math.pi / 5.0)
    acc = bloom(acc, breath)
    acc = acc * VIGNETTE
    acc = acc + RNG.normal(0, 0.006, (H, W, 1)).astype(np.float32)
    return (np.clip(acc, 0, 1) * 255 + 0.5).astype(np.uint8)


if STILL:
    Image.fromarray(render(STILL[0])).save(STILL[1], quality=92)
    sys.exit(0)

ff = subprocess.Popen([
    "ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
    "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", OUT,
], stdin=subprocess.PIPE)
n = int(round(TOTAL * FPS))
for i in range(n):
    ff.stdin.write(render(i / FPS).tobytes())
ff.stdin.close()
ff.wait()
print(f"{OUT}: {n} frames, {TOTAL:.1f}s")
