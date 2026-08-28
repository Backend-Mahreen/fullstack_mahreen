const express = require('express');
const router = express.Router();
const { runQuery } = require('../../config/database');
const { parsePagination, asyncHandler } = require('./_helpers');
const { sendSuccess, sendError } = require('../../utils/response');

/**
 * Build UNION ALL sub-queries based on the requested source(s).
 * Each sub-query normalizes columns to a common schema:
 *   id, timestamp, source, action, actor, title, description, resource, resourceId, metadata
 */
const buildUnionQuery = (sources, dateWhere, dateParams, searchWhere, searchParams) => {
  const subQueries = [];

  // Gabungkan klausa tanggal dan pencarian menjadi satu WHERE yang valid.
  // searchWhere memakai prefix "AND", jadi bila tidak ada dateWhere kita
  // harus mengganti prefix tersebut dengan "WHERE" agar SQL tidak error.
  const combineWhere = () => {
    if (dateWhere && searchWhere) return `${dateWhere} ${searchWhere}`;
    if (dateWhere) return dateWhere;
    if (searchWhere) return searchWhere.replace(/^AND\s+/i, 'WHERE ');
    return '';
  };
  const whereClause = combineWhere();

  if (sources.includes('audit')) {
    subQueries.push(
      `SELECT id, created_at AS timestamp, 'audit' AS source,
        action, admin_name AS actor, summary AS title, summary AS description,
        resource, resource_id AS resourceId, metadata
       FROM admin_audit_logs ${whereClause}`,
    );
  }
  if (sources.includes('activity')) {
    subQueries.push(
      `SELECT id, created_at AS timestamp, 'activity' AS source,
        type AS action, '' AS actor, title, description,
        '' AS resource, '' AS resourceId, metadata
       FROM system_activities ${whereClause}`,
    );
  }
  if (sources.includes('analytics')) {
    subQueries.push(
      `SELECT id, created_at AS timestamp, 'analytics' AS source,
        event_name AS action, user_id AS actor, event_name AS title, path AS description,
        event_category AS resource, session_id AS resourceId, metadata
       FROM analytics_events ${whereClause}`,
    );
  }

  return subQueries;
};

/**
 * Parse metadata — handle both string and object.
 */
const parseMetadata = (m) => {
  if (!m) return null;
  if (typeof m === 'string') {
    try {
      return JSON.parse(m);
    } catch {
      return null;
    }
  }
  return m;
};

/**
 * Build search WHERE clause for each sub-query.
 * Searches across: action, title, description, actor, resource.
 */
const buildSearchClause = (search) => {
  if (!search) return { where: '', params: [] };
  const term = `%${search}%`;
  const where = `AND (action LIKE ? OR title LIKE ? OR description LIKE ? OR actor LIKE ? OR resource LIKE ?)`;
  return { where, params: [term, term, term, term, term] };
};

/**
 * GET /api/admin/reports/logs
 *
 * Menggabungkan admin_audit_logs, system_activities, dan analytics_events
 * ke satu tabel terpadu menggunakan SQL UNION ALL.
 */
