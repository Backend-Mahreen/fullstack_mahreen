const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

router.use(authenticate, authorize('client', 'intern'));

/**
 * GET /api/client/notifications
 * List notifikasi untuk user yang login.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

    const notifications = await runQuery(
      `SELECT id, type, title, message, link, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY is_read ASC, created_at DESC
       LIMIT ?`,
      [userId, limit],
    );

    sendSuccess(res, { items: notifications });
  } catch (error) {
    logger.error(error, 'notifications');
    sendError(res, 'Gagal mengambil data notifikasi', 500);
  }
});

/**
 * GET /api/client/notifications/unread-count
 * Jumlah notifikasi belum dibaca.
 */
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await runSingle(
      `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId],
    );
    sendSuccess(res, { count: result?.count || 0 });
  } catch (error) {
    logger.error(error, 'notifications');
    sendError(res, 'Gagal mengambil jumlah notifikasi', 500);
  }
});

/**
 * PATCH /api/client/notifications/:id/read
 * Tandai satu notifikasi sudah dibaca.
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const userId = req.user.id;
    const notifId = req.params.id;

    const notif = await runSingle(`SELECT id FROM notifications WHERE id = ? AND user_id = ?`, [
      notifId,
      userId,
    ]);
    if (!notif) return sendError(res, 'Notifikasi tidak ditemukan.', 404);

    await runExecute(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [
      notifId,
      userId,
    ]);

    sendSuccess(res, { message: 'Notifikasi ditandai sudah dibaca.' });
  } catch (error) {
    logger.error(error, 'notifications');
    sendError(res, 'Gagal memperbarui notifikasi', 500);
  }
});

/**
 * PATCH /api/client/notifications/read-all
 * Tandai semua notifikasi sudah dibaca.
 */
router.patch('/read-all', async (req, res) => {
  try {
    const userId = req.user.id;
    await runExecute(`UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`, [
      userId,
    ]);
    sendSuccess(res, { message: 'Semua notifikasi ditandai sudah dibaca.' });
  } catch (error) {
    logger.error(error, 'notifications');
    sendError(res, 'Gagal memperbarui notifikasi', 500);
  }
});

/**
 * Helper: Buat notifikasi baru untuk user tertentu.
 * Dipanggil dari admin actions (update order status, issue certificate, dll).
 */
const createNotification = async (userId, { type, title, message, link = '' }) => {
  try {
    await runExecute(
      `INSERT INTO notifications (id, user_id, type, title, message, link, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      [uuidv4(), userId, type, title, message, link, new Date().toISOString()],
    );
  } catch (error) {
    logger.error(error, 'notifications');
  }
};

module.exports = router;
module.exports.createNotification = createNotification;
