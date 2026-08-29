const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');

router.get('/', async (req, res) => {
  try {
    const { category, collection, search } = req.query;
    let sql = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    // Endpoint publik hanya menyajikan produk yang sudah terbit.
    conditions.push('status = ?');
    params.push('published');
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (collection) {
      conditions.push('collection_name = ?');
      params.push(collection);
    }
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';

    const result = await paginatedQuery(sql, params, req.query);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data produk', 500);
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await runQuery(
      'SELECT id, name, slug, display_order FROM studio_categories WHERE is_active = 1 ORDER BY display_order ASC',
    );
    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, 'Gagal mengambil data kategori', 500);
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await runSingle('SELECT * FROM products WHERE slug = ?', [req.params.slug]);
    if (!product) return sendError(res, 'Produk tidak ditemukan', 404);
    if (product.status && product.status !== 'published') {
      return sendError(res, 'Produk tidak ditemukan', 404);
    }
    sendSuccess(res, product);
  } catch (error) {
    sendError(res, 'Gagal mengambil data produk', 500);
  }
});

module.exports = router;
