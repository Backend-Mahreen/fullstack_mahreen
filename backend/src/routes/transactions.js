const express = require('express');
const router = express.Router();
const { runSingle } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Endpoint transaksi publik hanya untuk pemilik data atau admin.
 * Manajemen penuh tersedia pada /api/admin/tanya-mahreen/transactions.
 */
router.get('/', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  return sendError(
    res,
    'Gunakan /api/admin/tanya-mahreen/transactions untuk daftar transaksi.',
    410,
  );
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const transaction = await runSingle(
      'SELECT id, invoice_id, user_id, client_name, client_email, service, amount, status, due_date, paid_at, created_at FROM transactions WHERE id = ? OR invoice_id = ?',
      [req.params.id, req.params.id],
    );
    if (!transaction) return sendError(res, 'Transaksi tidak ditemukan', 404);

    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      sendSuccess(res, transaction);
      return;
    }

    // Cek user_id terlebih dahulu (lebih aman karena tidak bisa diduplikasi).
    // Email fallback hanya untuk data lama yang belum punya user_id.
    const isOwner =
      (transaction.user_id && transaction.user_id === req.user.id) ||
      (!transaction.user_id &&
        transaction.client_email &&
        transaction.client_email === req.user.email);

    if (!isOwner) {
      return sendError(res, 'Akses ditolak untuk transaksi ini.', 403);
    }

    sendSuccess(res, transaction);
  } catch (error) {
    sendError(res, 'Gagal mengambil data transaksi', 500);
  }
});

module.exports = router;
