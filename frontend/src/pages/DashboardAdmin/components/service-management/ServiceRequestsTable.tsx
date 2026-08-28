import { SlidersHorizontal, UserRoundPlus, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  ConsultationStatus,
  ServiceRequest,
} from "../../../../services/serviceManagement/serviceManagementRepository";
import { getInitials } from "../../../../utils/formatName";

type RequestTab = "All Requests" | "Pending" | "Reviewed" | "Scheduled" | "Archived";

type ServiceRequestsTableProps = {
  query: string;
  requests: ServiceRequest[];
  onAssign: (request: ServiceRequest) => void;
  onUpdate: (id: string, status: ConsultationStatus) => void;
};

const PAGE_SIZE = 5;
const tabs: RequestTab[] = ["All Requests", "Pending", "Reviewed", "Scheduled", "Archived"];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const ServiceRequestsTable = ({
  query,
  requests,
  onAssign,
  onUpdate,
}: ServiceRequestsTableProps) => {
  const [activeTab, setActiveTab] = useState<RequestTab>("All Requests");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(0);
  const [menuId, setMenuId] = useState<string | null>(null);
  const categories = useMemo(
    () => ["All", ...new Set(requests.map((request) => request.serviceCategory))],
    [requests],
  );
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return requests.filter((request) => {
      const tabMatches = activeTab === "All Requests" || request.status === activeTab;
      const categoryMatches = category === "All" || request.serviceCategory === category;
      const queryMatches =
        !normalizedQuery ||
        [
          request.clientName,
          request.email,
          request.company,
          request.serviceRequested,
          request.assignedPm,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      return tabMatches && categoryMatches && queryMatches;
    });
  }, [activeTab, category, query, requests]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const changeTab = (tab: RequestTab) => {
    setActiveTab(tab);
    setPage(0);
    setMenuId(null);
  };

  return (
    <section className="sm-admin__table-panel sm-admin__reveal" style={{ "--sm-delay": "440ms" } as React.CSSProperties}>
      <div className="sm-admin__table-toolbar">
        <div className="sm-admin__tabs" role="tablist" aria-label="Filter consultation requests">
          {tabs.map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "is-active" : ""}
              onClick={() => changeTab(tab)}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
        <label className="sm-admin__category-filter">
          <span>Filter by:</span>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }}>
            {categories.map((item) => <option value={item} key={item}>{item === "All" ? "Service Category" : item}</option>)}
          </select>
          <SlidersHorizontal aria-hidden="true" />
        </label>
      </div>

      <div className="sm-admin__table-scroll">
        <table className="sm-admin__table sm-admin__requests-table">
          <thead>
            <tr><th>Client Name</th><th>Company</th><th>Service Requested</th><th>Date</th><th>Status</th><th>Assigned PM</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="sm-admin__client-cell">
                    <span>{getInitials(request.clientName)}</span>
                    <div><strong>{request.clientName}</strong><small>{request.email}</small></div>
                  </div>
                </td>
                <td>{request.company}</td>
                <td><span className="sm-admin__service-chip">{request.serviceRequested}</span><small className="sm-admin__budget-copy">{request.budgetLabel}</small></td>
                <td>{formatDate(request.date)}</td>
                <td><span className={`sm-admin__request-status is-${request.status.toLowerCase()}`}><i />{request.status}</span></td>
                <td>{request.assignedPm ? <strong className="sm-admin__pm-name">{request.assignedPm}</strong> : <span className="sm-admin__unassigned">Unassigned</span>}</td>
                <td className="sm-admin__action-cell">
                  {!request.assignedPm ? (
                    <button className="sm-admin__assign-link" type="button" onClick={() => onAssign(request)}><UserRoundPlus aria-hidden="true" />Assign PM</button>
                  ) : (
                    <>
                      <button className="sm-admin__row-menu-button" type="button" aria-label={`Actions for ${request.clientName}`} aria-expanded={menuId === request.id} onClick={() => setMenuId((current) => current === request.id ? null : request.id)}><MoreVertical aria-hidden="true" /></button>
                      {menuId === request.id ? (
                        <div className="sm-admin__row-menu">
                          {(["Reviewed", "Scheduled", "Converted", "Archived"] as ConsultationStatus[]).map((status) => (
                            <button type="button" key={status} onClick={() => { onUpdate(request.id, status); setMenuId(null); }}>{status}</button>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? <div className="sm-admin__empty">Belum ada permintaan yang sesuai dengan filter.</div> : null}

      <footer className="sm-admin__pagination-footer">
        <span>Showing {visible.length} of {filtered.length} requests</span>
        <div>
          <button type="button" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>‹</button>
          {Array.from({ length: Math.min(pageCount, 3) }, (_, index) => index).map((index) => (
            <button type="button" className={safePage === index ? "is-active" : ""} onClick={() => setPage(index)} key={index}>{index + 1}</button>
          ))}
          <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>›</button>
        </div>
      </footer>
    </section>
  );
};

export default ServiceRequestsTable;
