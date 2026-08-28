import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { clientInvoiceService } from "../../../services/invoice/clientInvoiceService";
import { NOTIFICATION_EVENT_BUS_NAME } from "../../../hooks/useNotificationTrigger";
import { navigateToRoute } from "../../../utils/hashNavigation";
import ClientAccountLayout from "../components/ClientAccountLayout";
import InvoiceHeader from "./components/InvoiceHeader";
import InvoiceTable from "./components/InvoiceTable";
import type { ClientInvoice } from "./types";
import "./Invoice.css";

const Invoice = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<ClientInvoice[] | null>(() =>
    user ? clientInvoiceService.getInitial(user) : null,
  );
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const nextInvoices = await clientInvoiceService.load(user);
      setInvoices(nextInvoices);
    } catch {
      setMessage("Data invoice belum dapat dimuat. Coba kembali beberapa saat lagi.");
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void refresh();
    const unsubscribe = clientInvoiceService.subscribe(refresh);
    window.addEventListener("focus", refresh);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, [user, refresh]);

  useEffect(() => {
    const onNotify = (event: Event) => {
      const detail = (event as CustomEvent<{ resource: string }>).detail;
      if (!detail) return;
      if (["invoices", "transactions", "all"].includes(detail.resource)) {
        void refresh();
      }
    };
    window.addEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
    return () => window.removeEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
  }, [refresh]);

  const payableInvoices = useMemo(
    () => invoices?.filter((invoice) => invoice.status !== "paid") ?? [],
    [invoices],
  );

  if (!user || !invoices) return null;

  const handlePay = (invoiceId: string) => {
    navigateToRoute("/akun/invoice/" + encodeURIComponent(invoiceId) + "/bayar");
  };

  const payNextInvoice = () => {
    const nextInvoice = payableInvoices[0];
    if (!nextInvoice) return;
    handlePay(nextInvoice.id);
  };

  return (
    <ClientAccountLayout activeItem="invoice" className="client-invoices-page">
      <div className="client-invoices">
        <InvoiceHeader
          payableCount={payableInvoices.length}
          onPayNext={payNextInvoice}
        />
        <p className="client-invoices__message" aria-live="polite">{message}</p>
        <InvoiceTable
          invoices={invoices}
          payingInvoiceId={null}
          onPay={handlePay}
        />
      </div>
    </ClientAccountLayout>
  );
};

export default Invoice;
