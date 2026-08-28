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
  groupCount,
  broadcastToUser,
} = require('./_helpers');

const BATCH_STATUSES = ['draft', 'open', 'closed', 'ongoing', 'completed'];
const APPLICATION_STATUSES = [
  'pending',
  'screening',
  'interview',
  'accepted',
  'rejected',
  'withdrawn',
];

/* ══════════════════════════ STATS ══════════════════════════ */

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      totalApplications,
      pendingApplications,
      screeningApplications,
      interviewApplications,
      acceptedApplications,
      rejectedApplications,
      totalBatches,
      openBatches,
      ongoingBatches,
      completedBatches,
      totalQuota,
      specializationBreakdown,
      statusBreakdown,
      universityBreakdown,
      semesterBreakdown,
      monthlyApplications,
      batchLoad,
      recentApplications,
      totalCertificates,
    ] = await Promise.all([
      countWhere('internship_applications'),
      countWhere('internship_applications', " WHERE status = 'pending'"),
      countWhere('internship_applications', " WHERE status = 'screening'"),
      countWhere('internship_applications', " WHERE status = 'interview'"),
      countWhere('internship_applications', " WHERE status = 'accepted'"),
      countWhere('internship_applications', " WHERE status = 'rejected'"),
      countWhere('internship_batches'),
      countWhere('internship_batches', " WHERE status = 'open'"),
      countWhere('internship_batches', " WHERE status = 'ongoing'"),
      countWhere('internship_batches', " WHERE status = 'completed'"),
      runQuery(`SELECT COALESCE(SUM(quota), 0) AS total FROM internship_batches`),
      groupCount('internship_applications', 'specialization'),
      groupCount('internship_applications', 'status'),
      runQuery(
        `SELECT university AS label, COUNT(*) AS count FROM internship_applications
         WHERE university != '' GROUP BY university ORDER BY count DESC LIMIT 10`,
      ),
      groupCount('internship_applications', 'semester'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM internship_applications GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT b.id, b.name, b.status, b.quota,
                COUNT(a.id) AS applicant_count,
                SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END) AS accepted_count
         FROM internship_batches b
         LEFT JOIN internship_applications a ON a.batch_id = b.id
         GROUP BY b.id, b.name, b.status, b.quota
         ORDER BY b.created_at DESC`,
      ),
      runQuery(
        `SELECT id, full_name, email, university, specialization, status, created_at
         FROM internship_applications ORDER BY created_at DESC LIMIT 8`,
      ),
      countWhere('certificates', " WHERE program_type = 'internship'"),
    ]);

    const quota = Number(totalQuota[0]?.total || 0);

    sendSuccess(res, {
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        screening: screeningApplications,
        interview: interviewApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
        acceptanceRate:
          totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0,
      },
      batches: {
        total: totalBatches,
        open: openBatches,
        ongoing: ongoingBatches,
        completed: completedBatches,
        totalQuota: quota,
        quotaFilledPercentage: quota > 0 ? Math.round((acceptedApplications / quota) * 100) : 0,
      },
      totalCertificates,
      specializationBreakdown: specializationBreakdown.map((r) => ({
        specialization: r.label || 'Lainnya',
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      universityBreakdown: universityBreakdown.map((r) => ({
        university: r.label,
        count: Number(r.count),
      })),
      semesterBreakdown: semesterBreakdown.map((r) => ({
        semester: Number(r.label),
        count: Number(r.count),
      })),
      monthlyApplications: monthlyApplications.map((r) => ({
        month: r.month,
        count: Number(r.count),
      })),
      batchLoad: batchLoad.map((b) => ({
        id: b.id,
        name: b.name,
        status: b.status,
        quota: Number(b.quota),
        applicantCount: Number(b.applicant_count),
        acceptedCount: Number(b.accepted_count || 0),
        fillPercentage:
          Number(b.quota) > 0
            ? Math.min(100, Math.round((Number(b.accepted_count || 0) / Number(b.quota)) * 100))
            : 0,
      })),
      recentApplications,
    });
  }),
);

/* ══════════════════════════ BATCHES ══════════════════════════ */

router.get(
  '/batches',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'internship_batches',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'search', type: 'search', columns: ['name', 'description', 'mentor_name'] },
      ],
      allowedSort: ['created_at', 'name', 'status', 'start_date'],
      defaultSort: 'created_at',
      defaultLimit: 50,
    });

    const counts = await runQuery(
      `SELECT batch_id, COUNT(*) AS applicant_count,
              SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted_count
       FROM internship_applications GROUP BY batch_id`,
    );
    const countMap = new Map(counts.map((c) => [c.batch_id, c]));

    const items = result.items.map((batch) => {
      const stat = countMap.get(batch.id);
      const accepted = Number(stat?.accepted_count || 0);
      return {
        ...batch,
        quota: Number(batch.quota || 0),
        applicantCount: Number(stat?.applicant_count || 0),
        acceptedCount: accepted,
        fillPercentage:
          Number(batch.quota) > 0
            ? Math.min(100, Math.round((accepted / Number(batch.quota)) * 100))
            : 0,
      };
    });

    sendSuccess(res, { ...result, items });
  }),
);

router.get(
  '/batches/:id',
  asyncHandler(async (req, res) => {
    const batch = await findRow('internship_batches', req.params.id);
    if (!batch) return sendError(res, 'Batch magang tidak ditemukan.', 404);

    const applications = await runQuery(
      `SELECT id, full_name, email, university, specialization, status, created_at
       FROM internship_applications WHERE batch_id = ? ORDER BY created_at DESC`,
      [batch.id],
    );

    sendSuccess(res, { ...batch, applications });
  }),
);

router.post(
  '/batches',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['name']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const status = req.body.status || 'open';
    if (!BATCH_STATUSES.includes(status)) return sendError(res, 'Status batch tidak valid.', 400);

    const id = uuidv4();
    await insertRow('internship_batches', {
      id,
      name: req.body.name,
      status,
      description: req.body.description || '',
      quota: Number(req.body.quota || 0),
      start_date: req.body.startDate || '',
      end_date: req.body.endDate || '',
      mentor_name: req.body.mentorName || '',
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'internship_batches',
      resourceId: id,
      summary: `Membuat batch magang ${req.body.name}`,
    });

    sendSuccess(res, await findRow('internship_batches', id), 201);
  }),
);

router.put(
  '/batches/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('internship_batches', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Batch magang tidak ditemukan.', 404);

    if (req.body.status && !BATCH_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status batch tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      name: 'name',
      status: 'status',
      description: 'description',
      quota: { key: 'quota', transform: (v) => Number(v || 0) },
      start_date: 'startDate',
      end_date: 'endDate',
      mentor_name: 'mentorName',
    });

    await updateRow('internship_batches', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'internship_batches',
      resourceId: req.params.id,
      summary: `Memperbarui batch magang ${req.body.name || existing.name}`,
    });

    sendSuccess(res, await findRow('internship_batches', req.params.id));
  }),
);

/**
 * GET /api/admin/internship/batches/:id/dependencies
 * Menampilkan pendaftar dan sertifikat yang terkait sebuah batch.
 */
router.get(
  '/batches/:id/dependencies',
  asyncHandler(async (req, res) => {
    const existing = await findRow('internship_batches', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Batch magang tidak ditemukan.', 404);

    const applicantCount = await countWhere('internship_applications', ' WHERE batch_id = ?', [
      req.params.id,
    ]);

    const certificateRow = await runQuery(
      `SELECT COUNT(*) AS count FROM certificates c
       INNER JOIN internship_applications a ON a.id = c.reference_id
       WHERE a.batch_id = ? AND c.program_type = 'internship'`,
      [req.params.id],
    );
    const certificateCount = Number(certificateRow[0]?.count || 0);

    const dependencies = [
      {
        label: 'pendaftar',
        table: 'internship_applications',
        count: applicantCount,
        blocking: true,
      },
      { label: 'sertifikat', table: 'certificates', count: certificateCount, blocking: true },
    ].filter((item) => item.count > 0);

    sendSuccess(res, {
      id: existing.id,
      name: existing.name,
      dependencies,
      totalRelatedRecords: applicantCount + certificateCount,
      canDelete: dependencies.length === 0,
    });
  }),
);

/**
 * DELETE /api/admin/internship/batches/:id
 *
 * Batch tidak dapat dihapus selama masih memiliki pendaftar atau sertifikat
 * terbit, karena keduanya merupakan catatan resmi program.
 */
router.delete(
  '/batches/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('internship_batches', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Batch magang tidak ditemukan.', 404);

    const linked = await countWhere('internship_applications', ' WHERE batch_id = ?', [
      req.params.id,
    ]);
    if (linked > 0) {
      return sendError(
        res,
        `Batch masih memiliki ${linked} pendaftar. Tutup batch alih-alih menghapus.`,
        400,
        { dependencies: [{ label: 'pendaftar', table: 'internship_applications', count: linked }] },
      );
    }

    const certificateRow = await runQuery(
      `SELECT COUNT(*) AS count FROM certificates c
       INNER JOIN internship_applications a ON a.id = c.reference_id
       WHERE a.batch_id = ? AND c.program_type = 'internship'`,
      [req.params.id],
    );
    const certificateCount = Number(certificateRow[0]?.count || 0);

    if (certificateCount > 0) {
      return sendError(
        res,
        `Batch masih menjadi acuan ${certificateCount} sertifikat terbit dan tidak dapat dihapus.`,
        400,
        { dependencies: [{ label: 'sertifikat', table: 'certificates', count: certificateCount }] },
      );
    }

    await deleteRow('internship_batches', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'internship_batches',
      resourceId: req.params.id,
      summary: `Menghapus batch magang ${existing.name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ APPLICATIONS ══════════════════════════ */

router.get(
  '/applications',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'internship_applications',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'batchId', column: 'batch_id' },
        { param: 'specialization', column: 'specialization' },
        { param: 'university', column: 'university' },
        { param: 'semester', type: 'number', column: 'semester' },
        {
          param: 'search',
          type: 'search',
          columns: ['full_name', 'email', 'phone', 'university', 'major'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'full_name', 'status', 'university', 'semester'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const application = await findRow('internship_applications', req.params.id);
    if (!application) return sendError(res, 'Pendaftaran magang tidak ditemukan.', 404);

    const batch = application.batch_id
      ? await findRow('internship_batches', application.batch_id, 'id, name, status, mentor_name')
      : null;
    const certificates = await runQuery(
      `SELECT id, certificate_number, verification_code, program_name, status, issued_at
       FROM certificates WHERE reference_id = ? OR recipient_email = ?`,
      [application.id, application.email],
    );

    sendSuccess(res, { ...application, batch, certificates });
  }),
);

router.post(
  '/applications',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['fullName', 'email']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    await insertRow('internship_applications', {
      id,
      user_id: req.body.userId || null,
      full_name: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone || '',
      university: req.body.university || '',
      major: req.body.major || '',
      semester: Number(req.body.semester || 0),
      specialization: req.body.specialization || '',
      motivation: req.body.motivation || '',
      portfolio_url: req.body.portfolioUrl || '',
      batch_id: req.body.batchId || null,
      status: req.body.status || 'pending',
      cv_url: req.body.cvUrl || '',
      reviewed_by: null,
      reviewed_at: '',
      admin_notes: req.body.adminNotes || '',
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'internship_applications',
      resourceId: id,
      summary: `Menambah pendaftar magang ${req.body.fullName}`,
    });

    sendSuccess(res, await findRow('internship_applications', id), 201);
  }),
);

