/**
 * Sanitize HTML sebelum disimpan ke database.
 *
 * Seluruh konten yang berasal dari pengguna harus melalui langkah ini.
 * Tidak ada cara untuk membedakan konten editor WYSIWYG dari injeksi
 * berbahaya di level server tanpa sanitasi.
 */
let createDOMPurify = null;
let JSDOM = null;

try {
  createDOMPurify = require('dompurify');
  JSDOM = require('jsdom').JSDOM;
} catch {
  // dompurify/jsdom tidak tersedia — sanitasi dinonaktifkan.
}

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    // Heading
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    // Inline formatting
    'p',
    'br',
    'hr',
    'strong',
    'em',
    'b',
    'i',
    'u',
    's',
    'mark',
    'small',
    'sub',
    'sup',
    // Links dan media
    'a',
    'img',
    'figure',
    'figcaption',
    // Daftar
    'ul',
    'ol',
    'li',
    // Tabel
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'colgroup',
    'col',
    'caption',
    // Blok khusus
    'blockquote',
    'pre',
    'code',
    'div',
    'span',
    // Embed
    'iframe',
    'video',
    'audio',
    'source',
    // Detail
    'details',
    'summary',
  ],
  ALLOWED_ATTR: [
    'href',
    'target',
    'rel',
    'title',
    'alt',
    'src',
    'width',
    'height',
    'loading',
    'decoding',
    'colspan',
    'rowspan',
    'scope',
    'class',
    'id',
    'style',
    'allow',
    'allowfullscreen',
    'frameborder',
    'scrolling',
    'controls',
    'autoplay',
    'loop',
    'muted',
    'poster',
    'preload',
    'type',
    'start',
    'value',
    'open',
    'datetime',
  ],
  ALLOW_DATA_ATTR: false,
};

let cachedPurify = null;

const getPurify = () => {
  if (cachedPurify) return cachedPurify;
  if (!createDOMPurify || !JSDOM) return null;

  const dom = new JSDOM('');
  cachedPurify = createDOMPurify(dom.window);
  return cachedPurify;
};

/**
 * Membersihkan string HTML.
 * Melempar error bila dompurify tidak tersedia agar kegagalan sanitasi
 * tidak terjadi secara diam-diam (stored XSS risk).
 */
const sanitizeHTML = (input) => {
  if (typeof input !== 'string') return input || '';

  const purify = getPurify();
  if (!purify) {
    throw new Error('HTML sanitizer tidak tersedia. Pastikan dompurify dan jsdom terinstall.');
  }

  return purify.sanitize(input, PURIFY_CONFIG);
};

/**
 * Sanitize hanya teks biasa (strip semua tag).
 */
const stripTags = (input) => {
  if (typeof input !== 'string') return input || '';

  const purify = getPurify();
  if (!purify) {
    throw new Error('HTML sanitizer tidak tersedia. Pastikan dompurify dan jsdom terinstall.');
  }

  return purify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

module.exports = { sanitizeHTML, stripTags };
