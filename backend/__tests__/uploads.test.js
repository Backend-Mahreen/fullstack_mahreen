/**
 * Regression tests untuk route upload gambar (dipakai editor Newsroom admin).
 *
 * Mengunci kontrak yang dibutuhkan alur "admin upload gambar -> tampil di client":
 *   - POST /api/uploads menerima file dan mengembalikan { fileId, fileName, fileUrl }
 *   - fileUrl berbentuk root-relative "/uploads/<uuid>.<ext>"
 *   - file yang tidak diizinkan / kosong ditolak
 *
 * Auth di-stub. Disk write nyata (multer) diarahkan sudah default ke <repo>/uploads;
 * file uji dibersihkan setelah test.
 */
const express = require("express");
const request = require("supertest");
const path = require("path");
const fs = require("fs");

jest.mock("../src/middleware/auth", () => ({
  authenticate: (req, _res, next) => {
    req.user = { id: "admin", role: "superadmin", fullName: "Admin" };
    next();
  },
  authorize: () => (_req, _res, next) => next(),
}));

jest.mock("../src/utils/logger", () => ({ error: jest.fn(), warn: jest.fn(), info: jest.fn() }));

const uploadsRouter = require("../src/routes/uploads");

const app = express();
app.use("/api/uploads", uploadsRouter);

const CSRF = { "x-requested-with": "XMLHttpRequest" };
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

const cleanup = (fileName) => {
  if (!fileName) return;
  const p = path.join(UPLOAD_DIR, fileName);
  if (fs.existsSync(p)) fs.unlinkSync(p);
};

describe("POST /api/uploads", () => {
  it("menerima gambar PNG dan mengembalikan fileUrl root-relative", async () => {
    const res = await request(app)
      .post("/api/uploads")
      .set(CSRF)
      .attach("file", PNG_1x1, { filename: "cover.png", contentType: "image/png" });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("fileId");
    expect(res.body.data).toHaveProperty("fileName", "cover.png");
    expect(res.body.data.fileUrl).toMatch(/^\/uploads\/[0-9a-f-]+\.png$/);

    cleanup(res.body.data.fileId);
  });

  it("menolak request tanpa file dengan 400", async () => {
    const res = await request(app).post("/api/uploads").set(CSRF);
    expect(res.status).toBe(400);
  });

  it("menolak tipe file yang tidak diizinkan", async () => {
    const res = await request(app)
      .post("/api/uploads")
      .set(CSRF)
      .attach("file", Buffer.from("hello"), { filename: "note.txt", contentType: "text/plain" });

    // multer fileFilter menolak -> tidak 201
    expect(res.status).not.toBe(201);
    if (res.body?.data?.fileId) cleanup(res.body.data.fileId);
  });
});
