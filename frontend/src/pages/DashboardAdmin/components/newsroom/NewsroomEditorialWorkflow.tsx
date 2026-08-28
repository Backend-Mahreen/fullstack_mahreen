import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { NewsroomPost } from "./newsroomAdminData";

type NewsroomEditorialWorkflowProps = Readonly<{
  activeTab: "all" | "drafts";
  onTabChange: (tab: "all" | "drafts") => void;
  onDelete: (post: NewsroomPost) => void;
  onEdit: (post: NewsroomPost) => void;
  posts: readonly NewsroomPost[];
  query: string;
}>;

const statusClassName = (status: NewsroomPost["status"]) =>
  status.toLowerCase().replace(/\s+/g, "-");

const editorialSyncStyles = `
  .admin-editorial-workflow { overflow: visible; }
  .admin-editorial-item.is-synced {
    position: relative;
    border-color: rgba(239, 199, 63, 0.28);
    animation: admin-editorial-sync-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .admin-editorial-item.has-open-menu { z-index: 20; }
  .admin-editorial-item.is-synced::before {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 0;
    width: 2px;
    border-radius: 99px;
    content: "";
    background: #efc73f;
    box-shadow: 0 0 12px rgba(239, 199, 63, 0.42);
  }
  .admin-editorial-menu {
    position: relative;
    z-index: 7;
    width: 30px;
    justify-self: end;
  }
  .admin-editorial-menu__trigger {
    display: grid;
    width: 30px;
    height: 34px;
    place-items: center;
    border: 0;
    border-radius: 4px;
    color: #a29c90;
    background: transparent;
    cursor: pointer;
    transition: color 180ms ease, background-color 180ms ease, transform 180ms ease;
  }
  .admin-editorial-menu__trigger:hover,
  .admin-editorial-menu__trigger[aria-expanded="true"] {
    color: #f0c846;
    background: rgba(240, 200, 70, 0.08);
    transform: scale(1.06);
  }
  .admin-editorial-menu__popover {
    position: absolute;
    z-index: 30;
    top: calc(100% + 7px);
    right: 0;
    display: grid;
    width: 148px;
    padding: 6px;
    gap: 3px;
    border: 1px solid rgba(239, 199, 63, 0.24);
    border-radius: 7px;
    background: rgba(15, 15, 14, 0.98);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(18px);
    transform-origin: top right;
    animation: admin-editorial-menu-in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .admin-editorial-menu__popover button {
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
    transition: color 160ms ease, background-color 160ms ease, transform 160ms ease;
  }
  .admin-editorial-menu__popover button:hover {
    color: #f3d166;
    background: rgba(239, 199, 63, 0.08);
    transform: translateX(2px);
  }
  .admin-editorial-menu__popover button:last-child { color: #e89a8f; }
  .admin-editorial-menu__popover button:last-child:hover {
    color: #ffb0a4;
    background: rgba(211, 76, 57, 0.1);
  }
  @keyframes admin-editorial-menu-in {
    from { opacity: 0; transform: translateY(-5px) scale(0.94); }
    to { opacity: 1; transform: none; }
  }
  @keyframes admin-editorial-sync-in {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: none; }
  }
  @media (max-width: 700px) {
    .admin-editorial-menu { grid-column: 3; grid-row: 1 / 3; }
  }
`;

const NewsroomEditorialWorkflow = ({
  activeTab,
  onTabChange,
  onDelete,
  onEdit,
  posts,
  query,
}: NewsroomEditorialWorkflowProps) => {
  const [showAll, setShowAll] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-editorial-menu]")) return;
      setActiveMenuId(null);
    };
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMenuId(null);
    };
    document.addEventListener("pointerdown", closeMenu);
    window.addEventListener("keydown", closeMenuOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      window.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTab = activeTab === "all" || post.status === "Draft";
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.author, post.category, post.status].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      return matchesTab && matchesQuery;
    });
  }, [activeTab, posts, query]);

  const visiblePosts = showAll ? filteredPosts : filteredPosts.slice(0, 3);

  return (
    <article className="admin-newsroom-panel admin-editorial-workflow admin-animate">
      <style data-component="admin-editorial-sync">{editorialSyncStyles}</style>
      <header className="admin-newsroom-panel__header">
        <h2>Editorial Workflow</h2>
        <div className="admin-newsroom-tabs" role="tablist" aria-label="Filter editorial">
          <button
            className={activeTab === "all" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => onTabChange("all")}
          >
            All posts
          </button>
          <button
            className={activeTab === "drafts" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "drafts"}
            onClick={() => onTabChange("drafts")}
          >
            Drafts
          </button>
        </div>
      </header>

      <div className="admin-editorial-list">
        {visiblePosts.length ? visiblePosts.map((post) => (
          <article className={`admin-editorial-item${post.isSynced ? " is-synced" : ""}${activeMenuId === post.id ? " has-open-menu" : ""}`} key={post.id}>
            {post.image ? (
              <img src={post.image} alt="" width="52" height="52" loading="lazy" />
            ) : (
              <span className="admin-editorial-item__thumb-fallback" aria-hidden="true" />
            )}
            <div className="admin-editorial-item__copy">
              <strong>{post.title}</strong>
              <span>By {post.author}{post.coAuthor ? ` & ${post.coAuthor}` : ""} · {post.age}</span>
              {post.tags ? (
                <span style={{ color: "#b7a45f", fontSize: 10 }}>
                  {post.tags.split(",").slice(0, 3).map((t) => `#${t.trim()}`).join("  ")}
                  {post.tags.split(",").length > 3 ? " ..." : ""}
                </span>
              ) : null}
            </div>
            <span className={`admin-editorial-status admin-editorial-status--${statusClassName(post.status)}`}>
              {post.status}
            </span>
            <div className="admin-editorial-menu" data-editorial-menu>
              <button
                className="admin-editorial-menu__trigger"
                type="button"
                aria-label={`Buka aksi untuk ${post.title}`}
                aria-haspopup="menu"
                aria-expanded={activeMenuId === post.id}
                onClick={() => setActiveMenuId((current) => current === post.id ? null : post.id)}
              >
                <MoreVertical size={17} aria-hidden="true" />
              </button>
              {activeMenuId === post.id ? (
                <div className="admin-editorial-menu__popover" role="menu">
                  <button type="button" role="menuitem" onClick={() => { setActiveMenuId(null); onEdit(post); }}>
                    <Pencil size={14} /> Edit article
                  </button>
                  <button type="button" role="menuitem" onClick={() => { setActiveMenuId(null); onDelete(post); }}>
                    <Trash2 size={14} /> Delete article
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        )) : (
          <div className="admin-newsroom-empty">Tidak ada artikel yang cocok dengan pencarian.</div>
        )}
      </div>

      {filteredPosts.length > 3 ? (
        <button className="admin-newsroom-view-all" type="button" onClick={() => setShowAll((current) => !current)}>
          {showAll ? "Show fewer submissions" : "View all submissions"}
        </button>
      ) : null}
    </article>
  );
};

export default NewsroomEditorialWorkflow;
