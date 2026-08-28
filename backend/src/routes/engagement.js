const express = require('express');
const router = express.Router();
const { runExecute, runSingle } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { requireNonEmptyHeader } = require('../middleware/csrf');
const { validateLengths } = require('../utils/validateLengths');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const submissionResult = (id) => ({
  submissionId: id,
  submittedAt: new Date().toISOString(),
  status: 'received',
});

/**
 * POST /api/contact/inquiries
 * Formulir "Hubungi Kami" (ContactForm).
 * Body: { name, email, company?, partnership, details }
 */
router.post('/contact/inquiries', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const { name, email, company, partnership, details } = req.body;
    if (!name || !email || !partnership || !details) {
      return sendError(res, 'Nama, email, pilar kemitraan, dan detail wajib diisi.', 400);
    }
    if (!EMAIL_REGEX.test(email)) return sendError(res, 'Format email tidak valid.', 400);

    const lengthCheck = validateLengths({ fullName: name, email, message: details });
    if (!lengthCheck.valid) return sendError(res, lengthCheck.errors[0], 400);

    const id = uuidv4();
    await runExecute(
      `INSERT INTO contact_inquiries (id, name, email, company, partnership, details, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
      [id, name, email, company || '', partnership, details, new Date().toISOString()],
    );

    sendSuccess(res, submissionResult(id), 201);
  } catch (error) {
    logger.error(error, 'contact-inquiries');
    sendError(res, 'Gagal mengirim pesan.', 500);
  }
});

/**
 * POST /api/support/tickets
 * Tiket bantuan (HelpCenter).
 * Body: { name, email, category, message }
 */
router.post('/support/tickets', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const { name, email, category, message } = req.body;
    if (!name || !email || !category || !message) {
      return sendError(res, 'Nama, email, kategori, dan pesan wajib diisi.', 400);
    }
    if (!EMAIL_REGEX.test(email)) return sendError(res, 'Format email tidak valid.', 400);

    const lengthCheck = validateLengths({ fullName: name, email, message });
    if (!lengthCheck.valid) return sendError(res, lengthCheck.errors[0], 400);

    const id = uuidv4();
    await runExecute(
      `INSERT INTO support_tickets (id, name, email, category, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'open', ?)`,
      [id, name, email, category, message, new Date().toISOString()],
    );

    sendSuccess(res, submissionResult(id), 201);
  } catch (error) {
    logger.error(error, 'support-tickets');
    sendError(res, 'Gagal membuat tiket bantuan.', 500);
  }
});

/**
 * POST /api/newsletter/subscriptions
 * Langganan newsletter. Body: { email, name?, source, articleSlug? }
 * Alias ke tabel newsletter_subscribers (sama dengan POST /api/newsletter).
 */
router.post(
  '/newsletter/subscriptions',
  requireNonEmptyHeader,
  publicFormLimiter,
  async (req, res) => {
    try {
      const { email, name, source } = req.body;
      if (!email || !EMAIL_REGEX.test(email)) {
        return sendError(res, 'Format email tidak valid.', 400);
      }

      const existing = await runSingle(
        'SELECT id, status FROM newsletter_subscribers WHERE email = ?',
        [email],
      );
      if (existing) {
        if (existing.status === 'unsubscribed') {
          await runExecute(
            "UPDATE newsletter_subscribers SET status = 'active', name = ?, created_at = ? WHERE id = ?",
            [name || '', new Date().toISOString(), existing.id],
          );
          return sendSuccess(res, { message: 'Berhasil berlangganan kembali.' }, 200);
        }
        return sendSuccess(res, { message: 'Email sudah terdaftar.' }, 200);
      }

      await runExecute(
        `INSERT INTO newsletter_subscribers (id, email, name, source, status, created_at) VALUES (?, ?, ?, ?, 'active', ?)`,
        [uuidv4(), email, name || '', source || 'newsroom', new Date().toISOString()],
      );

      sendSuccess(res, { message: 'Berhasil berlangganan.' }, 201);
    } catch (error) {
      if (error && error.code === 'ER_DUP_ENTRY') {
        return sendSuccess(res, { message: 'Email sudah terdaftar.' }, 200);
      }
      logger.error(error, 'newsletter-subscriptions');
      sendError(res, 'Gagal berlangganan.', 500);
    }
  },
);

module.exports = router;
