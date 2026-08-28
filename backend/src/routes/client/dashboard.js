const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const logger = require('../../utils/logger');

/**
 * Seluruh endpoint client dashboard hanya bisa diakses oleh client dan intern.
 * Admin dan superadmin tidak boleh mengakses portal client.
 */
router.use(authenticate, authorize('client', 'intern'));

/**
 * GET /api/client/dashboard
 * Endpoint aggregated — mengembalikan seluruh data dashboard sekaligus
 * sesuai kontrak DashboardLocalData frontend.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const [
      activeProjects,
      totalOrders,
      ongoingOrders,
      totalDonations,
      totalDonated,
      totalCertificates,
      issuedCertificates,
      recentOrders,
      recentCertificates,
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
      runQuery(
        `SELECT id, invoice_id, service_key, tier, client_name, total_price, status, created_at FROM service_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
        [userId],
      ),
      runQuery(
        `SELECT id, certificate_number, program_name, program_type, issued_at FROM certificates WHERE user_id = ? AND status = 'issued' ORDER BY issued_at DESC LIMIT 5`,
        [userId],
      ),
    ]);

    const completionItems = [
      { label: 'Email & nomor HP', complete: Boolean(req.user.email), pending: !req.user.email },
      { label: 'Foto profil & tanggal lahir', complete: false, pending: true },
      { label: 'Alamat resmi', complete: false, pending: true },
      { label: 'Profil pekerjaan / institusi', complete: false, pending: true },
      { label: 'LinkedIn atau portofolio', complete: false, pending: true },
    ];
    const completionPercentage = Math.round(
      (completionItems.filter((i) => i.complete).length / completionItems.length) * 100,
    );

    const metrics = [
      {
        label: 'Active Projects',
        value: String(activeProjects?.count || 0),
        note: 'Proyek aktif',
        icon: 'projects',
        href: '/akun/projects',
      },
      {
        label: 'Total Orders',
        value: String(totalOrders?.count || 0),
        note: 'Total pesanan',
        icon: 'orders',
        href: '/akun/orders',
      },
      {
        label: 'Impact Donations',
        value: `Rp ${(totalDonated?.total || 0).toLocaleString('id-ID')}`,
        note: `${totalDonations?.count || 0} donasi`,
        icon: 'donations',
        href: '/peduli-mahreen/donasi',
        compact: true,
      },
      {
        label: 'Certificates',
        value: String(totalCertificates?.count || 0),
        note: issuedCertificates?.count
          ? `${issuedCertificates.count} terverifikasi`
          : 'Menunggu verifikasi',
        icon: 'certificates',
        href: '/newsroom/verifikasi-dokumen',
      },
    ];

    const projects = (recentOrders || []).map((order) => ({
      id: `service:${order.id}`,
      title: order.tier || order.service_key || 'Layanan',
      description: `Pesanan ${order.service_key}`,
      progress: order.status === 'completed' ? 100 : order.status === 'in_progress' ? 50 : 10,
      status: order.status || 'pending',
      extraMembers: 0,
      memberNames: [req.user.fullName || req.user.email, 'Mahreen Indonesia'],
      clientName: order.client_name || req.user.fullName,
      company: '',
      serviceCategory: order.service_key || 'Digital Service',
      budget: order.total_price || 0,
      href: '/tanya-mahreen/pembayaran',
      updatedAt: order.created_at,
    }));

    const activities = [];
    (recentCertificates || []).forEach((cert) => {
      activities.push({
        title: 'Sertifikat Diterbitkan',
        description: `${cert.program_name} (${cert.program_type})`,
        time: cert.issued_at,
        icon: 'certificate',
        href: '/newsroom/verifikasi-dokumen',
      });
    });
    (recentOrders || []).forEach((order) => {
      activities.push({
        title: order.status === 'completed' ? 'Pesanan Selesai' : 'Pesanan Baru',
        description: `${order.invoice_id} · ${order.service_key}`,
        time: order.created_at,
        icon: 'payment',
        href: '/tanya-mahreen/pembayaran',
      });
    });
    if (activities.length === 0) {
      activities.push({
        title: 'Dashboard siap digunakan',
        description: 'Aktivitas akan muncul di sini.',
        time: 'Baru saja',
        icon: 'milestone',
        href: '/tanya-mahreen',
      });
    }

    sendSuccess(res, {
      completionItems,
      completionPercentage,
      metrics,
      projects,
      activities: activities.slice(0, 3),
      order: null,
      scheduleEntries: [],
    });
  } catch (error) {
    logger.error(error, 'client-dashboard');
    sendError(res, 'Gagal mengambil data dashboard', 500);
  }
});

/**
 * GET /api/client/dashboard/stats
 * Agregat stats untuk user yang login: projects, orders, donations, certificates.
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const [
      activeProjects,
      totalOrders,
      ongoingOrders,
      totalDonations,
      totalDonated,
      totalCertificates,
      issuedCertificates,
    ] = await Promise.all([
      // Active projects = service_orders with status pending/in_progress
      runSingle(
        `SELECT COUNT(*) AS count FROM service_orders
           WHERE user_id = ? AND status IN ('pending','in_progress')`,
        [userId],
      ),
      // Total orders (all time)
      runSingle(`SELECT COUNT(*) AS count FROM service_orders WHERE user_id = ?`, [userId]),
      // Ongoing order detail (latest in_progress or pending)
      runSingle(
        `SELECT id, service_key, tier, client_name, total_price, status, invoice_id, created_at
           FROM service_orders
           WHERE user_id = ? AND status IN ('pending','in_progress')
           ORDER BY created_at DESC LIMIT 1`,
        [userId],
      ),
      // Total donations by user
      runSingle(
        `SELECT COUNT(*) AS count FROM donations
           WHERE user_id = ? AND LOWER(payment_status) = 'paid'`,
        [userId],
      ),
      // Total donated amount
      runSingle(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM donations
           WHERE user_id = ? AND LOWER(payment_status) = 'paid'`,
        [userId],
      ),
      // Total certificates
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates
           WHERE user_id = ? AND status = 'issued'`,
        [userId],
      ),
      // Issued certificates (verified)
      runSingle(
        `SELECT COUNT(*) AS count FROM certificates
           WHERE user_id = ? AND status = 'issued' AND verification_count > 0`,
        [userId],
      ),
    ]);

    sendSuccess(res, {
      activeProjects: activeProjects?.count || 0,
      totalOrders: totalOrders?.count || 0,
      ongoingOrder: ongoingOrders || null,
      totalDonations: totalDonations?.count || 0,
      totalDonated: totalDonated?.total || 0,
      totalCertificates: totalCertificates?.count || 0,
      issuedCertificates: issuedCertificates?.count || 0,
    });
  } catch (error) {
    logger.error(error, 'client-dashboard');
    sendError(res, 'Gagal mengambil data dashboard', 500);
  }
});

/**
 * GET /api/client/dashboard/activities
 * Aktivitas terkini untuk user yang login.
 */
