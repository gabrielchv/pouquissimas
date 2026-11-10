#!/usr/bin/env python3
"""Derive web-ready brand assets from the original artwork.

Source art lives outside this repository (in the brand folder); this script
produces the small, optimised crops the storefront actually ships:

    public/media/brand/logo.png           lockup oficial: nome + carro
    public/media/brand/logo-wordmark.png  só o nome, para o cabeçalho no celular
    public/media/brand/guara.png          um guará, para o favicon e destaques
    public/media/brand/og-image.png       imagem 1200x630 para compartilhamento

Run with:  POUQUISSIMAS_ART=/path/to/brand python3 scripts/import_brand_assets.py
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "brand"
ART = Path(os.environ.get("POUQUISSIMAS_ART", Path.home() / "Documents" / "pouquissimas"))

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


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


def build_logo(source: Path, width: int = 1000) -> Image.Image:
    """Logo oficial, branco sobre transparente.

    A arte original é um lockup empilhado: o nome em cima e o carro embaixo.
    Recortamos a margem transparente e reduzimos para um tamanho de 2x.
    """
    image = Image.open(source).convert("RGBA")
    image = crop_to_content(image)
    ratio = width / image.width
    return image.resize((width, max(1, round(image.height * ratio))), Image.LANCZOS)


def content_bands(alpha: Image.Image, threshold: int = 8) -> list[tuple[int, int]]:
    """Faixas horizontais com conteúdo, unindo vãos pequenos.

    Na arte original os acentos (´ e ~) formam uma faixa separada das letras,
    então faixas próximas precisam ser tratadas como uma só.
    """
    width, height = alpha.size
    filled_rows = [
        alpha.crop((0, y, width, y + 1)).getextrema()[1] > threshold
        for y in range(height)
    ]

    bands: list[tuple[int, int]] = []
    start: int | None = None
    for y, filled in enumerate(filled_rows):
        if filled and start is None:
            start = y
        elif not filled and start is not None:
            bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, height))

    merged: list[tuple[int, int]] = []
    for band in bands:
        if merged and band[0] - merged[-1][1] < 80:
            merged[-1] = (merged[-1][0], band[1])
        else:
            merged.append(band)
    return merged


def build_logo_wordmark(source: Path, width: int = 1000) -> Image.Image:
    """Só a linha do nome, recortada do mesmo lockup.

    Num celular o lockup inteiro ficaria com o nome ilegível; o cabeçalho usa
    esta versão e o rodapé usa o lockup completo.
    """
    image = Image.open(source).convert("RGBA")
    bands = content_bands(image.getchannel("A"))

    if not bands:
        raise SystemExit("não encontrei conteúdo na arte do logo")

    top, bottom = bands[0]
    cropped = crop_to_content(image.crop((0, top, image.width, bottom)))

    ratio = width / cropped.width
    return cropped.resize((width, max(1, round(cropped.height * ratio))), Image.LANCZOS)


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


def build_og_image(logo: Image.Image) -> Image.Image:
    """Card 1200x630 para WhatsApp, X, LinkedIn e preview do Google.

    O logo é branco, então o fundo é escuro; o texto embaixo diz o que a loja
    vende, porque só a marca não comunica nada em um preview.
    """
    width, height = 1200, 630
    canvas = Image.new("RGBA", (width, height), (8, 9, 12, 255))

    # Brilho suave no canto, no tom do azul do guará.
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    for step in range(60):
        alpha = max(0, 26 - step // 3)
        radius = 520 - step * 7
        draw.ellipse(
            (width - radius, -radius // 2, width + radius, radius),
            fill=(90, 169, 221, alpha),
        )
    canvas.alpha_composite(glow)

    # Logo centralizado na metade de cima.
    art = crop_to_content(logo)
    ratio = 620 / art.width
    art = art.resize((620, max(1, round(art.height * ratio))), Image.LANCZOS)
    canvas.alpha_composite(art, ((width - art.width) // 2, 70))

    draw = ImageDraw.Draw(canvas)
    title_font = ImageFont.truetype(FONT_BOLD, 44)
    sub_font = ImageFont.truetype(FONT_BOLD, 26)

    draw.text(
        (width // 2, 520),
        "SHAPES E CAMISETAS",
        font=title_font,
        fill=(255, 255, 255, 255),
        anchor="mm",
    )
    draw.text(
        (width // 2, 570),
        "pouquissimas.com",
        font=sub_font,
        fill=(245, 208, 46, 255),
        anchor="mm",
    )

    return canvas.convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    targets = [
        ("logo.png", build_logo(ART / "shape" / "shape_back_image_white.png")),
        (
            "logo-wordmark.png",
            build_logo_wordmark(ART / "shape" / "shape_back_image_white.png"),
        ),
        ("guara.png", build_single_bird(ART / "camiseta" / "guara-bunch.png")),
    ]

    for name, image in targets:
        path = OUT / name
        image.save(path, optimize=True)
        print(f"wrote {path.relative_to(ROOT)} ({image.width}x{image.height}, {path.stat().st_size // 1024} KB)")

    og = build_og_image(Image.open(OUT / "logo.png"))
    og_path = OUT / "og-image.png"
    og.save(og_path, optimize=True)
    print(f"wrote {og_path.relative_to(ROOT)} ({og.width}x{og.height}, {og_path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
