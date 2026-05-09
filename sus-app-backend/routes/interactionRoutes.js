const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/interactionController");
const {
  authenticate,
  optionalAuthenticate,
  requireRole,
  requireSelfOrRole,
  requireOptionalBodySelfOrRole
} = require("../middleware/auth");
const validate = require("../middleware/validate");
const { interactionSchema } = require("../validators/interactionValidators");

router.post(
  "/",
  optionalAuthenticate,
  validate(interactionSchema),
  requireOptionalBodySelfOrRole("userId", "admin", "seller"),
  interactionController.createInteraction
);
router.get("/summary", authenticate, requireRole("admin", "seller"), interactionController.getInteractionSummary);
router.get("/user/:userId", authenticate, requireSelfOrRole("userId", "admin", "seller"), interactionController.getUserInteractions);

module.exports = router;
