import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import EventPayment from "./EventPayment";
import EventRegistration from "./EventRegistration";

import NewsroomLayout from "../layout/NewsroomLayout";
import { handleNewsroomImageError } from "../utils/newsroomImageFallback";

import useNewsroomDatabase from "../../../hooks/useNewsroomDatabase";
import { useAuth } from "../../../hooks/useAuth";

import {
  getPublicEventById,
  type PublicEventRecord,
} from "../../../services/newsroom/eventsPublicService";

import { getLoginRedirectRoute } from "../../../services/auth/authNavigation";
import { navigateToRoute } from "../../../utils/hashNavigation";

const EVENTS_ROUTE = "/newsroom/events";

const styles = `
  .newsroom-event-detail {
    --event-gold: #e5c477;
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: 100dvh;
    padding-top: var(--navbar-height, 74px);
    overflow-x: clip;
    color: #f4efe8;
    background: #000;
    font-family: Arial, Helvetica, sans-serif;
  }

  .newsroom-event-detail *,
  .newsroom-event-detail *::before,
  .newsroom-event-detail *::after {
    box-sizing: border-box;
  }

  .newsroom-event-detail [data-event-reveal] {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 720ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .newsroom-event-detail [data-event-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .newsroom-event-hero {
    position: relative;
    display: flex;
    min-height: clamp(430px, 46vw, 560px);
    isolation: isolate;
    align-items: center;
    overflow: hidden;
    background: #0a0908;
  }

  .newsroom-event-hero__image {
    position: absolute;
    inset: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    animation:
      newsroom-event-image-in 1.2s
      cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-event-hero::before {
    position: absolute;
    inset: 0;
    z-index: -2;
    content: "";
    background:
      linear-gradient(
        90deg,
        rgba(2, 2, 2, 0.97) 0%,
        rgba(2, 2, 2, 0.86) 40%,
        rgba(2, 2, 2, 0.4) 68%,
        rgba(2, 2, 2, 0.32) 100%
      ),
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.08) 0%,
        rgba(0, 0, 0, 0.24) 58%,
        rgba(0, 0, 0, 0.8) 100%
      );
  }

  .newsroom-event-hero::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    content: "";
    background:
      radial-gradient(
        circle at 60% 45%,
        rgba(229, 196, 119, 0.1),
        transparent 36%
      );
  }

  .newsroom-event-hero__inner {
    width: min(100%, 1180px);
    margin-inline: auto;
    padding:
      clamp(56px, 6vw, 82px)
      clamp(42px, 9.8vw, 112px)
      clamp(48px, 5.2vw, 70px);
  }

  .newsroom-event-hero__content {
    width: min(100%, 680px);
    animation:
      newsroom-event-content-in 900ms 140ms
      cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-event-hero__meta {
    display: flex;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    color: #aea79e;
    font-size: 11px;
    line-height: 1.4;
  }

  .newsroom-event-hero__category {
    display: inline-flex;
    min-height: 27px;
    padding: 0 13px;
    align-items: center;
    border: 1px solid rgba(229, 196, 119, 0.38);
    border-radius: 999px;
    color: #e0bd6c;
    background: rgba(229, 196, 119, 0.13);
    font-size: 10px;
    font-weight: 500;
  }

  .newsroom-event-hero__access {
    display: inline-flex;
    min-height: 27px;
    padding: 0 13px;
    align-items: center;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  .newsroom-event-hero__access.is-free {
    color: #050505;
    background: #e5c477;
  }

  .newsroom-event-hero__access.is-paid {
    color: #ef9a8e;
    border: 1px solid rgba(211, 76, 57, 0.4);
    background: rgba(211, 76, 57, 0.12);
  }

  .newsroom-event-hero__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #766f67;
  }

  .newsroom-event-hero__title {
    max-width: 660px;
    margin: 0;
    color: #f1ece5;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(42px, 4.2vw, 62px);
    font-weight: 700;
    line-height: 1.07;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  .newsroom-event-hero__subline {
    display: flex;
    margin: 22px 0 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    color: #c9c2b8;
    font-size: 13px;
  }

  .newsroom-event-hero__subline > span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .newsroom-event-hero__subline svg {
    color: var(--event-gold);
  }

  .newsroom-event-content {
    position: relative;
    width: min(100%, 1280px);
    margin-inline: auto;
    padding:
      clamp(70px, 7vw, 105px)
      clamp(28px, 5vw, 72px)
      clamp(85px, 8vw, 120px);
  }

  .newsroom-event-content__grid {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(270px, 340px);
    align-items: start;
    gap: clamp(55px, 7vw, 105px);
  }

  .newsroom-event-content__main {
    min-width: 0;
  }

  .newsroom-event-content__aside {
    position: static;
    min-width: 0;
    align-self: start;
  }

  .newsroom-event-content__aside-inner {
    display: grid;
    width: 100%;
    gap: 22px;
  }

  .newsroom-event-section-heading {
    margin: 0 0 22px;
    color: #e5c477;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(26px, 2.4vw, 36px);
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .newsroom-event-description {
    min-width: 0;
    color: #bbb4ab;
    font-size: 15px;
    line-height: 1.9;
  }

  .newsroom-event-description p {
    margin: 0 0 22px;
  }

  .newsroom-event-description p:last-child {
    margin-bottom: 0;
  }

  .newsroom-event-card {
    overflow: hidden;
    border: 1px solid rgba(229, 196, 119, 0.2);
    border-radius: 12px;
    background:
      radial-gradient(
        circle at 100% 0%,
        rgba(229, 196, 119, 0.08),
        transparent 46%
      ),
      #0d0c0b;
  }

  .newsroom-event-card__header {
    padding: 20px 22px;
    border-bottom: 1px solid rgba(229, 196, 119, 0.14);
    color: #e5c477;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 17px;
  }

  .newsroom-event-card__body {
    display: grid;
    padding: 8px 22px 22px;
    gap: 16px;
  }

  .newsroom-event-info-row {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr);
    align-items: start;
    gap: 12px;
  }

  .newsroom-event-info-row svg {
    margin-top: 2px;
    color: #b7a45f;
  }

  .newsroom-event-info-row strong {
    display: block;
    margin-bottom: 2px;
    color: #e8e3db;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .newsroom-event-info-row span {
    color: #9d968b;
    font-size: 13px;
    line-height: 1.55;
  }

  .newsroom-event-card__cta {
    display: inline-flex;
    width: 100%;
    min-height: 48px;
    margin-top: 6px;
    padding: 0 16px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #f0c846;
    border-radius: 4px;
    color: #151208;
    background: linear-gradient(135deg, #f7d559, #eab932);
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      box-shadow 200ms ease,
      transform 200ms ease;
  }

  .newsroom-event-card__cta:hover {
    box-shadow: 0 15px 36px rgba(225, 178, 42, 0.22);
    transform: translateY(-2px);
  }

  .newsroom-event-card__cta:focus-visible,
  .newsroom-event-back:focus-visible {
    outline: 2px solid #f0c846;
    outline-offset: 3px;
  }

  .newsroom-event-card__cta:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .newsroom-event-back {
    display: inline-flex;
    min-height: 44px;
    padding: 10px 20px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 4px;
    color: #d8d2c9;
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition:
      color 180ms ease,
      border-color 180ms ease;
  }

  .newsroom-event-back:hover {
    color: #e5c477;
    border-color: rgba(229, 196, 119, 0.4);
  }

  .newsroom-event-state {
    display: grid;
    min-height: 62vh;
    place-items: center;
    padding: 80px 24px;
    text-align: center;
  }

  .newsroom-event-state__card {
    max-width: 460px;
  }

  .newsroom-event-state__icon {
    display: grid;
    width: 58px;
    height: 58px;
    margin: 0 auto 20px;
    place-items: center;
    border: 1px solid rgba(139, 210, 157, 0.28);
    border-radius: 50%;
    color: #8bd29d;
    background: rgba(139, 210, 157, 0.08);
  }

  .newsroom-event-state__card h1 {
    margin: 0 0 12px;
    color: #f1ece5;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 400;
  }

  .newsroom-event-state__card p {
    margin: 0 0 28px;
    color: #aaa39a;
    font-size: 14px;
    line-height: 1.7;
  }

  .newsroom-event-state__card strong {
    color: #e5c477;
  }

  @keyframes newsroom-event-image-in {
    from {
      opacity: 0;
      transform: scale(1.08);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes newsroom-event-content-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 980px) {
    .newsroom-event-content__grid {
      grid-template-columns: 1fr;
      gap: 58px;
    }

    .newsroom-event-content__aside {
      align-self: auto;
    }

    .newsroom-event-content__aside-inner {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .newsroom-event-hero {
      min-height: 560px;
      align-items: flex-end;
    }

    .newsroom-event-hero__image {
      object-position: 61% center;
    }

    .newsroom-event-hero__inner {
      padding: 82px 22px 56px;
    }

    .newsroom-event-hero__content {
      width: 100%;
    }

    .newsroom-event-hero__meta {
      margin-bottom: 20px;
      gap: 9px;
      font-size: 10px;
    }

    .newsroom-event-hero__title {
      font-size: clamp(38px, 11.5vw, 54px);
    }

    .newsroom-event-content {
      padding: 62px 22px 82px;
    }

    .newsroom-event-content__aside-inner {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-event-detail [data-event-reveal],
    .newsroom-event-hero__image,
    .newsroom-event-hero__content {
      opacity: 1;
      transform: none;
      animation: none;
      transition: none;
    }
  }
`;

