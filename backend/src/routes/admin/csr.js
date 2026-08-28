const express = require('express');
const router = express.Router();
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
  sumColumn,
  groupCount,
  collectDependencies,
  describeDependencies,
  broadcastToUser,
} = require('./_helpers');

const PROGRAM_STATUSES = ['draft', 'active', 'paused', 'completed', 'archived'];
const APPLICATION_STATUSES = ['pending', 'reviewed', 'approved', 'rejected'];

/* ══════════════════════════ STATS ══════════════════════════ */

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      totalPrograms,
      activePrograms,
      completedPrograms,
      totalBudget,
      targetBeneficiaries,
      currentBeneficiaries,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalPillars,
      categoryBreakdown,
      roleBreakdown,
      applicationStatusBreakdown,
      monthlyApplications,
      programProgress,
      recentApplications,
    ] = await Promise.all([
      countWhere('csr_programs'),
      countWhere('csr_programs', " WHERE status = 'active'"),
      countWhere('csr_programs', " WHERE status = 'completed'"),
      sumColumn('csr_programs', 'budget'),
      sumColumn('csr_programs', 'target_beneficiaries'),
      sumColumn('csr_programs', 'current_beneficiaries'),
      countWhere('csr_applications'),
      countWhere('csr_applications', " WHERE status = 'pending'"),
      countWhere('csr_applications', " WHERE status = 'approved'"),
      countWhere('csr_applications', " WHERE status = 'rejected'"),
      countWhere('csr_pillars'),
      groupCount('csr_programs', 'category'),
      groupCount('csr_applications', 'role'),
      groupCount('csr_applications', 'status'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM csr_applications GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT id, title, category, progress, target_beneficiaries, current_beneficiaries, status
         FROM csr_programs ORDER BY progress DESC LIMIT 6`,
      ),
      runQuery(
        `SELECT id, full_name, email, role, status, created_at
         FROM csr_applications ORDER BY created_at DESC LIMIT 8`,
      ),
    ]);

    sendSuccess(res, {
      programs: {
        total: totalPrograms,
        active: activePrograms,
        completed: completedPrograms,
        totalBudget,
        targetBeneficiaries,
        currentBeneficiaries,
        beneficiaryAchievementPercentage:
          targetBeneficiaries > 0
            ? Math.round((currentBeneficiaries / targetBeneficiaries) * 100)
            : 0,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
        approvalRate:
          totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0,
      },
      totalPillars,
      categoryBreakdown: categoryBreakdown.map((r) => ({
        category: r.label || 'Lainnya',
        count: Number(r.count),
      })),
      roleBreakdown: roleBreakdown.map((r) => ({
        role: r.label || 'lainnya',
        count: Number(r.count),
      })),
      applicationStatusBreakdown: applicationStatusBreakdown.map((r) => ({
        status: r.label,
        count: Number(r.count),
      })),
      monthlyApplications: monthlyApplications.map((r) => ({
        month: r.month,
        count: Number(r.count),
      })),
      programProgress,
      recentApplications,
    });
  }),
);

/* ══════════════════════════ PROGRAMS ══════════════════════════ */

router.get(
  '/programs',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'csr_programs',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        {
          param: 'search',
          type: 'search',
          columns: ['title', 'description', 'category', 'location'],
        },
      ],
      allowedSort: ['created_at', 'title', 'progress', 'budget', 'status'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/programs/:id',
  asyncHandler(async (req, res) => {
    const program = await findRow('csr_programs', req.params.id);
    if (!program) return sendError(res, 'Program CSR tidak ditemukan.', 404);

    const applications = await runQuery(
      `SELECT id, full_name, email, role, status, created_at FROM csr_applications
       WHERE program_id = ? ORDER BY created_at DESC LIMIT 20`,
      [program.id],
    );

    sendSuccess(res, { ...program, applications });
  }),
);

router.post(
  '/programs',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const status = req.body.status || 'active';
    if (!PROGRAM_STATUSES.includes(status))
      return sendError(res, 'Status program tidak valid.', 400);

    const id = uuidv4();
    const now = nowIso();

    await insertRow('csr_programs', {
      id,
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || '',
      progress: Number(req.body.progress || 0),
      target_beneficiaries: Number(req.body.targetBeneficiaries || 0),
      current_beneficiaries: Number(req.body.currentBeneficiaries || 0),
      status,
      image: req.body.image || '',
      location: req.body.location || '',
      budget: Number(req.body.budget || 0),
      start_date: req.body.startDate || '',
      end_date: req.body.endDate || '',
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'csr_programs',
      resourceId: id,
      summary: `Membuat program CSR ${req.body.title}`,
    });

    sendSuccess(res, await findRow('csr_programs', id), 201);
  }),
);

router.put(
  '/programs/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_programs', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Program CSR tidak ditemukan.', 404);

    if (req.body.status && !PROGRAM_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status program tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      title: 'title',
      description: 'description',
      category: 'category',
      progress: { key: 'progress', transform: (v) => Math.min(100, Math.max(0, Number(v || 0))) },
      target_beneficiaries: { key: 'targetBeneficiaries', transform: (v) => Number(v || 0) },
      current_beneficiaries: { key: 'currentBeneficiaries', transform: (v) => Number(v || 0) },
      status: 'status',
      image: 'image',
      location: 'location',
      budget: { key: 'budget', transform: (v) => Number(v || 0) },
      start_date: 'startDate',
      end_date: 'endDate',
    });

    payload.updated_at = nowIso();
    await updateRow('csr_programs', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'csr_programs',
      resourceId: req.params.id,
      summary: `Memperbarui program CSR ${req.body.title || existing.title}`,
    });

    sendSuccess(res, await findRow('csr_programs', req.params.id));
  }),
);

/**
 * Relasi yang mereferensikan csr_programs.id.
 */
const PROGRAM_DEPENDENCIES = [
  { table: 'csr_applications', column: 'program_id', label: 'pendaftaran CSR' },
];

/**
 * GET /api/admin/csr/programs/:id/dependencies
 */
router.get(
  '/programs/:id/dependencies',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_programs', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Program CSR tidak ditemukan.', 404);

    const dependencies = await collectDependencies(req.params.id, PROGRAM_DEPENDENCIES);

    sendSuccess(res, {
      id: existing.id,
      title: existing.title,
      dependencies,
      totalRelatedRecords: dependencies.reduce((sum, item) => sum + item.count, 0),
      summary: dependencies.length > 0 ? describeDependencies(dependencies) : '',
    });
  }),
);

/**
 * DELETE /api/admin/csr/programs/:id
 *
 * Pendaftaran yang terkait tidak dihapus, hanya dilepas dari program
 * (ON DELETE SET NULL). Konfirmasi eksplisit diperlukan bila masih ada relasi.
 */
router.delete(
  '/programs/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_programs', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Program CSR tidak ditemukan.', 404);

    const dependencies = await collectDependencies(req.params.id, PROGRAM_DEPENDENCIES);
    const force = String(req.query.force || '').toLowerCase() === 'true';

    if (dependencies.length > 0 && !force) {
      return sendError(
        res,
        `Program masih memiliki ${describeDependencies(dependencies)}. ` +
          `Pendaftaran akan dilepas dari program ini. Kirim ulang dengan ?force=true untuk melanjutkan.`,
        409,
        { dependencies },
      );
    }

    await deleteRow('csr_programs', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'csr_programs',
      resourceId: req.params.id,
      summary: `Menghapus program CSR ${existing.title}`,
      metadata: { forced: force, dependencies },
    });

    sendSuccess(res, {
      id: req.params.id,
      deleted: true,
      detachedRecords: dependencies,
    });
  }),
);

/* ══════════════════════════ PILLARS ══════════════════════════ */

router.get(
  '/pillars',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'csr_pillars',
      query: req.query,
      filters: [{ param: 'search', type: 'search', columns: ['title', 'description'] }],
      allowedSort: ['sort_order', 'created_at', 'title'],
      defaultSort: 'sort_order',
      defaultLimit: 50,
    });

    sendSuccess(res, result);
  }),
);

router.post(
  '/pillars',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    await insertRow('csr_pillars', {
      id,
      title: req.body.title,
      description: req.body.description || '',
      icon: req.body.icon || '',
      sort_order: Number(req.body.sortOrder || 0),
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'csr_pillars',
      resourceId: id,
      summary: `Membuat pilar CSR ${req.body.title}`,
    });
    sendSuccess(res, await findRow('csr_pillars', id), 201);
  }),
);

router.put(
  '/pillars/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_pillars', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Pilar CSR tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      title: 'title',
      description: 'description',
      icon: 'icon',
      sort_order: { key: 'sortOrder', transform: (v) => Number(v || 0) },
    });

    await updateRow('csr_pillars', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'csr_pillars',
      resourceId: req.params.id,
      summary: `Memperbarui pilar CSR ${existing.title}`,
    });

    sendSuccess(res, await findRow('csr_pillars', req.params.id));
  }),
);

router.delete(
  '/pillars/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_pillars', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Pilar CSR tidak ditemukan.', 404);

    await deleteRow('csr_pillars', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'csr_pillars',
      resourceId: req.params.id,
      summary: `Menghapus pilar CSR ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ APPLICATIONS ══════════════════════════ */

router.get(
  '/applications',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'csr_applications',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'role', column: 'role' },
        { param: 'programId', column: 'program_id' },
        {
          param: 'search',
          type: 'search',
          columns: ['full_name', 'email', 'institution', 'city', 'phone'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'full_name', 'status', 'role'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const application = await findRow('csr_applications', req.params.id);
    if (!application) return sendError(res, 'Pendaftaran CSR tidak ditemukan.', 404);

    const program = application.program_id
      ? await findRow('csr_programs', application.program_id, 'id, title, category, status')
      : null;

    sendSuccess(res, { ...application, program });
  }),
);

router.post(
  '/applications',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['fullName', 'email']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    await insertRow('csr_applications', {
      id,
      user_id: req.body.userId || null,
      program_id: req.body.programId || null,
      role: req.body.role || 'volunteer',
      full_name: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone || '',
      institution: req.body.institution || '',
      city: req.body.city || '',
      motivation: req.body.motivation || '',
      portfolio_url: req.body.portfolioUrl || '',
      status: req.body.status || 'pending',
      reviewed_by: null,
      reviewed_at: '',
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'csr_applications',
      resourceId: id,
      summary: `Menambah pendaftar CSR ${req.body.fullName}`,
    });

    broadcastToUser(req.body.userId || null, 'notification', {
      type: 'csr_application_created',
      resourceId: id,
      action: 'created',
      message: `Pendaftaran CSR untuk ${req.body.fullName} telah dibuat.`,
    }, 'csr');

    sendSuccess(res, await findRow('csr_applications', id), 201);
  }),
);

