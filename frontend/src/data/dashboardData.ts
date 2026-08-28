import newsroomImage from "../assets/Newsroom/featured-building.webp";
import ecosystemImage from "../assets/Newsroom/webinar-digital.webp";
import type {
  Activity,
  CompletionItem,
  DashboardMetric,
  NewsItem,
  Project,
  ScheduleEntry,
} from "../pages/DashboardClient/types";

export const completionItems: CompletionItem[] = [
  { label: "Email, HP, Password", complete: true },
  { label: "Photo & DOB", complete: true },
  { label: "Official Address", complete: true },
  { label: "Company Profile", complete: false, pending: true },
  { label: "LinkedIn Integration", complete: false, pending: true },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Active Projects",
    value: "3",
    note: "+1 this month",
    icon: "projects",
    href: "#projects",
  },
  {
    label: "Total Orders",
    value: "12",
    note: "Studio Premium",
    icon: "orders",
    href: "#ongoing-order",
  },
  {
    label: "Impact Donations",
    value: "Rp\n15.4M",
    note: "Tier 2\nImpact",
    icon: "donations",
    href: "/peduli-mahreen/donasi",
    compact: true,
  },
  {
    label: "Certificates",
    value: "8",
    note: "Verified Assets",
    icon: "certificates",
    href: "/newsroom/verifikasi-dokumen",
  },
];

export const projects: Project[] = [
  {
    id: "legacy:ecosystem-redesign",
    title: "Ecosystem Redesign",
    description: "Scalable design system architecture for enterprise-level",
    progress: 85,
    status: "In Progress",
    extraMembers: 4,
    href: "/tanya-mahreen",
    updatedAt: "2024-10-12T10:00:00.000Z",
  },
  {
    id: "legacy:fintech-dashboard",
    title: "FinTech Dashboard",
    description: "Premium asset trading interface with focus on luxury visualization",
    progress: 40,
    status: "Review",
    extraMembers: 2,
    href: "/tanya-mahreen",
    updatedAt: "2024-10-15T10:00:00.000Z",
  },
];

export const activities: Activity[] = [
  {
    title: "Sertifikat Diterbitkan",
    description: "Ecosystem Design Foundation Course completed.",
    time: "2 hours ago",
    icon: "certificate",
    href: "/newsroom/verifikasi-dokumen",
  },
  {
    title: "Pembayaran Berhasil",
    description: "Invoice #INV-2024-092 for Studio Credits.",
    time: "Yesterday",
    icon: "payment",
    href: "/mahreen-studio/lacak-pesanan",
  },
  {
    title: "Project Milestone Selesai",
    description: "Architecture Review for Ecosystem Redesign.",
    time: "3 days ago",
    icon: "milestone",
    href: "/tanya-mahreen",
  },
];

export const newsroomItems: NewsItem[] = [
  {
    category: "Insights",
    title: "Future of Digital Asset Sovereignty",
    excerpt: "Exploring the integration of Mahreen Ecosystem with...",
    image: newsroomImage,
    imageAlt: "Visual berita Mahreen Indonesia",
    href: "/newsroom/berita",
  },
  {
    category: "Ecosystem",
    title: "Expanding the Creative Network",
    excerpt: "How our latest Studio update empowers thousands of...",
    image: ecosystemImage,
    imageAlt: "Visual pembaruan ekosistem Mahreen",
    href: "/newsroom",
  },
];

export const scheduleEntries: ScheduleEntry[] = [
  {
    id: "legacy:schedule-2024-10-12",
    startsAt: "2024-10-12T10:00:00.000Z",
    month: "Oct",
    day: "12",
    title: "Meeting with Creative\nDirector",
    description: "Project: Ecosystem Redesign\nWeekly Sync",
    time: "10:00 - 11:30",
    label: "Virtual",
    showAvatars: true,
    href: "/tanya-mahreen/konsultasi",
  },
  {
    id: "legacy:schedule-2024-10-15",
    startsAt: "2024-10-15T14:00:00.000Z",
    month: "Oct",
    day: "15",
    title: "Webinar: UI Motion\nMasterclass",
    description: "Learning Session: Advanced\nAnimation Principles",
    time: "14:00 - 16:00",
    label: "Mandatory",
    mandatory: true,
    attendees: "256 Attending",
    href: "/newsroom/webinar/ui-ux-design-masterclass",
  },
  {
    id: "legacy:schedule-2024-10-21",
    startsAt: "2024-10-21T09:30:00.000Z",
    month: "Oct",
    day: "21",
    title: "Project Review\nFinTech Dashboard",
    description: "Review desain dan validasi\ncatatan revisi klien",
    time: "09:30 - 10:30",
    label: "Virtual",
    showAvatars: true,
    href: "/tanya-mahreen",
  },
  {
    id: "legacy:schedule-2024-10-28",
    startsAt: "2024-10-28T19:00:00.000Z",
    month: "Oct",
    day: "28",
    title: "UI/UX Design\nMasterclass",
    description: "Webinar Newsroom Mahreen\nDesign System Session",
    time: "19:00 - 21:20",
    label: "Registered",
    attendees: "184 Attending",
    href: "/newsroom/webinar/ui-ux-design-masterclass",
  },
];
