const { sendError } = require('../utils/response');
const { runQuery } = require('../config/database');

/**
 * Seluruh permission yang tersedia di sistem.
 * Setiap permission mewakili satu operasi granular yang bisa diaktifkan
 * untuk role atau user tertentu.
 */
const ALL_PERMISSIONS = [
  // Users
  'users.create',
  'users.read',
  'users.update',
  'users.delete',
  'users.manage_status',
  'users.manage_role',

  // Newsroom: Articles
  'articles.create',
  'articles.read',
  'articles.update',
  'articles.delete',
  'articles.manage_status',

  // Newsroom: Topics
  'topics.manage',

  // Newsroom: Webinars
  'webinars.manage',

  // Newsroom: Events
  'events.manage',

  // Tanya Mahreen: Consultations
  'consultations.manage',

  // Tanya Mahreen: Orders
  'orders.manage',

  // Tanya Mahreen: Transactions
  'transactions.manage',

  // Tanya Mahreen: Packages
  'packages.manage',

  // Peduli Mahreen: Campaigns
  'campaigns.create',
  'campaigns.read',
  'campaigns.update',
  'campaigns.delete',
  'campaigns.disburse',

  // Peduli Mahreen: Donations
  'donations.manage',

  // CSR
  'csr_programs.manage',
  'csr_pillars.manage',
  'csr_applications.manage',

  // Studio
  'products.manage',
  'portfolios.manage',
  'collections.manage',
  'specializations.manage',

  // Internship
  'batches.manage',
  'intern_applications.manage',

  // Verification
  'certificates.manage',
  'certificates.issue',
  'certificates.revoke',
  'verification_logs.read',

  // Analytics & Overview
  'view_analytics',
  'view_overview',
  'view_audit_logs',

  // Engagement (contact inquiries & support tickets)
  'contact_inquiries.manage',
  'support_tickets.manage',

  // System Reports (superadmin only)
  'system_reports.read',
];

const ALL_PERMISSIONS_SET = new Set(ALL_PERMISSIONS);

/**
 * Default permissions per role.
 * Superadmin selalu mendapat ALL_PERMISSIONS (bypass).
 */
const ROLE_DEFAULTS = {
  superadmin: [...ALL_PERMISSIONS],
  admin: ALL_PERMISSIONS.filter((p) => p !== 'users.manage_role' && p !== 'system_reports.read'),
  client: ['view_overview'],
  intern: ['view_overview'],
};

/**
 * Menyusun daftar efektif permissions untuk user.
 *
 * - superadmin → ALL_PERMISSIONS (bypass, hardcoded)
 * - client     → ["view_overview"] (hardcoded)
 * - lainnya    → baca dari role_permissions DB + merge user.permissions
 *
 * @param {{ role: string, permissions?: string[] | string | null }} user
 * @returns {Promise<string[]>}
 */
const resolvePermissions = async (user) => {
  if (!user || !user.role) return [];

  // Hardcoded bypass: superadmin dan client tidak berubah.
  if (user.role === 'superadmin') {
    return [...ALL_PERMISSIONS];
  }
  if (user.role === 'client') {
    return ['view_overview'];
  }

  // Coba baca permission dari role_permissions table.
  let defaults;
  try {
    const rows = await runQuery(
      `SELECT rp.permission FROM role_permissions rp
       INNER JOIN roles r ON r.id = rp.role_id
       WHERE r.slug = ?`,
      [user.role],
    );
    defaults = rows.map((r) => r.permission);
  } catch {
    // Fallback ke ROLE_DEFAULTS jika tabel belum siap (misal: migration berjalan).
    defaults = ROLE_DEFAULTS[user.role] || [];
  }

  // Fallback jika role tidak ditemukan di DB.
  if (defaults.length === 0) {
    defaults = ROLE_DEFAULTS[user.role] || [];
  }

  // Kolom permissions di DB bisa berupa JSON array atau string JSON.
  let custom = [];
  if (user.permissions) {
    if (typeof user.permissions === 'string') {
      try {
        const parsed = JSON.parse(user.permissions);
        custom = Array.isArray(parsed) ? parsed : [];
      } catch {
        custom = [];
      }
    } else if (Array.isArray(user.permissions)) {
      custom = user.permissions;
    }
  }

  // Merge: default + custom, lalu filter yang valid.
  const merged = new Set([...defaults, ...custom]);
  return [...merged].filter((p) => ALL_PERMISSIONS_SET.has(p));
};

/**
 * Middleware factory: memastikan user memiliki SEMUA permission yang diminta.
 * Harus dipanggil SETELAH authenticate.
 *
 * @param  {...string} requiredPermissions
 * @returns {Function} Express middleware
 */
const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Akses ditolak. Pengguna tidak terautentikasi.', 401);
    }

    const userPermissions = req.user.permissions || [];

    for (const permission of requiredPermissions) {
      if (!userPermissions.includes(permission)) {
        return sendError(res, `Akses ditolak. Anda tidak memiliki izin: ${permission}.`, 403);
      }
    }

    next();
  };
};

/**
 * Memeriksa apakah user memiliki salah satu dari permission yang diminta.
 * Berguna untuk akses read yang bisa dilakukan dengan beberapa permission berbeda.
 *
 * @param  {...string} anyOfPermissions
 * @returns {Function} Express middleware
 */
const requireAnyPermission = (...anyOfPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Akses ditolak. Pengguna tidak terautentikasi.', 401);
    }

    const userPermissions = req.user.permissions || [];
    const hasAny = anyOfPermissions.some((p) => userPermissions.includes(p));

    if (!hasAny) {
      return sendError(res, `Akses ditolak. Anda tidak memiliki izin yang diperlukan.`, 403);
    }

    next();
  };
};

module.exports = {
  ALL_PERMISSIONS,
  ALL_PERMISSIONS_SET,
  ROLE_DEFAULTS,
  resolvePermissions,
  requirePermission,
  requireAnyPermission,
};