router.put(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_applications', req.params.id, 'id, full_name');
    if (!existing) return sendError(res, 'Pendaftaran CSR tidak ditemukan.', 404);

    if (req.body.status && !APPLICATION_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status pendaftaran tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      program_id: 'programId',
      role: 'role',
      full_name: 'fullName',
      email: 'email',
      phone: 'phone',
      institution: 'institution',
      city: 'city',
      motivation: 'motivation',
      portfolio_url: 'portfolioUrl',
      status: 'status',
    });

    if (req.body.status && req.body.status !== 'pending') {
      payload.reviewed_by = req.user?.id || null;
      payload.reviewed_at = nowIso();
    }

    await updateRow('csr_applications', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'csr_applications',
      resourceId: req.params.id,
      summary: `Memperbarui pendaftaran CSR ${existing.full_name}`,
    });

    sendSuccess(res, await findRow('csr_applications', req.params.id));
  }),
);

router.patch(
  '/applications/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!APPLICATION_STATUSES.includes(status))
      return sendError(res, 'Status pendaftaran tidak valid.', 400);

    const existing = await findRow('csr_applications', req.params.id, 'id, full_name, role, user_id');
    if (!existing) return sendError(res, 'Pendaftaran CSR tidak ditemukan.', 404);

    await updateRow('csr_applications', req.params.id, {
      status,
      reviewed_by: req.user?.id || null,
      reviewed_at: nowIso(),
    });

    await logAdminAction(req, {
      action:
        status === 'approved' ? 'approve' : status === 'rejected' ? 'reject' : 'update_status',
      resource: 'csr_applications',
      resourceId: req.params.id,
      summary: `Mengubah status pendaftaran CSR ${existing.full_name} menjadi ${status}`,
    });

    if (status === 'approved') {
      await recordActivity({
        type: 'csr_update',
        title: 'Pendaftar CSR disetujui',
        description: `${existing.full_name} disetujui sebagai ${existing.role}.`,
      });
    }

    if (existing.user_id) {
      broadcastToUser(existing.user_id, 'notification', {
        type: 'csr_application_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Pendaftaran CSR Anda berstatus ${status}.`,
      }, 'csr');
    }

    sendSuccess(res, { id: req.params.id, status });
  }),
);

