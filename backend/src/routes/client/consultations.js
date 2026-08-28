const express = require('express');
const router = express.Router();
const { runQuery } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

router.use(authenticate, authorize('client', 'intern'));

/**
 * GET /api/client/dashboard/consultations
 * Daftar konsultasi milik user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

    const consultations = await runQuery(
      `SELECT id, full_name, email, phone, service_interest, message, status,
              consultation_type, preferred_date, handled_by, admin_notes, created_at
       FROM consultations
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit],
    );

    sendSuccess(res, { items: consultations });
  } catch (error) {
    logger.error(error, 'client-consultations');
    sendError(res, 'Gagal mengambil data konsultasi', 500);
  }
});

module.exports = router;
