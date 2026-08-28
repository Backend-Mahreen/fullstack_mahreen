import founderAvatar from "../../../../assets/Tentang-Mahreen/profile-founder.jpeg";
import dimasAvatar from "../../../../assets/Internship/dimas-andre.jpg";
import mayaAvatar from "../../../../assets/Internship/maya-kania.jpg";
import rakaAvatar from "../../../../assets/Internship/raka-pratama.jpg";
import type { DirectoryAuditEntry, DirectoryUser } from "./types";

export const DIRECTORY_BASE_TOTAL = 12_833;
export const DIRECTORY_BASE_ACTIVE = 837;
export const DIRECTORY_BASE_REGISTRATIONS = 147;

export const seedDirectoryUsers: readonly DirectoryUser[] = [
  {
    id: "MRN-2024-001",
    name: "Alex Van Doren",
    email: "alex.v@mahreen.com",
    division: "Consultancy",
    role: "Super Admin",
    status: "Active",
    avatar: founderAvatar,
    createdAt: "2026-08-01T09:42:00.000Z",
  },
  {
    id: "MRN-2024-042",
    name: "Elena S. Rodriguez",
    email: "elena@mahreen.studio",
    division: "Studio",
    role: "Client",
    status: "Pending",
    avatar: mayaAvatar,
    createdAt: "2026-08-01T08:10:00.000Z",
  },
  {
    id: "MRN-2023-912",
    name: "Prof. Marcus Thorne",
    email: "m.thorne@academy.mahreen",
    division: "Volunteer",
    role: "Mentor",
    status: "Suspended",
    avatar: rakaAvatar,
    createdAt: "2026-07-31T16:25:00.000Z",
  },
  {
    id: "MRN-2025-118",
    name: "Nadia Wiratama",
    email: "nadia@mahreen.id",
    division: "CSR",
    role: "Support",
    status: "Active",
    avatar: mayaAvatar,
    createdAt: "2026-07-31T12:34:00.000Z",
  },
  {
    id: "MRN-2025-204",
    name: "Darren Yusuf",
    email: "darren@mahreen.id",
    division: "Internship",
    role: "Client",
    status: "Active",
    avatar: dimasAvatar,
    createdAt: "2026-07-30T10:02:00.000Z",
  },
  {
    id: "MRN-2026-008",
    name: "Saskia Mahendra",
    email: "saskia@mahreen.studio",
    division: "Studio",
    role: "Client",
    status: "Pending",
    avatar: mayaAvatar,
    createdAt: "2026-07-30T07:45:00.000Z",
  },
  {
    id: "MRN-2026-021",
    name: "Rafi Pradipta",
    email: "rafi@mahreen.id",
    division: "Consultancy",
    role: "Mentor",
    status: "Active",
    avatar: founderAvatar,
    createdAt: "2026-07-29T14:18:00.000Z",
  },
  {
    id: "MRN-2026-035",
    name: "Clara Agustine",
    email: "clara@mahreen.id",
    division: "CSR",
    role: "Support",
    status: "Active",
    avatar: mayaAvatar,
    createdAt: "2026-07-29T11:03:00.000Z",
  },
  {
    id: "MRN-2026-051",
    name: "Fadhil Ramadhan",
    email: "fadhil@mahreen.id",
    division: "Volunteer",
    role: "Client",
    status: "Pending",
    avatar: dimasAvatar,
    createdAt: "2026-07-28T08:59:00.000Z",
  },
];

export const initialAuditEntries: readonly DirectoryAuditEntry[] = [
  {
    id: "audit-initial-1",
    action: "Security review requested",
    detail: "24 accounts were flagged after suspicious login attempts.",
    timestamp: "2026-08-01T11:20:00.000Z",
  },
  {
    id: "audit-initial-2",
    action: "Role distribution updated",
    detail: "Access-role totals were recalculated from the local directory.",
    timestamp: "2026-08-01T09:05:00.000Z",
  },
];

export const roleDistribution = [
  { label: "Superadmin", value: 12 },
  { label: "Client", value: 54 },
  { label: "Mentor", value: 28 },
  { label: "Support", value: 6 },
] as const;

export const growthTrend = [34, 47, 39, 58, 69, 64, 92] as const;
