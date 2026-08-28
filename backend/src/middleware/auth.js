const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/secrets');
const { isTokenRevoked } = require('../services/tokenBlacklist');
const logger = require('../utils/logger');

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim() || null;
  }
  
  // Fallback untuk SSE / WebSocket yang tidak bisa set Authorization header dengan mudah
  if (req.query.token) {
    return String(req.query.token).trim();
  }

  return null;
};

/**
 * Memverifikasi access token dan memastikan token belum dicabut.
 *
 * Pemeriksaan daftar cabut membuat logout benar-benar mengakhiri sesi.
 * Tanpa langkah ini, token yang sudah di-logout tetap diterima hingga
 * masa berlakunya habis secara alami.
 */
const authenticate = async (req, res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    return sendError(res, 'Token autentikasi tidak ditemukan.', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token autentikasi telah kedaluwarsa.', 401);
    }
    return sendError(res, 'Token autentikasi tidak valid.', 401);
  }

  // Refresh token tidak boleh dipakai sebagai access token.
  if (decoded.type === 'refresh') {
    return sendError(res, 'Token autentikasi tidak valid.', 401);
  }

  try {
    if (await isTokenRevoked(token)) {
      return sendError(res, 'Sesi telah berakhir. Silakan login kembali.', 401);
    }
  } catch (error) {
    logger.error('Gagal memeriksa daftar cabut token:', 'auth');
    return sendError(res, 'Terjadi kesalahan saat memverifikasi sesi.', 500);
  }

  req.user = decoded;
  req.authToken = token;
  next();
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Akses ditolak. Pengguna tidak terautentikasi.', 401);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Akses ditolak. Peran pengguna tidak diizinkan.', 403);
    }

    next();
  };
};

module.exports = { authenticate, authorize, extractBearerToken, JWT_SECRET, JWT_REFRESH_SECRET };
