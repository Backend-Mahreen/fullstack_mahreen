const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const {
  createTransaction,
  handleNotification,
  resolvePaymentStatus,
} = require('../services/midtransService');
const logger = require('../utils/logger');

/**
 * POST /api/events/:eventId/registrations
 * Publik — mendaftarkan user ke event.
 * Event FREE langsung confirmed, event PAID menunggu pembayaran.
 */
router.post('/:eventId/registrations', publicFormLimiter, async (req, res) => {
  try {
    const event = await runSingle('SELECT * FROM events WHERE id = ?', [req.params.eventId]);
    if (!event) return sendError(res, 'Event tidak ditemukan.', 404);
    if (event.status && event.status !== 'published') {
      return sendError(res, 'Event tidak ditemukan.', 404);
    }

    const { fullName, email, phone, institution } = req.body;
    if (!fullName || !email) {
      return sendError(res, 'fullName dan email wajib diisi.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Format email tidak valid.', 400);
    }

    const isFree =
      !event.access_type || event.access_type === 'FREE' || Number(event.quota || 0) === 0;
    const id = `EVT-REG-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    await runExecute(
      `INSERT INTO event_registrations
        (id, event_id, event_title, event_date, event_location, event_access_type,
         full_name, email, phone, institution, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        event.id,
        event.title || '',
        event.event_date || '',
        event.location || '',
        event.access_type || 'FREE',
        fullName,
        email,
        phone || '',
        institution || '',
        isFree ? 'confirmed' : 'pending-payment',
        now,
        now,
      ],
    );

    sendSuccess(
      res,
      {
        id,
        eventId: event.id,
        eventTitle: event.title || '',
        eventDate: event.event_date || '',
        eventLocation: event.location || '',
        eventAccessType: event.access_type || 'FREE',
        fullName,
        email,
        phone: phone || '',
        institution: institution || '',
        status: isFree ? 'confirmed' : 'pending-payment',
        createdAt: now,
      },
      201,
    );
  } catch (error) {
    logger.error(error, 'event-registration');
    sendError(res, 'Gagal mendaftar event.', 500);
  }
});

/**
 * GET /api/events/:eventId/registrations/:registrationId
 * Publik — cek status registrasi.
 */
router.get('/:eventId/registrations/:registrationId', async (req, res) => {
  try {
    const registration = await runSingle(
      'SELECT * FROM event_registrations WHERE id = ? AND event_id = ?',
      [req.params.registrationId, req.params.eventId],
    );
    if (!registration) return sendError(res, 'Registrasi tidak ditemukan.', 404);

    sendSuccess(res, registration);
  } catch (error) {
    logger.error(error, 'event-registration');
    sendError(res, 'Gagal mengambil data registrasi.', 500);
  }
});

/**
 * POST /api/events/:eventId/payments
 * Authenticated — membuat transaksi Midtrans Snap untuk event berbayar.
 */
router.post('/:eventId/payments', authenticate, async (req, res) => {
  try {
    const event = await runSingle('SELECT * FROM events WHERE id = ?', [req.params.eventId]);
    if (!event) return sendError(res, 'Event tidak ditemukan.', 404);

    if (!event.access_type || event.access_type === 'FREE') {
      return sendError(res, 'Event ini gratis, tidak perlu pembayaran.', 400);
    }

    const { registrationId, method } = req.body;
    if (!registrationId) return sendError(res, 'registrationId wajib diisi.', 400);

    const registration = await runSingle(
      'SELECT * FROM event_registrations WHERE id = ? AND event_id = ?',
      [registrationId, req.params.eventId],
    );
    if (!registration) return sendError(res, 'Registrasi tidak ditemukan.', 400);

    if (registration.status === 'confirmed') {
      return sendError(res, 'Registrasi sudah terkonfirmasi.', 400);
    }

    const amount = Number(event.price) || 0;
    const orderId = `EVT-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    const callbackUrl = process.env.FRONTEND_ORIGIN
      ? `${process.env.FRONTEND_ORIGIN}/newsroom/events/${encodeURIComponent(event.id)}?payment=success`
      : undefined;

    let paymentResult = null;
    const isMidtransConfigured = process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY;

    if (isMidtransConfigured) {
      paymentResult = await createTransaction({
        orderId,
        amount,
        customerName: registration.full_name || '',
        customerEmail: registration.email || '',
        customerPhone: registration.phone || '',
        itemName: `Tiket: ${event.title || ''}`,
        callbackUrl,
      });
    }

    await runExecute(
      `INSERT INTO event_payments
        (id, registration_id, event_id, event_title, participant_name, participant_email,
         midtrans_order_id, method, amount, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        registrationId,
        event.id,
        event.title || '',
        registration.full_name || '',
        registration.email || '',
        paymentResult?.token || '',
        method || 'qris',
        amount,
        'pending',
        now,
        now,
      ],
    );

    sendSuccess(
      res,
      {
        orderId,
        registrationId,
        eventId: event.id,
        eventTitle: event.title || '',
        participantName: registration.full_name || '',
        participantEmail: registration.email || '',
        method: method || 'qris',
        amount,
        status: 'pending',
        payment: paymentResult
          ? {
              token: paymentResult.token,
              redirect_url: paymentResult.redirect_url,
            }
          : {
              _warning:
                'Midtrans belum dikonfigurasi. Set MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY di .env untuk mengaktifkan pembayaran.',
            },
        createdAt: now,
      },
      201,
    );
  } catch (error) {
    logger.error(error, 'event-payment');
    sendError(res, 'Gagal memproses pembayaran event.', 500);
  }
});

/**
 * POST /api/events/payments/callback
 * Webhook dari Midtrans — memverifikasi notifikasi pembayaran.
 */
router.post('/payments/callback', async (req, res) => {
  try {
    const notification = req.body;
    if (!notification || !notification.order_id) {
      return res.status(200).json({ status: 'ok' });
    }

    const result = await handleNotification(notification);
    const finalStatus = resolvePaymentStatus(result.transaction_status, result.fraud_status);

    const payment = await runSingle('SELECT * FROM event_payments WHERE midtrans_order_id = ?', [
      result.order_id,
    ]);

    if (payment) {
      const now = new Date().toISOString();
      await runExecute(
        `UPDATE event_payments
         SET status = ?, midtrans_transaction_id = ?, updated_at = ?
         WHERE midtrans_order_id = ?`,
        [finalStatus, result.transaction_id || '', now, result.order_id],
      );

      if (finalStatus === 'paid') {
        await runExecute(
          `UPDATE event_registrations SET status = 'confirmed', updated_at = ? WHERE id = ?`,
          [now, payment.registration_id],
        );
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error(error, 'event-payment-callback');
    res.status(200).json({ status: 'ok' });
  }
});

module.exports = router;
