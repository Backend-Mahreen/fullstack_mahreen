const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

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
      params.push(Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100));
    }

    const topics = await runQuery(sql, params);
    sendSuccess(res, topics);
  } catch (error) {
    sendError(res, 'Gagal mengambil data topik', 500);
  }
});

router.post('/', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    const { title, description, categories } = req.body;

    if (!title) return sendError(res, 'Judul topik wajib diisi', 400);

    await runExecute(
      `INSERT INTO topics (id, title, description, article_count, webinar_count, categories, created_at) VALUES (?, ?, ?, 0, 0, ?, ?)`,
      [id, title, description || '', JSON.stringify(categories || []), now],
    );

    sendSuccess(res, { id, title }, 201);
  } catch (error) {
    sendError(res, 'Gagal membuat topik', 500);
  }
});

router.delete('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const existing = await runSingle('SELECT id FROM topics WHERE id = ?', [req.params.id]);
    if (!existing) return sendError(res, 'Topik tidak ditemukan', 404);

    await runExecute('DELETE FROM topics WHERE id = ?', [req.params.id]);
    sendSuccess(res, { message: 'Topik berhasil dihapus' });
  } catch (error) {
    sendError(res, 'Gagal menghapus topik', 500);
  }
});

module.exports = router;
