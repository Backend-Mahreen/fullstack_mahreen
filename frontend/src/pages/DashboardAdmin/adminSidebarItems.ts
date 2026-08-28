import {
  BadgeCheck,
  BarChart3,
  Building2,
  FileText,
  GraduationCap,
  HandHeart,
  Inbox,
  LayoutDashboard,
  MessageCircleMore,
  Newspaper,
  Shirt,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DashboardSidebarItem } from "../../components/DashboardSidebar/DashboardSidebar";
import { adminModules, adminSidebarModuleKeys } from "./adminDashboardData";
import type { AdminModuleKey } from "./types";

const moduleIcons: Readonly<Partial<Record<AdminModuleKey, LucideIcon>>> = {
  dashboard: LayoutDashboard,
  users: Users,
  "tanya-mahreen": MessageCircleMore,
  "peduli-mahreen": HandHeart,
  "mahreen-csr": Building2,
  "mahreen-studio": Shirt,
  newsroom: Newspaper,
  internship: GraduationCap,
  verification: BadgeCheck,
  analytics: BarChart3,
  clients: Users,
  reports: FileText,
  engagement: Inbox,
};

export const adminSidebarItems: readonly DashboardSidebarItem<AdminModuleKey>[] =
  adminSidebarModuleKeys.map((moduleKey) => {
    const module = adminModules.find((item) => item.key === moduleKey);
    const icon = moduleIcons[moduleKey];

    if (!module || !icon) {
      throw new Error(`Konfigurasi sidebar admin tidak lengkap untuk modul ${moduleKey}.`);
    }

    return {
      key: module.key,
      label: module.label,
      icon,
    };
  });
