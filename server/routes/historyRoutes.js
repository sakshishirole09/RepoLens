const express = require("express");

const router = express.Router();

const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
} = require("../controllers/analysisController");

const authMiddleware = require("../middleware/authMiddleware");

// Save analysis
router.post("/", authMiddleware, saveAnalysis);

// Get only logged-in user's history
router.get("/", authMiddleware, getAnalysisHistory);

// Get one analysis
// Only if it belongs to logged-in user
router.get("/:id", authMiddleware, getAnalysisById);

module.exports = router;
