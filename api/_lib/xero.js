// Xero sync: every order becomes an ACCREC sales invoice in Xero, and paid
// orders get a payment recorded against it. Auth is a Custom Connection
// (OAuth2 client_credentials — no browser login, one org). Same conventions as
// the rest of api/_lib: plain fetch, graceful no-op when unconfigured, and
// callers treat failures as best-effort (they never block an order).
//
// Env:
//   XERO_CLIENT_ID / XERO_CLIENT_SECRET  - custom connection credentials
//   XERO_SALES_ACCOUNT   - revenue account code (default "200" - Sales)
//   XERO_PAYMENT_ACCOUNT - account payments clear through (default "090";
//                          must have "Enable payments" ticked in Xero)
//   XERO_TAX_TYPE        - optional TaxType per line (e.g. "OUTPUT"); when
//                          unset, the sales account's default tax rate applies
//   XERO_DUE_DAYS        - due date offset for unpaid invoices (default 7)

const TOKEN_URL = 'https://identity.xero.com/connect/token';
const API = 'https://api.xero.com/api.xro/2.0';

function isConfigured() {
  return Boolean(process.env.XERO_CLIENT_ID && process.env.XERO_CLIENT_SECRET);
}

// ---- Auth (cached ~30-min token + tenant id) -------------------------------

let _tok = null; // { token, exp }
let _tenant = null;

async function accessToken() {
  const now = Date.now();
  if (_tok && now < _tok.exp - 60000) return _tok.token;
  const basic = Buffer.from(
    `${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`,
  ).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&scope=' + encodeURIComponent('accounting.transactions accounting.contacts'),
  });
  if (!res.ok) throw new Error(`Xero token ${res.status}: ${await res.text()}`);
  const json = await res.json();
  _tok = { token: json.access_token, exp: now + (json.expires_in || 1800) * 1000 };
  return _tok.token;
}

async function headers() {
  const token = await accessToken();
  const h = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  if (!_tenant) {
    // Custom connections are bound to one org; discover its tenant id once.
    try {
      const res = await fetch('https://api.xero.com/connections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const conns = await res.json();
        if (Array.isArray(conns) && conns.length) _tenant = conns[0].tenantId;
      }
    } catch (e) { /* tenant header is optional for custom connections */ }
  }
  if (_tenant) h['Xero-Tenant-Id'] = _tenant;
  return h;
}

