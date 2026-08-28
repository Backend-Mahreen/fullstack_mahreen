const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint sertifikat client hanya untuk client & intern (user-scoped).
 */
router.use(authenticate, authorize('client', 'intern'));

const mapCertificate = (row) => ({
  id: row.id,
  certificateNumber: row.certificate_number || '',
  verificationCode: row.verification_code || '',
  recipientName: row.recipient_name || '',
  recipientEmail: row.recipient_email || '',
  programType: row.program_type || '',
  programName: row.program_name || '',
  referenceId: row.reference_id || '',
  issuedAt: row.issued_at || '',
  expiresAt: row.expires_at || '',
  status: row.status || '',
  fileUrl: row.file_url || '',
  verificationCount: Number(row.verification_count || 0),
  createdAt: row.created_at,
});

/**
 * GET /api/client/certificates
 * Daftar sertifikat milik user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);
    const status = req.query.status || '';

    let query = `
      SELECT id, certificate_number, verification_code, recipient_name, recipient_email,
             program_type, program_name, reference_id, issued_at, expires_at,
             status, file_url, verification_count, created_at
      FROM certificates
      WHERE user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY issued_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows, countResult] = await Promise.all([
      runQuery(query, params),
      runSingle(
        `SELECT COUNT(*) AS total FROM certificates WHERE user_id = ?${status ? ' AND status = ?' : ''}`,
        status ? [userId, status] : [userId],
      ),
    ]);

    sendSuccess(res, {
      items: rows.map(mapCertificate),
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error(error, 'client-certificates');
    sendError(res, 'Gagal mengambil data sertifikat.', 500);
  }
});

/**
 * GET /api/client/certificates/summary
 * Ringkasan sertifikat milik user yang login.
 */
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalCerts, issuedCerts, verifiedCerts] = await Promise.all([
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates WHERE user_id = ?`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates WHERE user_id = ? AND status = 'issued'`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates WHERE user_id = ? AND status = 'issued' AND verification_count > 0`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      totalCertificates: totalCerts?.count || 0,
      issuedCertificates: issuedCerts?.count || 0,
      verifiedCertificates: verifiedCerts?.count || 0,
    });
  } catch (error) {
    logger.error(error, 'client-certificates');
    sendError(res, 'Gagal mengambil ringkasan sertifikat.', 500);
  }
});

/**
 * GET /api/client/certificates/:id
 * Detail sertifikat milik user yang login.
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const row = await runSingle(
      `SELECT id, certificate_number, verification_code, recipient_name, recipient_email,
              program_type, program_name, reference_id, issued_at, expires_at,
              status, file_url, verification_count, created_at
       FROM certificates
       WHERE id = ? AND user_id = ?`,
      [req.params.id, userId],
    );

    if (!row) return sendError(res, 'Sertifikat tidak ditemukan.', 404);
    sendSuccess(res, mapCertificate(row));
  } catch (error) {
    logger.error(error, 'client-certificates');
    sendError(res, 'Gagal mengambil detail sertifikat.', 500);
  }
});

module.exports = router;
