const logger = require('../../utils/logger');
const { runQuery, runSingle, runExecute, withTransaction } = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const { getClientStreamManager } = require('../../services/streamManager');

const nowIso = () => new Date().toISOString();

const toInt = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parsePagination = (query, defaultLimit = 20, maxLimit = 200) => {
  const limit = Math.min(Math.max(toInt(query.limit, defaultLimit), 1), maxLimit);
  const page = Math.max(toInt(query.page, 1), 1);
  const offset =
    query.offset !== undefined ? Math.max(toInt(query.offset, 0), 0) : (page - 1) * limit;
  return { limit, offset, page };
};

const buildSort = (query, allowedColumns, fallbackColumn, fallbackDir = 'DESC') => {
  const requested = String(query.sortBy || '');
  const column = allowedColumns.includes(requested) ? requested : fallbackColumn;
  const dir = String(query.sortDir || '').toUpperCase() === 'ASC' ? 'ASC' : fallbackDir;
  return `\`${column}\` ${dir}`;
};

const buildFilters = (definitions, query) => {
  const conditions = [];
  const params = [];

  for (const def of definitions) {
    const raw = query[def.param];
    if (raw === undefined || raw === null || raw === '' || raw === 'all') continue;

    if (def.type === 'search') {
      const like = `%${raw}%`;
      conditions.push(`(${def.columns.map((c) => `${c} LIKE ?`).join(' OR ')})`);
      def.columns.forEach(() => params.push(like));
      continue;
    }

    if (def.type === 'dateFrom') {
      conditions.push(`${def.column} >= ?`);
      params.push(String(raw));
      continue;
    }

    if (def.type === 'dateTo') {
      conditions.push(`${def.column} <= ?`);
      params.push(String(raw));
      continue;
    }

    if (def.type === 'boolean') {
      conditions.push(`${def.column} = ?`);
      params.push(raw === 'true' || raw === '1' ? 1 : 0);
      continue;
    }

    if (def.type === 'number') {
      conditions.push(`${def.column} = ?`);
      params.push(toInt(raw, 0));
      continue;
    }

    conditions.push(`${def.column} = ?`);
    params.push(String(raw));
  }

  return {
    where: conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
};

const listResource = async ({
  table,
  query,
  columns = '*',
  filters = [],
  allowedSort = ['created_at'],
  defaultSort = 'created_at',
  defaultLimit = 20,
  extraWhere = null,
  joins = '',
}) => {
  const { limit, offset, page } = parsePagination(query, defaultLimit);
  const { where, params } = buildFilters(filters, query);

  let finalWhere = where;
  const finalParams = [...params];

  if (extraWhere) {
    finalWhere = finalWhere ? `${finalWhere} AND ${extraWhere.sql}` : ` WHERE ${extraWhere.sql}`;
    finalParams.push(...(extraWhere.params || []));
  }

  const orderBy = buildSort(query, allowedSort, defaultSort);

  const rows = await runQuery(
    `SELECT ${columns} FROM \`${table}\`${joins}${finalWhere} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...finalParams, limit, offset],
  );

  const totalRow = await runSingle(
    `SELECT COUNT(*) as count FROM \`${table}\`${joins}${finalWhere}`,
    finalParams,
  );

  const total = totalRow ? Number(totalRow.count) : 0;

  return {
    items: rows,
    pagination: {
      total,
      page,
      limit,
      offset,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
      hasMore: offset + rows.length < total,
    },
  };
};

const insertRow = async (table, payload) => {
  const keys = Object.keys(payload);
  const placeholders = keys.map(() => '?').join(', ');
  const columns = keys.map((k) => `\`${k}\``).join(', ');
  await runExecute(
    `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`,
    keys.map((k) => payload[k]),
  );
  return payload.id;
};

const updateRow = async (table, id, payload) => {
  const keys = Object.keys(payload);
  if (keys.length === 0) return 0;
  const assignments = keys.map((k) => `\`${k}\` = ?`).join(', ');
  const result = await runExecute(`UPDATE \`${table}\` SET ${assignments} WHERE id = ?`, [
    ...keys.map((k) => payload[k]),
    id,
  ]);
  return result.affectedRows;
};

const deleteRow = async (table, id) => {
  const result = await runExecute(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
  return result.affectedRows;
};

const findRow = async (table, id, columns = '*') =>
  runSingle(`SELECT ${columns} FROM \`${table}\` WHERE id = ?`, [id]);

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200);

const makeUniqueSlug = async (table, baseValue, excludeId = null) => {
  const base = slugify(baseValue) || `item-${Date.now()}`;
  let candidate = base;
  let suffix = 1;
  const MAX_ATTEMPTS = 100;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const existing = excludeId
      ? await runSingle(`SELECT id FROM \`${table}\` WHERE slug = ? AND id != ?`, [
          candidate,
          excludeId,
        ])
      : await runSingle(`SELECT id FROM \`${table}\` WHERE slug = ?`, [candidate]);

    if (!existing) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  throw new Error(
    `Gagal membuat slug unik untuk "${baseValue}" setelah ${MAX_ATTEMPTS} percobaan.`,
  );
};

const jsonField = (value, fallback = []) => {
  if (value === undefined || value === null) return JSON.stringify(fallback);
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(fallback);
    }
  }
  return JSON.stringify(value);
};

