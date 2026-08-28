const express = require('express');
const router = express.Router();
const { runQuery, runSingle } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { sanitizeHTML, stripTags } = require('../../services/htmlSanitizer');
const {
  uuidv4,
  nowIso,
  asyncHandler,
  listResource,
  insertRow,
  updateRow,
  deleteRow,
  findRow,
  pickDefined,
  requireFields,
  makeUniqueSlug,
  jsonField,
  boolField,
  logAdminAction,
  recordActivity,
  countWhere,
  sumColumn,
  groupCount,
} = require('./_helpers');
const { broadcast: broadcastEventChange } = require('../../services/sseBroadcaster');

const ARTICLE_STATUSES = ['draft', 'under_review', 'scheduled', 'published', 'archived'];

/* ══════════════════════════ ARTICLES ══════════════════════════ */

/**
 * GET /api/admin/newsroom/articles
 */
router.get(
  '/articles',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'articles',
      query: req.query,
      columns: `id, slug, title, subtitle, excerpt, category, content_type, tags, image, featured_image,
        thumbnail, author, primary_author, co_author, read_time, status, views, show_on_homepage,
        featured_article, breaking_news_banner, scheduled_at, published_at, created_at, updated_at,
        edited_by, edited_at`,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'contentType', column: 'content_type' },
        { param: 'author', column: 'primary_author' },
        { param: 'featured', type: 'boolean', column: 'featured_article' },
        {
          param: 'search',
          type: 'search',
          columns: ['title', 'excerpt', 'subtitle', 'primary_author'],
        },
        { param: 'dateFrom', type: 'dateFrom', column: 'created_at' },
        { param: 'dateTo', type: 'dateTo', column: 'created_at' },
      ],
      allowedSort: ['created_at', 'published_at', 'title', 'views', 'status', 'category'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

/**
 * GET /api/admin/newsroom/articles/stats
 */
router.get(
  '/articles/stats',
  asyncHandler(async (req, res) => {
    const [
      total,
      published,
      draft,
      underReview,
      scheduled,
      archived,
      totalViews,
      categoryBreakdown,
      statusBreakdown,
      authorBreakdown,
      monthlyPublished,
      topArticles,
      recentArticles,
    ] = await Promise.all([
      countWhere('articles'),
      countWhere('articles', " WHERE status = 'published'"),
      countWhere('articles', " WHERE status = 'draft'"),
      countWhere('articles', " WHERE status = 'under_review'"),
      countWhere('articles', " WHERE status = 'scheduled'"),
      countWhere('articles', " WHERE status = 'archived'"),
      sumColumn('articles', 'views'),
      groupCount('articles', 'category'),
      groupCount('articles', 'status'),
      runQuery(
        `SELECT primary_author AS author, COUNT(*) AS article_count, COALESCE(SUM(views), 0) AS total_views
         FROM articles WHERE primary_author != '' GROUP BY primary_author
         ORDER BY article_count DESC LIMIT 10`,
      ),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM articles GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT id, slug, title, category, views, status, created_at FROM articles
         WHERE status = 'published' ORDER BY views DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, slug, title, category, status, views, primary_author, created_at
         FROM articles ORDER BY created_at DESC LIMIT 8`,
      ),
    ]);

    const currentPeriodViews = await runSingle(
      `SELECT COALESCE(SUM(views), 0) AS total FROM articles WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    );
    const previousPeriodViews = await runSingle(
      `SELECT COALESCE(SUM(views), 0) AS total FROM articles
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    );
    const currentPeriodCount = await countWhere(
      'articles',
      ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
    );
    const previousPeriodCount = await countWhere(
      'articles',
      ' WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)',
    );

    const percentChange = (current, previous) =>
      previous > 0
        ? Number((((current - previous) / previous) * 100).toFixed(1))
        : current > 0
          ? 100
          : 0;

    sendSuccess(res, {
      total,
      published,
      draft,
      underReview,
      scheduled,
      archived,
      totalViews,
      averageViews: total > 0 ? Math.round(totalViews / total) : 0,
      articleGrowthPercentage: percentChange(currentPeriodCount, previousPeriodCount),
      viewsGrowthPercentage: percentChange(
        Number(currentPeriodViews?.total || 0),
        Number(previousPeriodViews?.total || 0),
      ),
      categoryBreakdown: categoryBreakdown.map((r) => ({
        category: r.label,
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      authorBreakdown: authorBreakdown.map((r) => ({
        author: r.author,
        articleCount: Number(r.article_count),
        totalViews: Number(r.total_views),
      })),
      monthlyPublished: monthlyPublished.map((r) => ({ month: r.month, count: Number(r.count) })),
      topArticles,
      recentArticles,
    });
  }),
);

/**
 * GET /api/admin/newsroom/articles/:id
 * Menerima id maupun slug agar editor tidak gagal memuat data.
 */
router.get(
  '/articles/:id',
  asyncHandler(async (req, res) => {
    const article = await runSingle('SELECT * FROM articles WHERE id = ? OR slug = ?', [
      req.params.id,
      req.params.id,
    ]);
    if (!article) return sendError(res, 'Artikel tidak ditemukan.', 404);
    sendSuccess(res, article);
  }),
);

const articleFieldMapping = {
  title: 'title',
  subtitle: 'subtitle',
  excerpt: 'excerpt',
  content: { key: 'content', transform: (v) => sanitizeHTML(v || '') },
  category: 'category',
  content_type: 'contentType',
  tags: { key: 'tags', transform: (v) => jsonField(v, []) },
  image: 'image',
  featured_image: 'featuredImage',
  thumbnail: 'thumbnail',
  image_gallery: { key: 'imageGallery', transform: (v) => jsonField(v, []) },
  author: 'author',
  primary_author: 'primaryAuthor',
  co_author: 'coAuthor',
  read_time: 'readTime',
  status: 'status',
  show_on_homepage: { key: 'showOnHomepage', transform: (v) => boolField(v, 1) },
  featured_article: { key: 'featuredArticle', transform: (v) => boolField(v, 0) },
  breaking_news_banner: { key: 'breakingNewsBanner', transform: (v) => boolField(v, 0) },
  seo_title: 'seoTitle',
  meta_description: 'metaDescription',
  og_image: 'ogImage',
  canonical_url: 'canonicalUrl',
  scheduled_at: 'scheduledAt',
  edited_by: 'editedBy',
  edited_at: 'editedAt',
};

/**
 * POST /api/admin/newsroom/articles
 */
router.post(
  '/articles',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title', 'category']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const status = req.body.status || 'draft';
    if (!ARTICLE_STATUSES.includes(status))
      return sendError(res, 'Status artikel tidak valid.', 400);

    const id = uuidv4();
    const now = nowIso();
    const slug = await makeUniqueSlug('articles', req.body.slug || req.body.title);

    await insertRow('articles', {
      id,
      slug,
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      excerpt: req.body.excerpt || '',
      content: sanitizeHTML(req.body.content || ''),
      category: req.body.category,
      content_type: req.body.contentType || 'Article',
      tags: jsonField(req.body.tags, []),
      image: req.body.image || '',
      featured_image: req.body.featuredImage || '',
      thumbnail: req.body.thumbnail || '',
      image_gallery: jsonField(req.body.imageGallery, []),
      author: req.body.author || req.user?.fullName || '',
      primary_author: req.body.primaryAuthor || req.user?.fullName || '',
      co_author: req.body.coAuthor || '',
      read_time: req.body.readTime || '',
      status,
      views: 0,
      show_on_homepage: boolField(req.body.showOnHomepage, 1),
      featured_article: boolField(req.body.featuredArticle, 0),
      breaking_news_banner: boolField(req.body.breakingNewsBanner, 0),
      seo_title: req.body.seoTitle || '',
      meta_description: req.body.metaDescription || '',
      og_image: req.body.ogImage || '',
      canonical_url: req.body.canonicalUrl || '',
      scheduled_at: req.body.scheduledAt || '',
      published_at: status === 'published' ? now : req.body.scheduledAt || '',
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'articles',
      resourceId: id,
      summary: `Membuat artikel ${req.body.title}`,
    });
    if (status === 'published') {
      await recordActivity({
        type: 'article_published',
        title: 'Artikel baru dipublikasikan',
        description: `${req.body.title} telah dipublikasikan.`,
      });
    }

    sendSuccess(res, { id, slug }, 201);
  }),
);

/**
 * PUT /api/admin/newsroom/articles/:id
 */
router.put(
  '/articles/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('articles', req.params.id);
    if (!existing) return sendError(res, 'Artikel tidak ditemukan.', 404);

    if (req.body.status && !ARTICLE_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status artikel tidak valid.', 400);
    }

    const payload = pickDefined(req.body, articleFieldMapping);

    if (req.body.title && req.body.title !== existing.title) {
      payload.slug = await makeUniqueSlug('articles', req.body.title, req.params.id);
    } else if (req.body.slug && req.body.slug !== existing.slug) {
      payload.slug = await makeUniqueSlug('articles', req.body.slug, req.params.id);
    }

    const nextStatus = req.body.status ?? existing.status;
    if (nextStatus === 'published' && existing.status !== 'published') {
      payload.published_at = nowIso();
    }

    // Catat siapa yang terakhir mengedit artikel.
    if (req.user?.fullName) {
      payload.edited_by = req.user.fullName;
      payload.edited_at = nowIso();
    }

    payload.updated_at = nowIso();
    await updateRow('articles', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'articles',
      resourceId: req.params.id,
      summary: `Memperbarui artikel ${req.body.title || existing.title}`,
    });

    const updated = await findRow('articles', req.params.id);
    sendSuccess(res, { id: updated.id, slug: updated.slug });
  }),
);

/**
 * PATCH /api/admin/newsroom/articles/:id/status
 */
router.patch(
  '/articles/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!ARTICLE_STATUSES.includes(status))
      return sendError(res, 'Status artikel tidak valid.', 400);

    const existing = await findRow('articles', req.params.id, 'id, title, status, published_at');
    if (!existing) return sendError(res, 'Artikel tidak ditemukan.', 404);

    const payload = { status, updated_at: nowIso() };
    if (status === 'published' && existing.status !== 'published') payload.published_at = nowIso();

    await updateRow('articles', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'articles',
      resourceId: req.params.id,
      summary: `Mengubah status artikel ${existing.title} menjadi ${status}`,
    });

    sendSuccess(res, { id: req.params.id, status });
  }),
);

/**
 * DELETE /api/admin/newsroom/articles/:id
 */
router.delete(
  '/articles/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('articles', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Artikel tidak ditemukan.', 404);

    await deleteRow('articles', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'articles',
      resourceId: req.params.id,
      summary: `Menghapus artikel ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ TOPICS ══════════════════════════ */

router.get(
  '/topics',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'topics',
      query: req.query,
      filters: [{ param: 'search', type: 'search', columns: ['title', 'description'] }],
      allowedSort: ['created_at', 'title', 'article_count', 'webinar_count'],
      defaultSort: 'article_count',
      defaultLimit: 50,
    });

    const totalArticles = await countWhere('articles');
    const items = result.items.map((topic) => ({
      ...topic,
      sharePercentage:
        totalArticles > 0
          ? Number(((Number(topic.article_count) / totalArticles) * 100).toFixed(1))
          : 0,
    }));

    sendSuccess(res, { ...result, items });
  }),
);

router.get(
  '/topics/:id',
  asyncHandler(async (req, res) => {
    const topic = await findRow('topics', req.params.id);
    if (!topic) return sendError(res, 'Topik tidak ditemukan.', 404);
    sendSuccess(res, topic);
  }),
);

router.post(
  '/topics',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    await insertRow('topics', {
      id,
      title: req.body.title,
      description: req.body.description || '',
      article_count: Number(req.body.articleCount || 0),
      webinar_count: Number(req.body.webinarCount || 0),
      categories: jsonField(req.body.categories, []),
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'topics',
      resourceId: id,
      summary: `Membuat topik ${req.body.title}`,
    });
    sendSuccess(res, await findRow('topics', id), 201);
  }),
);

