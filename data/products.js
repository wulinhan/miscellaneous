/* =========================================================================
   SOFNADE PRODUCT CATALOG
   Real product photos live under assets/<id>/<id>-N.jpg (see js/images.js).
   Each product can carry MULTIPLE tags. Tags drive the sidebar filtering.
   - Main categories: "Bubble Tea", "Sweets", "Snacks", "Gift Sets"
   - Cross tags:       "Best Seller", "New", "Vegan", "Bundle"
   `sizes` is a list of { label, price } — price varies per size. `price`
   below mirrors the lowest size (the "from" price shown on cards).
   `upsell` lists drink TOPPINGS (keys in ADDONS) shown on the product page.
   `imageCount` is how many photos that product has in its assets folder.
   ========================================================================= */

let PRODUCTS = [
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
    sizes: [{ label: 'Regular (500ml)', price: 4.50 }, { label: 'Large (700ml)', price: 5.30 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.50 }, { label: 'Large (700ml)', price: 6.30 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.80 }, { label: 'Large (700ml)', price: 6.60 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 4.90 }, { label: 'Large (700ml)', price: 5.70 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.20 }, { label: 'Large (700ml)', price: 6.00 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.20 }, { label: 'Large (700ml)', price: 6.00 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.80 }, { label: 'Large (700ml)', price: 6.60 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.80 }, { label: 'Large (700ml)', price: 6.60 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 5.50 }, { label: 'Large (700ml)', price: 6.30 }],
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
    sizes: [{ label: 'Regular (500ml)', price: 4.80 }, { label: 'Large (700ml)', price: 5.60 }],
    upsell: ['aloe-vera', 'popping-boba'],
    alsoBought: ['passion-sunset-tea', 'grape-twilight', 'mango-sunshine']
  },
  {
    id: 'festive-drinks',
    title: 'Festive Party Buckets',
    category: 'Bubble Tea',
    tags: ['Bubble Tea', 'Christmas Festive', 'Bundle', 'New'],
    imageCount: 6,
    shortDesc: 'Sharing-size party buckets of our seasonal fruit drinks.',
    longDesc: 'Our limited seasonal showstopper: oversized sharing buckets of layered fruit drinks, dressed up for the festive table with fresh fruit and herbs. Choose your flavours and a colour theme, perfect for parties and gatherings.',
    price: 32.00,
    unit: 'bucket',
    sizes: [{ label: 'Party Bucket (1.5L)', price: 32.00 }],
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
    sizes: [{ label: 'Box of 8', price: 12.00 }, { label: 'Box of 16', price: 22.00 }],
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
    sizes: [{ label: 'Box of 6', price: 18.00 }, { label: 'Box of 12', price: 34.00 }],
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
    sizes: [{ label: 'Regular', price: 8.00 }, { label: 'Sharing', price: 14.00 }],
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
    sizes: [{ label: 'Regular', price: 7.00 }, { label: 'Sharing', price: 12.00 }],
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
    sizes: [{ label: 'Box of 9', price: 16.00 }, { label: 'Box of 16', price: 27.00 }],
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
    sizes: [{ label: 'Single', price: 7.50 }, { label: 'Pack of 4', price: 28.00 }],
    upsell: [],
    alsoBought: ['churros', 'fried-fritters', 'mini-cakes']
  },

  /* ------------------------------- SNACKS ------------------------------- */
  {
    id: 'mixed-nuts',
    title: 'Premium Mixed Nuts',
    category: 'Snacks',
    tags: ['Snacks', 'Christmas Festive', 'Vegan'],
    imageCount: 1,
    shortDesc: 'Walnuts, almonds and hazelnuts with sweet dates and raisins.',
    longDesc: 'A wholesome mix of walnuts, almonds and hazelnuts tossed with naturally sweet dates and raisins. No frying, no fuss, just a satisfying snack you can feel good about. Vegan.',
    price: 9.50,
    unit: 'pack',
    sizes: [{ label: 'Pouch (150g)', price: 9.50 }, { label: 'Tub (300g)', price: 17.00 }],
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
    sizes: [{ label: 'Pouch (150g)', price: 8.50 }, { label: 'Tub (300g)', price: 15.00 }],
    upsell: [],
    alsoBought: ['mixed-nuts', 'cookies', 'sunny-lemonade']
  },

  /* ------------------------------ GIFT SETS ----------------------------- */
  {
    id: 'chocolate-gift-bag',
    title: 'Chocolate Gift Box',
    category: 'Gift Sets',
    tags: ['Gift Sets', 'Christmas Festive', 'Bundle'],
    imageCount: 3,
    shortDesc: 'An assortment of our chocolates in a ribboned gift box with card.',
    longDesc: 'A premium kraft gift box of our assorted chocolates and truffles, finished with a ribbon and a personalised greeting card. Ready to gift for the holidays, thank-yous or corporate occasions.',
    price: 38.00,
    unit: 'box',
    sizes: [{ label: 'Gift Box', price: 38.00 }],
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
    sizes: [{ label: 'Gift Bag', price: 32.00 }],
    upsell: [],
    alsoBought: ['mixed-nuts', 'trail-mix', 'chocolate-gift-bag']
  },
  {"id": "chocolate-chip-cookies", "title": "Chocolate Chip Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery cookies loaded with chocolate chips and toasted almond.", "longDesc": "Ingredients: Butter, Almond, Chocolate Chip, Vanilla, Sugar, Brown Sugar, Egg, Flour, Salt, Baking Powder, Baking Soda, Corn, Milk Powder.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Regular Pack (150g)", "price": 9.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["pandan-gula-melaka-cookies", "kopi-tarik-cookies", "teh-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "pandan-gula-melaka-cookies", "title": "Pandan Gula Melaka Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Fragrant pandan cookies sweetened with rich gula melaka and coconut.", "longDesc": "Ingredients: Plain Flour, Corn Flour, Butter, Egg, Sugar, Baking Powder, Gula Melaka, Pandan Flavour, Coconut Flavour, Leaf Green Flavour, Desicated Coconut, Milk Powder, Salt.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "kopi-tarik-cookies", "teh-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "kopi-tarik-cookies", "title": "Kopi Tarik Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery cookies with the bold, roasty kick of local kopi.", "longDesc": "Ingredients: Brown Sugar, White Sugar, Unsalted Butter, Egg, Vanilla, Flour, Baking Soda, Baking Powder, Milk Powder, Corn Flour, Salt, Coffee Powder.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "teh-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "teh-tarik-cookies", "title": "Teh Tarik Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Milk-tea cookies with red tea and crunchy almond slices.", "longDesc": "Ingredients: Brown Sugar, White Sugar, Unsalted Butter, Egg, Vanilla, Flour, Baking Soda, Baking Powder, Milk Powder, Corn Flour, Almond Slice, Salt, Red Tea Powder, Water.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "chai-tea-cookies", "title": "Chai Tea Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Warmly spiced cookies with chai notes of cinnamon, ginger and clove.", "longDesc": "Ingredients: Brown Sugar, White Sugar, Unsalted Butter, Egg, Vanilla, Flour, Baking Soda, Baking Powder, Milk Powder, Salt, Earl Grey Powder, Nutmeg Powder, Cinnamon Powder, Ginger Powder, Clove Powder, Black Pepper, Corn Flour.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "nutella-tart", "title": "Nutella Tart", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Melt-in-the-mouth tarts filled with rich Nutella.", "longDesc": "Ingredients: Nutella, Butter, Icing Sugar, Egg, Vanilla Essence, Buttermilk Flavour, Plain Flour, Salt, Milk Powder, Yellow Colour.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (19 pcs)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "pineapple-tart", "title": "Pineapple Tart", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery tarts with sweet, tangy pineapple jam.", "longDesc": "Ingredients: Pineapple, Butter, Icing Sugar, Egg, Vanilla Essence, Buttermilk Flavour, Plain Flour, Salt, Milk Powder, Yellow Colour.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (19 pcs)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "almond-suji-cookie", "title": "Almond Suji Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Delicate, ghee-rich suji cookies with ground almond.", "longDesc": "Ingredients: Ghee, Flour, Baking Soda, Icing Sugar, Salt, Ground Almond, Corn Flour.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (16 pcs)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts"]},
  {"id": "red-velvet-cookie", "title": "Red Velvet Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Cocoa red velvet cookies dotted with white chocolate.", "longDesc": "Ingredients: Plain Flour, Corn Flour, Cocoa Powder, Butter, Egg, Sugar, Vanilla, White Chocolate Chip, Salt, Baking Soda, Baking Powder, Cherry Red Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (16 pcs)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "earl-grey-peach-cookies", "title": "Earl Grey Peach Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Fragrant Earl Grey cookies with a hint of juicy peach.", "longDesc": "Ingredients: Plain Flour, Corn Flour, Almond Powder, Butter, Egg, Sugar, Earl Grey Tea Extract, Milk Powder, Baking Soda, Baking Powder, Peach Flavour, Orange Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "cranberry-almond-cookie", "title": "Cranberry Almond Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery cookies packed with tart cranberries and almond.", "longDesc": "Ingredients: Wheat Flour, Sugar, Dried Cranberries, Almond, Butter, Mixed Peel, Citric Acid, Egg, Malt Extract, Sodium Bicarbonate, Baking Powder, Vanilla Powder, Salt.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (40g)", "price": 4.9}, {"label": "Bottle (110g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "signature-sambal-cookie", "title": "Signature Sambal Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Our sweet-and-spicy signature, with sambal, peanut and chilli.", "longDesc": "Ingredients: Butter, Sugar, Brown Sugar, Egg, Sambal, Flour, Salt, Baking Powder, Baking Soda, Corn Flour, Peanut, Dry Onion, Dry Chilli.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 4.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "iced-gems", "title": "Iced Gems", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "The childhood classic: crisp biscuits topped with colourful sugar gems.", "longDesc": "Ingredients: Wheat Flour, Sugar, Cornstarch, Salt, Vegetable Oil, Whey Powder, Egg Powder, Flavouring, Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Nostalgic Tin (280g)", "price": 16.9}], "upsell": [], "alsoBought": ["potato-wheels", "pandan-waffle", "chocolate-waffle"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "potato-wheels", "title": "Potato Wheels", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crunchy, moreish potato wheels with a savoury bite.", "longDesc": "Ingredients: Wheat Flour, Rice Flour, Potato Starch, Wheat Starch, Sugar, Milk Powder, Chicken Seasoning Powder, Vegetable Oil, Yeast, MSG, Water.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Nostalgic Tin (65g)", "price": 16.9}], "upsell": [], "alsoBought": ["iced-gems", "pandan-waffle", "chocolate-waffle"], "allergens": ["Dairy", "Gluten"]},
  {"id": "pandan-waffle", "title": "Pandan Waffle", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crisp little waffles with sweet, fragrant pandan.", "longDesc": "Ingredients: Pandan Essence, Butter, Cornstarch, Sugar, Egg, Milk, Vanilla Extract, Salt.", "price": 16.9, "unit": "pack", "sizes": [{"label": "Nostalgic Tin (340g(48 pcs))", "price": 16.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "chocolate-waffle"], "allergens": ["Dairy", "Eggs"]},
  {"id": "chocolate-waffle", "title": "Chocolate waffle", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crisp little waffles with rich cocoa.", "longDesc": "Ingredients: Cocoa, Butter, Cornstarch, Sugar, Egg, Milk, Vanilla Extract, Salt.", "price": 16.9, "unit": "pack", "sizes": [{"label": "Nostalgic Tin (330g(31 pcs))", "price": 16.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Dairy", "Eggs"]},
  {"id": "kueh-bangkit", "title": "Kueh Bangkit", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Melt-in-the-mouth coconut tapioca cookies, a festive favourite.", "longDesc": "Ingredients: Tapioca Flour, Wheat Flour, Sugar, Coconut Milk, Magarine, Egg, Vegetable Oil, Custard Powder, Salt.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Nostalgic Tin (350g)", "price": 16.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "coconut-pineapple-jam", "title": "Coconut Pineapple Jam", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Bite-size pastries filled with sweet coconut-pineapple jam.", "longDesc": "Ingredients: Pineapple jam, Wheat Flour, Sugar, Tapioca Starch, Palm Oil, Raising Agent.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Nostalgic Tin (330g)", "price": 16.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Gluten"]},
  {"id": "abc-biscuit", "title": "ABC Biscuit", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Nostalgic alphabet biscuits, lightly sweet and crunchy.", "longDesc": "Ingredients: Wheat Flour, Sugar, Palm Oil, Glucose Syrup, Margaring, Milk Powder, Salt, Flavouring, Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Nostalgic Tin (260g)", "price": 16.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Dairy", "Gluten"]},
  {"id": "arrow-head", "title": "Arrow Head", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Thin, crispy arrowhead crisps with just a touch of salt.", "longDesc": "Ingredients: Arrowhead Tubers, Vegetable Oil , Salt.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (60g)", "price": 9.9}, {"label": "Bottle (65g)", "price": 13.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": []},
  {"id": "prawn-roll", "title": "Prawn Roll", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crispy rolls with a savoury dried-shrimp filling.", "longDesc": "Ingredients: Flour, Dried Shrimp, Vegetable Oil, Sugar, Chili Powder, MSG, Potassium Sobate.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (50g)", "price": 4.9}, {"label": "Regular Pack (150g)", "price": 9.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Gluten"]},
  {"id": "curry-tapioca-chips", "title": "Curry Tapioca Chips", "tags": ["Retro Snacks", "Deepavali"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crunchy tapioca chips tossed in fragrant curry spice.", "longDesc": "Ingredients: Fresh Tapioca, Salt, Palm Oil, Curry Powder.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (50g)", "price": 9.9}, {"label": "Bottle (70g)", "price": 13.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": []},
  {"id": "vegetable-cracker", "title": "Vegetable Cracker", "tags": ["Retro Snacks", "Hari Raya"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Light, crispy crackers with savoury garlic and onion.", "longDesc": "Ingredients: Tapioca Flour, Garlic, Onion, Salt, Permitted Colour.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (40g)", "price": 9.9}, {"label": "Bottle (45g)", "price": 13.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": []},
  {"id": "prawn-pillow", "title": "Prawn Pillow", "tags": ["Retro Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Airy, crispy prawn puffs with a moreish savoury flavour.", "longDesc": "Ingredients: Prawn Flavouring, Wheat Flour, palm oil, sugar, salt, and garlic..", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (130g)", "price": 9.9}, {"label": "Bottle (130g)", "price": 13.9}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Gluten"]},
  {"id": "ribbon-murukku", "title": "Ribbon Murukku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crispy ribbon murukku with warm curry spice and chilli.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Chili Powder, Curry Powder (coriander, chili, cumin, turmeric, fennel, dhall, fenugreek, pepper), Palm Oil, and Salt.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (100g)", "price": 13.9}], "upsell": [], "alsoBought": ["classic-murukku", "puff-rice-indian-mixer", "kara-boondi"], "allergens": []},
  {"id": "classic-murukku", "title": "Classic Murukku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Traditional crunchy murukku, buttery and lightly spiced.", "longDesc": "Ingredients: Rice Flour, Urad Dal Flour(Lentil flour), Palm Oil, Butter, Salt, Spices.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (85g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "puff-rice-indian-mixer", "kara-boondi"], "allergens": ["Dairy", "Gluten"]},
  {"id": "puff-rice-indian-mixer", "title": "Puff Rice Indian Mixer", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "A zesty puffed-rice mix with nuts, curry leaves and spice.", "longDesc": "Ingredients: Puffed Rice, Nuts & Legumes, Cooking Oil, Curry Leaves, Mustard Seeds & Cumin, Garlic & Green Chilli, Asafoetida, Turmeric Powder, Red Chili Powder, Chaat Masala & Amchur.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (100g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "kara-boondi"], "allergens": ["Nuts"]},
  {"id": "kara-boondi", "title": "Kara Boondi", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crunchy spiced gram-flour boondi with nuts and herbs.", "longDesc": "Ingredients: Gram Flour, Rice Flour, Spices, Cooking Soda, Oil, Nuts & Herbs, Salt.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (100g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Nuts"]},
  {"id": "murukku-strips", "title": "Murukku Strips", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crispy murukku strips with groundnuts and green peas.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Palm Oil, Salt, Chili Powder, Curry Powder, Groundnuts, Green Pea, Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (120g)", "price": 9.9}, {"label": "Bottle (120g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Nuts"]},
  {"id": "banana-chips", "title": "Banana Chips", "tags": ["Deepavali", "Hari Raya"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crisp banana chips with just a touch of salt.", "longDesc": "Ingredients: Banana, Salt, Oil.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (90g)", "price": 9.9}, {"label": "Bottle (100g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "butter-muruku", "title": "Butter Muruku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Rich, buttery murukku with curry spice and chilli.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Chili Powder, Curry Powder (coriander, chili, cumin, turmeric, fennel, dhall, fenugreek, pepper), Palm Oil, and Salt.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (120g)", "price": 9.9}, {"label": "Bottle (90g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "mini-garlic-muruku", "title": "Mini Garlic Muruku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Bite-size murukku with fragrant garlic and sesame.", "longDesc": "Ingredients: Rice Flour, Urad Dal Flour(Lentil flour), Fresh Garlic Paste, Palm Oil, Butter, Asafoetida, Red Chilli Powder, White Sesame Seed.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (90g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Dairy", "Gluten"]},
  {"id": "butter-muruku-spicy", "title": "Butter muruku (spicy )", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Buttery murukku with an extra chilli kick.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Chili Powder, Curry Powder (coriander, chili, cumin, turmeric, fennel, dhall, fenugreek, pepper), Palm Oil, and Salt.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (120g)", "price": 9.9}, {"label": "Bottle (90g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "belinjau-crackers", "title": "Belinjau Crackers", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crunchy belinjau crackers, simply salted.", "longDesc": "Ingredients: Belinjau Seed, Palm Oil, Salt,.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (100g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "ladoo-tart", "title": "Ladoo Tart", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Melt-in-the-mouth ghee tarts scented with cardamom.", "longDesc": "Ingredients: Unsalted Butter, cardamom powder, Ghee, Sugar, Water, Salt.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (8 pcs)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Dairy"]},
  {"id": "classic-tapioca-chips", "title": "Classic Tapioca Chips", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crispy tapioca chips with a clean, salty crunch.", "longDesc": "Ingredients: Fresh Tapioca, Salt, Palm Oil.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (50g)", "price": 9.9}, {"label": "Bottle (70g)", "price": 13.9}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "kueh-makmur", "title": "Kueh Makmur", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Snowy, melt-in-the-mouth cookies with buttery peanut.", "longDesc": "Ingredients: Wheat Flour, Butter, Sugar, Peanut, Ghee, Palm Oil, Baking Powder.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (16 pcs)", "price": 13.9}], "upsell": [], "alsoBought": ["kerepek-singkong", "kerepek-stick", "rempeyek"], "allergens": ["Dairy", "Gluten", "Nuts"]},
  {"id": "kerepek-singkong", "title": "Kerepek Singkong", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crunchy cassava crisps with a spicy belado kick.", "longDesc": "Ingredients: Palm Oil, Chili Belado Seosoning, Cassava, Chili Extract, Yeast Extract, Yellow Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 4.9}, {"label": "Regular Pack (70g)", "price": 9.9}, {"label": "Bottle (60g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-stick", "rempeyek"], "allergens": []},
  {"id": "kerepek-stick", "title": "Kerepek Stick", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy belado sticks, savoury with a little spice.", "longDesc": "Ingredients: Palm Oil, Wheat Flour, Chili Belado Seasoning, Chili Extract, Yeast Extract, Artificial Sweetener Aspartame, Yellow Colouring.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (20g)", "price": 4.9}, {"label": "Regular Pack (40g)", "price": 9.9}, {"label": "Bottle (70g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "rempeyek"], "allergens": ["Gluten"]},
  {"id": "rempeyek", "title": "Rempeyek", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy peanut-and-anchovy fritters, savoury and spiced.", "longDesc": "Ingredients: Corn Flour, Rice Flour, Water, Peanuts, Anchovies, Coarse Cumin, Fine Cumin, Coriander, Eggs, Sugar, Salt, Palm Oil, Monosodium Glutamate.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (70g)", "price": 9.9}, {"label": "Bottle (70g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Nuts", "Eggs"]},
  {"id": "crab-stick", "title": "Crab Stick", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy crabstick snacks, light and savoury.", "longDesc": "Ingredients: Crabstick, Palm Oil.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (200g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": []},
  {"id": "curry-cracker", "title": "Curry Cracker", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crunchy crackers seasoned with curry and garlic.", "longDesc": "Ingredients: Tapioca Flour, Sugar, MSG, Salt, Palm Oil, Curry Powder, Garlic Powder, Chili Powder.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (60g)", "price": 9.9}, {"label": "Bottle (50g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": []},
  {"id": "mini-fish-cracker", "title": "Mini Fish Cracker", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Bite-size crispy fish crackers, light and savoury.", "longDesc": "Ingredients: Fish, Tapioca Flour, Sugar, Egg, Salt, Flavouring, Vegetable Oil.", "price": 13.9, "unit": "pack", "sizes": [{"label": "Bottle (35-40g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Eggs"]},
  {"id": "mini-tapioca-chip", "title": "Mini Tapioca Chip", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Bite-size tapioca chips with a hint of curry.", "longDesc": "Ingredients: Fresh Tapioca, Salt, Palm Oil, Curry Powder.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (50g)", "price": 9.9}, {"label": "Bottle (70g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": []},
  {"id": "crispy-prawn-roll", "title": "Crispy Prawn Roll", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Extra-crispy rolls with a savoury dried-shrimp filling.", "longDesc": "Ingredients: Flour, Dried Shrimp, Vegetable Oil, Sugar, Chilli Powder, MSG, Potassium Sobate.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (50g)", "price": 4.9}, {"label": "Regular Pack (150g)", "price": 9.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Gluten"]},
  {"id": "kachang-bersalut", "title": "Kachang Bersalut", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crunchy coated peanuts, a moreish festive nibble.", "longDesc": "Ingredients: Nuts, Wheat flour, Egg.", "price": 4.9, "unit": "pack", "sizes": [{"label": "Petite Pack (50g)", "price": 4.9}, {"label": "Regular Pack (100g)", "price": 9.9}, {"label": "Bottle (150g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Gluten", "Nuts", "Eggs"]},
  {"id": "spicy-prawn-cracker", "title": "Spicy Prawn Cracker", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy prawn crackers with a spicy chilli kick.", "longDesc": "Ingredients: Flour, Dried Shrimp, Vegetable Oil, Sugar, Chilli Powder, MSG, Potassium Sobate.", "price": 9.9, "unit": "pack", "sizes": [{"label": "Regular Pack (130g)", "price": 9.9}, {"label": "Bottle (130g)", "price": 13.9}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Gluten"]}
];

/* Drink toppings / add-ons (referenced by `upsell` ids above) */
let ADDONS = {
  'pearls':       { id: 'pearls',       title: 'Tapioca Pearls', price: 0.80 },
  'grass-jelly':  { id: 'grass-jelly',  title: 'Grass Jelly',    price: 0.80 },
  'egg-pudding':  { id: 'egg-pudding',  title: 'Egg Pudding',    price: 1.00 },
  'cheese-foam':  { id: 'cheese-foam',  title: 'Cheese Foam',    price: 1.20 },
  'oat-milk':     { id: 'oat-milk',     title: 'Oat Milk Swap',  price: 0.60 },
  'red-bean':     { id: 'red-bean',     title: 'Red Bean',       price: 0.80 },
  'aloe-vera':    { id: 'aloe-vera',    title: 'Aloe Vera',      price: 0.80 },
  'popping-boba': { id: 'popping-boba', title: 'Popping Boba',   price: 1.00 }
};

/* Allergens present in each product (drives the "About allergens" panel).
   Vegan fruit drinks carry none of the major allergens. */
const ALLERGENS_BY_ID = {
  'signature-milk-tea': ['Dairy'],
  'brown-sugar-pearl-milk-tea': ['Dairy'],
  'velvet-chocolate-milk-tea': ['Dairy', 'Soy'],
  'snowy-pearl-fresh-milk': ['Dairy'],
  'peach-blossom-tea': [],
  'passion-sunset-tea': [],
  'mango-sunshine': [],
  'strawberry-blush': [],
  'grape-twilight': [],
  'sunny-lemonade': [],
  'festive-drinks': [],
  'cookies': ['Gluten', 'Dairy', 'Nuts'],
  'mini-cakes': ['Gluten', 'Dairy', 'Eggs'],
  'churros': ['Gluten', 'Dairy'],
  'fried-fritters': ['Gluten'],
  'chocolate-truffles': ['Dairy', 'Soy', 'Nuts'],
  'fruit-dessert-cups': ['Gluten', 'Dairy'],
  'mixed-nuts': ['Nuts'],
  'trail-mix': ['Nuts'],
  'chocolate-gift-bag': ['Dairy', 'Soy', 'Nuts'],
  'festive-gift-bag': ['Nuts']
};
function productAllergens(p) {
  return (p && p.allergens) ? p.allergens : (ALLERGENS_BY_ID[p.id] || []);
}

/* Discount codes accepted at checkout */
let DISCOUNT_CODES = {
  'BOBA10':    { type: 'percent', value: 10, label: '10% off your order' },
  'SOFNADE50': { type: 'percent', value: 50, label: '50% off your order' },
  'SWEET5':    { type: 'fixed',   value: 5,  label: '$5 off your order' },
  'FREESHIP':  { type: 'shipping',value: 0,  label: 'Free delivery unlocked' }
};

/* Categories a product can belong to (a product may have several). Cross tags
   like Best Seller / New / Vegan / Bundle are internal only and never shown. */
let CATEGORIES = ['Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets', 'Christmas Festive', 'Housebake Cookies', 'Retro Snacks', 'Deepavali', 'Hari Raya'];

/* Order categories appear in the filter bar (Christmas Festive featured first). */
let CATEGORY_BAR_ORDER = ['Christmas Festive', 'Bubble Tea', 'Sweets', 'Snacks', 'Gift Sets', 'Housebake Cookies', 'Retro Snacks', 'Deepavali', 'Hari Raya'];

/* The product's headline category for chips/breadcrumb: prefer a "real"
   category over the seasonal Christmas Festive one. */
function primaryCategory(product) {
  const cats = CATEGORIES.filter(c => product.tags.includes(c));
  return cats.find(c => c !== 'Christmas Festive') || cats[0];
}

/* Every category a product belongs to, primary first. */
function productCategories(product) {
  const cats = CATEGORIES.filter(c => product.tags.includes(c));
  const primary = primaryCategory(product);
  return [primary, ...cats.filter(c => c !== primary)];
}

/* Categories present across the catalog, in bar order. */
function filterCategories() {
  const present = new Set();
  PRODUCTS.forEach(p => p.tags.forEach(t => present.add(t)));
  return CATEGORY_BAR_ORDER.filter(c => present.has(c));
}

/* Helpers shared across pages */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || (ADDONS[id] ? ADDONS[id] : null);
}

/* Price of a given size label (falls back to the product's "from" price). */
function sizePrice(product, label) {
  if (product && product.sizes) {
    const s = product.sizes.find(x => x.label === label);
    if (s) return s.price;
    if (product.sizes.length) return product.sizes[0].price;
  }
  return product ? product.price : 0;
}

/* True when a product offers a real choice of sizes (more than one). */
function hasSizeChoice(product) {
  return !!(product && product.sizes && product.sizes.length > 1);
}

function allTags() {
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

/* =========================================================================
   STORE SETTINGS (editable in the CMS; these are the built-in defaults).
   ========================================================================= */
let SETTINGS = {
  brandName: 'Sofnade',
  heroTitle: 'Crafted fresh.\nSince 2015.',
  heroSubtitle: 'Hand-shaken bubble tea, freshly baked sweets, wholesome snacks and giftable sets, delivered across Singapore.',
  deliveryFee: 50.00,
  freeDeliveryThreshold: 100.00,
  pickupEnabled: true,
  leadBusinessDays: 3,
  timeSlots: [
    { value: '9am–2pm', label: 'Morning',   sub: '9am – 2pm' },
    { value: '2–6pm',   label: 'Afternoon', sub: '2pm – 6pm' }
  ]
};

/* =========================================================================
   applyStore(): overwrite the built-in catalog/settings with CMS data.
   Called by js/store-data.js once content is fetched from Sanity. Anything
   the CMS does not provide keeps its built-in default, so the site always
   has a complete, working dataset.
   ========================================================================= */
function applyStore(store) {
  if (!store) return;
  if (Array.isArray(store.products) && store.products.length) PRODUCTS = store.products;
  if (store.addons && Object.keys(store.addons).length) ADDONS = store.addons;
  if (store.discountCodes && Object.keys(store.discountCodes).length) DISCOUNT_CODES = store.discountCodes;
  if (Array.isArray(store.categories) && store.categories.length) {
    CATEGORIES = store.categories.slice();
    CATEGORY_BAR_ORDER = store.categories.slice();
  }
  if (store.settings) SETTINGS = Object.assign({}, SETTINGS, store.settings);
}
