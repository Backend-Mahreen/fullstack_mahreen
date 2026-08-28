import { AlertTriangle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../hooks/useAuth";
import { NOTIFICATION_EVENT_BUS_NAME } from "../../hooks/useNotificationTrigger";
import Navbar from "../../components/Navbar/Navbar";
import { dashboardDataService } from "../../services/dashboard/dashboardDataService";
import ActiveProjects from "./components/ActiveProjects";
import ConsultationBanner from "./components/ConsultationBanner";
import DashboardHeader from "./components/DashboardHeader";
import MetricCards from "./components/MetricCards";
import NewsroomSection from "./components/NewsroomSection";
import OngoingOrder from "./components/OngoingOrder";
import ProfileCompletionCard from "./components/ProfileCompletionCard";
import RecentActivity from "./components/RecentActivity";
import UpcomingSchedule from "./components/UpcomingSchedule";
import WebinarInvite from "./components/WebinarInvite";
import "./DashboardClient.css";
import type { DashboardLocalData } from "./dashboardLocalData";

const DashboardClient = () => {
  const { user } = useAuth();
  const initialDashboardData = user
    ? dashboardDataService.getInitial(user)
    : null;
  const [dashboardData, setDashboardData] = useState<DashboardLocalData | null>(
    initialDashboardData,
  );
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    initialDashboardData ? "ready" : "loading",
  );
  const [retryRevision, setRetryRevision] = useState(0);

  const refreshDashboard = useCallback(() => {
    if (!user) return;
    setLoadState((current) => (current === "ready" ? current : "loading"));
    void dashboardDataService
      .load(user)
      .then((nextData) => {
        setDashboardData(nextData);
        setLoadState("ready");
      })
      .catch(() => {
        setLoadState((current) =>
          current === "ready" ? "ready" : "error",
        );
      });
  }, [retryRevision, user]);

  useEffect(() => {
    if (!user) return;
    refreshDashboard();
    const unsubscribe = dashboardDataService.subscribe(refreshDashboard);
    window.addEventListener("focus", refreshDashboard);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", refreshDashboard);
    };
  }, [refreshDashboard, user]);

  useEffect(() => {
    if (!user) return;
    const onNotify = (event: Event) => {
      const detail = (event as CustomEvent<{ resource: string }>).detail;
      if (!detail) return;
      refreshDashboard();
    };
    window.addEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
    return () => window.removeEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
  }, [refreshDashboard, user]);

  if (!user) return null;

  if (!dashboardData) {
    return (
      <>
        <Navbar homeHref="/" homeLabel="Home" />
        <main className="client-dashboard-page">
          <div className="client-dashboard client-dashboard--state">
            {loadState === "error" ? (
              <section className="client-dashboard__load-card is-error" role="alert">
                <AlertTriangle aria-hidden="true" />
                <span className="client-dashboard__load-eyebrow">Dashboard Client</span>
                <h1>Dashboard belum dapat dimuat</h1>
                <p>
                  Koneksi ke layanan dashboard sedang bermasalah. Data akun Anda
                  tetap aman. Silakan coba kembali.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoadState("loading");
                    setRetryRevision((current) => current + 1);
                  }}
                >
                  <RefreshCw aria-hidden="true" />
                  Coba lagi
                </button>
              </section>
            ) : (
              <section className="client-dashboard__load-card" role="status">
                <span className="client-dashboard__loader" aria-hidden="true" />
                <span className="client-dashboard__load-eyebrow">Dashboard Client</span>
                <h1>Menyiapkan dashboard Anda</h1>
                <p>Memuat proyek, transaksi, dan aktivitas terbaru.</p>
              </section>
            )}
          </div>
        </main>
      </>
    );
  }

  const displayName = user.nickname || user.fullName;
  const memberYear = new Date(user.createdAt).getFullYear() || new Date().getFullYear();

  return (
    <>
      <Navbar homeHref="/" homeLabel="Home" />
      <main className="client-dashboard-page">
        <div className="client-dashboard" id="overview">
          <div className="client-dashboard__shell">
            <div className="client-dashboard__stack">
              <DashboardHeader
                displayName={displayName}
                memberId={user.id}
                memberYear={memberYear}
              />

              <section className="client-dashboard__overview" aria-label="Ringkasan akun" data-dashboard-reveal data-dashboard-step="2">
                <ProfileCompletionCard
                  items={dashboardData.completionItems}
                  percentage={dashboardData.completionPercentage}
                />
                <MetricCards metrics={dashboardData.metrics} />
              </section>

              <ConsultationBanner />

              <section className="client-dashboard__work-grid" id="projects" data-dashboard-reveal data-dashboard-step="4">
                <ActiveProjects projects={dashboardData.projects} />
                <RecentActivity activities={dashboardData.activities} />
              </section>

              <OngoingOrder order={dashboardData.order} />

              <section className="client-dashboard__content-grid" data-dashboard-reveal data-dashboard-step="7">
                <NewsroomSection />
                <WebinarInvite />
              </section>

              <UpcomingSchedule entries={dashboardData.scheduleEntries} />
            </div>
          </div>
        </div>

        <div className="client-dashboard__closing">
          <ClosingSection />
        </div>

        <div className="client-dashboard__footer">
          <Footer />
        </div>
      </main>
    </>
  );
};

export default DashboardClient;
