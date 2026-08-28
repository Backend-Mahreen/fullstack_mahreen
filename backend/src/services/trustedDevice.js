const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { runSingle, runExecute, runQuery } = require('../config/database');

const TRUSTED_DEVICE_EXPIRY_DAYS = 30;
const MAX_TRUSTED_DEVICES = 5;

const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

/**
 * Membangun fingerprint perangkat dari header HTTP.
 *
 * Fingerprint bukan identitas unik per-device, melainkan pencocokan
 * "apakah request ini datang dari perangkat + browser yang sama".
 * Bila user mengganti browser/OS, fingerprint berubah → token dianggap
 * tidak valid → user harus MFA ulang.
 */
const generateFingerprint = (req) => {
  const ua = req.headers['user-agent'] || '';
  const lang = req.headers['accept-language'] || '';
  const hint = req.body?.deviceHint || '';
  return crypto.createHash('sha256').update(`${ua}|${lang}|${hint}`).digest('hex');
};

/**
 * Membuat trusted device token baru.
 *
 * Token mentah hanya dikirim sekali ke klien melalui cookie httpOnly.
 * Server hanya menyimpan hash-nya — bila database bocor, token aktif
 * tidak dapat dipulihkan.
 */
const createTrustedToken = async (userId, req) => {
  const rawToken = crypto.randomBytes(48).toString('base64url');
  const tokenHash = hashToken(rawToken);
  const fingerprint = generateFingerprint(req);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TRUSTED_DEVICE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await runExecute(
    `INSERT INTO trusted_devices
       (id, user_id, device_fingerprint, token_hash, ip_address, user_agent, is_active, expires_at, last_used_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
    [
      uuidv4(),
      userId,
      fingerprint,
      tokenHash,
      req.ip || '',
      (req.headers['user-agent'] || '').slice(0, 500),
      expiresAt.toISOString(),
      now.toISOString(),
      now.toISOString(),
    ],
  );

  return { rawToken, expiresAt };
};

/**
 * Memvalidasi trusted device token.
 *
 * Pengecekan berurutan dari yang paling murah ke paling mahal:
 * 1. Hash → lookup (index seek, sangat cepat)
 * 2. Status is_active
 * 3. Masa berlaku
 * 4. Kecocokan fingerprint perangkat
 */
const validateTrustedToken = async (userId, rawToken, req) => {
  if (!rawToken) return { valid: false, reason: 'no_token' };

  const tokenHash = hashToken(rawToken);

  const record = await runSingle(
    'SELECT * FROM trusted_devices WHERE token_hash = ? AND user_id = ? LIMIT 1',
    [tokenHash, userId],
  );

  if (!record) return { valid: false, reason: 'token_not_found' };

  if (!record.is_active) return { valid: false, reason: 'token_revoked' };

  const now = new Date();
  if (new Date(record.expires_at) < now) {
    await runExecute('UPDATE trusted_devices SET is_active = 0 WHERE id = ?', [record.id]);
    return { valid: false, reason: 'token_expired' };
  }

  const currentFingerprint = generateFingerprint(req);
  if (record.device_fingerprint !== currentFingerprint) {
    await runExecute('UPDATE trusted_devices SET is_active = 0 WHERE id = ?', [record.id]);
    return { valid: false, reason: 'device_mismatch' };
  }

  return { valid: true, record };
};

/**
 * Sliding expiration — memperpanjang masa berlaku 30 hari dari sekarang.
 *
 * Dipanggil setiap kali pengguna login sukses dari perangkat dipercaya.
 * Memastikan cookie dan database tetap sinkron.
 */
const rollExpiration = async (userId, rawToken, req) => {
  const tokenHash = hashToken(rawToken);
  const now = new Date();
  const newExpiresAt = new Date(now.getTime() + TRUSTED_DEVICE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const result = await runExecute(
    `UPDATE trusted_devices
     SET expires_at = ?, last_used_at = ?, ip_address = ?
     WHERE user_id = ? AND token_hash = ? AND is_active = 1`,
    [newExpiresAt.toISOString(), now.toISOString(), req.ip || '', userId, tokenHash],
  );

  return result.affectedRows > 0 ? newExpiresAt : null;
};

/** Mencabut satu device. */
const revokeDevice = async (deviceId, userId) => {
  const result = await runExecute(
    'UPDATE trusted_devices SET is_active = 0 WHERE id = ? AND user_id = ?',
    [deviceId, userId],
  );
  return result.affectedRows > 0;
};

/** Mencabut semua device untuk user. */
const revokeAllDevices = async (userId) => {
  await runExecute('UPDATE trusted_devices SET is_active = 0 WHERE user_id = ? AND is_active = 1', [
    userId,
  ]);
};

/** Menampilkan semua device aktif untuk user. */
const listDevices = async (userId) => {
  const rows = await runQuery(
    `SELECT id, device_fingerprint, label, ip_address, user_agent, expires_at, last_used_at, created_at
     FROM trusted_devices
     WHERE user_id = ? AND is_active = 1
     ORDER BY last_used_at DESC`,
    [userId],
  );
  return rows;
};

/**
 * Membatasi jumlah trusted device per user.
 *
 * Jika melebihi batas, device yang paling lama digunakan akan di-revoke
 * secara otomatis (FIFO). Mencegah akumulasi token tak terpakai.
 */
const enforceDeviceLimit = async (userId, max = MAX_TRUSTED_DEVICES) => {
  const countRow = await runSingle(
    'SELECT COUNT(*) AS c FROM trusted_devices WHERE user_id = ? AND is_active = 1',
    [userId],
  );

  if (!countRow || countRow.c <= max) return;

  const excess = countRow.c - max;
  await runExecute(
    `UPDATE trusted_devices SET is_active = 0
     WHERE user_id = ? AND is_active = 1
     ORDER BY last_used_at ASC
     LIMIT ?`,
    [userId, excess],
  );
};

/** Menghapus entri expired/revoked dari database (housekeeping). */
const purgeExpired = async () => {
  const gracePeriod = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const result = await runExecute(
    'DELETE FROM trusted_devices WHERE is_active = 0 OR expires_at < ?',
    [gracePeriod],
  );
  return result.affectedRows || 0;
};

module.exports = {
  TRUSTED_DEVICE_EXPIRY_DAYS,
  MAX_TRUSTED_DEVICES,
  hashToken,
  generateFingerprint,
  createTrustedToken,
  validateTrustedToken,
  rollExpiration,
  revokeDevice,
  revokeAllDevices,
  listDevices,
  enforceDeviceLimit,
  purgeExpired,
};
