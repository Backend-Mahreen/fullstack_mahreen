/* eslint-disable no-console */
/**
 * Logger terstruktur untuk produksi.
 *
 * Tidak mengekspos stack trace ke console. Hanya mencatat level + pesan.
 * Stack trace hanya ditulis jika NODE_ENV !== 'production'.
 */
const isProduction = process.env.NODE_ENV === 'production';

const sanitize = (message) => {
  if (typeof message === 'string') return message;
  if (message instanceof Error) return message.message;
  try {
    return JSON.stringify(message);
  } catch {
    return String(message);
  }
};

const error = (message, context = '') => {
  const prefix = context ? `[${context}]` : '';
  console.error(`${prefix} ${sanitize(message)}`);

  if (!isProduction && message instanceof Error && message.stack) {
    console.error(message.stack);
  }
};

const warn = (message, context = '') => {
  const prefix = context ? `[${context}]` : '';
  console.warn(`${prefix} ${sanitize(message)}`);
};

const info = (message) => {
  console.log(sanitize(message));
};

module.exports = { error, warn, info };
