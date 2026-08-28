const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { runSingle, runExecute, runQuery } = require('../config/database');
const { authenticate, extractBearerToken } = require('../middleware/auth');
const { resolvePermissions } = require('../middleware/permissions');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/secrets');
const { revokeToken, isTokenRevoked } = require('../services/tokenBlacklist');
const {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  passwordResetLimiter,
  trustedDeviceLimiter,
} = require('../middleware/rateLimit');
const { validatePassword } = require('../services/passwordPolicy');
const {
  TRUSTED_DEVICE_EXPIRY_DAYS,
  createTrustedToken,
  validateTrustedToken,
  rollExpiration,
  revokeDevice,
  revokeAllDevices,
  listDevices,
  enforceDeviceLimit,
} = require('../services/trustedDevice');
const logger = require('../utils/logger');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
const REMEMBER_DAYS = Math.max(1, Number(process.env.REFRESH_REMEMBER_DAYS || 30));
const DAY_MS = 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_NAME = 'refreshToken';
const SALT_ROUNDS = 10;

/**
 * Mengubah string durasi (mis. "7d", "30d") menjadi milidetik.
 * Bila format tidak dikenali, kembali ke fallbackMs.
 */
const parseDurationMs = (value, fallbackMs) => {
  const match = String(value || '').match(/^(\d+)([smhd])$/i);
  if (!match) return fallbackMs;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: DAY_MS };
  return amount * multipliers[unit];
};

const REFRESH_COOKIE_OPTIONS = (remember) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: remember ? REMEMBER_DAYS * DAY_MS : parseDurationMs(REFRESH_TOKEN_EXPIRY, 7 * DAY_MS),
});

const TRUSTED_DEVICE_COOKIE = 'trustedDevice';

const TRUSTED_DEVICE_COOKIE_OPTIONS = (expiresAt) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: TRUSTED_DEVICE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  expires: expiresAt instanceof Date ? expiresAt : new Date(expiresAt),
});

const setTrustedDeviceCookie = (res, rawToken, expiresAt) => {
  res.cookie(TRUSTED_DEVICE_COOKIE, rawToken, TRUSTED_DEVICE_COOKIE_OPTIONS(expiresAt));
};

const clearTrustedDeviceCookie = (res) => {
  res.clearCookie(TRUSTED_DEVICE_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  });
};

const sanitizeUser = (user) => {
  // `user` di sini sudah berupa hasil `normalizeUser` (camelCase, tanpa password).
  // Kembalikan whitelist lengkap agar frontend memperoleh fullName + permissions.
  return {
    id: user.id,
    accountType: user.accountType,
    fullName: user.fullName,
    nickname: user.nickname,
    email: user.email,
    whatsapp: user.whatsapp,
    birthDate: user.birthDate,
    gender: user.gender,
    jobTitle: user.jobTitle,
    institution: user.institution,
    linkedin: user.linkedin,
    portfolio: user.portfolio,
    instagram: user.instagram,
    interests: user.interests,
    newsletter: user.newsletter,
    profilePhoto: user.profilePhoto,
    role: user.role,
    permissions: user.permissions,
    status: user.status,
    createdAt: user.createdAt,
  };
};

const normalizeUser = async (row) => ({
  id: row.id,
  accountType: row.account_type,
  fullName: row.full_name,
  nickname: row.nickname,
  email: row.email,
  whatsapp: row.whatsapp,
  birthDate: row.birth_date,
  gender: row.gender,
  jobTitle: row.job_title,
  institution: row.institution,
  linkedin: row.linkedin,
  portfolio: row.portfolio,
  instagram: row.instagram,
  interests:
    typeof row.interests === 'string' ? JSON.parse(row.interests || '[]') : row.interests || [],
  newsletter: Boolean(row.newsletter),
  profilePhoto: row.profile_photo,
  role: row.role,
  permissions: await resolvePermissions(row),
  createdAt: row.created_at,
});

