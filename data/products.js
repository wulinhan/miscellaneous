/* =========================================================================
   SOFNADE PRODUCT CATALOG
   Real product photos live under assets/<id>/<id>-N.jpg (see js/images.js).
   Each product can carry MULTIPLE tags. Tags drive the sidebar filtering.
   - Main categories: "Bubble Tea", "Sweets", "Snacks", "Gift Sets"
   - Cross tags:       "Best Seller", "New", "Vegan", "Bundle"
   `upsell` lists drink TOPPINGS (keys in ADDONS) shown on the product page.
   `imageCount` is how many photos that product has in its assets folder.
   ========================================================================= */

const PRODUCTS = [
  /* ----------------------------- BUBBLE TEA ----------------------------- */
  {
    id: 'signature-milk-tea',
    title: 'Signature Milk Tea',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Best Seller'],
    imageCount: 1,
    shortDesc: 'Our house black tea shaken with fresh milk, smooth and full-bodied.',
    longDesc: 'The Sofnade classic since 2015. A robust brew of hand-selected black tea, shaken to order with fresh milk over ice for a smooth, full-bodied cup that is never too sweet. Add tapioca pearls to make it the original bubble tea.',
    price: 4.50,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['pearls', 'grass-jelly', 'egg-pudding', 'cheese-foam', 'oat-milk'],
    alsoBought: ['brown-sugar-pearl-milk-tea', 'snowy-pearl-fresh-milk', 'cookies']
  },
  {
    id: 'brown-sugar-pearl-milk-tea',
    title: 'Brown Sugar Pearl Milk Tea',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Best Seller'],
    imageCount: 1,
    shortDesc: 'Caramelised brown sugar, fresh milk and warm chewy pearls.',
    longDesc: 'Caramelised brown sugar syrup is swirled along the cup and filled with fresh milk and a generous scoop of warm, chewy tapioca pearls. Rich, toffee-sweet and endlessly satisfying.',
    price: 5.50,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['pearls', 'egg-pudding', 'cheese-foam', 'oat-milk'],
    alsoBought: ['signature-milk-tea', 'velvet-chocolate-milk-tea', 'snowy-pearl-fresh-milk']
  },
  {
    id: 'velvet-chocolate-milk-tea',
    title: 'Velvet Chocolate Milk Tea',
    category: 'Bubble Tea',
    tags: ['Bubble Tea'],
    imageCount: 1,
    shortDesc: 'Smooth cocoa blended with milk tea for a dessert-like sip.',
    longDesc: 'Real cocoa folded into our milk tea base for a velvety, chocolatey cup that drinks like dessert. A favourite with kids and chocolate lovers alike.',
    price: 5.80,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['pearls', 'egg-pudding', 'red-bean', 'oat-milk'],
    alsoBought: ['brown-sugar-pearl-milk-tea', 'signature-milk-tea', 'mini-cakes']
  },
  {
    id: 'snowy-pearl-fresh-milk',
    title: 'Snowy Pearl Fresh Milk',
    category: 'Bubble Tea',
    tags: ['Bubble Tea'],
    imageCount: 1,
    shortDesc: 'Pure fresh milk with chewy pearls, no tea, just creamy comfort.',
    longDesc: 'For the tea-free crowd: cold fresh milk poured over a snowy scoop of chewy pearls. Clean, creamy and lightly sweet, this one is comfort in a cup.',
    price: 4.90,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['pearls', 'grass-jelly', 'red-bean', 'oat-milk'],
    alsoBought: ['signature-milk-tea', 'brown-sugar-pearl-milk-tea', 'velvet-chocolate-milk-tea']
  },
  {
    id: 'peach-blossom-tea',
    title: 'Peach Blossom Tea',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan'],
    imageCount: 1,
    shortDesc: 'Fragrant fruit tea with juicy peach, floral and refreshing.',
    longDesc: 'A fragrant fruit tea steeped with ripe peach for a soft, floral sweetness. Light, refreshing and fully plant-based. Lovely with a spoonful of aloe vera or popping boba.',
    price: 5.20,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['aloe-vera', 'popping-boba', 'grass-jelly'],
    alsoBought: ['passion-sunset-tea', 'mango-sunshine', 'strawberry-blush']
  },
  {
    id: 'passion-sunset-tea',
    title: 'Passion Sunset Tea',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan', 'New'],
    imageCount: 1,
    shortDesc: 'Tangy passionfruit over tea, layered like a tropical sunset.',
    longDesc: 'Tangy passionfruit poured over fruit tea and ice, layered into a tropical sunset of orange and gold. Bright, zesty and thirst-quenching. Naturally vegan.',
    price: 5.20,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['popping-boba', 'aloe-vera', 'grass-jelly'],
    alsoBought: ['mango-sunshine', 'peach-blossom-tea', 'sunny-lemonade']
  },
  {
    id: 'mango-sunshine',
    title: 'Mango Sunshine',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan', 'Best Seller'],
    imageCount: 1,
    shortDesc: 'Sweet, sunny ripe mango blended into a golden fruit cooler.',
    longDesc: 'Ripe, sweet mango blended into a golden, sunshine-bright cooler. Thick, juicy and fully plant-based. Top with popping boba for little bursts of flavour.',
    price: 5.80,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['popping-boba', 'aloe-vera', 'pearls'],
    alsoBought: ['passion-sunset-tea', 'strawberry-blush', 'peach-blossom-tea']
  },
  {
    id: 'strawberry-blush',
    title: 'Strawberry Blush',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'New'],
    imageCount: 1,
    shortDesc: 'Real strawberry, blushing pink and sweetly refreshing.',
    longDesc: 'Real strawberry blended into a blushing-pink cooler that is sweet, fruity and pretty enough to photograph. A crowd-pleaser for all ages.',
    price: 5.80,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['popping-boba', 'aloe-vera'],
    alsoBought: ['mango-sunshine', 'grape-twilight', 'peach-blossom-tea']
  },
  {
    id: 'grape-twilight',
    title: 'Grape Twilight',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan'],
    imageCount: 1,
    shortDesc: 'Deep, juicy grape over ice, sweet with a gentle tartness.',
    longDesc: 'Deep purple grape poured over ice for a juicy, twilight-hued cooler that balances sweet and tart. Refreshing and naturally vegan.',
    price: 5.50,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['popping-boba', 'aloe-vera'],
    alsoBought: ['strawberry-blush', 'mango-sunshine', 'sunny-lemonade']
  },
  {
    id: 'sunny-lemonade',
    title: 'Sunny Lemonade',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Vegan'],
    imageCount: 1,
    shortDesc: 'Zesty fresh lemonade, crisp and bright for a hot day.',
    longDesc: 'Freshly squeezed lemons shaken with ice into a crisp, zesty lemonade. The bright, tangy pick-me-up for a Singapore afternoon. Vegan and caffeine-free.',
    price: 4.80,
    unit: 'cup',
    sizes: ['Regular (500ml)', 'Large (700ml)'],
    upsell: ['aloe-vera', 'popping-boba'],
    alsoBought: ['passion-sunset-tea', 'grape-twilight', 'mango-sunshine']
  },
  {
    id: 'festive-drinks',
    title: 'Festive Party Buckets',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Bundle', 'New'],
    imageCount: 6,
    shortDesc: 'Sharing-size party buckets of our seasonal fruit drinks.',
    longDesc: 'Our limited seasonal showstopper: oversized sharing buckets of layered fruit drinks, dressed up for the festive table with fresh fruit and herbs. Choose your flavours and a colour theme, perfect for parties and gatherings.',
    price: 32.00,
    unit: 'bucket',
    sizes: ['Party Bucket (1.5L)'],
    upsell: ['popping-boba', 'aloe-vera'],
    alsoBought: ['mango-sunshine', 'strawberry-blush', 'festive-gift-bag']
  },

  /* ------------------------------- SWEETS ------------------------------- */
  {
    id: 'cookies',
    title: 'Almond Cranberry Cookies',
    category: 'Sweets',
    tags: ['Sweets', 'Best Seller'],
    imageCount: 1,
    shortDesc: 'Buttery cookies packed with toasted almonds and dried cranberries.',
    longDesc: 'Rustic, buttery cookies loaded with slivered toasted almonds and tart dried cranberries. Crisp at the edge with a tender bite, they are the perfect partner to a cup of milk tea.',
    price: 12.00,
    unit: 'box',
    sizes: ['Box of 8', 'Box of 16'],
    upsell: [],
    alsoBought: ['mini-cakes', 'chocolate-truffles', 'signature-milk-tea']
  },
  {
    id: 'mini-cakes',
    title: 'Assorted Mini Cakes',
    category: 'Sweets',
    tags: ['Sweets', 'New'],
    imageCount: 2,
    shortDesc: 'A jewel box of petite cakes and tarts in seasonal flavours.',
    longDesc: 'A jewel box of bite-sized cakes and tarts, from matcha sponge to fruit tartlets and decorated petit fours. Beautifully finished by hand, they make any spread feel special.',
    price: 18.00,
    unit: 'box',
    sizes: ['Box of 6', 'Box of 12'],
    upsell: [],
    alsoBought: ['cookies', 'chocolate-truffles', 'fruit-dessert-cups']
  },
  {
    id: 'churros',
    title: 'Cinnamon Churros',
    category: 'Sweets',
    tags: ['Sweets'],
    imageCount: 1,
    shortDesc: 'Golden, crunchy churro bites, ridged and lightly spiced.',
    longDesc: 'Golden, ridged churro bites fried until crunchy and lightly spiced. Snackable by the handful and even better shared. Pairs beautifully with a chocolate drink.',
    price: 8.00,
    unit: 'tub',
    sizes: ['Regular', 'Sharing'],
    upsell: [],
    alsoBought: ['fried-fritters', 'velvet-chocolate-milk-tea', 'cookies']
  },
  {
    id: 'fried-fritters',
    title: 'Cinnamon Sugar Fritters',
    category: 'Sweets',
    tags: ['Sweets'],
    imageCount: 1,
    shortDesc: 'Crispy fritter sticks tossed in cinnamon sugar.',
    longDesc: 'Crispy little fritter sticks tossed generously in warm cinnamon sugar. Sweet, crunchy and dangerously moreish, they disappear fast at any gathering.',
    price: 7.00,
    unit: 'tub',
    sizes: ['Regular', 'Sharing'],
    upsell: [],
    alsoBought: ['churros', 'cookies', 'mango-sunshine']
  },
  {
    id: 'chocolate-truffles',
    title: 'Artisan Chocolate Truffles',
    category: 'Sweets',
    tags: ['Sweets', 'Best Seller'],
    imageCount: 1,
    shortDesc: 'Hand-finished bonbons in an assortment of flavours.',
    longDesc: 'A curated assortment of hand-finished chocolate bonbons and truffles, each decorated and filled with a different flavour. As good to look at as they are to eat, and a guaranteed gift winner.',
    price: 16.00,
    unit: 'box',
    sizes: ['Box of 9', 'Box of 16'],
    upsell: [],
    alsoBought: ['mini-cakes', 'cookies', 'chocolate-gift-bag']
  },
  {
    id: 'fruit-dessert-cups',
    title: 'Festive Dessert Cups',
    category: 'Sweets',
    tags: ['Sweets', 'New'],
    imageCount: 3,
    shortDesc: 'Golden sweet bites drizzled with chocolate and matcha.',
    longDesc: 'Cups of warm, golden sweet-dough bites drizzled with chocolate and matcha and finished with festive touches. A fun, shareable dessert that travels well to the party.',
    price: 7.50,
    unit: 'cup',
    sizes: ['Single', 'Pack of 4'],
    upsell: [],
    alsoBought: ['churros', 'fried-fritters', 'mini-cakes']
  },

  /* ------------------------------- SNACKS ------------------------------- */
  {
    id: 'mixed-nuts',
    title: 'Premium Mixed Nuts',
    category: 'Snacks',
    tags: ['Snacks', 'Vegan'],
    imageCount: 1,
    shortDesc: 'Walnuts, almonds and hazelnuts with sweet dates and raisins.',
    longDesc: 'A wholesome mix of walnuts, almonds and hazelnuts tossed with naturally sweet dates and raisins. No frying, no fuss, just a satisfying snack you can feel good about. Vegan.',
    price: 9.50,
    unit: 'pack',
    sizes: ['Pouch (150g)', 'Tub (300g)'],
    upsell: [],
    alsoBought: ['trail-mix', 'cookies', 'festive-gift-bag']
  },
  {
    id: 'trail-mix',
    title: 'Trail Mix',
    category: 'Snacks',
    tags: ['Snacks', 'Vegan'],
    imageCount: 1,
    shortDesc: 'A go-anywhere mix of nuts, seeds and dried fruit.',
    longDesc: 'A go-anywhere blend of nuts, seeds and chewy dried fruit for a quick energy boost on the move. Lightly sweet, nicely crunchy and completely plant-based.',
    price: 8.50,
    unit: 'pack',
    sizes: ['Pouch (150g)', 'Tub (300g)'],
    upsell: [],
    alsoBought: ['mixed-nuts', 'cookies', 'sunny-lemonade']
  },

  /* ------------------------------ GIFT SETS ----------------------------- */
  {
    id: 'chocolate-gift-bag',
    title: 'Chocolate Gift Box',
    category: 'Gift Sets',
    tags: ['Gift Sets', 'Bundle'],
    imageCount: 3,
    shortDesc: 'An assortment of our chocolates in a ribboned gift box with card.',
    longDesc: 'A premium kraft gift box of our assorted chocolates and truffles, finished with a ribbon and a personalised greeting card. Ready to gift for the holidays, thank-yous or corporate occasions.',
    price: 38.00,
    unit: 'box',
    sizes: ['Gift Box'],
    upsell: [],
    alsoBought: ['chocolate-truffles', 'festive-gift-bag', 'cookies']
  },
  {
    id: 'festive-gift-bag',
    title: 'Festive Snack Gift Bag',
    category: 'Gift Sets',
    tags: ['Gift Sets', 'Bundle', 'New'],
    imageCount: 2,
    shortDesc: 'Snack pouches packed in a reusable festive tote.',
    longDesc: 'Our most-loved snacks, the mixed nuts and trail mix, sealed in festive pouches and packed into a reusable printed tote. A thoughtful, ready-to-give gift for the season.',
    price: 32.00,
    unit: 'set',
    sizes: ['Gift Bag'],
    upsell: [],
    alsoBought: ['mixed-nuts', 'trail-mix', 'chocolate-gift-bag']
  }
];

