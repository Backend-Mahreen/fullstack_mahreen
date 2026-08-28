const crypto = require('crypto');
const logger = require('../utils/logger');

class StreamManager {
  constructor() {
    // Map<userId, Map<connectionId, { res, topics }>>
    this.clients = new Map();
  }

  addClient(userId, res, topics = ['all']) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Map());
    }
    
    const connectionId = crypto.randomUUID();
    this.clients.get(userId).set(connectionId, { res, topics });
    
    logger.info(`Stream client connected: user=${userId}, conn=${connectionId}, topics=${topics.join(',')}`);
    return connectionId;
  }

  removeClient(userId, connectionId) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(connectionId);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Broadcast event ke koneksi user yang spesifik.
   * @param {string} userId - ID user tujuan
   * @param {string} eventName - Nama event (misal: 'order_update')
   * @param {Object} payload - Data event
   * @param {string} topic - Topik untuk filtering client (misal: 'orders')
   */
  sendToUser(userId, eventName, payload, topic = 'all') {
    const userClients = this.clients.get(userId);
    if (!userClients) return;

    const dataString = JSON.stringify(payload);
    let sentCount = 0;

    for (const [connectionId, client] of userClients.entries()) {
      if (client.topics.includes('all') || client.topics.includes(topic)) {
        try {
          client.res.write(`event: ${eventName}\ndata: ${dataString}\n\n`);
          sentCount++;
        } catch (err) {
          logger.error(`Failed to send SSE to user=${userId}, conn=${connectionId}`, err);
          this.removeClient(userId, connectionId);
        }
      }
    }

    if (sentCount > 0) {
      logger.info(`SSE broadcasted event=${eventName} to user=${userId} (${sentCount} connections)`);
    }
  }
}

// Singleton instance
const clientStreamManager = new StreamManager();

module.exports = {
  getClientStreamManager: () => clientStreamManager,
};
