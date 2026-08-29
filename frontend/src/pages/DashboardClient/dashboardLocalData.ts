import {
  getWebinarBySlug,
  getWebinarDetailPath,
} from "../../data/webinars";
import {
  type StoredConsultationRequest,
} from "../../services/consultation/consultationService";
import { dashboardRepository } from "../../services/dashboard/dashboardRepository";
import { adminOperationsRepository } from "../../services/admin/adminOperationsRepository";
import {
  readAllWebinarRegistrations,
  type StoredWebinarRegistration,
} from "../../services/webinarRegistrationStorage";
import type { AuthUser } from "../../types/auth";
import { getDonationDraft } from "../PeduliMahreen/Donasi/donationStorage";
import { readStudioOrder, readStudioOrders } from "../Mahreen-Studio/Purchase/storage";
import type { StudioOrder } from "../Mahreen-Studio/Purchase/types";
import {
  getPaymentDraft,
  getPaymentMeeting,
  readPaymentMeetingHistory,
  readServicePaymentHistory,
  type PaymentMeeting,
  type StoredPaymentMeeting,
  type StoredServicePaymentRecord,
} from "../TanyaMahreen/KonfigurasiPaket/Pembayaran/paymentStorage";
import type { ServicePaymentDraft } from "../TanyaMahreen/KonfigurasiPaket/Pembayaran/paymentTypes";
import type {
  Activity,
  CompletionItem,
  DashboardMetric,
  Project,
  ScheduleEntry,
} from "./types";

export type DashboardLocalData = {
  completionItems: CompletionItem[];
  completionPercentage: number;
  metrics: DashboardMetric[];
  projects: Project[];
  activities: Activity[];
  order: StudioOrder | null;
  scheduleEntries: ScheduleEntry[];
};

const hasText = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const normalizeIdentity = (value: string | null | undefined) =>
  value?.trim().toLowerCase() ?? "";

const createCompletionItems = (user: AuthUser): CompletionItem[] => [
  {
    label: "Email & nomor HP",
    complete: hasText(user.email) && hasText(user.whatsapp),
  },
  {
    label: "Foto profil & tanggal lahir",
    complete: hasText(user.profilePhoto) && hasText(user.birthDate),
  },
  {
    label: "Alamat resmi",
    complete:
      hasText(user.address) &&
      hasText(user.city) &&
      hasText(user.province),
  },
  {
    label: "Profil pekerjaan / institusi",
    complete: hasText(user.jobTitle) || hasText(user.institution),
  },
  {
    label: "LinkedIn atau portofolio",
    complete: hasText(user.linkedin) || hasText(user.portfolio),
  },
].map((item) => ({ ...item, pending: !item.complete }));

const formatRelativeTime = (isoValue: string) => {
  const elapsedMs = Date.now() - Date.parse(isoValue);
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return "Baru saja";

  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Kemarin" : `${days} hari lalu`;
};

const compactRupiah = (amount: number) => {
  if (amount <= 0) return "Rp 0";
  return `Rp\n${new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)}`;
};

const toCalendarParts = (date: Date) => ({
  month: new Intl.DateTimeFormat("en-US", { month: "short" })
    .format(date)
    .toUpperCase(),
  day: String(date.getDate()).padStart(2, "0"),
});

const toScheduleDate = (dateLabel: string, timeLabel: string) => {
  const date = new Date(dateLabel);
  const timeMatch = timeLabel.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    date.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
  } else {
    date.setHours(12, 0, 0, 0);
  }
  return date;
};

const createProjectRecords = (
  user: AuthUser,
  payment: ServicePaymentDraft | StoredServicePaymentRecord | null,
  meeting: PaymentMeeting | StoredPaymentMeeting | null,
  consultationRequests: StoredConsultationRequest[],
): Project[] => {
  const memberName = user.nickname || user.fullName;
  const projects = consultationRequests.map<Project>((request) => ({
    id: `consultation:${request.requestId}`,
    title: request.services.slice(0, 2).join(" & ") || "Business Consultation",
    description:
      request.kebutuhan.trim() ||
      request.target.trim() ||
      "Permintaan konsultasi sedang ditinjau oleh tim Mahreen.",
    progress: 20,
    status: "Under Review",
    extraMembers: 0,
    memberNames: [memberName, "Mahreen Consultant"],
    clientName: request.clientInfo.nama || memberName,
    company: request.clientInfo.perusahaan,
    serviceCategory: request.services[0] || "Consultation",
    sourceRequestId: request.requestId,
    href: "/tanya-mahreen/konsultasi/cek-data",
    updatedAt: request.submittedAt,
  }));

  if (payment) {
    const hasScheduledMeeting = Boolean(meeting);
    projects.push({
      id: `service:${payment.transactionId}`,
      title: payment.selection.tier.name,
      description: `Layanan ${payment.selection.category ?? payment.selection.serviceKey ?? "digital"} Mahreen`,
      progress: hasScheduledMeeting ? 45 : payment.status === "paid" ? 35 : 15,
      status: hasScheduledMeeting
        ? "Kickoff Scheduled"
        : payment.status === "paid"
          ? "Kickoff Ready"
          : "Awaiting Payment",
      extraMembers: 0,
      memberNames: [memberName, "Mahreen Indonesia"],
      clientName: payment.billingInformation.fullName,
      company: payment.billingInformation.companyName,
      serviceCategory:
        payment.selection.category ??
        payment.selection.serviceKey ??
        "Digital Service",
      budget: payment.total,
      revenue: payment.status === "paid" ? payment.total : 0,
      href:
        payment.status === "paid"
          ? "/tanya-mahreen/pembayaran/client-portal"
          : "/tanya-mahreen/pembayaran",
      updatedAt: meeting?.updatedAt ?? payment.updatedAt,
    });
  }

  return projects;
};

