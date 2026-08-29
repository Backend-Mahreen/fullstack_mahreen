const express = require('express');
const router = express.Router();
const { runQuery } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
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
  countWhere,
  sumColumn,
  groupCount,
} = require('./_helpers');

const PRODUCT_STATUSES = ['draft', 'published', 'archived', 'out_of_stock'];
const PORTFOLIO_STATUSES = ['draft', 'published', 'archived'];

/* ══════════════════════════ STATS ══════════════════════════ */

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      outOfStock,
      lowStock,
      featuredProducts,
      inventoryValue,
      totalStock,
      totalSold,
      categoryBreakdown,
      collectionBreakdown,
      statusBreakdown,
      totalPortfolios,
      publishedPortfolios,
      featuredPortfolios,
      portfolioCategories,
      totalCollectionCards,
      totalSpecializations,
      topProducts,
      recentProducts,
    ] = await Promise.all([
      countWhere('products'),
      countWhere('products', " WHERE status = 'published'"),
      countWhere('products', " WHERE status = 'draft'"),
      countWhere('products', ' WHERE stock <= 0'),
      countWhere('products', ' WHERE stock > 0 AND stock <= 10'),
      countWhere('products', ' WHERE is_featured = 1'),
      sumColumn('products', 'price * stock'),
      sumColumn('products', 'stock'),
      sumColumn('products', 'sold_count'),
      groupCount('products', 'category'),
      groupCount('products', 'collection_name'),
      groupCount('products', 'status'),
      countWhere('portfolios'),
      countWhere('portfolios', " WHERE status = 'published'"),
      countWhere('portfolios', ' WHERE is_featured = 1'),
      groupCount('portfolios', 'category'),
      countWhere('collection_cards'),
      countWhere('specializations'),
      runQuery(
        `SELECT id, slug, title, price, stock, sold_count, category FROM products
         ORDER BY sold_count DESC LIMIT 5`,
      ),
      runQuery(
        `SELECT id, slug, title, price, stock, status, category, created_at FROM products
         ORDER BY created_at DESC LIMIT 8`,
      ),
    ]);

    sendSuccess(res, {
      products: {
        total: totalProducts,
        published: publishedProducts,
        draft: draftProducts,
        outOfStock,
        lowStock,
        featured: featuredProducts,
        inventoryValue,
        totalStock,
        totalSold,
      },
      portfolios: {
        total: totalPortfolios,
        published: publishedPortfolios,
        featured: featuredPortfolios,
      },
      totalCollectionCards,
      totalSpecializations,
      categoryBreakdown: categoryBreakdown.map((r) => ({
        category: r.label || 'Lainnya',
        count: Number(r.count),
      })),
      collectionBreakdown: collectionBreakdown.map((r) => ({
        collection: r.label || 'Lainnya',
        count: Number(r.count),
      })),
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.label, count: Number(r.count) })),
      portfolioCategoryBreakdown: portfolioCategories.map((r) => ({
        category: r.label || 'Lainnya',
        count: Number(r.count),
      })),
      topProducts,
      recentProducts,
    });
  }),
);

/* ══════════════════════════ PRODUCTS ══════════════════════════ */

router.get(
  '/products',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'products',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'collection', column: 'collection_name' },
        { param: 'featured', type: 'boolean', column: 'is_featured' },
        { param: 'search', type: 'search', columns: ['title', 'description', 'sku', 'category'] },
      ],
      allowedSort: ['created_at', 'title', 'price', 'stock', 'sold_count', 'status'],
      defaultSort: 'created_at',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await findRow('products', req.params.id);
    if (!product) return sendError(res, 'Produk tidak ditemukan.', 404);
    sendSuccess(res, product);
  }),
);

