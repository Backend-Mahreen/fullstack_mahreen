const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ data });
};

const sendError = (res, message, statusCode = 400, errors = null) => {
  const payload = { message };

  if (errors) payload.errors = errors;

  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
