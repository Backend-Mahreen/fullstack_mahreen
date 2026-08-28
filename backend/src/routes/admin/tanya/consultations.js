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
  logAdminAction,
  broadcastToUser,
} = require('../_helpers');
const { createNotification } = require('../../client/notifications');

const CONSULTATION_STATUSES = ['pending', 'scheduled', 'completed', 'cancelled'];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'consultations',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'consultationType', column: 'consultation_type' },
        { param: 'serviceInterest', column: 'service_interest' },
        {
          param: 'search',
          type: 'search',
          columns: ['full_name', 'email', 'phone', 'service_interest', 'message'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'full_name', 'status', 'preferred_date'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const consultation = await findRow('consultations', req.params.id);
    if (!consultation) return sendError(res, 'Konsultasi tidak ditemukan.', 404);
    sendSuccess(res, consultation);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['fullName', 'email']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    const now = nowIso();

    await insertRow('consultations', {
      id,
      user_id: req.body.userId || null,
      full_name: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone || '',
      service_interest: req.body.serviceInterest || '',
      message: req.body.message || '',
      status: req.body.status || 'pending',
      consultation_type: req.body.consultationType || 'free',
      preferred_date: req.body.preferredDate || '',
      handled_by: req.body.assignedPm || '',
      admin_notes: req.body.adminNotes || '',
      assigned_pm: req.body.assignedPm || '',
      priority: req.body.priority || 'normal',
      budget_label: req.body.budgetLabel || '',
      service_category: req.body.serviceCategory || req.body.serviceInterest || '',
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'consultations',
      resourceId: id,
      summary: `Membuat konsultasi untuk ${req.body.fullName}`,
    });

    broadcastToUser(req.body.userId || null, 'notification', {
      type: 'consultation_created',
      resourceId: id,
      action: 'created',
      message: `Konsultasi untuk ${req.body.fullName} telah dibuat.`,
    }, 'consultations');

    sendSuccess(res, await findRow('consultations', id), 201);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('consultations', req.params.id, 'id, full_name, user_id');
    if (!existing) return sendError(res, 'Konsultasi tidak ditemukan.', 404);

    if (req.body.status && !CONSULTATION_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status konsultasi tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      full_name: 'fullName',
      email: 'email',
      phone: 'phone',
      service_interest: 'serviceInterest',
      message: 'message',
      status: 'status',
      consultation_type: 'consultationType',
      preferred_date: 'preferredDate',
      admin_notes: 'adminNotes',
      assigned_pm: 'assignedPm',
      priority: 'priority',
      budget_label: 'budgetLabel',
      service_category: 'serviceCategory',
    });

    payload.updated_at = nowIso();
    await updateRow('consultations', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'consultations',
      resourceId: req.params.id,
      summary: `Memperbarui konsultasi ${existing.full_name}`,
    });

    broadcastToUser(existing.user_id, 'notification', {
      type: 'consultation_update',
      resourceId: req.params.id,
      action: 'updated',
      message: `Konsultasi ${existing.full_name} telah diperbarui.`,
    }, 'consultations');

    sendSuccess(res, await findRow('consultations', req.params.id));
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!CONSULTATION_STATUSES.includes(status))
      return sendError(res, 'Status konsultasi tidak valid.', 400);

    const existing = await findRow('consultations', req.params.id, 'id, full_name, user_id');
    if (!existing) return sendError(res, 'Konsultasi tidak ditemukan.', 404);

    await updateRow('consultations', req.params.id, {
      status,
      handled_by: req.user?.id || '',
      admin_notes: req.body.adminNotes ?? undefined,
      updated_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'update_status',
      resource: 'consultations',
      resourceId: req.params.id,
      summary: `Mengubah status konsultasi ${existing.full_name} menjadi ${status}`,
    });

    if (existing.user_id) {
      const statusLabels = {
        pending: 'Menunggu',
        scheduled: 'Dijadwalkan',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
      };
      await createNotification(existing.user_id, {
        type: 'consultation_update',
        title: 'Status Konsultasi Diperbarui',
        message: `Konsultasi Anda dengan ${existing.full_name} telah ${statusLabels[status] || status}.`,
        link: '/akun',
      });

      broadcastToUser(existing.user_id, 'notification', {
        type: 'consultation_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Status konsultasi diubah menjadi ${statusLabels[status] || status}.`,
      }, 'consultations');
    }

    sendSuccess(res, { id: req.params.id, status });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('consultations', req.params.id, 'id, full_name, user_id');
    if (!existing) return sendError(res, 'Konsultasi tidak ditemukan.', 404);

    await deleteRow('consultations', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'consultations',
      resourceId: req.params.id,
      summary: `Menghapus konsultasi ${existing.full_name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
