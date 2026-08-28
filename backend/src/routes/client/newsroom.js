const express = require('express');
const router = express.Router();
const { runQuery } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { authenticate, authorize } = require('../../middleware/auth');

/**
 * Client newsroom routes — read-only.
 * Hanya client dan intern yang boleh mengakses.
 */
router.use(authenticate, authorize('client', 'intern'));

/**
 * GET /api/client/newsroom
 * Daftar topik. Mendukung ?limit dan ?search.
 */
router.get('/', async (req, res) => {
  try {
    const { limit, search } = req.query;
    let sql = 'SELECT * FROM topics';
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY article_count DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }

    const topics = await runQuery(sql, params);
    sendSuccess(res, topics);
  } catch (error) {
    sendError(res, 'Gagal mengambil data topik.', 500);
  }
});

/**
 * GET /api/client/newsroom/webinars
 * Daftar webinar yang dipublikasikan. Mendukung ?status, ?category, ?search.
 */
router.get('/webinars', async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let sql = 'SELECT * FROM webinars';
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY schedule_date ASC';

    const webinars = await runQuery(sql, params);
    sendSuccess(res, webinars);
  } catch (error) {
    sendError(res, 'Gagal mengambil data webinar.', 500);
  }
});

/**
 * GET /api/client/newsroom/events
 * Daftar event yang dipublikasikan. Mendukung ?status, ?category, ?accessType, ?search.
 */
router.get('/events', async (req, res) => {
  try {
    const { status, category, accessType, search } = req.query;
    let sql = 'SELECT * FROM events';
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (accessType) {
      conditions.push('access_type = ?');
      params.push(accessType);
    }
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY event_date ASC';

    const events = await runQuery(sql, params);
    sendSuccess(res, events);
  } catch (error) {
    sendError(res, 'Gagal mengambil data event.', 500);
  }
});

module.exports = router;
