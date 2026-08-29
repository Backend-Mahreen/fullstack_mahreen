const express = require('express');
const router = express.Router();
const { runExecute } = require('../config/database');
const { sendSuccess } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * POST /api/analytics/track
 *
 * Mencatat event analitik dari browser (page_view, engagement, dll).
 * Bersifat fire-and-forget: klien tidak bergantung pada respons sukses,
 * sehingga kegagalan pencatatan tidak mengganggu pengalaman pengguna.
 */
router.post('/track', publicFormLimiter, async (req, res) => {
  try {
    const { eventName, category, path, referrer, sessionId, device, country, metadata } = req.body;

    if (!eventName || typeof eventName !== 'string') {
      return sendSuccess(res, { received: false });
    }

    const id = uuidv4();
    await runExecute(
      `INSERT INTO analytics_events (id, event_name, event_category, path, referrer, session_id, device, country, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(eventName).slice(0, 100),
        String(category || '').slice(0, 50),
        String(path || '').slice(0, 500),
        String(referrer || '').slice(0, 500),
        String(sessionId || '').slice(0, 64),
        String(device || '').slice(0, 30),
        String(country || '').slice(0, 60),
        metadata ? JSON.stringify(metadata) : null,
        new Date().toISOString(),
      ],
    );

    return sendSuccess(res, { received: true });
  } catch (error) {
    logger.error(error, 'analytics-track');
    return sendSuccess(res, { received: false });
  }
});

module.exports = router;
