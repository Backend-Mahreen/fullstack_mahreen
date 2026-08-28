const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');

router.get('/', async (req, res) => {
  try {
    const { service_key } = req.query;
    let sql = 'SELECT * FROM service_packages';
    const params = [];
    if (service_key) {
      sql += ' WHERE service_key = ?';
      params.push(service_key);
    }
    sql += ' ORDER BY price ASC';
    const result = await paginatedQuery(sql, params, req.query);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data paket layanan', 500);
  }
});

router.get('/addons', async (req, res) => {
  try {
    const { service_key } = req.query;
    let sql = 'SELECT * FROM service_addons';
    const params = [];
    if (service_key) {
      sql += ' WHERE service_key = ?';
      params.push(service_key);
    }
    const result = await paginatedQuery(sql, params, req.query);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data addon', 500);
  }
});

router.get('/comparisons', async (req, res) => {
  try {
    const { service_key } = req.query;
    let sql = 'SELECT * FROM service_comparisons';
    const params = [];
    if (service_key) {
      sql += ' WHERE service_key = ?';
      params.push(service_key);
    }
    sql += ' ORDER BY sort_order ASC';
    const result = await paginatedQuery(sql, params, req.query);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data perbandingan', 500);
  }
});

module.exports = router;
