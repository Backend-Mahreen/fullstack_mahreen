/**
 * Server-Sent Events broadcaster untuk newsroom events.
 * Admin CRUD trigger → push ke semua connected clients.
 */

const logger = require('../utils/logger');

/** @type {Set<import("express").Response>} */
const clients = new Set();

/**
 * Mendaftarkan SSE client.
 * @param {import("express").Response} res
 */
const addClient = (res) => {
  clients.add(res);
  logger.info(`SSE client connected. Total: ${clients.size}`, 'sse');

  res.on('close', () => {
    clients.delete(res);
    logger.info(`SSE client disconnected. Total: ${clients.size}`, 'sse');
  });
};

/**
 * Broadcast event ke semua connected SSE clients.
 *
 * @param {"event:created" | "event:updated" | "event:deleted"} eventType
 * @param {object} data - Payload yang dikirim ke client
 */
const broadcast = (eventType, data) => {
  if (clients.size === 0) return;

  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }

  logger.info(`SSE broadcast ${eventType} to ${clients.size} client(s)`, 'sse');
};

module.exports = { addClient, broadcast };