const generateTokens = async (user, remember) => {
  const permissions = await resolvePermissions(user);
  const payload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName || user.full_name,
    accountType: user.accountType || user.account_type,
    role: user.role,
    permissions,
  };

  const accessToken = jwt.sign({ ...payload, jti: uuidv4() }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  // Refresh token memakai secret terpisah agar access token yang bocor
  // tidak dapat dipakai untuk memalsukan refresh token.
  // jti (JWT ID) memastikan setiap refresh token unik — tanpa ini,
  // token dengan payload + secret yang sama akan identik secara deterministik.
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh', jti: uuidv4() },
    JWT_REFRESH_SECRET,
    {
      expiresIn: remember ? `${REMEMBER_DAYS}d` : REFRESH_TOKEN_EXPIRY,
    },
  );

  return { accessToken, refreshToken, remember };
};

/**
 * Mengirim access token di body dan refresh token sebagai httpOnly cookie.
 * Cookie tidak dapat diakses oleh JavaScript sisi klien (mencegah XSS-based token theft).
 */
const sendAuthTokens = async (res, user, tokens, statusCode = 200, extra = {}) => {
  res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS(tokens.remember));

  return sendSuccess(
    res,
    {
      user: sanitizeUser(await normalizeUser(user)),
      session: {
        accountId: user.id,
        email: user.email,
        fullName: user.full_name,
        accountType: user.account_type,
        role: user.role,
        loggedInAt: new Date().toISOString(),
        accessToken: tokens.accessToken,
        // Refresh token TIDAK dikirim di body — hanya di cookie httpOnly.
      },
      ...extra,
    },
    statusCode,
  );
};

/**
 * Membaca refresh token dari cookie atau request body (backward compat).
 */
const readRefreshToken = (req) => {
  return req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken || null;
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email wajib diisi.', 400);

    const user = await runSingle('SELECT id, email FROM users WHERE email = ?', [
      email.toLowerCase(),
    ]);
    if (!user) {
      return sendSuccess(res, {
        message: 'Jika email terdaftar, instruksi reset password telah dikirim.',
      });
    }

    const crypto = require('crypto');
    const resetToken = jwt.sign({ id: user.id, type: 'reset', jti: uuidv4() }, JWT_SECRET, {
      expiresIn: '15m',
    });
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await runExecute(
      'INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, used, created_at) VALUES (?, ?, ?, ?, 0, ?)',
      [uuidv4(), user.id, tokenHash, expiresAt, new Date().toISOString()],
    );

    return sendSuccess(res, {
      message: 'Jika email terdaftar, instruksi reset password telah dikirim.',
    });
  } catch (error) {
    logger.error(error, 'forgot-password');
    return sendError(res, 'Terjadi kesalahan saat memproses permintaan.', 500);
  }
});

router.post('/reset-password', passwordResetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return sendError(res, 'Token dan password wajib diisi.', 400);

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return sendError(res, 'Token tidak valid atau telah kedaluwarsa.', 401);
    }

    if (decoded.type !== 'reset') return sendError(res, 'Token bukan reset token.', 401);

    const crypto = require('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await runSingle(
      'SELECT id, used, expires_at FROM password_reset_tokens WHERE token_hash = ? AND user_id = ?',
      [tokenHash, decoded.id],
    );

    if (!record) return sendError(res, 'Token tidak ditemukan.', 401);
    if (record.used) return sendError(res, 'Token sudah digunakan.', 401);
    if (new Date(record.expires_at) < new Date())
      return sendError(res, 'Token telah kedaluwarsa.', 401);

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) return sendError(res, passwordCheck.message);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await runExecute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);
    await runExecute('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [record.id]);

    return sendSuccess(res, { message: 'Password berhasil diubah. Silakan login kembali.' });
  } catch (error) {
    logger.error(error, 'reset-password');
    return sendError(res, 'Terjadi kesalahan saat mereset password.', 500);
  }
});

