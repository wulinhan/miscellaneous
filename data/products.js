/* =========================================================================
   PRODUCT CATALOG
   Each product can carry MULTIPLE tags. Tags drive the sidebar filtering.
   - Main categories: "Bubble Tea", "Cookies", "Snacks"
   - Cross tags:       "Best Seller", "New", "Vegan", "Bundle", "Sugar-Free"
   Images are generated as inline SVG placeholders (see js/images.js) so the
   site works fully offline with no external image hosting.
   ========================================================================= */

const PRODUCTS = [
  {
    id: 'classic-milk-tea',
    title: 'Classic Pearl Milk Tea',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Best Seller'],
    emoji: '🧋',
    color: '#caa472',
    shortDesc: 'Our signature black tea with creamy milk and chewy brown sugar pearls.',
    longDesc: 'The one that started it all. A robust brew of single-origin Assam black tea, hand-shaken with fresh dairy and finished with warm, caramelised brown sugar tapioca pearls. Balanced, comforting and endlessly drinkable.',
    price: 4.50,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['extra-pearls', 'oat-milk-swap'],
    alsoBought: ['brown-sugar-boba', 'matcha-latte', 'choc-chip-cookie']
  },
  {
    id: 'brown-sugar-boba',
    title: 'Brown Sugar Boba',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Best Seller', 'New'],
    emoji: '🧋',
    color: '#8a5a2b',
    shortDesc: 'Fresh milk laced with caramelised brown sugar syrup and warm pearls.',
    longDesc: 'Tiger-striped and irresistible. Caramelised brown sugar syrup is swirled along the cup, then filled with cold fresh milk and a generous scoop of warm tapioca pearls. No tea, all indulgence.',
    price: 5.20,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['extra-pearls', 'oat-milk-swap'],
    alsoBought: ['classic-milk-tea', 'taro-latte', 'cookie-box']
  },
  {
    id: 'matcha-latte',
    title: 'Iced Matcha Latte',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan', 'New'],
    emoji: '🍵',
    color: '#7aa15a',
    shortDesc: 'Ceremonial-grade matcha whisked with your choice of milk over ice.',
    longDesc: 'Stone-ground ceremonial matcha from Uji, whisked smooth and poured over ice with creamy oat milk by default. Grassy, sweet and vibrantly green. Fully plant-based.',
    price: 5.80,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['extra-pearls', 'sugar-free-swap'],
    alsoBought: ['taro-latte', 'brown-sugar-boba', 'matcha-cookie']
  },
  {
    id: 'taro-latte',
    title: 'Taro Milk Latte',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan'],
    emoji: '🥤',
    color: '#a98fc4',
    shortDesc: 'Velvety roasted taro blended with milk for a naturally sweet sip.',
    longDesc: 'Real roasted taro root blended into a silky, lilac-hued latte. Nutty, mellow and naturally sweet. Served iced with oat milk and optional pearls.',
    price: 5.50,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['extra-pearls', 'oat-milk-swap'],
    alsoBought: ['matcha-latte', 'classic-milk-tea', 'cookie-box']
  },
  {
    id: 'sugarfree-jasmine',
    title: 'Sugar-Free Jasmine Green',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Sugar-Free', 'Vegan'],
    emoji: '🍃',
    color: '#9bbf6a',
    shortDesc: 'Fragrant jasmine green tea, zero added sugar, lightly refreshing.',
    longDesc: 'Delicate jasmine-scented green tea served unsweetened over ice. Light, floral and refreshing with no added sugar. A clean, guilt-free everyday pour.',
    price: 4.20,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['extra-pearls'],
    alsoBought: ['matcha-latte', 'classic-milk-tea', 'almond-biscotti']
  },

  {
    id: 'choc-chip-cookie',
    title: 'Brown Butter Choc Chip Cookie',
    category: 'Cookies',
    tags: ['Cookies', 'Best Seller'],
    emoji: '🍪',
    color: '#b07d4a',
    shortDesc: 'Gooey centre, crisp edges, loaded with dark chocolate chunks.',
    longDesc: 'Baked fresh daily with nutty brown butter, a hint of sea salt and generous dark chocolate chunks. Crisp at the edge, molten in the middle. Best warmed for ten seconds.',
    price: 3.00,
    unit: 'cookie',
    sizes: ['Single', 'Half Dozen', 'Dozen'],
    upsell: ['warm-pack', 'classic-milk-tea'],
    alsoBought: ['cookie-box', 'matcha-cookie', 'brown-sugar-boba']
  },
  {
    id: 'matcha-cookie',
    title: 'Matcha White Chocolate Cookie',
    category: 'Cookies',
    tags: ['Cookies', 'New'],
    emoji: '🍪',
    color: '#8fae63',
    shortDesc: 'Earthy matcha dough studded with sweet white chocolate.',
    longDesc: 'A soft, chewy cookie coloured deep green with ceremonial matcha and dotted with creamy white chocolate. The slight bitterness of the tea balances the sweetness beautifully.',
    price: 3.40,
    unit: 'cookie',
    sizes: ['Single', 'Half Dozen', 'Dozen'],
    upsell: ['warm-pack', 'matcha-latte'],
    alsoBought: ['choc-chip-cookie', 'cookie-box', 'matcha-latte']
  },
  {
    id: 'almond-biscotti',
    title: 'Almond Biscotti',
    category: 'Cookies',
    tags: ['Cookies', 'Vegan'],
    emoji: '🍪',
    color: '#c9a26b',
    shortDesc: 'Twice-baked, crunchy and perfect for dunking. Plant-based.',
    longDesc: 'Classic Italian-style biscotti, twice-baked until crisp and packed with toasted almonds. Entirely plant-based and made for dunking into your favourite tea.',
    price: 2.80,
    unit: 'piece',
    sizes: ['Single', 'Pack of 4', 'Pack of 8'],
    upsell: ['classic-milk-tea'],
    alsoBought: ['choc-chip-cookie', 'cookie-box', 'sugarfree-jasmine']
  },
  {
    id: 'cookie-box',
    title: 'Mixed Cookie Gift Box',
    category: 'Cookies',
    tags: ['Cookies', 'Bundle', 'Best Seller'],
    emoji: '🎁',
    color: '#c98a5a',
    shortDesc: 'A curated dozen of our best cookies in a giftable box.',
    longDesc: 'Twelve of our most-loved cookies, packed in a kraft gift box with ribbon. A rotating mix of choc chip, matcha white chocolate and almond biscotti. Ideal for sharing or gifting.',
    price: 28.00,
    unit: 'box',
    sizes: ['Box of 12'],
    upsell: ['warm-pack'],
    alsoBought: ['choc-chip-cookie', 'matcha-cookie', 'snack-bundle']
  },

  {
    id: 'popcorn-chicken',
    title: 'Salt & Pepper Popcorn Bites',
    category: 'Snacks',
    tags: ['Snacks', 'Best Seller'],
    emoji: '🍿',
    color: '#d49a4a',
    shortDesc: 'Crispy bite-sized snacks tossed in salt, pepper and basil.',
    longDesc: 'Golden, bite-sized crispy bites tossed in our house salt-and-pepper seasoning with crispy basil leaves. The perfect savoury companion to a sweet bubble tea.',
    price: 6.50,
    unit: 'box',
    sizes: ['Regular', 'Sharing'],
    upsell: ['classic-milk-tea', 'snack-bundle'],
    alsoBought: ['seaweed-crisps', 'snack-bundle', 'brown-sugar-boba']
  },
  {
    id: 'seaweed-crisps',
    title: 'Crispy Seaweed Crisps',
    category: 'Snacks',
    tags: ['Snacks', 'Vegan', 'New'],
    emoji: '🥬',
    color: '#5f8f5a',
    shortDesc: 'Light, savoury roasted seaweed crisps. Vegan and moreish.',
    longDesc: 'Sheets of roasted seaweed crisped to a delicate shatter and lightly salted. Savoury, umami-rich and completely plant-based. Dangerously snackable.',
    price: 3.80,
    unit: 'pack',
    sizes: ['Single', 'Pack of 3'],
    upsell: ['snack-bundle'],
    alsoBought: ['popcorn-chicken', 'snack-bundle', 'sugarfree-jasmine']
  },
  {
    id: 'snack-bundle',
    title: 'Movie Night Snack Bundle',
    category: 'Snacks',
    tags: ['Snacks', 'Bundle'],
    emoji: '📦',
    color: '#d08a4a',
    shortDesc: 'Popcorn bites, seaweed crisps and two drinks. Built to share.',
    longDesc: 'Everything you need for a night in: a sharing box of popcorn bites, two packs of seaweed crisps and two regular bubble teas of your choice. Save versus buying separately.',
    price: 24.00,
    unit: 'bundle',
    sizes: ['Serves 2'],
    upsell: ['cookie-box'],
    alsoBought: ['popcorn-chicken', 'seaweed-crisps', 'cookie-box']
  }
];

