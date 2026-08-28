const { runExecute, runSingle, runQuery } = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { ALL_PERMISSIONS } = require('../middleware/permissions');
const logger = require('../utils/logger');

const ensureSuperAdminExists = async () => {
  const existing = await runSingle("SELECT id FROM users WHERE role = 'superadmin'");
  if (existing) return;

  const salt = await bcrypt.genSalt(10);
  const now = new Date().toISOString();
  const id = uuidv4();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let pw = 'A1!';
  for (let i = 0; i < 14; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  const hashedPassword = await bcrypt.hash(pw, salt);

  await runExecute(
    `INSERT INTO users (id, account_type, full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, 'company', 'Super Admin', 'superadmin@mahreen.id', hashedPassword, 'superadmin', now],
  );
  logger.info('Superadmin default dibuat: superadmin@mahreen.id');
  logger.info(`Password superadmin: ${pw}`);
  logger.info('CATATAN: Simpan password ini dan ganti setelah login pertama.');
};

/**
 * Memastikan 4 role default ada di tabel roles + role_permissions.
 * Dipanggil setiap kali server start — idempoten.
 */
const ensureDefaultRolesExist = async () => {
  const roleCount = await runSingle('SELECT COUNT(*) as count FROM roles');
  if (roleCount && roleCount.count > 0) return;

  const now = new Date().toISOString();
  const adminPerms = ALL_PERMISSIONS.filter((p) => p !== 'users.manage_role');

  const defaults = [
    {
      name: 'Super Admin',
      slug: 'superadmin',
      desc: 'Akses penuh ke seluruh modul sistem.',
      perms: ALL_PERMISSIONS,
    },
    {
      name: 'Admin',
      slug: 'admin',
      desc: 'Akses hampir seluruh modul, kecuali manajemen peran pengguna.',
      perms: adminPerms,
    },
    {
      name: 'Client',
      slug: 'client',
      desc: 'Portal klien untuk melihat pesanan, donasi, dan sertifikat.',
      perms: ['view_overview'],
    },
    {
      name: 'Intern',
      slug: 'intern',
      desc: 'Portal peserta magang untuk melihat status pendaftaran.',
      perms: ['view_overview'],
    },
  ];

  for (const role of defaults) {
    const roleId = uuidv4();
    await runExecute(
      `INSERT INTO roles (id, name, slug, description, is_system, created_at) VALUES (?, ?, ?, ?, 1, ?)`,
      [roleId, role.name, role.slug, role.desc, now],
    );
    for (const perm of role.perms) {
      await runExecute(
        `INSERT INTO role_permissions (id, role_id, permission, created_at) VALUES (?, ?, ?, ?)`,
        [uuidv4(), roleId, perm, now],
      );
    }
  }
  logger.info(`${defaults.length} role default berhasil dibuat.`);
};

/**
 * Menjamin permission baru tersedia untuk role yang sudah ada (idempoten).
 *
 * Permission yang ditambahkan setelah database pertama kali di-seed tidak
 * otomatis muncul pada role default. Fungsi ini meng-grant permission baru
 * ke role admin & superadmin tanpa menyentuh data lain, dan aman dijalankan
 * setiap server start karena memakai unique constraint (role_id, permission).
 */
const ensureNewPermissionsGranted = async () => {
  const newPermissions = ['contact_inquiries.manage', 'support_tickets.manage'];

  const roles = await runQuery("SELECT id, slug FROM roles WHERE slug IN ('admin', 'superadmin')");
  if (roles.length === 0) return;

  const now = new Date().toISOString();
  for (const role of roles) {
    for (const permission of newPermissions) {
      const existing = await runSingle(
        'SELECT id FROM role_permissions WHERE role_id = ? AND permission = ?',
        [role.id, permission],
      );
      if (existing) continue;
      await runExecute(
        'INSERT INTO role_permissions (id, role_id, permission, created_at) VALUES (?, ?, ?, ?)',
        [uuidv4(), role.id, permission, now],
      );
    }
  }

  logger.info(`Permission baru digrant ke role admin/superadmin: ${newPermissions.join(', ')}.`);
};

/**
 * Backfill konten webinar yang dibuat sebelum kolom topics/mentors/timeline/
 * benefits diisi. Idempoten: hanya mengisi kolom yang masih kosong/JSON kosong,
 * tidak menimpa data yang sudah ada.
 */
const backfillWebinarContent = async () => {
  const webinars = await runQuery('SELECT id, slug FROM webinars');
  const now = new Date().toISOString();

  const enriched = {
    'workshop-branding-digital': {
      description:
        'Workshop praktis membangun identitas brand digital yang kuat untuk bisnis Anda.',
      topics: ['Branding', 'Strategi Visual', 'Digital Marketing'],
      mentors: [
        {
          name: 'Ahmad Sulaiman',
          role: 'Head of Digital Marketing',
          company: 'TechVantage Indonesia',
          image: '',
          quote: 'Brand yang kuat dimulai dari kejelasan identitas.',
          bio: '12+ tahun pengalaman digital marketing.',
          profileHref: '/newsroom',
        },
      ],
      timeline: [
        {
          title: 'Pengenalan Branding',
          description: 'Konsep dasar dan pentingnya identitas brand.',
          date: '09:00-09:45',
        },
        {
          title: 'Sesi Praktik',
          description: 'Latihan menyusun brand brief dan moodboard.',
          date: '09:45-11:00',
        },
        {
          title: 'Presentasi & Feedback',
          description: 'Review hasil karya peserta oleh mentor.',
          date: '11:00-12:00',
        },
      ],
      benefits: [
        'Sertifikat Workshop',
        'Template Brand Brief',
        'Akses materi selamanya',
        'Konsultasi 1x1',
      ],
    },
    'webinar-ui-ux-fundamentals': {
      description: 'Memahami dasar-dasar UI/UX design dan prinsip pengalaman pengguna modern.',
      topics: ['UI/UX', 'Design Thinking', 'Prototyping'],
      mentors: [
        {
          name: 'Siti Aminah',
          role: 'Senior Product Designer',
          company: 'Glow Studio',
          image: '',
          quote: 'Desain terbaik adalah desain yang tidak terasa.',
          bio: 'Specialist UI/UX untuk produk digital premium.',
          profileHref: '/newsroom',
        },
      ],
      timeline: [
        {
          title: 'Dasar UI/UX',
          description: 'Prinsip visual dan alur pengguna.',
          date: '14:00-14:40',
        },
        {
          title: 'Design Thinking',
          description: 'Empathize, define, ideate, prototype, test.',
          date: '14:40-15:30',
        },
        {
          title: 'Tanya Jawab',
          description: 'Sesi interaktif dengan mentor.',
          date: '15:30-16:00',
        },
      ],
      benefits: ['Akses gratis', 'Materi PDF', 'Rekaman sesi', 'Grup diskusi'],
    },
    'seminar-ai-for-business': {
      description: 'Seminar penerapan kecerdasan buatan untuk meningkatkan efisiensi bisnis.',
      topics: ['AI', 'Machine Learning', 'Otomasi Bisnis'],
      mentors: [
        {
          name: 'Budi Prakoso',
          role: 'AI Consultant',
          company: 'NexData',
          image: '',
          quote: 'AI adalah alat, manusia adalah pemilik keputusan.',
          bio: 'Konsultan AI untuk perusahaan Fortune 500.',
          profileHref: '/newsroom',
        },
      ],
      timeline: [
        {
          title: 'Pengantar AI',
          description: 'Evolusi dan potensi AI di dunia bisnis.',
          date: '10:00-10:45',
        },
        {
          title: 'Studi Kasus',
          description: 'Implementasi AI pada operasional nyata.',
          date: '10:45-11:45',
        },
        {
          title: 'Roadmap & Diskusi',
          description: 'Menyusun rencana adopsi AI.',
          date: '11:45-12:30',
        },
      ],
      benefits: [
        'Sertifikat Seminar',
        'E-Book AI for Business',
        'Template Roadmap AI',
        'Akses komunitas',
      ],
    },
  };

  for (const webinar of webinars) {
    const content = enriched[webinar.slug];
    if (!content) continue;

    const current = await runSingle('SELECT * FROM webinars WHERE id = ?', [webinar.id]);
    const isEmptyJson = (value) => !value || value === '[]' || value === '' || value === 'null';
    const updates = [];
    const params = [];

    if (!current.description) {
      updates.push('description = ?');
      params.push(content.description);
    }
    if (isEmptyJson(String(current.topics || ''))) {
      updates.push('topics = ?');
      params.push(JSON.stringify(content.topics));
    }
    if (isEmptyJson(String(current.mentors || ''))) {
      updates.push('mentors = ?');
      params.push(JSON.stringify(content.mentors));
    }
    if (isEmptyJson(String(current.timeline || ''))) {
      updates.push('timeline = ?');
      params.push(JSON.stringify(content.timeline));
    }
    if (isEmptyJson(String(current.benefits || ''))) {
      updates.push('benefits = ?');
      params.push(JSON.stringify(content.benefits));
    }

    if (updates.length === 0) continue;
    params.push(now, webinar.id);
    await runExecute(
      `UPDATE webinars SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`,
      params,
    );
  }

  logger.info('Backfill konten webinar selesai (idempoten).');
};

const seedDatabase = async () => {
  const userCount = await runSingle('SELECT COUNT(*) as count FROM users');

  if (userCount && userCount.count > 0) {
    // Fast path: skip all seed checks if users + roles already exist.
    const roleCount = await runSingle('SELECT COUNT(*) as count FROM roles');
    if (roleCount && roleCount.count > 0) {
      await ensureNewPermissionsGranted();
      await backfillWebinarContent();
      logger.info('Database sudah terisi, skip seeding.');
      return;
    }
    logger.info('Tabel users sudah terisi, lanjut ke pemeriksaan role & modul admin.');
    await ensureSuperAdminExists();
    await ensureDefaultRolesExist();
    await ensureNewPermissionsGranted();
    await seedAdminModulesIfEmpty();
    return;
  }

  const now = new Date().toISOString();
  const salt = await bcrypt.genSalt(10);

  const adminId = uuidv4();
  const superAdminId = uuidv4();
  const clientId = uuidv4();
  const internId = uuidv4();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pw = 'A1!';
    for (let i = 0; i < 14; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    return pw;
  };

  const adminPassword = await bcrypt.hash(generatePassword(), salt);
  const superAdminPassword = await bcrypt.hash(generatePassword(), salt);
  const clientPassword = await bcrypt.hash(generatePassword(), salt);
  const internPassword = await bcrypt.hash(generatePassword(), salt);

  await runExecute(
    `INSERT INTO users (id, account_type, full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [adminId, 'company', 'Admin Mahreen', 'admin@mahreen.id', adminPassword, 'admin', now],
  );

  await runExecute(
    `INSERT INTO users (id, account_type, full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      superAdminId,
      'company',
      'Super Admin',
      'superadmin@mahreen.id',
      superAdminPassword,
      'superadmin',
      now,
    ],
  );

  await runExecute(
    `INSERT INTO users (id, account_type, full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [clientId, 'individual', 'Client User', 'client@mahreen.id', clientPassword, 'client', now],
  );

  await runExecute(
    `INSERT INTO users (id, account_type, full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [internId, 'individual', 'Intern User', 'intern@mahreen.id', internPassword, 'intern', now],
  );

  logger.info('4 users berhasil di-seed (admin, superadmin, client, intern).');

  const articles = [
    {
      slug: 'tips-branding-untuk-startup',
      title: 'Tips Branding untuk Startup Pemula',
      subtitle: 'Panduan singkat branding',
      excerpt: 'Pelajari langkah-langkah dasar membangun brand yang kuat untuk startup Anda.',
      category: 'Teknologi',
      readTime: '5 min',
      status: 'published',
      tags: '["Branding","Startup"]',
      views: 245,
      featuredArticle: 1,
    },
    {
      slug: 'tren-ui-ux-2025',
      title: 'Tren UI/UX Design 2025',
      subtitle: 'Masa depan desain antarmuka',
      excerpt: 'Tren desain terbaru yang akan mendominasi tahun 2025.',
      category: 'Desain',
      readTime: '7 min',
      status: 'published',
      tags: '["UI/UX","Design"]',
      views: 189,
      featuredArticle: 0,
    },
    {
      slug: 'strategi-digital-marketing',
      title: 'Strategi Digital Marketing Efektif',
      subtitle: 'Tingkatkan penjualan digital',
      excerpt: 'Cara meningkatkan penjualan melalui digital marketing yang tepat sasaran.',
      category: 'Marketing',
      readTime: '6 min',
      status: 'published',
      tags: '["Marketing","Digital"]',
      views: 312,
      featuredArticle: 0,
    },
    {
      slug: 'cara-membuat-business-plan',
      title: 'Cara Membuat Business Plan yang Menarik',
      subtitle: 'Rencana bisnis yang meyakinkan',
      excerpt: 'Panduan lengkap menyusun rencana bisnis yang meyakinkan investor.',
      category: 'Bisnis',
      readTime: '8 min',
      status: 'published',
      tags: '["Bisnis","Startup"]',
      views: 156,
      featuredArticle: 0,
    },
    {
      slug: 'manfaat-ai-dalam-bisnis',
      title: 'Manfaat AI dalam Dunia Bisnis',
      subtitle: 'Transformasi AI di korporasi',
      excerpt: 'Bagaimana kecerdasan buatan membantu efisiensi operasional perusahaan.',
      category: 'Teknologi',
      readTime: '6 min',
      status: 'published',
      tags: '["AI","Teknologi"]',
      views: 428,
      featuredArticle: 1,
    },
    {
      slug: 'desain-grafis-untuk-pemula',
      title: 'Desain Grafis untuk Pemula',
      subtitle: 'Langkah awal desain grafis',
      excerpt: 'Langkah awal belajar desain grafis dari nol hingga mahir.',
      category: 'Desain',
      readTime: '4 min',
      status: 'draft',
      tags: '["Design","Pemula"]',
      views: 0,
      featuredArticle: 0,
    },
    {
      slug: 'seo-untuk-toko-online',
      title: 'SEO untuk Toko Online',
      subtitle: 'Optimasi pencarian online',
      excerpt: 'Optimasi mesin pencari agar toko online Anda mudah ditemukan.',
      category: 'Marketing',
      readTime: '5 min',
      status: 'published',
      tags: '["SEO","Marketing"]',
      views: 201,
      featuredArticle: 0,
    },
    {
      slug: 'cara-mengelola-keuangan-usaha',
      title: 'Cara Mengelola Keuangan Usaha Kecil',
      subtitle: 'Tips keuangan UMKM',
      excerpt: 'Tips praktis mengelola keuangan agar usaha tetap sehat.',
      category: 'Bisnis',
      readTime: '7 min',
      status: 'under_review',
      tags: '["Bisnis","Keuangan"]',
      views: 0,
      featuredArticle: 0,
    },
    {
      slug: 'peran-sosial-media-dalam-branding',
      title: 'Peran Sosial Media dalam Branding',
      subtitle: 'Media sosial dan brand',
      excerpt: 'Memanfaatkan platform media sosial untuk membangun citra brand.',
      category: 'Marketing',
      readTime: '5 min',
      status: 'scheduled',
      tags: '["Social Media","Branding"]',
      views: 0,
      featuredArticle: 0,
    },
    {
      slug: 'futur-teknologi-indonesia',
      title: 'Futur Teknologi di Indonesia',
      subtitle: 'Prospek teknologi lokal',
      excerpt: 'Prospek perkembangan teknologi lokal di kancah global.',
      category: 'Teknologi',
      readTime: '6 min',
      status: 'published',
      tags: '["Teknologi","Indonesia"]',
      views: 367,
      featuredArticle: 0,
    },
  ];

  for (const article of articles) {
    const dateOffset = Math.floor(Math.random() * 30);
    const pubDate = new Date();
    pubDate.setDate(pubDate.getDate() - dateOffset);
    await runExecute(
      `INSERT INTO articles (id, slug, title, subtitle, excerpt, category, author, primary_author, read_time, status, tags, views, featured_article, published_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        article.slug,
        article.title,
        article.subtitle,
        article.excerpt,
        article.category,
        'Admin Mahreen',
        'Admin Mahreen',
        article.readTime,
        article.status,
        article.tags,
        article.views,
        article.featuredArticle,
        pubDate.toISOString(),
        now,
      ],
    );
  }

  logger.info('10 articles berhasil di-seed.');

  const webinars = [
    {
      slug: 'workshop-branding-digital',
      title: 'Workshop Branding Digital',
      category: 'Branding',
      price: 150000,
      isFree: 0,
      scheduleDate: '2025-08-15',
      scheduleTime: '09:00-12:00',
      duration: '3 jam',
      description:
        'Workshop praktis membangun identitas brand digital yang kuat untuk bisnis Anda.',
      image: '',
      topics: ['Branding', 'Strategi Visual', 'Digital Marketing'],
      mentors: [
        {
          name: 'Ahmad Sulaiman',
          role: 'Head of Digital Marketing',
          company: 'TechVantage Indonesia',
          image: '',
          quote: 'Brand yang kuat dimulai dari kejelasan identitas.',
          bio: '12+ tahun pengalaman digital marketing.',
          profileHref: '/newsroom',
        },
      ],
      timeline: [
        {
          title: 'Pengenalan Branding',
          description: 'Konsep dasar dan pentingnya identitas brand.',
          date: '09:00-09:45',
        },
        {
          title: 'Sesi Praktik',
          description: 'Latihan menyusun brand brief dan moodboard.',
          date: '09:45-11:00',
        },
        {
          title: 'Presentasi & Feedback',
          description: 'Review hasil karya peserta oleh mentor.',
          date: '11:00-12:00',
        },
      ],
      benefits: [
        'Sertifikat Workshop',
        'Template Brand Brief',
        'Akses materi selamanya',
        'Konsultasi 1x1',
      ],
    },
    {
      slug: 'webinar-ui-ux-fundamentals',
      title: 'Webinar UI/UX Fundamentals',
      category: 'Desain',
      price: 0,
      isFree: 1,
      scheduleDate: '2025-08-20',
      scheduleTime: '14:00-16:00',
      duration: '2 jam',
      description: 'Memahami dasar-dasar UI/UX design dan prinsip pengalaman pengguna modern.',
      image: '',
      topics: ['UI/UX', 'Design Thinking', 'Prototyping'],
      mentors: [
        {
          name: 'Siti Aminah',
          role: 'Senior Product Designer',
          company: 'Glow Studio',
          image: '',
          quote: 'Desain terbaik adalah desain yang tidak terasa.',
          bio: 'Specialist UI/UX untuk produk digital premium.',
          profileHref: '/newsroom',
        },
      ],
      timeline: [
        {
          title: 'Dasar UI/UX',
          description: 'Prinsip visual dan alur pengguna.',
          date: '14:00-14:40',
        },
        {
          title: 'Design Thinking',
          description: 'Empathize, define, ideate, prototype, test.',
          date: '14:40-15:30',
        },
        {
          title: 'Tanya Jawab',
          description: 'Sesi interaktif dengan mentor.',
          date: '15:30-16:00',
        },
      ],
      benefits: ['Akses gratis', 'Materi PDF', 'Rekaman sesi', 'Grup diskusi'],
    },
    {
      slug: 'seminar-ai-for-business',
      title: 'Seminar AI for Business',
      category: 'Teknologi',
      price: 200000,
      isFree: 0,
      scheduleDate: '2025-09-01',
      scheduleTime: '10:00-12:30',
      duration: '2.5 jam',
      description: 'Seminar penerapan kecerdasan buatan untuk meningkatkan efisiensi bisnis.',
      image: '',
      topics: ['AI', 'Machine Learning', 'Otomasi Bisnis'],
      mentors: [
        {
          name: 'Budi Prakoso',
          role: 'AI Consultant',
          company: 'NexData',
          image: '',
          quote: 'AI adalah alat, manusia adalah pemilik keputusan.',
          bio: 'Konsultan AI untuk perusahaan Fortune 500.',
          profileHref: '/newsroom',
        },
      ],
      timeline: [
        {
          title: 'Pengantar AI',
          description: 'Evolusi dan potensi AI di dunia bisnis.',
          date: '10:00-10:45',
        },
        {
          title: 'Studi Kasus',
          description: 'Implementasi AI pada operasional nyata.',
          date: '10:45-11:45',
        },
        {
          title: 'Roadmap & Diskusi',
          description: 'Menyusun rencana adopsi AI.',
          date: '11:45-12:30',
        },
      ],
      benefits: [
        'Sertifikat Seminar',
        'E-Book AI for Business',
        'Template Roadmap AI',
        'Akses komunitas',
      ],
    },
  ];

  for (const w of webinars) {
    await runExecute(
      `INSERT INTO webinars (id, slug, title, category, description, duration, price, is_free, image, schedule_date, schedule_time, topics, mentors, timeline, benefits, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        w.slug,
        w.title,
        w.category,
        w.description || '',
        w.duration,
        w.price,
        w.isFree,
        w.image || '',
        w.scheduleDate,
        w.scheduleTime,
        JSON.stringify(w.topics || []),
        JSON.stringify(w.mentors || []),
        JSON.stringify(w.timeline || []),
        JSON.stringify(w.benefits || []),
        now,
      ],
    );
  }

  logger.info('3 webinars berhasil di-seed.');

  const events = [
    {
      title: 'Mahreen Tech Talk 2025',
      category: 'Teknologi',
      description: 'Diskusi panel tentang tren teknologi terkini.',
      eventDate: '2025-08-25',
      eventTime: '13:00-16:00',
      location: 'Jakarta Convention Center',
      accessType: 'FREE',
    },
    {
      title: 'Design Sprint Workshop',
      category: 'Desain',
      description: 'Workshop intensif selama 2 hari untuk tim desain.',
      eventDate: '2025-09-05',
      eventTime: '09:00-17:00',
      location: 'Bandung Digital Hub',
      accessType: 'PAID',
    },
    {
      title: 'Startup Networking Night',
      category: 'Bisnis',
      description: 'Sesi networking untuk founder startup pemula.',
      eventDate: '2025-09-12',
      eventTime: '18:00-21:00',
      location: 'Co-working Space Senopati',
      accessType: 'FREE',
    },
  ];

  for (const e of events) {
    await runExecute(
      `INSERT INTO events (id, title, category, description, event_date, event_time, location, access_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        e.title,
        e.category,
        e.description,
        e.eventDate,
        e.eventTime,
        e.location,
        e.accessType,
        now,
      ],
    );
  }

  logger.info('3 events berhasil di-seed.');

  const products = [
    {
      slug: 'mahreen-classic-tee',
      title: 'Mahreen Classic Tee',
      description: 'Kaos katun 30s dengan logo Mahreen.',
      price: 150000,
      collectionName: 'Mahreen Studio',
      category: 'Apparel',
    },
    {
      slug: 'mahreen-oversized-hoodie',
      title: 'Mahreen Oversized Hoodie',
      description: 'Hoodie oversized dengan bahan fleece premium.',
      price: 350000,
      collectionName: 'Mahreen Studio',
      category: 'Apparel',
    },
    {
      slug: 'mahreen-cargo-pants',
      title: 'Mahreen Cargo Pants',
      description: 'Celana cargo dengan desain streetwear modern.',
      price: 275000,
      collectionName: 'Mahreen Studio',
      category: 'Apparel',
    },
    {
      slug: 'mahreen-cap-visor',
      title: 'Mahreen Cap Visor',
      description: 'Topi visor dengan bordiran logo.',
      price: 125000,
      collectionName: 'Mahreen Studio',
      category: 'Accessories',
    },
    {
      slug: 'mahreen-tote-bag',
      title: 'Mahreen Tote Bag',
      description: 'Tote bag katun ramah lingkungan.',
      price: 95000,
      collectionName: 'Mahreen Studio',
      category: 'Accessories',
    },
    {
      slug: 'mahreen-jacket-varsity',
      title: 'Mahreen Jacket Varsity',
      description: 'Jaket varsity dengan desain eksklusif.',
      price: 450000,
      collectionName: 'Mahreen Studio',
      category: 'Apparel',
    },
  ];

  for (const p of products) {
    await runExecute(
      `INSERT INTO products (id, slug, title, description, price, collection_name, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), p.slug, p.title, p.description, p.price, p.collectionName, p.category, now],
    );
  }

  logger.info('6 products berhasil di-seed.');

  const csrPrograms = [
    {
      title: 'Digital Literacy for Rural Schools',
      description: 'Program literasi digital untuk sekolah-sekolah di daerah terpencil.',
      category: 'Pendidikan',
      progress: 65,
      target: 500,
      current: 325,
      status: 'active',
    },
    {
      title: 'Clean Water Initiative',
      description: 'Penyediaan air bersih untuk komunitas yang membutuhkan.',
      category: 'Lingkungan',
      progress: 40,
      target: 200,
      current: 80,
      status: 'active',
    },
    {
      title: 'Tech Scholarship Program',
      description: 'Beasiswa pendidikan teknologi untuk anak kurang mampu.',
      category: 'Pendidikan',
      progress: 80,
      target: 100,
      current: 80,
      status: 'active',
    },
  ];

  for (const c of csrPrograms) {
    await runExecute(
      `INSERT INTO csr_programs (id, title, description, category, progress, target_beneficiaries, current_beneficiaries, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        c.title,
        c.description,
        c.category,
        c.progress,
        c.target,
        c.current,
        c.status,
        now,
      ],
    );
  }

  logger.info('3 CSR programs berhasil di-seed.');

  const batches = [
    {
      name: 'Batch 1 - Frontend Development',
      status: 'open',
      description: 'Program magang fokus pengembangan frontend dengan React dan Vue.js.',
    },
    {
      name: 'Batch 2 - UI/UX Design',
      status: 'open',
      description: 'Program magang fokus desain antarmuka dan pengalaman pengguna.',
    },
    {
      name: 'Batch 3 - Digital Marketing',
      status: 'closed',
      description: 'Program magang fokus strategi dan eksekusi digital marketing.',
    },
  ];

  for (const b of batches) {
    await runExecute(
      `INSERT INTO internship_batches (id, name, status, description, created_at) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), b.name, b.status, b.description, now],
    );
  }

  logger.info('3 internship batches berhasil di-seed.');

  const transactions = [
    {
      clientName: 'Rina Wulandari',
      clientEmail: 'rina@example.com',
      service: 'Branding Package',
      amount: 5000000,
      status: 'paid',
    },
    {
      clientName: 'Budi Santoso',
      clientEmail: 'budi@example.com',
      service: 'Web Development',
      amount: 12000000,
      status: 'paid',
    },
    {
      clientName: 'Sari Dewi',
      clientEmail: 'sari@example.com',
      service: 'UI/UX Design',
      amount: 7500000,
      status: 'pending',
    },
    {
      clientName: 'Andi Prasetyo',
      clientEmail: 'andi@example.com',
      service: 'Digital Marketing',
      amount: 3000000,
      status: 'pending',
    },
    {
      clientName: 'Maya Putri',
      clientEmail: 'maya@example.com',
      service: 'Social Media Management',
      amount: 2500000,
      status: 'paid',
    },
  ];

  const invoicePrefix = 'INV-2025-';
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    const invoiceId = `${invoicePrefix}${String(i + 1).padStart(4, '0')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const paidAt = t.status === 'paid' ? now : '';
    await runExecute(
      `INSERT INTO transactions (id, invoice_id, client_name, client_email, service, amount, status, due_date, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        invoiceId,
        t.clientName,
        t.clientEmail,
        t.service,
        t.amount,
        t.status,
        dueDate.toISOString(),
        paidAt,
        now,
      ],
    );
  }

  logger.info('5 transactions berhasil di-seed.');

  const activities = [
    {
      type: 'user_register',
      title: 'User baru terdaftar',
      description: 'Client User telah mendaftar akun baru.',
    },
    {
      type: 'webinar_register',
      title: 'Pendaftaran webinar baru',
      description: 'Andi Prasetyo mendaftar webinar UI/UX Fundamentals.',
    },
    {
      type: 'order_created',
      title: 'Pesanan baru dibuat',
      description: 'Rina Wulandari memesan paket Branding.',
    },
    {
      type: 'csr_update',
      title: 'Update program CSR',
      description: 'Digital Literacy for Rural Schools mencapai 65% progress.',
    },
    {
      type: 'article_published',
      title: 'Artikel baru dipublikasikan',
      description: 'Tips Branding untuk Startup Pemula telah dipublikasikan.',
    },
  ];

  for (const a of activities) {
    await runExecute(
      `INSERT INTO system_activities (id, type, title, description, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), a.type, a.title, a.description, JSON.stringify({}), now],
    );
  }

  logger.info('5 system activities berhasil di-seed.');

  const topics = [
    {
      title: 'React Development',
      description: 'Tutorial dan tips pengembangan aplikasi React.',
      articleCount: 3,
      webinarCount: 1,
      categories: '["Teknologi"]',
    },
    {
      title: 'Figma Design System',
      description: 'Panduan membuat design system menggunakan Figma.',
      articleCount: 2,
      webinarCount: 1,
      categories: '["Desain"]',
    },
    {
      title: 'Social Media Strategy',
      description: 'Strategi konten untuk berbagai platform media sosial.',
      articleCount: 4,
      webinarCount: 0,
      categories: '["Marketing"]',
    },
    {
      title: 'Startup Funding',
      description: 'Panduan mencari pendanaan untuk startup.',
      articleCount: 2,
      webinarCount: 0,
      categories: '["Bisnis"]',
    },
    {
      title: 'AI & Machine Learning',
      description: 'Pengenalan AI dan ML untuk pengembang.',
      articleCount: 3,
      webinarCount: 1,
      categories: '["Teknologi"]',
    },
    {
      title: 'Brand Identity',
      description: 'Membangun identitas brand yang konsisten.',
      articleCount: 2,
      webinarCount: 1,
      categories: '["Branding","Desain"]',
    },
    {
      title: 'SEO Basics',
      description: 'Pengenalan SEO untuk pemilik bisnis online.',
      articleCount: 3,
      webinarCount: 0,
      categories: '["Marketing"]',
    },
    {
      title: 'Financial Planning',
      description: 'Perencanaan keuangan untuk usaha kecil.',
      articleCount: 2,
      webinarCount: 0,
      categories: '["Bisnis"]',
    },
    {
      title: 'Motion Graphics',
      description: 'Teknik dasar animasi dan motion design.',
      articleCount: 1,
      webinarCount: 0,
      categories: '["Desain"]',
    },
    {
      title: 'E-Commerce Growth',
      description: 'Strategi pertumbuhan untuk bisnis e-commerce.',
      articleCount: 2,
      webinarCount: 1,
      categories: '["Bisnis","Marketing"]',
    },
  ];

  for (const t of topics) {
    await runExecute(
      `INSERT INTO topics (id, title, description, article_count, webinar_count, categories, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), t.title, t.description, t.articleCount, t.webinarCount, t.categories, now],
    );
  }

  logger.info('10 topics berhasil di-seed.');

  await seedAdminModules({ now, adminId, clientId, internId });

  logger.info('Seeding selesai!');
};

/**
 * Menjalankan seed modul admin pada database yang sudah berisi data lama,
 * sehingga tabel baru tetap terisi tanpa menyentuh data yang sudah ada.
 */
const seedAdminModulesIfEmpty = async () => {
  const campaignCount = await runSingle('SELECT COUNT(*) as count FROM donation_campaigns');
  if (campaignCount && campaignCount.count > 0) {
    logger.info('Modul admin sudah memiliki data, skip seeding.');
    return;
  }

  const admin = await runSingle(
    "SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1",
  );
  const client = await runSingle(
    "SELECT id FROM users WHERE role = 'client' ORDER BY created_at ASC LIMIT 1",
  );
  const intern = await runSingle(
    "SELECT id FROM users WHERE role = 'intern' ORDER BY created_at ASC LIMIT 1",
  );

  logger.info('Menjalankan seed modul admin pada database yang sudah ada.');
  await seedAdminModules({
    now: new Date().toISOString(),
    adminId: admin ? admin.id : null,
    clientId: client ? client.id : null,
    internId: intern ? intern.id : null,
    skipExtraUsers: true,
  });
  logger.info('Seed modul admin selesai.');
};

const seedAdminModules = async ({ now, adminId, clientId, internId, skipExtraUsers = false }) => {
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pw = 'A1!';
    for (let i = 0; i < 14; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    return pw;
  };
  const iso = (daysAgo = 0, hoursAgo = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    return d.toISOString();
  };

  // ── donation_campaigns ──
  const campaigns = [
    {
      slug: 'beasiswa-anak-negeri',
      title: 'Beasiswa Anak Negeri',
      description:
        'Pendanaan biaya sekolah untuk 250 pelajar berprestasi dari keluarga prasejahtera.',
      category: 'Pendidikan',
      target: 500000000,
      collected: 312500000,
      disbursed: 210000000,
      status: 'active',
    },
    {
      slug: 'air-bersih-nusantara',
      title: 'Air Bersih Nusantara',
      description: 'Pembangunan sumur bor dan filtrasi air untuk desa dengan krisis air bersih.',
      category: 'Lingkungan',
      target: 350000000,
      collected: 148000000,
      disbursed: 90000000,
      status: 'active',
    },
    {
      slug: 'umkm-bangkit',
      title: 'UMKM Bangkit',
      description: 'Modal usaha bergulir dan pendampingan digitalisasi untuk UMKM terdampak.',
      category: 'Ekonomi',
      target: 250000000,
      collected: 205000000,
      disbursed: 180000000,
      status: 'active',
    },
    {
      slug: 'literasi-digital-pesisir',
      title: 'Literasi Digital Pesisir',
      description: 'Pelatihan literasi digital untuk komunitas pesisir dan nelayan muda.',
      category: 'Pendidikan',
      target: 150000000,
      collected: 150000000,
      disbursed: 150000000,
      status: 'completed',
    },
  ];

  const campaignIds = {};
  for (const c of campaigns) {
    const id = uuidv4();
    campaignIds[c.slug] = id;
    await runExecute(
      `INSERT INTO donation_campaigns (id, slug, title, description, category, target_amount, collected_amount, disbursed_amount, status, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        c.slug,
        c.title,
        c.description,
        c.category,
        c.target,
        c.collected,
        c.disbursed,
        c.status,
        iso(120),
        iso(-90),
        now,
        now,
      ],
    );
  }
  logger.info(`${campaigns.length} donation campaigns berhasil di-seed.`);

  // ── donations ──
  const existingDonations = await runSingle('SELECT COUNT(*) as count FROM donations');
  const donationRows = [
    {
      name: 'Rina Wulandari',
      email: 'rina@example.com',
      amount: 5000000,
      campaign: 'beasiswa-anak-negeri',
      method: 'bank_transfer',
      status: 'paid',
      days: 2,
      anon: 0,
    },
    {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      amount: 2500000,
      campaign: 'beasiswa-anak-negeri',
      method: 'qris',
      status: 'paid',
      days: 4,
      anon: 0,
    },
    {
      name: 'Donatur Anonim',
      email: '',
      amount: 10000000,
      campaign: 'air-bersih-nusantara',
      method: 'bank_transfer',
      status: 'paid',
      days: 6,
      anon: 1,
    },
    {
      name: 'Sari Dewi',
      email: 'sari@example.com',
      amount: 1500000,
      campaign: 'air-bersih-nusantara',
      method: 'qris',
      status: 'paid',
      days: 8,
      anon: 0,
    },
    {
      name: 'Andi Prasetyo',
      email: 'andi@example.com',
      amount: 750000,
      campaign: 'umkm-bangkit',
      method: 'virtual_account',
      status: 'pending',
      days: 1,
      anon: 0,
    },
    {
      name: 'Maya Putri',
      email: 'maya@example.com',
      amount: 3000000,
      campaign: 'umkm-bangkit',
      method: 'qris',
      status: 'paid',
      days: 11,
      anon: 0,
    },
    {
      name: 'PT Cahaya Mandiri',
      email: 'csr@cahayamandiri.co.id',
      amount: 25000000,
      campaign: 'literasi-digital-pesisir',
      method: 'bank_transfer',
      status: 'paid',
      days: 20,
      anon: 0,
    },
    {
      name: 'Fitri Handayani',
      email: 'fitri@example.com',
      amount: 500000,
      campaign: 'beasiswa-anak-negeri',
      method: 'qris',
      status: 'failed',
      days: 3,
      anon: 0,
    },
    {
      name: 'Yoga Pratama',
      email: 'yoga@example.com',
      amount: 1000000,
      campaign: 'air-bersih-nusantara',
      method: 'qris',
      status: 'paid',
      days: 25,
      anon: 0,
    },
    {
      name: 'Client User',
      email: 'client@mahreen.id',
      amount: 2000000,
      campaign: 'umkm-bangkit',
      method: 'bank_transfer',
      status: 'paid',
      days: 30,
      anon: 0,
    },
  ];

  if (!existingDonations || existingDonations.count === 0) {
    for (const d of donationRows) {
      await runExecute(
        `INSERT INTO donations (id, user_id, donor_name, donor_email, amount, campaign, campaign_id, payment_method, payment_status, transaction_id, is_anonymous, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          d.email === 'client@mahreen.id' ? clientId : null,
          d.name,
          d.email,
          d.amount,
          campaigns.find((c) => c.slug === d.campaign)?.title || '',
          campaignIds[d.campaign],
          d.method,
          d.status,
          d.status === 'paid' ? `DON-${Math.random().toString(36).slice(2, 10).toUpperCase()}` : '',
          d.anon,
          '',
          iso(d.days),
          iso(d.days),
        ],
      );
    }
    logger.info(`${donationRows.length} donations berhasil di-seed.`);
  } else {
    // Selaraskan donasi lama dengan kampanye baru agar agregat kampanye tetap akurat.
    const orphanDonations = await runQuery(
      "SELECT id, campaign FROM donations WHERE campaign_id IS NULL OR campaign_id = ''",
    );
    for (const donation of orphanDonations) {
      const matched = campaigns.find((c) => c.title === donation.campaign);
      const targetSlug = matched ? matched.slug : campaigns[0].slug;
      await runExecute(
        `UPDATE donations SET campaign_id = ?, campaign = ?, payment_status = CASE WHEN LOWER(payment_status) IN ('completed','success') THEN 'paid' ELSE LOWER(payment_status) END, updated_at = ? WHERE id = ?`,
        [
          campaignIds[targetSlug],
          campaigns.find((c) => c.slug === targetSlug).title,
          now,
          donation.id,
        ],
      );
    }
  }

  // Sinkronkan total terkumpul kampanye dari data donasi aktual.
  for (const slug of Object.keys(campaignIds)) {
    await runExecute(
      `UPDATE donation_campaigns SET collected_amount = (
         SELECT COALESCE(SUM(amount), 0) FROM donations WHERE campaign_id = ? AND LOWER(payment_status) = 'paid'
       ), updated_at = ? WHERE id = ?`,
      [campaignIds[slug], now, campaignIds[slug]],
    );
  }
  await runExecute(
    `UPDATE donation_campaigns SET disbursed_amount = LEAST(disbursed_amount, collected_amount), updated_at = ?`,
    [now],
  );

  // ── csr_pillars ──
  const pillarCount = await runSingle('SELECT COUNT(*) as count FROM csr_pillars');
  const pillars = [
    {
      title: 'Pendidikan Berkelanjutan',
      description:
        'Meningkatkan akses dan mutu pendidikan pada wilayah dengan keterbatasan fasilitas.',
      icon: 'GraduationCap',
    },
    {
      title: 'Pemberdayaan Ekonomi',
      description: 'Mendorong kemandirian ekonomi masyarakat melalui pelatihan dan modal usaha.',
      icon: 'BriefcaseBusiness',
    },
    {
      title: 'Kelestarian Lingkungan',
      description: 'Program konservasi, pengelolaan sampah, dan penyediaan air bersih.',
      icon: 'Leaf',
    },
    {
      title: 'Kesehatan Komunitas',
      description: 'Layanan kesehatan dasar dan edukasi gizi untuk komunitas rentan.',
      icon: 'HeartPulse',
    },
  ];

  if (!pillarCount || pillarCount.count === 0) {
    for (let i = 0; i < pillars.length; i++) {
      await runExecute(
        `INSERT INTO csr_pillars (id, title, description, icon, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), pillars[i].title, pillars[i].description, pillars[i].icon, i + 1, now],
      );
    }
    logger.info(`${pillars.length} csr pillars berhasil di-seed.`);
  }

  // ── csr_applications ──
  const csrProgramRows = await runQuery(
    'SELECT id, title FROM csr_programs ORDER BY created_at ASC',
  );
  const csrApplications = [
    {
      role: 'volunteer',
      name: 'Dinda Ayu Lestari',
      email: 'dinda@example.com',
      phone: '081234567801',
      institution: 'Universitas Indonesia',
      city: 'Depok',
      motivation: 'Ingin berkontribusi pada program literasi digital di daerah asal saya.',
      status: 'approved',
      days: 12,
    },
    {
      role: 'volunteer',
      name: 'Rizky Ramadhan',
      email: 'rizky@example.com',
      phone: '081234567802',
      institution: 'Institut Teknologi Bandung',
      city: 'Bandung',
      motivation: 'Memiliki pengalaman mengajar komputer dasar selama dua tahun.',
      status: 'pending',
      days: 3,
    },
    {
      role: 'partner',
      name: 'PT Sinar Harapan',
      email: 'csr@sinarharapan.co.id',
      phone: '02177889900',
      institution: 'PT Sinar Harapan',
      city: 'Jakarta',
      motivation: 'Membuka kolaborasi pendanaan program air bersih untuk tiga desa.',
      status: 'reviewed',
      days: 7,
    },
    {
      role: 'volunteer',
      name: 'Anisa Fitriani',
      email: 'anisa@example.com',
      phone: '081234567803',
      institution: 'Universitas Airlangga',
      city: 'Surabaya',
      motivation: 'Fokus pada edukasi kesehatan dan gizi anak usia sekolah.',
      status: 'pending',
      days: 1,
    },
    {
      role: 'mentor',
      name: 'Bayu Setiawan',
      email: 'bayu@example.com',
      phone: '081234567804',
      institution: 'Praktisi UMKM',
      city: 'Yogyakarta',
      motivation: 'Bersedia menjadi mentor pendampingan digitalisasi UMKM.',
      status: 'approved',
      days: 18,
    },
    {
      role: 'volunteer',
      name: 'Kevin Mahendra',
      email: 'kevin@example.com',
      phone: '081234567805',
      institution: 'Universitas Brawijaya',
      city: 'Malang',
      motivation: 'Tertarik pada program konservasi lingkungan pesisir.',
      status: 'rejected',
      days: 22,
    },
  ];

  for (let i = 0; i < csrApplications.length; i++) {
    const a = csrApplications[i];
    const duplicate = await runSingle('SELECT id FROM csr_applications WHERE email = ?', [a.email]);
    if (duplicate) continue;
    const program = csrProgramRows[i % Math.max(1, csrProgramRows.length)];
    const reviewed = a.status !== 'pending';
    await runExecute(
      `INSERT INTO csr_applications (id, user_id, program_id, role, full_name, email, phone, institution, city, motivation, portfolio_url, status, reviewed_by, reviewed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        null,
        program ? program.id : null,
        a.role,
        a.name,
        a.email,
        a.phone,
        a.institution,
        a.city,
        a.motivation,
        '',
        a.status,
        reviewed ? adminId : null,
        reviewed ? iso(a.days - 1) : '',
        iso(a.days),
      ],
    );
  }
  logger.info(`${csrApplications.length} csr applications berhasil diproses.`);

  // ── portfolios ──
  const portfolios = [
    {
      slug: 'rebranding-kopi-nusa',
      title: 'Rebranding Kopi Nusa',
      client: 'Kopi Nusa',
      category: 'Branding',
      description:
        'Rekonstruksi identitas visual dan strategi kemasan untuk jaringan kedai kopi lokal.',
      services: '["Brand Strategy","Visual Identity","Packaging"]',
      year: '2025',
      featured: 1,
    },
    {
      slug: 'platform-belajar-cerdas',
      title: 'Platform Belajar Cerdas',
      client: 'Yayasan Cerdas Indonesia',
      category: 'Web Development',
      description: 'Pengembangan platform pembelajaran daring dengan modul kelas dan sertifikasi.',
      services: '["UI/UX Design","Web Development","QA"]',
      year: '2025',
      featured: 1,
    },
    {
      slug: 'kampanye-sehat-bersama',
      title: 'Kampanye Sehat Bersama',
      client: 'Dinas Kesehatan Provinsi',
      category: 'Digital Marketing',
      description: 'Kampanye kesehatan multi-kanal dengan capaian jangkauan 2,4 juta akun.',
      services: '["Content Strategy","Social Media","Ads"]',
      year: '2024',
      featured: 0,
    },
    {
      slug: 'company-profile-arta-logistik',
      title: 'Company Profile Arta Logistik',
      client: 'Arta Logistik',
      category: 'Web Development',
      description: 'Situs profil perusahaan dengan pelacakan pengiriman terintegrasi.',
      services: '["Web Development","SEO"]',
      year: '2024',
      featured: 0,
    },
    {
      slug: 'identitas-visual-batik-arum',
      title: 'Identitas Visual Batik Arum',
      client: 'Batik Arum',
      category: 'Branding',
      description: 'Penyusunan sistem identitas visual dan katalog produk batik tulis.',
      services: '["Visual Identity","Photography"]',
      year: '2024',
      featured: 0,
    },
    {
      slug: 'produksi-konten-tani-maju',
      title: 'Produksi Konten Tani Maju',
      client: 'Koperasi Tani Maju',
      category: 'Content Production',
      description: 'Produksi video dokumenter dan aset konten edukasi pertanian.',
      services: '["Video Production","Copywriting"]',
      year: '2023',
      featured: 0,
    },
  ];

  for (let i = 0; i < portfolios.length; i++) {
    const p = portfolios[i];
    const duplicate = await runSingle('SELECT id FROM portfolios WHERE slug = ?', [p.slug]);
    if (duplicate) continue;
    await runExecute(
      `INSERT INTO portfolios (id, slug, title, client_name, category, description, cover_image, gallery, services, project_url, year, is_featured, status, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        p.slug,
        p.title,
        p.client,
        p.category,
        p.description,
        '',
        JSON.stringify([]),
        p.services,
        '',
        p.year,
        p.featured,
        'published',
        i + 1,
        iso(40 - i * 5),
      ],
    );
  }
  logger.info(`${portfolios.length} portfolios berhasil diproses.`);

  // ── consultations ──
  const consultations = [
    {
      name: 'Hendra Gunawan',
      email: 'hendra@example.com',
      phone: '081298765401',
      interest: 'Website Development',
      type: 'free',
      message: 'Butuh company profile untuk perusahaan konstruksi, target rilis dua bulan.',
      status: 'pending',
      days: 1,
    },
    {
      name: 'Laras Ayuningtyas',
      email: 'laras@example.com',
      phone: '081298765402',
      interest: 'Branding',
      type: 'free',
      message: 'Sedang menyiapkan peluncuran brand skincare lokal.',
      status: 'scheduled',
      days: 2,
    },
    {
      name: 'Dimas Aryo',
      email: 'dimas@example.com',
      phone: '081298765403',
      interest: 'Digital Marketing',
      type: 'paid',
      message: 'Ingin audit performa iklan Meta dan Google yang sedang berjalan.',
      status: 'completed',
      days: 9,
    },
    {
      name: 'Nadia Safira',
      email: 'nadia@example.com',
      phone: '081298765404',
      interest: 'Social Media Management',
      type: 'free',
      message: 'Perlu strategi konten untuk akun bisnis kuliner.',
      status: 'pending',
      days: 1,
    },
    {
      name: 'Bagas Wicaksono',
      email: 'bagas@example.com',
      phone: '081298765405',
      interest: 'Content Production',
      type: 'paid',
      message: 'Membutuhkan produksi video profil produk sebanyak enam episode.',
      status: 'scheduled',
      days: 4,
    },
    {
      name: 'Tirta Kencana',
      email: 'tirta@example.com',
      phone: '081298765406',
      interest: 'Consultation',
      type: 'free',
      message: 'Diskusi roadmap transformasi digital koperasi.',
      status: 'cancelled',
      days: 15,
    },
    {
      name: 'Client User',
      email: 'client@mahreen.id',
      phone: '081298765407',
      interest: 'Website Development',
      type: 'paid',
      message: 'Lanjutan fase dua pengembangan dashboard internal.',
      status: 'completed',
      days: 21,
    },
  ];

  for (const c of consultations) {
    const duplicate = await runSingle(
      'SELECT id FROM consultations WHERE email = ? AND service_interest = ?',
      [c.email, c.interest],
    );
    if (duplicate) continue;
    await runExecute(
      `INSERT INTO consultations (id, user_id, full_name, email, phone, service_interest, message, status, consultation_type, preferred_date, handled_by, admin_notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        c.email === 'client@mahreen.id' ? clientId : null,
        c.name,
        c.email,
        c.phone,
        c.interest,
        c.message,
        c.status,
        c.type,
        iso(-3),
        c.status === 'pending' ? '' : adminId,
        '',
        iso(c.days),
        iso(c.days),
      ],
    );
  }
  logger.info(`${consultations.length} consultations berhasil diproses.`);

  // ── service_orders ──
  const packageRows = [
    {
      key: 'website',
      tier: 'best',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      price: 12000000,
      status: 'in_progress',
      days: 12,
    },
    {
      key: 'branding',
      tier: 'better',
      name: 'Rina Wulandari',
      email: 'rina@example.com',
      price: 5000000,
      status: 'completed',
      days: 30,
    },
    {
      key: 'digital-marketing',
      tier: 'good',
      name: 'Andi Prasetyo',
      email: 'andi@example.com',
      price: 3000000,
      status: 'pending',
      days: 2,
    },
    {
      key: 'social-media',
      tier: 'better',
      name: 'Maya Putri',
      email: 'maya@example.com',
      price: 2500000,
      status: 'in_progress',
      days: 8,
    },
    {
      key: 'content-production',
      tier: 'best',
      name: 'Koperasi Tani Maju',
      email: 'admin@tanimaju.id',
      price: 8500000,
      status: 'completed',
      days: 45,
    },
    {
      key: 'website',
      tier: 'good',
      name: 'Client User',
      email: 'client@mahreen.id',
      price: 6500000,
      status: 'in_progress',
      days: 5,
    },
  ];

  for (let i = 0; i < packageRows.length; i++) {
    const o = packageRows[i];
    const invoiceId = `ORD-2025-${String(i + 1).padStart(4, '0')}`;
    const duplicate = await runSingle('SELECT id FROM service_orders WHERE invoice_id = ?', [
      invoiceId,
    ]);
    if (duplicate) continue;
    await runExecute(
      `INSERT INTO service_orders (id, user_id, service_key, tier, client_name, client_email, total_price, addons, status, invoice_id, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        o.email === 'client@mahreen.id' ? clientId : null,
        o.key,
        o.tier,
        o.name,
        o.email,
        o.price,
        JSON.stringify([]),
        o.status,
        invoiceId,
        '',
        iso(o.days),
        iso(o.days),
      ],
    );
  }
  logger.info(`${packageRows.length} service orders berhasil diproses.`);

  // ── internship_applications ──
  const batchRows = await runQuery(
    'SELECT id, name FROM internship_batches ORDER BY created_at ASC',
  );
  const internApplications = [
    {
      name: 'Alya Rahmawati',
      email: 'alya@example.com',
      phone: '081345678901',
      university: 'Universitas Gadjah Mada',
      major: 'Ilmu Komputer',
      semester: 6,
      spec: 'Frontend Development',
      status: 'accepted',
      days: 25,
    },
    {
      name: 'Fajar Nugroho',
      email: 'fajar@example.com',
      phone: '081345678902',
      university: 'Universitas Diponegoro',
      major: 'Sistem Informasi',
      semester: 5,
      spec: 'Frontend Development',
      status: 'interview',
      days: 10,
    },
    {
      name: 'Citra Melati',
      email: 'citra@example.com',
      phone: '081345678903',
      university: 'Universitas Padjadjaran',
      major: 'Desain Komunikasi Visual',
      semester: 6,
      spec: 'UI/UX Design',
      status: 'pending',
      days: 2,
    },
    {
      name: 'Galih Prakoso',
      email: 'galih@example.com',
      phone: '081345678904',
      university: 'Universitas Negeri Malang',
      major: 'Teknik Informatika',
      semester: 7,
      spec: 'UI/UX Design',
      status: 'accepted',
      days: 20,
    },
    {
      name: 'Salsabila Putri',
      email: 'salsa@example.com',
      phone: '081345678905',
      university: 'Universitas Indonesia',
      major: 'Ilmu Komunikasi',
      semester: 4,
      spec: 'Digital Marketing',
      status: 'rejected',
      days: 33,
    },
    {
      name: 'Rendra Wijaya',
      email: 'rendra@example.com',
      phone: '081345678906',
      university: 'Institut Teknologi Sepuluh Nopember',
      major: 'Teknik Informatika',
      semester: 6,
      spec: 'Frontend Development',
      status: 'pending',
      days: 1,
    },
    {
      name: 'Intern User',
      email: 'intern@mahreen.id',
      phone: '081345678907',
      university: 'Universitas Brawijaya',
      major: 'Sistem Informasi',
      semester: 6,
      spec: 'Frontend Development',
      status: 'accepted',
      days: 40,
    },
    {
      name: 'Nabila Zahra',
      email: 'nabila@example.com',
      phone: '081345678908',
      university: 'Universitas Airlangga',
      major: 'Manajemen',
      semester: 5,
      spec: 'Digital Marketing',
      status: 'interview',
      days: 6,
    },
  ];

  for (const a of internApplications) {
    const duplicate = await runSingle('SELECT id FROM internship_applications WHERE email = ?', [
      a.email,
    ]);
    if (duplicate) continue;
    const batch = batchRows.find((b) => b.name.includes(a.spec)) || batchRows[0];
    const reviewed = a.status !== 'pending';
    await runExecute(
      `INSERT INTO internship_applications (id, user_id, full_name, email, phone, university, major, semester, specialization, motivation, portfolio_url, batch_id, status, cv_url, reviewed_by, reviewed_at, admin_notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        a.email === 'intern@mahreen.id' ? internId : null,
        a.name,
        a.email,
        a.phone,
        a.university,
        a.major,
        a.semester,
        a.spec,
        `Tertarik mengembangkan kemampuan ${a.spec} melalui program magang terstruktur.`,
        '',
        batch ? batch.id : null,
        a.status,
        '',
        reviewed ? adminId : null,
        reviewed ? iso(a.days - 1) : '',
        '',
        iso(a.days),
      ],
    );
  }
  logger.info(`${internApplications.length} internship applications berhasil diproses.`);

  // ── certificates ──
  const existingCerts = await runSingle('SELECT COUNT(*) as count FROM certificates');
  let certIndex = 0;

  if (!existingCerts || existingCerts.count === 0) {
    const acceptedInterns = await runQuery(
      "SELECT id, full_name, email, specialization FROM internship_applications WHERE status = 'accepted' ORDER BY created_at ASC",
    );

    for (const intern of acceptedInterns) {
      certIndex += 1;
      const code = `MHR${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      await runExecute(
        `INSERT INTO certificates (id, certificate_number, verification_code, recipient_name, recipient_email, user_id, program_type, program_name, reference_id, issued_at, expires_at, status, qr_payload, file_url, verification_count, issued_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          `CERT/MHR/2025/${String(certIndex).padStart(4, '0')}`,
          code,
          intern.full_name,
          intern.email,
          intern.email === 'intern@mahreen.id' ? internId : null,
          'internship',
          `Program Magang ${intern.specialization}`,
          intern.id,
          iso(15 - certIndex),
          '',
          'issued',
          `/verifikasi/${code}`,
          '',
          certIndex * 2,
          adminId,
          iso(15 - certIndex),
        ],
      );
    }

    const webinarRows = await runQuery(
      'SELECT id, title FROM webinars ORDER BY created_at ASC LIMIT 2',
    );
    for (const w of webinarRows) {
      certIndex += 1;
      const code = `MHR${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      await runExecute(
        `INSERT INTO certificates (id, certificate_number, verification_code, recipient_name, recipient_email, user_id, program_type, program_name, reference_id, issued_at, expires_at, status, qr_payload, file_url, verification_count, issued_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          `CERT/MHR/2025/${String(certIndex).padStart(4, '0')}`,
          code,
          'Client User',
          'client@mahreen.id',
          clientId,
          'webinar',
          w.title,
          w.id,
          iso(9),
          '',
          'issued',
          `/verifikasi/${code}`,
          '',
          1,
          adminId,
          iso(9),
        ],
      );
    }
    logger.info(`${certIndex} certificates berhasil di-seed.`);
  }

  // ── certificate_verifications ──
  const existingVerifications = await runSingle(
    'SELECT COUNT(*) as count FROM certificate_verifications',
  );
  if (!existingVerifications || existingVerifications.count === 0) {
    const certRows = await runQuery('SELECT id, verification_code FROM certificates');
    for (const cert of certRows) {
      await runExecute(
        `INSERT INTO certificate_verifications (id, certificate_id, verification_code, result, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          cert.id,
          cert.verification_code,
          'valid',
          '127.0.0.1',
          'seed-script',
          iso(Math.floor(Math.random() * 10)),
        ],
      );
    }
  }

  // ── analytics_events ──
  const existingAnalytics = await runSingle('SELECT COUNT(*) as count FROM analytics_events');
  if (!existingAnalytics || existingAnalytics.count === 0) {
    const analyticsPaths = [
      { path: '/', name: 'page_view', category: 'landing' },
      { path: '/tanya-mahreen', name: 'page_view', category: 'service' },
      { path: '/newsroom', name: 'page_view', category: 'newsroom' },
      { path: '/mahreen-studio', name: 'page_view', category: 'studio' },
      { path: '/internship', name: 'page_view', category: 'internship' },
      { path: '/peduli-mahreen', name: 'page_view', category: 'donation' },
      { path: '/mahreen-csr', name: 'page_view', category: 'csr' },
      { path: '/portofolio', name: 'page_view', category: 'portfolio' },
    ];
    const devices = ['desktop', 'mobile', 'tablet'];
    const referrers = [
      'https://www.google.com',
      'https://www.instagram.com',
      'direct',
      'https://www.linkedin.com',
    ];

    const analyticsValues = [];
    for (let day = 0; day < 30; day++) {
      for (const target of analyticsPaths) {
        const hits = 4 + Math.floor(Math.random() * 12);
        for (let h = 0; h < hits; h++) {
          analyticsValues.push([
            uuidv4(),
            target.name,
            target.category,
            target.path,
            referrers[Math.floor(Math.random() * referrers.length)],
            null,
            `sess-${day}-${h}-${Math.random().toString(36).slice(2, 8)}`,
            devices[Math.floor(Math.random() * devices.length)],
            'Indonesia',
            JSON.stringify({}),
            iso(day, Math.floor(Math.random() * 20)),
          ]);
        }
      }
    }

    const chunkSize = 400;
    for (let i = 0; i < analyticsValues.length; i += chunkSize) {
      const chunk = analyticsValues.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      await runExecute(
        `INSERT INTO analytics_events (id, event_name, event_category, path, referrer, user_id, session_id, device, country, metadata, created_at) VALUES ${placeholders}`,
        chunk.flat(),
      );
    }
    logger.info(`${analyticsValues.length} analytics events berhasil di-seed.`);
  }

  // ── admin_audit_logs ──
  const existingAudit = await runSingle('SELECT COUNT(*) as count FROM admin_audit_logs');
  if (!existingAudit || existingAudit.count === 0) {
    const auditLogs = [
      {
        action: 'create',
        resource: 'articles',
        summary: 'Membuat artikel Tips Branding untuk Startup Pemula',
        days: 6,
      },
      {
        action: 'update',
        resource: 'products',
        summary: 'Memperbarui harga Mahreen Oversized Hoodie',
        days: 5,
      },
      {
        action: 'approve',
        resource: 'internship_applications',
        summary: 'Menyetujui pendaftar magang Alya Rahmawati',
        days: 4,
      },
      {
        action: 'issue',
        resource: 'certificates',
        summary: 'Menerbitkan sertifikat CERT/MHR/2025/0001',
        days: 3,
      },
      {
        action: 'update',
        resource: 'donation_campaigns',
        summary: 'Memperbarui target kampanye Air Bersih Nusantara',
        days: 2,
      },
      {
        action: 'approve',
        resource: 'csr_applications',
        summary: 'Menyetujui relawan CSR Dinda Ayu Lestari',
        days: 1,
      },
    ];

    for (const log of auditLogs) {
      await runExecute(
        `INSERT INTO admin_audit_logs (id, admin_id, admin_name, action, resource, resource_id, summary, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          adminId,
          'Admin Mahreen',
          log.action,
          log.resource,
          '',
          log.summary,
          JSON.stringify({}),
          iso(log.days),
        ],
      );
    }
    logger.info(`${auditLogs.length} admin audit logs berhasil di-seed.`);
  }

  // ── service_packages ──
  const existingPackages = await runSingle('SELECT COUNT(*) as count FROM service_packages');
  if (!existingPackages || existingPackages.count === 0) {
    const services = [
      { key: 'website', name: 'Website Development' },
      { key: 'branding', name: 'Branding & Design' },
      { key: 'digital-marketing', name: 'Digital Marketing' },
      { key: 'social-media', name: 'Social Media Management' },
      { key: 'content-production', name: 'Content Production' },
      { key: 'consulting', name: 'Business Consulting' },
    ];
    const tiers = [
      { tier: 'Basic', priceMul: 1, popular: 0 },
      { tier: 'Standard', priceMul: 2.5, popular: 1 },
      { tier: 'Premium', priceMul: 5, popular: 0 },
    ];
    const baseFeatures = {
      website: [
        'Landing Page',
        'Responsive Design',
        'SEO Basic',
        'SSL Certificate',
        'CMS Integration',
        'E-Commerce Setup',
        'Custom Analytics',
        'Priority Support',
      ],
      branding: [
        'Logo Design',
        'Brand Guidelines',
        'Business Card',
        'Stationery Set',
        'Social Media Kit',
        'Brand Strategy',
        'Market Research',
        'Brand Audit',
      ],
      'digital-marketing': [
        'SEO Optimization',
        'Google Ads',
        'Social Ads',
        'Email Marketing',
        'Analytics Report',
        'Content Strategy',
        'A/B Testing',
        'Dedicated Manager',
      ],
      'social-media': [
        'Content Calendar',
        '3 Platforms',
        'Copywriting',
        'Basic Graphics',
        'Community Mgmt',
        '5 Platforms',
        'Video Content',
        'Influencer Outreach',
      ],
      'content-production': [
        'Blog Articles',
        'Basic Graphics',
        'Social Captions',
        'Monthly Report',
        'Video Editing',
        'Photography',
        'Motion Graphics',
        'Content Strategy',
      ],
      consulting: [
        'Strategy Session',
        'Market Analysis',
        'Growth Roadmap',
        'Monthly Review',
        'Team Workshop',
        'Competitor Analysis',
        'Financial Modeling',
        'Board Advisory',
      ],
    };
    const basePrices = {
      website: 2500000,
      branding: 3500000,
      'digital-marketing': 2000000,
      'social-media': 1500000,
      'content-production': 1800000,
      consulting: 3000000,
    };

    for (const svc of services) {
      for (const t of tiers) {
        const price = Math.round(basePrices[svc.key] * t.priceMul);
        const features = baseFeatures[svc.key].slice(0, 3 + tiers.indexOf(t) * 2);
        await runExecute(
          `INSERT INTO service_packages (id, service_key, tier, name, price, features, is_popular, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            svc.key,
            t.tier,
            `${svc.name} ${t.tier}`,
            price,
            JSON.stringify(features),
            t.popular,
            now,
          ],
        );
      }
    }
    logger.info(`${services.length * tiers.length} service packages berhasil di-seed.`);
  }

  // ── service_addons ──
  const existingAddons = await runSingle('SELECT COUNT(*) as count FROM service_addons');
  if (!existingAddons || existingAddons.count === 0) {
    const addons = [
      { key: 'website', name: 'Extra Page', price: 500000 },
      { key: 'website', name: 'SEO Advanced', price: 750000 },
      { key: 'branding', name: 'Merchandise Design', price: 400000 },
      { key: 'digital-marketing', name: 'Google Ads Management', price: 1200000 },
      { key: 'digital-marketing', name: 'Analytics Dashboard', price: 600000 },
      { key: 'social-media', name: 'Video Content Pack', price: 800000 },
      { key: 'social-media', name: 'Influencer Campaign', price: 1500000 },
      { key: 'content-production', name: 'Photography Session', price: 900000 },
      { key: 'content-production', name: 'Motion Graphics', price: 1100000 },
      { key: 'consulting', name: 'Workshop Session', price: 2000000 },
    ];
    for (const a of addons) {
      await runExecute(
        `INSERT INTO service_addons (id, service_key, name, price, created_at) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), a.key, a.name, a.price, now],
      );
    }
    logger.info(`${addons.length} service addons berhasil di-seed.`);
  }

  // ── service_comparisons ──
  const existingComparisons = await runSingle('SELECT COUNT(*) as count FROM service_comparisons');
  if (!existingComparisons || existingComparisons.count === 0) {
    const comparisons = [
      { key: 'website', feature: 'Pages', better: '1 Page', good: '5 Pages', best: 'Unlimited' },
      {
        key: 'website',
        feature: 'Response Time',
        better: '48 hours',
        good: '24 hours',
        best: '4 hours',
      },
      { key: 'website', feature: 'Revisions', better: '2x', good: '5x', best: 'Unlimited' },
      { key: 'branding', feature: 'Logo Concepts', better: '2', good: '5', best: '10' },
      {
        key: 'branding',
        feature: 'Brand Guidelines',
        better: 'Basic',
        good: 'Standard',
        best: 'Comprehensive',
      },
      {
        key: 'digital-marketing',
        feature: 'Ad Budget Included',
        better: 'Rp 1M',
        good: 'Rp 3M',
        best: 'Rp 10M',
      },
      { key: 'digital-marketing', feature: 'Platforms', better: '1', good: '3', best: '5+' },
      { key: 'social-media', feature: 'Posts per Month', better: '8', good: '20', best: '40+' },
      { key: 'social-media', feature: 'Platforms', better: '2', good: '4', best: '6' },
      {
        key: 'content-production',
        feature: 'Articles per Month',
        better: '4',
        good: '12',
        best: '30',
      },
      {
        key: 'content-production',
        feature: 'Video Content',
        better: '—',
        good: '2/month',
        best: '8/month',
      },
      {
        key: 'consulting',
        feature: 'Sessions per Month',
        better: '1',
        good: '4',
        best: 'Unlimited',
      },
      {
        key: 'consulting',
        feature: 'Deliverables',
        better: 'Report',
        good: 'Report + Roadmap',
        best: 'Full Advisory',
      },
      {
        key: 'consulting',
        feature: 'Response Time',
        better: '72 hours',
        good: '24 hours',
        best: '4 hours',
      },
      {
        key: 'website',
        feature: 'Support',
        better: 'Email',
        good: 'Chat + Email',
        best: '24/7 Dedicated',
      },
    ];
    for (let i = 0; i < comparisons.length; i++) {
      const c = comparisons[i];
      await runExecute(
        `INSERT INTO service_comparisons (id, service_key, feature, better_value, good_value, best_value, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), c.key, c.feature, c.better, c.good, c.best, i + 1, now],
      );
    }
    logger.info(`${comparisons.length} service comparisons berhasil di-seed.`);
  }

  // ── webinar_registrations ──
  const existingWReg = await runSingle('SELECT COUNT(*) as count FROM webinar_registrations');
  if (!existingWReg || existingWReg.count === 0) {
    const webinarSlugs = [
      'digital-marketing-strategy',
      'ui-ux-design-masterclass',
      'ai-for-business',
    ];
    const regNames = [
      { name: 'Rina Wulandari', email: 'rina@example.com', status: 'confirmed' },
      { name: 'Budi Santoso', email: 'budi@example.com', status: 'confirmed' },
      { name: 'Sari Dewi', email: 'sari@example.com', status: 'pending-payment' },
      { name: 'Andi Prasetyo', email: 'andi@example.com', status: 'confirmed' },
      { name: 'Maya Putri', email: 'maya@example.com', status: 'cancelled' },
      { name: 'Alya Rahmawati', email: 'alya@example.com', status: 'confirmed' },
      { name: 'Galih Prakoso', email: 'galih@example.com', status: 'pending-payment' },
      { name: 'Dinda Ayu', email: 'dinda@example.com', status: 'confirmed' },
    ];
    for (let i = 0; i < regNames.length; i++) {
      const r = regNames[i];
      const slug = webinarSlugs[i % webinarSlugs.length];
      await runExecute(
        `INSERT INTO webinar_registrations (id, webinar_slug, webinar_title, webinar_category, webinar_price, full_name, email, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          slug,
          `Webinar ${slug}`,
          'Masterclass',
          i % 3 === 0 ? 0 : 149000,
          r.name,
          r.email,
          r.status,
          iso(Math.floor(Math.random() * 30)),
        ],
      );
    }
    logger.info(`${regNames.length} webinar registrations berhasil di-seed.`);
  }

  // ── webinar_payments ──
  const existingWP = await runSingle('SELECT COUNT(*) as count FROM webinar_payments');
  if (!existingWP || existingWP.count === 0) {
    const paidRegs = await runQuery(
      "SELECT id, webinar_slug, webinar_title, full_name, email, webinar_price FROM webinar_registrations WHERE status = 'confirmed' AND webinar_price > 0 LIMIT 5",
    );
    for (const reg of paidRegs) {
      await runExecute(
        `INSERT INTO webinar_payments (id, registration_id, webinar_slug, webinar_title, participant_name, participant_email, method, registration_fee, total, status, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          reg.id,
          reg.webinar_slug,
          reg.webinar_title,
          reg.full_name,
          reg.email,
          'qris',
          reg.webinar_price,
          reg.webinar_price,
          'paid',
          iso(Math.floor(Math.random() * 5)),
          iso(Math.floor(Math.random() * 10)),
        ],
      );
    }
    logger.info(`${paidRegs.length} webinar payments berhasil di-seed.`);
  }

  // ── collection_cards ──
  const existingCC = await runSingle('SELECT COUNT(*) as count FROM collection_cards');
  if (!existingCC || existingCC.count === 0) {
    const collections = [
      {
        title: 'Essentials Collection',
        desc: 'Produk daily-use dengan desain minimalis dan harga terjangkau.',
        layout: 'standard',
        cat: 'Apparel',
      },
      {
        title: 'Signature Series',
        desc: 'Koleksi premium dengan material pilihan dan desain eksklusif.',
        layout: 'featured',
        cat: 'Premium',
      },
      {
        title: 'Limited Edition',
        desc: 'Produk edisi terbatas yang hanya tersedia dalam jumlah terbatas.',
        layout: 'compact',
        cat: 'Exclusive',
      },
      {
        title: 'Studio Accessories',
        desc: 'Aksesori pelengkap untuk gaya profesional sehari-hari.',
        layout: 'standard',
        cat: 'Accessories',
      },
      {
        title: 'Workwear Essentials',
        desc: 'Pakaian kerja nyaman dan profesional untuk aktivitas bisnis.',
        layout: 'standard',
        cat: 'Workwear',
      },
      {
        title: 'Campus Collection',
        desc: 'Koleksi kasual untuk mahasiswa dan peserta magang.',
        layout: 'compact',
        cat: 'Casual',
      },
    ];
    for (let i = 0; i < collections.length; i++) {
      const c = collections[i];
      await runExecute(
        `INSERT INTO collection_cards (id, title, description, layout, category, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), c.title, c.desc, c.layout, c.cat, i + 1, now],
      );
    }
    logger.info(`${collections.length} collection cards berhasil di-seed.`);
  }

  // ── specializations ──
  const existingSpec = await runSingle('SELECT COUNT(*) as count FROM specializations');
  if (!existingSpec || existingSpec.count === 0) {
    const specs = [
      {
        title: 'UI/UX Design',
        desc: 'Perancangan antarmuka dan pengalaman pengguna digital.',
        icon: 'palette',
      },
      {
        title: 'Web Development',
        desc: 'Pembangunan aplikasi web modern dan responsif.',
        icon: 'code',
      },
      {
        title: 'Digital Marketing',
        desc: 'Strategi pemasaran digital berbasis data dan analitik.',
        icon: 'trending-up',
      },
      {
        title: 'Content Production',
        desc: 'Pembuatan konten kreatif untuk berbagai platform.',
        icon: 'video',
      },
      {
        title: 'Business Strategy',
        desc: 'Konsultasi strategi bisnis dan transformasi digital.',
        icon: 'briefcase',
      },
    ];
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      await runExecute(
        `INSERT INTO specializations (id, title, description, icon, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), s.title, s.desc, s.icon, i + 1, now],
      );
    }
    logger.info(`${specs.length} specializations berhasil di-seed.`);
  }

  // ── notifications ──
  const existingNotif = await runSingle('SELECT COUNT(*) as count FROM notifications');
  if (!existingNotif || existingNotif.count === 0) {
    const clientUser = await runSingle("SELECT id FROM users WHERE role = 'client' LIMIT 1");
    if (clientUser) {
      const notifs = [
        {
          type: 'order',
          title: 'Pesanan dikonfirmasi',
          msg: 'Pesanan studio Anda telah dikonfirmasi.',
          days: 1,
        },
        {
          type: 'project',
          title: 'Proyek diperbarui',
          msg: 'Progress website landing page telah diperbarui.',
          days: 2,
        },
        {
          type: 'webinar',
          title: 'Webinar mendatang',
          msg: 'Digital Marketing Masterclass dimulai besok.',
          days: 3,
        },
        {
          type: 'donation',
          title: 'Donasi diterima',
          msg: 'Donasi Anda sebesar Rp 250.000 telah diterima.',
          days: 4,
        },
        {
          type: 'certificate',
          title: 'Sertifikat diterbitkan',
          msg: 'Sertifikat internship Anda telah diterbitkan.',
          days: 5,
        },
        {
          type: 'order',
          title: 'Pesanan dikirim',
          msg: 'Pesanan Anda sedang dalam perjalanan.',
          days: 6,
        },
        {
          type: 'project',
          title: 'Kick-off meeting',
          msg: 'Jadwal kick-off meeting proyek branding dijadwalkan.',
          days: 7,
        },
        {
          type: 'system',
          title: 'Selamat datang',
          msg: 'Selamat datang di portal client Mahreen Indonesia.',
          days: 30,
        },
        {
          type: 'webinar',
          title: 'Webinar selesai',
          msg: 'Rekaman UI/UX Masterclass tersedia di dashboard.',
          days: 10,
        },
        {
          type: 'project',
          title: 'Milestone tercapai',
          msg: 'Fase desain website telah selesai.',
          days: 8,
        },
      ];
      for (const n of notifs) {
        await runExecute(
          `INSERT INTO notifications (id, user_id, type, title, message, link, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), clientUser.id, n.type, n.title, n.msg, '#', 0, iso(n.days)],
        );
      }
      logger.info(`${notifs.length} notifications berhasil di-seed.`);
    }
  }

  // ── faqs ──
  const existingFaq = await runSingle('SELECT COUNT(*) as count FROM faqs');
  if (!existingFaq || existingFaq.count === 0) {
    const faqs = [
      {
        q: 'Bagaimana cara mendaftar layanan Mahreen?',
        a: 'Pilih layanan yang diinginkan, lalu isi formulir konsultasi gratis di halaman Tanya Mahreen. Tim kami akan menghubungi Anda dalam 1×24 jam.',
        cat: 'Layanan',
        order: 1,
      },
      {
        q: 'Metode pembayaran apa yang diterima?',
        a: 'Kami menerima transfer bank (BCA, BNI, BRI, Mandiri), QRIS, virtual account, dan e-wallet (GoPay, OVO, ShopeePay).',
        cat: 'Pembayaran',
        order: 2,
      },
      {
        q: 'Bagaimana proses refund?',
        a: 'Refund dapat diajukan dalam 7 hari setelah pembayaran. Hubungi tim support kami via WhatsApp untuk proses lebih lanjut.',
        cat: 'Pembayaran',
        order: 3,
      },
      {
        q: 'Apakah ada garansi untuk layanan development?',
        a: 'Ya, kami memberikan garansi revisi gratis selama 30 hari setelah project selesai. Untuk masalah teknis, support tersedia selama 3 bulan.',
        cat: 'Layanan',
        order: 4,
      },
      {
        q: 'Bagaimana cara memantau progress proyek?',
        a: 'Anda dapat memantau progress melalui Client Dashboard di portal Mahreen. Update progress dilakukan secara real-time.',
        cat: 'Proyek',
        order: 5,
      },
      {
        q: 'Berapa lama waktu pengerjaan website?',
        a: 'Waktu pengerjaan bervariasi: Landing Page 5-7 hari, Corporate Website 2-4 minggu, E-Commerce 4-8 minggu tergantung kompleksitas.',
        cat: 'Layanan',
        order: 6,
      },
      {
        q: 'Apakah Mahreen menerima project dari luar kota?',
        a: 'Ya, kami melayani client dari seluruh Indonesia. Komunikasi dilakukan secara online melalui video call dan chat.',
        cat: 'Umum',
        order: 7,
      },
      {
        q: 'Bagaimana cara berdonasi di Peduli Mahreen?',
        a: 'Pilih kampanye yang ingin didukung, tentukan jumlah donasi, lalu lakukan pembayaran. Bukti donasi akan dikirim via email.',
        cat: 'Donasi',
        order: 8,
      },
      {
        q: 'Apakah ada program magang di Mahreen?',
        a: 'Ya, kami membuka program magang secara berkala. Informasi terbaru dapat dilihat di halaman Internship atau Newsroom.',
        cat: 'Magang',
        order: 9,
      },
      {
        q: 'Bagaimana cara menghubungi tim Mahreen?',
        a: 'Hubungi kami via WhatsApp di +62 896 5264 7385, email hello@mahreen.id, atau melalui formulir kontak di website.',
        cat: 'Kontak',
        order: 10,
      },
    ];
    for (const f of faqs) {
      await runExecute(
        `INSERT INTO faqs (id, question, answer, category, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), f.q, f.a, f.cat, f.order, now],
      );
    }
    logger.info(`${faqs.length} FAQs berhasil di-seed.`);
  }

  // ── speakers ──
  const existingSpeakers = await runSingle('SELECT COUNT(*) as count FROM speakers');
  if (!existingSpeakers || existingSpeakers.count === 0) {
    const speakers = [
      {
        name: 'Ahmad Sulaiman',
        role: 'Head of Digital Marketing',
        company: 'TechVantage Indonesia',
        desc: '12+ tahun pengalaman digital marketing.',
      },
      {
        name: 'Siti Aminah',
        role: 'Senior Product Designer',
        company: 'Glow Studio',
        desc: 'Specialist UI/UX untuk produk digital premium.',
      },
      {
        name: 'Renoy Wijaya',
        role: 'AI Strategy Consultant',
        company: 'Mahreen Lab',
        desc: 'Praktisi transformasi digital dan AI.',
      },
      {
        name: 'Budi Santoso',
        role: 'Konsultan Bisnis',
        company: 'Mahreen Indonesia',
        desc: 'Strategi digital dan pengembangan organisasi.',
      },
      {
        name: 'Dr. Anindya Putri',
        role: 'Head of Research',
        company: 'Mahreen Lab',
        desc: 'Data science dan kebijakan publik.',
      },
      {
        name: 'Maya Sari',
        role: 'Creative Director',
        company: 'Glow Studio',
        desc: 'Digital branding specialist.',
      },
    ];
    for (const s of speakers) {
      await runExecute(
        `INSERT INTO speakers (id, name, role, company, description, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), s.name, s.role, s.company, s.desc, '', now, now],
      );
    }
    logger.info(`${speakers.length} speakers berhasil di-seed.`);
  }

  // ── newsletter_subscribers ──
  const existingNL = await runSingle('SELECT COUNT(*) as count FROM newsletter_subscribers');
  if (!existingNL || existingNL.count === 0) {
    const subs = [
      'rina@example.com',
      'budi@example.com',
      'sari@example.com',
      'andi@example.com',
      'maya@example.com',
      'alya@example.com',
      'galih@example.com',
      'dinda@example.com',
    ];
    for (const email of subs) {
      await runExecute(
        `INSERT INTO newsletter_subscribers (id, email, source, status, created_at) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), email, 'newsroom', 'active', now],
      );
    }
    logger.info(`${subs.length} newsletter subscribers berhasil di-seed.`);
  }

  // ── newsroom_settings ──
  const existingSettings = await runSingle('SELECT COUNT(*) as count FROM newsroom_settings');
  if (!existingSettings || existingSettings.count === 0) {
    const settings = [
      { key: 'site_title', value: 'Mahreen Indonesia Newsroom' },
      {
        key: 'site_description',
        value: 'Wadah informasi, artikel, dan insight seputar digital, kreatif, dan sosial.',
      },
      { key: 'articles_per_page', value: '12' },
      { key: 'enable_newsletter', value: 'true' },
    ];
    for (const s of settings) {
      await runExecute(
        `INSERT INTO newsroom_settings (id, setting_key, setting_value, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), s.key, s.value, now, now],
      );
    }
    logger.info(`${settings.length} newsroom settings berhasil di-seed.`);
  }

  // ── categories ──
  const existingCats = await runSingle('SELECT COUNT(*) as count FROM categories');
  if (!existingCats || existingCats.count === 0) {
    const cats = [
      { name: 'Ecosystem Update', slug: 'ecosystem-update', order: 1 },
      { name: 'Events', slug: 'events', order: 2 },
      { name: 'Technology', slug: 'technology', order: 3 },
      { name: 'Business', slug: 'business', order: 4 },
      { name: 'Creative', slug: 'creative', order: 5 },
      { name: 'Internship Update', slug: 'internship-update', order: 6 },
    ];
    for (const c of cats) {
      await runExecute(
        `INSERT INTO categories (id, name, slug, display_order, created_at) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), c.name, c.slug, c.order, now],
      );
    }
    logger.info(`${cats.length} categories berhasil di-seed.`);
  }

  // ── studio_orders ──
  const existingSO = await runSingle('SELECT COUNT(*) as count FROM studio_orders');
  if (!existingSO || existingSO.count === 0) {
    const clientUser = await runSingle("SELECT id FROM users WHERE role = 'client' LIMIT 1");
    const productRows = await runQuery('SELECT id, title FROM products LIMIT 4');
    if (clientUser && productRows.length > 0) {
      const orders = [
        { prodIdx: 0, qty: 1, price: 299000, status: 'delivered', method: 'qris', days: 20 },
        { prodIdx: 1, qty: 2, price: 349000, status: 'shipped', method: 'bank_transfer', days: 10 },
        { prodIdx: 0, qty: 1, price: 299000, status: 'processed', method: 'qris', days: 5 },
        { prodIdx: 2, qty: 1, price: 199000, status: 'confirmed', method: 'e_wallet', days: 2 },
        {
          prodIdx: 3,
          qty: 3,
          price: 149000,
          status: 'confirmed',
          method: 'bank_transfer',
          days: 1,
        },
      ];
      for (const o of orders) {
        const prod = productRows[o.prodIdx % productRows.length];
        await runExecute(
          `INSERT INTO studio_orders (id, user_id, product_id, product_name, quantity, total_price, shipping_name, shipping_city, shipping_province, tracking_number, status, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            clientUser.id,
            prod.id,
            prod.title,
            o.qty,
            o.price * o.qty,
            'Rina Wulandari',
            'Jakarta Selatan',
            'DKI Jakarta',
            o.status === 'shipped' || o.status === 'delivered'
              ? `TRK-${Date.now().toString(36).toUpperCase()}`
              : '',
            o.status,
            o.method,
            iso(o.days),
          ],
        );
      }
      logger.info(`${orders.length} studio orders berhasil di-seed.`);
    }
  }

  // ── product stock/sku backfill ──
  const productRows = await runQuery("SELECT id, slug FROM products WHERE sku IS NULL OR sku = ''");
  for (let i = 0; i < productRows.length; i++) {
    await runExecute(
      `UPDATE products SET stock = ?, sku = ?, status = ?, sold_count = ?, gallery = ?, updated_at = ? WHERE id = ?`,
      [
        25 + i * 7,
        `MHR-${String(i + 1).padStart(3, '0')}`,
        'published',
        4 + i * 3,
        JSON.stringify([]),
        now,
        productRows[i].id,
      ],
    );
  }

  // ── users backfill ──
  await runExecute(
    `UPDATE users SET status = 'active', email_verified = 1, updated_at = ? WHERE status IS NULL OR status = ''`,
    [now],
  );

  // ── transactions backfill ──
  await runExecute(
    `UPDATE transactions SET payment_method = 'bank_transfer', updated_at = ? WHERE payment_method IS NULL OR payment_method = ''`,
    [now],
  );

  // ── extra users for user management ──
  if (!skipExtraUsers) {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash(generatePassword(), salt);
    const extraUsers = [
      {
        name: 'Rina Wulandari',
        email: 'rina@example.com',
        role: 'client',
        type: 'company',
        status: 'active',
        days: 60,
      },
      {
        name: 'Budi Santoso',
        email: 'budi@example.com',
        role: 'client',
        type: 'company',
        status: 'active',
        days: 55,
      },
      {
        name: 'Sari Dewi',
        email: 'sari@example.com',
        role: 'client',
        type: 'individual',
        status: 'active',
        days: 48,
      },
      {
        name: 'Andi Prasetyo',
        email: 'andi@example.com',
        role: 'client',
        type: 'individual',
        status: 'inactive',
        days: 40,
      },
      {
        name: 'Maya Putri',
        email: 'maya@example.com',
        role: 'client',
        type: 'company',
        status: 'active',
        days: 35,
      },
      {
        name: 'Alya Rahmawati',
        email: 'alya@example.com',
        role: 'intern',
        type: 'individual',
        status: 'active',
        days: 25,
      },
      {
        name: 'Galih Prakoso',
        email: 'galih@example.com',
        role: 'intern',
        type: 'individual',
        status: 'active',
        days: 20,
      },
      {
        name: 'Editor Mahreen',
        email: 'editor@mahreen.id',
        role: 'admin',
        type: 'company',
        status: 'active',
        days: 70,
      },
    ];

    for (const u of extraUsers) {
      const duplicate = await runSingle('SELECT id FROM users WHERE email = ?', [u.email]);
      if (duplicate) continue;
      await runExecute(
        `INSERT INTO users (id, account_type, full_name, email, password, role, status, email_verified, last_login_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          u.type,
          u.name,
          u.email,
          defaultPassword,
          u.role,
          u.status,
          1,
          iso(Math.floor(Math.random() * 10)),
          iso(u.days),
          iso(u.days),
        ],
      );
    }
    logger.info(`${extraUsers.length} additional users berhasil diproses.`);
  }

  // ── webinar/event backfill ──
  await runExecute(
    `UPDATE webinars SET status = 'published', quota = 100, registered_count = FLOOR(20 + RAND() * 50), updated_at = ? WHERE status IS NULL OR status = ''`,
    [now],
  );
  await runExecute(
    `UPDATE events SET status = 'published', quota = 150, updated_at = ? WHERE status IS NULL OR status = ''`,
    [now],
  );
  await runExecute(
    `UPDATE csr_programs SET location = 'Indonesia', budget = 250000000, start_date = ?, end_date = ?, updated_at = ? WHERE location IS NULL OR location = ''`,
    [iso(90), iso(-90), now],
  );
  await runExecute(
    `UPDATE internship_batches SET quota = ?, start_date = ?, end_date = ?, mentor_name = ? WHERE quota = 0 OR quota IS NULL`,
    [20, iso(-14), iso(-104), 'Admin Mahreen'],
  );

  // Seed role default di akhir full seed
  await ensureDefaultRolesExist();
  await ensureNewPermissionsGranted();
};

module.exports = { seedDatabase };
