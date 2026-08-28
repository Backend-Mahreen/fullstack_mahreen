import { Download, Eye, Filter, Pencil, Workflow } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatServiceCurrency,
  type ServiceOperation,
} from "../../../../services/serviceManagement/serviceManagementRepository";

type OperationTab = "All Operations" | "Active Only" | "Archived";

type ServiceOperationsTableProps = {
  operations: ServiceOperation[];
  query: string;
  onEdit: (operation: ServiceOperation) => void;
  onNotify: (message: string) => void;
};

const PAGE_SIZE = 4;
const operationTabs: OperationTab[] = ["All Operations", "Active Only", "Archived"];

const isArchived = (operation: ServiceOperation) =>
  /archived|cancelled|completed/i.test(operation.lifecycleStatus);

const ServiceOperationsTable = ({
  operations,
  query,
  onEdit,
  onNotify,
}: ServiceOperationsTableProps) => {
  const [activeTab, setActiveTab] = useState<OperationTab>("All Operations");
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return operations.filter((operation) => {
      const tabMatches =
        activeTab === "All Operations" ||
        (activeTab === "Archived" ? isArchived(operation) : !isArchived(operation));
      const queryMatches =
        !normalizedQuery ||
        [operation.title, operation.stakeholder, operation.category, operation.lifecycleStatus]
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      return tabMatches && queryMatches;
    });
  }, [activeTab, operations, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const exportOperations = () => {
    const rows = [
      ["Project", "Stakeholder", "Category", "Status", "Budget", "Progress"],
      ...filtered.map((operation) => [
        operation.title,
        operation.stakeholder,
        operation.category,
        operation.lifecycleStatus,
        String(operation.budget),
        String(operation.progress),
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mahreen-service-operations.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    onNotify(`${filtered.length} data operasi diekspor dari penyimpanan lokal.`);
  };

  return (
    <section className="sm-admin__table-panel sm-admin__operations-panel sm-admin__reveal" style={{ "--sm-delay": "510ms" } as React.CSSProperties}>
      <div className="sm-admin__table-toolbar">
        <div className="sm-admin__tabs" role="tablist" aria-label="Filter active operations">
          {operationTabs.map((tab) => (
            <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "is-active" : ""} onClick={() => { setActiveTab(tab); setPage(0); }} key={tab}>{tab}</button>
          ))}
        </div>
        <div className="sm-admin__table-tools">
          <button type="button" aria-label="Filter operations"><Filter aria-hidden="true" /></button>
          <button type="button" aria-label="Export operations" onClick={exportOperations}><Download aria-hidden="true" /></button>
        </div>
      </div>

      <div className="sm-admin__table-scroll">
        <table className="sm-admin__table sm-admin__operations-table">
          <thead><tr><th>Project Identity</th><th>Stakeholder</th><th>Lifecycle Status</th><th>Budget Allocation</th><th>Actions</th></tr></thead>
          <tbody>
            {visible.map((operation) => (
              <tr key={operation.id}>
                <td><div className="sm-admin__operation-identity"><span><Workflow aria-hidden="true" /></span><div><strong>{operation.title}</strong><small>ID: {operation.id}</small></div></div></td>
                <td><span className="sm-admin__stakeholder-chip">{operation.category}</span><small className="sm-admin__stakeholder-name">{operation.stakeholder}</small></td>
                <td><span className={`sm-admin__lifecycle${isArchived(operation) ? " is-muted" : ""}`}><i />{operation.lifecycleStatus}</span><small className="sm-admin__progress-copy">Progress {operation.progress}%</small></td>
                <td>{operation.budget > 0 ? formatServiceCurrency(operation.budget) : <span className="sm-admin__unassigned">Belum ditentukan</span>}</td>
                <td><div className="sm-admin__operation-actions"><a href={operation.href} aria-label={`View ${operation.title}`}><Eye aria-hidden="true" /></a><button type="button" aria-label={`Edit ${operation.title}`} onClick={() => onEdit(operation)}><Pencil aria-hidden="true" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? <div className="sm-admin__empty">Belum ada operasi aktif dari aktivitas user.</div> : null}

      <footer className="sm-admin__pagination-footer">
        <span>Showing {visible.length} of {filtered.length} active operations</span>
        <div>
          <button type="button" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>‹</button>
          {Array.from({ length: Math.min(pageCount, 3) }, (_, index) => index).map((index) => <button type="button" className={safePage === index ? "is-active" : ""} onClick={() => setPage(index)} key={index}>{index + 1}</button>)}
          <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>›</button>
        </div>
      </footer>
    </section>
  );
};

export default ServiceOperationsTable;
