# Sofnade — Storefront

A 3-page e-commerce site for **Sofnade** (bubble tea, sweets, snacks and gift sets),
inspired by the BioPak product site. Built as plain HTML/CSS/JS — no build step, no
backend. Just open `index.html` in a browser (or serve the folder) and it runs.

Real product photos live under `assets/<product-id>/<product-id>-N.jpg`. The catalog
(21 products across 4 categories) is defined in `data/products.js`.

## Pages

1. **`index.html` — Product listing**
   Product cards (image, title, description, "from" price/unit) in a grid, with a
   left **sidebar that filters by category/tag**. Products carry multiple tags and
   appear under every matching filter. Filter state is reflected in the URL
   (`?cat=Sweets`) so nav links and the sidebar stay in sync.

2. **`product.html?id=<id>` — Product detail**
   BioPak-style two-column layout. Left: a **gallery** with the active image on top
   and a row of square thumbnails underneath. Right: title, labels/tags, price,
   size option, **drink toppings** (add-ons), quantity selector, add-to-cart, delivery
   info accordion. Below: a **"Customers also bought"** row of product cards.

3. **`checkout.html` — Cart & checkout**
   Cart items as cards (square image · details · quantity selector · line price · remove ✕).
   Includes:
   - **Delivery method** — self pick-up (free) or islandwide delivery ($50, free over $100)
   - **Discount code validation** (try `BOBA10`, `SWEET5`, `FREESHIP`, `SOFNADE50`)
   - **Delivery / pick-up date selector** — only dates **3+ business days out**, weekends excluded
   - **Two time slots** — 9am–2pm and 2–6pm
   - **Free-delivery progress bar** toward the **$100** threshold (checked against the discounted total)
   - **Terms & conditions** checkbox gating the Place Order button

## Discount codes

| Code | Effect |
|------|--------|
| `BOBA10` | 10% off the order |
| `SOFNADE50` | 50% off the order |
| `SWEET5` | $5 off the order |
| `FREESHIP` | Free delivery |

The **free-delivery $100 threshold is evaluated against the discounted total**, so a
large percentage discount can drop an order back below the free-delivery line.

## Project structure

```
index.html        Listing page
product.html      Product detail page
checkout.html     Cart / checkout page
css/styles.css    All styles
data/products.js  Product catalog (tags, prices, toppings, related items)
js/images.js      Resolves real photos under assets/, with an SVG fallback
js/cart.js        localStorage-backed cart
js/common.js      Shared header/footer/toast helpers
assets/<id>/      Product photos: <id>-1.jpg, <id>-2.jpg, ...
```

## Notes

- The cart persists in `localStorage` (`boba_cart_v1`).
- To add or edit products, edit `data/products.js` only. Set `imageCount` to the
  number of photos in that product's `assets/<id>/` folder; `js/images.js` builds
  the paths automatically and uses the first image as the card/thumbnail.
- Drink toppings are defined once in `ADDONS` and referenced per drink via `upsell`.
