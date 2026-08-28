const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess } = require('../../utils/response');
const { asyncHandler, countWhere, sumColumn, toInt } = require('./_helpers');

const clampDays = (value, fallback = 30) => Math.min(Math.max(toInt(value, fallback), 1), 365);

/* ══════════════════════════ OVERVIEW ══════════════════════════ */

/**
 * GET /api/admin/analytics/overview
 */
router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const days = clampDays(req.query.days);

    const [
      totalEvents,
      periodEvents,
      previousEvents,
      uniqueSessions,
      periodSessions,
      previousSessions,
      articleViews,
      totalUsers,
      periodUsers,
      previousUsers,
      paidRevenue,
      periodRevenue,
      previousRevenue,
      donationRaised,
      conversionSource,
    ] = await Promise.all([
      countWhere('analytics_events'),
      countWhere('analytics_events', ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [
        days,
      ]),
      countWhere(
        'analytics_events',
        ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
        [days * 2, days],
      ),
      runSingle(
        `SELECT COUNT(DISTINCT session_id) AS count FROM analytics_events WHERE session_id != ''`,
      ),
      runSingle(
        `SELECT COUNT(DISTINCT session_id) AS count FROM analytics_events
         WHERE session_id != '' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [days],
      ),
      runSingle(
        `SELECT COUNT(DISTINCT session_id) AS count FROM analytics_events
         WHERE session_id != '' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
           AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [days * 2, days],
      ),
      sumColumn('articles', 'views'),
      countWhere('users'),
      countWhere('users', ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]),
      countWhere(
        'users',
        ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
        [days * 2, days],
      ),
      sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PAID'"),
      sumColumn(
        'transactions',
        'amount',
        " WHERE UPPER(status) = 'PAID' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)",
        [days],
      ),
      sumColumn(
        'transactions',
        'amount',
        ` WHERE UPPER(status) = 'PAID' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
          AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [days * 2, days],
      ),
      sumColumn('donations', 'amount', " WHERE LOWER(payment_status) = 'paid'"),
      runQuery(
        `SELECT CASE
                  WHEN referrer = 'direct' OR referrer = '' THEN 'Direct'
                  WHEN referrer LIKE '%google%' THEN 'Google'
                  WHEN referrer LIKE '%instagram%' THEN 'Instagram'
                  WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
                  WHEN referrer LIKE '%facebook%' THEN 'Facebook'
                  ELSE 'Lainnya'
                END AS source,
                COUNT(*) AS count
         FROM analytics_events
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY source ORDER BY count DESC`,
        [days],
      ),
    ]);

    const change = (current, previous) =>
      previous > 0
        ? Number((((current - previous) / previous) * 100).toFixed(1))
        : current > 0
          ? 100
          : 0;

    const currentSessions = Number(periodSessions?.count || 0);
    const priorSessions = Number(previousSessions?.count || 0);
    const totalSources = conversionSource.reduce((sum, row) => sum + Number(row.count), 0);

    sendSuccess(res, {
      periodDays: days,
      pageViews: {
        total: totalEvents,
        current: periodEvents,
        previous: previousEvents,
        changePercentage: change(periodEvents, previousEvents),
      },
      sessions: {
        total: Number(uniqueSessions?.count || 0),
        current: currentSessions,
        previous: priorSessions,
        changePercentage: change(currentSessions, priorSessions),
      },
      users: {
        total: totalUsers,
        current: periodUsers,
        previous: previousUsers,
        changePercentage: change(periodUsers, previousUsers),
      },
      revenue: {
        total: paidRevenue,
        current: periodRevenue,
        previous: previousRevenue,
        changePercentage: change(periodRevenue, previousRevenue),
      },
      articleViews,
      donationRaised,
      averagePagesPerSession:
        currentSessions > 0 ? Number((periodEvents / currentSessions).toFixed(2)) : 0,
      trafficSources: conversionSource.map((row) => ({
        source: row.source,
        count: Number(row.count),
        percentage: totalSources > 0 ? Math.round((Number(row.count) / totalSources) * 100) : 0,
      })),
    });
  }),
);

/**
 * GET /api/admin/analytics/traffic
 * Seri harian kunjungan dan sesi.
 */
router.get(
  '/traffic',
  asyncHandler(async (req, res) => {
    const days = clampDays(req.query.days);

    const rows = await runQuery(
      `SELECT DATE(created_at) AS date,
              COUNT(*) AS page_views,
              COUNT(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY date ORDER BY date ASC`,
      [days],
    );

    sendSuccess(
      res,
      rows.map((row) => ({
        date:
          row.date instanceof Date
            ? row.date.toISOString().slice(0, 10)
            : String(row.date).slice(0, 10),
        pageViews: Number(row.page_views),
        sessions: Number(row.sessions),
      })),
    );
  }),
);

/**
 * GET /api/admin/analytics/top-pages
 */
router.get(
  '/top-pages',
  asyncHandler(async (req, res) => {
    const days = clampDays(req.query.days);
    const limit = Math.min(Math.max(toInt(req.query.limit, 10), 1), 50);

    const rows = await runQuery(
      `SELECT path, event_category AS category,
              COUNT(*) AS page_views,
              COUNT(DISTINCT session_id) AS unique_sessions
       FROM analytics_events
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY path, event_category
       ORDER BY page_views DESC LIMIT ?`,
      [days, limit],
    );

    const total = await countWhere(
      'analytics_events',
      ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days],
    );

    sendSuccess(
      res,
      rows.map((row) => ({
        path: row.path,
        category: row.category,
        pageViews: Number(row.page_views),
        uniqueSessions: Number(row.unique_sessions),
        percentage: total > 0 ? Number(((Number(row.page_views) / total) * 100).toFixed(1)) : 0,
      })),
    );
  }),
);

/**
 * GET /api/admin/analytics/devices
 */
router.get(
  '/devices',
  asyncHandler(async (req, res) => {
    const days = clampDays(req.query.days);

    const rows = await runQuery(
      `SELECT COALESCE(NULLIF(device, ''), 'unknown') AS device, COUNT(*) AS count
       FROM analytics_events WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY device ORDER BY count DESC`,
      [days],
    );

    const total = rows.reduce((sum, row) => sum + Number(row.count), 0);

    sendSuccess(
      res,
      rows.map((row) => ({
        device: row.device,
        count: Number(row.count),
        percentage: total > 0 ? Math.round((Number(row.count) / total) * 100) : 0,
      })),
    );
  }),
);

/**
 * GET /api/admin/analytics/content-performance
 */
router.get(
  '/content-performance',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(toInt(req.query.limit, 10), 1), 50);

    const [articles, categories, authors] = await Promise.all([
      runQuery(
        `SELECT id, slug, title, category, status, views, primary_author, published_at
         FROM articles WHERE status = 'published' ORDER BY views DESC LIMIT ?`,
        [limit],
      ),
      runQuery(
        `SELECT category, COUNT(*) AS article_count, COALESCE(SUM(views), 0) AS total_views
         FROM articles GROUP BY category ORDER BY total_views DESC`,
      ),
      runQuery(
        `SELECT primary_author AS author, COUNT(*) AS article_count, COALESCE(SUM(views), 0) AS total_views
         FROM articles WHERE primary_author != '' GROUP BY primary_author ORDER BY total_views DESC LIMIT 10`,
      ),
    ]);

    sendSuccess(res, {
      topArticles: articles.map((a) => ({ ...a, views: Number(a.views) })),
      categoryPerformance: categories.map((c) => ({
        category: c.category,
        articleCount: Number(c.article_count),
        totalViews: Number(c.total_views),
        averageViews:
          Number(c.article_count) > 0
            ? Math.round(Number(c.total_views) / Number(c.article_count))
            : 0,
      })),
      authorPerformance: authors.map((a) => ({
        author: a.author,
        articleCount: Number(a.article_count),
        totalViews: Number(a.total_views),
      })),
    });
  }),
);

/**
 * GET /api/admin/analytics/funnel
 * Konversi dari kunjungan sampai transaksi berbayar.
 */
router.get(
  '/funnel',
  asyncHandler(async (req, res) => {
    const days = clampDays(req.query.days);

    const [visits, registrations, consultations, orders, paidTransactions] = await Promise.all([
      runSingle(
        `SELECT COUNT(DISTINCT session_id) AS count FROM analytics_events
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [days],
      ),
      countWhere('users', ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]),
      countWhere('consultations', ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]),
      countWhere('service_orders', ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]),
      countWhere(
        'transactions',
        " WHERE UPPER(status) = 'PAID' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)",
        [days],
      ),
    ]);

    const visitCount = Number(visits?.count || 0);
    const stages = [
      { stage: 'Kunjungan', count: visitCount },
      { stage: 'Registrasi', count: registrations },
      { stage: 'Konsultasi', count: consultations },
      { stage: 'Pesanan', count: orders },
      { stage: 'Transaksi Dibayar', count: paidTransactions },
    ];

    sendSuccess(
      res,
      stages.map((stage, index) => ({
        ...stage,
        conversionFromStart:
          visitCount > 0 ? Number(((stage.count / visitCount) * 100).toFixed(2)) : 0,
        conversionFromPrevious:
          index === 0
            ? 100
            : stages[index - 1].count > 0
              ? Number(((stage.count / stages[index - 1].count) * 100).toFixed(2))
              : 0,
      })),
    );
  }),
);

