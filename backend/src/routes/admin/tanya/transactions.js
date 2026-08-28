const express = require('express');
const router = express.Router();
const { runSingle } = require('../../../config/database');
const { sendSuccess, sendError } = require('../../../utils/response');
const {
  uuidv4,
  nowIso,
  asyncHandler,
  listResource,
  insertRow,
  updateRow,
  deleteRow,
  findRow,
  pickDefined,
  requireFields,
  logAdminAction,
  countWhere,
  broadcastToUser,
} = require('../_helpers');

const TRANSACTION_STATUSES = ['pending', 'paid', 'failed', 'refunded', 'cancelled'];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'transactions',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'service', column: 'service' },
        { param: 'paymentMethod', column: 'payment_method' },
        {
          param: 'search',
          type: 'search',
          columns: ['invoice_id', 'client_name', 'client_email', 'service'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'amount', 'client_name', 'status', 'due_date', 'paid_at'],
      defaultSort: 'created_at',
    });

    const totals = await runSingle(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE UPPER(status) = 'PAID'`,
    );

    sendSuccess(res, { ...result, summary: { paidTotal: Number(totals?.total || 0) } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const transaction = await runSingle(
      'SELECT * FROM transactions WHERE id = ? OR invoice_id = ?',
      [req.params.id, req.params.id],
    );
    if (!transaction) return sendError(res, 'Transaksi tidak ditemukan.', 404);
    sendSuccess(res, transaction);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['clientName', 'amount']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    const now = nowIso();
    const count = await countWhere('transactions');
    const invoiceId =
      req.body.invoiceId || `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const duplicate = await runSingle('SELECT id FROM transactions WHERE invoice_id = ?', [
      invoiceId,
    ]);
    if (duplicate) return sendError(res, 'Nomor invoice sudah digunakan.', 409);

    const status = String(req.body.status || 'pending').toLowerCase();
    if (!TRANSACTION_STATUSES.includes(status))
      return sendError(res, 'Status transaksi tidak valid.', 400);

    await insertRow('transactions', {
      id,
      invoice_id: invoiceId,
      user_id: req.body.userId || null,
      client_name: req.body.clientName,
      client_email: req.body.clientEmail || '',
      service: req.body.service || '',
      amount: Number(req.body.amount || 0),
      status,
      due_date: req.body.dueDate || '',
      paid_at: status === 'paid' ? now : '',
      payment_method: req.body.paymentMethod || '',
      notes: req.body.notes || '',
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'transactions',
      resourceId: id,
      summary: `Membuat transaksi ${invoiceId} untuk ${req.body.clientName}`,
    });

    broadcastToUser(req.body.userId || null, 'notification', {
      type: 'transaction_created',
      resourceId: id,
      action: 'created',
      message: `Transaksi ${invoiceId} sebesar ${req.body.amount} telah dibuat.`,
    }, 'transactions');

    sendSuccess(res, await findRow('transactions', id), 201);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow(
      'transactions',
      req.params.id,
      'id, invoice_id, client_name, status, paid_at, user_id',
    );
    if (!existing) return sendError(res, 'Transaksi tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      client_name: 'clientName',
      client_email: 'clientEmail',
      service: 'service',
      amount: { key: 'amount', transform: (v) => Number(v || 0) },
      due_date: 'dueDate',
      payment_method: 'paymentMethod',
      notes: 'notes',
    });

    if (req.body.status) {
      const status = String(req.body.status).toLowerCase();
      if (!TRANSACTION_STATUSES.includes(status))
        return sendError(res, 'Status transaksi tidak valid.', 400);
      payload.status = status;
      if (status === 'paid' && String(existing.status).toLowerCase() !== 'paid')
        payload.paid_at = nowIso();
    }

    payload.updated_at = nowIso();
    await updateRow('transactions', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'transactions',
      resourceId: req.params.id,
      summary: `Memperbarui transaksi ${existing.invoice_id}`,
    });

    broadcastToUser(existing.user_id, 'notification', {
      type: 'transaction_update',
      resourceId: req.params.id,
      action: 'updated',
      message: `Transaksi ${existing.invoice_id} telah diperbarui.`,
    }, 'transactions');

    sendSuccess(res, await findRow('transactions', req.params.id));
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const status = String(req.body.status || '').toLowerCase();
    if (!TRANSACTION_STATUSES.includes(status))
      return sendError(res, 'Status transaksi tidak valid.', 400);

    const existing = await findRow('transactions', req.params.id, 'id, invoice_id, status, user_id');
    if (!existing) return sendError(res, 'Transaksi tidak ditemukan.', 404);

    const payload = { status, updated_at: nowIso() };
    if (status === 'paid' && String(existing.status).toLowerCase() !== 'paid')
      payload.paid_at = nowIso();

    await updateRow('transactions', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'transactions',
      resourceId: req.params.id,
      summary: `Mengubah status transaksi ${existing.invoice_id} menjadi ${status}`,
    });

    if (existing.user_id) {
      broadcastToUser(existing.user_id, 'notification', {
        type: 'transaction_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Status transaksi ${existing.invoice_id} diubah menjadi ${status}.`,
      }, 'transactions');
    }

    sendSuccess(res, { id: req.params.id, status });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('transactions', req.params.id, 'id, invoice_id');
    if (!existing) return sendError(res, 'Transaksi tidak ditemukan.', 404);

    await deleteRow('transactions', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'transactions',
      resourceId: req.params.id,
      summary: `Menghapus transaksi ${existing.invoice_id}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
