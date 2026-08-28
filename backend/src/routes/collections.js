const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');

router.get('/', async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM collection_cards ORDER BY sort_order ASC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data koleksi', 500);
  }
});

router.get('/specializations', async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM specializations ORDER BY sort_order ASC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data spesialisasi', 500);
  }
});

module.exports = router;
