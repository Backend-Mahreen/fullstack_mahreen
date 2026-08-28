# Backend Cookbook — Pattern Cheat Sheet

> Copy-paste patterns untuk new developer. Baca ini SEBELUM mulai nulis code.

---

## Import Pattern

```javascript
const express = require("express");
const router = express.Router();
const { runQuery, runSingle, runExecute } = require("../config/database");
const { sendSuccess, sendError } = require("../utils/response");
const { authenticate, authorize } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
```

### Admin Routes (tambah ini)

```javascript
const { asyncHandler, listResource, insertRow, updateRow, deleteRow, findRow, logAdminAction, requireFields } = require("./_helpers");
const { requirePermission } = require("../../middleware/permissions");
```

---

## Pattern 1: GET List (Public)

```javascript
router.get("/", async (req, res) => {
  try {
    const { search, limit, offset } = req.query;
    let sql = "SELECT * FROM my_table";
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push("(name LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY created_at DESC";

    if (limit) {
      sql += " LIMIT ?";
      params.push(parseInt(limit));
      if (offset) {
        sql += " OFFSET ?";
        params.push(parseInt(offset));
      }
    }

    const rows = await runQuery(sql, params);
    sendSuccess(res, rows);
  } catch (error) {
    sendError(res, "Gagal mengambil data", 500);
  }
});
```

---

## Pattern 2: GET List (Admin — pakai helpers)

```javascript
router.get(
  "/",
  requirePermission("resource.read"),
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: "my_table",
      query: req.query,
      columns: "id, name, description, status, created_at",
      filters: [
        { param: "status", column: "status" },
        { param: "search", type: "search", columns: ["name", "description"] },
      ],
      allowedSort: ["created_at", "name", "status"],
      defaultSort: "created_at",
    });
    sendSuccess(res, result);
  })
);
```

---

## Pattern 3: GET Detail

```javascript
router.get("/:id", async (req, res) => {
  try {
    const row = await runSingle("SELECT * FROM my_table WHERE id = ?", [req.params.id]);
    if (!row) return sendError(res, "Data tidak ditemukan", 404);
    sendSuccess(res, row);
  } catch (error) {
    sendError(res, "Gagal mengambil data", 500);
  }
});
```

---

## Pattern 4: POST Create

```javascript
router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      // Validasi field wajib
      if (!name) return sendError(res, "Nama wajib diisi", 400);

      const id = uuidv4();
      const now = new Date().toISOString();

      await runExecute(
        `INSERT INTO my_table (id, name, description, created_at) VALUES (?, ?, ?, ?)`,
        [id, name, description || "", now]
      );

      sendSuccess(res, { id, name }, 201);
    } catch (error) {
      sendError(res, "Gagal membuat data", 500);
    }
  }
);
```

---

## Pattern 5: PUT Update

```javascript
router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      const existing = await runSingle("SELECT id FROM my_table WHERE id = ?", [req.params.id]);
      if (!existing) return sendError(res, "Data tidak ditemukan", 404);

      const { name, description } = req.body;
      const updates = [];
      const params = [];

      if (name !== undefined) { updates.push("name = ?"); params.push(name); }
      if (description !== undefined) { updates.push("description = ?"); params.push(description); }

      if (updates.length === 0) return sendError(res, "Tidak ada yang diupdate", 400);

      params.push(req.params.id);
      await runExecute(`UPDATE my_table SET ${updates.join(", ")} WHERE id = ?`, params);

      sendSuccess(res, { message: "Berhasil diupdate" });
    } catch (error) {
      sendError(res, "Gagal mengupdate data", 500);
    }
  }
);
```

---

## Pattern 6: DELETE

```javascript
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      const existing = await runSingle("SELECT id FROM my_table WHERE id = ?", [req.params.id]);
      if (!existing) return sendError(res, "Data tidak ditemukan", 404);

      await runExecute("DELETE FROM my_table WHERE id = ?", [req.params.id]);
      sendSuccess(res, { message: "Berhasil dihapus" });
    } catch (error) {
      sendError(res, "Gagal menghapus data", 500);
    }
  }
);
```

---

## Pattern 7: Admin CRUD dengan `_helpers.js`

