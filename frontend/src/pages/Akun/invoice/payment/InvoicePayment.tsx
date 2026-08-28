import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { clientInvoiceService } from "../../../../services/invoice/clientInvoiceService";
import { navigateToRoute } from "../../../../utils/hashNavigation";
import ClientAccountLayout from "../../components/ClientAccountLayout";
import type { ClientInvoice } from "../types";
import InvoicePaymentMethods from "./InvoicePaymentMethods";
import InvoicePaymentSummary from "./InvoicePaymentSummary";
import "../Invoice.css";
import "./InvoicePayment.css";

const InvoicePayment = ({ invoiceId }: Readonly<{ invoiceId: string }>) => {
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<ClientInvoice | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("bca");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void clientInvoiceService.load(user).then((records) => {
      if (active) setInvoice(records.find((record) => record.id === invoiceId) || null);
    }).catch(() => {
      if (active) setMessage("Invoice belum dapat dimuat.");
    });
    return () => { active = false; };
  }, [invoiceId, user]);

  if (!user) return null;

  const confirmPayment = async () => {
    if (!invoice || invoice.status === "paid") return;
    setIsSubmitting(true);
    setMessage("");
    try {
      const updated = await clientInvoiceService.pay(user, invoice.id, selectedMethod);
      if (!updated) throw new Error("Invoice tidak ditemukan.");
      setInvoice(updated);
      setSuccess(true);
      setMessage("Pembayaran local tersimpan untuk " + updated.code + ".");
    } catch {
      setMessage("Pembayaran belum berhasil diproses.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientAccountLayout activeItem="invoice" className="invoice-payment-page">
      <div className="invoice-payment-shell">
        <button className="invoice-payment-back" type="button" onClick={() => navigateToRoute("/akun/invoice")}>
          <ArrowLeft aria-hidden="true" /> Kembali ke Invoice
        </button>

        <header className="invoice-payment-header">
          <span>CLIENT BILLING</span>
          <h1>Pembayaran Invoice</h1>
          <p>Konfirmasi pembayaran untuk produk atau layanan yang terkait langsung dengan invoice pilihan Anda.</p>
        </header>

        {success ? (
          <section className="invoice-payment-success" role="status">
            <CheckCircle2 aria-hidden="true" />
            <div>
              <h2>Invoice Berhasil Dibayar</h2>
              <p>{message}</p>
            </div>
            <button type="button" onClick={() => navigateToRoute("/akun/invoice")}>Lihat Daftar Invoice</button>
          </section>
        ) : invoice ? (
          <div className="invoice-payment-grid">
            <InvoicePaymentMethods selected={selectedMethod} onSelect={setSelectedMethod} />
            <InvoicePaymentSummary invoice={invoice} isSubmitting={isSubmitting} onConfirm={confirmPayment} />
          </div>
        ) : (
          <section className="invoice-payment-loading">
            <span />
            <span />
            <span />
            <p>{message || "Memuat detail invoice..."}</p>
          </section>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default InvoicePayment;
