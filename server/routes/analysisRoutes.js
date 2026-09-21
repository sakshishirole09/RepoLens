const express = require("express");

const router = express.Router();

const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
} = require("../controllers/analysisController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// SAVE ANALYSIS
// POST /api/history
// =====================================================

router.post("/", authMiddleware, saveAnalysis);

// =====================================================
// GET USER'S ANALYSIS HISTORY
// GET /api/history
// =====================================================

router.get("/", authMiddleware, getAnalysisHistory);

// =====================================================
// GET SINGLE ANALYSIS
// GET /api/history/:id
// =====================================================

router.get("/:id", authMiddleware, getAnalysisById);

module.exports = router;
