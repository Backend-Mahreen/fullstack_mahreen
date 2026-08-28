const express = require('express');
const router = express.Router();
const { sendSuccess, sendError } = require('../../../utils/response');
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
  jsonField,
  boolField,
  logAdminAction,
} = require('../_helpers');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'service_packages',
      query: req.query,
      filters: [
        { param: 'serviceKey', column: 'service_key' },
        { param: 'tier', column: 'tier' },
        { param: 'search', type: 'search', columns: ['name', 'service_key', 'tier'] },
      ],
      allowedSort: ['created_at', 'price', 'name', 'service_key'],
      defaultSort: 'service_key',
      defaultLimit: 100,
    });

    sendSuccess(res, result);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const pkg = await findRow('service_packages', req.params.id);
    if (!pkg) return sendError(res, 'Paket layanan tidak ditemukan.', 404);
    sendSuccess(res, pkg);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['name', 'price']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    // Frontend mengirim ServiceDefinition: { name, category, price, status, ... }.
    // serviceKey = category frontend, tier fallback "Standard".
    const status = req.body.status || 'active';
    if (!['active', 'draft', 'archived'].includes(status))
      return sendError(res, 'Status paket tidak valid.', 400);

    const id = uuidv4();
    await insertRow('service_packages', {
      id,
      service_key: req.body.category || req.body.serviceKey || 'consulting',
      tier: req.body.tier || 'Standard',
      name: req.body.name,
      price: Number(req.body.price || 0),
      features: jsonField(req.body.features, []),
      is_popular: boolField(req.body.isPopular, 0),
      status,
      description: req.body.description || '',
      thumbnail: req.body.thumbnail || '',
      gallery: jsonField(req.body.gallery, []),
      seo_title: req.body.seoTitle || '',
      meta_description: req.body.metaDescription || '',
      visibility: req.body.visibility || 'public',
      created_at: nowIso(),
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'service_packages',
      resourceId: id,
      summary: `Membuat paket ${req.body.name}`,
    });
    sendSuccess(res, await findRow('service_packages', id), 201);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('service_packages', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Paket layanan tidak ditemukan.', 404);

    if (req.body.status && !['active', 'draft', 'archived'].includes(req.body.status)) {
      return sendError(res, 'Status paket tidak valid.', 400);
    }

    const payload = pickDefined(req.body, {
      service_key: { key: 'category', transform: (v) => String(v ?? '') },
      tier: 'tier',
      name: 'name',
      price: { key: 'price', transform: (v) => Number(v || 0) },
      features: { key: 'features', transform: (v) => jsonField(v, []) },
      is_popular: { key: 'isPopular', transform: (v) => boolField(v, 0) },
      status: 'status',
      description: 'description',
      thumbnail: 'thumbnail',
      gallery: { key: 'gallery', transform: (v) => jsonField(v, []) },
      seo_title: 'seoTitle',
      meta_description: 'metaDescription',
      visibility: 'visibility',
    });

    await updateRow('service_packages', req.params.id, payload);
    await logAdminAction(req, {
      action: 'update',
      resource: 'service_packages',
      resourceId: req.params.id,
      summary: `Memperbarui paket ${existing.name}`,
    });

    sendSuccess(res, await findRow('service_packages', req.params.id));
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('service_packages', req.params.id, 'id, name');
    if (!existing) return sendError(res, 'Paket layanan tidak ditemukan.', 404);

    await deleteRow('service_packages', req.params.id);
    await logAdminAction(req, {
      action: 'delete',
      resource: 'service_packages',
      resourceId: req.params.id,
      summary: `Menghapus paket ${existing.name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
