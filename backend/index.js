require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { initDatabase } = require('./src/config/database');
const { seedDatabase } = require('./src/config/seed');
const { purgeExpiredTokens } = require('./src/services/tokenBlacklist');
const { purgeExpired: purgeExpiredTrustedDevices } = require('./src/services/trustedDevice');
const logger = require('./src/utils/logger');
const { publicReadLimiter } = require('./src/middleware/rateLimit');
const authRoutes = require('./src/routes/auth');
const articleRoutes = require('./src/routes/articles');
const webinarRoutes = require('./src/routes/webinars');
const eventRoutes = require('./src/routes/events');
const topicRoutes = require('./src/routes/topics');
const productRoutes = require('./src/routes/products');
const servicePackageRoutes = require('./src/routes/service-packages');
const internshipRoutes = require('./src/routes/internships');
const csrRoutes = require('./src/routes/csr');
const donationRoutes = require('./src/routes/donations');
const transactionRoutes = require('./src/routes/transactions');
const collectionRoutes = require('./src/routes/collections');
const adminRoutes = require('./src/routes/admin');
const clientRoutes = require('./src/routes/client');
const uploadRoutes = require('./src/routes/uploads');
const speakerRoutes = require('./src/routes/speakers');
const newsletterRoutes = require('./src/routes/newsletter');
const newsroomSettingsRoutes = require('./src/routes/newsroomSettings');
const categoryRoutes = require('./src/routes/categories');
const consultationRoutes = require('./src/routes/consultations');
const serviceOrderRoutes = require('./src/routes/serviceOrders');
const newsroomRoutes = require('./src/routes/newsroom');
const eventRegistrationsRoutes = require('./src/routes/eventRegistrations');
const studioOrderRoutes = require('./src/routes/studioOrders');
const engagementRoutes = require('./src/routes/engagement');
const analyticsTrackRoutes = require('./src/routes/analyticsTrack');
const verificationPublicRoutes = require('./src/routes/verification');
const faqsRoutes = require('./src/routes/faqs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { addClient: addSseClient } = require('./src/services/sseBroadcaster');

const app = express();
const PORT = process.env.PORT || 3000;

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Support multiple CORS origins (comma-separated).
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());
const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

// Diperlukan agar rate limiter membaca IP klien yang benar ketika aplikasi
// berjalan di belakang reverse proxy (nginx, Vercel, Cloudflare).
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);

