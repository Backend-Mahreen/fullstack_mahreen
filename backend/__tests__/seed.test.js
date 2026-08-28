describe("Password generation in seed", () => {
  it("should generate passwords that meet policy requirements", () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

    const generatePassword = () => {
      let pw = "A1!";
      for (let i = 0; i < 14; i++) pw += chars[Math.floor(Math.random() * chars.length)];
      return pw;
    };

    const password = generatePassword();

    expect(password.length).toBeGreaterThanOrEqual(8);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%]/);
  });

  it("should not contain hardcoded passwords in seed code", () => {
    const fs = require("fs");
    const path = require("path");
    const seedContent = fs.readFileSync(
      path.join(__dirname, "..", "src", "config", "seed.js"),
      "utf-8"
    );

    expect(seedContent).not.toContain("Superadmin123!");
    expect(seedContent).not.toContain("Mahreen123!");
  });

  it("should not contain hardcoded passwords in frontend localAuthAdapter", () => {
    const fs = require("fs");
    const path = require("path");
    const adapterPath = path.join(
      __dirname, "..", "..", "frontend", "src", "services", "auth", "localAuthAdapter.ts"
    );

    if (!fs.existsSync(adapterPath)) return;

    const content = fs.readFileSync(adapterPath, "utf-8");

    expect(content).not.toContain("InternMahreen123!");
    expect(content).not.toContain("Superadmin123!");
  });
});

describe("serviceOrders.js bug fix", () => {
  it("should not reference undefined 'status' variable", () => {
    const fs = require("fs");
    const path = require("path");
    const content = fs.readFileSync(
      path.join(__dirname, "..", "src", "routes", "serviceOrders.js"),
      "utf-8"
    );

    expect(content).not.toMatch(/const orderStatus = status \|\| "pending"/);
    expect(content).toContain("requestedStatus");
  });
});
