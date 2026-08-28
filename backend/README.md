# Mahreen Indonesia — Backend

> Node.js 22 + Express 5 + MySQL (raw SQL, no ORM)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example → .env, isi DB credentials + JWT_SECRET
cp .env.example .env

# 3. Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

# 4. Run server (database + seed otomatis)
node index.js

# Server: http://localhost:3000
# API root: http://localhost:3000/api
```

---

## Architecture

### Request Flow

```
Client Request
    │
    ▼
┌─────────────────────────┐
│  CORS / Helmet /        │  Security headers, compression
│  Compression / Cookie   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Rate Limiter           │  Batasi request per IP (login, register, dll)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Authenticate           │  Verify JWT Bearer token + cek blacklist
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Authorize              │  Cek role (admin/superadmin/client)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Require Permission     │  Cek granular permission (80+ keys)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Route Handler          │  runQuery / runExecute → MySQL
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  sendSuccess / sendError│  Standardized JSON response
└─────────────────────────┘
```

### Directory Structure

```
backend/
├── index.js                 # Entry point — Express setup, route mounting, startup
├── package.json
├── .env                     # Secrets (DO NOT commit)
├── .env.example             # Template
└── src/
    ├── config/
    │   ├── database.js      # MySQL pool, 30+ CREATE TABLE, migrations, helpers
    │   ├── secrets.js       # JWT_SECRET validation
    │   └── seed.js          # Seed data (users, articles, products, dll)
    ├── middleware/
    │   ├── auth.js          # authenticate (JWT), authorize (role)
    │   ├── permissions.js   # RBAC 80+ permissions
    │   └── rateLimit.js     # 6 rate limiters
    ├── services/
    │   ├── tokenBlacklist.js   # Token revocation
    │   ├── trustedDevice.js    # Trusted device management
    │   ├── passwordPolicy.js   # Password strength validation
    │   ├── htmlSanitizer.js    # DOMPurify sanitization
    │   └── urlValidator.js     # URL validation
    ├── utils/
    │   ├── response.js      # sendSuccess / sendError
    │   ├── pagination.js    # LIMIT/OFFSET pagination
    │   └── logger.js        # Logging utility
    └── routes/
        ├── auth.js          # /api/auth (register, login, refresh, logout)
        ├── articles.js      # /api/articles
        ├── webinars.js      # /api/webinars
        ├── events.js        # /api/events
        ├── topics.js        # /api/topics
        ├── products.js      # /api/products
        ├── collections.js   # /api/collections
        ├── service-packages.js
        ├── internships.js   # /api/internships
        ├── csr.js           # /api/csr
        ├── donations.js     # /api/donations
        ├── transactions.js  # /api/transactions
        ├── dashboard.js     # /api/dashboard
        ├── uploads.js       # /api/uploads
        ├── speakers.js      # /api/speakers
        ├── newsletter.js    # /api/newsletter
        ├── newsroomSettings.js
        ├── categories.js    # /api/categories
        ├── consultations.js # /api/consultations
        ├── serviceOrders.js # /api/service-orders
        ├── newsroom.js      # /api/newsroom
        ├── admin/           # /api/admin/* (RBAC protected)
        │   ├── index.js     # Mount semua admin sub-routes
        │   ├── _helpers.js  # Shared: pagination, filters, CRUD helpers
        │   ├── overview.js
        │   ├── users.js
        │   ├── roles.js
        │   ├── newsroom.js
        │   ├── tanya-mahreen.js
        │   ├── peduli-mahreen.js
        │   ├── csr.js
        │   ├── studio.js
        │   ├── internship.js
        │   ├── verification.js
        │   ├── analytics.js
        │   ├── reports.js
        │   └── clients.js
        └── client/          # /api/client/* (client portal)
            ├── index.js
            ├── dashboard.js
            ├── newsroom.js
            ├── notifications.js
            └── consultations.js
```

### Database Tables (30+)

| Table | Purpose |
|-------|---------|
| `users` | User accounts (client, admin, superadmin, intern) |
| `roles` | RBAC roles |
| `role_permissions` | Role-permission mapping |
| `token_blacklist` | Revoked JWT tokens |
| `articles` | Newsroom articles |
| `webinars` | Webinar listings |
| `events` | Events |
| `topics` | Content topics/tags |
| `categories` | Article categories |
| `products` | Studio products |
| `collection_cards` | Product collections |
| `specializations` | Service specializations |
| `service_packages` | Service tier packages |
| `service_addons` | Service add-on items |
| `service_comparisons` | Tier comparison tables |
| `internship_batches` | Internship batches |
| `internship_applications` | Internship applications |
| `csr_programs` | CSR programs |
| `csr_pillars` | CSR pillars |
| `csr_applications` | CSR applications |
| `donations` | Donations |
| `donation_campaigns` | Donation campaigns |
| `transactions` | Financial transactions |
| `service_orders` | Service orders |
| `consultations` | Consultation requests |
| `portfolios` | Portfolio/case studies |
| `certificates` | Issued certificates |
| `certificate_verifications` | Verification logs |
| `analytics_events` | Page view analytics |
| `admin_audit_logs` | Admin action audit trail |
| `speakers` | Webinar/event speakers |
| `newsletter_subscribers` | Newsletter subscribers |
| `newsroom_settings` | Key-value site settings |
| `trusted_devices` | Trusted device tokens |
| `notifications` | User notifications |
| `password_reset_tokens` | Password reset tokens |
| `webinar_registrations` | Webinar registrations |
| `webinar_payments` | Webinar payments |
| `system_activities` | System activity feed |
| `faqs` | FAQ entries |

---

## Authentication Flow

```
Register:
  POST /api/auth/register
  → Hash password (bcrypt 10 rounds)
  → Insert user
  → Generate access token (15 min) + refresh token (7d / 30d if remember)
  → Set refresh token di HttpOnly cookie
  → Return { user, accessToken }

