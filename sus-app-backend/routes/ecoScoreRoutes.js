const express = require("express");
const router = express.Router();
const ecoScoreController = require("../controllers/ecoScoreController");
const { authenticate, requireRole } = require("../middleware/auth");

const adminOnly = [authenticate, requireRole("admin", "seller")];

router.post("/product", ecoScoreController.previewEcoScore);
router.put("/products/:id", adminOnly, ecoScoreController.updateProductEcoScore);
router.post("/recalculate", adminOnly, ecoScoreController.recalculateAllEcoScores);

module.exports = router;
