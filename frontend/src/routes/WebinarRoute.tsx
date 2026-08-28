import React, { lazy, useEffect, useState } from "react";
import ComingSoon from "../pages/ComingSoon/ComingSoon";
import RouteSkeleton from "../components/Loading/RouteSkeleton";
import { getWebinarBySlug, getAllWebinars, loadWebinarsFromApi } from "../data/webinars";

const WebinarDetail = lazy(
  () => import("../pages/Newsroom/WebinarDetail/WebinarDetail"),
);
const WebinarRegistration = lazy(
  () => import("../pages/Newsroom/WebinarRegistration/WebinarRegistration"),
);
const WebinarPayment = lazy(
  () => import("../pages/Newsroom/WebinarPayment/WebinarPayment"),
);
const WebinarPaymentQris = lazy(
  () => import("../pages/Newsroom/WebinarPaymentQris/WebinarPaymentQris"),
);
const WebinarBankTransfer = lazy(
  () => import("../pages/Newsroom/WebinarBankTransfer/WebinarBankTransfer"),
);
const RegistrationSuccess = lazy(
  () => import("../pages/Newsroom/RegistrationSuccess/RegistrationSuccess"),
);

type WebinarRouteProps = Readonly<{
  webinarPath: string;
}>;

const renderWebinarStep = (
  webinar: NonNullable<ReturnType<typeof getWebinarBySlug>>,
  paidComponent: React.LazyExoticComponent<React.FC<{ webinar: typeof webinar }>>,
) =>
  webinar.isFree ? (
    <WebinarRegistration webinar={webinar} />
  ) : (
    React.createElement(paidComponent, { webinar })
  );

const WebinarRoute = ({ webinarPath }: WebinarRouteProps) => {
  // Cache webinar diisi dari API. Jika belum terisi, muat sekali di sini
  // sebelum mencoba mencocokkan slug agar detail webinar tidak selalu
  // jatuh ke ComingSoon.
  const [isLoading, setIsLoading] = useState(() => getAllWebinars().length === 0);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    // Cache sudah terisi (mis. dari kunjungan sebelumnya) — tidak perlu muat.
    if (getAllWebinars().length > 0) {
      return;
    }

    let cancelled = false;
    loadWebinarsFromApi()
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <RouteSkeleton />;
  }

  const webinarSegments = webinarPath.split("/").filter(Boolean);
  const [webinarSlug, webinarAction, webinarPaymentAction] = webinarSegments;
  const webinar = webinarSlug ? getWebinarBySlug(webinarSlug) : null;

  if (!webinar) {
    return (
      <ComingSoon
        eyebrow="Newsroom Webinar"
        title={loadFailed ? "Gagal memuat data webinar" : "Detail webinar sedang disiapkan"}
        description={
          loadFailed
            ? "Terjadi kendala saat memuat data webinar. Silakan muat ulang halaman."
            : "Informasi lengkap webinar ini akan tersedia pada tahap berikutnya."
        }
      />
    );
  }

  if (webinarSegments.length === 1) {
    return <WebinarDetail webinar={webinar} />;
  }

  if (webinarSegments.length === 2 && webinarAction === "daftar") {
    return <WebinarRegistration webinar={webinar} />;
  }

  if (webinarSegments.length === 2 && webinarAction === "pembayaran") {
    return renderWebinarStep(webinar, WebinarPayment);
  }

  if (
    webinarSegments.length === 3 &&
    webinarAction === "pembayaran" &&
    webinarPaymentAction === "qris"
  ) {
    return renderWebinarStep(webinar, WebinarPaymentQris);
  }

  if (
    webinarSegments.length === 3 &&
    webinarAction === "pembayaran" &&
    webinarPaymentAction === "transfer-bank"
  ) {
    return renderWebinarStep(webinar, WebinarBankTransfer);
  }

  if (webinarSegments.length === 2 && webinarAction === "sukses") {
    return <RegistrationSuccess webinar={webinar} />;
  }

  return (
    <ComingSoon
      eyebrow="Newsroom Webinar"
      title="Tahapan webinar belum tersedia"
      description="Alamat tahapan webinar yang Anda buka belum terdaftar."
    />
  );
};

export default WebinarRoute;
