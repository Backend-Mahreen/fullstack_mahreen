import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { dashboardDataService } from "../../../services/dashboard/dashboardDataService";
import { clientInvoiceService } from "../../../services/invoice/clientInvoiceService";
import { NOTIFICATION_EVENT_BUS_NAME } from "../../../hooks/useNotificationTrigger";
import type { DashboardLocalData } from "../../DashboardClient/dashboardLocalData";
import ClientAccountLayout from "../components/ClientAccountLayout";
import type { ClientInvoice } from "../invoice/types";
import OverviewInvoicePreview from "./components/OverviewInvoicePreview";
import OverviewProjects from "./components/OverviewProjects";
import OverviewSchedule from "./components/OverviewSchedule";
import OverviewStats from "./components/OverviewStats";
import "./Overview.css";

const Overview = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardLocalData | null>(() =>
    user ? dashboardDataService.getInitial(user) : null,
  );
  const [invoices, setInvoices] = useState<ClientInvoice[] | null>(() =>
    user ? clientInvoiceService.getInitial(user) : null,
  );

  useEffect(() => {
    if (!user) return;
    let active = true;

    const refresh = async () => {
      try {
        const [nextDashboard, nextInvoices] = await Promise.all([
          dashboardDataService.load(user),
          clientInvoiceService.load(user),
        ]);
        if (!active) return;
        setDashboard(nextDashboard);
        setInvoices(nextInvoices);
      } catch {
        // Initial local data remains visible when a configured API is unavailable.
      }
    };

    void refresh();
    const unsubscribeDashboard = dashboardDataService.subscribe(refresh);
    const unsubscribeInvoices = clientInvoiceService.subscribe(refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      unsubscribeDashboard();
      unsubscribeInvoices();
      window.removeEventListener("focus", refresh);
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const onNotify = (event: Event) => {
      const detail = (event as CustomEvent<{ resource: string }>).detail;
      if (!detail) return;
      if (["orders", "invoices", "all"].includes(detail.resource)) {
        void clientInvoiceService.load(user).then(setInvoices).catch(() => undefined);
        void dashboardDataService.load(user).then(setDashboard).catch(() => undefined);
      }
    };
    window.addEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
    return () => window.removeEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
  }, [user]);

  if (!user || !dashboard || !invoices) return null;

  const pendingInvoiceCount = invoices.filter(
    (invoice) => invoice.status !== "paid",
  ).length;
  const packageName = dashboard.projects.find((project) => project.serviceCategory)
    ?.serviceCategory ?? "Pro";

  return (
    <ClientAccountLayout activeItem="overview" className="account-overview-page">
      <div className="account-overview">
        <header className="account-overview__hero">
          <div>
            <span>CLIENT PORTAL</span>
            <h1>Overview</h1>
          </div>
          <p>Ringkasan project, invoice, dan jadwal untuk {user.nickname || user.fullName}.</p>
        </header>

        <OverviewStats
          projectCount={dashboard.projects.length}
          pendingInvoiceCount={pendingInvoiceCount}
          scheduleCount={dashboard.scheduleEntries.length}
          packageName={packageName}
        />
        <OverviewProjects projects={dashboard.projects} />
        <div className="account-overview__bottom-grid">
          <OverviewSchedule entries={dashboard.scheduleEntries} />
          <OverviewInvoicePreview invoices={invoices} />
        </div>
      </div>
    </ClientAccountLayout>
  );
};

export default Overview;
