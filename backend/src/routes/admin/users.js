const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
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
  logAdminAction,
  recordActivity,
  countWhere,
  groupCount,
  collectDependencies,
  describeDependencies,
  broadcastToUser,
} = require('./_helpers');
const { requirePermission } = require('../../middleware/permissions');
const { ALL_PERMISSIONS } = require('../../middleware/permissions');
const { validatePassword } = require('../../services/passwordPolicy');

const USER_COLUMNS = `id, account_type, full_name, nickname, email, whatsapp, birth_date, gender,
  job_title, institution, linkedin, portfolio, instagram, interests, newsletter, profile_photo,
  role, status, permissions, email_verified, last_login_at, created_at, updated_at`;

const VALID_STATUSES = ['active', 'inactive', 'suspended'];

/**
 * Peran istimewa yang hanya boleh diberikan oleh superadmin.
 * Mencegah admin biasa (yang punya permission users.create/update)
 * mengangkat dirinya atau orang lain menjadi admin/superadmin.
 */
const PRIVILEGED_ROLES = ['admin', 'superadmin'];

/** Role selalu valid — tidak perlu validasi karena role sekarang dari tabel roles. */
const getValidRoles = async () => {
  const rows = await runQuery('SELECT slug FROM roles');
  return rows.map((r) => r.slug);
};

/**
 * Memeriksa apakah pengguna saat ini boleh memberikan peran tertentu.
 * Hanya superadmin yang boleh menetapkan peran istimewa.
 * @returns {string|null} pesan error bila ditolak, atau null bila diizinkan.
 */
const checkRoleAssignment = (requesterRole, targetRole) => {
  if (!targetRole) return null;
  if (PRIVILEGED_ROLES.includes(targetRole) && requesterRole !== 'superadmin') {
    return 'Hanya superadmin yang dapat menetapkan peran admin atau superadmin.';
  }
  return null;
};

/**
 * GET /api/admin/users
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'users',
      query: req.query,
      columns: USER_COLUMNS,
      filters: [
        { param: 'role', column: 'role' },
        { param: 'status', column: 'status' },
        { param: 'accountType', column: 'account_type' },
        {
          param: 'search',
          type: 'search',
          columns: ['full_name', 'email', 'institution', 'whatsapp'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'full_name', 'email', 'role', 'status', 'last_login_at'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

/**
 * GET /api/admin/users/stats
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      total,
      active,
      inactive,
      suspended,
      verified,
      roleBreakdown,
      accountTypeBreakdown,
      monthlyGrowth,
      recent,
    ] = await Promise.all([
      countWhere('users'),
      countWhere('users', " WHERE status = 'active'"),
      countWhere('users', " WHERE status = 'inactive'"),
      countWhere('users', " WHERE status = 'suspended'"),
      countWhere('users', ' WHERE email_verified = 1'),
      groupCount('users', 'role'),
      groupCount('users', 'account_type'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
           FROM users GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT id, full_name, email, role, status, created_at
           FROM users ORDER BY created_at DESC LIMIT 5`,
      ),
    ]);

    sendSuccess(res, {
      total,
      active,
      inactive,
      suspended,
      verified,
      roleBreakdown: roleBreakdown.map((r) => ({ role: r.label, count: Number(r.count) })),
      accountTypeBreakdown: accountTypeBreakdown.map((r) => ({
        accountType: r.label,
        count: Number(r.count),
      })),
      monthlyGrowth: monthlyGrowth.map((r) => ({ month: r.month, count: Number(r.count) })),
      recentUsers: recent,
    });
  }),
);

/**
 * GET /api/admin/users/permissions/all
 * Seluruh permission keys yang tersedia di sistem.
 * HARUS didefinisikan SEBELUM /:id agar tidak tertangkap param wildcard.
 */
router.get(
  '/permissions/all',
  requirePermission('users.manage_role'),
  asyncHandler(async (req, res) => {
    sendSuccess(res, ALL_PERMISSIONS);
  }),
);

