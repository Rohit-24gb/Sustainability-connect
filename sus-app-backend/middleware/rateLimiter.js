const buckets = new Map();

const rateLimiter = ({ windowMs = 15 * 60 * 1000, limit = 100 } = {}) => {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;

    if (current.count > limit) {
      res.set("Retry-After", Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
      });
    }

    return next();
  };
};

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of buckets.entries()) {
    if (value.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

module.exports = rateLimiter;
