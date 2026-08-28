const express = require('express');
const router = express.Router();
const { runExecute, runSingle, runQuery } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { requireNonEmptyHeader } = require('../middleware/csrf');
const { authenticate } = require('../middleware/auth');

const createReference = (prefix) => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${datePart}-${randomPart}`;
};

/**
 * Nominal dihitung server-side agar klien tidak bisa memalsukan total.
 * Mengikuti formula yang sama dengan frontend (calculateStudioItemsTotals).
 */
const calculateTotals = (items, discount = 0) => {
  const subtotal = (items || []).reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );
  const tax = Math.round(subtotal * 0.11);
  const shippingFee = 0;
  const adminFee = 2500;
  const grandTotal = Math.max(0, subtotal + tax + shippingFee + adminFee - Number(discount || 0));
  return { subtotal, tax, shippingFee, adminFee, discount: Number(discount || 0), grandTotal };
};

/**
 * POST /api/studio/orders
 * Membuat pesanan produk Mahreen Studio.
 * Body mengikuti StudioOrder frontend: { items, shipping, paymentMethod, discount, totals }.
 */
router.post('/', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const { items, shipping, paymentMethod, discount } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, 'items wajib diisi.', 400);
    }
    if (!shipping || !shipping.fullName) {
      return sendError(res, 'shipping.fullName wajib diisi.', 400);
    }

    const totals = calculateTotals(items, discount);
    const orderNumber = createReference('MS');
    const trackingNumber = createReference('MH');
    const now = new Date().toISOString();
    const estimatedArrival = new Date();
    estimatedArrival.setDate(estimatedArrival.getDate() + 4);

    for (const item of items) {
      await runExecute(
        `INSERT INTO studio_orders
          (id, user_id, product_id, product_name, variant, quantity, total_price,
           shipping_name, shipping_address, shipping_city, shipping_province, shipping_postal,
           tracking_number, status, payment_method, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          null,
          item.productSlug || '',
          item.productTitle || '',
          item.colorLabel || '',
          Number(item.quantity || 1),
          totals.grandTotal,
          shipping.fullName || '',
          shipping.street || '',
          shipping.city || '',
          shipping.province || '',
          shipping.postal || '',
          trackingNumber,
          'confirmed',
          paymentMethod || '',
          now,
          now,
        ],
      );
    }

    const order = {
      ...(req.body || {}),
      items,
      item: items[0],
      shipping,
      ...totals,
      orderNumber,
      trackingNumber,
      paymentMethod: paymentMethod || '',
      status: 'confirmed',
      createdAt: now,
      estimatedArrival: estimatedArrival.toISOString(),
    };

    sendSuccess(res, order, 201);
  } catch (error) {
    logger.error(error, 'studio-orders');
    sendError(res, 'Gagal membuat pesanan studio.', 500);
  }
});

/**
 * GET /api/studio/orders/:orderNumber
 * Detail pesanan studio berdasarkan nomor order.
 */
router.get('/:orderNumber', async (req, res) => {
  try {
    const rows = await runQuery(`SELECT * FROM studio_orders WHERE tracking_number = ? OR id = ?`, [
      req.params.orderNumber,
      req.params.orderNumber,
    ]);
    if (!rows || rows.length === 0) return sendError(res, 'Pesanan tidak ditemukan.', 404);
    sendSuccess(res, rows);
  } catch (error) {
    logger.error(error, 'studio-orders');
    sendError(res, 'Gagal mengambil pesanan studio.', 500);
  }
});

module.exports = router;
