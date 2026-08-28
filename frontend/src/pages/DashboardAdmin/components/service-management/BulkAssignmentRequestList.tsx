import { CalendarDays, Trash2, UserRoundPlus, X } from "lucide-react";
import { useState } from "react";
import type { ServiceRequest } from "../../../../services/serviceManagement/serviceManagementRepository";

type BulkAssignmentRequestListProps = {
  requests: ServiceRequest[];
  onRemove: (requestId: string) => void;
  variant?: "table" | "cards";
};

const initials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const BulkAssignmentRequestList = ({
  requests,
  onRemove,
  variant = "table",
}: BulkAssignmentRequestListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="ba-request-empty">
        <UserRoundPlus aria-hidden="true" />
        <strong>No requests selected</strong>
        <span>Pilih request konsultasi dari daftar yang tersedia.</span>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="ba-request-cards">
        {requests.map((request, index) => (
          <article
            className={`ba-request-card${expandedId === request.id ? " is-expanded" : ""}`}
            style={{ "--ba-row-delay": `${index * 55}ms` } as React.CSSProperties}
            key={request.id}
          >
            <header>
              <div>
                <strong>{request.clientName}</strong>
                <small>Request ID: {request.id}</small>
              </div>
              <span>{request.serviceCategory}</span>
            </header>
            <p><CalendarDays aria-hidden="true" />Requested: {formatDate(request.date)}</p>
            <b className={request.priority === "High" ? "is-urgent" : ""}>
              {request.priority === "High" ? "! Urgent · High Priority" : "⌁ Normal Priority"}
            </b>
            <footer>
              <button type="button" onClick={() => setExpandedId((current) => current === request.id ? null : request.id)}>{expandedId === request.id ? "Hide Details" : "Details"}</button>
              <button type="button" aria-label={`Remove ${request.clientName}`} onClick={() => onRemove(request.id)}><Trash2 aria-hidden="true" /></button>
            </footer>
            {expandedId === request.id ? (
              <div className="ba-request-card__details">
                <span><small>Company</small><strong>{request.company}</strong></span>
                <span><small>Budget</small><strong>{request.budgetLabel}</strong></span>
                <span><small>Contact</small><strong>{request.email}</strong></span>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="ba-request-table-wrap">
      <table className="ba-request-table">
        <thead>
          <tr>
            <th>Client Identity</th>
            <th>Company</th>
            <th>Service Requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr
              style={{ "--ba-row-delay": `${index * 55}ms` } as React.CSSProperties}
              key={request.id}
            >
              <td>
                <span className="ba-request-identity">
                  <b>{initials(request.clientName)}</b>
                  <span><strong>{request.clientName}</strong><small>REF# {request.id}</small></span>
                </span>
              </td>
              <td>{request.company}</td>
              <td><span className={`ba-request-service${request.priority === "High" ? " is-high" : ""}`}>{request.serviceRequested}</span></td>
              <td><button type="button" className="ba-remove-request" aria-label={`Remove ${request.clientName}`} onClick={() => onRemove(request.id)}><X aria-hidden="true" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ba-queue-status"><UserRoundPlus aria-hidden="true" /><span>Queue Optimization Active</span></div>
    </div>
  );
};

export default BulkAssignmentRequestList;
