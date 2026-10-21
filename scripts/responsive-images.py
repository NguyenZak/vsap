"""Generate smaller copies of the built-in photos for srcset.

For every public/images/*.webp wider than a target width, writes
public/images/_w/<name>-<width>.webp and records the available widths in
lib/responsive-manifest.json (read by lib/responsive.ts).

Usage: python3 scripts/responsive-images.py      (needs Pillow: pip install pillow)
Re-run after adding or replacing a photo in public/images.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images"
OUT = SRC / "_w"
WIDTHS = [640, 1280]

OUT.mkdir(exist_ok=True)
manifest = {}
for path in sorted(SRC.glob("*.webp")):
    with Image.open(path) as im:
        im = im.convert("RGB")
        widths = []
        for w in WIDTHS:
            if im.width <= w * 1.15:
                continue
            target = OUT / f"{path.stem}-{w}.webp"
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(target, "WEBP", quality=74, method=6)
            widths.append(w)
        manifest[f"/images/{path.name}"] = {"width": im.width, "sizes": widths}
        print(f"{path.name:28s} {im.width:>5}px -> {widths}")

(ROOT / "lib" / "responsive-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
