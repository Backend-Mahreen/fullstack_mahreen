const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const { requireNonEmptyHeader } = require('../middleware/csrf');

router.post('/', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !email.includes('@')) {
      return sendError(res, 'Email tidak valid.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return sendError(res, 'Format email tidak valid.', 400);

    const existing = await runSingle(
      'SELECT id, status FROM newsletter_subscribers WHERE email = ?',
      [email],
    );

    if (existing) {
      if (existing.status === 'unsubscribed') {
        const now = new Date().toISOString();
        await runExecute(
          "UPDATE newsletter_subscribers SET status = 'active', created_at = ? WHERE id = ?",
          [now, existing.id],
        );
        return sendSuccess(res, { message: 'Berhasil berlangganan kembali.' }, 200);
      }
      return sendSuccess(res, { message: 'Email sudah terdaftar.' }, 200);
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await runExecute(
      `INSERT INTO newsletter_subscribers (id, email, source, status, created_at) VALUES (?, ?, ?, 'active', ?)`,
      [id, email, source || 'newsroom', now],
    );

    sendSuccess(res, { message: 'Berhasil berlangganan.' }, 201);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      // Balapan dengan pendaftaran email yang sama — anggap sudah terdaftar.
      return sendSuccess(res, { message: 'Email sudah terdaftar.' }, 200);
    }
    sendError(res, 'Gagal berlangganan.', 500);
  }
});

router.get('/', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM newsletter_subscribers ORDER BY created_at DESC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data subscriber', 500);
  }
});

router.get('/stats', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const total = await runSingle('SELECT COUNT(*) as count FROM newsletter_subscribers');
    const active = await runSingle(
      "SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'",
    );
    const bySource = await runQuery(
      'SELECT source, COUNT(*) as count FROM newsletter_subscribers GROUP BY source ORDER BY count DESC',
    );

    sendSuccess(res, {
      total: total?.count || 0,
      active: active?.count || 0,
      bySource,
    });
  } catch (error) {
    sendError(res, 'Gagal mengambil statistik subscriber', 500);
  }
});

router.delete('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const existing = await runSingle('SELECT id FROM newsletter_subscribers WHERE id = ?', [
      req.params.id,
    ]);
    if (!existing) return sendError(res, 'Subscriber tidak ditemukan', 404);

    await runExecute('DELETE FROM newsletter_subscribers WHERE id = ?', [req.params.id]);
    sendSuccess(res, { message: 'Subscriber berhasil dihapus' });
  } catch (error) {
    sendError(res, 'Gagal menghapus subscriber', 500);
  }
});

module.exports = router;
