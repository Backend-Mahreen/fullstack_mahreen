const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { isTokenRevoked } = require('../services/tokenBlacklist');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Public article routes — read-only.
 * Mutations (create/update/delete) handled exclusively by /api/admin/newsroom/articles.
 */

router.get('/', async (req, res) => {
  try {
    const { category, search, limit, offset } = req.query;
    let sql = 'SELECT * FROM articles';
    const conditions = [];
    const params = [];

    // Endpoint publik hanya menyajikan artikel yang sudah terbit.
    // Status tidak boleh ditentukan klien agar draft tidak bocor.
    conditions.push('status = ?');
    params.push('published');
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(title LIKE ? OR excerpt LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';

    const safeLimit = limit ? Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100) : null;
    const safeOffset = offset ? Math.max(parseInt(offset, 10) || 0, 0) : null;
    if (safeLimit) {
      sql += ' LIMIT ?';
      params.push(safeLimit);
      if (safeOffset !== null) {
        sql += ' OFFSET ?';
        params.push(safeOffset);
      }
    }

    const articles = await runQuery(sql, params);
    sendSuccess(res, articles);
  } catch (error) {
    sendError(res, 'Gagal mengambil data artikel', 500);
  }
});

router.get('/stats', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const totalArticles = await runSingle('SELECT COUNT(*) as count FROM articles');
    const publishedCount = await runSingle(
      "SELECT COUNT(*) as count FROM articles WHERE status = 'published'",
    );
    const draftCount = await runSingle(
      "SELECT COUNT(*) as count FROM articles WHERE status = 'draft'",
    );
    const reviewCount = await runSingle(
      "SELECT COUNT(*) as count FROM articles WHERE status = 'under_review'",
    );
    const scheduledCount = await runSingle(
      "SELECT COUNT(*) as count FROM articles WHERE status = 'scheduled'",
    );
    const totalViews = await runSingle('SELECT COALESCE(SUM(views), 0) as total FROM articles');
    const categoryCounts = await runQuery(
      'SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY count DESC',
    );
    const authorCounts = await runQuery(
      "SELECT primary_author as author, COUNT(*) as article_count, COALESCE(SUM(views), 0) as total_views FROM articles WHERE primary_author != '' GROUP BY primary_author ORDER BY article_count DESC LIMIT 5",
    );
    const recentArticles = await runQuery(
      'SELECT id, slug, title, excerpt, category, image, author, primary_author, status, views, created_at FROM articles ORDER BY created_at DESC LIMIT 5',
    );

    sendSuccess(res, {
      totalArticles: totalArticles?.count || 0,
      publishedCount: publishedCount?.count || 0,
      draftCount: draftCount?.count || 0,
      reviewCount: reviewCount?.count || 0,
      scheduledCount: scheduledCount?.count || 0,
      totalViews: totalViews?.total || 0,
      categoryCounts,
      authorCounts,
      recentArticles,
    });
  } catch (error) {
    sendError(res, 'Gagal mengambil statistik artikel', 500);
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await runSingle('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
    if (!article) return sendError(res, 'Artikel tidak ditemukan', 404);

    // Preview mode: bypass status check for admin tokens.
    // Uses authenticate middleware inline to avoid duplicating JWT verification.
    const isPreview = req.query.preview === '1';
    if (isPreview) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Preview membutuhkan autentikasi admin.', 401);
      }
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../config/secrets');
        const token = authHeader.slice(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
          return sendError(res, 'Preview hanya untuk admin.', 403);
        }
        if (await isTokenRevoked(token)) {
          return sendError(res, 'Token telah dicabut. Silakan login kembali.', 401);
        }
      } catch {
        return sendError(res, 'Token tidak valid untuk preview.', 401);
      }
      sendSuccess(res, article);
      return;
    }

    // Public: only show published articles
    if (article.status !== 'published') {
      return sendError(res, 'Artikel tidak ditemukan', 404);
    }

    await runExecute('UPDATE articles SET views = views + 1 WHERE slug = ?', [req.params.slug]);
    article.views = (article.views || 0) + 1;

    sendSuccess(res, article);
  } catch (error) {
    sendError(res, 'Gagal mengambil data artikel', 500);
  }
});

module.exports = router;