router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req.query, 50);
    const { dateFrom, dateTo, source = 'all', action, search } = req.query;

    // Date filter
    const dateConditions = [];
    const dateParams = [];
    if (dateFrom) {
      dateConditions.push('created_at >= ?');
      dateParams.push(dateFrom);
    }
    if (dateTo) {
      dateConditions.push('created_at <= ?');
      dateParams.push(dateTo + ' 23:59:59');
    }
    const dateWhere = dateConditions.length > 0 ? `WHERE ${dateConditions.join(' AND ')}` : '';

    // Search filter
    const { where: searchWhere, params: searchParams } = buildSearchClause(search);

    // Determine which sources to query
    const sources = source === 'all' ? ['audit', 'activity', 'analytics'] : [source];

    const subQueries = buildUnionQuery(sources, dateWhere, dateParams, searchWhere, searchParams);
    if (subQueries.length === 0)
      return sendSuccess(res, {
        items: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        summary: { total: 0, bySource: {} },
      });

    const unionSql = subQueries.join('\n UNION ALL \n');

    // Action filter at UNION level
    let actionWhere = '';
    const actionParams = [];
    if (action) {
      actionWhere = 'WHERE action LIKE ?';
      actionParams.push(`%${action}%`);
    }

    // Count query
    const countSql = `SELECT COUNT(*) AS count FROM (${unionSql}) AS combined ${actionWhere}`;
    const countResult = await runQuery(countSql, [...dateParams, ...searchParams, ...actionParams]);
    const total = countResult[0]?.count || 0;

    // Data query with sort + pagination
    const dataSql = `SELECT * FROM (${unionSql}) AS combined ${actionWhere} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    const allParams = [...dateParams, ...searchParams, ...actionParams, limit, offset];
    const rows = await runQuery(dataSql, allParams);

    // Normalize metadata
    const items = rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      source: r.source,
      action: r.action || '',
      actor: r.actor || '',
      title: r.title || '',
      description: r.description || '',
      resource: r.resource || '',
      resourceId: r.resourceId || '',
      metadata: parseMetadata(r.metadata),
    }));

    // Source counts for summary
    const summaryCounts = {};
    for (const s of sources) {
      const cnt = await runQuery(
        `SELECT COUNT(*) AS count FROM (${buildUnionQuery([s], dateWhere, dateParams, searchWhere, searchParams).join('')}) AS t`,
        [...dateParams, ...searchParams],
      );
      summaryCounts[s] = cnt[0]?.count || 0;
    }

    return sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary: { total, bySource: summaryCounts },
    });
  }),
);

/**
 * GET /api/admin/reports/export
 *
 * Export seluruh log yang sesuai filter ke CSV.
 */
router.get(
  '/export',
  asyncHandler(async (req, res) => {
    const { dateFrom, dateTo, source = 'all', action, search } = req.query;

    const dateConditions = [];
    const dateParams = [];
    if (dateFrom) {
      dateConditions.push('created_at >= ?');
      dateParams.push(dateFrom);
    }
    if (dateTo) {
      dateConditions.push('created_at <= ?');
      dateParams.push(dateTo + ' 23:59:59');
    }
    const dateWhere = dateConditions.length > 0 ? `WHERE ${dateConditions.join(' AND ')}` : '';

    const { where: searchWhere, params: searchParams } = buildSearchClause(search);

    const sources = source === 'all' ? ['audit', 'activity', 'analytics'] : [source];
    const subQueries = buildUnionQuery(sources, dateWhere, dateParams, searchWhere, searchParams);
    if (subQueries.length === 0)
      return res.send('Timestamp,Source,Action,Actor,Title,Description,Resource,ResourceID\n');

    const unionSql = subQueries.join('\n UNION ALL \n');

    let actionWhere = '';
    const actionParams = [];
    if (action) {
      actionWhere = 'WHERE action LIKE ?';
      actionParams.push(`%${action}%`);
    }

    const dataSql = `SELECT * FROM (${unionSql}) AS combined ${actionWhere} ORDER BY timestamp DESC LIMIT 2000`;
    const rows = await runQuery(dataSql, [...dateParams, ...searchParams, ...actionParams]);

    const items = rows.map((r) => ({
      timestamp: r.timestamp,
      source: r.source,
      action: r.action || '',
      actor: r.actor || '',
      title: r.title || '',
      description: r.description || '',
      resource: r.resource || '',
      resourceId: r.resourceId || '',
    }));

    const escapeCsv = (val) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    };

    const header = 'Timestamp,Source,Action,Actor,Title,Description,Resource,ResourceID';
    const csvRows = items.map((item) =>
      [
        item.timestamp,
        item.source,
        item.action,
        item.actor,
        item.title,
        item.description,
        item.resource,
        item.resourceId,
      ]
        .map(escapeCsv)
        .join(','),
    );

    const csv = [header, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report-log-${new Date().toISOString().slice(0, 10)}.csv"`,
    );
    return res.send(csv);
  }),
);

module.exports = router;
