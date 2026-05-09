const logger = require("../utlis/logger");

const notFound = (req, res) => {
  if (res.fail) {
    return res.fail("Route not found", 404);
  }

  return res.status(404).json({ success: false, message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  logger.error("request_error", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    method: req.method,
    url: req.originalUrl
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;

  if (res.fail) {
    return res.fail(message, statusCode);
  }

  return res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
