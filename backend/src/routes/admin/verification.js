const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { runQuery, runSingle, runExecute, withTransaction } = require('../../config/database');
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
const { createNotification } = require('../client/notifications');

const CERTIFICATE_STATUSES = ['draft', 'issued', 'revoked', 'expired'];
const PROGRAM_TYPES = ['internship', 'webinar', 'event', 'csr', 'training'];

const generateVerificationCode = () =>
  `MHR${crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 8)}`;

const nextCertificateNumber = async () => {
  const year = new Date().getFullYear();
  const row = await runSingle(
    `SELECT certificate_number FROM certificates
     WHERE certificate_number LIKE ? ORDER BY certificate_number DESC LIMIT 1`,
    [`CERT/MHR/${year}/%`],
  );
  let sequence = 1;
  if (row) {
    const parts = row.certificate_number.split('/');
    const lastPart = parts[parts.length - 1];
    const parsed = parseInt(lastPart, 10);
    if (!Number.isNaN(parsed)) sequence = parsed + 1;
  }
  return `CERT/MHR/${year}/${String(sequence).padStart(4, '0')}`;
};

/* Stats */

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      total,
      issued,
      revoked,
      expired,
      draft,
      totalVerifications,
      validVerifications,
      invalidVerifications,
      programTypeBreakdown,
      statusBreakdown,
      monthlyIssued,
      monthlyVerifications,
      topVerified,
      recentVerifications,
      recentCertificates,
    ] = await Promise.all([
      countWhere('certificates'),
      countWhere('certificates', " WHERE status = 'issued'"),
      countWhere('certificates', " WHERE status = 'revoked'"),
      countWhere('certificates', " WHERE status = 'expired'"),
      countWhere('certificates', " WHERE status = 'draft'"),
      countWhere('certificate_verifications'),
      countWhere('certificate_verifications', " WHERE result = 'valid'"),
      countWhere('certificate_verifications', " WHERE result != 'valid'"),
      groupCount('certificates', 'program_type'),
      groupCount('certificates', 'status'),
      runQuery(
        `SELECT DATE_FORMAT(issued_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM certificates WHERE issued_at != '' GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM certificate_verifications GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT id, certificate_number, recipient_name, program_name, verification_count
         FROM certificates ORDER BY verification_count DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT v.id, v.verification_code, v.result, v.ip_address, v.created_at,
                c.recipient_name, c.certificate_number
         FROM certificate_verifications v
         LEFT JOIN certificates c ON c.id = v.certificate_id
         ORDER BY v.created_at DESC LIMIT 10`,
      ),
      runQuery(
        `SELECT id, certificate_number, verification_code, recipient_name, program_type, program_name, status, issued_at
         FROM certificates ORDER BY created_at DESC LIMIT 8`,
      ),
    ]);

    sendSuccess(res, {
      certificates: { total, issued, revoked, expired, draft },
      verifications: {
        total: totalVerifications,
        valid: validVerifications,
        invalid: invalidVerifications,
        validRate:
          totalVerifications > 0 ? Math.round((validVerifications / totalVerifications) * 100) : 0,
      },
      programTypeBreakdown: programTypeBreakdown.map((r) => ({
        programType: r.label || 'lainnya',
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      monthlyIssued: monthlyIssued.map((r) => ({ month: r.month, count: Number(r.count) })),
      monthlyVerifications: monthlyVerifications.map((r) => ({
        month: r.month,
        count: Number(r.count),
      })),
      topVerified: topVerified.map((c) => ({
        ...c,
        verification_count: Number(c.verification_count),
      })),
      recentVerifications,
      recentCertificates,
    });
  }),
);

/* Certificates */

router.get(
  '/certificates',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'certificates',
      query: req.query,
      columns: `id, certificate_number, verification_code, recipient_name, recipient_email, user_id,
        program_type, program_name, reference_id, issued_at, expires_at, status, qr_payload, file_url,
        verification_count, issued_by, created_at`,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'programType', column: 'program_type' },
        {
          param: 'search',
          type: 'search',
          columns: [
            'certificate_number',
            'verification_code',
            'recipient_name',
            'recipient_email',
            'program_name',
          ],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'issued_at', 'recipient_name', 'status', 'verification_count'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/certificates/:id',
  asyncHandler(async (req, res) => {
    const certificate = await runSingle(
      `SELECT * FROM certificates WHERE id = ? OR certificate_number = ? OR verification_code = ?`,
      [req.params.id, req.params.id, req.params.id],
    );
    if (!certificate) return sendError(res, 'Sertifikat tidak ditemukan.', 404);

    const verifications = await runQuery(
      `SELECT id, result, ip_address, user_agent, created_at FROM certificate_verifications
       WHERE certificate_id = ? ORDER BY created_at DESC LIMIT 20`,
      [certificate.id],
    );

    sendSuccess(res, { ...certificate, verifications });
  }),
);

