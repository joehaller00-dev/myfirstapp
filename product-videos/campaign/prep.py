#!/usr/bin/env python3
"""Prepare per-product film data for the campaign product films.

For each product in products.raw.json: classify its photos from alt text and
pixels, download what the film needs, find the light sources in each room
photo, and write data/<handle>.json for film.html.

Usage: prep.py [handle ...]      (no args = every product)
"""
import io
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
DATA = os.path.join(HERE, "data")
os.makedirs(IMG, exist_ok=True)
os.makedirs(DATA, exist_ok=True)

SKIP_ALT = ("energy efficiency", "customer review", "dimension diagram", "size chart", "diagram of", "installation",
            "infographic", "comparison", "what's in the box", "in the box", "remote control with", "specification")
SKIP_FILE = ("-callout", "overlay_", "nf-card", "nf-size", "nf-dim")
STUDIO_ALT = ("white background", "on white", "on a white", "backdrop", "gray background", "grey background", "plain background")
DIM_LABEL = {"w": "W", "d": "D", "h": "H", "dia": "Dia", "len": "L", "thk": "Thick"}


def fetch(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 2000:
        return True
    for _ in range(3):
        r = subprocess.run(["curl", "-sS", "-m", "60", "-o", path, url], capture_output=True)
        if r.returncode == 0 and os.path.exists(path) and os.path.getsize(path) > 2000:
            return True
    return False


def blobs(lum, thr):
    """Connected bright regions on a small luminance grid -> [(cx, cy, r, area)] in 0..1 units."""
    h, w = lum.shape
    mask = lum >= thr
    seen = np.zeros_like(mask)
    out = []
    for y0, x0 in zip(*np.where(mask)):
        if seen[y0, x0]:
            continue
        stack, pts = [(y0, x0)], []
        seen[y0, x0] = True
        while stack:
            y, x = stack.pop()
            pts.append((y, x))
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
        if len(pts) >= 5:
            p = np.array(pts, float)
            out.append((float(p[:, 1].mean() / w), float(p[:, 0].mean() / h), float(np.sqrt(len(pts) / np.pi) / w), len(pts)))
    return sorted(out, key=lambda b: -b[3])


def analyse(path):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    a = np.asarray(im.resize((128, 128), Image.BILINEAR), dtype=np.float32) / 255.0
    lum = a @ np.array([0.3, 0.55, 0.15], dtype=np.float32)
    # white-background studio shot: the border ring is near-white and flat
    ring = np.concatenate([lum[:6].ravel(), lum[-6:].ravel(), lum[:, :6].ravel(), lum[:, -6:].ravel()])
    sat = (a.max(axis=2) - a.min(axis=2))
    ring_sat = np.concatenate([sat[:6].ravel(), sat[-6:].ravel(), sat[:, :6].ravel(), sat[:, -6:].ravel()])
    white_bg = bool(np.mean(ring > 0.93) > 0.9 and ring_sat.mean() < 0.03)
    sm = np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)), dtype=np.float32) / 255.0
    med, peak = float(np.median(lum)), float(np.percentile(sm, 99.6))
    night = med < 0.36 and peak > 0.72
    src = []
    if night:
        for cx, cy, r, area in blobs(sm, max(0.72, peak * 0.9))[:3]:
            src.append([round(cx, 4), round(cy, 4), round(max(r, 0.02), 4)])
    if src:
        wts = np.array([s[2] ** 2 for s in src])
        focus = [float(np.dot([s[0] for s in src], wts) / wts.sum()), float(np.dot([s[1] for s in src], wts) / wts.sum())]
    else:
        focus = [0.5, 0.5]
    return dict(w=W, h=H, white_bg=white_bg, med=round(med, 3), peak=round(peak, 3), night=night, src=src,
                focus=[round(focus[0], 4), round(focus[1], 4)], contrast=round(peak - med, 3))


def dim_rows(chart):
    rows = []
    if not chart:
        return rows
    def fmt(d):
        return "  ×  ".join(f"{DIM_LABEL.get(k, k)} {v}" for k, v in d.items())
    for v in chart.get("variants", []):
        rows.append([v["key"].replace("''", '"'), fmt(v["dims"])])
    if not rows and chart.get("overall"):
        rows.append(["Overall", fmt(chart["overall"])])
    return rows


