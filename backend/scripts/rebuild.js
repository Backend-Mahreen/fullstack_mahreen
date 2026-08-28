require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { initDatabase } = require("../src/config/database");
const { seedDatabase } = require("../src/config/seed");

const run = async () => {
  try {
    await initDatabase();
    console.log("Tables created successfully.");
    await seedDatabase();
    console.log("Seed data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

run();
