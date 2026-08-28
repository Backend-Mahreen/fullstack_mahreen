const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint internship application client hanya untuk client & intern (user-scoped).
 */
router.use(authenticate, authorize('client', 'intern'));

const mapApplication = (row) => ({
  id: row.id,
  fullName: row.full_name || '',
  email: row.email || '',
  phone: row.phone || '',
  university: row.university || '',
  major: row.major || '',
  semester: Number(row.semester || 0),
  specialization: row.specialization || '',
  motivation: row.motivation || '',
  portfolioUrl: row.portfolio_url || '',
  cvUrl: row.cv_url || '',
  motivationLetterUrl: row.motivation_letter_url || '',
  batchId: row.batch_id || '',
  status: row.status || 'pending',
  reviewedAt: row.reviewed_at || '',
  adminNotes: row.admin_notes || '',
  createdAt: row.created_at,
});

/**
 * GET /api/client/internship-applications
 * Daftar aplikasi internship milik user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);

    const [rows, countResult] = await Promise.all([
      runQuery(
        `SELECT id, full_name, email, phone, university, major, semester, specialization,
                motivation, portfolio_url, cv_url, motivation_letter_url, batch_id,
                status, reviewed_at, admin_notes, created_at
         FROM internship_applications
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset],
      ),
      runSingle(
        `SELECT COUNT(*) AS total FROM internship_applications WHERE user_id = ?`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      items: rows.map(mapApplication),
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error(error, 'client-internship-applications');
    sendError(res, 'Gagal mengambil data aplikasi internship.', 500);
  }
});

/**
 * GET /api/client/internship-applications/:id
 * Detail aplikasi internship milik user yang login.
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const row = await runSingle(
      `SELECT id, full_name, email, phone, university, major, semester, specialization,
              motivation, portfolio_url, cv_url, motivation_letter_url, batch_id,
              status, reviewed_at, admin_notes, created_at
       FROM internship_applications
       WHERE id = ? AND user_id = ?`,
      [req.params.id, userId],
    );

    if (!row) return sendError(res, 'Aplikasi internship tidak ditemukan.', 404);
    sendSuccess(res, mapApplication(row));
  } catch (error) {
    logger.error(error, 'client-internship-applications');
    sendError(res, 'Gagal mengambil detail aplikasi internship.', 500);
  }
});

module.exports = router;
