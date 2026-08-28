import { lazy, Suspense, useEffect, useState } from "react";
import RouteErrorBoundary from "../components/Loading/RouteErrorBoundary";
import RouteSkeleton from "../components/Loading/RouteSkeleton";
import Home from "../pages/Home/Home";
import { APP_NAVIGATION_EVENT } from "../utils/hashNavigation";

import { GlobalNotificationListener } from "../components/Notifications/GlobalNotificationListener";

const DeferredAppRoutes = lazy(() => import("./DeferredAppRoutes"));

const normalizeCurrentPath = () => {
  const path = (window.location.pathname || "/").replace(/\/{2,}/g, "/");
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
};

const AppRoutes = () => {
  const [isHomepage, setIsHomepage] = useState(() => normalizeCurrentPath() === "/");

  useEffect(() => {
    if (!isHomepage) return;

    const syncRoute = () => setIsHomepage(normalizeCurrentPath() === "/");
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener(APP_NAVIGATION_EVENT, syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener(APP_NAVIGATION_EVENT, syncRoute);
    };
  }, [isHomepage]);

  if (isHomepage) {
    return (
      <RouteErrorBoundary resetKey="homepage">
        <div className="app-route" id="main-content" tabIndex={-1} data-route="/">
          <Home />
        </div>
      </RouteErrorBoundary>
    );
  }

  return (
    <RouteErrorBoundary resetKey={normalizeCurrentPath()}>
      <GlobalNotificationListener />
      <Suspense fallback={<RouteSkeleton />}>
        <DeferredAppRoutes />
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default AppRoutes;