router.post(
  '/products',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title', 'price']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const status = req.body.status || 'published';
    if (!PRODUCT_STATUSES.includes(status))
      return sendError(res, 'Status produk tidak valid.', 400);

    if (req.body.category) {
      const validCat = await runSingle(
        'SELECT id FROM studio_categories WHERE (name = ? OR slug = ?) AND is_active = 1',
        [req.body.category, req.body.category],
      );
      if (!validCat) return sendError(res, 'Kategori produk tidak valid.', 400);
    }

    const id = uuidv4();
    const now = nowIso();
    const slug = await makeUniqueSlug('products', req.body.slug || req.body.title);
    const count = await countWhere('products');

    await insertRow('products', {
      id,
      slug,
      title: req.body.title,
      description: req.body.description || '',
      price: Number(req.body.price || 0),
      collection_name: req.body.collectionName || '',
      category: req.body.category || '',
      image: req.body.image || '',
      is_featured: boolField(req.body.isFeatured, 0),
      stock: Number(req.body.stock || 0),
      sku: req.body.sku || `MHR-${String(count + 1).padStart(3, '0')}`,
      status,
      gallery: jsonField(req.body.gallery, []),
      sold_count: 0,
      created_at: now,
      updated_at: now,
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'products',
      resourceId: id,
      summary: `Membuat produk ${req.body.title}`,
    });

    sendSuccess(res, await findRow('products', id), 201);
  }),
);

router.put(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('products', req.params.id, 'id, title, slug');
    if (!existing) return sendError(res, 'Produk tidak ditemukan.', 404);

    if (req.body.status && !PRODUCT_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status produk tidak valid.', 400);
    }

    if (req.body.category) {
      const validCat = await runSingle(
        'SELECT id FROM studio_categories WHERE (name = ? OR slug = ?) AND is_active = 1',
        [req.body.category, req.body.category],
      );
      if (!validCat) return sendError(res, 'Kategori produk tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      title: 'title',
      description: 'description',
      price: { key: 'price', transform: (v) => Number(v || 0) },
      collection_name: 'collectionName',
      category: 'category',
      image: 'image',
      is_featured: { key: 'isFeatured', transform: (v) => boolField(v, 0) },
      stock: { key: 'stock', transform: (v) => Number(v || 0) },
      sku: 'sku',
      status: 'status',
      gallery: { key: 'gallery', transform: (v) => jsonField(v, []) },
      sold_count: { key: 'soldCount', transform: (v) => Number(v || 0) },
    });

    if (req.body.title && req.body.title !== existing.title) {
      payload.slug = await makeUniqueSlug('products', req.body.title, req.params.id);
    }

    payload.updated_at = nowIso();
    await updateRow('products', req.params.id, payload);

    await logAdminAction(req, {
      action: 'update',
      resource: 'products',
      resourceId: req.params.id,
      summary: `Memperbarui produk ${req.body.title || existing.title}`,
    });

    sendSuccess(res, await findRow('products', req.params.id));
  }),
);

