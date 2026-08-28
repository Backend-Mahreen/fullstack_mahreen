const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute, withTransaction } = require('../../../config/database');
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
  makeUniqueSlug,
  boolField,
  jsonField,
  logAdminAction,
  recordActivity,
  countWhere,
  broadcastToUser,
} = require('../_helpers');

const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'completed', 'archived'];

const recalculateCampaignTotals = async (campaignId) => {
  if (!campaignId) return;
  const row = await runSingle(
    `SELECT COALESCE(SUM(amount), 0) AS collected FROM donations
     WHERE campaign_id = ? AND LOWER(payment_status) = 'paid'`,
    [campaignId],
  );
  await runExecute(
    `UPDATE donation_campaigns SET collected_amount = ?, updated_at = ? WHERE id = ?`,
    [Number(row?.collected || 0), nowIso(), campaignId],
  );
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'donation_campaigns',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'search', type: 'search', columns: ['title', 'description', 'category'] },
      ],
      allowedSort: ['created_at', 'title', 'target_amount', 'collected_amount', 'status'],
      defaultSort: 'created_at',
    });

    const donorRows = await runQuery(
      `SELECT campaign_id, COUNT(DISTINCT COALESCE(NULLIF(donor_email, ''), donor_name)) AS donor_count
       FROM donations WHERE LOWER(payment_status) = 'paid' GROUP BY campaign_id`,
    );
    const donorByCampaign = new Map(
      donorRows.map((r) => [r.campaign_id, Number(r.donor_count || 0)]),
    );

    const items = result.items.map((c) => {
      const targetAmount = Number(c.target_amount);
      const collectedAmount = Number(c.collected_amount);
      const progress =
        targetAmount > 0 ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100)) : 0;
      const daysLeft = c.end_date
        ? Math.max(
            0,
            Math.ceil((new Date(`${c.end_date}T23:59:59`).getTime() - Date.now()) / 86_400_000),
          )
        : 0;
      return {
        ...c,
        target_amount: targetAmount,
        collected_amount: collectedAmount,
        disbursed_amount: Number(c.disbursed_amount),
        targetAmount,
        collectedAmount,
        donor_count: donorByCampaign.get(c.id) || 0,
        donorCount: donorByCampaign.get(c.id) || 0,
        progress,
        progressPercentage: progress,
        days_left: Number.isFinite(daysLeft) ? daysLeft : 0,
        daysLeft: Number.isFinite(daysLeft) ? daysLeft : 0,
      };
    });

    sendSuccess(res, { ...result, items });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const campaign = await runSingle('SELECT * FROM donation_campaigns WHERE id = ? OR slug = ?', [
      req.params.id,
      req.params.id,
    ]);
    if (!campaign) return sendError(res, 'Kampanye tidak ditemukan.', 404);

    const donations = await runQuery(
      `SELECT id, donor_name, donor_email, amount, payment_method, payment_status, is_anonymous, created_at
       FROM donations WHERE campaign_id = ? ORDER BY created_at DESC LIMIT 20`,
      [campaign.id],
    );

    const donorRow = await runSingle(
      `SELECT COUNT(DISTINCT COALESCE(NULLIF(donor_email, ''), donor_name)) AS donor_count
       FROM donations WHERE campaign_id = ? AND LOWER(payment_status) = 'paid'`,
      [campaign.id],
    );

    const targetAmount = Number(campaign.target_amount);
    const collectedAmount = Number(campaign.collected_amount);
    const progress =
      targetAmount > 0 ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100)) : 0;
    const daysLeft = campaign.end_date
      ? Math.max(
          0,
          Math.ceil(
            (new Date(`${campaign.end_date}T23:59:59`).getTime() - Date.now()) / 86_400_000,
          ),
        )
      : 0;

    sendSuccess(res, {
      ...campaign,
      target_amount: targetAmount,
      collected_amount: collectedAmount,
      disbursed_amount: Number(campaign.disbursed_amount),
      targetAmount,
      collectedAmount,
      donor_count: Number(donorRow?.donor_count || 0),
      donorCount: Number(donorRow?.donor_count || 0),
      progress,
      progressPercentage: progress,
      days_left: Number.isFinite(daysLeft) ? daysLeft : 0,
      daysLeft: Number.isFinite(daysLeft) ? daysLeft : 0,
      donations,
    });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title', 'targetAmount']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    // Frontend mengirim status dengan enum kapital (Draft/Published/Archived),
    // sedangkan DB menyimpan lowercase (draft/active/paused/completed/archived).
    const clientStatus = String(req.body.status || 'Draft');
    const statusMap = {
      Draft: 'draft',
      Published: 'active',
      Archived: 'archived',
    };
    const status = statusMap[clientStatus] || clientStatus;
    if (!CAMPAIGN_STATUSES.includes(status))
      return sendError(res, 'Status kampanye tidak valid.', 400);

    const id = uuidv4();
    const now = nowIso();
    const slug = await makeUniqueSlug('donation_campaigns', req.body.slug || req.body.title);

    await insertRow('donation_campaigns', {
      id,
      slug,
      title: req.body.title,
      description: req.body.story || req.body.description || '',
      category: req.body.category || '',
      target_amount: Number(req.body.targetAmount || 0),
      collected_amount: 0,
      disbursed_amount: 0,
      image: req.body.thumbnail || req.body.image || '',
      status,
      start_date: req.body.publishSchedule || '',
      end_date: req.body.endDate || '',
      location: req.body.location || '',
      pic: req.body.pic || '',
      story: req.body.story || '',
      meta_description: req.body.metaDescription || '',
      gallery: jsonField(req.body.gallery, []),
      visibility: req.body.visibility || 'Public',
      publish_schedule: req.body.publishSchedule || '',
      allow_anonymous: boolField(req.body.allowAnonymous, 1),
      notify_subscribers: boolField(req.body.notifySubscribers, 0),
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'donation_campaigns',
      resourceId: id,
      summary: `Membuat kampanye donasi ${req.body.title}`,
    });

    sendSuccess(res, await findRow('donation_campaigns', id), 201);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('donation_campaigns', req.params.id, 'id, title, slug');
    if (!existing) return sendError(res, 'Kampanye tidak ditemukan.', 404);

    const clientStatus = req.body.status ? String(req.body.status) : null;
    if (clientStatus) {
      const statusMap = { Draft: 'draft', Published: 'active', Archived: 'archived' };
      const normalized = statusMap[clientStatus] || clientStatus;
      if (!CAMPAIGN_STATUSES.includes(normalized))
        return sendError(res, 'Status kampanye tidak valid.', 400);
      req.body.status = normalized;
    }

    const payload = pickDefined(req.body, {
      title: 'title',
      description: { key: 'story', transform: (v) => String(v ?? '') },
      category: 'category',
      target_amount: { key: 'targetAmount', transform: (v) => Number(v || 0) },
      disbursed_amount: { key: 'disbursedAmount', transform: (v) => Number(v || 0) },
      image: { key: 'thumbnail', transform: (v) => String(v ?? '') },
      status: 'status',
      start_date: { key: 'publishSchedule', transform: (v) => String(v ?? '') },
      end_date: 'endDate',
      location: 'location',
      pic: 'pic',
      story: 'story',
      meta_description: 'metaDescription',
      gallery: { key: 'gallery', transform: (v) => jsonField(v, []) },
      visibility: 'visibility',
      publish_schedule: 'publishSchedule',
      allow_anonymous: { key: 'allowAnonymous', transform: (v) => boolField(v, 1) },
      notify_subscribers: { key: 'notifySubscribers', transform: (v) => boolField(v, 0) },
    });

    if (req.body.title && req.body.title !== existing.title) {
      payload.slug = await makeUniqueSlug('donation_campaigns', req.body.title, req.params.id);
    }

    payload.updated_at = nowIso();
    await updateRow('donation_campaigns', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'donation_campaigns',
      resourceId: req.params.id,
      summary: `Memperbarui kampanye ${req.body.title || existing.title}`,
    });

    sendSuccess(res, await findRow('donation_campaigns', req.params.id));
  }),
);

