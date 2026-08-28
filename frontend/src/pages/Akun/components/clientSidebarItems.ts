import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  HandHeart,
  LayoutDashboard,
  ReceiptText,
  Shirt,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";
import type { DashboardSidebarItem } from "../../../components/DashboardSidebar/DashboardSidebar";

export type ClientAccountMenu =
  | "personal"
  | "projects"
  | "overview"
  | "invoice"
  | "schedule"
  | "security"
  | "documents"
  | "donations"
  | "csr"
  | "internship"
  | "studio-orders"
  | "certificates"
  | "support";

export const clientSidebarItems: readonly DashboardSidebarItem<ClientAccountMenu>[] = [
  {
    key: "personal",
    label: "Personal",
    icon: UserRound,
    href: "/akun/edit",
  },
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: "/akun/overview",
  },
  {
    key: "projects",
    label: "Projects",
    icon: BriefcaseBusiness,
    href: "/akun/projects",
  },
  {
    key: "invoice",
    label: "Invoice",
    icon: ReceiptText,
    href: "/akun/invoice",
  },
  {
    key: "donations",
    label: "Donasi",
    icon: HandHeart,
    href: "/akun/donations",
  },
  {
    key: "certificates",
    label: "Sertifikat",
    icon: BadgeCheck,
    href: "/akun/sertifikat",
  },
  {
    key: "csr",
    label: "CSR Saya",
    icon: Building2,
    href: "/akun/csr",
  },
  {
    key: "internship",
    label: "Internship",
    icon: GraduationCap,
    href: "/akun/internship",
  },
  {
    key: "studio-orders",
    label: "Studio Orders",
    icon: Shirt,
    href: "/akun/studio-orders",
  },
  {
    key: "schedule",
    label: "Jadwal",
    icon: CalendarDays,
    href: "/akun/jadwal",
  },
  {
    key: "documents",
    label: "Dokumen",
    icon: FileText,
    href: "/akun/dokumen",
  },
  {
    key: "support",
    label: "Support",
    icon: Ticket,
    href: "/akun/support",
  },
  {
    key: "security",
    label: "Security",
    icon: ShieldCheck,
    href: "/akun/security",
  },
];
