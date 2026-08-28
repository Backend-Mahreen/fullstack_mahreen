import { CalendarDays, CheckCircle2, Video } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import TanyaMahreenNavbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import { useAuth } from "../../../../hooks/useAuth";
import { DraftMissing, ProgressDots } from "./PaymentFlowUI";
import { PAYMENT_FLOW_STYLES } from "./paymentFlowStyles";
import { localDashboardRepository } from "../../../../services/dashboard/dashboardRepository";
import { getPaymentDraft, savePaymentMeeting } from "./paymentStorage";
import type { ServicePaymentDraft } from "./paymentTypes";

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const getAvailableDates = () => {
  const result: Date[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  while (result.length < 5) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) result.push(new Date(cursor));
  }

  return result;
};

const KickoffMeeting = () => {
  const { user } = useAuth();
  const [draft] = useState<ServicePaymentDraft | null>(() => getPaymentDraft());
  const availableDates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!draft || !selectedDate || !selectedTime) return;

    const meeting = savePaymentMeeting(selectedDate, selectedTime);
    const startsAt = new Date(`${selectedDate}T${selectedTime}:00`);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(startsAt)
      .toUpperCase();

    localDashboardRepository.upsertSchedule(user?.id ?? draft.billingInformation.fullName, {
      id: `kickoff:${draft.transactionId}`,
      startsAt: startsAt.toISOString(),
      month,
      day: String(startsAt.getDate()).padStart(2, "0"),
      title: "Kick-off Meeting",
      description: `Project: ${draft.selection.tier.name}\nInitial alignment session`,
      time: `${selectedTime} - ${String(Number(selectedTime.slice(0, 2)) + 1).padStart(2, "0")}:00 WIB`,
      label: meeting.method,
      showAvatars: true,
      memberNames: [draft.billingInformation.fullName, "Mahreen Indonesia"],
      href: "/tanya-mahreen/pembayaran/client-portal",
    });
    setConfirmed(true);
  };

  return (
    <>
      <style>{PAYMENT_FLOW_STYLES}</style>
      <TanyaMahreenNavbar />

      <main className="spf-page">
        <div className="spf-shell spf-shell--wide">
          <header className="spf-header spf-reveal" style={{ "--spf-delay": "40ms" } as CSSProperties}>
            <span className="spf-header__icon"><CalendarDays aria-hidden="true" /></span>
            <ProgressDots step={3} />
            <h1>Kick-off Meeting</h1>
            <p>Pilih jadwal konsultasi pertama dengan <strong>Direktur Kreatif</strong> kami.</p>
          </header>

          {!draft ? (
            <DraftMissing />
          ) : (
            <>
              <section className="spf-card spf-schedule-card spf-reveal" style={{ "--spf-delay": "150ms" } as CSSProperties}>
                <h2>Pilih Jadwal</h2>

                <p className="spf-schedule-label">Pilih Tanggal</p>
                <div className="spf-date-grid">
                  {availableDates.map((date) => {
                    const iso = date.toISOString().slice(0, 10);
                    const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date);
                    return (
                      <button
                        key={iso}
                        type="button"
                        className={`spf-slot${selectedDate === iso ? " is-selected" : ""}`}
                        onClick={() => { setSelectedDate(iso); setConfirmed(false); }}
                      >
                        <span>{dayName}</span><strong>{date.getDate()}</strong>
                      </button>
                    );
                  })}
                </div>

                <p className="spf-schedule-label">Pilih Waktu</p>
                <div className="spf-time-grid">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`spf-slot${selectedTime === time ? " is-selected" : ""}`}
                      onClick={() => { setSelectedTime(time); setConfirmed(false); }}
                    >
                      <strong>{time}</strong>
                    </button>
                  ))}
                </div>

                <p className="spf-schedule-label">Metode Meeting</p>
                <div className="spf-meeting-method">
                  <Video aria-hidden="true" />
                  <div><strong>Video Call</strong><span>Google Meet / Zoom</span></div>
                </div>

                <div className="spf-actions">
                  <button type="button" className="spf-primary" disabled={!selectedDate || !selectedTime} onClick={handleConfirm}>
                    Konfirmasi Jadwal <CalendarDays aria-hidden="true" />
                  </button>
                </div>

                {confirmed && (
                  <div className="spf-note is-success" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    <span><strong>Jadwal berhasil dikonfirmasi.</strong> Tautan meeting akan dikirimkan melalui email Client Portal Anda.</span>
                  </div>
                )}

                <div className="spf-note">
                  <CalendarDays aria-hidden="true" />
                  <span>Meeting berlangsung selama 60 menit. Link akses dikirim melalui email setelah jadwal dikonfirmasi.</span>
                </div>
              </section>

              <div className="spf-actions spf-reveal" style={{ "--spf-delay": "250ms" } as CSSProperties}>
                <a className="spf-secondary" href="/tanya-mahreen/pembayaran/client-portal">Kembali ke Client Portal</a>
              </div>
            </>
          )}
        </div>
      </main>

      <ClosingSection />
      <Footer />
    </>
  );
};

export default KickoffMeeting;
