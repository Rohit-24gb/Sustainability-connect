const express = require("express");
const router = express.Router();
const adminAnalyticsController = require("../controllers/adminAnalyticsController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get(
  "/overview",
  authenticate,
  requireRole("admin", "seller"),
  adminAnalyticsController.getOverview
);

module.exports = router;
