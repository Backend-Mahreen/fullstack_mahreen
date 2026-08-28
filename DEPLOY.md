# Panduan Deployment ke Hostinger hPanel

## Arsitektur

```
mahreenindonesia.com          → Frontend (React SPA di public_html)
api.mahreenindonesia.com      → Backend (Express.js via hPanel Node.js App)
```

Frontend memanggil backend melalui subdomain `api.mahreenindonesia.com`.
Backend mengizinkan CORS dari `mahreenindonesia.com`.

---

## Persiapan

### 1. Buat Database MySQL

1. Login **hPanel** → **Databases** → **MySQL Databases**
2. Buat database: `uXXX_mahreen_indonesia_db`
3. Buat user: `uXXX_mahreen_db` + password kuat
4. Grant **All Privileges** ke user tersebut
5. Catat: **DB Host**, **DB Name**, **DB User**, **DB Password**

> Hostinger menambahkan prefix `uXXXX_` di depan nama. Gunakan nilai lengkap dari hPanel.

### 2. Buat Subdomain API

1. hPanel → **Domains** → **Subdomains** → **Create New Subdomain**
2. Subdomain: `api`
3. Domain: `mahreenindonesia.com`
4. Folder: `/public_html/api` (ini hanya placeholder, Node.js App handle request-nya)

### 3. Aktifkan SSH

1. hPanel → **Advanced** → **SSH Access** → **Enable**
2. Catat: **Port** (biasanya 6543), **Password**

---

## Step 1: Build Frontend (Local Machine)

```bash
cd frontend

# Copy .env.production ke .env
cp .env.production .env

# Install dependencies
npm ci

# Build untuk production
npm run build:api
```

> Build output ada di `frontend/dist/`.

---

## Step 2: Upload Frontend ke public_html

### Via File Manager (Browser):

1. Zip isi `frontend/dist/` → `frontend-dist.zip`
2. hPanel → **File Manager** → `public_html/`
3. Upload `frontend-dist.zip`
4. Extract di `public_html/`
5. Pastikan `index.html` ada di `/public_html/index.html`

### Via SSH (alternatif):

```bash
ssh -p 6543 username@server_idigits.hostinger.com

# Setelah build lokal, upload via scp
# (jalankan dari local machine, bukan dari SSH Hostinger)
scp -P 6543 -r frontend/dist/* username@server:~/public_html/
```

### Copy .htaccess:

Via File Manager hPanel → upload `.htaccess` dari `frontend/public/.htaccess` ke `public_html/`.

---

## Step 3: Clone Repository (SSH)

```bash
ssh -p 6543 username@server_idigits.hostinger.com

cd ~
git clone https://github.com/Backend-Mahreen/fullstack_mahreen.git mahreenindonesia.com
cd mahreenindonesia.com
```

---

## Step 4: Konfigurasi Backend

```bash
cd ~/mahreenindonesia.com

# Salin template .env
cp backend/.env.production backend/.env

# Edit .env
nano backend/.env
```

**Isi yang wajib diubah:**

| Variable | Nilai |
|----------|-------|
| `JWT_SECRET` | Secret baru (generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) |
| `CORS_ORIGIN` | `https://mahreenindonesia.com,https://www.mahreenindonesia.com` |
| `DB_HOST` | Dari hPanel (biasanya `127.0.0.1`) |
| `DB_USER` | `uXXX_mahreen_db` dari hPanel |
| `DB_PASS` | Password database dari hPanel |
| `DB_NAME` | `uXXX_mahreen_indonesia_db` dari hPanel |
| `MIDTRANS_*` | Production keys dari Midtrans dashboard |
| `NODE_ENV` | `production` |

---

## Step 5: Install Backend Dependencies

```bash
cd ~/mahreenindonesia.com/backend
npm ci --omit=dev
```

---

## Step 6: Setup hPanel Node.js App

1. hPanel → **Advanced** → **Node.js** → **Create Application**
2. Isi form:

| Field | Nilai |
|-------|-------|
| **Node.js Version** | 22 |
| **Application Mode** | Production |
| **Application Root** | `mahreenindonesia.com/backend` |
| **Application URL** | `api.mahreenindonesia.com` |
| **Application Startup File** | `index.js` |

3. Klik **"Run NPM Install"**
4. Klik **"Start"**

> Catat port yang diberikan hPanel (misal: 3001). Backend akan berjalan di port ini.

---

## Step 7: Aktifkan SSL

1. hPanel → **SSL** → **SSL Certificates**
2. Aktifkan **Let's Encrypt** untuk `mahreenindonesia.com`
3. Aktifkan **Let's Encrypt** untuk `api.mahreenindonesia.com`

---

## Step 8: Verifikasi

| Cek | URL | Yang diharapkan |
|-----|-----|-----------------|
| Frontend | `https://mahreenindonesia.com` | Halaman utama load |
| API | `https://api.mahreenindonesia.com/api/faqs` | JSON response |
| Login | `https://mahreenindonesia.com/#/login` | Form login muncul |
| Register | `https://mahreenindonesia.com/#/daftar` | Form register muncul |

---

## Default Users (otomatis di-seed)

| Role | Email | Password |
|------|-------|----------|
| Superadmin | superadmin@mahreen.com | SuperAdmin123! |
| Admin | admin@mahreen.com | Admin123! |
| Client | client@mahreen.com | Client123! |
| Intern | intern@mahreen.com | Intern123! |

> **WAJIB** ubah semua password setelah deployment pertama.

---

## Uploads Directory

Backend menyimpan file upload di `~/mahreenindonesia.com/uploads/`. Pastikan writable:

```bash
chmod -R 755 ~/mahreenindonesia.com/uploads
```

---

## Update Deployment

### Update Backend:

```bash
ssh -p 6543 username@server_idigits.hostinger.com
cd ~/mahreenindonesia.com
git pull origin main
cd backend
npm ci --omit=dev
# Restart via hPanel → Node.js → Stop lalu Start
```

### Update Frontend:

```bash
# Local machine
cd frontend
git pull origin main
npm ci
npm run build:api

# Upload via File Manager atau scp ke public_html
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `CORS error` | Pastikan `CORS_ORIGIN` di `backend/.env` mencantumkan `https://mahreenindonesia.com` |
| `Database connection refused` | Cek `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` di `backend/.env` |
| `Cannot find module` | Jalankan `npm ci --omit=dev` di `backend/` |
| API tidak merespons | Cek hPanel → Node.js → pastikan app status "Running" |
| Blank page frontend | Pastikan `.htaccess` ada di `public_html/` |
| `EACCES permission denied` | Jalankan `chmod -R 755 ~/mahreenindonesia.com/uploads` |
| 502 Bad Gateway | Backend crashed — cek hPanel → Node.js → Logs |
