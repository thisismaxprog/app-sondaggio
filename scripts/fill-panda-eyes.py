#!/usr/bin/env python3
"""Colora di nero le zone occhi del panda (piccole aree chiare/trasparenti nella metà superiore)."""
from pathlib import Path
from collections import deque

from PIL import Image

def is_eye_like(pixel, light_threshold=180, alpha_threshold=250):
    """Pixel molto chiaro o trasparente (candidato occhio)."""
    r, g, b, a = pixel
    if a < 50:
        return True
    return a >= 100 and r >= light_threshold and g >= light_threshold and b >= light_threshold

def find_small_components(pix, w, h, max_size=1200):
    """Trova componenti connesse di pixel 'occhio' piccole (candidati occhi)."""
    visited = set()
    components = []
    for y in range(h):
        for x in range(w):
            if (x, y) in visited:
                continue
            p = pix[x, y]
            if not is_eye_like(p):
                continue
            # BFS per trovare la componente connessa
            comp = set()
            queue = deque([(x, y)])
            while queue:
                cx, cy = queue.popleft()
                if (cx, cy) in visited:
                    continue
                visited.add((cx, cy))
                comp.add((cx, cy))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                            if is_eye_like(pix[nx, ny]):
                                queue.append((nx, ny))
            if 20 <= len(comp) <= max_size:
                components.append(comp)
    return components

def fill_eyes(path_in: Path, path_out: Path):
    im = Image.open(path_in).convert("RGBA")
    pix = im.load()
    w, h = im.size
    components = find_small_components(pix, w, h, max_size=1200)
    # Riempì di nero le componenti piccole (candidati occhi), preferendo quelle in alto
    total = 0
    for comp in sorted(components, key=lambda c: (min(y for _, y in c), len(c))):
        if 15 <= len(comp) <= 1200:
            for (x, y) in comp:
                pix[x, y] = (0, 0, 0, 255)
            total += len(comp)
    im.save(path_out, "PNG")
    print(f"Colorate di nero {total} pixel (occhi). Salvato: {path_out}")

if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    src = base / "public" / "panda-logo.png"
    out = base / "public" / "panda-logo.png"
    if not src.exists():
        print("File non trovato:", src)
        exit(1)
    fill_eyes(src, out)