/**
 * GET /api/admin/analytics/ecosystem
 * Perbandingan performa semua vertikal bisnis.
 */
router.get(
  '/ecosystem',
  asyncHandler(async (req, res) => {
    const [
      transactionRevenue,
      donationRevenue,
      orderValue,
      articleViews,
      productSold,
      internAccepted,
      csrBeneficiaries,
      certificatesIssued,
    ] = await Promise.all([
      sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PAID'"),
      sumColumn('donations', 'amount', " WHERE LOWER(payment_status) = 'paid'"),
      sumColumn('service_orders', 'total_price'),
      sumColumn('articles', 'views'),
      sumColumn('products', 'sold_count'),
      countWhere('internship_applications', " WHERE status = 'accepted'"),
      sumColumn('csr_programs', 'current_beneficiaries'),
      countWhere('certificates', " WHERE status = 'issued'"),
    ]);

    const totalRevenue = transactionRevenue + donationRevenue;

    sendSuccess(res, {
      totalRevenue,
      verticals: [
        {
          key: 'tanya-mahreen',
          label: 'Tanya Mahreen',
          revenue: transactionRevenue,
          revenueShare:
            totalRevenue > 0 ? Math.round((transactionRevenue / totalRevenue) * 100) : 0,
          metricLabel: 'Nilai Pesanan',
          metricValue: orderValue,
        },
        {
          key: 'peduli-mahreen',
          label: 'Peduli Mahreen',
          revenue: donationRevenue,
          revenueShare: totalRevenue > 0 ? Math.round((donationRevenue / totalRevenue) * 100) : 0,
          metricLabel: 'Penerima Manfaat CSR',
          metricValue: csrBeneficiaries,
        },
        {
          key: 'studio',
          label: 'Mahreen Studio',
          revenue: 0,
          revenueShare: 0,
          metricLabel: 'Produk Terjual',
          metricValue: productSold,
        },
        {
          key: 'newsroom',
          label: 'Newsroom',
          revenue: 0,
          revenueShare: 0,
          metricLabel: 'Total Views Artikel',
          metricValue: articleViews,
        },
        {
          key: 'internship',
          label: 'Internship',
          revenue: 0,
          revenueShare: 0,
          metricLabel: 'Peserta Diterima',
          metricValue: internAccepted,
        },
        {
          key: 'verification',
          label: 'Verification',
          revenue: 0,
          revenueShare: 0,
          metricLabel: 'Sertifikat Terbit',
          metricValue: certificatesIssued,
        },
      ],
    });
  }),
);

/**
 * GET /api/admin/analytics/events
 * Daftar mentah event analitik untuk inspeksi.
 */
router.get(
  '/events',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(toInt(req.query.limit, 50), 1), 500);
    const offset = Math.max(toInt(req.query.offset, 0), 0);

    const rows = await runQuery(
      `SELECT id, event_name, event_category, path, referrer, session_id, device, country, created_at
       FROM analytics_events ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    const total = await countWhere('analytics_events');

    sendSuccess(res, {
      items: rows,
      pagination: { total, limit, offset, hasMore: offset + rows.length < total },
    });
  }),
);

module.exports = router;