router.put(
  '/topics/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('topics', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Topik tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      title: 'title',
      description: 'description',
      article_count: { key: 'articleCount', transform: (v) => Number(v || 0) },
      webinar_count: { key: 'webinarCount', transform: (v) => Number(v || 0) },
      categories: { key: 'categories', transform: (v) => jsonField(v, []) },
    });

    await updateRow('topics', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'topics',
      resourceId: req.params.id,
      summary: `Memperbarui topik ${existing.title}`,
    });

    sendSuccess(res, await findRow('topics', req.params.id));
  }),
);

router.delete(
  '/topics/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('topics', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Topik tidak ditemukan.', 404);

    await deleteRow('topics', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'topics',
      resourceId: req.params.id,
      summary: `Menghapus topik ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ WEBINARS ══════════════════════════ */

router.get(
  '/webinars/stats',
  asyncHandler(async (req, res) => {
    const [
      total,
      published,
      draft,
      freeCount,
      paidCount,
      totalRegistered,
      categoryBreakdown,
      statusBreakdown,
      monthlyWebinars,
    ] = await Promise.all([
      countWhere('webinars'),
      countWhere('webinars', " WHERE status = 'published'"),
      countWhere('webinars', " WHERE status = 'draft'"),
      countWhere('webinars', ' WHERE is_free = 1'),
      countWhere('webinars', ' WHERE is_free = 0'),
      sumColumn('webinars', 'registered_count'),
      groupCount('webinars', 'category'),
      groupCount('webinars', 'status'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM webinars GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
    ]);

    sendSuccess(res, {
      total,
      published,
      draft,
      freeCount,
      paidCount,
      totalRegistered,
      categoryBreakdown: categoryBreakdown.map((r) => ({
        category: r.label,
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      monthlyWebinars: monthlyWebinars.map((r) => ({ month: r.month, count: Number(r.count) })),
    });
  }),
);

router.get(
  '/webinars',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'webinars',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'isFree', type: 'boolean', column: 'is_free' },
        { param: 'search', type: 'search', columns: ['title', 'description', 'category'] },
      ],
      allowedSort: ['created_at', 'title', 'schedule_date', 'price', 'registered_count'],
      defaultSort: 'schedule_date',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/webinars/:id',
  asyncHandler(async (req, res) => {
    const webinar = await runSingle('SELECT * FROM webinars WHERE id = ? OR slug = ?', [
      req.params.id,
      req.params.id,
    ]);
    if (!webinar) return sendError(res, 'Webinar tidak ditemukan.', 404);
    sendSuccess(res, webinar);
  }),
);

router.post(
  '/webinars',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title', 'category']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    const now = nowIso();
    const slug = await makeUniqueSlug('webinars', req.body.slug || req.body.title);

    await insertRow('webinars', {
      id,
      slug,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description || '',
      duration: req.body.duration || '',
      price: Number(req.body.price || 0),
      is_free: boolField(req.body.isFree, Number(req.body.price || 0) === 0 ? 1 : 0),
      image: req.body.image || '',
      schedule_date: req.body.scheduleDate || '',
      schedule_time: req.body.scheduleTime || '',
      topics: jsonField(req.body.topics, []),
      mentors: jsonField(req.body.mentors, []),
      timeline: jsonField(req.body.timeline, []),
      benefits: jsonField(req.body.benefits, []),
      status: req.body.status || 'published',
      quota: Number(req.body.quota || 0),
      registered_count: 0,
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'webinars',
      resourceId: id,
      summary: `Membuat webinar ${req.body.title}`,
    });
    sendSuccess(res, { id, slug }, 201);
  }),
);

router.put(
  '/webinars/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('webinars', req.params.id, 'id, title, slug');
    if (!existing) return sendError(res, 'Webinar tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      title: 'title',
      category: 'category',
      description: 'description',
      duration: 'duration',
      price: { key: 'price', transform: (v) => Number(v || 0) },
      is_free: { key: 'isFree', transform: (v) => boolField(v, 0) },
      image: 'image',
      schedule_date: 'scheduleDate',
      schedule_time: 'scheduleTime',
      topics: { key: 'topics', transform: (v) => jsonField(v, []) },
      mentors: { key: 'mentors', transform: (v) => jsonField(v, []) },
      timeline: { key: 'timeline', transform: (v) => jsonField(v, []) },
      benefits: { key: 'benefits', transform: (v) => jsonField(v, []) },
      status: 'status',
      quota: { key: 'quota', transform: (v) => Number(v || 0) },
      registered_count: { key: 'registeredCount', transform: (v) => Number(v || 0) },
    });

    if (req.body.title && req.body.title !== existing.title) {
      payload.slug = await makeUniqueSlug('webinars', req.body.title, req.params.id);
    }

    payload.updated_at = nowIso();
    await updateRow('webinars', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'webinars',
      resourceId: req.params.id,
      summary: `Memperbarui webinar ${req.body.title || existing.title}`,
    });

    sendSuccess(res, await findRow('webinars', req.params.id));
  }),
);

/**
 * PATCH /api/admin/newsroom/webinars/:id/status
 */
router.patch(
  '/webinars/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['draft', 'published'].includes(status))
      return sendError(res, 'Status webinar tidak valid.', 400);

    const existing = await findRow('webinars', req.params.id, 'id, title, status');
    if (!existing) return sendError(res, 'Webinar tidak ditemukan.', 404);

    const payload = { status, updated_at: nowIso() };
    await updateRow('webinars', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'webinars',
      resourceId: req.params.id,
      summary: `Mengubah status webinar ${existing.title} menjadi ${status}`,
    });

    sendSuccess(res, { id: req.params.id, status });
  }),
);

/**
 * DELETE /api/admin/newsroom/webinars/:id
 *
 * `certificates.reference_id` bersifat polimorfik (dapat menunjuk webinar,
 * event, atau pendaftaran magang) sehingga tidak dapat memakai foreign key.
 * Pemeriksaan manual diperlukan agar sertifikat tidak kehilangan acuan.
 */
router.delete(
  '/webinars/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('webinars', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Webinar tidak ditemukan.', 404);

    const certificateCount = await countWhere(
      'certificates',
      " WHERE reference_id = ? AND program_type = 'webinar'",
      [req.params.id],
    );
    const force = String(req.query.force || '').toLowerCase() === 'true';

    if (certificateCount > 0 && !force) {
      return sendError(
        res,
        `Webinar masih menjadi acuan ${certificateCount} sertifikat. ` +
          `Kirim ulang dengan ?force=true untuk melanjutkan.`,
        409,
        { dependencies: [{ label: 'sertifikat', table: 'certificates', count: certificateCount }] },
      );
    }

    await deleteRow('webinars', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'webinars',
      resourceId: req.params.id,
      summary: `Menghapus webinar ${existing.title}`,
      metadata: { forced: force, certificateCount },
    });

    sendSuccess(res, { id: req.params.id, deleted: true, affectedCertificates: certificateCount });
  }),
);

/* ══════════════════════════ EVENTS ══════════════════════════ */

router.get(
  '/events/stats',
  asyncHandler(async (req, res) => {
    const [
      total,
      published,
      draft,
      freeCount,
      paidCount,
      featuredCount,
      categoryBreakdown,
      statusBreakdown,
      monthlyEvents,
    ] = await Promise.all([
      countWhere('events'),
      countWhere('events', " WHERE status = 'published'"),
      countWhere('events', " WHERE status = 'draft'"),
      countWhere('events', " WHERE access_type = 'FREE'"),
      countWhere('events', " WHERE access_type != 'FREE'"),
      countWhere('events', ' WHERE is_featured = 1'),
      groupCount('events', 'category'),
      groupCount('events', 'status'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM events GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
    ]);

    sendSuccess(res, {
      total,
      published,
      draft,
      freeCount,
      paidCount,
      featuredCount,
      categoryBreakdown: categoryBreakdown.map((r) => ({
        category: r.label,
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      monthlyEvents: monthlyEvents.map((r) => ({ month: r.month, count: Number(r.count) })),
    });
  }),
);

router.get(
  '/events',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'events',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'accessType', column: 'access_type' },
        { param: 'featured', type: 'boolean', column: 'is_featured' },
        { param: 'search', type: 'search', columns: ['title', 'description', 'location'] },
      ],
      allowedSort: ['created_at', 'event_date', 'title'],
      defaultSort: 'event_date',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/events/:id',
  asyncHandler(async (req, res) => {
    const event = await findRow('events', req.params.id);
    if (!event) return sendError(res, 'Event tidak ditemukan.', 404);
    sendSuccess(res, event);
  }),
);

router.post(
  '/events',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title', 'eventDate']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    const now = nowIso();

    await insertRow('events', {
      id,
      title: req.body.title,
      category: req.body.category || '',
      description: req.body.description || '',
      event_date: req.body.eventDate,
      event_time: req.body.eventTime || '',
      location: req.body.location || '',
      image: req.body.image || '',
      is_featured: boolField(req.body.isFeatured, 0),
      access_type: req.body.accessType || 'FREE',
      status: req.body.status || 'published',
      quota: Number(req.body.quota || 0),
      price: Number(req.body.price || 0),
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'events',
      resourceId: id,
      summary: `Membuat event ${req.body.title}`,
    });
    sendSuccess(res, await findRow('events', id), 201);

    broadcastEventChange('event:created', { eventId: id });
  }),
);

router.put(
  '/events/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('events', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Event tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      title: 'title',
      category: 'category',
      description: 'description',
      event_date: 'eventDate',
      event_time: 'eventTime',
      location: 'location',
      image: 'image',
      is_featured: { key: 'isFeatured', transform: (v) => boolField(v, 0) },
      access_type: 'accessType',
      status: 'status',
      quota: { key: 'quota', transform: (v) => Number(v || 0) },
      price: { key: 'price', transform: (v) => Number(v || 0) },
    });

    payload.updated_at = nowIso();
    await updateRow('events', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'events',
      resourceId: req.params.id,
      summary: `Memperbarui event ${req.body.title || existing.title}`,
    });

    sendSuccess(res, await findRow('events', req.params.id));

    broadcastEventChange('event:updated', { eventId: req.params.id });
  }),
);

/**
 * PATCH /api/admin/newsroom/events/:id/status
 */
router.patch(
  '/events/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['draft', 'published'].includes(status))
      return sendError(res, 'Status event tidak valid.', 400);

    const existing = await findRow('events', req.params.id, 'id, title, status');
    if (!existing) return sendError(res, 'Event tidak ditemukan.', 404);

    const payload = { status, updated_at: nowIso() };
    await updateRow('events', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update_status',
      resource: 'events',
      resourceId: req.params.id,
      summary: `Mengubah status event ${existing.title} menjadi ${status}`,
    });

    sendSuccess(res, { id: req.params.id, status });

    broadcastEventChange('event:updated', { eventId: req.params.id, status });
  }),
);

/**
 * DELETE /api/admin/newsroom/events/:id
 *
 * Sama seperti webinar, sertifikat dapat mengacu ke event melalui
 * `reference_id` sehingga perlu pemeriksaan manual.
 */
router.delete(
  '/events/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('events', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Event tidak ditemukan.', 404);

    const certificateCount = await countWhere(
      'certificates',
      " WHERE reference_id = ? AND program_type = 'event'",
      [req.params.id],
    );
    const force = String(req.query.force || '').toLowerCase() === 'true';

    if (certificateCount > 0 && !force) {
      return sendError(
        res,
        `Event masih menjadi acuan ${certificateCount} sertifikat. ` +
          `Kirim ulang dengan ?force=true untuk melanjutkan.`,
        409,
        { dependencies: [{ label: 'sertifikat', table: 'certificates', count: certificateCount }] },
      );
    }

    await deleteRow('events', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'events',
      resourceId: req.params.id,
      summary: `Menghapus event ${existing.title}`,
      metadata: { forced: force, certificateCount },
    });

    sendSuccess(res, { id: req.params.id, deleted: true, affectedCertificates: certificateCount });

    broadcastEventChange('event:deleted', { eventId: req.params.id });
  }),
);

/* ══════════════════════════ EVENT REGISTRATIONS (ADMIN) ══════════════════════════ */

router.get(
  '/events/:eventId/registrations',
  asyncHandler(async (req, res) => {
    const { runQuery: rq } = require('../../config/database');

    const registrations = await rq(
      'SELECT * FROM event_registrations WHERE event_id = ? ORDER BY created_at DESC',
      [req.params.eventId],
    );

    const payments = await rq(
      'SELECT * FROM event_payments WHERE event_id = ? ORDER BY created_at DESC',
      [req.params.eventId],
    );

    sendSuccess(res, { registrations, payments });
  }),
);

module.exports = router;
