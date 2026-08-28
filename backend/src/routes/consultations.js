const express = require('express');
const router = express.Router();
const { runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { validateLengths } = require('../utils/validateLengths');
const { requireNonEmptyHeader } = require('../middleware/csrf');

router.post('/', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const { clientInfo, services, kebutuhan, budget, target, notes, fileIds } = req.body;
    if (!clientInfo || !clientInfo.nama || !clientInfo.email) {
      return sendError(res, 'Nama dan email wajib diisi', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientInfo.email)) return sendError(res, 'Format email tidak valid', 400);

    const lengthCheck = validateLengths({
      fullName: clientInfo.nama,
      email: clientInfo.email,
      whatsapp: clientInfo.whatsapp,
      message: notes || kebutuhan || '',
    });
    if (!lengthCheck.valid) return sendError(res, lengthCheck.errors[0], 400);

    const id = uuidv4();
    const requestId = `KSL-${uuidv4().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    await runExecute(
      `INSERT INTO consultations (id, user_id, full_name, email, phone, service_interest, message, status, institution, city, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        null,
        clientInfo.nama,
        clientInfo.email,
        clientInfo.whatsapp || '',
        (services || []).join(', '),
        notes || kebutuhan || '',
        'received',
        clientInfo.perusahaan || '',
        clientInfo.kota || '',
        now,
        now,
      ],
    );

    sendSuccess(res, { requestId, submittedAt: now, status: 'received' }, 201);
  } catch (error) {
    logger.error(error, 'consultations');
    sendError(res, 'Gagal mengirim konsultasi', 500);
  }
});

module.exports = router;