/**
 * GET /api/admin/users/:id
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = await findRow('users', req.params.id, USER_COLUMNS);
    if (!user) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    const [transactions, donations, consultations, internships, certificates, orders] =
      await Promise.all([
        runQuery(
          `SELECT id, invoice_id, service, amount, status, created_at FROM transactions
         WHERE user_id = ? OR client_email = ? ORDER BY created_at DESC LIMIT 10`,
          [user.id, user.email],
        ),
        runQuery(
          `SELECT id, amount, campaign, payment_status, created_at FROM donations
         WHERE user_id = ? OR donor_email = ? ORDER BY created_at DESC LIMIT 10`,
          [user.id, user.email],
        ),
        runQuery(
          `SELECT id, service_interest, status, created_at FROM consultations
         WHERE user_id = ? OR email = ? ORDER BY created_at DESC LIMIT 10`,
          [user.id, user.email],
        ),
        runQuery(
          `SELECT id, specialization, status, created_at FROM internship_applications
         WHERE user_id = ? OR email = ? ORDER BY created_at DESC LIMIT 10`,
          [user.id, user.email],
        ),
        runQuery(
          `SELECT id, certificate_number, program_name, status, issued_at FROM certificates
         WHERE user_id = ? OR recipient_email = ? ORDER BY created_at DESC LIMIT 10`,
          [user.id, user.email],
        ),
        runQuery(
          `SELECT id, invoice_id, service_key, tier, total_price, status, created_at FROM service_orders
         WHERE user_id = ? OR client_email = ? ORDER BY created_at DESC LIMIT 10`,
          [user.id, user.email],
        ),
      ]);

    sendSuccess(res, {
      ...user,
      relations: {
        transactions,
        donations,
        consultations,
        internships,
        certificates,
        serviceOrders: orders,
      },
    });
  }),
);

/**
 * POST /api/admin/users
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['fullName', 'email', 'password']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const { fullName, email, password, role = 'client', status = 'active' } = req.body;

    const validRoles = await getValidRoles();
    if (!validRoles.includes(role)) return sendError(res, 'Peran tidak valid.', 400);
    if (!VALID_STATUSES.includes(status)) return sendError(res, 'Status tidak valid.', 400);
    const roleErr = checkRoleAssignment(req.user?.role, role);
    if (roleErr) return sendError(res, roleErr, 403);
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return sendError(res, pwCheck.message, 400);

    const existing = await runSingle('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return sendError(res, 'Email sudah terdaftar.', 409);

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(String(password), salt);
    const id = uuidv4();
    const now = nowIso();

    await insertRow('users', {
      id,
      account_type: req.body.accountType || 'individual',
      full_name: fullName,
      nickname: req.body.nickname || '',
      email,
      whatsapp: req.body.whatsapp || '',
      password: hashed,
      birth_date: req.body.birthDate || '',
      gender: req.body.gender || '',
      job_title: req.body.jobTitle || '',
      institution: req.body.institution || '',
      linkedin: req.body.linkedin || '',
      portfolio: req.body.portfolio || '',
      instagram: req.body.instagram || '',
      interests: JSON.stringify(req.body.interests || []),
      newsletter: req.body.newsletter ? 1 : 0,
      profile_photo: req.body.profilePhoto || '',
      role,
      status,
      permissions: req.body.permissions ? JSON.stringify(req.body.permissions) : null,
      email_verified: req.body.emailVerified ? 1 : 0,
      last_login_at: '',
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'users',
      resourceId: id,
      summary: `Membuat pengguna ${fullName} (${role})`,
    });
    await recordActivity({
      type: 'user_created',
      title: 'Pengguna baru dibuat admin',
      description: `${fullName} terdaftar dengan peran ${role}.`,
    });

    const created = await findRow('users', id, USER_COLUMNS);
    sendSuccess(res, created, 201);
  }),
);

/**
 * PUT /api/admin/users/:id
 */
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('users', req.params.id, 'id, email, full_name, role');
    if (!existing) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    if (req.body.role) {
      const validRoles = await getValidRoles();
      if (!validRoles.includes(req.body.role)) {
        return sendError(res, 'Peran tidak valid.', 400);
      }
      const roleErr = checkRoleAssignment(req.user?.role, req.body.role);
      if (roleErr) return sendError(res, roleErr, 403);
    }
    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status tidak valid.', 400);
    }

    if (req.body.email && req.body.email !== existing.email) {
      const duplicate = await runSingle('SELECT id FROM users WHERE email = ? AND id != ?', [
        req.body.email,
        req.params.id,
      ]);
      if (duplicate) return sendError(res, 'Email sudah digunakan pengguna lain.', 409);
    }

    if (existing.role === 'admin' && req.body.role && req.body.role !== 'admin') {
      const adminCount = await countWhere('users', " WHERE role = 'admin'");
      if (adminCount <= 1)
        return sendError(res, 'Tidak dapat menurunkan peran admin terakhir.', 400);
    }

    const payload = pickDefined(req.body, {
      account_type: 'accountType',
      full_name: 'fullName',
      nickname: 'nickname',
      email: 'email',
      whatsapp: 'whatsapp',
      birth_date: 'birthDate',
      gender: 'gender',
      job_title: 'jobTitle',
      institution: 'institution',
      linkedin: 'linkedin',
      portfolio: 'portfolio',
      instagram: 'instagram',
      interests: { key: 'interests', transform: (v) => JSON.stringify(v || []) },
      newsletter: { key: 'newsletter', transform: (v) => (v ? 1 : 0) },
      profile_photo: 'profilePhoto',
      role: 'role',
      status: 'status',
      permissions: { key: 'permissions', transform: (v) => (v ? JSON.stringify(v) : null) },
      email_verified: { key: 'emailVerified', transform: (v) => (v ? 1 : 0) },
    });

    if (req.body.password) {
      const pwCheck2 = validatePassword(req.body.password);
      if (!pwCheck2.valid) return sendError(res, pwCheck2.message, 400);
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(String(req.body.password), salt);
    }

    payload.updated_at = nowIso();
    await updateRow('users', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'users',
      resourceId: req.params.id,
      summary: `Memperbarui pengguna ${existing.full_name}`,
    });

    broadcastToUser(req.params.id, 'notification', {
      type: 'user_update',
      resourceId: req.params.id,
      action: 'updated',
      message: `Profil Anda telah diperbarui oleh admin.`,
    }, 'all');

    const updated = await findRow('users', req.params.id, USER_COLUMNS);
    sendSuccess(res, updated);
  }),
);

