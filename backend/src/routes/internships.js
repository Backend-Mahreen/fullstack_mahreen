const express = require('express');
const router = express.Router();
const { runExecute, runSingle } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const { requireNonEmptyHeader } = require('../middleware/csrf');

router.get('/batches', async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM internship_batches ORDER BY created_at DESC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data batch magang', 500);
  }
});

router.post('/applications', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const {
      program,
      batchId,
      fullName,
      email,
      whatsapp,
      linkedin,
      university,
      major,
      semester,
      cvFileId,
      portfolioFileId,
      motivationLetterFileId,
    } = req.body;
    if (!fullName || !email) return sendError(res, 'fullName dan email wajib diisi', 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return sendError(res, 'Format email tidak valid', 400);

    const id = uuidv4();
    const created_at = new Date().toISOString();

    // FileId dari upload → simpan URL relatif, bukan ID mentah.
    const cvUrl = cvFileId ? `/uploads/${cvFileId}` : '';
    const portfolioUrl = portfolioFileId ? `/uploads/${portfolioFileId}` : linkedin || '';
    const motivationLetterUrl = motivationLetterFileId ? `/uploads/${motivationLetterFileId}` : '';

    // Frontend tidak mengirim batchId; fallback ke batch 'open' pertama.
    let resolvedBatchId = batchId || null;
    if (!resolvedBatchId) {
      const openBatch = await runSingle(
        "SELECT id FROM internship_batches WHERE status = 'open' ORDER BY created_at ASC LIMIT 1",
      );
      resolvedBatchId = openBatch ? openBatch.id : null;
    }

    await runExecute(
      `INSERT INTO internship_applications (id, full_name, email, phone, university, major, semester, specialization, motivation, portfolio_url, cv_url, motivation_letter_url, batch_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        fullName,
        email,
        whatsapp || '',
        university || '',
        major || '',
        semester || 0,
        program || '',
        '',
        portfolioUrl,
        cvUrl,
        motivationLetterUrl,
        resolvedBatchId,
        created_at,
      ],
    );

    sendSuccess(res, { applicationId: id, submittedAt: created_at, status: 'received' }, 201);
  } catch (error) {
    sendError(res, 'Gagal membuat lamaran magang', 500);
  }
});

module.exports = router;