/**
 * Header keamanan dasar.
 *
 * API ini tidak menyajikan HTML, sehingga CSP dimatikan agar tidak
 * mengganggu klien. Proteksi lain (HSTS, nosniff, frameguard,
 * referrer policy) tetap aktif.
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

app.use(cookieParser());

// Kompresi response dengan gzip untuk mengurangi ukuran transfer.
app.use(compression());
app.use(corsMiddleware);

// Batas payload dipersempit dari 10mb. Nilai ini cukup untuk seluruh
// endpoint yang ada dan mengurangi permukaan serangan kehabisan memori.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/auth', authRoutes);

// Public read-only endpoints — rate-limited to prevent scraping and DDoS.
// Cache-Control headers enable CDN/proxy caching for read-heavy endpoints.
const setPublicCacheHeaders = (req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }
  next();
};

app.use('/api/articles', publicReadLimiter, setPublicCacheHeaders, articleRoutes);
app.use('/api/webinars', publicReadLimiter, setPublicCacheHeaders, webinarRoutes);
app.use('/api/events', publicReadLimiter, setPublicCacheHeaders, eventRoutes);
app.use('/api/topics', publicReadLimiter, setPublicCacheHeaders, topicRoutes);
app.use('/api/products', publicReadLimiter, setPublicCacheHeaders, productRoutes);
app.use('/api/service-packages', publicReadLimiter, setPublicCacheHeaders, servicePackageRoutes);
app.use('/api/internships', publicReadLimiter, setPublicCacheHeaders, internshipRoutes);
app.use('/api/csr', publicReadLimiter, setPublicCacheHeaders, csrRoutes);
app.use('/api/donations', publicReadLimiter, setPublicCacheHeaders, donationRoutes);
app.use('/api/transactions', publicReadLimiter, setPublicCacheHeaders, transactionRoutes);
app.use('/api/collections', publicReadLimiter, setPublicCacheHeaders, collectionRoutes);

// Router khusus admin, terpisah dari seluruh route publik di atas.
app.use('/api/admin', adminRoutes);

// Router khusus client portal, seluruh data difilter berdasarkan user login.
app.use('/api/client', clientRoutes);

// Upload endpoint
app.use('/api/uploads', uploadRoutes);

// Speakers endpoint
app.use('/api/speakers', speakerRoutes);

// Newsletter subscribers endpoint
app.use('/api/newsletter', newsletterRoutes);

// Newsroom settings endpoint
app.use('/api/newsroom-settings', newsroomSettingsRoutes);

// Categories endpoint
app.use('/api/categories', categoryRoutes);

// Public consultation endpoint
app.use('/api/consultations', consultationRoutes);

// Public service order endpoint
app.use('/api/service-orders', serviceOrderRoutes);

// Public newsroom endpoint
app.use('/api/newsroom', newsroomRoutes);

// Event registration & payment endpoints
app.use('/api/events', eventRegistrationsRoutes);

// Studio product order endpoints
app.use('/api/studio/orders', studioOrderRoutes);

// Public engagement endpoints (contact, support, newsletter subscriptions)
app.use('/api', engagementRoutes);

// Analytics tracking ingestion (fire-and-forget)
app.use('/api/analytics', analyticsTrackRoutes);

// Public certificate verification
app.use('/api/verification', verificationPublicRoutes);

// Public FAQ
app.use('/api/faqs', publicReadLimiter, setPublicCacheHeaders, faqsRoutes);

/**
 * SSE endpoint — client subscribe untuk mendapat update real-time events.
 * GET /api/newsroom/events/stream
 */
app.get('/api/newsroom/events/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  res.write(':\n\n');

  addSseClient(res);

  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 30000);

  res.on('close', () => {
    clearInterval(heartbeat);
  });
});

// Serve uploaded files — restrict content types to prevent XSS via HTML/SVG.
// Multer menulis ke <repo>/uploads (lihat src/routes/uploads.js), jadi lokasi
// static harus menunjuk ke direktori yang sama, bukan backend/uploads.
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res, filePath) => {
      if (/\.(html?|svg|xml|xhtml)$/i.test(filePath)) {
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
    },
  }),
);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Mahreen Indonesia API' });
});

// Swagger / OpenAPI UI.
// Spec di-generate oleh `npm run swagger` (swagger.js) ke swagger-output.json.
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Mahreen Indonesia API Docs',
  }),
);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

app.use((err, req, res, _next) => {
  logger.error(err, 'server');
  res.status(500).json({ message: 'Terjadi kesalahan internal server.' });
});

const TOKEN_PURGE_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Membersihkan entri daftar cabut yang tokennya sudah kedaluwarsa.
 * Tanpa pembersihan, tabel bertambah tanpa batas seiring pemakaian.
 */
const scheduleTokenPurge = () => {
  const run = async () => {
    try {
      const removed = await purgeExpiredTokens();
      if (removed > 0) {
        logger.info(`Pembersihan daftar cabut token: ${removed} entri kedaluwarsa dihapus.`);
      }
    } catch (error) {
      logger.error(error, 'server');
    }

    try {
      const removedDevices = await purgeExpiredTrustedDevices();
      if (removedDevices > 0) {
        logger.info(`Pembersihan trusted device: ${removedDevices} entri kedaluwarsa dihapus.`);
      }
    } catch (error) {
      logger.error(error, 'server');
    }
  };

  run();

  const timer = setInterval(run, TOKEN_PURGE_INTERVAL_MS);
  timer.unref();
};

const start = async () => {
  try {
    await initDatabase();
    logger.info('Database MySQL terinisialisasi.');

    await seedDatabase();
    logger.info('Seed data selesai.');

    scheduleTokenPurge();

    app.listen(PORT, () => {
      logger.info(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error, 'server');
    process.exit(1);
  }
};

start();

module.exports = app;
