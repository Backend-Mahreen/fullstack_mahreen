const express = require('express');
const router = express.Router();
const { runQuery, runSingle, runExecute } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_SETTINGS = {
  ticker_messages: JSON.stringify([
    'Mahreen Indonesia Internship Batch 2 resmi dibuka.',
    'Seminar "Future of AI in Indonesia" segera hadir.',
  ]),
  home_hero_kicker: 'Archive 2025',
  home_hero_title: 'Newsroom',
  home_hero_description:
    'Temukan wawasan terbaru seputar teknologi, bisnis, dan inovasi dari ekosistem Mahreen Indonesia.',
  cta_eyebrow: 'Mahreen Indonesia',
  cta_heading: 'Mari Bangun Sesuatu Bermakna Bersama',
  cta_description:
    'Ubah gagasan menjadi kolaborasi nyata. Bersama Mahreen Indonesia, wujudkan visi digital yang berdampak.',
  cta_button_primary: 'Mulai Kolaborasi',
  cta_button_primary_link: process.env.FRONTEND_CTA_PRIMARY_LINK || '/tanya-mahreen',
  cta_button_secondary: 'Hubungi Kami',
  cta_button_secondary_link: process.env.FRONTEND_CTA_SECONDARY_LINK || '/contact',
  closing_title: "Let's Build Something Meaningful Together",
  closing_description:
    'Bersama Mahreen Indonesia, wujudkan ide menjadi kolaborasi nyata yang memberikan dampak positif.',
  closing_tagline: 'Mari Bertumbuh dan Memberikan Manfaat Bersama Mahreen Indonesia.',
  events_hero_kicker: 'EVENT DIRECTORY 2026',
  events_hero_title: 'Explore Events',
  events_hero_description:
    'Temukan webinar, seminar, workshop, dan event menarik dari ekosistem Mahreen Indonesia.',
  tags_hero_kicker: 'KNOWLEDGE DIRECTORY 2026',
  tags_hero_title: 'Explore Topics',
  tags_hero_description:
    'Temukan artikel, insight, webinar, dan topik menarik dari ekosistem Mahreen Indonesia.',
  berita_hero_featured_slug: '',
};

router.get('/', async (_req, res) => {
  try {
    const rows = await runQuery('SELECT setting_key, setting_value FROM newsroom_settings');
    const settings = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value ?? '';
    }
    sendSuccess(res, settings);
  } catch (error) {
    sendError(res, 'Gagal mengambil pengaturan newsroom', 500);
  }
});

router.get('/:key', async (req, res) => {
  try {
    const row = await runSingle(
      'SELECT setting_value FROM newsroom_settings WHERE setting_key = ?',
      [req.params.key],
    );
    const value = row?.setting_value ?? DEFAULT_SETTINGS[req.params.key] ?? '';
    sendSuccess(res, { key: req.params.key, value });
  } catch (error) {
    sendError(res, 'Gagal mengambil pengaturan', 500);
  }
});

router.put('/', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return sendError(res, 'Data settings tidak valid.', 400);
    }

    const now = new Date().toISOString();
    for (const [key, value] of Object.entries(settings)) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await runExecute(
        `INSERT INTO newsroom_settings (id, setting_key, setting_value, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = VALUES(updated_at)`,
        [uuidv4(), key, stringValue, now, now],
      );
    }

    sendSuccess(res, { message: 'Pengaturan berhasil disimpan.' });
  } catch (error) {
    sendError(res, 'Gagal menyimpan pengaturan', 500);
  }
});

module.exports = router;
