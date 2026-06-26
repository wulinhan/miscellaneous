// Shared domain types for the Sofnade store.

export type ProductKind = 'fresh' | 'shelf';

export interface CatalogSize {
  label: string;
  price: number; // SGD
}

export interface CatalogProduct {
  id: string;
  title: string;
  kind: ProductKind; // 'fresh' = freshly prepared, 'shelf' = shelf-stable
  sizes: CatalogSize[];
  category?: string; // display grouping, e.g. "Bubble Tea", "Housebake Cookies"
  shortDesc?: string;
  emoji?: string; // placeholder visual when there is no photo
  image?: string; // CMS photo URL (first product image), when available
  addOnIds?: string[]; // applicable add-ons (drink toppings)
}

export interface AddOn {
  id: string;
  title: string;
  price: number;
}

export interface CartLine {
  productId: string;
  size: string; // size label
  qty: number;
  addOns?: string[]; // add-on ids (drink toppings)
}

export type Fulfilment = 'pickup' | 'delivery';

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  business?: string;
  address1?: string;
  address2?: string;
  postal?: string; // 6-digit SG postal code
  notes?: string;
}

export type OrderType = 'fresh' | 'shelf';

export interface Discount {
  code: string;
  // 'percent' = % off subtotal, 'amount' = $ off subtotal,
  // 'shipping' = free islandwide delivery (no money off the subtotal).
  type: 'percent' | 'amount' | 'shipping';
  value: number; // percent (0-100) or SGD amount; ignored for 'shipping'
}