/* Drink toppings / add-ons (referenced by `upsell` ids above) */
const ADDONS = {
  'pearls':       { id: 'pearls',       title: 'Tapioca Pearls', price: 0.80, emoji: '🟤', color: '#5a3d24' },
  'grass-jelly':  { id: 'grass-jelly',  title: 'Grass Jelly',    price: 0.80, emoji: '🟩', color: '#2f3a2f' },
  'egg-pudding':  { id: 'egg-pudding',  title: 'Egg Pudding',    price: 1.00, emoji: '🍮', color: '#e7c66b' },
  'cheese-foam':  { id: 'cheese-foam',  title: 'Cheese Foam',    price: 1.20, emoji: '🧀', color: '#f2e3b3' },
  'oat-milk':     { id: 'oat-milk',     title: 'Oat Milk Swap',  price: 0.60, emoji: '🌾', color: '#cbb487' },
  'red-bean':     { id: 'red-bean',     title: 'Red Bean',       price: 0.80, emoji: '🫘', color: '#7a2e2e' },
  'aloe-vera':    { id: 'aloe-vera',    title: 'Aloe Vera',      price: 0.80, emoji: '🟢', color: '#9bbf6a' },
  'popping-boba': { id: 'popping-boba', title: 'Popping Boba',   price: 1.00, emoji: '🔴', color: '#c0492f' }
};