def prep(p):
    handle = p["handle"]
    d = os.path.join(IMG, handle)
    os.makedirs(d, exist_ok=True)
    cands = []
    for i, m in enumerate(p["media"]["nodes"]):
        if m.get("mediaContentType") != "IMAGE" or not m.get("image"):
            continue
        url = m["image"]["url"]
        fname = url.split("/")[-1].split("?")[0]
        alt = (m.get("alt") or "").lower()
        if any(s in alt for s in SKIP_ALT) or any(s in fname.lower() for s in SKIP_FILE):
            continue
        ext = os.path.splitext(fname)[1].lower() or ".jpg"
        local = os.path.join(d, f"{i:02d}{ext}")
        cands.append(dict(i=i, url=url, alt=m.get("alt") or "", fname=fname, local=local, file=f"img/{handle}/{i:02d}{ext}"))
    with ThreadPoolExecutor(8) as ex:
        ok = list(ex.map(lambda c: fetch(c["url"], c["local"]), cands))
    cands = [c for c, o in zip(cands, ok) if o]
    for c in cands:
        try:
            c.update(analyse(c["local"]))
        except Exception as e:  # unreadable image
            c["bad"] = str(e)
    cands = [c for c in cands if "bad" not in c]
    for c in cands:
        alt = c["alt"].lower()
        if c["white_bg"] or any(s in alt for s in STUDIO_ALT):
            c["kind"] = "studio" if c["white_bg"] else "studio-tint"
        elif alt.startswith("close-up") or alt.startswith("close up") or "detail of" in alt:
            c["kind"] = "closeup"
        else:
            c["kind"] = "room"
    rooms = [c for c in cands if c["kind"] == "room"]
    # best rooms first: lit scenes with a clear light source, larger photos preferred
    def score(c):
        return (1.2 if c["w"] >= 1600 else 0.0) + (0.2 if c["w"] >= 1080 else 0.0) + (0.8 if c["night"] and c["src"] else 0.0) + c["contrast"]
    rooms.sort(key=score, reverse=True)
    def studio_score(c):   # a single clean product shot, lit if possible; not a chart or a parts photo
        alt = c["alt"].lower()
        bad = any(k in alt for k in ("inset", "chart", "marker", "styles a", "parts", "included", "remote", "cable", "back view", "rear"))
        named = any(k in alt for k in STUDIO_ALT)
        return (-3 if bad else 0) + (1.5 if named else 0) + (0.6 if ("lit" in alt.split() or "glowing" in alt or "lit," in alt) else 0) + min(c["w"], 2048) / 2048
    studio = sorted([c for c in cands if c["kind"] == "studio"], key=studio_score, reverse=True)
    closeups = sorted([c for c in cands if c["kind"] == "closeup"], key=lambda c: -c["w"])
    keep = lambda c: {k: c[k] for k in ("file", "alt", "w", "h", "night", "src", "focus", "kind")}
    chart = json.loads(p["dimChart"]["value"]) if p.get("dimChart") else None
    out = dict(
        handle=handle, title=p["title"], subtitle=p["subtitle"]["value"] if p.get("subtitle") else "",
        type=re.sub(r"^.*> ", "", p["productType"]),
        highlights=json.loads(p["highlights"]["value"]) if p.get("highlights") else [],
        rooms=[keep(c) for c in rooms[:6]], studio=[keep(c) for c in studio[:1]], closeups=[keep(c) for c in closeups[:2]],
        dims=dim_rows(chart),
        counts=dict(rooms=len(rooms), night=sum(1 for c in rooms if c["night"] and c["src"]), studio=len(studio), closeups=len(closeups)),
    )
    json.dump(out, open(os.path.join(DATA, handle + ".json"), "w"), indent=1)
    # drop downloads the film will not use
    used = {os.path.join(HERE, c["file"]) for k in ("rooms", "studio", "closeups") for c in out[k]}
    for c in cands:
        if c["local"] not in used and os.path.exists(c["local"]):
            os.remove(c["local"])
    return out


if __name__ == "__main__":
    P = json.load(open(os.path.join(HERE, "products.raw.json")))
    want = set(sys.argv[1:])
    for p in P:
        if want and p["handle"] not in want and p["title"] not in want:
            continue
        o = prep(p)
        c = o["counts"]
        print(f"{o['title']:<18} rooms {c['rooms']:>2} (lit {c['night']:>2})  studio {c['studio']}  closeups {c['closeups']}  dims {len(o['dims'])}", flush=True)
