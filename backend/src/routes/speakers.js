const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { paginatedQuery } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const result = await paginatedQuery(
      'SELECT * FROM speakers ORDER BY created_at DESC',
      [],
      req.query,
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 'Gagal mengambil data speaker', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const speaker = await runSingle('SELECT * FROM speakers WHERE id = ?', [req.params.id]);
    if (!speaker) return sendError(res, 'Speaker tidak ditemukan', 404);
    sendSuccess(res, speaker);
  } catch (error) {
    sendError(res, 'Gagal mengambil data speaker', 500);
  }
});

router.post('/', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    const { name, role, company, description, image } = req.body;

    if (!name) return sendError(res, 'Nama speaker wajib diisi', 400);

    await runExecute(
      `INSERT INTO speakers (id, name, role, company, description, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, role || '', company || '', description || '', image || '', now, now],
    );

    sendSuccess(res, { id, name }, 201);
  } catch (error) {
    sendError(res, 'Gagal membuat speaker', 500);
  }
});

router.put('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await runSingle('SELECT id FROM speakers WHERE id = ?', [id]);
    if (!existing) return sendError(res, 'Speaker tidak ditemukan', 404);

    const { name, role, company, description, image } = req.body;
    const now = new Date().toISOString();

    await runExecute(
      `UPDATE speakers SET name = ?, role = ?, company = ?, description = ?, image = ?, updated_at = ? WHERE id = ?`,
      [name ?? '', role ?? '', company ?? '', description ?? '', image ?? '', now, id],
    );

    sendSuccess(res, { id, name });
  } catch (error) {
    sendError(res, 'Gagal memperbarui speaker', 500);
  }
});

router.delete('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const existing = await runSingle('SELECT id FROM speakers WHERE id = ?', [req.params.id]);
    if (!existing) return sendError(res, 'Speaker tidak ditemukan', 404);

    await runExecute('DELETE FROM speakers WHERE id = ?', [req.params.id]);
    sendSuccess(res, { message: 'Speaker berhasil dihapus' });
  } catch (error) {
    sendError(res, 'Gagal menghapus speaker', 500);
  }
});

module.exports = router;