/* Discount codes accepted at checkout */
const DISCOUNT_CODES = {
  'BOBA10':    { type: 'percent', value: 10, label: '10% off your order' },
  'SOFNADE50': { type: 'percent', value: 50, label: '50% off your order' },
  'SWEET5':    { type: 'fixed',   value: 5,  label: '$5 off your order' },
  'FREESHIP':  { type: 'shipping',value: 0,  label: 'Free delivery unlocked' }
};

/* Main categories, in display order (used for the solid category chip). */
const CATEGORIES = ['Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets'];
function primaryCategory(product) {
  return CATEGORIES.find(c => product.tags.includes(c));
}

/* Helpers shared across pages */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || (ADDONS[id] ? ADDONS[id] : null);
}

function allTags() {
  // Preserve a sensible display order: categories first, then cross tags.
  const categoryOrder = ['Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets'];
  const crossOrder = ['Best Seller', 'New', 'Vegan', 'Bundle'];
  const present = new Set();
  PRODUCTS.forEach(p => p.tags.forEach(t => present.add(t)));
  const categories = categoryOrder.filter(t => present.has(t));
  const cross = crossOrder.filter(t => present.has(t));
  return { categories, cross };
}

function tagCount(tag) {
  return PRODUCTS.filter(p => p.tags.includes(tag)).length;
}