/**
 * POST /api/admin/verification/certificates
 * Terbitkan sertifikat baru, kode verifikasi dan nomor dibuat otomatis.
 */
router.post(
  '/certificates',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['recipientName', 'programName']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const programType = req.body.programType || 'internship';
    if (!PROGRAM_TYPES.includes(programType))
      return sendError(res, 'Jenis program tidak valid.', 400);

    const status = req.body.status || 'issued';
    if (!CERTIFICATE_STATUSES.includes(status))
      return sendError(res, 'Status sertifikat tidak valid.', 400);

    let verificationCode = req.body.verificationCode || generateVerificationCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const duplicate = await runSingle('SELECT id FROM certificates WHERE verification_code = ?', [
        verificationCode,
      ]);
      if (!duplicate) break;
      verificationCode = generateVerificationCode();
    }

    const certificateNumber = req.body.certificateNumber || (await nextCertificateNumber());
    const duplicateNumber = await runSingle(
      'SELECT id FROM certificates WHERE certificate_number = ?',
      [certificateNumber],
    );
    if (duplicateNumber) return sendError(res, 'Nomor sertifikat sudah digunakan.', 409);

    const id = uuidv4();
    const now = nowIso();

    await insertRow('certificates', {
      id,
      certificate_number: certificateNumber,
      verification_code: verificationCode,
      recipient_name: req.body.recipientName,
      recipient_email: req.body.recipientEmail || '',
      user_id: req.body.userId || null,
      program_type: programType,
      program_name: req.body.programName,
      reference_id: req.body.referenceId || '',
      issued_at: status === 'issued' ? req.body.issuedAt || now : '',
      expires_at: req.body.expiresAt || '',
      status,
      qr_payload: req.body.qrPayload || `/verifikasi/${verificationCode}`,
      file_url: req.body.fileUrl || '',
      verification_count: 0,
      issued_by: req.user?.id || null,
      created_at: now,
    });

    await logAdminAction(req, {
      action: 'issue',
      resource: 'certificates',
      resourceId: id,
      summary: `Menerbitkan sertifikat ${certificateNumber} untuk ${req.body.recipientName}`,
    });
    await recordActivity({
      type: 'certificate_issued',
      title: 'Sertifikat diterbitkan',
      description: `${certificateNumber} diterbitkan untuk ${req.body.recipientName}.`,
    });

    if (req.body.userId && status === 'issued') {
      await createNotification(req.body.userId, {
        type: 'certificate_issued',
        title: 'Sertifikat Diterbitkan',
        message: `Sertifikat ${certificateNumber} untuk ${req.body.programName} telah diterbitkan.`,
        link: '/akun',
      });

      broadcastToUser(req.body.userId, 'notification', {
        type: 'certificate_issued',
        resourceId: id,
        action: 'created',
        message: `Sertifikat ${certificateNumber} untuk program ${req.body.programName} telah diterbitkan.`,
      }, 'certificates');
    }

    sendSuccess(res, await findRow('certificates', id), 201);
  }),
);

/**
 * POST /api/admin/verification/certificates/bulk
 * Terbitkan sertifikat massal untuk peserta batch magang yang diterima.
 */
