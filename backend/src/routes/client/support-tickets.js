const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint support ticket client hanya untuk client & intern.
 * Support tickets tidak memiliki user_id — difilter berdasarkan email user.
 */
router.use(authenticate, authorize('client', 'intern'));

const mapTicket = (row) => ({
  id: row.id,
  name: row.name || '',
  email: row.email || '',
  category: row.category || '',
  message: row.message || '',
  status: row.status || 'open',
  createdAt: row.created_at,
});

/**
 * GET /api/client/support-tickets
 * Daftar tiket dukungan milik user yang login (berdasarkan email).
 */
router.get('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);
    const status = req.query.status || '';

    let query = `
      SELECT id, name, email, category, message, status, created_at
      FROM support_tickets
      WHERE email = ?
    `;
    const params = [userEmail];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows, countResult] = await Promise.all([
      runQuery(query, params),
      runSingle(
        `SELECT COUNT(*) AS total FROM support_tickets WHERE email = ?${status ? ' AND status = ?' : ''}`,
        status ? [userEmail, status] : [userEmail],
      ),
    ]);

    sendSuccess(res, {
      items: rows.map(mapTicket),
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error(error, 'client-support-tickets');
    sendError(res, 'Gagal mengambil data tiket dukungan.', 500);
  }
});

/**
 * GET /api/client/support-tickets/summary
 * Ringkasan tiket dukungan milik user yang login.
 */
router.get('/summary', async (req, res) => {
  try {
    const userEmail = req.user.email;

    const [totalTickets, openTickets, resolvedTickets] = await Promise.all([
      runSingle(
        `SELECT COUNT(*) AS count FROM support_tickets WHERE email = ?`,
        [userEmail],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM support_tickets WHERE email = ? AND status IN ('open','in_progress')`,
        [userEmail],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM support_tickets WHERE email = ? AND status IN ('resolved','closed')`,
        [userEmail],
      ),
    ]);

    sendSuccess(res, {
      totalTickets: totalTickets?.count || 0,
      openTickets: openTickets?.count || 0,
      resolvedTickets: resolvedTickets?.count || 0,
    });
  } catch (error) {
    logger.error(error, 'client-support-tickets');
    sendError(res, 'Gagal mengambil ringkasan tiket dukungan.', 500);
  }
});

/**
 * GET /api/client/support-tickets/:id
 * Detail tiket dukungan milik user yang login.
 */
router.get('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const row = await runSingle(
      `SELECT id, name, email, category, message, status, created_at
       FROM support_tickets
       WHERE id = ? AND email = ?`,
      [req.params.id, userEmail],
    );

    if (!row) return sendError(res, 'Tiket dukungan tidak ditemukan.', 404);
    sendSuccess(res, mapTicket(row));
  } catch (error) {
    logger.error(error, 'client-support-tickets');
    sendError(res, 'Gagal mengambil detail tiket dukungan.', 500);
  }
});

module.exports = router;
