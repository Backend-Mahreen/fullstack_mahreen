/**
 * Regression tests for the public Newsroom route — the admin -> client seam.
 *
 * These lock down the bugs found while diagnosing "artikel admin tidak tampil
 * di client":
 *   1. status case mismatch (DB lowercase vs frontend "Published")
 *   2. payload shape gate (frontend expects `webinarCards`, not `webinars`)
 *   3. featured flag (DB column featured_article/show_on_homepage, not `featured`)
 *   4. POST crash on empty tags (JSON column) + missing published_at
 *   5. cache invalidation on write
 *
 * DB is mocked so the suite runs in CI without MySQL. The end-to-end version
 * against the real DB lives in scripts/newsroom-client-loop.js.
 */
const express = require("express");
const request = require("supertest");

const mockRunQuery = jest.fn();
const mockRunSingle = jest.fn();
const mockRunExecute = jest.fn();

jest.mock("../src/config/database", () => ({
  runQuery: mockRunQuery,
  runSingle: mockRunSingle,
  runExecute: mockRunExecute,
}));

const mockCacheClear = jest.fn();
jest.mock("../src/utils/cache", () => ({
  newsroomCache: { clear: mockCacheClear },
  // Bypass the 60s TTL cache in tests: always run the factory fresh.
  getOrSet: (_cache, _key, factory) => factory(),
}));

jest.mock("../src/middleware/rateLimit", () => ({
  publicReadLimiter: (req, res, next) => next(),
  publicFormLimiter: (req, res, next) => next(),
}));

jest.mock("../src/middleware/auth", () => ({
  authenticate: (req, _res, next) => {
    req.user = { id: "admin", role: "superadmin", fullName: "Admin" };
    next();
  },
  authorize: () => (_req, _res, next) => next(),
}));

jest.mock("../src/utils/logger", () => ({ error: jest.fn(), warn: jest.fn(), info: jest.fn() }));

const newsroomRouter = require("../src/routes/newsroom");

const app = express();
app.use(express.json());
app.use("/api/newsroom", newsroomRouter);

const CSRF = { "x-requested-with": "XMLHttpRequest" };

// Frontend gate: frontend/src/data/newsroomLocalDatabase.ts:189
const isDatabaseShape = (v) =>
  !!v &&
  typeof v === "object" &&
  v.schemaVersion === 1 &&
  Array.isArray(v.articles) &&
  Array.isArray(v.events) &&
  Array.isArray(v.webinarCards) &&
  Array.isArray(v.topics) &&
  Array.isArray(v.speakers) &&
  Array.isArray(v.announcements) &&
  Array.isArray(v.navigation);

// Frontend publish filter: newsroomLocalDatabase.ts:248
const isPublishedNewsroomArticle = (a) =>
  a.publicationStatus === undefined || a.publicationStatus === "Published";

const dbArticleRow = (overrides = {}) => ({
  id: "uuid-1",
  slug: "artikel-satu",
  title: "Artikel Satu",
  excerpt: "ringkasan",
  category: "Teknologi",
  status: "published",
  published_at: "2026-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  read_time: "5 min",
  image: "",
  author: "Legacy Author",
  primary_author: "Primary Author",
  content_type: "article",
  tags: JSON.stringify(["Teknologi"]),
  views: 3,
  featured_article: 1,
  show_on_homepage: 1,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  // GET / fires 7 parallel SELECTs. Default: only the first (articles) returns data.
  mockRunQuery.mockResolvedValue([]);
});

