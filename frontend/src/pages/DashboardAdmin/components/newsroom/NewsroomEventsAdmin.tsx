import {
  CalendarDays,
  Cloud,
  Download,
  Eye,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  eventsAdminService,
  type AdminEventRecord,
  type AdminEventStats,
  type EventStatus,
} from "../../../../services/newsroom/eventsAdminService";
import { newsroomService } from "../../../../services/newsroom/newsroomService";
import NewsroomEventDeleteDialog from "./NewsroomEventDeleteDialog";
import NewsroomEventEditor, {
  type EventEditorSubmission,
} from "./NewsroomEventEditor";
import NewsroomMetricCard from "./NewsroomMetricCard";

type NewsroomEventsAdminProps = Readonly<{
  onLocalAction: (message: string) => void;
  onViewChange: (view: "articles" | "tags" | "events") => void;
  query: string;
}>;

type EventTab = "all" | "published" | "draft";

const eventsAdminStyles = `
  .admin-newsroom-switcher {
    display: inline-flex;
    margin-bottom: 22px;
    padding: 4px;
    gap: 3px;
    border: 1px solid rgba(239, 199, 63, 0.18);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.018);
  }
  .admin-newsroom-switcher button {
    min-height: 36px;
    padding: 7px 16px;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #8f8a80;
    background: transparent;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }
  .admin-newsroom-switcher button:hover { color: #e7d594; }
  .admin-newsroom-switcher button.is-active {
    border-color: rgba(239, 199, 63, 0.4);
    color: #17140b;
    background: linear-gradient(135deg, #f5d35b, #e9ba37);
    box-shadow: 0 6px 16px rgba(226, 179, 47, 0.18);
  }

  .admin-events-panel {
    display: flex;
    min-height: 72px;
    padding: 19px 22px;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border-bottom: 1px solid rgba(240, 200, 70, 0.16);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.018),
      transparent
    );
  }

  .admin-events-panel h2 {
    margin: 0;
    color: #ece9e3;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .admin-events-panel > div {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .admin-events-list {
    display: grid;
    padding: 21px 22px 10px;
    gap: 13px;
  }

  .admin-event-row {
    display: grid;
    min-height: 82px;
    padding: 12px 11px;
    grid-template-columns: 60px minmax(0, 1fr) auto auto 30px;
    align-items: center;
    gap: 15px;
    border: 1px solid rgba(240, 200, 70, 0.16);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.008);
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;
  }

  .admin-event-row:hover {
    border-color: rgba(240, 200, 70, 0.32);
    background: rgba(240, 200, 70, 0.025);
    transform: translateX(2px);
  }

  .admin-event-row__thumb {
    display: grid;
    width: 60px;
    height: 60px;
    overflow: hidden;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    background: #22211e;
  }

  .admin-event-row__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.74) contrast(1.06);
  }

  .admin-event-row__thumb svg {
    color: #5c584f;
  }

  .admin-event-row__copy {
    display: grid;
    min-width: 0;
    gap: 5px;
  }

  .admin-event-row__copy > strong {
    overflow: hidden;
    color: #e8e5df;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .admin-event-row__meta {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    color: #8a857b;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 8px;
    letter-spacing: 0.03em;
  }

  .admin-event-row__meta > span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .admin-event-row__meta svg {
    color: #b7a45f;
  }

  .admin-event-row__date {
    display: grid;
    gap: 3px;
    color: #c5c0b7;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 9px;
    letter-spacing: 0.04em;
    text-align: right;
    white-space: nowrap;
  }

  .admin-event-row__date strong {
    color: #e4c345;
    font-size: 10px;
    font-weight: 600;
  }

  .admin-event-badge {
    display: inline-flex;
    min-height: 25px;
    padding: 5px 9px;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid rgba(240, 200, 70, 0.2);
    border-radius: 999px;
    color: #dfc258;
    background: rgba(240, 200, 70, 0.075);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .admin-event-badge--draft {
    color: #8e8a80;
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.035);
  }

  .admin-event-badge--published {
    color: #8bd29d;
    border-color: rgba(76, 181, 105, 0.2);
    background: rgba(76, 181, 105, 0.08);
  }

  .admin-event-badge--free {
    color: #e4c345;
    border-color: rgba(240, 200, 70, 0.22);
    background: rgba(240, 200, 70, 0.06);
  }

  .admin-event-badge--paid {
    color: #ef9a8e;
    border-color: rgba(211, 76, 57, 0.24);
    background: rgba(211, 76, 57, 0.07);
  }

  .admin-event-badge--featured {
    color: #f0c846;
    border-color: rgba(240, 200, 70, 0.42);
    background: rgba(240, 200, 70, 0.12);
  }

  .admin-event-row__actions {
    position: relative;
    z-index: 7;
    width: 30px;
    justify-self: end;
  }

  .admin-event-row__actions > button {
    display: grid;
    width: 30px;
    height: 34px;
    place-items: center;
    border: 0;
    border-radius: 3px;
    color: #a29c90;
    background: transparent;
    cursor: pointer;
    transition:
      color 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;
  }

  .admin-event-row__actions > button:hover,
  .admin-event-row__actions > button[aria-expanded="true"] {
    color: #f0c846;
    background: rgba(240, 200, 70, 0.08);
    transform: scale(1.06);
  }

  .admin-event-row__menu {
    position: absolute;
    z-index: 30;
    top: calc(100% + 7px);
    right: 0;
    display: grid;
    width: 158px;
    padding: 6px;
    gap: 3px;
    border: 1px solid rgba(239, 199, 63, 0.24);
    border-radius: 7px;
    background: rgba(15, 15, 14, 0.98);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(18px);
    transform-origin: top right;
    animation: admin-event-menu-in 180ms
      cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .admin-event-row__menu button {
    display: flex;
    min-height: 38px;
    padding: 8px 10px;
    align-items: center;
    gap: 9px;
    border: 0;
    border-radius: 4px;
    color: #d6d1c8;
    background: transparent;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    text-align: left;
    transition:
      color 160ms ease,
      background-color 160ms ease,
      transform 160ms ease;
  }

  .admin-event-row__menu button:hover {
    color: #f3d166;
    background: rgba(239, 199, 63, 0.08);
    transform: translateX(2px);
  }

  .admin-event-row__menu button:last-child {
    color: #e89a8f;
  }

  .admin-event-row__menu button:last-child:hover {
    color: #ffb0a4;
    background: rgba(211, 76, 57, 0.1);
  }

  @keyframes admin-event-menu-in {
    from {
      opacity: 0;
      transform: translateY(-5px) scale(0.94);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 900px) {
    .admin-event-row {
      grid-template-columns: 52px minmax(0, 1fr) auto 30px;
    }

    .admin-event-row__date {
      display: none;
    }
  }

  @media (max-width: 700px) {
    .admin-event-row {
      grid-template-columns: 52px minmax(0, 1fr) 30px;
    }

    .admin-event-row__badges {
      display: none !important;
    }

    .admin-events-panel {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

const formatEventDay = (value: string) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
};

const getEventAge = (createdAt?: string) => {
  if (!createdAt) {
    return "saved locally";
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "saved locally";
  }

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / 60_000),
  );

  if (elapsedMinutes < 1) {
    return "just now";
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours} hours ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  return `${elapsedDays} days ago`;
};

const NewsroomEventsAdmin = ({
  onLocalAction,
  onViewChange,
  query,
}: NewsroomEventsAdminProps) => {
  const [activeTab, setActiveTab] = useState<EventTab>("all");
  const [events, setEvents] = useState<AdminEventRecord[]>([]);
  const [stats, setStats] = useState<AdminEventStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingEvent, setEditingEvent] =
    useState<AdminEventRecord | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<AdminEventRecord | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [togglingEventId, setTogglingEventId] = useState<string | null>(null);

  const loadEvents = useCallback(
    async (showLoading = false) => {
      try {
        const [eventResult, statsResult] = await Promise.all([
          eventsAdminService.list({
            limit: 100,
          }),
          eventsAdminService.stats(),
        ]);

        setEvents(eventResult.items);
        setStats(statsResult);
      } catch {
        onLocalAction(
          "Newsroom: gagal memuat data event. Periksa koneksi server.",
        );
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [onLocalAction],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async
    void loadEvents(true);
  }, [loadEvents]);

  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-event-menu]")
      ) {
        return;
      }

      setActiveMenuId(null);
    };

    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("pointerdown", closeMenu);
    window.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      window.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesTab =
        activeTab === "all" || event.status === activeTab;

      const matchesQuery =
        !normalizedQuery ||
        [
          event.title,
          event.category,
          event.location,
          event.status,
          event.access_type,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedQuery),
        );

      return matchesTab && matchesQuery;
    });
  }, [activeTab, events, query]);

  const refreshAfterMutation = useCallback(() => {
    void loadEvents(false);
    void newsroomService.hydrateAdmin().catch(() => undefined);
  }, [loadEvents]);

  const saveEvent = async (submission: EventEditorSubmission) => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      if (editingEvent) {
        await eventsAdminService.update(editingEvent.id, {
          ...submission.payload,
          status: submission.status,
        });
      } else {
        await eventsAdminService.create(submission.payload);
      }

      const wasEditing = Boolean(editingEvent);

      setComposerOpen(false);
      setEditingEvent(null);

      refreshAfterMutation();

      onLocalAction(
        submission.status === "published"
          ? `Newsroom: event berhasil ${
              wasEditing ? "diperbarui" : "dibuat"
            } dan dipublikasikan.`
          : `Newsroom: event berhasil ${
              wasEditing ? "diperbarui" : "disimpan"
            } sebagai draft.`,
      );
    } catch (error) {
      const status = (error as { status?: number } | null)?.status;
      const message = (error as { message?: string } | null)?.message;

      onLocalAction(
        status === 401
          ? "Newsroom: sesi admin sudah berakhir. Silakan masuk kembali lalu simpan ulang."
          : message
            ? `Newsroom: gagal menyimpan event. ${message}`
            : "Newsroom: event belum dapat disimpan. Silakan coba kembali.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (event: AdminEventRecord) => {
    if (togglingEventId) return;

    setTogglingEventId(event.id);
    setActiveMenuId(null);

    const nextStatus: EventStatus =
      event.status === "published" ? "draft" : "published";

    try {
      await eventsAdminService.updateStatus(event.id, nextStatus);

      refreshAfterMutation();

      onLocalAction(
        nextStatus === "published"
          ? `Newsroom: event "${event.title}" dipublikasikan.`
          : `Newsroom: event "${event.title}" diubah menjadi draft.`,
      );
    } catch {
      onLocalAction(
        "Newsroom: gagal mengubah status event. Silakan coba kembali.",
      );
    } finally {
      setTogglingEventId(null);
    }
  };

  const deleteEvent = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);

    try {
      await eventsAdminService.remove(deleteTarget.id);

      setDeleteTarget(null);
      refreshAfterMutation();

      onLocalAction(
        "Newsroom: event dihapus dari admin dan halaman Event publik.",
      );
    } catch {
      onLocalAction(
        "Newsroom: event belum dapat dihapus. Silakan coba kembali.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateEvent = () => {
    setActiveMenuId(null);
    setEditingEvent(null);
    setComposerOpen(true);
  };

  const openEditEvent = (event: AdminEventRecord) => {
    setActiveMenuId(null);
    setEditingEvent(event);
    setComposerOpen(true);
  };

  const closeComposer = () => {
    if (isSaving) return;

    setComposerOpen(false);
    setEditingEvent(null);
  };

  const exportReport = () => {
    const escapeCell = (value: string) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;

    const rows = [
      [
        "Title",
        "Category",
        "Date",
        "Time",
        "Location",
        "Access",
        "Status",
        "Featured",
      ],
      ...events.map((event) => [
        event.title,
        event.category,
        event.event_date,
        event.event_time,
        event.location,
        event.access_type,
        event.status,
        event.is_featured ? "Yes" : "No",
      ]),
    ];

    const csv = rows
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "mahreen-events-report.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    onLocalAction("Laporan event berhasil diekspor.");
  };

  if (composerOpen) {
    return (
      <NewsroomEventEditor
        key={editingEvent?.id ?? "new-event"}
        initialValue={editingEvent ?? undefined}
        mode={editingEvent ? "edit" : "create"}
        onBack={closeComposer}
        onLocalAction={onLocalAction}
        isSubmitting={isSaving}
        onSubmit={(submission) => {
          void saveEvent(submission);
        }}
      />
    );
  }

  return (
    <section className="admin-newsroom-view">
      <style data-component="admin-newsroom-events">
        {eventsAdminStyles}
      </style>

      <div className="admin-newsroom-switcher" role="tablist" aria-label="Pilih konten newsroom">
        <button
          type="button"
          role="tab"
          aria-selected={false}
          onClick={() => onViewChange("articles")}
        >
          Articles
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={false}
          onClick={() => onViewChange("tags")}
        >
          Tags
        </button>
        <button
          className="is-active"
          type="button"
          role="tab"
          aria-selected={true}
        >
          Events
        </button>
      </div>

      <header className="admin-newsroom-heading admin-animate">
        <div>
          <h1>Events Intelligence</h1>

          <p>
            Manage events, schedules, and publication status.
          </p>

          <span className="admin-newsroom-sync-badge">
            <span />
            <Cloud size={12} />
            api sync
          </span>
        </div>

        <div>
          <button
            className="admin-newsroom-export"
            type="button"
            onClick={exportReport}
          >
            <Download size={15} />
            Export Report
          </button>

          <button
            className="admin-newsroom-create"
            type="button"
            onClick={openCreateEvent}
          >
            <Plus size={16} />
            Create Event
          </button>
        </div>
      </header>

      <section
        className="admin-newsroom-metrics"
        aria-label="Event metrics"
      >
        <NewsroomMetricCard
          context={`${stats?.published ?? 0} published`}
          icon={<CalendarDays size={19} />}
          label="Total Events"
          value={String(stats?.total ?? events.length)}
        />

        <NewsroomMetricCard
          context={`${stats?.draft ?? 0} in draft`}
          icon={<Eye size={19} />}
          label="Published Events"
          value={String(stats?.published ?? 0)}
        />

        <NewsroomMetricCard
          context={`${stats?.freeCount ?? 0} free · ${
            stats?.paidCount ?? 0
          } paid`}
          icon={<Star size={19} />}
          label="Featured Events"
          value={String(stats?.featuredCount ?? 0)}
        />
      </section>

      <article className="admin-newsroom-panel admin-animate">
        <header className="admin-events-panel">
          <h2>Event Directory</h2>

          <div
            className="admin-newsroom-tabs"
            role="tablist"
            aria-label="Filter event"
          >
            <button
              className={activeTab === "all" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All events
            </button>

            <button
              className={activeTab === "published" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTab === "published"}
              onClick={() => setActiveTab("published")}
            >
              Published
            </button>

            <button
              className={activeTab === "draft" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTab === "draft"}
              onClick={() => setActiveTab("draft")}
            >
              Drafts
            </button>
          </div>
        </header>

        <div className="admin-events-list">
          {isLoading ? (
            <div className="admin-newsroom-empty">
              Memuat data event...
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const isMenuOpen = activeMenuId === event.id;
              const isToggling = togglingEventId === event.id;

              return (
                <article
                  className="admin-event-row"
                  key={event.id}
                >
                  <span
                    className="admin-event-row__thumb"
                    aria-hidden="true"
                  >
                    {event.image ? (
                      <img
                        src={event.image}
                        alt=""
                        loading="lazy"
                        width="60"
                        height="60"
                      />
                    ) : (
                      <CalendarDays size={20} />
                    )}
                  </span>

                  <div className="admin-event-row__copy">
                    <strong title={event.title}>
                      {event.title}
                    </strong>

                    <div className="admin-event-row__meta">
                      {event.category ? (
                        <span>{event.category}</span>
                      ) : null}

                      {event.location ? (
                        <span>
                          <MapPin size={10} />
                          {event.location}
                        </span>
                      ) : null}

                      {event.event_time ? (
                        <span>{event.event_time}</span>
                      ) : null}

                      <span>
                        Added {getEventAge(event.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="admin-event-row__date">
                    <span>Schedule</span>
                    <strong>
                      {formatEventDay(event.event_date)}
                    </strong>
                  </div>

                  <div
                    className="admin-event-row__badges"
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    <span
                      className={`admin-event-badge admin-event-badge--${String(
                        event.access_type ?? "",
                      ).toLowerCase()}`}
                    >
                      {event.access_type}
                    </span>

                    {event.is_featured ? (
                      <span className="admin-event-badge admin-event-badge--featured">
                        <Star size={8} />
                        Featured
                      </span>
                    ) : null}

                    <span
                      className={`admin-event-badge admin-event-badge--${event.status}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div
                    className="admin-event-row__actions"
                    data-event-menu
                  >
                    <button
                      type="button"
                      aria-label={`Buka aksi untuk ${event.title}`}
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      disabled={isToggling}
                      onClick={() =>
                        setActiveMenuId((current) =>
                          current === event.id
                            ? null
                            : event.id,
                        )
                      }
                    >
                      <MoreVertical
                        size={17}
                        aria-hidden="true"
                      />
                    </button>

                    {isMenuOpen ? (
                      <div
                        className="admin-event-row__menu"
                        role="menu"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => openEditEvent(event)}
                        >
                          <Pencil size={14} />
                          Edit event
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          disabled={isToggling}
                          onClick={() => {
                            void toggleStatus(event);
                          }}
                        >
                          <Eye size={14} />
                          {isToggling
                            ? "Updating..."
                            : event.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeleteTarget(event);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete event
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="admin-newsroom-empty">
              Tidak ada event yang cocok dengan pencarian
              atau filter tersebut.
            </div>
          )}
        </div>
      </article>

      {deleteTarget ? (
        <NewsroomEventDeleteDialog
          isDeleting={isDeleting}
          onCancel={() => {
            if (!isDeleting) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={() => {
            void deleteEvent();
          }}
          title={deleteTarget.title}
        />
      ) : null}
    </section>
  );
};

export default NewsroomEventsAdmin;