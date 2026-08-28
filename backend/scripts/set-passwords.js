require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const { initDatabase, runExecute } = require("../src/config/database");

const emails = [
  "superadmin@mahreen.id",
  "admin@mahreen.id",
  "client@mahreen.id",
  "intern@mahreen.id",
];

const run = async () => {
  try {
    await initDatabase();
    const hash = bcrypt.hashSync("Superadmin123!", 10);
    for (const email of emails) {
      await runExecute("UPDATE users SET password = ? WHERE email = ?", [hash, email]);
      console.log(`Password updated: ${email}`);
    }
    console.log("Done. All accounts now use password: Superadmin123!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

run();
