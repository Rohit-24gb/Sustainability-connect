const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid authentication token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token" });
  }
};

const optionalAuthenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-password");

    if (user) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "You do not have permission for this action" });
  }

  next();
};

const requireSelfOrRole = (paramName, ...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication token is required" });
  }

  if (roles.includes(req.user.role) || req.user._id.toString() === req.params[paramName]) {
    return next();
  }

  return res.status(403).json({ success: false, message: "You do not have permission for this action" });
};

const requireBodySelfOrRole = (fieldName, ...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication token is required" });
  }

  if (roles.includes(req.user.role) || req.user._id.toString() === req.body[fieldName]) {
    return next();
  }

  return res.status(403).json({ success: false, message: "You do not have permission for this action" });
};

const requireOptionalBodySelfOrRole = (fieldName, ...roles) => (req, res, next) => {
  const value = req.body[fieldName];

  if (!value) {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication token is required when userId is provided" });
  }

  if (roles.includes(req.user.role) || req.user._id.toString() === value) {
    return next();
  }

  return res.status(403).json({ success: false, message: "You do not have permission for this action" });
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireRole,
  requireSelfOrRole,
  requireBodySelfOrRole,
  requireOptionalBodySelfOrRole
};