router.put(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('internship_applications', req.params.id, 'id, full_name');
    if (!existing) return sendError(res, 'Pendaftaran magang tidak ditemukan.', 404);

    if (req.body.status && !APPLICATION_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status pendaftaran tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      full_name: 'fullName',
      email: 'email',
      phone: 'phone',
      university: 'university',
      major: 'major',
      semester: { key: 'semester', transform: (v) => Number(v || 0) },
      specialization: 'specialization',
      motivation: 'motivation',
      portfolio_url: 'portfolioUrl',
      batch_id: 'batchId',
      status: 'status',
      cv_url: 'cvUrl',
      admin_notes: 'adminNotes',
    });

    if (req.body.status && req.body.status !== 'pending') {
      payload.reviewed_by = req.user?.id || null;
      payload.reviewed_at = nowIso();
    }

    await updateRow('internship_applications', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'internship_applications',
      resourceId: req.params.id,
      summary: `Memperbarui pendaftaran magang ${existing.full_name}`,
    });

    sendSuccess(res, await findRow('internship_applications', req.params.id));
  }),
);

router.patch(
  '/applications/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!APPLICATION_STATUSES.includes(status))
      return sendError(res, 'Status pendaftaran tidak valid.', 400);

    const existing = await findRow(
      'internship_applications',
      req.params.id,
      'id, full_name, specialization, user_id',
    );
    if (!existing) return sendError(res, 'Pendaftaran magang tidak ditemukan.', 404);

    await updateRow('internship_applications', req.params.id, {
      status,
      reviewed_by: req.user?.id || null,
      reviewed_at: nowIso(),
      admin_notes: req.body.adminNotes ?? undefined,
    });

    await logAdminAction(req, {
      action:
        status === 'accepted' ? 'approve' : status === 'rejected' ? 'reject' : 'update_status',
      resource: 'internship_applications',
      resourceId: req.params.id,
      summary: `Mengubah status pendaftar magang ${existing.full_name} menjadi ${status}`,
    });

    if (status === 'accepted') {
      await recordActivity({
        type: 'internship_accepted',
        title: 'Pendaftar magang diterima',
        description: `${existing.full_name} diterima pada program ${existing.specialization}.`,
      });
    } else if (status === 'rejected' && existing.user_id) {
      broadcastToUser(existing.user_id, 'notification', {
        type: 'internship_application_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Pendaftaran magang Anda ditolak.`,
      }, 'internship');
    }

    if (existing.user_id) {
      broadcastToUser(existing.user_id, 'notification', {
        type: 'internship_application_update',
        resourceId: req.params.id,
        action: 'updated',
        message: `Pendaftaran magang Anda berstatus ${status}.`,
      }, 'internship');
    }

    sendSuccess(res, { id: req.params.id, status });
  }),
);