router.post(
  '/certificates/bulk',
  asyncHandler(async (req, res) => {
    const { batchId, programName } = req.body;
    if (!batchId) return sendError(res, 'batchId wajib diisi.', 400);

    const batch = await findRow('internship_batches', batchId, 'id, name');
    if (!batch) return sendError(res, 'Batch magang tidak ditemukan.', 404);

    const recipients = await runQuery(
      `SELECT id, full_name, email, user_id, specialization FROM internship_applications
       WHERE batch_id = ? AND status = 'accepted'`,
      [batchId],
    );

    if (recipients.length === 0) {
      return sendError(res, 'Tidak ada peserta diterima pada batch ini.', 400);
    }

    // Seluruh penerbitan sertifikat harus atomic — bila ada kegagalan
    // di tengah proses, sertifikat yang sudah terbit harus di-rollback.
    const result = await withTransaction(async (conn) => {
      const created = [];
      const skipped = [];

      for (const recipient of recipients) {
        const [existingRows] = await conn.query(
          "SELECT id FROM certificates WHERE reference_id = ? AND program_type = 'internship'",
          [recipient.id],
        );
        if (existingRows.length > 0) {
          skipped.push({
            id: recipient.id,
            name: recipient.full_name,
            reason: 'Sertifikat sudah ada',
          });
          continue;
        }

        let verificationCode = generateVerificationCode();
        for (let attempt = 0; attempt < 5; attempt++) {
          const [dupRows] = await conn.query(
            'SELECT id FROM certificates WHERE verification_code = ?',
            [verificationCode],
          );
          if (dupRows.length === 0) break;
          verificationCode = generateVerificationCode();
        }

        const id = uuidv4();
        const now = nowIso();
        const certificateNumber = await nextCertificateNumber();

        await conn.query(
          `INSERT INTO certificates
           (id, certificate_number, verification_code, recipient_name, recipient_email, user_id,
            program_type, program_name, reference_id, issued_at, expires_at, status,
            qr_payload, file_url, verification_count, issued_by, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            certificateNumber,
            verificationCode,
            recipient.full_name,
            recipient.email,
            recipient.user_id || null,
            'internship',
            programName || `Program Magang ${recipient.specialization} - ${batch.name}`,
            recipient.id,
            now,
            '',
            'issued',
            `/verifikasi/${verificationCode}`,
            '',
            0,
            req.user?.id || null,
            now,
          ],
        );

        created.push({
          id,
          certificateNumber,
          verificationCode,
          recipientName: recipient.full_name,
        });
      }

      return { created, skipped };
    });

    await logAdminAction(req, {
      action: 'issue_bulk',
      resource: 'certificates',
      resourceId: batchId,
      summary: `Menerbitkan ${result.created.length} sertifikat untuk batch ${batch.name}`,
      metadata: { created: result.created.length, skipped: result.skipped.length },
    });

    // Broadcast SSE per recipient setelah commit berhasil
    for (const item of result.created) {
      const recipient = recipients.find((r) => r.id === item.id);
      if (recipient && recipient.user_id) {
        broadcastToUser(recipient.user_id, 'notification', {
          type: 'certificate_issued',
          resourceId: item.id,
          action: 'created',
          message: `Sertifikat ${item.certificateNumber} telah diterbitkan.`,
        }, 'certificates');
      }
    }

    // Broadcast SSE per recipient setelah commit berhasil
    for (const item of result.created) {
      const recipient = recipients.find((r) => r.id === item.id);
      if (recipient && recipient.user_id) {
        broadcastToUser(recipient.user_id, 'notification', {
          type: 'certificate_issued',
          resourceId: item.id,
          action: 'created',
          message: `Sertifikat ${item.certificateNumber} telah diterbitkan.`,
        }, 'certificates');
      }
    }

    // Broadcast SSE per recipient setelah commit berhasil
    for (const item of result.created) {
      const recipient = recipients.find((r) => r.id === item.id);
      if (recipient && recipient.user_id) {
        broadcastToUser(recipient.user_id, 'notification', {
          type: 'certificate_issued',
          resourceId: item.id,
          action: 'created',
          message: `Sertifikat ${item.certificateNumber} telah diterbitkan.`,
        }, 'certificates');
      }
    }

    // Broadcast SSE per recipient setelah commit berhasil
    for (const item of result.created) {
      const recipient = recipients.find((r) => r.id === item.id);
      if (recipient && recipient.user_id) {
        broadcastToUser(recipient.user_id, 'notification', {
          type: 'certificate_issued',
          resourceId: item.id,
          action: 'created',
          message: `Sertifikat ${item.certificateNumber} telah diterbitkan.`,
        }, 'certificates');
      }
    }

    // Broadcast SSE per recipient setelah commit berhasil
    for (const item of result.created) {
      const recipient = recipients.find((r) => r.id === item.id);
      if (recipient && recipient.user_id) {
        broadcastToUser(recipient.user_id, 'notification', {
          type: 'certificate_issued',
          resourceId: item.id,
          action: 'created',
          message: `Sertifikat ${item.certificateNumber} telah diterbitkan.`,
        }, 'certificates');
      }
    }

    sendSuccess(
      res,
      {
        created: result.created,
        skipped: result.skipped,
        totalCreated: result.created.length,
        totalSkipped: result.skipped.length,
      },
      201,
    );
  }),
);

router.put(
  '/certificates/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('certificates', req.params.id, 'id, certificate_number, status');
    if (!existing) return sendError(res, 'Sertifikat tidak ditemukan.', 404);

    if (req.body.status && !CERTIFICATE_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status sertifikat tidak valid.', 400);
    }
    if (req.body.programType && !PROGRAM_TYPES.includes(req.body.programType)) {
      return sendError(res, 'Jenis program tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      recipient_name: 'recipientName',
      recipient_email: 'recipientEmail',
      program_type: 'programType',
      program_name: 'programName',
      reference_id: 'referenceId',
      expires_at: 'expiresAt',
      status: 'status',
      file_url: 'fileUrl',
    });

    if (req.body.status === 'issued' && existing.status !== 'issued') {
      payload.issued_at = nowIso();
    }

    await updateRow('certificates', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'certificates',
      resourceId: req.params.id,
      summary: `Memperbarui sertifikat ${existing.certificate_number}`,
    });

    sendSuccess(res, await findRow('certificates', req.params.id));
  }),
);

/**
 * PATCH /api/admin/verification/certificates/:id/revoke
 */
router.patch(
  '/certificates/:id/revoke',
  asyncHandler(async (req, res) => {
    const existing = await findRow(
      'certificates',
      req.params.id,
      'id, certificate_number, recipient_name, user_id',
    );
    if (!existing) return sendError(res, 'Sertifikat tidak ditemukan.', 404);

    await updateRow('certificates', req.params.id, { status: 'revoked' });
    await logAdminAction(req, {
      action: 'revoke',
      resource: 'certificates',
      resourceId: req.params.id,
      summary: `Mencabut sertifikat ${existing.certificate_number}`,
      metadata: { reason: req.body.reason || '' },
    });

    if (existing.user_id) {
      broadcastToUser(existing.user_id, 'notification', {
        type: 'certificate_revoked',
        resourceId: req.params.id,
        action: 'updated',
        message: `Sertifikat ${existing.certificate_number} telah dicabut.`,
      }, 'certificates');
    }

    sendSuccess(res, { id: req.params.id, status: 'revoked' });
  }),
);

/**
 * POST /api/admin/verification/certificates/:id/regenerate-code
 */
router.post(
  '/certificates/:id/regenerate-code',
  asyncHandler(async (req, res) => {
    const existing = await findRow('certificates', req.params.id, 'id, certificate_number');
    if (!existing) return sendError(res, 'Sertifikat tidak ditemukan.', 404);

    let verificationCode = generateVerificationCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const duplicate = await runSingle('SELECT id FROM certificates WHERE verification_code = ?', [
        verificationCode,
      ]);
      if (!duplicate) break;
      verificationCode = generateVerificationCode();
    }

    await updateRow('certificates', req.params.id, {
      verification_code: verificationCode,
      qr_payload: `/verifikasi/${verificationCode}`,
    });

    await logAdminAction(req, {
      action: 'regenerate_code',
      resource: 'certificates',
      resourceId: req.params.id,
      summary: `Membuat ulang kode verifikasi ${existing.certificate_number}`,
    });

    sendSuccess(res, {
      id: req.params.id,
      verificationCode,
      qrPayload: `/verifikasi/${verificationCode}`,
    });
  }),
);

router.delete(
  '/certificates/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('certificates', req.params.id, 'id, certificate_number');
    if (!existing) return sendError(res, 'Sertifikat tidak ditemukan.', 404);

    await deleteRow('certificates', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'certificates',
      resourceId: req.params.id,
      summary: `Menghapus sertifikat ${existing.certificate_number}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* Verification Log */

router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'certificate_verifications',
      query: req.query,
      filters: [
        { param: 'result', column: 'result' },
        { param: 'search', type: 'search', columns: ['verification_code', 'ip_address'] },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'result'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

/**
 * POST /api/admin/verification/check
 * Verifikasi manual dari panel admin, dicatat pada log verifikasi.
 */
router.post(
  '/check',
  asyncHandler(async (req, res) => {
    const code = String(req.body.verificationCode || '').trim();
    if (!code) return sendError(res, 'Kode verifikasi wajib diisi.', 400);

    const certificate = await runSingle(
      `SELECT * FROM certificates WHERE verification_code = ? OR certificate_number = ?`,
      [code, code],
    );

    const result = !certificate
      ? 'not_found'
      : certificate.status === 'revoked'
        ? 'revoked'
        : certificate.status === 'expired'
          ? 'expired'
          : certificate.status === 'issued'
            ? 'valid'
            : 'invalid';

    await insertRow('certificate_verifications', {
      id: uuidv4(),
      certificate_id: certificate ? certificate.id : null,
      verification_code: code,
      result,
      ip_address: req.ip || '',
      user_agent: req.headers['user-agent'] || '',
      created_at: nowIso(),
    });

    if (certificate) {
      await runExecute(
        'UPDATE certificates SET verification_count = verification_count + 1 WHERE id = ?',
        [certificate.id],
      );
    }

    sendSuccess(res, {
      result,
      valid: result === 'valid',
      certificate: certificate
        ? {
            id: certificate.id,
            certificateNumber: certificate.certificate_number,
            verificationCode: certificate.verification_code,
            recipientName: certificate.recipient_name,
            programType: certificate.program_type,
            programName: certificate.program_name,
            issuedAt: certificate.issued_at,
            expiresAt: certificate.expires_at,
            status: certificate.status,
          }
        : null,
    });
  }),
);

/* Overview */

router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const [
      totalCerts,
      draftCerts,
      totalVerifs,
      validVerifs,
      programTypeRows,
      recentLogs,
      recentCerts,
    ] = await Promise.all([
      countWhere('certificates'),
      countWhere('certificates', " WHERE status = 'draft'"),
      countWhere('certificate_verifications'),
      countWhere('certificate_verifications', " WHERE result = 'valid'"),
      groupCount('certificates', 'program_type'),
      runQuery(
        `SELECT v.id, v.verification_code, v.result, v.ip_address, v.created_at,
                  c.recipient_name, c.certificate_number
           FROM certificate_verifications v
           LEFT JOIN certificates c ON c.id = v.certificate_id
           ORDER BY v.created_at DESC LIMIT 10`,
      ),
      runQuery(
        `SELECT id, certificate_number, recipient_name, program_type, status, issued_at, created_at
           FROM certificates ORDER BY created_at DESC LIMIT 10`,
      ),
    ]);

    const auditQueue = Number(draftCerts || 0);
    const totalV = Number(totalVerifs || 0);
    const validV = Number(validVerifs || 0);
    const identityMatchRate = totalV > 0 ? Math.round((validV / totalV) * 100) : 0;

    sendSuccess(res, {
      metrics: {
        totalVerifications: totalV,
        auditQueue,
        identityMatchRate,
        securityStatus: 'Normal',
      },
      requests: recentCerts.map((c) => {
        const parts = (c.recipient_name || '').trim().split(/\s+/);
        const initials =
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (c.recipient_name || '').slice(0, 2).toUpperCase();
        const typeMap = {
          internship: 'Credential',
          training: 'Credential',
          webinar: 'Document',
          event: 'Document',
          csr: 'Identity',
        };
        const statusMap = {
          issued: 'Verified',
          draft: 'Under Review',
          revoked: 'Pending',
          expired: 'Pending',
        };
        return {
          id: c.id,
          name: c.recipient_name,
          initials,
          type: typeMap[c.program_type] || 'Credential',
          date: c.issued_at || c.created_at,
          priority: 'Normal',
          status: statusMap[c.status] || 'Pending',
        };
      }),
      breakdown: programTypeRows.map((r) => ({
        label: r.label || 'Lainnya',
        value: Number(r.count),
      })),
      logs: recentLogs.map((l) => ({
        id: l.id,
        title: `Verifikasi ${l.certificate_number || '—'} `,
        detail: `${l.result} dari ${l.ip_address || 'unknown'}`,
        time: l.created_at,
        tone: l.result === 'revoked' ? 'danger' : undefined,
      })),
      networkHealth: 100,
    });
  }),
);

module.exports = router;
