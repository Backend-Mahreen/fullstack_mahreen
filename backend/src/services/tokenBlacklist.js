const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { runSingle, runExecute } = require('../config/database');

/**
 * Menyimpan token dalam bentuk hash SHA-256.
 *
 * Token mentah tidak perlu disimpan: pencarian hanya butuh pencocokan persis.
 * Menyimpan hash mencegah kebocoran token aktif bila isi tabel terbaca, dan
 * kolom hash berukuran tetap sehingga dapat diindeks penuh (tidak seperti TEXT).
 */
const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

/**
 * Menambahkan token ke daftar cabut.
 *
 * @param {string} token - Token mentah (access atau refresh).
 * @param {"access"|"refresh"} tokenType
 * @param {number} expiresAtEpochSeconds - Klaim `exp` dari token, dipakai untuk pembersihan.
 */
const revokeToken = async (token, tokenType, expiresAtEpochSeconds = null) => {
  if (!token) return;

  const expiresAt = expiresAtEpochSeconds
    ? new Date(expiresAtEpochSeconds * 1000).toISOString()
    : '';

  await runExecute(
    `INSERT INTO token_blacklist (id, token_hash, token_type, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE created_at = VALUES(created_at)`,
    [uuidv4(), hashToken(token), tokenType, expiresAt, new Date().toISOString()],
  );
};

/**
 * Memeriksa apakah token sudah dicabut.
 * Pencocokan memakai kolom hash yang terindeks sehingga tetap cepat
 * meskipun tabel bertambah besar.
 */
const isTokenRevoked = async (token) => {
  if (!token) return false;

  const row = await runSingle('SELECT id FROM token_blacklist WHERE token_hash = ? LIMIT 1', [
    hashToken(token),
  ]);

  return Boolean(row);
};

/**
 * Menghapus entri yang tokennya sudah kedaluwarsa secara alami.
 *
 * Token yang sudah lewat masa berlaku akan ditolak oleh `jwt.verify`,
 * sehingga menyimpannya pada daftar cabut tidak lagi berguna.
 */
const purgeExpiredTokens = async () => {
  const result = await runExecute(
    `DELETE FROM token_blacklist
     WHERE expires_at <> '' AND expires_at < ?`,
    [new Date().toISOString()],
  );

  return result.affectedRows || 0;
};

module.exports = { hashToken, revokeToken, isTokenRevoked, purgeExpiredTokens };
