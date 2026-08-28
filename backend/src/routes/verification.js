const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { verificationLimiter } = require('../middleware/rateLimit');
const { requireNonEmptyHeader } = require('../middleware/csrf');
const logger = require('../utils/logger');

/**
 * POST /api/verification/check
 *
 * Verifikasi publik sertifikat/dokumen berdasarkan kode verifikasi atau
 * nomor sertifikat. Setiap pemeriksaan dicatat ke certificate_verifications
 * dan menambah verification_count pada sertifikat.
 */
router.post('/check', requireNonEmptyHeader, verificationLimiter, async (req, res) => {
  try {
    const code = String(req.body.code ?? req.body.verificationCode ?? '').trim();
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

    await runExecute(
      `INSERT INTO certificate_verifications (id, certificate_id, verification_code, result, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        certificate ? certificate.id : null,
        code,
        result,
        req.ip || '',
        req.headers['user-agent'] || '',
        new Date().toISOString(),
      ],
    );

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
  } catch (error) {
    logger.error(error, 'verification-check');
    sendError(res, 'Gagal memproses verifikasi.', 500);
  }
});

module.exports = router;
