import { FolderKanban } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { NOTIFICATION_EVENT_BUS_NAME } from "../../../hooks/useNotificationTrigger";
import { dashboardDataService } from "../../../services/dashboard/dashboardDataService";
import { handleRouteClick } from "../../../utils/hashNavigation";
import type { DashboardLocalData } from "../dashboardLocalData";
import ClientProjectCard from "./components/ClientProjectCard";
import { toClientProjectView } from "./projectViewModel";
import "./ClientProjectsPage.css";

const ProjectSkeleton = () => (
  <div className="client-projects__skeleton" aria-label="Memuat daftar proyek">
    {[0, 1, 2].map((item) => <span key={item} />)}
  </div>
);

const ClientProjectsPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardLocalData | null>(
    () => (user ? dashboardDataService.getInitial(user) : null),
  );

  const refresh = useCallback(() => {
    if (!user) return;
    void dashboardDataService.load(user).then((nextData) => {
      setDashboardData(nextData);
    }).catch(() => undefined);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refresh();
    const unsubscribe = dashboardDataService.subscribe(refresh);
    window.addEventListener("focus", refresh);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, [refresh, user]);

  useEffect(() => {
    if (!user) return;
    const onNotify = (event: Event) => {
      const detail = (event as CustomEvent<{ resource: string }>).detail;
      if (!detail) return;
      if (["orders", "all"].includes(detail.resource)) {
        void refresh();
      }
    };
    window.addEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
    return () => window.removeEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
  }, [refresh, user]);

  const projects = useMemo(
    () => dashboardData?.projects.map((project) =>
      toClientProjectView(project, user?.nickname || user?.fullName || ""),
    ) ?? [],
    [dashboardData?.projects, user?.fullName, user?.nickname],
  );

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="projects" className="client-projects-page">
      <div className="client-projects-content">
        <h1 className="client-account-visually-hidden">Projects</h1>
        {!dashboardData ? (
          <ProjectSkeleton />
        ) : projects.length ? (
          projects.map((project, index) => (
            <ClientProjectCard project={project} index={index} key={project.id} />
          ))
        ) : (
          <section className="client-projects__empty" role="status">
            <FolderKanban aria-hidden="true" />
            <h2>Belum ada proyek aktif</h2>
            <p>
              Proyek akan tampil otomatis setelah konsultasi atau pemesanan
              layanan Anda tersimpan.
            </p>
            <a
              href="/tanya-mahreen"
              onClick={(event) => handleRouteClick(event, "/tanya-mahreen")}
            >
              Mulai proyek
            </a>
          </section>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientProjectsPage;