/* Add-on / upsell items (not shown in the main grid, referenced by id) */
const ADDONS = {
  'extra-pearls':   { id: 'extra-pearls',   title: 'Add Extra Pearls',        price: 0.80, emoji: '⚫', color: '#5a3d24' },
  'oat-milk-swap':  { id: 'oat-milk-swap',  title: 'Swap to Oat Milk',        price: 0.60, emoji: '🌾', color: '#cbb487' },
  'sugar-free-swap':{ id: 'sugar-free-swap',title: 'Make it Sugar-Free',      price: 0.00, emoji: '🚫', color: '#9bbf6a' },
  'warm-pack':      { id: 'warm-pack',      title: 'Add a Warming Sleeve',    price: 0.50, emoji: '🔥', color: '#d4894a' }
};

/* Discount codes accepted at checkout */
const DISCOUNT_CODES = {
  'BOBA10':    { type: 'percent', value: 10, label: '10% off your order' },
  'SWEET5':    { type: 'fixed',   value: 5,  label: '$5 off your order' },
  'FREESHIP':  { type: 'shipping',value: 0,  label: 'Free shipping unlocked' }
};

/* Helpers shared across pages */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || (ADDONS[id] ? ADDONS[id] : null);
}

function allTags() {
  // Preserve a sensible display order: categories first, then cross tags.
  const categoryOrder = ['Bubble Tea', 'Cookies', 'Snacks'];
  const crossOrder = ['Best Seller', 'New', 'Vegan', 'Bundle', 'Sugar-Free'];
  const present = new Set();
  PRODUCTS.forEach(p => p.tags.forEach(t => present.add(t)));
  const categories = categoryOrder.filter(t => present.has(t));
  const cross = crossOrder.filter(t => present.has(t));
  return { categories, cross };
}

function tagCount(tag) {
  return PRODUCTS.filter(p => p.tags.includes(tag)).length;
}
