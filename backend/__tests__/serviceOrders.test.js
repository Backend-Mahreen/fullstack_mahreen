const express = require("express");
const request = require("supertest");

jest.mock("../src/config/database", () => ({
  runExecute: jest.fn().mockResolvedValue({ insertId: 1 }),
  runSingle: jest.fn().mockResolvedValue(null),
}));

jest.mock("../src/middleware/rateLimit", () => ({
  publicFormLimiter: (req, res, next) => next(),
}));

jest.mock("../src/utils/logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}));

const serviceOrdersRouter = require("../src/routes/serviceOrders");

const app = express();
app.use(express.json());
app.use("/api/service-orders", serviceOrdersRouter);

const CSRF_HEADER = { "x-requested-with": "XMLHttpRequest" };

describe("POST /api/service-orders", () => {
  const validBody = {
    selection: { serviceKey: "website", tier: { name: "Best" }, addOns: [] },
    billingInformation: { fullName: "Budi Santoso" },
    total: 5000000,
  };

  it("should return 403 without CSRF header", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .send(validBody);

    expect(res.status).toBe(403);
  });

  it("should create order with default status when status not provided", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("pending");
    expect(res.body.data.transactionId).toBeDefined();
    expect(res.body.data.invoiceId).toMatch(/^INV-/);
  });

  it("should use provided status when explicitly set", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send({ ...validBody, status: "in_progress" });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("in_progress");
  });

  it("should return 400 when selection is missing", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send({ billingInformation: { fullName: "Budi" }, total: 100 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("serviceKey");
  });

  it("should return 400 when fullName is missing", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send({ selection: { serviceKey: "website" }, total: 100 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("fullName");
  });

  it("should return 400 when total is zero or negative", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send({ ...validBody, total: 0 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("positif");
  });

  it("should return 400 when total exceeds maximum", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send({ ...validBody, total: 2000000000 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("batas maksimal");
  });

  it("should handle selection with category instead of serviceKey", async () => {
    const res = await request(app)
      .post("/api/service-orders")
      .set(CSRF_HEADER)
      .send({
        selection: { category: "branding" },
        billingInformation: { fullName: "Sari" },
        total: 3000000,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("pending");
  });
});
