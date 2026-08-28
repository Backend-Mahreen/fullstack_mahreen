import { Cloud, Download, Eye, FileText, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { NewsroomArticleRecord } from "../../../../data/newsroomLocalDatabase";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";
import { newsroomService } from "../../../../services/newsroom/newsroomService";
import NewsroomActivityStream from "./NewsroomActivityStream";
import NewsroomDeleteDialog from "./NewsroomDeleteDialog";
import NewsroomEditorialWorkflow from "./NewsroomEditorialWorkflow";
import NewsroomEventsAdmin from "./NewsroomEventsAdmin";
import NewsroomTagsAdmin from "./NewsroomTagsAdmin";
import NewsroomWebinarsAdmin from "./NewsroomWebinarsAdmin";
import NewsroomMetricCard from "./NewsroomMetricCard";
import NewsroomTrendingTopics from "./NewsroomTrendingTopics";
import NewsroomArticleEditor, { type ArticleEditorSubmission } from "./editor/NewsroomArticleEditor";
import { mapArticleToEditorData, mapEditorSubmissionToArticle } from "./editor/articleEditorMapper";
import {
  newsroomDefaultImage,
  type NewsroomPost,
} from "./newsroomAdminData";

type NewsroomAdminProps = Readonly<{
  onLocalAction: (message: string) => void;
  query: string;
}>;

const newsroomAdminSwitcherStyles = `
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
`;

const newsroomAdminSyncStyles = `
  .admin-newsroom-sync-badge {
    display: inline-flex;
    min-height: 26px;
    margin-top: 9px;
    padding: 5px 10px;
    align-items: center;
    gap: 7px;
    border: 1px solid rgba(239, 199, 63, 0.26);
    border-radius: 999px;
    color: #e5c65b;
    background: rgba(239, 199, 63, 0.07);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .admin-newsroom-sync-badge > span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7dce8e;
    box-shadow: 0 0 10px rgba(91, 207, 116, 0.65);
    animation: admin-newsroom-sync-live 1.8s ease-in-out infinite;
  }
  @keyframes admin-newsroom-sync-live {
    0%, 100% { opacity: 0.55; transform: scale(0.82); }
    50% { opacity: 1; transform: scale(1.18); }
  }
`;



const getRelativeAge = (createdAt?: string) => {
  if (!createdAt) return "saved locally";
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000),
  );
  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  return `${Math.floor(elapsedMinutes / 60)} hours ago`;
};

