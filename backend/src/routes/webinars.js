const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { requireNonEmptyHeader } = require('../middleware/csrf');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM webinars';
    const conditions = [];
    const params = [];

    // Endpoint publik hanya menyajikan webinar yang sudah terbit.
    conditions.push('status = ?');
    params.push('published');
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';

    const webinars = await runQuery(sql, params);
    sendSuccess(res, webinars);
  } catch (error) {
    sendError(res, 'Gagal mengambil data webinar', 500);
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const webinar = await runSingle('SELECT * FROM webinars WHERE slug = ?', [req.params.slug]);
    if (!webinar) return sendError(res, 'Webinar tidak ditemukan', 404);
    if (webinar.status && webinar.status !== 'published') {
      return sendError(res, 'Webinar tidak ditemukan', 404);
    }
    sendSuccess(res, webinar);
  } catch (error) {
    sendError(res, 'Gagal mengambil data webinar', 500);
  }
});

router.post('/:slug/registrations', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const webinar = await runSingle('SELECT * FROM webinars WHERE slug = ?', [req.params.slug]);
    if (!webinar) return sendError(res, 'Webinar tidak ditemukan', 404);

    const { fullName, email, whatsapp, institution, profession, city, webinarSlug } = req.body;
    if (!fullName || !email) return sendError(res, 'fullName dan email wajib diisi', 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return sendError(res, 'Format email tidak valid', 400);

    const id = `WEB-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();
    const isFree = !webinar.price || Number(webinar.price) === 0;

    await runExecute(
      `INSERT INTO webinar_registrations (id, webinar_slug, webinar_title, webinar_category, webinar_price, full_name, email, whatsapp, institution, profession, city, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.params.slug,
        webinar.title || '',
        webinar.category || '',
        webinar.price || 0,
        fullName,
        email,
        whatsapp || '',
        institution || '',
        profession || '',
        city || '',
        isFree ? 'confirmed' : 'pending-payment',
        now,
      ],
    );

    sendSuccess(
      res,
      {
        id,
        webinarSlug: req.params.slug,
        webinarTitle: webinar.title || '',
        webinarCategory: webinar.category || '',
        webinarPrice: Number(webinar.price) || 0,
        fullName,
        email,
        whatsapp: whatsapp || '',
        institution: institution || '',
        profession: profession || '',
        city: city || '',
        status: isFree ? 'confirmed' : 'pending-payment',
        createdAt: now,
      },
      201,
    );
  } catch (error) {
    sendError(res, 'Gagal mendaftar webinar', 500);
  }
});

router.post('/:slug/payments', authenticate, async (req, res) => {
  try {
    const webinar = await runSingle('SELECT * FROM webinars WHERE slug = ?', [req.params.slug]);
    if (!webinar) return sendError(res, 'Webinar tidak ditemukan', 404);

    const { registrationId, method, bank } = req.body;
    if (!registrationId) return sendError(res, 'registrationId wajib diisi', 400);

    const registration = await runSingle(
      'SELECT * FROM webinar_registrations WHERE id = ? AND webinar_slug = ?',
      [registrationId, req.params.slug],
    );
    if (!registration) return sendError(res, 'Registrasi tidak ditemukan', 404);

    // Nominal ditentukan server dari harga webinar, bukan dari klien,
    // agar peserta tidak dapat membayar kurang dari harga sebenarnya.
    const price = Number(webinar.price) || 0;
    const total = price;

    // ID pembayaran selalu dibuat server. paymentId dari klien diabaikan
    // untuk mencegah penimpaan baris pembayaran yang sudah ada.
    const id = `PAY-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    await runExecute(
      `INSERT INTO webinar_payments (id, registration_id, webinar_slug, webinar_title, participant_name, participant_email, method, bank, registration_fee, platform_fee, discount, total, status, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'simulated-paid', ?, ?)`,
      [
        id,
        registrationId,
        req.params.slug,
        webinar.title || '',
        registration.full_name || '',
        registration.email || '',
        method || 'qris',
        bank || null,
        price,
        0,
        0,
        total,
        now,
        now,
      ],
    );

    await runExecute("UPDATE webinar_registrations SET status = 'confirmed' WHERE id = ?", [
      registrationId,
    ]);

    sendSuccess(
      res,
      {
        id,
        registrationId: registrationId || null,
        webinarSlug: req.params.slug,
        webinarTitle: webinar.title || '',
        participantName: registration?.full_name || null,
        participantEmail: registration?.email || null,
        method: method || 'qris',
        bank: bank || null,
        breakdown: {
          registrationFee: price,
          platformFee: 0,
          discount: 0,
          total,
        },
        status: 'simulated-paid',
        paidAt: now,
        _warning:
          'Pembayaran ini bersifat simulasi. Integrasi payment gateway diperlukan untuk produksi.',
      },
      201,
    );
  } catch (error) {
    sendError(res, 'Gagal memproses pembayaran webinar', 500);
  }
});

module.exports = router;
