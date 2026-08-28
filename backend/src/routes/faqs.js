const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/faqs
 * Daftar FAQ publik. Mendukung filter ?category dan ?search.
 */
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT id, question, answer, category, sort_order FROM faqs';
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(question LIKE ? OR answer LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY sort_order ASC, created_at ASC';

    const faqs = await runQuery(sql, params);
    sendSuccess(res, faqs);
  } catch (error) {
    sendError(res, 'Gagal mengambil data FAQ', 500);
  }
});

module.exports = router;