router.get('/activities', async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);

    // Aggregate activities from multiple sources
    const [certificates, transactions, orders, consultations] = await Promise.all([
      // Recent certificates
      runQuery(
        `SELECT id, certificate_number, program_name, program_type, issued_at AS created_at
           FROM certificates
           WHERE user_id = ? AND status = 'issued'
           ORDER BY issued_at DESC LIMIT ?`,
        [userId, limit],
      ),
      // Recent transactions
      runQuery(
        `SELECT id, invoice_id AS title, service, amount, status, created_at
           FROM transactions
           WHERE user_id = ?
           ORDER BY created_at DESC LIMIT ?`,
        [userId, limit],
      ),
      // Recent service orders
      runQuery(
        `SELECT id, service_key, tier, status, invoice_id, created_at
           FROM service_orders
           WHERE user_id = ?
           ORDER BY created_at DESC LIMIT ?`,
        [userId, limit],
      ),
      // Recent consultations
      runQuery(
        `SELECT id, service_interest, status, created_at
           FROM consultations
           WHERE user_id = ?
           ORDER BY created_at DESC LIMIT ?`,
        [userId, limit],
      ),
    ]);

    // Merge and normalize into a unified activity feed
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

    // Sort by time descending and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    sendSuccess(res, activities.slice(0, limit));
  } catch (error) {
    logger.error(error, 'client-dashboard');
    sendError(res, 'Gagal mengambil data aktivitas', 500);
  }
});

/**
 * GET /api/client/dashboard/orders
 * Daftar service orders milik user yang login.
 */
router.get('/orders', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

    const orders = await runQuery(
      `SELECT id, invoice_id, service_key, tier, client_name, total_price, status, addons, created_at
         FROM service_orders
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ?`,
      [userId, limit],
    );

    sendSuccess(res, { items: orders });
  } catch (error) {
    logger.error(error, 'client-dashboard');
    sendError(res, 'Gagal mengambil data pesanan', 500);
  }
});

/**
 * GET /api/client/dashboard/certificates
 * Daftar sertifikat milik user yang login.
 */
router.get('/certificates', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

    const certificates = await runQuery(
      `SELECT id, certificate_number, verification_code, program_type, program_name,
                issued_at, expires_at, status, verification_count
         FROM certificates
         WHERE user_id = ?
         ORDER BY issued_at DESC
         LIMIT ?`,
      [userId, limit],
    );

    sendSuccess(res, { items: certificates });
  } catch (error) {
    logger.error(error, 'client-dashboard');
    sendError(res, 'Gagal mengambil data sertifikat', 500);
  }
});

module.exports = router;
