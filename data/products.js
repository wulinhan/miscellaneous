/* =========================================================================
   SOFNADE PRODUCT CATALOG
   Real product photos live under assets/<id>/<id>-N.jpg (see js/images.js).
   Each product can carry MULTIPLE tags. Tags drive the sidebar filtering.
   - Main categories: "Drinks", "Sweets", "Snacks", "Gift Sets"
   - Cross tags:       "Best Seller", "New", "Vegan", "Bundle"
   `sizes` is a list of { label, price } — price varies per size. `price`
   below mirrors the lowest size (the "from" price shown on cards).
   `upsell` lists drink TOPPINGS (keys in ADDONS) shown on the product page.
   `imageCount` is how many photos that product has in its assets folder.
   ========================================================================= */

let PRODUCTS = [
  /* ---------- BUBBLE TEA (order.sofnade.com) ---------- */
  {"id": "lychee-mint-tea", "title": "Lychee Mint Tea", "tags": ["Drinks"], "section": "Fusion Teas", "emoji": "🧋", "color": "#c98a4a", "shortDesc": "A refreshing blend of sweet lychee and cool, fresh mint.", "longDesc": "A refreshing blend of sweet lychee and cool, fresh mint.", "price": 3.6, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.6}, {"label": "Bottle (650ml)", "price": 6.1}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mango-green-tea", "iced-lemon-tea", "thai-lemon-tea"], "allergens": []},
  {"id": "mango-green-tea", "title": "Mango Green Tea", "tags": ["Drinks"], "section": "Fusion Teas", "emoji": "🧋", "color": "#c98a4a", "shortDesc": "Tropical mango sweetness with the fragrance of green tea.", "longDesc": "Tropical mango sweetness with the fragrance of green tea.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["lychee-mint-tea", "iced-lemon-tea", "thai-lemon-tea"], "allergens": []},
  {"id": "iced-lemon-tea", "title": "Iced Lemon Tea", "tags": ["Drinks"], "section": "Fusion Teas", "emoji": "🧋", "color": "#c98a4a", "shortDesc": "A refreshing iced lemon tea for a hot day or any time you need a cool pick-me-up.", "longDesc": "A refreshing iced lemon tea for a hot day or any time you need a cool pick-me-up.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["lychee-mint-tea", "mango-green-tea", "thai-lemon-tea"], "allergens": []},
  {"id": "thai-lemon-tea", "title": "Thai Lemon Tea", "tags": ["Drinks"], "section": "Fusion Teas", "emoji": "🧋", "color": "#c98a4a", "shortDesc": "Thai-style lemon tea (Cha Manao), a popular and refreshing citrus brew.", "longDesc": "Thai-style lemon tea (Cha Manao), a popular and refreshing citrus brew.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["lychee-mint-tea", "mango-green-tea", "iced-lemon-tea"], "allergens": []},
  {"id": "peach-green-tea", "title": "Peach Green Tea", "tags": ["Drinks"], "section": "Fusion Teas", "emoji": "🧋", "color": "#c98a4a", "shortDesc": "The sweetness of peach with the fragrance of green tea.", "longDesc": "The sweetness of peach with the fragrance of green tea.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["lychee-mint-tea", "mango-green-tea", "iced-lemon-tea"], "allergens": []},
  {"id": "strawberry-green-tea", "title": "Strawberry Green Tea", "tags": ["Drinks"], "section": "Fusion Teas", "emoji": "🧋", "color": "#c98a4a", "shortDesc": "Tropical strawberry sweetness with the fragrance of green tea.", "longDesc": "Tropical strawberry sweetness with the fragrance of green tea.", "price": 3.6, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.6}, {"label": "Bottle (650ml)", "price": 6.1}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["lychee-mint-tea", "mango-green-tea", "iced-lemon-tea"], "allergens": []},
  {"id": "strawberry-iced-tea", "title": "Strawberry Iced Tea", "tags": ["Drinks"], "section": "Classic Iced Teas", "emoji": "🧋", "color": "#b5793a", "shortDesc": "Tropical strawberry sweetness with the fragrance of black tea.", "longDesc": "Tropical strawberry sweetness with the fragrance of black tea.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mango-iced-tea", "classic-iced-tea", "jasmine-green-iced-tea"], "allergens": []},
  {"id": "mango-iced-tea", "title": "Mango Iced Tea", "tags": ["Drinks"], "section": "Classic Iced Teas", "emoji": "🧋", "color": "#b5793a", "shortDesc": "Tropical mango sweetness with the fragrance of black tea.", "longDesc": "Tropical mango sweetness with the fragrance of black tea.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["strawberry-iced-tea", "classic-iced-tea", "jasmine-green-iced-tea"], "allergens": []},
  {"id": "classic-iced-tea", "title": "Classic Iced Tea", "tags": ["Drinks"], "section": "Classic Iced Teas", "emoji": "🧋", "color": "#b5793a", "shortDesc": "A classic tea for a refreshing day.", "longDesc": "A classic tea for a refreshing day.", "price": 2.9, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 2.9}, {"label": "Bottle (650ml)", "price": 5.4}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["strawberry-iced-tea", "mango-iced-tea", "jasmine-green-iced-tea"], "allergens": []},
  {"id": "jasmine-green-iced-tea", "title": "Jasmine Green Iced Tea", "tags": ["Drinks"], "section": "Classic Iced Teas", "emoji": "🧋", "color": "#b5793a", "shortDesc": "Delicate floral jasmine green tea in every refreshing sip.", "longDesc": "Delicate floral jasmine green tea in every refreshing sip.", "price": 2.9, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 2.9}, {"label": "Bottle (650ml)", "price": 5.4}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["strawberry-iced-tea", "mango-iced-tea", "classic-iced-tea"], "allergens": []},
  {"id": "oolong-iced-tea", "title": "Oolong Iced Tea", "tags": ["Drinks"], "section": "Classic Iced Teas", "emoji": "🧋", "color": "#b5793a", "shortDesc": "The roasted, nutty taste of our oolong, served iced.", "longDesc": "The roasted, nutty taste of our oolong, served iced.", "price": 2.9, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 2.9}, {"label": "Bottle (650ml)", "price": 5.4}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["strawberry-iced-tea", "mango-iced-tea", "classic-iced-tea"], "allergens": []},
  {"id": "earl-grey-iced-tea", "title": "Earl Grey Iced Tea", "tags": ["Drinks"], "section": "Classic Iced Teas", "emoji": "🧋", "color": "#b5793a", "shortDesc": "Aromatic, citrusy iced Earl Grey tea.", "longDesc": "Aromatic, citrusy iced Earl Grey tea.", "price": 2.9, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 2.9}, {"label": "Bottle (650ml)", "price": 5.4}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["strawberry-iced-tea", "mango-iced-tea", "classic-iced-tea"], "allergens": []},
  {"id": "blueberry-soda", "title": "Blueberry Soda", "tags": ["Drinks"], "section": "Sodas", "emoji": "🥤", "color": "#6aa0c4", "shortDesc": "Sweet blueberry with soda.", "longDesc": "Sweet blueberry with soda.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["lychee-soda", "peach-soda", "strawberry-soda"], "allergens": []},
  {"id": "lychee-soda", "title": "Lychee Soda", "tags": ["Drinks"], "section": "Sodas", "emoji": "🥤", "color": "#6aa0c4", "shortDesc": "Sweet, floral lychee with soda.", "longDesc": "Sweet, floral lychee with soda.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["blueberry-soda", "peach-soda", "strawberry-soda"], "allergens": []},
  {"id": "peach-soda", "title": "Peach Soda", "tags": ["Drinks"], "section": "Sodas", "emoji": "🥤", "color": "#6aa0c4", "shortDesc": "Delicious peach puree with soda.", "longDesc": "Delicious peach puree with soda.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["blueberry-soda", "lychee-soda", "strawberry-soda"], "allergens": []},
  {"id": "strawberry-soda", "title": "Strawberry Soda", "tags": ["Drinks"], "section": "Sodas", "emoji": "🥤", "color": "#6aa0c4", "shortDesc": "Sweet strawberry puree with soda.", "longDesc": "Sweet strawberry puree with soda.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["blueberry-soda", "lychee-soda", "peach-soda"], "allergens": []},
  {"id": "lemon-lime-soda", "title": "Lemon Lime Soda", "tags": ["Drinks"], "section": "Sodas", "emoji": "🥤", "color": "#6aa0c4", "shortDesc": "Zesty lemon and lime puree with soda.", "longDesc": "Zesty lemon and lime puree with soda.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["blueberry-soda", "lychee-soda", "peach-soda"], "allergens": []},
  {"id": "mango-soda", "title": "Mango Soda", "tags": ["Drinks"], "section": "Sodas", "emoji": "🥤", "color": "#6aa0c4", "shortDesc": "Sweet mango puree with soda.", "longDesc": "Sweet mango puree with soda.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["blueberry-soda", "lychee-soda", "peach-soda"], "allergens": []},
  {"id": "mint-lemonade", "title": "Mint Lemonade", "tags": ["Drinks"], "section": "Lemonades", "emoji": "🍋", "color": "#e3b94a", "shortDesc": "Ice-cold lemonade bursting with citrus and cool, fresh mint.", "longDesc": "Ice-cold lemonade bursting with citrus and cool, fresh mint.", "price": 4.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 4.1}, {"label": "Bottle (650ml)", "price": 6.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["classic-lemonade", "pink-lemonade", "honey-peach-lemonade"], "allergens": []},
  {"id": "classic-lemonade", "title": "Classic Lemonade", "tags": ["Drinks"], "section": "Lemonades", "emoji": "🍋", "color": "#e3b94a", "shortDesc": "Icy cold and bursting with 100% freshly squeezed lemons, the perfect thirst quencher.", "longDesc": "Icy cold and bursting with 100% freshly squeezed lemons, the perfect thirst quencher.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mint-lemonade", "pink-lemonade", "honey-peach-lemonade"], "allergens": []},
  {"id": "pink-lemonade", "title": "Pink Lemonade", "tags": ["Drinks"], "section": "Lemonades", "emoji": "🍋", "color": "#e3b94a", "shortDesc": "Sweet strawberries meet tangy lemon in a vibrant, ice-cold pink lemonade.", "longDesc": "Sweet strawberries meet tangy lemon in a vibrant, ice-cold pink lemonade.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mint-lemonade", "classic-lemonade", "honey-peach-lemonade"], "allergens": []},
  {"id": "honey-peach-lemonade", "title": "Honey Peach Lemonade", "tags": ["Drinks"], "section": "Lemonades", "emoji": "🍋", "color": "#e3b94a", "shortDesc": "Sun-kissed peaches meet tangy lemons in a bright, summery lemonade.", "longDesc": "Sun-kissed peaches meet tangy lemons in a bright, summery lemonade.", "price": 3.1, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.1}, {"label": "Bottle (650ml)", "price": 5.6}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mint-lemonade", "classic-lemonade", "pink-lemonade"], "allergens": []},
  {"id": "mango-fresh-milk", "title": "Mango Fresh Milk", "tags": ["Drinks"], "section": "Fresh Milk", "emoji": "🥛", "color": "#cdbba0", "shortDesc": "Chilled fresh milk with mango puree, a tropical dream in every sip. (4 working days advance order.)", "longDesc": "Chilled fresh milk with mango puree, a tropical dream in every sip. (4 working days advance order.)", "price": 4.5, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 4.5}, {"label": "Bottle (650ml)", "price": 7.0}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["strawberry-fresh-milk", "peach-fresh-milk", "brown-sugar-jelly-fresh-milk"], "allergens": ["Dairy"]},
  {"id": "strawberry-fresh-milk", "title": "Strawberry Fresh Milk", "tags": ["Drinks"], "section": "Fresh Milk", "emoji": "🥛", "color": "#cdbba0", "shortDesc": "Chilled milk swirled with vibrant strawberry puree, sweet, creamy and bursting with summer.", "longDesc": "Chilled milk swirled with vibrant strawberry puree, sweet, creamy and bursting with summer.", "price": 4.5, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 4.5}, {"label": "Bottle (650ml)", "price": 7.0}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mango-fresh-milk", "peach-fresh-milk", "brown-sugar-jelly-fresh-milk"], "allergens": ["Dairy"]},
  {"id": "peach-fresh-milk", "title": "Peach Fresh Milk", "tags": ["Drinks"], "section": "Fresh Milk", "emoji": "🥛", "color": "#cdbba0", "shortDesc": "Chilled milk with honey peach puree, a sip of pure summer refreshment.", "longDesc": "Chilled milk with honey peach puree, a sip of pure summer refreshment.", "price": 4.5, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 4.5}, {"label": "Bottle (650ml)", "price": 7.0}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mango-fresh-milk", "strawberry-fresh-milk", "brown-sugar-jelly-fresh-milk"], "allergens": ["Dairy"]},
  {"id": "brown-sugar-jelly-fresh-milk", "title": "Brown Sugar Jelly Fresh Milk", "tags": ["Drinks"], "section": "Fresh Milk", "emoji": "🥛", "color": "#cdbba0", "shortDesc": "Chilled milk kissed by roasted brown sugar with a hint of jelly. Sweet, creamy and cool.", "longDesc": "Chilled milk kissed by roasted brown sugar with a hint of jelly. Sweet, creamy and cool.", "price": 4.5, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 4.5}, {"label": "Bottle (650ml)", "price": 7.0}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["mango-fresh-milk", "strawberry-fresh-milk", "peach-fresh-milk"], "allergens": ["Dairy"]},
  {"id": "signature-classic-milk-tea", "title": "Signature Classic Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "A special blend of the best Assam tea leaves from Taiwan. Fragrant and addictive.", "longDesc": "A special blend of the best Assam tea leaves from Taiwan. Fragrant and addictive.", "price": 3.2, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.2}, {"label": "Bottle (650ml)", "price": 5.7}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["jasmine-green-milk-tea", "earl-grey-milk-tea", "caramel-milk-tea"], "allergens": ["Dairy"]},
  {"id": "jasmine-green-milk-tea", "title": "Jasmine Green Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "The perfect blend of floral jasmine notes and creamy goodness.", "longDesc": "The perfect blend of floral jasmine notes and creamy goodness.", "price": 3.2, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.2}, {"label": "Bottle (650ml)", "price": 5.7}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "earl-grey-milk-tea", "caramel-milk-tea"], "allergens": ["Dairy"]},
  {"id": "earl-grey-milk-tea", "title": "Earl Grey Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "A creamy, dreamy blend of bergamot-infused tea and velvety milk.", "longDesc": "A creamy, dreamy blend of bergamot-infused tea and velvety milk.", "price": 3.7, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.7}, {"label": "Bottle (650ml)", "price": 6.2}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "jasmine-green-milk-tea", "caramel-milk-tea"], "allergens": ["Dairy"]},
  {"id": "caramel-milk-tea", "title": "Caramel Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "Sweet dreams do come true. Fragrant and creamy.", "longDesc": "Sweet dreams do come true. Fragrant and creamy.", "price": 3.7, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.7}, {"label": "Bottle (650ml)", "price": 6.2}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "jasmine-green-milk-tea", "earl-grey-milk-tea"], "allergens": ["Dairy"]},
  {"id": "honey-milk-tea", "title": "Honey Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "A decadent, comforting blend of honey and milk tea.", "longDesc": "A decadent, comforting blend of honey and milk tea.", "price": 3.7, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.7}, {"label": "Bottle (650ml)", "price": 6.2}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "jasmine-green-milk-tea", "earl-grey-milk-tea"], "allergens": ["Dairy"]},
  {"id": "red-thai-milk-tea", "title": "Red Thai Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "A creamy, sweet Thai treat. Best enjoyed at 75% sugar.", "longDesc": "A creamy, sweet Thai treat. Best enjoyed at 75% sugar.", "price": 3.2, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.2}, {"label": "Bottle (650ml)", "price": 5.7}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "jasmine-green-milk-tea", "earl-grey-milk-tea"], "allergens": ["Dairy"]},
  {"id": "green-thai-milk-tea", "title": "Green Thai Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "A creamy, sweet green Thai treat. Best enjoyed at 75% sugar.", "longDesc": "A creamy, sweet green Thai treat. Best enjoyed at 75% sugar.", "price": 3.2, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.2}, {"label": "Bottle (650ml)", "price": 5.7}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "jasmine-green-milk-tea", "earl-grey-milk-tea"], "allergens": ["Dairy"]},
  {"id": "oolong-milk-tea", "title": "Oolong Milk Tea", "tags": ["Drinks"], "section": "Milk Teas", "emoji": "🧋", "color": "#c4a06a", "shortDesc": "The creamy, roasted, nutty taste of our oolong milk tea.", "longDesc": "The creamy, roasted, nutty taste of our oolong milk tea.", "price": 3.7, "unit": "cup", "sizes": [{"label": "Regular cup (500ml)", "price": 3.7}, {"label": "Bottle (650ml)", "price": 6.2}], "upsell": ["pearls", "taro-balls", "aiyu-jelly", "brown-sugar-jelly", "aloe-vera", "grass-jelly", "mango-pops", "strawberry-pops", "passionfruit-pops"], "alsoBought": ["signature-classic-milk-tea", "jasmine-green-milk-tea", "earl-grey-milk-tea"], "allergens": ["Dairy"]},
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
    alsoBought: ['mini-cakes', 'chocolate-truffles', 'signature-classic-milk-tea']
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
    alsoBought: ['fried-fritters', 'caramel-milk-tea', 'cookies']
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
    alsoBought: ['churros', 'cookies', 'mango-iced-tea']
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
    alsoBought: ['mixed-nuts', 'cookies', 'classic-lemonade']
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
  {"id": "chocolate-chip-cookies", "title": "Chocolate Chip Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery cookies loaded with chocolate chips and toasted almond.", "longDesc": "Ingredients: Butter, Almond, Chocolate Chip, Vanilla, Sugar, Brown Sugar, Egg, Flour, Salt, Baking Powder, Baking Soda, Corn, Milk Powder.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["pandan-gula-melaka-cookies", "kopi-tarik-cookies", "teh-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "pandan-gula-melaka-cookies", "title": "Pandan Gula Melaka Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Fragrant pandan cookies sweetened with rich gula melaka and coconut.", "longDesc": "Ingredients: Plain Flour, Corn Flour, Butter, Egg, Sugar, Baking Powder, Gula Melaka, Pandan Flavour, Coconut Flavour, Leaf Green Flavour, Desicated Coconut, Milk Powder, Salt.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "kopi-tarik-cookies", "teh-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "kopi-tarik-cookies", "title": "Kopi Tarik Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery cookies with the bold, roasty kick of local kopi.", "longDesc": "Ingredients: Brown Sugar, White Sugar, Unsalted Butter, Egg, Vanilla, Flour, Baking Soda, Baking Powder, Milk Powder, Corn Flour, Salt, Coffee Powder.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "teh-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "teh-tarik-cookies", "title": "Teh Tarik Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Milk-tea cookies with red tea and crunchy almond slices.", "longDesc": "Ingredients: Brown Sugar, White Sugar, Unsalted Butter, Egg, Vanilla, Flour, Baking Soda, Baking Powder, Milk Powder, Corn Flour, Almond Slice, Salt, Red Tea Powder, Water.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "chai-tea-cookies", "title": "Chai Tea Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Warmly spiced cookies with chai notes of cinnamon, ginger and clove.", "longDesc": "Ingredients: Brown Sugar, White Sugar, Unsalted Butter, Egg, Vanilla, Flour, Baking Soda, Baking Powder, Milk Powder, Salt, Earl Grey Powder, Nutmeg Powder, Cinnamon Powder, Ginger Powder, Clove Powder, Black Pepper, Corn Flour.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "nutella-tart", "title": "Nutella Tart", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Melt-in-the-mouth tarts filled with rich Nutella.", "longDesc": "Ingredients: Nutella, Butter, Icing Sugar, Egg, Vanilla Essence, Buttermilk Flavour, Plain Flour, Salt, Milk Powder, Yellow Colour.", "price": 9.8, "unit": "pack", "sizes": [{"label": "Bottle (19 pcs)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "pineapple-tart", "title": "Pineapple Tart", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery tarts with sweet, tangy pineapple jam.", "longDesc": "Ingredients: Pineapple, Butter, Icing Sugar, Egg, Vanilla Essence, Buttermilk Flavour, Plain Flour, Salt, Milk Powder, Yellow Colour.", "price": 9.8, "unit": "pack", "sizes": [{"label": "Bottle (19 pcs)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "almond-suji-cookie", "title": "Almond Suji Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Delicate, ghee-rich suji cookies with ground almond.", "longDesc": "Ingredients: Ghee, Flour, Baking Soda, Icing Sugar, Salt, Ground Almond, Corn Flour.", "price": 9.8, "unit": "pack", "sizes": [{"label": "Bottle (16 pcs)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts"]},
  {"id": "red-velvet-cookie", "title": "Red Velvet Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Cocoa red velvet cookies dotted with white chocolate.", "longDesc": "Ingredients: Plain Flour, Corn Flour, Cocoa Powder, Butter, Egg, Sugar, Vanilla, White Chocolate Chip, Salt, Baking Soda, Baking Powder, Cherry Red Colouring.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (16 pcs)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "earl-grey-peach-cookies", "title": "Earl Grey Peach Cookies", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Fragrant Earl Grey cookies with a hint of juicy peach.", "longDesc": "Ingredients: Plain Flour, Corn Flour, Almond Powder, Butter, Egg, Sugar, Earl Grey Tea Extract, Milk Powder, Baking Soda, Baking Powder, Peach Flavour, Orange Colouring.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "cranberry-almond-cookie", "title": "Cranberry Almond Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Buttery cookies packed with tart cranberries and almond.", "longDesc": "Ingredients: Wheat Flour, Sugar, Dried Cranberries, Almond, Butter, Mixed Peel, Citric Acid, Egg, Malt Extract, Sodium Bicarbonate, Baking Powder, Vanilla Powder, Salt.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (40g)", "price": 2.8}, {"label": "Bottle (110g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "signature-sambal-cookie", "title": "Signature Sambal Cookie", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Our sweet-and-spicy signature, with sambal, peanut and chilli.", "longDesc": "Ingredients: Butter, Sugar, Brown Sugar, Egg, Sambal, Flour, Salt, Baking Powder, Baking Soda, Corn Flour, Peanut, Dry Onion, Dry Chilli.", "price": 2.8, "unit": "pack", "sizes": [{"label": "Petite Pack (45g)", "price": 2.8}, {"label": "Bottle (150g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "iced-gems", "title": "Iced Gems", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "The childhood classic: crisp biscuits topped with colourful sugar gems.", "longDesc": "Ingredients: Wheat Flour, Sugar, Cornstarch, Salt, Vegetable Oil, Whey Powder, Egg Powder, Flavouring, Colouring.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Nostalgic Tin (280g)", "price": 11.8}], "upsell": [], "alsoBought": ["potato-wheels", "pandan-waffle", "chocolate-waffle"], "allergens": ["Dairy", "Gluten", "Eggs"]},
  {"id": "potato-wheels", "title": "Potato Wheels", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crunchy, moreish potato wheels with a savoury bite.", "longDesc": "Ingredients: Wheat Flour, Rice Flour, Potato Starch, Wheat Starch, Sugar, Milk Powder, Chicken Seasoning Powder, Vegetable Oil, Yeast, MSG, Water.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Nostalgic Tin (65g)", "price": 11.8}], "upsell": [], "alsoBought": ["iced-gems", "pandan-waffle", "chocolate-waffle"], "allergens": ["Dairy", "Gluten"]},
  {"id": "pandan-waffle", "title": "Pandan Waffle", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crisp little waffles with sweet, fragrant pandan.", "longDesc": "Ingredients: Pandan Essence, Butter, Cornstarch, Sugar, Egg, Milk, Vanilla Extract, Salt.", "price": 11.8, "unit": "pack", "sizes": [{"label": "Nostalgic Tin (340g(48 pcs))", "price": 11.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "chocolate-waffle"], "allergens": ["Dairy", "Eggs"]},
  {"id": "chocolate-waffle", "title": "Chocolate waffle", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crisp little waffles with rich cocoa.", "longDesc": "Ingredients: Cocoa, Butter, Cornstarch, Sugar, Egg, Milk, Vanilla Extract, Salt.", "price": 11.8, "unit": "pack", "sizes": [{"label": "Nostalgic Tin (330g(31 pcs))", "price": 11.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Dairy", "Eggs"]},
  {"id": "kueh-bangkit", "title": "Kueh Bangkit", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Melt-in-the-mouth coconut tapioca cookies, a festive favourite.", "longDesc": "Ingredients: Tapioca Flour, Wheat Flour, Sugar, Coconut Milk, Magarine, Egg, Vegetable Oil, Custard Powder, Salt.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Nostalgic Tin (350g)", "price": 11.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Dairy", "Gluten", "Nuts", "Eggs"]},
  {"id": "coconut-pineapple-jam", "title": "Coconut Pineapple Jam", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Bite-size pastries filled with sweet coconut-pineapple jam.", "longDesc": "Ingredients: Pineapple jam, Wheat Flour, Sugar, Tapioca Starch, Palm Oil, Raising Agent.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Nostalgic Tin (330g)", "price": 11.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Gluten"]},
  {"id": "abc-biscuit", "title": "ABC Biscuit", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Nostalgic alphabet biscuits, lightly sweet and crunchy.", "longDesc": "Ingredients: Wheat Flour, Sugar, Palm Oil, Glucose Syrup, Margaring, Milk Powder, Salt, Flavouring, Colouring.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Nostalgic Tin (260g)", "price": 11.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Dairy", "Gluten"]},
  {"id": "arrow-head", "title": "Arrow Head", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Thin, crispy arrowhead crisps with just a touch of salt.", "longDesc": "Ingredients: Arrowhead Tubers, Vegetable Oil , Salt.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (60g)", "price": 5.0}, {"label": "Bottle (65g)", "price": 6.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": []},
  {"id": "prawn-roll", "title": "Prawn Roll", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crispy rolls with a savoury dried-shrimp filling.", "longDesc": "Ingredients: Flour, Dried Shrimp, Vegetable Oil, Sugar, Chili Powder, MSG, Potassium Sobate.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (50g)", "price": 1.8}, {"label": "Regular Pack (150g)", "price": 5.0}, {"label": "Bottle (150g)", "price": 6.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Gluten"]},
  {"id": "curry-tapioca-chips", "title": "Curry Tapioca Chips", "tags": ["National Day Snacks", "Deepavali"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Crunchy tapioca chips tossed in fragrant curry spice.", "longDesc": "Ingredients: Fresh Tapioca, Salt, Palm Oil, Curry Powder.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (50g)", "price": 5.0}, {"label": "Bottle (70g)", "price": 6.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": []},
  {"id": "vegetable-cracker", "title": "Vegetable Cracker", "tags": ["National Day Snacks", "Hari Raya"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Light, crispy crackers with savoury garlic and onion.", "longDesc": "Ingredients: Tapioca Flour, Garlic, Onion, Salt, Permitted Colour.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (40g)", "price": 5.0}, {"label": "Bottle (45g)", "price": 6.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": []},
  {"id": "prawn-pillow", "title": "Prawn Pillow", "tags": ["National Day Snacks"], "emoji": "🍘", "color": "#d7a24a", "shortDesc": "Airy, crispy prawn puffs with a moreish savoury flavour.", "longDesc": "Ingredients: Prawn Flavouring, Wheat Flour, palm oil, sugar, salt, and garlic..", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (130g)", "price": 5.0}, {"label": "Bottle (130g)", "price": 6.8}], "upsell": [], "alsoBought": ["iced-gems", "potato-wheels", "pandan-waffle"], "allergens": ["Gluten"]},
  {"id": "ribbon-murukku", "title": "Ribbon Murukku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crispy ribbon murukku with warm curry spice and chilli.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Chili Powder, Curry Powder (coriander, chili, cumin, turmeric, fennel, dhall, fenugreek, pepper), Palm Oil, and Salt.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (100g)", "price": 6.8}], "upsell": [], "alsoBought": ["classic-murukku", "puff-rice-indian-mixer", "kara-boondi"], "allergens": []},
  {"id": "classic-murukku", "title": "Classic Murukku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Traditional crunchy murukku, buttery and lightly spiced.", "longDesc": "Ingredients: Rice Flour, Urad Dal Flour(Lentil flour), Palm Oil, Butter, Salt, Spices.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (85g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "puff-rice-indian-mixer", "kara-boondi"], "allergens": ["Dairy", "Gluten"]},
  {"id": "puff-rice-indian-mixer", "title": "Puff Rice Indian Mixer", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "A zesty puffed-rice mix with nuts, curry leaves and spice.", "longDesc": "Ingredients: Puffed Rice, Nuts & Legumes, Cooking Oil, Curry Leaves, Mustard Seeds & Cumin, Garlic & Green Chilli, Asafoetida, Turmeric Powder, Red Chili Powder, Chaat Masala & Amchur.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (100g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "kara-boondi"], "allergens": ["Nuts"]},
  {"id": "kara-boondi", "title": "Kara Boondi", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crunchy spiced gram-flour boondi with nuts and herbs.", "longDesc": "Ingredients: Gram Flour, Rice Flour, Spices, Cooking Soda, Oil, Nuts & Herbs, Salt.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (100g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Nuts"]},
  {"id": "murukku-strips", "title": "Murukku Strips", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crispy murukku strips with groundnuts and green peas.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Palm Oil, Salt, Chili Powder, Curry Powder, Groundnuts, Green Pea, Colouring.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (120g)", "price": 5.0}, {"label": "Bottle (120g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Nuts"]},
  {"id": "banana-chips", "title": "Banana Chips", "tags": ["Deepavali", "Hari Raya"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crisp banana chips with just a touch of salt.", "longDesc": "Ingredients: Banana, Salt, Oil.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (90g)", "price": 5.0}, {"label": "Bottle (100g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "butter-muruku", "title": "Butter Muruku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Rich, buttery murukku with curry spice and chilli.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Chili Powder, Curry Powder (coriander, chili, cumin, turmeric, fennel, dhall, fenugreek, pepper), Palm Oil, and Salt.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (120g)", "price": 5.0}, {"label": "Bottle (90g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "mini-garlic-muruku", "title": "Mini Garlic Muruku", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Bite-size murukku with fragrant garlic and sesame.", "longDesc": "Ingredients: Rice Flour, Urad Dal Flour(Lentil flour), Fresh Garlic Paste, Palm Oil, Butter, Asafoetida, Red Chilli Powder, White Sesame Seed.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (90g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": ["Dairy", "Gluten"]},
  {"id": "butter-muruku-spicy", "title": "Butter muruku (spicy )", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Buttery murukku with an extra chilli kick.", "longDesc": "Ingredients: Dhall Flour, Rice Flour, Chili Powder, Curry Powder (coriander, chili, cumin, turmeric, fennel, dhall, fenugreek, pepper), Palm Oil, and Salt.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (120g)", "price": 5.0}, {"label": "Bottle (90g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "belinjau-crackers", "title": "Belinjau Crackers", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crunchy belinjau crackers, simply salted.", "longDesc": "Ingredients: Belinjau Seed, Palm Oil, Salt,.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (100g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "ladoo-tart", "title": "Ladoo Tart", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Melt-in-the-mouth ghee tarts scented with cardamom.", "longDesc": "Ingredients: Unsalted Butter, cardamom powder, Ghee, Sugar, Water, Salt.", "price": 9.8, "unit": "pack", "sizes": [{"label": "Bottle (8 pcs)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy"]},
  {"id": "classic-tapioca-chips", "title": "Classic Tapioca Chips", "tags": ["Deepavali"], "emoji": "🪔", "color": "#c4683a", "shortDesc": "Crispy tapioca chips with a clean, salty crunch.", "longDesc": "Ingredients: Fresh Tapioca, Salt, Palm Oil.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (50g)", "price": 5.0}, {"label": "Bottle (70g)", "price": 6.8}], "upsell": [], "alsoBought": ["ribbon-murukku", "classic-murukku", "puff-rice-indian-mixer"], "allergens": []},
  {"id": "kueh-makmur", "title": "Kueh Makmur", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Snowy, melt-in-the-mouth cookies with buttery peanut.", "longDesc": "Ingredients: Wheat Flour, Butter, Sugar, Peanut, Ghee, Palm Oil, Baking Powder.", "price": 9.8, "unit": "pack", "sizes": [{"label": "Bottle (16 pcs)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": ["Dairy", "Gluten", "Nuts"]},
  {"id": "kerepek-singkong", "title": "Kerepek Singkong", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crunchy cassava crisps with a spicy belado kick.", "longDesc": "Ingredients: Palm Oil, Chili Belado Seosoning, Cassava, Chili Extract, Yeast Extract, Yellow Colouring.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (30g)", "price": 1.8}, {"label": "Regular Pack (70g)", "price": 5.0}, {"label": "Bottle (60g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-stick", "rempeyek"], "allergens": []},
  {"id": "kerepek-stick", "title": "Kerepek Stick", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy belado sticks, savoury with a little spice.", "longDesc": "Ingredients: Palm Oil, Wheat Flour, Chili Belado Seasoning, Chili Extract, Yeast Extract, Artificial Sweetener Aspartame, Yellow Colouring.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (20g)", "price": 1.8}, {"label": "Regular Pack (40g)", "price": 5.0}, {"label": "Bottle (70g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "rempeyek"], "allergens": ["Gluten"]},
  {"id": "rempeyek", "title": "Rempeyek", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy peanut-and-anchovy fritters, savoury and spiced.", "longDesc": "Ingredients: Corn Flour, Rice Flour, Water, Peanuts, Anchovies, Coarse Cumin, Fine Cumin, Coriander, Eggs, Sugar, Salt, Palm Oil, Monosodium Glutamate.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (70g)", "price": 5.0}, {"label": "Bottle (70g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Nuts", "Eggs"]},
  {"id": "crab-stick", "title": "Crab Stick", "tags": ["Housebake Cookies"], "emoji": "🍪", "color": "#c49a6a", "shortDesc": "Crispy crabstick snacks, light and savoury.", "longDesc": "Ingredients: Crabstick, Palm Oil.", "price": 9.8, "unit": "pack", "sizes": [{"label": "Bottle (200g)", "price": 9.8}], "upsell": [], "alsoBought": ["chocolate-chip-cookies", "pandan-gula-melaka-cookies", "kopi-tarik-cookies"], "allergens": []},
  {"id": "curry-cracker", "title": "Curry Cracker", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crunchy crackers seasoned with curry and garlic.", "longDesc": "Ingredients: Tapioca Flour, Sugar, MSG, Salt, Palm Oil, Curry Powder, Garlic Powder, Chili Powder.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (60g)", "price": 5.0}, {"label": "Bottle (50g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": []},
  {"id": "mini-fish-cracker", "title": "Mini Fish Cracker", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Bite-size crispy fish crackers, light and savoury.", "longDesc": "Ingredients: Fish, Tapioca Flour, Sugar, Egg, Salt, Flavouring, Vegetable Oil.", "price": 6.8, "unit": "pack", "sizes": [{"label": "Bottle (35-40g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Eggs"]},
  {"id": "mini-tapioca-chip", "title": "Mini Tapioca Chip", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Bite-size tapioca chips with a hint of curry.", "longDesc": "Ingredients: Fresh Tapioca, Salt, Palm Oil, Curry Powder.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (50g)", "price": 5.0}, {"label": "Bottle (70g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": []},
  {"id": "crispy-prawn-roll", "title": "Crispy Prawn Roll", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Extra-crispy rolls with a savoury dried-shrimp filling.", "longDesc": "Ingredients: Flour, Dried Shrimp, Vegetable Oil, Sugar, Chilli Powder, MSG, Potassium Sobate.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (50g)", "price": 1.8}, {"label": "Regular Pack (150g)", "price": 5.0}, {"label": "Bottle (150g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Gluten"]},
  {"id": "kachang-bersalut", "title": "Kachang Bersalut", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crunchy coated peanuts, a moreish festive nibble.", "longDesc": "Ingredients: Nuts, Wheat flour, Egg.", "price": 1.8, "unit": "pack", "sizes": [{"label": "Petite Pack (50g)", "price": 1.8}, {"label": "Regular Pack (100g)", "price": 5.0}, {"label": "Bottle (150g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Gluten", "Nuts", "Eggs"]},
  {"id": "spicy-prawn-cracker", "title": "Spicy Prawn Cracker", "tags": ["Hari Raya"], "emoji": "🌙", "color": "#4e8f7a", "shortDesc": "Crispy prawn crackers with a spicy chilli kick.", "longDesc": "Ingredients: Flour, Dried Shrimp, Vegetable Oil, Sugar, Chilli Powder, MSG, Potassium Sobate.", "price": 5.0, "unit": "pack", "sizes": [{"label": "Regular Pack (130g)", "price": 5.0}, {"label": "Bottle (130g)", "price": 6.8}], "upsell": [], "alsoBought": ["kueh-makmur", "kerepek-singkong", "kerepek-stick"], "allergens": ["Gluten"]}
];

/* Drink toppings / add-ons (referenced by `upsell` ids above) */
let ADDONS = {
  'pearls':            { id: 'pearls',            title: 'Pearls',                        price: 0.50 },
  'taro-balls':        { id: 'taro-balls',        title: 'Signature Mini Chewy Taro Balls', price: 0.80 },
  'aiyu-jelly':        { id: 'aiyu-jelly',        title: 'Aiyu Jelly (Housemade)',        price: 0.50 },
  'brown-sugar-jelly': { id: 'brown-sugar-jelly', title: 'Brown Sugar Jelly Balls',       price: 0.70 },
  'aloe-vera':         { id: 'aloe-vera',         title: 'Aloe Vera',                     price: 0.50 },
  'grass-jelly':       { id: 'grass-jelly',       title: 'Grass Jelly',                   price: 0.50 },
  'mango-pops':        { id: 'mango-pops',        title: 'Mango Pops',                    price: 0.60 },
  'strawberry-pops':   { id: 'strawberry-pops',   title: 'Strawberry Pops',               price: 0.60 },
  'passionfruit-pops': { id: 'passionfruit-pops', title: 'Passionfruit Pops',             price: 0.60 }
};

/* Toppings: how many a customer may add to a drink. */
const MAX_TOPPINGS = 2;

/* Sugar levels offered on every drink — a compulsory single-select; the first
   entry (0%) is the default selection. */
const SUGAR_LEVELS = [
  '0% (Kosong)', '25% (Very Less Sweet)', '50% (Less Sweet)',
  '75% (Slightly Less Sweet)', '100% (Normal)'
];

/* Sub-sections within a top-level category (drives the sub-navigation). */
const SUBCATEGORIES = {
  'Drinks': ['Fusion Teas', 'Classic Iced Teas', 'Sodas', 'Lemonades', 'Fresh Milk', 'Milk Teas']
};
function subcategoriesFor(category) { return SUBCATEGORIES[category] || []; }

/* Allergens present in each product (drives the "About allergens" panel).
   Vegan fruit drinks carry none of the major allergens. */
const ALLERGENS_BY_ID = {
  'signature-classic-milk-tea': ['Dairy'],
  'brown-sugar-pearl-milk-tea': ['Dairy'],
  'caramel-milk-tea': ['Dairy', 'Soy'],
  'snowy-pearl-fresh-milk': ['Dairy'],
  'peach-blossom-tea': [],
  'passion-sunset-tea': [],
  'mango-iced-tea': [],
  'strawberry-blush': [],
  'grape-twilight': [],
  'classic-lemonade': [],
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
let CATEGORIES = ['Drinks', 'Sweets', 'Snacks', 'Gift Sets', 'Christmas Festive', 'Housebake Cookies', 'National Day Snacks', 'Deepavali', 'Hari Raya'];

/* Order categories appear in the filter bar (Christmas Festive featured first). */
let CATEGORY_BAR_ORDER = ['Christmas Festive', 'Drinks', 'Sweets', 'Snacks', 'Gift Sets', 'Housebake Cookies', 'National Day Snacks', 'Deepavali', 'Hari Raya'];

/* Occasion categories (seasonal / festive) live in their own "Shop by
   occasion" ribbon, separate from product types. The CMS overrides this via
   the category "Occasion" toggle. */
let OCCASIONS = ['Christmas Festive', 'National Day Snacks', 'Deepavali', 'Hari Raya'];

/* The product's headline category for chips/breadcrumb: prefer a product-type
   category over an occasion one. */
function primaryCategory(product) {
  const cats = CATEGORIES.filter(c => product.tags.includes(c));
  return cats.find(c => !OCCASIONS.includes(c)) || cats[0];
}

/* Every category a product belongs to, primary first. */
function productCategories(product) {
  const cats = CATEGORIES.filter(c => product.tags.includes(c));
  const primary = primaryCategory(product);
  return [primary, ...cats.filter(c => c !== primary)];
}

/* Product-type categories present across the catalog, in bar order —
   occasions are excluded here and shown in their own ribbon. */
function filterCategories() {
  const present = new Set();
  PRODUCTS.forEach(p => p.tags.forEach(t => present.add(t)));
  return CATEGORY_BAR_ORDER.filter(c => present.has(c) && !OCCASIONS.includes(c));
}

/* Occasion categories that actually have products, in bar order. */
function occasionCategories() {
  const present = new Set();
  PRODUCTS.forEach(p => p.tags.forEach(t => present.add(t)));
  return OCCASIONS.filter(c => present.has(c));
}

/* Bestsellers for the homepage "Popular Right Now" section: CMS-flagged
   products first; if none are flagged, fall back to a curated id list. */
const BESTSELLER_FALLBACK_IDS = [
  'lychee-mint-tea', 'mango-green-tea', 'iced-lemon-tea', 'chocolate-chip-cookies',
  'chocolate-gift-bag', 'festive-gift-bag', 'iced-gems', 'kueh-bangkit'
];
function bestsellerProducts() {
  const flagged = PRODUCTS.filter(p => p.bestseller === true);
  if (flagged.length) return flagged;
  return BESTSELLER_FALLBACK_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
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

/* Flavours let one listing cover a whole menu section (e.g. every milk tea).
   The chosen flavour can carry a surcharge on top of the size price. */
function productFlavours(product) {
  return (product && Array.isArray(product.flavours)) ? product.flavours : [];
}

function hasFlavourChoice(product) {
  return productFlavours(product).length > 0;
}

/* Surcharge for a flavour label; 0 when the product has no flavours or the
   label is unknown (so a stale cart line can never inflate a price). */
function flavourDelta(product, label) {
  if (!label) return 0;
  const f = productFlavours(product).find(x => x.label === label);
  return f ? (+f.priceDelta || 0) : 0;
}

/* Catering dispensers. Any size whose label contains "Dispenser" switches the
   product page into dispenser mode: flat price for any flavour (no flavour
   surcharge), per-cup toppings and sugar hidden, and an optional shared
   topping bucket instead. Mirrored by the server engine. */
const DISPENSER_BUCKETS = {
  small: { id: 'small', title: 'Small Topping Bucket (1000ml, ~15 pax)', price: 12 },
  xl:    { id: 'xl',    title: 'XL Topping Bucket (2000ml, ~30 pax)',    price: 22 }
};
/* What comes with a dispenser. `withToppingOnly` items are listed only when a
   topping bucket has been added — there is no scoop without a topping. */
const DISPENSER_PROVIDED = [
  { text: 'Styrofoam box with ice (according to pax ordered)' },
  { text: '360ml Sofnade branded cups' },
  { text: 'Cup lids' },
  { text: 'Ice scoop (1 pc)' },
  { text: 'Topping scoop (1 per topping)', withToppingOnly: true },
  { text: 'Serviettes' }
];
/* Option groups: extra pick-lists on a product (gift-bag contents, extras).
   A choice is only ever priced from the catalog, never from the cart line. */
function productOptionGroups(product) {
  return (product && Array.isArray(product.optionGroups)) ? product.optionGroups : [];
}

function optionDelta(product, chosenLabels) {
  const picked = new Set(chosenLabels || []);
  let sum = 0;
  productOptionGroups(product).forEach(g => {
    (g.options || []).forEach(o => { if (picked.has(o.label)) sum += +o.priceDelta || 0; });
  });
  return sum;
}

function isDispenserSize(label) {
  return /dispenser/i.test(String(label || ''));
}

function allTags() {
  const categoryOrder = ['Drinks', 'Sweets', 'Snacks', 'Gift Sets'];
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
  heroTitle: 'Freshly made treats\nfor every occasion.',
  heroSubtitle: 'Hand-shaken bubble tea, freshly baked sweets, wholesome snacks and giftable sets, delivered across Singapore.',

  /* ---- Delivery fees ---- */
  deliveryFee: 30.00,             // flat islandwide fee below the free threshold
  freeDeliveryThreshold: 150.00,  // free delivery at/above this order value
  freeDeliveryBeforeDiscount: true, // threshold is measured on the pre-discount subtotal
  pickupEnabled: true,

  /* ---- Lead time & cut-off ---- */
  cutoffHour: 16,                 // 4:00 PM (Asia/Singapore) order cut-off
  leadBusinessDays: 3,            // earliest delivery is the 3rd business day
  publicHolidays: [],             // 'YYYY-MM-DD' SG public holidays (skipped like weekends)

  /* ---- Fresh vs shelf-stable ----
     Fresh food needs a 30-minute time slot. Shelf-stable needs a date only,
     with an optional paid "specific time" add-on. A product counts as fresh
     if it carries p.fresh === true or belongs to one of these categories. */
  freshCategories: ['Drinks'],
  freshSlot: { startHour: 9, endHour: 17, intervalMins: 30 }, // 9:00 AM – 5:00 PM, 30-min slots
  shelfWindowLabel: '9:00 AM – 5:00 PM',
  specificTimeAddon: { enabled: true, fee: 30.00, label: 'Specific Time Delivery' },

  /* ---- Transport surcharge (restricted areas) ----
     Applies in addition to any standard fee (even free delivery) when the
     delivery postal code's first two digits are listed. */
  // Catering volume tier: order 100+ drinks and every drink drops in price.
  // Mirrors the beverage deck, where each size falls by $0.20 ex-GST above
  // 100 pax. Stored GST-inclusive to match the rest of the storefront.
  volumeTier: { minUnits: 100, perUnit: 0.22, categories: ['Drinks'], label: '100+ drinks' },
  surchargeFee: 15.00,
  surchargePrefixes: ['01','03','04','05','06','07','08','09','10','17','18','19','22','23','49','63'],

  /* ---- Minimum order (merchandise subtotal) ---- */
  minOrder: 20.00,

  /* ---- Self-collection point ---- */
  pickup: {
    place: 'Food Xchange @ Admiralty',
    address: '8A Admiralty Street, #03-12, Singapore 757437',
    hours: '9:00 AM – 5:00 PM'
  },

  /* ---- Corporate Booking (unpaid order request) ---- */
  corporate: {
    label: 'Corporate Booking',
    sub: 'Vendors@Gov / Sesami / Ariba / Coupa / Credit Terms (corporate customers only)',
    notice: 'THIS ORDER IS NOT CONFIRMED UNTIL YOU RECEIVE AN OFFICIAL INVOICE'
  },

  /* ---- GST + seller details (used on invoices) ---- */
  gst: { registered: true, rate: 9, regNo: '202314539M', inclusive: true },
  seller: {
    name: 'SOFNADE CATERING PTE. LTD.', uen: '202314539M',
    address: '8A Admiralty Street, #03-12, Food Xchange @ Admiralty, Singapore 757437',
    email: 'sales@sofnade.com', phone: '8930 9756'
  },

  /* ---- Calendar horizon ---- */
  dateHorizonMonths: 6,

  /* Legacy two-slot config, kept for backward compatibility. */
  timeSlots: [
    { value: '9am–2pm', label: 'Morning',   sub: '9am – 2pm' },
    { value: '2–6pm',   label: 'Afternoon', sub: '2pm – 6pm' }
  ]
};

/* Fresh food (needs a timed slot) vs shelf-stable (date only). A product is
   fresh when flagged p.fresh, or when it belongs to a fresh category. */
function isFreshProduct(product) {
  if (!product) return false;
  if (product.fresh === true) return true;
  if (product.fresh === false) return false;
  const fresh = (typeof SETTINGS !== 'undefined' && SETTINGS.freshCategories) || ['Drinks'];
  return (product.tags || []).some(t => fresh.includes(t));
}

/* =========================================================================
   GST. Every price on the storefront — listings, product pages, the cart —
   is GST-INCLUSIVE, and the engine never adds tax on top. Documents that
   have to show the tax separately (checkout summary, invoice, receipts)
   strip it back out with the helpers below. Nothing here changes what the
   customer is charged; it only re-expresses the same total.
   ========================================================================= */
const _r2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;

/* Effective inclusive rate as a percentage — 0 when not GST-registered, in
   which case every helper below degrades to a plain pass-through. `conf`
   lets the server pass its own CMS-merged settings; the storefront omits it
   and reads the live module-level SETTINGS. */
function gstRate(conf) {
  const s = conf || (typeof SETTINGS !== 'undefined' ? SETTINGS : null);
  const g = (s && s.gst) || null;
  return g && g.registered && g.inclusive ? Number(g.rate || 0) : 0;
}

/* The GST-exclusive part of a GST-inclusive amount. */
function exGst(amount, conf) {
  const r = gstRate(conf);
  return r ? _r2((Number(amount || 0) * 100) / (100 + r)) : _r2(amount);
}

/* Split a list of GST-inclusive amounts (negative for discounts) that add up
   to `total` into their tax-exclusive equivalents. The GST figure is derived
   as total − Σ(exclusive lines) rather than computed independently, so the
   tax row absorbs any rounding and the column always adds back to the exact
   amount charged. Returns { rate, lines, net, gst }. */
function gstSplit(amounts, total, conf) {
  const rate = gstRate(conf);
  const lines = (amounts || []).map((a) => exGst(a, conf));
  const net = _r2(lines.reduce((s, x) => s + x, 0));
  return { rate, lines, net, gst: rate ? _r2(Number(total || 0) - net) : 0 };
}

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
  // CMS-driven occasion set (may be empty: no occasions defined yet).
  if (Array.isArray(store.occasions)) OCCASIONS = store.occasions.slice();
  if (store.settings) SETTINGS = Object.assign({}, SETTINGS, store.settings);
}

/* Node / Vercel serverless interop. Ignored in the browser (no `module`),
   so the storefront is unaffected; the API functions require() this file to
   recompute totals from the exact same catalog, settings and codes. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTS, ADDONS, SETTINGS, DISCOUNT_CODES, CATEGORIES, DISPENSER_BUCKETS,
    gstRate, exGst, gstSplit,
  };
}