const boolField = (value, fallback = 0) => {
  if (value === undefined || value === null) return fallback;
  return value === true || value === 1 || value === '1' || value === 'true' ? 1 : 0;
};

const pickDefined = (source, mapping) => {
  const payload = {};
  for (const [column, config] of Object.entries(mapping)) {
    const key = typeof config === 'string' ? config : config.key;
    if (source[key] === undefined) continue;

    const raw = source[key];
    if (typeof config === 'object' && typeof config.transform === 'function') {
      payload[column] = config.transform(raw);
    } else {
      payload[column] = raw;
    }
  }
  return payload;
};

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || String(value).trim() === '';
  });
  return missing;
};

const logAdminAction = async (
  req,
  { action, resource, resourceId = '', summary = '', metadata = {} },
) => {
  try {
    await runExecute(
      `INSERT INTO admin_audit_logs (id, admin_id, admin_name, action, resource, resource_id, summary, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        req.user?.id || null,
        req.user?.fullName || '',
        action,
        resource,
        resourceId,
        summary,
        JSON.stringify(metadata || {}),
        nowIso(),
      ],
    );
  } catch (error) {
    logger.warn(`Gagal menulis audit log: ${error.message}`);
  }
};

const recordActivity = async ({ type, title, description = '', metadata = {} }) => {
  try {
    await runExecute(
      `INSERT INTO system_activities (id, type, title, description, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), type, title, description, JSON.stringify(metadata || {}), nowIso()],
    );
  } catch (error) {
    logger.warn(`Gagal menulis system activity: ${error.message}`);
  }
};

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

const groupCount = async (table, column, extraWhere = '') =>
  runQuery(
    `SELECT ${column} AS label, COUNT(*) AS count FROM \`${table}\`${extraWhere} GROUP BY ${column} ORDER BY count DESC`,
  );

const sumColumn = async (table, column, where = '', params = []) => {
  const row = await runSingle(
    `SELECT COALESCE(SUM(${column}), 0) AS total FROM \`${table}\`${where}`,
    params,
  );
  return row ? Number(row.total) : 0;
};

const countWhere = async (table, where = '', params = []) => {
  const row = await runSingle(`SELECT COUNT(*) AS count FROM \`${table}\`${where}`, params);
  return row ? Number(row.count) : 0;
};

/**
 * Menghitung baris anak yang masih mereferensikan sebuah baris induk.
 *
 * Dipakai sebelum penghapusan agar admin memperoleh peringatan eksplisit
 * mengenai data yang akan terpengaruh. Foreign key sudah menjaga integritas
 * pada level database (ON DELETE SET NULL), namun pemeriksaan ini memberi
 * konteks bisnis sebelum operasi dijalankan.
 *
 * @param {string} id - ID baris induk.
 * @param {{table: string, column: string, label: string, blocking?: boolean}[]} relations
 * @returns {Promise<{label: string, table: string, count: number, blocking: boolean}[]>}
 */
const collectDependencies = async (id, relations) => {
  const results = await Promise.all(
    relations.map(async (relation) => {
      const count = await countWhere(relation.table, ` WHERE \`${relation.column}\` = ?`, [id]);
      return {
        label: relation.label,
        table: relation.table,
        count,
        blocking: Boolean(relation.blocking),
      };
    }),
  );

  return results.filter((item) => item.count > 0);
};

/**
 * Menyusun pesan ringkas dari daftar dependensi.
 */
const describeDependencies = (dependencies) =>
  dependencies.map((item) => `${item.count} ${item.label}`).join(', ');

const monthlySeries = async (table, dateColumn, valueExpression, months = 12, where = '') => {
  const rows = await runQuery(
    `SELECT DATE_FORMAT(${dateColumn}, '%Y-%m') AS month, ${valueExpression} AS value
     FROM \`${table}\`${where}
     GROUP BY month
     ORDER BY month ASC
     LIMIT ?`,
    [months],
  );
  return rows.map((row) => ({ month: row.month, value: Number(row.value) }));
};

/**
 * Memicu event SSE ke satu user (client portal) setelah admin melakukan
 * perubahan data. Dipakai untuk sinkronisasi real-time Admin -> Client.
 *
 * @param {string|null} userId - ID user penerima; null/empty di-skip diam-diam
 * @param {string} eventName - nama event SSE (mis. 'notification')
 * @param {object} payload - data yang akan dikirim
 * @param {string} [topic='all'] - topik untuk client-side filtering
 */
const broadcastToUser = (userId, eventName, payload, topic = 'all') => {
  if (!userId) return;
  try {
    getClientStreamManager().sendToUser(userId, eventName, payload, topic);
  } catch (err) {
    logger.warn(`SSE broadcast gagal untuk user ${userId}: ${err.message}`);
  }
};

module.exports = {
  uuidv4,
  nowIso,
  toInt,
  parsePagination,
  buildSort,
  buildFilters,
  listResource,
  insertRow,
  updateRow,
  deleteRow,
  findRow,
  slugify,
  makeUniqueSlug,
  jsonField,
  boolField,
  pickDefined,
  requireFields,
  logAdminAction,
  recordActivity,
  asyncHandler,
  groupCount,
  sumColumn,
  countWhere,
  collectDependencies,
  describeDependencies,
  monthlySeries,
  withTransaction,
  broadcastToUser,
};
