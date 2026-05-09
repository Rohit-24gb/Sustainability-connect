const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const parseDurationMs = (value, fallbackMs) => {
  if (!value) return fallbackMs;

  const match = String(value).trim().match(/^(\d+)(ms|s|m|h|d)?$/);
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = match[2] || "ms";
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
};

const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

const getRefreshExpiry = () => {
  const ms = parseDurationMs(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60 * 1000);
  return new Date(Date.now() + ms);
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  getRefreshExpiry,
  hashToken
};
