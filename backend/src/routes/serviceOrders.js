const express = require('express');
const router = express.Router();
const { runExecute, runSingle } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { requireNonEmptyHeader } = require('../middleware/csrf');

router.post('/', requireNonEmptyHeader, publicFormLimiter, async (req, res) => {
  try {
    const { selection, billingInformation, total, status: requestedStatus } = req.body;
    if (!selection?.serviceKey && !selection?.category)
      return sendError(res, 'serviceKey wajib diisi', 400);
    if (!billingInformation?.fullName) return sendError(res, 'fullName wajib diisi', 400);
    if (!total || Number(total) <= 0) return sendError(res, 'total harus bilangan positif', 400);
    if (Number(total) > 1000000000) return sendError(res, 'total melebihi batas maksimal', 400);

    const id = uuidv4();
    const invoiceId = `INV-${uuidv4().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    // Status finansial (paid/completed) tidak boleh ditetapkan klien pada
    // endpoint publik. Hanya status awal proses yang diizinkan.
    const CLIENT_ALLOWED_STATUSES = ['pending', 'in_progress'];
    const orderStatus = CLIENT_ALLOWED_STATUSES.includes(requestedStatus)
      ? requestedStatus
      : 'pending';
    const tierName = selection?.tier?.name || '';
    const serviceKey = selection?.serviceKey || selection?.category || '';
    const addons = JSON.stringify(selection?.addOns || []);

    await runExecute(
      `INSERT INTO service_orders (id, user_id, invoice_id, service_key, tier, client_name, client_email, total_price, addons, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        null,
        invoiceId,
        serviceKey,
        tierName,
        billingInformation?.fullName || '',
        '',
        total || 0,
        addons,
        orderStatus,
        now,
        now,
      ],
    );

    sendSuccess(
      res,
      {
        transactionId: id,
        status: orderStatus,
        invoiceId,
        selection,
        billingInformation,
        total,
        updatedAt: now,
      },
      201,
    );
  } catch (error) {
    logger.error(error, 'serviceOrders');
    sendError(res, 'Gagal membuat pesanan layanan', 500);
  }
});

module.exports = router;