type RegistrationStep =
  | "detail"
  | "register"
  | "payment"
  | "success";

type EventDetailProps = Readonly<{
  eventId: string;
}>;

const parseEventDate = (value?: string) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatLongDate = (value?: string) => {
  if (!value) return "—";

  const date = parseEventDate(value);

  if (!date) return value;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatShortDate = (value?: string) => {
  if (!value) return "—";

  const date = parseEventDate(value);

  if (!date) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const splitDescription = (description?: string): string[] => {
  if (!description?.trim()) return [];

  return description
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const EventLoadingState = () => (
  <div
    className="newsroom-event-state"
    role="status"
    aria-live="polite"
  >
    <div className="newsroom-event-state__card">
      <h1>Memuat event…</h1>
      <p>Menyiapkan detail event untuk Anda.</p>
    </div>
  </div>
);

type EventNotFoundStateProps = Readonly<{
  title: string;
  description: string;
}>;

const EventNotFoundState = ({
  title,
  description,
}: EventNotFoundStateProps) => {
  const handleBack = () => {
    navigateToRoute(EVENTS_ROUTE);
  };

  return (
    <div
      className="newsroom-event-state"
      role="alert"
      aria-live="polite"
    >
      <div
        className="newsroom-event-state__card"
        data-event-reveal
      >
        <h1>{title}</h1>
        <p>{description}</p>

        <button
          type="button"
          className="newsroom-event-back"
          onClick={handleBack}
        >
          <CalendarDays size={16} aria-hidden="true" />
          Kembali ke daftar event
        </button>
      </div>
    </div>
  );
};

type EventSuccessStateProps = Readonly<{
  eventTitle: string;
}>;

const EventSuccessState = ({
  eventTitle,
}: EventSuccessStateProps) => {
  const handleBack = () => {
    navigateToRoute(EVENTS_ROUTE);
  };

  return (
    <div
      className="newsroom-event-state"
      role="status"
      aria-live="polite"
    >
      <div
        className="newsroom-event-state__card"
        data-event-reveal
      >
        <div className="newsroom-event-state__icon">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>

        <h1>Pendaftaran Berhasil!</h1>

        <p>
          Anda telah terdaftar di event{" "}
          <strong>{eventTitle}</strong>. Konfirmasi telah
          diproses oleh sistem.
        </p>

        <button
          type="button"
          className="newsroom-event-back"
          onClick={handleBack}
        >
          <CalendarDays size={16} aria-hidden="true" />
          Kembali ke daftar event
        </button>
      </div>
    </div>
  );
};

const EventDetail = ({ eventId }: EventDetailProps) => {
  const { events: cachedEvents } = useNewsroomDatabase();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] =
    useState<PublicEventRecord | null>(null);

  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("detail");

  const [registrationId, setRegistrationId] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setNotFound(false);
      setEvent(null);
      setRegistrationStep("detail");
      setRegistrationId(null);

      try {
        const result = await getPublicEventById(eventId);

        if (!isActive) return;

        setEvent(result);
      } catch (error: unknown) {
        if (!isActive) return;

        const status = (
          error as { status?: number } | null
        )?.status;

        setEvent(null);
        setNotFound(status === 404);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [eventId]);

  useEffect(() => {
    if (isLoading) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".newsroom-event-detail [data-event-reveal]",
      ),
    );

    if (!targets.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach((target) => {
        target.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8%",
      },
    );

    targets.forEach((target) => {
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, [event, isLoading, notFound, registrationStep]);

  const handleBackToEvents = () => {
    navigateToRoute(EVENTS_ROUTE);
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      const redirectRoute = getLoginRedirectRoute(
        window.location.pathname,
      );

      navigateToRoute(redirectRoute);
      return;
    }

    setRegistrationStep("register");
  };

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>

        <NewsroomLayout>
          <div className="newsroom-event-detail">
            <EventLoadingState />
          </div>
        </NewsroomLayout>
      </>
    );
  }

  if (!event || notFound) {
    const fallback = cachedEvents.find(
      (item) => item.id === eventId,
    );

    const title = fallback?.title ?? "Event tidak ditemukan";

    const description = fallback
      ? "Detail lengkap event belum tersedia. Kembali ke daftar event untuk melihat agenda lainnya."
      : "Event yang Anda cari tidak ditemukan atau sudah tidak dipublikasikan.";

    return (
      <>
        <style>{styles}</style>

        <NewsroomLayout>
          <div className="newsroom-event-detail">
            <EventNotFoundState
              title={title}
              description={description}
            />
          </div>
        </NewsroomLayout>
      </>
    );
  }

  if (registrationStep === "register") {
    return (
      <>
        <style>{styles}</style>

        <NewsroomLayout>
          <div className="newsroom-event-detail">
            <EventRegistration
              eventId={event.id}
              eventTitle={event.title}
              eventDate={event.event_date}
              eventLocation={event.location}
              eventAccessType={event.access_type}
              eventPrice={event.price}
              onBack={() => {
                setRegistrationStep("detail");
              }}
              onSuccess={(regId) => {
                setRegistrationId(regId);

                if (event.access_type === "FREE") {
                  setRegistrationStep("success");
                } else {
                  setRegistrationStep("payment");
                }
              }}
            />
          </div>
        </NewsroomLayout>
      </>
    );
  }

  if (registrationStep === "payment") {
    if (!registrationId) {
      setRegistrationStep("register");

      return null;
    }

    return (
      <>
        <style>{styles}</style>

        <NewsroomLayout>
          <div className="newsroom-event-detail">
            <EventPayment
              eventId={event.id}
              registrationId={registrationId}
              eventTitle={event.title}
              eventPrice={event.price}
              onBack={() => {
                setRegistrationStep("register");
              }}
              onSuccess={() => {
                setRegistrationStep("success");
              }}
            />
          </div>
        </NewsroomLayout>
      </>
    );
  }

  if (registrationStep === "success") {
    return (
      <>
        <style>{styles}</style>

        <NewsroomLayout>
          <div className="newsroom-event-detail">
            <EventSuccessState eventTitle={event.title} />
          </div>
        </NewsroomLayout>
      </>
    );
  }

  const paragraphs = splitDescription(event.description);

  const isFree =
    String(event.access_type ?? "").toUpperCase() === "FREE";

  const quotaLabel =
    typeof event.quota === "number" && event.quota > 0
      ? `${event.quota} peserta`
      : "Tanpa batas";

  const imageSource = event.image?.trim();

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="newsroom-event-detail">
          <header className="newsroom-event-hero">
            {imageSource ? (
              <img
                className="newsroom-event-hero__image"
                src={imageSource}
                alt=""
                aria-hidden="true"
                decoding="async"
                fetchPriority="high"
                onError={handleNewsroomImageError}
              />
            ) : null}

            <div className="newsroom-event-hero__inner">
              <div className="newsroom-event-hero__content">
                <div className="newsroom-event-hero__meta">
                  {event.category ? (
                    <span className="newsroom-event-hero__category">
                      {event.category}
                    </span>
                  ) : null}

                  <span
                    className={`newsroom-event-hero__access ${
                      isFree ? "is-free" : "is-paid"
                    }`}
                  >
                    {isFree ? "GRATIS" : "BERBAYAR"}
                  </span>

                  {event.is_featured ? (
                    <>
                      <span
                        className="newsroom-event-hero__dot"
                        aria-hidden="true"
                      />
                      <span>Event Unggulan</span>
                    </>
                  ) : null}
                </div>

                <h1 className="newsroom-event-hero__title">
                  {event.title}
                </h1>

                <div className="newsroom-event-hero__subline">
                  {event.event_date ? (
                    <span>
                      <CalendarDays
                        size={15}
                        aria-hidden="true"
                      />
                      {formatLongDate(event.event_date)}
                    </span>
                  ) : null}

                  {event.event_time ? (
                    <span>
                      <Clock
                        size={15}
                        aria-hidden="true"
                      />
                      {event.event_time}
                    </span>
                  ) : null}

                  {event.location ? (
                    <span>
                      <MapPin
                        size={15}
                        aria-hidden="true"
                      />
                      {event.location}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="newsroom-event-content">
            <div className="newsroom-event-content__grid">
              <section
                className="newsroom-event-content__main"
                aria-labelledby="event-description-title"
              >
                <h2
                  id="event-description-title"
                  className="newsroom-event-section-heading"
                  data-event-reveal
                >
                  Tentang Event
                </h2>

                {paragraphs.length > 0 ? (
                  <div
                    className="newsroom-event-description"
                    data-event-reveal
                  >
                    {paragraphs.map((paragraph, index) => (
                      <p key={`${event.id}-paragraph-${index}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p
                    className="newsroom-event-description"
                    data-event-reveal
                  >
                    Deskripsi lengkap event akan segera
                    diperbarui oleh tim Mahreen Indonesia.
                  </p>
                )}
              </section>

              <aside className="newsroom-event-content__aside">
                <div className="newsroom-event-content__aside-inner">
                  <section
                    className="newsroom-event-card"
                    aria-labelledby="event-info-title"
                    data-event-reveal
                  >
                    <div
                      id="event-info-title"
                      className="newsroom-event-card__header"
                    >
                      Informasi Event
                    </div>

                    <div className="newsroom-event-card__body">
                      <div className="newsroom-event-info-row">
                        <CalendarDays
                          size={16}
                          aria-hidden="true"
                        />

                        <div>
                          <strong>Tanggal</strong>
                          <span>
                            {formatShortDate(
                              event.event_date,
                            )}
                          </span>
                        </div>
                      </div>

                      {event.event_time ? (
                        <div className="newsroom-event-info-row">
                          <Clock
                            size={16}
                            aria-hidden="true"
                          />

                          <div>
                            <strong>Waktu</strong>
                            <span>
                              {event.event_time}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {event.location ? (
                        <div className="newsroom-event-info-row">
                          <MapPin
                            size={16}
                            aria-hidden="true"
                          />

                          <div>
                            <strong>Lokasi</strong>
                            <span>
                              {event.location}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div className="newsroom-event-info-row">
                        <Ticket
                          size={16}
                          aria-hidden="true"
                        />

                        <div>
                          <strong>Akses</strong>
                          <span>
                            {isFree
                              ? "Gratis untuk umum"
                              : "Berbayar"}
                          </span>
                        </div>
                      </div>

                      <div className="newsroom-event-info-row">
                        <Users
                          size={16}
                          aria-hidden="true"
                        />

                        <div>
                          <strong>Kuota</strong>
                          <span>{quotaLabel}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="newsroom-event-card__cta"
                        onClick={handleRegisterClick}
                      >
                        <Ticket
                          size={15}
                          aria-hidden="true"
                        />

                        {isFree
                          ? "Daftar Event"
                          : "Daftar & Bayar"}
                      </button>
                    </div>
                  </section>

                  <button
                    type="button"
                    className="newsroom-event-back"
                    onClick={handleBackToEvents}
                    data-event-reveal
                  >
                    <CalendarDays
                      size={16}
                      aria-hidden="true"
                    />
                    Lihat semua event
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default EventDetail;