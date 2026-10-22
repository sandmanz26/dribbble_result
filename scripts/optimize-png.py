"""Quantise exported PNGs to 256-colour palettes with alpha (libimagequant, dithered).
Visually identical at 1x and 2x for these sprites and about 3.5x smaller.

    pip install imagequant
    python3 scripts/optimize-png.py public/sprites
"""
import pathlib
import sys

import imagequant
from PIL import Image

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'public/sprites')
before = after = 0
for f in sorted(root.rglob('*.png')):
    size = f.stat().st_size
    im = Image.open(f).convert('RGBA')
    q = imagequant.quantize_pil_image(im, dithering_level=1.0, max_colors=256, min_quality=70, max_quality=95)
    q.save(f, 'PNG', optimize=True)
    before += size
    after += f.stat().st_size
print(f'{before / 1e6:.1f} MB -> {after / 1e6:.1f} MB')
