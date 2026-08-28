const { sendSuccess, sendError } = require("../src/utils/response");

describe("sendSuccess", () => {
  it("should send data with default 200 status", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendSuccess(res, { id: 1, name: "Test" });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { id: 1, name: "Test" } });
  });

  it("should send data with custom status code", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendSuccess(res, { id: 1 }, 201);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: { id: 1 } });
  });
});

describe("sendError", () => {
  it("should send error message with default 400 status", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendError(res, "Something went wrong");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });

  it("should send error with custom status code", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendError(res, "Not found", 404);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("should include errors array when provided", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendError(res, "Validation failed", 422, ["Name is required", "Email is invalid"]);

    expect(res.json).toHaveBeenCalledWith({
      message: "Validation failed",
      errors: ["Name is required", "Email is invalid"],
    });
  });

  it("should not include errors key when errors is null", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendError(res, "Error", 500, null);

    expect(res.json).toHaveBeenCalledWith({ message: "Error" });
    expect(res.json.mock.calls[0][0]).not.toHaveProperty("errors");
  });
});