router.patch(
  '/products/:id/stock',
  asyncHandler(async (req, res) => {
    const stock = Number(req.body.stock);
    if (Number.isNaN(stock) || stock < 0) return sendError(res, 'Jumlah stok tidak valid.', 400);

    const existing = await findRow('products', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Produk tidak ditemukan.', 404);

    await updateRow('products', req.params.id, {
      stock,
      status: stock <= 0 ? 'out_of_stock' : req.body.status || 'published',
      updated_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'update_stock',
      resource: 'products',
      resourceId: req.params.id,
      summary: `Mengubah stok ${existing.title} menjadi ${stock}`,
    });

    sendSuccess(res, { id: req.params.id, stock });
  }),
);

router.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('products', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Produk tidak ditemukan.', 404);

    await deleteRow('products', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'products',
      resourceId: req.params.id,
      summary: `Menghapus produk ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ PORTFOLIOS ══════════════════════════ */

router.get(
  '/portfolios',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'portfolios',
      query: req.query,
      filters: [
        { param: 'status', column: 'status' },
        { param: 'category', column: 'category' },
        { param: 'year', column: 'year' },
        { param: 'featured', type: 'boolean', column: 'is_featured' },
        {
          param: 'search',
          type: 'search',
          columns: ['title', 'client_name', 'description', 'category'],
        },
      ],
      allowedSort: ['created_at', 'title', 'year', 'sort_order', 'status'],
      defaultSort: 'sort_order',
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/portfolios/:id',
  asyncHandler(async (req, res) => {
    const portfolio = await findRow('portfolios', req.params.id);
    if (!portfolio) return sendError(res, 'Portofolio tidak ditemukan.', 404);
    sendSuccess(res, portfolio);
  }),
);

router.post(
  '/portfolios',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const status = req.body.status || 'published';
    if (!PORTFOLIO_STATUSES.includes(status))
      return sendError(res, 'Status portofolio tidak valid.', 400);

    const id = uuidv4();
    const slug = await makeUniqueSlug('portfolios', req.body.slug || req.body.title);

    await insertRow('portfolios', {
      id,
      slug,
      title: req.body.title,
      client_name: req.body.clientName || '',
      category: req.body.category || '',
      description: req.body.description || '',
      cover_image: req.body.coverImage || '',
      gallery: jsonField(req.body.gallery, []),
      services: jsonField(req.body.services, []),
      project_url: req.body.projectUrl || '',
      year: req.body.year || String(new Date().getFullYear()),
      is_featured: boolField(req.body.isFeatured, 0),
      status,
      sort_order: Number(req.body.sortOrder || 0),
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'portfolios',
      resourceId: id,
      summary: `Membuat portofolio ${req.body.title}`,
    });

    sendSuccess(res, await findRow('portfolios', id), 201);
  }),
);

router.put(
  '/portfolios/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('portfolios', req.params.id, 'id, title, slug');
    if (!existing) return sendError(res, 'Portofolio tidak ditemukan.', 404);

    if (req.body.status && !PORTFOLIO_STATUSES.includes(req.body.status)) {
      return sendError(res, 'Status portofolio tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      title: 'title',
      client_name: 'clientName',
      category: 'category',
      description: 'description',
      cover_image: 'coverImage',
      gallery: { key: 'gallery', transform: (v) => jsonField(v, []) },
      services: { key: 'services', transform: (v) => jsonField(v, []) },
      project_url: 'projectUrl',
      year: 'year',
      is_featured: { key: 'isFeatured', transform: (v) => boolField(v, 0) },
      status: 'status',
      sort_order: { key: 'sortOrder', transform: (v) => Number(v || 0) },
    });

    if (req.body.title && req.body.title !== existing.title) {
      payload.slug = await makeUniqueSlug('portfolios', req.body.title, req.params.id);
    }

    await updateRow('portfolios', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'portfolios',
      resourceId: req.params.id,
      summary: `Memperbarui portofolio ${req.body.title || existing.title}`,
    });

    sendSuccess(res, await findRow('portfolios', req.params.id));
  }),
);

router.delete(
  '/portfolios/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('portfolios', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Portofolio tidak ditemukan.', 404);

    await deleteRow('portfolios', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'portfolios',
      resourceId: req.params.id,
      summary: `Menghapus portofolio ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ COLLECTION CARDS ══════════════════════════ */

router.get(
  '/collections',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'collection_cards',
      query: req.query,
      filters: [
        { param: 'category', column: 'category' },
        { param: 'layout', column: 'layout' },
        { param: 'search', type: 'search', columns: ['title', 'description'] },
      ],
      allowedSort: ['sort_order', 'created_at', 'title'],
      defaultSort: 'sort_order',
      defaultLimit: 50,
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/collections/:id',
  asyncHandler(async (req, res) => {
    const collection = await findRow('collection_cards', req.params.id);
    if (!collection) return sendError(res, 'Kartu koleksi tidak ditemukan.', 404);
    sendSuccess(res, collection);
  }),
);

router.post(
  '/collections',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    await insertRow('collection_cards', {
      id,
      title: req.body.title,
      description: req.body.description || '',
      layout: req.body.layout || 'standard',
      image: req.body.image || '',
      category: req.body.category || '',
      sort_order: Number(req.body.sortOrder || 0),
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'collection_cards',
      resourceId: id,
      summary: `Membuat kartu koleksi ${req.body.title}`,
    });
    sendSuccess(res, await findRow('collection_cards', id), 201);
  }),
);

router.put(
  '/collections/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('collection_cards', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Kartu koleksi tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      title: 'title',
      description: 'description',
      layout: 'layout',
      image: 'image',
      category: 'category',
      sort_order: { key: 'sortOrder', transform: (v) => Number(v || 0) },
    });

    await updateRow('collection_cards', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'collection_cards',
      resourceId: req.params.id,
      summary: `Memperbarui kartu koleksi ${existing.title}`,
    });

    sendSuccess(res, await findRow('collection_cards', req.params.id));
  }),
);

