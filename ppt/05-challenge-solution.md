# Slide 5: CHALLENGE & SOLUTION

---

## **CHALLENGE & SOLUTION — Tantangan yang Kami Hadapi**

---

### 🎨 UI/UX Designer

| Challenge | Solution |
|-----------|----------|
| **5 pilar berbeda dalam satu platform** — Newsroom, Studio, Tanya Mahreen, Peduli Mahreen, Magang harus tampil konsisten | Membuat **Design System** dengan komponen reusable: warna, tipografi, spacing, card, button yang seragam di semua pilar |
| **Banyaknya halaman** — 23+ halaman dengan berbagai kebutuhan | **Component-based approach**: mendefinisikan komponen dasar (navbar, card, form, modal) yang bisa dipakai berulang |
| **Responsive di semua perangkat** — desktop, tablet, mobile | **Mobile-first design** + testing di berbagai breakpoint. Komponen form adaptif (phone input, date picker) |
| **Admin dashboard kompleks** — banyak data & fitur dalam satu layar | **Sidebar navigation** + modular layout. Setiap fitur admin punya halaman terpisah dengan navigasi yang jelas |

---

### 💻 Frontend Developer

| Challenge | Solution |
|-----------|----------|
| **Tanpa React Router** — harus membuat routing sendiri | Custom **hash-based routing** (`hashNavigation.ts`) yang resolve dari `window.location.pathname` |
| **Dual Data Source** — frontend harus jalan tanpa backend (demo mode) | **serviceMode.ts** dengan 3 mode: `api`, `local`, `auto`. Fallback ke data lokal jika API tidak tersedia |
| **State management tanpa library** — hanya pakai React Context | **AuthProvider** context + 15+ custom hooks (`useAuth`, `useStudioCart`, `useEventStream`) untuk abstraksi state |
| **Performance di page berat** — admin dashboard & e-commerce banyak data | **Lazy loading** via `React.lazy()` + `Suspense`, skeleton loading states, dan code splitting |
| **Auto token refresh** — access token expired setiap 15 menit | **apiClient.ts** dengan interceptor: jika 401, otomatis refresh token lalu retry request |

---

### ⚙️ Backend Developer

| Challenge | Solution |
|-----------|----------|
| **Raw SQL tanpa ORM** — 35+ tabel, semua query manual, rentan SQL injection | **Parameterized queries** via `mysql2/promise` + helper abstractions (`runQuery`, `runSingle`, `withTransaction`) |
| **Autentikasi kompleks** — dual-token, blacklist, trusted devices | **JWT dual-token** (access 15min + refresh 7-30 hari) + HttpOnly cookie + token blacklist service |
| **RBAC granular** — 80+ permission untuk 4 role | **Middleware `permissions.js`** dengan permission matrix + `auth.js` untuk authenticate + authorize |
| **Payment gateway** — integrasi Midtrans untuk transaksi | **`midtransService.js`** abstraksi Midtrans API + webhook handling + status tracking |
| **Real-time updates** — admin butuh data terbaru secara langsung | **Server-Sent Events (SSE)** via `sseBroadcaster.js` + `useEventStream` hook di frontend |
| **Security hardening** — banyak attack vectors | **Helmet + CORS + 6+ rate limiters + DOMPurify + CSRF token + file validation** |

---

### 🗄️ Database Engineer

| Challenge | Solution |
|-----------|----------|
| **35+ tabel dengan relasi kompleks** — foreign keys, multi-tenant data | **InnoDB engine** + foreign key constraints + `withTransaction()` helper untuk atomic operations |
| **Query performance** — raw SQL tanpa query optimization tool | **LRU caching** di backend untuk frequently-accessed queries + indexing pada searchable columns |
| **Data integrity** — konsistensi data lintas tabel (orders, transactions, payments) | **Foreign key constraints** + parameterized queries + audit log untuk tracking perubahan |
| **No migration framework** — tidak ada automatic rollback | Programmatic schema di `database.js` — semua tabel `CREATE TABLE IF NOT EXISTS` (idempotent) |
| **UUID vs Auto-increment** — portabilitas primary key | **UUID VARCHAR(36)** — bisa dipindah antar database tanpa conflict |
| **Seed data management** — data demo harus konsisten | **Auto-seeding** saat startup: superadmin + default roles + sample data |

---

> *"Setiap tantangan diatasi dengan solusi yang praktis, bukan sekadar teori."*
