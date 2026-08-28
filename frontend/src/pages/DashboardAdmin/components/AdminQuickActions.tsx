import type { CSSProperties } from "react";
import {
  Award,
  FilePlus2,
  FolderPlus,
  GalleryVerticalEnd,
  PackagePlus,
  QrCode,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { quickActions } from "../adminDashboardData";
import type { AdminQuickAction, AdminModuleKey } from "../types";

const actionIcons: Readonly<Record<AdminQuickAction["icon"], LucideIcon>> = {
  article: FilePlus2,
  user: UserPlus,
  product: PackagePlus,
  project: FolderPlus,
  portfolio: GalleryVerticalEnd,
  certificate: Award,
  qr: QrCode,
};

type AdminQuickActionsProps = Readonly<{
  onSelect: (module: AdminModuleKey) => void;
}>;

const AdminQuickActions = ({ onSelect }: AdminQuickActionsProps) => (
  <section className="admin-quick-actions admin-animate" style={{ "--admin-delay": "695ms" } as CSSProperties}>
    <p>Administrative Quick Actions</p>
    <div>
      {quickActions.map((action) => {
        const Icon = actionIcons[action.icon];
        return (
          <button key={action.label} type="button" onClick={() => onSelect(action.module)}>
            <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  </section>
);

export default AdminQuickActions;
