const crypto = require('crypto');

const MIN_SECRET_LENGTH = 32;

/**
 * Membaca JWT secret dari environment.
 *
 * Tidak ada nilai bawaan. Secret yang dapat ditebak membuat seluruh token
 * dapat dipalsukan, sehingga aplikasi sengaja dihentikan bila konfigurasi
 * belum lengkap atau terlalu lemah.
 */
const readSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim() === '') {
    throw new Error(
      'JWT_SECRET belum diatur pada environment. ' +
        'Buat secret acak minimal 32 karakter, contoh: ' +
        "node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"",
    );
  }

  const trimmed = secret.trim();

  if (trimmed.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET terlalu pendek (${trimmed.length} karakter). ` +
        `Minimal ${MIN_SECRET_LENGTH} karakter diperlukan.`,
    );
  }

  const weakSecrets = [
    'mahreen-dev-secret-key',
    'your-super-secret-jwt-key-change-in-production',
    'secret',
    'changeme',
    'development',
  ];

  if (weakSecrets.includes(trimmed.toLowerCase())) {
    throw new Error(
      'JWT_SECRET masih memakai nilai contoh yang diketahui publik. ' +
        'Ganti dengan secret acak sebelum menjalankan aplikasi.',
    );
  }

  return trimmed;
};

const JWT_SECRET = readSecret();

/**
 * Secret terpisah untuk refresh token.
 *
 * Pemisahan mencegah access token yang bocor dipakai untuk memalsukan
 * refresh token. Bila JWT_REFRESH_SECRET tidak diatur, secret diturunkan
 * secara deterministik dari JWT_SECRET agar tetap berbeda nilainya.
 */
const readRefreshSecret = () => {
  const explicit = process.env.JWT_REFRESH_SECRET;

  if (explicit && explicit.trim().length >= MIN_SECRET_LENGTH) {
    return explicit.trim();
  }

  if (explicit && explicit.trim() !== '') {
    throw new Error(
      `JWT_REFRESH_SECRET terlalu pendek. Minimal ${MIN_SECRET_LENGTH} karakter diperlukan.`,
    );
  }

  return crypto.createHmac('sha256', JWT_SECRET).update('refresh-token-scope').digest('base64url');
};

const JWT_REFRESH_SECRET = readRefreshSecret();

module.exports = { JWT_SECRET, JWT_REFRESH_SECRET, MIN_SECRET_LENGTH };
