const fallbackSiteUrl = "https://mahreenindonesia.com";

const normalizeOrigin = (value) => {
  if (!value) return null;

  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(candidate).origin;
  } catch {
    return null;
  }
};

export const getSiteUrl = () =>
  normalizeOrigin(
    process.env.VITE_SITE_URL ||
      process.env.SITE_URL,
  ) ?? fallbackSiteUrl;

export { fallbackSiteUrl };
