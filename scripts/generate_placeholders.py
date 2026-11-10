#!/usr/bin/env python3
"""Generate the local placeholder artwork used by the storefront.

Every product photo in this project is a transparent PNG cut-out so it can
float over the fixed background video, exactly like the reference layout.
Replace the files in public/media/products/ with real photography later --
the catalogue only stores the file path.

Usage:  python3 scripts/generate_placeholders.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "products"

GRID = 1000  # design grid the silhouettes are authored on
SUPERSAMPLE = 4  # mask resolution multiplier (crisp, antialiased edges)
CANVAS = GRID * SUPERSAMPLE
FINAL = 1400  # pixel size of each exported cut-out
CONTENT_RATIO = 0.9  # how much of the square the artwork should fill

INK = (13, 13, 15, 255)
BONE = (239, 236, 227, 255)
AMARELO = (245, 208, 46, 255)   # amarelo do carro da marca
AZUL = (90, 169, 221, 255)      # azul do céu
VERMELHO = (193, 39, 45, 255)   # vermelho do guará
OLIVE = (59, 64, 50, 255)
PLUM = (74, 44, 70, 255)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_CONDENSED = "/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf"


# --------------------------------------------------------------------------- #
# A draw wrapper that works in the 1000x1000 design grid at any resolution.
# --------------------------------------------------------------------------- #
class ScaledDraw:
    def __init__(self, image: Image.Image, scale: int) -> None:
        self.draw = ImageDraw.Draw(image)
        self.s = scale

    def _point(self, xy):
        return tuple(int(value * self.s) for value in xy)

    def _points(self, points):
        return [(int(x * self.s), int(y * self.s)) for x, y in points]

    def polygon(self, points, fill=None):
        self.draw.polygon(self._points(points), fill=fill)

    def rectangle(self, xy, fill=None):
        self.draw.rectangle(self._point(xy), fill=fill)

    def rounded_rectangle(self, xy, radius=0, fill=None):
        self.draw.rounded_rectangle(self._point(xy), radius=radius * self.s, fill=fill)

    def ellipse(self, xy, fill=None, outline=None, width=1):
        self.draw.ellipse(
            self._point(xy), fill=fill, outline=outline, width=max(1, width * self.s)
        )

    def line(self, xy, fill=None, width=1):
        self.draw.line(self._point(xy), fill=fill, width=max(1, width * self.s))

    def arc(self, xy, start, end, fill=None, width=1):
        self.draw.arc(
            self._point(xy), start, end, fill=fill, width=max(1, width * self.s)
        )

    def multiline_text(self, xy, text, font_size, fill, align="center", spacing=10):
        font = ImageFont.truetype(FONT_CONDENSED, font_size * self.s)
        self.draw.multiline_text(
            self._point(xy),
            text,
            font=font,
            fill=fill,
            anchor="mm",
            align=align,
            spacing=spacing * self.s,
        )

    def text(self, xy, text, font_size, fill, anchor="mm"):
        font = ImageFont.truetype(FONT_BOLD, font_size * self.s)
        self.draw.text(self._point(xy), text, font=font, fill=fill, anchor=anchor)


# --------------------------------------------------------------------------- #
# Silhouettes, authored on the 1000x1000 grid
# --------------------------------------------------------------------------- #
def deck_mask(draw: ScaledDraw) -> None:
    draw.rounded_rectangle((340, 110, 660, 1300), radius=170, fill=255)
    for cx in (440, 560):
        for cy in (330, 1080):
            draw.ellipse((cx - 9, cy - 9, cx + 9, cy + 9), fill=0)


def tee_mask(draw: ScaledDraw) -> None:
    draw.polygon(
        [
            (330, 300), (430, 240), (500, 220), (500, 260), (520, 275),
            (560, 275), (580, 260), (580, 220), (650, 240), (750, 300),
            (860, 400), (800, 520), (720, 470), (720, 880), (360, 880),
            (360, 470), (280, 520), (220, 400),
        ],
        fill=255,
    )
    # Neck opening
    draw.ellipse((470, 210, 530, 285), fill=0)


def longsleeve_mask(draw: ScaledDraw) -> None:
    tee_mask(draw)
    draw.polygon([(224, 400), (140, 800), (215, 820), (300, 470)], fill=255)
    draw.polygon([(856, 400), (940, 800), (865, 820), (780, 470)], fill=255)


MASK_BUILDERS = {
    "deck": deck_mask,
    "tee": tee_mask,
    "longsleeve": longsleeve_mask,
}


# --------------------------------------------------------------------------- #
# Printed graphics
# --------------------------------------------------------------------------- #
def motif_crosshair(draw: ScaledDraw, colour) -> None:
    cx, cy = 500, 620
    draw.ellipse((cx - 250, cy - 250, cx + 250, cy + 250), outline=colour, width=22)
    draw.ellipse((cx - 130, cy - 130, cx + 130, cy + 130), outline=colour, width=12)
    draw.line((250, cy, 750, cy), fill=colour, width=10)
    draw.line((cx, 370, cx, 870), fill=colour, width=10)


def motif_target(draw: ScaledDraw, colour) -> None:
    cx, cy = 500, 620
    for radius in (250, 190, 130, 70):
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius),
                     outline=colour, width=14)
    for step in range(12):
        angle = step * math.pi / 6
        draw.line(
            (cx + 100 * math.cos(angle), cy + 100 * math.sin(angle),
             cx + 280 * math.cos(angle), cy + 280 * math.sin(angle)),
            fill=colour,
            width=8,
        )


def motif_checker(draw: ScaledDraw, colour) -> None:
    cell = 62
    for row in range(8):
        for col in range(8):
            if (row + col) % 2 == 0:
                x = 252 + col * cell
                y = 400 + row * cell
                draw.rectangle((x, y, x + cell, y + cell), fill=colour)


def motif_stripes(draw: ScaledDraw, colour) -> None:
    for index in range(-4, 12):
        x = 200 + index * 90
        draw.line((x, 300, x + 320, 900), fill=colour, width=30)


def motif_word(draw: ScaledDraw, colour) -> None:
    draw.multiline_text((500, 640), "IMAGEM\nPROVISÓRIA", 44, colour, spacing=12)


def motif_rings(draw: ScaledDraw, colour) -> None:
    cx, cy = 500, 620
    for radius in range(60, 300, 60):
        draw.arc((cx - radius, cy - radius, cx + radius, cy + radius),
                 200, 340, fill=colour, width=18)


MOTIFS = {
    "crosshair": motif_crosshair,
    "target": motif_target,
    "checker": motif_checker,
    "stripes": motif_stripes,
    "word": motif_word,
    "rings": motif_rings,
}


# --------------------------------------------------------------------------- #
# Composition
# --------------------------------------------------------------------------- #
def add_grain(image: Image.Image, amount: int = 6) -> Image.Image:
    noise = Image.effect_noise(image.size, amount).convert("L")
    speckle = Image.new("RGBA", image.size, (255, 255, 255, 0))
    speckle.putalpha(noise.point(lambda value: 255 if value > 238 else 0))
    return Image.alpha_composite(image, speckle)


def rim_light(product: Image.Image, opacity: float = 0.3) -> Image.Image:
    """A faint edge so black garments stay readable on a black page."""
    alpha = product.getchannel("A")
    edges = alpha.filter(ImageFilter.FIND_EDGES)
    edges = edges.point(lambda value: 255 if value > 24 else 0)
    edges = edges.filter(ImageFilter.GaussianBlur(1.6))
    edges = edges.point(lambda value: int(value * opacity))

    rim = Image.new("RGBA", product.size, (255, 255, 255, 0))
    rim.putalpha(edges)
    return Image.alpha_composite(product, rim)


def normalise(product: Image.Image) -> Image.Image:
    """Crop to the artwork and scale it to fill most of a square frame."""
    bbox = product.getbbox()
    if bbox:
        product = product.crop(bbox)

    longest = max(product.width, product.height)
    target = int(FINAL * CONTENT_RATIO)
    ratio = target / longest
    product = product.resize(
        (max(1, int(product.width * ratio)), max(1, int(product.height * ratio))),
        Image.LANCZOS,
    )

    canvas = Image.new("RGBA", (FINAL, FINAL), (0, 0, 0, 0))
    canvas.alpha_composite(
        product,
        ((FINAL - product.width) // 2, (FINAL - product.height) // 2),
    )
    return canvas


def build_product(shape: str, motif: str, colour, motif_colour) -> Image.Image:
    """Compose one transparent cut-out: silhouette, print, caption, rim, shadow."""
    # -- silhouette, drawn supersampled ---------------------------------- #
    mask = Image.new("L", (CANVAS, CANVAS), 0)
    MASK_BUILDERS[shape](ScaledDraw(mask, SUPERSAMPLE))

    body = Image.new("RGBA", (CANVAS, CANVAS), colour)
    body.putalpha(mask)

    # -- printed graphic, clipped to the garment -------------------------- #
    graphics = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    MOTIFS[motif](ScaledDraw(graphics, SUPERSAMPLE), motif_colour)
    graphics.putalpha(ImageChops.multiply(graphics.getchannel("A"), mask))

    product = Image.alpha_composite(body, graphics)

    # -- caption so nobody mistakes a placeholder for real artwork -------- #
    caption = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    ScaledDraw(caption, SUPERSAMPLE).text(
        (500, 962), "I M A G E M   P R O V I S Ó R I A", 20, (255, 255, 255, 190)
    )
    product = Image.alpha_composite(product, caption)

    # -- normalise, then add the finishing touches at final size ---------- #
    product = normalise(product)
    product = rim_light(product)

    shadow = Image.new("RGBA", product.size, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 125), (0, 0), product.getchannel("A"))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    shadow = ImageChops.offset(shadow, 8, 22)

    canvas = Image.new("RGBA", product.size, (0, 0, 0, 0))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas = Image.alpha_composite(canvas, product)
    return add_grain(canvas)


# (filename, shape, motif, garment colour, print colour)
PRODUCTS = [
    ("deck-01", "deck", "crosshair", INK, AMARELO),
    ("deck-02", "deck", "checker", BONE, OLIVE),
    ("deck-03", "deck", "rings", PLUM, BONE),
    ("tee-01", "tee", "crosshair", INK, AMARELO),
    ("tee-02", "tee", "target", BONE, VERMELHO),
    ("tee-03", "tee", "word", INK, AZUL),
    ("tee-04", "tee", "stripes", BONE, INK),
    ("longsleeve-01", "longsleeve", "target", INK, AMARELO),
    ("longsleeve-02", "longsleeve", "stripes", OLIVE, BONE),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, shape, motif, colour, motif_colour in PRODUCTS:
        image = build_product(shape, motif, colour, motif_colour)
        path = OUT / f"{name}.png"
        image.save(path, optimize=True)
        print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
