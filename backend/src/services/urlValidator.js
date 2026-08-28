/**
 * Validasi URL untuk mencegah injeksi URL berbahaya
 * (javascript:, data:text/html, atau string kosong/null).
 *
 * Hanya mengizinkan:
 *  - URL absolut yang dimulai dengan http:// atau https://
 *  - Path relatif yang dimulai dengan /
 */
const SAFE_URL_PATTERN = /^(https?:\/\/[^\s<>"]+|\/[^\s<>"]*)$/;

const validateURL = (value, fieldName = 'URL') => {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: '' };
  }

  const trimmed = String(value).trim();
  if (trimmed === '') return { valid: true, value: '' };

  if (!SAFE_URL_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: `${fieldName} tidak valid. Gunakan URL yang dimulai dengan http://, https://, atau /.`,
    };
  }

  return { valid: true, value: trimmed };
};

module.exports = { validateURL, SAFE_URL_PATTERN };
