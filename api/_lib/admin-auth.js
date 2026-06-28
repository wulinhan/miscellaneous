// Shared-password gate for the staff admin endpoints. The password lives only
// in the ADMIN_PASSWORD env var (server-side); the browser sends it in the
// x-admin-password header over HTTPS. Compared in constant time via fixed-length
// SHA-256 digests (no length leak, no throw on mismatched lengths).
const crypto = require('crypto');

function sha(s) {
  return crypto.createHash('sha256').update(String(s)).digest();
}

// Returns { ok: true } or { ok: false, code, error }.
function checkAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, code: 503, error: 'Admin interface is not configured (set ADMIN_PASSWORD).' };
  }
  const given = (req.headers['x-admin-password'] || '').toString();
  const ok = crypto.timingSafeEqual(sha(given), sha(expected));
  return ok ? { ok: true } : { ok: false, code: 401, error: 'Unauthorized' };
}

module.exports = { checkAdmin };