router.delete(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('internship_applications', req.params.id, 'id, full_name');
    if (!existing) return sendError(res, 'Pendaftaran magang tidak ditemukan.', 404);

    await deleteRow('internship_applications', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'internship_applications',
      resourceId: req.params.id,
      summary: `Menghapus pendaftaran magang ${existing.full_name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ ANALYTICS ══════════════════════════ */

router.get(
  '/analytics',
  asyncHandler(async (req, res) => {
    const [
      totalApplicants,
      activeInterns,
      acceptedCount,
      completedBatches,
      totalBatches,
      universityCount,
      monthlyRows,
      statusRows,
      specRows,
      acceptedRows,
    ] = await Promise.all([
      countWhere('internship_applications'),
      runSingle(
        `SELECT COUNT(*) AS count FROM internship_applications
         WHERE status = 'accepted' AND batch_id IN
           (SELECT id FROM internship_batches WHERE status = 'ongoing')`,
      ),
      countWhere('internship_applications', " WHERE status = 'accepted'"),
      countWhere('internship_batches', " WHERE status = 'completed'"),
      countWhere('internship_batches'),
      runSingle(
        `SELECT COUNT(DISTINCT university) AS count FROM internship_applications
         WHERE university != ''`,
      ),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM internship_applications GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      groupCount('internship_applications', 'status'),
      groupCount('internship_applications', 'specialization'),
      runQuery(
        `SELECT id, full_name, university, specialization, created_at
         FROM internship_applications WHERE status = 'accepted'
         ORDER BY created_at DESC LIMIT 20`,
      ),
    ]);

    const completionRate =
      totalBatches > 0 ? Math.round((completedBatches / totalBatches) * 100) : 0;

    sendSuccess(res, {
      metrics: {
        totalApplicants,
        activeInterns: Number(activeInterns?.count || 0),
        completionRate,
        universityPartners: Number(universityCount?.count || 0),
      },
      applicantTrend: monthlyRows.map((r) => ({ label: r.month, value: Number(r.count) })),
      selection: statusRows.map((r) => ({
        label: r.label,
        value: Number(r.count),
        tone: r.label === 'rejected' ? 'danger' : undefined,
      })),
      verticals: specRows.map((r) => ({ label: r.label || 'Lainnya', interns: Number(r.count) })),
      acceptedInterns: acceptedRows.map((r) => {
        const parts = (r.full_name || '').trim().split(/\s+/);
        const initials =
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (r.full_name || '').slice(0, 2).toUpperCase();
        return {
          id: r.id,
          name: r.full_name,
          initials,
          university: r.university || '',
          role: r.specialization || '',
          joinedAt: r.created_at,
        };
      }),
    });
  }),
);

module.exports = router;
