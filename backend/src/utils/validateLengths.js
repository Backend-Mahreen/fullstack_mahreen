/**
 * Input length validation — mencegah MySQL truncation/error
 * dan mengurangi risiko payload besar yang tidak perlu.
 */
const MAX_LENGTHS = {
  fullName: 255,
  nickname: 100,
  email: 255,
  whatsapp: 50,
  jobTitle: 100,
  institution: 255,
  linkedin: 255,
  portfolio: 255,
  instagram: 100,
  title: 500,
  description: 2000,
  excerpt: 2000,
  category: 100,
  message: 5000,
  notes: 5000,
  slug: 255,
  phone: 50,
  city: 255,
  motivation: 5000,
};

/**
 * Validate that string fields do not exceed max lengths.
 * Returns { valid, errors } — errors is an array of field: message strings.
 */
const validateLengths = (fields) => {
  const errors = [];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string') continue;
    const max = MAX_LENGTHS[key];
    if (max && value.length > max) {
      errors.push(`${key} maksimal ${max} karakter.`);
    }
  }
  return { valid: errors.length === 0, errors };
};

module.exports = { validateLengths, MAX_LENGTHS };