describe("GET /api/newsroom (client feed)", () => {
  const wireOverview = (articles) => {
    mockRunQuery.mockImplementation((sql) => {
      if (/FROM articles/i.test(sql)) return Promise.resolve(articles);
      return Promise.resolve([]);
    });
  };

  it("returns a payload that passes the frontend isDatabaseShape() gate", async () => {
    wireOverview([dbArticleRow()]);
    const res = await request(app).get("/api/newsroom");

    expect(res.status).toBe(200);
    expect(isDatabaseShape(res.body.data)).toBe(true);
  });

  it("exposes webinarCards (not webinars) so the client cache hydrates", async () => {
    wireOverview([dbArticleRow()]);
    const res = await request(app).get("/api/newsroom");

    expect(Array.isArray(res.body.data.webinarCards)).toBe(true);
    expect(res.body.data).not.toHaveProperty("webinars");
  });

  it("maps lowercase DB status to the frontend enum so articles are not filtered out", async () => {
    wireOverview([dbArticleRow({ status: "published" })]);
    const res = await request(app).get("/api/newsroom");
    const article = res.body.data.articles[0];

    expect(article.publicationStatus).toBe("Published");
    expect(isPublishedNewsroomArticle(article)).toBe(true);
  });

  it("maps DB featured_article/show_on_homepage to the featured flag", async () => {
    wireOverview([dbArticleRow({ featured_article: 1, show_on_homepage: 0 })]);
    const res = await request(app).get("/api/newsroom");

    expect(res.body.data.articles[0].featured).toBe(true);
  });

  it("prefers primary_author and returns tags as a string", async () => {
    wireOverview([dbArticleRow({ primary_author: "Nadia", tags: JSON.stringify(["A", "B"]) })]);
    const res = await request(app).get("/api/newsroom");
    const article = res.body.data.articles[0];

    expect(article.author).toBe("Nadia");
    expect(typeof article.tags).toBe("string");
    expect(article.tags).toBe("A, B");
  });

  it("round-trips full editor fields (content, seo, visibility, gallery, dates, source)", async () => {
    const storedContent = JSON.stringify({
      editorContent: "**lead paragraf**",
      content: {
        lead: "ringkasan",
        sections: [{ heading: "Isi Artikel", paragraphs: ["paragraf satu", "paragraf dua"] }],
      },
    });
    wireOverview([
      dbArticleRow({
        content: storedContent,
        thumbnail: "/uploads/thumb.png",
        image_gallery: JSON.stringify([{ src: "/uploads/g1.png", alt: "Galeri 1" }]),
        co_author: "Editorial",
        seo_title: "SEO Judul",
        meta_description: "Deskripsi meta",
        og_image: "/uploads/og.png",
        canonical_url: "https://mahreen.id/artikel-satu",
        featured_article: 1,
        breaking_news_banner: 1,
        scheduled_at: "2026-02-01T09:00:00",
        updated_at: "2026-01-02T00:00:00.000Z",
      }),
    ]);
    const res = await request(app).get("/api/newsroom");
    const article = res.body.data.articles[0];

    expect(article.content.sections[0].paragraphs).toEqual(["paragraf satu", "paragraf dua"]);
    expect(article.editorContent).toBe("**lead paragraf**");
    expect(article.thumbnail).toBe("/uploads/thumb.png");
    expect(article.gallery).toEqual([{ src: "/uploads/g1.png", alt: "Galeri 1" }]);
    expect(article.coAuthor).toBe("Editorial");
    expect(article.seo).toEqual({
      title: "SEO Judul",
      description: "Deskripsi meta",
      ogImageUrl: "/uploads/og.png",
      canonicalUrl: "https://mahreen.id/artikel-satu",
    });
    expect(article.visibility).toEqual({ showHomepage: true, featuredArticle: true, breakingNews: true });
    expect(article.source).toBe("api");
    expect(article.releaseAt).toBe("2026-02-01T09:00:00");
    expect(article.updatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(article.publishedAt).not.toMatch(/^\d{4}-\d{2}-\d{2}T/); // format tampilan, bukan ISO mentah
  });

  it("formats publishedAt as a readable id-ID date for the client", async () => {
    wireOverview([dbArticleRow({ published_at: "2026-01-05T00:00:00.000Z" })]);
    const res = await request(app).get("/api/newsroom");

    expect(res.body.data.articles[0].publishedAt).toBe("05 Jan 2026");
  });
});

describe("POST /api/newsroom/articles (admin write)", () => {
  it("does not crash on empty tags and persists valid JSON + lowercase status", async () => {
    mockRunSingle.mockResolvedValue(null); // no existing slug -> INSERT
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "Baru", category: "Teknologi", publicationStatus: "Published", tags: "" });

    expect(res.status).toBe(201);
    const insertArgs = mockRunExecute.mock.calls[0][1];
    expect(insertArgs).toContain("published"); // lowercase status written to DB
    expect(insertArgs).toContain("[]"); // empty tags normalized to valid JSON
    // published_at must be supplied (column is NOT NULL, no default)
    const insertSql = mockRunExecute.mock.calls[0][0];
    expect(insertSql).toMatch(/published_at/);
    expect(res.body.data.publicationStatus).toBe("Published");
  });

  it("normalizes CSV tags into a JSON array", async () => {
    mockRunSingle.mockResolvedValue(null);
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "T", category: "C", tags: "AI, Karier , " });

    const insertArgs = mockRunExecute.mock.calls[0][1];
    expect(insertArgs).toContain(JSON.stringify(["AI", "Karier"]));
  });

  it("stores an ISO published_at (ignoring frontend local-formatted date) when published", async () => {
    mockRunSingle.mockResolvedValue(null);
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    // Frontend mapper sends a locale-formatted string like "12 Agu 2026".
    await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "T", category: "C", publicationStatus: "Published", publishedAt: "12 Agu 2026" });

    const insertArgs = mockRunExecute.mock.calls[0][1];
    // The ISO timestamp the backend generated must be present and parseable.
    const iso = insertArgs.find(
      (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v),
    );
    expect(iso).toBeDefined();
    expect(Number.isNaN(new Date(iso).getTime())).toBe(false);
  });

  it("updates an existing article by slug (admin edit) instead of inserting", async () => {
    mockRunSingle.mockResolvedValue({ id: "existing-uuid" }); // slug already exists
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "Judul Baru", slug: "artikel-lama", category: "C", publicationStatus: "Published" });

    expect(res.status).toBe(201);
    const sql = mockRunExecute.mock.calls[0][0];
    expect(sql).toMatch(/^UPDATE articles/); // edit path, not INSERT
    expect(mockCacheClear).toHaveBeenCalled();
  });

  it("invalidates the newsroom cache after a write", async () => {
    mockRunSingle.mockResolvedValue(null);
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "T", category: "C" });

    expect(mockCacheClear).toHaveBeenCalled();
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ category: "C" });

    expect(res.status).toBe(400);
  });

  it("rejects base64/data-URL images with 400 (must upload first)", async () => {
    const res = await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "T", category: "C", image: "data:image/webp;base64,AAAA" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/unggah|upload|base64/i);
    expect(mockRunExecute).not.toHaveBeenCalled();
  });

  it("persists content, seo, visibility, thumbnail, and gallery on insert", async () => {
    mockRunSingle.mockResolvedValue(null);
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    const payload = {
      title: "T",
      slug: "t",
      category: "Teknologi",
      publicationStatus: "Published",
      editorContent: "teks mentah",
      content: { lead: "ringkas", sections: [{ heading: "Isi Artikel", paragraphs: ["p1"] }] },
      thumbnail: "/uploads/thumb.png",
      gallery: [{ src: "/uploads/g1.png", alt: "G1" }],
      coAuthor: "Editorial",
      seo: { title: "SEO", description: "Desc", ogImageUrl: "/uploads/og.png", canonicalUrl: "https://mahreen.id/t" },
      visibility: { showHomepage: true, featuredArticle: true, breakingNews: true },
    };
    await request(app).post("/api/newsroom/articles").set(CSRF).send(payload);

    const insertSql = mockRunExecute.mock.calls[0][0];
    const insertArgs = mockRunExecute.mock.calls[0][1];
    expect(insertSql).toMatch(/^INSERT INTO articles/);

    // INSERT: id, slug, title, subtitle, excerpt, content, category, ...
    const storedContent = JSON.parse(insertArgs[5]);
    expect(storedContent.editorContent).toBe("teks mentah");
    expect(storedContent.content.sections[0].paragraphs).toEqual(["p1"]);
    expect(insertArgs).toContain("/uploads/thumb.png");
    expect(insertArgs).toContain(JSON.stringify([{ src: "/uploads/g1.png", alt: "G1" }]));
    expect(insertArgs).toContain("Editorial");
    expect(insertArgs).toContain("SEO");
    // visibility: showOnHomepage, featuredArticle, breakingNews semuanya on
    expect(insertArgs.filter((value) => value === 1).length).toBe(3);
  });

  it("keeps views and published_at intact when editing a published article", async () => {
    mockRunSingle.mockResolvedValue({
      id: "existing-uuid",
      slug: "artikel-lama",
      status: "published",
      views: 42,
      published_at: "2026-01-01T00:00:00.000Z",
    });
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "Judul Baru", slug: "artikel-lama", category: "C", publicationStatus: "Published" });

    const updateArgs = mockRunExecute.mock.calls[0][1];
    expect(updateArgs).toContain(42); // views tidak direset
    expect(updateArgs).toContain("2026-01-01T00:00:00.000Z"); // published_at tidak direset
  });

  it("resolves slug conflicts with a numeric suffix instead of overwriting", async () => {
    // Call 1 = lookup keberadaan slug (null → artikel baru); call berikutnya =
    // pengecekan keunikan slug (selalu bentrok → suffix numerik ditambahkan).
    let callCount = 0;
    mockRunSingle.mockImplementation(() => {
      callCount += 1;
      return callCount === 1 ? null : { id: "other-uuid" };
    });
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app)
      .post("/api/newsroom/articles")
      .set(CSRF)
      .send({ title: "Judul Baru", category: "C" });

    expect(res.status).toBe(201);
    const insertArgs = mockRunExecute.mock.calls[0][1];
    const storedSlug = insertArgs[1];
    expect(storedSlug).not.toBe("judul-baru");
    expect(storedSlug).toMatch(/^judul-baru-/);
  });
});

describe("DELETE /api/newsroom/articles/:slug", () => {
  it("invalidates the cache when an article is deleted", async () => {
    mockRunExecute.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app).delete("/api/newsroom/articles/artikel-satu").set(CSRF);

    expect(res.status).toBe(200);
    expect(mockCacheClear).toHaveBeenCalled();
  });

  it("returns 404 when the article does not exist", async () => {
    mockRunExecute.mockResolvedValue({ affectedRows: 0 });

    const res = await request(app).delete("/api/newsroom/articles/tidak-ada").set(CSRF);

    expect(res.status).toBe(404);
  });
});
