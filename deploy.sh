#!/bin/bash
# ============================================================
# Deployment Script — Hostinger VPS
# ============================================================
# Jalankan dari root project: bash deploy.sh
# Pastikan sudah .env.production yang benar di backend/

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DEPLOY_DIR="/var/www/mahreenindonesia.com"
PM2_APP="mahreen-api"

echo "============================================"
echo "  Mahreen Indonesia — Deployment Script"
echo "============================================"
echo ""

# --- 1. Pre-flight checks ---
echo "[1/7] Pre-flight checks..."

if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "ERROR: backend/.env tidak ditemukan!"
  echo "Salin backend/.env.production ke backend/.env dan isi nilai yang benar."
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js tidak terinstall!"
  echo "Install: curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs"
  exit 1
fi

if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  sudo npm install -g pm2
fi

echo "  ✓ Pre-flight checks passed"
echo ""

# --- 2. Create deploy directory ---
echo "[2/7] Creating deployment directory..."
sudo mkdir -p "$DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR/backend"
sudo mkdir -p "$DEPLOY_DIR/uploads"
sudo mkdir -p "$DEPLOY_DIR/logs"
echo "  ✓ Directory created"
echo ""

# --- 3. Build frontend ---
echo "[3/7] Building frontend..."
cd "$FRONTEND_DIR"

if [ -f ".env.production" ]; then
  cp .env.production .env
fi

npm ci --production=false 2>/dev/null || npm install
npm run build:api

echo "  ✓ Frontend built"
echo ""

# --- 4. Deploy frontend dist to nginx root ---
echo "[4/7] Deploying frontend to nginx root..."
sudo mkdir -p /var/www/mahreenindonesia.com/frontend/dist
sudo rm -rf /var/www/mahreenindonesia.com/frontend/dist/*
sudo cp -r "$FRONTEND_DIR/dist/"* /var/www/mahreenindonesia.com/frontend/dist/
sudo cp "$FRONTEND_DIR/public/.htaccess" /var/www/mahreenindonesia.com/frontend/dist/.htaccess 2>/dev/null || true

echo "  ✓ Frontend deployed to /var/www/mahreenindonesia.com/frontend/dist/"
echo ""

# --- 5. Deploy backend ---
echo "[5/7] Deploying backend..."
sudo cp -r "$BACKEND_DIR/"* "$DEPLOY_DIR/backend/"
cd "$DEPLOY_DIR/backend"
sudo npm ci --omit=dev 2>/dev/null || sudo npm install --omit=dev
echo "  ✓ Backend deployed"
echo ""

# --- 6. Start/Restart with PM2 ---
echo "[6/7] Starting backend with PM2..."
cd "$PROJECT_DIR"
pm2 delete "$PM2_APP" 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup 2>/dev/null || true

echo "  ✓ PM2 process started"
echo ""

# --- 7. Reload nginx ---
echo "[7/7] Reloading nginx..."
sudo nginx -t 2>/dev/null && sudo systemctl reload nginx 2>/dev/null || true

echo "  ✓ nginx reloaded"
echo ""

echo "============================================"
echo "  Deployment selesai!"
echo "============================================"
echo ""
echo "  Frontend: https://mahreenindonesia.com"
echo "  Backend:  http://localhost:3000 (internal)"
echo "  API Docs: https://mahreenindonesia.com/api-docs/"
echo ""
echo "  PM2 commands:"
echo "    pm2 logs $PM2_APP    — Lihat logs"
echo "    pm2 monit            — Monitor real-time"
echo "    pm2 restart $PM2_APP — Restart server"
echo ""
