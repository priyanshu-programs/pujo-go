"""
Strip the flat white studio background from the Pujo Go hero assets.

Both source JPEGs sit on near-white backgrounds, which read as an ugly white
slab once placed on the hero's pure-black canvas. A naive "every white pixel
becomes transparent" threshold would punch holes straight through the artwork:
the logo's white Bengali lettering, the phone's UI chrome, and the whites of the
idols' eyes are all just as white as the background.

So the background mask is seeded from the image border and flood-filled inward.
Only white that is *connected to the edge* is removed; white enclosed by artwork
survives. Edges are then feathered and de-fringed so no white halo remains.

Run from the project root:  python scripts/remove_bg.py
Requires Pillow + numpy (both already present in the 3.12 environment).
"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "images" / "source"
OUT_DIR = ROOT / "public" / "images"

# A pixel counts as background when every channel is within TOLERANCE of white
# AND it is reachable from the border. 28/255 comfortably absorbs JPEG ringing
# around the subject without eating into the cream/ivory tones of the artwork.
TOLERANCE = 28

# Set via `--png` to also emit a PNG for eyeballing the alpha channel.
WRITE_PNG = "--png" in sys.argv

JOBS = [
    ("central-hero-image.jpeg", "hero-central"),
    ("pujogo-navbar-logo.jpeg", "pujogo-logo"),
]


def border_connected_white(rgb: np.ndarray, tolerance: int) -> np.ndarray:
    """Flood fill white from the image border; returns a bool background mask."""
    height, width = rgb.shape[:2]
    whiteish = np.all(rgb >= (255 - tolerance), axis=2)

    background = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    # Seed every border pixel that is already white.
    for x in range(width):
        for y in (0, height - 1):
            if whiteish[y, x] and not background[y, x]:
                background[y, x] = True
                queue.append((y, x))
    for y in range(height):
        for x in (0, width - 1):
            if whiteish[y, x] and not background[y, x]:
                background[y, x] = True
                queue.append((y, x))

    # 4-connected BFS inward. Row-wise numpy dilation would be tidier, but an
    # explicit queue keeps peak memory flat on these ~14k-px-wide sources.
    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < height and 0 <= nx < width:
                if whiteish[ny, nx] and not background[ny, nx]:
                    background[ny, nx] = True
                    queue.append((ny, nx))

    return background


def cut_out(src: Path, stem: str) -> None:
    print(f"  reading {src.name} ...", flush=True)
    image = Image.open(src).convert("RGB")
    rgb = np.asarray(image)
    height, width = rgb.shape[:2]
    print(f"  {width}x{height}, flood filling from border ...", flush=True)

    background = border_connected_white(rgb, TOLERANCE)
    alpha = np.where(background, 0, 255).astype(np.uint8)

    removed = background.mean() * 100
    print(f"  background removed: {removed:.1f}% of pixels", flush=True)

    # Feather the hard 0/255 step by one pixel so the cut-out does not alias
    # into a jagged edge against the black hero background.
    alpha_img = Image.fromarray(alpha, mode="L").filter(
        ImageFilter.GaussianBlur(radius=1.1)
    )

    # De-fringe: JPEG leaves a pale rim of half-background pixels just inside
    # the subject. Unmultiplying against the white they were blended with pulls
    # that rim back to the artwork's true colour instead of a grey halo.
    a = np.asarray(alpha_img).astype(np.float32) / 255.0
    edge = (a > 0.02) & (a < 0.98)
    if edge.any():
        rgb_f = rgb.astype(np.float32)
        safe_a = np.clip(a[edge], 0.15, 1.0)[:, None]
        unmultiplied = (rgb_f[edge] - 255.0 * (1.0 - safe_a)) / safe_a
        rgb_f[edge] = np.clip(unmultiplied, 0, 255)
        rgb = rgb_f.astype(np.uint8)

    rgba = np.dstack([rgb, np.asarray(alpha_img)])
    out = Image.fromarray(rgba, mode="RGBA")

    # Trim fully transparent margins so the asset carries no dead weight and
    # sits flush with its layout box.
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        print(f"  cropped to {out.width}x{out.height}", flush=True)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    webp_path = OUT_DIR / f"{stem}.webp"
    png_path = OUT_DIR / f"{stem}.png"

    out.save(webp_path, "WEBP", quality=90, method=6)
    out.save(png_path, "PNG", optimize=True)

    print(f"  -> {webp_path.name}  ({webp_path.stat().st_size / 1024:.0f} KB)")
    print(f"  -> {png_path.name}  ({png_path.stat().st_size / 1024:.0f} KB)\n")


def main() -> None:
    for filename, stem in JOBS:
        src = SRC_DIR / filename
        if not src.exists():
            raise SystemExit(f"missing source image: {src}")
        print(f"{filename}")
        cut_out(src, stem)
    print("done.")


if __name__ == "__main__":
    main()
