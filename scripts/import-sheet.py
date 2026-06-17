#!/usr/bin/env python3
"""One-off: read the Sofnade snack workbook and add its products to
data/products.js (4 new categories, merged duplicates, placeholder prices,
auto-suggested allergens). Photos are left empty (placeholder shown)."""
import json, re, sys, openpyxl

XLSX = "/root/.claude/uploads/2c29aeb3-ea0c-530b-81e0-3c0cc3de1bc9/af66178e-Sofnade_Store.xlsx"
PRODUCTS_JS = "data/products.js"

HEADER_TO_CAT = {
    "SOFNADE'S HOUSEBAKE COOKIES": "Housebake Cookies",
    "RETRO SNACKS": "Retro Snacks",
    "DEEPAVALI": "Deepavali",
    "HARI RAYA": "Hari Raya",
}
NEW_CATS = ["Housebake Cookies", "Retro Snacks", "Deepavali", "Hari Raya"]
CAT_STYLE = {
    "Housebake Cookies": ("🍪", "#c49a6a"),
    "Retro Snacks":      ("🍘", "#d7a24a"),
    "Deepavali":         ("🪔", "#c4683a"),
    "Hari Raya":         ("🌙", "#4e8f7a"),
}
# packaging column index -> (label, placeholder price)
PKG = {2: ("Petite Pack", 4.90), 3: ("Regular Pack", 9.90), 4: ("Bottle", 13.90), 5: ("Nostalgic Tin", 16.90)}

# Full category order used by the site (existing + new), for primary-category choice
CAT_ORDER = ['Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets', 'Christmas Festive'] + NEW_CATS

def slugify(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def clean(s):
    return re.sub(r'\s+', ' ', (s or '').replace('\n', ' ')).strip()

def norm_weight(v):
    return clean(v).replace(' grams', 'g').replace(' gram', 'g')

def detect_allergens(ing):
    t = ing.lower()
    a = []
    if any(w in t for w in ['butter', 'milk', 'ghee', 'buttermilk', 'margarine', 'magarine', 'whey', 'cheese', 'custard powder']):
        a.append('Dairy')
    if 'egg' in t:
        a.append('Eggs')
    if any(w in t for w in ['almond', 'peanut', 'groundnut', 'cashew', 'hazelnut', 'kacang', 'nuts', 'nut ']):
        a.append('Nuts')
    if any(w in t for w in ['soy', 'soya']):
        a.append('Soy')
    gluten = any(w in t for w in ['wheat', 'maida', 'malt', 'plain flour'])
    if not gluten and 'flour' in t:
        tmp = t
        for gf in ['rice flour', 'corn flour', 'cornflour', 'tapioca flour', 'dhall flour',
                   'dhal flour', 'gram flour', 'urad', 'potato starch', 'wheat starch']:
            tmp = tmp.replace(gf, '')
        if 'flour' in tmp:
            gluten = True
    if gluten:
        a.append('Gluten')
    # stable order
    return [x for x in ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy'] if x in a]

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb.active
cur = None
by_slug = {}
order = []

for row in ws.iter_rows(values_only=True):
    cells = ["" if c is None else clean(c) for c in row]
    name = cells[0]
    if not name or name == 'Snack':
        continue
    if name.upper() in HEADER_TO_CAT:
        cur = HEADER_TO_CAT[name.upper()]
        continue
    if cur is None:
        continue
    # a product row
    sizes_pkg = {}
    for col, (lbl, price) in PKG.items():
        v = cells[col] if col < len(cells) else ""
        if v:
            sizes_pkg[lbl] = {"label": f"{lbl} ({norm_weight(v)})", "price": price}
    if not sizes_pkg:
        continue
    sl = slugify(name)
    ing = clean(cells[1]) if len(cells) > 1 else ""
    if sl in by_slug:
        p = by_slug[sl]
        if cur not in p["_cats"]:
            p["_cats"].append(cur)
        for lbl, sz in sizes_pkg.items():     # add only new packaging
            if lbl not in p["_pkg"]:
                p["_pkg"][lbl] = sz
    else:
        by_slug[sl] = {"id": sl, "title": name, "_cats": [cur], "_pkg": dict(sizes_pkg), "_ing": ing}
        order.append(sl)

# Build final product objects
products = []
for sl in order:
    p = by_slug[sl]
    cats = sorted(set(p["_cats"]), key=lambda c: CAT_ORDER.index(c))
    primary = cats[0]
    emoji, color = CAT_STYLE[primary]
    sizes = [p["_pkg"][k] for k in ["Petite", "Regular", "Bottle", "Nostalgic Tin"] if k in p["_pkg"]]
    sizes.sort(key=lambda s: s["price"])
    ing_items = [x.strip() for x in re.split(r',', p["_ing"]) if x.strip()]
    short = ", ".join(ing_items[:3])
    short = (short[:1].upper() + short[1:] + ".") if short else "Freshly made."
    products.append({
        "id": p["id"], "title": p["title"], "tags": cats,
        "emoji": emoji, "color": color,
        "shortDesc": short,
        "longDesc": ("Ingredients: " + p["_ing"] + ".") if p["_ing"] else "",
        "price": sizes[0]["price"], "unit": "pack",
        "sizes": sizes, "upsell": [],
        "alsoBought": [], "allergens": detect_allergens(p["_ing"])
    })

# alsoBought = up to 3 siblings sharing the primary category
by_id = {p["id"]: p for p in products}
prim = {p["id"]: p["tags"][0] for p in products}
for p in products:
    sibs = [q["id"] for q in products if q["id"] != p["id"] and prim[q["id"]] == prim[p["id"]]]
    p["alsoBought"] = sibs[:3]

# ---- splice into data/products.js ----
src = open(PRODUCTS_JS, encoding="utf-8").read()
idx = src.index("let PRODUCTS = [")
end = src.index("\n];", idx)
items = ",\n" + ",\n".join("  " + json.dumps(p, ensure_ascii=False) for p in products)
src = src[:end] + items + src[end:]
src = src.replace(
    "let CATEGORIES = ['Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets', 'Christmas Festive'];",
    "let CATEGORIES = ['Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets', 'Christmas Festive', "
    + ", ".join(f"'{c}'" for c in NEW_CATS) + "];")
src = src.replace(
    "let CATEGORY_BAR_ORDER = ['Christmas Festive', 'Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets'];",
    "let CATEGORY_BAR_ORDER = ['Christmas Festive', 'Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets', "
    + ", ".join(f"'{c}'" for c in NEW_CATS) + "];")
open(PRODUCTS_JS, "w", encoding="utf-8").write(src)

print(f"Added {len(products)} products across {len(NEW_CATS)} categories.")
from collections import Counter
cnt = Counter(prim[p['id']] for p in products)
for c in NEW_CATS:
    print(f"  {c}: {cnt.get(c,0)}")
merged = [p['title'] for p in products if len(p['tags']) > 1]
print("Merged into multiple categories:", merged)
