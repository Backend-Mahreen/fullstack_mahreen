const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicReadLimiter, publicFormLimiter } = require('../middleware/rateLimit');
const { authenticate, authorize } = require('../middleware/auth');
const { requireNonEmptyHeader } = require('../middleware/csrf');
const { validateLengths } = require('../utils/validateLengths');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { getOrSet, newsroomCache } = require('../utils/cache');

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// DB menyimpan status huruf kecil (draft|under_review|scheduled|published|
// archived). Frontend memakai enum kapital "Draft"|"Scheduled"|"Published".
// Adapter dua arah agar view client tidak pernah salah filter.
const DB_TO_CLIENT_STATUS = {
  draft: 'Draft',
  under_review: 'Under Review',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Draft',
};
const CLIENT_TO_DB_STATUS = {
  Draft: 'draft',
  Scheduled: 'scheduled',
  Published: 'published',
  'Under Review': 'under_review',
};
const toClientStatus = (dbStatus) =>
  DB_TO_CLIENT_STATUS[String(dbStatus || '').toLowerCase()] || 'Draft';
const toDbStatus = (value) => {
  const raw = String(value || '').trim();
  if (CLIENT_TO_DB_STATUS[raw]) return CLIENT_TO_DB_STATUS[raw];
  const lower = raw.toLowerCase();
  return DB_TO_CLIENT_STATUS[lower] ? lower : 'draft';
};

// Kolom tags/image_gallery bertipe JSON. Frontend mengirim string ("" atau
// CSV) maupun array. Normalkan ke JSON valid agar INSERT tidak 500.
const normalizeTagsForDb = (tags) => {
  if (Array.isArray(tags)) return JSON.stringify(tags);
  if (typeof tags === 'string') {
    const trimmed = tags.trim();
    if (!trimmed) return JSON.stringify([]);
    try {
      const parsed = JSON.parse(trimmed);
      return JSON.stringify(Array.isArray(parsed) ? parsed : [String(parsed)]);
    } catch {
      return JSON.stringify(
        trimmed
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      );
    }
  }
  return JSON.stringify([]);
};

// Tags dari DB (JSON string/array) -> string CSV yang diharapkan frontend.
const tagsFromDb = (tags) => {
  if (Array.isArray(tags)) return tags.join(', ');
  if (typeof tags === 'string') {
    const trimmed = tags.trim();
    if (!trimmed) return '';
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
    } catch {
      return trimmed;
    }
  }
  return '';
};

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Konten artikel disimpan sebagai JSON { editorContent, content }.
 * - editorContent : teks mentah editor (markdown ringan) agar round-trip edit
 *   kembali ke editor tanpa kehilangan format.
 * - content       : struktur { lead, sections, quote, figure } yang dirender
 *   halaman publik.
 * Fallback untuk data lama (HTML dari route admin lain, teks polos, atau NULL
 * dari seed) agar artikel tetap terbaca.
 */
const decodeArticleContent = (row) => {
  const raw = row.content;
  if (raw && typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.content &&
        typeof parsed.content === 'object' &&
        Array.isArray(parsed.content.sections)
      ) {
        return {
          editorContent: typeof parsed.editorContent === 'string' ? parsed.editorContent : '',
          content: parsed.content,
        };
      }
    } catch {
      // Bukan JSON — lanjut ke fallback di bawah.
    }
  }

  const plain = raw && !String(raw).trim().startsWith('<') ? String(raw).trim() : '';
  return {
    editorContent: plain,
    content: {
      lead: row.excerpt || '',
      sections: plain
        ? [
            {
              heading: 'Isi Artikel',
              paragraphs: plain
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean),
            },
          ]
        : [],
    },
  };
};

const encodeArticleContent = (article) => {
  const source = article.content;
  const contentShape =
    source && typeof source === 'object' && !Array.isArray(source)
      ? {
          lead: typeof source.lead === 'string' ? source.lead : article.excerpt || '',
          sections: Array.isArray(source.sections)
            ? source.sections
                .filter((section) => section && typeof section === 'object')
                .map((section) => ({
                  heading: typeof section.heading === 'string' ? section.heading : 'Isi Artikel',
                  paragraphs: Array.isArray(section.paragraphs)
                    ? section.paragraphs.filter((paragraph) => typeof paragraph === 'string')
                    : [],
                }))
            : [],
          ...(source.quote && typeof source.quote === 'object' ? { quote: source.quote } : {}),
          ...(source.figure && typeof source.figure === 'object' ? { figure: source.figure } : {}),
        }
      : { lead: article.excerpt || '', sections: [] };

  return JSON.stringify({
    editorContent: typeof article.editorContent === 'string' ? article.editorContent : '',
    content: contentShape,
  });
};