/**
 * PATCH /api/admin/users/:id/status
 */
router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) return sendError(res, 'Status tidak valid.', 400);

    const existing = await findRow('users', req.params.id, 'id, full_name, role');
    if (!existing) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    if (existing.role === 'superadmin') {
      return sendError(res, 'Tidak dapat mengubah status akun superadmin.', 403);
    }

    if (existing.role === 'admin' && status !== 'active') {
      const activeAdmins = await countWhere('users', " WHERE role = 'admin' AND status = 'active'");
      if (activeAdmins <= 1)
        return sendError(res, 'Tidak dapat menonaktifkan admin aktif terakhir.', 400);
    }

    await updateRow('users', req.params.id, { status, updated_at: nowIso() });
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'users',
      resourceId: req.params.id,
      summary: `Mengubah status ${existing.full_name} menjadi ${status}`,
    });

    broadcastToUser(req.params.id, 'notification', {
      type: 'user_status_update',
      resourceId: req.params.id,
      action: 'updated',
        message: `Status akun Anda diubah menjadi ${status}.`,
    }, 'all');

    sendSuccess(res, { id: req.params.id, status });
  }),
);

/**
 * PATCH /api/admin/users/:id/role
 */
router.patch(
  '/:id/role',
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    const validRoles = await getValidRoles();
    if (!validRoles.includes(role)) return sendError(res, 'Peran tidak valid.', 400);

    const existing = await findRow('users', req.params.id, 'id, full_name, role');
    if (!existing) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    if (existing.role === 'superadmin') {
      return sendError(res, 'Tidak dapat mengubah peran akun superadmin.', 403);
    }

    // Menetapkan peran istimewa, atau mengubah peran akun admin, hanya boleh superadmin.
    const roleErr =
      checkRoleAssignment(req.user?.role, role) ||
      (PRIVILEGED_ROLES.includes(existing.role) && req.user?.role !== 'superadmin'
        ? 'Hanya superadmin yang dapat mengubah peran akun admin.'
        : null);
    if (roleErr) return sendError(res, roleErr, 403);

    if (existing.role === 'admin' && role !== 'admin') {
      const adminCount = await countWhere('users', " WHERE role = 'admin'");
      if (adminCount <= 1)
        return sendError(res, 'Tidak dapat menurunkan peran admin terakhir.', 400);
    }

    await updateRow('users', req.params.id, { role, updated_at: nowIso() });
    await logAdminAction(req, {
      action: 'update_role',
      resource: 'users',
      resourceId: req.params.id,
      summary: `Mengubah peran ${existing.full_name} menjadi ${role}`,
    });

    broadcastToUser(req.params.id, 'notification', {
      type: 'user_role_update',
      resourceId: req.params.id,
      action: 'updated',
        message: `Peran Anda diubah menjadi ${role}.`,
    }, 'all');

    sendSuccess(res, { id: req.params.id, role });
  }),
);

