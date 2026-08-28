const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint CSR application client hanya untuk client & intern (user-scoped).
 */
router.use(authenticate, authorize('client', 'intern'));

const mapApplication = (row) => ({
  id: row.id,
  programId: row.program_id || '',
  role: row.role || '',
  fullName: row.full_name || '',
  email: row.email || '',
  phone: row.phone || '',
  institution: row.institution || '',
  city: row.city || '',
  province: row.province || '',
  focusArea: row.focus_area || '',
  motivation: row.motivation || '',
  portfolioUrl: row.portfolio_url || '',
  vision: row.vision || '',
  status: row.status || 'pending',
  reviewedAt: row.reviewed_at || '',
  createdAt: row.created_at,
});

/**
 * GET /api/client/csr-applications
 * Daftar aplikasi CSR milik user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);

    const [rows, countResult] = await Promise.all([
      runQuery(
        `SELECT id, program_id, role, full_name, email, phone, institution, city, province,
                focus_area, motivation, portfolio_url, vision, status, reviewed_at, created_at
         FROM csr_applications
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset],
      ),
      runSingle(
        `SELECT COUNT(*) AS total FROM csr_applications WHERE user_id = ?`,
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
    logger.error(error, 'client-csr-applications');
    sendError(res, 'Gagal mengambil data aplikasi CSR.', 500);
  }
});

/**
 * GET /api/client/csr-applications/:id
 * Detail aplikasi CSR milik user yang login.
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const row = await runSingle(
      `SELECT id, program_id, role, full_name, email, phone, institution, city, province,
              focus_area, motivation, portfolio_url, vision, status, reviewed_at, created_at
       FROM csr_applications
       WHERE id = ? AND user_id = ?`,
      [req.params.id, userId],
    );

    if (!row) return sendError(res, 'Aplikasi CSR tidak ditemukan.', 404);
    sendSuccess(res, mapApplication(row));
  } catch (error) {
    logger.error(error, 'client-csr-applications');
    sendError(res, 'Gagal mengambil detail aplikasi CSR.', 500);
  }
});

module.exports = router;
