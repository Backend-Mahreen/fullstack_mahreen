const crypto = require('crypto');
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

let pool = null;

const initDatabase = async () => {
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;

  if (!dbUser) {
    logger.warn(
      'DB_USER tidak diatur. Menggunakan default root — tidak aman untuk produksi.',
      'database',
    );
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: dbUser || 'root',
    password: dbPass || '',
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'mahreen_indonesia'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();

  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'mahreen_indonesia',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  });

  await createTables();
  return pool;
};

const getPool = () => {
  if (!pool) throw new Error('Database belum diinisialisasi.');
  return pool;
};

const createTables = async () => {
  const p = getPool();

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      account_type VARCHAR(20) NOT NULL DEFAULT 'individual',
      full_name VARCHAR(255) NOT NULL,
      nickname VARCHAR(100) DEFAULT '',
      email VARCHAR(255) UNIQUE NOT NULL,
      whatsapp VARCHAR(50) DEFAULT '',
      password VARCHAR(255) NOT NULL,
      birth_date VARCHAR(20) DEFAULT '',
      gender VARCHAR(20) DEFAULT '',
      job_title VARCHAR(100) DEFAULT '',
      institution VARCHAR(255) DEFAULT '',
      linkedin VARCHAR(255) DEFAULT '',
      portfolio VARCHAR(255) DEFAULT '',
      instagram VARCHAR(100) DEFAULT '',
      interests JSON,
      newsletter TINYINT(1) DEFAULT 0,
      profile_photo TEXT,
      role VARCHAR(20) NOT NULL DEFAULT 'client',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS token_blacklist (
      id VARCHAR(36) PRIMARY KEY,
      token TEXT,
      token_hash CHAR(64) NOT NULL,
      token_type VARCHAR(20) NOT NULL DEFAULT 'access',
      expires_at VARCHAR(30) DEFAULT '',
      created_at VARCHAR(30) NOT NULL,
      UNIQUE KEY uq_token_blacklist_hash (token_hash)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS articles (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(500) NOT NULL,
      subtitle VARCHAR(500) DEFAULT '',
      excerpt TEXT,
      content LONGTEXT,
      category VARCHAR(100) NOT NULL,
      content_type VARCHAR(50) DEFAULT 'Article',
      tags JSON,
      image TEXT,
      featured_image TEXT,
      thumbnail TEXT,
      image_gallery JSON,
      author VARCHAR(255) DEFAULT '',
      primary_author VARCHAR(255) DEFAULT '',
      co_author VARCHAR(255) DEFAULT '',
      read_time VARCHAR(20) DEFAULT '',
      status VARCHAR(30) DEFAULT 'draft',
      views INT DEFAULT 0,
      show_on_homepage TINYINT(1) DEFAULT 1,
      featured_article TINYINT(1) DEFAULT 0,
      breaking_news_banner TINYINT(1) DEFAULT 0,
      seo_title VARCHAR(500) DEFAULT '',
      meta_description TEXT,
      og_image TEXT,
      canonical_url VARCHAR(500) DEFAULT '',
      scheduled_at VARCHAR(30) DEFAULT '',
      published_at VARCHAR(30) NOT NULL,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS webinars (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(500) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      duration VARCHAR(50) DEFAULT '',
      price INT DEFAULT 0,
      is_free TINYINT(1) DEFAULT 1,
      image TEXT,
      schedule_date VARCHAR(20) DEFAULT '',
      schedule_time VARCHAR(30) DEFAULT '',
      topics JSON,
      mentors JSON,
      timeline JSON,
      benefits JSON,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      category VARCHAR(100) DEFAULT '',
      description TEXT,
      event_date VARCHAR(20) NOT NULL,
      event_time VARCHAR(30) DEFAULT '',
      location VARCHAR(255) DEFAULT '',
      image TEXT,
      is_featured TINYINT(1) DEFAULT 0,
      access_type VARCHAR(20) DEFAULT 'FREE',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS topics (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      article_count INT DEFAULT 0,
      webinar_count INT DEFAULT 0,
      categories JSON,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      price INT NOT NULL,
      collection_name VARCHAR(255) DEFAULT '',
      category VARCHAR(100) DEFAULT '',
      image TEXT,
      is_featured TINYINT(1) DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS collection_cards (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      layout VARCHAR(50) DEFAULT 'standard',
      image TEXT,
      category VARCHAR(100) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS specializations (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS service_packages (
      id VARCHAR(36) PRIMARY KEY,
      service_key VARCHAR(100) NOT NULL,
      tier VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      features JSON,
      is_popular TINYINT(1) DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active',
      description TEXT,
      thumbnail TEXT,
      gallery JSON,
      seo_title VARCHAR(255) DEFAULT '',
      meta_description TEXT,
      visibility VARCHAR(20) DEFAULT 'public',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS service_addons (
      id VARCHAR(36) PRIMARY KEY,
      service_key VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS service_comparisons (
      id VARCHAR(36) PRIMARY KEY,
      service_key VARCHAR(100) NOT NULL,
      feature VARCHAR(255) NOT NULL,
      better_value VARCHAR(255) DEFAULT '',
      good_value VARCHAR(255) DEFAULT '',
      best_value VARCHAR(255) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS internship_batches (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'open',
      description TEXT,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS internship_applications (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      university VARCHAR(255) DEFAULT '',
      major VARCHAR(255) DEFAULT '',
      semester INT DEFAULT 0,
      specialization VARCHAR(100) DEFAULT '',
      motivation TEXT,
      portfolio_url TEXT,
      batch_id VARCHAR(36),
      status VARCHAR(20) DEFAULT 'pending',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS csr_programs (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT '',
      progress INT DEFAULT 0,
      target_beneficiaries INT DEFAULT 0,
      current_beneficiaries INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS csr_pillars (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS donations (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      donor_name VARCHAR(255) NOT NULL,
      donor_email VARCHAR(255) DEFAULT '',
      amount INT NOT NULL,
      campaign VARCHAR(255) DEFAULT '',
      payment_method VARCHAR(50) DEFAULT '',
      payment_status VARCHAR(20) DEFAULT 'pending',
      transaction_id VARCHAR(255) DEFAULT '',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS transactions (
      id VARCHAR(36) PRIMARY KEY,
      invoice_id VARCHAR(50) UNIQUE NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      client_email VARCHAR(255) DEFAULT '',
      service VARCHAR(255) DEFAULT '',
      amount INT NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      due_date VARCHAR(30) DEFAULT '',
      paid_at VARCHAR(30) DEFAULT '',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS service_orders (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      service_key VARCHAR(100) NOT NULL,
      tier VARCHAR(50) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      client_email VARCHAR(255) DEFAULT '',
      total_price INT NOT NULL,
      addons JSON,
      status VARCHAR(20) DEFAULT 'pending',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS consultations (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      service_interest VARCHAR(255) DEFAULT '',
      message TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS system_activities (
      id VARCHAR(36) PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      metadata JSON,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS faqs (
      id VARCHAR(36) PRIMARY KEY,
      question TEXT NOT NULL,
      answer LONGTEXT NOT NULL,
      category VARCHAR(100) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS donation_campaigns (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT '',
      target_amount BIGINT DEFAULT 0,
      collected_amount BIGINT DEFAULT 0,
      disbursed_amount BIGINT DEFAULT 0,
      image TEXT,
      status VARCHAR(20) DEFAULT 'active',
      start_date VARCHAR(30) DEFAULT '',
      end_date VARCHAR(30) DEFAULT '',
      location VARCHAR(255) DEFAULT '',
      pic VARCHAR(255) DEFAULT '',
      story TEXT,
      meta_description TEXT,
      gallery JSON,
      visibility VARCHAR(20) DEFAULT 'public',
      publish_schedule VARCHAR(30) DEFAULT '',
      allow_anonymous TINYINT(1) DEFAULT 1,
      notify_subscribers TINYINT(1) DEFAULT 0,
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) DEFAULT ''
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS csr_applications (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      program_id VARCHAR(36),
      role VARCHAR(100) DEFAULT '',
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      institution VARCHAR(255) DEFAULT '',
      city VARCHAR(100) DEFAULT '',
      motivation TEXT,
      portfolio_url TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      reviewed_by VARCHAR(36) DEFAULT NULL,
      reviewed_at VARCHAR(30) DEFAULT '',
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS portfolios (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(500) NOT NULL,
      client_name VARCHAR(255) DEFAULT '',
      category VARCHAR(100) DEFAULT '',
      description TEXT,
      cover_image TEXT,
      gallery JSON,
      services JSON,
      project_url VARCHAR(500) DEFAULT '',
      year VARCHAR(10) DEFAULT '',
      is_featured TINYINT(1) DEFAULT 0,
      status VARCHAR(20) DEFAULT 'published',
      sort_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS certificates (
      id VARCHAR(36) PRIMARY KEY,
      certificate_number VARCHAR(100) UNIQUE NOT NULL,
      verification_code VARCHAR(64) UNIQUE NOT NULL,
      recipient_name VARCHAR(255) NOT NULL,
      recipient_email VARCHAR(255) DEFAULT '',
      user_id VARCHAR(36),
      program_type VARCHAR(50) DEFAULT 'internship',
      program_name VARCHAR(255) DEFAULT '',
      reference_id VARCHAR(36) DEFAULT '',
      issued_at VARCHAR(30) DEFAULT '',
      expires_at VARCHAR(30) DEFAULT '',
      status VARCHAR(20) DEFAULT 'issued',
      qr_payload TEXT,
      file_url TEXT,
      verification_count INT DEFAULT 0,
      issued_by VARCHAR(36) DEFAULT NULL,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS certificate_verifications (
      id VARCHAR(36) PRIMARY KEY,
      certificate_id VARCHAR(36),
      verification_code VARCHAR(64) NOT NULL,
      result VARCHAR(20) NOT NULL,
      ip_address VARCHAR(64) DEFAULT '',
      user_agent TEXT,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR(36) PRIMARY KEY,
      event_name VARCHAR(100) NOT NULL,
      event_category VARCHAR(50) DEFAULT '',
      path VARCHAR(500) DEFAULT '',
      referrer VARCHAR(500) DEFAULT '',
      user_id VARCHAR(36),
      session_id VARCHAR(64) DEFAULT '',
      device VARCHAR(30) DEFAULT '',
      country VARCHAR(60) DEFAULT '',
      metadata JSON,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS admin_audit_logs (
      id VARCHAR(36) PRIMARY KEY,
      admin_id VARCHAR(36) DEFAULT NULL,
      admin_name VARCHAR(255) DEFAULT '',
      action VARCHAR(50) NOT NULL,
      resource VARCHAR(100) NOT NULL,
      resource_id VARCHAR(36) DEFAULT '',
      summary VARCHAR(500) DEFAULT '',
      metadata JSON,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      is_system TINYINT(1) DEFAULT 0,
      created_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS role_permissions (
      id VARCHAR(36) PRIMARY KEY,
      role_id VARCHAR(36) NOT NULL,
      permission VARCHAR(100) NOT NULL,
      created_at VARCHAR(30) NOT NULL,
      UNIQUE KEY uq_role_permission (role_id, permission)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS speakers (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL DEFAULT '',
      company VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      image TEXT,
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) NOT NULL DEFAULT ''
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      source VARCHAR(100) NOT NULL DEFAULT 'newsroom',
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at VARCHAR(30) NOT NULL,
      UNIQUE KEY uq_newsletter_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS newsroom_settings (
      id VARCHAR(36) PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL,
      setting_value TEXT,
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) NOT NULL DEFAULT '',
      UNIQUE KEY uq_setting_key (setting_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      display_order INT DEFAULT 0,
      created_at VARCHAR(30) NOT NULL,
      UNIQUE KEY uq_category_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS trusted_devices (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      device_fingerprint VARCHAR(64) NOT NULL,
      token_hash CHAR(64) NOT NULL,
      ip_address VARCHAR(64) DEFAULT '',
      user_agent TEXT,
      label VARCHAR(100) DEFAULT '',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      expires_at VARCHAR(30) NOT NULL,
      last_used_at VARCHAR(30) DEFAULT '',
      created_at VARCHAR(30) NOT NULL,
      UNIQUE KEY uq_trusted_token_hash (token_hash)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      link VARCHAR(500) DEFAULT '',
      is_read TINYINT(1) DEFAULT 0,
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_notifications_user (user_id),
      INDEX idx_notifications_read (user_id, is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      token_hash CHAR(64) NOT NULL,
      expires_at VARCHAR(30) NOT NULL,
      used TINYINT(1) DEFAULT 0,
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_prt_user (user_id),
      INDEX idx_prt_hash (token_hash)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS article_comments (
      id VARCHAR(36) PRIMARY KEY,
      article_id VARCHAR(36) NOT NULL,
      author_name VARCHAR(255) NOT NULL,
      author_email VARCHAR(255) DEFAULT '',
      content TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'approved',
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_article_comments_article (article_id),
      INDEX idx_article_comments_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS webinar_registrations (
      id VARCHAR(36) PRIMARY KEY,
      webinar_slug VARCHAR(255) NOT NULL,
      webinar_title VARCHAR(255) NOT NULL,
      webinar_category VARCHAR(100) DEFAULT '',
      webinar_price DECIMAL(12,2) DEFAULT 0,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(50) DEFAULT '',
      institution VARCHAR(255) DEFAULT '',
      profession VARCHAR(255) DEFAULT '',
      city VARCHAR(100) DEFAULT '',
      status VARCHAR(30) DEFAULT 'pending-payment',
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_wr_slug (webinar_slug),
      INDEX idx_wr_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS webinar_payments (
      id VARCHAR(36) PRIMARY KEY,
      registration_id VARCHAR(36),
      webinar_slug VARCHAR(255) NOT NULL,
      webinar_title VARCHAR(255) NOT NULL,
      participant_name VARCHAR(255) DEFAULT '',
      participant_email VARCHAR(255) DEFAULT '',
      method VARCHAR(30) DEFAULT 'qris',
      bank VARCHAR(20),
      registration_fee DECIMAL(12,2) DEFAULT 0,
      platform_fee DECIMAL(12,2) DEFAULT 0,
      discount DECIMAL(12,2) DEFAULT 0,
      total DECIMAL(12,2) DEFAULT 0,
      status VARCHAR(30) DEFAULT 'pending',
      paid_at VARCHAR(30),
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_wp_slug (webinar_slug),
      INDEX idx_wp_registration (registration_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS studio_orders (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      product_id VARCHAR(36),
      product_name VARCHAR(255) NOT NULL,
      variant VARCHAR(100) DEFAULT '',
      quantity INT DEFAULT 1,
      total_price INT NOT NULL,
      shipping_name VARCHAR(255) DEFAULT '',
      shipping_address TEXT,
      shipping_city VARCHAR(100) DEFAULT '',
      shipping_province VARCHAR(100) DEFAULT '',
      shipping_postal VARCHAR(10) DEFAULT '',
      tracking_number VARCHAR(100) DEFAULT '',
      status VARCHAR(20) DEFAULT 'confirmed',
      payment_method VARCHAR(50) DEFAULT '',
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) DEFAULT ''
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS event_registrations (
      id VARCHAR(36) PRIMARY KEY,
      event_id VARCHAR(36) NOT NULL,
      event_title VARCHAR(500) NOT NULL,
      event_date VARCHAR(20) DEFAULT '',
      event_location VARCHAR(255) DEFAULT '',
      event_access_type VARCHAR(20) DEFAULT 'FREE',
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      institution VARCHAR(255) DEFAULT '',
      status VARCHAR(30) DEFAULT 'pending-payment',
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) DEFAULT '',
      INDEX idx_er_event (event_id),
      INDEX idx_er_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS contact_inquiries (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255) DEFAULT '',
      partnership VARCHAR(100) DEFAULT '',
      details TEXT,
      status VARCHAR(20) DEFAULT 'new',
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_contact_status (status),
      INDEX idx_contact_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS support_tickets (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT '',
      message TEXT,
      status VARCHAR(20) DEFAULT 'open',
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_support_status (status),
      INDEX idx_support_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS event_payments (
      id VARCHAR(36) PRIMARY KEY,
      registration_id VARCHAR(36) NOT NULL,
      event_id VARCHAR(36) NOT NULL,
      event_title VARCHAR(500) NOT NULL,
      participant_name VARCHAR(255) DEFAULT '',
      participant_email VARCHAR(255) DEFAULT '',
      midtrans_order_id VARCHAR(100) DEFAULT '',
      midtrans_transaction_id VARCHAR(100) DEFAULT '',
      method VARCHAR(30) DEFAULT 'qris',
      amount DECIMAL(12,2) DEFAULT 0,
      status VARCHAR(30) DEFAULT 'pending',
      paid_at VARCHAR(30),
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) DEFAULT '',
      INDEX idx_ep_registration (registration_id),
      INDEX idx_ep_event (event_id),
      INDEX idx_ep_midtrans_order (midtrans_order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ];

  for (const sql of tables) {
    await p.execute(sql);
  }

  await runSchemaMigrations(p);
  await ensureIndexes(p);
  await ensureForeignKeys(p);
};

const ensureColumns = async (p, table, columns) => {
  const [existing] = await p.query(
    `SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table],
  );

  const present = new Set(existing.map((row) => row.name));

  for (const col of columns) {
    if (present.has(col.name)) continue;
    try {
      await p.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col.name}\` ${col.def}`);
    } catch (error) {
      logger.warn(`Migrasi kolom ${table}.${col.name} gagal: ${error.message}`, 'database');
    }
  }
};

const schemaMigrations = {
  articles: [
    { name: 'subtitle', def: "VARCHAR(500) DEFAULT ''" },
    { name: 'content_type', def: "VARCHAR(50) DEFAULT 'Article'" },
    { name: 'tags', def: 'JSON' },
    { name: 'featured_image', def: 'TEXT' },
    { name: 'thumbnail', def: 'TEXT' },
    { name: 'image_gallery', def: 'JSON' },
    { name: 'primary_author', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'co_author', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'status', def: "VARCHAR(30) DEFAULT 'draft'" },
    { name: 'views', def: 'INT DEFAULT 0' },
    { name: 'show_on_homepage', def: 'TINYINT(1) DEFAULT 1' },
    { name: 'featured_article', def: 'TINYINT(1) DEFAULT 0' },
    { name: 'breaking_news_banner', def: 'TINYINT(1) DEFAULT 0' },
    { name: 'seo_title', def: "VARCHAR(500) DEFAULT ''" },
    { name: 'meta_description', def: 'TEXT' },
    { name: 'og_image', def: 'TEXT' },
    { name: 'canonical_url', def: "VARCHAR(500) DEFAULT ''" },
    { name: 'scheduled_at', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'edited_by', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'edited_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  users: [
    { name: 'status', def: "VARCHAR(20) NOT NULL DEFAULT 'active'" },
    { name: 'last_login_at', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'email_verified', def: 'TINYINT(1) DEFAULT 0' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'permissions', def: 'JSON' },
    { name: 'avatar_url', def: 'TEXT' },
  ],
  products: [
    { name: 'stock', def: 'INT DEFAULT 0' },
    { name: 'sku', def: "VARCHAR(100) DEFAULT ''" },
    { name: 'status', def: "VARCHAR(20) DEFAULT 'published'" },
    { name: 'gallery', def: 'JSON' },
    { name: 'sold_count', def: 'INT DEFAULT 0' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  transactions: [
    { name: 'user_id', def: 'VARCHAR(36) DEFAULT NULL' },
    { name: 'payment_method', def: "VARCHAR(50) DEFAULT ''" },
    { name: 'notes', def: 'TEXT' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  consultations: [
    { name: 'consultation_type', def: "VARCHAR(50) DEFAULT 'free'" },
    { name: 'preferred_date', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'handled_by', def: "VARCHAR(36) DEFAULT ''" },
    { name: 'admin_notes', def: 'TEXT' },
    { name: 'institution', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'city', def: "VARCHAR(100) DEFAULT ''" },
    { name: 'assigned_pm', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'priority', def: "VARCHAR(20) DEFAULT 'normal'" },
    { name: 'budget_label', def: "VARCHAR(50) DEFAULT ''" },
    { name: 'service_category', def: "VARCHAR(100) DEFAULT ''" },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  service_packages: [
    { name: 'status', def: "VARCHAR(20) DEFAULT 'active'" },
    { name: 'description', def: 'TEXT' },
    { name: 'thumbnail', def: 'TEXT' },
    { name: 'gallery', def: 'JSON' },
    { name: 'seo_title', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'meta_description', def: 'TEXT' },
    { name: 'visibility', def: "VARCHAR(20) DEFAULT 'public'" },
  ],
  service_orders: [
    { name: 'invoice_id', def: "VARCHAR(50) DEFAULT ''" },
    { name: 'notes', def: 'TEXT' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  donations: [
    { name: 'campaign_id', def: 'VARCHAR(36) DEFAULT NULL' },
    { name: 'is_anonymous', def: 'TINYINT(1) DEFAULT 0' },
    { name: 'message', def: 'TEXT' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  topics: [
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'icon', def: 'TEXT' },
  ],
  internship_applications: [
    { name: 'cv_url', def: 'TEXT' },
    { name: 'portfolio_url', def: 'TEXT' },
    { name: 'motivation_letter_url', def: 'TEXT' },
    { name: 'reviewed_by', def: 'VARCHAR(36) DEFAULT NULL' },
    { name: 'reviewed_at', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'admin_notes', def: 'TEXT' },
  ],
  internship_batches: [
    { name: 'quota', def: 'INT DEFAULT 0' },
    { name: 'start_date', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'end_date', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'mentor_name', def: "VARCHAR(255) DEFAULT ''" },
  ],
  csr_programs: [
    { name: 'image', def: 'TEXT' },
    { name: 'location', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'budget', def: 'BIGINT DEFAULT 0' },
    { name: 'start_date', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'end_date', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  csr_applications: [
    { name: 'focus_area', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'province', def: "VARCHAR(100) DEFAULT ''" },
    { name: 'vision', def: 'TEXT' },
    { name: 'document_file_id', def: "VARCHAR(255) DEFAULT ''" },
  ],
  webinars: [
    { name: 'status', def: "VARCHAR(20) DEFAULT 'published'" },
    { name: 'quota', def: 'INT DEFAULT 0' },
    { name: 'registered_count', def: 'INT DEFAULT 0' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  events: [
    { name: 'status', def: "VARCHAR(20) DEFAULT 'published'" },
    { name: 'quota', def: 'INT DEFAULT 0' },
    { name: 'price', def: 'INT DEFAULT 0' },
    { name: 'updated_at', def: "VARCHAR(30) DEFAULT ''" },
  ],
  donation_campaigns: [
    { name: 'location', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'pic', def: "VARCHAR(255) DEFAULT ''" },
    { name: 'story', def: 'TEXT' },
    { name: 'meta_description', def: 'TEXT' },
    { name: 'gallery', def: 'JSON' },
    { name: 'visibility', def: "VARCHAR(20) DEFAULT 'public'" },
    { name: 'publish_schedule', def: "VARCHAR(30) DEFAULT ''" },
    { name: 'allow_anonymous', def: 'TINYINT(1) DEFAULT 1' },
    { name: 'notify_subscribers', def: 'TINYINT(1) DEFAULT 0' },
  ],
  newsletter_subscribers: [{ name: 'name', def: "VARCHAR(255) DEFAULT ''" }],
};

/**
 * Kolom referensi yang harus nullable agar foreign key dapat dipasang.
 * Database lama membuat kolom ini dengan DEFAULT '' sehingga perlu diselaraskan.
 */
const nullableReferenceColumns = [
  { table: 'donations', column: 'user_id' },
  { table: 'donations', column: 'campaign_id' },
  { table: 'transactions', column: 'user_id' },
  { table: 'internship_applications', column: 'user_id' },
  { table: 'internship_applications', column: 'batch_id' },
  { table: 'internship_applications', column: 'reviewed_by' },
  { table: 'csr_applications', column: 'user_id' },
  { table: 'csr_applications', column: 'program_id' },
  { table: 'csr_applications', column: 'reviewed_by' },
  { table: 'consultations', column: 'user_id' },
  { table: 'service_orders', column: 'user_id' },
  { table: 'certificates', column: 'user_id' },
  { table: 'certificates', column: 'issued_by' },
  { table: 'certificate_verifications', column: 'certificate_id' },
  { table: 'admin_audit_logs', column: 'admin_id' },
  { table: 'analytics_events', column: 'user_id' },
  { table: 'trusted_devices', column: 'user_id' },
];

const alignNullableReferenceColumns = async (p) => {
  for (const target of nullableReferenceColumns) {
    try {
      await p.query(
        `ALTER TABLE \`${target.table}\`
         MODIFY COLUMN \`${target.column}\` VARCHAR(36) NULL DEFAULT NULL`,
      );
    } catch (error) {
      logger.warn(
        `Penyelarasan kolom ${target.table}.${target.column} gagal: ${error.message}`,
        'database',
      );
    }
  }
};

/**
 * Memigrasikan token_blacklist dari penyimpanan token mentah ke hash.
 *
 * Versi awal menyimpan token pada kolom TEXT tanpa index sehingga setiap
 * pemeriksaan memicu full table scan. Kolom hash berukuran tetap dapat
 * diindeks penuh dan tidak menyimpan token aktif dalam bentuk terbaca.
 */
const migrateTokenBlacklist = async (p) => {
  const [columns] = await p.query(
    `SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'token_blacklist'`,
  );
  const present = new Set(columns.map((row) => row.name));

  if (!present.has('token_hash')) {
    await p.query('ALTER TABLE token_blacklist ADD COLUMN token_hash CHAR(64) NULL');
  }
  if (!present.has('token_type')) {
    await p.query(
      "ALTER TABLE token_blacklist ADD COLUMN token_type VARCHAR(20) NOT NULL DEFAULT 'access'",
    );
  }
  if (!present.has('expires_at')) {
    await p.query("ALTER TABLE token_blacklist ADD COLUMN expires_at VARCHAR(30) DEFAULT ''");
  }

  // Add token column if missing (older tables may not have it)
  if (!present.has('token')) {
    await p.query('ALTER TABLE token_blacklist ADD COLUMN token TEXT');
  }

  // Isi hash untuk baris lama yang masih menyimpan token mentah.
  const [pending] = await p.query(
    `SELECT id, token FROM token_blacklist
     WHERE token_hash IS NULL AND token IS NOT NULL AND token <> ''`,
  );

  for (const row of pending) {
    const hash = crypto.createHash('sha256').update(String(row.token)).digest('hex');
    try {
      await p.query("UPDATE token_blacklist SET token_hash = ?, token = '' WHERE id = ?", [
        hash,
        row.id,
      ]);
    } catch {
      // Hash duplikat berarti token sama sudah tercatat, baris ini dapat dibuang.
      await p.query('DELETE FROM token_blacklist WHERE id = ?', [row.id]);
    }
  }

  // Baris tanpa token maupun hash tidak dapat dipakai untuk pencocokan.
  await p.query('DELETE FROM token_blacklist WHERE token_hash IS NULL');

  try {
    await p.query('ALTER TABLE token_blacklist MODIFY COLUMN token_hash CHAR(64) NOT NULL');
  } catch (error) {
    logger.warn(`Penyesuaian token_blacklist.token_hash gagal: ${error.message}`, 'database');
  }

  try {
    await p.query('ALTER TABLE token_blacklist MODIFY COLUMN token TEXT NULL');
  } catch {
    // Kolom sudah nullable.
  }

  const [indexes] = await p.query(
    `SELECT INDEX_NAME AS name FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'token_blacklist'`,
  );

  if (!indexes.some((row) => row.name === 'uq_token_blacklist_hash')) {
    try {
      await p.query(
        'ALTER TABLE token_blacklist ADD UNIQUE KEY uq_token_blacklist_hash (token_hash)',
      );
    } catch (error) {
      logger.warn(`Pembuatan unique key token_blacklist gagal: ${error.message}`, 'database');
    }
  }

  // Index lama pada prefix TEXT tidak lagi diperlukan.
  if (indexes.some((row) => row.name === 'idx_token_blacklist_token')) {
    try {
      await p.query('DROP INDEX idx_token_blacklist_token ON token_blacklist');
    } catch {
      // Index sudah tidak ada.
    }
  }

  // Drop kolom token TEXT lama jika masih ada (sudah digantikan token_hash).
  const [cols] = await p.query(
    `SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'token_blacklist' AND COLUMN_NAME = 'token'`,
  );
  if (cols.length > 0) {
    try {
      await p.query('ALTER TABLE token_blacklist DROP COLUMN token');
    } catch {
      // Kolom sudah tidak ada atau tidak bisa di-drop.
    }
  }
};

/**
 * Memperbaiki foreign key fk_role_permissions_role.
 *
 * Versi awal menggunakan ON DELETE SET NULL, tetapi role_permissions.role_id
 * adalah NOT NULL sehingga MySQL menolak pembuatan constraint.
 * FK di-drop lalu dibuat ulang dengan ON DELETE CASCADE.
 */
const migrateRolePermissionsForeignKey = async (p) => {
  try {
    const [fks] = await p.query(
      `SELECT CONSTRAINT_NAME AS name, DELETE_RULE AS deleteRule
       FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
       JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
         ON tc.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
       WHERE tc.TABLE_SCHEMA = DATABASE()
         AND tc.TABLE_NAME = 'role_permissions'
         AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
         AND rc.CONSTRAINT_NAME = 'fk_role_permissions_role'`,
    );

    if (fks.length > 0 && fks[0].deleteRule !== 'CASCADE') {
      await p.query('ALTER TABLE role_permissions DROP FOREIGN KEY fk_role_permissions_role');
      logger.info('Foreign key lama fk_role_permissions_role (SET NULL) di-drop.');
    }
  } catch {
    // FK belum ada atau gagal di-drop — biarkan ensureForeignKeys yang buat baru.
  }
};

const runSchemaMigrations = async (p) => {
  for (const [table, columns] of Object.entries(schemaMigrations)) {
    await ensureColumns(p, table, columns);
  }

  await alignNullableReferenceColumns(p);
  await migrateTokenBlacklist(p);
  await migrateRolePermissionsForeignKey(p);
};

const indexDefinitions = [
  { table: 'articles', name: 'idx_articles_status', columns: 'status' },
  { table: 'articles', name: 'idx_articles_category', columns: 'category' },
  { table: 'articles', name: 'idx_articles_created', columns: 'created_at' },
  { table: 'users', name: 'idx_users_role', columns: 'role' },
  { table: 'users', name: 'idx_users_status', columns: 'status' },
  { table: 'transactions', name: 'idx_transactions_status', columns: 'status' },
  { table: 'transactions', name: 'idx_transactions_created', columns: 'created_at' },
  { table: 'donations', name: 'idx_donations_status', columns: 'payment_status' },
  { table: 'donations', name: 'idx_donations_campaign', columns: 'campaign_id' },
  { table: 'internship_applications', name: 'idx_intern_apps_status', columns: 'status' },
  { table: 'internship_applications', name: 'idx_intern_apps_batch', columns: 'batch_id' },
  { table: 'csr_applications', name: 'idx_csr_apps_status', columns: 'status' },
  { table: 'consultations', name: 'idx_consultations_status', columns: 'status' },
  { table: 'service_orders', name: 'idx_service_orders_status', columns: 'status' },
  { table: 'products', name: 'idx_products_category', columns: 'category' },
  { table: 'certificates', name: 'idx_certificates_status', columns: 'status' },
  { table: 'analytics_events', name: 'idx_analytics_created', columns: 'created_at' },
  { table: 'analytics_events', name: 'idx_analytics_event', columns: 'event_name' },
  { table: 'admin_audit_logs', name: 'idx_audit_created', columns: 'created_at' },
  { table: 'system_activities', name: 'idx_activities_created', columns: 'created_at' },

  // Index pada kolom foreign key. MySQL memerlukan index pada kolom
  // referensi sebelum constraint dapat dibuat.
  { table: 'donations', name: 'idx_donations_user', columns: 'user_id' },
  { table: 'transactions', name: 'idx_transactions_user', columns: 'user_id' },
  { table: 'internship_applications', name: 'idx_intern_apps_user', columns: 'user_id' },
  { table: 'csr_applications', name: 'idx_csr_apps_user', columns: 'user_id' },
  { table: 'csr_applications', name: 'idx_csr_apps_program', columns: 'program_id' },
  { table: 'csr_applications', name: 'idx_csr_apps_reviewer', columns: 'reviewed_by' },
  { table: 'consultations', name: 'idx_consultations_user', columns: 'user_id' },
  { table: 'service_orders', name: 'idx_service_orders_user', columns: 'user_id' },
  { table: 'certificates', name: 'idx_certificates_user', columns: 'user_id' },
  { table: 'certificates', name: 'idx_certificates_issuer', columns: 'issued_by' },
  { table: 'certificates', name: 'idx_certificates_reference', columns: 'reference_id' },
  {
    table: 'certificate_verifications',
    name: 'idx_cert_verif_certificate',
    columns: 'certificate_id',
  },
  { table: 'admin_audit_logs', name: 'idx_audit_admin', columns: 'admin_id' },
  { table: 'analytics_events', name: 'idx_analytics_user', columns: 'user_id' },
  { table: 'analytics_events', name: 'idx_analytics_session', columns: 'session_id' },

  // Index tambahan untuk kolom yang sering difilter namun belum terindeks.
  { table: 'donation_campaigns', name: 'idx_campaigns_status', columns: 'status' },
  { table: 'webinars', name: 'idx_webinars_status', columns: 'status' },
  { table: 'events', name: 'idx_events_status', columns: 'status' },
  { table: 'internship_applications', name: 'idx_intern_apps_email', columns: 'email' },
  { table: 'csr_applications', name: 'idx_csr_apps_email', columns: 'email' },

  // Index untuk tabel roles & role_permissions.
  { table: 'role_permissions', name: 'idx_role_perms_role', columns: 'role_id' },
  { table: 'roles', name: 'idx_roles_slug', columns: 'slug' },

  // Index untuk tabel trusted_devices.
  { table: 'trusted_devices', name: 'idx_trusted_user', columns: 'user_id' },
  { table: 'trusted_devices', name: 'idx_trusted_fp', columns: 'user_id, device_fingerprint' },
];

const ensureIndexes = async (p) => {
  const [rows] = await p.query(
    `SELECT TABLE_NAME AS tableName, INDEX_NAME AS indexName
     FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE()`,
  );

  const present = new Set(rows.map((row) => `${row.tableName}.${row.indexName}`));

  for (const idx of indexDefinitions) {
    if (present.has(`${idx.table}.${idx.name}`)) continue;
    try {
      await p.query(`CREATE INDEX \`${idx.name}\` ON \`${idx.table}\` (${idx.columns})`);
    } catch (error) {
      logger.warn(`Pembuatan index ${idx.name} gagal: ${error.message}`, 'database');
    }
  }
};

/**
 * Definisi relasi antar tabel.
 *
 * Semua kolom referensi bersifat nullable, sehingga ON DELETE SET NULL dipakai
 * agar penghapusan baris induk tidak menghapus data historis anak
 * (donasi, transaksi, sertifikat, dan audit log tetap tersimpan).
 */
const foreignKeyDefinitions = [
  {
    name: 'fk_donations_user',
    table: 'donations',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_donations_campaign',
    table: 'donations',
    column: 'campaign_id',
    refTable: 'donation_campaigns',
    refColumn: 'id',
  },
  {
    name: 'fk_transactions_user',
    table: 'transactions',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_intern_apps_user',
    table: 'internship_applications',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_intern_apps_batch',
    table: 'internship_applications',
    column: 'batch_id',
    refTable: 'internship_batches',
    refColumn: 'id',
  },
  {
    name: 'fk_csr_apps_user',
    table: 'csr_applications',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_csr_apps_program',
    table: 'csr_applications',
    column: 'program_id',
    refTable: 'csr_programs',
    refColumn: 'id',
  },
  {
    name: 'fk_csr_apps_reviewer',
    table: 'csr_applications',
    column: 'reviewed_by',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_consultations_user',
    table: 'consultations',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_service_orders_user',
    table: 'service_orders',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_certificates_user',
    table: 'certificates',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_certificates_issuer',
    table: 'certificates',
    column: 'issued_by',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_cert_verif_certificate',
    table: 'certificate_verifications',
    column: 'certificate_id',
    refTable: 'certificates',
    refColumn: 'id',
  },
  {
    name: 'fk_audit_admin',
    table: 'admin_audit_logs',
    column: 'admin_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_analytics_user',
    table: 'analytics_events',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_role_permissions_role',
    table: 'role_permissions',
    column: 'role_id',
    refTable: 'roles',
    refColumn: 'id',
    onDelete: 'CASCADE',
  },
  {
    name: 'fk_trusted_user',
    table: 'trusted_devices',
    column: 'user_id',
    refTable: 'users',
    refColumn: 'id',
  },
  {
    name: 'fk_article_comments_article',
    table: 'article_comments',
    column: 'article_id',
    refTable: 'articles',
    refColumn: 'id',
    onDelete: 'CASCADE',
  },
];

/**
 * Menormalkan kolom referensi sebelum constraint dipasang.
 *
 * Foreign key tidak dapat mereferensikan string kosong, sehingga nilai ''
 * harus diubah menjadi NULL. Baris yang menunjuk induk yang sudah terhapus
 * (orphan) juga di-NULL-kan agar constraint dapat dibuat.
 */
const normalizeForeignKeyColumn = async (p, fk) => {
  const [emptyResult] = await p.query(
    `UPDATE \`${fk.table}\` SET \`${fk.column}\` = NULL WHERE \`${fk.column}\` = ''`,
  );

  const [orphanResult] = await p.query(
    `UPDATE \`${fk.table}\` child
     LEFT JOIN \`${fk.refTable}\` parent ON parent.\`${fk.refColumn}\` = child.\`${fk.column}\`
     SET child.\`${fk.column}\` = NULL
     WHERE child.\`${fk.column}\` IS NOT NULL AND parent.\`${fk.refColumn}\` IS NULL`,
  );

  const emptied = emptyResult.affectedRows || 0;
  const orphaned = orphanResult.affectedRows || 0;

  if (emptied > 0 || orphaned > 0) {
    logger.info(
      `Normalisasi ${fk.table}.${fk.column}: ${emptied} string kosong, ${orphaned} orphan di-set NULL.`,
    );
  }
};

const ensureForeignKeys = async (p) => {
  const [existing] = await p.query(
    `SELECT CONSTRAINT_NAME AS name FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE() AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
  );

  const present = new Set(existing.map((row) => row.name));

  for (const fk of foreignKeyDefinitions) {
    if (present.has(fk.name)) continue;

    try {
      await normalizeForeignKeyColumn(p, fk);

      await p.query(
        `ALTER TABLE \`${fk.table}\`
         ADD CONSTRAINT \`${fk.name}\`
         FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.refTable}\` (\`${fk.refColumn}\`)
         ON DELETE ${fk.onDelete || 'SET NULL'} ON UPDATE CASCADE`,
      );

      logger.info(`Foreign key ${fk.name} dibuat (${fk.table}.${fk.column} -> ${fk.refTable}.id).`);
    } catch (error) {
      logger.warn(`Pembuatan foreign key ${fk.name} gagal: ${error.message}`, 'database');
    }
  }
};

const runQuery = async (sql, params = []) => {
  const [rows] = await getPool().query(sql, params);
  return rows;
};

const runSingle = async (sql, params = []) => {
  const rows = await runQuery(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

const runExecute = async (sql, params = []) => {
  const [result] = await getPool().query(sql, params);
  return result;
};

const countTable = async (table) => {
  const result = await runSingle(`SELECT COUNT(*) as count FROM \`${table}\``);
  return result ? result.count : 0;
};

const withTransaction = async (handler) => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await handler(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  initDatabase,
  getPool,
  runQuery,
  runSingle,
  runExecute,
  countTable,
  withTransaction,
};
