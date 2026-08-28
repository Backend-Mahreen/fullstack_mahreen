import type { MouseEvent } from "react";

export const APP_NAVIGATION_EVENT = "mahreen:navigation";
export const APP_BEFORE_NAVIGATION_EVENT = "mahreen:before-navigation";

const normalizeRoutePath = (path: string) => {
  const trimmedPath = path.trim();

  if (!trimmedPath) return "/";

  if (/^(?:https?:)?\/\//i.test(trimmedPath) || /^(?:mailto:|tel:|whatsapp:)/i.test(trimmedPath)) {
    return trimmedPath;
  }

  const withoutLegacyHash = trimmedPath.replace(/^#/, "");
  const [pathAndQuery, fragment = ""] = withoutLegacyHash.split("#", 2);
  const queryIndex = pathAndQuery.indexOf("?");
  const rawPath = queryIndex >= 0 ? pathAndQuery.slice(0, queryIndex) : pathAndQuery;
  const rawQuery = queryIndex >= 0 ? pathAndQuery.slice(queryIndex) : "";
  const routePath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const normalizedPath = routePath.replace(/\/{2,}/g, "/");
  const cleanedPath = normalizedPath.length > 1 && normalizedPath.endsWith("/")
    ? normalizedPath.slice(0, -1)
    : normalizedPath;

  return `${cleanedPath || "/"}${rawQuery}${fragment ? `#${fragment}` : ""}`;
};

/**
 * Nama ini dipertahankan agar seluruh komponen lama tetap kompatibel.
 * Nilai yang dikembalikan sekarang adalah clean URL tanpa hash route.
 */
export const getHashHref = (path: string) => normalizeRoutePath(path);
export const getRouteHref = getHashHref;

export const navigateToRoute = (path: string, options?: Readonly<{ replace?: boolean }>) => {
  const target = normalizeRoutePath(path);

  if (/^(?:https?:)?\/\//i.test(target) || /^(?:mailto:|tel:|whatsapp:)/i.test(target)) {
    window.location.assign(target);
    return;
  }

  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.dispatchEvent(new Event(APP_BEFORE_NAVIGATION_EVENT));

  if (current === target) {
    window.dispatchEvent(new Event(APP_NAVIGATION_EVENT));
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }

  if (options?.replace) {
    window.history.replaceState(window.history.state, "", target);
  } else {
    window.history.pushState(window.history.state, "", target);
  }

  window.dispatchEvent(new Event(APP_NAVIGATION_EVENT));
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

export const handleRouteClick = (
  event: MouseEvent<HTMLAnchorElement>,
  path: string,
) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  navigateToRoute(path);
};

// Alias kompatibilitas: komponen Newsroom lama masih mengimpor nama hash-route.
// Route sekarang clean URL, tetapi API-nya identik.
export const navigateToHashRoute = navigateToRoute;
export const handleHashRouteClick = handleRouteClick;