const createScheduleRecords = (
  user: AuthUser,
  payment: ServicePaymentDraft | StoredServicePaymentRecord | null,
  meeting: PaymentMeeting | StoredPaymentMeeting | null,
  order: StudioOrder | null,
  registrations: StoredWebinarRegistration[],
): ScheduleEntry[] => {
  const schedule: ScheduleEntry[] = [];

  if (payment && meeting) {
    const startsAt = new Date(
      `${meeting.selectedDate}T${meeting.selectedTime}:00`,
    );
    if (Number.isFinite(startsAt.getTime())) {
      const endTime = new Date(startsAt.getTime() + 60 * 60 * 1_000);
      schedule.push({
        id: `kickoff:${payment.transactionId}`,
        startsAt: startsAt.toISOString(),
        ...toCalendarParts(startsAt),
        title: "Kick-off Meeting",
        description: `Project: ${payment.selection.tier.name}\nInitial alignment session`,
        time: `${meeting.selectedTime} - ${new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(endTime)} WIB`,
        label: meeting.method,
        showAvatars: true,
        memberNames: [user.nickname || user.fullName, "Mahreen Indonesia"],
        href: "/tanya-mahreen/pembayaran/client-portal",
      });
    }
  }

  registrations.forEach((registration) => {
    const webinar = getWebinarBySlug(registration.webinarSlug);
    if (!webinar) return;
    const startsAt = toScheduleDate(webinar.scheduleDate, webinar.scheduleTime);
    if (!Number.isFinite(startsAt.getTime())) return;

    const isConfirmed = registration.status === "confirmed";
    schedule.push({
      id: `webinar:${registration.id}`,
      startsAt: startsAt.toISOString(),
      ...toCalendarParts(startsAt),
      title: webinar.title,
      description: webinar.category,
      time: webinar.scheduleTime,
      label: isConfirmed ? "Registered" : "Payment Pending",
      mandatory: isConfirmed,
      attendees: isConfirmed ? "Registration confirmed" : "Complete payment",
      href: getWebinarDetailPath(webinar.slug),
    });
  });

  if (order) {
    const startsAt = new Date(order.estimatedArrival);
    if (Number.isFinite(startsAt.getTime())) {
      schedule.push({
        id: `studio-delivery:${order.orderNumber}`,
        startsAt: startsAt.toISOString(),
        ...toCalendarParts(startsAt),
        title: "Studio Order Delivery",
        description: `${order.item.productTitle}\nOrder ${order.orderNumber}`,
        time: "Estimated arrival",
        label: "Order",
        href: "/mahreen-studio/lacak-pesanan",
      });
    }
  }

  return schedule;
};