Login:
  POST /api/auth/login
  → Cari user by email
  → Compare password (bcrypt)
  → Generate tokens
  → Return { user, accessToken }

Refresh:
  POST /api/auth/refresh
  → Verify refresh token dari cookie
  → Revoke old refresh token
  → Generate new pair
  → Return new accessToken

Logout:
  POST /api/auth/logout
  → Soft-verify token (jangan reject expired)
  → Add token ke blacklist
  → Clear refresh cookie
```

---

## Middleware Stack

| Middleware | File | Purpose |
|-----------|------|---------|
| `authenticate` | `middleware/auth.js` | Verify JWT, cek blacklist, reject refresh token as access |
| `authorize(...roles)` | `middleware/auth.js` | Cek role (admin/superadmin/client/intern) |
| `requirePermission(...keys)` | `middleware/permissions.js` | Cek 1 specific permission |
| `requireAnyPermission(...keys)` | `middleware/permissions.js` | Cek minimal 1 dari permission list |
| `loginLimiter` | `middleware/rateLimit.js` | 8 attempts / 15 min |
| `registerLimiter` | `middleware/rateLimit.js` | 5 / hour |
| `refreshLimiter` | `middleware/rateLimit.js` | 60 / 15 min |
| `publicFormLimiter` | `middleware/rateLimit.js` | 20 / hour |
| `verificationLimiter` | `middleware/rateLimit.js` | 30 / 15 min |
| `trustedDeviceLimiter` | `middleware/rateLimit.js` | 10 / 15 min |

---

## Database Helpers

| Function | File | Purpose |
|----------|------|---------|
| `runQuery(sql, params)` | `config/database.js` | Execute SELECT → return rows array |
| `runSingle(sql, params)` | `config/database.js` | Execute SELECT → return single row |
| `runExecute(sql, params)` | `config/database.js` | Execute INSERT/UPDATE/DELETE → return result |
| `withTransaction(callback)` | `config/database.js` | Wrap multiple queries dalam transaction |
| `countTable(table, where, params)` | `config/database.js` | Count rows |

---

## Key Patterns

### Admin Routes
```
router.use(authenticate, authorize("admin", "superadmin"))
router.use(requireAnyPermission("key1", "key2"))
```

### Public Routes
```
router.get("/")  →  sendSuccess(res, data)
router.post("/") →  validate input → runExecute → sendSuccess
```

### Shared Helpers (`_helpers.js`)
```
listResource()    →  Generic paginated list
insertRow()       →  Generic insert
updateRow()       →  Generic update
deleteRow()       →  Generic delete
findRow()         →  Generic find by ID
buildFilters()    →  Dynamic WHERE clause
buildSort()       →  Whitelist column sorting
logAdminAction()  →  Audit trail
```

---

## Conventions

| Item | Convention |
|------|-----------|
| Route files | `camelCase.js` (e.g., `tanyaMahreen.js`) |
| Endpoints | `kebab-case` (e.g., `/api/admin/tanya-mahreen/stats`) |
| DB tables | `snake_case` (e.g., `csr_applications`) |
| DB columns | `snake_case` (e.g., `full_name`, `created_at`) |
| Error messages | Bahasa Indonesia |
| Response format | `{ data }` for success, `{ message }` for error |

### Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (no/invalid/expired token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 409 | Conflict (duplicate email, dll) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Testing

```bash
# Manual test scripts
node scripts/auth-flow-test.js    # Auth E2E test
node scripts/fk-test.cjs          # Foreign key test
node scripts/fk-audit.cjs         # FK audit
```

> **Note:** Formal testing framework (Jest/Vitest) belum di-setup. Lihat taskteam.md untuk improvement plan.

---

## Useful Commands

```bash
# Run server
node index.js

# Run with auto-restart (development)
npx nodemon index.js

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

# Test DB connection
node -e "require('./src/config/database').initDatabase().then(() => console.log('OK'))"
```