```javascript
const express = require("express");
const router = express.Router();
const { asyncHandler, listResource, insertRow, updateRow, deleteRow, findRow, logAdminAction, pickDefined, requireFields } = require("./_helpers");
const { sendSuccess, sendError } = require("../../utils/response");
const { requirePermission } = require("../../middleware/permissions");
const { v4: uuidv4 } = require("uuid");

const nowIso = () => new Date().toISOString();

// Column mapping: DB column → request body key
const COLUMN_MAP = {
  name: "name",
  description: "description",
  status: { key: "status", transform: String },
};

// GET list
router.get(
  "/",
  requirePermission("resource.read"),
  asyncHandler(async (req, res) => {
    const result = await listResource({
      table: "my_table",
      query: req.query,
      filters: [
        { param: "status", column: "status" },
        { param: "search", type: "search", columns: ["name"] },
      ],
      allowedSort: ["created_at", "name"],
    });
    sendSuccess(res, result);
  })
);

// POST create
router.post(
  "/",
  requirePermission("resource.create"),
  asyncHandler(async (req, res) => {
    const missing = requireFields(req.body, ["name"]);
    if (missing.length) {
      return sendError(res, `Field wajib: ${missing.join(", ")}`, 400);
    }

    const id = uuidv4();
    const payload = { id, ...pickDefined(req.body, COLUMN_MAP), created_at: nowIso() };
    await insertRow("my_table", payload);

    logAdminAction(req, { action: "create", resource: "my_table", resourceId: id, summary: payload.name });
    sendSuccess(res, { id }, 201);
  })
);

// PUT update
router.put(
  "/:id",
  requirePermission("resource.update"),
  asyncHandler(async (req, res) => {
    const existing = await findRow("my_table", req.params.id);
    if (!existing) return sendError(res, "Data tidak ditemukan", 404);

    const payload = pickDefined(req.body, COLUMN_MAP);
    if (Object.keys(payload).length === 0) {
      return sendError(res, "Tidak ada yang diupdate", 400);
    }

    await updateRow("my_table", req.params.id, payload);
    logAdminAction(req, { action: "update", resource: "my_table", resourceId: req.params.id });
    sendSuccess(res, { message: "Berhasil diupdate" });
  })
);

// DELETE
router.delete(
  "/:id",
  requirePermission("resource.delete"),
  asyncHandler(async (req, res) => {
    const existing = await findRow("my_table", req.params.id);
    if (!existing) return sendError(res, "Data tidak ditemukan", 404);

    await deleteRow("my_table", req.params.id);
    logAdminAction(req, { action: "delete", resource: "my_table", resourceId: req.params.id });
    sendSuccess(res, { message: "Berhasil dihapus" });
  })
);

module.exports = router;
```

---

## Pattern 8: Rate Limiter di Route

```javascript
const { publicFormLimiter } = require("../middleware/rateLimit");

router.post("/", publicFormLimiter, async (req, res) => {
  // handler...
});
```

---

## Pattern 9: Admin Sub-Route Mounting

```javascript
// Di admin/index.js
const myRoutes = require("./my-resource");

router.use(
  "/my-resource",
  requireAnyPermission("resource.create", "resource.read", "resource.update", "resource.delete"),
  myRoutes
);
```

---

## Pattern 10: Transaction

```javascript
const { withTransaction } = require("../config/database");

await withTransaction(async (conn) => {
  await conn.execute("UPDATE accounts SET balance = balance - ? WHERE id = ?", [amount, fromId]);
  await conn.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", [amount, toId]);
});
```

---

## Pattern 11: Pagination Response

```javascript
// Frontend expects:
{
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "offset": 0,
      "totalPages": 5,
      "hasMore": true
    }
  }
}
```

---

## Common Mistakes to Avoid

### 1. Jangan pakai `runQuery` untuk INSERT/UPDATE/DELETE
```javascript
// WRONG
await runQuery("INSERT INTO users (id, name) VALUES (?, ?)", [id, name]);

// RIGHT
await runExecute("INSERT INTO users (id, name) VALUES (?, ?)", [id, name]);
```

### 2. Jangan lupa `asyncHandler` di admin routes
```javascript
// WRONG — error akan crash server
router.get("/", async (req, res) => { ... });

// RIGHT — error ditangkap oleh Express error handler
router.get("/", asyncHandler(async (req, res) => { ... }));
```

### 3. Jangan return password di response
```javascript
// WRONG
sendSuccess(res, user);

// RIGHT
const { password, ...safe } = user;
sendSuccess(res, safe);
```

### 4. Jangan hardcode ID atau values
```javascript
// WRONG
if (req.user.role === "admin" || req.user.role === "superadmin") {

// RIGHT — pakai authorize middleware di router level
router.use(authenticate, authorize("admin", "superadmin"));
```

### 5. Selalu cek existence sebelum update/delete
```javascript
// WRONG — update tanpa cek
await runExecute("UPDATE users SET name = ? WHERE id = ?", [name, id]);

// RIGHT
const existing = await runSingle("SELECT id FROM users WHERE id = ?", [id]);
if (!existing) return sendError(res, "Data tidak ditemukan", 404);
await runExecute("UPDATE users SET name = ? WHERE id = ?", [name, id]);
```

---

## Checklist Sebelum Submit Code

- [ ] `runExecute` untuk INSERT/UPDATE/DELETE (bukan `runQuery`)
- [ ] `asyncHandler` wrap semua admin route handler
- [ ] Validasi field wajib dengan `requireFields` atau manual check
- [ ] Cek existence sebelum update/delete
- [ ] Tidak return `password` di response
- [ ] Error message Bahasa Indonesia
- [ ] Status code sesuai (200, 201, 400, 401, 403, 404, 500)
- [ ] `logAdminAction` untuk semua admin create/update/delete
