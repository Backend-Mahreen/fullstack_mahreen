import { useEffect, useMemo, useSyncExternalStore } from "react";
import { isPublishedNewsroomArticle } from "../data/newsroomLocalDatabase";
import { newsroomService } from "../services/newsroom/newsroomService";

const useNewsroomDatabase = (admin = false) => {
  const database = useSyncExternalStore(
    newsroomService.subscribe,
    newsroomService.getSnapshot,
    newsroomService.getSnapshot,
  );

  useEffect(() => {
    const hydrateFn = admin ? newsroomService.hydrateAdmin() : newsroomService.hydrate();
    void hydrateFn.catch(() => {
      // Snapshot lokal tetap digunakan ketika backend Newsroom belum tersedia.
    });
  }, [admin]);

  return database;
};

export const usePublishedNewsroomDatabase = () => {
  const database = useNewsroomDatabase();
  return useMemo(
    () => ({
      ...database,
      articles: database.articles.filter(isPublishedNewsroomArticle),
    }),
    [database],
  );
};

export default useNewsroomDatabase;
