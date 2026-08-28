const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../../config/database');
const { sendSuccess } = require('../../../utils/response');
const { asyncHandler, countWhere, sumColumn, groupCount } = require('../_helpers');

const campaignsRouter = require('./campaigns');
const donationsRouter = require('./donations');

/**
 * GET /api/admin/peduli-mahreen/stats
 * Statistik agregat donasi & kampanye.
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      totalDonations,
      paidDonations,
      pendingDonations,
      failedDonations,
      totalRaised,
      pendingAmount,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      targetTotal,
      disbursedTotal,
      uniqueDonors,
      methodBreakdown,
      statusBreakdown,
      monthlyDonations,
      topCampaigns,
      topDonors,
      recentDonations,
    ] = await Promise.all([
      countWhere('donations'),
      countWhere('donations', " WHERE LOWER(payment_status) = 'paid'"),
      countWhere('donations', " WHERE LOWER(payment_status) = 'pending'"),
      countWhere('donations', " WHERE LOWER(payment_status) IN ('failed','refunded')"),
      sumColumn('donations', 'amount', " WHERE LOWER(payment_status) = 'paid'"),
      sumColumn('donations', 'amount', " WHERE LOWER(payment_status) = 'pending'"),
      countWhere('donation_campaigns'),
      countWhere('donation_campaigns', " WHERE status = 'active'"),
      countWhere('donation_campaigns', " WHERE status = 'completed'"),
      sumColumn('donation_campaigns', 'target_amount'),
      sumColumn('donation_campaigns', 'disbursed_amount'),
      runSingle(
        `SELECT COUNT(DISTINCT COALESCE(NULLIF(donor_email, ''), donor_name)) AS count
         FROM donations WHERE LOWER(payment_status) = 'paid'`,
      ),
      groupCount('donations', 'payment_method', " WHERE LOWER(payment_status) = 'paid'"),
      groupCount('donations', 'payment_status'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS amount, COUNT(*) AS count
         FROM donations WHERE LOWER(payment_status) = 'paid'
         GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT id, slug, title, category, target_amount, collected_amount, disbursed_amount, status
         FROM donation_campaigns ORDER BY collected_amount DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT donor_name, COALESCE(NULLIF(donor_email, ''), '-') AS donor_email,
                COUNT(*) AS donation_count, COALESCE(SUM(amount), 0) AS total_amount
         FROM donations WHERE LOWER(payment_status) = 'paid' AND is_anonymous = 0
         GROUP BY donor_name, donor_email ORDER BY total_amount DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, donor_name, donor_email, amount, campaign, payment_method, payment_status, is_anonymous, created_at
         FROM donations ORDER BY created_at DESC LIMIT 8`,
      ),
    ]);

    sendSuccess(res, {
      totalDonations,
      paidDonations,
      pendingDonations,
      failedDonations,
      totalRaised,
      pendingAmount,
      totalDisbursed: disbursedTotal,
      disbursedPercentage: totalRaised > 0 ? Math.round((disbursedTotal / totalRaised) * 100) : 0,
      totalDonors: Number(uniqueDonors?.count || 0),
      averageDonation: paidDonations > 0 ? Math.round(totalRaised / paidDonations) : 0,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalTarget: targetTotal,
      targetAchievementPercentage:
        targetTotal > 0 ? Math.round((totalRaised / targetTotal) * 100) : 0,
      methodBreakdown: methodBreakdown.map((r) => ({
        method: r.label || 'lainnya',
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      monthlyDonations: monthlyDonations.map((r) => ({
        month: r.month,
        amount: Number(r.amount),
        count: Number(r.count),
      })),
      topCampaigns: topCampaigns.map((c) => ({
        ...c,
        target_amount: Number(c.target_amount),
        collected_amount: Number(c.collected_amount),
        disbursed_amount: Number(c.disbursed_amount),
        progressPercentage:
          Number(c.target_amount) > 0
            ? Math.min(
                100,
                Math.round((Number(c.collected_amount) / Number(c.target_amount)) * 100),
              )
            : 0,
      })),
      topDonors: topDonors.map((d) => ({
        donorName: d.donor_name,
        donorEmail: d.donor_email,
        donationCount: Number(d.donation_count),
        totalAmount: Number(d.total_amount),
      })),
      recentDonations,
    });
  }),
);

router.use('/campaigns', campaignsRouter);
router.use('/donations', donationsRouter);

module.exports = router;
