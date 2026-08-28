import { useEffect, useRef } from "react";

type SeoMetadata = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  ogType?: string;
  robots?: string;
  structuredData?: Record<string, unknown>;
};

const setMetaContent = (
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

/**
 * Hook untuk update SEO metadata (title, meta tags, canonical, structured data)
 * secara langsung ke DOM. Digunakan saat navigasi SPA.
 *
 * Hanya aktif setelah client navigation pertama — metadata awal sudah di-set
 * di HTML server-side agar tidak menghalangi LCP.
 */
export const useSeoMetadata = (
  path: string,
  getMetadata: (path: string) => SeoMetadata | Promise<SeoMetadata>,
) => {
  const hasClientNavigationRef = useRef(false);

  // Tandai bahwa client navigation sudah terjadi
  useEffect(() => {
    hasClientNavigationRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasClientNavigationRef.current) return;

    const applyMetadata = async () => {
      const metadata = await getMetadata(path);
      const canonicalPath = metadata.canonicalPath ?? path;
    const canonicalUrl = new URL(canonicalPath, window.location.origin).toString();

    document.title = metadata.title;
    document.documentElement.lang = "id";

    const robots = metadata.robots ?? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    const imageUrl = new URL(metadata.image ?? "/og-image.jpg", window.location.origin).toString();

    setMetaContent('meta[name="description"]', "name", "description", metadata.description);
    setMetaContent('meta[name="robots"]', "name", "robots", robots);
    setMetaContent('meta[property="og:site_name"]', "property", "og:site_name", "Mahreen Indonesia");
    setMetaContent('meta[property="og:locale"]', "property", "og:locale", "id_ID");
    setMetaContent('meta[property="og:title"]', "property", "og:title", metadata.title);
    setMetaContent('meta[property="og:description"]', "property", "og:description", metadata.description);
    setMetaContent('meta[property="og:type"]', "property", "og:type", metadata.ogType ?? "website");
    setMetaContent('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaContent('meta[property="og:image"]', "property", "og:image", imageUrl);
    setMetaContent('meta[property="og:image:secure_url"]', "property", "og:image:secure_url", imageUrl);
    setMetaContent('meta[property="og:image:type"]', "property", "og:image:type", "image/jpeg");
    setMetaContent('meta[property="og:image:width"]', "property", "og:image:width", "1200");
    setMetaContent('meta[property="og:image:height"]', "property", "og:image:height", "630");
    setMetaContent('meta[property="og:image:alt"]', "property", "og:image:alt", "Mahreen Indonesia — Creative, Digital, Business & Social Ecosystem");
    setMetaContent('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaContent('meta[name="twitter:site"]', "name", "twitter:site", "@mahreen_id");
    setMetaContent('meta[name="twitter:creator"]', "name", "twitter:creator", "@mahreen_id");
    setMetaContent('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
    setMetaContent('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
    setMetaContent('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
    setMetaContent('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", "Mahreen Indonesia — Creative, Digital, Business & Social Ecosystem");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    let imageSource = document.head.querySelector<HTMLLinkElement>('link[rel="image_src"]');

    if (!imageSource) {
      imageSource = document.createElement("link");
      imageSource.rel = "image_src";
      document.head.appendChild(imageSource);
    }

    imageSource.href = imageUrl;

    document.head
      .querySelectorAll('script[type="application/ld+json"][data-route-seo]')
      .forEach((element) => element.remove());

    if (!robots.startsWith("noindex")) {
      const structuredData = metadata.structuredData ?? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        inLanguage: "id-ID",
        isPartOf: {
          "@type": "WebSite",
          name: "Mahreen Indonesia",
          url: window.location.origin,
        },
      };

      const schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.dataset.routeSeo = "true";
      schema.text = JSON.stringify(structuredData);
      document.head.appendChild(schema);
    }
    };

    applyMetadata();
  }, [path, getMetadata]);
};
