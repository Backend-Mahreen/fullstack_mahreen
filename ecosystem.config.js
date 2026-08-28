// ============================================================
// PM2 Ecosystem Config — Hostinger VPS Deployment
// ============================================================
// Jalankan dengan: pm2 start ecosystem.config.js
// Monitor: pm2 monit
// Logs: pm2 logs mahreen-api
// Restart: pm2 restart mahreen-api

module.exports = {
  apps: [
    {
      name: 'mahreen-api',
      script: './backend/index.js',
      cwd: __dirname,
      instances: 1, // MySQL connection pool sudah handle concurrent
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: './backend/.env',
      // Logging
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Restart on crash
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
