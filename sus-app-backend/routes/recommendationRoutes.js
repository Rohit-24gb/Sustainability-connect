const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const { authenticate, requireSelfOrRole } = require("../middleware/auth");

router.get(
  "/user/:userId",
  authenticate,
  requireSelfOrRole("userId", "admin", "seller"),
  recommendationController.getUserRecommendations
);

router.get("/session/:sessionId", recommendationController.getSessionRecommendations);

module.exports = router;