/**
 * Relasi yang mereferensikan users.id.
 * Seluruh relasi memakai ON DELETE SET NULL sehingga data historis tetap ada,
 * namun kaitannya dengan pengguna akan terputus.
 */
const USER_DEPENDENCIES = [
  { table: 'transactions', column: 'user_id', label: 'transaksi' },
  { table: 'donations', column: 'user_id', label: 'donasi' },
  { table: 'consultations', column: 'user_id', label: 'konsultasi' },
  { table: 'service_orders', column: 'user_id', label: 'pesanan layanan' },
  { table: 'internship_applications', column: 'user_id', label: 'pendaftaran magang' },
  { table: 'csr_applications', column: 'user_id', label: 'pendaftaran CSR' },
  { table: 'certificates', column: 'user_id', label: 'sertifikat' },
];

/**
 * GET /api/admin/users/:id/dependencies
 * Menampilkan data terkait sebelum admin memutuskan menghapus pengguna.
 */
router.get(
  '/:id/dependencies',
  asyncHandler(async (req, res) => {
    const existing = await findRow('users', req.params.id, 'id, full_name, role');
    if (!existing) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    const dependencies = await collectDependencies(req.params.id, USER_DEPENDENCIES);

    sendSuccess(res, {
      id: existing.id,
      fullName: existing.full_name,
      dependencies,
      totalRelatedRecords: dependencies.reduce((sum, item) => sum + item.count, 0),
      summary: dependencies.length > 0 ? describeDependencies(dependencies) : '',
    });
  }),
);

/**
 * DELETE /api/admin/users/:id
 *
 * Penghapusan menolak permintaan bila pengguna masih memiliki data terkait,
 * kecuali admin mengirim query `?force=true` untuk konfirmasi eksplisit.
 */
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('users', req.params.id, 'id, full_name, role');
    if (!existing) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    if (req.user?.id === req.params.id) {
      return sendError(res, 'Tidak dapat menghapus akun yang sedang digunakan.', 400);
    }

    if (existing.role === 'superadmin') {
      return sendError(res, 'Tidak dapat menghapus akun superadmin.', 403);
    }

    if (existing.role === 'admin') {
      const adminCount = await countWhere('users', " WHERE role = 'admin'");
      if (adminCount <= 1) return sendError(res, 'Tidak dapat menghapus admin terakhir.', 400);
    }

    const dependencies = await collectDependencies(req.params.id, USER_DEPENDENCIES);
    const force = String(req.query.force || '').toLowerCase() === 'true';

    if (dependencies.length > 0 && !force) {
      return sendError(
        res,
        `Pengguna masih memiliki ${describeDependencies(dependencies)}. ` +
          `Data tersebut akan dilepas dari pengguna ini. Kirim ulang dengan ?force=true untuk melanjutkan.`,
        409,
        { dependencies },
      );
    }

    broadcastToUser(req.params.id, 'notification', {
      type: 'user_deleted',
      resourceId: req.params.id,
      action: 'deleted',
      message: `Akun Anda telah dihapus oleh admin.`,
    }, 'all');

    await deleteRow('users', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'users',
      resourceId: req.params.id,
      summary: `Menghapus pengguna ${existing.full_name}`,
      metadata: { forced: force, dependencies },
    });

    sendSuccess(res, {
      id: req.params.id,
      deleted: true,
      detachedRecords: dependencies,
    });
  }),
);

module.exports = router;
