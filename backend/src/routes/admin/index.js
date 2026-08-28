const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { requireAnyPermission } = require('../../middleware/permissions');
const { sendSuccess, sendError } = require('../../utils/response');
const logger = require('../../utils/logger');

const overviewRoutes = require('./overview');
const usersRoutes = require('./users');
const rolesRoutes = require('./roles');
const newsroomRoutes = require('./newsroom');
const tanyaMahreenRoutes = require('./tanya');
const peduliMahreenRoutes = require('./peduli');
const csrRoutes = require('./csr');
const studioRoutes = require('./studio');
const internshipRoutes = require('./internship');
const verificationRoutes = require('./verification');
const analyticsRoutes = require('./analytics');
const reportsRoutes = require('./reports');
const clientsRoutes = require('./clients');
const operationsRoutes = require('./operations');
const { contactRouter, supportRouter } = require('./engagement');

/**
 * Seluruh endpoint di bawah /api/admin wajib token valid dengan peran admin atau superadmin.
 */
router.use(authenticate, authorize('admin', 'superadmin'));

router.get('/', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      scope: 'admin',
      admin: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
      },
      modules: [
        { key: 'dashboard', basePath: '/api/admin/overview' },
        { key: 'users', basePath: '/api/admin/users' },
        { key: 'roles', basePath: '/api/admin/roles' },
        { key: 'newsroom', basePath: '/api/admin/newsroom' },
        { key: 'tanya-mahreen', basePath: '/api/admin/tanya-mahreen' },
        { key: 'peduli-mahreen', basePath: '/api/admin/peduli-mahreen' },
        { key: 'csr', basePath: '/api/admin/csr' },
        { key: 'studio', basePath: '/api/admin/studio' },
        { key: 'internship', basePath: '/api/admin/internship' },
        { key: 'verification', basePath: '/api/admin/verification' },
        { key: 'analytics', basePath: '/api/admin/analytics' },
        { key: 'reports', basePath: '/api/admin/reports' },
        { key: 'operations', basePath: '/api/admin/operations' },
      ],
      permissions: req.user.permissions || [],
    },
  });
});

/**
 * Permission checks per route group.
 * Superadmin selalu lolos karena ALL_PERMISSIONS.
 * Admin hanya bisa mengakses modul yang punya minimal satu permission aktif.
 *
 * Contoh: admin tanpa users.read akan dapat 403 saat buka /api/admin/users.
 *         Admin dengan users.read tapi tanpa users.create bisa baca tapi tidak bisa buat user baru.
 */
router.use('/overview', requireAnyPermission('view_overview', 'view_audit_logs'), overviewRoutes);
router.use(
  '/users',
  requireAnyPermission(
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'users.manage_status',
    'users.manage_role',
  ),
  usersRoutes,
);
router.use('/roles', requireAnyPermission('users.read'), rolesRoutes);
router.use(
  '/newsroom',
  requireAnyPermission(
    'articles.create',
    'articles.read',
    'articles.update',
    'articles.delete',
    'articles.manage_status',
    'topics.manage',
    'webinars.manage',
    'events.manage',
  ),
  newsroomRoutes,
);
router.use(
  '/tanya-mahreen',
  requireAnyPermission(
    'consultations.manage',
    'orders.manage',
    'transactions.manage',
    'packages.manage',
  ),
  tanyaMahreenRoutes,
);
router.use(
  '/peduli-mahreen',
  requireAnyPermission(
    'campaigns.create',
    'campaigns.read',
    'campaigns.update',
    'campaigns.delete',
    'campaigns.disburse',
    'donations.manage',
  ),
  peduliMahreenRoutes,
);
router.use(
  '/csr',
  requireAnyPermission('csr_programs.manage', 'csr_pillars.manage', 'csr_applications.manage'),
  csrRoutes,
);
router.use(
  '/studio',
  requireAnyPermission(
    'products.manage',
    'portfolios.manage',
    'collections.manage',
    'specializations.manage',
  ),
  studioRoutes,
);
router.use(
  '/internship',
  requireAnyPermission('batches.manage', 'intern_applications.manage'),
  internshipRoutes,
);
router.use(
  '/verification',
  requireAnyPermission(
    'certificates.manage',
    'certificates.issue',
    'certificates.revoke',
    'verification_logs.read',
  ),
  verificationRoutes,
);
router.use('/analytics', requireAnyPermission('view_analytics'), analyticsRoutes);
router.use('/reports', requireAnyPermission('system_reports.read'), reportsRoutes);
router.use('/clients', requireAnyPermission('users.read'), clientsRoutes);
router.use(
  '/operations',
  requireAnyPermission('view_overview', 'view_audit_logs'),
  operationsRoutes,
);
router.use('/contact-inquiries', requireAnyPermission('contact_inquiries.manage'), contactRouter);
router.use('/support-tickets', requireAnyPermission('support_tickets.manage'), supportRouter);

router.use((req, res) => {
  sendError(res, 'Endpoint admin tidak ditemukan.', 404);
});

router.use((err, req, res, _next) => {
  logger.error(err, 'admin');
  sendError(res, 'Terjadi kesalahan pada modul admin.', 500);
});

module.exports = router;
