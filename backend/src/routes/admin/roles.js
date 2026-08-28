const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute, withTransaction } = require('../../config/database');
const { sendSuccess, sendError } = require('../../utils/response');
const { ALL_PERMISSIONS, requirePermission } = require('../../middleware/permissions');
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
  logAdminAction,
  collectDependencies,
  describeDependencies,
} = require('./_helpers');

/**
 * Write guard: hanya admin dengan users.manage_role yang boleh
 * melakukan POST/PUT/DELETE pada role. GET tetap terbuka untuk semua admin.
 */
const requireManageRole = requirePermission('users.manage_role');
router.use((req, res, next) => {
  if (req.method !== 'GET') return requireManageRole(req, res, next);
  next();
});

/* ══════════════════════════ PERMISSIONS LIST ══════════════════════════ */

router.get(
  '/permissions/all',
  asyncHandler(async (req, res) => {
    sendSuccess(res, ALL_PERMISSIONS);
  }),
);

/* ══════════════════════════ SELECT (ringan untuk dropdown) ══════════════════════════ */

router.get(
  '/select',
  asyncHandler(async (req, res) => {
    const rows = await runQuery(
      `SELECT id, name, slug, is_system FROM roles ORDER BY is_system DESC, name ASC`,
    );
    sendSuccess(res, rows);
  }),
);

/* ══════════════════════════ STATS ══════════════════════════ */

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [totalRoles, systemRoles, customRoles] = await Promise.all([
      runSingle('SELECT COUNT(*) AS count FROM roles'),
      runSingle('SELECT COUNT(*) AS count FROM roles WHERE is_system = 1'),
      runSingle('SELECT COUNT(*) AS count FROM roles WHERE is_system = 0'),
    ]);

    const permissionCount = await runQuery(
      `SELECT r.slug, r.name, COUNT(rp.permission) AS permission_count
       FROM roles r
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       GROUP BY r.id, r.slug, r.name
       ORDER BY r.is_system DESC, r.name ASC`,
    );

    sendSuccess(res, {
      totalRoles: totalRoles?.count || 0,
      systemRoles: systemRoles?.count || 0,
      customRoles: customRoles?.count || 0,
      permissionCount: permissionCount.map((r) => ({
        slug: r.slug,
        name: r.name,
        permissionCount: Number(r.permission_count),
      })),
    });
  }),
);

/* ══════════════════════════ LIST ══════════════════════════ */

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: 'roles',
      query: req.query,
      columns: 'id, name, slug, description, is_system, created_at',
      filters: [
        { param: 'search', type: 'search', columns: ['name', 'slug', 'description'] },
        { param: 'isSystem', type: 'boolean', column: 'is_system' },
      ],
      allowedSort: ['created_at', 'name', 'slug'],
      defaultSort: 'created_at',
    });

    // Attach permission count per role.
    const counts = await runQuery(
      `SELECT role_id, COUNT(*) AS cnt FROM role_permissions GROUP BY role_id`,
    );
    const countMap = new Map(counts.map((c) => [c.role_id, Number(c.cnt)]));

    const items = result.items.map((role) => ({
      ...role,
      is_system: Boolean(role.is_system),
      permissionCount: countMap.get(role.id) || 0,
    }));

    sendSuccess(res, { ...result, items });
  }),
);

/* ══════════════════════════ DETAIL ══════════════════════════ */

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const role = await findRow(
      'roles',
      req.params.id,
      'id, name, slug, description, is_system, created_at',
    );
    if (!role) return sendError(res, 'Role tidak ditemukan.', 404);

    const permissions = await runQuery(
      `SELECT permission FROM role_permissions WHERE role_id = ? ORDER BY permission ASC`,
      [role.id],
    );

    sendSuccess(res, {
      ...role,
      is_system: Boolean(role.is_system),
      permissions: permissions.map((r) => r.permission),
    });
  }),
);

/* ══════════════════════════ CREATE ══════════════════════════ */

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ['name']);
    if (missing.length > 0)
      return sendError(res, `Field wajib belum lengkap: ${missing.join(', ')}`, 400);

    const { name, description = '', permissions = [] } = req.body;
    const slug = (req.body.slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);

    if (!slug) return sendError(res, 'Slug role tidak valid.', 400);

    // Cek slug unik.
    const duplicate = await runSingle('SELECT id FROM roles WHERE slug = ?', [slug]);
    if (duplicate) return sendError(res, 'Slug role sudah digunakan.', 409);

    // Validasi permissions.
    const validPerms = permissions.filter((p) => ALL_PERMISSIONS.includes(p));

    const id = uuidv4();
    const now = nowIso();

    await withTransaction(async (conn) => {
      await conn.query(
        `INSERT INTO roles (id, name, slug, description, is_system, created_at) VALUES (?, ?, ?, ?, 0, ?)`,
        [id, name, slug, description, now],
      );

      for (const perm of validPerms) {
        await conn.query(
          `INSERT INTO role_permissions (id, role_id, permission, created_at) VALUES (?, ?, ?, ?)`,
          [uuidv4(), id, perm, now],
        );
      }
    });

    await logAdminAction(req, {
      action: 'create',
      resource: 'roles',
      resourceId: id,
      summary: `Membuat role ${name} dengan ${validPerms.length} permission`,
    });

    const created = await findRow(
      'roles',
      id,
      'id, name, slug, description, is_system, created_at',
    );
    sendSuccess(res, { ...created, is_system: false, permissions: validPerms }, 201);
  }),
);

