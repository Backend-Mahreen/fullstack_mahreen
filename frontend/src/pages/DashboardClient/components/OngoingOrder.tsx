import { Box, CalendarDays, PackageCheck } from "lucide-react";
import type { StudioOrder } from "../../Mahreen-Studio/Purchase/types";

type OngoingOrderProps = {
  order: StudioOrder | null;
};


const statusLabels: Record<StudioOrder["status"], string> = {
  confirmed: "Dikonfirmasi",
  processed: "Diproses",
  shipped: "Dalam Perjalanan",
  delivered: "Terkirim",
};

const statusSteps: Record<StudioOrder["status"], number> = {
  confirmed: 0,
  processed: 1,
  shipped: 2,
  delivered: 3,
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const OngoingOrder = ({ order }: OngoingOrderProps) => {
  const currentStep = order ? statusSteps[order.status] : 0;
  const progress = `${Math.round((currentStep / 3) * 100)}%`;

  return (
    <>
<section
        id="ongoing-order"
        className={`dashboard-card client-dashboard__order${order ? "" : " client-dashboard__order--empty"}`}
        data-dashboard-reveal
        data-dashboard-step="5"
        style={{ "--order-progress": progress } as React.CSSProperties}
      >
        <div className="client-dashboard__package-icon">
          <Box aria-hidden="true" />
        </div>
        <div className="client-dashboard__order-copy">
          <span>{order ? "Ongoing Order" : "Mahreen Studio"}</span>
          <h2>{order?.item.productTitle ?? "Belum ada pesanan aktif"}</h2>
          {order ? (
            <>
              <p>
                <PackageCheck aria-hidden="true" /> {statusLabels[order.status]}
              </p>
              <p>
                <CalendarDays aria-hidden="true" /> ETA:{" "}
                {formatDate(order.estimatedArrival)}
              </p>
            </>
          ) : (
            <p>Pesanan terbaru Anda akan tampil dan dapat dilacak dari sini.</p>
          )}
        </div>
        {order ? (
          <div className="client-dashboard__tracking">
            <div className="client-dashboard__tracking-labels">
              <span>Confirmed</span>
              <span>Processed</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
            <div className="client-dashboard__tracking-line">
              {[0, 1, 2, 3].map((step) => (
                <span
                  className={
                    step === currentStep
                      ? "is-current"
                      : step < currentStep
                        ? "is-complete"
                        : ""
                  }
                  key={step}
                />
              ))}
            </div>
          </div>
        ) : null}
        <a
          className="client-dashboard__secondary-button"
          href={
            order
              ? "/mahreen-studio/lacak-pesanan"
              : "/mahreen-studio/latest-collection"
          }
        >
          {order ? "Track Package" : "Lihat Koleksi"}
        </a>
      </section>
    </>
  );
};

export default OngoingOrder;