async function xget(path) {
  const res = await fetch(`${API}${path}`, { headers: await headers() });
  if (!res.ok) throw new Error(`Xero GET ${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

async function xpost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST', headers: await headers(), body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Xero POST ${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

// ---- Payload building ------------------------------------------------------

const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
const ymd = (iso) => (iso ? String(iso) : new Date().toISOString()).slice(0, 10);

function lineDescription(i) {
  const bits = [];
  if (i.flavour) bits.push(i.flavour);
  if (i.size) bits.push(i.size);
  if (i.sugar) bits.push(`Sugar ${i.sugar}`);
  (i.addons || []).forEach((a) => bits.push(`+ ${a}`));
  return i.title + (bits.length ? ` (${bits.join(' · ')})` : '');
}

function lineItems(order) {
  const q = order.quote || {};
  const acct = process.env.XERO_SALES_ACCOUNT || '200';
  const taxType = process.env.XERO_TAX_TYPE || null;
  const mk = (desc, qty, unit) => {
    const li = { Description: desc, Quantity: qty, UnitAmount: round2(unit), AccountCode: acct };
    if (taxType) li.TaxType = taxType;
    return li;
  };
  const lines = (q.items || []).map((i) => mk(lineDescription(i), Number(i.qty || 1), i.unitPrice));
  if (q.deliveryFee) lines.push(mk('Delivery', 1, q.deliveryFee));
  if (q.surcharge) lines.push(mk('Transport surcharge', 1, q.surcharge));
  if (q.specificTimeFee) lines.push(mk('Specific-time delivery', 1, q.specificTimeFee));
  if (q.discount) lines.push(mk(`Discount${q.discountCode ? ` (${q.discountCode})` : ''}`, 1, -q.discount));
  return lines;
}

// Find the customer's Xero contact by email, else let Xero match/create by name.
async function contactFor(order) {
  const c = order.customer || {};
  const name = (c.business || c.name || 'Sofnade Customer').trim();
  if (c.email) {
    try {
      const found = await xget(`/Contacts?where=${encodeURIComponent(`EmailAddress=="${c.email}"`)}`);
      const hit = found.Contacts && found.Contacts[0];
      if (hit) return { ContactID: hit.ContactID };
    } catch (e) { /* fall through to name-based contact */ }
  }
  const contact = { Name: name };
  if (c.email) contact.EmailAddress = c.email;
  return contact;
}

async function findInvoice(orderId) {
  const json = await xget(`/Invoices?InvoiceNumbers=${encodeURIComponent(orderId)}`);
  return (json.Invoices && json.Invoices[0]) || null;
}

async function recordPayment(invoiceId, order, amount) {
  const payment = {
    Invoice: { InvoiceID: invoiceId },
    Account: { Code: process.env.XERO_PAYMENT_ACCOUNT || '090' },
    Date: ymd(order.paid_at || order.created_at),
    Amount: round2(amount),
  };
  if (order.razorpay_payment_id) payment.Reference = order.razorpay_payment_id;
  await xpost('/Payments', { Payments: [payment] });
}

// ---- Public API ------------------------------------------------------------

// Idempotently mirror one order into Xero. `paid` decides whether a payment is
// recorded. Returns a short status string for logs/admin toasts.
async function syncOrder(order, paid) {
  if (!isConfigured()) return 'xero not configured';
  if (!order || !order.id) return 'no order';

  let invoice = await findInvoice(order.id);

  if (!invoice) {
    const dueDays = Number(process.env.XERO_DUE_DAYS || 7);
    const created = order.created_at ? new Date(order.created_at) : new Date();
    const due = new Date(created.getTime() + dueDays * 86400000);
    const payload = {
      Type: 'ACCREC',
      Contact: await contactFor(order),
      Date: ymd(order.created_at),
      DueDate: paid ? ymd(order.paid_at || order.created_at) : due.toISOString().slice(0, 10),
      InvoiceNumber: order.id,
      Reference: order.payment_method === 'vendors_sg' ? 'Corporate Booking' : (order.razorpay_payment_id || 'Online order'),
      CurrencyCode: (order.quote && order.quote.currency) || 'SGD',
      LineAmountTypes: 'Inclusive', // store prices include 9% GST
      Status: 'AUTHORISED',
      LineItems: lineItems(order),
    };
    const res = await xpost('/Invoices', { Invoices: [payload] });
    invoice = res.Invoices && res.Invoices[0];
    if (!invoice) throw new Error('Xero returned no invoice');
  }

  if (paid) {
    const already = Number(invoice.AmountPaid || 0) > 0 || invoice.Status === 'PAID';
    if (!already) {
      // Settle exactly what Xero says is outstanding (falls back to our total),
      // so the payment can never over/under-shoot the invoice.
      const q = order.quote || {};
      const due = invoice.AmountDue != null ? invoice.AmountDue
        : (q.total != null ? q.total : order.amount_total);
      await recordPayment(invoice.InvoiceID, order, due);
      return `invoice ${order.id} synced + payment recorded`;
    }
    return `invoice ${order.id} already paid in Xero`;
  }
  return `invoice ${order.id} synced (awaiting payment)`;
}

// Best-effort wrappers for the notify channel lists (never throw).
async function onPaid(order) {
  const msg = await syncOrder(order, true);
  console.log('[xero]', msg);
}
async function onRequested(order) {
  const msg = await syncOrder(order, false);
  console.log('[xero]', msg);
}

module.exports = { isConfigured, syncOrder, onPaid, onRequested };
