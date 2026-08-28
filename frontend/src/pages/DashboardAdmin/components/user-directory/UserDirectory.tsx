import { useEffect, useMemo, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import baseCss from "./UserDirectory.base.css?inline";
import metricsCss from "./UserDirectory.metrics.css?inline";
import tableCss from "./UserDirectory.table.css?inline";
import insightsCss from "./UserDirectory.insights.css?inline";
import modalsCss from "./UserDirectory.modals.css?inline";
import animationsCss from "./UserDirectory.animations.css?inline";
import AuditLogPanel from "./AuditLogPanel";
import EditAccountModal from "./EditAccountModal";
import CreateUserModal from "./CreateUserModal";
import UserActionModal from "./UserActionModal";
import UserInsights from "./UserInsights";
import UserMetricCards from "./UserMetricCards";
import UserTable, { type StatusFilter, type UserTableAction } from "./UserTable";
import { useLocalUserDirectory } from "./useLocalUserDirectory";
import type { DirectoryUser } from "./types";

type UserDirectoryProps = Readonly<{
  initialQuery?: string;
  onToast: (message: string) => void;
  canManage?: boolean;
}>;

const escapeCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`;

const UserDirectory = ({ initialQuery = "", onToast, canManage = false }: UserDirectoryProps) => {
  const {
    users, auditEntries, rolesDropdown, roleBreakdown, monthlyGrowth,
    recordAudit, addUser, updateUser, updateUserStatus, updateUserRole, deleteUser, metrics,
  } = useLocalUserDirectory();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [auditOpen, setAuditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DirectoryUser | null>(null);
  const [actionTarget, setActionTarget] = useState<{ mode: Exclude<UserTableAction, "edit">; user: DirectoryUser } | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesStatus = status === "All" || user.status === status;
      const matchesQuery = !normalizedQuery || [user.name, user.email, user.id, user.division, user.role]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [query, status, users]);

  useEffect(() => {
    if (!auditOpen && !createOpen && !editTarget && !actionTarget) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAuditOpen(false);
        setCreateOpen(false);
        setEditTarget(null);
        setActionTarget(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [auditOpen, createOpen, editTarget, actionTarget]);

  const exportUsers = () => {
    const header = ["Mahreen ID", "Name", "Email", "Division", "Role", "Status"];
    const rows = filteredUsers.map((user) => [user.id, user.name, user.email, user.division, user.role, user.status]);
    const csv = [header, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mahreen-user-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
    recordAudit("CSV exported", `${filteredUsers.length} visible directory records were exported.`);
    onToast("User directory berhasil diekspor ke CSV.");
  };

  const handleSecurityReview = () => {
    recordAudit("Security log reviewed", "Manual review opened for flagged accounts.");
    setAuditOpen(true);
    onToast("Security audit dibuka.");
  };

  const handleCreate = async (draft: Parameters<typeof addUser>[0]) => {
    const result = await addUser(draft);
    if (result.ok) {
      onToast(`Akun ${result.user.name} berhasil dibuat.`);
    }
    return result;
  };

  const handleEdit = async (id: string, fields: Parameters<typeof updateUser>[1]) => {
    const result = await updateUser(id, fields);
    if (result.ok) {
      onToast(`Akun ${result.user.name} berhasil diperbarui.`);
    }
    return result;
  };

  const handleAction = (mode: UserTableAction, user: DirectoryUser) => {
    if (mode === "edit") {
      setEditTarget(user);
      return;
    }
    setActionTarget({ mode, user });
  };

  const handleActionConfirm = async (value?: string) => {
    if (!actionTarget) return { ok: false, message: "Tidak ada target." };
    const { mode, user } = actionTarget;
    let result: Awaited<ReturnType<typeof updateUserStatus>>;
    if (mode === "status") {
      result = await updateUserStatus(user.id, (value ?? user.status) as "Active" | "Pending" | "Suspended");
      if (result.ok) onToast(`Status ${result.user.name} diperbarui.`);
    } else if (mode === "role") {
      result = await updateUserRole(user.id, value ?? user.role);
      if (result.ok) onToast(`Peran ${result.user.name} diperbarui.`);
    } else {
      const deleteResult = await deleteUser(user.id, value === "force");
      if (deleteResult.ok) onToast(`Pengguna ${user.name} dihapus.`);
      return deleteResult;
    }
    return result;
  };

  const roleOptions = rolesDropdown.length
    ? rolesDropdown.map((role) => ({ id: role.id, slug: role.slug, name: role.name, permissionCount: role.permissionCount }))
    : [{ id: "default-client", slug: "client", name: "Client", permissionCount: 1 }, { id: "default-admin", slug: "admin", name: "Admin", permissionCount: 40 }, { id: "default-superadmin", slug: "superadmin", name: "Super Admin", permissionCount: 41 }];

  return (
    <>
      <style>{baseCss}</style>
      <style>{metricsCss}</style>
      <style>{tableCss}</style>
      <style>{insightsCss}</style>
      <style>{modalsCss}</style>
      <style>{animationsCss}</style>
      <section className="user-directory-page">
        <header className="user-directory-header user-directory-enter">
          <div className="user-directory-title-wrap">
            <div><h1>User Directory</h1><p>Manage and monitor organizational access across all Mahreen divisions.</p></div>
          </div>
          <div className="user-directory-actions">
            <button className="user-directory-export" type="button" onClick={exportUsers}><Download size={17} /> <span>Export<br />CSV</span></button>
            {canManage ? (
              <button className="user-directory-create" type="button" onClick={() => setCreateOpen(true)}><UserPlus size={18} /> <span>Create<br />Account</span></button>
            ) : null}
          </div>
        </header>

        <UserMetricCards metrics={metrics} />

        <div className="user-directory-body">
          <UserTable
            canManage={canManage}
            currentPage={currentPage}
            onAction={handleAction}
            onPageChange={setCurrentPage}
            onQueryChange={(value) => { setQuery(value); setCurrentPage(1); }}
            onStatusChange={(value) => { setStatus(value); setCurrentPage(1); }}
            query={query}
            status={status}
            totalDirectoryUsers={metrics.totalUsers}
            users={filteredUsers}
          />
          <UserInsights
            monthlyGrowth={monthlyGrowth}
            onAuditOpen={() => setAuditOpen(true)}
            onSecurityReview={handleSecurityReview}
            roleBreakdown={roleBreakdown}
            totalUsers={metrics.totalUsers}
          />
        </div>
      </section>

      {auditOpen ? <AuditLogPanel entries={auditEntries} onClose={() => setAuditOpen(false)} /> : null}
      {createOpen ? <CreateUserModal roles={roleOptions} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} /> : null}
      {editTarget ? <EditAccountModal user={editTarget} roles={roleOptions} onClose={() => setEditTarget(null)} onSubmit={handleEdit} /> : null}
      {actionTarget ? (
        <UserActionModal
          mode={actionTarget.mode}
          roles={roleOptions}
          user={actionTarget.user}
          onClose={() => setActionTarget(null)}
          onConfirm={handleActionConfirm}
        />
      ) : null}
    </>
  );
};

export default UserDirectory;