const INDONESIAN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

// Tanggal tampilan "15 Agu 2026" — konsisten dengan format yang dipakai
// editor frontend, dan lebih terbaca daripada ISO mentah di halaman publik.
const formatDisplayDate = (value) => {
  if (!value) return '';
  let parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  // Hindari pergeseran hari untuk string tanggal murni "YYYY-MM-DD".
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    parsed = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  }
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${day} ${INDONESIAN_MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
};

// Row DB -> record client (NewsroomArticleRecord). Seluruh field editor
// dikembalikan agar edit + publikasi tidak kehilangan data.
const mapArticleRow = (a) => {
  const { editorContent, content } = decodeArticleContent(a);
  const gallery = parseJsonArray(a.image_gallery)
    .filter((item) => item && item.src)
    .map((item) => ({ src: item.src, alt: item.alt || '' }));

  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    detailTitle: a.title,
    subtitle: a.subtitle || '',
    excerpt: a.excerpt || '',
    category: a.category || '',
    publishedAt: formatDisplayDate(a.published_at || a.created_at),
    readTime: a.read_time || '5 min',
    image: a.image || '',
    thumbnail: a.thumbnail || '',
    gallery,
    author: a.primary_author || a.author || 'Mahreen Team',
    featured: Boolean(a.featured_article) || Boolean(a.show_on_homepage),
    viewCount: a.views || 0,
    publicationStatus: toClientStatus(a.status),
    contentType: a.content_type || 'Article',
    categories: [a.category].filter(Boolean),
    tags: tagsFromDb(a.tags),
    coAuthor: a.co_author || '',
    editorContent,
    seo: {
      title: a.seo_title || a.title,
      description: a.meta_description || a.excerpt || '',
      ogImageUrl: a.og_image || a.image || '',
      canonicalUrl: a.canonical_url || '',
    },
    visibility: {
      showHomepage: Boolean(a.show_on_homepage),
      featuredArticle: Boolean(a.featured_article),
      breakingNews: Boolean(a.breaking_news_banner),
    },
    source: 'api',
    releaseAt: a.scheduled_at || a.published_at || a.created_at || '',
    createdAt: a.created_at || '',
    updatedAt: a.updated_at || '',
    content,
  };
};

// Slug UNIQUE: tambahkan akhiran numerik bila bertabrakan dengan artikel lain,
// agar menyimpan artikel tidak menimpa atau gagal (duplicate key).
// Dibatasi iterasi untuk mencegah loop tak berujung pada kondisi abnormal.
const ensureUniqueSlug = async (baseSlug, excludeId) => {
  for (let counter = 1; counter <= 100; counter += 1) {
    const candidate = counter === 1 ? baseSlug : `${baseSlug}-${counter}`;
    const clash = excludeId
      ? await runSingle('SELECT id FROM articles WHERE slug = ? AND id != ?', [
          candidate,
          excludeId,
        ])
      : await runSingle('SELECT id FROM articles WHERE slug = ?', [candidate]);
    if (!clash) return candidate;
  }
  return `${baseSlug}-${Date.now()}`; // sangat jarang tercapai
};

