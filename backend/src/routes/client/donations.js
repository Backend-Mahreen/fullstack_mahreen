const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint donasi client hanya untuk client & intern (user-scoped).
 */
router.use(authenticate, authorize('client', 'intern'));

const mapDonation = (row) => ({
  id: row.id,
  amount: Number(row.amount || 0),
  campaign: row.campaign || '',
  campaignId: row.campaign_id || '',
  paymentMethod: row.payment_method || '',
  paymentStatus: row.payment_status || 'pending',
  isAnonymous: Boolean(row.is_anonymous),
  message: row.message || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at || '',
});

/**
 * GET /api/client/donations
 * Daftar donasi milik user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);

    const [rows, countResult] = await Promise.all([
      runQuery(
        `SELECT id, amount, campaign, campaign_id, payment_method, payment_status,
                is_anonymous, message, created_at, updated_at
         FROM donations
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset],
      ),
      runSingle(
        `SELECT COUNT(*) AS total FROM donations WHERE user_id = ?`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      items: rows.map(mapDonation),
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error(error, 'client-donations');
    sendError(res, 'Gagal mengambil data donasi.', 500);
  }
});

/**
 * GET /api/client/donations/summary
 * Ringkasan donasi milik user yang login.
 */
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalDonations, totalAmount, paidCount] = await Promise.all([
      runSingle(
        `SELECT COUNT(*) AS count FROM donations WHERE user_id = ?`,
        [userId],
      ),
      runSingle(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM donations WHERE user_id = ? AND LOWER(payment_status) = 'paid'`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM donations WHERE user_id = ? AND LOWER(payment_status) = 'paid'`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      totalDonations: totalDonations?.count || 0,
      totalAmount: totalAmount?.total || 0,
      paidDonations: paidCount?.count || 0,
    });
  } catch (error) {
    logger.error(error, 'client-donations');
    sendError(res, 'Gagal mengambil ringkasan donasi.', 500);
  }
});

/**
 * GET /api/client/donations/:id
 * Detail donasi milik user yang login.
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const row = await runSingle(
      `SELECT id, amount, campaign, campaign_id, payment_method, payment_status,
              is_anonymous, message, created_at, updated_at
       FROM donations
       WHERE id = ? AND user_id = ?`,
      [req.params.id, userId],
    );

    if (!row) return sendError(res, 'Donasi tidak ditemukan.', 404);
    sendSuccess(res, mapDonation(row));
  } catch (error) {
    logger.error(error, 'client-donations');
    sendError(res, 'Gagal mengambil detail donasi.', 500);
  }
});

module.exports = router;
