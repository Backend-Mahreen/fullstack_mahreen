const express = require('express');
const { sendSuccess, sendError } = require('../../utils/response');
const {
  asyncHandler,
  listResource,
  updateRow,
  deleteRow,
  findRow,
  logAdminAction,
} = require('./_helpers');

const CONTACT_INQUIRY_STATUSES = ['new', 'read', 'responded', 'closed'];
const SUPPORT_TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

/* Contact Inquiries */

const contactRouter = express.Router();

contactRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'contact_inquiries',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'search', type: 'search', columns: ['name', 'email', 'company', 'partnership'] },
      ],
      allowedSort: ['created_at', 'name', 'status'],
      defaultSort: 'created_at',
    });
    sendSuccess(res, result);
  }),
);

contactRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const inquiry = await findRow('contact_inquiries', req.params.id);
    if (!inquiry) return sendError(res, 'Pesan kontak tidak ditemukan.', 404);
    sendSuccess(res, inquiry);
  }),
);

contactRouter.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!CONTACT_INQUIRY_STATUSES.includes(status)) {
      return sendError(res, 'Status pesan kontak tidak valid.', 400);
    }

    const existing = await findRow('contact_inquiries', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Pesan kontak tidak ditemukan.', 404);

    await updateRow('contact_inquiries', req.params.id, { status });
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'contact_inquiries',
      resourceId: req.params.id,
      summary: `Mengubah status pesan kontak ${existing.name} menjadi ${status}`,
    });

    sendSuccess(res, { id: req.params.id, status });
  }),
);

contactRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('contact_inquiries', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Pesan kontak tidak ditemukan.', 404);

    await deleteRow('contact_inquiries', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'contact_inquiries',
      resourceId: req.params.id,
      summary: `Menghapus pesan kontak dari ${existing.name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* Support Tickets */

const supportRouter = express.Router();

supportRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'support_tickets',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'search', type: 'search', columns: ['name', 'email', 'category', 'message'] },
      ],
      allowedSort: ['created_at', 'name', 'status', 'category'],
      defaultSort: 'created_at',
    });
    sendSuccess(res, result);
  }),
);

supportRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const ticket = await findRow('support_tickets', req.params.id);
    if (!ticket) return sendError(res, 'Tiket bantuan tidak ditemukan.', 404);
    sendSuccess(res, ticket);
  }),
);

supportRouter.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!SUPPORT_TICKET_STATUSES.includes(status)) {
      return sendError(res, 'Status tiket bantuan tidak valid.', 400);
    }

    const existing = await findRow('support_tickets', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Tiket bantuan tidak ditemukan.', 404);

    await updateRow('support_tickets', req.params.id, { status });
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'support_tickets',
      resourceId: req.params.id,
      summary: `Mengubah status tiket bantuan ${existing.name} menjadi ${status}`,
    });

    sendSuccess(res, { id: req.params.id, status });
  }),
);

supportRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('support_tickets', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Tiket bantuan tidak ditemukan.', 404);

    await deleteRow('support_tickets', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'support_tickets',
      resourceId: req.params.id,
      summary: `Menghapus tiket bantuan dari ${existing.name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = { contactRouter, supportRouter };