const NewsroomAdmin = ({ onLocalAction, query }: NewsroomAdminProps) => {
  const database = useNewsroomDatabase(true);
  const [viewMode, setViewMode] = useState<"articles" | "tags" | "events" | "webinars">("articles");
  const isArticlesView = viewMode === "articles";
  const isTagsView = viewMode === "tags";
  const isEventsView = viewMode === "events";
  const isWebinarsView = viewMode === "webinars";
  const [activeTab, setActiveTab] = useState<"all" | "drafts">("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsroomArticleRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsroomPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const posts = useMemo<NewsroomPost[]>(() => {
    return [...database.articles]
      .sort(
        (first, second) =>
          new Date(second.updatedAt || second.createdAt || second.publishedAt || 0).getTime() -
          new Date(first.updatedAt || first.createdAt || first.publishedAt || 0).getTime(),
      )
      .map((article) => ({
        id: `NWS-${article.id}`,
        articleId: article.id,
        slug: article.slug,
        title: article.title,
        author: article.author,
        coAuthor: article.coAuthor || "",
        tags: article.tags || "",
        age: getRelativeAge(article.updatedAt ?? article.createdAt),
        category: article.category,
        image: article.thumbnail || article.image,
        status: article.publicationStatus ?? "Published",
        viewCount: article.viewCount ?? 0,
        isSynced: article.source === "admin" || article.source === "api",
      }));
  }, [database.articles]);
  const totalArticles = database.articles.length;
  const publishedArticles = database.articles.filter(
    (article) => article.publicationStatus === undefined || article.publicationStatus === "Published",
  ).length;
  const totalViews = database.articles.reduce(
    (total, article) => total + (article.viewCount ?? 0),
    0,
  );
  const viewedArticles = database.articles.filter((article) => (article.viewCount ?? 0) > 0).length;

  const saveArticle = async (submission: ArticleEditorSubmission) => {
    setIsSaving(true);
    try {
      const record = mapEditorSubmissionToArticle(
        submission,
        newsroomDefaultImage,
        editingArticle,
      );
      await newsroomService.saveArticle(record);
      setActiveTab("all");
      setComposerOpen(false);
      const wasEditing = Boolean(editingArticle);
      setEditingArticle(null);
      onLocalAction(
        submission.status === "Published"
          ? `Newsroom: artikel berhasil ${wasEditing ? "diperbarui" : "dipublikasikan"} dan langsung sinkron ke menu pengguna.`
          : submission.status === "Scheduled"
            ? "Newsroom: perubahan artikel terjadwal berhasil disimpan lokal."
            : "Newsroom: perubahan draft berhasil disimpan lokal dan belum terlihat oleh pengguna.",
      );
    } catch (error) {
      const status = (error as { status?: number })?.status;
      const message = (error as { message?: string })?.message;
      onLocalAction(
        status === 401
          ? "Newsroom: sesi admin sudah berakhir. Silakan masuk kembali lalu simpan ulang."
          : status === 413
            ? "Newsroom: berkas gambar terlalu besar. Unggah ulang gambar sebelum menyimpan."
            : message
              ? `Newsroom: gagal menyimpan artikel. ${message}`
              : "Newsroom: artikel belum dapat disimpan. Silakan coba kembali.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateArticle = () => {
    setEditingArticle(null);
    setComposerOpen(true);
  };

  const openEditArticle = (post: NewsroomPost) => {
    const article = database.articles.find((item) => item.id === post.articleId);
    if (!article) {
      onLocalAction("Newsroom: data artikel tidak ditemukan.");
      return;
    }
    setEditingArticle(article);
    setComposerOpen(true);
  };

  const deleteArticle = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await newsroomService.deleteArticle(deleteTarget.slug);
      setDeleteTarget(null);
      onLocalAction("Newsroom: artikel dihapus dari admin dan seluruh tampilan pengguna.");
    } catch {
      onLocalAction("Newsroom: artikel belum dapat dihapus. Silakan coba kembali.");
    } finally {
      setIsDeleting(false);
    }
  };

  const exportReport = () => {
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      ["ID", "Title", "Author", "Category", "Status", "Views"],
      ...posts.map((post) => [post.id, post.title, post.author, post.category, post.status, String(post.viewCount)]),
    ];
    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mahreen-newsroom-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    onLocalAction("Newsroom report berhasil diekspor.");
  };

  if (viewMode === "events") {
    return <NewsroomEventsAdmin onLocalAction={onLocalAction} onViewChange={setViewMode} query={query} />;
  }

  if (viewMode === "tags") {
    return <NewsroomTagsAdmin onLocalAction={onLocalAction} onViewChange={setViewMode} query={query} />;
  }

  if (viewMode === "webinars") {
    return <NewsroomWebinarsAdmin onLocalAction={onLocalAction} onViewChange={setViewMode} query={query} />;
  }

  if (composerOpen) {
    return (
      <NewsroomArticleEditor
        key={editingArticle?.id ?? "new-article"}
        initialValue={editingArticle ? mapArticleToEditorData(editingArticle) : undefined}
        mode={editingArticle ? "edit" : "create"}
        onBack={() => { setComposerOpen(false); setEditingArticle(null); }}
        onLocalAction={onLocalAction}
        isSubmitting={isSaving}
        onSubmit={(submission) => void saveArticle(submission)}
      />
    );
  }

  return (
    <section className="admin-newsroom-view">
      <style data-component="admin-newsroom-sync">{newsroomAdminSyncStyles}</style>
      <style data-component="admin-newsroom-switcher">{newsroomAdminSwitcherStyles}</style>
      <div className="admin-newsroom-switcher" role="tablist" aria-label="Pilih konten newsroom">
        <button
          className={isArticlesView ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={isArticlesView}
          onClick={() => setViewMode("articles")}
        >
          Articles
        </button>
        <button
          className={isTagsView ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={isTagsView}
          onClick={() => setViewMode("tags")}
        >
          Tags
        </button>
        <button
          className={isEventsView ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={isEventsView}
          onClick={() => setViewMode("events")}
        >
          Events
        </button>
        <button
          className={isWebinarsView ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={isWebinarsView}
          onClick={() => setViewMode("webinars")}
        >
          Webinars
        </button>
      </div>
      <header className="admin-newsroom-heading admin-animate">
        <div>
          <h1>Newsroom Intelligence</h1>
          <p>Overview of portal performance and editorial velocity.</p>
          <span className="admin-newsroom-sync-badge">
            <span /> <Cloud size={12} /> {newsroomService.getDataSourceMode()} sync
          </span>
        </div>
        <div>
          <button className="admin-newsroom-export" type="button" onClick={exportReport}><Download size={15} /> Export Report</button>
          <button className="admin-newsroom-create" type="button" onClick={openCreateArticle}><Plus size={16} /> Create Article</button>
        </div>
      </header>

      <section className="admin-newsroom-metrics" aria-label="Newsroom metrics">
        <NewsroomMetricCard context={`${publishedArticles} published documents`} icon={<FileText size={19} />} label="Total Articles" value={totalArticles.toLocaleString("id-ID")} />
        <NewsroomMetricCard context={`${viewedArticles} documents opened`} icon={<Eye size={19} />} label="Total Views" value={totalViews.toLocaleString("id-ID")} />
      </section>

      <section className="admin-newsroom-content-grid">
        <NewsroomEditorialWorkflow
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onDelete={setDeleteTarget}
          onEdit={openEditArticle}
          posts={posts}
          query={query}
        />
        <NewsroomTrendingTopics />
      </section>

      <NewsroomActivityStream articles={database.articles} />

      {deleteTarget ? (
        <NewsroomDeleteDialog
          isDeleting={isDeleting}
          onCancel={() => { if (!isDeleting) setDeleteTarget(null); }}
          onConfirm={() => void deleteArticle()}
          post={deleteTarget}
        />
      ) : null}

    </section>
  );
};

export default NewsroomAdmin;
