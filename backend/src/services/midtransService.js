const midtransClient = require('midtrans-client');
const logger = require('../utils/logger');

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

const core = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

/**
 * Membuat transaksi Midtrans Snap dan mengembalikan redirect URL.
 *
 * @param {object} params
 * @param {string} params.orderId - ID unik order
 * @param {number} params.amount - Nominal dalam Rupiah
 * @param {string} params.customerName - Nama pelanggan
 * @param {string} params.customerEmail - Email pelanggan
 * @param {string} params.customerPhone - Nomor telepon (opsional)
 * @param {string} params.itemName - Nama item
 * @param {string} [params.callbackUrl] - URL callback setelah pembayaran
 * @returns {Promise<{ token: string, redirect_url: string }>}
 */
const createTransaction = async ({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  itemName,
  callbackUrl,
}) => {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: customerName,
      email: customerEmail,
      phone: customerPhone || '',
    },
    item_details: [
      {
        id: orderId,
        price: amount,
        quantity: 1,
        name: itemName,
      },
    ],
    callbacks: callbackUrl
      ? {
          finish: callbackUrl,
        }
      : undefined,
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    logger.info(`Midtrans transaction created: ${orderId}`, 'midtrans');
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    };
  } catch (error) {
    logger.error(`Midtrans create transaction error: ${error.message}`, 'midtrans');
    throw error;
  }
};

/**
 * Verifikasi notifikasi dari Midtrans (webhook).
 * Mengembalikan status pembayaran yang sudah diverifikasi.
 *
 * @param {object} notification - Body notifikasi dari Midtrans
 * @returns {Promise<{ order_id: string, transaction_id: string, transaction_status: string, fraud_status: string, payment_type: string }>}
 */
const handleNotification = async (notification) => {
  try {
    const statusResponse = await core.transaction.notification(notification);
    const { order_id, transaction_id, transaction_status, fraud_status, payment_type } =
      statusResponse;

    logger.info(
      `Midtrans notification: ${order_id} -> ${transaction_status} (fraud: ${fraud_status})`,
      'midtrans',
    );

    return {
      order_id,
      transaction_id,
      transaction_status,
      fraud_status: fraud_status || '',
      payment_type,
    };
  } catch (error) {
    logger.error(`Midtrans notification error: ${error.message}`, 'midtrans');
    throw error;
  }
};

/**
 * Menentukan status pembayaran final dari kombinasi
 * transaction_status + fraud_status Midtrans.
 *
 * @param {string} transactionStatus
 * @param {string} fraudStatus
 * @returns {"paid" | "pending" | "failed" | "expired" | "denied"}
 */
const resolvePaymentStatus = (transactionStatus, fraudStatus) => {
  if (transactionStatus === 'capture') {
    return fraudStatus === 'accept' ? 'paid' : 'pending';
  }
  if (transactionStatus === 'settlement') return 'paid';
  if (transactionStatus === 'pending') return 'pending';
  if (transactionStatus === 'deny' || transactionStatus === 'cancel') return 'denied';
  if (transactionStatus === 'expire') return 'expired';
  if (transactionStatus === 'failure') return 'failed';
  return 'pending';
};

module.exports = {
  createTransaction,
  handleNotification,
  resolvePaymentStatus,
};
