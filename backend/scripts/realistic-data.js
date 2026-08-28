require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { initDatabase, runExecute, runSingle, runQuery } = require("../src/config/database");
const { v4: uuidv4 } = require("uuid");
const logger = require("../src/utils/logger");

const iso = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const run = async () => {
  try {
    await initDatabase();
    const clientUser = await runSingle("SELECT id, email FROM users WHERE role = 'client' LIMIT 1");
    if (!clientUser) { console.error("No client user found"); process.exit(1); }
    const clientId = clientUser.id;
    console.log(`Client user: ${clientUser.email} (${clientId})`);

    const adminUser = await runSingle("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    const adminId = adminUser ? adminUser.id : clientId;

    // ── 1. Link service_orders to client ──
    const orders = await runQuery("SELECT id FROM service_orders LIMIT 6");
    for (let i = 0; i < orders.length; i++) {
      const status = ["pending", "in_progress", "in_progress", "completed", "completed", "completed"][i];
      await runExecute("UPDATE service_orders SET user_id = ?, status = ?, created_at = ? WHERE id = ?",
        [clientId, status, iso(-(i * 5)), orders[i].id]);
    }
    console.log(`${orders.length} service_orders linked to client.`);

    // ── 2. Link consultations to client ──
    const consults = await runQuery("SELECT id FROM consultations LIMIT 7");
    for (let i = 0; i < consults.length; i++) {
      const status = ["pending", "scheduled", "completed", "completed", "pending", "scheduled", "completed"][i];
      await runExecute("UPDATE consultations SET user_id = ?, status = ?, created_at = ? WHERE id = ?",
        [clientId, status, iso(-(i * 4)), consults[i].id]);
    }
    console.log(`${consults.length} consultations linked to client.`);

    // ── 3. Link donations to client ──
    const dons = await runQuery("SELECT id FROM donations LIMIT 5");
    for (let i = 0; i < dons.length; i++) {
      const status = ["paid", "paid", "paid", "pending", "paid"][i];
      await runExecute("UPDATE donations SET user_id = ?, payment_status = ?, created_at = ? WHERE id = ?",
        [clientId, status, iso(-(i * 3)), dons[i].id]);
    }
    console.log(`${dons.length} donations linked to client.`);

    // ── 4. Link transactions to client ──
    const txns = await runQuery("SELECT id FROM transactions LIMIT 3");
    for (let i = 0; i < txns.length; i++) {
      const status = ["paid", "paid", "pending"][i];
      await runExecute("UPDATE transactions SET client_name = ?, status = ?, created_at = ? WHERE id = ?",
        ["Rina Wulandari", status, iso(-(i * 6)), txns[i].id]);
    }
    console.log(`${txns.length} transactions updated.`);

    // ── 5. Link studio_orders to client ──
    const so = await runQuery("SELECT id FROM studio_orders LIMIT 4");
    for (let i = 0; i < so.length; i++) {
      const status = ["delivered", "shipped", "processed", "confirmed"][i];
      await runExecute("UPDATE studio_orders SET user_id = ?, status = ?, created_at = ? WHERE id = ?",
        [clientId, status, iso(-(i * 7)), so[i].id]);
    }
    console.log(`${so.length} studio_orders linked to client.`);

    // ── 6. Link certificates to client ──
    const certs = await runQuery("SELECT id FROM certificates LIMIT 3");
    for (let i = 0; i < certs.length; i++) {
      await runExecute("UPDATE certificates SET user_id = ?, issued_at = ? WHERE id = ?",
        [clientId, iso(-(i * 10)), certs[i].id]);
    }
    console.log(`${certs.length} certificates linked to client.`);

    // ── 7. Add article content ──
    const articles = await runQuery("SELECT id, title, category FROM articles LIMIT 10");
    for (const article of articles) {
      const content = JSON.stringify({
        lead: `Artikel ini membahas topik ${article.title} secara mendalam untuk pembaca Mahreen Indonesia.`,
        sections: [
          { heading: "Latar Belakang", paragraphs: [
            `${article.title} menjadi topik yang relevan bagi perkembangan industri digital di Indonesia. Dalam artikel ini, kita akan membahas berbagai aspek penting yang perlu dipahami.`,
            "Mahreen Indonesia berkomitmen untuk menyediakan informasi berkualitas bagi seluruh ekosistem kreatif dan digital."
          ]},
          { heading: "Analisis Mendalam", paragraphs: [
            "Berdasarkan data dan tren terkini, perkembangan di bidang ini menunjukkan pertumbuhan yang signifikan. Penting bagi pelaku industri untuk memahami perubahan ini.",
            "Kolaborasi antara berbagai pemangku kepentingan menjadi kunci keberhasilan dalam menghadapi tantangan ini."
          ]}
        ],
        figure: { image: "/og-image.jpg", alt: article.title, caption: `Dokumentasi: ${article.title}` }
      });
      await runExecute("UPDATE articles SET content = ? WHERE id = ?", [content, article.id]);
    }
    console.log(`${articles.length} articles updated with content.`);

    // ── 8. Fix webinar dates to future ──
    const webinars = await runQuery("SELECT id FROM webinars ORDER BY created_at ASC");
    for (let i = 0; i < webinars.length; i++) {
      await runExecute("UPDATE webinars SET schedule_date = ?, status = 'published' WHERE id = ?", [iso(30 + i * 15), webinars[i].id]);
    }
    console.log(`${webinars.length} webinar dates updated to future.`);

    // ── 9. Fix event dates to future ──
    const events = await runQuery("SELECT id FROM events ORDER BY created_at ASC");
    for (let i = 0; i < events.length; i++) {
      await runExecute("UPDATE events SET event_date = ?, status = 'published' WHERE id = ?", [iso(20 + i * 15), events[i].id]);
    }
    console.log(`${events.length} event dates updated to future.`);

    // ── 10. Add more notifications for client ──
    const notifTypes = [
      { type: "order", title: "Pesanan dikonfirmasi", msg: "Pesanan studio Mahreen Oversized Hoodie telah dikonfirmasi dan sedang diproses." },
      { type: "project", title: "Proyek diperbarui", msg: "Progress website landing page untuk PT Maju Bersama telah mencapai 60%." },
      { type: "webinar", title: "Webinar mendatang", msg: "Digital Marketing Masterclass akan dimulai dalam 3 hari. Siapkan diri Anda!" },
      { type: "donation", title: "Donasi diterima", msg: "Donasi Anda sebesar Rp 250.000 untuk kampanye Air Bersih Nusantara telah diterima." },
      { type: "certificate", title: "Sertifikat diterbitkan", msg: "Sertifikat internship Batch 2 telah diterbitkan. Silakan unduh dari dashboard." },
      { type: "order", title: "Pesanan dikirim", msg: "Pesanan Mahreen Studio sedang dalam perjalanan. Estimasi tiba: 3 hari." },
      { type: "project", title: "Kick-off meeting", msg: "Jadwal kick-off meeting proyek branding dijadwalkan Senin, 10:00 WIB." },
      { type: "system", title: "Selamat datang", msg: "Selamat datang di portal client Mahreen Indonesia. Jelajahi fitur yang tersedia." },
    ];
    for (let i = 0; i < notifTypes.length; i++) {
      const n = notifTypes[i];
      await runExecute(
        "INSERT INTO notifications (id, user_id, type, title, message, link, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [uuidv4(), clientId, n.type, n.title, n.msg, "#", i > 3 ? 1 : 0, iso(-(i * 2))]
      );
    }
    console.log(`${notifTypes.length} notifications created for client.`);

    console.log("\n=== Realistic data update complete ===");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

run();
