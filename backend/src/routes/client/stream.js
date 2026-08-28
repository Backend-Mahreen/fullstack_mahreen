const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const logger = require('../../utils/logger');
const { getClientStreamManager } = require('../../services/streamManager');

/**
 * Endpoint SSE khusus untuk client/user yang sudah login.
 * Frontend client bisa subscribe ke event-event spesifik akunnya
 * seperti update order, status konsultasi, notifikasi donasi, dll.
 */
router.get('/', authenticate, (req, res) => {
  /*
    #swagger.tags = ['Client Stream']
    #swagger.summary = 'Connect to User SSE Stream'
    #swagger.description = 'Endpoint Server-Sent Events (SSE) agar client mendapatkan update real-time.'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const userId = req.user.id;
  const topics = req.query.topics ? String(req.query.topics).split(',') : ['all'];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
  const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.flushHeaders();

  // Kirim koneksi sukses awal
  res.write('event: connected\ndata: {"status": "connected"}\n\n');

  const streamManager = getClientStreamManager();
  
  // Register client connection
  const connectionId = streamManager.addClient(userId, res, topics);

  req.on('close', () => {
    streamManager.removeClient(userId, connectionId);
    logger.info(`User ${userId} disconnected from SSE`);
  });
});

module.exports = router;
