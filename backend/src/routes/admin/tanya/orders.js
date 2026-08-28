const express = require('express');
const router = express.Router();
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
  jsonField,
  logAdminAction,
  recordActivity,
  countWhere,
  broadcastToUser,
} = require('../_helpers');
const { createNotification } = require('../../client/notifications');

const ORDER_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'service_orders',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'serviceKey', column: 'service_key' },
        { param: 'tier', column: 'tier' },
        {
          param: 'search',
          type: 'search',
          columns: ['client_name', 'client_email', 'invoice_id', 'service_key'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'client_name', 'total_price', 'status'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await findRow('service_orders', req.params.id);
    if (!order) return sendError(res, 'Pesanan tidak ditemukan.', 404);
    sendSuccess(res, order);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['serviceKey', 'tier', 'clientName', 'totalPrice']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    const now = nowIso();
    const orderCount = await countWhere('service_orders');

    await insertRow('service_orders', {
      id,
      user_id: req.body.userId || null,
      service_key: req.body.serviceKey,
      tier: req.body.tier,
      client_name: req.body.clientName,
      client_email: req.body.clientEmail || '',
      total_price: Number(req.body.totalPrice || 0),
      addons: jsonField(req.body.addons, []),
      status: req.body.status || 'pending',
      invoice_id:
        req.body.invoiceId ||
        `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`,
      notes: req.body.notes || '',
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'service_orders',
      resourceId: id,
      summary: `Membuat pesanan layanan untuk ${req.body.clientName}`,
    });
    await recordActivity({
      type: 'order_created',
      title: 'Pesanan layanan baru',
      description: `${req.body.clientName} memesan paket ${req.body.serviceKey} tier ${req.body.tier}.`,
    });

    broadcastToUser(req.body.userId || null, 'notification', {
      type: 'order_created',
      resourceId: id,
      action: 'created',
      message: `Pesanan ${req.body.serviceKey} tier ${req.body.tier} telah dibuat.`,
    }, 'orders');

    sendSuccess(res, await findRow('service_orders', id), 201);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('service_orders', req.params.id, 'id, client_name, user_id');
    if (!existing) return sendError(res, 'Pesanan tidak ditemukan.', 404);

    if (req.body.status && !ORDER_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status pesanan tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      service_key: 'serviceKey',
      tier: 'tier',
      client_name: 'clientName',
      client_email: 'clientEmail',
      total_price: { key: 'totalPrice', transform: (v) => Number(v || 0) },
      addons: { key: 'addons', transform: (v) => jsonField(v, []) },
      status: 'status',
      notes: 'notes',
    });

    payload.updated_at = nowIso();
    await updateRow('service_orders', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'service_orders',
      resourceId: req.params.id,
      summary: `Memperbarui pesanan ${existing.client_name}`,
    });

    broadcastToUser(existing.user_id, 'notification', {
      type: 'order_update',
      resourceId: req.params.id,
      action: 'updated',
      message: `Pesanan ${existing.client_name} telah diperbarui.`,
    }, 'orders');

    sendSuccess(res, await findRow('service_orders', req.params.id));
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) return sendError(res, 'Status pesanan tidak valid.', 400);

    const existing = await findRow('service_orders', req.params.id, 'id, client_name, user_id');
    if (!existing) return sendError(res, 'Pesanan tidak ditemukan.', 404);

    await updateRow('service_orders', req.params.id, { status, updated_at: nowIso() });
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'service_orders',
      resourceId: req.params.id,
      summary: `Mengubah status pesanan ${existing.client_name} menjadi ${status}`,
    });

    if (existing.user_id) {
      const statusLabels = {
        pending: 'Menunggu',
        in_progress: 'Sedang Dikerjakan',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
      };
      await createNotification(existing.user_id, {
        type: 'order_update',
        title: 'Status Pesanan Diperbarui',
        message: `Pesanan Anda (${existing.client_name}) telah ${statusLabels[status] || status}.`,
        link: '/akun/projects',
      });

      broadcastToUser(existing.user_id, 'notification', {
        type: 'order_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Status pesanan diubah menjadi ${statusLabels[status] || status}.`,
      }, 'orders');
    }

    sendSuccess(res, { id: req.params.id, status });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('service_orders', req.params.id, 'id, client_name, user_id');
    if (!existing) return sendError(res, 'Pesanan tidak ditemukan.', 404);

    await deleteRow('service_orders', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'service_orders',
      resourceId: req.params.id,
      summary: `Menghapus pesanan ${existing.client_name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
