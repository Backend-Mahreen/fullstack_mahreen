const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate } = require('../middleware/auth');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { validateLengths } = require('../utils/validateLengths');
const { requireNonEmptyHeader } = require('../middleware/csrf');

/**
 * GET /api/donations
 * Ringkasan publik tanpa data donatur individual.
 * Detail lengkap tersedia pada /api/admin/peduli-mahreen/donations.
 */
router.get('/', async (req, res) => {
  try {
    const totalDonors =
      (
        await runSingle(
          `SELECT COUNT(DISTINCT COALESCE(NULLIF(donor_email, ''), donor_name)) as c
           FROM donations WHERE LOWER(payment_status) = 'paid'`,
        )
      )?.c || 0;
    const totalRaised =
      (
        await runSingle(
          `SELECT COALESCE(SUM(amount), 0) as t FROM donations WHERE LOWER(payment_status) = 'paid'`,
        )
      )?.t || 0;
    const totalDisbursed =
      (await runSingle(`SELECT COALESCE(SUM(disbursed_amount), 0) as t FROM donation_campaigns`))
        ?.t || 0;
    const activeCampaigns =
      (await runSingle(`SELECT COUNT(*) as c FROM donation_campaigns WHERE status = 'active'`))
        ?.c || 0;

    const campaigns = await runQuery(
      `SELECT id, slug, title, description, category, target_amount, collected_amount, image, status, end_date
       FROM donation_campaigns WHERE status IN ('active','completed') ORDER BY created_at DESC`,
    );

    const recentDonors = await runQuery(
      `SELECT CASE WHEN is_anonymous = 1 THEN 'Donatur Anonim' ELSE donor_name END AS donor_name,
              amount, campaign, created_at
       FROM donations WHERE LOWER(payment_status) = 'paid' ORDER BY created_at DESC LIMIT 10`,
    );

    sendSuccess(res, {
      totalDonors: Number(totalDonors),
      totalRaised: Number(totalRaised),
      totalDisbursed: Number(totalDisbursed),
      activeCampaigns: Number(activeCampaigns),
      disbursedPercentage:
        Number(totalRaised) > 0
          ? Math.round((Number(totalDisbursed) / Number(totalRaised)) * 100)
          : 0,
      campaigns: campaigns.map((c) => ({
        ...c,
        target_amount: Number(c.target_amount),
        collected_amount: Number(c.collected_amount),
        progressPercentage:
          Number(c.target_amount) > 0
            ? Math.min(
                100,
                Math.round((Number(c.collected_amount) / Number(c.target_amount)) * 100),
              )
            : 0,
      })),
      recentDonors,
    });
  } catch (error) {
    logger.error(error, 'donations');
    sendError(res, 'Gagal mengambil data donasi', 500);
  }
});

/**
 * POST /api/donations
 * Pembuatan donasi oleh pengunjung.
 */
router.post('/', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    // Frontend mengirim objek `donor` (DonationDonorInformation), sedangkan
    // kontrak lama mengirim field datar. Dukung keduanya agar tidak ada
    // data yang hilang ketika format berubah.
    const donor = req.body.donor && typeof req.body.donor === 'object' ? req.body.donor : {};
    const donorName = req.body.donorName ?? donor.fullName ?? req.body.donor_name;
    const donorEmail = req.body.donorEmail ?? donor.email ?? req.body.donor_email;
    const donorWhatsapp = req.body.donorWhatsapp ?? donor.whatsapp ?? '';
    const paymentMethod = req.body.paymentMethod ?? req.body.payment_method;
    const campaignId = req.body.campaignId ?? req.body.campaign_id;
    const isAnonymous = req.body.isAnonymous ?? donor.anonymous;
    const message = req.body.message ?? donor.message;
    const amount = Number(req.body.amount);

    if (!donorName || !amount) return sendError(res, 'donorName dan amount wajib diisi', 400);
    if (Number.isNaN(amount) || amount <= 0)
      return sendError(res, 'amount harus bilangan positif', 400);
    if (amount > 1000000000) return sendError(res, 'amount melebihi batas maksimal', 400);

    const lengthCheck = validateLengths({ fullName: donorName, email: donorEmail, message });
    if (!lengthCheck.valid) return sendError(res, lengthCheck.errors[0], 400);

    let campaignTitle = req.body.campaign || '';
    let campaignIdValue = null;
    if (campaignId) {
      const campaign = await runSingle(
        'SELECT id, title FROM donation_campaigns WHERE id = ? OR slug = ?',
        [campaignId, campaignId],
      );
      if (!campaign) return sendError(res, 'Kampanye donasi tidak ditemukan', 404);
      campaignTitle = campaign.title;
      // Kolom FK menyimpan UUID campaign, bukan slug yang dikirim client.
      campaignIdValue = campaign.id;
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    await runExecute(
      `INSERT INTO donations (id, user_id, donor_name, donor_email, amount, campaign, campaign_id, payment_method, payment_status, is_anonymous, message, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        null,
        donorName,
        donorEmail || '',
        amount,
        campaignTitle,
        campaignIdValue,
        paymentMethod || '',
        'pending',
        isAnonymous ? 1 : 0,
        message || '',
        createdAt,
        createdAt,
      ],
    );

    sendSuccess(
      res,
      {
        transactionId: id,
        status: 'draft',
        donorName,
        amount,
        paymentMethod: paymentMethod || '',
        campaignId: campaignId || null,
        campaign: campaignTitle,
        message: message || '',
        isAnonymous: Boolean(isAnonymous),
        createdAt,
      },
      201,
    );
  } catch (error) {
    logger.error(error, 'donations');
    sendError(res, 'Gagal membuat donasi', 500);
  }
});

/**
 * GET /api/donations/:id
 * Hanya untuk pemilik donasi atau admin.
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const donation = await runSingle('SELECT * FROM donations WHERE id = ?', [req.params.id]);
    if (!donation) return sendError(res, 'Donasi tidak ditemukan', 404);

    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      sendSuccess(res, donation);
      return;
    }

    // Cek user_id terlebih dahulu (lebih aman karena tidak bisa diduplikasi).
    // Email fallback hanya untuk donasi anonymous yang belum punya user_id.
    const isOwner =
      (donation.user_id && donation.user_id === req.user.id) ||
      (!donation.user_id && donation.donor_email && donation.donor_email === req.user.email);

    if (!isOwner) {
      return sendError(res, 'Akses ditolak untuk donasi ini.', 403);
    }

    sendSuccess(res, donation);
  } catch (error) {
    sendError(res, 'Gagal mengambil data donasi', 500);
  }
});

module.exports = router;
