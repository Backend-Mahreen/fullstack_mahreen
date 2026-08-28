require("dotenv").config({ quiet: true });
const { initDatabase, runQuery, runSingle, runExecute } = require("../src/config/database");
const { v4: uuidv4 } = require("uuid");

let pass = 0;
let fail = 0;

const check = (name, ok, detail = "") => {
  if (ok) {
    pass += 1;
    console.log(`  PASS  ${name}`);
  } else {
    fail += 1;
    console.log(`  FAIL  ${name}${detail ? `  :: ${detail}` : ""}`);
  }
};

const nowIso = () => new Date().toISOString();

(async () => {
  await initDatabase();

  console.log("== FK22: ON DELETE SET NULL behaviour ==");

  // Siapkan user uji beserta data anak pada setiap tabel yang mereferensikannya.
  const userId = uuidv4();
  await runExecute(
    `INSERT INTO users (id, account_type, full_name, email, password, role, status, created_at)
     VALUES (?, 'individual', 'FK Test User', ?, 'x', 'client', 'active', ?)`,
    [userId, `fk-test-${Date.now()}@example.com`, nowIso()]
  );

  const campaignId = uuidv4();
  await runExecute(
    `INSERT INTO donation_campaigns (id, slug, title, target_amount, status, created_at)
     VALUES (?, ?, 'FK Test Campaign', 1000000, 'active', ?)`,
    [campaignId, `fk-test-campaign-${Date.now()}`, nowIso()]
  );

  const donationId = uuidv4();
  await runExecute(
    `INSERT INTO donations (id, user_id, donor_name, amount, campaign_id, payment_status, created_at)
     VALUES (?, ?, 'FK Test Donor', 50000, ?, 'paid', ?)`,
    [donationId, userId, campaignId, nowIso()]
  );

  const transactionId = uuidv4();
  await runExecute(
    `INSERT INTO transactions (id, invoice_id, user_id, client_name, amount, status, created_at)
     VALUES (?, ?, ?, 'FK Test Client', 75000, 'PAID', ?)`,
    [transactionId, `INV-FKTEST-${Date.now()}`, userId, nowIso()]
  );

  const consultationId = uuidv4();
  await runExecute(
    `INSERT INTO consultations (id, user_id, full_name, email, status, created_at)
     VALUES (?, ?, 'FK Test', 'fk@example.com', 'pending', ?)`,
    [consultationId, userId, nowIso()]
  );

  const certificateId = uuidv4();
  const verificationCode = `FKTEST${Date.now()}`;
  await runExecute(
    `INSERT INTO certificates (id, certificate_number, verification_code, recipient_name, user_id, issued_by, status, created_at)
     VALUES (?, ?, ?, 'FK Test', ?, ?, 'issued', ?)`,
    [certificateId, `CERT/FKTEST/${Date.now()}`, verificationCode, userId, userId, nowIso()]
  );

  const verificationId = uuidv4();
  await runExecute(
    `INSERT INTO certificate_verifications (id, certificate_id, verification_code, result, created_at)
     VALUES (?, ?, ?, 'valid', ?)`,
    [verificationId, certificateId, verificationCode, nowIso()]
  );

  check("data uji tersiapkan", true);

  // Hapus user induk. Semua kolom anak harus menjadi NULL, baris tetap ada.
  await runExecute("DELETE FROM users WHERE id = ?", [userId]);

  const donationAfter = await runSingle("SELECT user_id, campaign_id FROM donations WHERE id = ?", [donationId]);
  check("donations.user_id -> NULL", donationAfter && donationAfter.user_id === null);
  check("donations baris tidak terhapus", donationAfter !== null);
  check("donations.campaign_id tidak terpengaruh", donationAfter && donationAfter.campaign_id === campaignId);

  const transactionAfter = await runSingle("SELECT user_id FROM transactions WHERE id = ?", [transactionId]);
  check("transactions.user_id -> NULL", transactionAfter && transactionAfter.user_id === null);

  const consultationAfter = await runSingle("SELECT user_id FROM consultations WHERE id = ?", [consultationId]);
  check("consultations.user_id -> NULL", consultationAfter && consultationAfter.user_id === null);

  const certificateAfter = await runSingle("SELECT user_id, issued_by FROM certificates WHERE id = ?", [certificateId]);
  check("certificates.user_id -> NULL", certificateAfter && certificateAfter.user_id === null);
  check("certificates.issued_by -> NULL", certificateAfter && certificateAfter.issued_by === null);

  // Hapus kampanye induk.
  await runExecute("DELETE FROM donation_campaigns WHERE id = ?", [campaignId]);
  const donationAfterCampaign = await runSingle("SELECT campaign_id FROM donations WHERE id = ?", [donationId]);
  check("donations.campaign_id -> NULL", donationAfterCampaign && donationAfterCampaign.campaign_id === null);

  // Hapus sertifikat induk.
  await runExecute("DELETE FROM certificates WHERE id = ?", [certificateId]);
  const verificationAfter = await runSingle(
    "SELECT certificate_id FROM certificate_verifications WHERE id = ?",
    [verificationId]
  );
  check("certificate_verifications.certificate_id -> NULL", verificationAfter && verificationAfter.certificate_id === null);
  check("log verifikasi tetap tersimpan", verificationAfter !== null);

  console.log("\n== FK23: referential integrity (insert parent tidak ada) ==");

  const ghostId = uuidv4();

  const expectReject = async (name, sql, params) => {
    try {
      await runExecute(sql, params);
      check(name, false, "insert seharusnya ditolak");
      return false;
    } catch (error) {
      check(name, error.code === "ER_NO_REFERENCED_ROW_2" || error.code === "ER_NO_REFERENCED_ROW", error.code);
      return true;
    }
  };

  await expectReject(
    "tolak donations.user_id tidak valid",
    `INSERT INTO donations (id, user_id, donor_name, amount, payment_status, created_at)
     VALUES (?, ?, 'Ghost', 1000, 'pending', ?)`,
    [uuidv4(), ghostId, nowIso()]
  );

  await expectReject(
    "tolak donations.campaign_id tidak valid",
    `INSERT INTO donations (id, campaign_id, donor_name, amount, payment_status, created_at)
     VALUES (?, ?, 'Ghost', 1000, 'pending', ?)`,
    [uuidv4(), ghostId, nowIso()]
  );

  await expectReject(
    "tolak internship_applications.batch_id tidak valid",
    `INSERT INTO internship_applications (id, full_name, email, batch_id, status, created_at)
     VALUES (?, 'Ghost', 'ghost@example.com', ?, 'pending', ?)`,
    [uuidv4(), ghostId, nowIso()]
  );

  await expectReject(
    "tolak csr_applications.program_id tidak valid",
    `INSERT INTO csr_applications (id, full_name, email, program_id, status, created_at)
     VALUES (?, 'Ghost', 'ghost@example.com', ?, 'pending', ?)`,
    [uuidv4(), ghostId, nowIso()]
  );

  await expectReject(
    "tolak certificate_verifications.certificate_id tidak valid",
    `INSERT INTO certificate_verifications (id, certificate_id, verification_code, result, created_at)
     VALUES (?, ?, 'GHOST', 'valid', ?)`,
    [uuidv4(), ghostId, nowIso()]
  );

  await expectReject(
    "tolak certificates.user_id tidak valid",
    `INSERT INTO certificates (id, certificate_number, verification_code, recipient_name, user_id, status, created_at)
     VALUES (?, ?, ?, 'Ghost', ?, 'issued', ?)`,
    [uuidv4(), `CERT/GHOST/${Date.now()}`, `GHOST${Date.now()}`, ghostId, nowIso()]
  );

  console.log("\n== NULL tetap diperbolehkan ==");

  const nullDonationId = uuidv4();
  try {
    await runExecute(
      `INSERT INTO donations (id, user_id, campaign_id, donor_name, amount, payment_status, created_at)
       VALUES (?, NULL, NULL, 'Anonim', 1000, 'pending', ?)`,
      [nullDonationId, nowIso()]
    );
    check("terima donations dengan user_id & campaign_id NULL", true);
    await runExecute("DELETE FROM donations WHERE id = ?", [nullDonationId]);
  } catch (error) {
    check("terima donations dengan user_id & campaign_id NULL", false, error.message);
  }

  // Bersihkan sisa data uji.
  await runExecute("DELETE FROM certificate_verifications WHERE id = ?", [verificationId]);
  await runExecute("DELETE FROM donations WHERE id = ?", [donationId]);
  await runExecute("DELETE FROM transactions WHERE id = ?", [transactionId]);
  await runExecute("DELETE FROM consultations WHERE id = ?", [consultationId]);

  console.log("\n== Verifikasi tidak ada orphan tersisa ==");
  const leftover = await runQuery(
    `SELECT COUNT(*) n FROM certificate_verifications c
     LEFT JOIN certificates p ON p.id = c.certificate_id
     WHERE c.certificate_id IS NOT NULL AND p.id IS NULL`
  );
  check("tidak ada orphan certificate_verifications", Number(leftover[0].n) === 0);

  console.log(`\nRESULT: PASS=${pass}  FAIL=${fail}`);
  process.exit(fail > 0 ? 1 : 0);
})().catch((error) => {
  console.error("EXCEPTION:", error);
  process.exit(1);
});
