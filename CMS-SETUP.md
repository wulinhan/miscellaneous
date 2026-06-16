# Sofnade CMS Setup (Sanity)

This connects the website to **Sanity**, a free content dashboard where you can
edit products, prices, categories, toppings, discount codes, delivery rules and
the hero text — no coding. The website reads its content from Sanity and updates
when you publish.

Until this is set up, the site keeps working on its built-in demo catalog, so
nothing breaks in the meantime.

You only need to do this once. Budget about 15 minutes.

---

## What you need
- A free account at https://www.sanity.io (sign up with Google/GitHub/email).
- Node.js installed on your computer (https://nodejs.org, the "LTS" version).

---

## Step 1 — Create your Sanity project and load the data

In a terminal, from the project folder:

```
cd studio
npm install
npx sanity login          # opens your browser to log in
npx sanity init --env     # creates a project; choose "production" dataset
```

When `init` finishes it prints a **Project ID** (also visible at
https://www.sanity.io/manage). Keep it handy.

Load the starter content (your 21 products, categories, toppings, codes, settings):

```
npm run import-seed
```

## Step 2 — Put your Project ID into the website

Open `js/config.js` and paste your Project ID:

```js
window.SANITY_CONFIG = {
  projectId: 'PASTE_YOUR_ID_HERE',
  dataset: 'production',
  apiVersion: '2023-10-01'
};
```

Commit and push that change (or ask me to).

## Step 3 — Allow the website to read the content

In https://www.sanity.io/manage, open your project:
- **API → CORS origins → Add origin:** `https://wulinhan.github.io` (untick "credentials"). Add `http://localhost:8000` too if you preview locally.
- **API → Datasets:** make sure `production` is **Public** (so the shop can read it).

## Step 4 — Open your dashboard and add photos

Run the dashboard:

```
npx sanity deploy        # hosts it at https://YOURNAME.sanity.studio (recommended)
```
(or `npm run dev` to run it locally at http://localhost:3333)

Log in, open **Product**, and upload photos for each item (Photos field). The
seed loads everything except images, so add those once. You can edit anything
else here too.

---

## Day-to-day: how to change the store
1. Go to your Studio (the `.sanity.studio` link, or run `npm run dev`).
2. Edit a Product, Category, Topping, Discount code, or Site settings.
3. Click **Publish**. The website shows the change on the next page load.

## What each section controls
- **Products** — name, photos, descriptions, sizes & prices, categories, toppings, allergens, "customers also bought", display order.
- **Categories** — the filter bar; "order" sets their position.
- **Toppings** — add-ons and their extra price.
- **Discount codes** — code, type (percent / fixed / free delivery), value.
- **Site settings** — hero heading/subtext, delivery fee, free-delivery threshold, pick-up on/off, order lead time, and time slots.

## Notes
- This manages the **storefront content**. Taking real **payments and orders** is
  a separate next step (e.g. Stripe), which we can add when you're ready.
- If Sanity is ever unreachable, the site automatically falls back to the last
  built-in catalog so it stays online.
