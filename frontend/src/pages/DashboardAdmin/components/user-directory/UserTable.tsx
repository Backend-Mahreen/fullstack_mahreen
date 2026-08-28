import { ChevronLeft, ChevronRight, ListFilter, Pencil, Search, Shield, UserCog, Trash2 } from "lucide-react";
import type { DirectoryUser, DirectoryUserStatus } from "./types";

export type StatusFilter = "All" | DirectoryUserStatus;

export type UserTableAction = "edit" | "status" | "role" | "delete";

type UserTableProps = Readonly<{  currentPage: number;
  onPageChange: (page: number) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onAction: (action: UserTableAction, user: DirectoryUser) => void;
  query: string;
  status: StatusFilter;
  totalDirectoryUsers: number;
  users: readonly DirectoryUser[];
  canManage?: boolean;
}>;

const PAGE_SIZE = 8;

const STATUS_OPTIONS: readonly DirectoryUserStatus[] = ["Active", "Pending", "Suspended"];

const roleDisplayName = (role: string): string => {
  const normalized = role.trim().toLowerCase();
  if (normalized === "superadmin") return "Super Admin";
  if (normalized === "admin") return "Admin";
  if (normalized === "intern") return "Intern";
  if (normalized === "client") return "Client";
  if (normalized === "mentor") return "Mentor";
  if (normalized === "support") return "Support";
  return role;
};

const UserAvatar = ({ user }: { user: DirectoryUser }) => (
  <span className="user-table-avatar" aria-hidden="true">
    {user.avatar ? <img src={user.avatar} alt="" width="42" height="42" /> : user.name.slice(0, 1).toUpperCase()}
  </span>
);

const UserTable = ({
  currentPage,
  onPageChange,
  onQueryChange,
  onStatusChange,
  onAction,
  query,
  status,
  totalDirectoryUsers,
  users,
  canManage = false,
}: UserTableProps) => {
  const pageCount = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const visibleUsers = users.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const start = users.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(safePage * PAGE_SIZE, users.length);

  return (
    <div className="user-directory-table-stack user-directory-enter" style={{ "--user-delay": "290ms" } as React.CSSProperties}>
      <div className="user-directory-filters">
        <label className="user-directory-search">
          <ListFilter size={15} aria-hidden="true" />
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter by name, email or ID..."
            aria-label="Filter users by name, email or ID"
          />
        </label>
        <label className="user-directory-status-filter">
          <span>Status:</span>
          <select value={status} onChange={(event) => onStatusChange(event.target.value as StatusFilter)}>
            <option>All</option>
            {STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="user-directory-table-card">
        <div className="user-directory-table-scroll">
          <table className="user-directory-table">
            <thead>
              <tr><th>User</th><th>Mahreen ID</th><th>Division</th><th>Role</th><th>Status</th>{canManage ? <th aria-label="Aksi" /> : null}</tr>
            </thead>
            <tbody>
              {visibleUsers.map((user, index) => (
                <tr key={user.id} style={{ "--row-delay": `${index * 55}ms` } as React.CSSProperties}>
                  <td><div className="user-table-identity"><UserAvatar user={user} /><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
                  <td><code>{user.id.replace("MRN-", "MRN-\n")}</code></td>
                  <td><span className="user-division-pill">{user.division}</span></td>
                  <td><span className="user-role-pill">{roleDisplayName(user.role)}</span></td>
                  <td><span className={`user-status user-status--${user.status.toLowerCase()}`}><i />{user.status}</span></td>
                  {canManage ? (
                    <td>
                      <div className="user-table-actions">
                        <button type="button" title="Edit akun" aria-label={`Edit akun ${user.name}`} onClick={() => onAction("edit", user)}><Pencil size={15} /></button>
                        <button type="button" title="Ubah status" aria-label={`Ubah status ${user.name}`} onClick={() => onAction("status", user)}><Shield size={15} /></button>
                        <button type="button" title="Ubah peran" aria-label={`Ubah peran ${user.name}`} onClick={() => onAction("role", user)}><UserCog size={15} /></button>
                        <button type="button" className="is-danger" title="Hapus" aria-label={`Hapus ${user.name}`} onClick={() => onAction("delete", user)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleUsers.length ? <div className="user-directory-empty">No users match the selected filters.</div> : null}
        </div>

        <footer className="user-directory-table-footer">
          <span>Showing {start} to {end} of {new Intl.NumberFormat("id-ID").format(totalDirectoryUsers)} entries</span>
          <nav aria-label="User directory pages">
            <button type="button" aria-label="Previous page" disabled={safePage === 1} onClick={() => onPageChange(safePage - 1)}><ChevronLeft size={17} /></button>
            {Array.from({ length: Math.min(3, pageCount) }, (_, index) => index + 1).map((page) => (
              <button key={page} type="button" className={page === safePage ? "is-active" : ""} aria-current={page === safePage ? "page" : undefined} onClick={() => onPageChange(page)}>{page}</button>
            ))}
            <button type="button" aria-label="Next page" disabled={safePage === pageCount} onClick={() => onPageChange(safePage + 1)}><ChevronRight size={17} /></button>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default UserTable;