/* ══════════════════════════ UPDATE ══════════════════════════ */

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('roles', req.params.id, 'id, name, slug, is_system');
    if (!existing) return sendError(res, 'Role tidak ditemukan.', 404);

    const payload = pickDefined(req.body, {
      name: 'name',
      description: 'description',
    });

    // Update slug jika name berubah.
    if (req.body.name && req.body.name !== existing.name) {
      const newSlug = (req.body.slug || req.body.name)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);

      const duplicate = await runSingle('SELECT id FROM roles WHERE slug = ? AND id != ?', [
        newSlug,
        req.params.id,
      ]);
      if (duplicate) return sendError(res, 'Slug role sudah digunakan.', 409);
      payload.slug = newSlug;
    }

    // Update permissions jika disertakan.
    const permissions = req.body.permissions;
    if (Array.isArray(permissions)) {
      const validPerms = permissions.filter((p) => ALL_PERMISSIONS.includes(p));

      await withTransaction(async (conn) => {
        if (Object.keys(payload).length > 0) {
          const assignments = Object.keys(payload)
            .map((k) => `\`${k}\` = ?`)
            .join(', ');
          await conn.query(`UPDATE roles SET ${assignments} WHERE id = ?`, [
            ...Object.values(payload),
            req.params.id,
          ]);
        }

        // Hapus permission lama, insert yang baru.
        await conn.query('DELETE FROM role_permissions WHERE role_id = ?', [req.params.id]);
        for (const perm of validPerms) {
          await conn.query(
            `INSERT INTO role_permissions (id, role_id, permission, created_at) VALUES (?, ?, ?, ?)`,
            [uuidv4(), req.params.id, perm, nowIso()],
          );
        }
      });

      await logAdminAction(req, {
        action: 'update',
        resource: 'roles',
        resourceId: req.params.id,
        summary: `Memperbarui role ${existing.name}: ${validPerms.length} permission`,
      });
    } else {
      // Update metadata saja.
      payload.updated_at = nowIso();
      await updateRow('roles', req.params.id, payload);

      await logAdminAction(req, {
        action: 'update',
        resource: 'roles',
        resourceId: req.params.id,
        summary: `Memperbarui metadata role ${existing.name}`,
      });
    }

    const updated = await findRow(
      'roles',
      req.params.id,
      'id, name, slug, description, is_system, created_at',
    );
    const updatedPerms = await runQuery(
      `SELECT permission FROM role_permissions WHERE role_id = ? ORDER BY permission ASC`,
      [req.params.id],
    );
    sendSuccess(res, {
      ...updated,
      is_system: Boolean(updated.is_system),
      permissions: updatedPerms.map((r) => r.permission),
    });
  }),
);

/* ══════════════════════════ DELETE ══════════════════════════ */

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findRow('roles', req.params.id, 'id, name, slug, is_system');
    if (!existing) return sendError(res, 'Role tidak ditemukan.', 404);

    if (existing.is_system) {
      return sendError(res, 'Role sistem tidak dapat dihapus.', 403);
    }

    // Cek apakah ada user yang menggunakan role ini.
    const userCount = await runSingle('SELECT COUNT(*) AS count FROM users WHERE role = ?', [
      existing.slug,
    ]);
    if (userCount && userCount.count > 0) {
      return sendError(
        res,
        `Role masih digunakan oleh ${userCount.count} pengguna. Ubah role mereka terlebih dahulu.`,
        409,
      );
    }

    await withTransaction(async (conn) => {
      await conn.query('DELETE FROM role_permissions WHERE role_id = ?', [req.params.id]);
      await conn.query('DELETE FROM roles WHERE id = ?', [req.params.id]);
    });

    await logAdminAction(req, {
      action: 'delete',
      resource: 'roles',
      resourceId: req.params.id,
      summary: `Menghapus role ${existing.name}`,
    });

    sendSuccess(res, { id: req.params.id, deleted: true });
  }),
);

module.exports = router;
