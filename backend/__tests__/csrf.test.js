const { requireNonEmptyHeader } = require("../src/middleware/csrf");

describe("CSRF middleware", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 403 when X-Requested-With header is missing", () => {
    const mockReq = { headers: {} };

    requireNonEmptyHeader(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next when X-Requested-With header is present", () => {
    const mockReq = { headers: { "x-requested-with": "XMLHttpRequest" } };

    requireNonEmptyHeader(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
