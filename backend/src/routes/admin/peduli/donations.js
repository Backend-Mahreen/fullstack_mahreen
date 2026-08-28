const express = require('express');
const router = express.Router();
const { runExecute } = require('../../../config/database');
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
  boolField,
  logAdminAction,
  broadcastToUser,
} = require('../_helpers');
const { recalculateCampaignTotals } = require('./campaigns');

const DONATION_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'donations',
      query: req.query,
      filters: [
        { param: 'status', column: 'payment_status' },
        { param: 'paymentMethod', column: 'payment_method' },
        { param: 'campaignId', column: 'campaign_id' },
        { param: 'isAnonymous', type: 'boolean', column: 'is_anonymous' },
        {
          param: 'search',
          type: 'search',
          columns: ['donor_name', 'donor_email', 'campaign', 'transaction_id'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'amount', 'donor_name', 'payment_status'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const donation = await findRow('donations', req.params.id);
    if (!donation) return sendError(res, 'Donasi tidak ditemukan.', 404);
    sendSuccess(res, donation);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['donorName', 'amount']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const status = String(req.body.paymentStatus || 'pending').toLowerCase();
    if (!DONATION_STATUSES.includes(status))
      return sendError(res, 'Status pembayaran tidak valid.', 400);

    let campaignTitle = req.body.campaign || '';
    if (req.body.campaignId) {
      const campaign = await findRow('donation_campaigns', req.body.campaignId, 'id, title');
      if (!campaign) return sendError(res, 'Kampanye tidak ditemukan.', 404);
      campaignTitle = campaign.title;
    }

    const id = uuidv4();
    const now = nowIso();

    await insertRow('donations', {
      id,
      user_id: req.body.userId || null,
      donor_name: req.body.donorName,
      donor_email: req.body.donorEmail || '',
      amount: Number(req.body.amount || 0),
      campaign: campaignTitle,
      campaign_id: req.body.campaignId || null,
      payment_method: req.body.paymentMethod || '',
      payment_status: status,
      transaction_id: req.body.transactionId || '',
      is_anonymous: boolField(req.body.isAnonymous, 0),
      message: req.body.message || '',
      created_at: now,
      updated_at: now,
    });

    await recalculateCampaignTotals(req.body.campaignId);
    await logAdminAction(req, {
      action: 'create',
      resource: 'donations',
      resourceId: id,
      summary: `Mencatat donasi dari ${req.body.donorName}`,
    });

    broadcastToUser(req.body.userId || null, 'notification', {
      type: 'donation_created',
      resourceId: id,
      action: 'created',
      message: `Donasi sebesar ${req.body.amount} telah dicatat.`,
    }, 'donations');

    sendSuccess(res, await findRow('donations', id), 201);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('donations', req.params.id, 'id, donor_name, campaign_id, user_id');
    if (!existing) return sendError(res, 'Donasi tidak ditemukan.', 404);

    if (req.body.paymentStatus) {
      const status = String(req.body.paymentStatus).toLowerCase();
      if (!DONATION_STATUSES.includes(status))
        return sendError(res, 'Status pembayaran tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      donor_name: 'donorName',
      donor_email: 'donorEmail',
      amount: { key: 'amount', transform: (v) => Number(v || 0) },
      campaign_id: 'campaignId',
      payment_method: 'paymentMethod',
      payment_status: { key: 'paymentStatus', transform: (v) => String(v).toLowerCase() },
      transaction_id: 'transactionId',
      is_anonymous: { key: 'isAnonymous', transform: (v) => boolField(v, 0) },
      message: 'message',
    });

    if (req.body.campaignId) {
      const campaign = await findRow('donation_campaigns', req.body.campaignId, 'id, title');
      if (!campaign) return sendError(res, 'Kampanye tidak ditemukan.', 404);
      payload.campaign = campaign.title;
    }

    payload.updated_at = nowIso();
    await updateRow('donations', req.params.id, payload);

    await recalculateCampaignTotals(existing.campaign_id);
    if (req.body.campaignId && req.body.campaignId !== existing.campaign_id) {
      await recalculateCampaignTotals(req.body.campaignId);
    }

    await logAdminAction(req, {
      action: 'update',
      resource: 'donations',
      resourceId: req.params.id,
      summary: `Memperbarui donasi ${existing.donor_name}`,
    });

    broadcastToUser(existing.user_id, 'notification', {
      type: 'donation_update',
      resourceId: req.params.id,
      action: 'updated',
      message: `Donasi ${existing.donor_name} telah diperbarui.`,
    }, 'donations');

    sendSuccess(res, await findRow('donations', req.params.id));
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const status = String(req.body.status || '').toLowerCase();
    if (!DONATION_STATUSES.includes(status))
      return sendError(res, 'Status pembayaran tidak valid.', 400);

    const existing = await findRow('donations', req.params.id, 'id, donor_name, campaign_id, user_id');
    if (!existing) return sendError(res, 'Donasi tidak ditemukan.', 404);

    await updateRow('donations', req.params.id, { payment_status: status, updated_at: nowIso() });
    await recalculateCampaignTotals(existing.campaign_id);

    await logAdminAction(req, {
      action: 'update_status',
      resource: 'donations',
      resourceId: req.params.id,
      summary: `Mengubah status donasi ${existing.donor_name} menjadi ${status}`,
    });

    if (existing.user_id) {
      broadcastToUser(existing.user_id, 'notification', {
        type: 'donation_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Status donasi diubah menjadi ${status}.`,
      }, 'donations');
    }

    sendSuccess(res, { id: req.params.id, status });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('donations', req.params.id, 'id, donor_name, campaign_id, user_id');
    if (!existing) return sendError(res, 'Donasi tidak ditemukan.', 404);

    await deleteRow('donations', req.params.id);
    await recalculateCampaignTotals(existing.campaign_id);

    await logAdminAction(req, {
      action: 'delete',
      resource: 'donations',
      resourceId: req.params.id,
      summary: `Menghapus donasi ${existing.donor_name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