router.delete(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('csr_applications', req.params.id, 'id, full_name');
    if (!existing) return sendError(res, 'Pendaftaran CSR tidak ditemukan.', 404);

    await deleteRow('csr_applications', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'csr_applications',
      resourceId: req.params.id,
      summary: `Menghapus pendaftaran CSR ${existing.full_name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ OVERVIEW ══════════════════════════ */

router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const [
      totalVolunteers,
      activePrograms,
      currentBeneficiaries,
      totalApplications,
      approvedApplications,
      categoryRows,
      recentApplications,
    ] = await Promise.all([
      runSingle(
        `SELECT COUNT(*) AS count FROM csr_applications WHERE role = 'volunteer' AND status = 'approved'`,
      ),
      countWhere('csr_programs', " WHERE status = 'active'"),
      sumColumn('csr_programs', 'current_beneficiaries'),
      countWhere('csr_applications'),
      countWhere('csr_applications', " WHERE status = 'approved'"),
      groupCount('csr_programs', 'category'),
      runQuery(
        `SELECT a.id, a.full_name, a.role, a.status, a.created_at, p.title AS program_title
         FROM csr_applications a
         LEFT JOIN csr_programs p ON p.id = a.program_id
         ORDER BY a.created_at DESC LIMIT 10`,
      ),
    ]);

    const impactReach = Number(currentBeneficiaries || 0);
    const totalProg =
      totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;

    sendSuccess(res, {
      metrics: {
        totalVolunteers: Number(totalVolunteers?.count || 0),
        activePartners: activePrograms,
        impactReach,
        sustainabilityScore: `${totalProg}%`,
      },
      distribution: categoryRows.map((r) => ({
        label: r.label || 'Lainnya',
        value: Number(r.count),
      })),
      partners: [],
      applications: recentApplications.map((a) => {
        const parts = (a.full_name || '').trim().split(/\s+/);
        const initials =
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (a.full_name || '').slice(0, 2).toUpperCase();
        return {
          id: a.id,
          name: a.full_name,
          initials,
          background: a.program_title || '',
          role: a.role || 'volunteer',
          date: a.created_at,
          status:
            a.status === 'approved'
              ? 'Approved'
              : a.status === 'rejected'
                ? 'Rejected'
                : 'Review Pending',
        };
      }),
    });
  }),
);

module.exports = router;
