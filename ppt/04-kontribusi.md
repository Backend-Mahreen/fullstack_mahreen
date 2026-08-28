# Slide 4: KONTRIBUSI

---

## **KONTRIBUSI — Apa yang Kami Kerjakan?**

---

### 🎨 UI/UX Designer — Kontribusi

| # | Kontribusi | Detail |
|---|-----------|--------|
| 1 | **Wireframe & Mockup** | Merancang tata letak semua halaman: Homepage, Newsroom, Studio, Admin Dashboard |
| 2 | **Design System** | Membuat style guide: warna (#2D6A4F hijau utama), tipografi, spacing, komponen |
| 3 | **Responsive Layout** | Memastikan antarmuka optimal di desktop, tablet, dan mobile |
| 4 | **User Flow** | Mendesain alur: belanja, donasi, konsultasi, pendaftaran magang |
| 5 | **Component Library** | Mendefinisikan komponen reusable: navbar, card, form, modal, sidebar |

**Hasil Nyata:**
- 📄 23+ halaman terdesain
- 🎨 Konsistensi visual di 5 pilar utama
- 📱 Responsive di semua breakpoint

---

### 💻 Frontend Developer — Kontribusi

| # | Kontribusi | Detail |
|---|-----------|--------|
| 1 | **Komponen React** | Membangun navbar, footer, card, form, sidebar, loading skeleton |
| 2 | **Routing System** | Custom hash-based navigation + lazy loading untuk code splitting |
| 3 | **State Management** | AuthProvider context + custom hooks (useAuth, useStudioCart) |
| 4 | **API Integration** | apiClient dengan auto token refresh, error handling, timeout |
| 5 | **Dual Data Source** | Mode `api`, `local`, `auto` — frontend bisa jalan tanpa backend |
| 6 | **Admin Dashboard** | Implementasi halaman admin: overview, manajemen user, CRUD konten |

**Hasil Nyata:**
- 📦 15+ custom hooks
- 🔄 Auto token refresh saat expired
- 🚀 Lazy loading mengurangi initial load time

---

### ⚙️ Backend Developer — Kontribusi

| # | Kontribusi | Detail |
|---|-----------|--------|
| 1 | **REST API** | 40+ endpoint untuk semua fitur: auth, articles, products, donations, etc. |
| 2 | **Autentikasi** | JWT dual-token (access 15min + refresh 7-30 hari) + HttpOnly cookie |
| 3 | **RBAC** | 80+ permission keys untuk 4 role: superadmin, admin, client, intern |
| 4 | **Payment Gateway** | Integrasi Midtrans (Bank Transfer, QRIS) + webhook handling |
| 5 | **Security** | Helmet, CORS, rate limiting (6+ limiter), CSRF, DOMPurify |
| 6 | **SSE Broadcaster** | Real-time updates untuk admin dashboard |
| 7 | **Admin Helpers** | Shared CRUD utilities (listResource, insertRow, updateRow, logAdminAction) |

**Hasil Nyata:**
- 🔒 6+ rate limiters berbeda
- 💳 Pembayaran online via Midtrans
- 📡 Real-time updates via SSE

---

### 🗄️ Database Engineer — Kontribusi

| # | Kontribusi | Detail |
|---|-----------|--------|
| 1 | **Schema Design** | 35+ tabel: users, articles, products, orders, donations, internships, etc. |
| 2 | **Relationship Mapping** | Foreign keys antar tabel untuk data integrity |
| 3 | **UUID Strategy** | Primary key VARCHAR(36) untuk portabilitas (bukan auto-increment) |
| 4 | **JSON Columns** | Flexible data untuk field yang bervariasi (metadata, settings) |
| 5 | **Seed Data** | Auto-seeding superadmin, default roles, dan sample data |
| 6 | **Parameterized Queries** | Proteksi SQL injection di semua query |
| 7 | **Audit Log Schema** | Tabel audit untuk tracking semua aktivitas admin |

**Hasil Nyata:**
- 📊 35+ tabel terintegrasi
- 🔗 Foreign key constraints aktif
- 🌱 Auto-seeding saat server startup

---

> *"Setiap kontribusi dirancang untuk mendukung keseluruhan ekosistem platform."*
