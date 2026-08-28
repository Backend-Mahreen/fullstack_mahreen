import { ArrowRight } from "lucide-react";
import type { ClientInvoice } from "../../invoice/types";
import {
  formatInvoiceCurrency,
  invoiceStatusLabel,
} from "../../invoice/invoiceFormatters";

const OverviewInvoicePreview = ({ invoices }: Readonly<{ invoices: ClientInvoice[] }>) => (
  <section className="account-overview__panel" aria-labelledby="overview-invoice-title">
    <header className="account-overview__panel-header">
      <div>
        <span>TAGIHAN</span>
        <h2 id="overview-invoice-title">Invoice Terbaru</h2>
      </div>
      <a href="/akun/invoice" aria-label="Lihat semua invoice"><ArrowRight aria-hidden="true" /></a>
    </header>
    <div className="account-overview__invoice-list">
      {invoices.length ? invoices.slice(0, 3).map((invoice) => (
        <article className="account-overview__invoice" key={invoice.id}>
          <div>
            <code>{invoice.code}</code>
            <p>{invoice.project}</p>
          </div>
          <div>
            <strong>{formatInvoiceCurrency(invoice.amount)}</strong>
            <span className={`invoice-status invoice-status--${invoice.status}`}>
              {invoiceStatusLabel[invoice.status]}
            </span>
          </div>
        </article>
      )) : (
        <p className="account-overview__empty">Belum ada invoice.</p>
      )}
    </div>
    <a className="account-overview__panel-link" href="/akun/invoice">
      Lihat semua invoice <ArrowRight aria-hidden="true" />
    </a>
  </section>
);

export default OverviewInvoicePreview;
