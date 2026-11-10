#!/usr/bin/env python3
"""Derive web-ready brand assets from the original artwork.

Source art lives outside this repository (in the brand folder); this script
produces the small, optimised crops the storefront actually ships:

    public/media/brand/wordmark.png   hand-drawn banner + wordmark, transparent
    public/media/brand/guara.png      a single guará, for the favicon / accents

Run with:  POUQUISSIMAS_ART=/path/to/brand python3 scripts/import_brand_assets.py
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "brand"
ART = Path(os.environ.get("POUQUISSIMAS_ART", Path.home() / "Documents" / "pouquissimas"))


def crop_to_content(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def key_out_sky(image: Image.Image) -> Image.Image:
    """Make the painted sky transparent, keeping the banner and its ink.

    The sky is a gradient, so matching one colour is not enough. Every sky
    pixel is strongly blue-dominant (b - r > 40) while the white ribbon, its
    black outline and the red bird are not.
    """
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if b - r > 40:
                pixels[x, y] = (r, g, b, 0)

    return image


def largest_white_component(image: Image.Image, threshold: int = 230) -> tuple[int, int, int, int]:
    """Bounding box of the biggest near-white blob (the ribbon), in full coords."""
    probe = image.copy()
    probe.thumbnail((800, 800), Image.LANCZOS)
    width, height = probe.size

    rgb = probe.convert("RGB")
    pixels = rgb.load()
    visited = bytearray(width * height)
    best = (0, (0, 0, width, height))

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index]:
                continue
            r, g, b = pixels[x, y]
            if min(r, g, b) < threshold:
                visited[index] = 1
                continue

            # Breadth-first walk over the white blob.
            stack = [(x, y)]
            visited[index] = 1
            count = 0
            min_x = max_x = x
            min_y = max_y = y

            while stack:
                cx, cy = stack.pop()
                count += 1
                min_x, max_x = min(min_x, cx), max(max_x, cx)
                min_y, max_y = min(min_y, cy), max(max_y, cy)

                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        nindex = ny * width + nx
                        if visited[nindex]:
                            continue
                        nr, ng, nb = pixels[nx, ny]
                        if min(nr, ng, nb) >= threshold:
                            visited[nindex] = 1
                            stack.append((nx, ny))

            if count > best[0]:
                best = (count, (min_x, min_y, max_x + 1, max_y + 1))

    _, (x0, y0, x1, y1) = best
    scale_x = image.width / width
    scale_y = image.height / height
    return (
        max(0, int(x0 * scale_x)),
        max(0, int(y0 * scale_y)),
        min(image.width, int(x1 * scale_x)),
        min(image.height, int(y1 * scale_y)),
    )


def build_wordmark(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")

    # The wordmark sits on the white ribbon; use the largest white blob so the
    # bird and the sky never enter the crop.
    x0, y0, x1, y1 = largest_white_component(image)
    margin = 10
    cropped = image.crop(
        (max(0, x0 - margin), max(0, y0 - margin), min(image.width, x1 + margin), min(image.height, y1 + margin))
    )

    cropped = key_out_sky(cropped)
    cropped = crop_to_content(cropped)

    # Header-sized asset: 900px wide is plenty for a 2x display.
    ratio = 900 / cropped.width
    return cropped.resize((900, max(1, round(cropped.height * ratio))), Image.LANCZOS)


def build_single_bird(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    image = crop_to_content(image)

    # Pick one bird out of the flock: top-centre region, then crop to content.
    width, height = image.size
    single = image.crop((int(width * 0.44), 0, int(width * 0.62), int(height * 0.30)))
    single = crop_to_content(single)

    square = max(single.size)
    canvas = Image.new("RGBA", (square, square), (0, 0, 0, 0))
    canvas.alpha_composite(
        single,
        ((square - single.width) // 2, (square - single.height) // 2),
    )
    return canvas.resize((512, 512), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    targets = [
        ("wordmark.png", build_wordmark(ART / "shape" / "shape01-final.png")),
        ("guara.png", build_single_bird(ART / "camiseta" / "guara-bunch.png")),
    ]

    for name, image in targets:
        path = OUT / name
        image.save(path, optimize=True)
        print(f"wrote {path.relative_to(ROOT)} ({image.width}x{image.height}, {path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
