const express = require("express");

const router = express.Router();

const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
} = require("../controllers/analysisController");

const authMiddleware = require("../middleware/authMiddleware");

// SAVE ANALYSIS
router.post("/", authMiddleware, saveAnalysis);

// GET CURRENT USER'S HISTORY
router.get("/", authMiddleware, getAnalysisHistory);

// GET CURRENT USER'S SINGLE ANALYSIS
router.get("/:id", authMiddleware, getAnalysisById);

module.exports = router;
