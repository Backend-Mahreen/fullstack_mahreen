const express = require('express');
const router = express.Router();
const { runExecute } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const { requireNonEmptyHeader } = require('../middleware/csrf');

router.get('/programs', async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM csr_programs ORDER BY created_at DESC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data program CSR', 500);
  }
});

router.get('/pillars', async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM csr_pillars ORDER BY sort_order ASC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data pilar CSR', 500);
  }
});

router.post('/applications', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const {
      role,
      fullName,
      focusArea,
      email,
      whatsapp,
      province,
      city,
      vision,
      motivation,
      programId,
      documentFileId,
    } = req.body;
    if (!fullName || !email) return sendError(res, 'fullName dan email wajib diisi', 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return sendError(res, 'Format email tidak valid', 400);

    const id = uuidv4();
    const created_at = new Date().toISOString();

    // `documentFileId` dari upload → simpan URL relatif agar bisa diakses publik.
    const documentUrl = documentFileId ? `/uploads/${documentFileId}` : '';

    await runExecute(
      `INSERT INTO csr_applications (id, user_id, program_id, role, full_name, email, phone, institution, city, motivation, portfolio_url, status, focus_area, province, vision, document_file_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      [
        id,
        null,
        programId || null,
        role || '',
        fullName,
        email,
        whatsapp || '',
        '',
        city || '',
        motivation || '',
        documentUrl,
        focusArea || '',
        province || '',
        vision || '',
        documentFileId || '',
        created_at,
      ],
    );

    sendSuccess(res, { applicationId: id, submittedAt: created_at, status: 'received' }, 201);
  } catch (error) {
    sendError(res, 'Gagal mengirim lamaran CSR', 500);
  }
});

module.exports = router;
