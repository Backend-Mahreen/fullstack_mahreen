const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM events';
    const conditions = [];
    const params = [];

    // Endpoint publik hanya menyajikan event yang sudah terbit.
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
    sql += ' ORDER BY event_date DESC';

    const events = await runQuery(sql, params);
    sendSuccess(res, events);
  } catch (error) {
    sendError(res, 'Gagal mengambil data event', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await runSingle('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) return sendError(res, 'Event tidak ditemukan', 404);
    if (event.status && event.status !== 'published') {
      return sendError(res, 'Event tidak ditemukan', 404);
    }
    sendSuccess(res, event);
  } catch (error) {
    sendError(res, 'Gagal mengambil data event', 500);
  }
});

module.exports = router;
