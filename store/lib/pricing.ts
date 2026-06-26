// Server-side pricing. This is the single source of truth for money.
// The browser sends a cart; the server recomputes every amount here from the
// authoritative catalog before charging. Client-sent prices are never trusted.

import type {
  AddOn,
  CartLine,
  CatalogProduct,
  Discount,
  Fulfilment,
  OrderType,
} from './types';

export const PRICING_CONFIG = {
  freeDeliveryThreshold: 150, // SGD; measured on subtotal BEFORE discount
  standardDeliveryFee: 30,
  transportSurcharge: 15,
  specificTimeFee: 30,
  currency: 'SGD',
  // First two digits of the 6-digit postal code that incur the surcharge.
  surchargePrefixes: [
    '01', '03', '04', '05', '06', '07', '08', '09',
    '10', '17', '18', '19', '22', '23', '49', '63',
  ],
};

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export interface QuoteInput {
  lines: CartLine[];
  catalogById: Record<string, CatalogProduct>;
  addOnsById?: Record<string, AddOn>;
  fulfilment: Fulfilment;
  postal?: string;
  discount?: Discount | null;
  orderType: OrderType;
  specificTimeSelected?: boolean;
  // Optional CMS-driven overrides; default to PRICING_CONFIG when omitted.
  config?: { freeDeliveryThreshold?: number; standardDeliveryFee?: number };
}

export interface QuoteLine {
  productId: string;
  title: string;
  size: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Quote {
  lines: QuoteLine[];
  subtotal: number; // before discount
  discountCode: string | null;
  discount: number;
  discountedSubtotal: number;
  deliveryFee: number;
  surcharge: number;
  specificTimeFee: number;
  total: number;
  currency: string;
  amountMinor: number; // total in cents, for the payment gateway
  freeDeliveryApplied: boolean;
  surchargeApplied: boolean;
}

function lineUnitPrice(
  line: CartLine,
  product: CatalogProduct,
  addOnsById: Record<string, AddOn>,
): number {
  const size = product.sizes.find((s) => s.label === line.size);
  if (!size) throw new Error(`Unknown size "${line.size}" for product ${product.id}`);
  const addOnTotal = (line.addOns ?? []).reduce((sum, id) => {
    const a = addOnsById[id];
    if (!a) throw new Error(`Unknown add-on "${id}"`);
    return sum + a.price;
  }, 0);
  return round2(size.price + addOnTotal);
}

export function quote(input: QuoteInput): Quote {
  const addOnsById = input.addOnsById ?? {};
  const lines: QuoteLine[] = input.lines.map((l) => {
    const product = input.catalogById[l.productId];
    if (!product) throw new Error(`Unknown product "${l.productId}"`);
    const unitPrice = lineUnitPrice(l, product, addOnsById);
    return {
      productId: l.productId,
      title: product.title,
      size: l.size,
      qty: l.qty,
      unitPrice,
      lineTotal: round2(unitPrice * l.qty),
    };
  });

  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));

  // Discount. 'shipping' (free delivery) takes nothing off the subtotal — it is
  // applied to the delivery fee below.
  let discount = 0;
  let discountCode: string | null = null;
  if (input.discount) {
    discountCode = input.discount.code;
    if (input.discount.type === 'percent') {
      discount = round2((subtotal * input.discount.value) / 100);
    } else if (input.discount.type === 'amount') {
      discount = round2(Math.min(input.discount.value, subtotal));
    }
  }
  const discountedSubtotal = round2(subtotal - discount);

  // Delivery, surcharge, add-on
  let deliveryFee = 0;
  let surcharge = 0;
  let specificTimeFee = 0;
  let freeDeliveryApplied = false;
  let surchargeApplied = false;

  if (input.fulfilment === 'delivery') {
    const threshold = input.config?.freeDeliveryThreshold ?? PRICING_CONFIG.freeDeliveryThreshold;
    const standardFee = input.config?.standardDeliveryFee ?? PRICING_CONFIG.standardDeliveryFee;
    // Free-delivery threshold is measured on the subtotal BEFORE discount.
    // A 'shipping' discount code also unlocks free delivery regardless of total.
    freeDeliveryApplied = subtotal >= threshold || input.discount?.type === 'shipping';
    deliveryFee = freeDeliveryApplied ? 0 : standardFee;

    // Transport surcharge ALWAYS applies to listed areas, even on free delivery.
    const prefix = (input.postal ?? '').slice(0, 2);
    surchargeApplied = PRICING_CONFIG.surchargePrefixes.includes(prefix);
    surcharge = surchargeApplied ? PRICING_CONFIG.transportSurcharge : 0;

    // Specific Time Delivery add-on: shelf-stable-only orders only.
    if (input.orderType === 'shelf' && input.specificTimeSelected) {
      specificTimeFee = PRICING_CONFIG.specificTimeFee;
    }
  }
  // Self-pickup: no delivery fee, no surcharge, no specific-time add-on.

  const total = round2(discountedSubtotal + deliveryFee + surcharge + specificTimeFee);

  return {
    lines,
    subtotal,
    discountCode,
    discount,
    discountedSubtotal,
    deliveryFee,
    surcharge,
    specificTimeFee,
    total,
    currency: PRICING_CONFIG.currency,
    amountMinor: Math.round(total * 100),
    freeDeliveryApplied,
    surchargeApplied,
  };
}
