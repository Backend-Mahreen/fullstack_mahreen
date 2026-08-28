const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess } = require('../../utils/response');
const { asyncHandler, countWhere, sumColumn, monthlySeries } = require('./_helpers');
const { getOrSet, statsCache } = require('../../utils/cache');

/**
 * GET /api/admin/overview/stats
 * Ringkasan agregat lintas modul untuk kartu statistik dashboard.
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const result = await getOrSet(statsCache, 'overview-stats', async () => {
      const [
        totalUsers,
        activeUsers,
        adminCount,
        clientCount,
        internCount,
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews,
        totalProducts,
        publishedProducts,
        lowStockProducts,
        totalTransactions,
        paidTransactions,
        pendingTransactions,
        totalRevenue,
        pendingRevenue,
        totalDonationRecords,
        paidDonationRecords,
        donationRaised,
        donationDisbursed,
        activeCampaigns,
        totalCampaigns,
        totalConsultations,
        pendingConsultations,
        totalServiceOrders,
        activeServiceOrders,
        totalInternApplications,
        pendingInternApplications,
        acceptedInternApplications,
        totalBatches,
        openBatches,
        totalCsrPrograms,
        activeCsrPrograms,
        totalCsrApplications,
        pendingCsrApplications,
        totalPortfolios,
        totalCertificates,
        issuedCertificates,
        revokedCertificates,
        totalVerifications,
        totalWebinars,
        totalEvents,
        totalTopics,
        analyticsEvents,
      ] = await Promise.all([
        countWhere('users'),
        countWhere('users', " WHERE status = 'active'"),
        countWhere('users', " WHERE role IN ('admin', 'superadmin')"),
        countWhere('users', " WHERE role = 'client'"),
        countWhere('users', " WHERE role = 'intern'"),
        countWhere('articles'),
        countWhere('articles', " WHERE status = 'published'"),
        countWhere('articles', " WHERE status = 'draft'"),
        sumColumn('articles', 'views'),
        countWhere('products'),
        countWhere('products', " WHERE status = 'published'"),
        countWhere('products', ' WHERE stock <= 10'),
        countWhere('transactions'),
        countWhere('transactions', " WHERE UPPER(status) = 'PAID'"),
        countWhere('transactions', " WHERE UPPER(status) = 'PENDING'"),
        sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PAID'"),
        sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PENDING'"),
        countWhere('donations'),
        countWhere('donations', " WHERE LOWER(payment_status) = 'paid'"),
        sumColumn('donations', 'amount', " WHERE LOWER(payment_status) = 'paid'"),
        sumColumn('donation_campaigns', 'disbursed_amount'),
        countWhere('donation_campaigns', " WHERE status = 'active'"),
        countWhere('donation_campaigns'),
        countWhere('consultations'),
        countWhere('consultations', " WHERE status = 'pending'"),
        countWhere('service_orders'),
        countWhere('service_orders', " WHERE status IN ('pending','in_progress')"),
        countWhere('internship_applications'),
        countWhere('internship_applications', " WHERE status = 'pending'"),
        countWhere('internship_applications', " WHERE status = 'accepted'"),
        countWhere('internship_batches'),
        countWhere('internship_batches', " WHERE status = 'open'"),
        countWhere('csr_programs'),
        countWhere('csr_programs', " WHERE status = 'active'"),
        countWhere('csr_applications'),
        countWhere('csr_applications', " WHERE status = 'pending'"),
        countWhere('portfolios'),
        countWhere('certificates'),
        countWhere('certificates', " WHERE status = 'issued'"),
        countWhere('certificates', " WHERE status = 'revoked'"),
        countWhere('certificate_verifications'),
        countWhere('webinars'),
        countWhere('events'),
        countWhere('topics'),
        countWhere('analytics_events'),
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminCount,
          clients: clientCount,
          interns: internCount,
        },
        newsroom: {
          totalArticles,
          published: publishedArticles,
          drafts: draftArticles,
          totalViews,
          totalTopics,
          totalWebinars,
          totalEvents,
        },
        studio: {
          totalProducts,
          published: publishedProducts,
          lowStock: lowStockProducts,
          totalPortfolios,
        },
        tanyaMahreen: {
          totalTransactions,
          paidTransactions,
          pendingTransactions,
          totalRevenue,
          pendingRevenue,
          totalConsultations,
          pendingConsultations,
          totalServiceOrders,
          activeServiceOrders,
        },
        peduliMahreen: {
          totalDonations: totalDonationRecords,
          paidDonations: paidDonationRecords,
          totalRaised: donationRaised,
          totalDisbursed: donationDisbursed,
          disbursedPercentage:
            donationRaised > 0 ? Math.round((donationDisbursed / donationRaised) * 100) : 0,
          activeCampaigns,
          totalCampaigns,
        },
        csr: {
          totalPrograms: totalCsrPrograms,
          activePrograms: activeCsrPrograms,
          totalApplications: totalCsrApplications,
          pendingApplications: pendingCsrApplications,
        },
        internship: {
          totalApplications: totalInternApplications,
          pendingApplications: pendingInternApplications,
          acceptedApplications: acceptedInternApplications,
          totalBatches,
          openBatches,
        },
        verification: {
          totalCertificates,
          issued: issuedCertificates,
          revoked: revokedCertificates,
          totalVerifications,
        },
        analytics: {
          totalEvents: analyticsEvents,
        },
      };
    });

    sendSuccess(res, result);
  }),
);

/**
 * GET /api/admin/overview/revenue-monthly
 * Seri pendapatan bulanan dari transaksi berstatus PAID.
 */
