#!/usr/bin/env python3
"""Replace the placeholder Bubble Tea drinks with the real order.sofnade.com
drinks (34 across 6 sub-sections). Each drink: Regular cup (500ml) base price +
Bottle (650ml) at +$2.50, all 9 toppings, dairy allergen for milk drinks.
Photos left as placeholders."""
import json, re

PRODUCTS_JS = "data/products.js"
TOPPINGS = ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera",
            "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"]
BOTTLE_EXTRA = 2.50
SECTION_STYLE = {
    "Fusion Teas":      ("🧋", "#c98a4a"),
    "Classic Iced Teas":("🧋", "#b5793a"),
    "Sodas":            ("🥤", "#6aa0c4"),
    "Lemonades":        ("🍋", "#e3b94a"),
    "Fresh Milk":       ("🥛", "#cdbba0"),
    "Milk Teas":        ("🧋", "#c4a06a"),
}
DAIRY = {"Fresh Milk", "Milk Teas"}

# (section, name, base price, short description)
DATA = [
 ("Fusion Teas", "Lychee Mint Tea", 3.60, "A refreshing blend of sweet lychee and cool, fresh mint."),
 ("Fusion Teas", "Mango Green Tea", 3.10, "Tropical mango sweetness with the fragrance of green tea."),
 ("Fusion Teas", "Iced Lemon Tea", 3.10, "A refreshing iced lemon tea for a hot day or any time you need a cool pick-me-up."),
 ("Fusion Teas", "Thai Lemon Tea", 3.10, "Thai-style lemon tea (Cha Manao), a popular and refreshing citrus brew."),
 ("Fusion Teas", "Peach Green Tea", 3.10, "The sweetness of peach with the fragrance of green tea."),
 ("Fusion Teas", "Strawberry Green Tea", 3.60, "Tropical strawberry sweetness with the fragrance of green tea."),

 ("Classic Iced Teas", "Strawberry Iced Tea", 3.10, "Tropical strawberry sweetness with the fragrance of black tea."),
 ("Classic Iced Teas", "Mango Iced Tea", 3.10, "Tropical mango sweetness with the fragrance of black tea."),
 ("Classic Iced Teas", "Classic Iced Tea", 2.90, "A classic tea for a refreshing day."),
 ("Classic Iced Teas", "Jasmine Green Iced Tea", 2.90, "Delicate floral jasmine green tea in every refreshing sip."),
 ("Classic Iced Teas", "Oolong Iced Tea", 2.90, "The roasted, nutty taste of our oolong, served iced."),
 ("Classic Iced Teas", "Earl Grey Iced Tea", 2.90, "Aromatic, citrusy iced Earl Grey tea."),

 ("Sodas", "Blueberry Soda", 3.10, "Sweet blueberry with soda."),
 ("Sodas", "Lychee Soda", 3.10, "Sweet, floral lychee with soda."),
 ("Sodas", "Peach Soda", 3.10, "Delicious peach puree with soda."),
 ("Sodas", "Strawberry Soda", 3.10, "Sweet strawberry puree with soda."),
 ("Sodas", "Lemon Lime Soda", 3.10, "Zesty lemon and lime puree with soda."),
 ("Sodas", "Mango Soda", 3.10, "Sweet mango puree with soda."),

 ("Lemonades", "Mint Lemonade", 4.10, "Ice-cold lemonade bursting with citrus and cool, fresh mint."),
 ("Lemonades", "Classic Lemonade", 3.10, "Icy cold and bursting with 100% freshly squeezed lemons, the perfect thirst quencher."),
 ("Lemonades", "Pink Lemonade", 3.10, "Sweet strawberries meet tangy lemon in a vibrant, ice-cold pink lemonade."),
 ("Lemonades", "Honey Peach Lemonade", 3.10, "Sun-kissed peaches meet tangy lemons in a bright, summery lemonade."),

 ("Fresh Milk", "Mango Fresh Milk", 4.50, "Chilled fresh milk with mango puree, a tropical dream in every sip. (4 working days advance order.)"),
 ("Fresh Milk", "Strawberry Fresh Milk", 4.50, "Chilled milk swirled with vibrant strawberry puree, sweet, creamy and bursting with summer."),
 ("Fresh Milk", "Peach Fresh Milk", 4.50, "Chilled milk with honey peach puree, a sip of pure summer refreshment."),
 ("Fresh Milk", "Brown Sugar Jelly Fresh Milk", 4.50, "Chilled milk kissed by roasted brown sugar with a hint of jelly. Sweet, creamy and cool."),

 ("Milk Teas", "Signature Classic Milk Tea", 3.20, "A special blend of the best Assam tea leaves from Taiwan. Fragrant and addictive."),
 ("Milk Teas", "Jasmine Green Milk Tea", 3.20, "The perfect blend of floral jasmine notes and creamy goodness."),
 ("Milk Teas", "Earl Grey Milk Tea", 3.70, "A creamy, dreamy blend of bergamot-infused tea and velvety milk."),
 ("Milk Teas", "Caramel Milk Tea", 3.70, "Sweet dreams do come true. Fragrant and creamy."),
 ("Milk Teas", "Honey Milk Tea", 3.70, "A decadent, comforting blend of honey and milk tea."),
 ("Milk Teas", "Red Thai Milk Tea", 3.20, "A creamy, sweet Thai treat. Best enjoyed at 75% sugar."),
 ("Milk Teas", "Green Thai Milk Tea", 3.20, "A creamy, sweet green Thai treat. Best enjoyed at 75% sugar."),
 ("Milk Teas", "Oolong Milk Tea", 3.70, "The creamy, roasted, nutty taste of our oolong milk tea."),
]

def slug(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

drinks = []
for section, name, base, desc in DATA:
    emoji, color = SECTION_STYLE[section]
    drinks.append({
        "id": slug(name), "title": name,
        "tags": ["Bubble Tea"], "section": section,
        "emoji": emoji, "color": color,
        "shortDesc": desc, "longDesc": desc,
        "price": round(base, 2), "unit": "cup",
        "sizes": [
            {"label": "Regular cup (500ml)", "price": round(base, 2)},
            {"label": "Bottle (650ml)", "price": round(base + BOTTLE_EXTRA, 2)},
        ],
        "upsell": list(TOPPINGS),
        "alsoBought": [],
        "allergens": ["Dairy"] if section in DAIRY else []
    })

# alsoBought: up to 3 siblings in the same section
for d in drinks:
    sibs = [x["id"] for x in drinks if x["id"] != d["id"] and x["section"] == d["section"]]
    d["alsoBought"] = sibs[:3]

# ---- surgery: replace the placeholder Bubble Tea block with these drinks ----
src = open(PRODUCTS_JS, encoding="utf-8").read()
arr_open = src.index("[", src.index("let PRODUCTS = [")) + 1
cookies_idx = src.index("id: 'cookies'")
cookies_obj = src.rfind("  {", arr_open, cookies_idx)   # start of the cookies object
items = ",\n".join("  " + json.dumps(d, ensure_ascii=False) for d in drinks)
new = (src[:arr_open]
       + "\n  /* ---------- BUBBLE TEA (order.sofnade.com) ---------- */\n"
       + items + ",\n"
       + src[cookies_obj:])
open(PRODUCTS_JS, "w", encoding="utf-8").write(new)
print(f"Inserted {len(drinks)} drinks; removed the placeholder Bubble Tea block.")