router.delete(
  '/collections/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('collection_cards', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Kartu koleksi tidak ditemukan.', 404);

    await deleteRow('collection_cards', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'collection_cards',
      resourceId: req.params.id,
      summary: `Menghapus kartu koleksi ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ SPECIALIZATIONS ══════════════════════════ */

router.get(
  '/specializations',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'specializations',
      query: req.query,
      filters: [{ param: 'search', type: 'search', columns: ['title', 'description'] }],
      allowedSort: ['sort_order', 'created_at', 'title'],
      defaultSort: 'sort_order',
      defaultLimit: 50,
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/specializations/:id',
  asyncHandler(async (req, res) => {
    const spec = await findRow('specializations', req.params.id);
    if (!spec) return sendError(res, 'Spesialisasi tidak ditemukan.', 404);
    sendSuccess(res, spec);
  }),
);

router.post(
  '/specializations',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['title']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const id = uuidv4();
    await insertRow('specializations', {
      id,
      title: req.body.title,
      description: req.body.description || '',
      icon: req.body.icon || '',
      sort_order: Number(req.body.sortOrder || 0),
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'specializations',
      resourceId: id,
      summary: `Membuat spesialisasi ${req.body.title}`,
    });
    sendSuccess(res, await findRow('specializations', id), 201);
  }),
);

router.put(
  '/specializations/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('specializations', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Spesialisasi tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      title: 'title',
      description: 'description',
      icon: 'icon',
      sort_order: { key: 'sortOrder', transform: (v) => Number(v || 0) },
    });

    await updateRow('specializations', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'specializations',
      resourceId: req.params.id,
      summary: `Memperbarui spesialisasi ${existing.title}`,
    });

    sendSuccess(res, await findRow('specializations', req.params.id));
  }),
);

router.delete(
  '/specializations/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('specializations', req.params.id, 'id, title');
    if (!existing) return sendError(res, 'Spesialisasi tidak ditemukan.', 404);

    await deleteRow('specializations', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'specializations',
      resourceId: req.params.id,
      summary: `Menghapus spesialisasi ${existing.title}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

/* ══════════════════════════ INVENTORY ══════════════════════════ */

router.get(
  '/inventory',
  asyncHandler(async (req, res) => {
    const rows = await runQuery(
      `SELECT id, slug, title, description, price, stock, sku, status,
              category, collection_name, is_featured, sold_count, created_at
       FROM products ORDER BY created_at DESC`,
    );

    const activeVisibility = rows.filter((r) => r.status === 'published').length;

    sendSuccess(res, {
      products: rows.map((r) => ({
        id: r.id,
        name: r.title,
        subtitle: r.description ? r.description.slice(0, 120) : '',
        category: r.category || '',
        sku: r.sku || '',
        price: Number(r.price || 0),
        stock: Number(r.stock || 0),
        lowStockThreshold: 10,
        status: r.stock <= 0 ? 'Out of Stock' : Number(r.stock) <= 10 ? 'Low Stock' : 'In Stock',
        visibility: r.status === 'published' ? 'Public' : 'Hidden',
        collection: r.collection_name || 'Essentials',
        description: r.description || '',
        material: '',
        tags: [],
        weight: '',
        dimensions: '',
        shippingClass: '',
        createdAt: r.created_at,
      })),
      inventoryForecast: [0, 0, 0, 0, 0, 0, 0],
      warehouses: [
        { label: 'Local Inventory', value: rows.reduce((sum, r) => sum + Number(r.stock || 0), 0) },
      ],
      activeVisibility,
    });
  }),
);

module.exports = router;
