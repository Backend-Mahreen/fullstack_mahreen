const { runQuery } = require('../config/database');

/**
 * Menambahkan LIMIT/OFFSET ke query list publik.
 *
 * Public endpoints mengembalikan data tanpa pagination, sehingga
 * data yang sangat besar akan membebani jaringan dan memori.
 * Nilai default 20, maksimum 100.
 */
const applyPagination = (sql, params, query = {}) => {
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100);
  const offset = Math.max(Number.parseInt(query.offset, 10) || 0, 0);

  // Hitung total dengan COUNT(*). Bungkus query asli sebagai subquery agar
  // aman untuk daftar kolom apa pun (SELECT id, title FROM ...), bukan hanya
  // SELECT *. ORDER BY di query asli tidak berpengaruh pada COUNT.
  const countSql = `SELECT COUNT(*) AS count FROM (${sql}) AS paginated_count`;
  const finalSql = `${sql} LIMIT ? OFFSET ?`;
  const allParams = [...params, limit, offset];

  return {
    finalSql,
    countSql,
    params: allParams,
    countParams: params,
    limit,
    offset,
    page: Math.floor(offset / limit) + 1,
  };
};

const paginatedQuery = async (sql, params, query) => {
  const {
    finalSql,
    countSql,
    params: dataParams,
    countParams,
    limit,
    offset,
    page,
  } = applyPagination(sql, params, query);

  const [rows, countResult] = await Promise.all([
    runQuery(finalSql, dataParams),
    runQuery(countSql, countParams),
  ]);

  const total = countResult[0]?.count || 0;

  return {
    data: rows,
    pagination: {
      total: Number(total),
      page,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + rows.length < total,
    },
  };
};

module.exports = { applyPagination, paginatedQuery };
