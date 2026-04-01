"""
Downloads real profile photos for the 15 featured creators from Wikipedia API.
Saves 200x200 JPEGs to public/creators/.
"""

import requests
import json
import os
import sys
from PIL import Image
from io import BytesIO

OUT = "c:/Users/user/Desktop/AI PROJECTS MCPS/n8n/ugc-studio/public/creators"
os.makedirs(OUT, exist_ok=True)

HEADERS = {"User-Agent": "TownshubUGCStudio/1.0 (contact: support@townshub.com)"}

# Map: filename -> Wikipedia page title (for API lookup)
WIKI_CREATORS = {
    "khaby-lame":         "Khaby Lame",
    "charli-damelio":     "Charli D'Amelio",
    "addison-rae":        "Addison Rae",
    "wisdom-kaye":        "Wisdom Kaye",
    "jay-shetty":         "Jay Shetty",
    "nikkie-tutorials":   "NikkieTutorials",
    "bretman-rock":       "Bretman Rock",
    "zach-king":          "Zach King",
    "emma-chamberlain":   "Emma Chamberlain",
    "nas-daily":          "Nas Daily",
    "pokimane":           "Pokimane",
    "lilly-singh":        "Lilly Singh",
    "bhuvan-bam":         "Bhuvan Bam",
    "mikayla-nogueira":   "Mikayla Nogueira",
    "mkbhd":              "Marques Brownlee",
}

def get_wiki_photo_url(title):
    url = (
        "https://en.wikipedia.org/w/api.php"
        f"?action=query&titles={requests.utils.quote(title)}"
        "&prop=pageimages&format=json&pithumbsize=400&pilicense=any"
    )
    r = requests.get(url, headers=HEADERS, timeout=10)
    data = r.json()
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        thumb = page.get("thumbnail", {})
        if thumb.get("source"):
            return thumb["source"]
    return None

def save_photo(slug, img_url):
    out_path = os.path.join(OUT, f"{slug}.jpg")
    if os.path.exists(out_path):
        print(f"  ✓ {slug}.jpg already exists, skipping")
        return True
    r = requests.get(img_url, headers=HEADERS, timeout=15)
    if r.status_code != 200:
        print(f"  ✗ HTTP {r.status_code} for {img_url}")
        return False
    try:
        img = Image.open(BytesIO(r.content)).convert("RGB")
        # Crop to square from center
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize((200, 200), Image.LANCZOS)
        img.save(out_path, "JPEG", quality=88, optimize=True)
        print(f"  ✓ {slug}.jpg saved ({w}x{h} → 200x200)")
        return True
    except Exception as e:
        print(f"  ✗ Image error: {e}")
        return False

print("Downloading creator photos from Wikipedia...\n")
failed = []

for slug, title in WIKI_CREATORS.items():
    print(f"→ {title}")
    url = get_wiki_photo_url(title)
    if not url:
        print(f"  ✗ No Wikipedia photo found for '{title}'")
        failed.append(slug)
        continue
    print(f"  Found: {url[:80]}...")
    if not save_photo(slug, url):
        failed.append(slug)

print(f"\n✅ Done. {len(WIKI_CREATORS) - len(failed)}/{len(WIKI_CREATORS)} photos downloaded.")
if failed:
    print(f"   Missing: {', '.join(failed)}")