router.post('/register', registerLimiter, async (req, res) => {
  try {
    const {
      accountType,
      fullName,
      email,
      whatsapp,
      password,
      birthDate,
      gender,
      jobTitle,
      institution,
      linkedin,
      portfolio,
      instagram,
      interests,
      newsletter,
      profilePhoto,
      nickname,
    } = req.body;

    if (!fullName || !email || !password)
      return sendError(res, 'Nama lengkap, email, dan password wajib diisi.');
    if (!validateEmail(email)) return sendError(res, 'Format email tidak valid.');
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) return sendError(res, passwordCheck.message);

    const existing = await runSingle('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) return sendError(res, 'Email sudah terdaftar.', 409);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const id = uuidv4();
    const now = new Date().toISOString();

    await runExecute(
      `INSERT INTO users (id, account_type, full_name, nickname, email, whatsapp, password, birth_date, gender, job_title, institution, linkedin, portfolio, instagram, interests, newsletter, profile_photo, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        accountType || 'individual',
        fullName,
        nickname || '',
        email.toLowerCase(),
        whatsapp || '',
        hashedPassword,
        birthDate || '',
        gender || '',
        jobTitle || '',
        institution || '',
        linkedin || '',
        portfolio || '',
        instagram || '',
        JSON.stringify(interests || []),
        newsletter ? 1 : 0,
        profilePhoto || '',
        'client',
        now,
      ],
    );

    const user = await runSingle('SELECT * FROM users WHERE id = ?', [id]);
    const tokens = await generateTokens(user, false);

    return sendAuthTokens(res, user, tokens, 201);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 'Email sudah terdaftar.', 409);
    }
    logger.error(error, 'register');
    return sendError(res, 'Terjadi kesalahan saat registrasi.', 500);
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if (!email || !password) return sendError(res, 'Email dan password wajib diisi.');

    const user = await runSingle('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) return sendError(res, 'Email atau password salah.', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Email atau password salah.', 401);

    // Akun yang disuspend/nonaktif tidak boleh membuat sesi baru.
    if (user.status && user.status !== 'active') {
      return sendError(res, 'Akun Anda tidak aktif. Hubungi administrator.', 403);
    }

    // Cek trusted device cookie — bypass MFA jika perangkat dipercaya.
    let mfaSkipped = false;
    const trustedCookie = req.cookies?.[TRUSTED_DEVICE_COOKIE];
    if (trustedCookie) {
      const deviceStatus = await validateTrustedToken(user.id, trustedCookie, req);
      if (deviceStatus.valid) {
        const newExpiresAt = await rollExpiration(user.id, trustedCookie, req);
        if (newExpiresAt) {
          setTrustedDeviceCookie(res, trustedCookie, newExpiresAt);
          mfaSkipped = true;
        }
      } else {
        clearTrustedDeviceCookie(res);
      }
    }

    const tokens = await generateTokens(user, remember);
    return sendAuthTokens(res, user, tokens, 200, { mfaRequired: false, mfaSkipped });
  } catch (error) {
    logger.error(error, 'login');
    return sendError(res, 'Terjadi kesalahan saat login.', 500);
  }
});

router.post('/admin/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if (!email || !password) return sendError(res, 'Email dan password wajib diisi.');

    const user = await runSingle('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return sendError(res, 'Email atau password salah.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Email atau password salah.', 401);

    // Akun admin yang disuspend/nonaktif tidak boleh membuat sesi baru.
    if (user.status && user.status !== 'active') {
      return sendError(res, 'Akun Anda tidak aktif. Hubungi administrator.', 403);
    }

    // Cek trusted device cookie — bypass MFA jika perangkat dipercaya.
    let mfaSkipped = false;
    const trustedCookie = req.cookies?.[TRUSTED_DEVICE_COOKIE];
    if (trustedCookie) {
      const deviceStatus = await validateTrustedToken(user.id, trustedCookie, req);
      if (deviceStatus.valid) {
        const newExpiresAt = await rollExpiration(user.id, trustedCookie, req);
        if (newExpiresAt) {
          setTrustedDeviceCookie(res, trustedCookie, newExpiresAt);
          mfaSkipped = true;
        }
      } else {
        clearTrustedDeviceCookie(res);
      }
    }

    const tokens = await generateTokens(user, remember);
    return sendAuthTokens(res, user, tokens, 200, { mfaRequired: false, mfaSkipped });
  } catch (error) {
    logger.error(error, 'admin-login');
    return sendError(res, 'Terjadi kesalahan saat login admin.', 500);
  }
});

router.post('/refresh', refreshLimiter, async (req, res) => {
  try {
    const refreshToken = readRefreshToken(req);
    if (!refreshToken) return sendError(res, 'Refresh token wajib disertakan.', 400);

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(res, 'Refresh token telah kedaluwarsa. Silakan login kembali.', 401);
      }
      return sendError(res, 'Refresh token tidak valid.', 401);
    }

    if (decoded.type !== 'refresh') {
      return sendError(res, 'Token bukan refresh token.', 401);
    }

    if (await isTokenRevoked(refreshToken)) {
      return sendError(res, 'Refresh token telah dicabut.', 401);
    }

    const user = await runSingle('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!user) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    // ROTATION: invalidate refresh token lama, issue yang baru.
    // Ini mencegah token curian dipakai berulang — setiap refresh hanya boleh dipakai sekali.
    const remainingMs = decoded.exp * 1000 - Date.now();
    const isLongLived = remainingMs > REMEMBER_DAYS * DAY_MS;
    await revokeToken(refreshToken, 'refresh', decoded.exp);

    const newTokens = await generateTokens(user, isLongLived);
    return sendAuthTokens(res, user, newTokens);
  } catch (error) {
    logger.error(error, 'refresh');
    return sendError(res, 'Terjadi kesalahan saat memperbarui token.', 500);
  }
});

/**
 * POST /api/auth/logout
 *
 * Mencabut access token, refresh token, dan semua trusted device,
 * lalu menghapus cookie.
 *
 * Tidak memerlukan autentikasi — logout harus selalu berhasil bahkan
 * jika access token sudah kedaluwarsa. Ini mencegah 401 loop ketika
 * token expiry memicu logout dari sisi client.
 */
router.post('/logout', async (req, res) => {
  try {
    const accessToken = req.authToken || extractBearerToken(req);

    // Verifikasi token secara manual (soft) — jika valid, cabut.
    let userId = null;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        userId = decoded.id;
        await revokeToken(accessToken, 'access', decoded.exp ?? null);
      } catch {
        // Token expired/invalid — tidak bisa cabut, tapi tetap lanjut.
      }
    }

    const refreshToken = readRefreshToken(req);
    if (refreshToken) {
      let refreshExp = null;
      try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        refreshExp = decoded.exp ?? null;
        userId = userId || decoded.id;
        await revokeToken(refreshToken, 'refresh', refreshExp);
      } catch {
        // Refresh token expired/invalid — tetap lanjut.
      }
    }

    // Cabut semua trusted device milik user (jika user teridentifikasi).
    if (userId) {
      try {
        await revokeAllDevices(userId);
      } catch {
        // Best-effort — jangan gagalkan logout karena error cleanup.
      }
    }

    // Hapus cookie refresh token.
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
    });

    // Hapus cookie trusted device.
    clearTrustedDeviceCookie(res);

    return sendSuccess(res, { message: 'Berhasil logout.' });
  } catch (error) {
    logger.error(error, 'logout');
    return sendSuccess(res, { message: 'Berhasil logout.' });
  }
});

/**
 * POST /api/auth/change-password
 *
 * Mengubah password akun yang sedang login. Memverifikasi password lama,
 * memvalidasi kekuatan password baru, lalu memperbarui hash di database.
 */
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Password saat ini dan password baru wajib diisi.', 400);
    }

    const user = await runSingle('SELECT id, password FROM users WHERE id = ?', [req.user.id]);
    if (!user) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return sendError(res, 'Password saat ini salah.', 401);

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) return sendError(res, passwordCheck.message);

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await runExecute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    return sendSuccess(res, { message: 'Password berhasil diubah.' });
  } catch (error) {
    logger.error(error, 'change-password');
    return sendError(res, 'Terjadi kesalahan saat mengubah password.', 500);
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await runSingle('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    const response = {
      user: sanitizeUser(await normalizeUser(user)),
      session: {
        accountId: user.id,
        email: user.email,
        fullName: user.full_name,
        accountType: user.account_type,
        role: user.role,
        loggedInAt: new Date().toISOString(),
        accessToken: req.authToken,
      },
    };

    return sendSuccess(res, response);
  } catch (error) {
    logger.error(error, 'me');
    return sendError(res, 'Terjadi kesalahan saat mengambil data pengguna.', 500);
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const user = await runSingle('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return sendError(res, 'Pengguna tidak ditemukan.', 404);

    const allowedFields = [
      'full_name',
      'nickname',
      'whatsapp',
      'birth_date',
      'gender',
      'job_title',
      'institution',
      'linkedin',
      'portfolio',
      'instagram',
      'interests',
      'newsletter',
    ];
    const updates = {};
    for (const field of allowedFields) {
      const camel = field.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (req.body[camel] !== undefined || req.body[field] !== undefined) {
        updates[field] = req.body[camel] ?? req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return sendError(res, 'Tidak ada data yang diperbarui.', 400);
    }

    updates.updated_at = new Date().toISOString();
    const setClauses = Object.keys(updates).map((k) => `${k} = ?`);
    const values = Object.values(updates);
    values.push(req.user.id);

    await runExecute(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, values);

    const updated = await runSingle('SELECT * FROM users WHERE id = ?', [req.user.id]);
    return sendSuccess(res, { user: sanitizeUser(await normalizeUser(updated)) });
  } catch (error) {
    logger.error(error, 'profile-update');
    return sendError(res, 'Gagal memperbarui profil.', 500);
  }
});

router.get('/admin/stats', authenticate, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin')
    return sendError(res, 'Akses ditolak.', 403);

  const { countTable } = require('../config/database');
  const stats = {
    totalUsers: await countTable('users'),
    adminCount:
      (await runSingle("SELECT COUNT(*) as c FROM users WHERE role IN ('admin', 'superadmin')"))
        ?.c || 0,
    clientCount: (await runSingle("SELECT COUNT(*) as c FROM users WHERE role = 'client'"))?.c || 0,
    internCount: (await runSingle("SELECT COUNT(*) as c FROM users WHERE role = 'intern'"))?.c || 0,
  };

  return sendSuccess(res, stats);
});

// ── Trusted Device Endpoints ───────────────────────────────────────────────

/**
 * POST /api/auth/trusted-device/verify
 *
 * Menerbitkan atau mencabut trusted device cookie.
 * Dipanggil setelah login sukses saat user memilih "Remember this device".
 */
router.post('/trusted-device/verify', authenticate, trustedDeviceLimiter, async (req, res) => {
  try {
    const { remember } = req.body;

    if (remember) {
      // Batasi jumlah device per user sebelum membuat baru.
      await enforceDeviceLimit(req.user.id);

      const { rawToken, expiresAt } = await createTrustedToken(req.user.id, req);
      setTrustedDeviceCookie(res, rawToken, expiresAt);

      return sendSuccess(res, {
        message: 'Perangkat ditandai sebagai dipercaya.',
        expiresAt: expiresAt.toISOString(),
      });
    }

    // User tidak centang remember → cabut cookie jika ada.
    clearTrustedDeviceCookie(res);
    return sendSuccess(res, { message: 'Cookie trusted device dihapus.' });
  } catch (error) {
    logger.error(error, 'trusted-device-verify');
    return sendError(res, 'Terjadi kesalahan saat memverifikasi device.', 500);
  }
});

/**
 * GET /api/auth/trusted-devices
 *
 * Menampilkan semua trusted device aktif untuk user yang login.
 */
router.get('/trusted-devices', authenticate, async (req, res) => {
  try {
    const devices = await listDevices(req.user.id);
    return sendSuccess(res, { devices });
  } catch (error) {
    logger.error(error, 'trusted-devices-list');
    return sendError(res, 'Terjadi kesalahan saat mengambil daftar device.', 500);
  }
});

/**
 * DELETE /api/auth/trusted-devices/:id
 *
 * Mencabut satu trusted device berdasarkan ID.
 */
router.delete('/trusted-devices/:id', authenticate, async (req, res) => {
  try {
    const revoked = await revokeDevice(req.params.id, req.user.id);
    if (!revoked) return sendError(res, 'Device tidak ditemukan.', 404);

    return sendSuccess(res, { message: 'Device berhasil dicabut.' });
  } catch (error) {
    logger.error(error, 'trusted-device-revoke');
    return sendError(res, 'Terjadi kesalahan saat mencabut device.', 500);
  }
});

/**
 * DELETE /api/auth/trusted-devices
 *
 * Mencabut semua trusted device milik user.
 */
router.delete('/trusted-devices', authenticate, async (req, res) => {
  try {
    await revokeAllDevices(req.user.id);
    clearTrustedDeviceCookie(res);

    return sendSuccess(res, { message: 'Semua device berhasil dicabut.' });
  } catch (error) {
    logger.error(error, 'trusted-devices-revoke-all');
    return sendError(res, 'Terjadi kesalahan saat mencabut semua device.', 500);
  }
});

module.exports = router;