router.get('/', publicReadLimiter, async (req, res) => {
  try {
    const includeAll = req.query.includeAll === 'true';
    const articlesStatusFilter = includeAll
      ? "status IN ('published','draft','scheduled','under_review')"
      : "status = 'published'";
    const result = await getOrSet(
      newsroomCache,
      includeAll ? 'newsroom-overview-all' : 'newsroom-overview',
      async () => {
        const [articles, events, webinars, topics, categories, settings, speakers] =
          await Promise.all([
            runQuery(
              `SELECT * FROM articles WHERE ${articlesStatusFilter} ORDER BY created_at DESC LIMIT 50`,
            ),
            runQuery(
              "SELECT * FROM events WHERE status = 'published' ORDER BY created_at DESC LIMIT 10",
            ),
            runQuery(
              "SELECT * FROM webinars WHERE status = 'published' ORDER BY created_at DESC LIMIT 10",
            ),
            runQuery('SELECT * FROM topics ORDER BY article_count DESC'),
            runQuery('SELECT * FROM categories ORDER BY display_order ASC, name ASC'),
            runQuery('SELECT * FROM newsroom_settings'),
            runQuery('SELECT * FROM speakers ORDER BY created_at DESC'),
          ]);

        const settingsMap = {};
        settings.forEach((s) => {
          settingsMap[s.setting_key] = s.setting_value;
        });

        return {
          schemaVersion: 1,
          featuredArticleSlug: settingsMap.featuredArticleSlug || '',
          articles: articles.map(mapArticleRow),
          events: events.map((e) => {
            const dateParts = String(e.event_date || '').split('-');
            const monthNames = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'Mei',
              'Jun',
              'Jul',
              'Agu',
              'Sep',
              'Okt',
              'Nov',
              'Des',
            ];
            const monthName = monthNames[Number(dateParts[1]) - 1] || '';
            return {
              id: e.id,
              numericId: Number(String(e.id).replace(/\D/g, '').slice(0, 9)) || 0,
              slug: e.id,
              title: e.title,
              description: e.description || '',
              image: e.image || '',
              access: e.access_type || 'FREE',
              category: e.category || '',
              dateLabel: [dateParts[2], monthName, dateParts[0]].filter(Boolean).join(' '),
              dateValue: e.event_date || '',
              day: dateParts[2] || '',
              month: monthName,
              year: dateParts[0] || '',
              time: e.event_time || '',
              location: e.location || '',
              href: `/newsroom/events/${encodeURIComponent(e.id)}`,
              action: 'Detail Event',
              featured: Boolean(e.is_featured),
              price: Number(e.price || 0),
            };
          }),
          webinarCards: webinars.map((w) => ({
            id: w.id,
            slug: w.slug,
            title: w.title,
            description: w.description || '',
            image: w.image || '',
            category: w.category || '',
            price: w.price || 0,
            status: w.status || 'published',
          })),
          topics: topics.map((t) => ({
            id: t.id,
            name: t.title,
            slug: t.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
            articleCount: t.article_count || 0,
            webinarCount: t.webinar_count || 0,
          })),
          speakers: speakers.map((s) => ({
            name: s.name,
            role: s.role || '',
            description: s.description || '',
            image: s.image || '',
          })),
          categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            displayOrder: c.display_order,
          })),
          settings: settingsMap,
          navigation: [
            { label: 'Beranda', href: '/newsroom', iconKey: 'trending' },
            { label: 'Tags', href: '/newsroom/tags', iconKey: 'tag' },
            { label: 'Event', href: '/newsroom/events', iconKey: 'calendar' },
            { label: 'Verifikasi', href: '/newsroom/verifikasi-dokumen', iconKey: 'verification' },
          ],
          announcements: [],
        };
      },
    );

    sendSuccess(res, result);
  } catch (error) {
    logger.error(error, 'newsroom');
    sendError(res, 'Gagal mengambil data newsroom', 500);
  }
});

