const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { parsePagination, buildFilters, buildSort, asyncHandler } = require('./_helpers');
const logger = require('../../utils/logger');

/**
 * GET /api/admin/clients
 * List semua client dengan aggregate metrics.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req.query, 20);
    const sort = buildSort(req.query, ['created_at', 'full_name', 'email'], 'created_at');

    const filters = buildFilters(
      [
        { param: 'search', type: 'search', columns: ['full_name', 'email', 'nickname'] },
        { param: 'status', type: 'exact', column: 'status' },
      ],
      req.query,
    );

    const whereClause = filters.where || '';
    const filterParams = filters.params || [];

    const countResult = await runSingle(
      `SELECT COUNT(*) AS total FROM users ${whereClause}`,
      filterParams,
    );
    const total = countResult?.total || 0;

    const clients = await runQuery(
      `SELECT u.id, u.full_name, u.email, u.role, u.status, u.created_at, u.last_login_at,
            u.account_type, u.institution, u.job_title,
            (SELECT COUNT(*) FROM service_orders WHERE user_id = u.id) AS total_orders,
            (SELECT COUNT(*) FROM service_orders WHERE user_id = u.id AND status IN ('pending','in_progress')) AS active_projects,
            (SELECT COALESCE(SUM(total_price), 0) FROM service_orders WHERE user_id = u.id AND status = 'completed') AS total_spent,
            (SELECT COUNT(*) FROM donations WHERE user_id = u.id AND LOWER(payment_status) = 'paid') AS total_donations,
            (SELECT COUNT(*) FROM consultations WHERE user_id = u.id) AS total_consultations,
            (SELECT COUNT(*) FROM certificates WHERE user_id = u.id AND status = 'issued') AS total_certificates
     FROM users u
     ${whereClause}
     ORDER BY ${sort}
     LIMIT ? OFFSET ?`,
      [...filterParams, limit, offset],
    );

    sendSuccess(res, {
      items: clients,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),
);

/**
 * GET /api/admin/clients/:id/stats
 * Dashboard stats untuk specific client (mirror client dashboard stats).
 */
router.get(
  '/:id/stats',
  asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await runSingle(
      `SELECT id, full_name, email, role, status, created_at FROM users WHERE id = ?`,
      [userId],
    );
    if (!user) return sendError(res, 'Client tidak ditemukan.', 404);

    const [
      activeProjects,
      totalOrders,
      ongoingOrder,
      totalDonations,
      totalDonated,
      totalCertificates,
      issuedCertificates,
    ] = await Promise.all([
      runSingle(
        `SELECT COUNT(*) AS count FROM service_orders WHERE user_id = ? AND status IN ('pending','in_progress')`,
        [userId],
      ),
      runSingle(`SELECT COUNT(*) AS count FROM service_orders WHERE user_id = ?`, [userId]),
      runSingle(
        `SELECT id, service_key, tier, client_name, total_price, status, invoice_id, created_at FROM service_orders WHERE user_id = ? AND status IN ('pending','in_progress') ORDER BY created_at DESC LIMIT 1`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM donations WHERE user_id = ? AND LOWER(payment_status) = 'paid'`,
        [userId],
      ),
      runSingle(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM donations WHERE user_id = ? AND LOWER(payment_status) = 'paid'`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates WHERE user_id = ? AND status = 'issued'`,
        [userId],
      ),
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates WHERE user_id = ? AND status = 'issued' AND verification_count > 0`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      user,
      activeProjects: activeProjects?.count || 0,
      totalOrders: totalOrders?.count || 0,
      ongoingOrder: ongoingOrder || null,
      totalDonations: totalDonations?.count || 0,
      totalDonated: totalDonated?.total || 0,
      totalCertificates: totalCertificates?.count || 0,
      issuedCertificates: issuedCertificates?.count || 0,
    });
  }),
);

/**
 * GET /api/admin/clients/:id/activity
 * Aktivitas terkini untuk specific client.
 */
router.get(
  '/:id/activity',
  asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);

    const [certificates, transactions, orders, consultations] = await Promise.all([
      runQuery(
        `SELECT id, certificate_number, program_name, program_type, issued_at AS created_at FROM certificates WHERE user_id = ? AND status = 'issued' ORDER BY issued_at DESC LIMIT ?`,
        [userId, limit],
      ),
      runQuery(
        `SELECT id, invoice_id AS title, service, amount, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
        [userId, limit],
      ),
      runQuery(
        `SELECT id, service_key, tier, status, invoice_id, created_at FROM service_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
        [userId, limit],
      ),
      runQuery(
        `SELECT id, service_interest, status, created_at FROM consultations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
        [userId, limit],
      ),
    ]);

    const activities = [];
    for (const cert of certificates) {
      activities.push({
        id: cert.id,
        type: 'certificate',
        title: 'Sertifikat Diterbitkan',
        description: `${cert.program_name} (${cert.program_type})`,
        time: cert.created_at,
        icon: 'certificate',
      });
    }
    for (const tx of transactions) {
      activities.push({
        id: tx.id,
        type: 'payment',
        title:
          String(tx.status).toLowerCase() === 'paid'
            ? 'Pembayaran Berhasil'
            : `Transaksi ${tx.status}`,
        description: `Invoice ${tx.title} untuk ${tx.service || 'layanan'}.`,
        time: tx.created_at,
        icon: 'payment',
      });
    }
    for (const order of orders) {
      activities.push({
        id: order.id,
        type: 'order',
        title: `Pesanan ${order.status === 'in_progress' ? 'Sedang Dikerjakan' : order.status === 'completed' ? 'Selesai' : 'Baru'}`,
        description: `${order.service_key} tier ${order.tier}`,
        time: order.created_at,
        icon: 'milestone',
      });
    }
    for (const consult of consultations) {
      activities.push({
        id: consult.id,
        type: 'consultation',
        title: `Konsultasi ${consult.status === 'completed' ? 'Selesai' : consult.status}`,
        description: consult.service_interest || 'Konsultasi umum',
        time: consult.created_at,
        icon: 'milestone',
      });
    }

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    sendSuccess(res, activities.slice(0, limit));
  }),
);

/**
 * GET /api/admin/clients/:id/orders
 * Service orders untuk specific client.
 */
router.get(
  '/:id/orders',
  asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { limit, offset } = parsePagination(req.query, 20);

    const orders = await runQuery(
      `SELECT id, invoice_id, service_key, tier, client_name, total_price, status, addons, created_at
     FROM service_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );

    sendSuccess(res, { items: orders });
  }),
);

/**
 * GET /api/admin/clients/:id/certificates
 * Sertifikat untuk specific client.
 */
router.get(
  '/:id/certificates',
  asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { limit, offset } = parsePagination(req.query, 20);

    const certificates = await runQuery(
      `SELECT id, certificate_number, verification_code, program_type, program_name, issued_at, expires_at, status, verification_count
     FROM certificates WHERE user_id = ? ORDER BY issued_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );

    sendSuccess(res, { items: certificates });
  }),
);

/**
 * GET /api/admin/clients/:id/consultations
 * Konsultasi untuk specific client.
 */
router.get(
  '/:id/consultations',
  asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { limit, offset } = parsePagination(req.query, 20);

    const consultations = await runQuery(
      `SELECT id, full_name, email, phone, service_interest, message, status, consultation_type, preferred_date, created_at
     FROM consultations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );

    sendSuccess(res, { items: consultations });
  }),
);

module.exports = router;
