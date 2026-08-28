/**
 * In-memory TTL cache using LRU-cache.
 *
 * Digunakan untuk cache data yang expensive query-nya
 * (admin stats, newsroom overview, dll).
 */
const { LRUCache } = require('lru-cache');

/**
 * Create a new cache instance.
 * @param {object} opts
 * @param {number} opts.max - Maximum number of entries
 * @param {number} opts.ttlMs - Time-to-live in milliseconds
 */
const createCache = ({ max = 50, ttlMs = 30_000 } = {}) => new LRUCache({ max, ttl: ttlMs });

/**
 * Get-or-set pattern: return cached value if exists, otherwise
 * run the factory function, cache the result, and return it.
 */
const getOrSet = async (cache, key, factory) => {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const value = await factory();
  cache.set(key, value);
  return value;
};

// Pre-configured cache instances
const statsCache = createCache({ max: 10, ttlMs: 30_000 }); // 30 detik
const newsroomCache = createCache({ max: 5, ttlMs: 60_000 }); // 60 detik

module.exports = { createCache, getOrSet, statsCache, newsroomCache };
