export type Project = {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  extraMembers: number;
  memberNames?: string[];
  clientName?: string;
  company?: string;
  serviceCategory?: string;
  budget?: number;
  revenue?: number;
  sourceRequestId?: string;
  href: string;
  updatedAt: string;
};

export type ActivityIcon = "certificate" | "payment" | "milestone";

export type Activity = {
  title: string;
  description: string;
  time: string;
  icon: ActivityIcon;
  href: string;
};

export type CompletionItem = {
  label: string;
  complete: boolean;
  pending?: boolean;
};

export type MetricIcon = "projects" | "orders" | "donations" | "certificates";

export type DashboardMetric = {
  label: string;
  value: string;
  note: string;
  icon: MetricIcon;
  href: string;
  compact?: boolean;
};

export type NewsItem = {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  href: string;
  isNew?: boolean;
};

export type ScheduleEntry = {
  id: string;
  startsAt: string;
  month: string;
  day: string;
  title: string;
  description: string;
  time: string;
  label: string;
  mandatory?: boolean;
  attendees?: string;
  showAvatars?: boolean;
  memberNames?: string[];
  href: string;
};