/**
 * POST /api/admin/peduli-mahreen/campaigns/:id/disburse
 * Mencatat penyaluran dana kampanye.
 */
router.post(
  '/:id/disburse',
  asyncHandler(async (req, res) => {
    const amount = Number(req.body.amount || 0);
    if (amount <= 0) return sendError(res, 'Jumlah penyaluran harus lebih besar dari nol.', 400);

    // Operasi baca + validasi + tulis harus atomic untuk mencegah race condition.
    const result = await withTransaction(async (conn) => {
      const [rows] = await conn.query(
        'SELECT id, title, collected_amount, disbursed_amount FROM donation_campaigns WHERE id = ? FOR UPDATE',
        [req.params.id],
      );
      const campaign = rows[0];
      if (!campaign) return { error: 404 };

      const newDisbursed = Number(campaign.disbursed_amount) + amount;
      if (newDisbursed > Number(campaign.collected_amount)) {
        return { error: 400 };
      }

      await conn.query(
        'UPDATE donation_campaigns SET disbursed_amount = ?, updated_at = ? WHERE id = ?',
        [newDisbursed, nowIso(), req.params.id],
      );

      return { campaign, newDisbursed };
    });

    if (result.error === 404) return sendError(res, 'Kampanye tidak ditemukan.', 404);
    if (result.error === 400)
      return sendError(res, 'Total penyaluran melebihi dana terkumpul.', 400);

    await logAdminAction(req, {
      action: 'disburse',
      resource: 'donation_campaigns',
      resourceId: req.params.id,
      summary: `Menyalurkan dana ${amount} untuk kampanye ${result.campaign.title}`,
      metadata: { amount, note: req.body.note || '' },
    });
    await recordActivity({
      type: 'donation_disbursed',
      title: 'Penyaluran dana donasi',
      description: `${result.campaign.title} menyalurkan dana sebesar ${amount}.`,
    });

    // Broadcast SSE ke setiap donor paid dari kampanye ini
    const donors = await runQuery(
      'SELECT DISTINCT user_id FROM donations WHERE campaign_id = ? AND user_id IS NOT NULL AND LOWER(payment_status) = ?',
      [req.params.id, 'paid'],
    );
    for (const donor of donors) {
      broadcastToUser(donor.user_id, 'notification', {
        type: 'donation_disbursed',
        resourceId: req.params.id,
        action: 'updated',
        message: `Dana kampanye ${result.campaign.title} telah disalurkan sebesar ${amount}.`,
      }, 'donations');
    }

    sendSuccess(res, { id: req.params.id, disbursedAmount: result.newDisbursed });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('donation_campaigns', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Kampanye tidak ditemukan.', 404);

    const linked = await countWhere('donations', ' WHERE campaign_id = ?', [req.params.id]);
    if (linked > 0) {
      return sendError(
        res,
        `Kampanye masih memiliki ${linked} donasi terkait. Arsipkan alih-alih menghapus.`,
        400,
      );
    }

    await deleteRow('donation_campaigns', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'donation_campaigns',
      resourceId: req.params.id,
      summary: `Menghapus kampanye ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
module.exports.recalculateCampaignTotals = recalculateCampaignTotals;
