const express = require("express");

const router = express.Router();

const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
} = require("../controllers/analysisController");

const { protect } = require("../middleware/authMiddleware");

router.post("/save", protect, saveAnalysis);

router.get("/history", protect, getAnalysisHistory);

router.get("/:id", protect, getAnalysisById);

module.exports = router;