export const getDashboardLocalData = (user: AuthUser): DashboardLocalData => {
  const completionItems = createCompletionItems(user);
  const completionPercentage = Math.round(
    (completionItems.filter((item) => item.complete).length /
      completionItems.length) *
      100,
  );
  const userEmail = normalizeIdentity(user.email);
  const userNames = new Set(
    [user.fullName, user.nickname].map(normalizeIdentity).filter(Boolean),
  );
  const order = readStudioOrders().find(
    (storedOrder) => normalizeIdentity(storedOrder.shipping.email) === userEmail,
  ) ?? (() => {
    const storedOrder = readStudioOrder();
    return storedOrder && normalizeIdentity(storedOrder.shipping.email) === userEmail
      ? storedOrder
      : null;
  })();
  const donation = getDonationDraft();
  const hasOwnedPaidDonation =
    donation.status === "paid" &&
    normalizeIdentity(donation.donor.email) === userEmail;
  const storedServicePayment = getPaymentDraft();
  const sessionServicePayment =
    storedServicePayment &&
    userNames.has(
      normalizeIdentity(storedServicePayment.billingInformation.fullName),
    )
      ? storedServicePayment
      : null;
  const persistentServicePayment = readServicePaymentHistory().find(
    (payment) => payment.clientId === user.id || normalizeIdentity(payment.clientEmail) === userEmail,
  ) ?? null;
  const servicePayment = sessionServicePayment ?? persistentServicePayment;
  const sessionMeeting = getPaymentMeeting();
  const paymentMeeting = sessionMeeting ?? readPaymentMeetingHistory().find(
    (meeting) =>
      meeting.clientId === user.id || meeting.transactionId === servicePayment?.transactionId,
  ) ?? null;
  const registrations = readAllWebinarRegistrations().filter(
    (registration) => normalizeIdentity(registration.email) === userEmail,
  );
  const verifiedDocuments = adminOperationsRepository
    .getVerificationSnapshot()
    .requests.filter(
      (request) =>
        normalizeIdentity(request.ownerEmail) === userEmail && request.status === "Verified",
    );
  const consultationRequests: StoredConsultationRequest[] = [];
  const workspace = dashboardRepository.synchronize(user.id, {
    projects: createProjectRecords(
      user,
      servicePayment,
      paymentMeeting,
      consultationRequests,
    ),
    scheduleEntries: createScheduleRecords(
      user,
      servicePayment,
      paymentMeeting,
      order,
      registrations,
    ),
  });
  const { projects, scheduleEntries } = workspace;

  const metrics: DashboardMetric[] = [
    {
      label: "Active Projects",
      value: String(projects.length),
      note: "Data aktivitas lokal",
      icon: "projects",
      href: "/akun/projects",
    },
    {
      label: "Total Orders",
      value: order ? "1" : "0",
      note: order?.item.productTitle ?? "Belum ada pesanan",
      icon: "orders",
      href: order
        ? "/mahreen-studio/lacak-pesanan"
        : "/mahreen-studio/latest-collection",
    },
    {
      label: "Impact Donations",
      value: compactRupiah(hasOwnedPaidDonation ? donation.amount : 0),
      note:
        hasOwnedPaidDonation
          ? donation.transactionId
          : "Mulai kontribusi",
      icon: "donations",
      href: "/peduli-mahreen/donasi",
      compact: true,
    },
    {
      label: "Certificates",
      value: String(verifiedDocuments.length),
      note: verifiedDocuments.length ? "Dokumen terverifikasi" : "Menunggu verifikasi",
      icon: "certificates",
      href: "/newsroom/verifikasi-dokumen",
    },
  ];

  const activities: Activity[] = [];
  if (order) {
    activities.push({
      title: "Pesanan Studio dibuat",
      description: `${order.orderNumber} · ${order.item.productTitle}`,
      time: formatRelativeTime(order.createdAt),
      icon: "payment",
      href: "/mahreen-studio/lacak-pesanan",
    });
  }
  if (hasOwnedPaidDonation) {
    activities.push({
      title: "Donasi berhasil",
      description: `${compactRupiah(donation.amount).replace("\n", " ")} · ${donation.transactionId}`,
      time: formatRelativeTime(donation.updatedAt),
      icon: "milestone",
      href: "/peduli-mahreen/donasi/berhasil",
    });
  }
  if (servicePayment) {
    activities.push({
      title:
        servicePayment.status === "paid"
          ? "Pembayaran layanan berhasil"
          : "Pembayaran layanan tersimpan",
      description: `${servicePayment.transactionId} · ${servicePayment.selection.tier.name}`,
      time: formatRelativeTime(servicePayment.updatedAt),
      icon: "payment",
      href:
        servicePayment.status === "paid"
          ? "/tanya-mahreen/pembayaran/berhasil"
          : "/tanya-mahreen/pembayaran",
    });
  }
  registrations.slice(0, 1).forEach((registration) => {
    activities.push({
      title:
        registration.status === "confirmed"
          ? "Pendaftaran webinar dikonfirmasi"
          : "Pendaftaran webinar tersimpan",
      description: registration.webinarTitle,
      time: formatRelativeTime(registration.createdAt),
      icon:
        registration.status === "confirmed" ? "certificate" : "milestone",
      href: getWebinarDetailPath(registration.webinarSlug),
    });
  });
  if (activities.length === 0) {
    activities.push({
      title: "Dashboard siap digunakan",
      description:
        "Aktivitas pesanan, donasi, layanan, dan webinar akan muncul di sini.",
      time: "Data lokal aktif",
      icon: "milestone",
      href: "/tanya-mahreen",
    });
  }

  return {
    completionItems,
    completionPercentage,
    metrics,
    projects,
    activities: activities.slice(0, 3),
    order,
    scheduleEntries,
  };
};
