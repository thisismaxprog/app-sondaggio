#!/usr/bin/env python3
"""Rimuove il nero intorno al panda: rende trasparente tutto il nero
connesso ai bordi dell'immagine (il riquadro nero), tenendo orecchie e occhi."""
import sys
from pathlib import Path
from collections import deque

from PIL import Image

def is_black(pixel, threshold=50):
    r, g, b, a = pixel
    return a > 0 and r <= threshold and g <= threshold and b <= threshold

def is_transparent(pixel, alpha_threshold=128):
    return pixel[3] < alpha_threshold

def remove_black_frame(path_in: Path, path_out: Path):
    im = Image.open(path_in).convert("RGBA")
    pix = im.load()
    w, h = im.size

    # Raggiungi tutto il nero connesso al bordo (anche tramite trasparente)
    to_remove = set()
    queue = deque()
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    visited = set()
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        p = pix[x, y]
        if is_black(p):
            to_remove.add((x, y))
        # procedi su trasparente o nero (per raggiungere tutto il riquadro nero)
        if is_transparent(p) or is_black(p):
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                        queue.append((nx, ny))

    for (x, y) in to_remove:
        pix[x, y] = (0, 0, 0, 0)

    im.save(path_out, "PNG")
    print(f"Rimossi {len(to_remove)} pixel neri. Salvato: {path_out}")

if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    src = base / "public" / "panda-logo.png"
    out = base / "public" / "panda-logo.png"
    if not src.exists():
        print("File non trovato:", src)
        sys.exit(1)
    remove_black_frame(src, out)
