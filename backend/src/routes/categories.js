const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    const orderClause =
      sort === 'name' ? 'ORDER BY name ASC' : 'ORDER BY display_order ASC, name ASC';
    const categories = await runQuery(`SELECT * FROM categories ${orderClause}`);
    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, 'Gagal mengambil data kategori', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await runSingle('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!category) return sendError(res, 'Kategori tidak ditemukan', 404);
    sendSuccess(res, category);
  } catch (error) {
    sendError(res, 'Gagal mengambil data kategori', 500);
  }
});

router.post('/', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    const { name, displayOrder } = req.body;

    if (!name) return sendError(res, 'Nama kategori wajib diisi', 400);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await runSingle('SELECT id FROM categories WHERE slug = ?', [slug]);
    if (existing) return sendError(res, 'Kategori dengan nama ini sudah ada', 400);

    await runExecute(
      `INSERT INTO categories (id, name, slug, display_order, created_at) VALUES (?, ?, ?, ?, ?)`,
      [id, name, slug, displayOrder || 0, now],
    );

    sendSuccess(res, { id, name, slug }, 201);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 'Kategori dengan nama ini sudah ada', 409);
    }
    sendError(res, 'Gagal membuat kategori', 500);
  }
});

router.put('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await runSingle('SELECT id FROM categories WHERE id = ?', [id]);
    if (!existing) return sendError(res, 'Kategori tidak ditemukan', 404);

    const { name, displayOrder } = req.body;

    await runExecute(`UPDATE categories SET name = ?, display_order = ? WHERE id = ?`, [
      name ?? '',
      displayOrder ?? 0,
      id,
    ]);

    sendSuccess(res, { id, name });
  } catch (error) {
    sendError(res, 'Gagal memperbarui kategori', 500);
  }
});

router.delete('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const existing = await runSingle('SELECT id FROM categories WHERE id = ?', [req.params.id]);
    if (!existing) return sendError(res, 'Kategori tidak ditemukan', 404);

    await runExecute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    sendSuccess(res, { message: 'Kategori berhasil dihapus' });
  } catch (error) {
    sendError(res, 'Gagal menghapus kategori', 500);
  }
});

module.exports = router;
