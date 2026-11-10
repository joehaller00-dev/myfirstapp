#!/usr/bin/env python3
"""Upload files to Shopify staged-upload targets.
Usage: upload_staged.py <stagedUploadsCreate result json> <video|poster>
Targets are in the same order as upload_manifest.json. Writes resourceUrl back into the manifest."""
import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
res, kind = sys.argv[1], sys.argv[2]
d = json.load(open(res))["data"]["stagedUploadsCreate"]
assert not d["userErrors"], d["userErrors"]
man = json.load(open("upload_manifest.json"))
T = d["stagedTargets"]
assert len(T) == len(man), (len(T), len(man))
fkey, mime, ukey = ("video", "video/mp4", "vurl") if kind == "video" else ("poster", "image/jpeg", "purl")
def up(pair):
    m, t = pair
    assert (m["vfile"] if kind == "video" else m["pfile"]) in t["resourceUrl"], (m["name"], t["resourceUrl"])
    cmd = ["curl", "-sS", "-m", "600", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", t["url"]]
    for p in t["parameters"]:
        cmd += ["--form-string", f"{p['name']}={p['value']}"]
    cmd += ["-F", f"file=@{m[fkey]};type={mime}"]
    for _ in range(3):
        code = subprocess.run(cmd, capture_output=True, text=True).stdout.strip()
        if code in ("201", "204"):
            m[ukey] = t["resourceUrl"]; return m["name"], code
    return m["name"], code
with ThreadPoolExecutor(4) as ex:
    out = list(ex.map(up, zip(man, T)))
bad = [o for o in out if o[1] not in ("201", "204")]
json.dump(man, open("upload_manifest.json", "w"), indent=1)
print(kind, "uploaded", len(out) - len(bad), "of", len(out), "| failed:", bad)
