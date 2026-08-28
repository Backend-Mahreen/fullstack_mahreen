/**
 * CSRF protection via custom header requirement.
 *
 * Browser tidak bisa set custom headers dalam cross-origin form submission
 * tanpa CORS preflight. Middleware ini memastikan request memiliki
 * header `X-Requested-With` — yang hanya bisa di-set oleh JavaScript.
 *
 * Berfungsi sebagai pertahanan terhadap CSRF pada endpoint publik
 * yang tidak pakai JWT authentication.
 */
const { sendError } = require('../utils/response');

const requireNonEmptyHeader = (req, res, next) => {
  if (!req.headers['x-requested-with']) {
    return sendError(res, 'CSRF header required.', 403);
  }
  next();
};

module.exports = { requireNonEmptyHeader };
