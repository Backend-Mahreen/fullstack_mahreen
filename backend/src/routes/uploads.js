const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticate, authorize } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/response');
const { runExecute } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Strip elemen berbahaya dari SVG files setelah upload.
 * Menghapus <script>, <foreignObject>, dan event handler attributes.
 */
const sanitizeSvgFile = (filePath) => {
  try {
    if (!filePath.endsWith('.svg')) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, '');
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch {
    // Jika gagal sanitasi, biarkan file apa adanya (Content-Disposition: attachment tetap aktif).
  }
};

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/bmp',
  'image/svg+xml',
  'image/x-icon',
  'image/heic',
  'image/heif',
  'application/pdf',
];

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/tiff': '.tiff',
  'image/bmp': '.bmp',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
  'image/heic': '.heic',
  'image/heif': '.heif',
  'application/pdf': '.pdf',
};

const MAX_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../..', 'uploads'),
  filename: (_req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype] || '.bin';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipe file tidak didukung: ${file.mimetype}`));
    }
  },
});

/**
 * Simpan metadata file ke tabel media_assets.
 */
const saveMediaAsset = async (file, userId, context = 'general') => {
  try {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    await runExecute(
      `INSERT INTO media_assets (id, file_name, original_name, file_url, mime_type, file_size, uploaded_by, context, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        file.filename,
        file.originalname,
        `/uploads/${file.filename}`,
        file.mimetype,
        file.size,
        userId || null,
        context,
        createdAt,
      ],
    );
  } catch (error) {
    logger.error(error, 'uploads-media-asset');
  }
};

router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return sendError(res, 'Tidak ada file yang dikirim.', 400);
    }
    sanitizeSvgFile(req.file.path);
    const fileUrl = `/uploads/${req.file.filename}`;

    await saveMediaAsset(req.file, req.user?.id, req.body?.context || 'general');

    sendSuccess(
      res,
      {
        fileId: req.file.filename,
        fileName: req.file.originalname,
        fileUrl,
      },
      201,
    );
  },
);

router.post(
  '/admin',
  authenticate,
  authorize('admin', 'superadmin'),
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return sendError(res, 'Tidak ada file yang dikirim.', 400);
    }
    sanitizeSvgFile(req.file.path);
    const fileUrl = `/uploads/${req.file.filename}`;

    await saveMediaAsset(req.file, req.user?.id, req.body?.context || 'admin');

    sendSuccess(
      res,
      {
        fileId: req.file.filename,
        fileName: req.file.originalname,
        fileUrl,
      },
      201,
    );
  },
);

/**
 * POST /api/uploads/from-url
 * Proxy download gambar dari URL eksternal → simpan ke /uploads/.
 * Menyelesaikan masalah CORS karena semua gambar jadi same-origin.
 */
router.post('/from-url', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return sendError(res, 'URL wajib diisi.', 400);
    }

    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return sendError(res, 'URL harus diawali http:// atau https://.', 400);
    }

    let response;
    try {
      response = await fetch(trimmed, {
        headers: { 'User-Agent': 'MahreenAdmin/1.0' },
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      return sendError(
        res,
        'Gagal mengunduh gambar dari URL tersebut. Pastikan URL valid dan server bisa diakses.',
        422,
      );
    }

    if (!response.ok) {
      return sendError(res, `Server gambar mengembalikan status ${response.status}.`, 422);
    }

    const contentType = response.headers.get('content-type') || '';
    const buffer = Buffer.from(await response.arrayBuffer());

    const MAX_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      return sendError(res, 'Ukuran gambar melebihi batas 5MB.', 413);
    }

    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'image/svg+xml': '.svg',
    };

    const mime = Object.keys(mimeToExt).find((key) => contentType.includes(key)) || 'image/webp';
    const ext = mimeToExt[mime] || '.webp';
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(__dirname, '../../..', 'uploads', filename);

    fs.writeFileSync(filePath, buffer);

    if (filePath.endsWith('.svg')) {
      sanitizeSvgFile(filePath);
    }

    const fileUrl = `/uploads/${filename}`;

    try {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      await runExecute(
        `INSERT INTO media_assets (id, file_name, original_name, file_url, mime_type, file_size, uploaded_by, context, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          filename,
          trimmed.split('/').pop() || 'from-url',
          fileUrl,
          mime,
          buffer.length,
          req.user?.id || null,
          'from-url',
          createdAt,
        ],
      );
    } catch (error) {
      logger.error(error, 'uploads-media-asset-from-url');
    }

    sendSuccess(
      res,
      {
        fileId: filename,
        fileName: trimmed.split('/').pop() || 'from-url',
        fileUrl,
      },
      201,
    );
  } catch (error) {
    sendError(res, 'Gagal memproses URL gambar.', 500);
  }
});

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'Ukuran file melebihi batas 5MB.', 400);
    }
    return sendError(res, err.message, 400);
  }
  if (err) {
    return sendError(res, err.message || 'Gagal mengupload file.', 400);
  }
  next();
});

module.exports = router;
