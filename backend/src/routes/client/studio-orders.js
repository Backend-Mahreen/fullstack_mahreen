const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint studio order client hanya untuk client & intern (user-scoped).
 */
router.use(authenticate, authorize('client', 'intern'));

const mapOrder = (row) => ({
  id: row.id,
  productId: row.product_id || '',
  productName: row.product_name || '',
  variant: row.variant || '',
  quantity: Number(row.quantity || 1),
  totalPrice: Number(row.total_price || 0),
  shippingName: row.shipping_name || '',
  shippingAddress: row.shipping_address || '',
  shippingCity: row.shipping_city || '',
  shippingProvince: row.shipping_province || '',
  shippingPostal: row.shipping_postal || '',
  trackingNumber: row.tracking_number || '',
  status: row.status || 'confirmed',
  paymentMethod: row.payment_method || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at || '',
});

/**
 * GET /api/client/studio-orders
 * Daftar studio orders milik user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);
    const status = req.query.status || '';

    let query = `
      SELECT id, product_id, product_name, variant, quantity, total_price,
             shipping_name, shipping_address, shipping_city, shipping_province,
             shipping_postal, tracking_number, status, payment_method, created_at, updated_at
      FROM studio_orders
      WHERE user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows, countResult] = await Promise.all([
      runQuery(query, params),
      runSingle(
        `SELECT COUNT(*) AS total FROM studio_orders WHERE user_id = ?${status ? ' AND status = ?' : ''}`,
        status ? [userId, status] : [userId],
      ),
    ]);

    sendSuccess(res, {
      items: rows.map(mapOrder),
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error(error, 'client-studio-orders');
    sendError(res, 'Gagal mengambil data pesanan studio.', 500);
  }
});

/**
 * GET /api/client/studio-orders/summary
 * Ringkasan studio orders milik user yang login.
 */
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalOrders, totalSpent, pendingOrders] = await Promise.all([
      runSingle(
        `SELECT COUNT(*) AS count FROM studio_orders WHERE user_id = ?`,
        [userId],
      ),
      runSingle(
        `SELECT COALESCE(SUM(total_price), 0) AS total FROM studio_orders WHERE user_id = ? AND status IN ('confirmed','shipped','delivered')`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM studio_orders WHERE user_id = ? AND status IN ('confirmed','processing')`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      totalOrders: totalOrders?.count || 0,
      totalSpent: totalSpent?.total || 0,
      pendingOrders: pendingOrders?.count || 0,
    });
  } catch (error) {
    logger.error(error, 'client-studio-orders');
    sendError(res, 'Gagal mengambil ringkasan pesanan studio.', 500);
  }
});

/**
 * GET /api/client/studio-orders/:id
 * Detail studio order milik user yang login.
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const row = await runSingle(
      `SELECT id, product_id, product_name, variant, quantity, total_price,
              shipping_name, shipping_address, shipping_city, shipping_province,
              shipping_postal, tracking_number, status, payment_method, created_at, updated_at
       FROM studio_orders
       WHERE id = ? AND user_id = ?`,
      [req.params.id, userId],
    );

    if (!row) return sendError(res, 'Pesanan studio tidak ditemukan.', 404);
    sendSuccess(res, mapOrder(row));
  } catch (error) {
    logger.error(error, 'client-studio-orders');
    sendError(res, 'Gagal mengambil detail pesanan studio.', 500);
  }
});

module.exports = router;
