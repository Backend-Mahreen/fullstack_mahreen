// Registry rute lengkap dimuat hanya setelah pengguna meninggalkan beranda.
import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import type { AccountRole } from "../types/auth";
import { env } from "../config/env";
import RouteSkeleton from "../components/Loading/RouteSkeleton";
import RouteErrorBoundary from "../components/Loading/RouteErrorBoundary";
import { APP_NAVIGATION_EVENT, navigateToRoute } from "../utils/hashNavigation";
import { useSeoMetadata } from "../hooks/useSeoMetadata";
import { usePageTracking } from "../hooks/usePageTracking";
import Home from "../pages/Home/Home";
import {
  Tentang, Portofolio, Studio, LatestCollections, DetailProduk,
  StudioOrderSummary, StudioPayment, StudioReview, StudioTracking,
  TanyaMahreen, Konsultasi, CekData, KonsultasiSelesai, HubungiPM,
  KonfigurasiPaketWeb, KonfigurasiPaketBranding, KonfigurasiPaketSocialMedia,
  KonfigurasiPaketDigitalMarketing, KonfigurasiPaketAdvertising,
  KonfigurasiPaketContent, KonfigurasiPaketConsultation,
  Pembayaran, KonfirmasiPembayaran, PembayaranBerhasil,
  AksesClientPortal, KickoffMeeting,
  Internship, FormInternship, PeduliMahreen, MahreenCSR,
  ProgramObjective, CSRDetailsPage, CSRMotivationPage, CSRRolePage, CSRSuccessPage,
  PilihNominal, DataDonatur, MetodePembayaranDonasi, DonasiBerhasil,
  NewsroomHome, NewsroomBerita, DetailBerita, WebinarRoute, VerifikasiDokumen,
  Daftar, InformasiDasar, ProfilPreferensi, RingkasanPendaftaran,
  Login, ForgotPassword, ResetPassword,
  AdminLogin, AdminCredentialRecovery,
  DashboardClient, ClientProjectsPage, ClientSecurityPage,
  ChangePasswordPage, TwoFactorConfigurationPage, PhoneNumberChangePage,
  ClientSchedulePage, ClientDocumentsPage, ClientNotificationsPage,
  ClientDonationsPage, ClientCsrPage, ClientInternshipPage,
  ClientStudioOrdersPage, ClientCertificatesPage, ClientSupportPage,
  AccountOverview, AccountInvoice, InvoicePayment,
  AdminDashboard, InternDashboard, EditProfile,
  Contact, HelpCenter, KebijakanPrivasi, SyaratKetentuan,
  NewsroomEvents, EventDetail, NewsroomTags, ComingSoon,
} from "./routeImports";

type RouteLocation = {
  path: string;
  searchParams: URLSearchParams;
  hash: string;
};

type RouteRenderer = () => ReactNode;

const protectedRoutePrefixes = [
  "/akun",
  "/client-portal",
  "/dashboard",
  "/admin",
  "/internship/dashboard",
  "/peduli-mahreen/donasi",
  "/tanya-mahreen/pembayaran",
  "/mahreen-studio/order-summary",
  "/mahreen-studio/checkout",
  "/mahreen-studio/payment",
  "/mahreen-studio/review",
  "/mahreen-studio/lacak-pesanan",
  "/mahreen-studio/tracking",
] as const;

const requiresAuthentication = (path: string) => {
  if (
    path === "/admin/login" ||
    path === "/admin/forgot-credentials" ||
    path === "/internship/login"
  ) return false;
  return protectedRoutePrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
};

const getAllowedRoles = (path: string): readonly AccountRole[] | undefined => {
  if (path === "/admin" || path.startsWith("/admin/")) return ["admin", "superadmin"];
  if (path === "/internship/dashboard" || path.startsWith("/internship/dashboard/")) return ["intern"];
  if (
    path === "/akun" ||
    path.startsWith("/akun/") ||
    path === "/client-portal" ||
    path.startsWith("/client-portal/") ||
    path === "/dashboard" ||
    path.startsWith("/dashboard/")
  ) return ["client"];
  return undefined;
};

const normalizePath = (path: string) => {
  const pathWithLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const normalizedPath = pathWithLeadingSlash.replace(/\/{2,}/g, "/");

  if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
    return normalizedPath.slice(0, -1);
  }

  return normalizedPath || "/";
};