router.post('/articles', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const article = req.body || {};
    if (!article.title) return sendError(res, 'Judul artikel wajib diisi', 400);

    // Tolak gambar base64/data URL: gambar harus diunggah lebih dulu via
    // POST /api/uploads dan hanya URL-nya ("/uploads/...") yang disimpan.
    const isDataUrl = (v) => typeof v === 'string' && v.startsWith('data:');
    if (
      isDataUrl(article.image) ||
      isDataUrl(article.thumbnail) ||
      isDataUrl(article.featuredImage)
    ) {
      return sendError(
        res,
        'Gambar harus diunggah terlebih dahulu; kirim URL hasil unggahan, bukan data base64.',
        400,
      );
    }

    const now = new Date().toISOString();
    const dbStatus = toDbStatus(article.publicationStatus);
    const releaseAt = typeof article.releaseAt === 'string' ? article.releaseAt : '';
    const baseSlug = article.slug || slugify(article.title || 'untitled');

    // Cari berdasarkan id (dikirim editor) lalu fallback slug, agar mengubah
    // slug tidak membuat duplikat artikel.
    let existing = null;
    if (article.id) existing = await runSingle('SELECT * FROM articles WHERE id = ?', [article.id]);
    if (!existing) existing = await runSingle('SELECT * FROM articles WHERE slug = ?', [baseSlug]);

    const finalSlug = await ensureUniqueSlug(baseSlug, existing?.id);

    const image = article.image || article.featuredImage?.preview || existing?.image || '';
    const thumbnail = article.thumbnail?.preview || article.thumbnail || existing?.thumbnail || '';
    const author =
      article.author ||
      article.primaryAuthor ||
      existing?.author ||
      existing?.primary_author ||
      'Mahreen Team';
    const primaryAuthor =
      article.primaryAuthor ||
      article.author ||
      existing?.primary_author ||
      existing?.author ||
      author;
    const category =
      article.category || article.categories?.[0] || existing?.category || 'Artikel & Insight';

    const isPublished = dbStatus === 'published';
    const wasPublished = existing?.status === 'published';
    // Pertahankan tanggal terbit asli saat mengedit artikel yang sudah terbit.
    const scheduledAt = releaseAt || (dbStatus === 'scheduled' ? existing?.scheduled_at || '' : '');
    const publishedAt = isPublished
      ? wasPublished && existing?.published_at
        ? existing.published_at
        : releaseAt || now
      : existing?.published_at || '';

    const contentJson = encodeArticleContent(article);
    const tagsJson = normalizeTagsForDb(article.tags);
    const galleryJson = JSON.stringify(
      Array.isArray(article.gallery)
        ? article.gallery
            .filter((item) => item && item.src)
            .map((item) => ({ src: item.src, alt: item.alt || '' }))
        : [],
    );

    const showOnHomepage = article.visibility?.showHomepage ? 1 : 0;
    const featuredArticle = article.visibility?.featuredArticle ? 1 : 0;
    const breakingNews = article.visibility?.breakingNews ? 1 : 0;
    const seoTitle = article.seo?.title || existing?.seo_title || '';
    const metaDescription = article.seo?.description || existing?.meta_description || '';
    const ogImage = article.seo?.ogImageUrl || existing?.og_image || '';
    const canonicalUrl = article.seo?.canonicalUrl || existing?.canonical_url || '';
    const subtitle = article.subtitle ?? existing?.subtitle ?? '';
    const contentType = article.contentType || existing?.content_type || 'Article';
    const readTime = article.readTime || existing?.read_time || '';
    const coAuthor = article.coAuthor || existing?.co_author || '';
    const title = String(article.title || '').trim();

    let savedId = existing?.id;
    if (existing) {
      await runExecute(
        `UPDATE articles SET
          slug = ?, title = ?, subtitle = ?, excerpt = ?, content = ?, category = ?, content_type = ?,
          tags = ?, image = ?, featured_image = ?, thumbnail = ?, image_gallery = ?,
          author = ?, primary_author = ?, co_author = ?, read_time = ?, status = ?, views = ?,
          show_on_homepage = ?, featured_article = ?, breaking_news_banner = ?,
          seo_title = ?, meta_description = ?, og_image = ?, canonical_url = ?,
          scheduled_at = ?, published_at = ?, updated_at = ?
        WHERE id = ?`,
        [
          finalSlug,
          title,
          subtitle,
          article.excerpt || '',
          contentJson,
          category,
          contentType,
          tagsJson,
          image,
          article.featuredImage?.preview || existing?.featured_image || '',
          thumbnail,
          galleryJson,
          author,
          primaryAuthor,
          coAuthor,
          readTime,
          dbStatus,
          existing.views || 0,
          showOnHomepage,
          featuredArticle,
          breakingNews,
          seoTitle,
          metaDescription,
          ogImage,
          canonicalUrl,
          scheduledAt,
          publishedAt,
          now,
          existing.id,
        ],
      );
    } else {
      savedId = article.id || uuidv4();
      await runExecute(
        `INSERT INTO articles
          (id, slug, title, subtitle, excerpt, content, category, content_type, tags, image, featured_image,
           thumbnail, image_gallery, author, primary_author, co_author, read_time, status, views,
           show_on_homepage, featured_article, breaking_news_banner, seo_title, meta_description, og_image,
           canonical_url, scheduled_at, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          savedId,
          finalSlug,
          title,
          subtitle,
          article.excerpt || '',
          contentJson,
          category,
          contentType,
          tagsJson,
          image,
          article.featuredImage?.preview || '',
          thumbnail,
          galleryJson,
          author,
          primaryAuthor,
          coAuthor,
          readTime,
          dbStatus,
          showOnHomepage,
          featuredArticle,
          breakingNews,
          seoTitle,
          metaDescription,
          ogImage,
          canonicalUrl,
          scheduledAt,
          publishedAt,
          now,
          now,
        ],
      );
    }

    newsroomCache.clear();
    const saved = await runSingle('SELECT * FROM articles WHERE id = ? OR slug = ?', [
      savedId,
      finalSlug,
    ]);
    // Pertahankan source yang dikirim editor ("admin" untuk artikel baru agar
    // badge "Baru" tetap tampil); fallback berdasarkan status artikel.
    const responseSource =
      article.source === 'admin' || article.source === 'api'
        ? article.source
        : existing
          ? 'api'
          : 'admin';
    const response = saved
      ? { ...mapArticleRow(saved), source: responseSource }
      : {
          ...article,
          id: savedId,
          slug: finalSlug,
          publicationStatus: toClientStatus(dbStatus),
          updatedAt: now,
          source: responseSource,
        };
    sendSuccess(res, response, 201);
  } catch (error) {
    logger.error(error, 'newsroom');
    sendError(res, 'Gagal menyimpan artikel', 500);
  }
});

router.delete(
  '/articles/:slug',
  authenticate,
  authorize('admin', 'superadmin'),
  async (req, res) => {
    try {
      const result = await runExecute('DELETE FROM articles WHERE slug = ?', [req.params.slug]);
      if (result.affectedRows === 0) {
        return sendError(res, 'Artikel tidak ditemukan', 404);
      }
      newsroomCache.clear();
      sendSuccess(res, { message: 'Artikel berhasil dihapus' });
    } catch (error) {
      logger.error(error, 'newsroom');
      sendError(res, 'Gagal menghapus artikel', 500);
    }
  },
);

router.post('/articles/:slug/view', publicReadLimiter, async (req, res) => {
  try {
    const article = await runSingle('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
    if (!article) return sendSuccess(res, null);

    await runExecute('UPDATE articles SET views = views + 1 WHERE slug = ?', [req.params.slug]);
    const updated = await runSingle('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);

    sendSuccess(res, {
      id: updated.id,
      slug: updated.slug,
      title: updated.title,
      viewCount: updated.views || 0,
    });
  } catch (error) {
    logger.error(error, 'newsroom');
    sendError(res, 'Gagal mencatat view', 500);
  }
});

/**
 * GET /api/newsroom/articles/:slug/comments
 * Daftar komentar yang disetujui untuk sebuah artikel (publik).
 */
router.get('/articles/:slug/comments', publicReadLimiter, async (req, res) => {
  try {
    const article = await runSingle('SELECT id FROM articles WHERE slug = ?', [req.params.slug]);
    if (!article) return sendError(res, 'Artikel tidak ditemukan', 404);

    const comments = await runQuery(
      `SELECT id, author_name, content, created_at FROM article_comments
       WHERE article_id = ? AND status = 'approved' ORDER BY created_at ASC`,
      [article.id],
    );

    sendSuccess(res, comments);
  } catch (error) {
    logger.error(error, 'newsroom');
    sendError(res, 'Gagal mengambil komentar', 500);
  }
});

/**
 * POST /api/newsroom/articles/:slug/comments
 * Kirim komentar artikel (publik, auto-approve).
 */
router.post(
  '/articles/:slug/comments',
  requireNonEmptyHeader,
  publicFormLimiter,
  async (req, res) => {
    try {
      const article = await runSingle('SELECT id FROM articles WHERE slug = ?', [req.params.slug]);
      if (!article) return sendError(res, 'Artikel tidak ditemukan', 404);

      const { authorName, email, content } = req.body;
      if (!authorName || !content) return sendError(res, 'Nama dan isi komentar wajib diisi', 400);

      const lengthCheck = validateLengths({ fullName: authorName, email, message: content });
      if (!lengthCheck.valid) return sendError(res, lengthCheck.errors[0], 400);

      const id = uuidv4();
      const now = new Date().toISOString();

      await runExecute(
        `INSERT INTO article_comments (id, article_id, author_name, author_email, content, status, created_at) VALUES (?, ?, ?, ?, ?, 'approved', ?)`,
        [id, article.id, authorName, email || '', content, now],
      );

      sendSuccess(
        res,
        {
          id,
          authorName,
          content,
          createdAt: now,
        },
        201,
      );
    } catch (error) {
      logger.error(error, 'newsroom');
      sendError(res, 'Gagal menyimpan komentar', 500);
    }
  },
);

module.exports = router;