router.get(
  '/revenue-monthly',
  asyncHandler(async (req, res) => {
    const months = Math.min(Math.max(Number.parseInt(req.query.months, 10) || 12, 1), 36);
    const transactions = await monthlySeries(
      'transactions',
      'created_at',
      'COALESCE(SUM(amount), 0)',
      months,
      " WHERE UPPER(status) = 'PAID'",
    );
    const donations = await monthlySeries(
      'donations',
      'created_at',
      'COALESCE(SUM(amount), 0)',
      months,
      " WHERE LOWER(payment_status) = 'paid'",
    );

    sendSuccess(res, { transactions, donations });
  }),
);

/**
 * GET /api/admin/overview/revenue-by-service
 * Distribusi pendapatan per layanan.
 */
router.get(
  '/revenue-by-service',
  asyncHandler(async (req, res) => {
    const rows = await runQuery(
      `SELECT COALESCE(NULLIF(service, ''), 'Lainnya') AS service,
              COUNT(*) AS transaction_count,
              COALESCE(SUM(amount), 0) AS total_amount
       FROM transactions
       WHERE UPPER(status) = 'PAID'
       GROUP BY service
       ORDER BY total_amount DESC`,
    );

    const total = rows.reduce((sum, row) => sum + Number(row.total_amount), 0);

    sendSuccess(
      res,
      rows.map((row) => ({
        service: row.service,
        transactionCount: Number(row.transaction_count),
        totalAmount: Number(row.total_amount),
        percentage: total > 0 ? Math.round((Number(row.total_amount) / total) * 100) : 0,
      })),
    );
  }),
);

/**
 * GET /api/admin/overview/recent-transactions
 */
router.get(
  '/recent-transactions',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 8, 1), 50);
    const rows = await runQuery(
      `SELECT id, invoice_id, client_name, client_email, service, amount, status, due_date, paid_at, created_at
       FROM transactions ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    sendSuccess(res, rows);
  }),
);

/**
 * GET /api/admin/overview/activities
 */
router.get(
  '/activities',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 100);
    const rows = await runQuery(
      `SELECT id, type, title, description, metadata, created_at
       FROM system_activities ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    sendSuccess(res, rows);
  }),
);

/**
 * GET /api/admin/overview/audit-logs
 */
router.get(
  '/audit-logs',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 200);
    const rows = await runQuery(
      `SELECT id, admin_id, admin_name, action, resource, resource_id, summary, created_at
       FROM admin_audit_logs ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    sendSuccess(res, rows);
  }),
);

/**
 * GET /api/admin/overview/pending-queue
 * Semua item yang menunggu tindakan admin.
 */
router.get(
  '/pending-queue',
  asyncHandler(async (req, res) => {
    const [consultations, internships, csr, donations, transactions, articles] = await Promise.all([
      runQuery(
        `SELECT id, full_name AS name, email, service_interest AS detail, created_at
         FROM consultations WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, full_name AS name, email, specialization AS detail, created_at
         FROM internship_applications WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, full_name AS name, email, role AS detail, created_at
         FROM csr_applications WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, donor_name AS name, donor_email AS email, campaign AS detail, created_at
         FROM donations WHERE LOWER(payment_status) = 'pending' ORDER BY created_at DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, client_name AS name, client_email AS email, invoice_id AS detail, created_at
         FROM transactions WHERE UPPER(status) = 'PENDING' ORDER BY created_at DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, title AS name, primary_author AS email, status AS detail, created_at
         FROM articles WHERE status IN ('draft','under_review','scheduled') ORDER BY created_at DESC LIMIT 5`,
      ),
    ]);

    sendSuccess(res, {
      consultations,
      internships,
      csr,
      donations,
      transactions,
      articles,
    });
  }),
);

/**
 * GET /api/admin/overview/growth
 * Pertumbuhan periode berjalan vs periode sebelumnya (default 30 hari).
 */
router.get(
  '/growth',
  asyncHandler(async (req, res) => {
    const days = Math.min(Math.max(Number.parseInt(req.query.days, 10) || 30, 1), 365);

    const buildGrowth = async (table, dateColumn, extraWhere = '') => {
      const where = extraWhere ? ` AND ${extraWhere}` : '';
      const current = await runSingle(
        `SELECT COUNT(*) AS count FROM \`${table}\`
         WHERE ${dateColumn} >= DATE_SUB(NOW(), INTERVAL ? DAY)${where}`,
        [days],
      );
      const previous = await runSingle(
        `SELECT COUNT(*) AS count FROM \`${table}\`
         WHERE ${dateColumn} >= DATE_SUB(NOW(), INTERVAL ? DAY)
           AND ${dateColumn} < DATE_SUB(NOW(), INTERVAL ? DAY)${where}`,
        [days * 2, days],
      );

      const currentCount = current ? Number(current.count) : 0;
      const previousCount = previous ? Number(previous.count) : 0;
      const changePercentage =
        previousCount > 0
          ? Number((((currentCount - previousCount) / previousCount) * 100).toFixed(1))
          : currentCount > 0
            ? 100
            : 0;

      return { current: currentCount, previous: previousCount, changePercentage };
    };

    const [users, articles, transactions, donations, consultations, internships] =
      await Promise.all([
        buildGrowth('users', 'created_at'),
        buildGrowth('articles', 'created_at'),
        buildGrowth('transactions', 'created_at'),
        buildGrowth('donations', 'created_at'),
        buildGrowth('consultations', 'created_at'),
        buildGrowth('internship_applications', 'created_at'),
      ]);

    sendSuccess(res, {
      periodDays: days,
      users,
      articles,
      transactions,
      donations,
      consultations,
      internships,
    });
  }),
);

module.exports = router;