const migrateLegacyHashRoute = () => {
  const legacyHash = window.location.hash;

  if (!legacyHash.startsWith("#/")) return false;

  const cleanTarget = legacyHash.slice(1);
  window.history.replaceState(window.history.state, "", cleanTarget);
  return true;
};

const getCurrentLocation = (): RouteLocation => ({
  path: normalizePath(window.location.pathname || "/"),
  searchParams: new URLSearchParams(window.location.search),
  hash: window.location.hash,
});

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
};

const getSafeRedirectTarget = (value: string | null) => {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("#")
  ) {
    return null;
  }

  const queryIndex = value.indexOf("?");
  const rawPath = queryIndex >= 0 ? value.slice(0, queryIndex) : value;
  const rawQuery = queryIndex >= 0 ? value.slice(queryIndex + 1) : "";

  if (rawPath.includes(":") || normalizePath(rawPath) === "/login") {
    return null;
  }

  const targetPath = normalizePath(rawPath);
  return rawQuery ? `${targetPath}?${rawQuery}` : targetPath;
};

const getRouteTarget = ({ path, searchParams }: RouteLocation) => {
  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

const getTargetSection = ({ path, searchParams, hash }: RouteLocation) => {
  const hashSection = hash.startsWith("#")
    ? safeDecodeURIComponent(hash.slice(1))
    : null;

  if (hashSection) return hashSection;

  const explicitSection = searchParams.get("section");

  if (explicitSection) return explicitSection;
  if (path === "/internship" && searchParams.has("program")) return "jalur-program";
  if (path === "/tanya-mahreen" && searchParams.has("service")) return "solutions";

  return null;
};

const staticRoutes: Readonly<Record<string, RouteRenderer>> = {
  "/": () => <Home />,
  "/tentang": () => <Tentang />,
  "/portofolio": () => <Portofolio />,
  "/contact": () => <Contact />,
  "/kontak": () => <Contact />,
  "/help-center": () => <HelpCenter />,
  "/mahreen-studio": () => <Studio />,
  "/mahreen-studio/latest-collection": () => <LatestCollections />,
  "/mahreen-studio/order-summary": () => <StudioOrderSummary />,
  "/mahreen-studio/payment": () => <StudioPayment />,
  "/mahreen-studio/review": () => <StudioReview />,
  "/mahreen-studio/lacak-pesanan": () => <StudioTracking />,
  "/tanya-mahreen": () => <TanyaMahreen />,
  "/tanya-mahreen/konsultasi": () => <Konsultasi />,
  "/tanya-mahreen/konsultasi/cek-data": () => <CekData />,
  "/tanya-mahreen/konsultasi/selesai": () => <KonsultasiSelesai />,
  "/tanya-mahreen/konsultasi/hubungi-pm": () => <HubungiPM />,
  "/tanya-mahreen/paket/website": () => <KonfigurasiPaketWeb />,
  "/tanya-mahreen/paket/branding": () => <KonfigurasiPaketBranding />,
  "/tanya-mahreen/paket/social-media": () => <KonfigurasiPaketSocialMedia />,
  "/tanya-mahreen/paket/digital-marketing": () => <KonfigurasiPaketDigitalMarketing />,
  "/tanya-mahreen/paket/advertising": () => <KonfigurasiPaketAdvertising />,
  "/tanya-mahreen/paket/content-production": () => <KonfigurasiPaketContent />,
  "/tanya-mahreen/paket/consultation": () => <KonfigurasiPaketConsultation />,
  "/internship": () => <Internship />,
  "/internship/form": () => <FormInternship />,
  "/peduli-mahreen": () => <PeduliMahreen />,
  "/peduli-mahreen/donasi": () => <PilihNominal />,
  "/peduli-mahreen/donasi/data-diri": () => <DataDonatur />,
  "/peduli-mahreen/donasi/pembayaran": () => <MetodePembayaranDonasi />,
  "/peduli-mahreen/donasi/berhasil": () => <DonasiBerhasil />,
  "/daftar": () => <Daftar />,
  "/daftar/informasi-dasar": () => <InformasiDasar />,
  "/daftar/profil-preferensi": () => <ProfilPreferensi />,
  "/daftar/ringkasan": () => <RingkasanPendaftaran />,
  "/akun": () => <DashboardClient />,
  "/client-portal": () => <DashboardClient />,
  "/dashboard": () => <DashboardClient />,
  "/akun/edit": () => <EditProfile />,
  "/akun/overview": () => <AccountOverview />,
  "/akun/projects": () => <ClientProjectsPage />,
  "/akun/notifikasi": () => <ClientNotificationsPage />,
  "/akun/security": () => <ClientSecurityPage />,
  "/akun/security/ubah-kata-sandi": () => <ChangePasswordPage />,
  "/akun/security/2fa": () => <TwoFactorConfigurationPage />,
  "/akun/security/ubah-nomor": () => <PhoneNumberChangePage step={1} />,
  "/akun/security/ubah-nomor/nomor-baru": () => <PhoneNumberChangePage step={2} />,
  "/akun/security/ubah-nomor/selesai": () => <PhoneNumberChangePage step={3} />,
  "/akun/invoice": () => <AccountInvoice />,
  "/akun/jadwal": () => <ClientSchedulePage />,
  "/akun/dokumen": () => <ClientDocumentsPage />,
  "/akun/donations": () => <ClientDonationsPage />,
  "/akun/csr": () => <ClientCsrPage />,
  "/akun/internship": () => <ClientInternshipPage />,
  "/akun/studio-orders": () => <ClientStudioOrdersPage />,
  "/akun/sertifikat": () => <ClientCertificatesPage />,
  "/akun/support": () => <ClientSupportPage />,
  "/internship/dashboard": () => <InternDashboard />,
  "/admin": () => <AdminDashboard />,
  "/admin/login": () => <AdminLogin />,
  "/admin/forgot-credentials": () => <AdminCredentialRecovery />,
  "/internship/login": () => <Login redirectTo="/internship/dashboard" allowedRoles={["intern"]} />,
  "/newsroom": () => <NewsroomHome />,
  "/newsroom/verifikasi-dokumen": () => <VerifikasiDokumen />,
  "/mahreen-csr": () => <MahreenCSR />,
  "/mahreen-csr/program-objective": () => <ProgramObjective />,
  "/mahreen-csr/pendaftaran": () => <CSRRolePage />,
  "/mahreen-csr/pendaftaran/detail": () => <CSRDetailsPage />,
  "/mahreen-csr/pendaftaran/motivasi": () => <CSRMotivationPage />,
  "/mahreen-csr/pendaftaran/sukses": () => <CSRSuccessPage />,
  "/tanya-mahreen/pembayaran": () => <Pembayaran />,
  "/tanya-mahreen/pembayaran/konfirmasi": () => <KonfirmasiPembayaran />,
  "/tanya-mahreen/pembayaran/berhasil": () => <PembayaranBerhasil />,
  "/tanya-mahreen/pembayaran/client-portal": () => <AksesClientPortal />,
  "/tanya-mahreen/pembayaran/kick-off": () => <KickoffMeeting />,
  "/forgot-password": () => <ForgotPassword />,
  "/lupa-sandi": () => <ForgotPassword />,
  "/lupa-password": () => <ForgotPassword />,
  "/kebijakan-privasi": () => <KebijakanPrivasi />,
  "/syarat-ketentuan": () => <SyaratKetentuan />,
  "/dokumen/haki": () => (
    <ComingSoon
      eyebrow="Dokumen Legal"
      title="Dokumen HAKI sedang disiapkan"
      description="Salinan dokumen HAKI akan tersedia setelah berkas publik selesai diverifikasi."
    />
  ),
  "/dokumen/keputusan-menteri": () => (
    <ComingSoon
      eyebrow="Dokumen Legal"
      title="Keputusan Menteri sedang disiapkan"
      description="Salinan keputusan Menteri Hukum akan tersedia setelah berkas publik selesai diverifikasi."
    />
  ),
};

const renderRoute = (location: RouteLocation) => {
  const { path, searchParams } = location;

  if (
    (path === "/akun/security" ||
      path === "/akun/security/2fa" ||
      path.startsWith("/akun/security/ubah-nomor")) &&
    !env.enableClientSecurityCenter
  ) {
    return (
      <ComingSoon
        eyebrow="Keamanan Akun"
        title="Pusat keamanan sedang dihubungkan"
        description="Fitur sesi perangkat dan autentikasi dua faktor akan aktif setelah endpoint keamanan backend terverifikasi."
      />
    );
  }

  if (path === "/akun/dokumen" && !env.enableClientDocuments) {
    return (
      <ComingSoon
        eyebrow="Dokumen Client"
        title="Pusat dokumen sedang dihubungkan"
        description="Dokumen client akan tersedia setelah penyimpanan dan kontrol akses backend terverifikasi."
      />
    );
  }

  if (
    path === "/newsroom/verifikasi-dokumen" ||
    path === "/newsroom/verifikasi"
  ) {
    if (!env.enableDocumentVerification) {
      return (
        <ComingSoon
          eyebrow="Verifikasi Dokumen"
          title="Layanan verifikasi sedang disiapkan"
          description="Verifikasi akan diaktifkan setelah endpoint dokumen resmi dan data penerbit terhubung."
        />
      );
    }
    return <VerifikasiDokumen />;
  }

  const transactionRoute =
    path.startsWith("/tanya-mahreen/pembayaran") ||
    path.startsWith("/peduli-mahreen/donasi") ||
    /^\/newsroom\/webinar\/[^/]+\/(?:pembayaran|sukses)(?:\/|$)/.test(path) ||
    path === "/mahreen-studio/order-summary" ||
    path.startsWith("/mahreen-studio/checkout") ||
    path === "/mahreen-studio/payment" ||
    path === "/mahreen-studio/review";

  if (transactionRoute && !env.enableTransactionUi) {
    return (
      <ComingSoon
        eyebrow="Transaksi Aman"
        title="Pembayaran sedang disiapkan"
        description="Flow pembayaran akan diaktifkan setelah payment gateway dan verifikasi transaksi backend resmi tersedia."
      />
    );
  }

  if (
    (path === "/newsroom/verifikasi-dokumen" ||
      path === "/newsroom/verifikasi") &&
    !env.enableDocumentVerification
  ) {
    return (
      <ComingSoon
        eyebrow="Verifikasi Dokumen"
        title="Layanan verifikasi sedang disiapkan"
        description="Verifikasi akan diaktifkan setelah endpoint dokumen resmi dan data penerbit terhubung."
      />
    );
  }

  if (path.startsWith("/mahreen-studio/product/")) {
    return <DetailProduk />;
  }

  if (path.startsWith("/portofolio/")) {
    return <Portofolio />;
  }

  if (path === "/newsroom/berita") {
    return <NewsroomBerita />;
  }

  if (path.startsWith("/newsroom/berita/")) {
    const slug = safeDecodeURIComponent(path.slice("/newsroom/berita/".length));

    if (!slug) {
      return (
        <ComingSoon
          eyebrow="404"
          title="Alamat artikel tidak valid"
          description="Periksa kembali alamat artikel yang Anda buka."
        />
      );
    }

    return <DetailBerita slug={slug} />;
  }

  if (path.startsWith("/newsroom/webinar/")) {
    const webinarPath = safeDecodeURIComponent(
      path.slice("/newsroom/webinar/".length),
    );

    if (!webinarPath) {
      return (
        <ComingSoon
          eyebrow="404"
          title="Alamat webinar tidak valid"
          description="Periksa kembali alamat webinar yang Anda buka."
        />
      );
    }

    return <WebinarRoute webinarPath={webinarPath} />;
  }

  if (path === "/newsroom/events" || path === "/newsroom/event") {
    return <NewsroomEvents />;
  }

  if (path.startsWith("/newsroom/events/")) {
    const eventId = safeDecodeURIComponent(
      path.slice("/newsroom/events/".length),
    );

    if (!eventId) {
      return (
        <ComingSoon
          eyebrow="404"
          title="Alamat event tidak valid"
          description="Periksa kembali alamat event yang Anda buka."
        />
      );
    }

    return <EventDetail eventId={eventId} />;
  }

  if (path === "/newsroom/tags" || path === "/newsroom/topics") {
    return <NewsroomTags />;
  }

  if (path.startsWith("/newsroom/")) {
    return (
      <ComingSoon
        eyebrow="Newsroom"
        title="Konten Newsroom belum ditemukan"
        description="Alamat Newsroom yang Anda buka belum terdaftar. Gunakan menu Berita, Topik, atau Event untuk melanjutkan."
      />
    );
  }

  if (
    path === "/atur-ulang-sandi" ||
    path === "/atur-ulang-kata-sandi" ||
    path === "/atur-ulang-password" ||
    path === "/reset-password"
  ) {
    return <ResetPassword initialToken={searchParams.get("token")} />;
  }

  if (path === "/login") {
    return (
      <Login
        redirectTo={getSafeRedirectTarget(searchParams.get("redirect"))}
        registered={searchParams.get("registered") === "1"}
        initialEmail={searchParams.get("email")}
        authRequired={searchParams.get("required") === "1"}
        allowedRoles={["client"]}
      />
    );
  }

  if (path === "/admin/login") {
    return <AdminLogin />;
  }

  const invoicePaymentMatch = path.match(/^\/akun\/invoice\/([^/]+)\/bayar$/);
  if (invoicePaymentMatch) {
    const invoiceId = safeDecodeURIComponent(invoicePaymentMatch[1]);
    if (!invoiceId) {
      return (
        <ComingSoon
          eyebrow="Invoice"
          title="Invoice tidak valid"
          description="ID invoice pada alamat pembayaran tidak dapat dibaca."
        />
      );
    }
    return (
      <ProtectedRoute targetPath={getRouteTarget(location)} allowedRoles={["client"]}>
        <InvoicePayment invoiceId={invoiceId} />
      </ProtectedRoute>
    );
  }

  const routeRenderer = staticRoutes[path];

  if (routeRenderer) {
    const page = routeRenderer();
    return requiresAuthentication(path) ? (
      <ProtectedRoute
        targetPath={getRouteTarget(location)}
        allowedRoles={getAllowedRoles(path)}
      >
        {page}
      </ProtectedRoute>
    ) : page;
  }

  return (
    <ComingSoon
      eyebrow="404"
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda buka tidak terdaftar atau sudah tidak digunakan."
    />
  );
};

const AppRoutes = () => {
  const [currentLocation, setCurrentLocation] = useState<RouteLocation>(() => {
    migrateLegacyHashRoute();
    return getCurrentLocation();
  });
  const currentLocationRef = useRef(currentLocation);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    const syncLocation = (event?: Event) => {
      if (migrateLegacyHashRoute()) {
        window.dispatchEvent(new Event(APP_NAVIGATION_EVENT));
        return;
      }

      const nextLocation = getCurrentLocation();
      currentLocationRef.current = nextLocation;
      setCurrentLocation(nextLocation);

      if (event?.type === "popstate") {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    };

    const handleDocumentClick = (event: globalThis.MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.dataset.noSpa === "true") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!url.pathname.startsWith("/")) return;

      event.preventDefault();
      navigateToRoute(`${url.pathname}${url.search}${url.hash}`);
    };

    window.addEventListener("popstate", syncLocation);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener(APP_NAVIGATION_EVENT, syncLocation);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("popstate", syncLocation);
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener(APP_NAVIGATION_EVENT, syncLocation);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const getSeoMetadataForPath = useCallback(async (path: string) => {
    const { getSeoMetadata } = await import("../config/seo");
    return getSeoMetadata(path);
  }, []);

  useSeoMetadata(currentLocation.path, getSeoMetadataForPath);
  usePageTracking(currentLocation.path);

  useEffect(() => {
    const targetSection = getTargetSection(currentLocation);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useInstantScroll = reduceMotion || currentLocation.path.startsWith("/newsroom");
    let secondFrame = 0;

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (targetSection) {
          const targetElement = document.getElementById(targetSection);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: useInstantScroll ? "auto" : "smooth",
              block: "start",
            });
            return;
          }
        }

        window.scrollTo({ top: 0, behavior: "auto" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);

      if (secondFrame) {
        window.cancelAnimationFrame(secondFrame);
      }
    };
  }, [currentLocation]);

  const routeKey = `${currentLocation.path}?${currentLocation.searchParams.toString()}`;

  return (
    <RouteErrorBoundary resetKey={routeKey}>
      <Suspense fallback={<RouteSkeleton />}>
        <main
          className="app-route"
          id="main-content"
          tabIndex={-1}
          key={routeKey}
          data-route={currentLocation.path}
        >
          {renderRoute(currentLocation)}
        </main>
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default AppRoutes;
