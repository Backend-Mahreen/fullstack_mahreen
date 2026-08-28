const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint invoice hanya untuk client & intern (user-scoped).
 */
router.use(authenticate, authorize('client', 'intern'));

const mapInvoice = (row) => {
  const issuedAt = row.created_at;
  const dueAt = row.due_date || '';
  const status =
    String(row.status || '').toLowerCase() === 'paid'
      ? 'paid'
      : dueAt && new Date(dueAt) < new Date()
        ? 'overdue'
        : 'pending';
  return {
    id: row.id,
    code: row.invoice_id,
    project: row.service || row.client_name || '',
    issuedAt,
    dueAt,
    amount: Number(row.amount || 0),
    status,
    paymentMethod: row.payment_method || '',
    updatedAt: row.paid_at || row.created_at,
  };
};

/**
 * GET /api/client/invoices
 * Daftar invoice milik user yang login, dipetakan dari tabel transactions.
 */
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, invoice_id, service, client_name, amount, status, due_date, paid_at, payment_method, created_at
       FROM transactions WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id],
    );
    sendSuccess(res, rows.map(mapInvoice));
  } catch (error) {
    logger.error(error, 'client-invoices');
    sendError(res, 'Gagal mengambil data invoice.', 500);
  }
});

/**
 * POST /api/client/invoices/:id/pay
 * Menandai invoice milik user sebagai lunas.
 */
router.post('/:id/pay', async (req, res) => {
  try {
    const invoice = await runSingle(
      `SELECT id, invoice_id, status FROM transactions WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id],
    );
    if (!invoice) return sendError(res, 'Invoice tidak ditemukan.', 404);

    const now = new Date().toISOString();
    await runExecute(
      `UPDATE transactions SET status = 'paid', paid_at = ?, payment_method = ? WHERE id = ?`,
      [now, req.body.paymentMethod || '', invoice.id],
    );

    const updated = await runSingle(
      `SELECT id, invoice_id, service, client_name, amount, status, due_date, paid_at, payment_method, created_at
       FROM transactions WHERE id = ?`,
      [invoice.id],
    );
    sendSuccess(res, mapInvoice(updated));
  } catch (error) {
    logger.error(error, 'client-invoices');
    sendError(res, 'Gagal memproses pembayaran invoice.', 500);
  }
});

module.exports = router;
