import { lazy, Suspense, useEffect, useRef, useState } from "react";
import NewsroomNavbar from "../Home/components/NewsroomNavbar";
import NewsroomSidebar from "../Home/components/NewsroomSidebar";
import CTA from "../../../components/CTA/CTA";
import ClosingSection from "../../../components/Closing-section/Closing-section";
import Footer from "../../../components/Footer/Footer";
import VerificationFaqCta from "./components/VerificationFaqCta";
import VerificationHero from "./components/VerificationHero";
import VerificationResult from "./components/VerificationResult";
import VerificationStats from "./components/VerificationStats";
import VerificationSteps from "./components/VerificationSteps";
import VerificationToast from "./components/VerificationToast";
import {
  verificationService,
  type VerificationCertificate,
  type VerificationResultStatus,
} from "../../../services/verification/verificationService";
import verificationStyles from "./verificationStyles";

const VerificationScannerModal = lazy(() => import("./components/VerificationScannerModal"));

const VerifikasiDokumen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [verifiedDocumentId, setVerifiedDocumentId] = useState("");
  const [formError, setFormError] = useState("");
  const [isFreshResult, setIsFreshResult] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [resultStatus, setResultStatus] = useState<VerificationResultStatus>("not_found");
  const [resultCertificate, setResultCertificate] = useState<VerificationCertificate | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const resultTimerRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
      toastTimerRef.current = null;
    }, 3600);
  };

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("newsroom-document", "mvc-document");
    body.classList.add("newsroom-document-body", "mvc-document-body");
    return () => {
      html.classList.remove(
        "newsroom-document",
        "newsroom-sidebar-open",
        "newsroom-mobile-nav-open",
        "mvc-document",
      );
      body.classList.remove(
        "newsroom-document-body",
        "newsroom-sidebar-open",
        "newsroom-mobile-nav-open",
        "mvc-document-body",
      );
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (resultTimerRef.current !== null) window.clearTimeout(resultTimerRef.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("newsroom-sidebar-open", isSidebarOpen);
    document.body.classList.toggle("newsroom-sidebar-open", isSidebarOpen);
    return () => {
      document.documentElement.classList.remove("newsroom-sidebar-open");
      document.body.classList.remove("newsroom-sidebar-open");
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const closeOnDesktop = () => { if (window.innerWidth > 1024) setIsSidebarOpen(false); };
    closeOnDesktop();
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  const handleVerify = async (value = documentNumber) => {
    const normalizedValue = value.trim().toUpperCase();
    if (normalizedValue.length < 6) {
      setFormError("Masukkan nomor dokumen yang lengkap untuk memulai verifikasi.");
      return;
    }
    setFormError("");
    setDocumentNumber(normalizedValue);
    setVerifiedDocumentId(normalizedValue);
    setIsVerifying(true);

    try {
      const result = await verificationService.check(normalizedValue);
      setResultStatus(result.result);
      setResultCertificate(result.certificate);
      setIsFreshResult(true);
      showToast(
        result.valid
          ? "Dokumen ditemukan dan tanda tangan digital berhasil divalidasi."
          : result.result === "not_found"
            ? "Dokumen tidak ditemukan. Periksa kembali kode yang Anda masukkan."
            : "Dokumen ditemukan tetapi statusnya tidak aktif.",
      );
      if (resultTimerRef.current !== null) window.clearTimeout(resultTimerRef.current);
      resultTimerRef.current = window.setTimeout(() => {
        setIsFreshResult(false);
        resultTimerRef.current = null;
      }, 1200);
      window.requestAnimationFrame(() => {
        document.getElementById("hasil-verifikasi")?.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      });
    } catch (caughtError) {
      setResultStatus("not_found");
      setResultCertificate(null);
      setFormError(caughtError instanceof Error ? caughtError.message : "Verifikasi gagal. Silakan coba kembali.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScannerCode = (value: string) => {
    setIsScannerOpen(false);
    setDocumentNumber(value);
    void handleVerify(value);
  };

  return (
    <>
      <style data-component="mahreen-verification-center">{verificationStyles}</style>
      <NewsroomNavbar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />
      <div className="mvc-page">
        <NewsroomSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="mvc-main">
          <VerificationHero documentNumber={documentNumber} onDocumentNumberChange={(value) => { setDocumentNumber(value); setFormError(""); }} onVerify={() => void handleVerify()} onOpenScanner={() => setIsScannerOpen(true)} error={formError} />
          <VerificationStats />
          <VerificationResult documentId={verifiedDocumentId} isFreshResult={isFreshResult} status={resultStatus} certificate={resultCertificate} isLoading={isVerifying} onDownload={() => {
            showToast("Dialog cetak dibuka. Pilih ‘Save as PDF’ untuk menyimpan hasil verifikasi.");
            window.setTimeout(() => window.print(), 180);
          }} />
          <VerificationSteps />
          <VerificationFaqCta />
          <div className="mvc-global-cta" data-mvc-reveal style={{ "--mvc-delay": "120ms" } as React.CSSProperties}>
            <CTA />
          </div>
          <div className="mvc-global-closing" data-mvc-reveal style={{ "--mvc-delay": "160ms" } as React.CSSProperties}>
            <ClosingSection />
          </div>
          <div className="mvc-global-footer" data-mvc-reveal style={{ "--mvc-delay": "200ms" } as React.CSSProperties}>
            <Footer />
          </div>
        </main>
      </div>
      {isScannerOpen && (
        <Suspense fallback={null}>
          <VerificationScannerModal onClose={() => setIsScannerOpen(false)} onUseCode={handleScannerCode} />
        </Suspense>
      )}
      {toastMessage && <VerificationToast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};
export default VerifikasiDokumen;
