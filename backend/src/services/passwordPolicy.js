/**
 * Password policy — validasi kekuatan kata sandi.
 *
 * Kebijakan saat ini:
 *  - Minimal 8 karakter
 *  - Maksimal 128 karakter
 *  - Harus mengandung setidaknya satu huruf besar
 *  - Harus mengandung setidaknya satu huruf kecil
 *  - Harus mengandung setidaknya satu angka
 *  - Harus mengandung setidaknya satu karakter khusus (!@#$%^&*...)
 */

const MAX_PASSWORD_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Mengevaluasi kekuatan password. Mengembalikan true jika valid.
 */
const validatePassword = (password) => {
  if (typeof password !== 'string') return { valid: false, message: 'Password tidak valid.' };

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, message: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `Password maksimal ${MAX_PASSWORD_LENGTH} karakter.` };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal satu huruf besar.' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal satu huruf kecil.' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal satu angka.' };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal satu karakter khusus.' };
  }

  return { valid: true, message: '' };
};

module.exports = { validatePassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH };
