require("dotenv").config({ quiet: true });
const { initDatabase, runQuery } = require("../src/config/database");

const checks = [
  { child: "donations", col: "user_id", parent: "users" },
  { child: "donations", col: "campaign_id", parent: "donation_campaigns" },
  { child: "internship_applications", col: "user_id", parent: "users" },
  { child: "internship_applications", col: "batch_id", parent: "internship_batches" },
  { child: "csr_applications", col: "user_id", parent: "users" },
  { child: "csr_applications", col: "program_id", parent: "csr_programs" },
  { child: "csr_applications", col: "reviewed_by", parent: "users" },
  { child: "consultations", col: "user_id", parent: "users" },
  { child: "service_orders", col: "user_id", parent: "users" },
  { child: "certificates", col: "user_id", parent: "users" },
  { child: "certificates", col: "issued_by", parent: "users" },
  { child: "certificate_verifications", col: "certificate_id", parent: "certificates" },
  { child: "admin_audit_logs", col: "admin_id", parent: "users" },
  { child: "analytics_events", col: "user_id", parent: "users" },
  { child: "transactions", col: "user_id", parent: "users" },
];

(async () => {
  await initDatabase();

  console.log(
    "child.column".padEnd(44) + "filled".padStart(7) + "orphan".padStart(8) + "empty".padStart(7)
  );
  console.log("-".repeat(66));

  let totalOrphan = 0;

  for (const c of checks) {
    const filled = await runQuery(
      "SELECT COUNT(*) n FROM `" + c.child + "` WHERE `" + c.col + "` IS NOT NULL AND `" + c.col + "` <> ''"
    );
    const orphan = await runQuery(
      "SELECT COUNT(*) n FROM `" +
        c.child +
        "` c LEFT JOIN `" +
        c.parent +
        "` p ON p.id = c.`" +
        c.col +
        "` WHERE c.`" +
        c.col +
        "` IS NOT NULL AND c.`" +
        c.col +
        "` <> '' AND p.id IS NULL"
    );
    const empty = await runQuery(
      "SELECT COUNT(*) n FROM `" + c.child + "` WHERE `" + c.col + "` = ''"
    );

    totalOrphan += Number(orphan[0].n);
    const flag = Number(orphan[0].n) > 0 ? "  <== ORPHAN" : "";

    console.log(
      (c.child + "." + c.col).padEnd(44) +
        String(filled[0].n).padStart(7) +
        String(orphan[0].n).padStart(8) +
        String(empty[0].n).padStart(7) +
        flag
    );
  }

  console.log("-".repeat(66));
  console.log("TOTAL ORPHAN ROWS: " + totalOrphan);

  const fks = await runQuery(
    `SELECT TABLE_NAME t, COLUMN_NAME c, CONSTRAINT_NAME n, REFERENCED_TABLE_NAME rt
     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
     WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL`
  );
  console.log("\nEXISTING FOREIGN KEYS: " + fks.length);
  fks.forEach((f) => console.log("  " + f.t + "." + f.c + " -> " + f.rt + "  (" + f.n + ")"));

  process.exit(0);
})();
