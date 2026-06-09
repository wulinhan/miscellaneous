# Boba & Co. — Storefront

A small 3-page e-commerce demo for **bubble tea, cookies and snacks**, inspired by
the BioPak product site. Built as plain HTML/CSS/JS — no build step, no backend.
Just open `index.html` in a browser (or serve the folder) and it runs.

## Pages

1. **`index.html` — Product listing**
   Product cards (image, title, description, "from" price/unit) in a grid, with a
   left **sidebar that filters by category/tag**. Products carry multiple tags and
   appear under every matching filter. Filter state is reflected in the URL
   (`?cat=Cookies`) so nav links and the sidebar stay in sync.

2. **`product.html?id=<id>` — Product detail**
   BioPak-style two-column layout. Left: a **gallery** with the active image on top
   and a row of square thumbnails underneath. Right: title, labels/tags, price,
   size option, **upsell add-ons**, quantity selector, add-to-cart, delivery info
   accordion. Below: a **"Customers also bought"** row of product cards.

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
data/products.js  Product catalog (tags, prices, upsells, related items)
js/images.js      Inline SVG placeholder image generator (works offline)
js/cart.js        localStorage-backed cart
js/common.js      Shared header/footer/toast helpers
```

## Notes

- The cart persists in `localStorage` (`boba_cart_v1`).
- Images are generated as inline SVG data URIs, so there are **no external image
  assets** to host. Swap `productImage()` in `js/images.js` for real photo URLs
  to go live.
- To add or edit products, edit `data/products.js` only.
