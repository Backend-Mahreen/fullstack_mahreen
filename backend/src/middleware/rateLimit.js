const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');

const MINUTE = 60 * 1000;

/**
 * Membentuk limiter dengan pesan berbahasa Indonesia yang konsisten
 * dengan format error aplikasi.
 */
const createLimiter = ({ windowMs, max, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
      const retryAfterSeconds = Math.ceil(windowMs / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return sendError(res, message, 429);
    },
  });

/**
 * Percobaan login. Hanya permintaan gagal yang dihitung, sehingga pengguna
 * sah yang berhasil masuk tidak terkena limit.
 */
const loginLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  max: 8,
  skipSuccessfulRequests: true,
  message:
    'Terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit atau gunakan pemulihan sandi.',
});

/** Pendaftaran akun baru, mencegah pembuatan akun massal. */
const registerLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  max: 5,
  message: 'Terlalu banyak pendaftaran dari alamat ini. Coba lagi dalam satu jam.',
});

/** Perpanjangan token. Batas longgar karena dipanggil otomatis oleh klien. */
const refreshLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  max: 60,
  message: 'Terlalu banyak permintaan perpanjangan sesi. Coba lagi beberapa saat lagi.',
});

/**
 * Pemulihan sandi (forgot/reset password). Limiter terpisah dari registrasi
 * agar penyalahgunaan endpoint ini tidak menghabiskan kuota pendaftaran.
 */
const passwordResetLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  max: 5,
  message: 'Terlalu banyak permintaan pemulihan sandi. Coba lagi dalam satu jam.',
});

/** Formulir publik: donasi, pendaftaran magang, konsultasi. */
const publicFormLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  max: 20,
  message: 'Terlalu banyak pengiriman formulir. Coba lagi dalam satu jam.',
});

/** Verifikasi sertifikat, mencegah penebakan kode secara massal. */
const verificationLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  max: 30,
  message: 'Terlalu banyak percobaan verifikasi. Coba lagi dalam 15 menit.',
});

/** Verifikasi dan manajemen trusted device. */
const trustedDeviceLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  max: 10,
  message: 'Terlalu banyak percobaan verifikasi device. Coba lagi dalam 15 menit.',
});

/** Public read-only GET endpoints (articles, products, events, etc.). */
const publicReadLimiter = createLimiter({
  windowMs: MINUTE,
  max: 100,
  message: 'Terlalu banyak permintaan. Coba lagi dalam satu menit.',
});

module.exports = {
  createLimiter,
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  passwordResetLimiter,
  publicFormLimiter,
  publicReadLimiter,
  verificationLimiter,
  trustedDeviceLimiter,
};
